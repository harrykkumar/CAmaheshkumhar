import { Component, ViewChild, Renderer2, ElementRef } from '@angular/core'
import { Subscription } from 'rxjs'
import { Select2OptionData, Select2Component } from 'ng2-select2'
import { TravelImports, TravelPayments, AddCust, ResponseSale, SalesTourism } from '../../../../model/sales-tracker.model'
import { ToastrCustomService } from '../../../../commonServices/toastr.service'
import { Settings } from '../../../../shared/constants/settings.constant'
import { GlobalService } from '../../../../commonServices/global.service'
import { CommonService } from '../../../../commonServices/commanmaster/common.services'
import { SetUpIds } from '../../../../shared/constants/setupIds.constant'
import { UIConstant } from '../../../../shared/constants/ui-constant'
import { SaleTravelServices } from '../../sale-travel.services'
declare const $: any
declare const flatpickr: any
@Component({
  selector: 'app-sales-invoice',
  templateUrl: './sales-invoice.component.html',
  styleUrls: ['./sales-invoice.component.css']
})
export class SalesInvoiceComponent {
  id: number
  BillNo: string
  clientName: number
  BillDate: string
  BookingNo: string
  CurrencyId: number
  modalOpen: Subscription

  totalDiscount: number
  totalFare: number
  Commission: number
  OtherCharge: number
  RoundOff: number
  CessAmount: number
  totalInvoiceAmount: number
  totalBillAmount: number

  subcribe: Subscription
  clientNameSelect2: Array<Select2OptionData>
  suplierNameSelect2: Array<Select2OptionData>
  paymentModeSelect2: Array<Select2OptionData>
  select2Item: Array<Select2OptionData>
  clientnamePlaceHolder: Select2Options
  paymentPlaceHolder: Select2Options
  ledgerPlaceHolder: Select2Options
  currencies: Array<Select2OptionData>
  taxTypes: Array<any>
  taxTypeSub: Subscription
  taxPlaceHolder: Select2Options
  items: TravelImports[]
  transactions: TravelPayments[]

  loading = true

  Supplier: number
  TicketNo: string
  Routing: number
  Remark: string
  Fare: number
  Discount: number
  discountAmount: number
  taxAmount: number
  ReIssueCharges: number
  RefundPanelty: number
  Miscellaneouse: number
  Company: string
  LangiTax: number
  SvcFee: number
  CommissionAmount: number
  Comm: number
  Commtoauthorizor: number
  CommissionType = 1
  DiscountType = 1
  TotalAmount: number
  routingName: string
  supplierName: string
  Date: string
  returnDate: string
  Id: number
  Sno: number

  PayModeId: number
  LedgerId: number
  paymode: number
  ledger: number

  Paymode: string
  Amount: number
  PayDate: string
  ChequeNo: string
  ledgerName: string
  routingId: number
  supplierId: number
  clientNameId: number
  bankName: string
  LpoNo: string
  invalidObj: Object = {}
  submitSave: boolean = false
  clickItem = false
  clickTrans = false
  keepOpen: boolean = false
  returnDateError: boolean = false
  editMode: boolean = false
  editTransId: number = -1
  editItemId: number = -1
  validItem: boolean = true
  validTransaction: boolean = true
  clientDateFormat: string = ''

