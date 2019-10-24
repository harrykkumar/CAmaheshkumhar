import { Component, ViewChild, SimpleChanges, Input } from '@angular/core';
import { DependencyCheck } from '../../../shared/validators/dependencyCheck';
import { VendorServices } from '../../../commonServices/TransactionMaster/vendoer-master.services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalService } from '../../../commonServices/global.service';
import { PackagingService } from '../packaging.service';
import { ToastrCustomService } from '../../../commonServices/toastr.service';
import { Select2OptionData, Select2Component } from 'ng2-select2';
import { DatepickerComponent } from '../../../shared/datepicker/datepicker.component';
import { Settings } from '../../../shared/constants/settings.constant';

@Component({
  selector: 'packaging-search',
  templateUrl: './packaging-search.component.html'
})
export class PackagingSearchComponent {
  ledgerData: Array<Select2OptionData> = []
  ledgerValue: number = 0
  statusValue:any
  Type: number = 0
  statusList: Array<Select2OptionData> = []
  isValid: boolean = true
  @ViewChild('first') first: DatepickerComponent
  ngOnChanges (changes: SimpleChanges): void {
    if (changes.toShow && changes.toShow.currentValue) {
      setTimeout(() => {
        this.first.toggleView()
      }, 10)
    }
  }
  @Input() toShow: boolean = false
  searchForm: FormGroup

  constructor (private formBuilder: FormBuilder, private _ledgerServices: VendorServices, private settings: Settings,
    private _ps: PackagingService, private gs: GlobalService, private _ts: ToastrCustomService) {}
  @ViewChild('ledger_select2') ledgerSelect2: Select2Component
  ngOnInit () {
    this.createForm()
    this.getStatusList()
    this.getLedgerList()
  }

  createForm () {
    this.searchForm = this.formBuilder.group({
      'FromDate': [''],
      'ToDate': [''],
      'StrSearch': [''],
      'DateType': [1],
      'BuyerOrderId': [''],
      'Status': ['']
    },
    {
      validator: [DependencyCheck('FromDate', 'ToDate', 'date')]
    })
  }
  get f() { return this.searchForm.controls; }

  getStatusList () {
    let newData = [{ id: '0', text: 'Select Status' }]
    this._ps.getStatusList().subscribe(data => {
      if (data.length > 0) {
        data.forEach(element => {
          newData.push({
            id: element.UId,
            text: element.CommonDesc
          })
        })
      }
      console.log('newData : ', newData)
      this.statusList = Object.assign([], newData)
    },
    (error) => {
      this._ts.showError(error, '')
    })
  }

  getLedgerList () {
    let newData = [{ id: '0', text: 'Select Buyer' }]
    this.gs.manipulateResponse(this._ledgerServices.getVendor(5, '')).subscribe(data => {
      console.log('ledger data : ', data)
      if (data.length > 0) {
        data.forEach(element => {
          newData.push({
            id: element.Id,
            text: element.Name
          })
        })
      }
      this.ledgerData = Object.assign([], newData)
    },
    (error) => {
      this._ts.showError(error, '')
    })
  }

  search () {
    if (this.searchForm.valid) {
      let fromDate = ''
      let toDate = ''
      if (!this.searchForm.value.FromDate) {
        fromDate = ''
      } else {
        fromDate = JSON.parse(JSON.stringify(this.gs.clientToSqlDateFormat(this.searchForm.value.FromDate, this.settings.dateFormat)))
      }
      if (!this.searchForm.value.ToDate) {
        toDate = ''
      } else {
        toDate = JSON.parse(JSON.stringify(this.gs.clientToSqlDateFormat(this.searchForm.value.ToDate,
        this.settings.dateFormat)))
      }
      if (!this.searchForm.value.ToDate) {
        this.searchForm.value.ToDate = ''
      }
      const queryStr = 
        'StrSearch=' + this.searchForm.value.StrSearch +
        '&DateType=' + this.searchForm.value.DateType +
        '&FromDate=' + fromDate + 
        '&ToDate=' + toDate + 
        '&BuyerOrderId=' + this.searchForm.value.BuyerOrderId +
        '&Status=' + this.searchForm.value.Status
      this._ps.setSearchQueryParamsStr(queryStr)
    }
  }

  @ViewChild('status_select2') statusSelect2: Select2Component
  resetSearch () {
    this.searchForm.reset()
    this.searchForm.controls.FromDate.setValue('')
    this.searchForm.controls.ToDate.setValue('')
    if (this.ledgerSelect2) {
      this.ledgerSelect2.setElementValue(0)
    }
    if (this.statusSelect2) {
      this.statusSelect2.setElementValue(0)
    }
    const queryStr =
    'FromDate=' + '' + 
    '&ToDate=' + '' + 
    '&Status=' + '' +
    '&VoucherType=' + 0 + 
    '&DateType=' + 1 +
    '&BuyerOrderId=' + ''
    '&StrSearch=' + ''
   this._ps.setSearchQueryParamsStr(queryStr)
  }

  setToDate (evt) {
    this.searchForm.controls.ToDate.setValue(evt)
    if (this.searchForm.value.FromDate && this.searchForm.value.ToDate) {
      if (!this.gs.compareDate(this.searchForm.value.ToDate, this.searchForm.value.FromDate)) {
        this.searchForm.controls.ToDate.setValue('')
        // console.log(this.searchForm.value.ToDate)
        //this.searchForm.value.FromDate
      }
    }
  }

  setFromDate (evt) {
    this.searchForm.controls.FromDate.setValue(evt)
    if (this.searchForm.value.FromDate && this.searchForm.value.ToDate) {
      if (!this.gs.compareDate(this.searchForm.value.ToDate, this.searchForm.value.FromDate)) {
        this.searchForm.controls.ToDate.setValue(evt)
      }
    } else {
      this.searchForm.controls.ToDate.setValue(evt)
    }
  }

  setBuyerId (evt) {
    this.searchForm.controls.BuyerOrderId.setValue(evt.value)
  }

  setStatus (evt) {
    this.searchForm.controls.Status.setValue(evt.value)
  }

  setValue (value) {
    this.searchForm.controls.DateType.setValue(value)
  }
}