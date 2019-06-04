import { Component,Renderer2, ViewChild, ViewChildren, QueryList } from '@angular/core'
import { Subscription } from 'rxjs'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { AddCust, ResponseSale, TravelPayments } from '../../../../../model/sales-tracker.model'
import { Select2OptionData, Select2Component } from 'ng2-select2'
import { VendorServices } from '../../../../../commonServices/TransactionMaster/vendoer-master.services'
import { ToastrCustomService } from '../../../../../commonServices/toastr.service'
import { UIConstant } from '../../../../../shared/constants/ui-constant'
import { CategoryServices } from '../../../../../commonServices/TransactionMaster/category.services'
import { ItemmasterServices } from '../../../../../commonServices/TransactionMaster/item-master.services'
import { CommonService } from '../../../../../commonServices/commanmaster/common.services'
import { GlobalService } from '../../../../../commonServices/global.service'
import { Settings } from '../../../../../shared/constants/settings.constant'
import { FormConstants } from 'src/app/shared/constants/forms.constant';
declare const _: any
declare var $: any
declare var flatpickr: any
@Component({
  selector: 'app-sales-direct',
  templateUrl: './sales-direct.component.html',
  styleUrls: ['./sales-direct.component.css']
})
export class SalesDirectComponent {
  customerForm: FormGroup
  BillNo: string
  ChallanIds: any
  SenderId: any
  ReceiverId: string
  InvoiceDate: string
  DueDate: string
  SupplyDate: any
  CurrencyId: string
  BillAmount: number
  RoundOff: number
  RoundOffManual : number
  decimalPointDigit: number
  EwayBillNo: string
  ParcelBy: string
  OtherCharge: number
  Customduty: number
  Destination: string
  OnlineOrder: number
  TotalBox: number
  BoxCharge: number
  TotalWeight: number
  TotalKg: number
  Rate: any
  Discount: any
  Description: string
  Quantity: any
  UnitPrice: number
  TotalAmount: number
  Width: any
  Length: any
  Height: any
  lastBillNo: string = ''

  allChallanNos: any
  validTransaction: boolean = true
  Paymode: string
  ledgerName: string
  Amount: any
  PayDate: string
  ChequeNo: string
  paymode: any

  ParcelLength: number
  ParcelHeight: number
  ParcelWidth: number
  items = []
  ATTRIBUTE_PARENTTYPEID: any
  VehicleNo: string
  Drivername: string
  Transportation: string
  LocationTo: string
  TotalFreight: number
  TotalQuantity: number
  public countryList: Array<Select2OptionData>
  public stateListCustomer: Array<Select2OptionData>
  public cityList: Array<Select2OptionData>
  public stateList: any
  public areaList: Array<Select2OptionData>
  public customerType: Array<Select2OptionData>
  public addressType: Array<Select2OptionData>
  public selectyCoustmoreRegistration: Array<Select2OptionData>
  public addressTypePlaceHolder: Select2Options
  public coustmoerTypePlaceholder: Select2Options
  public areaListPlaceHolder: Select2Options
  public stateListplaceHolder: Select2Options
  public countryListPlaceHolder: Select2Options
  clientNameSelect2: Array<Select2OptionData>
  suplierNameSelect2: Array<Select2OptionData>
  paymentModeSelect2: Array<Select2OptionData>
  parcelBySelect2: Array<Select2OptionData>
  destinationSelect2: Array<Select2OptionData>
  // public godownPlaceholder: Select2Options;
  public godownPlaceholder: Select2Options

  currenciesSelect2: Array<Select2OptionData>
  paymentLedgerselect2: Array<Select2OptionData>
  public subCategoryType: Array<Select2OptionData>
  public itemcategoryPlaceHolder: Select2Options
  public ledgerChargePlaceHolder :Select2Options
  public referalsPlaceHolder: Select2Options
  public frightPlaceholder: Select2Options
  public CommissionTypePlcaholder: Select2Options
  public referalsType: Array<Select2OptionData>

  public referalsTypePlaceHolder: Select2Options
  clientnamePlaceHolder: Select2Options
  CurrencyPlaceHolder: Select2Options

  paymentPlaceHolder: Select2Options
  ledgerPlaceHolder: Select2Options
  supplierPlaceHolder: Select2Options
  currencyPlaceholder: Select2Options
  destinationPlaceholder: Select2Options
  parcelByPlaceHolder: Select2Options
  orgnazationPlaceHolder: Select2Options
  public taxTypePlaceHolder: Select2Options
  newCustAddSub: Subscription
  newTaxSlabAddSub: Subscription
  itemAddSub: Subscription
  newAttributeADDModel1: Subscription
  newCustAddCutomer: Subscription
  newLedgerbankAdd: Subscription
  newNewAddress: Subscription
  additionChargeLedgerModel: Subscription
  // newLedgerAddSub: Subscription
  subscribe: Subscription
  modalOpen: Subscription
  // modalSub3:Subscription
  modalCategory: Subscription
  clickItem: boolean = false
  clickTrans: boolean = false
  clickSaleAdditionCharge: boolean =false
  isValidAmount: boolean = true
  keepOpen: boolean
  submitSave: boolean = false
  itemSubmit: boolean = false
  categoryType: any
  cateGoryValue: any
  attributeValue: any
  itemCatValue: any
  categoryId: any
  godownDataType: any
  taxSlabSelectoData: any
  taxTypeSelectData: any

