/* File created by dolly */

import { Component,
  ViewChild,
  QueryList,
  ViewChildren,
  Renderer2,
  ElementRef
 } from '@angular/core'

import { Subscription } from 'rxjs/Subscription'
import { UIConstant } from 'src/app/shared/constants/ui-constant'
import { Select2OptionData, Select2Component } from 'ng2-select2'
import { PurchaseService } from '../purchase.service'
import { Subject } from 'rxjs'
import { PurchaseAttribute, AddCust, PurchaseAdd, PurchaseTransaction,
  PurchaseItem } from '../../../model/sales-tracker.model'
import { CommonService } from '../../../commonServices/commanmaster/common.services'
import { ToastrCustomService } from '../../../commonServices/toastr.service'
import { Settings } from '../../../shared/constants/settings.constant'
import { GlobalService } from '../../../commonServices/global.service'
import { SetUpIds } from 'src/app/shared/constants/setupIds.constant'
import { map, tap } from 'rxjs/operators'
declare const flatpickr: any
declare const $: any
@Component({
  selector: 'app-purchase',
  templateUrl: './purchase-add.component.html',
  styleUrls: ['./purchase-add.component.css']
})
export class PurchaseAddComponent {
  modalSub: Subscription
  loading: boolean = true
  catLevel: number = 1
  categories: Array<{ placeholder: string, value: string, data: Array<Select2OptionData>, level: number }> = []
  attr$: Subscription
  item$: Subscription
  vendorData$: Subscription
  taxProcessesData$: Subscription
  paymentModesData$: Subscription
  organisationsData$: Subscription
  godownsData$: Subscription
  referralTypesData$: Subscription
  category$: Subscription

  referralsData$: Subscription
  taxSlabsData$: Subscription
  currencyData$: Subscription
  addressData$: Subscription

  attibutesData: Array<Select2OptionData>
  taxProcessesData: Array<Select2OptionData>
  paymentModesData: Array<Select2OptionData>
  organisationsData: Array<Select2OptionData>
  godownsData: Array<Select2OptionData>
  referralTypesData: Array<Select2OptionData>
  referralData: Array<Select2OptionData>
  paymentModeSelect2: Array<Select2OptionData>
  currenciesSelect2: Array<Select2OptionData>
  taxTypeData: Array<Select2OptionData>
  currencyData: Array<Select2OptionData>
  convertToCurrencyData: Array<Select2OptionData>
  vendorData: Array<Select2OptionData>
  AddressData: Array<Select2OptionData>
  subUnitsData: Array<Select2OptionData>
  itemData: Array<Select2OptionData>
  paymentLedgerselect2: Array<Select2OptionData>
  taxSlabsData: Array<Select2OptionData>

  attributeValue: number
  itemValue: number
  vendorValue: number
  taxProcessValue: number
  paymentModeValue: number
  organisationValue: number
  godownValue: number
  referralTypesValue: number
  subUnitsValue: number
  referralValue: number
  taxSlabValue: number
  currencyValue: number
  convertToCurrencyValue: number
  addressValue: number

  clientDateFormat: string = ''
  currency: any
  defaultCurrency: string
  setupModules: any
  currencyValues: Array < { id: string, symbol: string } > = [{ id: '0', symbol: '%' }]
  freightData: Array<Select2OptionData>

  Paymode: string
  PayModeId: number
  LedgerId: number
  Amount: number
  BankLedgerName: string
  ChequeNo: string
  PayDate: string
  paymode: number
  ledger: number

  ItemTransId: number
  AttributeId: number
  ParentTypeId: number
  name: string

  TransType: number
  TransId: number
  ChallanId: number = 0
  ItemId: number
  UnitId: number
  Length: number
  Height: number
  Width: number
  Quantity: number
  SaleRate: number
  MrpRate: number
  PurchaseRate: number
  TaxSlabId: number
  TaxType: number
  TaxAmount: number
  DiscountType: number
  Discount: number
  DiscountAmt: number
  ExpiryDate: string
  MfdDate: string
  BatchNo: string
  Remark: string
  itemName: string
  categoryName: string
  unitName: string
  taxSlabName: string
  taxTypeName: string
  SubTotal: number
  taxSlabType: number
  taxRates: Array<any> = []
  attributeKeys: any = []
  BillAmount: number
  BillDate: string
  PartyBillDate: string
  PartyBillNo: string
  BillNo: string
  ConvertedAmount: number
  CurrencyRate: number
  TotalDiscount: number
  Freight: number
  FreightMode: number
  Id: number
  PartyId: number
  ReferralId: number
  ReferralTypeId: number
  ReferralComission: number
  ReferralComissionTypeId: number
  ReverseCharge: number
  ReverseTax: number
  Cess: number
  CessAmount: number
  RoundOff: number
  SubTotalAmount: number
  TotalTaxAmount: number
  TotalChallan: number
  VehicleNo: string
  Drivername: string
  Transportation: string
  TotalQty: number
  OtherCharge: number
  GodownId: number
  CurrencyId: number
  OrgId: number
  InterestRate: number
  InterestAmount: number
  InterestType: number
  DueDate: string
  OrderId: number
  Advanceamount: number
  NetAmount: number
  LocationTo: string
  itemAttributeTrans: Array<PurchaseAttribute> = []
  ItemAttributeTrans: Array<PurchaseAttribute> = []
  PaymentDetail: Array<PurchaseTransaction> = []
  Items: Array<PurchaseItem> = []
  categoryId: number
  AddressId: number
  editTransId: number = -1
  editItemId: number = -1
  validItem: boolean = true
  validTransaction: boolean = true
  clickItem = false
  clickTrans = false

  CreditLimit: number
  CreditDays: number

  allItems: any = []
  ReferralCommissionTypeId: number
  ReferralCommission: number
  CommissionAmount: number

  categorySelected: any = []
  settingData: any = []
  clientStateId: number = 0
  allAddressData: Array<any> = []
  isOtherState: boolean = true
  editMode: boolean = false
  parentMostCategory: number = 0
  submitSave: boolean = false
  industryId: number = 0

  newVendAdd$: Subscription
  addressAdd$: Subscription
  itemAdd$: Subscription
  taxAdd$: Subscription
  unitAdd$: Subscription
  ledgerAdd$: Subscription
  settingData$: Subscription
  freightData$: Subscription
  subUnitsData$: Subscription
  formReadySub = new Subject<boolean>()
  fromReady$ = this.formReadySub.asObservable()
  form$: Subscription

