import { Component, Input, ViewChild, SimpleChanges, ElementRef } from '@angular/core';
import { Select2OptionData, Select2Component } from 'ng2-select2';
import { FormGroup, FormBuilder } from '@angular/forms';
import { VendorServices } from 'src/app/commonServices/TransactionMaster/vendoer-master.services';
import { GlobalService } from 'src/app/commonServices/global.service';
import { DependencyCheck } from 'src/app/shared/validators/dependencyCheck';
import { UIConstant } from 'src/app/shared/constants/ui-constant';
import { filter, map } from 'rxjs/operators';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs';
import { Subscription } from 'rxjs/Subscription';
import { AddCust } from '../../../../model/sales-tracker.model';
import { CommonService } from '../../../../commonServices/commanmaster/common.services';
import { Settings } from '../../../../shared/constants/settings.constant';
import { SaleTravelServices } from '../../sale-travel.services';
declare const $: any
declare const flatpickr: any
@Component({
  selector: 'app-sales-search',
  templateUrl: './sales-search.component.html',
  styleUrls: ['./sales-search.component.css']
})
export class SalesSearchComponent {
  @Input() toShow: boolean = false

  ledgerListSelect2: Array<Select2OptionData> = [] 
  billStatusListSelect2: Array<Select2OptionData> = []
  ledgerValue: number = 0
  billStatusValue: number = 0

  LedgerId: number = 0
  BillStatus: number = 0
  newCustAddSub: Subscription
  @ViewChild('fromdate') fromdate: ElementRef
  ngOnChanges (changes: SimpleChanges): void {
    if (changes.toShow && changes.toShow.currentValue) {
      setTimeout(() => {
        const element = this.fromdate.nativeElement
        element.focus({ preventScroll: false })
      }, 10)
    }
  }
  searchForm: FormGroup
  @ViewChild('parcelby_select2') parcelbySelect2: Select2Component
  @ViewChild('dest_select2') destSelect2: Select2Component
  @ViewChild('sender_select2') senderSelect2: Select2Component
  @ViewChild('reciever_select2') recieverSelect2: Select2Component
  @ViewChild('billstatus_select2') billstatusSelect2: Select2Component
  constructor (private formBuilder: FormBuilder, private _ledgerServices: VendorServices,
    private settings: Settings, private gs: GlobalService, private commonService: CommonService,
    private saleService: SaleTravelServices) {}
  ngOnInit () {
    this.newCustAddSub = this.commonService.getCustStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.ledgerListSelect2)
          newData.push({ id: data.id, text: data.name })
          this.ledgerListSelect2 = newData
        }
      }
    )
    this.billStatusListSelect2 = [
      { id: '0', text: 'Select Bill Status' },
      { id: '-1', text: 'Cancel' },
      { id: '1', text: 'Running' },
      { id: '2', text: 'Return' }
    ]
    this.createForm()
    this.setFromDate()
    this.setToDate()
    this.getLedgerList()
  }

  createForm () {
    this.searchForm = this.formBuilder.group({
      'FromDate': [''],
      'ToDate': [''],
      'FromAmount': [''],
      'ToAmount': ['']
    },
    {
      validator: [DependencyCheck('FromDate', 'ToDate', 'date'), DependencyCheck('FromAmount', 'ToAmount', 'amount')]
    })
  }
  get f() { return this.searchForm.controls; }
  getLedgerList () {
    let newData = [{ id: '0', text: 'Select Party' }]
    this._ledgerServices.getVendor(5, '').pipe(
      filter(data => {
        if (data.Code === UIConstant.THOUSAND) {
          return data.Data
        } else {
          throw new Error (data.Description)
        }
      }),
      catchError(error => {
        return throwError(error)
      }),
      map(data => data.Data),
      map(data => {
        if (data.length > 0) {
          data.forEach(element => {
            newData.push({
              id: element.Id,
              text: element.Name
            })
          })
        }
        return newData
      })
    ).subscribe(data => {
      console.log('Party data : ', data)
      this.saleService.setLedgerList([...data])
      this.ledgerListSelect2 = Object.assign([], data)
      }
    )
  }
  
  setFromDate () {
    let _self = this
    jQuery(function ($) {
      flatpickr('#from-date', {
        dateFormat: _self.settings.dateFormat
      })
    })
  }

  setToDate () {
    let _self = this
    jQuery(function ($) {
      flatpickr('#to-date', {
        dateFormat: _self.settings.dateFormat
      })
    })
  }

  search () {
    if (this.searchForm.valid) {
      let fromDate = ''
      let toDate = ''
      if (!this.LedgerId) {
        this.LedgerId = 0
      }
      if (!this.BillStatus) {
        this.BillStatus = 0
      }
      if (!this.searchForm.value.FromDate) {
        fromDate = ''
      } else {
        fromDate = JSON.parse(JSON.stringify(this.gs.clientToSqlDateFormat(this.searchForm.value.FromDate, this.settings.dateFormat)))
      }
      if (!this.searchForm.value.ToDate) {
        toDate = ''
      } else {
        toDate = JSON.parse(JSON.stringify(this.gs.clientToSqlDateFormat(this.searchForm.value.ToDate, this.settings.dateFormat)))
      }
      if (!this.searchForm.value.ToDate) {
        this.searchForm.value.ToDate = ''
      }
      if (!this.searchForm.value.FromAmount) {
        this.searchForm.value.FromAmount = 0
      }
      if (!this.searchForm.value.ToAmount) {
        this.searchForm.value.ToAmount = 0
      }
      const queryStr =
      '&BillStatus=' + +this.BillStatus +
       '&FromDate=' + fromDate + 
       '&ToDate=' + toDate + 
       '&FromAmount=' + +this.searchForm.value.FromAmount + 
       '&ToAmount=' + +this.searchForm.value.ToAmount + 
       '&LedgerId=' + this.LedgerId
      this.saleService.setSearchQueryParamsStr(queryStr)
    }
  }

  resetSearch () {
    this.LedgerId = 0
    this.BillStatus = 0
    this.ledgerValue = 0
    this.billStatusValue = 0

    this.LedgerId = 0
    this.searchForm.reset()
    if (this.parcelbySelect2) {
      this.parcelbySelect2.setElementValue(0)
    }
    if (this.destSelect2) {
      this.destSelect2.setElementValue(0)
    }
    if (this.senderSelect2) {
      this.senderSelect2.setElementValue(0)
    }
    if (this.recieverSelect2) {
      this.recieverSelect2.setElementValue(0)
    }
    if (this.billstatusSelect2) {
      this.billstatusSelect2.setElementValue(0)
    }

    const queryStr = 
    '&BillStatus=' + this.BillStatus +
    '&FromDate=' + '' + 
    '&ToDate=' + '' + 
    '&FromAmount=' + 0 + 
    '&ToAmount=' + 0 + 
    '&LedgerId=' + this.LedgerId
    this.saleService.setSearchQueryParamsStr(queryStr)
  }
}