  supplierList$: Subscription
  routeList$: Subscription
  clientList$: Subscription
  constructor (private _saleTravelServices: SaleTravelServices,
    private toastrService: ToastrCustomService,
    private settings: Settings,
    private commonService: CommonService,
    private gs: GlobalService,
    private renderer: Renderer2
    ) {

    // this.clientNameSelect2 = []
    // this.suplierNameSelect2 = []
    // this.paymentModeSelect2 = []
    // this.select2Item = []
    // this.currencies = []
    // this.getClientName(0)
    this.getPaymentModeDetail(0)
    this.supplierList$ = this._saleTravelServices.supplierList$.subscribe(
      (data) => {
        this.suplierNameSelect2 = Object.assign([], data)
        console.log('supplier : ', this.suplierNameSelect2)
      }
    )

    this.routeList$ = this._saleTravelServices.routeList$.subscribe(
      (data) => {
        this.select2Item = Object.assign([], data)
      }
    )

    this.clientList$ = this._saleTravelServices.clientList$.subscribe(
      (data) => {
        this.clientNameSelect2 = Object.assign([], data)
      }
    )

    this.clientDateFormat = this.settings.dateFormat
    // console.log('client date format : ', this.clientDateFormat)
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
          this.clientNameId = +data.id
          this.clientName = +data.id
          setTimeout(() => {
            if (this.clientSelect2) {
              const element = this.renderer.selectRootElement(this.clientSelect2.selector.nativeElement, true)
              element.focus({ preventScroll: false })
            }
          }, 2000)
        }
      }
    )
    this.newVendAddSub = this.commonService.getVendStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.suplierNameSelect2)
          newData.push({ id: data.id, text: data.name })
          this.suplierNameSelect2 = newData
          this.supplierId = +data.id
          this.Supplier = data.id
          setTimeout(() => {
            if (this.supplierSelect2) {
              const element = this.renderer.selectRootElement(this.supplierSelect2.selector.nativeElement, true)
              element.focus({ preventScroll: false })
            }
          }, 2000)
        }
      }
    )
    this.newRoutingAddSub = this.commonService.getRoutingStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          // console.log('routing added : ', data)
          let newData = Object.assign([], this.select2Item)
          newData.push({ id: data.id, text: data.name })
          this.select2Item = newData
          this.routingId = +data.id
          this.Routing = data.id
          setTimeout(() => {
            if (this.routingSelect2) {
              const element = this.renderer.selectRootElement(this.routingSelect2.selector.nativeElement, true)
              element.focus({ preventScroll: false })
            }
          }, 2000)
        }
      }
    )
    this.newLedgerAddSub = this.commonService.getLedgerStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.paymentLedgerselect2)
          newData.push({ id: data.id, text: data.name })
          this.paymentLedgerselect2 = newData
          this.ledger = data.id
          this.LedgerId = data.id
          this.ledgerName = data.name
          setTimeout(() => {
            if (this.ledgerSelect2) {
              const element = this.renderer.selectRootElement(this.ledgerSelect2.selector.nativeElement, true)
              element.focus({ preventScroll: false })
            }
          }, 2000)
        }
      }
    )
    this.modalOpen = this.commonService.getInvoiceStatus().subscribe(
      (status: any) => {
        if (status.open) {
          console.log('id : ', status.editId)
          if (status.editId !== '') {
            this.editMode = true
            this.id = status.editId
            this.getEditData()
          } else {
            this.id = UIConstant.ZERO
            this.editMode = false
            this.openModal()
          }
        } else {
          this.closeModal()
        }
      }
    )
  }

  getEditData () {
    console.log('edit id : ', this.id)
    this._saleTravelServices.getSaleTravelEditData(this.id).subscribe((data) => {
      console.log('edit data : ', data)
      this.openModal()
      this.createForm(data.Data)
    })
  }

  createForm (data) {
    this.createItems(data.TravelImports)
    this.createTransaction(data.PaymentDetails)
    this.createOther(data.TravelManuales[0])
  }

  createItems (travelImports) {
    travelImports.forEach(element => {
      this.Supplier = element.SupplierId
      this.TicketNo = element.TicketNo
      this.Routing = element.RoutingId
      this.Remark = element.Remark
      this.Date = this.gs.utcToClientDateFormat(element.DateOfTravel, this.clientDateFormat)
      this.returnDate = element.ReturnDate ? this.gs.utcToClientDateFormat(element.ReturnDate, this.clientDateFormat) : ''
      this.Fare = +element.Fare
      this.Discount = element.Discount
      this.taxAmount = element.TaxAmount
      this.ReIssueCharges = element.ReIssueCharges
      this.RefundPanelty = element.RefundPanelty
      this.Miscellaneouse = element.Miscellaneouse
      this.Company = element.Company
      this.LangiTax = element.LangiTax
      this.SvcFee = element.SvcFee
      this.Comm = element.Commission
      this.Commtoauthorizor = element.Commtoauthorizor
      this.CommissionType = element.CommissionType
      this.CommissionAmount = element.CommissionAmount
      this.DiscountType = element.DiscountType
      this.supplierName = element.Supplier
      this.routingName = element.Routing
      this.addItems()
      this.items[this.items.length - 1].Id = element.Id
    })
  }

  createTransaction (paymentDetails) {
    paymentDetails.forEach(element => {
      this.Paymode = element.Paymode
      this.PayModeId = element.PayModeId
      this.LedgerId = element.LedgerId
      this.ledgerName = element.BankLedgerName
      this.Amount = element.Amount
      this.PayDate = this.gs.utcToClientDateFormat(element.PayDate, this.clientDateFormat)
      this.ChequeNo = element.ChequeNo
      this.addTransactions()
      this.transactions[this.transactions.length - 1].Id = element.Id
    })
  }

  other: any = {}
  createOther (others) {
    this.BillNo = others.BillNo
    this.clientName = others.ClientName
    this.BillDate = this.gs.utcToClientDateFormat(others.Date, this.clientDateFormat)
    this.BookingNo = others.BookingNo
    this.LpoNo = others.Remark
    this.CurrencyId = others.CurrencyId
    this.defaultCurrency = others.Currency
    this.currencyValues.push({ id: 1, symbol: this.defaultCurrency })
    console.log('currency values : ', this.currencyValues)
    this.other = others
  }

  editItem (i, editId, type) {
    if (type === 'trans' && this.editTransId === -1) {
      this.editTransId = editId
      i = i - 1
      if (+this.transactions[i].PayModeId === 3) {
        this.paymodeSelect2.setElementValue('')
        this.ledgerSelect2.setElementValue('')
        this.setpaymentLedgerSelect2(i)
      } else if (+this.transactions[i].PayModeId === 1) {
        this.paymentLedgerselect2 = [{ id: '1', text: 'Cash' }]
        this.Paymode = this.transactions[i].Paymode
        this.PayModeId = this.transactions[i].PayModeId
        this.LedgerId = this.transactions[i].LedgerId
        this.ledgerName = this.transactions[i].ledgerName
        this.Amount = this.transactions[i].Amount
        this.PayDate = this.transactions[i].PayDate
        this.ChequeNo = this.transactions[i].ChequeNo
        this.paymodeSelect2.setElementValue(this.PayModeId)
        this.ledgerSelect2.setElementValue(this.LedgerId)
        this.deleteItem(i, type)
      }
    } else if (type === 'trans' && this.editTransId !== -1) {
      this.toastrService.showInfo('', 'There is already one transaction to edit, please update it this first in order to edit others')
    }
    if (type === 'items' && this.editItemId === -1) {
      this.editItemId = editId
      i = i - 1
      this.Supplier = this.items[i].SupplierId
      this.TicketNo = this.items[i].TicketNo
      this.Routing = this.items[i].RoutingId
      this.Remark = this.items[i].Remark
      this.Date = this.items[i].Date
      this.returnDate = this.items[i].ReturnDate
      this.Fare = this.items[i].Fare
      this.Discount = this.items[i].Discount
      this.discountAmount = this.items[i].discountAmount
      this.taxAmount = this.items[i].TaxAmount
      this.ReIssueCharges = this.items[i].ReIssueCharges
      this.RefundPanelty = this.items[i].RefundPanelty
      this.Miscellaneouse = this.items[i].Miscellaneouse
      this.Company = this.items[i].Company
      this.LangiTax = this.items[i].LangiTax
      this.SvcFee = this.items[i].SvcFee
      this.Commission = this.items[i].Comm
      this.CommissionAmount = this.items[i].CommissionAmount
      this.Comm = this.items[i].Comm
      this.Commtoauthorizor = this.items[i].Commtoauthorizor
      this.CommissionType = this.items[i].CommissionType
      this.DiscountType = this.items[i].DiscountType
      this.TotalAmount = this.items[i].TotalAmount
      this.routingName = this.items[i].routingName
      this.supplierName = this.items[i].supplierName
      this.routingSelect2.setElementValue(this.Routing)
      this.supplierSelect2.setElementValue(this.Supplier)
      this.deleteItem(i, type)
    } else if (type === 'items' && this.editItemId !== -1) {
      this.toastrService.showInfo('', 'There is already one item to edit, please update it this first in order to edit others')
    }
  }

  checkForValidReturnDate () {
    let isValid = true
    if (this.returnDate && this.Date) {
      if (!this.gs.validReturnDate(this.Date, this.returnDate)) {
        this.returnDateError = true
        isValid = false
        this.toastrService.showError('', 'Invalid Return Date')
      } else {
        this.returnDateError = false
      }
    }
    return isValid
  }

  addItems () {
    if (this.Supplier > 0 && this.TicketNo && this.Routing > 0 && this.Remark && this.Date && this.Fare > 0) {
      if (this.returnDate) {
        if (this.checkForValidReturnDate()) {
          if (this.editMode) {
            this.calculate()
          }
          this.addItem()
          this.clickItem = true
          console.log('items : ', this.items)
          if (!this.editMode) {
            this.calculateAllTotal()
            this.calculateTotalOfRow()
            this.calTotalInvoiceAmount()
          }
          this.initialiseItem()
          this.setTravelDate()
          this.setReturnDate()
        }
      } else {
        if (this.editMode) {
          this.calculate()
        }
        this.addItem()
        this.clickItem = true
        console.log('items : ', this.items)
        if (!this.editMode) {
          this.calculateAllTotal()
          this.calculateTotalOfRow()
          this.calTotalInvoiceAmount()
        }
        this.initialiseItem()
        this.setTravelDate()
        this.setReturnDate()
      }
    }
  }

  addItem () {
    if (this.items.length === 0) {
      this.items.push({
        Id: 0,
        Sno: 1,
        SupplierId: +this.Supplier,
        TicketNo: this.TicketNo,
        RoutingId: +this.Routing,
        Remark: this.Remark,
        Date:  this.Date,
        ReturnDate: this.returnDate,
        Fare: +this.Fare,
        Discount: +this.Discount,
        discountAmount: +this.discountAmount,
        TaxAmount: +this.taxAmount,
        ReIssueCharges: +this.ReIssueCharges,
        RefundPanelty: +this.RefundPanelty,
        Miscellaneouse: +this.Miscellaneouse,
        Company: this.Company,
        LangiTax: +this.LangiTax,
        SvcFee: +this.SvcFee,
        Commission: +this.Comm,
        CommissionAmount: +this.CommissionAmount,
        Comm: +this.Comm,
        Commtoauthorizor: +this.Commtoauthorizor,
        CommissionType: this.CommissionType,
        DiscountType: this.DiscountType,
        TotalAmount: this.TotalAmount,
        routingName: this.routingName,
        supplierName: this.supplierName,
        TaxType: '3'
      })
    } else {
      let index = +this.items[this.items.length - 1].Sno + 1
      this.items.push({
        Id: 0,
        Sno: index,
        SupplierId: this.Supplier,
        TicketNo:  this.TicketNo,
        RoutingId:  this.Routing,
        Remark:  this.Remark,
        Date:  this.Date,
        ReturnDate: this.returnDate,
        Fare:  this.Fare,
        Discount:  this.Discount,
        discountAmount: this.discountAmount,
        TaxAmount: this.taxAmount,
        ReIssueCharges: this.ReIssueCharges,
        RefundPanelty: this.RefundPanelty,
        Miscellaneouse: this.Miscellaneouse,
        Company: this.Company,
        LangiTax: this.LangiTax,
        SvcFee: this.SvcFee,
        Commission: this.Comm,
        CommissionAmount: this.CommissionAmount,
        Comm: this.Comm,
        Commtoauthorizor: this.Commtoauthorizor,
        CommissionType: this.CommissionType,
        DiscountType: this.DiscountType,
        TotalAmount: this.TotalAmount,
        routingName: this.routingName,
        supplierName: this.supplierName,
        TaxType: '3'
      })
    }
    setTimeout(() => {
      this.commonService.fixTableHFL('item-table')
    }, 1)
    if (this.editItemId !== -1) {
      this.items[this.items.length - 1].Id = this.editItemId
    }
  }

  // bank
  addTransactions () {
    if (this.Paymode && this.PayModeId > 0 && this.LedgerId > 0 && this.ledgerName && this.Amount > 0 && this.PayDate) {
      if ((+this.PayModeId === 3 && this.ChequeNo) || (+this.PayModeId === 1)) {
        if (this.checkValidationForAmount()) {
          this.addTransaction()
          this.clickTrans = true
          this.initialiseTransaction()
          console.log('transactions : ', this.transactions)
          this.setPayDate()
          this.calculatePaymentAmount()
        }
      } else {
        this.clickTrans = false
        if (+this.PayModeId === 3) {
          if (this.ChequeNo) {
            this.invalidObj['ChequeNo'] = false
          } else {
            this.invalidObj['ChequeNo'] = true
          }
        } else {
          this.invalidObj['ChequeNo'] = false
        }
      }
    }
  }

  calculatePaymentAmount () {
    let paymentTotal = 0
    if (this.transactions.length === 0) {
      this.Amount = this.totalBillAmount
    } else {
      for (let i = 0; i <= this.transactions.length - 1; i++) {
        paymentTotal = paymentTotal + +this.transactions[i].Amount
      }
      if (this.totalBillAmount >= 0 && paymentTotal >= 0 && paymentTotal < this.totalBillAmount) {
        this.Amount = this.totalBillAmount - paymentTotal
      } else if (paymentTotal > this.totalBillAmount) {
        this.Amount = 0
      }
    }

    this.validateTransaction()
  }

  addTransaction () {
    if (this.transactions.length === 0) {
      this.transactions.push({
        Id: 0,
        Sno: 1,
        Paymode: this.Paymode,
        PayModeId: this.PayModeId,
        LedgerId: this.LedgerId,
        ledgerName: this.ledgerName,
        Amount: this.Amount,
        PayDate: this.PayDate,
        ChequeNo: this.ChequeNo
      })
    } else {
      let index = +this.transactions[this.transactions.length - 1].Sno + 1
      this.transactions.push({
        Id: 0,
        Sno: index,
        Paymode: this.Paymode,
        PayModeId: this.PayModeId,
        LedgerId: this.LedgerId,
        ledgerName: this.ledgerName,
        Amount: this.Amount,
        PayDate: this.PayDate,
        ChequeNo: this.ChequeNo
      })
    }
    setTimeout(() => {
      this.commonService.fixTableHFL('trans-table')
    }, 1)
    if (this.editTransId !== -1) {
      this.transactions[this.transactions.length - 1].Id = this.editTransId
    }
  }

  initialiseItem () {
    this.Supplier = 0
    this.TicketNo = ''
    this.Routing = 0
    this.Remark = ''
    this.Fare = 0
    this.Discount = 0
    this.discountAmount = 0
    this.taxAmount = 0
    this.ReIssueCharges = 0
    this.RefundPanelty = 0
    this.Miscellaneouse = 0
    this.Company = ''
    this.LangiTax = 0
    this.SvcFee = 0
    this.CommissionAmount = 0
    this.Comm = 0
    this.Commtoauthorizor = 0
    this.CommissionType = 0
    this.DiscountType = 0
    this.TotalAmount = 0
    this.routingName = ''
    this.supplierName = ''
    this.Date = ''
    this.returnDate = ''
    this.supplierId = 0
    this.routingId = 0
    this.editItemId = -1
    this.returnDateError = false
    if (this.routingSelect2) {
      this.routingSelect2.setElementValue('')
    }
    if (this.supplierSelect2) {
      this.supplierSelect2.setElementValue('')
    }
    this.clickItem = false
  }

  @ViewChild('paymode_select2') paymodeSelect2: Select2Component
  initialiseTransaction () {
    this.Paymode = ''
    this.PayModeId = 0
    this.LedgerId = 0
    this.Amount = 0
    this.PayDate = this.BillDate
    this.ChequeNo = ''
    this.paymode = 0
    this.ledger = 0
    this.ledgerName = ''
    this.editTransId = -1
    if (this.ledgerSelect2) {
      this.ledgerSelect2.setElementValue('')
    }
    if (this.paymodeSelect2) {
      this.paymodeSelect2.setElementValue('')
    }
    this.clickTrans = false
  }

  @ViewChild('currency_select2') currencySelect2: Select2Component
  initialiseParams () {
    this.clientNameId = 0
    this.clientName = 0
    this.BillDate = this.gs.getDefaultDate(this.clientDateFormat)
    this.BookingNo = ''
    this.LpoNo = ''
    this.totalDiscount = 0
    this.totalFare = 0
    this.Commission = 0
    this.OtherCharge = 0
    this.RoundOff = 0
    this.CessAmount = 0
    this.totalInvoiceAmount = 0
    this.totalBillAmount = 0
    this.currency = ''
    this.CurrencyId = 0
    this.currencyValues = [{ id: 0, symbol: '%' }]
    this.defaultCurrency = ''
    this.submitSave = false
    this.clickItem = false
    this.clickTrans = false
    this.isValidAmount = true
    this.invalidObj = {}
    this.items = []
    this.transactions = []
    if (this.clientSelect2) {
      this.clientSelect2.setElementValue('')
    }
    if (this.currencySelect2) {
      this.currencySelect2.setElementValue('')
    }
  }

  initialiseExtras () {
    this.BillNo = ''
    this.setupModules = {}
  }

  setTravelDate () {
    let _self = this
    if (this.setupModules && this.setupModules.IsBackDateEntryAllow) {
      jQuery(function ($) {
        flatpickr('#travel-date', {
          dateFormat: _self.clientDateFormat
        })
      })
    } else {
      jQuery(function ($) {
        flatpickr('#travel-date', {
          minDate: 'today',
          dateFormat: _self.clientDateFormat
        })
      })
    }
  }

  setPayDate () {
    let _self = this
    if (this.setupModules && this.setupModules.IsBackDateEntryAllow) {
      jQuery(function ($) {
        flatpickr('#pay-date1', {
          dateFormat: _self.clientDateFormat,
          defaultDate: [_self.BillDate]
        })
      })
    } else {
      jQuery(function ($) {
        flatpickr('#pay-date1', {
          minDate: 'today',
          dateFormat: _self.clientDateFormat,
          defaultDate: [_self.BillDate]
        })
      })
    }
    console.log(_self.BillDate)
    _self.PayDate = _self.BillDate
  }

  setReturnDate () {
    let _self = this
    if (this.setupModules && this.setupModules.IsBackDateEntryAllow) {
      jQuery(function ($) {
        flatpickr('#return-travel-date', {
          dateFormat: _self.clientDateFormat
        })
      })
    } else {
      jQuery(function ($) {
        flatpickr('#return-travel-date', {
          minDate: 'today',
          dateFormat: _self.clientDateFormat
        })
      })
    }
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
      this.BillDate = _self.gs.getDefaultDate(_self.clientDateFormat)
    }
  }

  calTotalInvoiceAmount () {
    let totalOfInvoiceAmt = 0
    for (let i = 0; i < this.items.length; i++) {
      totalOfInvoiceAmt = totalOfInvoiceAmt + (isNaN(+this.items[i].Fare) ? 0 : +this.items[i].Fare)
      + (isNaN(+this.items[i].TaxAmount) ? 0 : +this.items[i].TaxAmount)
      - (isNaN(+this.items[i].discountAmount) ? 0 : +this.items[i].discountAmount)
      + (isNaN(+this.items[i].LangiTax) ? 0 : +this.items[i].LangiTax)
      + (isNaN(+this.items[i].SvcFee) ? 0 : +this.items[i].SvcFee)
    }
    if (!this.clickItem) {
      if (this.Fare !== 0 && !isNaN(+this.Fare)
      ) {
        totalOfInvoiceAmt += +this.Fare +
        (isNaN(+this.taxAmount) ? 0 : +this.taxAmount)
        - (isNaN(+this.discountAmount) ? 0 : +this.discountAmount) +
        (isNaN(+this.LangiTax) ? 0 : +this.LangiTax) +
        (isNaN(+this.SvcFee) ? 0 : +this.SvcFee)
      }
    }
    this.totalInvoiceAmount = totalOfInvoiceAmt
  }

  calculateAllTotal () {
    let totalDiscount = 0
    let totalFare = 0
    let Commission = 0
    let OtherCharge = 0
    for (let i = 0; i < this.items.length; i++) {
      totalDiscount = totalDiscount + +this.items[i].discountAmount
      totalFare = totalFare + +this.items[i].Fare
      Commission = Commission + +this.items[i].CommissionAmount
      OtherCharge = OtherCharge +
      (isNaN(+this.items[i].ReIssueCharges) ? 0 : +this.items[i].ReIssueCharges) +
      (isNaN(+this.items[i].RefundPanelty) ? 0 : +this.items[i].RefundPanelty) +
      (isNaN(+this.items[i].Miscellaneouse) ? 0 : +this.items[i].Miscellaneouse) +
      (isNaN(+this.items[i].LangiTax) ? 0 : +this.items[i].LangiTax) +
      (isNaN(+this.items[i].SvcFee) ? 0 : +this.items[i].SvcFee)
    }
    if (!this.clickItem) {
      if (this.discountAmount) {
        totalDiscount += +this.discountAmount
      }
      if (this.Fare) {
        totalFare += +this.Fare
      }
      if (this.CommissionAmount) {
        Commission += +this.CommissionAmount
      }
      OtherCharge +=
      (isNaN(+this.ReIssueCharges) ? 0 : +this.ReIssueCharges) +
      (isNaN(+this.RefundPanelty) ? 0 : +this.RefundPanelty) +
      (isNaN(+this.Miscellaneouse) ? 0 : +this.Miscellaneouse) +
      (isNaN(+this.LangiTax) ? 0 : +this.LangiTax) +
      (isNaN(+this.SvcFee) ? 0 : +this.SvcFee)
    }
    this.totalDiscount = +totalDiscount.toFixed(2)
    this.totalFare = +totalFare.toFixed(2)
    this.Commission = +Commission.toFixed(2)
    this.OtherCharge = +OtherCharge.toFixed(2)

    this.calTotalInvoiceAmount()
    this.calculatePaymentAmount()
  }

  calculate () {
    if ('' + this.DiscountType === '0') {
      if (this.Discount && this.Fare) {
        this.discountAmount = +((+this.Discount / 100) * (+this.Fare)).toFixed(2)
      } else {
        this.discountAmount = 0
      }
    } else {
      this.discountAmount = +(isNaN(+this.Discount) ? 0 : +this.Discount).toFixed(2)
    }
    if ('' + this.CommissionType === '0') {
      if (this.Comm && this.Fare) {
        this.CommissionAmount = +((+this.Comm / 100) * (+this.Fare)).toFixed(2)
      } else {
        this.CommissionAmount = 0
      }
    } else {
      this.CommissionAmount = +(isNaN(+this.Comm) ? 0 : +this.Comm).toFixed(2)
    }
    if ('' + this.taxAmount === '0') {
      this.taxAmount = +(isNaN(+this.taxAmount) ? 0 : +this.taxAmount).toFixed(2)
    }
    this.TotalAmount = +this.calculateTotal()
    this.calculateTotalOfRow()
    this.calTotalInvoiceAmount()

    if (+this.Supplier > 0 && this.TicketNo && +this.Routing > 0 && this.Remark && this.Date && +this.Fare > 0) {
      this.calculateAllTotal()
    } else {
      this.backtrackCalc()
    }
  }

  backtrackCalc () {
    let totalDiscount = 0
    let totalFare = 0
    let Commission = 0
    let OtherCharge = 0
    for (let i = 0; i < this.items.length; i++) {
      totalDiscount = totalDiscount + +this.items[i].discountAmount
      totalFare = totalFare + +this.items[i].Fare
      Commission = Commission + +this.items[i].CommissionAmount
      OtherCharge = OtherCharge +
      (isNaN(+this.items[i].ReIssueCharges) ? 0 : +this.items[i].ReIssueCharges) +
      (isNaN(+this.items[i].RefundPanelty) ? 0 : +this.items[i].RefundPanelty) +
      (isNaN(+this.items[i].Miscellaneouse) ? 0 : +this.items[i].Miscellaneouse) +
      (isNaN(+this.items[i].LangiTax) ? 0 : +this.items[i].LangiTax) +
      (isNaN(+this.items[i].SvcFee) ? 0 : +this.items[i].SvcFee)
    }
    this.totalDiscount = totalDiscount
    this.totalFare = totalFare
    this.Commission = Commission
    this.OtherCharge = OtherCharge

    this.calTotalInvoiceAmount()
  }

  calculateTotalOfRow () {
    let totalAmount = 0
    for (let i = 0; i < this.items.length; i++) {
      totalAmount = +totalAmount + +this.items[i].TotalAmount
    }
    if (!this.clickItem) {
      if (this.TotalAmount !== 0 && typeof this.TotalAmount !== 'undefined' && !isNaN(+this.TotalAmount)) {
        totalAmount = totalAmount + +this.TotalAmount
      }
    }
    if (!isNaN(totalAmount)) {
      this.RoundOff = +(Math.round(totalAmount) - totalAmount).toFixed(2)
      this.CessAmount = totalAmount
      this.totalBillAmount = Math.round(totalAmount)
      // this.checkValidationForAmount()
      // console.log('items : ', this.items)
    }
  }

  calculateTotal () {
    const totalAmount = (isNaN(+this.Fare) ? 0 : +this.Fare)
     - (isNaN(+this.discountAmount) ? 0 : +this.discountAmount)
    + (isNaN(+this.taxAmount) ? 0 : +this.taxAmount)
    + (isNaN(+this.ReIssueCharges) ? 0 : +this.ReIssueCharges)
    + (isNaN(+this.RefundPanelty) ? 0 : +this.RefundPanelty)
    + (isNaN(+this.Miscellaneouse) ? 0 : +this.Miscellaneouse)
    + (isNaN(+this.LangiTax) ? 0 : +this.LangiTax)
    + (isNaN(+this.SvcFee) ? 0 : +this.SvcFee)
    + (isNaN(+this.Commtoauthorizor) ? 0 : +this.Commtoauthorizor)
    return isNaN(totalAmount) ? 0 : totalAmount
  }

  deleteItem (i, forArr) {
    if (forArr === 'trans') {
      this.transactions.splice(i,1)
      this.checkValidationForAmount()
    }
    if (forArr === 'items') {
      this.items.splice(i,1)
      this.calculateAllTotal()
      this.calculateTotalOfRow()
    }
  }
  // bank

  newCustAddSub: Subscription
  newVendAddSub: Subscription
  newRoutingAddSub: Subscription
  newLedgerAddSub: Subscription

  ngOnInit () {
    this.initComp()
  }

  initComp () {
    this.initialiseItem()
    this.initialiseTransaction()
    this.initialiseParams()
  }

  ngOnDestroy () {
    this.modalOpen.unsubscribe()
    this.newCustAddSub.unsubscribe()
    this.newVendAddSub.unsubscribe()
    this.newRoutingAddSub.unsubscribe()
    this.newLedgerAddSub.unsubscribe()
    this.items = []
    this.transactions = []
  }

  openModal () {
    this.initComp()
    this.getCurrency()
  }

  closeModal () {
    this.initComp()
    if ($('#salerout').length > 0) {
      $('#salerout').removeClass('fadeInDown')
      $('#salerout').addClass('fadeOut')
      $('#salerout').modal(UIConstant.MODEL_HIDE)
    }
  }

  closeInvoice () {
    this.commonService.closeInvoice()
  }

  getCurrency () {
    let _self = this
    this.getAvailableCurrency().toPromise().then(
      (data: ResponseSale) => {
        if (data.Code === UIConstant.THOUSAND) {
          _self.setupModules = data.Data.SetupModules[0]
          console.log('settings : ', data.Data)
          if (!_self.editMode) {
            if (!_self.setupModules.IsBillNoManual) {
              _self.BillNo = _self.setupModules.BillNo
            }
          }
          if (!_self.editMode) {
            _self.setBillDate()
          }
          _self.setPayDate()
          _self.setTravelDate()
          _self.setReturnDate()
          let currencies = data.Data.SetupSettings
          _self.placeholderCurreny = { placeholder: 'Select Currency' }
          let newData = []
          currencies.forEach(element => {
            if (+element.SetupId === SetUpIds.currency && +element.Type === SetUpIds.multiple) {
              if (+element.Id !== 0 && +element.Id === +element.DefaultValue && !_self.editMode) {
                _self.defaultCurrency = element.Val
                _self.currencyValues[1] = { id: 1, symbol: _self.defaultCurrency }
              }
              newData.push({
                id: element.Id,
                text: element.Val
              })
            }
          })
          _self.currencies = newData
          _self.isDataAvailable = true
          _self.editMode = false
          $('#salerout').removeClass('fadeOut')
          $('#salerout').addClass('fadeInDown')
          $('#salerout').modal(UIConstant.MODEL_SHOW)
          setTimeout(() => {
            if (this.id !== 0) {
              this.clientSelect2.setElementValue(this.other.ClientName)
              this.currencySelect2.setElementValue(this.other.CurrencyId)
            } else {
              this.CurrencyId = +_self.currencies[0].id
              this.currencySelect2.setElementValue(_self.currencies[0].id)
            }
            if (this.clientSelect2) {
              const element = this.renderer.selectRootElement(this.clientSelect2.selector.nativeElement, true)
              element.focus({ preventScroll: false })
            }
          }, 1000)
          // console.log('currencies available : ', _self.currencies)
        }
      }
    )
  }

  placeholderCurreny: Select2Options
  currency: any
  defaultCurrency: string
  setupModules: any
  currencyValues: Array<{id: number, symbol: string}> = [{ id: 0, symbol: '%' }]
  isDataAvailable: boolean = false
  getAvailableCurrency () {
    return this.commonService.setupSettingByType(UIConstant.SALE_TYPE)
  }

  onSelectCurrency (evt) {
    // console.log('selected currency : ', evt)
    if (evt.data && evt.data[0].text) {
      this.CurrencyId = evt.value
      this.defaultCurrency = evt.data[0].text
      this.currencyValues[1] = { id: 1, symbol: evt.data[0].text }
      this.checkForValidation()
    }
  }
  
  select2PlaceHlderItem: Select2Options
  itemValueSelect2: any
  routeFareSub: Subscription
  @ViewChild('routing_select2') routingSelect2: Select2Component
  onSelectedRoutingId (event) {
    // console.log('selected route : ', event)
    let _self = this
    if (event.value === '-1' && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
      this.Fare = 0
      this.calculate()
      this.routingSelect2.selector.nativeElement.value = ''
      this.checkForValidation()
      this.commonService.openRouting('')
      this.validateItem()
    } else {
      if (+event.value > 0 && event.data[0] && event.data[0].text) {
        this.routingName = event.data[0].text
        this.Routing = +event.value
        this.validateItem()
        this.checkForValidation()
        this.routeFareSub = this._saleTravelServices.getRouteFare(+event.value).subscribe(
          (route: any) => {
            // console.log('route : ', route)
            _self.Fare = +route.Data[0].SaleRate
            _self.calculate()
            _self.calculatePaymentAmount()
            this.checkForValidation()
          }
        )
      }
    }
  }

  @ViewChild('supplier_select2') supplierSelect2: Select2Component
  onSelectSupplier (event) {
    if (event.value && event.data.length > 0) {
      if (event.value === '-1' && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
        this.supplierSelect2.selector.nativeElement.value = ''
        this.commonService.openVend('', true)
      } else {
        if (+event.value > 0 && event.data[0] && event.data[0].text) {
          this.supplierName = event.data[0].text
          this.Supplier = +event.value
          this.checkForValidation()
        }
      }
    }
    this.validateItem()
  }

  @ViewChild('client_select2') clientSelect2: Select2Component
  onSelected2clientId (event) {
    // console.log('on select of customer : ', event)
    if (event.value && event.data.length > 0) {
      this.clientName = +event.value
      if (+event.value === -1) {
        this.clientSelect2.selector.nativeElement.value = ''
        this.commonService.openCust('', true)
      } else if (+event.value > 0) {
        this.clientName = +event.value
      }
      this.checkForValidation()
    }
  }

  paymentLedgerselect2: Array<Select2OptionData>
  setpaymentLedgerSelect2 (i) {
    this.ledgerPlaceHolder = { placeholder: 'Select Ledger' }
    let newData = [{ id: '0', text: 'Select Ledger' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
    this.commonService.getPaymentLedgerDetail(9).subscribe(data => {
      // console.log('PaymentModeData : ', data)
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        data.Data.forEach(element => {
          newData.push({
            id: element.Id,
            text: element.Name
          })
        })
        newData = Object.assign([], newData)
        this.paymentLedgerselect2 = newData
      }
    },
    (error) => {
      console.log(error)
    },
    () => {
      if (this.editTransId !== -1 && this.transactions[i]) {
        this.Paymode = this.transactions[i].Paymode
        this.PayModeId = this.transactions[i].PayModeId
        this.LedgerId = this.transactions[i].LedgerId
        this.ledgerName = this.transactions[i].ledgerName
        this.Amount = this.transactions[i].Amount
        this.PayDate = this.transactions[i].PayDate
        this.ChequeNo = this.transactions[i].ChequeNo
        this.paymodeSelect2.setElementValue(this.PayModeId)
        this.ledger = this.LedgerId
        this.ledgerSelect2.setElementValue(this.LedgerId)
        this.deleteItem(i, 'trans')
      }
    })
  }

  supplierPlaceHolder: Select2Options
  supplierValue: any
  getPaymentModeDetail (index) {
    this.paymentPlaceHolder = { placeholder: 'Select Payment Mode' }
    let newData = [{ id: '0', text: 'Select Payment Mode' }]
    this.commonService.getPaymentModeDetail().subscribe(data => {
      // console.log('payment data: ', data)
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        data.Data.forEach(element => {
          newData.push({
            id: element.Id,
            text: element.PayModeName
          })
        })
        this.paymentModeSelect2 = newData
      }
    },
    (error) => {
      console.log(error)
    })
  }

  select2PaymentModeId (event) {
    console.log('payment method select: ', event)
    if (event.value && event.data[0] && event.data[0].text) {
      this.Paymode = event.data[0].text
      this.PayModeId = +event.value
      if (event.value === '3') {
        this.ledgerName = ''
        this.LedgerId = 0
        this.setpaymentLedgerSelect2(0)
      } else if (event.value === '1') {
        this.paymentLedgerselect2 = [{ id: '1', text: 'Cash' }]
        this.ledgerName = 'Cash'
        this.LedgerId = 1
        this.ledgerSelect2.setElementValue(this.LedgerId)
      }
    }
    this.validateTransaction()
  }

  selectedTransIndex = 0
  @ViewChild('ledger_select2') ledgerSelect2: Select2Component
  paymentLedgerId (event) {
    console.log('payment ledger id : ', event)
    if (+event.value === -1 && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
      this.ledgerSelect2.selector.nativeElement.value = ''
      this.commonService.openLedger('')
    } else {
      if (+event.value > 0 && event.data[0] && event.data[0].text) {
        this.LedgerId = +event.value
        this.ledgerName = event.data[0].text
      }
    }
    this.validateTransaction()
  }

  private salesTravelParams (): SalesTourism {
    let newBillDate = this.gs.clientToSqlDateFormat(this.BillDate, this.clientDateFormat)
    let newItems = JSON.parse(JSON.stringify(this.items))
    let newTransactions = JSON.parse(JSON.stringify(this.transactions))
    newItems.forEach(item => {
      item.Date = this.gs.clientToSqlDateFormat(item.Date, this.clientDateFormat)
      item.ReturnDate = (item.ReturnDate) ? this.gs.clientToSqlDateFormat(item.ReturnDate, this.clientDateFormat) : ''
    })
    newTransactions.forEach(transaction => {
      transaction.PayDate = this.gs.clientToSqlDateFormat(transaction.PayDate, this.clientDateFormat)
    })
    console.log('items : ', newItems)
    const salesTravelElement = {
      obj: {
        Id: this.id ? this.id : UIConstant.ZERO,
        BillNo: this.BillNo,
        clientName: +this.clientName,
        BillDate: newBillDate,
        BookingNo: this.BookingNo,
        LpoNo: this.LpoNo,
        CurrencyId: +this.CurrencyId,
        Commission: +this.Commission,
        OtherCharge: +this.OtherCharge,
        RoundOff: +this.RoundOff,
        CessAmount: +this.CessAmount,
        travelImports: newItems,
        travelPayments: newTransactions
      } as SalesTourism
    }
    console.log('obj : ', JSON.stringify(salesTravelElement.obj))
    return salesTravelElement.obj
  }

  manipulateData () {
    this.submitSave = true
    this.addItems()
    this.addTransactions()
    this.calculateTotalOfRow()
    this.calculateAllTotal()
    this.validateItem()
    this.validateTransaction()
    this.checkValidationForAmount()
    if (this.checkForValidation() && this.isValidAmount && this.validItem && this.validTransaction) {
      let _self = this
      this._saleTravelServices.postTravelDetails(this.salesTravelParams()).subscribe(
        (data: any) => {
          console.log('post : ', data)
          if (data.Code === UIConstant.THOUSAND) {
            _self.toastrService.showSuccess('success', 'sales added')
            _self.commonService.newSaleAdded()
            _self.initComp()
            if (!this.keepOpen) {
              _self.initialiseExtras()
              _self.commonService.closeInvoice()
            }
          } else {
            _self.toastrService.showError('error', data.Description)
          }
        }
      )
    }
  }

  checkForValidation (): boolean {
    let isValid = 1
    if (+this.clientName > 0) {
      this.invalidObj['clientName'] = false
    } else {
      this.invalidObj['clientName'] = true
      isValid = 0
    }
    if (this.BillNo) {
      this.invalidObj['BillNo'] = false
    } else {
      this.invalidObj['BillNo'] = true
      isValid = 0
    }
    if (this.BillDate) {
      this.invalidObj['BillDate'] = false
    } else {
      this.invalidObj['BillDate'] = true
      isValid = 0
    }
    if (this.BookingNo) {
      this.invalidObj['BookingNo'] = false
    } else {
      this.invalidObj['BookingNo'] = true
      isValid = 0
    }
    if (this.CurrencyId) {
      this.invalidObj['CurrencyId'] = false
    } else {
      this.invalidObj['CurrencyId'] = true
      isValid = 0
    }
    if (this.items.length === 0 && this.submitSave) {
      isValid = 0
      if (+this.Routing > 0) {
        this.invalidObj['Routing'] = false
      } else {
        this.invalidObj['Routing'] = true
        isValid = 0
      }
      if (+this.Supplier > 0) {
        this.invalidObj['Supplier'] = false
      } else {
        this.invalidObj['Supplier'] = true
        isValid = 0
      }
      if (this.Remark) {
        this.invalidObj['Remark'] = false
      } else {
        this.invalidObj['Remark'] = true
        isValid = 0
      }
      if (this.Date) {
        this.invalidObj['Date'] = false
      } else {
        this.invalidObj['Date'] = true
        isValid = 0
      }
      if (this.TicketNo) {
        this.invalidObj['TicketNo'] = false
      } else {
        this.invalidObj['TicketNo'] = true
        isValid = 0
      }
      if (+this.Fare > 0) {
        this.invalidObj['Fare'] = false
      } else {
        this.invalidObj['Fare'] = true
        isValid = 0
      }
    }
    return !!isValid
  }

  getPaymentTotal (): number {
    let paymentTotal = 0
    for (let i = 0; i <= this.transactions.length - 1; i++) {
      paymentTotal = paymentTotal + +this.transactions[i].Amount
    }
    if (!this.clickTrans) {
      if (+this.Amount) {
        paymentTotal += +this.Amount
      }
    }

    return +paymentTotal
  }
  isValidAmount = true
  checkValidationForAmount () {
    let paymentTotal = this.getPaymentTotal()
    paymentTotal = (isNaN(+paymentTotal)) ? 0 : +paymentTotal
    this.totalBillAmount = (isNaN(+this.totalBillAmount)) ? 0 : +this.totalBillAmount
    if (this.totalBillAmount !== 0) {
      if (paymentTotal > this.totalBillAmount) {
        this.toastrService.showError('Error', 'Payment can\'t be more than bill amount')
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

  validateItem () {
    if (this.Supplier || this.TicketNo || this.Routing || this.Remark || this.Date || this.Fare) {
      let isValid = 1
      if (+this.Routing > 0) {
        this.invalidObj['Routing'] = false
      } else {
        isValid = 0
        this.invalidObj['Routing'] = true
      }
      if (+this.Supplier > 0) {
        this.invalidObj['Supplier'] = false
      } else {
        isValid = 0
        this.invalidObj['Supplier'] = true
      }
      if (this.Remark) {
        this.invalidObj['Remark'] = false
      } else {
        isValid = 0
        this.invalidObj['Remark'] = true
      }
      if (this.Date) {
        this.invalidObj['Date'] = false
      } else {
        isValid = 0
        this.invalidObj['Date'] = true
      }
      if (this.TicketNo) {
        this.invalidObj['TicketNo'] = false
      } else {
        isValid = 0
        this.invalidObj['TicketNo'] = true
      }
      if (+this.Fare > 0) {
        this.invalidObj['Fare'] = false
      } else {
        isValid = 0
        this.invalidObj['Fare'] = true
      }
      this.validItem = !!isValid
    } else {
      this.validItem = true
      this.invalidObj['Routing'] = false
      this.invalidObj['Supplier'] = false
      this.invalidObj['Remark'] = false
      this.invalidObj['Date'] = false
      this.invalidObj['TicketNo'] = false
      this.invalidObj['Fare'] = false
    }
  }

  validateTransaction () {
    if (+this.Paymode > 0 || +this.PayModeId > 0 || +this.LedgerId > 0 || this.ledgerName || +this.Amount > 0 || this.ChequeNo) {
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
      if (this.ledgerName) {
        this.invalidObj['ledgerName'] = false
      } else {
        isValid = 0
        this.invalidObj['ledgerName'] = true
      }
      if (+this.Amount > 0) {
        this.invalidObj['Amount'] = false
      } else {
        isValid = 0
        this.invalidObj['Amount'] = true
      }
      if (this.PayDate) {
        this.invalidObj['PayDate'] = false
      } else {
        isValid = 0
        this.invalidObj['PayDate'] = true
      }
      if (+this.PayModeId === 3) {
        if (this.ChequeNo) {
          this.invalidObj['ChequeNo'] = false
        } else {
          isValid = 0
          this.invalidObj['ChequeNo'] = true
        }
      } else {
        this.invalidObj['ChequeNo'] = false
      }
      this.validTransaction = !!isValid
    } else {
      this.validTransaction = true
      this.invalidObj['PayModeId'] = false
      this.invalidObj['LedgerId'] = false
      this.invalidObj['ledgerName'] = false
      this.invalidObj['Amount'] = false
      this.invalidObj['PayDate'] = false
      this.invalidObj['ChequeNo'] = false
    }
    this.clickTrans = false
  }

  onEnterPressItem () {
    this.addItems()
    setTimeout(() => {
      if (this.routingSelect2) {
        this.routingSelect2.selector.nativeElement.focus({ preventScroll: false })
      }
    }, 10)
  }

  @ViewChild('savebutton') savebutton: ElementRef
  onEnterPressTrans () {
    this.addTransactions()
    let paymentTotal = this.getPaymentTotal()
    if (this.totalBillAmount === paymentTotal) {
      this.manipulateData()
    } else {
      setTimeout(() => {
        this.paymodeSelect2.selector.nativeElement.focus({ preventScroll: false })
      }, 10)
    }
  }

  moveToPayments () {
    if (this.paymodeSelect2) {
      this.paymodeSelect2.selector.nativeElement.focus({ preventScroll: false })
    }
  }
}
