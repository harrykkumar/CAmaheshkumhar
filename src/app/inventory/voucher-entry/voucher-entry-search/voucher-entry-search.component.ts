import { Component, Input, ViewChild, SimpleChanges, ElementRef } from "@angular/core";
import { Select2OptionData, Select2Component } from "ng2-select2";
import { FormGroup, FormBuilder } from "@angular/forms";
import { VendorServices } from "src/app/commonServices/TransactionMaster/vendoer-master.services";
import { GlobalService } from "src/app/commonServices/global.service";
import { DependencyCheck } from "src/app/shared/validators/dependencyCheck";
import { UIConstant } from "src/app/shared/constants/ui-constant";
import { VoucherEntryServie } from '../voucher-entry.service';
import { Settings } from '../../../shared/constants/settings.constant';
declare const flatpickr: any
@Component({
  selector: 'voucher-entry-search',
  templateUrl: './voucher-entry-search.component.html'
})
export class VoucherEntrySearchComponent {
  ledgerData: Array<Select2OptionData> = []
  ledgerValue: number = 0
  LedgerId: number = 0
  voucherValue:any
  voucherTypeValue: number = 0
  Type: number = 0
  voucherTypeData: Array<Select2OptionData> = []
  isValid: boolean = true
  @ViewChild('first') first: ElementRef
  ngOnChanges (changes: SimpleChanges): void {
    if (changes.toShow && changes.toShow.currentValue) {
      setTimeout(() => {
        const element = this.first.nativeElement
        element.focus({ preventScroll: false })
      }, 10)
    }
  }
  @Input() toShow: boolean = false
  searchForm: FormGroup

  constructor (private formBuilder: FormBuilder, private _ledgerServices: VendorServices,
    private settings: Settings, private voucherEntryServie: VoucherEntryServie, private gs: GlobalService) {}
  @ViewChild('ledger_select2') ledgerSelect2: Select2Component
  ngOnInit () {
    this.createForm()
    this.setFromDate()
    this.setToDate()
    this.getVoucherTypeList()
    this.getLedgerList()
  }

  createForm () {
    this.searchForm = this.formBuilder.group({
      'FromDate': [''],
      'ToDate': ['']
    },
    {
      validator: [DependencyCheck('FromDate', 'ToDate', 'date')]
    })
  }
  get f() { return this.searchForm.controls; }

  getVoucherTypeList () {
    let newData = [{ id: '0', text: 'Select Type' }]
    this.voucherEntryServie.getVoucherTypeList().subscribe(data => {
      console.log('ledger data : ', data)
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        if (data.Data.length > 0) {
          data.Data.forEach(element => {
            newData.push({
              id: element.Id,
              text: element.Name
            })
          })
        }
        this.voucherTypeData = Object.assign([], newData)
      }
    })
  }

  getLedgerList () {
    let newData = [{ id: '0', text: 'Select Ledger' }]
    this._ledgerServices.getVendor('', '').subscribe(data => {
      console.log('ledger data : ', data)
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        if (data.Data.length > 0) {
          data.Data.forEach(element => {
            newData.push({
              id: element.Id,
              text: element.Name
            })
          })
        }
        this.ledgerData = Object.assign([], newData)
      }
    })
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
      const queryStr = '&Type=' + this.Type +
       '&FromDate=' + fromDate + 
       '&ToDate=' + toDate + 
       '&LedgerId=' + this.LedgerId
      this.voucherEntryServie.setSearchQueryParamsStr(queryStr)
    }
  }

  @ViewChild('vouchertype_select2') vouchertypeselect2: Select2Component
  resetSearch () {
    this.ledgerValue = 0
    this.LedgerId = 0
    this.searchForm.reset()
    if (this.ledgerSelect2) {
      this.ledgerSelect2.setElementValue(0)
    }
    if (this.vouchertypeselect2) {
      this.vouchertypeselect2.setElementValue(0)
    }
    const queryStr =
    '&FromDate=' + '' + 
    '&ToDate=' + '' + 
    '&FromAmount=' + 0 + 
    '&ToAmount=' + 0 + 
    '&LedgerId=' + this.LedgerId 
   this.voucherEntryServie.setSearchQueryParamsStr(queryStr)
  }
}