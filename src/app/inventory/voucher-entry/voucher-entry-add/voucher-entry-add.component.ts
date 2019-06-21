import { Component, ViewChild, OnDestroy } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { CommonService } from "src/app/commonServices/commanmaster/common.services";
import { takeUntil, filter, catchError, map } from 'rxjs/internal/operators';
import { AddCust } from '../../../model/sales-tracker.model';
import { UIConstant } from '../../../shared/constants/ui-constant';
import { Select2OptionData, Select2Component } from 'ng2-select2';
import { PurchaseService } from '../../purchase/purchase.service';
import { Settings } from '../../../shared/constants/settings.constant';
import { GlobalService } from '../../../commonServices/global.service';
import { ToastrCustomService } from '../../../commonServices/toastr.service';
import { VoucherEntryServie } from '../voucher-entry.service';
import { SetUpIds } from '../../../shared/constants/setupIds.constant';
import { VoucherAddModel } from '../voucher-entry.model';
declare const $: any
declare const flatpickr: any
@Component({
  selector: 'voucher-entry-add',
  templateUrl: './voucher-entry-add.component.html'
})
export class VoucherEntryAddComponent implements OnDestroy {
  onDestroy$ = new Subject()
  autoBill: boolean = true;
  previousVoucherNo: string
  VoucherNo: string
  Id: number;
  creatingForm: boolean;
  clientDateFormat: string = ''
  glid: number = 4

  tabId: number = 1

  organisationsData: Array<Select2OptionData>
  OrgId: number
  organisationValue: number

  ledgerPlaceholder: Select2Options = { placeholder: 'Select Customer' }
  LedgerId: number
  ledgerValue: number
  ledgerData: Array<Select2OptionData>

  PartyId = 0

  VoucherDate: string
  settingData = []
  voucherList = []
  paymentModesData: Array<Select2OptionData>
  selectAll = false
  invalidObj = {}

  Paymode = ''
  PayModeId = 0
  Amount = 0
  BankLedgerName = ''
  ChequeNo = ''
  ledger = 0
  paymode = 0
  Narration: string = ''
  tabs = [
    {type: 'payment', voucherNoManual: false, ReportFor: 'purchase', voucherType: 103},
    {type: 'receipt', voucherNoManual: false, ReportFor: 'sale', voucherType: 102}
  ]
  constructor (private commonService: CommonService, private purchaseService: PurchaseService,
    private voucherService: VoucherEntryServie, private settings: Settings, private gs: GlobalService,
    private toastrService: ToastrCustomService) {
    this.clientDateFormat = this.settings.dateFormat
    this.getSPUitilityData()
    this.purchaseService.organisationsData$.pipe(takeUntil(this.onDestroy$)).subscribe(
      data => {
        if (data.data) {
          this.organisationsData = data.data
          if (this.organisationsData.length >= 1) {
            this.OrgId = +this.organisationsData[0].id
            this.organisationValue = +this.organisationsData[0].id
            if (!this.tabs[this.tabId - 1].voucherNoManual) {
              this.VoucherDate = this.gs.getDefaultDate(this.clientDateFormat)
              this.getNewBillNo()
            }
          }
        }
      }
    )

    this.purchaseService.paymentModesData$.pipe(takeUntil(this.onDestroy$)).subscribe(
      data => {
        if (data.data) {
          this.paymentModesData = data.data
        }
      }
    )

    this.purchaseService.settingData$.pipe(takeUntil(this.onDestroy$)).subscribe(
      data => {
        if (data.data) {
          this.settingData = data.data
          console.log('setting data : ', this.settingData)
          this.getSetUpModules(this.settingData)
        }
      }
    )

    this.voucherService.vendorData$.pipe(takeUntil(this.onDestroy$)).subscribe(
      data => {
        if (data.data) {
          this.ledgerData = data.data
        }
      }
    )

    this.voucherService.customerData$.pipe(takeUntil(this.onDestroy$)).subscribe(
      data => {
        if (data.data) {
          this.ledgerData = data.data
        }
      }
    )

    this.commonService.getVoucherStatus().pipe(takeUntil(this.onDestroy$)).subscribe(
      (status: AddCust) => {
        if (status.open) {
          this.openModal()
        } else {
          this.closeModal()
        }
      }
    )
  }

  openModal() {
    this.initComp()
    setTimeout(() => {
      $('#voucher_modal').modal(UIConstant.MODEL_SHOW)
      // this.setVoucherDate()
    }, 1)
  }
  closeModal() {
    if ($('#voucher_modal').length > 0) {
      $('#voucher_modal').modal(UIConstant.MODEL_HIDE)
    }
  }

  initComp () {
    this.initParams()
  }
  