  public attributeColourPlaceHolder: Select2Options
  public attributeSizePlaceHolder: Select2Options
  public attributeArticlePlaceHolder: Select2Options
  public selectTax: Array<Select2OptionData>
  //
  getUnitId: any
  unitId: any
  taxSlabId: any
  taxValue: any
  categoryPlaceHolder: Select2Options
  editMode: boolean
  Id: any
  editItemId: any
  godownId: any
  clientDateFormat: string = ''
  InterestRateType: any
  CommisionRateType: any
  transactions: any
  AdditionalChargeData: any
  IsForOtherState: any;
  constructor (private _coustomerServices: VendorServices,private _formBuilder: FormBuilder,public renderer2: Renderer2, public _globalService: GlobalService, private _itemmasterServices: ItemmasterServices, private _categoryServices: CategoryServices,
    private _ledgerServices: VendorServices,
    private toastrService: ToastrCustomService,
    public _commonService: CommonService,
    public _settings: Settings) {
    this.ATTRIBUTE_PARENTTYPEID = 6
    this.clientDateFormat = this._settings.dateFormat
    this.addCustomerForm()
    this.clientNameSelect2 = []
    this.suplierNameSelect2 = []
    this.paymentModeSelect2 = []
    this.destinationSelect2 = []
    this.sendAttributeData = []
    this.parcelBySelect2 = []
    this.AdditionalChargeData =[]
    this.DiscountType = '0'
    this.InterestRateType = 0
    this.CommisionRateType = 0
    this.totalDiscount = 0
    this.totalTaxAmount = 0
    this.DiscountPerItem = 0
    this.totalBillAmount = 0
    // this.getClientName(0)

    // for new add unit
    this.newCustAddSub = this._commonService.getUnitStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.unitDataType)
          newData.push({ id: data.id, text: data.name })
          this.unitDataType = newData
          this.unitId = data.id
          this.getUnitId = data.id
          setTimeout(() => {
            if (this.unitSelect2) {
              const element = this.renderer2.selectRootElement(this.unitSelect2.selector.nativeElement, true)
              element.focus({ preventScroll: false })
            }
          }, 2000)
        }
      }
    )
    this.newAttributeADDModel1 = this._commonService.getAttributeStatus().subscribe(
      (Attri: AddCust) => {
        if (Attri.id > 0) {
          let Atdata
          if (this.attributesLabels.length > 0) {
            for (let i = 0; i < this.attributesLabels.length; i++) {
              Atdata = this.allAttributeData[i].item.filter(value => value.attributeId === Attri.AttributeId)
              if (Atdata.length > 0) {
                let newData = Object.assign([], this.allAttributeData[i].item)
                newData.push({ id: Attri.id, text: Attri.name, AttributeId: Attri.AttributeId })
                this.allAttributeData[i].item = newData
                this.attrinuteSetDataId = Attri.id
              }
            }
          }
        }
      }
    )

    this.newTaxSlabAddSub = this._commonService.getTaxStatus().subscribe(
      (data: AddCust) => {
        //   console.log(data,"jkkk")
        if (data.id && data.name) {
          let newData = Object.assign([], this.taxSlabSelectoData)
          newData.push({ id: data.id, text: data.name })
          this.taxSlabSelectoData = newData
          this.taxSlabId = data.id
          setTimeout(() => {
            if (this.taxSelect2) {
              const element = this.renderer2.selectRootElement(this.taxSelect2.selector.nativeElement, true)
              element.focus({ preventScroll: false })
            }
          }, 2000)
        }
      }
    )

    this.itemAddSub = this._commonService.getItemMasterStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.itemCategoryType)
          newData.push({ id: data.id, text: data.name })
          this.itemCategoryType = newData
          this.itemCategoryId = +data.id
          this.itemCategoryId = data.id
          setTimeout(() => {
            if (this.itemSelect2) {
              const element = this.renderer2.selectRootElement(this.itemSelect2.selector.nativeElement, true)
              element.focus({ preventScroll: false })
            }
          }, 2000)
        }
      }
    )
    // for new add bank
    this.newLedgerbankAdd = this._commonService.getLedgerStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.paymentLedgerselect2)
          newData.push({ id: data.id, text: data.name })
          this.paymentLedgerselect2 = newData
          this.ledgerBank = data.id
        }
      }
    )

    // for new add customer
    this.newCustAddCutomer = this._commonService.getCustStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.clientNameSelect2)
          newData.push({ id: data.id, text: data.name })
          this.clientNameSelect2 = newData
          this.clientNameId = data.id
        }
      }
    )
    this.newNewAddress = this._commonService.getAddressStatus().subscribe(
      (data: AddCust) => {

        if (data.id && data.name) {
          let newData = Object.assign([], this.stateList)
          newData.push({ id: data.id, text: data.name })
          this.stateList = newData
          this.stateValue = data.id
          this.stateId = +data.stateId
          this.checkOtherStateForNewItemAdd(JSON.parse(this.stateId))
         
        }
      }
    )
    this.additionChargeLedgerModel = this._commonService.getledgerCretionStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name ) {
          let newData = Object.assign([], this.additionChargeLedger)
          newData.push({ id: +data.id, text: data.name })
          this.additionChargeLedger = newData
          this.ledgerChargeValue = data.id
          this.additionChargeId = data.id
          this.additionaChargeName = data.name
          this.validationCharge()
        }
      }
    )
    this.modalOpen = this._commonService.getSaleDirectStatus().subscribe(
      (status: any) => {
        if (status.open) {
          if (status.editId === UIConstant.BLANK) {
            this.editMode = false
            this.editRowListFlag = true
            this.Id = 0
            this.CaseCustId = 0
          } else {
            this.editMode = true
            this.editRowListFlag = false
            this.Id = status.editId
          }
          this.openDirectModal()

        } else {
          this.closeModal()
        }
      }

    )
    this.modalCategory = this._commonService.getCategoryStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let categoryId = data.id
          let categoryName = data.name
          this.getAllCategories(categoryName, categoryId, true)
        }
        // if (data.id && data.name && data.type) {
        //   if (data.type === 'cat') {
        //     let newData = Object.assign([], this.categoryType)
        //     newData.push({ id: data.id, text: data.name })
        //     this.categoryType = newData
        //     this.cateGoryValue = +data.id
        //     this.categoryId = +data.id
        //     this.getAllCategories(data.name, data.id, true)
        //   }

        // }
      }
    )
  }
  ledgerChargeValue: any
  editRowListFlag: any
  ngOnInit () {
    this.Id = 0
    this.AttrId = 0
    this.editItemId = 0
    this.getFreightValueData()
    this.getCommisionTypeValue()
    this.initComp()
    this.selectTax = []

  }
  ledgerBank: any
  attrinuteSetDataId: any
  @ViewChild('taxCharge_select2') taxChargeSelect2: Select2Component
  @ViewChild('item_select2') itemSelect2: Select2Component
  @ViewChild('atrSize_id') atrSizeSelect2: Select2Component
  @ViewChild('atrArticle_id') atrArticleSelect2: Select2Component
  @ViewChild('ledger_select2') ledgerSelect2: Select2Component

  initComp () {
    this.initialiseItem()
    this.initialiseParams()
    this.initialiseTransaction()
  }
  attributesLabels: any
  unitDataType: any
  unitPlaceHolder: any
  taxslabPlaceHolder: any
  newDataTaxTypes: any
  itemCategoryType: any
  itemCategoryData: any
  attributeValues: any
  attributesLabesId: any
  AttributeSize: any
  AttributeArticle: any
  referals: Array<Select2OptionData>
  CommissionType: Array<Select2OptionData>
  allAttributeData: any
  prototype: any
  tempAttribute: any
  currencies: any

  getAllCategories (categoryName, categoryId, isAddNew) {

    this._commonService.getAllCategories().subscribe(
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
  getOrgnization(data){
    if (data.Data && data.Data.Organizations && data.Data.Organizations.length > 0) {
      this.organizationData = []
      this.orgnazationPlaceHolder = { placeholder: 'Select Organization' }
      this.organizationData = [{ id: UIConstant.BLANK, text: 'Select  Organization' }]
      this.setupOrganization = data.Data.Organizations
   //   if (data.Data.Organizations.length > 0) {
        data.Data.Organizations.forEach(ele => {
          this.organizationData.push({
            id: ele.Id,
            text: ele.Name
          })
        })
        this.orgnizationSelect2.setElementValue(this.orgNameId)
        this.orgNameId = this.organizationData[1].id
        return this.orgNameId
      //}

    }
  }
  getSetAttributeSPUTility (data) {
    if (data.Data && data.Data.AttributeValueResponses && data.Data.AttributeValueResponses.length > 0) {

      this.allAttributeData = []
      this.attributesLabels = []
let newData =[]
       newData = Object.assign([], this.attributesLabels)
      this.attributeColourPlaceHolder = { placeholder: 'Select' }
      for (let j = 0; j < data.Data.AttributeValueResponses.length; j++) {
        newData.push({
          Name: data.Data.AttributeValueResponses[j].Name,
          AttributeId: data.Data.AttributeValueResponses[j].AttributeId
        })
      }

      this.attributesLabels = newData
      for (let k = 0; k < this.attributesLabels.length; k++) {
        for (let n = 0; n < data.Data.AttributeValueResponses.length; n++) {
          if (this.attributesLabels[k].AttributeId === data.Data.AttributeValueResponses[n].AttributeId) {
            let abs = data.Data.AttributeValueResponses[n].AttributeValues
            for (let p = 0; p < data.Data.AttributeValueResponses[n].AttributeValuesResponse.length; p++) {
              abs.push({
                id: data.Data.AttributeValueResponses[n].AttributeValuesResponse[p].Id,
                text: data.Data.AttributeValueResponses[n].AttributeValuesResponse[p].Name,
                attributeId: data.Data.AttributeValueResponses[n].AttributeValuesResponse[p].AttributeId

              })
            }
            this.allAttributeData.push({
              item: abs
            })
          }

        }
      }
    }
  }
  getAttributeSPUtilityData: any
  getSPUtilityDataBilling () {
    // SPUtility API; For get all data of API
    this.subscribe = this._commonService.getSPUtilityData(UIConstant.SALE_TYPE).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND) {
        if (data.Data && data.Data.TransactionNoSetups.length > 0) {
          if (!this.editMode && this.editRowListFlag) {
            if (this.isManualBillNoEntry) {
              this.BillNo = ''
              this.updateLastBillNo(this.InvoiceDate, this.orgNameId)
            } else {
              this.BillNo = data.Data.TransactionNoSetups[0].BillNo

            }
          }

        }
        if (data.Data && data.Data.Organizations.length > 0) {
          this.getOrgnization(data)
        }
        if (data.Data && data.Data.AttributeValueResponses && data.Data.AttributeValueResponses.length > 0) {
          
           this.getAttributeSPUtilityData = data
           this.getSetAttributeSPUTility(data)
         }
        if (this.editMode) {
          this.isManualBillNoEntry = false
          this.itemTableDisabledFlag =false
          this.EditSaleData(this.Id)
        }
        let newDataCurrency = []
        this.CurrencyPlaceHolder = { placeholder: 'Currency' }
        if (data.Data && data.Data.Currencies.length > 0) {
          data.Data.Currencies.forEach(element => {
            newDataCurrency.push({
              id: element.Id,
              text: element.Symbol
            })
          })

          this.CurrencyId = newDataCurrency[0].id
        }
        this.currencies = newDataCurrency

        this.taxslabPlaceHolder = { placeholder: 'Tax Slab' }
        let newDataTaxSlab = [{ id: UIConstant.BLANK, text: 'Tax Slab' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
        if (data.Data && data.Data.TaxSlabs.length > 0) {
          data.Data.TaxSlabs.forEach(element => {
            newDataTaxSlab.push({
              id: element.Id,
              text: element.Slab
            })
          })
        }
        this.taxSlabSelectoData = newDataTaxSlab

        let newDataTaxType = [{ id: '0', text: 'Exclusive' }, { id: '1', text: 'Inclusive' }]
        this.taxTypeSelectData = newDataTaxType
        this.taxTypeId =  this.taxTypeSelectData[0].id

        this.unitDataType = []
        this.unitPlaceHolder = { placeholder: 'Select Unit' }
        let newdataUnit = [{ id: UIConstant.BLANK, text: 'Select  Unit' }, { id: '-1', text: '+Add New' }]
        if (data.Data && data.Data.SubUnits.length > 0) {
          data.Data.SubUnits.forEach(element => {
            if (element.PrimaryUnitId === UIConstant.ZERO) {
              newdataUnit.push({
                id: element.Id,
                text: element.Name
              })
            }
          })
        }
        this.unitDataType = newdataUnit

        this.clientnamePlaceHolder = { placeholder: 'Select Client Name' }
        let newData = [{ id: UIConstant.BLANK, text: 'Select Client Name' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
        if (data.Data && data.Data.Customers.length > 0) {
          data.Data.Customers.forEach(element => {
            newData.push({
              id: element.Id,
              text: element.Name
            })
          })
        }
        this.clientNameSelect2 = newData
        this.godownDataType = []
        this.godownPlaceholder = { placeholder: 'Select Godown' }
        let newGodown = []
        // this.godownDataType = [ { id: '-1', text: '+Add New' }]
        if (data.Data && data.Data.Godowns.length > 0) {
          data.Data.Godowns.forEach(element => {
            newGodown.push({
              id: element.Id,
              text: element.Name
            })

          })
          
        }
        if(newGodown.length >0){
          this.godownDataType = newGodown
          this.godownId = newGodown[0].id
          this.godownSelect2.setElementValue(this.godownId)
        }
        
        // this.godownId =  this.godownDataType[0].id

        this.paymentPlaceHolder = { placeholder: ' Payment Mode' }
        let newDataPayment = [{ id: UIConstant.BLANK, text: ' Payment Mode' }]
        if (data.Data && data.Data.PaymentModes.length > 0) {
          data.Data.PaymentModes.forEach(element => {
            newDataPayment.push({
              id: element.Id,
              text: element.PayModeName
            })
          })
        }
        this.paymentModeSelect2 = newDataPayment

        this.itemCategoryType = []
        this.allItemsData = []
        this.itemcategoryPlaceHolder = { placeholder: 'Select Item' }
        console.log(data.Data, 'itam-data')
        this.itemCategoryType = [{ id: UIConstant.BLANK, text: 'Select  Item' }, { id: '-1', text: '+Add New' }]
        if (data.Data && data.Data.Items.length > 0) {
          this.allItemsData = data.Data.Items
          data.Data.Items.forEach(element => {
            this.itemCategoryType.push({
              id: element.Id,
              text: element.Name,
              categoryId: element.CategoryId
            })
          })
        }
        this.itemCategoryType = this.itemCategoryType
        console.log(this.itemCategoryType, 'iyem-data--')

        // add Referals
        this.referals = []
        this.referalsPlaceHolder = { placeholder: 'Select  Referals' }
        let newRefdata = []
        this.referals = [{ id: UIConstant.BLANK, text: 'Select Referals' }]
        if (data.Data && data.Data.Referals.length > 0) {
          data.Data.Referals.forEach(element => {
            newRefdata.push({
              id: element.Id,
              text: element.Name

            })

          })
        }
        this.referals = newRefdata
        // add Referals  type
        this.referalsType = []
        this.referalsTypePlaceHolder = { placeholder: 'Select  Type' }
        this.referalsType = [{ id: UIConstant.BLANK, text: 'Select Type' }]
        let newRefTypeData = []
        if (data.Data && data.Data.ReferalTypes.length > 0) {
          data.Data.ReferalTypes.forEach(element => {
            newRefTypeData.push({
              id: element.Id,
              text: element.CommonDesc
            })

          })
        }
        this.referalsType = newRefTypeData

        if (data.Data && data.Data.ClientAddresses.length > 0) {
          this.officeAddressId = data.Data.ClientAddresses[0].StateId
        }
        if (data.Data && data.Data.ItemCategorys.length > 0) {
          this.getCatagoryDetail(data.Data.ItemCategorys)
        }
        if(data.Data){
          this.additionChargeLedger = []
          let newAdditionCharge =[]
          this.ledgerChargePlaceHolder = { placeholder: 'Select  Charge' }
           newAdditionCharge = [{ id: UIConstant.BLANK, text: 'Select Charge' },{id:'-1',text:UIConstant.ADD_NEW_OPTION}]

           if(data.Data && data.Data.LedgerCharges.length > 0){
            data.Data.LedgerCharges.forEach(element => {
              newAdditionCharge.push({
                id: element.Id,
                text: element.Name
              })

            })
           }
           this.additionChargeLedger = newAdditionCharge


        }

      }
    })
  }
  additionChargeLedger: any
  get add () { return this.customerForm.controls }
  setCurrencyId: any
  officeAddressId: any
@ViewChild('charge_select2') chargeSelect2 : Select2Component
  onChangeCharge (event){
    if(event.data[0].selected){
    if (event.value === '-1') {
     this.chargeSelect2.selector.nativeElement.value = ''
      this._commonService.openledgerCretion('', FormConstants.SaleForm)
    } else {
      if (event.value > 0) {
         this.additionChargeId = +event.value
         this.additionaChargeName = event.data[0].text
  
      }
     }
     this.validationCharge()
    this.calculate()
  }
  }
  
alreadySelectCharge (chargeId,name,enableflag) {
  this.additionChargeLedger.forEach(data=>{
    let index = this.additionChargeLedger.findIndex(
      selectedItem =>selectedItem.id  === chargeId)
     if(index !== -1){
      this.additionChargeLedger.splice(index,1)
      let newData = Object.assign([], this.additionChargeLedger)
      newData.push({ id: chargeId, text:name ,disabled: enableflag})
      this.additionChargeLedger = newData
     }

  })

}

  onSelectCurrency (event) {
    if (event.data.length > 0) {
      if (event.data && event.data[0].text) {
        this.CurrencyId = event.value
        this.defaultCurrency = event.data[0].text
        this.currencyValues[1] = { id: 1, symbol: event.data[0].text }

      }
    }

  }
  godownName: any
  onChangeGodown (event) {
    if (event.data.length > 0) {
      this.godownId = event.value
      this.godownName = event.data[0].text

    }
  }
  referalsID: any
  onChangeReferals (event) {
    if (event.data.length > 0) {
      if (event.data[0].id !== UIConstant.BLANK) {
        if (event.data[0].text) {
          this.referalsID = event.value
        }
      }
    }
  }
  TaxTypeId: any
  TaxTypeName: any
  onChangeTaxTypeExclusiveInclusive (event) {
    
    if (event.data.length > 0) {
      if (event.data[0].id !== UIConstant.BLANK) {
        if (event.data[0].text) {
          this.TaxTypeId = event.value
          this.TaxTypeName = event.data[0].text
            this.calculate()
        }
      }
    }
  }
  taxTypeChargeId: any
  TaxTypeChargeName: any
  onChangeTaxTypeCharge (event) {
    if (event.data.length > 0) {
      if (event.data[0].id !== UIConstant.BLANK) {
        if (event.data[0].text) {
          this.taxTypeChargeId = event.value
          this.TaxTypeChargeName = event.data[0].text
         this.calculate()
        }
      }
    }
  }
  referalsTypeID: any
  onChangeReferalsType (event) {
    if (event.data.length > 0) {
      if (event.data[0].id !== UIConstant.BLANK) {
        if (event.data[0].text) {
          this.referalsTypeID = event.value
        }
      }
    }
  }
  allItemsData: any
  Commission: any
  CommissionTypeID: any
  onChangeCommissionType (event) {
    if (event.data.length > 0) {
      if (event.data[0].id !== '0') {
        if (event.data[0].text) {
          this.CommissionTypeID = event.value
        }
      } else {
        this.CommissionTypeID = '0'
      }
    }
  }

  attributeColorId: any
  attributeSizeId: any
  attributeArticleId: any
  attributeColorName: any
  attributeSizeName: any
  attributeArticleName: any
  attributeIndex: any
  attributeName: any
  attributeId: any
  existId: any
  validAttribute: any
  AttrValueId: any
  onChangeAttribute (event, indexAttribute, attributeData) {

    let editAttributValue
    let attributeEdit = this.editAttributeData
    let editAttrId = 0
    if (event.data.length > 0) {
      if (event.data[0].id !== '-1') {
        if (event.data[0].text) {
          this.AttrValueId = event.data[0].id
          this.existId = event.data[0].attributeId
          if (attributeEdit !== undefined) {

            editAttributValue = this.editAttributeData.filter(value => value.AttributeValueId === this.existId)
            if (editAttributValue.length > 0) {
              let index = this.sendAttributeData.findIndex(n => n.Id === editAttributValue[0].Id)

              editAttrId = editAttributValue[0].Id
              this.trsnItemId = editAttributValue[0].ItemTransId
              this.sendAttributeData.splice(index, 1)
            }

          }
          if( this.editItemId >0 &&this.editAttributeData.length ===0){
            this.trsnItemId = this.editItemId
          }
          if(this.editItemId ===0 && this.items.length >0){
            this.trsnItemId = this.items[this.items.length - 1].Sno + 1

          }
          this.attributeName = event.data[0].text
          this.attributeIndex = indexAttribute
          this.itemAttribute(this.existId, this.attributeIndex, editAttrId)
        }
      } else {
        let data = {
          addNewId: event.data[0].attributeId,
          attrNameId: event.data[0].attributeId,
          attrValue: event.data[0].attributeId,
          disabledAddButton: true

        }
        this.atrColorSelect2.forEach((item: Select2Component, index: number, array: Select2Component[]) => {
          item.selector.nativeElement.value = ''
          this._commonService.openAttribute(data, true)
        })
       // this.atrColorSelect2.selector.nativeElement.value = ''

      }
    }
  }
  itemsAttribute: any
  itemAttribute (existid, attrIndex, AttrEditId) {
    if (this.itemsAttribute.length > 0) {
      let data = this.itemsAttribute.filter(s => s.existId === existid)
      let index = this.itemsAttribute.findIndex(n => n.existId === existid)
      if (data.length > 0) {
        let newArray = {
          Id: AttrEditId,
          Index: attrIndex,
          ItemId: this.itemCategoryId,
          ItemTransId: this.trsnItemId,
          AttributeName: this.attributeName,
          existId: existid,
          AttributeValueId: existid,
          AttributeId: this.AttrValueId,
          ParentTypeId: this.ATTRIBUTE_PARENTTYPEID
        }
        this.itemsAttribute.splice(index, 1, newArray)
      } else {
        this.itemsAttribute.push({
          Id: AttrEditId,
          Index: attrIndex,
          ItemId: this.itemCategoryId,
          ItemTransId: this.trsnItemId,
          AttributeName: this.attributeName,
          existId: existid,
          AttributeValueId: existid,
          AttributeId: this.AttrValueId,
          ParentTypeId: this.ATTRIBUTE_PARENTTYPEID
        })
      }
    } else {
      this.itemsAttribute.push({
        Id: AttrEditId,
        Index: attrIndex,
        ItemId: this.itemCategoryId,
        ItemTransId: this.trsnItemId,
        AttributeName: this.attributeName,
        existId: existid,
        AttributeValueId: existid,
        AttributeId: this.AttrValueId,
        ParentTypeId: this.ATTRIBUTE_PARENTTYPEID

      })
    }
    console.log(this.itemsAttribute, 'attribute')
  }

  freightByData: any
  freightByValue: any
  freightById: any
  getFreightValueData () {
    this.freightByData = []
    this.frightPlaceholder = { placeholder: 'Select freight ' }
    this.freightByData = [{ id: '0', text: 'Paid' }, { id: '1', text: 'To-pay' }]
    this.freightById = this.freightByData[0].id
    this.freightByValue = this.freightByData[0].id
  }

  getCommisionTypeValue () {
    this.CommissionType = []
    this.CommissionTypePlcaholder = { placeholder: 'Select Commission ' }
    this.CommissionType = [{ id: '0', text: 'Select Commission' }, { id: '1', text: '%' }, { id: '2', text: '$' }]
    this.CommissionTypeID = this.CommissionType[1].id
  }
  onChangeFreight (event) {
    if (event.data.length > 0) {
      if (event.data[0].text) {
        this.freightById = event.value
      }

    }
  }
  UnitName: any
  onSelectUnitId (event) {
    if (event.data.length > 0) {
      if (event.data[0].id !== UIConstant.BLANK) {
        if (event.value === '-1' && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
          this.unitSelect2.selector.nativeElement.value = ''
          this._commonService.openUnit('')
          this.unitDataType.selector.nativeElement.value = ''
        } else {
          if (event.data[0] && event.data[0].text) {
            this.unitId = event.value
            this.UnitName = event.data[0].text
            this.validationForItemData()
          }
        }
      }
    }
  }
  taxSlabName: any
  taxTypeId: any
  taxChargeId: any
  taxChargeName: any
  onChangeTaxCharge (event ){
    if (event.data.length > 0) {
      if (event.data[0].id !== '') {
        if (event.value === '-1' && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
          this.taxChargeSelect2.selector.nativeElement.value = ''
          this._commonService.openTax('')
        } else {
          if (event.data[0] && event.data[0].text) {
            this.taxChargeId = event.value
            this.taxChargeName = event.data[0].text
            this.onChangeSlabTax('charge',this.taxChargeId,this.taxChargeName)
          }
        }
      }
    }
  }
  onChangeTaxSlabType (event) {
    if (event.data.length > 0) {
      if (event.data[0].id !== '') {
        if (event.value === '-1' && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
          this.taxSelect2.selector.nativeElement.value = ''
          this._commonService.openTax('')
        } else {
          if (event.data[0] && event.data[0].text) {
            this.taxSlabId = event.value
            this.taxSlabName = event.data[0].text
            this.onChangeSlabTax('item',this.taxSlabId,this.taxSlabName)
          }
        }
      }
    }
  }
  taxRate: any
  allTaxRateForItem: any
  allTaxRateForCharge: any

  alltaxVATTax: any
  onChangeSlabTax (type,slabId,SalbName) {

    if (slabId > 0 && slabId !== '' && slabId !== undefined && slabId !== null) {
      this.subscribe = this._commonService.onChangeSlabGetTaxRate(slabId).subscribe(data => {
        if (data.Code === UIConstant.THOUSAND) {
        if (data.Data && data.Data.TaxSlabs.length > 0) {
         if(type==='item'){
          this.allTaxRateForItem = []
          if (data.Data.TaxSlabs[0].Type !== UIConstant.ONE) {
            if (data.Data && data.Data.TaxRates.length > 0) {
              data.Data.TaxRates.forEach(ele => {
                this.allTaxRateForItem.push({
                  id: ele.Id,
                  TaxRate: ele.TaxRate,
                  TaxType: ele.ValueType,
                  taxSlabName:ele.Name,
                  taxSlabId:ele.SlabId,
                  TaxName:SalbName

                })
              })
            }
          } else {
            if (data.Data && data.Data.TaxRates.length > 0) {
              
              data.Data.TaxRates.forEach(ele => {
                if (this.taxRateForOtherStateFlag === ele.IsForOtherState) {
                  this.allTaxRateForItem.push({
                    id: ele.Id,
                    TaxRate: ele.TaxRate,
                    TaxType: ele.ValueType,
                    taxSlabName:ele.Name,
                    taxSlabId:ele.SlabId,
                    TaxName:SalbName
                  })
                }

              })

            }
          }
         }
         else{
          this.allTaxRateForCharge =[]
          if (data.Data.TaxSlabs[0].Type !== UIConstant.ONE) {
            if (data.Data && data.Data.TaxRates.length > 0) {
              data.Data.TaxRates.forEach(ele => {
                this.allTaxRateForCharge.push({
                  id: ele.Id,
                  TaxRate: ele.TaxRate,
                  TaxType: ele.ValueType,
                  taxSlabName:ele.Name,
                  taxSlabId:ele.SlabId,
                  TaxName:SalbName

                })
              })
            }
          } else {
            if (data.Data && data.Data.TaxRates.length > 0) {
              
              data.Data.TaxRates.forEach(ele => {
                if (this.taxRateForOtherStateFlag === ele.IsForOtherState) {
                  this.allTaxRateForCharge.push({
                    id: ele.Id,
                    TaxRate: ele.TaxRate,
                    TaxType: ele.ValueType,
                    taxSlabName:ele.Name,
                    taxSlabId:ele.SlabId,
                    TaxName:SalbName
                  })
                }

              })

            }
          }
         }
            this.calculate()
          }
        }
        if (data.Code === UIConstant.SERVERERROR) {
          this.toastrService.showError('',data.Description)
        }
      })
    }

  }
  clientNameId: any
  @ViewChild('client_select2') clientSelect2: Select2Component
  @ViewChild('unit_select2') unitSelect2: Select2Component
  @ViewChild('tax_select2') taxSelect2: Select2Component
  isCaseSaleFlag: boolean
  onSelected2clientId (event) {
    if (event.data.length > 0) {
      this.stateList = []
      if (event.data && event.data[0].id !== '') {
        if (event.value === '-1' && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
          this.clientSelect2.selector.nativeElement.value = ''
          this._commonService.openCust('',true)
        } else {
          this.clientNameId = event.value
          this.itemTableDisabledFlag = false
          let parentTypeId = 5
          let caseId = this.caseSaleArrayId.filter(s => s.id === JSON.parse(this.clientNameId))
          if (caseId.length > 0 && caseId[0].id > 0) {
            this.isCaseSaleFlag = false
            this.stateId = 0
            this.ledgerStateId = 0
            this.taxRateForOtherStateFlag= this.caseSaleCheckOtherState(this.stateId)
            this.onChangeSlabTax('item',this.taxSlabId,'')
            this.calculate()
          } else {
            this.isCaseSaleFlag = true
            this.getAddressOfCustomerByID(this.clientNameId, parentTypeId)
          }
        }
      }
    }
  }
  stateAddressId: any
  stateValue: any
  stateId: any
  stateError: boolean
  addressStateId: any
  stateListShip: any

getBillingAddressList(data){
  data.Data.forEach(element => {
    this.stateList.push({
      id: element.Id,
      stateId: element.StateId,
      text: ((element.AddressTypeName ? (element.AddressTypeName + '-') : '') + (element.AddressValue ? (element.AddressValue + ' , ') : '') + (element.AreaName ? element.AreaName + ' , ' : '') + element.CityName + ' , ' + element.StateName + ' , ' + element.CountryName)
    })
  })
  this.checkValidation()
  this.stateValue = this.stateList[2].id
  this.stateBillingSelect2Id.setElementValue(this.stateValue)
  
  return this.stateValue
}

getShippingAddressList(data){
  data.Data.forEach(element => {
    this.stateListShip.push({
      id: element.Id,
      stateId: element.StateId,
      text: ((element.AddressTypeName ? (element.AddressTypeName + '-') : '') + (element.AddressValue ? (element.AddressValue + ' , ') : '') + (element.AreaName ? element.AreaName + ' , ' : '') + element.CityName + ' , ' + element.StateName + ' , ' + element.CountryName)
    })
  })
  this.checkValidation()
  this.stateShippingValue = this.stateListShip[2].id
  this.stateShippingSelect2Id.setElementValue(this.stateShippingValue)
  
  return this.stateShippingValue
}
stateShippingValue: any
  getAddressOfCustomerByID (customerId, parentTypeId) {

    this.subscribe = this._commonService.getAddressByIdOfCustomer(customerId, parentTypeId).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND) {
        this.stateListShip =[]
        this.stateListplaceHolder = { placeholder: 'Select Address' }
        this.stateListShip = [{ id: '0', text: 'Select Address' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
        this.stateListplaceHolder = { placeholder: 'Select Address' }
        this.stateList = [{ id: '0', text: 'Select Address' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
        if (data.Data && data.Data.length > 0) {
             this.getBillingAddressList(data)
             this.getShippingAddressList(data)
        } else {
          this.stateId = ''
          this.checkValidation()
        }

      }
    })
  }
  updatedFlag: any
  newdataCatItem: any
  getItemByCategoryid (categoryId) {
    categoryId = JSON.stringify(categoryId)
    this.updatedFlag = false
    this.itemCategoryType = []
    let newdataitem = [{ id: UIConstant.BLANK, text: 'Select  Item', categoryId: '' }, { id: '-1', text: '+Add New', categoryId: '' }]
    this.subscribe = this._commonService.getItemByCategoryId(categoryId).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND && data.Data.length > 0) {
        this.updatedFlag = true
        console.log(data, 'hhhhhhhhhh-')
        data.Data.forEach(element => {

          if (element.CategoryId === JSON.parse(categoryId)) {
            newdataitem.push({
              id: element.Id,
              text: element.Name,
              categoryId: element.CategoryId
            })
          }
        })
      }
      this.itemCategoryType = newdataitem
    })
  }
  categoryName: any
  itemCategoryId: any
  ItemName: any
  itemAddRequiredFlag: boolean
  disabledTaxFlag: any
  onSelectItemCategory (event) {
    
    if (event.data.length > 0) {
      if (event.data[0].id !== '') {
        if (event.value === '-1' && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
          this.itemSelect2.selector.nativeElement.value = ''
          this._commonService.openItemMaster('', this.categoryId)
        } else {
          this.itemCategoryId = event.value
          this.ItemName = event.data[0].text

          this.categoryId = event.data[0].categoryId
          if (event.data[0].selected) {
              if(this.withoursaveEditFlag){
                this.getItemRateByLedgerData(this.itemCategoryId, this.clientNameId)
               
              }  
              this.withoursaveEditFlag = true
          }
          this.updateCategories(this.categoryId)
          this.validationForItemData()
        }

      }
    }
  }
  AddressForGst: any
  disabledAddressFlag: boolean = false
  selectStatelist (event) {
    if (event.data.length > 0) {
      if (event.data[0].id !== '0') {
        if (event.value === '-1' && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
          this.stateBillingSelect2Id.selector.nativeElement.value = ''
          this._commonService.openAddress(this.clientNameId)

        } else {
          this.disabledAddressFlag = false
          this.ledgerStateId = event.data[0].stateId
          if( this.ledgerStateId >0){
            
            this.AddressForGst = this.ledgerStateId 
            this.checkOtherStateForNewItemAdd(this.ledgerStateId)
          }

          this.onChangeSlabTax('item',this.taxSlabId,'')
          this.calculate()
          this.stateId = event.value
          this.stateError = false
          this.checkValidation()

        }

      }

    }

  }

  selectShippingStatelist (event) {
    if (event.data.length > 0) {
      if (event.data[0].id !== '') {
        if (event.value === '-1' && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
          this.stateShippingSelect2Id.selector.nativeElement.value = ''
          this._commonService.openAddress(this.clientNameId)

        } else {
          this.disabledAddressFlag = false
          this.SupplyStateId = event.data[0].stateId
          this.checkValidation()
        }

      }

    }

  }
  categoryTypeData: any
  autoCategory: any

  setupOrganization: any
  organizationData: any
  getCurrency () {
    let _self = this
// tslint:disable-next-line: no-floating-promises
    this.getAvailableCurrency().toPromise().then(
      (data: ResponseSale) => {
        if (data.Code === UIConstant.THOUSAND && data.Data.SetupModules.length > 0) {
          _self.setupModules = data.Data.SetupModules[0]
          _self.setBillDate()
          _self.setPayDate()
          this.setExpiryDate()
          this.setMFDate()
          _self.setDueDate()
          let currencies = data.Data.SetupSettings
          _self.currenciesSelect2 = []
          _self.currencyPlaceholder = { placeholder: 'Select Currency' }
          let newData = [{ id: UIConstant.BLANK, text: 'Select Currency' }]
          currencies.forEach(element => {
            if (+element.SetupId === 37 && +element.Type === 3) {
              if (+element.Id !== 0 && +element.Id === +element.defaultvalue) {
                _self.defaultCurrency = element.Val
                _self.currencyValues[1] = { id: '1', symbol: _self.defaultCurrency }
              }
              newData.push({
                id: element.Id,
                text: element.Val
              })
            }
          })
           this.currencyValues.push({ id: 1, symbol: this.defaultCurrency })
          _self.currenciesSelect2 = newData
          _self.isDataAvailable = true
        }
      }
    )
  }

  changeDateBill: string
  changeBillDate (eDate) {
    this.changeDateBill = eDate

    let _self = this
    let dateChnage = this._globalService.clientToSqlDateFormat(eDate, this.clientDateFormat)
    this.subscribe = this._commonService.getsettingforOrgnizationData(this.orgNameId, UIConstant.SALE_TYPE, dateChnage).subscribe(data => {
      if (data.Code === 1000 && data.Data.length > 0) {
        this.BillNo = data.Data[0].BillNo
        if (this.isManualBillNoEntry) {
          this.BillNo = ''
          this.updateLastBillNo(this.InvoiceDate, this.orgNameId)
        } else {
          this.lastBillNo = data.Data[0].BillNo
        }
      }

    })
  }

  orgNameId: any
  OrgId: any
  onChangeOrganizationId (e) {
    if (e.data.length > 0) {
      let dateChnage = this._globalService.clientToSqlDateFormat(this.InvoiceDate, this.clientDateFormat)
      if (e.data[0].id !== '') {
        this.orgNameId = e.value
        this.checkValidation()
        this.subscribe = this._commonService.getsettingforOrgnizationData(this.orgNameId, UIConstant.SALE_TYPE, dateChnage).subscribe(data => {
          if (data.Code === 1000 && data.Data.length > 0) {
            this.BillNo = data.Data[0].BillNo
            this.OrgId = data.Data[0].Id
            if (this.isManualBillNoEntry) {
              this.BillNo = ''
              this.updateLastBillNo(this.InvoiceDate, this.orgNameId)
            } else {
              this.lastBillNo = data.Data[0].BillNo
            }
          }

        })
      } else {
        this.orgNameId = 0

      }
    }

  }

  Remark: any
  showItemAttributeArray: any
  newShowlocalarray: any
  labeldata: any
  localLabelData: any

  localAddAttribute (itemTrasnId) {
    if(this.itemsAttribute.length > 0){
      for (let i = 0; i < this.itemsAttribute.length; i++) {
        this.sendAttributeData.push({
          AttributeId: this.itemsAttribute[i].AttributeId,
          AttributeName: this.itemsAttribute[i].AttributeName,
          Index: this.itemsAttribute[i].Index,
          Id: this.itemsAttribute[i].Id,
          ItemId: this.itemsAttribute[i].ItemId,
          AttributeValueId: this.itemsAttribute[i].AttributeValueId,
          ItemTransId: this.itemsAttribute[i].ItemTransId,
          existId: this.itemsAttribute[i].existId,
          ParentTypeId: this.itemsAttribute[i].ParentTypeId
        })
      }
    }

 

  }
  localItemas: any
  showAttributeData: any

  localItems () {

    let value = []
    this.items.forEach(element => {
      this.localLabelData = []
      if (element.Id === 0 && (element.Sno === this.snoIndex)) {
        if (this.sendAttributeData.length > 0) {
          this.attributesLabels.forEach(label => {
            this.labeldata = this.sendAttributeData.filter(v => v.existId === label.AttributeId)
            value = []
            if (this.labeldata.length > 0) {
              value = this.labeldata.filter(v => v.ItemTransId === element.Sno)

            }
            this.localLabelData.push({
              AttributeId: label.AttributeId,
              Label: label.Name,
              AttributeValue: value

            })
          })
       }
       else{
        this.attributesLabels.forEach(label => {
          this.localLabelData.push({
            AttributeId: 0,
            Label: '',
            AttributeValue: '0'

          })
        })
       }

        this.localItemas.push({
          Id: element.Id,
          Sno: element.Sno,
          TransType: element.TransType,
          TransId: element.TransId,
          // ChallanId: element.ChallanId,
          Length: element.Length,
          Height: element.Height,
          Width: element.Width,
          MrpRate: element.MrpRate,
          PurchaseRate: element.PurchaseRate,
          ExpiryDate: element.ExpiryDate,
          MfDate: element.MfDate,
          BatchNo: element.BatchNo,
          CategoryId: element.CategoryId,
          CategoryName: element.CategoryName,
          ItemName: element.ItemName,
          UnitName: element.UnitName,
          UnitId: element.UnitId,
          ItemId: element.ItemId,
          Remark: element.Remark,
          Quantity: +element.Quantity,
          Rate: +element.SaleRate,
          TotalAmount: +element.TotalAmount,
          DiscountAmt: +element.DiscountAmt,
          Discount: element.Discount,
          DiscountType: element.DiscountType,
          TaxSlabId: element.TaxSlabId,
          TaxAmount: +element.TaxAmount,
          TaxSlabName: element.TaxSlabName,
          TaxType: element.TaxType,
          TaxTypeName: element.TaxTypeName,
          IsForOtherState: element.IsForOtherState,
          baserate:element.baserate,
        //  SubTotal: element.SubTotal,
          LableAttributeVale: this.localLabelData

        })
      } else if (this.editItemId > 0 && element.rowEditFlagValue && (element.Sno === this.snoIndex)) {
        if (this.sendAttributeData.length > 0) {
          this.attributesLabels.forEach(label => {
            this.labeldata = this.sendAttributeData.filter(s => (s.AttributeValueId === label.AttributeId) && (s.ItemTransId === element.Id))
            value = []
            if (this.labeldata.length > 0) {
              value = this.labeldata.filter(v => v.ItemTransId === element.Id)

            }
            this.localLabelData.push({
              AttributeId: label.AttributeId,
              Label: label.Name,
              AttributeValue: value

            })
          })
        }

        this.localItemas.push({
          Id: element.Id,
          Sno: element.Sno,
          TransType: element.TransType,
          TransId: element.TransId,
          Length: element.Length,
          Height: element.Height,
          Width: element.Width,
          MrpRate: element.MrpRate,
          PurchaseRate: element.PurchaseRate,
          ExpiryDate: element.ExpiryDate,
          MfDate: element.MfDate,
          BatchNo: element.BatchNo,
          CategoryId: element.CategoryId,
          CategoryName: element.CategoryName,
          ItemName: element.ItemName,
          UnitName: element.UnitName,
          UnitId: element.UnitId,
          ItemId: element.ItemId,
          Remark: element.Remark,
          Quantity: +element.Quantity,
          Rate: +element.SaleRate,
          DiscountAmt: +element.DiscountAmt,
          Discount: element.Discount,
          DiscountType: element.DiscountType,
          TaxSlabId: element.TaxSlabId,
          TaxSlabName: element.TaxSlabName,
          TaxType: element.TaxType,
          TaxTypeName: element.TaxTypeName,
          TaxAmount: +element.TaxAmount,
          TotalAmount: +element.TotalAmount,
          IsForOtherState: element.IsForOtherState,
          LableAttributeVale: this.localLabelData,
          baserate:element.baserate

        })
      }
    })
    this.editItemId = 0
    this.ChallanId = 0
    this.editAttributeData = undefined
    this.disabledAddressFlag = true
    console.log(this.localItemas, this.showAttributeData, this.localLabelData, 'localitem-final----')
  }

  isCheckLedgerOfficeFlag: any
  addItems () {
    this.itemSubmit = true
    this.deleteEditflag = true
    if (this.editAlreadyItemDataFlag) {

      this.localItemas = []
    } else {
      this.itemSubmit = true
    }

    if (this.validationForItemData()) {
      if (this.categoryId > 0 && this.itemCategoryId > 0 && this.Quantity > 0 && this.Rate >0 && this.unitId >0) {
        this.addItem()
        this.clickItem = true
        this.totalQty()
        this.calculateAllTotal()
        this.calculateTotalOfRow()
        this.calTotalBillAmount()
        this.clickItem = true
        this.initialiseItem()
      }

    }

  }
  lastItemFlag: boolean
  trsnItemId: any
  snoIndex: any
  TaxAmount: any
  DiscountType: any
  ExpiryDate: any
  MfDate: any
  ExpiryDateChngae: any
  MFDateChngae: any
  addItem () {
    let sendForBillingSumItem =[] ;
    let taxItem ;
    
    if ( typeof this.ExpiryDate !== null || this.ExpiryDate !=='') {
      this.ExpiryDateChngae = ''
    } else {
     this.ExpiryDateChngae = this._globalService.clientToSqlDateFormat(this.ExpiryDate, this.clientDateFormat)
      
    }
    if (  typeof this.MfDate !== null ||  this.MfDate !== '' ) {
      this.MFDateChngae = ''

    } else {
      this.MFDateChngae = this._globalService.clientToSqlDateFormat(this.MfDate, this.clientDateFormat)

    }
    if (this.items.length === 0) {
      this.snoIndex = 2
       taxItem  = this.taxCalculationForItem(this.snoIndex)

    } else {
      this.snoIndex = +this.items[this.items.length - 1].Sno + 1
       taxItem  = this.taxCalculationForItem(this.snoIndex)

    }
    this.items.push({
      type:'items',
      Id: this.editItemId !== 0 ? this.editItemId : 0,
      Sno: this.snoIndex,
      TransType: 0,
      TransId: 0,
      Length: this.Length,
      Height: this.Height,
      Width: this.Width,
      MrpRate: this.MrpRate,
      PurchaseRate: this.PurchaseRate,
      ExpiryDate: this.ExpiryDateChngae,
      MfDate: this.MFDateChngae,
      BatchNo: this.BatchNo,
      CategoryId: this.categoryId,
      CategoryName: this.categoryName,
      ItemName: this.ItemName,
      UnitName: this.UnitName,
      UnitId: this.unitId,
      ItemId: this.itemCategoryId,
      Remark: this.Remark,
      Quantity: +this.Quantity,
      SaleRate: this.Rate,
      DiscountAmt: this.DiscountAmt,
      Discount: +this.Discount,
      DiscountType: this.DiscountType,
      TaxSlabId: this.taxSlabId,
      TaxSlabName: this.taxSlabName,
      TaxType: this.TaxTypeId,
      TaxTypeName: this.TaxTypeName,
      TaxAmount: +this.TaxAmount,
      TotalAmount: +this.TotalAmount,
      baserate:+this.getBaseRateForItem,
      rowEditFlagValue: true,
      IsForOtherState: this.taxRateForOtherStateFlag

    })
  sendForBillingSumItem.push({
      type:'items',
      Id: this.editItemId !== 0 ? this.editItemId : 0,
      Sno: this.snoIndex,
      TaxType: this.TaxTypeId,
      rowEditFlagValue: true,
      taxItems:  taxItem

    })
    setTimeout(() => {
      this._commonService.fixTableHFL('item-table')
    }, 1)
    console.log(this.items, 'recentaly-added items')
    this.trsnItemId = this.items[this.items.length - 1].Sno + 1
    this.localAddAttribute(this.trsnItemId)
    this.localItems()
    this.getBillingSummery(sendForBillingSumItem)

  }

  rowIndex: any
  AttrId: any

  BatchNo: any

  initialiseItem () {
    debugger
    this.Remark = ''
    this.Rate = ''
    this.Discount = ''
    this.Quantity = 1
    this.TotalAmount = 0
    this.clickItem = false
    this.TaxAmount = 0
    this.DiscountAmt = 0
    this.DiscountPerItem = 0
    this.allTaxRateForItem = []
    this.allTaxRateForCharge=[]
    this.discountAmount = 0
    this.Width = 1
    this.Length = 1
    this.Height = 1
    this.BatchNo = ''
    this.ExpiryDate = ''
    this.MfDate = ''
    this.itemCategoryId = 0
    this.attrinuteSetDataId = 0
    this.unitId = 0
    this.taxSlabId = 0
    if (this.allCategories && this.allCategories.length > 0) {
      this.getCatagoryDetail(this.allCategories)
    }

    if (this.atrColorSelect2 && this.atrColorSelect2.length > 0) {
      if (this.atrColorSelect2.length > 0) {
            this.atrColorSelect2.forEach((item: Select2Component, index: number, array: Select2Component[]) => {
             
           })
      }
    //  this.getSetAttributeSPUTility(this.getAttributeSPUtilityData)
    }
  }
  // tslint:disable-next-line:variable-name
  @ViewChild('referal_type') referal_typeSelect2: Select2Component
  // tslint:disable-next-line:variable-name
  @ViewChild('referal_id') referal_idSelect2: Select2Component
  @ViewChild('orgnization_select2') orgnizationSelect2: Select2Component
  @ViewChild('godown_select2') godownSelect2: Select2Component
  @ViewChild('state_Billing_Select2Id') stateBillingSelect2Id: Select2Component
  @ViewChild('state_shiping_Select2Id') stateShippingSelect2Id: Select2Component
  @ViewChild('currency_select2') currencySelect2: Select2Component
  @ViewChild('parcelby_select2') parcelbySelect2: Select2Component
  @ViewChild('dest_select2') destSelect2: Select2Component
  @ViewChild('freight_By') freightBySelect2: Select2Component

  currencyValues: any
  subTotalBillAmount: any
  initialiseParams () {
    this.items = []
    this.TaxAmount = 0
    this.Width = 1
    this.Length = 1
    this.BatchNo = ''
    this.Height = 1
    this.RoundOffManual = 0
   // this.RoundOff = 0
    this.totalRate = 0
    this.totalDiscount = 0
    this.totalTaxAmount = 0
    this.DiscountPerItem = 0
    this.localItemas = []
    this.sendAttributeData = []
    this.showAttributeData = []
    this.taxSlabSummery=[]
    this.showtaxSlab=[]
    this.submitSave = false
    this.itemSubmit = false
    this.clickItem = false
    this.clickTrans = false
    this.clickSaleAdditionCharge= false
    this.isValidAmount = true
    this.deleteEditflag = true
    this.deleteEditPaymentFlag = true
    this.deleteEditChargeFlag = true
    this.DiscountAmt = 0
    this.InvoiceDate = ''
    this.DueDate = ''
    this.SupplyDate = ''
    this.CurrencyId = ''
    this.categoryId = ''
    this.itemCategoryId = ''
    this.Commission = 0
    this.BillAmount = 0
    this.currency = ''
    this.VehicleNo = ''
    this.Drivername = ''
    this.Transportation = ''
    this.LocationTo = ''
    this.TotalFreight = 0
    this.TotalQuantity = 0
    this.EwayBillNo = '0'
    this.ParcelBy = ''
    this.OtherCharge = 0
    this.Customduty = 0
    this.Destination = ''
    this.OnlineOrder = 0
    this.TotalBox = 0
    this.BoxCharge = 0
    this.TotalWeight = 0
    this.TotalKg = 0
    this.Rate = ''
    this.netBillAmount = 0
    this.subTotalBillAmount = 0
    this.ExpiryDate = ''
    this.MfDate = ''
    this.AdditionalChargeData =[]

    this.currencyValues = [{ id: 0, symbol: '%' }]

    if (this.clientSelect2 && this.clientSelect2.selector.nativeElement.value) {
      this.clientSelect2.setElementValue('')
    }
    // if (this.catSelect2 && this.catSelect2.selector.nativeElement.value) {
    //   this.catSelect2.setElementValue('')
    // }
    if (this.itemSelect2 && this.itemSelect2.selector.nativeElement.value) {
      this.itemSelect2.setElementValue('')
    }
    if (this.unitSelect2 && this.unitSelect2.selector.nativeElement.value) {
      this.unitSelect2.setElementValue('')
    }
    if (this.freightBySelect2 && this.freightBySelect2.selector.nativeElement.value) {
      this.freightBySelect2.setElementValue('')
    } if (this.referal_typeSelect2 && this.referal_typeSelect2.selector.nativeElement.value) {
      this.referal_typeSelect2.setElementValue('')
    } if (this.referal_idSelect2 && this.referal_idSelect2.selector.nativeElement.value) {
      this.referal_idSelect2.setElementValue('')
    }

    if (this.stateBillingSelect2Id && this.stateBillingSelect2Id.selector.nativeElement.value) {
      this.stateBillingSelect2Id.setElementValue('')
    }
    if (this.godownSelect2 && this.godownSelect2.selector.nativeElement.value) {
      this.godownSelect2.setElementValue('')
    }

    if (this.stateShippingSelect2Id && this.stateShippingSelect2Id.selector.nativeElement.value) {
      this.stateShippingSelect2Id.setElementValue('')
    }
    if (this.orgnizationSelect2 && this.orgnizationSelect2.selector.nativeElement.value) {
      this.orgnizationSelect2.setElementValue('')
    }

  }
  // cat_select2
  // item_select2
  setDueDate () {
    let _self = this
    jQuery(function ($) {
      flatpickr('#due-date', {
        dateFormat: _self.clientDateFormat,
        defaultDate: [_self._globalService.getDefaultDate(_self.clientDateFormat)]

      })
    })
    this.DueDate = _self._globalService.getDefaultDate(_self.clientDateFormat)

  }

  setPayDate () {
    let _self = this
    if (this.backDateEntry) {
      jQuery(function ($) {
        flatpickr('#pay-date', {
          dateFormat: _self.clientDateFormat,
          defaultDate: [_self._globalService.getDefaultDate(_self.clientDateFormat)]

        })
      })
    } else {
      jQuery(function ($) {
        flatpickr('#pay-date', {
          minDate: 'today',
          dateFormat: _self.clientDateFormat,
          defaultDate: [_self._globalService.getDefaultDate(_self.clientDateFormat)]

        })
      })
    }
    this.PayDate = _self._globalService.getDefaultDate(_self.clientDateFormat)

  }
  setExpiryDate () {
    let _self = this

    jQuery(function ($) {
      flatpickr('#Expiry-date', {
        dateFormat: _self.clientDateFormat

      })
    })
  }
  setMFDate () {
    let _self = this
    jQuery(function ($) {
      flatpickr('#MF-date', {
        dateFormat: _self.clientDateFormat

      })
    })
  }

  setBillDate () {
    let _self = this
    if (this.backDateEntry) {
      jQuery(function ($) {
        flatpickr('#bill-date', {
          dateFormat: _self.clientDateFormat,
          defaultDate: [_self._globalService.getDefaultDate(_self.clientDateFormat)]

        })
      })
    } else {
      jQuery(function ($) {
        flatpickr('#bill-date', {
          minDate: 'today',
          dateFormat: _self.clientDateFormat,
          defaultDate: [_self._globalService.getDefaultDate(_self.clientDateFormat)]

        })
      })
    }
    this.InvoiceDate = _self._globalService.getDefaultDate(_self.clientDateFormat)

  }

  clearExtras () {
    this.setupModules = {}
    this.currenyValues = [{ id: '0', symbol: '%' }]
    this.clientNameId = ''
    this.clientNameSelect2 = []
    this.organizationData = []
   this.stateList =[]
   this.stateListShip =[]
   let newDataTaxType = [{ id: '0', text: 'Exclusive' }, { id: '1', text: 'Inclusive' }]
        this.taxTypeSelectData = newDataTaxType
    //this.taxTypeId =  this.taxTypeSelectData[0].id
  //  this.AdditionalChargeData =[]
    this.getSPUtilityDataBilling()
    this.RoundOff = 0
    this.RoundOffManual = 0
    this.inilizeAdditionCharge()
    
  }

  totalQty () {
    if (this.items.length === 0) {
      this.TotalQuantity = (isNaN(+this.Quantity)) ? 1 : +this.Quantity
    } else {
      let totalQty = 0
      for (let i = 0; i < this.items.length; i++) {
        totalQty = +totalQty + +this.items[i].Quantity
      }
      this.TotalQuantity = (isNaN(+totalQty)) ? 0 : +totalQty
    }
  }

  calculate () {

    if ('' + this.DiscountType === '0') {
      if (this.Discount && this.Rate) {
        this.discountAmount = (+this.Discount / 100) * (+this.Rate)
      } else {
        this.discountAmount = 0
      }
    } else {
      this.discountAmount = isNaN(+this.Discount) ? 0 : +this.Discount

    }
   this.TotalAmount = +this.calculateTotalOfRow()
    //console.log( this.TotalAmount, 'k--------------')
    this.calculationAdditionCharge()
    this.calculateForTotalAmount()
    this.calculateAllTotal()
    this.calTotalBillAmount()


  }

  calculationAdditionCharge (){
     
    this.TaxAmountCharge =0
    this.TotalAmountCharge =0
  let AmountCharge= 0
    let totalTaxChargeAmt =0
     AmountCharge = (isNaN(+this.AmountCharge)) ? 0 : +this.AmountCharge
   if(AmountCharge >0){
     if(this.taxTypeChargeId === '1'){
      if (this.allTaxRateForCharge.length > 0) {
        this.TaxAmountCharge =  this.taxCalculationForInclusive(this.allTaxRateForCharge, AmountCharge,0) 

       }
     }else{
      this.FinalAmount = AmountCharge
      this.TaxAmountCharge =  this.taxCalculationForExclusive(this.allTaxRateForCharge, AmountCharge) 

     }
    
 this.TotalAmountCharge = (((isNaN(+this.FinalAmount)) ? 0 : +this.FinalAmount ) + ((isNaN(+this.TaxAmountCharge)) ? 0 : +this.TaxAmountCharge)).toFixed(this.decimalDigit)
console.log(this.TotalAmountCharge,'charge')
  }
}
taxCalculationForExclusive(taxArray,rateItem){
 let returmTaxAmount =0
  let totalTaxAmt = 0
  if (taxArray.length > 0) {
         taxArray.forEach(ele => {
           if (ele.TaxType === 0) {
             let tax = (ele.TaxRate / 100) * rateItem
             totalTaxAmt = +totalTaxAmt + +tax
           } else {
             let taxr = isNaN(+ele.TaxRate) ? 0 : +ele.TaxRate
             totalTaxAmt = +totalTaxAmt + +taxr
           }
         }
         ) 
       }
       returmTaxAmount = +(totalTaxAmt).toFixed(this.decimalDigit)  
       return returmTaxAmount
}
FinalAmount: any
taxableValueInclusive: any
getBaseRateForItem: any
DiscountAmtForInclusiveAmt: any
totalRowTax: any
taxCalculationForInclusive(taxArray,rateofitem,DiscountAmt){
  
  this.totalRowTax=0
 let  TaxAmountCargeValue =0
  let baserate=0
  let sumOfAllRate =0
  let totalTaxAmt =0
  this.FinalAmount=0
  if (taxArray.length > 0) {
    taxArray.forEach(ele => {
           if (ele.TaxType === 0) {
             sumOfAllRate = +sumOfAllRate + +ele.TaxRate
           } else {
             let taxr = isNaN(+ele.TaxRate) ? 0 : +ele.TaxRate
             totalTaxAmt = +totalTaxAmt + +taxr
           }
          } )
          if(this.isInclusiveCaseBeforeDiscount ==='2'){
            DiscountAmt =0
            let value = (rateofitem/(100+sumOfAllRate)*100)  
            if (this.DiscountType === '0') {
              this.DiscountAmt = (+this.Discount / 100) * (+value)
            } else {
              this.DiscountAmt = (+this.Discount).toFixed(this.decimalDigit)
            }
            baserate = value - this.DiscountAmt
            this.FinalAmount = baserate
            totalTaxAmt = (sumOfAllRate/100) * baserate 
          

          }
         else if(this.isInclusiveCaseBeforeDiscount ==='1'){
          
            baserate =( ((rateofitem-DiscountAmt)/(100+sumOfAllRate))*100)  
            this.taxableValueInclusive = baserate
            this.FinalAmount =baserate
            totalTaxAmt = (sumOfAllRate/100) * baserate 
          

          }
         
         // console.log(baserate,rateofitem,totalTaxAmt,'baserate')
       }
       this.getBaseRateForItem =  baserate
       this.totalRowTax=+totalTaxAmt
       TaxAmountCargeValue = +(totalTaxAmt).toFixed(UIConstant.DECIMAL_FOUR_DIGIT)
       return TaxAmountCargeValue
}

  DiscountAmt: any
  disShowAmt: any = 0
  calculateTotalOfRow () {
    
    let Rate = (isNaN(+this.Rate)) ? 0 : +this.Rate
    let Quantity = (isNaN(+this.Quantity)) ? 1 : +this.Quantity
    let Discount = (isNaN(+this.discountAmount)) ? 0 : +this.discountAmount
    let Height = (this.Height === 0 || this.Height === null) ? 1 : +this.Height
    let Length = (this.Length === 0 || this.Length === null) ? 1 : +this.Length
    let Width = (this.Width === 0 || this.Width === null) ? 1 : +this.Width
    if (this.DiscountType === '0') {
      this.DiscountAmt = (Discount * Quantity * Length * Width * Height).toFixed(this.decimalDigit)
    } else {
      this.DiscountAmt = (Discount).toFixed(this.decimalDigit)
    }

     let rateOfItemData=0
    if(this.TaxTypeId === '1'){
      this.FinalAmount=0
      rateOfItemData = Rate * Quantity * Length * Width * Height
      if(this.allTaxRateForItem.length>0){
        this.TaxAmount =  this.taxCalculationForInclusive(this.allTaxRateForItem,rateOfItemData,+this.DiscountAmt) 
      }
    }
  else{
    this.FinalAmount=0
    this.FinalAmount = (Rate * Quantity * Length * Width * Height) - this.DiscountAmt
    if(this.allTaxRateForItem.length>0){
      this.TaxAmount =  this.taxCalculationForExclusive(this.allTaxRateForItem,this.FinalAmount) 

    }

  }


    let totalAmount = +(this.FinalAmount).toFixed(UIConstant.DECIMAL_FOUR_DIGIT) + +this.TaxAmount
    
    return isNaN(totalAmount) ? 0 : totalAmount

  }
  taxDetailsPerItem: any
  ExclusiveForTaxItem(TaxArray,totalrate,itemTrsnId){
    if (TaxArray.length > 0) {
      this.taxDetailsPerItem =[]
     // console.log(TaxArray ,'tax on item')
      TaxArray.forEach(ele => {
            let taxCal= 0
             if (ele.TaxType === 0) {
                taxCal = (ele.TaxRate / 100) * totalrate
             } else {
               taxCal = isNaN(+ele.TaxRate) ? 0 : +ele.TaxRate
             }
             this.taxDetailsPerItem.push({
               itemTransSno:itemTrsnId,
               TaxRate:ele.TaxRate,
               TaxType: ele.TaxType,
               id: ele.id,
               taxSlabId:ele.taxSlabId,
               TaxRateNameTax:ele.taxSlabName,
               AmountTax :taxCal ,
               TaxName:ele.TaxName
             })
           }
           )
         return this.taxDetailsPerItem
         }
  }
  InclusiveForTaxItem (TaxArray,dataTotalrate,itemTrsnId,DiscountAmt) {
   let sumOfAllRate =0
   let baserate=0
   let withoutTax=0
   let totalTaxAmt =0
    if (TaxArray.length > 0) {
   //   let length = TaxArray.length 
      this.taxDetailsPerItem =[]
      TaxArray.forEach(element => {
        let totalTaxAmt=0
        if (element.TaxType === 0) {
          sumOfAllRate = +sumOfAllRate + +element.TaxRate
          if(this.isInclusiveCaseBeforeDiscount ==='2'){
            DiscountAmt =0
            baserate = (dataTotalrate/(100+sumOfAllRate)*100) 
            if (this.DiscountType === '0') {
              this.DiscountAmt = (+this.Discount / 100) * (+baserate)
            } else {
              this.DiscountAmt = (+this.Discount).toFixed(this.decimalDigit)
            } 
            withoutTax = baserate -  this.DiscountAmt  
 
          } else if(this.isInclusiveCaseBeforeDiscount ==='1'){
            baserate =( ((dataTotalrate-DiscountAmt)/(100+sumOfAllRate))*100)  
            withoutTax = baserate
          }
         
        } else {
          let taxr = isNaN(+element.TaxRate) ? 0 : +element.TaxRate
          totalTaxAmt = +totalTaxAmt + +taxr
        } 
      })
      TaxArray.forEach(ele => {
        if (ele.TaxType === 0) {
           totalTaxAmt = (ele.TaxRate/100) * withoutTax  
        } else {
          let taxr = isNaN(+ele.TaxRate) ? 0 : +ele.TaxRate
          totalTaxAmt = +totalTaxAmt + +taxr
        } 
             this.taxDetailsPerItem.push({
               itemTransSno:itemTrsnId,
               TaxRate:ele.TaxRate,
               TaxType: ele.TaxType,
               id: ele.id,
               taxSlabId:ele.taxSlabId,
               TaxRateNameTax:ele.taxSlabName,
               AmountTax :totalTaxAmt ,
               TaxName:ele.TaxName
             })
           }
           )
         }
         return this.taxDetailsPerItem
  }
taxCalculationForItem (itemTrsnId) {
  let Rate = (isNaN(+this.Rate)) ? 0 : +this.Rate
    let Quantity = (isNaN(+this.Quantity)) ? 1 : +this.Quantity
    let Discount = (isNaN(+this.discountAmount)) ? 0 : +this.discountAmount
    let Height = (this.Height === 0 || this.Height === null) ? 1 : +this.Height
    let Length = (this.Length === 0 || this.Length === null) ? 1 : +this.Length
    let Width = (this.Width === 0 || this.Width === null) ? 1 : +this.Width
    if (this.DiscountType === '0') {
      this.DiscountAmt = (Discount * Quantity * Length * Width * Height).toFixed(this.decimalDigit)
    } else {
      this.DiscountAmt = (Discount).toFixed(this.decimalDigit)
    }
let taxPerItem;
   let totalAmt =0
   if(this.allTaxRateForItem.length>0){
    if(this.TaxTypeId === '1'){
      totalAmt = Rate * Quantity * Length * Width * Height
     taxPerItem = this.InclusiveForTaxItem(this.allTaxRateForItem,totalAmt,itemTrsnId,+this.DiscountAmt)
   }
   else{
      totalAmt = (Rate * Quantity * Length * Width * Height) - this.DiscountAmt
     taxPerItem = this.ExclusiveForTaxItem(this.allTaxRateForItem,totalAmt,itemTrsnId)
   }
   }

return  taxPerItem

}
taxCalculationForCharge (chargetranSnoId){
  
let AmountCharge = 0
   AmountCharge = (isNaN(+this.AmountCharge)) ? 0 : +this.AmountCharge
 if(AmountCharge >0){
  let taxPerItem;
   if (this.allTaxRateForCharge.length > 0) {
    if(this.taxTypeChargeId === '1'){
     taxPerItem = this.InclusiveForTaxItem(this.allTaxRateForCharge,AmountCharge,chargetranSnoId,0)
   }
   else{
     taxPerItem = this.ExclusiveForTaxItem(this.allTaxRateForCharge,AmountCharge,chargetranSnoId)
   }
    this.allTaxRateForCharge =[]
   }

return  taxPerItem

      

}
}

  calculateForTotalAmount () {
    let totalAmount = 0
    for (let i = 0; i < this.localItemas.length; i++) {
      totalAmount = +totalAmount + +(this.localItemas[i].Quantity * this.localItemas[i].Rate)

    }
    if (!this.clickItem) {
      if (this.TotalAmount !== 0 && typeof this.TotalAmount !== 'undefined' && !isNaN(+this.TotalAmount)) {
        totalAmount = totalAmount + +this.TotalAmount
      }
    }
    if (!isNaN(totalAmount)) {

      this.netBillAmount = Math.round(totalAmount).toFixed(this.decimalDigit)
      this.subTotalBillAmount = Math.round(totalAmount).toFixed(this.decimalDigit)
      console.log(this.subTotalBillAmount ,'sub1')
    }



  }
  TaxableValue: any
  totalDiscount: any
  DiscountPerItem: any
  discountAmount: any
  totalRate: any
  totalTaxAmount: any
  TotalAllFreight: any
  OtherAllCharge: any
  TotalChargeAmt: any = 0
  calculateAllTotal () {
    let totalDiscount = 0
    let totalQty = 0
    let totalTax = 0
    let totalAmt = 0
    //let totalRate = 0
    let TotalAmountCharge =0
     let amountCharge =0

    let totaltaxChargeAmt = 0
    for (let i = 0; i < this.localItemas.length; i++) {
      totalDiscount = +totalDiscount + +this.localItemas[i].DiscountAmt
      totalAmt = +totalAmt + +this.localItemas[i].TotalAmount
      totalQty = +totalQty + +this.localItemas[i].Quantity
      totalTax = +totalTax + +this.localItemas[i].TaxAmount
    }
    for (let i = 0; i < this.AdditionalChargeData.length; i++) {
      amountCharge = +amountCharge + +this.AdditionalChargeData[i].AmountCharge
      totaltaxChargeAmt = +totaltaxChargeAmt + +this.AdditionalChargeData[i].TaxAmountCharge
      TotalAmountCharge = +TotalAmountCharge + +this.AdditionalChargeData[i].TotalAmountCharge

    }


    if(!this.clickSaleAdditionCharge){

    }
    if (!this.clickItem) {

      if (this.discountAmount) {
        totalDiscount += +this.DiscountAmt
      }
      if (totalQty) {
        totalQty = totalQty
      }
      if (this.TaxAmount) {
        totalTax += +this.TaxAmount
      }

      this.totalDiscount = (totalDiscount).toFixed(this.decimalDigit)
     // this.totalRate = (totalRate).toFixed(this.decimalDigit)
      this.TotalQuantity = totalQty
      this.totalTaxAmount = (totalTax).toFixed(this.decimalDigit)
      this.TotalChargeAmt = TotalAmountCharge
      this.calTotalBillAmount()
    }

  }

removeBillSummery (y,type,tranIsSNO){
  // editSno:data.Id,
  
  let indexofRow;
for(let i=this.taxSlabSummery.length; i  > this.taxSlabSummery.length -1; i--  ){
  if(type ==='charge'){
    //( this.taxSlabSummery,'sunnry')
    indexofRow =  this.taxSlabSummery.findIndex(
      objectModified => (objectModified.ParentTypeTaxId === 22 &&  objectModified.ItemTransTaxId === tranIsSNO  )
    )
  }
  if(type ==='items'){
    indexofRow =  this.taxSlabSummery.findIndex(
      objectModified => (objectModified.ParentTypeTaxId === 6 && objectModified.ItemTransTaxId === tranIsSNO  )
    )
  }
  if(indexofRow !== -1){
    this.taxSlabSummery.splice(indexofRow,1)
  }
}
    this.showBillingSummery(this.taxSlabSummery)

}



  intrerestrateAmt: any
  DiscountValueType: any
  get customer () { return this.customerForm.controls }
  changeIntrate (e) {
    this.InterestRateType = e === '0' ? 0 : 1
  }
  changeCommisiontrate (e) {
    this.CommisionRateType = e === '0' ? 0 : 1
  }

  private addCustomerForm () {
    this.customerForm = this._formBuilder.group({
      'caseCustomerName': [UIConstant.BLANK, Validators.required],
      'customerMobileNo': [UIConstant.BLANK, Validators.required],
      'CustomerEmail': [UIConstant.BLANK, Validators.required],
      'CustomerAddress': [UIConstant.BLANK, Validators.required]

    })
  }
  netBillAmount: any

  totalBillAmount: any
  baseRateItem: any



  calTotalBillAmount () {
    
    let totalBillAmt = 0
    let toatltax =0
    for (let i = 0; i < this.localItemas.length; i++) {
if(this.localItemas[i].TaxType === '1'){
  totalBillAmt = totalBillAmt + 
  + (isNaN(+this.localItemas[i].baserate) ? 0 : +this.localItemas[i].baserate) +
  (isNaN(+this.localItemas[i].TaxAmount) ? 0 : +this.localItemas[i].TaxAmount) 
  toatltax  = +toatltax + +this.localItemas[i].TaxAmount
}
else{
  totalBillAmt = totalBillAmt + (isNaN(+this.localItemas[i].Rate) ? 0 : +this.localItemas[i].Rate) *
  (isNaN(+this.localItemas[i].Quantity) ? 0 : +this.localItemas[i].Quantity) *
  (isNaN(+this.localItemas[i].Height) ? 0 : +this.localItemas[i].Height) *
  (isNaN(+this.localItemas[i].Width) ? 0 : +this.localItemas[i].Width) *
  (isNaN(+this.localItemas[i].Length) ? 0 : +this.localItemas[i].Length)
  - (isNaN(+this.localItemas[i].DiscountAmt) ? 0 : +this.localItemas[i].DiscountAmt) +
  (isNaN(+this.localItemas[i].TaxAmount) ? 0 : +this.localItemas[i].TaxAmount) 
  toatltax = +toatltax + +this.localItemas[i].TaxAmount
}
console.log(totalBillAmt ,'totl---->>')
   

    }

    if (!this.clickItem) {
      if (this.Rate !== '') {
        if(this.TaxTypeId  === '1'){
          if(this.isInclusiveCaseBeforeDiscount === '2'){
            totalBillAmt +=  +this.getBaseRateForItem + +this.totalRowTax 
             //this.TaxAmount=  +this.totalRowTax
           toatltax = +this.totalRowTax
          }
          else{
            totalBillAmt +=  +this.getBaseRateForItem + +this.totalRowTax 
            //this.TaxAmount=  +this.totalRowTax
          toatltax = +this.totalRowTax
          }

        }
        else{
          totalBillAmt += +this.Rate * this.Quantity * this.Length * this.Height * this.Width
          - (isNaN(+this.DiscountAmt) ? 0 : +this.DiscountAmt)
         + (isNaN(+this.TaxAmount) ? 0 : +this.TaxAmount)
         toatltax = +toatltax + +(isNaN(+this.TaxAmount) ? 0 : +this.TaxAmount)
        }
        
      }
    }

    this.subTotalBillAmount = +(totalBillAmt).toFixed(this.decimalDigit)
    this.TaxableValue = (totalBillAmt - toatltax ).toFixed(this.decimalDigit)
     let  localNetAmt =  +(totalBillAmt + +this.TotalChargeAmt).toFixed(this.decimalDigit)
   //c/onsole.log(localNetAmt ,'Amt')

    this.RoundOff =  +(Math.round(localNetAmt) - localNetAmt).toFixed(this.decimalDigit)
//console.log(this.RoundOff,'rond')
    this.netBillAmount = localNetAmt +  this.RoundOff
    if(this.RoundOffManual){
      this.RoundOff = +this.RoundOffManual
      this.netBillAmount = localNetAmt +  this.RoundOffManual
    }
    if(localNetAmt===0){
      this.RoundOffManual = 0
      this.RoundOff =0
      this.netBillAmount=0
    }

 
    console.log(this.subTotalBillAmount ,'subo1')

  

    if (!this.clickTrans) {

      let unBilledAmt = 0
      for (let i = 0; i <= this.transactions.length - 1; i++) {
        unBilledAmt = unBilledAmt + +this.transactions[i].Amount
      }
      unBilledAmt = (isNaN(+unBilledAmt)) ? 0 : +unBilledAmt
      this.netBillAmount = (isNaN(+this.netBillAmount)) ? 0 : +this.netBillAmount
      let lastAmt = this.netBillAmount - unBilledAmt
      let amt = this.netBillAmount - lastAmt
      let amt2 = amt - unBilledAmt
      this.Amount = (lastAmt + amt2).toFixed(this.decimalDigit)

    } else {
      this.Amount = (this.netBillAmount).toFixed(this.decimalDigit)
    }

    if (this.Amount > 0) {
      this.validateTransaction()
    }

  }

  // add more items
  identify (index, item) {
    item.Sno = index + 1
    return item.Sno - 1
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
  checkValidationForAmount (): boolean {
    let paymentTotal = this.getPaymentTotal()
    paymentTotal = (isNaN(+paymentTotal)) ? 0 : +paymentTotal
    this.netBillAmount = (isNaN(+this.netBillAmount)) ? 0 : +this.netBillAmount
    if (!this.clickTrans) {
      let amount = JSON.parse(this.Amount)

      if (amount) {
        paymentTotal = amount
      }
    }
    if (this.netBillAmount !== 0) {
      if (paymentTotal > this.netBillAmount) {
        this.toastrService.showError('', UIConstant.PAYMENT_NOT_MORE_BILLAMOUNT)
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

  ngOnDestroy () {
    this.modalOpen.unsubscribe()
    this.newAttributeADDModel1.unsubscribe()
    this.modalCategory.unsubscribe()
    this.newCustAddSub.unsubscribe()
    this.newCustAddCutomer.unsubscribe()
    this.newLedgerbankAdd.unsubscribe()
    this.newNewAddress.unsubscribe()
    this.additionChargeLedgerModel.unsubscribe()
    this.newTaxSlabAddSub.unsubscribe()
    this.itemAddSub.unsubscribe()
  }
  creditLimitAmount: any
  creditDays: any
  ledgerStateId: any
  getGSTByLedgerAddress (ledgerId) {
    this.subscribe = this._commonService.ledgerGetGSTByAddress(ledgerId).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND) {
        if (data.Data.LedgerDetails.length > 0) {
          this.creditLimitAmount = data.Data.LedgerDetails[0].CreditLimit
          this.creditDays = JSON.parse(data.Data.LedgerDetails[0].CreditDays)
        }
        if (data.Data.AddressDetails.length > 0) {
          this.ledgerStateId = data.Data.AddressDetails[0].StateId
           this.checkOtherStateForNewItemAdd(this.ledgerStateId)
        }
      }
    })
  }
  industryId: any
  @ViewChild('custName') custName
  openCustomerDetails () {

    this.disbledInputMobileFlag = true
    this.searchCountryCodeForMobile(' ')
    this.customerClick = false

    $('#cust_detail_m').modal(UIConstant.MODEL_SHOW)
    setTimeout(() => {
      this.custName.nativeElement.focus()
    }, 1000)
  }
  caseSaleArrayId: any
  textItemId:any
  itemTableDisabledFlag: boolean
  withoursaveEditFlag : boolean
  openDirectModal () {
    this.withoursaveEditFlag  = true
    this.itemTableDisabledFlag = true
    this.caseSaleArrayId = [{ id: 1 }, { id: 5 }]
    this.Amount = 0
    this.editChargeId =0
    this.textItemId =0
    let data = JSON.stringify(this._settings.industryId)
    this.industryId = JSON.parse(data)
    let datacatLevel = JSON.stringify(this._settings.catLevel)
    this.catLevel = JSON.parse(datacatLevel)
    console.log(this.catLevel ,'cat-level')
    this.createModels(this.catLevel)
    this.disabledTaxFlag = false
    this.addressShowFlag = false
    this.ChallanId = 0
    this.allTaxRateForItem = []
    this.isCheckLedgerOfficeFlag = false
    this.DiscountValueType = '%'
    this.itemAddRequiredFlag = false
    this.editAlreadyItemDataFlag = false
    this.showAttributeData = []
    this.localLabelData = []
    this.trsnItemId = 2
    this.itemsAttribute = []
    this.transactions = []
    this.AdditionalChargeData =[]
    this.getCurrency()
    this.getModuleSettingData()
    this.getSPUtilityDataBilling()
    this.getCountry(0)
    this.editItemId = 0
    this.initComp()
    $('#sale_direct_form').modal(UIConstant.MODEL_SHOW)
    setTimeout(() => {
      this.clientSelect2.selector.nativeElement.focus()
    }, 1000)
  }

  closeModal () {
    if ($('#sale_direct_form').length > 0) {
      $('#sale_direct_form').modal(UIConstant.MODEL_HIDE)
    }
  }

  closeInvoice () {
    this._commonService.closeSaleDirect()
  }

  invalidObj: Object = {}

  checkValidation (): boolean {
    let isValid = 1
    if (this.clientNameId) {
      this.invalidObj['clientNameId'] = false
    } else {
      this.invalidObj['clientNameId'] = true
      isValid = 0
    }
    if (this.orgNameId) {
      this.invalidObj['orgNameId'] = false
    } else {
      this.invalidObj['orgNameId'] = true
      isValid = 0
    }
    if (this.BillNo) {
      this.invalidObj['BillNo'] = false
    } else {
      this.invalidObj['BillNo'] = true
      isValid = 0
    }
    if (this.InvoiceDate) {
      this.invalidObj['InvoiceDate'] = false
    } else {
      this.invalidObj['InvoiceDate'] = true
      isValid = 0
    }

    return !!isValid
  }

  validationForItemData () {
    let isValidItem = 1
    if (this.itemCategoryId) {
      this.invalidObj['itemCategoryId'] = false
    } else {
      this.invalidObj['itemCategoryId'] = true
      isValidItem = 0
    }
    if (this.unitId) {
      this.invalidObj['unitId'] = false
    } else {
      this.invalidObj['unitId'] = true
      isValidItem = 0
    }
    if (this.Rate>0) {
      this.invalidObj['Rate'] = false
    } else {
      this.invalidObj['Rate'] = true
      isValidItem = 0
    }
    if (this.Quantity > 0) {
      this.invalidObj['Quantity'] = false
    } else {
      this.invalidObj['Quantity'] = true
      isValidItem = 0
    } 
    //  if (this.DiscountType === '0'||0) {
    //   if(this.Discount < 100){
    //     this.invalidObj['Discount'] = false
    //   }
    //   else{
    //     this.invalidObj['Discount'] = true
    //      isValidItem = 0
    //   }
     
    // } else {
    //   if(this.Discount > 0){
    //     this.invalidObj['Discount'] = false
    //   }
     
    //   isValidItem = 0
    // }

    return !!isValidItem
  }

  currency: any
  defaultCurrency: string
  setupModules: any
  currenyValues: Array<{ id: string, symbol: string }> = [{ id: '0', symbol: '%' }]
  isDataAvailable: boolean = false

  getAvailableCurrency () {
    return this._commonService.setupSettingByType(UIConstant.SALE_TYPE)
  }
  inventoryItemSales: any
  ItemTransactionactions: any
  itemAttbute: any
  ColorCode: any
  SizeCode: any
  ArticleCode: any
  editAlreadyItemDataFlag: boolean
  setEditCustomerData (data) {
   // let mobile = data[0].MobileNo
    this.CaseCustId = data[0].Id
    this.customerForm.controls.caseCustomerName.setValue(data[0].Name)
    this.customerForm.controls.customerMobileNo.setValue(data[0].MobileNo)
    this.customerForm.controls.CustomerEmail.setValue(data[0].Email)
    this.customerForm.controls.CustomerAddress.setValue(data[0].Address)
   // this.addressId =data[0].Id
    this.getCountry(data[0].CountryId)
    setTimeout(() => {
      this.countryValue =data[0].CountryId
      this.countryselect2.setElementValue(data[0].CountryId)
      
    }, 100);
  setTimeout(() => {
    this.getStaeList(data[0].CountryId,data[0].StateId)
    this.stateValuedata = data[0].StateId
    this.stateselect2.setElementValue(data[0].StateId)
  
  
  }, 1000);
 setTimeout(() => {
  this.getCitylist(data[0].StateId,data[0].CityId)
  this.cityValue = data[0].CityId
  this.cityselect2.setElementValue(data[0].CityId)
 }, 1500);
 setTimeout(() => {
  this.getCitylist(data[0].StateId,data[0].AreaId)
  this.areNameId = data[0].AreaId
  this.areaSelect2.setElementValue(data[0].AreaId)
 }, 1500);

   this.countryCodeselect2.setElementValue(data[0].CountryCode)
  }
  BillingAddressName: any
  EditSaleData (id) {
    this._commonService.getSaleDirectEditData(id).subscribe(data => {
      console.log(JSON.stringify(data), 'editData----------->>')
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        if (data.Data && data.Data.CustomerTypes.length > 0) {
          this.setEditCustomerData(data.Data.CustomerTypes)
        }
        //element.TaxType === 0 ? 
        if (data.Data && data.Data.AdditionalChargeDetails.length > 0) {
          this.AdditionalChargeData=[]
          data.Data.AdditionalChargeDetails.forEach(chrgeItem =>{
            this.AdditionalChargeData.push({
              Id: chrgeItem.Id,
              Sno:1,
              LedgerChargeId: chrgeItem.LedgerChargeId,
              ParentChargeId: chrgeItem.ParentChargeId,
              ParentTypeChargeId: chrgeItem.ParentTypeChargeId,
              LedgerName: chrgeItem.LedgerName,
              taxslabName: chrgeItem.TaxChargeName,
              AmountCharge: chrgeItem.AmountCharge,
              TaxSlabChargeId: chrgeItem.TaxSlabChargeId,
              TaxAmountCharge: chrgeItem.TaxAmountCharge,
              TotalAmountCharge: chrgeItem.TotalAmountCharge,
              TaxTypeChargeName: chrgeItem.TaxTypeCharge === 0 ? 'Exclusive' : 'Inclusive' ,
              TaxTypeCharge: chrgeItem.TaxTypeCharge,
              ParentTypeId: chrgeItem.TaxSlabType,
              type:'charge'
            })
          })
        }

        if (data.Data && data.Data.ItemTaxTransDetails.length > 0) {
          this.taxSlabSummery =[]
          data.Data.ItemTaxTransDetails.forEach(item =>{
            this.taxSlabSummery.push({
              Id: item.Id,
              Sno:1,
              TaxTypeTax: item.TaxTypeCharge ,
              AmountTax: item.AmountTax,
              ItemTransTaxId: item.ItemTransTaxId,
              ParentTaxId: item.ParentTaxId,
              ParentTypeTaxId: item.ParentTypeTaxId,
              ItemTransTypeTax: item.ItemTransTypeTax,
              TaxRateId: item.TaxRateId,
              TaxRate: item.TaxRate,
              ValueType: item.ValueType,
              taxSlabId: item.TaxSlabId,
              TaxRateNameTax: item.TaxRateName, //igst
              TaxSlabName: item.TaxSlabName, //18 slab
              ParentTypeChargeId: item.TaxTypeCharge,
              LedgerName: item.TaxTypeTax,
              ParentTypeId: item.TaxSlabType,
              Amount: item.Amount,
              TaxType: item.TaxType,
              IsForotherState: item.IsForotherState,
              
            })
          })
          this.showBillingSummery(this.taxSlabSummery)
        
        }
        if (data.Data && data.Data.SaleTransactionses.length > 0) {
          this.inventoryItemSales = []
          this.inventoryItemSales = data.Data.SaleTransactionses
          this.BillNo = this.inventoryItemSales[0].BillNo
          this.itemsAttribute = []
          this.clientNameId = this.inventoryItemSales[0].LedgerId
          this.BillingAddressName = this.inventoryItemSales[0].BillingAddressName
          this.stateList = [{id: 1,text:this.BillingAddressName}]
          this.getGSTByLedgerAddress(this.clientNameId)
          this.orgNameId = this.inventoryItemSales[0].OrgId
          this.LocationTo = this.inventoryItemSales[0].LocationTo
          this.RoundOffManual = this.inventoryItemSales[0].RoundOff
          this.RoundOff = this.inventoryItemSales[0].RoundOff
          this.VehicleNo = this.inventoryItemSales[0].VehicleNo
          this.Drivername = this.inventoryItemSales[0].Drivername
          this.Transportation = this.inventoryItemSales[0].Transportation
          this.CommisionRateType = this.inventoryItemSales[0].CommissionType
          this.orgnizationSelect2.setElementValue(this.inventoryItemSales[0].OrgId)
          this.clientSelect2.setElementValue(this.inventoryItemSales[0].LedgerId)
          this.godownSelect2.setElementValue(this.inventoryItemSales[0].GodownId)
          this.currencySelect2.setElementValue(this.inventoryItemSales[0].CurrencyId)
          this.InvoiceDate = this._globalService.utcToClientDateFormat(this.inventoryItemSales[0].BillDate, this.clientDateFormat)
         // console.log(this.InvoiceDate, 'billdate')
          this.EwayBillNo = this.inventoryItemSales[0].EwayBillNo

          this.Commission = this.inventoryItemSales[0].Commission
          this.TotalQuantity = this.inventoryItemSales.filter(item1 => item1.TotalQty)
            .map(item1 => parseFloat(item1.TotalQty))
            .reduce((sum, current) => sum + current, 0)

          this.OtherCharge = this.inventoryItemSales.filter(item1 => item1.OtherCharge)
            .map(item1 => parseFloat(item1.OtherCharge))
            .reduce((sum, current) => sum + current, 0)
          data.Data.SaleTransactionses.forEach(ele => {
            if (ele.FreightMode === 1) {

              this.TotalFreight = data.Data.SaleTransactionses.filter(item1 => ele.Freight)
                .map(item2 => parseFloat(item2.Freight))
                .reduce((sum, current) => sum + current, 0)
            }
          })

          // [].reduce( (previousValue, currentValue) => previousValue + currentValue, 0);
          let newDataUnit = Object.assign([], this.unitDataType)
          newDataUnit.push({ id: this.inventoryItemSales[0].OrgId, text: this.inventoryItemSales[0].UnitName })
          this.unitDataType = newDataUnit

          this.unitId = this.inventoryItemSales[0].UnitId
          this.getUnitId = this.inventoryItemSales[0].UnitId

        } else {
          this.inventoryItemSales = []
        }
        if (data.Data && data.Data.PaymentDetails && data.Data.PaymentDetails.length > 0) {
          this.transactions = []
          data.Data.PaymentDetails.forEach(ele => {

            let payDate = this._globalService.utcToClientDateFormat(ele.PayDate, this.clientDateFormat)
            this.transactions.push({
              Sno: 1,
              Id: ele.Id,
              Paymode: ele.Paymode,
              PayModeId: ele.PayModeId,
              LedgerId: ele.LedgerId,
              ledgerName: ele.BankLedgerName,
              Amount: ele.Amount,
              PayDate: payDate,
              ChequeNo: ele.ChequeNo,
              ParentTypeId: ele.ParentTypeId
            })
          })
        } else {
          this.transactions = []

        }
        if (data.Data && data.Data.ItemTransactions && data.Data.ItemTransactions.length > 0) {
          this.editAlreadyItemDataFlag = false
          this.localItemas = []
          this.items = []
          this.items = data.Data.ItemTransactions

          this.ItemTransactionactions = []
          this.itemsAttribute = []
          this.ItemTransactionactions = data.Data.ItemTransactions

          let attributLabel = this.attributesLabels
          data.Data.ItemTransactions.forEach(element => {
            let value
            this.localLabelData = []
            if (data.Data && data.Data.ItemAttributesTrans && data.Data.ItemAttributesTrans.length > 0) {
              if (data.Data && data.Data.ItemAttributesTrans && data.Data.ItemAttributesTrans.length > 0) {
                this.sendAttributeData = data.Data.ItemAttributesTrans
                this.seteditAttributeData = data.Data.ItemAttributesTrans.filter(itm => itm.ItemTransId === element.Id)
                attributLabel.forEach(label => {
                  this.labeldata = data.Data.ItemAttributesTrans.filter(v => v.AttributeValueId === label.AttributeId)
                  value = []
                  if (this.labeldata.length > 0) {
                    value = this.labeldata.filter(v => v.ItemTransId === element.Id)
                  }
                  this.localLabelData.push({
                    AttributeId: label.AttributeValueId,
                    Label: label.Name,
                    AttributeValue: value

                  })
                })
              }
            }
            const ExpiryDatevar = this._globalService.utcToClientDateFormat(element.ExpiryDate, this.clientDateFormat)
            const MFDatevar = this._globalService.utcToClientDateFormat(element.utcToClientDateFormat, this.clientDateFormat)
          //  const TaxType =  element.TaxType === 0  ? 'Exclusive' : 'Inclusive'
            this.localItemas.push({
              Sno: 1,
              Id: element.Id,
              CategoryId: element.CategoryId,
              CategoryName: element.CategoryName,
              ItemName: element.ItemName,
              Remark: element.Remark,
              UnitName: element.UnitName,
              Quantity: element.Quantity,
              MrpRate: element.MrpRate,
              Length: element.Length,
              Width: element.Width,
              Height: element.Height,
              ExpiryDate: ExpiryDatevar,
              MFDate: MFDatevar,
              BatchNo: element.BatchNo,
              TaxId: element.TaxSlabId,
              Rate: element.SaleRate,
              UnitId: element.UnitId,
              ItemId: element.ItemId,
              IsForOtherState: element.IsForOtherStateForTrans === 0 ? false : true,
              DiscountAmt: element.DiscountAmt,
              Discount: element.Discount,
              DiscountType: JSON.stringify(element.DiscountType),
              TaxSlabId: element.TaxSlabId,
              TaxTypeName : element.TaxType === 0 ? 'Exclusive' : 'Inclusive' ,
              TaxTypeId :  element.TaxType,
              TaxSlabName: element.TaxSlabName,
              TaxAmount: element.TaxAmount,
              TotalAmount: element.SubTotalAmount,
              attributeData: this.seteditAttributeData,
              LableAttributeVale: this.localLabelData

            })

          })
          console.log(data.Data.ItemTransactions , this.localItemas, 'get-item edit')
          if (this.stateId === 0) {
             this.caseSaleCheckOtherState(this.stateId)
            this.isCaseSaleFlag = false
          } else {
            this.AddressForGst =this.stateId
             this.checkOtherStateForNewItemAdd(this.stateId)
           // this.stateBillingSelect2Id.setElementValue(this.stateId)
           // this.stateShippingSelect2Id.setElementValue(this.SupplyStateId)
          }
          this.calculateAllTotal()
        }
      }
      if (data.Code === UIConstant.SERVERERROR) {
        this.toastrService.showError('', data.Description)
      }

    })
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
  caseSaleCustomerDetails: any
  seteditAttributeData: any
  CurrencyRate: any = 0
  InterestRate: any
  sendAttributeData: any
  CommisionRate: any
  totalChallan: any
  InterestType: any
  InvoiceDateChngae: any
  DueDateChngae: any
  SupplyStateId: any
  itemTaxData:any
  saveSaleChallan () {

    this.submitSave = true

    if (this.deleteEditflag) {

      this.addItems()
      this.addTransactions()
      if (this.checkValidation()) {
        console.log(JSON.stringify(this.items), 'Request')
        if (this.items.length !== 0) {
          if (this.InvoiceDate !== '') {

            this.InvoiceDateChngae = this._globalService.clientToSqlDateFormat(this.InvoiceDate, this.clientDateFormat)
          } else {
            this.InvoiceDateChngae = ''
          }

          if (this.DueDate !== '') {
            this.DueDateChngae = this._globalService.clientToSqlDateFormat(this.DueDate, this.clientDateFormat)
          } else {
            this.DueDateChngae = ''
          }

          let obj = {}
          obj['Id'] = this.Id
          obj['Commission'] = 0
          obj['CommissionType'] = 0
          obj['BillNo'] = this.BillNo
          obj['BillDate'] = this.InvoiceDateChngae
          obj['DueDate'] = this.DueDateChngae
          obj['BillAmount'] = this.netBillAmount,
            obj['CurrencyRate'] = this.CurrencyRate,
            obj['TotalDiscount'] = this.totalDiscount,
            obj['Freight'] = this.TotalFreight
          obj['FreightMode'] = this.freightById
          obj['PartyId'] = this.clientNameId
          obj['ReferralId'] = this.referalsID
          obj['ReferralTypeId'] = this.referalsTypeID
          obj['ReferralCommission'] = this.CommisionRate,
            obj['ReferralCommissionTypeId'] = this.CommisionRateType,
            obj['ReverseCharge'] = 0
          obj['ReverseTax'] = 0
          obj['CessAmount'] = 0
          obj['RoundOff'] = this.RoundOff,
            obj['SubTotalAmounts'] = this.subTotalBillAmount,
            obj['TotalTaxAmount'] = this.totalTaxAmount,
            obj['TotalChallan'] = this.totalChallan,
            obj['SupplyState'] = this.SupplyStateId,
            obj['Drivername'] = this.Drivername,
            obj['Transportation'] = this.Transportation,
            obj['TotalQty'] = this.TotalQuantity,
            obj['OtherCharge'] = this.OtherCharge,
            obj['GodownId'] = this.godownId,
            obj['CurrencyId'] = this.CurrencyId,
            obj['OrgId'] = this.orgNameId,
            obj['InterestRate'] = this.InterestRate,
            obj['InterestAmount'] = 0
          obj['InterestType'] = this.InterestRateType
          obj['OrderId'] = 0
          obj['LocationTo'] = this.LocationTo
          obj['VehicleNo'] = this.VehicleNo
          obj['Advanceamount'] = 0
          obj['NetAmount'] = this.netBillAmount
          obj['AddressId'] = this.stateId
          obj['ConvertedCurrencyId'] = 0
          obj['PaymentDetail'] = this.transactions
          obj['Items'] = this.items
          obj['ItemAttributeTrans'] = this.sendAttributeData
          obj['CustomerTypes'] = this.caseSaleCustomerDetails
          obj['AdditionalCharges'] = this.AdditionalChargeData
          obj['ItemTaxTrans'] = this.taxSlabSummery
          let _self = this

          console.log('sale-direct-request : ', JSON.stringify(obj))
          this._commonService.postSaleDirectAPI(obj).subscribe(
            (data: any) => {
              if (data.Code === UIConstant.THOUSAND) {
                _self.toastrService.showSuccess('', UIConstant.SAVED_SUCCESSFULLY)
                _self._commonService.newSaleAdded()
                if (!_self.keepOpen) {
                  _self._commonService.closeSaleDirect()
                } else {
                  _self.initComp()
                  _self.clearExtras()
                }
              } else {
                _self.toastrService.showError(data.Code, data.Message)
              }
            }
          )

        } else {
          this.toastrService.showError('', UIConstant.ADD_ITEM)
        }
      }
    } else {
      this.toastrService.showWarning('', UIConstant.FIRST_SAVE_EDIT_ITEM)
    }
  }

  deleteItem (type, a,sno,id,detail) {
    
    console.log(detail,'delete')
    if (type === 'items') {
      this.lastItemFlag = true
      this.items.splice(a, 1)
      this.localItemas.splice(a, 1)
      if (this.items.length === 0 && this.localItemas.length === 0) {
        this.lastItemFlag = false
      }
     // this.calculate()

      this.calculateAllTotal()
      this.calculateTotalOfRow()
      if(id>0 && sno ===1 ){
        this.removeBillSummery(a,'items',detail.Id)
      }
      if(id>0 && sno >1 ){
        this.removeBillSummery(a,'items',sno)
      }
      if(id === 0){
        this.removeBillSummery(a,'items',sno)
      }
    }
    if (type === 'trans') {
      this.transactions.splice(a, 1)
      this.unBilledAmount()

    }
    if (type === 'charge') {
      
      this.AdditionalChargeData.splice(a, 1)
      this.unBilledAmount()
      this.calculateAllTotal()
      this.alreadySelectCharge(+detail.LedgerChargeId, detail.LedgerName,false)
      if(id>0 && sno ===1 ){
        this.removeBillSummery(a,'charge',detail.Id)
      }
      if(id>0 && sno >1 ){
        this.removeBillSummery(a,'charge',sno)
      }
      if(id === 0){
        this.removeBillSummery(a,'charge',sno)

      }
      

    }

  }

  AttrColourEditId: any
  AttrSizeEditId: any
  AttrArticleEditId: any
  deleteEditflag: boolean = true
  deleteEditPaymentFlag: boolean = true
  deleteEditChargeFlag: boolean= true
  editAttributeData: any
  taxRateForOtherStateFlag: any
  DiscountRate: any
  editTransId: any
  editChargeId: any
  ChallanId: any
  addressShowFlag: any
  taxSalbName: any
  abs: any
  @ViewChildren('attr_select2') attrSelect2: QueryList<Select2Component>
  PurchaseRate: any
  SaleRate: any
  editRowItem (type, index, Sno,editId,item, attributeData) {
    console.log(item ,this.items[index],'edit-item')
    this.addressShowFlag = false
    this.editRowListFlag = false
    this.editAttributeData = attributeData
    if (type === 'items') {
this.withoursaveEditFlag = false
      if (this.deleteEditflag) {
        
        this.isCheckLedgerOfficeFlag = true
        this.taxRateForOtherStateFlag = this.items[index].IsForOtherState === false ? false : true
        this.IsForOtherState = this.taxRateForOtherStateFlag 
        this.deleteEditflag = false
        this.editItemId = editId
        
        this.DiscountAmt = item.DiscountAmt
        this.Discount = item.Discount
        this.DiscountRate = item.DiscountRate
        this.TaxAmount = item.TaxAmount
        this.DiscountType = item.DiscountType
        this.Remark = item.Remark
        this.ChallanId = item.ChallanId
        this.Quantity = item.Quantity
        this.Rate = item.Rate
        this.MrpRate = item.MrpRate,
          this.Length = item.Length,
          this.Width = item.Width,
          this.Height = item.Height,
          this.unitId = item.UnitId
        this.UnitName = item.UnitName
        this.categoryId = item.CategoryId
        this.itemCategoryId = item.ItemId
        this.TotalAmount = item.TotalAmount
        this.categoryName =item.CategoryName
        this.categoryId = item.CategoryId
        this.taxSalbName = item.TaxSlabName
        this.taxSelect2.setElementValue(item.TaxSlabId)
        this.unitSelect2.setElementValue(item.UnitId)
        this.itemSelect2.setElementValue(item.ItemId)
        this.PurchaseRate= item.PurchaseRate
        this.ExpiryDate= item.ExpiryDate
        this.MfDate= item.MfDate
        this.BatchNo= item.BatchNo
        this.ItemName= item.ItemName
        this.taxSlabId= item.TaxSlabId
        this.taxSlabName= item.taxSlabName
        this.TaxTypeId= item.TaxType
        this.TaxTypeName= item.TaxTypeName

         
        if (this.atrColorSelect2.length > 0) {
          if( this.editAttributeData.length> 0){
          this.editAttributeData.forEach(inx => {
            for(let i=0; i< this.atrColorSelect2.length; i++){
              this.atrColorSelect2.forEach((item: Select2Component, index: number, array: Select2Component[]) => {
                let findIndex =  this.allAttributeData[index].item.findIndex(
                  element => ( element.id === inx.AttributeId)
                    )
                if(findIndex !== -1){
                  item.setElementValue(this.allAttributeData[index].item[findIndex].id)
                  
                }
               
             })
            }

          })
        }
        }
        // attributeData.forEach(atr => {
        //   this.abs = []
        //   this.abs.push({
        //     id: atr.Id,
        //     text: atr.AttributeName,
        //     attributeId: atr.AttributeId
        //   })
        // })
        // this.allAttributeData.push({
        //   item: this.abs
        //  })
        this.calculateAllTotal()
        //type, a,sno,id,detail
        this.deleteItem('items', index,Sno,editId,item)
      } else {
        this.toastrService.showWarning('', 'First save item!')
      }
    }
    if (type === 'trans' && !this.editTransId) {
      if (this.deleteEditPaymentFlag) {
        this.editTransId = editId
        this.snoForPAymentId = Sno
        this.deleteEditPaymentFlag = false
        // index = index - 1
        if (+this.transactions[index].PayModeId === 3) {
          this.paymodeSelect2.setElementValue('')
          this.ledgerSelect2.setElementValue('')
          this.setpaymentLedgerSelect2(index)
        } else if (+this.transactions[index].PayModeId === 1) {
          this.paymentLedgerselect2 = [{ id: '1', text: 'Cash' }]
          this.Paymode = this.transactions[index].Paymode
          this.PayModeId = this.transactions[index].PayModeId
          this.LedgerId = this.transactions[index].LedgerId
          this.ledgerName = this.transactions[index].ledgerName
          this.Amount = this.transactions[index].Amount
          this.PayDate = this._globalService.utcToClientDateFormat(this.transactions[index].PayDate, this.clientDateFormat)

          this.ChequeNo = this.transactions[index].ChequeNo
          this.paymodeSelect2.setElementValue(this.PayModeId)
          this.ledgerSelect2.setElementValue(this.LedgerId)
          this.deleteItem(type, index,Sno,editId,'')
        }
      } else {
        this.toastrService.showWarning('', 'First save Payment!')
      }

    }
    if (type === 'charge' && !this.editChargeId) {
      if (this.deleteEditChargeFlag) {
        
        this.editChargeId = editId
        this.snoForChargeId = Sno
        this.deleteEditChargeFlag = false
        this.additionChargeId = this.AdditionalChargeData[index].LedgerChargeId
        this.ledgerChargeValue = this.additionChargeId
        this.taxChargeId  = this.AdditionalChargeData[index].TaxSlabChargeId
          this.additionaChargeName = this.AdditionalChargeData[index].LedgerName
          this.AmountCharge = this.AdditionalChargeData[index].AmountCharge
          this.taxChargeName = this.AdditionalChargeData[index].taxslabName
          this.TaxTypeChargeName = this.AdditionalChargeData[index].TaxTypeChargeName
          this.TaxAmountCharge = this.AdditionalChargeData[index].TaxAmountCharge
          this.TotalAmountCharge = this.AdditionalChargeData[index].TotalAmountCharge
          this.chargeSelect2.setElementValue(this.AdditionalChargeData[index].LedgerChargeId)
          this.taxChargeSelect2.setElementValue(this.AdditionalChargeData[index].TaxSlabChargeId)
          this.taxTypeChargeSelect2.setElementValue(this.AdditionalChargeData[index].TaxTypeCharge)
          this.deleteItem(type, index,Sno, editId,this.AdditionalChargeData[index])

      } else {
        this.toastrService.showWarning('', 'First Save Charge !')
      }

    }
    

  }
  snoForPAymentId: any
  snoForChargeId : any
  taxslabChargeName: any
  @ViewChildren('atrColour_id') atrColorSelect2: QueryList<Select2Component>
  validateTransaction () {
    if (this.Paymode || +this.PayModeId > 0 || +this.LedgerId > 0 || this.ledgerName || +this.Amount > 0 || this.ChequeNo) {
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
          this.ChequeNoFlag = false
        } else {
          isValid = 0
          this.invalidObj['ChequeNo'] = true
          this.ChequeNoFlag = true
        }
      } else {
        this.invalidObj['ChequeNo'] = false
        this.ChequeNoFlag = false
      }
      this.validTransaction = !!isValid
    } else {
      this.validTransaction = true
    }
    this.clickTrans = false
  }

  // @ViewChild('currency_select2') currencySelect2: Select2Component

  @ViewChild('paymode_select2') paymodeSelect2: Select2Component

  ledger: any
  initialiseTransaction () {
    this.Paymode = ''
    this.PayModeId = 0
    this.LedgerId = 0
    this.Amount = this.Amount
    this.PayDate =  ''
    this.ChequeNo = ''
    this.paymode = 0
    this.ledgerBank = 0
    this.ledgerName = ''
    this.editTransId = 0
    this.clickTrans = false
    if (this.paymodeSelect2 && this.paymodeSelect2.selector.nativeElement.value) {
      this.paymodeSelect2.setElementValue('')
    }
    if (this.ledgerSelect2 && this.ledgerSelect2.selector.nativeElement.value) {
      this.ledgerSelect2.setElementValue('')
    }
  }

  select2PaymentModeId (event) {
    if(event.data[0].selected){
    if (event.value && event.data[0] && event.data[0].text) {
      this.Paymode = event.data[0].text
      this.PayModeId = event.value
      if (event.value === '3') {
        this.setpaymentLedgerSelect2(0)
      } else if (event.value === '1') {
        this.paymentLedgerselect2 = [{ id: '1', text: 'Cash' }]
        this.ledgerName = 'Cash'
        this.LedgerId = 1
      }
    }
    this.validateTransaction()
  }
  }
  paymentLedgerId (event) {
    if(event.data[0].selected){
    if (+event.value === -1 && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
      this.ledgerSelect2.selector.nativeElement.value = ''
      this._commonService.openLedger('')
    } else {
      if (event.value && event.data[0] && event.data[0].text) {
        this.LedgerId = event.value
        this.ledgerName = event.data[0].text
      }
    }
    this.validateTransaction()
  }
  }
  setpaymentLedgerSelect2 (i) {
    this.ledgerPlaceHolder = { placeholder: 'Select Ledger' }
    let newData = [{ id: UIConstant.BLANK, text: 'Select Ledger' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
    this._commonService.getPaymentLedgerDetail(9).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        data.Data.forEach(element => {
          newData.push({
            id: element.Id,
            text: element.Name
          })
        })
        newData = Object.assign([], newData)
      }
      this.paymentLedgerselect2 = newData
      if (data.Code === UIConstant.SERVERERROR) {
        this.toastrService.showError('',data.Description)
      }
    },
      (error) => {
        console.log(error)
      },
      () => {
        if (this.transactions.length > 0) {
          if (this.snoForPAymentId === this.transactions[i].Sno && this.transactions[i]) {
            this.Paymode = this.transactions[i].Paymode
            this.PayModeId = this.transactions[i].PayModeId
            this.LedgerId = this.transactions[i].LedgerId
            this.ledgerName = this.transactions[i].ledgerName
            this.Amount = this.transactions[i].Amount
            this.PayDate = this.transactions[i].PayDate
            this.ChequeNo = this.transactions[i].ChequeNo
            this.paymodeSelect2.setElementValue(this.PayModeId)
            this.ledgerSelect2.setElementValue(this.LedgerId)
            this.snoForPAymentId = 0
            this.deleteItem('trans', i,this.snoForPAymentId,this.transactions[i].Id,this.transactions)
          }
        }
      })
  }
  ChequeNoFlag: boolean
  addTransactions () {
    this.deleteEditPaymentFlag = true
    if (this.Paymode && this.PayModeId && this.LedgerId && this.ledgerName && this.Amount && this.PayDate && !this.ChequeNoFlag) {

      if (this.checkValidationForAmount()) {
        this.addTransaction()
        this.clickTrans = true
        this.initialiseTransaction()
        this.setPayDate()
      }
    }
  } PayModeId: any
  LedgerId: any
  payDateVar: any

  unBilledAmount () {
    let unBilledAmt = 0
    for (let i = 0; i <= this.transactions.length - 1; i++) {
      unBilledAmt = unBilledAmt + +this.transactions[i].Amount
    }
    unBilledAmt = (isNaN(+unBilledAmt)) ? 0 : +unBilledAmt
    this.netBillAmount = (isNaN(+this.netBillAmount)) ? 0 : +this.netBillAmount
    if (!this.clickTrans) {
      this.Amount = this.netBillAmount - unBilledAmt

    }
  }

  addTransaction () {
    let index ;
    this.payDateVar = this._globalService.clientToSqlDateFormat(this.PayDate, this.clientDateFormat)
    if (this.transactions.length === 0) {
      index =2
    } else {
       index = +this.transactions[this.transactions.length - 1].Sno + 1
    }
    this.transactions.push({
      Id: this.editTransId === 0 ? 0 : this.editTransId,
      Sno: index,
      Paymode: this.Paymode,
      PayModeId: this.PayModeId,
      LedgerId: this.LedgerId,
      ledgerName: this.ledgerName,
      Amount: this.Amount,
      PayDate: this.payDateVar,
      ChequeNo: this.ChequeNo
    })
    setTimeout(() => {
      this._commonService.fixTableHFL('pay_table')
    }, 1)
    if (this.editTransId !== 0) {
      this.transactions[this.transactions.length - 1].Id = this.editTransId
    }
    this.unBilledAmount()
  }
  applyCustomRateOnItemFlag: any
  localItemRate: any
  backDateEntry: boolean = false
  isManualBillNoEntry: boolean = false
  decimalDigit: any
  isInclusiveCaseBeforeDiscount: any
  getModuleSettingData () {
    let checkForCustomItemRate
    let checkForCatLevel
    let checkForBackDateEntry
    let checkforBillManualNo
    let decimalDigit
    let isInclusiveCaseBeforeDiscount
    this.applyCustomRateOnItemFlag = false
    this.localItemRate = true
    this.subscribe = this._commonService.getModulesettingAPI('Sale').subscribe(data => {
      if (data.Code === UIConstant.THOUSAND) {
        if (data.Data && data.Data.SetupMasters && data.Data.SetupMasters.length && data.Data.SetupClients.length > 0) {
          data.Data.SetupMasters.forEach(ele => {
            // check for item custom rate and apply for this custom rate // SetupId = 12 for apply custom Rate
            checkForCustomItemRate = data.Data.SetupClients.filter(s => (s.SetupId === ele.Id) && (ele.Id === 12))
            if (checkForCustomItemRate.length > 0) {
              this.applyCustomRateOnItemFlag = true

            }
            // check for category level
            checkForCatLevel = data.Data.SetupClients.filter(s => (s.SetupId === ele.Id) && (ele.Id === 1))
            if (checkForCatLevel.length > 0) {
              this.catLevel = JSON.parse(checkForCatLevel[0].Val)
              console.log(this.catLevel ,'catlebelll')

            }
            // back date entry
            checkForBackDateEntry = data.Data.SetupClients.filter(s => (s.SetupId === ele.Id) && (ele.Id === 58))
            if (checkForBackDateEntry.length > 0) {
              this.backDateEntry = JSON.parse(checkForBackDateEntry[0].Val)
              console.log(this.backDateEntry, 'date-setup')

            }
            //  id master 22 /Sale BillNo Manual Entry
            checkforBillManualNo = data.Data.SetupClients.filter(s => (s.SetupId === ele.Id) && (ele.Id === 22))
            if (checkforBillManualNo.length > 0) {
              this.isManualBillNoEntry = JSON.parse(checkforBillManualNo[0].Val)
              console.log(this.isManualBillNoEntry, 'manualEntry')

            }
            decimalDigit = data.Data.SetupClients.filter(s => (s.SetupId === ele.Id) && (ele.Id === 43))
            if (decimalDigit.length > 0) {
              this.decimalDigit = JSON.parse(decimalDigit[0].Val)
              console.log(this.decimalDigit ,'decimal')

            }
            isInclusiveCaseBeforeDiscount = data.Data.SetupClients.filter(s => (s.SetupId === ele.Id) && (ele.Id === 66))
            if (isInclusiveCaseBeforeDiscount.length > 0) {
              //this.isInclusiveCaseBeforeDiscount = isInclusiveCaseBeforeDiscount[0].Val
              this.isInclusiveCaseBeforeDiscount='2'
              console.log(this.isInclusiveCaseBeforeDiscount ,'Inclusive')
            }
            else{
              this.isInclusiveCaseBeforeDiscount='2'
            }

          })

        }
        console.log(this.backDateEntry, 'setupSetting-module')
      }
    })
  }
  itemSaleRate: any
  MrpRate: any
  itemCustomSaleRate: any
  getItemRateByLedgerData (ItemId, CustomerId) {
    
    this.itemSaleRate = 0
    this.itemCustomSaleRate = 0
    this.MrpRate = 0

    this.subscribe = this._commonService.getItemRateByLedgerAPI(ItemId, CustomerId).subscribe(Data => {
      if (Data.Code === UIConstant.THOUSAND) {
        if (this.applyCustomRateOnItemFlag) {
          if (Data.Data && Data.Data.ItemCustomRateWithItemDetails.length > 0) {
            this.Rate = Data.Data.ItemCustomRateWithItemDetails[0].SaleRate
            this.MrpRate = Data.Data.ItemCustomRateWithItemDetails[0].Mrp
            this.unitId = Data.Data.ItemCustomRateWithItemDetails[0].UnitId
            this.taxSlabId = Data.Data.ItemCustomRateWithItemDetails[0].TaxId
            this.UnitName = Data.Data.ItemCustomRateWithItemDetails[0].UnitName
            this.taxSlabName = Data.Data.ItemCustomRateWithItemDetails[0].TaxSlab
            this.taxSelect2.setElementValue(this.taxSlabId)
            this.unitSelect2.setElementValue(this.unitId)

          }
        }
        if (Data.Data && Data.Data.ItemDetails.length > 0) {
          this.unitId = Data.Data.ItemDetails[0].UnitId
          this.taxSlabId = Data.Data.ItemDetails[0].TaxId
          this.UnitName = Data.Data.ItemDetails[0].UnitName
          this.taxSlabName = Data.Data.ItemDetails[0].TaxSlab
          this.Rate = Data.Data.ItemDetails[0].SaleRate
          this.MrpRate = Data.Data.ItemDetails[0].Mrprate
          this.taxSelect2.setElementValue(this.taxSlabId)
          this.unitSelect2.setElementValue(this.unitId)

        }

        this.onChangeSlabTax('item',this.taxSlabId,'')
        this.calculate()
      }
    })

  }
  caseSaleCheckOtherState (addressID) {
    if (this.officeAddressId === addressID) {
   
      this.taxRateForOtherStateFlag = true
    } else {
      this.taxRateForOtherStateFlag = false
    }
    return this.taxRateForOtherStateFlag
  }
  checkOtherStateForNewItemAdd (addressID) {
    console.log(this.officeAddressId,addressID,'address org-stateid')
    if (this.officeAddressId === addressID) {
      this.taxRateForOtherStateFlag = false
    } else {
      this.taxRateForOtherStateFlag = true
    }
    return this.taxRateForOtherStateFlag
  }
  categories: any
  createModels (levels) {
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
  }
  loading: boolean
  catLevel: any = 3
  allCategories: any = []
  getCatagoryDetail (data) {
    for (let i = 0; i < this.catLevel; i++) {
      if (this.categories[i]) {
        this.categories[i].data = [{ id: '0', text: 'Select Category' }]
      }
    }
    this.allCategories = [...data]
    let _self = this
    data.forEach(category => {
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

    if (this.catLevel > 1) {
      if (+evt.value > 0) {
        if (levelNo === this.catLevel) {
          if (this.categoryId !== +evt.value) {
            this.categoryId = +evt.value
            this.categoryName = evt.data[0].text
            console.log('categoryname : ', this.categoryName)
            console.log('category id : ', this.categoryId)
            this.getItemByCategoryid(+evt.value)

            if (this.updatedFlag) {
              this.updateCategories(+evt.value)

            }
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
          this.getItemByCategoryid(+evt.value)
          if (this.updatedFlag) {
            this.updateCategories(+evt.value)

          }
        }
      }
    }
  }

  parentMostCategory: any
  @ViewChildren('cat_select2') catSelect2: QueryList<Select2Component>

  updateCategories (childmostId) {
    let categoryId = childmostId
    this.getParentMostCat(childmostId, this.catLevel)
    categoryId = this.parentMostCategory
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
  getParentMostCat (id, level) {
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

  updateLastBillNo (date, orgNo) {
    let dateChnage = this._globalService.clientToSqlDateFormat(date, this.clientDateFormat)
    this._commonService.getLastBillNo(UIConstant.SALE_TYPE, dateChnage, orgNo).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND && data.Data.length > 0) {
        this.lastBillNo = data.Data[0].BillNo
        console.log(this.lastBillNo, 'last-bill')

      }
    })

  }

  caseCustomerName: any
  customerMobileNo: any
  CustomerAddress: any
  CustomerEmail: any
  areaID: any
  cityId: any
  countrId: any
  customerStateId: any

  @ViewChild('countryCode_select2') countryCodeselect2: Select2Component
  @ViewChild('areaSelecto2') areaSelect2: Select2Component
  @ViewChild('country_select2') countryselect2: Select2Component
  @ViewChild('state_select2') stateselect2: Select2Component
  @ViewChild('city_select2') cityselect2: Select2Component
  countryError: any
  countryName: any
  selectCountryListId (event) {
    if (event.data.length > 0) {
      this.countrId = event.value
      this.countryName = event.data[0].text
      this.countryError = false
      if (this.countrId > 0) {
        this.getStaeList(this.countrId, 0)

      }
    }
  }
  countryValue: any
  getCountry (value) {
    this.subscribe = this._coustomerServices.getCommonValues('101').subscribe(Data => {
      this.countryListPlaceHolder = { placeholder: 'Select Country' }
      this.countryList = [{ id: UIConstant.BLANK, text: 'select Country' }]
      Data.Data.forEach(element => {
        this.countryList.push({
          id: element.Id,
          text: element.CommonDesc
        })
      })
      this.countryValue = value
    })
  }
  stateValuedata: any
  areNameId: any
  getStaeList (id, value) {
    this.subscribe = this._coustomerServices.gatStateList(id).subscribe(Data => {
      this.stateListplaceHolder = { placeholder: 'Select State' }
      this.stateListCustomer = [{ id: UIConstant.BLANK, text: 'select State' }]
      Data.Data.forEach(element => {
        this.stateListCustomer.push({
          id: element.Id,
          text: element.CommonDesc1
        })
      })
      this.stateValuedata = value
    })
  }

  StateName: any
  selectState (event) {

    // console.log(event ,"sts")
    if (event.data.length > 0) {
      this.customerStateId = event.value
      this.StateName = event.data[0].text
      this.stateError = false
      if (this.customerStateId > 0) {
        this.getCitylist(this.customerStateId, 0)
      }
    }
  }
  cityValue: any
  getCitylist (id, value) {
    this.subscribe = this._coustomerServices.getCityList(id).subscribe(Data => {
      this.cityList = []
      Data.Data.forEach(element => {
        this.cityList.push({
          id: element.Id,
          text: element.CommonDesc2
        })
      })
      this.cityValue = value
    })
  }
  cityError: boolean
  cityName: any
  selectedCityId (event) {
    if (event.data.length > 0) {
      this.cityId = event.value
      this.cityName = event.data[0].text
      this.cityError = false
      if (this.cityId > 0) {
        this.getAreaId(this.cityId)
      }
    }
  }

  private getAreaId (id) {

    // this.openAreaModel()
    this.subscribe = this._coustomerServices.getAreaList(id).subscribe(Data => {
      console.log(' area list : ', Data)
      this.areaListPlaceHolder = { placeholder: 'Select Area' }
      this.areaList = [{ id: UIConstant.BLANK, text: 'select Area' }, { id: '0', text: '+Add New' }]
      if (Data.Code === 1000 && Data.Data.length > 0) {
        Data.Data.forEach(element => {
          this.areaList.push({
            id: element.Id,
            text: element.CommonDesc3
          })
        })

      }

     // console.log(this.areaList, Data.Data, "arelist")

    })
  }
  selectedArea (event) {
    if (event.data.length > 0) {
      if (event.data[0].selected) {
        if (event.data[0].id !== '0') {
          if (event.data[0].text) {
            this.areaID = event.value
           // this.areaName = event.data[0].text
          }
        }
      }
    }
  }

  validateEmail (email) {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
  }
  checkIsValidMobileNo: any
  checkvalidEmail: boolean
  customerClick: boolean
  checkValidEmail () {
    let email = this.customerForm.value.CustomerEmail
    if (email !== '' && email !== null) {
      if (this.validateEmail(email)) {
        this.checkvalidEmail = false
      } else {
        this.checkvalidEmail = true
      }
    } else {
      this.checkvalidEmail = false
    }
  }
  // validateMobile (mobile) {
  //   let regx = /\[0-9]/g
  //   return regx.test(mobile)
  // }
  checkValidMobile () {
    let mobile = JSON.stringify(this.customerForm.value.customerMobileNo)

    if (mobile !== '' && mobile !== null) {
      if (this.validmobileLength === mobile.length) {
        this.checkIsValidMobileNo = true
      } else {
        this.checkIsValidMobileNo = false
      }
    } else {
      this.checkIsValidMobileNo = false
    }
  }
  checkOnInputMobile (e) {
   // console.log(e,'jj--')
    let d = e.target.value
    if (d.length === this.validmobileLength) {
      document.getElementById('mobileId').className += ' successTextBoxBorder'
      document.getElementById('mobileId').classList.remove('errorTextBoxBorder')
    } else {
      document.getElementById('mobileId').className += ' errorTextBoxBorder'
    }
  }
  CaseCustId: any
  countryCodeFlag: any
  addCaseCustomer () {

    this.checkValidEmail()
    this.checkValidMobile()
    this.customerClick = true
    if (this.customerForm.value.caseCustomerName !== '' && this.customerForm.value.caseCustomerName !== null && this.customerForm.value.customerMobileNo !== null && this.customerForm.value.customerMobileNo !== '' && !this.checkvalidEmail && this.checkIsValidMobileNo) {
      this.caseSaleCustomerDetails = [{
        Id: this.CaseCustId === 0 ? this.CaseCustId : this.CaseCustId,
        Name: this.customerForm.value.caseCustomerName,
        MobileNo: this.customerForm.value.customerMobileNo,
        Email: this.customerForm.value.CustomerEmail,
        AreaId: this.areaID,
        CityId: this.cityId,
        CountryId: this.countrId,
        StateId: this.customerStateId,
        Address: this.customerForm.value.CustomerAddress,
        CountryCode: this.CountryCode
      }]
      console.log(this.caseSaleCustomerDetails ,'customer-add')
      if (!this.editMode) {
        this.customerForm.reset()
        this.countryCodeFlag = '0'
        this.getCountry(0)
      }
      this.clearCaseCustomer()
    
      $('#cust_detail_m').modal(UIConstant.MODEL_HIDE)
    }

  }
  clearCaseCustomer (){
    this.customerForm.reset()  
    this.countryCodeFlag = '0' 
  }
  countryListWithCode: any
  searchCountryCodeForMobile (name) {
    this.subscribe = this._commonService.searchCountryByName(name).subscribe(Data => {
      if (Data.Code === 1000 && Data.Data.length > 0) {
        this.countryListWithCode = []
        let newdataList = [{ id: '0',text : 'select code',PhoneCode : '0' , Length: 0 }]
        Data.Data.forEach(element => {
          newdataList.push({
            id : element.Phonecode,
            text : '+' + element.Phonecode + '-' + element.Name,
            PhoneCode : element.Phonecode,
            Length : element.Length
          })
        })
        this.countryListWithCode = newdataList
      } else {
        this.toastrService.showError('', Data.Description)

      }
    })
  }
  validmobileLength: any
  CountryCode: any
  countryCodeId: any
  disbledInputMobileFlag: boolean
  onCountryCodeSelectionChange = (event) => {
    if (event.data.length > 0) {
      if (event.data[0].id !== '0') {
       // this.countryCodeId = event.value
        this.disbledInputMobileFlag = false
        this.CountryCode = event.data[0].PhoneCode
        this.validmobileLength = event.data[0].Length
      } else {
        this.disbledInputMobileFlag = true
      }
    }
  }

  enterPaymentSave (e: KeyboardEvent) {
    e.preventDefault()
    this.addTransactions()
    setTimeout(() => {
      this.paymodeSelect2.selector.nativeElement.focus()
    }, 10)

  }
  AmountCharge: any =0
  TaxAmountCharge: any =0
  TotalAmountCharge: any
  additionaChargeName: any
  additionChargeId: any
  addAdditionCharge () {
    this.deleteEditChargeFlag = true

    this.validationCharge()
  if (this.additionaChargeName && +this.additionChargeId > 0  && +this.AmountCharge > 0) {
    this.createChargeArray()
    this.alreadySelectCharge(+this.additionChargeId, this.additionaChargeName,true)
 
    this.clickSaleAdditionCharge = true
    this.calculateAllTotal()
    this.inilizeAdditionCharge()
    
  }
}
validChargeLedger : boolean
validChargeAmount: boolean


validationCharge () {
let isValid = 1
if (this.additionChargeId>0) {
  this.invalidObj['additionChargeId'] = false
} else {
  this.invalidObj['additionChargeId'] = true
  isValid = 0
}
if (this.AmountCharge>0) {
  this.invalidObj['AmountCharge'] = false
} else {
  this.invalidObj['AmountCharge'] = true
  isValid = 0
}

return !!isValid
}



inilizeAdditionCharge () {
  this.additionaChargeName = ''
  this.additionChargeId = 0
  this.TaxAmountCharge = 0
  this.taxChargeId = 0
  this.AmountCharge = 0
  this.editChargeId = 0
  this.TotalAmountCharge =0
  this.taxChargeName=''
  this.allTaxRateForItem=[]
  this.clickSaleAdditionCharge = false
  if (this.taxChargeSelect2 && this.taxChargeSelect2.selector.nativeElement.value) {
    this.taxChargeSelect2.setElementValue('')
  }
  if (this.chargeSelect2 && this.chargeSelect2.selector.nativeElement.value) {
    this.chargeSelect2.setElementValue('')

  }
}


createChargeArray () {
  let sendForTaxSummery=[]
  let index;
  let taxForChargeSlab;
  if (this.AdditionalChargeData.length === 0) {
     index =2
    taxForChargeSlab = this.taxCalculationForCharge(index)

  } else {
     index = +this.AdditionalChargeData[this.AdditionalChargeData.length - 1].Sno + 1
    taxForChargeSlab = this.taxCalculationForCharge(index)

  }
  this.AdditionalChargeData.push({
    type:'charge',
    Id: this.editChargeId === 0 ? 0 : this.editChargeId,
    Sno: index,
    LedgerChargeId : this.additionChargeId,
    LedgerName :this.additionaChargeName,
    AmountCharge : this.AmountCharge,
    TaxSlabChargeId :this.taxChargeId,
    taxslabName: this.taxChargeName,
    TaxAmountCharge : this.TaxAmountCharge,
    TotalAmountCharge : this.TotalAmountCharge,
    TaxTypeCharge  :    this.taxTypeChargeId ,
    TaxTypeChargeName: this.TaxTypeChargeName,
  })
  sendForTaxSummery.push({
    type:'charge',
    Id: this.editChargeId === 0 ? 0 : this.editChargeId,
    Sno: index,
    LedgerChargeId : this.additionChargeId,
    LedgerName :this.additionaChargeName,
    AmountCharge : this.AmountCharge,
    TaxSlabChargeId :this.taxChargeId,
    taxslabName: this.taxChargeName,
    TaxAmountCharge : this.TaxAmountCharge,
    TotalAmountCharge : this.TotalAmountCharge,
    TaxTypeCharge  :    this.taxTypeChargeId ,
    TaxTypeChargeName: this.TaxTypeChargeName,
    taxItems: taxForChargeSlab
  })

  setTimeout(() => {
    this._commonService.fixTableHFL('charge_table')
  }, 1)
  if (this.editChargeId !== 0) {
    this.AdditionalChargeData[this.AdditionalChargeData.length - 1].Id = this.editChargeId
  }
  this.getBillingSummery(sendForTaxSummery)

  console.log(this.AdditionalChargeData ,'charge')
 
}
taxSlabSummery: any
ParentTypeTaxId: any
getBillingSummery(data) {
  
  data.forEach(item=>{
    let taxDetails = item.taxItems.filter(s=>s.itemTransSno === item.Sno)
    if(item.type ==='items' && taxDetails.length >0){
      this.ParentTypeTaxId = 6
      taxDetails.forEach(data=>{
      this.taxSlabSummery.push({
        id: 0,
        TaxTypeTax: item.TaxType,
        AmountTax:data.AmountTax ,
        editSno:data.Id,
        ItemTransTaxId:item.Sno,
        ParentTaxId:0,
        ParentTypeTaxId:this.ParentTypeTaxId ,
        ItemTransTypeTax:6,
        TaxRateId:data.id,
        TaxRate:data.TaxRate,
        ValueType:data.TaxType,
        TaxSlabName:data.TaxName,
        TaxRateNameTax:data.TaxRateNameTax,
        taxSlabId:data.taxSlabId,
        type:'items'
   })

  })
    }
    if(item.type ==='charge' && taxDetails.length >0){
      this.ParentTypeTaxId = 22
      taxDetails.forEach(data=>{
        this.taxSlabSummery.push({
          id:0,
          TaxTypeTax: item.TaxTypeCharge,
          AmountTax:data.AmountTax ,
          ItemTransTaxId:item.Sno,
          editSno:data.Id,
          ParentTaxId:0,
          ParentTypeTaxId:this.ParentTypeTaxId ,
          ItemTransTypeTax:6,
          TaxRateId:data.id,
          TaxRate:data.TaxRate,
          ValueType:data.TaxType,
          TaxSlabName:data.TaxName,
          TaxRateNameTax:data.TaxRateNameTax,
          taxSlabId:data.taxSlabId,
          type:'charge'
     })

    })
    }

  })
  console.log( this.taxSlabSummery,"summery")
  this.showBillingSummery(this.taxSlabSummery)
}
showtaxSlab: any
showBillingSummery (data){
  
  this.showtaxSlab =[]
  let groupOnId = _.groupBy(data, (tax) => {
    return tax.TaxRateId
  })
  console.log(groupOnId)
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
      this.showtaxSlab.push(obj)
    }
  }


}

 @ViewChild('taxTypeCharge_select2') taxTypeChargeSelect2: Select2Component

 enterDownCharge (evt: KeyboardEvent) {
  this.addAdditionCharge()
  setTimeout(() => {
    this.chargeSelect2.selector.nativeElement.focus()
  }, 10)
}
}
