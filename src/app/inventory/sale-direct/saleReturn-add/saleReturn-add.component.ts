import { Component, ViewChild, QueryList, ViewChildren, Renderer2, ElementRef } from '@angular/core'
import { UIConstant } from 'src/app/shared/constants/ui-constant'
import { Select2OptionData, Select2Component } from 'ng2-select2'
import { SaleDirectReturnService } from '../sales-return/saleReturn.service';
import { Subject, forkJoin, throwError, Subscription } from 'rxjs';
import { PurchaseAttribute, AddCust, SaleReturnRequestAdd, PurchaseTransaction, SaleReturnItems } from '../../../model/sales-tracker.model'
import { CommonService } from '../../../commonServices/commanmaster/common.services'
import { ToastrCustomService } from '../../../commonServices/toastr.service'
import { Settings } from '../../../shared/constants/settings.constant'
import { GlobalService } from '../../../commonServices/global.service'
import { SetUpIds } from 'src/app/shared/constants/setupIds.constant'
import { AdditionalCharges, ItemTaxTrans } from '../../../model/sales-tracker.model';
import { FormConstants } from 'src/app/shared/constants/forms.constant';
import { takeUntil, catchError, filter, map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';


declare const $: any
declare const _: any
@Component({
  selector: 'app-saleReturn',
  templateUrl: './saleReturn-add.component.html',
  styleUrls: ['./saleReturn-add.component.css']
})
export class SaleDirectReturnComponent {
  onDestroy$ = new Subject()
  loading: boolean = true
  catLevel: number = 1
  categories: Array<{ placeholder: string, value: string, data: Array<Select2OptionData>, level: number }> = []
  data$: Subscription
  attributesData: Array<Select2OptionData>
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
  chargesData: Array<Select2OptionData>
  tempChargeData: any = []
  subUnitsValue: number
  attributeValue: number
  itemValue: number
  vendorValue: number
  taxProcessValue: number
  paymentModeValue: number
  organisationValue: number
  godownValue: number
  referralTypesValue: number
  referralValue: number
  taxSlabValue: number
  currencyValue: number
  convertToCurrencyValue: number
  addressValue: number
  LedgerChargeValue: number
  LedgerNameValue: string
  AmountChargeValue: number
  TaxSlabChargeValue: number
  TaxAmountChargeValue: number
  TotalAmountChargeValue: number
  ledgerChargeValue: number
  taxSlabChargeValue: number
  clientDateFormat: string = ''
  currency: any
  defaultCurrency: string
  setupModules: any
  currencyValues: Array<{ id: string, symbol: string }> = [{ id: '0', symbol: '%' }]
  LedgerChargeId: number
  LedgerName: string
  AmountCharge: number
  TaxableAmountCharge: number
  TaxSlabChargeId: number
  TaxChargeName: string
  TaxAmountCharge: number
  TotalAmountCharge: number
  taxChargeSlabType: number
  taxChargeRates: Array<any> = []
  TaxTypeCharge: number = 0
  itemTaxTrans: Array<ItemTaxTrans> = []
  taxTypeChargeName: string

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

  TaxTypeTax: number
  AmountTax: number
  ItemTransTaxId: number
  ParentTaxId: number
  ParentTypeTaxId: number
  ItemTransTypeTax: number
  TaxRateNameTax: string
  TaxRateId: number
  TaxRate: number
  ValueType: number
  TaxSlabName: string
  editChargeSno: number = 0

  ItemTaxTrans: Array<ItemTaxTrans> = []
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
  TotalRate: number
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
  AmountItem: number
  SubTotal: number
  taxSlabType: number
  taxRates: Array<any> = []
  attributeKeys: any = []
  BillAmount: number
  BillDate: string
  CurrentDate: string
  PartyBillDate: string
  PartyBillNo: string
  BillNo: string
  ConvertedAmount: number
  CurrencyRate: number
  TotalDiscount: number
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
  RoundOffManual: number
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
  DueDate: string = ''
  OrderId: number
  Advanceamount: number
  NetAmount: number
  LocationTo: string
  itemAttributeTrans: Array<PurchaseAttribute> = []
  ItemAttributeTrans: Array<PurchaseAttribute> = []
  PaymentDetail: Array<PurchaseTransaction> = []
  AdditionalCharges: Array<AdditionalCharges> = []
  Items: Array<SaleReturnItems> = []
  categoryId: number
  AddressId: number
  editTransId: number = -1
  editItemId: number = -1
  editItemSno: number = 0
  editChargeId: number = -1
  validItem: boolean = true
  validDiscount: boolean = true
  validTransaction: boolean = true
  validCharge: boolean = true
  clickItem = false
  clickTrans = false
  clickCharge = false

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
  formReadySub = new Subject<boolean>()
  fromReady$ = this.formReadySub.asObservable()
  settings$: Subscription
  invalidObj: any = {}
  previousBillNo: string = ''
  keepOpen: boolean = false
  isAddNew: boolean = false
  creatingForm: boolean = false
  ReturnID :number
  EditID:number
  TransactionNoSetups: any
  loadingSummary: boolean = false
  constructor(private _loaderService: NgxSpinnerService, private commonService: CommonService,
    private _saleDirectReturnService: SaleDirectReturnService,
    private toastrService: ToastrCustomService,
    private settings: Settings,
    private renderer: Renderer2,
    private gs: GlobalService) {
    this.getFormDependency()
    this.commonService.getSaleDirectReturnStatus().subscribe(
      (status: AddCust) => {
        if (status.open) {
          if (+status.editId > 0 && status.type === 'return') {
            this.creatingForm = true
            this.editMode = false
            this.Id = +status.editId
            this.ReturnID = +status.editId
          }
          this.openModal()
        } else {
          this.closeModal()
        }
      }
    )
    this.data$ = this.commonService.getSaleDirectActionClickedStatus().subscribe(
      (action: any) => {
        if (action.type === FormConstants.Return && action.formname === FormConstants.SaleForm) {
          this.creatingForm = true
          this.editMode = false
          this.ReturnID = +action.id 
          this.Id = +action.id
          this.openModal()
        }
      }
    )
    
    this.data$ = this.commonService.getActionSaleReturnClickedStatus().subscribe(
      (action: any) => {
        if (action.type === FormConstants.Edit && action.formname === FormConstants.SaleForm) {
          this.creatingForm = true
          this.editMode = true
          this.EditID = +action.id 
          this.Id = +action.id
          this.openModal()
        }
      }
    )
    this.commonService.getAttributeStatus().pipe(takeUntil(this.onDestroy$)).subscribe(
      data => {
        if (data.id && data.name && data.AttributeId) {
          let indexOfAttr = -1
          if(this.attributesData.length >0){
          for (let i = 0; i < this.attributesData.length; i++) { if (this.attributesData[i]['attributeId'] === data.AttributeId) { indexOfAttr = i; break; } }
          if (indexOfAttr >= 0) {
            let itemAttributeTrans = JSON.parse(JSON.stringify(this.itemAttributeTrans))
            let newData = Object.assign([], this.attributesData[indexOfAttr]['data'])
            newData.push({ id: +data.id, text: data.name });
            this.attributesData[indexOfAttr]['data'] = Object.assign([], newData)
            console.log('this.attributesData : ', this.attributesData)
            setTimeout(() => {
              this.attrSelect2.forEach((attr: Select2Component, index: number, array: Select2Component[]) => {
                if (index === indexOfAttr) {
                  attr.setElementValue(data.id)
                  $('#' + $('.attr')[index].id).removeClass('errorSelecto')
                } else if (itemAttributeTrans[index].AttributeId) {
                  attr.setElementValue(itemAttributeTrans[index].AttributeId)
                  $('#' + $('.attr')[index].id).removeClass('errorSelecto')
                } else {
                  $('#' + $('.attr')[index].id).addClass('errorSelecto')
                }
              })
            }, 100)
          }
        }
        }
      }
    )

    this.commonService.getledgerCretionStatus().pipe(takeUntil(this.onDestroy$)).subscribe(
      data => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.chargesData)
          newData.push({ id: +data.id, text: data.name })
          this.chargesData = newData
          this.LedgerChargeId = +data.id
          this.ledgerChargeValue = data.id
          //  this.alreadySelectCharge(+data.id,  data.name, false)
          setTimeout(() => {
            if (this.chargeSelect2) {
              const element = this.renderer.selectRootElement(this.chargeSelect2.selector.nativeElement, true)
              element.focus({ preventScroll: false })
            }
          }, 2000)
        }
      }
    )

    this.commonService.getCategoryStatus().pipe(takeUntil(this.onDestroy$)).subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let categoryId = data.id
          let categoryName = data.name
          this.isAddNew = true
          this.getAllCategories(categoryName, categoryId, this.isAddNew)
        }
      }
    )

    this.fromReady$.pipe(takeUntil(this.onDestroy$)).subscribe(
      (formReady) => {
        if (formReady) {
          //  this.loading = false
          this._loaderService.hide()
          //if (this.editMode) {
          this.vendorValue = this.PartyId
          this.organisationValue = this.OrgId
          // this.vendorSelect2.setElementValue(this.PartyId)
          // this.organisationSelect2.setElementValue(this.OrgId)
          // this.godownSelect2.setElementValue(this.GodownId)
          // this.addressSelect2.setElementValue(this.AddressId)
          // this.currencySelect2.setElementValue(this.CurrencyId)
          // this.convertToSelect2.setElementValue(this.ConvertToCurrencyId)
          // this.referralSelect2.setElementValue(this.ReferralId)
          // this.referraltypeSelect2.setElementValue(this.ReferralTypeId)
          //}
        }
      }
    )

    this._saleDirectReturnService.vendorData$.pipe(takeUntil(this.onDestroy$)).subscribe(
      data => {
        if (data.data) {
          this.vendorData = data.data
          console.log('this.vendorData : ', this.vendorData)
        }
      }
    )

    this._saleDirectReturnService.taxProcessesData$.pipe(takeUntil(this.onDestroy$)).subscribe(
      data => {
        if (data.data) {
          this.taxProcessesData = data.data
        }
      }
    )
    this._saleDirectReturnService.paymentModesData$.pipe(takeUntil(this.onDestroy$)).subscribe(
      data => {
        if (data.data) {
          this.paymentModesData = data.data
        }
      }
    )
    // this._saleDirectReturnService.organisationsData$.pipe(takeUntil(this.onDestroy$)).subscribe(
    //   data => {
    //     if (data.data) {
    //       this.organisationsData = data.data
    //       if (this.organisationsData.length >= 1) {
    //         this.OrgId = +this.organisationsData[0].id
    //         this.organisationValue = +this.organisationsData[0].id
    //         this.OrgGStType = this.organisationsData[0]
    //         console.log(this.OrgGStType)
    //         if (this.isBillNoManuall) {
    //           this.BillDate = this.gs.getDefaultDate(this.clientDateFormat)
    //           //this.getNewBillNo()
    //         }
    //       }
    //     }
    //   }
    // )
    this._saleDirectReturnService.godownsData$.pipe(takeUntil(this.onDestroy$)).subscribe(
      data => {
        if (data.data) {
          this.godownsData = data.data
          if (this.godownsData.length === 1) {
            this.GodownId = +this.godownsData[0].id
            this.godownValue = +this.godownsData[0].id
          }
        }
      }
    )
    this._saleDirectReturnService.referralTypesData$.pipe(takeUntil(this.onDestroy$)).subscribe(
      data => {
        if (data.data) {
          this.referralTypesData = data.data
        }
      }
    )
    this._saleDirectReturnService.attributesData$.pipe(takeUntil(this.onDestroy$)).subscribe(
      data => {
        if (data.attributeKeys && data.attributesData) {
          this.initAttribute()
          this.attributeKeys = data.attributeKeys
          this.attributesData = data.attributesData
        }
      }
    )

    this._saleDirectReturnService.itemData$.pipe(takeUntil(this.onDestroy$)).subscribe(
      data => {
        if (data.data) {
          this.itemData = Object.assign([], data.data)
        }
      }
    )
    this._saleDirectReturnService.subUnitsData$.pipe(takeUntil(this.onDestroy$)).subscribe(
      data => {
        if (data.data) {
          this.subUnitsData = data.data
        }
      }
    )
    this._saleDirectReturnService.referralData$.pipe(takeUntil(this.onDestroy$)).subscribe(
      data => {
        if (data.data) {
          this.referralData = data.data
        }
      }
    )
    this._saleDirectReturnService.taxSlabsData$.pipe(takeUntil(this.onDestroy$)).subscribe(
      data => {
        if (data.data) {
          this.taxSlabsData = data.data
        }
      }
    )

    this._saleDirectReturnService.currencyData$.pipe(takeUntil(this.onDestroy$)).subscribe(
      data => {
        if (data.data) {
          this.currencyData = data.data
          this.defaultCurrency = this.currencyData[0].text
          this.currencyValues = [
            { id: '0', symbol: '%' },
            { id: '1', symbol: this.defaultCurrency }
          ]
          // console.log('currencyValues : ', this.currencyValues)
          this.convertToCurrencyData = [...this.currencyData]
          if (this.currencyData.length >= 1) {
            this.CurrencyId = +this.currencyData[0].id
            this.currencyValue = +this.currencyData[0].id
            this.ConvertToCurrencyId = +this.convertToCurrencyData[0].id
            this.convertToCurrencyValue = +this.convertToCurrencyData[0].id
          }
        }
      }
    )

    this._saleDirectReturnService.chargestData$.pipe(takeUntil(this.onDestroy$)).subscribe(
      data => {
        if (data.data) {
          this.chargesData = data.data
          this.tempChargeData = data.data
        }
      }
    )
    let _self = this
    this._saleDirectReturnService.addressData$.pipe(takeUntil(this.onDestroy$)).subscribe(
      data => {
        if (data.data) {
          _self.AddressData = Object.assign([], data.data)
          let id = 0
          if (_self.AddressData.length > 2) {
            id = +_self.AddressData[2].id
          }
          _self.AddressId = id
          _self.addressValue = id
          // _self.addressSelect2.setElementValue(id)
        }
      }
    )

    // this.settings$ = this.purchaseService.settingData1$.subscribe(
    //   data => {
    //     if (data.data) {
    //       this.settingData = data.data
    //       console.log('this.settingData : ', this.settingData)
    //       this.getSetUpModules(this.settingData)
    //     }
    //   }
    // )

    this.commonService.getVendStatus().pipe(takeUntil(this.onDestroy$)).subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.vendorData)
          newData.push({ id: data.id, text: data.name })
          this.vendorData = newData
          this.PartyId = +data.id
          this.vendorValue = data.id
          //   this.vendorGSTType = data.gstType
          this.CreditLimit = 0
          this.CreditDays = 0
          setTimeout(() => {
            if (this.vendorSelect2) {
              const element = this.renderer.selectRootElement(this.vendorSelect2.selector.nativeElement, true)
              element.focus({ preventScroll: false })
            }
          }, 2000)
        }
      }
    )

    this.commonService.getAddressStatus().pipe(takeUntil(this.onDestroy$)).subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.AddressData)
          newData.push({ id: data.id, text: data.name })
          this.AddressData = newData
          this.AddressId = +data.id
          this.addressValue = data.id
          this.loadingSummary = true
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

    this.commonService.getCompositeUnitStatus().pipe(takeUntil(this.onDestroy$)).subscribe(
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

    this.commonService.getUnitStatus().pipe(takeUntil(this.onDestroy$)).subscribe(
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

    this.commonService.getItemMasterStatus().pipe(takeUntil(this.onDestroy$)).subscribe(
      (data: AddCust) => {
        if (data.id && data.name && data.categoryId) {
          let newData = Object.assign([], this.itemData)
          newData.push({ id: data.id, text: data.name })
          this.itemData = Object.assign([], newData)
          this.allItems.push({
            Id: +data.id,
            Name: data.name,
            CategoryId: +data.categoryId
          })
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

    this.commonService.getLedgerStatus().pipe(takeUntil(this.onDestroy$)).subscribe(
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

    this.commonService.getTaxStatus().pipe(takeUntil(this.onDestroy$)).subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.taxSlabsData)
          newData.push({ id: data.id, text: data.name })
          this.taxSlabsData = newData
          if (this.TaxSlabId === -1) {
            this.TaxSlabId = +data.id
            this.taxSlabValue = data.id
            setTimeout(() => {
              if (this.taxSlabSelect2) {
                const element = this.renderer.selectRootElement(this.taxSlabSelect2.selector.nativeElement, true)
                element.focus({ preventScroll: false })
              }
            }, 2000)
          } else if (this.TaxSlabChargeId === -1) {
            this.TaxSlabChargeId = +data.id
            this.taxSlabChargeValue = data.id
            setTimeout(() => {
              if (this.taxSlabChargeSelect2) {
                const element = this.renderer.selectRootElement(this.taxSlabChargeSelect2.selector.nativeElement, true)
                element.focus({ preventScroll: false })
              }
            }, 2000)
          }
        }
      }
    )
  }
  customerName: any = ''
  BillingAddress: any = ''
  ShippingAddress: any = ''
  OrganizationName: any = ''
  getEditData() {
    console.log('edit id : ', this.Id)
    let Id_for_change = this.editMode === true ? this.EditID :this.ReturnID
    let type  = this.editMode === true ? 'SaleReturnDetails?Id=' : 'saledetails?Id='
    this._saleDirectReturnService.getSaleReturnEditData(type,Id_for_change).pipe(takeUntil(this.onDestroy$)).subscribe(
      data => {
        console.log('edit data : ', data)
        if (data.Code === UIConstant.THOUSAND && data.Data) {
          this.getAllAddresses(+data.Data.SaleTransactionses[0].LedgerId)
          this.customerName = data.Data.SaleTransactionses[0].LedgerName
          this.BillingAddress = data.Data.SaleTransactionses[0].BillingAddressName
          this.ShippingAddress = data.Data.SaleTransactionses[0].SupplyAddress
          this.OrganizationName = data.Data.SaleTransactionses[0].OrganizationName


          // this.allAddressData = data.Data.AddressDetails
          // this._saleDirectReturnService.createAddress(data.Data.AddressDetails)
          this.createForm(data.Data)
        } else {
          this.toastrService.showError(data.Message, '')
        }
      }
    )
  }

  dataForEdit: any
  taxRatesForEdit = []
  getListOfChargeData() {
    if (this.tempChargeData.length > 0) {
      this.chargesData = []
      let newData = []
      this.tempChargeData.forEach(ele => {
        newData.push({ id: ele.id, text: ele.text, disabled: false })
        this.chargesData = newData
      })
    }
  }
  itemTaxListFlag: boolean = false
  createForm(data) {
    debugger
    this.itemTaxListFlag = false
    this.dataForEdit = data
    this.other = {}
    this.Items = []
    this.billSummary = []
    this.ItemAttributeTrans = []
    this.ItemTaxTrans = []
    this.AdditionalCharges = []
    this.PaymentDetail = []
    this.taxRatesForEdit = data.TaxTitles
    this.createOther(data.SaleTransactionses[0])
    this.createAttributes(data.ItemAttributesTrans)
    this.createItemTaxTrans(data.ItemTaxTransDetails)
    this.createItems(data.ItemTransactions)
    //   this.createAdditionalCharges(data.AdditionalChargeDetails)
    //this.createTransaction(data.PaymentDetails)
    this._loaderService.hide()

    setTimeout(() => {
      if (this.vendorSelect2) {
        this.vendorSelect2.selector.nativeElement.focus({ preventScroll: false })
      }
      this.commonService.fixTableHF('cat-table')
    }, 1000)
    this.getBillSummary()
    this.creatingForm = false
  }

  createItemTaxTrans(taxRates) {
    taxRates.forEach((element, index) => {
      this.ItemTaxTrans[index] = {
        TaxTypeTax: element.TaxTypeTax,
        AmountTax: +0,
        ItemTransTaxId: element.ItemTransTaxId,
        ParentTaxId: element.ParentTaxId,
        ParentTypeTaxId: element.ParentTypeTaxId,
        ItemTransTypeTax: element.ItemTransTypeTax,
        TaxRateId: element.TaxRateId,
        TaxRate: element.TaxRate,
        ValueType: element.ValueType,
        TaxSlabName: element.TaxSlabName,
        TaxRateNameTax: element.TaxRateName,
        id: element.Id,
        Sno: index + 1
      }
    })

    console.log('this.ItemTaxTrans : ', this.ItemTaxTrans)
  }

  createAdditionalCharges(charges) {
    if (charges.length > 0) {
      charges.forEach(element => {
        let taxRates = this.taxRatesForEdit.filter(taxRate => taxRate.LedgerId === FormConstants.ChargeForm && taxRate.SlabId === element.TaxSlabChargeId)
        let itemTaxTrans = []
        itemTaxTrans = this.ItemTaxTrans.filter((taxRate) => {
          if (taxRate.ItemTransTaxId === element.Id) {
            return taxRate
          }
        })
        if (+element.TaxTypeCharge === 0) {
          this.taxTypeChargeName = 'Exclusive'
        } else {
          this.taxTypeChargeName = 'Inclusive'
        }
        console.log('itemTaxTrans : ', itemTaxTrans)

        this.LedgerChargeId = element.LedgerChargeId
        this.LedgerName = element.LedgerName
        this.AmountCharge = element.AmountCharge
        this.TaxSlabChargeId = element.TaxSlabChargeId
        this.TaxChargeName = element.TaxChargeName
        this.TaxAmountCharge = element.TaxAmountCharge
        this.TotalAmountCharge = element.TotalAmountCharge
        this.TaxTypeCharge = element.TaxTypeCharge
        this.taxTypeChargeName = this.taxTypeChargeName
        this.taxChargeSlabType = element.TaxSlabType
        this.taxChargeRates = taxRates
        this.TaxableAmountCharge = (+element.TaxTypeCharge === 0) ? this.AmountCharge : +this.TotalAmountCharge - this.TaxAmountCharge
        this.addCharge()
        if (this.AdditionalCharges[this.AdditionalCharges.length - 1]) {
          this.AdditionalCharges[this.AdditionalCharges.length - 1].Id = element.Id
          this.AdditionalCharges[this.AdditionalCharges.length - 1].itemTaxTrans = itemTaxTrans
        } else {
          this.toastrService.showError('Invalid fetching data from server', '')
        }
      })
    }
    console.log('this.AdditionalCharges : ', this.AdditionalCharges)
  }

  itemAttributesOthers: any = []
  createAttributes(attributes) {
    attributes.forEach((element, index) => {
      this.itemAttributesOthers[index] = {
        ItemId: element.ItemId,
        ItemTransId: element.ItemTransId,
        AttributeId: element.AttributeId,
        ParentTypeId: FormConstants.SaleForm,
        name: element.AttributeName,
        Id: element.Id,
        Sno: index + 1
      }
    })
    // console.log('this.itemAttributesOthers : ', this.itemAttributesOthers)
  }
  SaleTransId:number
  createItems(ItemTransactions) {
    ItemTransactions.forEach(element => {
      let taxRates = this.taxRatesForEdit.filter(taxRate => taxRate.LedgerId === FormConstants.SaleForm && taxRate.SlabId === element.TaxSlabId)
    let returnQty = this.editMode === true ? element.ReturnQuantity : 0
  let rate  =  this.editMode === true ? element.ReturnSaleRate : element.SaleRate
      let total = +(isNaN(+rate) ? 0 : +rate)
        * (isNaN(+returnQty) || +returnQty=== 0 ? 0 : +returnQty)
        * (isNaN(+element.Length) || +element.Length === 0 ? 0 : +element.Length)
        * (isNaN(+element.Width) || +element.Width === 0 ? 0 : +element.Width)
        * (isNaN(+element.Height) || +element.Height === 0 ? 0 : +element.Height)
     // element.DiscountAmt = 0
    let DiscountVal= this.editMode === true ? element.DiscountAmt : 0

      this.AmountItem = total -DiscountVal
      let itemTaxTrans = []
      itemTaxTrans = this.ItemTaxTrans.filter((taxRate) => {
        if (taxRate.ItemTransTaxId === element.Id) {
          return taxRate
        }
      })
      console.log('itemTaxTrans : ', itemTaxTrans)
      let itemAttributeTrans = []
      if (this.itemAttributesOthers.length > 0) {
        itemAttributeTrans = this.itemAttributesOthers.filter((attr) => {
          if (attr.ItemTransId === element.Id) {
            return attr
          }
        })
      }
      if (+element.TaxType === 0) {
        this.taxTypeName = 'Exclusive'
      } else {
        this.taxTypeName = 'Inclusive'
      }
      console.log('itemAttributeTrans : ', itemAttributeTrans)
      this.TransType = element.TransType
      this.TransId = element.TransId
      this.ChallanId = element.ChallanId
      this.categoryId = element.CategoryId
      this.ItemId = element.ItemId
      this.UnitId = element.UnitId
      this.SaleTransId =  element.Id
      this.Length =this.editMode === true ? element.Length :0
      this.Height = this.editMode === true ? element.Height :0 
      this.Width = this.editMode === true ? element.Width :0 
      this.Quantity = +element.Quantity
      this.ReturnQuantity = returnQty
      this.SaleRate =this.editMode === true ? element.ReturnSaleRate : element.SaleRate
      this.fixSaleRate = element.SaleRate
      this.MrpRate = element.MrpRate
      this.PurchaseRate = +element.PurchaseRate
      this.TotalRate =this.editMode === true ? total : 0 
      this.TaxSlabId = element.TaxSlabId
      this.TaxType = element.TaxType
      this.TaxAmount = this.editMode === true ? element.TaxAmount :0
      this.DiscountType = element.DiscountType
      this.Discount = element.Discount
      this.DiscountAmt = this.editMode === true ? element.DiscountAmt : 0
      this.ExpiryDate = (element.ExpiryDate) ? this.gs.utcToClientDateFormat(element.ExpiryDate, this.clientDateFormat) : ''
      this.MfdDate = (element.MfdDate) ? this.gs.utcToClientDateFormat(element.MfdDate, this.clientDateFormat) : ''
      this.BatchNo = element.BatchNo
      this.Remark = element.Remark
      this.itemName = element.ItemName
      this.categoryName = element.CategoryName
      this.unitName = element.UnitName
      this.taxSlabName = element.TaxSlabName
      this.taxTypeName = this.taxTypeName
      this.SubTotal =  this.editMode === true ? element.SubTotal : 0
      this.itemAttributeTrans = itemAttributeTrans
      this.taxSlabType = element.TaxSlabType
      this.taxRates = taxRates
      this.editItemId = this.editMode === true ? element.Id : 0
      this.AmountItem = (+element.TaxType === 0) ? this.calcTotal() : +this.SubTotal - this.TaxAmount
      if (+element.TaxType === 1 && this.taxCalInclusiveType === 2) {
        if ('' + this.DiscountType === '0') {
          if (+this.Discount < 100 && +this.Discount > 0) {
            this.DiscountAmt = +DiscountVal
            // this.DiscountAmt = +((+this.Discount / 100) * (this.AmountItem)).toFixed(this.noOfDecimalPoint)
          } else if (+this.Discount === 100 || +this.Discount === 0) {
            this.DiscountAmt = 0
          }
        }
        this.AmountItem = this.AmountItem - this.DiscountAmt
      }
      this.addItems()
      console.log(this.Items ,'items-eddd')
      debugger
      if (this.Items[this.Items.length - 1]) {
        this.Items[this.Items.length - 1].Id = this.editMode === true ? element.Id : 0
        this.Items[this.Items.length - 1].itemTaxTrans = itemTaxTrans
      } else {
        this.toastrService.showError('inProper fetching Data', '')
      }
    })
    console.log('items : ', this.Items)
  }

  calcTotal() {
    const totalAmount = ((isNaN(+this.SaleRate) ? 0 : +this.SaleRate)
      * (isNaN(+this.ReturnQuantity) || +this.ReturnQuantity === 0 ? 0 : +this.ReturnQuantity)
      * (isNaN(+this.Length) || +this.Length === 0 ? 0 : +this.Length)
      * (isNaN(+this.Width) || +this.Width === 0 ? 0 : +this.Width)
      * (isNaN(+this.Height) || +this.Height === 0 ? 0 : +this.Height)
    )
      //- (isNaN(+this.DiscountAmt) ? 0 : +this.DiscountAmt)
    return totalAmount
  }

  createTransaction(paymentDetails) {
    if (paymentDetails.length > 0) {
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
    }
    // console.log('this.PaymentDetail : ', this.PaymentDetail)
  }

  other: any = {}
  createOther(others) {
    this.BillNo = this.editMode === true ? others.BillNo : this.NewBillNo
    this.ReferralCommissionTypeId = others.ReferralCommissionTypeId
    this.ReferralCommission = +others.ReferralCommission
    this.BillDate = this.gs.utcToClientDateFormat(others.BillDate, this.clientDateFormat)
    this.PartyBillDate = this.gs.utcToClientDateFormat(others.PartyBillDate, this.clientDateFormat)
    this.DueDate = this.gs.utcToClientDateFormat(others.DueDate, this.clientDateFormat)
    //this.CurrentDate = this.gs.utcToClientDateFormat(others.CurrentDate, this.clientDateFormat)
    this.PartyBillNo = others.PartyBillNo
    this.ConvertedAmount = +others.ConvertedAmount
    this.CurrencyRate = +others.CurrencyRate
    this.TotalDiscount = 0
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
    this.defaultCurrency = others.Currency
    this.currencyValues = [
      { id: '0', symbol: '%' },
      { id: '1', symbol: this.defaultCurrency }
    ]
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
    this.isOtherState = !!others.IsOtherStatemain
    this.defaultCurrency = others.Currency
    // console.log('currency values : ', this.currencyValues)
    this.setPayDate()
    this.other = others
    this.formReadySub.next(true)
  }

  getAllCategories(categoryName, categoryId, isAddNew) {
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
  taxCalInclusiveType: number = 2
  getSetUpModules(settings) {
    console.log('settings : ', settings)
    settings.forEach(element => {
      if (element.id === SetUpIds.catLevel) {
        this.catLevel = +element.val
      }
      if (element.id === SetUpIds.dateFormat) {
        this.clientDateFormat = element.val[0].Val
      }
      if (element.id === SetUpIds.noOfDecimalPoint) {
        this.noOfDecimalPoint = +element.val
      }
      if (element.id === SetUpIds.unitType) {
        this.unitSettingType = +element.val
      }
      if (element.id === SetUpIds.backDateEntryForSale) {
        this.backDateEntry = !!(+element.val)

      }
      if (element.id === SetUpIds.isManualBillNoEntryForsale) {
        this.isBillNoManuall = !!(+element.val)
        // console.log('isBillNoManuall : ', this.isBillNoManuall)
      }
      if (element.id === SetUpIds.taxCalInclusive) {
        this.taxCalInclusiveType = +element.val
      }
    })
    this.createModels(this.catLevel)
  }

  @ViewChild('vendor_select2') vendorSelect2: Select2Component
  onVendorSelect(event) {
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
  outStandingBalance: any = 0
  setCRDR: any
  vendorGSTType: any
  getAllAddresses(vendorId) {
    this._saleDirectReturnService.getAllAddresses(vendorId).subscribe(data => {
      // console.log('addresses : ', data)
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        if (data.Data.AddressDetails && data.Data.AddressDetails) {
          this.allAddressData = data.Data.AddressDetails
          console.log(data.Data.LedgerDetails, 'ikkkki--')
          this._saleDirectReturnService.createAddress(data.Data.AddressDetails)
        }
        if (data.Data.LedgerDetails && data.Data.LedgerDetails.length > 0) {
          const LedgerDetails = data.Data.LedgerDetails[0]
          console.log('LedgerDetails : ', LedgerDetails)
          this.CreditLimit = LedgerDetails.CreditLimit
          this.CreditDays = LedgerDetails.CreditDays
          //  this.vendorGSTType = data.Data.LedgerDetails[0].TaxTypeId
          this.outStandingBalance = (data.Data.LedgerDetails[0].OpeningAmount).toFixed(this.noOfDecimalPoint)
          this.setCRDR = data.Data.LedgerDetails[0].Crdr === 0 ? 'Cr' : 'Dr';
          this.checkForGST()

        }
      }
    })
  }
  ValidQuantity(i, e) {
    if (Number(e.target.value) > Number(this.Quantity) &&
      e.keyCode != 46
      &&
      e.keyCode != 8
    ) {
      e.preventDefault();
      this.Items[this.ItemIndex].ReturnQuantity = this.Quantity
    } else {
      this.ReturnQuantity = Number(e.target.value);
    }
  }

  ValidRate(i, evt) {
    
    if (Number(evt.target.value) > Number(+this.fixSaleRate) &&
      evt.keyCode != 46
      &&
      evt.keyCode != 8
    ) {
      evt.preventDefault();
      this.Items[this.ItemIndex].SaleRate = this.fixSaleRate
    } else {
      this.SaleRate = Number(evt.target.value);
    }
  }
  fixSaleRate: any
  AppliedItemOnTax:any=[]
  calculateByIndex(index, evt) {
    this.ItemIndex = index
    this.SaleRate = this.Items[index].SaleRate
    this.fixSaleRate = this.Items[index].fixSaleRate
    this.Quantity = this.Items[index].Quantity
    this.Discount = this.Items[index].Discount
    this.ReturnQuantity = this.Items[index].ReturnQuantity
    this.Remark = this.Items[index].Remark
    this.editItem(index, this.Items[index].Id, 'items', this.Items[index].Sno)
  //  this.AppliedItemOnTax = this.Items[index].TaxSlabId
   this.appliedTaxRatesItem = this.Items[index].itemTaxTrans

    this.getTaxDetail(this.Items[index].TaxSlabId)
    // this.calculate()
    //  this.validateItem()

  }
  
  createItemTax(taxRates) {
    taxRates.forEach((element, index) => {
      this.ItemTaxTrans[index] = {
        TaxTypeTax: element.TaxTypeTax,
        AmountTax: +0,
        ItemTransTaxId: element.ItemTransTaxId,
        ParentTaxId: element.ParentTaxId,
        ParentTypeTaxId: element.ParentTypeTaxId,
        ItemTransTypeTax: element.ItemTransTypeTax,
        TaxRateId: element.TaxRateId,
        TaxRate: element.TaxRate,
        ValueType: element.ValueType,
        TaxSlabName: element.TaxSlabName,
        TaxRateNameTax: element.TaxRateName,
        id: element.Id,
        Sno: index + 1
      }
    })

    console.log('this.ItemTaxTrans : ', this.ItemTaxTrans)
  }
  ItemIndex: any
  @ViewChild('returnQty') returnQty
  selectAll: boolean = false
  onItemToggle(index, evt) {
    this.ItemIndex = index

    
    setTimeout(() => {
      // this.returnQty+index.nativeElement.focus()
    }, 100)
    console.log('index : ', index)
    this.returnQty
    if (this.Items.length > 0) {
      this.Items.forEach((element, i) => {
        if (index === i) {
          this.Items[index].selected = true
        }
      });
    }
    //  this.getTaxDetail(this.Items[index].TaxSlabId)
  }
  toggleSelect(evt) {
    console.log('event : ', evt.target.checked)
    for (let i = 0; i < this.Items.length; i++) {
      this.Items[i].selected = evt.target.checked
    }
    // this.calculate()
  }
  NewBillNo: any
  getNewBillNo() {
    debugger
    if (+this.OrgId > 0 && this.CurrentDate) {
      let newBillDate = this.gs.clientToSqlDateFormat(this.CurrentDate, this.clientDateFormat)
      let type = (this.isBillNoManuall) ? 2 : 1
      this._saleDirectReturnService.getNewBillNoforSaleReturn(+this.OrgId, newBillDate, type).subscribe(
        data => {
          if (data.Code === UIConstant.THOUSAND && data.Data) {
            if (data.Data.length > 0) {
              if (!this.isBillNoManuall) {
                this.BillNo = data.Data[0].BillNo
                this.NewBillNo = data.Data[0].BillNo
              } else {
                this.previousBillNo = data.Data[0].BillNo
              }
            } else {
              this.previousBillNo = ''
              this.BillNo = ''
              this.NewBillNo = ''
            }
          } else {
            this.toastrService.showError(data.Message, '')
          }
        }
      )
    }
  }
  ReturnQuantity: number = 0

  @ViewChild('currency_select2') currencySelect2: Select2Component
  openModal() {
    debugger
    this.getSetUpModules((JSON.parse(this.settings.moduleSettings).settings))
    this.getSPUtilitySaleReturnData()
    this.billSummary = []
    this.outStandingBalance = 0
    this.ReturnQuantity = 0
    this.getNewCurrentDate()
    this.getNewBillNo()
  
  

   // this.getListOfChargeData()
    $('#sale_return_model').modal(UIConstant.MODEL_SHOW)
    this.industryId = +this.settings.industryId
    console.log( this.industryId ,'ind')
    this.taxTypeData = [
      { id: '0', text: 'Exclusive' },
      { id: '1', text: 'Inclusive' }
    ]
    this.selectAll = false
    this.initTransaction()
    this.initCharge()
    if (!this.editMode) {
      if (!this.isBillNoManuall) {
        this.setBillNo(this.TransactionNoSetups)
      }
      //this.setCurrentDate(this.TransactionNoSetups)
      // this.setBillDate()
      this.setPartyBillDate()
      this.setPayDate()
      //  this.getNewCurrentDate()
      this._loaderService.hide()

      setTimeout(() => {
        if (this.vendorSelect2) {
          this.vendorSelect2.selector.nativeElement.focus({ preventScroll: false })
        }
        this.commonService.fixTableHF('cat-table')
      }, 1000)
    }
    this.getEditData()
  }

  checkForExistence: any = []
  getFormDependency() {
    this.commonService.getFormDependency(UIConstant.SALE_TYPE).pipe(takeUntil(this.onDestroy$), filter(data => {
      if (data.Code === UIConstant.THOUSAND) { return true } else { console.log(data); throw new Error(data.Description) }
    }), catchError(error => { return throwError(error) }), map(data => data.Data)).subscribe(
      data => {
        // console.log('form dependency : ', data)
        if (data) {
          data.forEach((element) => {
            if (element.IsIdentity) {
              element['FieldValue'] = this.Id
            }
          })
          this.checkForExistence = data
        }
      },
      (error) => { this.toastrService.showError(error, '') }
    )
  }

  closeModal() {
    if ($('#sale_return_model').length > 0) {
      $('#sale_return_model').modal(UIConstant.MODEL_HIDE)
    }
  }

  setBillNo(setups) {
    if (setups && setups.length > 0) {
      this.BillNo = setups[0].BillNo
    }
  }

  setCurrentDate(setups) {
    debugger
    if (setups && setups.length > 0) {
      this.CurrentDate = this.gs.utcToClientDateFormat(setups[0].CurrentDate, this.clientDateFormat)

    }
  }

  getCatLevel() {
    let _self = this
    this.commonService.getSettingById(SetUpIds.catLevel).pipe(takeUntil(this.onDestroy$)).subscribe(
      (data) => {
        if (data.Code === UIConstant.THOUSAND) {
          const setUpSettings = data.Data.SetupClients
          _self.catLevel = +setUpSettings[0].Val
        }
      }
    )
  }
  TypeOfSP_API:any
  getSPUtilitySaleReturnData() {
    this._loaderService.show()

    let _self = this
    this.TypeOfSP_API = this.editMode ===true ? 'SaleReturn' :'Sale' ;

    this.commonService.getSPUtilityData(this.TypeOfSP_API)
      .pipe(
        filter(data => {
          if (data.Code === UIConstant.THOUSAND) {
            return true
          } else {
            throw new Error(data.Description)
          }
        }),
        catchError(error => {
          return throwError(error)
        }),
        map(data => data.Data)
      ).subscribe(
        data => {
          console.log('sputility data : ', data)
          if (data.AttributeValueResponses.length > 0) {
            _self._saleDirectReturnService.generateAttributes(data)
          }
          if (data.ItemCategorys.length > 0) {
            //   _self.purchaseAdd.getCatagoryDetail(data.ItemCategorys)
          }
          //_self.purchaseAdd.allItems = [ ...data.Items ]
          // console.log('allItems : ', this.allItems)
          _self._saleDirectReturnService.createItems(data.Items)
          _self._saleDirectReturnService.createVendors(data.Customers)
          _self._saleDirectReturnService.createTaxProcess(data.TaxProcesses)
          _self._saleDirectReturnService.createPaymentModes(data.PaymentModes)
          _self._saleDirectReturnService.createOrganisations(data.Organizations)
          this.getOrgnization(data.Organizations)
          _self._saleDirectReturnService.createGodowns(data.Godowns)
          _self._saleDirectReturnService.createReferralTypes(data.ReferalTypes)
          _self._saleDirectReturnService.createSubUnits(data.SubUnits)
          _self._saleDirectReturnService.createTaxSlabs(data.TaxSlabs)
          _self._saleDirectReturnService.createReferral(data.Referals)
          _self._saleDirectReturnService.createCurrencies(data.Currencies)
          _self._saleDirectReturnService.createFreightBy(data.FreightModes)
          _self._saleDirectReturnService.createCharges(data.LedgerCharges)
          //    _self.purchaseAdd.clientStateId = data.ClientAddresses[0].StateId
          //  _self.purchaseAdd.TransactionNoSetups = data.TransactionNoSetups
        },
        (error) => {
          console.log(error)
          this._loaderService.hide()
          this.toastrService.showError(error, '')
        },
        () => {
          setTimeout(() => {
            this._loaderService.hide()
          }, 1)
        }
      )
  }
  orgnizationName:any
  getOrgnization(data){
    console.log(data,'org-data')
    if (data.length > 0) {
      this.OrgId = +data[0].Id
      this.orgnizationName =  data[0].Name
      this.organisationValue = +data[0].Id
       this.OrgGStType = +data[0].GstTypeId
      if (this.isBillNoManuall) {
        this.CurrentDate = this.gs.getDefaultDate(this.clientDateFormat)
        this.getNewBillNo()
      }
    }
  }
 
  unitSettingType: number = 1
  setPayDate() {
    this.PayDate = this.gs.getDefaultDate(this.clientDateFormat)
  }
  setDueDate() {
    this.DueDate = this.gs.getDefaultDate(this.clientDateFormat)
  }
  setBillDate() {
    // this.BillDate = this.gs.getDefaultDate(this.clientDateFormat)
  }

  setPartyBillDate() {
    this.PartyBillDate = this.gs.getDefaultDate(this.clientDateFormat)
  }

  createModels(levels) {
    this.categories = []
    let obj = {
      placeholder: 'Select Category',
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
  getCatagoryDetail(data) {
    // console.log('category data : ', data)
    for (let i = 0; i < this.catLevel; i++) {
      if (this.categories[i]) {
        this.categories[i].data = [{ id: '0', text: 'Select Category' }]
      }
    }
    this.allCategories = [...data]
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
    // console.log('dynamic categories : ', this.categories)
    this._loaderService.hide()

  }

  catStr: string = ''
  onSelectCategory(evt, levelNo) {
    // console.log('evt on change of category : ', evt, 'level : ', levelNo)
    if (this.catLevel > 1) {
      if (+evt.value > 0) {
        if (levelNo === this.catLevel) {
          if (this.categoryId !== +evt.value) {
            this.categoryId = +evt.value
            this.categoryName = evt.data[0].text
            this.checkForItems(+evt.value)
            //this.validateItem()
          }
        } else {
          if (levelNo < this.catLevel) {
            let categoryId = +evt.value
            this.categoryName = evt.data[0].text
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
            this._loaderService.hide()

          }
        }
      }
      if (+evt.value === 0) {
        this.getCatagoryDetail(this.allCategories)
        this.checkForItems(+evt.value)
        this.categoryId = 0
      }
    } else {
      if (levelNo === this.catLevel) {
        if (this.categoryId !== +evt.value) {
          this.categoryId = +evt.value
          this.categoryName = evt.data[0].text
          this.checkForItems(+evt.value)
          // this.validateItem()
          this.updateCategories(+evt.value)
        }
      }
    }
  }

  checkForItems(categoryId) {
    let newItemsList = []
    if (categoryId > 0) {
      this.allItems.forEach(item => {
        if (item.CategoryId === categoryId) {
          newItemsList.push(item)
        }
      })
      if (this.editItemId === -1) {
        this._saleDirectReturnService.createItems(newItemsList)
      } else {
        let newData = [{ id: '0', text: 'Select Items' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
        newItemsList.forEach(item => {
          newData.push({
            id: item.Id,
            text: item.Name
          })
        })
        this.itemData = Object.assign([], newData)
      }
    } else if (categoryId === 0) {
      this._saleDirectReturnService.createItems(this.allItems)
    }
  }

  @ViewChild('item_select2') itemselect2: Select2Component
  onItemSelect(evt) {
    if (evt.value && evt.data.length > 0) {
      // console.log('evt on change of item : ', evt)
      if (+evt.value === 0) {
        this.ItemId = +evt.value
        //   this.validateItem()
        // this.calculate()
      }
      if (+evt.value === -1) {
        if (this.categoryId > 0) {
          this.commonService.openItemMaster('', this.categoryId)
          this.itemselect2.selector.nativeElement.value = ''
        } else {
          this.toastrService.showInfo('Please select a category', '')
        }
        //  this.validateItem()
      } else {
        if (evt.value > 0 && evt.data[0] && evt.data[0].text) {
          this.ItemId = +evt.value
          this.itemName = evt.data[0].text
          this.getItemDetail(this.ItemId)
          this.updateAttributes()
        }
      }
    }
  }

  getItemDetail(id) {
    this._saleDirectReturnService.getItemDetail(id).pipe(takeUntil(this.onDestroy$)).subscribe(data => {
      console.log('item detail : ', data)
      if (data.Code === UIConstant.THOUSAND) {
        if (data.Data.length > 0) {
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
          if (+this.TaxSlabId > 0) {
            this.getTaxDetail(this.TaxSlabId)
          } else {
            //this.validateItem()
            // this.calculate()
          }
        }
      } else {
        throw new Error(data.Description)
      }
    },
      (error) => {
        this.toastrService.showError(error, '')
      })
  }

  onAttributeSelect(evt, index, attributeId) {
    // console.log('evt on change of attribute : ', evt)
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
        this.itemAttributeTrans[index]['ParentTypeId'] = FormConstants.SaleForm
        this.itemAttributeTrans[index]['name'] = evt.data[0].text
      } else {
        this.itemAttributeTrans[index] = {
          ItemId: this.ItemId,
          ItemTransId: Sno,
          AttributeId: +evt.value,
          ParentTypeId: FormConstants.SaleForm,
          name: evt.data[0].text,
          id: 0,
          Sno: Sno
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
    //  this.validateItem()
  }

  updateAttributes() {
    for (let i = 0; i < this.itemAttributeTrans.length; i++) {
      this.itemAttributeTrans[i].ItemId = this.ItemId
    }
  }

  getParentCatStr(id) {
    let name = ''
    this.allCategories.forEach(category => {
      if (id === category.Id) {
        name = category.Name
      }
    })
    return name
  }

  getPattern(): string {
    let childmostId = this.categoryId
    let pattern = [this.categoryId]
    this.catSelect2.forEach(() => {
      let parent = this.getParentCat(childmostId)
      if (parent !== 0) {
        pattern.push(parent)
        childmostId = parent
      }
    })
    pattern = pattern.reverse()

    let str = ''
    this.catSelect2.forEach((cat: Select2Component, index: number) => {
      if (index === (this.catLevel - 1)) {
        str += this.getParentCatStr(pattern[index])
      } else {
        str += this.getParentCatStr(pattern[index]) + ' => '
      }
    })

    return str
  }

  // console.log('id : ', id)
  // console.log('level : ', level)
  // console.log('parentMostCategory : ', parentMostCategory)
  getParentMostCat(id, level) {
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
    this.parentMostCategory = parentMostCategory
  }

  getParentCat(id) {
    let parentId = 0
    this.allCategories.forEach(category => {
      if (id === category.Id) {
        parentId = category.ParentId
      }
    })
    return parentId
  }
  // this.catSelect2.forEach((item: Select2Component, index: number) => {
  //   if (index !== 0) {
  //     this.updateCatArray(pattern[index - 1], index)
  //   }
  // })
  //console.log('new cateogries : ', this.categories)
  @ViewChildren('cat_select2') catSelect2: QueryList<Select2Component>
  updateCategories(childmostId) {
    console.log('childmostId id : ', childmostId)
    console.log('this.categoryId id : ', this.categoryId)
    if (this.categoryId !== childmostId || this.editItemId !== -1) {
      let pattern = [childmostId]
      this.catSelect2.forEach(() => {
        let parent = this.getParentCat(childmostId)
        if (parent !== 0) {
          pattern.push(parent)
          childmostId = parent
        }
      })
      pattern = pattern.reverse()
      setTimeout(() => {
        this.catSelect2.forEach((item: Select2Component, index: number) => {
          item.setElementValue(pattern[index])
        })
      }, 100)
    }
  }

  updateCatArray(id, levelNo) {
    console.log('evt on updateCatArray of category : ', id, 'level : ', levelNo)
    if (levelNo < this.catLevel) {
      let categoryId = +id
      let newData = []
      this.categories[levelNo].data = [{ id: '0', text: 'Select Category' }]
      this.allCategories.forEach(category => {
        if (category.LevelNo === levelNo + 1 && category.ParentId === categoryId) {
          newData.push({
            text: category.Name,
            id: category.Id
          })
        }
      })
      console.log('level no : ', levelNo, 'new data : ', newData)
      this.categories[levelNo].data = newData
      // this.categories = Object.assign([], this.categories)
    }
  }

  appliedTaxRatesItem: any = []
  appliedTaxRatesCharge: any = []



  calculate() {
     debugger
    let total = +(isNaN(+this.SaleRate) ? 0 : +this.SaleRate)
      * (isNaN(+this.ReturnQuantity) || +this.ReturnQuantity === 0 ? 0 : +this.ReturnQuantity)
      * (isNaN(+this.Length) || +this.Length === 0 ? 1 : +this.Length)
      * (isNaN(+this.Width) || +this.Width === 0 ? 1 : +this.Width)
      * (isNaN(+this.Height) || +this.Height === 0 ? 1 : +this.Height)
    this.TotalRate = +total.toFixed(this.noOfDecimalPoint)
    this.Items[this.ItemIndex].TotalRate = this.TotalRate
    if (this.validDiscount) {
      if ('' + this.DiscountType === '0') {
        if (+this.Discount <= 100 && +this.Discount >= 0) {
          this.DiscountAmt = +((+this.Discount / 100) * (total)).toFixed(this.noOfDecimalPoint)
          this.Items[this.ItemIndex].DiscountAmt = this.DiscountAmt
        } else {
          this.DiscountAmt = 0
        }
      } else {
        this.DiscountAmt = isNaN(+this.Discount) ? 0 : +this.Discount
        this.Items[this.ItemIndex].DiscountAmt = this.DiscountAmt

      }
      // this.Items[this.ItemIndex].AmountItem =this.total 
      if (total > 0) {
        let discountedAmount = 0
        if (this.DiscountAmt === total) {
          discountedAmount = total
        } else {
          discountedAmount = total - this.DiscountAmt
        }
        this.AmountItem = discountedAmount
        this.Items[this.ItemIndex].AmountItem = this.AmountItem
        if (this.TaxType === 0) {
          let returnTax = this._saleDirectReturnService.taxCalculation(this.taxRates,
            this.taxSlabType,
            discountedAmount,
            this.isOtherState, FormConstants.SaleForm, this.taxSlabName)
          this.TaxAmount = +(returnTax.taxAmount).toFixed(4)
          this.Items[this.ItemIndex].TaxAmount = this.TaxAmount
          this.Items[this.ItemIndex].itemTaxTrans = returnTax.appliedTaxRates
          this.appliedTaxRatesItem = returnTax.appliedTaxRates
        } else {
          if (this.taxCalInclusiveType === 1) {
            let AmountItem = +(this._saleDirectReturnService.calcTaxableAmountType1(this.taxRates,
              this.taxSlabType,
              discountedAmount,
              this.isOtherState)).toFixed(4)
            this.AmountItem = AmountItem
            this.Items[this.ItemIndex].AmountItem = this.AmountItem

            let returnTax = this._saleDirectReturnService.taxCalCulationForInclusive(this.taxRates,
              this.taxSlabType,
              this.AmountItem,
              this.isOtherState, FormConstants.SaleForm, this.taxSlabName)
            this.TaxAmount = +(returnTax.taxAmount).toFixed(4)
            this.Items[this.ItemIndex].TaxAmount = this.TaxAmount
            this.Items[this.ItemIndex].itemTaxTrans = returnTax.appliedTaxRates

            this.appliedTaxRatesItem = returnTax.appliedTaxRates
          } else {
            let AmountItem = +(this._saleDirectReturnService.calcTaxableAmountType2(this.taxRates,
              this.taxSlabType,
              total,
              this.isOtherState)).toFixed(4)
            if ('' + this.DiscountType === '0') {
              if (+this.Discount < 100 && +this.Discount > 0) {
                this.DiscountAmt = +((+this.Discount / 100) * (AmountItem)).toFixed(this.noOfDecimalPoint)
              } else if (+this.Discount === 100 || +this.Discount === 0) {
                this.DiscountAmt = 0
              }
            }
            this.AmountItem = AmountItem - this.DiscountAmt
            this.Items[this.ItemIndex].AmountItem = this.AmountItem

            let returnTax = this._saleDirectReturnService.taxCalCulationForInclusiveType2(this.taxRates,
              this.taxSlabType,
              this.AmountItem,
              this.isOtherState, FormConstants.SaleForm, this.taxSlabName)
            this.TaxAmount = +(returnTax.taxAmount).toFixed(4)
            this.Items[this.ItemIndex].TaxAmount = this.TaxAmount
            this.Items[this.ItemIndex].itemTaxTrans = returnTax.appliedTaxRates

            this.appliedTaxRatesItem = returnTax.appliedTaxRates
          }
        }
      } else {
          this.Items[this.ItemIndex].TaxAmount = 0
          this.Items[this.ItemIndex].itemTaxTrans = []
          this.Items[this.ItemIndex].AmountItem = 0
         this.TaxAmount = 0
        this.AmountItem = 0
        this.Items[this.ItemIndex].TaxAmount = this.TaxAmount

      }
    } else {
      this.DiscountAmt = 0
      this.Items[this.ItemIndex].DiscountAmt = this.DiscountAmt

      this.TaxAmount = 0
      this.Items[this.ItemIndex].TaxAmount = this.TaxAmount

    }
    this.TaxableAmountCharge = +this.AmountCharge
    if (this.taxChargeRates.length > 0 && +this.AmountCharge > 0) {
      if (this.TaxTypeCharge === 0) {
        let returnTax = this._saleDirectReturnService.taxCalculation(this.taxChargeRates,
          this.taxChargeSlabType,
          +this.AmountCharge,
          this.isOtherState, FormConstants.ChargeForm, this.TaxChargeName)
        this.TaxAmountCharge = +(returnTax.taxAmount).toFixed(4)
        this.appliedTaxRatesCharge = returnTax.appliedTaxRates
      } else {
        if (this.TaxTypeCharge === 1) {
          let AmountCharge = this._saleDirectReturnService.calcTaxableAmountType1(this.taxChargeRates,
            this.taxChargeSlabType, +this.AmountCharge, this.isOtherState)
          console.log('amount charge : ', AmountCharge)
          this.TaxableAmountCharge = +AmountCharge.toFixed(this.noOfDecimalPoint)
          let returnTax = this._saleDirectReturnService.taxCalCulationForInclusive(this.taxChargeRates,
            this.taxChargeSlabType,
            +AmountCharge,
            this.isOtherState, FormConstants.ChargeForm, this.TaxChargeName)
          this.TaxAmountCharge = +(returnTax.taxAmount).toFixed(4)
          this.appliedTaxRatesCharge = returnTax.appliedTaxRates
        }
      }
    }
    // console.log('TaxAmountCharge : ', this.TaxAmountCharge)
    if (+this.AmountCharge > 0) {
      this.TotalAmountCharge = +(+this.AmountCharge + + ((this.TaxTypeCharge === 0) ? (isNaN(+this.TaxAmountCharge) ? 0 : +this.TaxAmountCharge) : 0)).toFixed(this.noOfDecimalPoint)
    } else {
      this.TotalAmountCharge = 0
    }
    this.TotalAmountCharge = +this.TotalAmountCharge.toFixed(4)
    this.InterestAmount = 0
    this.SubTotal = +(this.calculateTotalOfRow()).toFixed(this.noOfDecimalPoint)
    this.Items[this.ItemIndex].SubTotal = this.SubTotal
    if (+this.ItemId > 0 || +this.LedgerChargeId > 0) {

      this.calculateAllTotal()
    }
    
    this.getBillSummary()
  }

  calculateTotalOfRow() {

    let totalAmount = this.AmountItem + (isNaN(+this.TaxAmount) ? 0 : +this.TaxAmount)
    return isNaN(totalAmount) ? 0 : totalAmount
  }

  calculatePaymentAmount() {
    let paymentTotal = 0
    for (let i = 0; i <= this.PaymentDetail.length - 1; i++) {
      paymentTotal = paymentTotal + +this.PaymentDetail[i].Amount
    }
    if (this.BillAmount > 0 && paymentTotal >= 0 && paymentTotal < this.BillAmount) {
      this.Amount = +(this.BillAmount - paymentTotal).toFixed(this.noOfDecimalPoint)
    } else if (paymentTotal > this.BillAmount) {
      this.Amount = 0
    }
  }

  @ViewChild('unit_select2') unitSelect2: Select2Component
  onUnitSelect(evt) {
    if (evt.value && evt.data.length > 0) {
      if (+evt.value === -1) {
        this.unitSelect2.selector.nativeElement.value = ''
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
      //  this.validateItem()
    }
  }

  @ViewChild('organisation_select2') organisationSelect2: Select2Component
  onChangeOrganisationId(evt) {
    // console.log('on org select : ', evt)
    if (evt.value && evt.data.length > 0) {
      if (evt.value > 0 && evt.data[0] && evt.data[0].text) {
        this.OrgId = +evt.value
        // this.getNewBillNo()
      }
      this.checkForValidation()
    }
  }

  newDate: string = ''
  @ViewChild('godown_select2') godownSelect2: Select2Component
  onGodownSelect(evt) {
    // console.log(evt)
    if (evt.value && evt.data.length > 0) {
      if (evt.value > 0 && evt.data[0] && evt.data[0].text) {
        this.GodownId = +evt.value
      }
      this.checkForValidation()
    }
  }

  @ViewChild('address_select2') addressSelect2: Select2Component
  onAddressSelect(evt) {
    // console.log('onAddressSelect : ', evt)
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

  needToCheckItem: boolean = false
  needToCheckCharge: boolean = false
  checkForGST() {
    let isOtherState = true
    this.allAddressData.forEach(element => {
      if (element.Id === this.AddressId && element.StateId === this.clientStateId) {
        isOtherState = false
      }
    })
    // if (this.isOtherState !== isOtherState) {
    this.isOtherState = isOtherState
    this.updateItemTax()
    // } else {
    //   this.loadingSummary = false
    // }
  }

  updateChargeTax() {
    if (this.AdditionalCharges.length > 0) {
      const observables = [];
      for (const charge of this.AdditionalCharges) {
        if (charge.TaxSlabChargeId !== 0) {
          observables.push(this._saleDirectReturnService.getSlabData(charge.TaxSlabChargeId));
        }
      }
      forkJoin(...observables).subscribe(
        data => {
          // console.log(data)
          data.forEach((element, index) => {
            let appliedTaxRatesCharge = []
            let taxChargeSlabType = (element.Data.TaxSlabs[0]) ? element.Data.TaxSlabs[0].Type : 0
            if (+this.AdditionalCharges[index].AmountCharge > 0) {
              if (this.AdditionalCharges[index].TaxTypeCharge === 1) {
                let returnTax = this._saleDirectReturnService.taxCalCulationForInclusive(element.Data.TaxRates,
                  taxChargeSlabType,
                  +this.AdditionalCharges[index].AmountCharge,
                  this.isOtherState, FormConstants.ChargeForm, element.Data.TaxSlabs[0].Slab)
                this.AdditionalCharges[index]['TaxAmountCharge'] = +returnTax.taxAmount
                appliedTaxRatesCharge = returnTax.appliedTaxRates
              } else if (this.AdditionalCharges[index].TaxTypeCharge === 0) {
                let returnTax = this._saleDirectReturnService.taxCalculation(element.Data.TaxRates,
                  taxChargeSlabType,
                  +this.AdditionalCharges[index].AmountCharge,
                  this.isOtherState, FormConstants.ChargeForm, element.Data.TaxSlabs[0].Slab)
                this.AdditionalCharges[index]['TaxAmountCharge'] = returnTax.taxAmount
                appliedTaxRatesCharge = returnTax.appliedTaxRates
              }

              if (appliedTaxRatesCharge.length > 0) {
                appliedTaxRatesCharge.forEach((taxRate) => {
                  if (this.AdditionalCharges[index].Id !== 0) {
                    taxRate['ItemTransTaxId'] = this.AdditionalCharges[index].Id
                  } else {
                    taxRate['ItemTransTaxId'] = this.AdditionalCharges[index].Sno
                  }
                })
              }
              this.AdditionalCharges[index].itemTaxTrans = appliedTaxRatesCharge
            }
            this.AdditionalCharges[index]['TotalAmountCharge'] = +this.AdditionalCharges[index].AmountCharge + +this.AdditionalCharges[index]['TaxAmountCharge']
          });
          this.calculateAllTotal()
        },
        (error) => {

        },
        () => {
          setTimeout(() => {
            // this.updateTax()
            this.getBillSummary()
          }, 100)
        }
      )
    } else {
      this.getBillSummary()
    }
  }

  updateItemTax() {
    if (this.Items.length > 0) {
      const observables = [];
      for (const item of this.Items) {
        if (item.TaxSlabId !== 0) {
          observables.push(this._saleDirectReturnService.getSlabData(item.TaxSlabId));
        }
      }
      forkJoin(...observables).subscribe(
        data => {
          // console.log(data)
          if(this.OrgGStType===1){
          data.forEach((element, index) => {
            let appliedTaxRatesItem = []
            let taxSlabType = (element.Data.TaxSlabs[0]) ? element.Data.TaxSlabs[0].Type : 0
            if (element.Data.TaxRates.length > 0 && +this.Items[index].AmountItem > 0) {
              if (this.Items[index].TaxType === 1) {
                let returnTax = this._saleDirectReturnService.taxCalCulationForInclusive(element.Data.TaxRates,
                  taxSlabType,
                  +this.Items[index].AmountItem,
                  this.isOtherState, FormConstants.SaleForm, element.Data.TaxSlabs[0].Slab)
                this.Items[index]['TaxAmount'] = returnTax.taxAmount
                appliedTaxRatesItem = returnTax.appliedTaxRates
              } else if (this.Items[index].TaxType === 0) {
                let returnTax = this._saleDirectReturnService.taxCalculation(element.Data.TaxRates,
                  taxSlabType,
                  +this.Items[index].AmountItem,
                  this.isOtherState, FormConstants.SaleForm, element.Data.TaxSlabs[0].Slab)
                this.Items[index]['TaxAmount'] = returnTax.taxAmount
                appliedTaxRatesItem = returnTax.appliedTaxRates
              }

              if (appliedTaxRatesItem.length > 0) {
                appliedTaxRatesItem.forEach((taxRate) => {
                  if (this.Items[index].Id !== 0) {
                    taxRate['ItemTransTaxId'] = this.Items[index].Id
                  } else {
                    taxRate['ItemTransTaxId'] = this.Items[index].Sno
                  }
                })
              }
              this.Items[index].itemTaxTrans = appliedTaxRatesItem
            }
            this.Items[index]['SubTotal'] = +this.Items[index].AmountItem + +this.Items[index]['TaxAmount']
          });
          }
          this.calculateAllTotal()
        },
        (error) => {
          console.log(error)
        },
        () => {
          if (this.AdditionalCharges.length === 0) {
            setTimeout(() => {
              // this.updateTax()
              this.getBillSummary()
            }, 100)
          } else {
            this.updateChargeTax()
          }
        }
      )
    } else {
      this.updateChargeTax()
    }
  }

  onCurrencySelect(evt) {
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
  onReferralTypeSelect(evt) {
    // console.log(evt)
    if (evt.value > 0 && evt.data[0] && evt.data[0].text) {
      this.ReferralTypeId = +evt.value
    }
  }

  ConvertToCurrencyId: number
  onConvertToCurrencySelect(evt) {
    // console.log(evt)
    if (evt.value > 0 && evt.data[0] && evt.data[0].text) {
      this.ConvertToCurrencyId = +evt.value
    }
  }

  @ViewChild('referral_select2') referralSelect2: Select2Component
  onRefferalPartnerSelect(evt) {
    // console.log(evt)
    if (evt.value > 0 && evt.data[0] && evt.data[0].text) {
      this.ReferralId = +evt.value
    }
  }

  @ViewChild('payment_select2') paymentSelect2: Select2Component
  onPaymentModeSelect(event) {
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
    this.validateTransaction()
  }

  enterPressItem(e: KeyboardEvent) {
    this.addItems()
    setTimeout(() => {
      let item = this.catSelect2.find((item: Select2Component, index: number, array: Select2Component[]) => {
        return index === 0
      })
      item.selector.nativeElement.focus({ preventScroll: false })
    }, 100)
  }

  @ViewChild('savebutton') savebutton: ElementRef
  enterPressTrans(e: KeyboardEvent) {
    let paymentTotal = this.getPaymentTotal()
    if (this.BillAmount === paymentTotal) {
      e.preventDefault()
      this.SaveSaleReturn()
    } else {
      this.addTransactions()
      setTimeout(() => {
        this.paymentSelect2.selector.nativeElement.focus()
      }, 10)
    }
  }

  setpaymentLedgerSelect2(i) {
    let _self = this
    let newData = [{ id: '0', text: 'Select Ledger' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
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
  onPaymentLedgerSelect(event) {
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

  getPaymentTotal(): number {
    let paymentTotal = 0
    for (let i = 0; i <= this.PaymentDetail.length - 1; i++) {
      paymentTotal = paymentTotal + +this.PaymentDetail[i].Amount
    }
    if (!this.clickTrans) {
      if (+this.Amount > 0 && +this.PayModeId > 0 && +this.LedgerId > 0) {
        paymentTotal += +this.Amount
      }
    }
    return paymentTotal
  }
  isValidAmount = true
  checkValidationForAmount() {
    let paymentTotal = this.getPaymentTotal()
    paymentTotal = (isNaN(+paymentTotal)) ? 0 : +paymentTotal
    this.BillAmount = (isNaN(+this.BillAmount)) ? 0 : +this.BillAmount
    console.log('this.BillAmount : ', this.BillAmount)
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

  initialiseTransaction() {
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

  addTransactions() {
    //  && this.PayDate
    if (this.Paymode && this.PayModeId && this.LedgerId && this.BankLedgerName && this.Amount) {
      if ((+this.PayModeId === 3 && this.ChequeNo) || (+this.PayModeId === 1)) {
        if (this.checkValidationForAmount()) {
          this.addTransaction()
          this.clickTrans = true
          this.initialiseTransaction()
          // console.log('transactions : ', this.PaymentDetail)
          // this.setPayDate()
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

  addTransaction() {
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

  addItems() {
    // if (this.validDiscount && +this.ItemId > 0 && this.validateAttribute() && +this.UnitId > 0 && +this.TaxSlabId > 0 && this.PurchaseRate > 0) {

    if (this.validDiscount && +this.ItemId > 0 && this.validateAttribute() && +this.UnitId > 0 && this.SaleRate > 0) {
      if ((this.industryId === 5 && this.BatchNo && this.ExpiryDate && this.MfdDate)
        || (this.industryId === 3)
        || (this.industryId === 2 || this.industryId === 6)) {
        this.addItem()
        this.clickItem = true
        console.log('items : ', this.Items)
        if (!this.editMode) {
          this.calculateAllTotal()
        }
        //  this.initItem()
        if (this.industryId === 5) {
          // this.setExpiryDate()
          // this.setMfdDate()
        }
      }
    }
  }

  addItem() {
    this.addItemBasedOnIndustry()
    this.ItemAttributeTrans = this.ItemAttributeTrans.concat(this.itemAttributeTrans)
    if (this.appliedTaxRatesItem.length > 0) {
      this.ItemTaxTrans = this.ItemTaxTrans.concat(this.appliedTaxRatesItem)
    }
    console.log('ItemTaxTrans : ', this.ItemTaxTrans)
  }

  addItemBasedOnIndustry() {
    debugger
    let Sno = 0
    if (this.Items.length === 0) {
      Sno = 1
    } else if (this.Items.length > 0) {
      Sno = +this.Items[this.Items.length - 1].Sno + 1
    }
    this.appliedTaxRatesItem.forEach(element => {
      element['Sno'] = Sno
      element['ItemTransTaxId'] = Sno
    })
    this.itemAttributeTrans.forEach(element => {
      element['Sno'] = Sno
      element['ItemTransId'] = Sno
    })
    this.Items.push({
      Id: 0,
      Sno: Sno,
      SaleTransId:this.SaleTransId,
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
      ReturnQuantity: +this.ReturnQuantity,
      SaleRate: +this.SaleRate,
      fixSaleRate: +this.fixSaleRate,
      MrpRate: +this.MrpRate,
      PurchaseRate: +this.PurchaseRate,
      TotalRate: +this.TotalRate,
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
      //categoryName: this.getPattern(),
      unitName: this.unitName,
      taxSlabName: this.taxSlabName,
      taxTypeName: this.taxTypeName,
      SubTotal: this.SubTotal,
      itemAttributeTrans: this.itemAttributeTrans,
      AmountItem: this.AmountItem,
      taxSlabType: this.taxSlabType,
      taxRates: this.taxRates,
      itemTaxTrans: this.appliedTaxRatesItem,
      categoryName: this.categoryName,
      selected: false
    })

    setTimeout(() => {
      this.commonService.fixTableHFL('item-table')
    }, 1)

    if (this.editItemId !== -1) {
      this.Items[this.Items.length - 1].Id = 0
    }
    console.log(this.Items ,'dddd-----------')
  }

  @ViewChildren('attr_select2') attrSelect2: QueryList<Select2Component>
  editItem(i, editId, type, sno) {
    console.log('editId : ', editId)
    if (type === 'charge') {
      this.editChargeId = editId
      this.editChargeSno = sno
      // i = i - 1
      this.LedgerName = this.AdditionalCharges[i].LedgerName
      this.LedgerChargeId = this.AdditionalCharges[i].LedgerChargeId
      // this.alreadySelectCharge(this.LedgerChargeId, this.LedgerName, false)
      this.AmountCharge = this.AdditionalCharges[i].AmountCharge
      this.TaxSlabChargeId = this.AdditionalCharges[i].TaxSlabChargeId
      this.TaxChargeName = this.AdditionalCharges[i].TaxChargeName
      this.TaxAmountCharge = this.AdditionalCharges[i].TaxAmountCharge
      this.TotalAmountCharge = this.AdditionalCharges[i].TotalAmountCharge
      this.TaxTypeCharge = this.AdditionalCharges[i].TaxTypeCharge
      this.taxTypeChargeName = this.AdditionalCharges[i].taxTypeChargeName
      this.appliedTaxRatesCharge = this.AdditionalCharges[i].itemTaxTrans
      this.taxChargeRates = this.AdditionalCharges[i].taxChargeRates
      this.taxChargeSlabType = this.AdditionalCharges[i].taxChargeSlabType

      let LedgerChargeId = this.LedgerChargeId
      setTimeout(() => {
        this.LedgerChargeId = LedgerChargeId
        this.chargeSelect2.setElementValue(LedgerChargeId)
        this.taxSlabChargeSelect2.setElementValue(this.TaxSlabChargeId)
        this.taxTypeChargeSelect2.setElementValue(this.TaxTypeCharge)
        this.deleteItem(i, type)
        this.validateCharge()
      }, 100)
    }
    // else if (type === 'charge' && this.editChargeId !== -1) {
    //   this.toastrService.showInfo('', 'There is already one transaction to edit, please update it this first in order to edit others')
    // }
    if (type === 'trans') {
      this.editTransId = editId
      //i = i - 1
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
    }
    //  else if (type === 'trans' && this.editTransId !== -1) {
    //   this.toastrService.showInfo('', 'Already in edit mode')
    // }
    if (type === 'items' && editId > 0) {
      this.editItemId = editId
      this.editItemSno = sno
      //    i = i - 1
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
      this.ReturnQuantity = this.Items[i].ReturnQuantity
      this.SaleRate = this.Items[i].SaleRate
      this.fixSaleRate = this.Items[i].fixSaleRate
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
      this.SubTotal = 0
      this.AmountItem = 0
      this.taxSlabType = this.Items[i].taxSlabType
      this.itemAttributeTrans = this.Items[i].itemAttributeTrans
      this.appliedTaxRatesItem = this.Items[i].itemTaxTrans
      this.taxRates = this.Items[i].taxRates
      //  this.getTaxDetail(this.TaxSlabId)

      // this.unitSelect2.setElementValue(this.UnitId)
      // this.taxSlabSelect2.setElementValue(this.TaxSlabId)
      //  this.taxTypeSelect2.setElementValue(this.TaxType)
      if (this.attrSelect2.length > 0) {
        this.attrSelect2.forEach((item: Select2Component, index: number, array: Select2Component[]) => {
          item.setElementValue(this.itemAttributeTrans[index].AttributeId)
        })
      }
      let ItemId = this.Items[i].ItemId
      // this.updateCategories(this.categoryId)
      //  this.checkForItems(this.categoryId)
      let _self = this
      setTimeout(() => {
        // _self.itemselect2.setElementValue(ItemId)
        //  _self.ItemId = ItemId
        //  _self.deleteItem(i, type)
      }, 1)
    }
    //else if (type === 'items' && this.editItemId !== -1) {
    //this.toastrService.showInfo('', 'There is already one item to edit, please update it this first in order to edit others')
    // }
  }

  deleteItem(i, forArr) {
    if (forArr === 'trans') {
      this.PaymentDetail.splice(i, 1)
      this.checkValidationForAmount()
    }
    if (forArr === 'items') {
      this.Items.splice(i, 1)
      this.ItemAttributeTrans = []
      this.Items.forEach(item => {
        this.ItemAttributeTrans = this.ItemAttributeTrans.concat([], item.itemAttributeTrans)
      })
      console.log('after TaxAmount : ', this.TaxAmount)
    }
    if (forArr === 'charge') {
      if (this.chargesData[i].disabled) {
        //  this.alreadySelectCharge(this.AdditionalCharges[i].LedgerChargeId, this.AdditionalCharges[i].LedgerName, false)
      }
      this.AdditionalCharges.splice(i, 1)
    }
    // this.calculate()
  }

  closePurchase() {
    this.commonService.closeSaleDirectReturn()
  }

  initItem() {
    this.TransType = 0
    this.TransId = 0
    this.ChallanId = 0
    this.ReturnQuantity = 0
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
    this.TotalRate = 0
    this.MrpRate = 0
    this.PurchaseRate = 0
    this.DiscountType = 0
    this.Discount = 0
    this.DiscountAmt = 0
    this.TaxSlabId = 0
    this.taxSlabName = ''
    this.TaxType = 0
    this.TaxAmount = 0
    this.ExpiryDate = this.gs.getDefaultDate(this.clientDateFormat)
    this.MfdDate = this.gs.getDefaultDate(this.clientDateFormat)
    this.BatchNo = ''
    this.Remark = ''
    this.categoryId = 0
    this.SubTotal = 0
    this.AmountItem = 0
    // this.editItemId = -1
    this.clickItem = false
    // console.log('categories : ', this.categories)
    if (this.allCategories && this.allCategories.length > 0) {
      this.getCatagoryDetail(this.allCategories)
    }
    if (this.allItems && this.allItems.length > 0) {
      this._saleDirectReturnService.createItems(this.allItems)
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
    this.itemAttributeTrans = []
    this.appliedTaxRatesItem = []
    this.taxRates = []
    this.taxSlabType = 0
    if (this.catSelect2 && this.catSelect2.length > 0) {
      this.catSelect2.forEach((item: Select2Component, index: number, array: Select2Component[]) => {
        item.setElementValue(0)
        item.selector.nativeElement.value = ''
      })
    }
    this.initAttribute()
    setTimeout(() => {
      this.commonService.fixTableHFL('item-table')
    }, 1)
  }

  initAttribute() {
    this.ItemId = 0
    this.ItemTransId = 0
    this.AttributeId = 0
    this.ParentTypeId = 0
    this.name = ''
    if (this.attrSelect2 && this.attrSelect2.length > 0) {
      this.attrSelect2.forEach((item: Select2Component, index: number, array: Select2Component[]) => {
        if ($('.attr') && $('.attr')[index]) {
          $('#' + $('.attr')[index].id).removeClass('errorSelecto')
        }
        item.setElementValue(0)
      })
    }
  }

  @ViewChild('taxSlabCharge_select2') taxSlabChargeSelect2: Select2Component
  @ViewChild('charge_select2') chargeSelect2: Select2Component
  initCharge() {
    this.LedgerChargeId = 0
    this.LedgerName = ''
    this.AmountCharge = 0
    this.TaxTypeCharge = 0
    this.TaxSlabChargeId = 0
    this.TaxChargeName = ''
    this.TaxAmountCharge = 0
    this.TotalAmountCharge = 0
    this.editChargeSno = 0
    this.clickCharge = false
    this.taxChargeRates = []
    this.appliedTaxRatesCharge = []
    this.editChargeId = -1
    if (this.taxSlabChargeSelect2) {
      this.taxSlabChargeSelect2.setElementValue('')
    }
    if (this.chargeSelect2) {
      this.chargeSelect2.setElementValue('')
    }
    if (this.taxTypeChargeSelect2) {
      this.taxTypeChargeSelect2.setElementValue(0)
    }
    this.taxTypeChargeName = 'Exclusive'
  }


  initTransaction() {
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

  initComp() {
    //this.BillDate = ''

    this.DueDate = ''
    this.GodownId = 0
    this.CurrencyId = 0
    this.ConvertToCurrencyId = 0
    this.OrgId = 0
    // this.initItem()
    this.initTransaction()
    this.initAttribute()
    this.initCharge()
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

  initialiseExtras() {
    this.BillAmount = 0
    this.PartyBillNo = ''
    this.BillNo = ''
    this.AddressId = 0
    this.ConvertedAmount = 0
    this.CurrencyRate = 0
    this.TotalDiscount = 0
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
    this.RoundOffManual = 0
    this.SubTotalAmount = 0
    this.TotalTaxAmount = 0
    this.TotalChallan = 0
    this.VehicleNo = ''
    this.LocationTo = ''
    this.Drivername = ''
    this.Transportation = ''
    this.TotalQty = 0
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
    this.AdditionalCharges = []
    this.ItemTaxTrans = []
    this.clickTrans = false
    this.clickItem = false
    this.clickCharge = false
    this.submitSave = false
    this.isValidAmount = true
    this.NetBillAmount = 0
    this.TaxableValue = 0
    this.billSummary = []
    this.invalidObj = {}
    this.AdditionalChargesToShow = []
    this.TaxableValue = 0
    if (this.organisationsData && this.organisationsData.length > 0) {
      this.OrgId = +this.organisationsData[0].id
      this.organisationValue = +this.organisationsData[0].id
      if (this.organisationSelect2) {
        this.organisationSelect2.setElementValue(this.OrgId)
      }
    }
    if (this.godownsData && this.godownsData.length === 1) {
      this.GodownId = +this.godownsData[0].id
      this.godownValue = +this.godownsData[0].id
      if (this.godownSelect2) {
        this.godownSelect2.setElementValue(this.GodownId)
      }
    }
    if (this.currencyData && this.currencyData.length >= 1) {
      this.CurrencyId = +this.currencyData[0].id
      this.currencyValue = +this.currencyData[0].id
      if (this.currencySelect2) {
        this.currencySelect2.setElementValue(this.CurrencyId)
      }
    }
    if (this.convertToCurrencyData && this.convertToCurrencyData.length >= 1) {
      this.ConvertToCurrencyId = +this.convertToCurrencyData[0].id
      this.convertToCurrencyValue = +this.convertToCurrencyData[0].id
      if (this.convertToSelect2) {
        this.convertToSelect2.setElementValue(this.ConvertToCurrencyId)
      }
    }
    if (this.vendorSelect2) {
      this.vendorSelect2.setElementValue(0)
    }
    if (this.chargeSelect2) {
      this.chargeSelect2.setElementValue(0)
    }
    if (this.taxSlabChargeSelect2) {
      this.taxSlabChargeSelect2.setElementValue(0)
    }
    if (this.referralSelect2) {
      this.referralSelect2.setElementValue(0)
    }
    if (this.referraltypeSelect2) {
      this.referraltypeSelect2.setElementValue(0)
    }
    this.RoundOff = 0
    this.RoundOffManual = 0
    this.billSummary = []
    this.AddressData = []
    //this.setBillDate()
    this.setPartyBillDate()
    this.setPayDate()
    // this.setExpiryDate()
    this.setDueDate()
    // this.setMfdDate()
    //this.getNewBillNo()
    //this.getNewCurrentDate()
  }

  getNewCurrentDate() {
    this._saleDirectReturnService.getCurrentDate().subscribe(
      data => {
        console.log('current date : ', data)
        if (data.Code === UIConstant.THOUSAND && data.Data.length > 0) {
          this.setCurrentDate(data.Data)
        }
      }
    )
  }

  private saleReturnAddParams(): SaleReturnRequestAdd {
    let BillDate = this.gs.clientToSqlDateFormat(this.BillDate, this.clientDateFormat)
    let CurrentDate = this.gs.clientToSqlDateFormat(this.CurrentDate, this.clientDateFormat)
    //  let PartyBillDate = this.gs.clientToSqlDateFormat(this.PartyBillDate, this.clientDateFormat)
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

    const saleReturnItem = {
      obj: {
        Id: this.editMode ===true ? this.Id : 0,
        SaleId: this.Id ? this.Id : UIConstant.ZERO,
        ReferralCommissionTypeId: 0,
        ReferralCommission: 0,
        PaymentDetail: PaymentDetail,
        Items: Items,
        BillAmount: this.BillAmount,
        BillDate: BillDate,
        CurrentDate: CurrentDate,
        PartyBillDate: '',
        PartyBillNo: '',
        BillNo: this.BillNo,
        ConvertedAmount: 0,
        CurrencyRate: 0,
        TotalDiscount: +this.TotalDiscount,
        PartyId: +this.PartyId,
        //SupplyState:1252,
        ReferralId: 0,
        ReferralTypeId: 0,
        ReferralComission: 0,
        ReferralComissionTypeId: 0,
        ReverseCharge: 0,
        ReverseTax: 0,
        CessAmount: +this.CessAmount,
        RoundOff: this.RoundOffManual !== 0 ? this.RoundOffManual : this.RoundOff,
        SubTotalAmount: +this.SubTotalAmount,
        TotalTaxAmount: +this.TotalTaxAmount,
        TotalChallan: 0,
        VehicleNo: this.VehicleNo,
        LocationTo: this.LocationTo,
        Drivername: this.Drivername,
        Transportation: this.Transportation,
        TotalQty: +this.TotalQty,
        OtherCharge: 0,
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
        ItemAttributeTrans: this.ItemAttributeTrans,
        ItemTaxTrans: this.ItemTaxTrans,
        AdditionalCharges: []
      } as SaleReturnRequestAdd
    }
    console.log('obj : ', JSON.stringify(saleReturnItem.obj))
    return saleReturnItem.obj
  }

  validateTransaction() {
    if (this.Paymode || +this.PayModeId > 0 || +this.LedgerId > 0 || this.BankLedgerName || this.ChequeNo) {
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
      this.invalidObj['PayModeId'] = false
      this.invalidObj['LedgerId'] = false
      this.invalidObj['ledgerName'] = false
      this.invalidObj['Amount'] = false
      this.invalidObj['PayDate'] = false
      this.invalidObj['ChequeNo'] = false
    }
    this.clickTrans = false
  }

  checkForValidation() {
    if (this.PartyId || this.OrgId || this.BillDate || this.BillNo
      || this.CurrencyId
      || this.GodownId || this.AddressId
      || this.ItemId || this.UnitId || this.TaxSlabId
      || this.SaleRate
      || this.BatchNo || this.ExpiryDate || this.MfdDate
      || this.Length || this.Width || this.Height
    ) {
      let isValid = 1


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

      if (this.CurrencyId) {
        this.invalidObj['CurrencyId'] = false
      } else {
        this.invalidObj['CurrencyId'] = true
        isValid = 0
      }
      // if (this.GodownId) {
      //   this.invalidObj['GodownId'] = false
      // } else {
      //   this.invalidObj['GodownId'] = true
      //   isValid = 0
      // }

      // if (this.Items.length === 0 && this.submitSave) {
      //   isValid = 0

      //   if (+this.Quantity >= +this.ReturnQuantity) {
      //     this.invalidObj['ReturnQuantity'] = false
      //   } else {
      //     isValid = 0
      //     this.invalidObj['ReturnQuantity'] = true
      //   }

      //   if (this.industryId === 3) {
      //     if (+this.Length > 0) {
      //       this.invalidObj['Length'] = false
      //     } else {
      //       isValid = 0
      //       this.invalidObj['Length'] = true
      //     }
      //     if (+this.Height > 0) {
      //       this.invalidObj['Height'] = false
      //     } else {
      //       isValid = 0
      //       this.invalidObj['Height'] = true
      //     }
      //     if (+this.Width > 0) {
      //       this.invalidObj['Width'] = false
      //     } else {
      //       isValid = 0
      //       this.invalidObj['Width'] = true
      //     }
      //   }
        // this.attrSelect2.forEach((attr: Select2Component, index: number, array: Select2Component[]) => {
        //   if (this.itemAttributeTrans[index] && this.itemAttributeTrans[index].AttributeId > 0) {
        //     $('#' + $('.attr')[index].id).removeClass('errorSelecto')
        //   } else {
        //     isValid = 0
        //     $('#' + $('.attr')[index].id).addClass('errorSelecto')
        //   }
        // })
      //}
      return !!isValid
    }
  }
  validateItem() {
    let isValid = 1
    this.Items.forEach((element, index) => {
      if (+this.Items[index].Quantity >= +this.Items[index].ReturnQuantity) {
        this.invalidObj['ReturnQuantity'] = false
      } else {
        isValid = 0
        this.invalidObj['ReturnQuantity'] = true
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
    });
    return this.validItem = !!isValid
  }
  validateItem3() {

    // if (+this.ItemId > 0) {
    let isValid = 1
    // if (+this.DiscountType === 0) {
    //   this.validDiscount = (+this.Discount >= 0 && +this.Discount <= 100) ? true : false
    // } else {
    //   this.validDiscount = true
    // }
    // if (this.validDiscount) {
    //   this.invalidObj['Discount'] = false
    // } else {
    //   isValid = 0
    //   this.invalidObj['Discount'] = true
    // }
    // if (+this.ItemId > 0) {
    //   this.invalidObj['ItemId'] = false
    // } else {
    //   isValid = 0
    //   this.invalidObj['ItemId'] = true
    // }
    // if (+this.UnitId > 0) {
    //   this.invalidObj['UnitId'] = false
    // } else {
    //   isValid = 0
    //   this.invalidObj['UnitId'] = true
    // }
    // if (+this.TaxSlabId > 0) {
    //   this.invalidObj['TaxSlabId'] = false
    // } else {
    //   isValid = 0
    //   this.invalidObj['TaxSlabId'] = true
    // }
    // if (+this.SaleRate > 0) {
    //   this.invalidObj['SaleRate'] = false
    // } else {
    //   isValid = 0
    //   this.invalidObj['SaleRate'] = true
    // }
    // if (+this.Quantity > 0) {
    //   this.invalidObj['Quantity'] = false
    // } else {
    //   isValid = 0
    //   this.invalidObj['Quantity'] = true
    // }
    // if (+this.Quantity >= +this.ReturnQuantity) {
    //   this.invalidObj['ReturnQuantity'] = false
    // } else {
    //   isValid = 0
    //   this.invalidObj['ReturnQuantity'] = true
    // }
    // if (this.industryId === 5) {
    //   if (this.BatchNo) {
    //     this.invalidObj['BatchNo'] = false
    //   } else {
    //     isValid = 0
    //     this.invalidObj['BatchNo'] = true
    //   }
    //   if (this.MfdDate) {
    //     this.invalidObj['MfdDate'] = false
    //   } else {
    //     isValid = 0
    //     this.invalidObj['MfdDate'] = true
    //   }
    //   if (this.ExpiryDate) {
    //     this.invalidObj['ExpiryDate'] = false
    //   } else {
    //     isValid = 0
    //     this.invalidObj['ExpiryDate'] = true
    //   }
    // }
    // if (this.industryId === 3) {
    //   if (+this.Length > 0) {
    //     this.invalidObj['Length'] = false
    //   } else {
    //     isValid = 0
    //     this.invalidObj['Length'] = true
    //   }
    //   if (+this.Height > 0) {
    //     this.invalidObj['Height'] = false
    //   } else {
    //     isValid = 0
    //     this.invalidObj['Height'] = true
    //   }
    //   if (+this.Width > 0) {
    //     this.invalidObj['Width'] = false
    //   } else {
    //     isValid = 0
    //     this.invalidObj['Width'] = true
    //   }
    // }
    // this.attrSelect2.forEach((attr: Select2Component, index: number, array: Select2Component[]) => {
    //   if (this.itemAttributeTrans[index] && this.itemAttributeTrans[index].AttributeId > 0) {
    //     $('#' + $('.attr')[index].id).removeClass('errorSelecto')
    //   } else {
    //     isValid = 0
    //     $('#' + $('.attr')[index].id).addClass('errorSelecto')
    //   }
    // })
    // return this.validItem = !!isValid

    // }
    //  else {
    //   this.validItem = true
    //   this.invalidObj['Height'] = false
    //   this.invalidObj['Width'] = false
    //   this.invalidObj['Length'] = false
    //   this.invalidObj['ExpiryDate'] = false
    //   this.invalidObj['MfdDate'] = false
    //   this.invalidObj['BatchNo'] = false
    //   this.invalidObj['ReturnQuantity'] = false
    //   this.invalidObj['SaleRate'] = false
    //   this.invalidObj['TaxSlabId'] = false
    //   this.invalidObj['UnitId'] = false
    //   this.invalidObj['ItemId'] = false
    //   this.invalidObj['Discount'] = false
    //   this.attrSelect2.forEach((attr: Select2Component, index: number, array: Select2Component[]) => {
    //     if (this.itemAttributeTrans[index] && this.itemAttributeTrans[index].AttributeId > 0) {
    //       $('#' + $('.attr')[index].id).removeClass('errorSelecto')
    //     }
    //   })
    // }
  }

  validateAttribute() {
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

  SaveSaleReturn() {
    let _self = this
    this.submitSave = true
    let dataToSend = this.saleReturnAddParams()
    let valid = 1
    if (!this.editMode) {
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
          if (data.Code === UIConstant.REQUIRED_5020) {
            this.toastrService.showError('', data.Message)
          }
        },
        (error) => {
          console.log(error)
        },
        () => {
          //  this.addItems()
          this.addTransactions()
          // this.addCharge()
          this.getBillSummary()
          this.calculateAllTotal()
          //this.validateItem()
          this.validateTransaction()
          this.checkValidationForAmount()
          if (valid) {
            if (this.checkForValidation() && this.isValidAmount  && this.validTransaction) {
              if (this.validateItem()) {
                this._saleDirectReturnService.postSaleReturnData(this.saleReturnAddParams()).pipe(takeUntil(this.onDestroy$)).subscribe(
                  data => {
                    console.log('data : ', data)
                    if (data.Code === UIConstant.THOUSAND && data.Data) {
                      _self.toastrService.showSuccess('Saved Successfully', '')
                      _self.commonService.newPurchaseAdd()
                      this.commonService.AddedItem()
                      if (!this.keepOpen) {
                        _self.commonService.closeSaleDirectReturn()
                      } else {
                        // _self.initItem()
                        _self.initTransaction()
                        _self.initCharge()
                        _self.initComp()
                        _self.initialiseExtras()
                      }
                    } else if (data.Code === UIConstant.THOUSANDONE) {
                      _self.toastrService.showError(data.Message, 'Please change Bill No.')
                    } else {
                      _self.toastrService.showError(data.Message, '')
                    }
                  },
                  (error) => {
                    _self.toastrService.showError(error, '')
                  }
                )
              }
              else {
                this.toastrService.showError('Return Quantity never more then Sale Quantity', '')
              }

            }

          } else {
            this.toastrService.showError('The following are not unique', '')
          }
        }
      )
    } else {
      //this.addItems()
      this.addTransactions()
      // this.addCharge()
      this.getBillSummary()
      this.calculateAllTotal()
      // this.validateItem()
      this.validateTransaction()
      this.checkValidationForAmount()
      if (valid) {
        if ( this.checkForValidation() && this.isValidAmount && this.validTransaction) {
          if (this.validateItem()) {
            this._saleDirectReturnService.postSaleReturnData(this.saleReturnAddParams()).pipe(takeUntil(this.onDestroy$)).subscribe(
              data => {
                console.log('data : ', data)
                if (data.Code === UIConstant.THOUSAND && data.Data) {
                  _self.toastrService.showSuccess('Saved Successfully', '')
                  _self.commonService.newPurchaseAdd()
                  this.commonService.AddedItem()

                  if (!this.keepOpen) {
                    _self.commonService.closeSaleDirectReturn()
                  } else {
                    _self.initTransaction()
                    _self.initCharge()
                    _self.initComp()
                    _self.initialiseExtras()
                  }
                } else if (data.Code === UIConstant.THOUSANDONE) {
                  _self.toastrService.showError(data.Message, 'Please change Bill No.')
                } else {
                  _self.toastrService.showError(data.Message, '')
                }
              },
              (error) => {
                _self.toastrService.showError(error, '')
              }
            )
          }
          else{
            this.toastrService.showError('Invalid Return Quantity', '')
          }
         
        }
      } else {
        this.toastrService.showError('The following are not unique', '')
      }
    }
  }

  @ViewChild('loc_ref') locRef: ElementRef

  moveToCharge() {
    this.chargeSelect2.selector.nativeElement.focus({ preventScroll: false })
  }

  moveToPayment() {
    this.paymentSelect2.selector.nativeElement.focus({ preventScroll: false })
  }

  validateCharge() {
    if (this.LedgerName || +this.LedgerChargeId > 0 || +this.AmountCharge > 0) {
      let isValid = 1
      if (+this.LedgerChargeId > 0) { this.invalidObj['LedgerChargeId'] = false } else { isValid = 0; this.invalidObj['LedgerChargeId'] = true; }
      if (+this.AmountCharge > 0) { this.invalidObj['AmountCharge'] = false; } else { isValid = 0; this.invalidObj['AmountCharge'] = true; }
      this.validCharge = !!isValid
    } else {
      this.validCharge = true; this.invalidObj['LedgerChargeId'] = false; this.invalidObj['TaxSlabChargeId'] = false; this.invalidObj['AmountCharge'] = false;
    }
    this.clickCharge = false
  }

  addCharge() {
    if (this.LedgerName && +this.LedgerChargeId > 0 && +this.AmountCharge > 0) {
      // this.alreadySelectCharge(this.LedgerChargeId, this.LedgerName, true)
      this.addCustomCharge()
      this.clickCharge = true
      this.initCharge()
      console.log('charge : ', this.AdditionalCharges)
    }
  }

  alreadySelectCharge(chargeId, name, enableflag) {
    if (chargeId > 0) {
      this.chargesData.forEach(data => {
        let index = this.chargesData.findIndex(
          selectedItem => selectedItem.id === chargeId)
        if (index !== -1) {
          this.chargesData.splice(index, 1)
          let newData = Object.assign([], this.chargesData)
          newData.push({ id: chargeId, text: name, disabled: enableflag })
          this.chargesData = newData
        }
      })
    }
  }

  addCustomCharge() {
    if (this.appliedTaxRatesCharge.length > 0) {
      this.ItemTaxTrans = this.ItemTaxTrans.concat(this.appliedTaxRatesCharge)
    }
    console.log('ItemTaxTrans : ', this.ItemTaxTrans)
    let index = 0
    if (this.AdditionalCharges.length === 0) {
      index = 1
    } else {
      index = +this.AdditionalCharges[this.AdditionalCharges.length - 1].Sno + 1
    }
    this.appliedTaxRatesCharge.forEach(element => {
      element['Sno'] = index
      element['ItemTransTaxId'] = index
    })
    this.AdditionalCharges.push({
      Id: 0,
      Sno: index,
      LedgerChargeId: this.LedgerChargeId,
      LedgerName: this.LedgerName,
      AmountCharge: this.AmountCharge,
      TaxSlabChargeId: this.TaxSlabChargeId,
      TaxChargeName: this.TaxChargeName,
      TaxAmountCharge: this.TaxAmountCharge,
      TotalAmountCharge: this.TotalAmountCharge,
      TaxTypeCharge: this.TaxTypeCharge,
      taxTypeChargeName: this.taxTypeChargeName,
      taxChargeSlabType: this.taxChargeSlabType,
      taxChargeRates: this.taxChargeRates,
      itemTaxTrans: this.appliedTaxRatesCharge,
      TaxableAmountCharge: this.TaxableAmountCharge
    })
    setTimeout(() => {
      this.commonService.fixTableHFL('charge-table')
    }, 1)
    if (this.editChargeId !== -1) {
      this.AdditionalCharges[this.AdditionalCharges.length - 1].Id = this.editChargeId
    }
  }

  onChargeSelect(evt) {
    if (+evt.value === -1 && evt.data[0].selected) {
      this.chargeSelect2.selector.nativeElement.value = ''
      this.commonService.openledgerCretion('', FormConstants.SaleForm)

    } else {
      this.LedgerChargeId = +evt.value
      if (evt.value > 0) {
        this.LedgerName = evt.data[0].text
      }
    }
    this.validateCharge()
    this.calculate()
  }

  onTaxSlabChargeSelect(evt) {
    // console.log('on change of tax slab : ', evt)
    if (+evt.value === -1) {
      this.commonService.openTax('')
      this.taxSlabChargeSelect2.selector.nativeElement.value = ''
    } else {
      if (evt.value > 0 && evt.data[0] && evt.data[0].text) {
        this.TaxSlabChargeId = +evt.value
        this.TaxChargeName = evt.data[0].text
        this.getTaxChargeDetail(this.TaxSlabChargeId)
      }
    }
    this.validateCharge()
  }

  getTaxChargeDetail(TaxSlabId) {
    this._saleDirectReturnService.getSlabData(TaxSlabId).subscribe(
      data => {
        console.log('tax slab data : ', data)
        if (data.Code === UIConstant.THOUSAND && data.Data) {
          this.taxChargeSlabType = (data.Data.TaxSlabs[0]) ? data.Data.TaxSlabs[0].Type : 0
          this.taxChargeRates = data.Data.TaxRates
          this.calculate()
         // this.createTaxes(FormConstants.ChargeForm)
          this.getBillSummary()
        }
      }
    )
  }

  createTaxes(parentType) {
    let Sno = 0
    if (parentType === FormConstants.ChargeForm) {
      if (this.editChargeId !== -1) {
        Sno = this.editChargeSno
      } else {
        if (this.AdditionalCharges.length === 0) {
          Sno = 1
        } else {
          Sno = this.AdditionalCharges[this.AdditionalCharges.length - 1].Sno + 1
        }
      }
      if (this.appliedTaxRatesCharge.length > 0) {
        this.appliedTaxRatesCharge.forEach((taxRate) => {
          taxRate['ItemTransTaxId'] = Sno
          taxRate['Sno'] = Sno
        })
      }
      let charge = this.AdditionalCharges.find((charge) => charge.Sno === Sno)
      if (charge) {
        charge['itemTaxTrans'] = this.appliedTaxRatesCharge
      }
      console.log('tax rates applied : ', this.appliedTaxRatesCharge)
    } else if (parentType === FormConstants.SaleForm) {
     
      if (this.editItemId !== -1) {
        Sno = this.editItemSno
      } else {
        if (this.Items.length === 0) {
          Sno = 1
        } else {
          Sno = this.Items[this.Items.length - 1].Sno + 1
        }
      }
      if (this.appliedTaxRatesItem.length > 0) {
        this.appliedTaxRatesItem.forEach((taxRate) => {
          taxRate['ItemTransTaxId'] = Sno
          taxRate['Sno'] = Sno
        })
      }
      let item = this.Items.find((item) => item.Sno === Sno)
      if (item) {
        item['itemTaxTrans'] = this.appliedTaxRatesItem
      }
      console.log('tax rates hhhhhhhhhapplied : ', this.appliedTaxRatesItem)
    }
  }

  @ViewChild('taxTypecharge_select2') taxTypeChargeSelect2: Select2Component
  onTaxTypeChargeSelect(evt) {
    // console.log('on change of tax Type charge : ', evt)
    if (+evt.value >= 0 && evt.data[0] && evt.data[0].text) {
      this.TaxTypeCharge = +evt.value
      this.taxTypeChargeName = evt.data[0].text
      this.calculate()
    }
  }

  @ViewChild('taxSlab_select2') taxSlabSelect2: Select2Component
  onTaxSlabSelect(evt) {
    // console.log('on change of tax slab : ', evt)
    if (+evt.value === -1) {
      this.commonService.openTax('')
      this.taxSlabSelect2.selector.nativeElement.value = ''
    } else {
      if (evt.value > 0 && evt.data[0] && evt.data[0].text) {
        this.TaxSlabId = +evt.value
        this.taxSlabName = evt.data[0].text
        this.TaxSlabName = evt.data[0].text
        this.getTaxDetail(this.TaxSlabId)
      }
    }
    //  this.validateItem()
  }

  getTaxDetail(TaxSlabId) {
    if (TaxSlabId > 0) {
      this._saleDirectReturnService.getSlabData(TaxSlabId).subscribe(
        data => {
          console.log('tax slab data : ', data)
          if (data.Code === UIConstant.THOUSAND && data.Data) {
            if (this.OrgGStType === 1) {
            this.itemTaxListFlag = true
            this.taxSlabType = (data.Data.TaxSlabs[0]) ? data.Data.TaxSlabs[0].Type : 0
            this.taxRates = data.Data.TaxRates
            }
            else {
              this.itemTaxListFlag = false
              this.taxSlabType = 0
              this.taxRates = []
            }

            //
            this.createTaxes(FormConstants.SaleForm)
            this.calculate()
           
           // this.getBillSummary()
            this.validateItem()
          }
        }
      )
    }
    else {
      this.itemTaxListFlag = false
      this.taxSlabType = 0
      this.taxRates = []
    }
  }

  @ViewChild('taxType_select2') taxTypeSelect2: Select2Component
  onTaxTypeSelect(evt) {
    // console.log('on change of tax Type : ', evt)
    if (+evt.value >= 0 && evt.data[0] && evt.data[0].text) {
      this.TaxType = +evt.value
      this.taxTypeName = evt.data[0].text
      this.calculate()
    }
    // this.validateItem()
  }
  OrgGStType: any
  NetBillAmount = 0
  TaxableValue = 0
  billSummary: Array<any> = []
  AdditionalChargesToShow: any = []
  // getBillSummary() {
  //   let taxableValue = 0
  //   let ItemTaxTrans = []
  //   this.Items.forEach(element => {
  //     ItemTaxTrans = ItemTaxTrans.concat(element.itemTaxTrans)
  //     taxableValue += +element.AmountItem
  //   });
  //   if (+this.ItemId > 0 && +this.AmountItem > 0) {
  //     taxableValue += +this.AmountItem
  //     if (this.appliedTaxRatesItem.length > 0) {
  //       ItemTaxTrans = ItemTaxTrans.concat(this.appliedTaxRatesItem)
  //     }
  //   }
  //   this.AdditionalChargesToShow = JSON.parse(JSON.stringify(this.AdditionalCharges))
  //   this.AdditionalCharges.forEach(element => {
  //     ItemTaxTrans = ItemTaxTrans.concat(element.itemTaxTrans)
  //   });
  //   if (!this.clickCharge && +this.AmountCharge > 0 && +this.LedgerChargeId > 0) {
  //     if (this.appliedTaxRatesCharge.length > 0) {
  //       ItemTaxTrans = ItemTaxTrans.concat(this.appliedTaxRatesCharge)
  //     }
  //     if (!this.creatingForm) {
  //       this.AdditionalChargesToShow.push({
  //         'LedgerName': this.LedgerName,
  //         'TaxableAmountCharge': +this.TaxableAmountCharge
  //       })
  //     }
  //   }
  //   this.TaxableValue = taxableValue
  //   this.billSummary = []
  //   if (!this.creatingForm) {
  //     this.ItemTaxTrans = JSON.parse(JSON.stringify(ItemTaxTrans))
  //   }
  //   let groupOnId = _.groupBy(ItemTaxTrans, (tax) => {
  //     return tax.TaxRateId
  //   })
  //   for (const rateId in groupOnId) {
  //     if (groupOnId.hasOwnProperty(rateId)) {
  //       const element = groupOnId[rateId];
  //       let obj = {}
  //       obj['name'] = element[0]['TaxRateNameTax']
  //       let sum = 0
  //       element.forEach(tax => {
  //         sum += +tax.AmountTax
  //       })
  //       obj['total'] = sum
  //       if(this.itemTaxListFlag){
  //         this.billSummary.push(obj)
  //       }
  //       else{
  //       this.billSummary = []

  //       }

  //     }
  //   }
  //   this.loadingSummary = false
  //   this.calculateBillTotal()
  // }
  getBillSummary() {
    debugger
    let taxableValue = 0
    let ItemTaxTrans = []
    let itemtaxForSumry = []
    this.billSummary = [] 
    console.log( this.Items ,'items---')
    this.Items.forEach(element => {
      ItemTaxTrans = ItemTaxTrans.concat(element.itemTaxTrans)
      taxableValue += +element.AmountItem
    });
    // ItemTaxTrans.forEach(ele => {

    //   let itemtax = this.appliedTaxRatesItem.filter(s => s.TaxRateId === ele.TaxRateId)

    //   if (itemtax.length > 0) {
    //     itemtax[0]['Sno'] = ele.Sno
    //     itemtaxForSumry.push(itemtax[0])

    //   }
    // });

    this.TaxableValue = taxableValue
   
    let groupOnId = _.groupBy(ItemTaxTrans, (tax) => {
      return tax.TaxRateId
    })
    for (const rateId in groupOnId) {
      if (groupOnId.hasOwnProperty(rateId)) {
        const element = groupOnId[rateId];
        let obj = {}
        obj['name'] = element[0]['TaxRateNameTax']
        let sum = 0
        element.forEach(tax => {
          sum += +tax.AmountTax
        })
        obj['total'] = sum
        this.billSummary.push(obj)

      }
    }
    this.loadingSummary = false
    this.calculateBillTotal()
  }
  calculateBillTotal() {
    this.BillAmount = 0
    this.billSummary.forEach(element => {
      this.BillAmount += +element.total
    })
    this.AdditionalChargesToShow.forEach(charge => {
      this.BillAmount += +charge.TaxableAmountCharge
    })
    this.BillAmount += +this.TaxableValue
    let billAmount = this.BillAmount
    if (+this.RoundOffManual > 0 || +this.RoundOffManual < 0) {
      billAmount = billAmount + this.RoundOffManual
      this.BillAmount = billAmount
    } else {
      this.RoundOff = +(Math.round(billAmount) - billAmount).toFixed(4)
      this.BillAmount = Math.round(billAmount)
    }
    this.CessAmount = 0
    this.calculatePaymentAmount()
  }

  calculateAllTotal() {

    let totalDiscount = 0
    let totalTax = 0
    let totalQuantity = 0
    let totalAmount = 0
    for (let i = 0; i < this.Items.length; i++) {
      totalDiscount = totalDiscount + +this.Items[i].DiscountAmt
      totalTax = totalTax + +this.Items[i].TaxAmount
      totalQuantity = totalQuantity + +this.Items[i].ReturnQuantity
      totalAmount = +totalAmount + +this.Items[i].SubTotal
    }
    if (!this.clickItem && this.ItemId > 0) {
      if (+this.DiscountAmt > 0) { totalDiscount += +this.DiscountAmt }
      if (+this.TaxAmount > 0) { totalTax += +this.TaxAmount }
      if (+this.ReturnQuantity >= 0) { totalQuantity += +this.ReturnQuantity }
      if (+this.SubTotal > 0) { totalAmount += +this.SubTotal }
    }
    this.TotalDiscount = +totalDiscount.toFixed(this.noOfDecimalPoint)
    this.TotalTaxAmount = +totalTax.toFixed(4)
    this.TotalQty = +totalQuantity.toFixed(this.noOfDecimalPoint)
    this.SubTotalAmount = +totalAmount.toFixed(this.noOfDecimalPoint)
  }

  enterPressCharge(evt: KeyboardEvent) {
    this.addCharge()
    setTimeout(() => {
      this.chargeSelect2.selector.nativeElement.focus()
    }, 10)
  }

  getPurchaseRate() {
    if (+this.ReturnQuantity >= 0 && +this.TotalRate > 0) {
      let lwh = (+this.ReturnQuantity) * (isNaN(+this.Length) || +this.Length === 0 ? 1 : +this.Length)
        * (isNaN(+this.Width) || +this.Width === 0 ? 1 : +this.Width)
        * (isNaN(+this.Height) || +this.Height === 0 ? 1 : +this.Height)
      this.SaleRate = +(+this.TotalRate / lwh).toFixed(this.noOfDecimalPoint)
    }
  }



  ngOnDestroy() {
    this.onDestroy$.next()
    this.onDestroy$.complete()
  }
}