  closeForm () {
    this.commonService.closeVoucher()
  }

  @ViewChild('organisation_select2') organisationSelect2: Select2Component
  onChangeOrganisationId (evt) {
    // console.log('on org select : ', evt)
    if (evt.value && evt.data.length > 0) {
      if (evt.value > 0 && evt.data[0] && evt.data[0].text) {
        this.OrgId = +evt.value
        this.getNewBillNo()
        this.getVoucherList()
      }
    }
  }

  getNewBillNo () {
    if (+this.OrgId > 0 && this.VoucherDate) {
      let newVoucherDate = this.gs.clientToSqlDateFormat(this.VoucherDate, this.clientDateFormat)
      const auto = this.tabs[this.tabId - 1].type
      this.voucherService.getTransactionNo(this.tabs[this.tabId - 1].type, +this.OrgId, newVoucherDate, auto).pipe(takeUntil(this.onDestroy$), filter(data => {
        if (data.Code === UIConstant.THOUSAND) { return true } else { console.log(data); throw new Error(data.Description) }
      }), catchError(error => { return throwError(error) }), map(data => data.Data)).subscribe(
        data => {
          console.log('new bill no : ', data)
          if (data.length > 0) {
            if (!this.tabs[this.tabId - 1].voucherNoManual) {
              this.VoucherNo = data[0].BillNo
            } else {
              this.previousVoucherNo = data[0].BillNo
            }
          } else {
            this.previousVoucherNo = ''
            this.VoucherNo = ''
          }
        },
        (error) => {
          this.toastrService.showError(error, '')
        },
        () => {
        }
      )
    }
  }
  
  loading = true
  getSPUitilityData () {
    this.loading = true
    this.commonService.getSPUtilityData(this.tabs[this.tabId - 1].type).pipe(takeUntil(this.onDestroy$), filter(data => {
      if (data.Code === UIConstant.THOUSAND) { return true } else { console.log(data); throw new Error(data.Description) }
    }), catchError(error => { return throwError(error) }), map(data => data.Data)).subscribe(
      data => {
        console.log('payemnt data : ', data)
        if (this.tabs[this.tabId - 1].type === UIConstant.PAYMENT_TYPE || this.tabs[this.tabId - 1].type === UIConstant.RECEIPT_TYPE) {
          this.purchaseService.createOrganisations(data.Organizations)
          this.purchaseService.createPaymentModes(data.PaymentModes)
          if (this.tabs[this.tabId - 1].type === UIConstant.PAYMENT_TYPE) {
            this.voucherService.createVendors(data.Vendors)
          } else if (this.tabs[this.tabId - 1].type === UIConstant.RECEIPT_TYPE) {
            this.voucherService.createCustomers(data.Customers)
          }
        }
      },
      (error) => {
        this.toastrService.showError(error, '')
      },
      () => {
        this.loading = false
        this.setVoucherDate()
      }
    )
  }

  billSettlementType: number = 1
  getSetUpModules (settings) {
    console.log('settings : ', settings)
    settings.forEach(element => {
      if (element.id === SetUpIds.paymentAutoVoucher) {
        this.tabs[0].voucherNoManual = !!(+element.val)
        console.log('tabs[i].voucherNoManual : ', this.tabs[0].voucherNoManual)
      }
      if (element.id === SetUpIds.receiptAutoVoucher) {
        this.tabs[1].voucherNoManual = !!(+element.val)
        console.log('tabs[i].voucherNoManual : ', this.tabs[1].voucherNoManual)
      }
      if (element.id === SetUpIds.billSettlementType) {
        this.billSettlementType = +element.val
      }
    })
  }

  getVoucherList () {
    if (this.PartyId > 0 && +this.OrgId > 0) {
      this.voucherService.getVoucherList(this.tabs[this.tabId - 1].ReportFor, 'Billwise',this.PartyId, +this.OrgId).pipe(takeUntil(this.onDestroy$), filter(data => {
        if (data.Code === UIConstant.THOUSAND) { return true } else { console.log(data); throw new Error(data.Description) }
      }), catchError(error => { return throwError(error) }), map(data => data.Data), 
      map(data => { data.forEach(element => { element['selected'] = false; element['rejected'] = false; element['PaymentAmount'] = 0; element['IsAdvance'] = 0 }); return data; })).subscribe(
        data => {
          console.log(data)
          this.voucherList = data
          this.updateAmount()
          this.checkForValidation()
        },
        (error) => {
          this.toastrService.showError(error, '')
        }
      )
    } else {
      this.voucherList = []
    }
  }

  toggleSelect (evt) {
    console.log('event : ', evt.target.checked)
    for (let i = 0; i < this.voucherList.length; i++) {
      this.voucherList[i].selected = evt.target.checked
    }
    this.updateAmount()
  }

