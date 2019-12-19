import { Component, ViewChild, SimpleChanges, Input } from '@angular/core';
import { DependencyCheck } from '../../../shared/validators/dependencyCheck';
import { VendorServices } from '../../../commonServices/TransactionMaster/vendoer-master.services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalService } from '../../../commonServices/global.service';
import { ToastrCustomService } from '../../../commonServices/toastr.service';
import { Select2OptionData, Select2Component } from 'ng2-select2';
import { DatepickerComponent } from '../../../shared/datepicker/datepicker.component';
import { Settings } from '../../../shared/constants/settings.constant';
import { PackedOrdersService } from '../../packed-orders-report/packed-orders.service';
import { ManufacturingService } from '../../../Manufacturer/manufacturing.service';
@Component({
  selector: 'item-vendor-rate-search',
  templateUrl: './item-vendor-rate-search.component.html'
})
export class VendorRateSearchComponent {
  ledgerData: Array<Select2OptionData> = []
  ledgerValue: number = 0
  itemData: Array<Select2OptionData> = []
  itemValue: number = 0

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
    private gs: GlobalService, private _ts: ToastrCustomService, private _po: PackedOrdersService, 
    private _ms: ManufacturingService) {}
  @ViewChild('ledger_select2') ledgerSelect2: Select2Component
  ngOnInit () {
    this.createForm()
    this.getLedgerList()
    this.getItems()
  }

  createForm () {
    this.searchForm = this.formBuilder.group({
      'FromDate': [''],
      'ToDate': [''],
      'LedgerId': [''],
      'ItemId': [''],
      "Type": ['BO'],
      "ReqNo": ['']
    },
    {
      validator: [DependencyCheck('FromDate', 'ToDate', 'date')]
    })
  }
  get f() { return this.searchForm.controls; }

  getLedgerList () {
    let newData = [{ id: '0', text: 'Select Ledger' }]
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

  getItems () {
    let newData = [{ id: '0', text: 'Select Items' }]
    this._po.getItems().subscribe(data => {
      console.log('ledger data : ', data)
      if (data.length > 0) {
        data.forEach(element => {
          newData.push({
            id: element.Id,
            text: element.Name
          })
        })
      }
      this.itemData = Object.assign([], newData)
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
        '&FromDate=' + fromDate + 
        '&ToDate=' + toDate + 
        '&LedgerId=' + this.searchForm.value.LedgerId +
        '&ItemId=' + this.searchForm.value.ItemId +
        '&Type=' + this.searchForm.value.Type + 
        "&ReqNo=" + this.searchForm.value.ReqNo
      this._ms.setSearchQueryParamsStr(queryStr)
    }
  }

  @ViewChild('item_select2') itemSelect2: Select2Component
  resetSearch () {
    this.searchForm.reset()
    this.searchForm.controls.FromDate.setValue('')
    this.searchForm.controls.ToDate.setValue('')
    if (this.ledgerSelect2) {
      this.ledgerSelect2.setElementValue(0)
    }
    if (this.itemSelect2) {
      this.itemSelect2.setElementValue(0)
    }
    this.setValue('BO')
    const queryStr =
    '&FromDate=' + '' + 
    '&ToDate=' + '' + 
    '&LedgerId=' + '' +
    '&ItemId=' + '' +
    '&Type=' + 'BO' + 
    "&ReqNo=" + ''
   this._ms.setSearchQueryParamsStr(queryStr)
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
    this.searchForm.controls.LedgerId.setValue(+evt.value)
  }

  setItemId (evt) {
    this.searchForm.controls.ItemId.setValue(+evt.value)
  }

  setValue (value) {
    this.searchForm.controls.Type.setValue(value)
  }
}