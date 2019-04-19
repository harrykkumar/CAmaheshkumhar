import { Component, ViewChild } from '@angular/core'
import { Subscription } from 'rxjs'
import { Select2OptionData, Select2Component } from 'ng2-select2'
import { CourierParcelItem, TravelPayments, AddCust, ResponseSale, SaleCourierParcel } from '../../../model/sales-tracker.model'
import { UIConstant } from '../../../shared/constants/ui-constant'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
import { SalesCourierParcelServices } from '../../sale-courier-parcel.services'
import { VendorServices } from '../../../commonServices/TransactionMaster/vendoer-master.services'
import { ToastrCustomService } from '../../../commonServices/toastr.service'
import { Settings } from '../../../shared/constants/settings.constant'
import { GlobalService } from '../../../commonServices/global.service'
import { SetUpIds } from '../../../shared/constants/setupIds.constant'

declare var $: any
declare var flatpickr: any
@Component({
  selector: 'app-sales-invoice',
  templateUrl: './sales-invoice.component.html',
  styleUrls: ['./sales-invoice.component.css']
})
export class SalesInvoiceComponent {
  BillNo: string
  SenderId: number
  ReceiverId: number
  InvoiceDate: string
  CurrencyId: number
  BillAmount: number
  RoundOff: number
  EwayBillNo: string
  ParcelBy: number
  OtherCharge: number
  Customduty: number
  Destination: number
  OnlineOrder: number
  TotalBox: number
  BoxCharge: number
  TotalWeight: number
  TotalKg: number
  Rate: number

  Description: string
  Quantity: number
  UnitPrice: number
  TotalAmount: number

  Paymode: string
  PayModeId: number
  LedgerId: number
  ledgerName: string
  Amount: number
  PayDate: string
  ChequeNo: string
  paymode: any

  ParcelLength: number
  ParcelHeight: number
  ParcelWidth: number
  items: CourierParcelItem[]
  transactions: TravelPayments[]

  clientNameSelect2: Array<Select2OptionData>
  suplierNameSelect2: Array<Select2OptionData>
  paymentModeSelect2: Array<Select2OptionData>
  parcelBySelect2: Array<Select2OptionData>
  destinationSelect2: Array<Select2OptionData>
  currenciesSelect2: Array<Select2OptionData>
  paymentLedgerselect2: Array<Select2OptionData>

  clientnamePlaceHolder: Select2Options
  paymentPlaceHolder: Select2Options
  ledgerPlaceHolder: Select2Options
  supplierPlaceHolder: Select2Options
  currencyPlaceholder: Select2Options
  destinationPlaceholder: Select2Options
  parcelByPlaceHolder: Select2Options

  newCustAddSub: Subscription
  newVendAddSub: Subscription
  newLedgerAddSub: Subscription
  subscribe: Subscription
  modalOpen: Subscription
  clickItem: boolean = false
  clickTrans: boolean = false
  isValidAmount: boolean = true
  keepOpen: boolean
  submitSave: boolean = false
  editMode: boolean = false
  id: number = UIConstant.ZERO
  editTransId: number
  editItemId: number
  clientDateFormat: string = ''
  constructor (private saleService: SalesCourierParcelServices,
    private commonService: CommonService,
    private _ledgerServices: VendorServices,
    private toastrService: ToastrCustomService,
    private settings: Settings,
    private gs: GlobalService) {

    this.clientNameSelect2 = []
    this.suplierNameSelect2 = []
    this.paymentModeSelect2 = []
    this.destinationSelect2 = []
    this.parcelBySelect2 = []
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
    this.getClientName(0)
    this.newCustAddSub = this.commonService.getCustStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.clientNameSelect2)
          newData.push({ id: data.id, text: data.name })
          this.clientNameSelect2 = newData
          this.clientNameId = data.id
          this.SenderId = data.id
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
          this.ReceiverId = data.id
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

  ngOnInit () {
    this.initComp()
  }

  getEditData () {
    console.log('edit id : ', this.id)
    this.saleService.getCourierEditData(this.id).subscribe((data) => {
      console.log('edit data : ', data)
      this.openModal()
      this.createForm(data.Data)
    })
  }

  createForm (data) {
    this.createItems(data.Items)
    this.createTransaction(data.PaymentDetails)
    this.createOther(data.Manuals[0])
  }