  invalidObj: any = {}
  previousBillNo: string = ''
  keepOpen: boolean = false
  isAddNew: boolean = false
  constructor (private commonService: CommonService,
    private purchaseService: PurchaseService,
    private toastrService: ToastrCustomService,
    private settings: Settings,
    private renderer: Renderer2,
    private gs: GlobalService) {
    this.modalSub = this.commonService.getPurchaseStatus().subscribe(
      (status: AddCust) => {
        if (status.open) {
          if (status.editId !== '') {
            this.editMode = true
            this.Id = +status.editId
          } else {
            this.Id = UIConstant.ZERO
            this.editMode = false
          }
          this.openModal()
        } else {
          this.closeModal()
        }
      }
    )

    this.category$ = this.commonService.getCategoryStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let categoryId = data.id
          let categoryName = data.name
          this.isAddNew = true
          this.getAllCategories(categoryName, categoryId, this.isAddNew)
        }
      }
    )

    this.form$ = this.fromReady$.subscribe(
      (formReady) => {
        if (formReady) {
          this.loading = false
          if (this.editMode) {
            this.vendorSelect2.setElementValue(this.PartyId)
            this.organisationSelect2.setElementValue(this.OrgId)
            this.godownSelect2.setElementValue(this.GodownId)
            setTimeout(() => {
              this.addressSelect2.setElementValue(this.AddressId)
            }, 1000)
            this.currencySelect2.setElementValue(this.CurrencyId)
            this.convertToSelect2.setElementValue(this.ConvertToCurrencyId)
            this.referralSelect2.setElementValue(this.ReferralId)
            this.referraltypeSelect2.setElementValue(this.ReferralTypeId)
            this.setDueDate(this.CreditDays)
          }
        }
      }
    )

    this.attr$ = this.purchaseService.attributesData$.subscribe(
      data => {
        if (data.attributeKeys && data.attributesData) {
          this.initAttribute()
          this.attributeKeys = data.attributeKeys
          this.attibutesData = data.attributesData
        }
      }
    )

    this.item$ = this.purchaseService.itemData$.subscribe(
      data => {
        if (data.itemData) {
          this.itemData = Object.assign([], data.itemData)
        }
      }
    )

    this.vendorData$ = this.purchaseService.vendorData$.subscribe(
      data => {
        if (data.data) {
          this.vendorData = data.data
        }
      }
    )

    this.taxProcessesData$ = this.purchaseService.taxProcessesData$.subscribe(
      data => {
        if (data.data) {
          this.taxProcessesData = data.data
        }
      }
    )
    this.paymentModesData$ = this.purchaseService.paymentModesData$.subscribe(
      data => {
        if (data.data) {
          this.paymentModesData = data.data
        }
      }
    )
    this.organisationsData$ = this.purchaseService.organisationsData$.subscribe(
      data => {
        if (data.data) {
          this.organisationsData = data.data
          if (this.organisationsData.length >= 1) {
            this.OrgId = +this.organisationsData[0].id
            this.organisationValue = +this.organisationsData[0].id
            if (this.isBillNoManuall) {
              this.BillDate = this.gs.getDefaultDate(this.clientDateFormat)
              this.getNewBillNo()
            }
          }
          // console.log('organisationsData : ', this.organisationsData)
        }
      }
    )
    this.godownsData$ = this.purchaseService.godownsData$.subscribe(
      data => {
        if (data.data) {
          this.godownsData = data.data
          if (this.godownsData.length === 1) {
            this.GodownId = +this.godownsData[0].id
            this.godownValue = +this.godownsData[0].id
          }
          // console.log('godownsData : ', this.godownsData)
        }
      }
    )
    this.referralTypesData$ = this.purchaseService.referralTypesData$.subscribe(
      data => {
        if (data.data) {
          this.referralTypesData = data.data
          // console.log('referralTypesData : ', this.referralTypesData)
        }
      }
    )
    this.subUnitsData$ = this.purchaseService.subUnitsData$.subscribe(
      data => {
        if (data.data) {
          this.subUnitsData = data.data
          // console.log('subUnitsData : ', this.subUnitsData)
        }
      }
    )
    this.referralsData$ = this.purchaseService.referralData$.subscribe(
      data => {
        if (data.data) {
          this.referralData = data.data
          // console.log('referralData : ', this.referralData)
        }
      }
    )
    this.taxSlabsData$ = this.purchaseService.taxSlabsData$.subscribe(
      data => {
        if (data.data) {
          this.taxSlabsData = data.data
          // console.log('taxSlabsData : ', this.taxSlabsData)
        }
      }
    )

    this.currencyData$ = this.purchaseService.currencyData$.subscribe(
      data => {
        if (data.data) {
          this.currencyData = data.data
          this.defaultCurrency = this.currencyData[0].text
          this.currencyValues[0] = { id: '0', symbol: '%' }
          this.currencyValues[1] = { id: '1', symbol: this.defaultCurrency }
          // console.log('currencyValues : ', this.currencyValues)
          this.convertToCurrencyData = [ ...this.currencyData ]
          // console.log('currency data : ', this.convertToCurrencyData)
          if (this.currencyData.length >= 1) {
            this.CurrencyId = +this.currencyData[0].id
            this.currencyValue = +this.currencyData[0].id
            this.ConvertToCurrencyId = +this.convertToCurrencyData[0].id
            this.convertToCurrencyValue = +this.convertToCurrencyData[0].id
          }
        }
      }
    )

    this.freightData$ = this.purchaseService.freightData$.subscribe(
      data => {
        if (data.data) {
          this.freightData = data.data
        }
      }
    )

    let _self = this
    this.addressData$ = this.purchaseService.addressData$.subscribe(
      data => {
        if (data.data) {
          _self.AddressData = Object.assign([], data.data)
          let id = 0
          if (_self.AddressData.length > 2) {
            id = +_self.AddressData[2].id
          }
          _self.AddressId = id
          _self.addressValue = id
          _self.addressSelect2.setElementValue(id)
        }
      }
    )

    this.settingData$ = this.purchaseService.settingData$.subscribe(
      data => {
        if (data.data) {
          this.settingData = data.data
          this.getSetUpModules(this.settingData)
        }
      }
    )

    this.newVendAdd$ = this.commonService.getVendStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.vendorData)
          newData.push({ id: data.id, text: data.name })
          this.vendorData = newData
          this.PartyId = +data.id
          this.vendorValue = data.id
          this.CreditLimit = 0
          this.CreditDays = 0
          this.setDueDate(this.CreditDays)
          setTimeout(() => {
            if (this.vendorSelect2) {
              const element = this.renderer.selectRootElement(this.vendorSelect2.selector.nativeElement, true)
              element.focus({ preventScroll: false })
            }
          }, 2000)
        }
      }
    )

    this.addressAdd$ = this.commonService.getAddressStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.AddressData)
          newData.push({ id: data.id, text: data.name })
          this.AddressData = newData
          this.AddressId = +data.id
          this.addressValue = data.id
          this.checkForGST()
          setTimeout(() => {
            if (this.addressSelect2) {
              const element = this.renderer.selectRootElement(this.addressSelect2.selector.nativeElement, true)
              element.focus({ preventScroll: false })
            }
          }, 2000)
        }
      }
    )

    this.unitAdd$ = this.commonService.getCompositeUnitStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.subUnitsData)
          newData.push({ id: +data.id, text: data.name })
          this.subUnitsData = newData
          this.UnitId = +data.id
          this.subUnitsValue = data.id
          setTimeout(() => {
            if (this.unitSelect2) {
              const element = this.renderer.selectRootElement(this.unitSelect2.selector.nativeElement, true)
              element.focus({ preventScroll: false })
            }
          }, 2000)
        }
      }
    )

    this.unitAdd$ = this.commonService.getUnitStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.subUnitsData)
          newData.push({ id: +data.id, text: data.name })
          this.subUnitsData = newData
          this.UnitId = +data.id
          this.subUnitsValue = data.id
          setTimeout(() => {
            if (this.unitSelect2) {
              const element = this.renderer.selectRootElement(this.unitSelect2.selector.nativeElement, true)
              element.focus({ preventScroll: false })
            }
          }, 2000)
        }
      }
    )

    this.itemAdd$ = this.commonService.getItemMasterStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.itemData)
          newData.push({ id: data.id, text: data.name })
          this.itemData = newData
          this.ItemId = +data.id
          this.itemValue = data.id
          setTimeout(() => {
            if (this.itemselect2) {
              const element = this.renderer.selectRootElement(this.itemselect2.selector.nativeElement, true)
              element.focus({ preventScroll: false })
            }
          }, 2000)
        }
      }
    )

    this.ledgerAdd$ = this.commonService.getLedgerStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.paymentLedgerselect2)
          newData.push({ id: data.id, text: data.name })
          this.paymentLedgerselect2 = newData
          this.LedgerId = +data.id
          this.ledger = data.id
          setTimeout(() => {
            if (this.ledgerSelect2) {
              const element = this.renderer.selectRootElement(this.ledgerSelect2.selector.nativeElement, true)
              element.focus({ preventScroll: false })
            }
          }, 2000)
        }
      }
    )

    this.taxAdd$ = this.commonService.getTaxStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.taxSlabsData)
          newData.push({ id: data.id, text: data.name })
          this.taxSlabsData = newData
          this.TaxSlabId = +data.id
          this.taxSlabValue = data.id
          setTimeout(() => {
            if (this.taxSlabSelect2) {
              const element = this.renderer.selectRootElement(this.taxSlabSelect2.selector.nativeElement, true)
              element.focus({ preventScroll: false })
            }
          }, 2000)
        }
      }
    )
  }

  getEditData () {
    console.log('edit id : ', this.Id)
    this.purchaseService.getPurchaseDetailById(this.Id).subscribe(
      data => {
        console.log('edit data : ', data)
        if (data.Code === UIConstant.THOUSAND && data.Data) {
          this.allAddressData = data.Data.AddressDetails
          this.purchaseService.createAddress(data.Data.AddressDetails)
          $('#purchase_modal').modal(UIConstant.MODEL_SHOW)
          this.createForm(data.Data)
        } else {
          this.toastrService.showError(data.Message, '')
        }
      }
    )
  }

  dataForEdit: any
  createForm (data) {
    this.dataForEdit = data
    this.createOther(data.PurchaseTransactions[0])
    this.createAttributes(data.ItemAttributesTrans)
    this.createItems(data.ItemTransactions)
    this.createTransaction(data.PaymentDetails)
  }

  itemAttributesOthers: any = []
  createAttributes (attributes) {
    attributes.forEach((element, index) => {
      this.itemAttributesOthers[index] = {
        ItemId: element.ItemId,
        ItemTransId: element.ItemTransId,
        AttributeId:  element.AttributeId,
        ParentTypeId: 7,
        name: element.AttributeName,
        Id: element.Id
      }
    })

    console.log('this.itemAttributesOthers : ', this.itemAttributesOthers)
  }

  createItems (ItemTransactions) {
    ItemTransactions.forEach(element => {
      let taxRates = []
      // taxRates = this.dataForEdit.ItemTaxTrans.filter((taxRate) => {
      //   if (taxRate.ItemTransId === element.Id) {
      //     return taxRate
      //   }
      // })
      let itemAttributeTrans = []
      itemAttributeTrans = this.itemAttributesOthers.filter((attr) => {
        if (attr.ItemTransId === element.Id) {
          return attr
        }
      })
      if (+element.TaxType === 0) {
        this.taxTypeName = 'Exclusive'
      } else {
        this.taxTypeName = 'Inclusive'
      }
      console.log('tax rate : ', taxRates)
      console.log('itemAttributeTrans : ', itemAttributeTrans)
      this.TransType = element.TransType
      this.TransId = element.TransId
      this.ChallanId = element.ChallanId
      this.categoryId = element.CategoryId
      this.ItemId = element.ItemId
      this.UnitId = element.UnitId
      this.Length = element.Length
      this.Height = element.Height
      this.Width = element.Width
      this.Quantity = element.Quantity
      this.SaleRate = element.SaleRate
      this.MrpRate = element.MrpRate
      this.PurchaseRate = element.PurchaseRate
      this.TaxSlabId = element.TaxSlabId
      this.TaxType = element.TaxType
      this.TaxAmount = element.TaxAmount
      this.DiscountType = element.DiscountType
      this.Discount = element.Discount
      this.DiscountAmt = element.DiscountAmt
      this.ExpiryDate = element.ExpiryDate
      this.MfdDate = element.MfdDate
      this.BatchNo = element.BatchNo
      this.Remark = element.Remark
      this.itemName = element.ItemName
      this.categoryName = element.CategoryName
      this.unitName = element.UnitName
      this.taxSlabName = element.TaxSlabName
      this.taxTypeName = this.taxTypeName
      this.SubTotal = element.SubTotal
      this.itemAttributeTrans = itemAttributeTrans
      this.taxRates = taxRates
      this.taxSlabType = element.TaxSlabType
      this.addItems()
      if (this.Items[this.Items.length - 1]) {
        this.Items[this.Items.length - 1].Id = element.Id
      } else {
        this.toastrService.showError('Not getting enough data for edit', '')
      }
    })
    console.log('items after edit : ', this.Items)
    this.updateRow()
  }

  updateRow () {
    this.Items.forEach(element => {
      this.purchaseService.getSlabData(element.TaxSlabId).subscribe(
        data => {
          console.log('tax slab data : ', data)
          if (data.Code === UIConstant.THOUSAND && data.Data) {
            let taxRates = data.Data.TaxRates
            element.taxRates = taxRates
            let total = +(isNaN(+element.PurchaseRate) ? 0 : +element.PurchaseRate)
              * (isNaN(+element.Quantity) || +element.Quantity === 0 ? 1 : +element.Quantity)
              * (isNaN(+element.Length) || +element.Length === 0 ? 1 : +element.Length)
              * (isNaN(+element.Width) || +element.Width === 0 ? 1 : +element.Width)
              * (isNaN(+element.Height) || +element.Height === 0 ? 1 : +element.Height)
            if (taxRates.length > 0 && total > 0) {
              let discountedAmount = total - element.DiscountAmt
              element.TaxAmount = +(this.purchaseService.taxCalculation(taxRates,
                element.taxSlabType,
                discountedAmount,
                this.isOtherState)).toFixed(this.noOfDecimalPoint)
            } else {
              element.TaxAmount = 0
            }

            const totalAmount = +(((isNaN(+element.PurchaseRate) ? 0 : +element.PurchaseRate)
              * (isNaN(+element.Quantity) || +element.Quantity === 0 ? 1 : +element.Quantity)
              * (isNaN(+element.Length) || +element.Length === 0 ? 1 : +element.Length)
              * (isNaN(+element.Width) || +element.Width === 0 ? 1 : +element.Width)
              * (isNaN(+element.Height) || +element.Height === 0 ? 1 : +element.Height)
            )
            - (isNaN(+element.DiscountAmt) ? 0 : +element.DiscountAmt)
            + (isNaN(+element.TaxAmount) ? 0 : +element.TaxAmount))

            element.SubTotal = +(isNaN(totalAmount) ? 0 : totalAmount).toFixed(this.noOfDecimalPoint)
            this.calculateAllTotal()
          }
        }
      )
    })

    console.log('Items on update : ', this.Items)
  }

  createTransaction (paymentDetails) {
    paymentDetails.forEach(element => {
      this.Paymode = element.Paymode
      this.PayModeId = element.PayModeId
      this.LedgerId = element.LedgerId
      this.BankLedgerName = element.BankLedgerName
      this.Amount = element.Amount
      this.PayDate = this.gs.utcToClientDateFormat(element.PayDate, this.clientDateFormat)
      this.ChequeNo = element.ChequeNo
      this.addTransactions()
      if (this.PaymentDetail[this.PaymentDetail.length - 1]) {
        this.PaymentDetail[this.PaymentDetail.length - 1].Id = element.Id
      } else {
        this.toastrService.showError('Not getting enough data for edit', '')
      }
    })
    console.log('this.PaymentDetail : ', this.PaymentDetail)
  }

  other: any = {}
  createOther (others) {
    this.setBillDate()
    this.setPartyBillDate()
    this.setPayDate()
    this.setExpiryDate()
    this.setDueDate(0)
    this.setMfdDate()
    this.BillNo = others.BillNo
    this.ReferralCommissionTypeId = others.ReferralCommissionTypeId
    this.ReferralCommission = +others.ReferralCommission
    this.BillAmount = +others.BillAmount
    this.BillDate = this.gs.utcToClientDateFormat(others.BillDate, this.clientDateFormat)
    this.PartyBillDate = this.gs.utcToClientDateFormat(others.PartyBillDate, this.clientDateFormat)
    this.DueDate = this.gs.utcToClientDateFormat(others.DueDate, this.clientDateFormat)
    this.PartyBillNo = others.PartyBillNo
    this.ConvertedAmount = +others.ConvertedAmount
    this.CurrencyRate = +others.CurrencyRate
    this.TotalDiscount = 0
    this.Freight = +others.Freight
    this.FreightMode = +others.FreightMode
    this.PartyId = +others.LedgerId
    this.ReferralId = others.ReferralId
    this.ReferralTypeId = others.ReferralTypeId
    this.ReverseCharge = 0
    this.ReverseTax = 0
    this.CessAmount = 0
    this.RoundOff = others.RoundOff
    this.SubTotalAmount = 0
    this.TotalTaxAmount = 0
    this.TotalChallan = 0
    this.VehicleNo = others.VehicleNo
    this.Drivername = others.Drivername
    this.Transportation = others.Transportation
    this.TotalQty = +others.TotalQty
    this.OtherCharge = +others.OtherCharge
    this.GodownId = +others.GodownId
    this.CurrencyId = +others.CurrencyId
    this.OrgId = +others.OrgId
    this.InterestRate = others.InterestRate
    this.InterestAmount = others.InterestAmount
    this.InterestType = others.InterestType
    this.OrderId = 0
    this.Advanceamount = 0
    this.NetAmount = 0
    this.AddressId = +others.AddressId
    this.CreditDays = +others.CreditDays
    this.CreditLimit = +others.CreditLimit
    this.ConvertToCurrencyId = +others.ConvertedCurrencyId
    this.LocationTo = others.LocationTo
    this.isOtherState = others.IsOtherStatemain
    this.defaultCurrency = others.Currency
    console.log('currency values : ', this.currencyValues)
    this.other = others
    this.formReadySub.next(true)
  }

  getAllCategories (categoryName, categoryId, isAddNew) {
    this.commonService.getAllCategories().subscribe(
      data => {
        // console.log('all categories : ', data)
        let levelNo = 0
        if (data.Code === UIConstant.THOUSAND && data.Data && data.Data.length > 0) {
          this.getCatagoryDetail(data.Data)
          data.Data.forEach(category => {
            if (+category.Id === +categoryId) {
              levelNo = +category.LevelNo
              return
            }
          })
          this.categoryName = categoryName
          this.categoryId = categoryId
          this.catSelect2.forEach((item: Select2Component, index: number, array: Select2Component[]) => {
            if ((index + 1) === levelNo) {
              item.setElementValue(this.categoryId)
            }
          })
          // this.updateCategories(categoryId)
          // console.log('categoryname : ', this.categoryName)
          let evt = { value: categoryId, data: [{ text: categoryName }] }
          this.onSelectCategory(evt, levelNo)
        }
      }
    )
  }

  @ViewChild('convertTo_select2') convertToSelect2: Select2Component

  noOfDecimalPoint: number = 0
  backDateEntry: boolean = false
  isBillNoManuall: boolean = false
  freightAndOtherChangeCalc: string
  getSetUpModules (settings) {
    console.log('settings : ', settings)
    settings.forEach(element => {
      if (element.id === SetUpIds.catLevel) {
        this.catLevel = +element.val
      }
      if (element.id === SetUpIds.dateFormat) {
        this.clientDateFormat = element.val
      }
      if (element.id === SetUpIds.noOfDecimalPoint) {
        this.noOfDecimalPoint = +element.val
      }
      if (element.id === SetUpIds.unitType) {
        this.unitSettingType = +element.val
      }
      if (element.id === SetUpIds.gstCalculationOnFreightOrOtherChange) {
        this.freightAndOtherChangeCalc = 'Max'
      }
      if (element.id === SetUpIds.backDateEntry) {
        this.backDateEntry = element.val
      }
      if (element.id === SetUpIds.purchaseBillNoManually) {
        this.isBillNoManuall = element.val
      }
      // console.log('isBillNoManuall : ', this.isBillNoManuall)
    })
    this.createModels(this.catLevel)
  }

  @ViewChild('vendor_select2') vendorSelect2: Select2Component
  onVendorSelect (event) {
    console.log('vendor select : ', event)
    if (event.value && event.data.length > 0) {
      if (event.value === '-1' && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
        this.vendorSelect2.selector.nativeElement.value = ''
        this.commonService.openVend('', true)
      } else if (+event.value === 0) {
        this.allAddressData = []
        this.AddressData = Object.assign([], this.allAddressData)
      } else {
        if (event.value > 0 && event.data[0] && event.data[0].text) {
          this.PartyId = +event.value
          this.getAllAddresses(this.PartyId)
        }
      }
      this.checkForValidation()
    }
  }

  getAllAddresses (vendorId) {
    this.purchaseService.getAllAddresses(vendorId).subscribe(data => {
      // console.log('addresses : ', data)
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        if (data.Data.AddressDetails && data.Data.AddressDetails) {
          this.allAddressData = data.Data.AddressDetails
          console.log(this.allAddressData)
          this.purchaseService.createAddress(data.Data.AddressDetails)
        }
        if (data.Data.LedgerDetails && data.Data.LedgerDetails.length > 0) {
          const LedgerDetails = data.Data.LedgerDetails[0]
          this.CreditLimit = LedgerDetails.CreditLimit
          this.CreditDays = LedgerDetails.CreditDays
          this.setDueDate(this.CreditDays)
        }
      }
    })
  }

  getNewBillNo () {
    if (this.BillDate) {
      this.setPayDate()
    }
    if (+this.OrgId > 0 && this.BillDate) {
      let newBillDate = this.gs.clientToSqlDateFormat(this.BillDate, this.clientDateFormat)
      let type = (this.isBillNoManuall) ? 2 : 1
      this.purchaseService.getNewBillNoPurchase(+this.OrgId, newBillDate, type).subscribe(
        data => {
          console.log('new bill no : ', data)
          if (data.Code === UIConstant.THOUSAND && data.Data) {
            if (data.Data.length > 0) {
              if (!this.isBillNoManuall) {
                this.BillNo = data.Data[0].BillNo
              } else {
                this.previousBillNo = data.Data[0].BillNo
              }
            } else {
              if (!this.isBillNoManuall) {
                this.BillNo = ''
              } else {
                this.previousBillNo = ''
              }
            }
          } else {
            this.toastrService.showError(data.Message, '')
          }
        }
      )
    }
  }

  getSPUtilityData () {
    let _self = this
    this.commonService.getSPUtilityData(UIConstant.PURCHASE_TYPE).subscribe(
      data => {
        // console.log('attributes data : ', data)
        if (data.Code === UIConstant.THOUSAND && data.Data) {
          if (data.Data.AttributeValueResponses.length > 0) {
            _self.purchaseService.generateAttributes(data.Data)
          }
          if (data.Data.ItemCategorys.length > 0) {
            _self.getCatagoryDetail(data.Data.ItemCategorys)
          }
          this.allItems = [ ...data.Data.Items ]
          // console.log('allItems : ', this.allItems)
          _self.purchaseService.createItems(data.Data.Items)
          _self.purchaseService.createVendors(data.Data.Vendors)
          _self.purchaseService.createTaxProcess(data.Data.TaxProcesses)
          _self.purchaseService.createPaymentModes(data.Data.PaymentModes)
          _self.purchaseService.createOrganisations(data.Data.Organizations)
          _self.purchaseService.createGodowns(data.Data.Godowns)
          _self.purchaseService.createReferralTypes(data.Data.ReferalTypes)
          _self.purchaseService.createSubUnits(data.Data.SubUnits)
          _self.purchaseService.createTaxSlabs(data.Data.TaxSlabs)
          _self.purchaseService.createReferral(data.Data.Referals)
          _self.purchaseService.createCurrencies(data.Data.Currencies)
          _self.purchaseService.createFreightBy(data.Data.FreightModes)
          _self.clientStateId = data.Data.ClientAddresses[0].StateId
          if (!this.editMode) {
            if (!this.isBillNoManuall) {
              _self.setBillNo(data.Data.TransactionNoSetups)
            }
            _self.setBillDate()
            _self.setPartyBillDate()
            _self.setPayDate()
            _self.setExpiryDate()
            _self.setDueDate(0)
            _self.setMfdDate()
            $('#purchase_modal').modal(UIConstant.MODEL_SHOW)
            setTimeout(() => {
              this.vendorSelect2.selector.nativeElement.focus()
              this.commonService.fixTableHF('cat-table')
            }, 1000)
          }
        }
      },
      (error) => {
        console.log(error)
      },
      () => {
        if (!this.editMode) {
          this.loading = false
        } else {
          if (this.editMode) {
            this.getEditData()
          }
        }
      }
    )
  }

  @ViewChild('currency_select2') currencySelect2: Select2Component
  openModal () {
    this.loading = true
    this.categories = []
    this.getPurchaseSetting()
    this.AddressData = []
    this.vendorData = []
    this.organisationsData = []
    this.currencyData = []
    this.godownsData = []
    this.allCategories = []
    this.allItems = []
    this.subUnitsData = []
    this.paymentModesData = []
    this. paymentLedgerselect2 = []
    this.referralData = []
    this.referralTypesData = []
    this.freightData = []
    this.attributeKeys = []
    this.itemAttributeTrans = []
    this.industryId = +this.settings.industryId
    this.taxTypeData = [
      { id: '0', text: 'Exclusive' },
      { id: '1', text: 'Inclusive' }
    ]
    this.convertToCurrencyData = []
    this.currencyValues = [{ id: '0', symbol: '%' }]
    this.initItem()
    this.initTransaction()
    this.initComp()
  }

  checkForExistence: any = []
  getFormDependency () {
    this.commonService.getFormDependency(UIConstant.PURCHASE_TYPE).subscribe(
      data => {
        if (data.Code === UIConstant.THOUSAND && data.Data) {
          data.Data.forEach((element) => {
            if (element.IsIdentity) {
              element['FieldValue'] = this.Id
            }
          })
          this.checkForExistence = data.Data
          console.log('dependency : ', this.checkForExistence)
        }
      }
    )
  }

  closeModal () {
    if ($('#purchase_modal').length > 0) {
      $('#purchase_modal').modal(UIConstant.MODEL_HIDE)
    }
  }

  setBillNo (setups) {
    this.BillNo = setups[0].BillNo
  }

  getCatLevel () {
    let _self = this
    this.commonService.getSettingById(SetUpIds.catLevel).subscribe(
      (data) => {
        if (data.Code === UIConstant.THOUSAND) {
          const setUpSettings = data.Data.SetupClients
          _self.catLevel = +setUpSettings[0].Val
        }
      }
    )
  }

  unitSettingType: number = 1
  setPayDate () {
    let _self = this
    if (this.backDateEntry) {
      jQuery(function ($) {
        flatpickr('#pay-date', {
          dateFormat: _self.clientDateFormat,
          defaultDate: [_self.BillDate]
        })
      })
    } else {
      jQuery(function ($) {
        flatpickr('#pay-date', {
          minDate: 'today',
          dateFormat: _self.clientDateFormat,
          defaultDate: [_self.BillDate]
        })
      })
    }
    _self.PayDate = _self.BillDate
  }

  setBillDate () {
    let _self = this
    if (this.backDateEntry) {
      jQuery(function ($) {
        flatpickr('#bill-date1', {
          dateFormat: _self.clientDateFormat,
          defaultDate: [_self.gs.getDefaultDate(_self.clientDateFormat)]
        })
      })
    } else {
      jQuery(function ($) {
        flatpickr('#bill-date1', {
          minDate: 'today',
          dateFormat: _self.clientDateFormat,
          defaultDate: [_self.gs.getDefaultDate(_self.clientDateFormat)]
        })
      })
    }
    this.BillDate = _self.gs.getDefaultDate(_self.clientDateFormat)
  }

  setPartyBillDate () {
    let _self = this
    if (this.backDateEntry) {
      jQuery(function ($) {
        flatpickr('#party-bill-date1', {
          dateFormat: _self.clientDateFormat,
          defaultDate: [_self.gs.getDefaultDate(_self.clientDateFormat)]
        })
      })
    } else {
      jQuery(function ($) {
        flatpickr('#party-bill-date1', {
          minDate: 'today',
          dateFormat: _self.clientDateFormat,
          defaultDate: [_self.gs.getDefaultDate(_self.clientDateFormat)]
        })
      })
    }
    this.PartyBillDate = _self.gs.getDefaultDate(_self.clientDateFormat)
  }

  setDueDate (creditDays) {
    let _self = this
    const date = _self.gs.setDueDate(creditDays, _self.clientDateFormat)
    jQuery(function ($) {
      flatpickr('#due-date1', {
        dateFormat: _self.clientDateFormat,
        defaultDate: [date]
      })
    })
    this.DueDate = date
  }

  setExpiryDate () {
    let _self = this
    jQuery(function ($) {
      flatpickr('#expiry-date', {
        minDate: 'today',
        dateFormat: _self.clientDateFormat
      })
    })
  }

  setMfdDate () {
    let _self = this
    jQuery(function ($) {
      flatpickr('#mfd-date', {
        dateFormat: _self.clientDateFormat
      })
    })
  }

  createModels (levels) {
    // console.log('levels : ', levels)
    this.categories = []
    let obj = { placeholder: 'Select Category',
      value: 'category',
      data: [{ id: '0', text: 'Select Category' }],
      level: 1
    }
    this.categories.push({ ...obj })
    if (levels > 1) {
      for (let i = 0; i < levels - 1; i++) {
        obj['value'] = 'sub' + this.categories[this.categories.length - 1].value
        obj['level'] = this.categories[this.categories.length - 1].level + 1
        obj['data'] = [{ id: '0', text: 'Select Category' }]
        this.categories.push({ ...obj })
      }
    }
    // console.log('categories : ', this.categories)
  }

  allCategories: any = []
  getCatagoryDetail (data) {
    // console.log('category data : ', data)
    for (let i = 0; i < this.catLevel; i++) {
      if (this.categories[i]) {
        this.categories[i].data = [{ id: '0', text: 'Select Category' }]
      }
    }
    this.allCategories = [ ...data ]
    let _self = this
    data.forEach(category => {
      // console.log('category.LevelNo : ', category.LevelNo)
      if (_self.categories[category.LevelNo - 1]) {
        _self.categories[category.LevelNo - 1].data.push({
          text: category.Name,
          id: category.Id
        })
      }
    })
    for (let i = 0; i < this.catLevel; i++) {
      if (this.categories[i]) {
        this.categories[i].data = Object.assign([], this.categories[i].data)
      }
    }
    console.log('dynamic categories : ', this.categories)
    this.loading = false
  }

  onSelectCategory (evt, levelNo) {
    console.log('evt on change of category : ', evt, 'level : ', levelNo)
    if (this.catLevel > 1) {
      if (+evt.value > 0) {
        if (levelNo === this.catLevel) {
          if (this.categoryId !== +evt.value) {
            this.categoryId = +evt.value
            this.categoryName = evt.data[0].text
            console.log('categoryname : ', this.categoryName)
            console.log('category id : ', this.categoryId)
            this.checkForItems(+evt.value)
            this.validateItem()
            this.updateCategories(+evt.value)
          }
        } else {
          if (levelNo < this.catLevel) {
            let categoryId = +evt.value
            let newData = []
            this.categories[levelNo].data = [{ id: '0', text: 'Select Category' }]
            this.allCategories.forEach(category => {
              if (category.LevelNo !== levelNo && category.LevelNo > levelNo) {
                if (category.ParentId === categoryId) {
                  newData.push({
                    text: category.Name,
                    id: category.Id
                  })
                }
              } else {
                this.categories[category.LevelNo - 1].data.push({
                  text: category.Name,
                  id: category.Id
                })
              }
            })
            this.categories[levelNo].data = Object.assign([], newData)
            this.loading = false
          }
        }
      }
      if (+evt.value === 0) {
        this.getCatagoryDetail(this.allCategories)
      }
    } else {
      if (levelNo === this.catLevel) {
        if (this.categoryId !== +evt.value) {
          this.categoryId = +evt.value
          this.categoryName = evt.data[0].text
          console.log('categoryname : ', this.categoryName)
          console.log('category id : ', this.categoryId)
          this.checkForItems(+evt.value)
          this.validateItem()
          this.updateCategories(+evt.value)
        }
      }
    }
  }

  checkForItems (categoryId) {
    let newItemsList = []
    this.allItems.forEach(item => {
      if (item.CategoryId === categoryId) {
        newItemsList.push(item)
      }
    })
    this.purchaseService.createItems(newItemsList)
  }

  @ViewChild('item_select2') itemselect2: Select2Component
  onItemSelect (evt) {
    if (evt.value && evt.data.length > 0) {
      // console.log('evt on change of item : ', evt)
      if (+evt.value === 0) {
        this.ItemId = +evt.value
      }
      if (+evt.value === -1) {
        if (this.categoryId > 0) {
          this.commonService.openItemMaster('', this.categoryId)
          this.itemselect2.selector.nativeElement.value = ''
        } else {
          this.toastrService.showInfo('Please select a category', '')
        }
      } else {
        if (evt.value > 0 && evt.data[0] && evt.data[0].text) {
          this.ItemId = +evt.value
          this.itemName = evt.data[0].text
          this.getItemDetail(this.ItemId)
          this.updateAttributes()
        }
      }
      this.validateItem()
      this.calculate()
    }
  }

  getItemDetail (id) {
    this.purchaseService.getItemDetail(id).subscribe(data => {
      // console.log('item detail : ', data)
      if (data.Code === UIConstant.THOUSAND && data.Data.length > 0) {
        this.categoryName = data.Data[0].CategoryName
        this.updateCategories(data.Data[0].CategoryId)
        // console.log('categoryname : ', this.categoryName)
        this.TaxSlabId = data.Data[0].TaxId
        this.UnitId = data.Data[0].UnitId
        this.unitSelect2.setElementValue(data.Data[0].UnitId)
        this.unitName = data.Data[0].UnitName
        this.taxSlabSelect2.setElementValue(data.Data[0].TaxId)
        this.taxSlabName = data.Data[0].TaxSlab
        this.SaleRate = data.Data[0].SaleRate
        this.PurchaseRate = data.Data[0].PurchaseRate
        this.MrpRate = data.Data[0].Mrprate
        this.getTaxDetail(this.TaxSlabId)
      }
    })
  }

  onAttributeSelect (evt, index, attributeId) {
    console.log('evt on change of attribute : ', evt)
    if (+evt.value > 0 && evt.data.length > 0) {
      let Sno = 0
      if (this.Items.length === 0) {
        Sno = 1
      } else {
        Sno = this.Items[this.Items.length - 1].Sno + 1
      }
      if (this.itemAttributeTrans[index]) {
        this.itemAttributeTrans[index]['ItemId'] = this.ItemId
        this.itemAttributeTrans[index]['AttributeId'] = +evt.value
        this.itemAttributeTrans[index]['ParentTypeId'] = 7
        this.itemAttributeTrans[index]['name'] = evt.data[0].text
      } else {
        this.itemAttributeTrans[index] = {
          ItemId: this.ItemId,
          ItemTransId: Sno,
          AttributeId:  +evt.value,
          ParentTypeId: 7,
          name: evt.data[0].text,
          id: 0
        }
      }
    } else if (+evt.value === -1) {
      let data = {
        addNewId: attributeId,
        attrNameId: attributeId,
        attrValue: attributeId,
        disabledAddButton: true

      }
      let item = this.attrSelect2.find((attr: Select2Component, i: number, array: Select2Component[]) => {
        return i === index
      })
      item.selector.nativeElement.value = ''
      this.commonService.openAttribute(data, true)
    }

    this.attrSelect2.forEach((attr: Select2Component, index: number, array: Select2Component[]) => {
      if (this.itemAttributeTrans[index] && this.itemAttributeTrans[index].AttributeId > 0) {
        $('#' + $('.attr')[index].id).removeClass('errorSelecto')
      } else {
        $('#' + $('.attr')[index].id).addClass('errorSelecto')
      }
    })
    // console.log('this.itemAttributeTrans : ', this.itemAttributeTrans)
    this.validateItem()
  }

  updateAttributes () {
    for (let i = 0; i < this.itemAttributeTrans.length; i++) {
      this.itemAttributeTrans[i].ItemId = this.ItemId
    }
  }

  getParentMostCat (id, level) {
    // console.log('id : ', id)
    // console.log('level : ', level)
    let parentMostCategory = 0
    while (level !== 0) {
      this.allCategories.forEach(category => {
        if (id === category.Id) {
          parentMostCategory = category.Id
          id = category.ParentId
          level--
        }
      })
    }
    console.log('parentMostCategory : ', parentMostCategory)
    this.parentMostCategory = parentMostCategory
  }

  @ViewChildren('cat_select2') catSelect2: QueryList<Select2Component>
  updateCategories (childmostId) {
    let categoryId = childmostId
    this.getParentMostCat(childmostId, this.catLevel)
    categoryId = this.parentMostCategory
    // console.log('category id : ', categoryId)
    if (+this.categoryId !== +childmostId || this.editItemId !== -1) {
      this.categoryId = +childmostId
      this.catSelect2.forEach((item: Select2Component, index: number, array: Select2Component[]) => {
        if (index === 0) {
          item.setElementValue(categoryId)
        } else if (index === (this.catLevel - 1)) {
          item.setElementValue(+childmostId)
        }
      })
      let evt = { value: categoryId, data: [{ text: '' }] }
      this.onSelectCategory(evt, 1)
    }
  }

  calculate () {
    let total = +(isNaN(+this.PurchaseRate) ? 0 : +this.PurchaseRate)
    * (isNaN(+this.Quantity) || +this.Quantity === 0 ? 1 : +this.Quantity)
    * (isNaN(+this.Length) || +this.Length === 0 ? 1 : +this.Length)
    * (isNaN(+this.Width) || +this.Width === 0 ? 1 : +this.Width)
    * (isNaN(+this.Height) || +this.Height === 0 ? 1 : +this.Height)
    if ('' + this.DiscountType === '0') {
      if (this.Discount) {
        this.DiscountAmt = +((+this.Discount / 100) * (total)).toFixed(this.noOfDecimalPoint)
      } else {
        this.DiscountAmt = 0
      }
    } else {
      this.DiscountAmt = isNaN(+this.Discount) ? 0 : +this.Discount
    }
    this.Freight = isNaN(+this.Freight) ? 0 : +this.Freight
    if (this.taxRates.length > 0 && total > 0) {
      let discountedAmount = total - this.DiscountAmt
      if (this.TaxType === 1) {
        this.TaxAmount = +(this.purchaseService.taxCalCulationForInclusive(this.taxRates,
          this.taxSlabType,
          discountedAmount,
          this.isOtherState)).toFixed(this.noOfDecimalPoint)
      } else if (this.TaxType === 0) {
        this.TaxAmount = +(this.purchaseService.taxCalculation(this.taxRates,
          this.taxSlabType,
          discountedAmount,
          this.isOtherState)).toFixed(this.noOfDecimalPoint)
      }
    } else {
      this.TaxAmount = 0
    }
    console.log('tax amount : ', this.TaxAmount)
    this.InterestAmount = 0
    this.SubTotal = +(this.calcullateTotalOfRow()).toFixed(this.noOfDecimalPoint)
    if (+this.ItemId > 0) {
      this.calculateAllTotal()
    } else {
      this.backtrackCalc()
    }
  }

  calcullateTotalOfRow () {
    const totalAmount = ((isNaN(+this.PurchaseRate) ? 0 : +this.PurchaseRate)
      * (isNaN(+this.Quantity) || +this.Quantity === 0 ? 1 : +this.Quantity)
      * (isNaN(+this.Length) || +this.Length === 0 ? 1 : +this.Length)
      * (isNaN(+this.Width) || +this.Width === 0 ? 1 : +this.Width)
      * (isNaN(+this.Height) || +this.Height === 0 ? 1 : +this.Height)
    )
     - (isNaN(+this.DiscountAmt) ? 0 : +this.DiscountAmt)
    + ((this.TaxType === 0) ? (isNaN(+this.TaxAmount) ? 0 : +this.TaxAmount) : 0)
    return isNaN(totalAmount) ? 0 : totalAmount
  }

  calculateAllTotal () {
    let totalDiscount = 0
    let totalTax = 0
    let totalQuantity = 0
    let totalAmount = 0
    for (let i = 0; i < this.Items.length; i++) {
      totalDiscount = totalDiscount + +this.Items[i].DiscountAmt
      totalTax = totalTax + +this.Items[i].TaxAmount
      totalQuantity = totalQuantity + +this.Items[i].Quantity
      totalAmount = +totalAmount + +this.Items[i].SubTotal
    }
    if (!this.clickItem) {
      if (this.DiscountAmt) {
        totalDiscount += +this.DiscountAmt
      }
      if (this.TaxAmount) {
        totalTax += +this.TaxAmount
      }
      if (this.Quantity) {
        totalQuantity += +this.Quantity
      }
      if (this.SubTotal) {
        totalAmount += +this.SubTotal
      }
    }
    this.TotalDiscount = +totalDiscount.toFixed(this.noOfDecimalPoint)
    this.TotalTaxAmount = +totalTax.toFixed(this.noOfDecimalPoint)
    this.TotalQty = +totalQuantity.toFixed(this.noOfDecimalPoint)
    this.SubTotalAmount = +totalAmount.toFixed(this.noOfDecimalPoint)
    if (!isNaN(totalAmount)) {
      totalAmount = totalAmount + this.OtherCharge
      if (this.FreightMode === 1) {
        totalAmount = totalAmount + this.Freight
      }
      this.RoundOff = +(Math.round(totalAmount) - totalAmount).toFixed(this.noOfDecimalPoint)
      this.CessAmount = 0
      this.BillAmount = Math.round(totalAmount)
      this.calculatePaymentAmount()
    }
  }

  calculatePaymentAmount () {
    let paymentTotal = 0
    for (let i = 0; i <= this.PaymentDetail.length - 1; i++) {
      paymentTotal = paymentTotal + +this.PaymentDetail[i].Amount
    }
    if (this.BillAmount > 0 && paymentTotal >= 0 && paymentTotal < this.BillAmount) {
      this.Amount = this.BillAmount - paymentTotal
    } else if (paymentTotal > this.BillAmount) {
      this.Amount = 0
    }
    console.log('amount : ', this.Amount)
  }

  backtrackCalc () {
    let totalDiscount = 0
    let totalTax = 0
    let totalQuantity = 0
    let totalAmount = 0
    for (let i = 0; i < this.Items.length; i++) {
      totalDiscount = totalDiscount + +this.Items[i].DiscountAmt
      totalTax = totalTax + +this.Items[i].TaxAmount
      totalQuantity = totalQuantity + +this.Items[i].Quantity
      totalAmount = +totalAmount + +this.Items[i].SubTotal
    }
    this.TotalDiscount = +totalDiscount.toFixed(this.noOfDecimalPoint)
    this.TotalTaxAmount = +totalTax.toFixed(this.noOfDecimalPoint)
    this.TotalQty = +totalQuantity.toFixed(this.noOfDecimalPoint)
    this.SubTotalAmount = +totalAmount.toFixed(this.noOfDecimalPoint)
    if (!isNaN(totalAmount)) {
      totalAmount = totalAmount + this.OtherCharge
      if (this.FreightMode === 1) {
        totalAmount = totalAmount + this.Freight
      }
      this.RoundOff = +(Math.round(totalAmount) - totalAmount).toFixed(this.noOfDecimalPoint)
      this.CessAmount = 0
      this.BillAmount = Math.round(totalAmount)
      this.calculatePaymentAmount()
    }
  }

  @ViewChild('unit_select2') unitSelect2: Select2Component
  onUnitSelect (evt) {
    // console.log('on evt select : ', evt)
    if (evt.value && evt.data.length > 0) {
      if (+evt.value === -1) {
        this.unitSelect2.selector.nativeElement.value = ''
        // console.log(this.unitSettingType)
        if (+this.unitSettingType === 1) {
          this.commonService.openUnit('')
        }
        if (+this.unitSettingType === 2) {
          this.commonService.openCompositeUnit('')
        }
      } else {
        if (evt.value > 0 && evt.data[0] && evt.data[0].text) {
          this.UnitId = +evt.value
          this.unitName = evt.data[0].text
        }
      }
      this.validateItem()
    }
  }

  getPurchaseSetting () {
    let _self = this
    this.commonService.getModuleSettings('purchase').subscribe(
      (data) => {
        console.log('settings data : ', data)
        if (data.Code === UIConstant.THOUSAND && data.Data) {
          // console.log('purchase settings : ', data.Data)
          _self.purchaseService.getAllSettings(data.Data)
        }
      },
      (error) => {
        console.log(error)
      },
      () => {
        this.getSPUtilityData()
        this.getFormDependency()
      }
    )
  }

  @ViewChild('organisation_select2') organisationSelect2: Select2Component
  onChangeOrganisationId (evt) {
    // console.log('on org select : ', evt)
    if (evt.value && evt.data.length > 0) {
      if (evt.value > 0 && evt.data[0] && evt.data[0].text) {
        this.OrgId = +evt.value
        this.getNewBillNo()
      }
      this.checkForValidation()
    }
  }

  @ViewChild('godown_select2') godownSelect2: Select2Component
  onGodownSelect (evt) {
    console.log(evt)
    if (evt.value && evt.data.length > 0) {
      if (evt.value > 0 && evt.data[0] && evt.data[0].text) {
        this.GodownId = +evt.value
      }
      this.checkForValidation()
    }
  }

  @ViewChild('address_select2') addressSelect2: Select2Component
  onAddressSelect (evt) {
    console.log('onAddressSelect : ', evt)
    if (evt.value && evt.data.length > 0) {
      if (+evt.value === -1) {
        this.addressSelect2.selector.nativeElement.value = ''
        if (this.PartyId) {
          this.commonService.openAddress(this.PartyId)
        } else {
          this.toastrService.showError('Please select Vendor', '')
        }
      } else {
        if (evt.value > 0 && evt.data[0] && evt.data[0].text) {
          this.AddressId = +evt.value
          this.checkForGST()
        }
      }
      this.checkForValidation()
    }
  }

  checkForGST () {
    this.isOtherState = true
    this.allAddressData.forEach(element => {
      if (element.Id === this.AddressId && element.StateId === this.clientStateId) {
        this.isOtherState = false
      }
    })

    if (this.Items.length > 0) {
      this.Items.forEach(item => {
        let total = +(isNaN(+item.PurchaseRate) ? 0 : +item.PurchaseRate)
        * (isNaN(+item.Quantity) || +item.Quantity === 0 ? 1 : +item.Quantity)
        * (isNaN(+item.Length) || +item.Length === 0 ? 1 : +item.Length)
        * (isNaN(+item.Width) || +item.Width === 0 ? 1 : +item.Width)
        * (isNaN(+item.Height) || +item.Height === 0 ? 1 : +item.Height)
        if (item.taxRates.length > 0 && total > 0) {
          let discountedAmount = total - item.DiscountAmt
          item.TaxAmount = +(this.purchaseService.taxCalculation(item.taxRates, item.taxSlabType ,discountedAmount, this.isOtherState)).toFixed(this.noOfDecimalPoint)
        } else {
          item.TaxAmount = 0
        }
      })
    }
    this.calculate()
  }

  onCurrencySelect (evt) {
    // console.log('selected currency : ', evt)
    if (evt.value > 0 && evt.data && evt.data.length > 0 && evt.data[0].text) {
      this.CurrencyId = +evt.value
      this.defaultCurrency = evt.data[0].text
      this.currencyValues[1] = { id: '1', symbol: evt.data[0].text }
      // console.log('currencyValues : ', this.currencyValues)
    }
    this.checkForValidation()
  }

  @ViewChild('referraltype_select2') referraltypeSelect2: Select2Component
  onReferralTypeSelect (evt) {
    // console.log(evt)
    if (evt.value > 0 && evt.data[0] && evt.data[0].text) {
      this.ReferralTypeId = +evt.value
    }
  }

  @ViewChild('taxSlab_select2') taxSlabSelect2: Select2Component
  onTaxSlabSelect (evt) {
    console.log('on change of tax slab : ', evt)
    if (+evt.value === -1) {
      this.commonService.openTax('')
      this.taxSlabSelect2.selector.nativeElement.value = ''
    } else {
      if (evt.value > 0 && evt.data[0] && evt.data[0].text) {
        this.TaxSlabId = +evt.value
        this.taxSlabName = evt.data[0].text
        this.getTaxDetail(this.TaxSlabId)
      }
    }
    this.validateItem()
    this.calculate()
  }

  getTaxDetail (TaxSlabId) {
    this.purchaseService.getSlabData(TaxSlabId).subscribe(
      data => {
        console.log('tax slab data : ', data)
        if (data.Code === UIConstant.THOUSAND && data.Data) {
          this.taxSlabType = (data.Data.TaxSlabs[0]) ? data.Data.TaxSlabs[0].Type : 0
          this.taxRates = data.Data.TaxRates
          this.calculate()
        }
      }
    )
  }

  @ViewChild('taxType_select2') taxTypeSelect2: Select2Component
  onTaxTypeSelect (evt) {
    console.log('on change of tax Type : ', evt)
    if (+evt.value >= 0 && evt.data[0] && evt.data[0].text) {
      this.TaxType = +evt.value
      this.taxTypeName = evt.data[0].text
      this.calculate()
    }
    this.validateItem()
  }

  ConvertToCurrencyId: number
  onConvertToCurrencySelect (evt) {
    // console.log(evt)
    if (evt.value > 0 && evt.data[0] && evt.data[0].text) {
      this.ConvertToCurrencyId = +evt.value
    }
  }

  @ViewChild('referral_select2') referralSelect2: Select2Component
  onRefferalPartnerSelect (evt) {
    // console.log(evt)
    if (evt.value > 0 && evt.data[0] && evt.data[0].text) {
      this.ReferralId = +evt.value
    }
  }

  @ViewChild('freight_By') freightBySelect2: Select2Component
  onFreightSelect (evt) {
    console.log(evt)
    if (evt.value > 0 && evt.data[0] && evt.data[0].text) {
      this.FreightMode = +evt.value
    }
  }

  @ViewChild('payment_select2') paymentSelect2: Select2Component
  onPaymentModeSelect (event) {
    // console.log('payment method select: ', event)
    if (+event.value > 0 && event.data[0] && event.data[0].text) {
      this.Paymode = event.data[0].text
      this.PayModeId = +event.value
      if (event.value === '3') {
        this.BankLedgerName = ''
        this.LedgerId = 0
        this.setpaymentLedgerSelect2(0)
      } else if (event.value === '1') {
        this.paymentLedgerselect2 = [{ id: '1', text: 'Cash' }]
        this.BankLedgerName = 'Cash'
        this.LedgerId = 1
        this.paymentSelect2.setElementValue(this.LedgerId)
        // this.Amount = isNaN(+this.BillAmount) ? 0 : +this.BillAmount
      }
    }
    this.validateTransaction()
  }

  enterPressItem (e: KeyboardEvent) {
    this.addItems()
    setTimeout(() => {
      let item = this.catSelect2.find((item: Select2Component, index: number, array: Select2Component[]) => {
        return index === 0
      })
      item.selector.nativeElement.focus()
    }, 10)
  }

  @ViewChild('savebutton') savebutton: ElementRef
  enterPressTrans (e: KeyboardEvent) {
    let paymentTotal = this.getPaymentTotal()
    if (this.BillAmount === paymentTotal) {
      // const element = this.renderer.selectRootElement(this.savebutton.nativeElement, true)
      // setTimeout(() => element.focus({ preventScroll: false }), 0)
      e.preventDefault()
      this.manipulateData()
    } else {
      this.addTransactions()
      setTimeout(() => {
        this.paymentSelect2.selector.nativeElement.focus()
      }, 10)
    }
  }

  setpaymentLedgerSelect2 (i) {
    let _self = this
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
      }
      _self.paymentLedgerselect2 = newData
      this.validateTransaction()
    },
    (error) => console.log(error),
    () => {
      if (this.editTransId !== -1 && this.PaymentDetail[i]) {
        this.Paymode = this.PaymentDetail[i].Paymode
        this.PayModeId = this.PaymentDetail[i].PayModeId
        this.LedgerId = this.PaymentDetail[i].LedgerId
        this.BankLedgerName = this.PaymentDetail[i].BankLedgerName
        this.Amount = this.PaymentDetail[i].Amount
        this.PayDate = this.PaymentDetail[i].PayDate
        this.ChequeNo = this.PaymentDetail[i].ChequeNo
        this.paymentSelect2.setElementValue(this.PayModeId)
        this.ledgerSelect2.setElementValue(this.LedgerId)
        this.deleteItem(i, 'trans')
      }
    })
  }

  @ViewChild('ledger_select2') ledgerSelect2: Select2Component
  onPaymentLedgerSelect (event) {
    // console.log('payment ledger id : ', event)
    if (+event.value === -1) {
      this.commonService.openLedger('')
      this.ledgerSelect2.selector.nativeElement.value = ''
    } else {
      if (event.value > 0 && event.data[0] && event.data[0].text) {
        this.LedgerId = +event.value
        this.BankLedgerName = event.data[0].text
      }
    }
    this.validateTransaction()
  }

  addTransactions () {
    if (this.Paymode && this.PayModeId && this.LedgerId && this.BankLedgerName && this.Amount && this.PayDate) {
      if ((+this.PayModeId === 3 && this.ChequeNo) || (+this.PayModeId === 1)) {
        if (this.checkValidationForAmount()) {
          this.addTransaction()
          this.clickTrans = true
          this.initialiseTransaction()
          // console.log('transactions : ', this.PaymentDetail)
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

  getPaymentTotal (): number {
    let paymentTotal = 0
    for (let i = 0; i <= this.PaymentDetail.length - 1; i++) {
      paymentTotal = paymentTotal + +this.PaymentDetail[i].Amount
    }
    if (!this.clickTrans) {
      if (+this.Amount) {
        paymentTotal += +this.Amount
      }
    }
    return paymentTotal
  }
  isValidAmount = true
  checkValidationForAmount () {
    let paymentTotal = this.getPaymentTotal()
    paymentTotal = (isNaN(+paymentTotal)) ? 0 : +paymentTotal
    this.BillAmount = (isNaN(+this.BillAmount)) ? 0 : +this.BillAmount
    if (this.BillAmount !== 0) {
      if (paymentTotal > this.BillAmount) {
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

  initialiseTransaction () {
    this.Paymode = ''
    this.PayModeId = 0
    this.LedgerId = 0
    this.Amount = 0
    this.PayDate = this.BillDate
    this.ChequeNo = ''
    this.Paymode = ''
    this.BankLedgerName = ''
    if (this.paymentSelect2 && this.paymentSelect2.selector.nativeElement.value) {
      this.paymentSelect2.setElementValue('')
    }
    if (this.ledgerSelect2 && this.ledgerSelect2.selector.nativeElement.value) {
      this.ledgerSelect2.setElementValue('')
    }
  }

  addTransaction () {
    if (this.PaymentDetail.length === 0) {
      this.PaymentDetail.push({
        Id: 0,
        Sno: 1,
        Paymode: this.Paymode,
        PayModeId: this.PayModeId,
        LedgerId: this.LedgerId,
        BankLedgerName: this.BankLedgerName,
        Amount: +this.Amount,
        PayDate: this.PayDate,
        ChequeNo: this.ChequeNo
      })
    } else {
      let index = +this.PaymentDetail[this.PaymentDetail.length - 1].Sno + 1
      this.PaymentDetail.push({
        Id: 0,
        Sno: index,
        Paymode: this.Paymode,
        PayModeId: this.PayModeId,
        LedgerId: this.LedgerId,
        BankLedgerName: this.BankLedgerName,
        Amount: this.Amount,
        PayDate: this.PayDate,
        ChequeNo: this.ChequeNo
      })
    }
    setTimeout(() => {
      this.commonService.fixTableHFL('trans-table')
    }, 1)
    if (this.editTransId !== -1) {
      this.PaymentDetail[this.PaymentDetail.length - 1].Id = this.editTransId
    }
  }

  addItems () {
    if (+this.ItemId > 0 && this.validateAttribute() && +this.UnitId > 0 && +this.TaxSlabId > 0 && this.PurchaseRate > 0) {
      if ((this.industryId === 5 && this.BatchNo && this.ExpiryDate && this.MfdDate)
       || (this.industryId === 3 && this.Length && this.Width && this.Height)
       || (this.industryId === 2 || this.industryId === 6)) {
        // if (this.editMode) {
        //   this.calculate()
        // }
        this.addItem()
        this.clickItem = true
        console.log('items : ', this.Items)
        if (!this.editMode) {
          this.calculateAllTotal()
        }
        this.initItem()
        if (this.industryId === 5) {
          this.setExpiryDate()
          this.setMfdDate()
        }
      } else {
        // this.toastrService.showError('Please fill the required fields', '')
      }
    } else {
      // this.clickItem = false
      // this.toastrService.showError('Please fill the required fields', '')
    }
  }

  addItem () {
    this.addItemBasedOnIndustry()
    this.ItemAttributeTrans = this.ItemAttributeTrans.concat(this.itemAttributeTrans)
    console.log('ItemAttributeTrans : ', this.ItemAttributeTrans)
    console.log('Items : ', this.Items)
  }

  addItemBasedOnIndustry () {
    if (this.Items.length === 0) {
      this.Items.push({
        Id: 0,
        Sno: 1,
        TransType: this.TransType,
        TransId: this.TransId,
        ChallanId: this.ChallanId,
        CategoryId: +this.categoryId,
        ItemId: +this.ItemId,
        UnitId: +this.UnitId,
        Length: +this.Length,
        Height: +this.Height,
        Width: +this.Width,
        Quantity: +this.Quantity,
        SaleRate: +this.SaleRate,
        MrpRate: +this.MrpRate,
        PurchaseRate: +this.PurchaseRate,
        TaxSlabId: +this.TaxSlabId,
        TaxType: +this.TaxType,
        TaxAmount: +this.TaxAmount,
        DiscountType: +this.DiscountType,
        Discount: +this.Discount,
        DiscountAmt: +this.DiscountAmt,
        ExpiryDate: this.ExpiryDate,
        MfdDate: this.MfdDate,
        BatchNo: this.BatchNo,
        Remark: this.Remark,
        itemName: this.itemName,
        categoryName: this.categoryName,
        unitName: this.unitName,
        taxSlabName: this.taxSlabName,
        taxTypeName: this.taxTypeName,
        SubTotal: this.SubTotal,
        itemAttributeTrans: this.itemAttributeTrans,
        taxRates: this.taxRates,
        taxSlabType: this.taxSlabType
      })
    } else {
      let index = +this.Items[this.Items.length - 1].Sno + 1
      this.Items.push({
        Id: 0,
        Sno: index,
        TransType: this.TransType,
        TransId: this.TransId,
        ChallanId: this.ChallanId,
        CategoryId: +this.categoryId,
        ItemId: +this.ItemId,
        UnitId: +this.UnitId,
        Length: +this.Length,
        Height: +this.Height,
        Width: +this.Width,
        Quantity: +this.Quantity,
        SaleRate: +this.SaleRate,
        MrpRate: +this.MrpRate,
        PurchaseRate: +this.PurchaseRate,
        TaxSlabId: +this.TaxSlabId,
        TaxType: +this.TaxType,
        TaxAmount: +this.TaxAmount,
        DiscountType: +this.DiscountType,
        Discount: +this.Discount,
        DiscountAmt: +this.DiscountAmt,
        ExpiryDate: this.ExpiryDate,
        MfdDate: this.MfdDate,
        BatchNo: this.BatchNo,
        Remark: this.Remark,
        itemName: this.itemName,
        categoryName: this.categoryName,
        unitName: this.unitName,
        taxSlabName: this.taxSlabName,
        taxTypeName: this.taxTypeName,
        SubTotal: this.SubTotal,
        itemAttributeTrans: this.itemAttributeTrans,
        taxRates: this.taxRates,
        taxSlabType: this.taxSlabType
      })
    }

    setTimeout(() => {
      this.commonService.fixTableHFL('item-table')
    }, 1)

    if (this.editItemId !== -1) {
      this.Items[this.Items.length - 1].Id = this.editItemId
    }
  }

  @ViewChildren('attr_select2') attrSelect2: QueryList<Select2Component>
  editItem (i, editId, type) {
    console.log('editId : ', editId)
    if (type === 'trans' && this.editTransId === -1) {
      this.editTransId = editId
      i = i - 1
      if (+this.PaymentDetail[i].PayModeId === 3) {
        this.paymentSelect2.setElementValue('')
        this.ledgerSelect2.setElementValue('')
        this.setpaymentLedgerSelect2(i)
      } else if (+this.PaymentDetail[i].PayModeId === 1) {
        this.paymentLedgerselect2 = [{ id: '1', text: 'Cash' }]
        this.Paymode = this.PaymentDetail[i].Paymode
        this.PayModeId = this.PaymentDetail[i].PayModeId
        this.LedgerId = this.PaymentDetail[i].LedgerId
        this.BankLedgerName = this.PaymentDetail[i].BankLedgerName
        this.Amount = this.PaymentDetail[i].Amount
        this.PayDate = this.PaymentDetail[i].PayDate
        this.ChequeNo = this.PaymentDetail[i].ChequeNo
        this.paymentSelect2.setElementValue(this.PayModeId)
        this.ledgerSelect2.setElementValue(this.LedgerId)
        this.deleteItem(i, type)
      }
    } else if (type === 'trans' && this.editTransId !== -1) {
      this.toastrService.showInfo('', 'There is already one transaction to edit, please update it this first in order to edit others')
    }
    if (type === 'items' && this.editItemId === -1) {
      this.editItemId = editId
      i = i - 1
      this.TransType = 0
      this.TransId = 0
      this.ChallanId = 0
      this.categoryName = this.Items[i].categoryName
      this.itemName = this.Items[i].itemName
      this.unitName = this.Items[i].unitName
      this.taxSlabName = this.Items[i].taxSlabName
      this.taxTypeName = this.Items[i].taxTypeName
      this.categoryId = this.Items[i].CategoryId
      this.ItemId = this.Items[i].ItemId
      this.UnitId = this.Items[i].UnitId
      this.Length = this.Items[i].Length
      this.Height = this.Items[i].Height
      this.Width = this.Items[i].Width
      this.Quantity = this.Items[i].Quantity
      this.SaleRate = this.Items[i].SaleRate
      this.MrpRate = this.Items[i].MrpRate
      this.PurchaseRate = this.Items[i].PurchaseRate
      this.TaxSlabId = this.Items[i].TaxSlabId
      this.TaxType = this.Items[i].TaxType
      this.TaxAmount = this.Items[i].TaxAmount
      this.DiscountType = this.Items[i].DiscountType
      this.Discount = this.Items[i].Discount
      this.DiscountAmt = this.Items[i].DiscountAmt
      this.ExpiryDate = this.Items[i].ExpiryDate
      this.MfdDate = this.Items[i].MfdDate
      this.BatchNo = this.Items[i].BatchNo
      this.Remark = this.Items[i].Remark
      this.SubTotal = this.Items[i].SubTotal
      this.taxRates = this.Items[i].taxRates
      this.taxSlabType = this.Items[i].taxSlabType
      this.itemAttributeTrans = this.Items[i].itemAttributeTrans
      this.unitSelect2.setElementValue(this.UnitId)
      this.itemselect2.setElementValue(this.ItemId)
      this.taxSlabSelect2.setElementValue(this.TaxSlabId)
      this.taxTypeSelect2.setElementValue(this.TaxType)
      console.log('attrSelect2 : ', this.attrSelect2)
      if (this.attrSelect2.length > 0) {
        this.attrSelect2.forEach((item: Select2Component, index: number, array: Select2Component[]) => {
          console.log('attr : ', item)
          item.setElementValue(this.itemAttributeTrans[index].AttributeId)
        })
      }
      this.updateCategories(this.categoryId)
      this.deleteItem(i, type)
    } else if (type === 'items' && this.editItemId !== -1) {
      this.toastrService.showInfo('', 'There is already one item to edit, please update it this first in order to edit others')
    }
  }

  deleteItem (i, forArr) {
    if (forArr === 'trans') {
      this.PaymentDetail.splice(i,1)
      this.checkValidationForAmount()
      this.editTransId = -1
    }
    if (forArr === 'items') {
      this.Items.splice(i,1)
      this.editItemId = -1
      this.ItemAttributeTrans = []
      this.Items.forEach(item => {
        this.ItemAttributeTrans = this.ItemAttributeTrans.concat([], item.itemAttributeTrans)
      })
    }
    this.calculate()
  }

  closePurchase () {
    this.commonService.closePurchase()
  }

  initItem () {
    this.TransType = 0
    this.TransId = 0
    this.ChallanId = 0
    this.ItemId = 0
    this.itemName = ''
    this.UnitId = 0
    this.unitName = ''
    this.categoryName = ''
    this.Length = 1
    this.Height = 1
    this.Width = 1
    this.Quantity = 1
    this.SaleRate = 0
    this.MrpRate = 0
    this.PurchaseRate = 0
    this.DiscountType = 0
    this.Discount = 0
    this.DiscountAmt = 0
    this.TaxSlabId = 0
    this.taxSlabName = ''
    this.TaxType = 0
    this.TaxAmount = 0
    this.ExpiryDate = ''
    this.MfdDate = ''
    this.BatchNo = ''
    this.Remark = ''
    this.categoryId = 0
    this.SubTotal = 0
    this.editItemId = -1
    this.clickItem = false
    console.log('categories : ', this.categories)
    if (this.allCategories && this.allCategories.length > 0) {
      this.getCatagoryDetail(this.allCategories)
    }
    if (this.allItems && this.allItems.length > 0) {
      this.purchaseService.createItems(this.allItems)
    }
    if (this.taxTypeSelect2) {
      this.taxTypeSelect2.setElementValue(this.TaxType)
    }
    if (this.unitSelect2) {
      this.unitSelect2.setElementValue(this.UnitId)
    }
    if (this.itemselect2) {
      this.itemselect2.setElementValue(this.ItemId)
    }
    if (this.taxSlabSelect2) {
      this.taxSlabSelect2.setElementValue(this.TaxSlabId)
    }
    this.taxTypeName = 'Exclusive'
    // console.log('catSelect2 : ', this.catSelect2)
    this.taxRates = []
    this.taxSlabType = 0
    if (this.catSelect2.length > 0) {
      this.catSelect2.forEach((item: Select2Component, index: number, array: Select2Component[]) => {
        // console.log('catSelect2 : ', item)
        item.setElementValue(0)
        item.selector.nativeElement.value = ''
      })
    }
    this.itemAttributeTrans = []
    this.initAttribute()
  }

  initAttribute () {
    this.ItemId = 0
    this.ItemTransId = 0
    this.AttributeId = 0
    this.ParentTypeId = 0
    this.name = ''
    // console.log('attrSelect2 : ', this.attrSelect2)
    if (this.attrSelect2.length > 0) {
      this.attrSelect2.forEach((item: Select2Component, index: number, array: Select2Component[]) => {
        // console.log('attr : ', item)
        if ($('.attr') && $('.attr')[index]) {
          $('#' + $('.attr')[index].id).removeClass('errorSelecto')
        }
        item.setElementValue(0)
      })
    }
  }

  initTransaction () {
    this.Paymode = ''
    this.PayModeId = 0
    this.LedgerId = 0
    this.Amount = 0
    this.BankLedgerName = ''
    this.ChequeNo = ''
    this.PayDate = ''
    this.ledger = 0
    this.paymode = 0
    this.clickTrans = false
    this.editTransId = -1
    if (this.ledgerSelect2) {
      this.ledgerSelect2.setElementValue('')
    }
    if (this.paymentSelect2) {
      this.paymentSelect2.setElementValue('')
    }
  }

  initComp () {
    this.BillAmount = 0
    this.BillDate = ''
    this.PartyBillDate = ''
    this.PartyBillNo = ''
    this.BillNo = ''
    this.AddressId = 0
    this.ConvertedAmount = 0
    this.CurrencyRate = 0
    this.TotalDiscount = 0
    this.Freight = 0
    this.FreightMode = 1
    this.PartyId = 0
    this.ReferralId = 0
    this.ReferralTypeId = 0
    this.ReferralComission = 0
    this.ReferralComissionTypeId = 0
    this.ReverseCharge = 0
    this.ReverseTax = 0
    this.Cess = 0
    this.CessAmount = 0
    this.RoundOff = 0
    this.SubTotalAmount = 0
    this.TotalTaxAmount = 0
    this.TotalChallan = 0
    this.VehicleNo = ''
    this.LocationTo = ''
    this.Drivername = ''
    this.Transportation = ''
    this.TotalQty = 0
    this.OtherCharge = 0
    this.GodownId = 0
    this.CurrencyId = 0
    this.ConvertToCurrencyId = 0
    this.OrgId = 0
    this.InterestRate = 0
    this.InterestAmount = 0
    this.InterestType = 0
    this.DueDate = ''
    this.OrderId = 0
    this.Advanceamount = 0
    this.NetAmount = 0
    this.ReferralCommission = 0
    this.ReferralCommissionTypeId = 0
    this.CreditLimit = 0
    this.CreditDays = 0
    this.ItemAttributeTrans = []
    this.PaymentDetail = []
    this.Items = []
    this.clickTrans = false
    this.clickItem = false
    this.submitSave = false
    this.isValidAmount = true
    this.invalidObj = {}
    if (this.freightBySelect2) {
      this.freightBySelect2.setElementValue(1)
    }
    if (this.addressSelect2) {
      this.addressSelect2.setElementValue(0)
    }
    if (this.referraltypeSelect2) {
      this.referraltypeSelect2.setElementValue(0)
    }
    if (this.referralSelect2) {
      this.referralSelect2.setElementValue(0)
    }
    if (this.vendorSelect2) {
      this.vendorSelect2.setElementValue(0)
    }
    if (this.convertToSelect2) {
      this.convertToSelect2.setElementValue(0)
    }
    if (this.currencySelect2) {
      this.currencySelect2.setElementValue(0)
    }
  }

  initialiseExtras () {
    if (this.organisationsData.length > 0) {
      this.OrgId = +this.organisationsData[0].id
      this.organisationValue = +this.organisationsData[0].id
    }
    if (this.godownsData.length === 1) {
      this.GodownId = +this.godownsData[0].id
      this.godownValue = +this.godownsData[0].id
    }
    if (this.currencyData.length >= 1) {
      this.CurrencyId = +this.currencyData[0].id
      this.currencyValue = +this.currencyData[0].id
    }
    if (this.convertToCurrencyData.length >= 1) {
      this.ConvertToCurrencyId = +this.convertToCurrencyData[0].id
      this.convertToCurrencyValue = +this.convertToCurrencyData[0].id
    }
    this.setBillDate()
    this.setPartyBillDate()
    this.setPayDate()
    this.setExpiryDate()
    this.setDueDate(0)
    this.setMfdDate()
  }

  private purchaseAddParams (): PurchaseAdd {
    let BillDate = this.gs.clientToSqlDateFormat(this.BillDate, this.clientDateFormat)
    let PartyBillDate = this.gs.clientToSqlDateFormat(this.PartyBillDate, this.clientDateFormat)
    let DueDate = this.gs.clientToSqlDateFormat(this.DueDate, this.clientDateFormat)
    let Items = JSON.parse(JSON.stringify(this.Items))
    let PaymentDetail = JSON.parse(JSON.stringify(this.PaymentDetail))
    Items.forEach(item => {
      item.ExpiryDate = (item.ExpiryDate) ? this.gs.clientToSqlDateFormat(item.ExpiryDate, this.clientDateFormat) : ''
      item.MfdDate = (item.MfdDate) ? this.gs.clientToSqlDateFormat(item.MfdDate, this.clientDateFormat) : ''
    })
    PaymentDetail.forEach(transaction => {
      transaction.PayDate = this.gs.clientToSqlDateFormat(transaction.PayDate, this.clientDateFormat)
    })

    const purchaseAddParams = {
      obj: {
        Id: this.Id ? this.Id : UIConstant.ZERO,
        ReferralCommissionTypeId : +this.ReferralCommissionTypeId,
        ReferralCommission: +this.ReferralCommission,
        PaymentDetail: PaymentDetail,
        Items: Items,
        BillAmount: this.BillAmount,
        BillDate: BillDate,
        PartyBillDate: PartyBillDate,
        PartyBillNo: this.PartyBillNo,
        BillNo: this.BillNo,
        ConvertedAmount: 0,
        CurrencyRate: 0,
        TotalDiscount: +this.TotalDiscount,
        Freight: +this.Freight,
        FreightMode: +this.FreightMode,
        PartyId: +this.PartyId,
        ReferralId: this.ReferralId,
        ReferralTypeId: this.ReferralTypeId,
        ReferralComission: 0,
        ReferralComissionTypeId: 0,
        ReverseCharge: 0,
        ReverseTax: 0,
        CessAmount: +this.CessAmount,
        RoundOff: this.RoundOff,
        SubTotalAmount: +this.SubTotalAmount,
        TotalTaxAmount: +this.TotalTaxAmount,
        TotalChallan: 0,
        VehicleNo: this.VehicleNo,
        LocationTo: this.LocationTo,
        Drivername: this.Drivername,
        Transportation: this.Transportation,
        TotalQty: +this.TotalQty,
        OtherCharge: +this.OtherCharge,
        GodownId: +this.GodownId,
        CurrencyId: +this.CurrencyId,
        OrgId: +this.OrgId,
        InterestRate: this.InterestRate,
        InterestAmount: 0,
        InterestType: this.InterestType,
        DueDate: DueDate,
        OrderId: 0,
        Advanceamount: 0,
        NetAmount: 0,
        AddressId: this.AddressId,
        ConvertedCurrencyId: this.ConvertToCurrencyId,
        ItemAttributeTrans: this.ItemAttributeTrans
      } as PurchaseAdd
    }
    console.log('obj : ', JSON.stringify(purchaseAddParams.obj))
    return purchaseAddParams.obj
  }

  validateTransaction () {
    if (this.Paymode || +this.PayModeId > 0 || +this.LedgerId > 0 || this.BankLedgerName || +this.Amount > 0 || this.ChequeNo) {
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
      if (this.BankLedgerName) {
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
    }
    this.clickTrans = false
  }

  checkForValidation () {
    if (this.PartyId || this.OrgId || this.BillDate || this.BillNo
      || this.PartyBillDate || this.PartyBillNo || this.CurrencyId
      || this.GodownId || this.AddressId || this.FreightMode
      || this.ItemId || this.UnitId || this.TaxSlabId
      || this.PurchaseRate
      || this.BatchNo || this.ExpiryDate || this.MfdDate
      || this.Length || this.Width || this.Height
      ) {
      let isValid = 1
      if (+this.PartyId > 0) {
        this.invalidObj['PartyId'] = false
      } else {
        this.invalidObj['PartyId'] = true
        isValid = 0
      }
      if (+this.OrgId > 0) {
        this.invalidObj['OrgId'] = false
      } else {
        this.invalidObj['OrgId'] = true
        isValid = 0
      }
      if (this.BillDate) {
        this.invalidObj['BillDate'] = false
      } else {
        this.invalidObj['BillDate'] = true
        isValid = 0
      }
      if (this.BillNo) {
        this.invalidObj['BillNo'] = false
      } else {
        this.invalidObj['BillNo'] = true
        isValid = 0
      }
      if (this.PartyBillDate) {
        this.invalidObj['PartyBillDate'] = false
      } else {
        this.invalidObj['PartyBillDate'] = true
        isValid = 0
      }
      if (this.PartyBillNo) {
        this.invalidObj['PartyBillNo'] = false
      } else {
        this.invalidObj['PartyBillNo'] = true
        isValid = 0
      }
      if (this.CurrencyId) {
        this.invalidObj['CurrencyId'] = false
      } else {
        this.invalidObj['CurrencyId'] = true
        isValid = 0
      }
      if (this.GodownId) {
        this.invalidObj['GodownId'] = false
      } else {
        this.invalidObj['GodownId'] = true
        isValid = 0
      }
      if (this.AddressId) {
        this.invalidObj['AddressId'] = false
      } else {
        this.invalidObj['AddressId'] = true
        isValid = 0
      }
      if (+this.FreightMode > 0) {
        this.invalidObj['FreightMode'] = false
      } else {
        this.invalidObj['FreightMode'] = true
        isValid = 0
      }
      if (this.Items.length === 0 && this.submitSave) {
        isValid = 0
        if (+this.ItemId > 0) {
          this.invalidObj['ItemId'] = false
        } else {
          isValid = 0
          this.invalidObj['ItemId'] = true
        }
        if (+this.UnitId > 0) {
          this.invalidObj['UnitId'] = false
        } else {
          isValid = 0
          this.invalidObj['UnitId'] = true
        }
        if (+this.TaxSlabId > 0) {
          this.invalidObj['TaxSlabId'] = false
        } else {
          isValid = 0
          this.invalidObj['TaxSlabId'] = true
        }
        if (+this.PurchaseRate > 0) {
          this.invalidObj['PurchaseRate'] = false
        } else {
          isValid = 0
          this.invalidObj['PurchaseRate'] = true
        }
        if (+this.Quantity > 0) {
          this.invalidObj['Quantity'] = false
        } else {
          isValid = 0
          this.invalidObj['Quantity'] = true
        }
        if (this.industryId === 5) {
          if (this.BatchNo) {
            this.invalidObj['BatchNo'] = false
          } else {
            isValid = 0
            this.invalidObj['BatchNo'] = true
          }
          if (this.MfdDate) {
            this.invalidObj['MfdDate'] = false
          } else {
            isValid = 0
            this.invalidObj['MfdDate'] = true
          }
          if (this.ExpiryDate) {
            this.invalidObj['ExpiryDate'] = false
          } else {
            isValid = 0
            this.invalidObj['ExpiryDate'] = true
          }
        }
        if (this.industryId === 3) {
          if (+this.Length > 0) {
            this.invalidObj['Length'] = false
          } else {
            isValid = 0
            this.invalidObj['Length'] = true
          }
          if (+this.Height > 0) {
            this.invalidObj['Height'] = false
          } else {
            isValid = 0
            this.invalidObj['Height'] = true
          }
          if (+this.Width > 0) {
            this.invalidObj['Width'] = false
          } else {
            isValid = 0
            this.invalidObj['Width'] = true
          }
        }
        this.attrSelect2.forEach((attr: Select2Component, index: number, array: Select2Component[]) => {
          if (this.itemAttributeTrans[index] && this.itemAttributeTrans[index].AttributeId > 0) {
            $('#' + $('.attr')[index].id).removeClass('errorSelecto')
          } else {
            isValid = 0
            $('#' + $('.attr')[index].id).addClass('errorSelecto')
          }
        })
      }
      return !!isValid
    }
  }

  validateItem () {
    if (+this.ItemId > 0) {
      let isValid = 1
      if (+this.ItemId > 0) {
        this.invalidObj['ItemId'] = false
      } else {
        isValid = 0
        this.invalidObj['ItemId'] = true
      }
      if (+this.UnitId > 0) {
        this.invalidObj['UnitId'] = false
      } else {
        isValid = 0
        this.invalidObj['UnitId'] = true
      }
      if (+this.TaxSlabId > 0) {
        this.invalidObj['TaxSlabId'] = false
      } else {
        isValid = 0
        this.invalidObj['TaxSlabId'] = true
      }
      if (+this.PurchaseRate > 0) {
        this.invalidObj['PurchaseRate'] = false
      } else {
        isValid = 0
        this.invalidObj['PurchaseRate'] = true
      }
      if (+this.Quantity > 0) {
        this.invalidObj['Quantity'] = false
      } else {
        isValid = 0
        this.invalidObj['Quantity'] = true
      }
      if (this.industryId === 5) {
        if (this.BatchNo) {
          this.invalidObj['BatchNo'] = false
        } else {
          isValid = 0
          this.invalidObj['BatchNo'] = true
        }
        if (this.MfdDate) {
          this.invalidObj['MfdDate'] = false
        } else {
          isValid = 0
          this.invalidObj['MfdDate'] = true
        }
        if (this.ExpiryDate) {
          this.invalidObj['ExpiryDate'] = false
        } else {
          isValid = 0
          this.invalidObj['ExpiryDate'] = true
        }
      }
      if (this.industryId === 3) {
        if (+this.Length > 0) {
          this.invalidObj['Length'] = false
        } else {
          isValid = 0
          this.invalidObj['Length'] = true
        }
        if (+this.Height > 0) {
          this.invalidObj['Height'] = false
        } else {
          isValid = 0
          this.invalidObj['Height'] = true
        }
        if (+this.Width > 0) {
          this.invalidObj['Width'] = false
        } else {
          isValid = 0
          this.invalidObj['Width'] = true
        }
      }
      this.attrSelect2.forEach((attr: Select2Component, index: number, array: Select2Component[]) => {
        if (this.itemAttributeTrans[index] && this.itemAttributeTrans[index].AttributeId > 0) {
          $('#' + $('.attr')[index].id).removeClass('errorSelecto')
        } else {
          isValid = 0
          $('#' + $('.attr')[index].id).addClass('errorSelecto')
        }
      })
      this.validItem = !!isValid
    } else {
      this.validItem = true
    }
  }

  validateAttribute () {
    let isValid = true
    this.attrSelect2.forEach((attr: Select2Component, index: number, array: Select2Component[]) => {
      if (this.itemAttributeTrans[index] && this.itemAttributeTrans[index].AttributeId > 0) {
        //
      } else {
        isValid = false
      }
    })
    return isValid
  }

  manipulateData () {
    let _self = this
    this.submitSave = true
    let dataToSend = this.purchaseAddParams()
    let valid = 1
    this.commonService.checkForExistence(this.checkForExistence, dataToSend).subscribe(
      (data) => {
        console.log('existence : ', data)
        if (data.Code === UIConstant.THOUSAND && data.Data) {
          data.Data.forEach(element => {
            if (+element.Status === 1) {
              this.invalidObj[element.FormKeyName] = true
              valid = 0
            }
          })
        }
      },
      (error) => {
        console.log(error)
      },
      () => {
        this.addItems()
        this.addTransactions()
        this.calculateAllTotal()
        this.validateItem()
        this.validateTransaction()
        this.checkValidationForAmount()
        if (valid) {
          if (this.checkForValidation() && this.isValidAmount && this.validItem && this.validTransaction) {
            this.purchaseService.postPurchase(this.purchaseAddParams()).subscribe(
              data => {
                console.log('data : ', data)
                if (data.Code === UIConstant.THOUSAND && data.Data) {
                  _self.toastrService.showSuccess('Saved Successfully', '')
                  _self.commonService.newPurchaseAdd()
                  if (!this.keepOpen) {
                    _self.commonService.closePurchase()
                  } else {
                    _self.initItem()
                    _self.initTransaction()
                    _self.initComp()
                    _self.initialiseExtras()
                  }
                } else if (data.Code === UIConstant.THOUSANDONE) {
                  _self.toastrService.showError(data.Message, 'Please change Bill No.')
                } else {
                  _self.toastrService.showError(data.Message, '')
                }
              }
            )
          }
        } else {
          this.toastrService.showError('The following are not unique', '')
        }
      }
    )
  }

  ngOnDestroy () {
    this.unitAdd$.unsubscribe()
    this.attr$.unsubscribe()
    this.item$.unsubscribe()
    this.vendorData$.unsubscribe()
    this.taxProcessesData$.unsubscribe()
    this.paymentModesData$.unsubscribe()
    this.organisationsData$.unsubscribe()
    this.godownsData$.unsubscribe()
    this.referralTypesData$.unsubscribe()
    this.referralsData$.unsubscribe()
    this.taxSlabsData$.unsubscribe()
    this.currencyData$.unsubscribe()
    this.addressData$.unsubscribe()
    this.newVendAdd$.unsubscribe()
    this.addressAdd$.unsubscribe()
    this.itemAdd$.unsubscribe()
    this.taxAdd$.unsubscribe()
    this.unitAdd$.unsubscribe()
    this.ledgerAdd$.unsubscribe()
    this.settingData$.unsubscribe()
    this.freightData$.unsubscribe()
    this.subUnitsData$.unsubscribe()
  }
}