  paymentLedgerselect2: Array<Select2OptionData>
  @ViewChild('payment_select2') paymentSelect2: Select2Component
  onPaymentModeSelect (event) {
    // console.log('payment method select: ', event)
    if (+event.value > 0 && event.data[0] && event.data[0].text) {
      this.Paymode = event.data[0].text
      this.PayModeId = +event.value
      if (+event.value === 3) {
        this.BankLedgerName = ''
        this.LedgerId = 0
        this.setpaymentLedgerSelect2(0)
      } else if (+event.value === 1) {
        this.paymentLedgerselect2 = Object.assign([], [{ id: '1', text: 'Cash' }])
        this.BankLedgerName = 'Cash'
        this.LedgerId = 1
        this.paymentSelect2.setElementValue(this.LedgerId)
      }
    }
    this.checkForValidation()
  }

  setpaymentLedgerSelect2 (i) {
    let _self = this
    let newData = [{ id: '0', text: 'Select Ledger' }]
    this.commonService.getPaymentLedgerDetail(9).pipe(takeUntil(this.onDestroy$)).subscribe(data => {
      // console.log('PaymentModeData : ', data)
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        data.Data.forEach(element => {
          newData.push({
            id: element.Id,
            text: element.Name
          })
        })
      }
      _self.paymentLedgerselect2 = newData
    },
    (error) => console.log(error),
    () => {
    })
  }

  
  @ViewChild('ledger_select2') ledgerSelect2: Select2Component
  onPaymentLedgerSelect (event) {
    if (event.value > 0 && event.data[0] && event.data[0].text) {
      this.LedgerId = +event.value
      this.BankLedgerName = event.data[0].text
    }
    this.checkForValidation()
  }

  initPayment () {
    this.Paymode = ''
    this.PayModeId = 0
    this.LedgerId = 0
    this.Amount = 0
    this.BankLedgerName = ''
    this.Narration = ''
    this.ledger = 0
    this.paymode = 0
    if (this.ledgerSelect2) {
      this.ledgerSelect2.setElementValue(0)
    }
    if (this.paymentSelect2) {
      this.paymentSelect2.setElementValue(0)
    }
  }

  @ViewChild('party_select2') partySelect2: Select2Component
  initParams () {
    this.initPayment()
    this.PartyId = 0
    if (this.organisationsData && this.organisationsData.length > 0) {
      this.OrgId = +this.organisationsData[0].id
      this.organisationValue = +this.organisationsData[0].id
      if (this.organisationSelect2) {
        this.organisationSelect2.setElementValue(this.OrgId)
      }
    }
    if (this.partySelect2) {
      this.partySelect2.setElementValue(0)
    }

    this.autoBill = true;
    this.selectAll = false
    this.advancePayment = 0
    this.ledgerValue = 0
    this.voucherList = []
    this.invalidObj = {}
  }

  setVoucherDate () {
    let _self = this
    $(function ($) {
      flatpickr('#voucher-date', {
        dateFormat: _self.clientDateFormat,
        defaultDate: [_self.gs.getDefaultDate(_self.clientDateFormat)]
      })
    })
    this.VoucherDate = _self.gs.getDefaultDate(_self.clientDateFormat)
  }

  private voucherAddParams (): VoucherAddModel {
    let VoucherDate = this.gs.clientToSqlDateFormat(this.VoucherDate, this.clientDateFormat)
    let voucherList = JSON.parse(JSON.stringify(this.voucherList))
    voucherList.forEach(voucher => {
      if (voucher.BillDate) {
        voucher.BillDate = this.gs.clientToSqlDateFormat(voucher.BillDate, this.clientDateFormat)
      }
      voucher['ParentId'] = voucher.Id
      voucher['Amount'] = +voucher.PaymentAmount
    })
    if (+this.advancePayment > 0)  {
      voucherList.push({
        IsAdvance: 1,
        Amount: this.advancePayment
      })
    }
    console.log(voucherList)
    let paymentDetails = [{
      Id: 0,
      Paymode: this.Paymode,
      PayModeId: this.PayModeId,
      LedgerId: this.LedgerId,
      BankLedgerName: this.BankLedgerName,
      Amount: +this.Amount,
      ChequeNo: this.Narration
    }]
    
    const voucherAddParams = {
      obj: {
        Id: UIConstant.ZERO,
        OrgId: this.OrgId,
        VoucherType: this.tabs[this.tabId - 1].voucherType,
        VoucherNo: this.VoucherNo,
        PartyId: this.PartyId,
        TotalAmount: +this.Amount,
        VoucherDate: VoucherDate,
        VoucherDatas: voucherList,
        PaymentDetails: paymentDetails
      } as VoucherAddModel
    }
    console.log('obj : ', JSON.stringify(voucherAddParams.obj))
    return voucherAddParams.obj
  }

  manipulateData () {
    let _self = this
    if (this.checkForValidation()) {
      this.voucherService.postVoucher(this.voucherAddParams()).pipe(takeUntil(this.onDestroy$), filter(data => {
        if (data.Code === UIConstant.THOUSAND) { return true } else { console.log(data); throw new Error(data.Description) }
      }), catchError(error => { return throwError(error) }), map(data => data.Data)).subscribe(
        data => {
          console.log('data : ', data)
          if (data.Code === UIConstant.THOUSAND && data.Data) {
            _self.toastrService.showSuccess('Saved Successfully', '')
            _self.commonService.newVoucherAdd()
          }
        },
        (error) => {
          _self.toastrService.showError(error, '')
        }
      )
    }
  }

  updateAmount () {
    if (this.autoBill) {
      let totalAmount = +this.Amount
      if (this.voucherList.length > 0) {
        this.voucherList.forEach(element => {
          if (!element['Rejected']) {
            if (totalAmount >= +element['Balance']) {
              element['PaymentAmount'] = +element['Balance']
              element['selected'] = true
              totalAmount = +totalAmount - element['PaymentAmount']
              if (this.voucherList.length === 1) {
                this.selectAll = true
              }
            } else {
              element['PaymentAmount'] = +totalAmount
              if (+totalAmount > 0) {
                element['selected'] = true
                totalAmount = +totalAmount - element['PaymentAmount']
              } else {
                element['selected'] = false
              }
              return
            }
          } else {
            element['PaymentAmount'] = 0
          }
        })
      }
    } else {
      this.Amount = 0
      this.advancePayment = 0
      this.voucherList.forEach(element => {
        if (element['selected'] && element['PaymentAmount'] > 0) {
          this.Amount += +element['PaymentAmount']
          element['selected'] = true
        } else {
          element['selected'] = false
        }
      })
    }
    this.checkForRows()
    this.checkForAdvancePayment()
  }

  checkForRows () {
    if (this.voucherList.length > 0) {
      let selectAll = true
      for (let i = 0; i < this.voucherList.length; i++) {
        if (!this.voucherList[i].selected) {
          selectAll = false
          break
        }
      }
      this.selectAll = selectAll
    } else {
      this.selectAll = false
    }
  }

  advancePayment = 0
  onVoucherToggle (index, e: Event) {
    console.log('index : ', index)
    if (!this.autoBill) {
      if (!this.voucherList[index].selected) {
        this.voucherList[index]['PaymentAmount'] = 0
      } else {
        this.voucherList[index]['PaymentAmount'] = +this.voucherList[index]['Balance']
      }
      this.updateAmount()
    }
    if (+this.Amount > 0 && this.autoBill) {
      if (!this.voucherList[index].selected) {
        this.voucherList[index]['Rejected'] = true
        this.updateAmount()
      }
      if (this.voucherList[index].selected) {
        this.voucherList[index]['Rejected'] = false
        this.updateAmount()
      }
    } else {
      this.advancePayment = 0
    }
  }

  checkForAdvancePayment () {
    let amount = 0
    if (+this.Amount > 0 && this.autoBill && this.voucherList.length > 0) {
      this.voucherList.forEach(voucher => {
        if (voucher.selected) {
          amount += voucher['PaymentAmount']
        }
      })
      if (amount < +this.Amount) {
        this.advancePayment = +this.Amount - amount
      }
      console.log('voucherlist : ', this.voucherList)
    }
  }

  checkForValidation () {
    if (+this.Amount > 0 && this.voucherList.length > 0) {
      let isValid = 1
      if (+this.PayModeId > 0) {
        this.invalidObj['PayModeId'] = false
      } else {
        isValid = 0
        this.invalidObj['PayModeId'] = true
      }
      if (+this.LedgerId > 0) {
        this.invalidObj['LedgerId'] = false
      } else {
        isValid = 0
        this.invalidObj['LedgerId'] = true
      }
      if (+this.Amount > 0) {
        this.invalidObj['Amount'] = false
      } else {
        isValid = 0
        this.invalidObj['Amount'] = true
      }
      if (this.Narration) {
        this.invalidObj['ChequeNo'] = false
      } else {
        isValid = 0
        this.invalidObj['ChequeNo'] = true
      }
      return !!isValid
    } else {
      this.invalidObj = {}
      return true
    }
  }

  ngOnDestroy () {
    this.onDestroy$.next()
    this.onDestroy$.complete()
  }
}