  createItems (travelImports) {
    travelImports.forEach(element => {
      this.Description = element.Description
      this.UnitPrice = +element.UnitPrice
      this.Quantity = +element.Quantity
      this.TotalAmount = +element.TotalAmount
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
    this.SenderId = +others.SenderId
    this.ReceiverId = +others.ReceiverId
    this.InvoiceDate = this.gs.utcToClientDateFormat(others.InvoiceDate, this.clientDateFormat)
    this.CurrencyId = +others.CurrencyId
    this.EwayBillNo = others.EwayBillNo
    this.Destination = +others.Destination
    this.ParcelBy = +others.ParcelBy
    this.ParcelHeight = +others.ParcelHeight
    this.ParcelLength = +others.ParcelLength
    this.ParcelWidth = +others.ParcelWidth
    this.TotalWeight = +others.TotalWeight
    this.OtherCharge = +others.OtherCharge
    this.Customduty = +others.Customduty
    this.TotalBox = +others.TotalBox
    this.BoxCharge = +others.BoxCharge
    this.TotalKg = +others.TotalKg
    this.Rate = +others.Rate
    this.BillAmount = +others.BillAmount
    this.RoundOff = +others.RoundOff
    this.other = others
    this.calculate()
  }

  @ViewChild('paymode_select2') paymodeSelect2: Select2Component
  editItem (i, editId, type) {
    if (type === 'trans' && !this.editTransId) {
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
    }
    if (type === 'items' && !this.editItemId) {
      this.editItemId = editId
      i = i - 1
      this.Description = this.items[i].Description
      this.UnitPrice = this.items[i].UnitPrice
      this.Quantity = this.items[i].Quantity
      this.TotalAmount = this.items[i].TotalAmount
      this.deleteItem(i, type)
    }
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
        if (data.Code === UIConstant.THOUSAND && data.Data.SetupModules.length > 0) {
          _self.setupModules = data.Data.SetupModules[0]
          if (!_self.editMode) {
            if (!_self.setupModules.IsBillNoManual) {
              _self.BillNo = _self.setupModules.BillNo
            }
          }
          if (!_self.editMode) {
            _self.setBillDate()
          }
          _self.setPayDate()
          let currencies = data.Data.SetupSettings
          _self.currenciesSelect2 = []
          _self.currencyPlaceholder = { placeholder: 'Select Currency' }
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
          _self.currenciesSelect2 = newData
          _self.isDataAvailable = true
          _self.editMode = false
          $('#sale_courier_parcel_form').modal(UIConstant.MODEL_SHOW)
          if (this.id !== 0) {
            setTimeout(() => {
              this.clientSelect2.setElementValue(this.other.SenderId)
              this.currencySelect2.setElementValue(this.other.CurrencyId)
              this.supplierSelect2.setElementValue(this.other.ReceiverId)
              this.destSelect2.setElementValue(this.other.Destination)
              this.parcelbySelect2.setElementValue(this.other.ParcelBy)
            }, 1000)
          }
          console.log('currencies available : ', _self.currenciesSelect2)
        }
      }
    )
  }

  addItems () {
    if (this.Description && this.UnitPrice && this.TotalAmount && this.Quantity) {
      this.addItem()
      this.clickItem = true
      console.log('items : ', this.items)
      this.initialiseItem()
    }
  }

  addItem () {
    if (this.items.length === 0) {
      this.items.push({
        Id: 0,
        Sno: 1,
        UnitId: 1,
        Description:  this.Description,
        UnitPrice: +this.UnitPrice,
        Quantity: +this.Quantity,
        TotalAmount: +this.TotalAmount
      })
    } else {
      let index = +this.items[this.items.length - 1].Sno + 1
      this.items.push({
        Id: 0,
        Sno: index,
        UnitId: 1,
        Description:  this.Description,
        UnitPrice: +this.UnitPrice,
        Quantity: +this.Quantity,
        TotalAmount: +this.TotalAmount
      })
    }
  }

  initialiseItem () {
    this.Description = ''
    this.UnitPrice = 0
    this.Quantity = 0
    this.TotalAmount = 0
    this.clickItem = false
    this.editItemId = 0
  }

  initialiseTransaction () {
    this.Paymode = ''
    this.PayModeId = 0
    this.LedgerId = 0
    this.Amount = 0
    this.PayDate = ''
    this.ChequeNo = ''
    this.bankName = ''
    this.paymode = ''
    this.ledgerName = ''
    this.editTransId = 0
    if (this.paymentSelect2 && this.paymentSelect2.selector.nativeElement.value) {
      this.paymentSelect2.setElementValue('')
    }
    if (this.ledgerSelect2 && this.ledgerSelect2.selector.nativeElement.value) {
      this.ledgerSelect2.setElementValue('')
    }
    this.clickTrans = false
  }

