import { Component, ViewChild, SimpleChanges, Input } from '@angular/core';
import { VendorServices } from '../../../commonServices/TransactionMaster/vendoer-master.services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Select2OptionData, Select2Component } from 'ng2-select2';
import { Settings } from '../../../shared/constants/settings.constant';
import { DatepickerComponent } from '../../../shared/datepicker/datepicker.component';
import { PackagingService } from '../../packaging/packaging.service';
import { GlobalService } from '../../../commonServices/global.service';
import { ToastrCustomService } from '../../../commonServices/toastr.service';
import { DependencyCheck } from '../../../shared/validators/dependencyCheck';
import { BuyerOrderService } from '../buyer-order.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'buyer-order-search',
  templateUrl: './buyer-order-search.component.html'
})
export class BuyerOrderSearchSearchComponent {
  ledgerData: Array<Select2OptionData> = []
  ledgerValue: number = 0
  statusValue:any
  Type: number = 0
  statusList: Array<Select2OptionData> = []
  isValid: boolean = true
  destroy$: Subscription[] = []
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
    private _ps: PackagingService, private gs: GlobalService, private _ts: ToastrCustomService,
    private _bo: BuyerOrderService) {}
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
      'LedgerId': [''],
      'Status': ['']
    },
    {
      validator: [DependencyCheck('FromDate', 'ToDate', 'date')]
    })
  }
  get f() { return this.searchForm.controls; }

  getStatusList () {
    let newData = [{ id: '0', text: 'Select Status' }]
    this.destroy$.push(this._bo.getStatusList().subscribe(data => {
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
    }))
  }

  getLedgerList () {
    let newData = [{ id: '0', text: 'Select Buyer' }]
    this.destroy$.push(this.gs.manipulateResponse(this._ledgerServices.getVendor(5, '')).subscribe(data => {
      // console.log('ledger data : ', data)
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
    }))
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
        '&FromDate=' + fromDate + 
        '&ToDate=' + toDate + 
        '&LedgerId=' + this.searchForm.value.LedgerId +
        '&Status=' + this.searchForm.value.Status
      this._bo.setSearchQueryParamsStr(queryStr)
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
    '&FromDate=' + '' + 
    '&ToDate=' + '' + 
    '&Status=' + '' +
    '&LedgerId=' + ''
   this._bo.setSearchQueryParamsStr(queryStr)
  }

  setToDate (evt) {
    this.searchForm.controls.ToDate.setValue(evt)
    if (this.searchForm.value.FromDate && this.searchForm.value.ToDate) {
      if (!this.gs.compareDate(this.searchForm.value.ToDate, this.searchForm.value.FromDate)) {
        this.searchForm.controls.ToDate.setValue('')
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
    this.searchForm.controls.LedgerId.setValue(evt.value)
  }

  setStatus (evt) {
    this.searchForm.controls.Status.setValue(evt.value)
  }

  ngOnDestroy () {
    if (this.destroy$ && this.destroy$.length > 0) {
      this.destroy$.forEach((element) => element.unsubscribe())
    }
  }
}