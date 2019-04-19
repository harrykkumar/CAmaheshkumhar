import { Component, ViewChild } from '@angular/core'
import { Subscription } from 'rxjs'
import { Select2OptionData, Select2Component } from 'ng2-select2'
import { SalesCourierLocalServices } from '../../sales-courier-local.services'
import { VendorServices } from '../../../commonServices/TransactionMaster/vendoer-master.services'
import { ToastrCustomService } from '../../../commonServices/toastr.service'
import { GlobalService } from '../../../commonServices/global.service'
import { Settings } from '../../../shared/constants/settings.constant'
import { UIConstant } from '../../../shared/constants/ui-constant'
import { SetUpIds } from '../../../shared/constants/setupIds.constant'
import { AddCust, ResponseSale } from '../../../model/sales-tracker.model'
import { CommonService } from '../../../commonServices/commanmaster/common.services'
declare var $: any
declare var flatpickr: any
@Component({
  selector: 'app-sales-invoice',
  templateUrl: './sales-invoice.component.html',
  styleUrls: ['./sales-invoice.component.css']
})
export class SalesInvoiceComponent {
  BillNo: string
  BillDate: string
  CurrencyId: string
  modalOpen: Subscription
  PartyId: any // client
  ReferId: any // supplier
  RoundOff: any
  BillAmount: any