  @ViewChild('currency_select2') currencySelect2: Select2Component
  @ViewChild('parcelby_select2') parcelbySelect2: Select2Component
  @ViewChild('dest_select2') destSelect2: Select2Component
  initialiseParams () {
    this.items = []
    this.transactions = []
    this.invalidObj = {}
    this.submitSave = false
    this.clickItem = false
    this.clickTrans = false
    this.isValidAmount = true
    this.InvoiceDate = this.gs.getDefaultDate(this.clientDateFormat)
    this.CurrencyId = 0
    this.SenderId = 0
    this.ReceiverId = 0
    this.RoundOff = 0
    this.BillAmount = 0
    this.currency = ''

    this.EwayBillNo = ''
    this.ParcelBy = 0
    this.OtherCharge = 0
    this.Customduty = 0
    this.Destination = 0
    this.OnlineOrder = 0
    this.TotalBox = 0
    this.BoxCharge = 0
    this.TotalWeight = 0
    this.TotalKg = 0
    this.Rate = 0

    this.parcelBy = ''
    this.destination = ''

    this.ParcelLength = 0
    this.ParcelHeight = 0
    this.ParcelWidth = 0

    if (this.clientSelect2 && this.clientSelect2.selector.nativeElement.value) {
      this.clientSelect2.setElementValue('')
    }
    if (this.supplierSelect2 && this.supplierSelect2.selector.nativeElement.value) {
      this.supplierSelect2.setElementValue('')
    }
    if (this.currencySelect2 && this.currencySelect2.selector.nativeElement.value) {
      this.currencySelect2.setElementValue('')
    }
    if (this.parcelbySelect2 && this.parcelbySelect2.selector.nativeElement.value) {
      this.parcelbySelect2.setElementValue('')
    }
    if (this.destSelect2 && this.destSelect2.selector.nativeElement.value) {
      this.destSelect2.setElementValue('')
    }
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
    this.InvoiceDate = _self.gs.getDefaultDate(_self.clientDateFormat)
  }

  clearExtras () {
    this.setupModules = {}
    this.currenyValues = [{ id: '0', symbol: '%' }]
    this.clientNameId = ''
    this.supplierId = ''
    this.BillNo = ''
  }

  calculateTotalOfRow () {
    this.UnitPrice = (isNaN(+this.UnitPrice)) ? 0 : +this.UnitPrice
    this.Quantity = (isNaN(+this.Quantity)) ? 0 : +this.Quantity
    this.TotalAmount = this.UnitPrice * this.Quantity
  }

  calculate () {
    let totalAmount = 0
    this.TotalBox = (isNaN(+this.TotalBox)) ? 0 : +this.TotalBox
    this.BoxCharge = (isNaN(+this.BoxCharge)) ? 0 : +this.BoxCharge
    this.OtherCharge = (isNaN(+this.OtherCharge)) ? 0 : +this.OtherCharge
    this.Customduty = (isNaN(+this.Customduty)) ? 0 : +this.Customduty
    this.Rate = (isNaN(+this.Rate)) ? 0 : +this.Rate
    this.TotalKg = (isNaN(+this.TotalKg)) ? 0 : +this.TotalKg
    if (this.TotalBox && this.BoxCharge) {
      totalAmount += +this.TotalBox * +this.BoxCharge
    }
    if (this.OtherCharge) {
      totalAmount += +this.OtherCharge
    }
    if (this.Customduty) {
      totalAmount += +this.Customduty
    }
    if (this.Rate && this.TotalKg) {
      totalAmount += +this.Rate * +this.TotalKg
    }
    if (!isNaN(totalAmount)) {
      this.RoundOff = +(Math.round(totalAmount) - totalAmount).toFixed(2)
      this.BillAmount = Math.round(totalAmount)
    }

    this.checkValidation()
  }

