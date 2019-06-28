import { Component, ViewChild } from '@angular/core'
import { UIConstant } from '../../../../shared/constants/ui-constant'
import { Subscription } from 'rxjs'
import { AddCust, ResponseSale, SalesReturnTourism, TravelImports, TravelPayments } from '../../../../model/sales-tracker.model'
import { Select2OptionData, Select2Component } from 'ng2-select2'
import { VendorServices } from '../../../../commonServices/TransactionMaster/vendoer-master.services'
import { ItemmasterServices } from '../../../../commonServices/TransactionMaster/item-master.services'
import { ToastrCustomService } from '../../../../commonServices/toastr.service'
import { GlobalService } from '../../../../commonServices/global.service'
import { Settings } from '../../../../shared/constants/settings.constant'
import { SetUpIds } from '../../../../shared/constants/setupIds.constant'
import { CommonService } from '../../../../commonServices/commanmaster/common.services'
import { SaleTravelServices } from '../../sale-travel.services'

declare const $: any
declare const flatpickr: any
@Component({
  selector: 'app-sales-return',
  templateUrl: './sales-return.component.html',
  styleUrls: ['./sales-return.component.css']
})
export class SalesReturnComponent {
  id: number
  ReturnBillDate: string
  ReturnBillNo: string
  clientName: number
  BillDate: string
  BookingNo: string
  CurrencyId: number
  modalOpen: Subscription
  selectAll: boolean = false
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
  SaleTransId: number

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
  selectedItems: any = []
  clientDateFormat: string = ''
  backDateEntry: boolean
  constructor (private _saleTravelServices: SaleTravelServices,
    private _ledgerServices: VendorServices,
    private _itemServices: ItemmasterServices,
    private toastrService: ToastrCustomService,
    private settings: Settings,
    private commonService: CommonService,
    private gs: GlobalService) {

    this.clientNameSelect2 = []
    this.suplierNameSelect2 = []
    this.paymentModeSelect2 = []
    this.select2Item = []
    this.currencies = []
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
    this.getClientName(0)
    this.newCustAddSub = this.commonService.getCustStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.clientNameSelect2)
          newData.push({ id: data.id, text: data.name })
          this.clientNameSelect2 = newData
          this.clientNameId = +data.id
          this.clientName = +data.id
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
        }
      }
    )
    this.newRoutingAddSub = this.commonService.getRoutingStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          console.log('routing added : ', data)
          let newData = Object.assign([], this.select2Item)
          newData.push({ id: data.id, text: data.name })
          this.select2Item = newData
          this.routingId = +data.id
          this.Routing = data.id
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
        }
      }
    )
    this.modalOpen = this.commonService.getSaleReturnStatus().subscribe(
      (status: any) => {
        if (status.open) {
          console.log('status : ', status)
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

  onItemToggle (index, evt) {
    console.log('index : ', index)
    if (this.items.length === 1) {
      this.selectAll = this.items[index].selected
    }
    this.calculateAllTotal()
  }

  toggleSelect (evt) {
    console.log('event : ', evt.target.checked)
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].selected = evt.target.checked
    }
    this.calculateAllTotal()
  }

  closeReturn () {
    this.commonService.closeSaleReturn()
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
    // this.createTransaction(data.PaymentDetails)
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
      this.SaleTransId = element.Id
      this.addItems()
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
    this.ReturnBillNo = others.ReturnBillNo
    this.clientName = others.ClientName
    this.BillDate = this.gs.utcToClientDateFormat(others.Date, this.clientDateFormat)
    this.BookingNo = others.BookingNo
    this.LpoNo = others.Remark
    this.CurrencyId = others.CurrencyId
    this.defaultCurrency = others.Currency
    this.currency = others.Currency
    this.currenyValues.push({ id: 1, symbol: this.defaultCurrency })
    console.log('currency values : ', this.currenyValues)
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
    if (this.Supplier && this.TicketNo && this.Routing && this.Remark && this.Date && this.Fare) {
      if (this.returnDate) {
        if (this.checkForValidReturnDate()) {
          this.calculate()
          this.addItem()
          console.log('items : ', this.items)
          this.calSaleReturn()
          this.initialiseItem()
        }
      } else {
        this.calculate()
        this.addItem()
        console.log('items : ', this.items)
        this.calSaleReturn()
        this.initialiseItem()
      }
    }
  }

  addItem () {
    if (this.items.length === 0) {
      this.items.push({
        Id: 0,
        Sno: 1,
        SupplierId: this.Supplier,
        TicketNo: this.TicketNo,
        RoutingId: this.Routing,
        Remark: this.Remark,
        Date:  this.Date,
        ReturnDate: this.returnDate,
        Fare: this.Fare,
        Discount: this.Discount,
        discountAmount: this.discountAmount,
        TaxAmount: +this.taxAmount,
        ReIssueCharges: +this.ReIssueCharges,
        RefundPanelty: +this.RefundPanelty,
        Miscellaneouse: +this.Miscellaneouse,
        Company: this.Company,
        LangiTax: +this.LangiTax,
        SvcFee: +this.SvcFee,
        Commission: this.Comm,
        CommissionAmount: +this.CommissionAmount,
        Comm: this.Comm,
        Commtoauthorizor: this.Commtoauthorizor,
        CommissionType: this.CommissionType,
        DiscountType: this.DiscountType,
        TotalAmount: this.TotalAmount,
        routingName: this.routingName,
        supplierName: this.supplierName,
        TaxType: '3',
        SaleTransId: this.SaleTransId,
        selected: false
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
        TaxAmount: +this.taxAmount,
        ReIssueCharges: +this.ReIssueCharges,
        RefundPanelty: +this.RefundPanelty,
        Miscellaneouse: +this.Miscellaneouse,
        Company: this.Company,
        LangiTax: +this.LangiTax,
        SvcFee: +this.SvcFee,
        Commission: this.Comm,
        CommissionAmount: +this.CommissionAmount,
        Comm: this.Comm,
        Commtoauthorizor: this.Commtoauthorizor,
        CommissionType: this.CommissionType,
        DiscountType: this.DiscountType,
        TotalAmount: this.TotalAmount,
        routingName: this.routingName,
        supplierName: this.supplierName,
        TaxType: '3',
        SaleTransId: this.SaleTransId,
        selected: false
      })
    }
  }

  // bank
  addTransactions () {
    if (this.Paymode && +this.PayModeId > 0 && +this.LedgerId > 0 && this.ledgerName && +this.Amount > 0 && this.PayDate) {
      if ((+this.PayModeId === 3 && this.ChequeNo) || (+this.PayModeId === 1)) {
        if (this.checkValidationForAmount()) {
          this.addTransaction()
          this.clickTrans = true
          this.initialiseTransaction()
          console.log('transactions : ', this.transactions)
          this.setPayDate()
          this.calculatePaymentAmount()
        }
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
    }, 10)
    if (this.editTransId !== -1) {
      this.transactions[this.transactions.length - 1].Id = this.editTransId
    }
  }

  calculateAllTotal () {
    let totalDiscount = 0
    let totalFare = 0
    let Commission = 0
    let OtherCharge = 0
    let totalOfInvoiceAmt = 0
    let totalAmount = 0
    console.log('items : ', this.items)
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].selected) {
        totalDiscount = totalDiscount + +this.items[i].discountAmount
        totalFare = totalFare + +this.items[i].Fare
        Commission = Commission + +this.items[i].CommissionAmount
        OtherCharge = OtherCharge +
        (isNaN(+this.items[i].ReIssueCharges) ? 0 : +this.items[i].ReIssueCharges) +
        (isNaN(+this.items[i].RefundPanelty) ? 0 : +this.items[i].RefundPanelty) +
        (isNaN(+this.items[i].Miscellaneouse) ? 0 : +this.items[i].Miscellaneouse) +
        (isNaN(+this.items[i].LangiTax) ? 0 : +this.items[i].LangiTax) +
        (isNaN(+this.items[i].SvcFee) ? 0 : +this.items[i].SvcFee)

        totalOfInvoiceAmt = totalOfInvoiceAmt + (isNaN(+this.items[i].Fare) ? 0 : +this.items[i].Fare)
        + (isNaN(+this.items[i].TaxAmount) ? 0 : +this.items[i].TaxAmount)
        - (isNaN(+this.items[i].discountAmount) ? 0 : +this.items[i].discountAmount)
        + (isNaN(+this.items[i].LangiTax) ? 0 : +this.items[i].LangiTax)
        + (isNaN(+this.items[i].SvcFee) ? 0 : +this.items[i].SvcFee)
        + (isNaN(+this.items[i].Commtoauthorizor) ? 0 : +this.items[i].Commtoauthorizor)

        totalAmount = +totalAmount + +this.items[i].TotalAmount
      }
    }
    this.totalDiscount = totalDiscount
    this.totalFare = totalFare
    this.Commission = Commission
    this.OtherCharge = OtherCharge
    this.totalInvoiceAmount = totalOfInvoiceAmt
    if (!isNaN(totalAmount)) {
      this.RoundOff = +(Math.round(totalAmount) - totalAmount).toFixed(2)
      this.CessAmount = totalAmount
      this.totalBillAmount = Math.round(totalAmount)
      this.calculatePaymentAmount()
    }
  }

  calSaleReturn () {
    for (let i = 0; i < this.items.length; i++) {
      const totalAmount = (isNaN(+this.items[i].Fare) ? 0 : +this.items[i].Fare)
      - (isNaN(+this.items[i].discountAmount) ? 0 : +this.items[i].discountAmount)
      + (isNaN(+this.items[i].TaxAmount) ? 0 : +this.items[i].TaxAmount)
      + (isNaN(+this.items[i].ReIssueCharges) ? 0 : +this.items[i].ReIssueCharges)
      + (isNaN(+this.items[i].RefundPanelty) ? 0 : +this.items[i].RefundPanelty)
      + (isNaN(+this.items[i].Miscellaneouse) ? 0 : +this.items[i].Miscellaneouse)
      + (isNaN(+this.items[i].LangiTax) ? 0 : +this.items[i].LangiTax)
      + (isNaN(+this.items[i].SvcFee) ? 0 : +this.items[i].SvcFee)
      + (isNaN(+this.items[i].Commtoauthorizor) ? 0 : +this.items[i].Commtoauthorizor)

      this.items[i].TotalAmount = isNaN(totalAmount) ? 0 : totalAmount
    }
    this.calculateAllTotal()
  }

  calculate () {
    if ('' + this.DiscountType === '0') {
      if (this.Discount && this.Fare) {
        this.discountAmount = (+this.Discount / 100) * (+this.Fare)
      } else {
        this.discountAmount = 0
      }
    } else {
      this.discountAmount = isNaN(+this.Discount) ? 0 : +this.Discount
    }
    if ('' + this.CommissionType === '0') {
      if (this.Comm && this.Fare) {
        this.CommissionAmount = (+this.Comm / 100) * (+this.Fare)
      } else {
        this.CommissionAmount = 0
      }
    } else {
      this.CommissionAmount = isNaN(+this.Comm) ? 0 : +this.Comm
    }
    if (+this.taxAmount === 0) {
      this.taxAmount = isNaN(+this.taxAmount) ? 0 : +this.taxAmount
    }
    this.TotalAmount = +this.calcullateTotalOfRow()
  }

  calcullateTotalOfRow () {
    const totalAmount = (isNaN(+this.Fare) ? 0 : +this.Fare)
     - (isNaN(+this.discountAmount) ? 0 : +this.discountAmount)
    + (isNaN(+this.taxAmount) ? 0 : +this.taxAmount)
    + (isNaN(+this.ReIssueCharges) ? 0 : +this.ReIssueCharges)
    + (isNaN(+this.RefundPanelty) ? 0 : +this.RefundPanelty)
    + (isNaN(+this.Miscellaneouse) ? 0 : +this.Miscellaneouse)
    + (isNaN(+this.LangiTax) ? 0 : +this.LangiTax)
    + (isNaN(+this.SvcFee) ? 0 : +this.SvcFee)
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
    }
  }

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
    if ($('#sale-return').length > 0) {
      $('#sale-return').removeClass('fadeInDown')
      $('#sale-return').addClass('fadeOut')
      $('#sale-return').modal(UIConstant.MODEL_HIDE)
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
          _self.backDateEntry = !!(_self.setupModules.IsBackDateEntryAllow)
          console.log('set up modules : ', _self.setupModules)
          _self.ReturnBillNo = _self.setupModules.BillNo
          _self.setPayDate()
          _self.setReturnBillDate()
          _self.isDataAvailable = true
          _self.editMode = false
          $('#sale-return').removeClass('fadeOut')
          $('#sale-return').addClass('fadeInDown')
          $('#sale-return').modal(UIConstant.MODEL_SHOW)
          if (this.id !== 0) {
            setTimeout(() => {
              this.clientSelect2.setElementValue(this.other.ClientName)
            }, 100)
          }
        }
      }
    )
  }

  placeholderCurreny: Select2Options
  currency: any
  defaultCurrency: string
  setupModules: any
  currenyValues: Array<{id: number, symbol: string}> = [{ id: 0, symbol: '%' }]
  isDataAvailable: boolean = false
  getAvailableCurrency () {
    return this.commonService.setupSettingByType(UIConstant.SALE_RETURN)
  }

  onSelectCurrency (evt) {
    console.log('selected curreny : ', evt)
    if (evt.data && evt.data[0].text) {
      this.CurrencyId = evt.value
      this.defaultCurrency = evt.data[0].text
      this.currenyValues[1] = { id: 1, symbol: evt.data[0].text }
      this.checkForValidation()
    }
  }

  select2PlaceHlderItem: Select2Options
  itemValueSelect2: any
  getItemDetail () {
    this.select2PlaceHlderItem = { placeholder: 'Select Routing' }
    this.select2Item = [{ id: UIConstant.BLANK, text: 'Select Routing' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
    this._itemServices.getItemMasterDetail('').subscribe(data => {
      console.log('routing data : ', data)
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        data.Data.forEach(element => {
          this.select2Item.push({
            id: element.Id,
            text: element.Name
          })
        })
      }
    },
    (error) => {
      console.log(error)
    },
    () => {
      this.getPaymentModeDetail(0)
    })
  }
  routeFareSub: Subscription
  @ViewChild('routing_select2') routingSelect2: Select2Component
  onSelectedRoutingId (event) {
    console.log('selected route : ', event)
    let _self = this
    if (event.value === '-1' && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
      this.Fare = 0
      this.calculate()
      this.routingSelect2.selector.nativeElement.value = ''
      this.checkForValidation()
      this.commonService.openRouting('')
      this.validateItem()
    } else {
      if (+event.value >= 0 && event.data[0] && event.data[0].text) {
        this.routingName = event.data[0].text
        this.Routing = event.value
        this.validateItem()
        this.checkForValidation()
        this.routeFareSub = this._saleTravelServices.getRouteFare(+event.value).subscribe(
          (route: any) => {
            console.log('route : ', route)
            _self.Fare = +route.Data[0].SaleRate
            _self.calculate()
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
        if (event.data[0] && event.data[0].text) {
          this.supplierName = event.data[0].text
          this.Supplier = event.value
          this.checkForValidation()
        }
      }
    }
    this.validateItem()
  }

  @ViewChild('client_select2') clientSelect2: Select2Component
  onSelected2clientId (event) {
    if (event.value && event.data.length > 0) {
      if (event.value === '-1' && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
        this.clientSelect2.selector.nativeElement.value = ''
        this.commonService.openCust('', true)
      } else {
        this.clientName = +event.value
        this.checkForValidation()
      }
    }
  }

  paymentLedgerselect2: Array<Select2OptionData>
  setpaymentLedgerSelect2 (i) {
    this.ledgerPlaceHolder = { placeholder: 'Select Ledger' }
    let newData = [{ id: UIConstant.BLANK, text: 'Select Ledger' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
    this.commonService.getPaymentLedgerDetail(9).subscribe(data => {
      console.log('PaymentModeData : ', data)
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
  getClientName (value) {
    this.clientnamePlaceHolder = { placeholder: 'Select ClientName' }
    let newData = [{ id: UIConstant.BLANK, text: 'Select Client Name' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
    this._ledgerServices.getVendor(5, '').subscribe(data => {
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        if (data.Data.length > 0) {
          data.Data.forEach(element => {
            newData.push({
              id: element.Id,
              text: element.Name
            })
          })
        }
        this.clientNameSelect2 = newData
      }
    },
    (error) => {
      console.log(error)
    },
    () => {
      this.getSuplier(0)
    })
  }

  supplierPlaceHolder: Select2Options
  supplierValue: any
  getSuplier (value) {
    this.supplierPlaceHolder = { placeholder: 'Select Supplier' }
    this.suplierNameSelect2 = [{ id: UIConstant.BLANK, text: 'Select Supplier' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
    this._ledgerServices.getVendor(4, '').subscribe(data => {
      console.log('supplier data : ', data)
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        if (data.Data.length > 0) {
          data.Data.forEach(element => {
            this.suplierNameSelect2.push({
              id: element.Id,
              text: element.Name
            })
          })
        }
      }
    },
    (error) => {
      console.log(error)
    },
    () => {
      this.getItemDetail()
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
      this.PayModeId = event.value
      if (event.value === '3') {
        this.Amount = 0
        this.setpaymentLedgerSelect2(0)
      } else if (event.value === '1') {
        this.paymentLedgerselect2 = [{ id: '1', text: 'Cash' }]
        this.ledgerSelect2.setElementValue(1)
        this.LedgerId = 1
        this.ledgerName = 'Cash'
        this.Amount = this.totalBillAmount
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
      if (event.value && event.data[0] && event.data[0].text) {
        this.LedgerId = event.value
        this.ledgerName = event.data[0].text
      }
    }
    this.validateTransaction()
  }

  private salesTravelParams (): SalesReturnTourism {
    let newBillDate = this.gs.clientToSqlDateFormat(this.BillDate, this.clientDateFormat)
    let newReturnBillDate = this.gs.clientToSqlDateFormat(this.ReturnBillDate, this.clientDateFormat)
    let newItems = JSON.parse(JSON.stringify(this.items))
    let itemToSend = []
    newItems.forEach(item => {
      if (item.selected) {
        item.Date = this.gs.clientToSqlDateFormat(item.Date, this.clientDateFormat)
        item.ReturnDate = this.gs.clientToSqlDateFormat(item.ReturnDate, this.clientDateFormat)
        itemToSend.push(item)
      }
    })
    let newTransactions = JSON.parse(JSON.stringify(this.transactions))
    newTransactions.forEach(transaction => {
      transaction.PayDate = this.gs.clientToSqlDateFormat(transaction.PayDate, this.clientDateFormat)
    })
    const salesTravelElement = {
      obj: {
        Id: UIConstant.ZERO,
        SaleId: this.id,
        ReturnBillNo: this.ReturnBillNo,
        clientName: +this.clientName,
        BillDate: newBillDate,
        ReturnBillDate: newReturnBillDate,
        BookingNo: this.BookingNo,
        LpoNo: this.LpoNo,
        CurrencyId: +this.CurrencyId,
        Commission: +this.Commission,
        OtherCharge: +this.OtherCharge,
        RoundOff: +this.RoundOff,
        CessAmount: +this.CessAmount,
        travelImports: itemToSend,
        travelPayments: newTransactions
      } as SalesReturnTourism
    }
    console.log('obj : ', JSON.stringify(salesTravelElement.obj))
    return salesTravelElement.obj
  }

  manipulateData () {
    this.submitSave = true
    this.addTransactions()
    this.validateItem()
    this.validateTransaction()
    // this.checkValidationForAmount()
    let dataToSend = this.salesTravelParams()
    if (dataToSend.travelImports.length === 0) {
      this.toastrService.showError('Please select atleast 1 Ticket', '')
    } else {
      if (this.checkForValidation() && this.isValidAmount && this.validTransaction) {
        let _self = this
        this._saleTravelServices.postSaleReturn(dataToSend).subscribe(
          (data: any) => {
            console.log('post : ', data)
            if (data.Code === UIConstant.THOUSAND) {
              _self.toastrService.showSuccess('success', 'sales added')
              _self.initComp()
              _self.commonService.closeSaleReturn()
            } else {
              _self.toastrService.showError('error', data.Description)
            }
          }
        )
      }
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
    if (this.ReturnBillNo) {
      this.invalidObj['ReturnBillNo'] = false
    } else {
      this.invalidObj['ReturnBillNo'] = true
      isValid = 0
    }
    if (this.ReturnBillDate) {
      this.invalidObj['ReturnBillDate'] = false
    } else {
      this.invalidObj['ReturnBillDate'] = true
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
    if (+this.CurrencyId > 0) {
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

  isValidAmount = true
  checkValidationForAmount () {
    let paymentTotal = 0
    for (let i = 0; i <= this.transactions.length - 1; i++) {
      paymentTotal = paymentTotal + +this.transactions[i].Amount
    }
    if (!this.clickTrans) {
      if (+this.Amount) {
        paymentTotal += +this.Amount
      }
    }
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
    if (+this.Supplier > 0 || this.TicketNo || +this.Routing > 0 || this.Remark || this.Date || +this.Fare > 0) {
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
    }
  }

  validateTransaction () {
    if (this.Paymode || +this.PayModeId > 0 || +this.LedgerId > 0) {
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
    this.SaleTransId = 0
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
    this.PayDate = ''
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
    this.BillDate = ''
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
    this.currenyValues = [{ id: 0, symbol: '%' }]
    this.defaultCurrency = ''
    this.submitSave = false
    this.clickItem = false
    this.clickTrans = false
    this.isValidAmount = true
    this.selectAll = false
    this.items = []
    this.transactions = []
    this.selectedItems = []
    if (this.clientSelect2) {
      this.clientSelect2.setElementValue('')
    }
    if (this.currencySelect2) {
      this.currencySelect2.setElementValue('')
    }
  }

  initialiseExtras () {
    this.ReturnBillNo = ''
    this.setupModules = {}
  }

  setPayDate () {
    this.PayDate = this.gs.getDefaultDate(this.clientDateFormat)
  }

  setReturnBillDate () {
    this.ReturnBillDate = this.gs.getDefaultDate(this.clientDateFormat)
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

  onEnterPressTrans (e: KeyboardEvent) {
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
    return paymentTotal
  }
}