  subscribe: Subscription
  clientNameSelect2: Array<Select2OptionData>
  suplierNameSelect2: Array<Select2OptionData>
  paymentModeSelect2: Array<Select2OptionData>
  clientnamePlaceHolder: Select2Options
  paymentPlaceHolder: Select2Options
  ledgerPlaceHolder: Select2Options
  currencies: Array<Select2OptionData>
  items = []
  transactions = []
  loading = true
  Length: any
  Quantity: any
  SaleRate: any
  Remark: string
  newCustAddSub: Subscription
  newVendAddSub: Subscription
  newLedgerAddSub: Subscription
  clickItem: boolean = false
  clickTrans: boolean = false
  isValidAmount: boolean = true
  clientDateFormat: string = ''
  constructor (private saleService: SalesCourierLocalServices,
    private _ledgerServices: VendorServices,
    private toastrService: ToastrCustomService,
    private gs: GlobalService,
    private commonService: CommonService,
    private settings: Settings) {

    this.clientNameSelect2 = []
    this.suplierNameSelect2 = []
    this.paymentModeSelect2 = []
    this.getClientName(0)
    this.clientDateFormat = this.settings.dateFormat
    console.log('client date format : ', this.clientDateFormat)
    if (this.clientDateFormat === '') {
      this.commonService.getSettingById(SetUpIds.dateFormat).subscribe(
        (data) => {
          if (data.Code === UIConstant.THOUSAND && data.Data.SetupDynamicValues) {
            this.clientDateFormat = data.Data.SetupDynamicValues.Val
            this.settings.dateFormat = this.clientDateFormat
          }
        }
      )
    }
    this.newCustAddSub = this.commonService.getCustStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.clientNameSelect2)
          newData.push({ id: data.id, text: data.name })
          this.clientNameSelect2 = newData
          this.clientNameId = data.id
          this.PartyId = data.id
        }
      }
    )
    this.newVendAddSub = this.commonService.getVendStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.suplierNameSelect2)
          newData.push({ id: data.id, text: data.name })
          this.suplierNameSelect2 = newData
          this.supplierId = data.id
          this.ReferId = data.id
        }
      }
    )
    this.newLedgerAddSub = this.commonService.getLedgerStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.paymentLedgerselect2)
          newData.push({ id: data.id, text: data.name })
          this.paymentLedgerselect2 = newData
          this.LedgerId = data.id
          this.ledgerName = data.name
          this.bankName = data.id
        }
      }
    )
    this.modalOpen = this.commonService.getInvoiceStatus().subscribe(
      (status: any) => {
        if (status.open) {
          this.openModal()
        } else {
          this.closeModal()
        }
      }
    )
  }

  Paymode: any
  Amount: any
  PayDate: any
  ChequeNo: any
  ledgerName: any
  ngOnInit () {
    this.initComp()
  }

  initComp () {
    this.initialiseItem()
    this.initialiseTransaction()
    this.initialiseParams()
  }

  getCurrency () {
    let _self = this
    this.getAvailableCurrency().toPromise().then(
      (data: ResponseSale) => {
        console.log('set up modules : ', data)
        if (data.Code === UIConstant.THOUSAND) {
          _self.setupModules = data.Data.SetupModules[0]
          // console.log('set up modules : ', _self.setupModules)
          if (!_self.setupModules.IsBillNoManual) {
            _self.BillNo = _self.setupModules.BillNo
          }
          _self.setBillDate()
          _self.setPayDate()
          _self.setTravelDate()
          let currencies = data.Data.SetupSettings
          _self.placeholderCurreny = { placeholder: 'Select Currency' }
          let newData = [{ id: UIConstant.BLANK, text: 'Select Currency' }]
          currencies.forEach(element => {
            if (+element.SetupId === 37 && +element.Type === 3) {
              if (+element.Id !== 0 && +element.Id === +element.defaultvalue) {
                _self.defaultCurrency = element.Val
                _self.currenyValues[1] = { id: '1', symbol: _self.defaultCurrency }
              }
              newData.push({
                id: element.Id,
                text: element.Val
              })
            }
          })
          _self.currencies = newData
          _self.isDataAvailable = true
          console.log('currencies available : ', _self.currencies)
        }
      }
    )
  }

  addItems () {
    if (this.Remark && this.Length && this.SaleRate && this.Quantity) {
      this.addItem()
      this.clickItem = true
      console.log('items : ', this.items)
      this.calculateTotalOfRow()
      this.initialiseItem()
    }
  }

  addItem () {
    if (this.items.length === 0) {
      this.items.push({
        Id: 0,
        Sno: 1,
        UnitId: 1,
        Remark:  this.Remark,
        Length: +this.Length,
        Quantity: +this.Quantity,
        SaleRate: +this.SaleRate
      })
    } else {
      let index = +this.items[this.items.length - 1].Sno + 1
      this.items.push({
        Id: 0,
        Sno: index,
        UnitId: 1,
        Remark:  this.Remark,
        Length: +this.Length,
        Quantity: +this.Quantity,
        SaleRate: +this.SaleRate
      })
    }
  }

  initialiseItem () {
    this.Remark = ''
    this.Length = ''
    this.Quantity = ''
    this.SaleRate = ''
    this.clickItem = false
  }

  initialiseTransaction () {
    this.Paymode = ''
    this.PayModeId = ''
    this.LedgerId = ''
    this.Amount = ''
    this.PayDate = ''
    this.ChequeNo = ''
    this.bankName = ''
    this.paymode = ''
    this.ledgerName = ''
    if (this.paymentSelect2 && this.paymentSelect2.selector.nativeElement.value) {
      this.paymentSelect2.setElementValue('')
    }
    if (this.ledgerSelect2 && this.ledgerSelect2.selector.nativeElement.value) {
      this.ledgerSelect2.setElementValue('')
    }
    this.clickTrans = false
  }

  @ViewChild('currency_select2') currencySelect2: Select2Component
  initialiseParams () {
    this.items = []
    this.transactions = []
    this.loading = true
    this.invalidObj = {}
    this.submitSave = false
    this.clickItem = false
    this.clickTrans = false
    this.isValidAmount = true
    this.BillDate = this.gs.getDefaultDate(this.clientDateFormat)
    this.CurrencyId = ''
    this.PartyId = ''
    this.ReferId = ''
    this.RoundOff = ''
    this.BillAmount = ''
    this.currency = ''
    if (this.clientSelect2) {
      this.clientSelect2.setElementValue('')
    }
    if (this.supplierSelect2) {
      this.supplierSelect2.setElementValue('')
    }
    if (this.currencySelect2) {
      this.currencySelect2.setElementValue('')
    }
  }

  setTravelDate () {
    let _self = this
    jQuery(function ($) {
      flatpickr('#travel-date', {
        minDate: 'today',
        dateFormat: _self.clientDateFormat
      })
    })
  }

  setPayDate () {
    let _self = this
    jQuery(function ($) {
      flatpickr('#pay-date', {
        minDate: 'today',
        dateFormat: _self.clientDateFormat
      })
    })
  }

  setBillDate () {
    let _self = this
    if (this.setupModules && this.setupModules.IsBackDateEntryAllow) {
      jQuery(function ($) {
        flatpickr('#bill-date', {
          dateFormat: _self.clientDateFormat,
          defaultDate: [_self.gs.getDefaultDate(_self.clientDateFormat)]
        })
      })
    } else {
      jQuery(function ($) {
        flatpickr('#bill-date', {
          minDate: 'today',
          dateFormat: _self.clientDateFormat,
          defaultDate: [_self.gs.getDefaultDate(_self.clientDateFormat)]
        })
      })
    }
    this.BillDate = _self.gs.getDefaultDate(_self.clientDateFormat)
  }

  clearExtras () {
    this.setupModules = {}
    this.currenyValues = [{ id: '0', symbol: '%' }]
    this.clientNameId = ''
    this.supplierId = ''
    this.BillNo = ''
  }

  calculateTotalOfRow () {
    let totalAmount = 0
    if (this.items.length > 0) {
      for (let i = 0; i < this.items.length; i++) {
        totalAmount = +totalAmount + +this.items[i].SaleRate
      }
    }
    if (!this.clickItem) {
      if (this.SaleRate !== '' && this.SaleRate !== 0 && typeof this.SaleRate !== 'undefined' && !isNaN(+this.SaleRate)) {
        totalAmount = totalAmount + +this.SaleRate
      }
    }
    if (!isNaN(totalAmount)) {
      this.RoundOff = +(Math.round(totalAmount) - totalAmount).toFixed(2)
      this.BillAmount = Math.round(totalAmount)
    }
  }

  PayModeId: any
  LedgerId: any
  deleteItem (i, forArr) {
    if (forArr === 'trans') {
      this.transactions.splice(i,1)
      this.checkValidationForAmount()
    }
    if (forArr === 'items') {
      this.items.splice(i,1)
      this.calculateTotalOfRow()
    }
  }
  // add more items
  identify (index, item) {
    item.Sno = index + 1
    // console.log('transaction :  ', item)
    return item.Sno - 1
  }
  // bank
  addTransactions () {
    if (this.Paymode && this.PayModeId && this.ledgerName && this.Amount && this.PayDate && this.ChequeNo) {
      if (this.checkValidationForAmount()) {
        this.addTransaction()
        this.clickTrans = true
        this.initialiseTransaction()
        this.paymentLedgerselect2 = []
        console.log('transactions : ', this.transactions)
        this.setPayDate()
      }
    }
  }

  addTransaction () {
    if (this.transactions.length === 0) {
      this.transactions.push({
        Id: 0,
        Sno: 1,
        Paymode: this.Paymode,
        PayModeId: +this.PayModeId,
        LedgerId: +this.LedgerId,
        ledgerName: this.ledgerName,
        Amount: +this.Amount,
        PayDate: this.PayDate,
        ChequeNo: this.ChequeNo
      })
    } else {
      let index = +this.transactions[this.transactions.length - 1].Sno + 1
      this.transactions.push({
        Id: 0,
        Sno: index,
        Paymode: this.Paymode,
        PayModeId: +this.PayModeId,
        LedgerId: +this.LedgerId,
        ledgerName: this.ledgerName,
        Amount: +this.Amount,
        PayDate: this.PayDate,
        ChequeNo: this.ChequeNo
      })
    }
  }
  // bank

  checkValidationForAmount (): boolean {
    let paymentTotal = 0
    for (let i = 0; i <= this.transactions.length - 1; i++) {
      paymentTotal = paymentTotal + +this.transactions[i].Amount
    }
    paymentTotal = (isNaN(+paymentTotal)) ? 0 : +paymentTotal
    this.BillAmount = (isNaN(+this.BillAmount)) ? 0 : +this.BillAmount
    if (!this.clickTrans) {
      if (this.Amount) {
        paymentTotal += this.Amount
      }
    }
    if (this.BillAmount !== 0) {
      if (paymentTotal > this.BillAmount) {
        this.toastrService.showError('Error', 'Payment can\'t be more the bill amount')
        this.isValidAmount = false
        return false
      } else {
        this.isValidAmount = true
        return true
      }
    } else {
      return true
    }
  }

  supplierId: any
  @ViewChild('supplier_select2') supplierSelect2: Select2Component
  onSelectSupplier (event) {
    console.log(' supplier select : ', event)
    if (event.value === '-1' && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
      this.commonService.openVend('')
      this.supplierSelect2.selector.nativeElement.value = ''
    } else {
      if (event.data[0] && event.data[0].text) {
        this.ReferId = event.value
        this.checkValidation()
      }
    }
  }

  clientNameId: any
  @ViewChild('client_select2') clientSelect2: Select2Component
  onSelected2clientId (event) {
    console.log('on select of customer : ', event)
    console.log('client id : ', this.clientNameId)
    if (event.value) {
      if (event.value === '-1' && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
        this.clientSelect2.selector.nativeElement.value = ''
        this.commonService.openCust('')
      } else {
        this.PartyId = event.value
        this.checkValidation()
      }
    }
  }
  bankName: any
  paymentLedgerselect2: Array<Select2OptionData>
  setpaymentLedgerSelect2 (value) {
    let _self = this
    let newData = [{ id: UIConstant.BLANK, text: 'Select Ledger' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
    this.ledgerPlaceHolder = { placeholder: 'Select Ledger' }
    this.commonService.getPaymentLedgerDetail(9).subscribe(data => {
      console.log('PaymentModeData : ', data)
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        data.Data.forEach(element => {
          newData.push({
            id: element.Id,
            text: element.Name
          })
        })
      }
      _self.paymentLedgerselect2 = newData
    })
  }
  getClientName (value) {
    this.clientnamePlaceHolder = { placeholder: 'Select ClientName' }
    this.clientNameSelect2 = [{ id: UIConstant.BLANK, text: 'Select Client Name' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
    this._ledgerServices.getVendor(5).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        if (data.Data.length > 0) {
          data.Data.forEach(element => {
            this.clientNameSelect2.push({
              id: element.Id,
              text: element.Name
            })
          })
          console.log('customers : ', this.clientNameSelect2)
        }
      }
    },
    (error) => {
      console.log(error)
    },
    () => {
      if (this.suplierNameSelect2.length === 0) {
        this.getSuplier(0)
      }
    })
  }
  ngOnDestroy () {
    this.modalOpen.unsubscribe()
    this.newCustAddSub.unsubscribe()
    this.newVendAddSub.unsubscribe()
    this.newLedgerAddSub.unsubscribe()
  }

  openModal () {
    this.initComp()
    $('#salerout').modal(UIConstant.MODEL_SHOW)
  }

  closeModal () {
    if ($('#salerout').length > 0) {
      $('#salerout').modal(UIConstant.MODEL_HIDE)
    }
  }

  closeInvoice () {
    this.commonService.closeInvoice()
  }

  supplierPlaceHolder: Select2Options
  supplierValue: any
  getSuplier (value) {
    this.supplierPlaceHolder = { placeholder: 'Select Supplier' }
    this.suplierNameSelect2 = [{ id: UIConstant.BLANK, text: 'Select Supplier' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
    this._ledgerServices.getVendor(4).subscribe(data => {
      console.log('data: ', data)
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        if (data.Data.length > 0) {
          data.Data.forEach(element => {
            this.suplierNameSelect2.push({
              id: element.Id,
              text: element.Name
            })
          })
        }
      } else {
        this.toastrService.showError('error', data.Message)
      }
    },
    (error) => {
      console.log(error)
    },
    () => {
      if (this.paymentModeSelect2.length === 0) {
        this.getPaymentModeDetail(0)
      }
    })
  }

  getPaymentModeDetail (index) {
    this.paymentPlaceHolder = { placeholder: 'Select Payment Mode' }
    let newData = [{ id: UIConstant.BLANK, text: 'Select Payment Mode' }]
    this.commonService.getPaymentModeDetail().subscribe(data => {
      console.log('payment data: ', data)
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        data.Data.forEach(element => {
          newData.push({
            id: element.Id,
            text: element.PayModeName
          })
        })
      }
      this.paymentModeSelect2 = newData
      console.log('paymentModeSelect2 : ', this.paymentModeSelect2)
    },
    (error) => {
      console.log(error)
    },
    () => {
      this.getCurrency()
    })
  }

  // PayModeId: any
  paymode: any
  @ViewChild('payment_select2') paymentSelect2: Select2Component
  select2PyamentModeId (event) {
    console.log('payment method select: ', event)
    if (event.value && event.data[0] && event.data[0].text) {
      this.Paymode = event.data[0].text
      this.PayModeId = event.value
      if (event.value === '3') {
        this.setpaymentLedgerSelect2(0)
      } else if (event.value === '1') {
        this.paymentLedgerselect2 = [{ id: '1', text: 'Cash' }]
        this.ledgerName = 'Cash'
      }
    }
  }

  @ViewChild('ledger_select2') ledgerSelect2: Select2Component
  paymentLedgerId (event) {
    console.log('payment ledger id : ', event)
    if (+event.value === -1) {
      this.commonService.openLedger()
      this.ledgerSelect2.selector.nativeElement.value = ''
    } else {
      if (event.value && event.data[0] && event.data[0].text) {
        this.LedgerId = event.value
        this.ledgerName = event.data[0].text
      }
    }
  }

  placeholderCurreny: Select2Options
  currency: any
  defaultCurrency: string
  setupModules: any
  currenyValues: Array < { id: string, symbol: string } > = [{ id: '0', symbol: '%' }]
  isDataAvailable: boolean = false
  getAvailableCurrency () {
    return this.commonService.getSaleSettings()
  }

  onSelectCurreny (evt) {
    console.log('selected curreny : ', evt)
    if (evt.data && evt.data.length > 0 && evt.data[0].text) {
      this.CurrencyId = evt.value
      this.checkValidation()
    }
  }

  submitSave: boolean = false
  keepOpen: boolean
  manipulateData () {
    this.submitSave = true
    this.addItems()
    this.addTransactions()
    this.calculateTotalOfRow()
    if (this.checkValidation() && this.isValidAmount) {
      this.BillDate = this.gs.clientToSqlDateFormat(this.BillDate, this.clientDateFormat)
      this.transactions.forEach(transaction => {
        transaction.PayDate = this.gs.clientToSqlDateFormat(transaction.PayDate, this.clientDateFormat)
      })
      let obj = {}
      obj['Id'] = 0
      obj['BillNo'] = this.BillNo
      obj['PartyId'] = +this.PartyId
      obj['ReferId'] = +this.ReferId
      obj['BillDate'] = this.BillDate
      obj['CurrencyId'] = +this.CurrencyId
      obj['BillAmount'] = this.BillAmount
      obj['RoundOff'] = this.RoundOff
      obj['Items'] = this.items
      obj['PaymentDetail'] = this.transactions
      let _self = this
      console.log('obj : ', JSON.stringify(obj))
      this.saleService.postLocalCourier(obj).subscribe(
        (data: any) => {
          // console.log('post : ', data)
          if (data.Code === UIConstant.THOUSAND) {
            _self.toastrService.showSuccess('Success', 'Saved Successfully')
            _self.commonService.newSaleAdded()
            console.log('keep open : ', _self.keepOpen)
            if (!_self.keepOpen) {
              _self.commonService.closeInvoice()
            } else {
              _self.initComp()
              _self.clearExtras()
            }
          } else {
            _self.toastrService.showError(data.Code, data.Message)
          }
        }
      )
    }
  }

  invalidObj = {}
  checkValidation (): boolean {
    let isValid = 1
    if (this.BillNo) {
      this.invalidObj['BillNo'] = false
    } else {
      this.invalidObj['BillNo'] = true
      isValid = 0
    }
    if (this.PartyId) {
      this.invalidObj['PartyId'] = false
    } else {
      this.invalidObj['PartyId'] = true
      isValid = 0
    }
    if (this.BillDate) {
      this.invalidObj['BillDate'] = false
    } else {
      this.invalidObj['BillDate'] = true
      isValid = 0
    }
    if (this.CurrencyId) {
      this.invalidObj['CurrencyId'] = false
    } else {
      this.invalidObj['CurrencyId'] = true
      isValid = 0
    }
    if (this.BillAmount) {
      this.invalidObj['BillAmount'] = false
    } else {
      this.invalidObj['BillAmount'] = true
      isValid = 0
    }
    if (this.ReferId) {
      this.invalidObj['ReferId'] = false
    } else {
      this.invalidObj['ReferId'] = true
      isValid = 0
    }
    if (this.items.length === 0) {
      isValid = 0
      if (this.Remark) {
        this.invalidObj['Remark'] = false
      } else {
        this.invalidObj['Remark'] = true
      }
      if (this.SaleRate) {
        this.invalidObj['SaleRate'] = false
      } else {
        this.invalidObj['SaleRate'] = true
      }
      if (this.Length) {
        this.invalidObj['Length'] = false
      } else {
        this.invalidObj['Length'] = true
      }
      if (this.Quantity) {
        this.invalidObj['Quantity'] = false
      } else {
        this.invalidObj['Quantity'] = true
      }
    } else {
      this.invalidObj['Remark'] = false
      this.invalidObj['SaleRate'] = false
      this.invalidObj['Length'] = false
      this.invalidObj['Quantity'] = false
    }
    return !!isValid
  }
}
