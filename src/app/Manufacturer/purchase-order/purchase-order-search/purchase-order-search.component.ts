import { Component, ViewChild, SimpleChanges, Input } from '@angular/core';
import { VendorServices } from '../../../commonServices/TransactionMaster/vendoer-master.services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Select2Component } from 'ng2-select2';
import { Settings } from '../../../shared/constants/settings.constant';
import { PurchaseOrderService } from '../purchase-order.service';
import { DatepickerComponent } from '../../../shared/datepicker/datepicker.component';
import { ToastrCustomService } from '../../../commonServices/toastr.service';
import { GlobalService } from '../../../commonServices/global.service';
import { DependencyCheck } from '../../../shared/validators/dependencyCheck';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'purchase-order-search',
  templateUrl: './purchase-order-search.component.html'
})
export class PurchaseOrderSearchSearchComponent {
  masterData: any = {}
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
    private gs: GlobalService, private _ts: ToastrCustomService,
    private _po: PurchaseOrderService) {}
  @ViewChild('ledger_select2') ledgerSelect2: Select2Component
  ngOnInit () {
    this.createForm()
    this.getStatusList()
    this.getLedgerList()
    this.getBuyerOrderList()
  }

  createForm () {
    this.searchForm = this.formBuilder.group({
      'FromDate': [''],
      'ToDate': [''],
      'LedgerId': [''],
      'Status': [''],
      'ParentId': ['']
    },
    {
      validator: [DependencyCheck('FromDate', 'ToDate', 'date')]
    })
  }
  get f() { return this.searchForm.controls; }

  getStatusList () {
    let newData = [{ id: '0', text: 'Select Status' }]
    this.destroy$.push(this._po.getStatusList().subscribe(data => {
      if (data.length > 0) {
        data.forEach(element => {
          newData.push({
            id: element.UId,
            text: element.CommonDesc
          })
        })
      }
      console.log('newData : ', newData)
      this.masterData.statusList = Object.assign([], newData)
    },
    (error) => {
      this._ts.showError(error, '')
    }))
  }

  getLedgerList () {
    let newData = [{ id: '0', text: 'Select Vendor' }]
    this.destroy$.push(this.gs.manipulateResponse(this._ledgerServices.getVendor(4, '')).subscribe(data => {
      console.log('ledger data : ', data)
      if (data.length > 0) {
        data.forEach(element => {
          newData.push({
            id: element.Id,
            text: element.Name
          })
        })
      }
      this.masterData.vendorData = Object.assign([], newData)
    },
    (error) => {
      this._ts.showError(error, '')
    }))
  }

  getBuyerOrderList () {
    let newData = [{ id: '0', text: 'Select Order' }]
    this.destroy$.push(this._po.getBuyerOrderList().subscribe(data => {
      console.log('buyero order data : ', data)
      if (data.length > 0) {
        data.forEach(element => {
          newData.push({
            id: element.Id,
            text: element.BuyerName
          })
        })
      }
      this.masterData.buyerorderList = Object.assign([], newData)
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
        '&Status=' + this.searchForm.value.Status + 
        '&ParentId=' + this.searchForm.value.ParentId
      this._po.setSearchQueryParamsStr(queryStr)
    }
  }

  @ViewChild('status_select2') statusSelect2: Select2Component
  @ViewChild('bo_select2') boSelect2: Select2Component
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
    if (this.boSelect2) {
      this.boSelect2.setElementValue(0)
    }
    const queryStr =
    '&FromDate=' + '' + 
    '&ToDate=' + '' + 
    '&Status=' + '' +
    '&LedgerId=' + '' + 
    '&ParentId=' + ''
   this._po.setSearchQueryParamsStr(queryStr)
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

  setLedgerId (evt) {
    this.searchForm.controls.LedgerId.setValue(evt.value)
  }

  setStatus (evt) {
    this.searchForm.controls.Status.setValue(evt.value)
  }

  setOrder(evt) {
    this.searchForm.controls.ParentId.setValue(evt.value)
  }

  ngOnDestroy() {
    if (this.destroy$ && this.destroy$.length > 0) {
      this.destroy$.forEach((element) => element.unsubscribe())
    }
  }
}