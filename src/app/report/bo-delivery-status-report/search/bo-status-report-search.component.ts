import { Component, ViewChild, Input, SimpleChanges } from '@angular/core';
import { DependencyCheck } from '../../../shared/validators/dependencyCheck';
import { VendorServices } from '../../../commonServices/TransactionMaster/vendoer-master.services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalService } from '../../../commonServices/global.service';
import { ToastrCustomService } from '../../../commonServices/toastr.service';
import { Select2Component } from 'ng2-select2';
import { Settings } from '../../../shared/constants/settings.constant';
import { PackedOrdersService } from '../../packed-orders-report/packed-orders.service';
import { ManufacturingService } from '../../../Manufacturer/manufacturing.service';
import { PackagingService } from '../../../Manufacturer/packaging/packaging.service';
import { DatepickerComponent } from '../../../shared/datepicker/datepicker.component';
declare const $: any;
@Component({
  selector: 'bo-status-report-search',
  templateUrl: './bo-status-report-search.component.html'
})
export class BOStatusSearchComponent {
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

  constructor (private formBuilder: FormBuilder, private _ledgerServices: VendorServices,
    private settings: Settings, private gs: GlobalService, private _ps: PackagingService,
    private _ms: ManufacturingService, private _ts: ToastrCustomService, private _po: PackedOrdersService) {}
  
  ngOnInit () {
    this.createForm()
    this.getBOList()
    this.getLedgerList()
    this.getItems()
  }

  createForm () {
    this.searchForm = this.formBuilder.group({
      'FromDate': [''],
      'ToDate': [''],
      'StrSearch': [''],
      'DateType': [1],
      'LedgerId': [''],
      'ItemId': [''],
      'Id': ['']
    },
    {
      validator: [DependencyCheck('FromDate', 'ToDate', 'date')]
    })
  }

  buyerOrderData: any = []
  getBOList() {
    let newData = [{ id: '0', text: 'Select Buyer Order' }]
    this._ps.getBOTransList().subscribe((data) => {
      console.log('bo data : ', data)
      if (data.length > 0) {
        data.forEach(element => {
          newData.push({
            id: element.Id,
            text: element.BuyerName
          })
        })
      }
      this.buyerOrderData = Object.assign([], newData)
    },
    (error) => {
      this._ts.showError(error, '')
    })
  }

  ledgerData: any = []
  getLedgerList () {
    let newData = [{ id: '0', text: 'Select Ledger' }]
    this.gs.manipulateResponse(this._ledgerServices.getVendor(5, '')).subscribe(data => {
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
      console.log('ledger data', this.ledgerData)
    },
    (error) => {
      this._ts.showError(error, '')
    })
  }

  itemData: any = []
  getItems () {
    let newData = [{ id: '0', text: 'Select Item' }]
    this._po.getItems().subscribe(data => {
      // console.log('ledger data : ', data)
      if (data.length > 0) {
        data.forEach(element => {
          newData.push({
            id: element.Id,
            text: element.Name
          })
        })
      }
      this.itemData = Object.assign([], newData)
      console.log('item data', this.itemData)
    },
    (error) => {
      this._ts.showError(error, '')
    })
  }


  get f() { return this.searchForm.controls; }

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
        '&StrSearch=' + this.searchForm.value.StrSearch +
        '&DateType=' + this.searchForm.value.DateType +
        '&FromDate=' + fromDate + 
        '&ToDate=' + toDate + 
        '&Id=' + this.searchForm.value.Id +
        '&ItemId=' + this.searchForm.value.ItemId +
        '&LedgerId=' + this.searchForm.value.LedgerId
      this._ms.setSearchQueryParamsStr(queryStr)
    }
  }

  @ViewChild('item_select2') itemSelect2: Select2Component
  @ViewChild('ledger_select2') ledgerSelect2: Select2Component
  @ViewChild('bo_select2') boSelect2: Select2Component
  resetSearch () {
    this.searchForm.reset()
    this.searchForm.controls.FromDate.setValue('')
    this.searchForm.controls.ToDate.setValue('')
    if (this.itemSelect2) {
      this.itemSelect2.setElementValue(0)
    }
    if (this.ledgerSelect2) {
      this.ledgerSelect2.setElementValue(0)
    }
    if (this.boSelect2) {
      this.boSelect2.setElementValue(0)
    }
    this.setValue(1)
    const queryStr =
    '&StrSearch=' + '' +
    '&DateType=' + 1 +
    '&FromDate=' + '' +
    '&ToDate=' + '' +
    '&Id=' + 0 +
    '&LedgerId=' + 0 +
    '&ItemId=' + 0
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

  setBOID (evt) {
    this.searchForm.controls.Id.setValue(evt.value)
  }

  setledgerId (evt) {
    this.searchForm.controls.LedgerId.setValue(evt.value)
  }

  setItemId (evt) {
    this.searchForm.controls.ItemId.setValue(evt.value)
  }

  setValue (value) {
    this.searchForm.controls.DateType.setValue(value)
  }
}