  deleteItem (i, forArr) {
    if (forArr === 'trans') {
      this.transactions.splice(i,1)
      this.checkValidationForAmount()
    }
    if (forArr === 'items') {
      this.items.splice(i,1)
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
    if (this.Paymode && this.PayModeId && this.LedgerId && this.ledgerName && this.Amount && this.PayDate && this.ChequeNo) {
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
      if (+this.Amount) {
        paymentTotal += +this.Amount
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
        this.ReceiverId = event.value
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
        this.SenderId = event.value
        this.checkValidation()
      }
    }
  }
  bankName: any
  setpaymentLedgerSelect2 (i) {
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
    },
    (error) => console.log(error),
    () => {
      if (this.editTransId) {
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
      }
    })
  }

  getClientName (value) {
    this.clientnamePlaceHolder = { placeholder: 'Select ClientName' }
    let newData = [{ id: UIConstant.BLANK, text: 'Select Client Name' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
    this._ledgerServices.getVendor(5).subscribe(data => {
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
        console.log('customers : ', this.clientNameSelect2)
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
    this.getCurrency()
  }

  closeModal () {
    if ($('#sale_courier_parcel_form').length > 0) {
      $('#sale_courier_parcel_form').modal(UIConstant.MODEL_HIDE)
    }
  }

  closeInvoice () {
    this.commonService.closeInvoice()
  }

  supplierValue: any
  getSuplier (value) {
    this.supplierPlaceHolder = { placeholder: 'Select Supplier' }
    let newData = [{ id: UIConstant.BLANK, text: 'Select Supplier' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
    this._ledgerServices.getVendor(4).subscribe(data => {
      console.log('data: ', data)
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        if (data.Data.length > 0) {
          data.Data.forEach(element => {
            newData.push({
              id: element.Id,
              text: element.Name
            })
          })
        }
      }
      this.suplierNameSelect2 = newData
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
    let _self = this
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
      _self.paymentModeSelect2 = newData
      console.log('paymentModeSelect2 : ', this.paymentModeSelect2)
    },
    (error) => {
      console.log(error)
    },
    () => {
      this.getDestinations()
    })
  }

  getDestinations () {
    let _self = this
    this.destinationPlaceholder = { placeholder: 'Select Destination' }
    let newData = [{ id: UIConstant.BLANK, text: 'Select Destination' }]
    this.commonService.getCountryList().subscribe(
      (data: ResponseSale) => {
        console.log('destination : ', data)
        if (data.Code === UIConstant.THOUSAND && data.Data) {
          data.Data.forEach(element => {
            newData.push({
              id: element.Id,
              text: element.CommonDesc
            })
          })
        }
        _self.destinationSelect2 = newData
        console.log('destinationSelect2 : ', _self.destinationSelect2)
      },
      (error) => {
        console.log(error)
      },
      () => {
        this.getParcelByList()
      }
    )
  }

  getParcelByList () {
    let _self = this
    this.parcelByPlaceHolder = { placeholder: 'Select Parcel By' }
    let newData = [{ id: UIConstant.BLANK, text: 'Select Parcel By' }]
    this.saleService.getParcelByList().subscribe(
      (data: ResponseSale) => {
        console.log('parcel by : ', data)
        if (data.Code === UIConstant.THOUSAND && data.Data) {
          data.Data.forEach(element => {
            newData.push({
              id: element.Id,
              text: element.CommonDesc
            })
          })
        }
        _self.parcelBySelect2 = newData
        console.log('parcelBySelect2 : ', _self.parcelBySelect2)
      },
      (error) => {
        console.log(error)
      }
    )
  }

  destination: string = ''
  onSelectDestination (evt) {
    console.log('selected destination : ', evt)
    if (evt.data && evt.data.length > 0 && evt.data[0].text) {
      this.Destination = evt.value
      this.checkValidation()
    }
  }

  parcelBy: string = ''
  onSelectParcel (evt) {
    console.log('selected parcel : ', evt)
    if (evt.data && evt.data.length > 0 && evt.data[0].text) {
      this.ParcelBy = evt.value
      this.checkValidation()
    }
  }

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
  selectedTransIndex = 0
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

  currency: any
  defaultCurrency: string
  setupModules: any
  currenyValues: Array < { id: string, symbol: string } > = [{ id: '0', symbol: '%' }]
  isDataAvailable: boolean = false
  getAvailableCurrency () {
    return this.commonService.getSaleSettings()
  }

  onSelectCurrency (evt) {
    console.log('selected currency : ', evt)
    if (evt.data && evt.data.length > 0 && evt.data[0].text && evt.data[0].id) {
      this.CurrencyId = evt.value
      this.checkValidation()
    }
  }

  private salesCourierParams (): SaleCourierParcel {
    this.InvoiceDate = this.gs.clientToSqlDateFormat(this.InvoiceDate, this.clientDateFormat)
    this.transactions.forEach(transaction => {
      transaction.PayDate = this.gs.clientToSqlDateFormat(transaction.PayDate, this.clientDateFormat)
    })
    const salesTravelElement = {
      obj: {
        Id: this.id ? this.id : UIConstant.ZERO,
        BillNo: this.BillNo,
        SenderId: +this.SenderId,
        ReceiverId: +this.ReceiverId,
        InvoiceDate: this.InvoiceDate,
        CurrencyId: +this.CurrencyId,
        EwayBillNo: this.EwayBillNo,
        Destination: +this.Destination,
        ParcelBy: +this.ParcelBy,
        ParcelHeight: +this.ParcelHeight,
        ParcelLength: +this.ParcelLength,
        ParcelWidth: +this.ParcelWidth,
        TotalWeight: +this.TotalWeight,
        OtherCharge: +this.OtherCharge,
        Customduty: +this.Customduty,
        TotalBox: +this.TotalBox,
        BoxCharge: +this.BoxCharge,
        TotalKg: +this.TotalKg,
        Rate: +this.Rate,
        BillAmount: this.BillAmount,
        RoundOff: this.RoundOff,
        Items: this.items,
        PaymentDetail: this.transactions
      } as SaleCourierParcel
    }
    return salesTravelElement.obj
  }

  manipulateData () {
    this.submitSave = true
    this.addItems()
    this.addTransactions()
    this.checkValidationForAmount()
    if (this.checkValidation() && this.isValidAmount) {
      let _self = this
      console.log('obj : ', JSON.stringify(this.salesCourierParams()))
      this.saleService.postCourierParcelDetails(this.salesCourierParams()).subscribe(
        (data: any) => {
          console.log('post : ', data)
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
    if (+this.TotalBox) {
      this.invalidObj['TotalBox'] = false
    } else {
      this.invalidObj['TotalBox'] = true
      isValid = 0
    }
    if (+this.BoxCharge) {
      this.invalidObj['BoxCharge'] = false
    } else {
      this.invalidObj['BoxCharge'] = true
      isValid = 0
    }
    if (+this.TotalKg) {
      this.invalidObj['TotalKg'] = false
    } else {
      this.invalidObj['TotalKg'] = true
      isValid = 0
    }
    if (+this.Rate) {
      this.invalidObj['Rate'] = false
    } else {
      this.invalidObj['Rate'] = true
      isValid = 0
    }
    if (+this.ParcelBy) {
      this.invalidObj['ParcelBy'] = false
    } else {
      this.invalidObj['ParcelBy'] = true
      isValid = 0
    }
    if (this.BillNo) {
      this.invalidObj['BillNo'] = false
    } else {
      this.invalidObj['BillNo'] = true
      isValid = 0
    }
    if (+this.SenderId) {
      this.invalidObj['SenderId'] = false
    } else {
      this.invalidObj['SenderId'] = true
      isValid = 0
    }
    if (this.InvoiceDate) {
      this.invalidObj['InvoiceDate'] = false
    } else {
      this.invalidObj['InvoiceDate'] = true
      isValid = 0
    }
    if (+this.CurrencyId) {
      this.invalidObj['CurrencyId'] = false
    } else {
      this.invalidObj['CurrencyId'] = true
      isValid = 0
    }
    if (+this.BillAmount) {
      this.invalidObj['BillAmount'] = false
    } else {
      this.invalidObj['BillAmount'] = true
      isValid = 0
    }
    if (+this.ReceiverId) {
      this.invalidObj['ReceiverId'] = false
    } else {
      this.invalidObj['ReceiverId'] = true
      isValid = 0
    }
    if (this.items.length === 0) {
      isValid = 0
      if (this.Description) {
        this.invalidObj['Description'] = false
      } else {
        this.invalidObj['Description'] = true
      }
      if (+this.UnitPrice) {
        this.invalidObj['UnitPrice'] = false
      } else {
        this.invalidObj['UnitPrice'] = true
      }
      if (+this.Quantity) {
        this.invalidObj['Quantity'] = false
      } else {
        this.invalidObj['Quantity'] = true
      }
    } else {
      this.invalidObj['Description'] = false
      this.invalidObj['UnitPrice'] = false
      this.invalidObj['Quantity'] = false
    }
    return !!isValid
  }

}
