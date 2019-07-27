import { Component, Renderer2, ViewChild, ViewChildren, QueryList } from '@angular/core'
import { Subscription ,Subject } from 'rxjs'
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
import { SetUpIds } from 'src/app/shared/constants/setupIds.constant'
import { IfStmt } from '@angular/compiler';
import { timeout } from 'q';
import { SaleCommonService } from '../../saleCommon.service';
import { TouchSequence } from 'selenium-webdriver';
declare const _: any
declare var $: any
declare var flatpickr: any
import { Router } from '@angular/router'
import {AuthService} from 'src/app/commonServices/auth.service'
import { takeUntil } from 'rxjs/operators';
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
  RoundOffManual: number
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
  Discount: number
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
  public ledgerChargePlaceHolder: Select2Options
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
  clickSaleAdditionCharge: boolean = false
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
  MainEditID: any
  AdditionalChargeData: any
  IsForOtherState: any;
  isAddNew: boolean
  constructor(public _saleCommonService: SaleCommonService, public _endSessionApi :AuthService ,public _router: Router,public _setUpIds: SetUpIds, private _coustomerServices: VendorServices, private _formBuilder: FormBuilder, private renderer2: Renderer2, public _globalService: GlobalService, private _itemmasterServices: ItemmasterServices, private _categoryServices: CategoryServices,
    private _ledgerServices: VendorServices,
    private toastrService: ToastrCustomService,
    public _commonService: CommonService,
    public _settings: Settings) {
    this.ATTRIBUTE_PARENTTYPEID = 6
    this.addCustomerForm()
    this.clientNameSelect2 = []
    this.suplierNameSelect2 = []
    this.paymentModeSelect2 = []
    this.destinationSelect2 = []
    this.sendAttributeData = []
    this.parcelBySelect2 = []
    this.AdditionalChargeData = []
    this.DiscountType = '0'
    this.InterestRateType = 0
    this.CommisionRateType = 0
    this.totalDiscount = 0
    this.totalTaxAmount = 0
    this.DiscountPerItem = 0
    this.totalBillAmount = 0

    // for new add unit
    this.newCustAddSub = this._commonService.getUnitStatus().subscribe(
      (data: AddCust) => {

        let unitFlg = true
        if (data.id && data.name) {
          let newData = Object.assign([], this.unitDataType)
          newData.forEach(element => {
            if (element.id === data.id) {
              unitFlg = false
              this.unitDataType = newData
            }
          });
          if (unitFlg) {
            newData.push({ id: data.id, text: data.name })
          }
          this.unitDataType = newData
          this.unitId = data.id
          this.getUnitId = data.id
          setTimeout(() => {
            if (this.unitSelect2) {
              const element = this.renderer2.selectRootElement(this.unitSelect2.selector.nativeElement, true)
              element.focus({ preventScroll: false })
            }
          }, 500)
        }
      }
    )
    this.newAttributeADDModel1 = this._commonService.getAttributeStatus().subscribe(
      (Attri: AddCust) => {
        if (Attri.id > 0) {
          if (this.attributesLabels.length > 0) {
            for (let i = 0; i < this.attributesLabels.length; i++) {
              if (this.allAttributeData[i].attributeId === Attri.AttributeId) {
                let newData = Object.assign([], this.allAttributeData[i].data)
                newData.push({ id: Attri.id, text: Attri.name, AttributeId: Attri.AttributeId })
                this.allAttributeData[i].data = newData
                this.attrinuteSetDataId = Attri.id
                this.attributeValue=Attri.id
              }
            }
          }
        }
      }
    )

    this.newTaxSlabAddSub = this._commonService.getTaxStatus().subscribe(
      (data: AddCust) => {
        let unitFlg = true
        if (data.id && data.name) {
          let newData = Object.assign([], this.taxSlabSelectoData)
          newData.forEach(element => {
            if (element.id === data.id) {
              unitFlg = false
              this.taxSlabSelectoData = newData
            }
          });
          if (unitFlg) {
            newData.push({ id: data.id, text: data.name })
          }
          this.taxSlabSelectoData = newData
          this.taxSlabId = data.id
          setTimeout(() => {
            if (this.taxSelect2) {
              const element = this.renderer2.selectRootElement(this.taxSelect2.selector.nativeElement, true)
              element.focus({ preventScroll: false })
            }
          }, 500)
        }
      }
    )

    this.itemAddSub = this._commonService.getItemMasterStatus().subscribe(
      (data: AddCust) => {

        console.log(data, 'Item_address')
        if (data.id && data.name) {
          let newData = Object.assign([], this.itemCategoryType)
          newData.push({ id: data.id, text: data.name })
          this.itemCategoryType = newData
          this.itemCategoryId = +data.id
          // this.categoryId = data.categoryId

          setTimeout(() => {
            if (this.itemSelect2) {
              const element = this.renderer2.selectRootElement(this.itemSelect2.selector.nativeElement, true)
              element.focus({ preventScroll: false })
            }
          }, 2000)
          setTimeout(() => {
            this.categoryId = this.AlreadySelectCategoryId
            this.categoryName = this.AlreadySelectCategoryName
            this.updateCategories(this.AlreadySelectCategoryId)
          }, 100)
          this.getItemRateByLedgerData(+data.id, this.clientNameId)

          

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
          setTimeout(() => {
            this.clientSelect2.selector.nativeElement.focus()
          }, 1000)
        }

      }
    )
    this.newNewAddress = this._commonService.getAddressStatus().subscribe(
      (data: AddCust) => {

        if (data.id && data.name) {
          let newData = Object.assign([], this.stateList)
          newData.push({ id: data.id, text: data.name })
          this.stateList = newData
          this.stateListShip = newData
          this.stateValue = data.id
          this.stateShippingValue = data.id
          this.stateId = +data.stateId
          this.SupplyStateId = +data.stateId

          this.checkOtherStateForNewItemAdd(JSON.parse(data.stateId))

        }
      }
    )
    this.additionChargeLedgerModel = this._commonService.getledgerCretionStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
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
            this.MainEditID = 0
            this.CaseCustId = 0
            this.getCurrentDate()
          } else {
            this.editMode = true
            this.editRowListFlag = false
            this.Id = status.editId
            this.MainEditID = status.editId

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
          this.categoryId = data.id
          let categoryName = data.name
          this.isAddNew = true
          this.getAllCategories(categoryName, this.categoryId, this.isAddNew)
        }

      }
    )
  }
  ledgerChargeValue: any
  editRowListFlag: any
  // ngAfterContentInit (){
  // let value =   this._endSessionApi.endSession();
  // console.log(value ,'session-ecpiry')
  // }
  ngOnInit() {
    //let value  = this._saleCommonService.getNewData(this.industryId)
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

  initComp() {
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

  getAllCategories(categoryName, categoryId, isAddNew) {
    this._commonService.getAllCategories().subscribe(
      data => {
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
          let evt = { value: categoryId, data: [{ text: categoryName }] }
          this.onSelectCategory(evt, levelNo)
        }
      }
    )
  }
  gstinTypeOfOrgnization:any
  getOrgnization(data) {
    if (data.Data && data.Data.Organizations && data.Data.Organizations.length > 0) {
      this.setupOrganization = data
      console.log(data.Data)
      this.organizationData = []
      let newTempOrg = []
      this.orgnazationPlaceHolder = { placeholder: 'Select Organization' }
      newTempOrg = [{ id: UIConstant.BLANK, text: 'Select  Organization' }]
      data.Data.Organizations.forEach(ele => {
        newTempOrg.push({
          id: ele.Id,
          text: ele.Name,
          gstinType:ele.GstTypeId
        })
      })
      this.gstinTypeOfOrgnization  = data.Data.Organizations[0].GstTypeId
      console.log(this.gstinTypeOfOrgnization  ,'GST-TYPE-ORG')
      this.organizationData = newTempOrg
      this.orgNameId = this.organizationData[1].id
      this.orgnizationSelect2.setElementValue(this.orgNameId)

    }
  }
openTranctionBillNo(){
  this.redirectToTranspageFlag=true
  this._router.navigate(['organization/transaction-number']);
}

  redirectToTranspageFlag:boolean = false
  getSPUtilityDataBilling() {
    // SPUtility API; For get all data of API
    this.subscribe = this._commonService.getSPUtilityData(UIConstant.SALE_TYPE).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND) {
        if (data.Data && data.Data.TransactionNoSetups.length > 0) {
          if (!this.editMode && this.editRowListFlag) {
           this.setCurrentDate(data.Data.TransactionNoSetups)
            
            if (this.isManualBillNoEntry) {
              this.BillNo = ''
              this.updateLastBillNo(this.InvoiceDate, this.orgNameId)
            } else {
              
              if(data.Data.TransactionNoSetups[0].BillNo !== '' || data.Data.TransactionNoSetups[0].BillNo !==null){
                this.BillNo = data.Data.TransactionNoSetups[0].BillNo
              }
              else{
                this.redirectToTranspageFlag=true
                this.toastrService.showError('Please Set Bill Number Series','')
               // this.openTranctionBillNo()
          

              }
             

            }
          }

        }
        if (data.Data && data.Data.Organizations.length > 0) {
          this.getOrgnization(data)
        }
        this.allAttributeData = []
        this.attributesLabels = []
        if (data.Data && data.Data.AttributeValueResponses && data.Data.AttributeValueResponses.length > 0) {

          let AttributeDetails = this.CreateDynamicAttributes(data.Data)
          this.attributesLabels = AttributeDetails.attributeKeys
          this.allAttributeData = AttributeDetails.attributesData
        }
        if (this.editMode) {
          this.isManualBillNoEntry = false
          this.itemTableDisabledFlag = false
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

        this.getTaxTypeExcluInclusiv()


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
        if (newGodown.length > 0) {
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
        this.additionChargeLedger = []
        let newAdditionCharge = []
        this.ledgerChargePlaceHolder = { placeholder: 'Select  Charge' }
        newAdditionCharge = [{ id: UIConstant.BLANK, text: 'Select Charge' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
        if (data.Data ) {
          this.reUseAdditionalCharge = data.Data.LedgerCharges
          this.getAddtionalCharge()
        }

        // if(data.Data && data.Data.LedgerCharges.length >0){


      }
      // if(data.Code === 5002){
      //   localStorage.clear();
      // this._router.navigate(['login'])

      // }
    })
  }
  reUseAdditionalCharge: any
  unitForFilterItem: any
  additionChargeLedger: any
  get add() { return this.customerForm.controls }
  setCurrencyId: any
  officeAddressId: any
  getAddtionalCharge() {
    this.additionChargeLedger = []
    let newAdditionCharge = [{ id: UIConstant.BLANK, text: 'Select Charge' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]

    if (this.reUseAdditionalCharge.length > 0) {
      this.reUseAdditionalCharge.forEach(element => {
        newAdditionCharge.push({
          id: element.Id,
          text: element.Name
        })
      })
    }
    this.additionChargeLedger = newAdditionCharge
  }
  getTaxTypeExcluInclusiv() {
    let newDataTaxType = [{ id: '0', text: 'Exclusive' }, { id: '1', text: 'Inclusive' }]
    this.taxTypeSelectData = newDataTaxType
    this.TaxTypeId = this.taxTypeSelectData[0].id
    this.taxTypeForItem.setElementValue(this.TaxTypeId)
  }
  @ViewChild('charge_select2') chargeSelect2: Select2Component
  onChangeCharge(event) {
    if (event.data[0].selected) {
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

  alreadySelectCharge(chargeId, name, enableflag) {
    this.additionChargeLedger.forEach(data => {
      let index = this.additionChargeLedger.findIndex(
        selectedItem => selectedItem.id === chargeId)
      if (index !== -1) {
        this.additionChargeLedger.splice(index, 1)
        let newData = Object.assign([], this.additionChargeLedger)
        newData.push({ id: chargeId, text: name, disabled: enableflag })
        this.additionChargeLedger = newData
      }

    })

  }

  onSelectCurrency(event) {
    if (event.data.length > 0) {
      if (event.data && event.data[0].text) {
        this.CurrencyId = event.value
        this.defaultCurrency = event.data[0].text
        console.log(this.defaultCurrency, 'ggggg--------------')
        this.currencyValues[1] = { id: 1, symbol: event.data[0].text }

      }
    }

  }
  godownName: any
  onChangeGodown(event) {
    if (event.data.length > 0) {
      this.godownId = event.value
      this.godownName = event.data[0].text

    }
  }
  referalsID: any
  onChangeReferals(event) {
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
  onChangeTaxTypeExclusiveInclusive(event) {

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
  onChangeTaxTypeCharge(event) {
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
  onChangeReferalsType(event) {
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
  onChangeCommissionType(event) {
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
  onChangeAttribute(event, indexAttribute, attributeData) {

    let editAttributValue
    let attributeEdit = this.editAttributeData
    let editAttrId = 0
    if (event.data.length > 0) {
      if (event.data[0].id !== '-1') {
        if (event.data[0].text) {
          this.AttrValueId = event.data[0].id
          this.existId = attributeData.attributeId
          if (attributeEdit !== undefined) {

            editAttributValue = this.editAttributeData.filter(value => value.AttributeValueId === this.existId)
            if (editAttributValue.length > 0) {
              let index = this.sendAttributeData.findIndex(n => n.Id === editAttributValue[0].Id)

              editAttrId = editAttributValue[0].Id
              this.trsnItemId = editAttributValue[0].ItemTransId
              this.sendAttributeData.splice(index, 1)
            }

          }
          if (this.editItemId > 0 && this.editAttributeData.length === 0) {
            //this.trsnItemId =  this.editItemId
            this.trsnItemId = this.items.length + 1
            for (let i = 0; i < this.items.length; i++) {
              if (this.trsnItemId === this.items[i].Sno) {
                this.trsnItemId = this.trsnItemId + 1
              }
            }
          }
          if (this.editItemId === 0 && this.items.length > 0) {
            this.trsnItemId = this.items.length + 1
            for (let i = 0; i < this.items.length; i++) {
              if (this.trsnItemId === this.items[i].Sno) {
                this.trsnItemId = this.trsnItemId + 1
              }
            }

          }
          this.attributeName = event.data[0].text
          this.attributeIndex = indexAttribute
          this.itemAttribute(this.existId, this.attributeIndex, editAttrId)
        }
      } else {
        let data = {
          addNewId: attributeData.attributeId,
          attrNameId: attributeData.attributeId,
          attrValue: attributeData.attributeId,
          disabledAddButton: true

        }

        this.atrColorSelect2.forEach((item: Select2Component, index: number, array: Select2Component[]) => {
          item.selector.nativeElement.value = ''

        })

        this._commonService.openAttribute(data, true)

      }
    }
  }
  itemsAttribute: any
  itemAttribute(existid, attrIndex, AttrEditId) {
    if (this.itemsAttribute.length > 0) {
      let data = this.itemsAttribute.filter(s => s.existId === existid)
      let index = this.itemsAttribute.findIndex(n => n.existId === existid)
      if (data.length > 0) {
        let newArray = {
          Id: AttrEditId,
          Index: attrIndex,
          Sno: this.trsnItemId,
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
          Sno: this.trsnItemId,
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
        Sno: this.trsnItemId,
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
  getFreightValueData() {
    this.freightByData = []
    this.frightPlaceholder = { placeholder: 'Select freight ' }
    this.freightByData = [{ id: '0', text: 'Paid' }, { id: '1', text: 'To-pay' }]
    this.freightById = this.freightByData[0].id
    this.freightByValue = this.freightByData[0].id
  }

  getCommisionTypeValue() {
    this.CommissionType = []
    this.CommissionTypePlcaholder = { placeholder: 'Select Commission ' }
    this.CommissionType = [{ id: '0', text: 'Select Commission' }, { id: '1', text: '%' }, { id: '2', text: '$' }]
    this.CommissionTypeID = this.CommissionType[1].id
  }
  onChangeFreight(event) {
    if (event.data.length > 0) {
      if (event.data[0].text) {
        this.freightById = event.value
      }

    }
  }
  UnitName: any
  onSelectUnitId(event) {
    if (event.data.length > 0) {
      if (event.data[0].id !== UIConstant.BLANK) {
        if (event.value === '-1' && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
          this.unitSelect2.selector.nativeElement.value = ''
          this._commonService.openUnit('')
          //this.unitDataType.selector.nativeElement.value = ''
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
  taxChargeId: any
  taxChargeName: any
  onChangeTaxCharge(event) {
    if (event.data.length > 0) {
      if (event.data[0].id !== '') {
        if (event.value === '-1' && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
          this.taxChargeSelect2.selector.nativeElement.value = ''
          this._commonService.openTax('')
        } else {
          if (event.data[0] && event.data[0].text) {
            this.taxChargeId = event.value
            this.taxChargeName = event.data[0].text
            this.getTaxDetail(this.taxChargeId)
            this.onChangeSlabTax('charge', this.taxChargeId, this.taxChargeName)
          }
        }
      }
    }
  }
  onChangeTaxSlabType(event) {
    if (event.data.length > 0) {
      if (event.data[0].id !== '') {
        if (event.value === '-1' && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
          this.taxSelect2.selector.nativeElement.value = ''
          this._commonService.openTax('')
        } else {
          if (event.data[0] && event.data[0].text) {
            this.taxSlabId = event.value
            this.taxSlabName = event.data[0].text
            this.getTaxDetail(this.taxSlabId)
            this.onChangeSlabTax('item', this.taxSlabId, this.taxSlabName)
          }
        }
      }
    }
  }
  taxRate: any
  allTaxRateForItem: any
  allTaxRateForCharge: any
  alltaxVATTax: any 
  taxRates:any =[]
  taxSlabType:any
  getTaxDetail (TaxSlabId) {
    debugger
    this._commonService.onChangeSlabGetTaxRate(TaxSlabId).subscribe(
      data => {
        console.log('tax slab data : ', data)
        if (data.Code === UIConstant.THOUSAND && data.Data) {
          this.taxSlabType = (data.Data.TaxSlabs[0]) ? data.Data.TaxSlabs[0].Type : 0
          this.taxRates = data.Data.TaxRates
        //  this.validateItem()
        //  this.calculate()
        //  this.createTaxes(FormConstants.PurchaseForm)
          //this.getBillSummary()
        }
      }
    )
  }
  onChangeSlabTax(type, slabId, SalbName) {
    if(!this.taxDisabledFlag){
    if (slabId > 0 && slabId !== '' && slabId !== undefined && slabId !== null) {
      this.subscribe = this._commonService.onChangeSlabGetTaxRate(slabId).subscribe(data => {
        if (data.Code === UIConstant.THOUSAND) {
          if (data.Data && data.Data.TaxSlabs.length > 0) {
              this.allTaxRateForItem = []
              if (data.Data.TaxSlabs[0].Type !== UIConstant.ONE) {
                if (data.Data && data.Data.TaxRates.length > 0) {
                  data.Data.TaxRates.forEach(ele => {
                    this.allTaxRateForItem.push({
                      id: ele.Id,
                      TaxRate: ele.TaxRate,
                      TaxType: ele.ValueType,
                      taxSlabName: ele.Name,
                      taxSlabId: ele.SlabId,
                      TaxName: SalbName

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
                        taxSlabName: ele.Name,
                        taxSlabId: ele.SlabId,
                        TaxName: SalbName
                      })
                    }

                  })

                }
              }
            
         
            this.calculate()
          }
        }
        if (data.Code === UIConstant.SERVERERROR) {
          this.toastrService.showError('', data.Description)
        }
      })
    }
  }
  else{
    this.allTaxRateForItem=[]
    this.allTaxRateForCharge=[]
  }
  }
  clientNameId: any
  @ViewChild('client_select2') clientSelect2: Select2Component
  @ViewChild('unit_select2') unitSelect2: Select2Component
  @ViewChild('tax_select2') taxSelect2: Select2Component
  isCaseSaleFlag: boolean
  onSelected2clientId(event) {
    if (event.data.length > 0) {
      this.stateList = []
      if (event.data && event.data[0].id !== '') {
        if (event.value === '-1' && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
          this.clientSelect2.selector.nativeElement.value = ''
          this._commonService.openCust('', true)
        } else {
          this.clientNameId = event.value
          this.getGSTByLedgerAddress(this.clientNameId)
          this.itemTableDisabledFlag = false
          let parentTypeId = 5
          let caseId = this.caseSaleArrayId.filter(s => s.id === JSON.parse(this.clientNameId))
          if (caseId.length > 0 && caseId[0].id > 0) {
            this.isCaseSaleFlag = false
            this.stateId = 0
            this.ledgerStateId = 0
            this.taxRateForOtherStateFlag = this.caseSaleCheckOtherState(this.stateId)
            //this.onChangeSlabTax('item', this.taxSlabId, '')
            //this.calculate()
          } else {
            this.isCaseSaleFlag = true
            this.getAddressOfCustomerByID(this.clientNameId, parentTypeId)
          }
        }
      }
    }
  }


onChangeClinetAndState(addressId){
  // let isOtherStateFlag = this.caseSaleCheckOtherState(addressId)
  // if
}


  stateAddressId: any
  stateValue: any
  stateId: any
  stateError: boolean
  addressStateId: any
  stateListShip: any

  getBillingAddressList(data) {
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

    //return this.stateValue
  }

  getShippingAddressList(data) {
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

    // return this.stateShippingValue
  }
  stateShippingValue: any
  getAddressOfCustomerByID(customerId, parentTypeId) {

    this.subscribe = this._commonService.getAddressByIdOfCustomer(customerId, parentTypeId).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND) {
        this.stateListShip = []
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
  getItemByCategoryid(categoryId) {
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
  onSelectItemCategory(event) {
    if (event.data.length > 0) {
      if (event.data[0].id !== '') {
        if (event.value === '-1' && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
          this.itemSelect2.selector.nativeElement.value = ''
          this._commonService.openItemMaster('', this.categoryId)
        } else {
          this.itemCategoryId = event.value
          this.ItemName = event.data[0].text
          this.categoryId = event.data[0].categoryId
          this.getTaxDetail(this.taxSlabId)
          if (event.data[0].selected) {
            if (this.withoursaveEditFlag) {
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
  stateIdForBill: any
  disabledAddressFlag: boolean = false
  selectStatelist(event) {
    if (event.data.length > 0) {
      if (event.data[0].id !== '0') {
        if (event.value === '-1' && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
          this.stateBillingSelect2Id.selector.nativeElement.value = ''
          this._commonService.openAddress(this.clientNameId)

        } else {
          this.disabledAddressFlag = false
          this.ledgerStateId = event.data[0].stateId
          if (this.ledgerStateId > 0) {
            this.checkOtherStateForNewItemAdd(this.ledgerStateId)
          }

        //  this.onChangeSlabTax('item', this.taxSlabId, '')
         // this.calculate()
          this.stateIdForBill = event.data[0].id
          this.stateError = false
          this.checkValidation()

        }

      }

    }

  }

  selectShippingStatelist(event) {
    if (event.data.length > 0) {
      if (event.data[0].id !== '') {
        if (event.value === '-1' && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
          this.stateShippingSelect2Id.selector.nativeElement.value = ''
          this._commonService.openAddress(this.clientNameId)

        } else {
          this.disabledAddressFlag = false
          this.SupplyStateId = event.data[0].id
          this.checkValidation()
        }

      }

    }

  }
  categoryTypeData: any
  autoCategory: any

  setupOrganization: any
  organizationData: any


  changeDateBill: string
  changeBillDate(eDate) {
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
  onChangeOrganizationId(e) {
    let dateChnage
    if (e.data.length > 0) {
      if (this.InvoiceDate !== '') {
        dateChnage = this._globalService.clientToSqlDateFormat(this.InvoiceDate, this.clientDateFormat)
      } else {
        dateChnage = ''
      }
      if (e.data[0].id !== '') {
        this.orgNameId = e.value
        this.checkValidation()
        this.getNewBillNo()
      } else {
        this.orgNameId = 0

      }
    }

  }

  getNewBillNo() {
    ; let dateChnage = this._globalService.clientToSqlDateFormat(this.InvoiceDate, this.clientDateFormat)

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
  }
  Remark: any
  showItemAttributeArray: any
  newShowlocalarray: any
  labeldata: any
  localLabelData: any








  localAddAttribute(itemTrasnId) {
    if (this.itemsAttribute.length > 0) {
      for (let i = 0; i < this.itemsAttribute.length; i++) {
        this.sendAttributeData.push({
          AttributeId: this.itemsAttribute[i].AttributeId,
          AttributeName: this.itemsAttribute[i].AttributeName,
          Sno: this.itemsAttribute[i].Sno,
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

  localItems() {

    let value = []
    this.items.forEach(element => {
      this.localLabelData = []
      if (element.Id === 0 && (element.Sno === this.snoIndex)) {
        if (this.sendAttributeData.length > 0) {
          this.attributesLabels.forEach(label => {
            this.labeldata = this.sendAttributeData.filter(v => v.existId === label.AttributeId)
            value = []
            if (this.labeldata.length > 0) {
              value = this.labeldata.filter(v => v.Sno === element.Sno)

            }
            this.localLabelData.push({
              AttributeId: label.AttributeId,
              Label: label.label,
              AttributeValue: value

            })
          })
        }
        else {
          if (this.attributesLabels.length > 0) {
            this.attributesLabels.forEach(label => {
              this.localLabelData.push({
                AttributeId: 0,
                Label: '',
                AttributeValue: '0'

              })
            })
          }

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
          ExpiryDate: element.ExpiryDateToshow,
          MfdDate: element.MfDateToshow,
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
          baserate: element.baserate,
          rowEditFlagValue: element.rowEditFlagValue,
          ReversetotalAmount: element.ReversetotalAmount,
          LableAttributeVale: this.localLabelData

        })
      } else if (this.editItemId > 0 && element.rowEditFlagValue && (element.Sno === this.snoIndex)) {
        if (this.sendAttributeData.length > 0) {
          this.attributesLabels.forEach(label => {
            this.labeldata = this.sendAttributeData.filter(s => (s.AttributeValueId === label.AttributeId) && (s.Sno === element.Sno))
            value = []
            if (this.labeldata.length > 0) {
              value = this.labeldata.filter(v => v.Sno === element.Sno)

            }
            this.localLabelData.push({
              AttributeId: label.AttributeId,
              Label: label.label,
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
          ExpiryDate: element.ExpiryDateToshow,
          MfdDate: element.MfDateToshow,
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
          ReversetotalAmount: element.ReversetotalAmount,
          IsForOtherState: element.IsForOtherState,
          LableAttributeVale: this.localLabelData,
          baserate: element.baserate,
          rowEditFlagValue: element.rowEditFlagValue

        })
      }
    })
    this.editItemId = 0
    this.ChallanId = 0
    this.editAttributeData = undefined
    this.disabledAddressFlag = true
    console.log(this.localItemas, this.sendAttributeData, this.localLabelData, 'localitem-final----')
  }

  isCheckLedgerOfficeFlag: any
  addItems() {
    this.itemSubmit = true
    this.deleteEditflag = true
    if (this.editAlreadyItemDataFlag) {

      this.localItemas = []
    } else {
      this.itemSubmit = true
    }

    if (this.validationForItemData()) {
      if (this.categoryId > 0 && this.itemCategoryId > 0 && this.Quantity > 0 && this.Rate > 0 && this.unitId > 0) {
        this.addItem()
        this.clickItem = true
        this.totalQty()
        this.calculateAllTotal()
        this.calculateTotalOfRow()
        this.calTotalBillAmount()
        this.clickItem = true
        this.initialiseItem()
        this.getTaxTypeExcluInclusiv()
      }

    }

  }
  lastItemFlag: boolean
  trsnItemId: any
  snoIndex: any
  TaxAmount: any
  DiscountType: any
  ExpiryDate: any
  MfdDate: any
  ExpiryDateChngae: any
  MFDateChngae: any
  addItem() {
    let sendForBillingSumItem = [];
    let taxItem;
    if (this.ExpiryDate !== '') {
      this.ExpiryDateChngae = this._globalService.clientToSqlDateFormat(this.ExpiryDate, this.clientDateFormat)

    } else {
      this.ExpiryDateChngae = ''

    }
    if (this.MfdDate !== '') {
      this.MFDateChngae = this._globalService.clientToSqlDateFormat(this.MfdDate, this.clientDateFormat)

    } else {
      this.MFDateChngae = ''

    }
   // if (this.items.length === 0) {
     // this.snoIndex = 1
     // taxItem = this.taxCalculationForItem(this.snoIndex)

    // } else {
    //   this.snoIndex = this.items.length + 1
    //   for (let i = 0; i < this.items.length; i++) {
    //     if (this.snoIndex === this.items[i].Sno) {
    //       this.snoIndex = this.snoIndex + 1
    //     }
    //   }
    //   taxItem = this.taxCalculationForItem(this.snoIndex)

    // }
    this.items.push({
      type: 'items',
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
      MfdDate: this.MFDateChngae,
      ExpiryDateToshow: this.ExpiryDate,
      MfDateToshow: this.MfdDate,
      BatchNo: this.BatchNo,
      CategoryId: this.categoryId,
      CategoryName: this.getPattern(),
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
      ReversetotalAmount: +this.ReversetotalAmount,
      baserate: +this.getBaseRateForItem,
      rowEditFlagValue: true,
      IsForOtherState: this.taxRateForOtherStateFlag,
      IsForOtherStateForTrans: this.taxRateForOtherStateFlag === false ? 0 : 1

    })
    sendForBillingSumItem.push({
      type: 'items',
      Id: this.editItemId !== 0 ? this.editItemId : 0,
      Sno: this.snoIndex,
      TaxType: this.TaxTypeId,
      rowEditFlagValue: true,
      taxItems: this.taxItem

    })
    setTimeout(() => {
      this._commonService.fixTableHFL('item-table')
    }, 1)
    console.log(this.items, 'items-Array -recentaly-added items')
    this.localAddAttribute(this.trsnItemId)
    this.localItems()
    this.getBillingSummery(sendForBillingSumItem)

  }

  rowIndex: any
  AttrId: any
  BatchNo: any
  ReversetotalAmount: number
  initialiseItem() {
    this.Remark = ''
    this.Rate = ''
    this.Discount = 0
    this.Quantity = 1
    this.TotalAmount = 0
    this.ReversetotalAmount = 0
    this.clickItem = false
    this.TaxAmount = 0
    this.DiscountAmt = 0
    this.DiscountPerItem = 0
    this.allTaxRateForItem = []
    this.allTaxRateForCharge = []
    this.discountAmount = 0
    this.Width = 1
    this.Length = 1
    this.Height = 1
    this.BatchNo = ''
    this.ExpiryDate = ''
    this.MfdDate = ''
    this.itemCategoryId = 0
    this.attrinuteSetDataId = 0
    this.unitId = 0
    this.taxSlabId = 0
    if (this.allCategories && this.allCategories.length > 0) {
      this.getCatagoryDetail(this.allCategories)
    }
    this.DiscountType = '0'
    this.initAttribute()
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
  initialiseParams() {
    this.items = []
    this.TaxAmount = 0
    this.Width = 1
    this.Length = 1
    this.BatchNo = ''
    this.Height = 1
    this.RoundOffManual = 0
    this.totalRate = 0
    this.totalDiscount = 0
    this.totalTaxAmount = 0
    this.DiscountPerItem = 0
    this.localItemas = []
    this.sendAttributeData = []
    this.showAttributeData = []
    this.taxSlabSummery = []
    this.showtaxSlab = []
    this.submitSave = false
    this.itemSubmit = false
    this.clickItem = false
    this.clickTrans = false
    this.clickSaleAdditionCharge = false
    this.isValidAmount = true
    this.deleteEditflag = true
    this.deleteEditPaymentFlag = true
    this.deleteEditChargeFlag = true
    this.DiscountAmt = 0
    this.InvoiceDate = ''
    this.DueDate = ''
    this.SupplyDate = ''
    //this.CurrencyId = ''
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
    this.EwayBillNo = ''
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
    this.MfdDate = ''
    this.AdditionalChargeData = []


    if (this.clientSelect2 && this.clientSelect2.selector.nativeElement.value) {
      this.clientSelect2.setElementValue('')
    }

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
  setDueDate() {
    this.DueDate = this._globalService.getDefaultDate(this.clientDateFormat)
  }
  setPayDate() {
    let _self = this
    this.PayDate = _self._globalService.getDefaultDate(_self.clientDateFormat)
  }
  setExpiryDate() {
    this.ExpiryDate = ''
  }
  setMFDate() {
    this.MfdDate = ''
  }
  CurrentDate: any
  setCurrentDate(setup) {
    if (setup && setup.length > 0) {
      this.CurrentDate = this._globalService.utcToClientDateFormat(setup[0].CurrentDate, this.clientDateFormat)
    }
    //this.CurrentDate = this._globalService.getDefaultDate(this.clientDateFormat)
  }
  setBillDate() {
    this.InvoiceDate = this._globalService.getDefaultDate(this.clientDateFormat)
  }

  clearExtras() {
    this.setupModules = {}
    this.currenyValues = [{ id: '0', symbol: '%' }]
    this.organizationData = []
    this.stateList = []
    this.stateListShip = []
    this.getOrgnization(this.setupOrganization)
    this.RoundOff = 0
    this.TaxableValue = 0
    this.RoundOffManual = 0
    this.inilizeAdditionCharge()
    this.transactions = []
    this.setBillDate()
    this.setPayDate()
    this.setExpiryDate()
    this.setMFDate()
    this.setDueDate()
  //  this.setCurrentDate()
    this.getAddtionalCharge()
    this.getNewBillNo()
    //this.getSPUtilityDataBilling()
    // this.updateLastBillNo(this.InvoiceDate, this.orgNameId)

    setTimeout(() => {
      this.clientSelect2.selector.nativeElement.focus()
    }, 1000)



  }

  totalQty() {
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
  appliedTaxRatesItem: any = []
  appliedTaxRatesCharge: any = []
  
  // calculate () {
  //   let total = +(isNaN(+this.Rate) ? 0 : +this.Rate)
  //   * (isNaN(+this.Quantity) || +this.Quantity === 0 ? 1 : +this.Quantity)
  //   * (isNaN(+this.Length) || +this.Length === 0 ? 1 : +this.Length)
  //   * (isNaN(+this.Width) || +this.Width === 0 ? 1 : +this.Width)
  //   * (isNaN(+this.Height) || +this.Height === 0 ? 1 : +this.Height)
  //   this.ReversetotalAmount = +total.toFixed(this.decimalDigit)
  //   if (this.validDiscount) {
  //     if ('' + this.DiscountType === '0') {
  //       if (+this.Discount <= 100 && +this.Discount >= 0) {
  //         this.DiscountAmt = +((+this.Discount / 100) * (total)).toFixed(this.decimalDigit)
  //       } else {
  //         this.DiscountAmt = 0
  //       }
  //     } else {
  //       this.DiscountAmt = isNaN(+this.Discount) ? 0 : +this.Discount
  //     }
  //     if (this.taxRates.length > 0 && total > 0) {
  //       let discountedAmount = 0
  //       if (this.DiscountAmt === total) {
  //         discountedAmount = total
  //       } else {
  //         discountedAmount = total - this.DiscountAmt
  //       }
  //       this.AmountItem = discountedAmount
  //       if (this.TaxType === 0) {
  //         let returnTax = this.purchaseService.taxCalculation(this.taxRates,
  //           this.taxSlabType,
  //           discountedAmount,
  //           this.isOtherState, FormConstants.PurchaseForm, this.taxSlabName)
  //         this.TaxAmount = +(returnTax.taxAmount).toFixed(4)
  //         this.appliedTaxRatesItem = returnTax.appliedTaxRates
  //       } else {
  //         if (this.taxCalInclusiveType === 1) {
  //           let AmountItem = +(this.purchaseService.calcTaxableAmountType1(this.taxRates,
  //             this.taxSlabType,
  //             discountedAmount,
  //             this.isOtherState)).toFixed(4)
  //           this.AmountItem = AmountItem
  //           let returnTax = this.purchaseService.taxCalCulationForInclusive(this.taxRates,
  //             this.taxSlabType,
  //             this.AmountItem,
  //             this.isOtherState, FormConstants.PurchaseForm, this.taxSlabName)
  //           this.TaxAmount = +(returnTax.taxAmount).toFixed(4)
  //           this.appliedTaxRatesItem = returnTax.appliedTaxRates
  //         } else {
  //           let AmountItem = +(this.purchaseService.calcTaxableAmountType2(this.taxRates,
  //             this.taxSlabType,
  //             total,
  //             this.isOtherState)).toFixed(4)
  //           if ('' + this.DiscountType === '0') {
  //             if (+this.Discount < 100 && +this.Discount > 0) {
  //               this.DiscountAmt = +((+this.Discount / 100) * (AmountItem)).toFixed(this.decimalDigit)
  //             } else if (+this.Discount === 100 || +this.Discount === 0 ) {
  //               this.DiscountAmt = 0
  //             }
  //           }
  //           this.AmountItem = AmountItem - this.DiscountAmt
  //           let returnTax = this.purchaseService.taxCalCulationForInclusiveType2(this.taxRates,
  //             this.taxSlabType,
  //             this.AmountItem,
  //             this.isOtherState, FormConstants.PurchaseForm, this.taxSlabName)
  //           this.TaxAmount = +(returnTax.taxAmount).toFixed(4)
  //           this.appliedTaxRatesItem = returnTax.appliedTaxRates
  //         }
  //       }
  //     } else {
  //       if (this.editItemId === -1) {
  //         this.TaxAmount = 0
  //       }
  //     }
  //   } else {
  //     this.DiscountAmt = 0
  //     this.TaxAmount = 0
  //   }
  //   this.TaxableAmountCharge = +this.AmountCharge
  //   if (this.taxChargeRates.length > 0 && +this.AmountCharge > 0) {
  //     if (this.TaxTypeCharge === 0) {
  //       let returnTax = this.purchaseService.taxCalculation(this.taxChargeRates,
  //         this.taxChargeSlabType,
  //         +this.AmountCharge,
  //         this.isOtherState, FormConstants.ChargeForm, this.TaxChargeName)
  //       this.TaxAmountCharge = +(returnTax.taxAmount).toFixed(4)
  //       this.appliedTaxRatesCharge = returnTax.appliedTaxRates
  //     } else {
  //       if (this.TaxTypeCharge === 1) {
  //         let AmountCharge = this.purchaseService.calcTaxableAmountType1 (this.taxChargeRates,
  //           this.taxChargeSlabType, +this.AmountCharge, this.isOtherState)
  //         console.log('amount charge : ', AmountCharge)
  //         this.TaxableAmountCharge = +AmountCharge.toFixed(this.decimalDigit)
  //         let returnTax = this.purchaseService.taxCalCulationForInclusive(this.taxChargeRates,
  //           this.taxChargeSlabType,
  //           +AmountCharge,
  //           this.isOtherState, FormConstants.ChargeForm, this.TaxChargeName)
  //         this.TaxAmountCharge = +(returnTax.taxAmount).toFixed(4)
  //         this.appliedTaxRatesCharge = returnTax.appliedTaxRates
  //       }
  //     }
  //   } else if (this.editChargeId === -1) {
  //     this.TaxAmountCharge = 0
  //   }
  //   // console.log('TaxAmountCharge : ', this.TaxAmountCharge)
  //   if (+this.AmountCharge > 0) {
  //     this.TotalAmountCharge = +(+this.AmountCharge +  + ((this.TaxTypeCharge === 0) ? (isNaN(+this.TaxAmountCharge) ? 0 : +this.TaxAmountCharge) : 0)).toFixed(this.decimalDigit)
  //   } else {
  //     this.TotalAmountCharge = 0
  //   }
  //   this.TotalAmountCharge = +this.TotalAmountCharge.toFixed(4)
  //   this.InterestAmount = 0
  //   this.SubTotal = +(this.calculateTotalOfRow()).toFixed(this.decimalDigit)
  //   if (+this.ItemId > 0 || +this.LedgerChargeId > 0) {
  //     this.calculateAllTotal()
  //   }
  //   this.getBillSummary()
  // }
  calculate() {
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
    this.ReversetotalAmount = +this.reversetotalCalcution()
    this.calculationAdditionCharge()
    this.calculateForTotalAmount()
    this.calculateAllTotal()
    this.calTotalBillAmount()
  }
  reversetotalCalcution() {
    this.ReversetotalAmount = 0
    let Rate = (isNaN(+this.Rate)) ? 0 : +this.Rate
    let Quantity = (isNaN(+this.Quantity)) ? 1 : +this.Quantity
    let Height = (this.Height === 0 || this.Height === null) ? 1 : +this.Height
    let Length = (this.Length === 0 || this.Length === null) ? 1 : +this.Length
    let Width = (this.Width === 0 || this.Width === null) ? 1 : +this.Width
    this.ReversetotalAmount = (Rate * Quantity * Height * Length * Width)

    return isNaN(this.ReversetotalAmount) ? 0 : this.ReversetotalAmount
  }
  getReverseSaleRate() {
    let Quantity = (isNaN(+this.Quantity)) ? 1 : +this.Quantity
    this.Rate = this.ReversetotalAmount / Quantity
    this.calculate()
  }
  calculationAdditionCharge() {
    this.TaxAmountCharge = 0
    this.TotalAmountCharge = 0
    let AmountCharge = 0
    AmountCharge = (isNaN(+this.AmountCharge)) ? 0 : +this.AmountCharge
    if (AmountCharge > 0) {
      if (this.taxTypeChargeId === '1') {
        if (this.allTaxRateForCharge.length > 0) {
          this.TaxAmountCharge = this.taxCalculationForInclusive(this.allTaxRateForCharge, AmountCharge, 0)

        }
      } else {
        this.FinalAmount = AmountCharge
        this.TaxAmountCharge = this.taxCalculationForExclusive(this.allTaxRateForCharge, AmountCharge)

      }

      this.TotalAmountCharge = (((isNaN(+this.FinalAmount)) ? 0 : +this.FinalAmount) + ((isNaN(+this.TaxAmountCharge)) ? 0 : +this.TaxAmountCharge)).toFixed(this.decimalDigit)
      //console.log(this.TotalAmountCharge,'charge')
    }
  }
  taxCalculationForExclusive(taxArray, rateItem) {
    let returmTaxAmount = 0
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
  taxCalculationForInclusive(taxArray, rateofitem, DiscountAmt) {

    this.totalRowTax = 0
    let TaxAmountCargeValue = 0
    let baserate = 0
    let sumOfAllRate = 0
    let totalTaxAmt = 0
    this.FinalAmount = 0
    if (taxArray.length > 0) {
      taxArray.forEach(ele => {
        if (ele.TaxType === 0) {
          sumOfAllRate = +sumOfAllRate + +ele.TaxRate
        } else {
          let taxr = isNaN(+ele.TaxRate) ? 0 : +ele.TaxRate
          totalTaxAmt = +totalTaxAmt + +taxr
        }
      })
      if (this.isInclusiveCaseBeforeDiscount === '2') {
        DiscountAmt = 0
        let localDiscoutAmt = 0
        let value = (rateofitem / (100 + sumOfAllRate) * 100)
        if (this.DiscountType === '0') {
          this.DiscountAmt = ((+this.Discount / 100) * (+value)).toFixed(this.decimalDigit)
          localDiscoutAmt = (+this.Discount / 100) * (+value)
        } else {
          this.DiscountAmt = (+this.Discount).toFixed(this.decimalDigit)
        }
        baserate = value - localDiscoutAmt
        this.FinalAmount = baserate
        totalTaxAmt = (sumOfAllRate / 100) * baserate


      }
      else if (this.isInclusiveCaseBeforeDiscount === '1') {

        baserate = (((rateofitem - DiscountAmt) / (100 + sumOfAllRate)) * 100)
        this.taxableValueInclusive = baserate
        this.FinalAmount = baserate
        totalTaxAmt = (sumOfAllRate / 100) * baserate


      }

      // console.log(baserate,rateofitem,totalTaxAmt,'baserate')
    }
    this.getBaseRateForItem = baserate
    this.totalRowTax = +totalTaxAmt
    TaxAmountCargeValue = +(totalTaxAmt).toFixed(UIConstant.DECIMAL_FOUR_DIGIT)
    return TaxAmountCargeValue
  }

  DiscountAmt: any
  disShowAmt: any = 0
  calculateTotalOfRow() {
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

    let rateOfItemData = 0
    if (this.TaxTypeId === '1') {
      this.FinalAmount = 0
      rateOfItemData = Rate * Quantity * Length * Width * Height
      if (this.allTaxRateForItem.length > 0) {
        this.TaxAmount = this.taxCalculationForInclusive(this.allTaxRateForItem, rateOfItemData, +this.DiscountAmt)
      }
    }
    else {
      this.FinalAmount = 0
      let finlAmt = 0
      if (this.DiscountType === '0' && this.Discount === 100) {
        finlAmt = (Rate * Quantity * Length * Width * Height)
      }
      else {
        finlAmt = (Rate * Quantity * Length * Width * Height) - this.DiscountAmt
        this.FinalAmount = (Rate * Quantity * Length * Width * Height) - this.DiscountAmt
      }
      if (this.allTaxRateForItem.length > 0) {
        this.TaxAmount = this.taxCalculationForExclusive(this.allTaxRateForItem, finlAmt)

      }

    }


    let totalAmount = +(this.FinalAmount).toFixed(UIConstant.DECIMAL_FOUR_DIGIT) + +this.TaxAmount

    return isNaN(totalAmount) ? 0 : totalAmount

  }
  taxDetailsPerItem: any
  ExclusiveForTaxItem(TaxArray, totalrate, itemTrsnId) {
    
    if (TaxArray.length > 0) {
      this.taxDetailsPerItem = []
      TaxArray.forEach(ele => {
        let taxCal = 0
        if (ele.TaxType === 0) {
          taxCal = (ele.TaxRate / 100) * totalrate
        } else {
          taxCal = isNaN(+ele.TaxRate) ? 0 : +ele.TaxRate
        }
        this.taxDetailsPerItem.push({
          itemTransSno: itemTrsnId,
          TaxRate: ele.TaxRate,
          TaxType: ele.TaxType,
          id: ele.id,
          taxSlabId: ele.taxSlabId,
          TaxRateNameTax: ele.taxSlabName,
          AmountTax: taxCal,
          TaxName: ele.TaxName
        })
      }
      )
      return this.taxDetailsPerItem
    }
  }
  InclusiveForTaxItem(TaxArray, dataTotalrate, itemTrsnId, DiscountAmt) {
    let sumOfAllRate = 0
    let baserate = 0
    let withoutTax = 0
    let totalTaxAmt = 0
    if (TaxArray.length > 0) {
      //   let length = TaxArray.length 
      this.taxDetailsPerItem = []
      TaxArray.forEach(element => {
        let totalTaxAmt = 0
        if (element.TaxType === 0) {
          sumOfAllRate = +sumOfAllRate + +element.TaxRate
          if (this.isInclusiveCaseBeforeDiscount === '2') {
            DiscountAmt = 0
            let localDiscontAmt = 0
            baserate = (dataTotalrate / (100 + sumOfAllRate) * 100)
            if (this.DiscountType === '0') {
              this.DiscountAmt = ((+this.Discount / 100) * (+baserate)).toFixed(this.decimalDigit)
              localDiscontAmt = (+this.Discount / 100) * (+baserate)
            } else {
              this.DiscountAmt = (+this.Discount).toFixed(this.decimalDigit)
            }
            withoutTax = baserate - localDiscontAmt

          } else if (this.isInclusiveCaseBeforeDiscount === '1') {
            baserate = (((dataTotalrate - DiscountAmt) / (100 + sumOfAllRate)) * 100)
            withoutTax = baserate
          }

        } else {
          let taxr = isNaN(+element.TaxRate) ? 0 : +element.TaxRate
          totalTaxAmt = +totalTaxAmt + +taxr
        }
      })
      TaxArray.forEach(ele => {
        if (ele.TaxType === 0) {
          totalTaxAmt = (ele.TaxRate / 100) * withoutTax
        } else {
          let taxr = isNaN(+ele.TaxRate) ? 0 : +ele.TaxRate
          totalTaxAmt = +totalTaxAmt + +taxr
        }
        this.taxDetailsPerItem.push({
          itemTransSno: itemTrsnId,
          TaxRate: ele.TaxRate,
          TaxType: ele.TaxType,
          id: ele.id,
          taxSlabId: ele.taxSlabId,
          TaxRateNameTax: ele.taxSlabName,
          AmountTax: totalTaxAmt,
          TaxName: ele.TaxName
        })
      }
      )
    }
    return this.taxDetailsPerItem
  }
  taxItem: any
SnoForTaxItem(){
  this.snoIndex = 1
  this.snoIndex = this.items.length + 1
  for (let i = 0; i < this.items.length; i++) {
    if (this.snoIndex === this.items[i].Sno) {
      this.snoIndex = this.snoIndex + 1
    }
  }
  this.taxItem = this.taxCalculationForItem(this.snoIndex)
}

 // 
  // 



  taxCalculationForItem(itemTrsnId) {
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
    let taxPerItem = [];
    let totalAmt = 0
    if (this.allTaxRateForItem.length > 0) {
      if (this.TaxTypeId === '1') {
        totalAmt = Rate * Quantity * Length * Width * Height
        taxPerItem = this.InclusiveForTaxItem(this.allTaxRateForItem, totalAmt, itemTrsnId, +this.DiscountAmt)
      }
      else {
        totalAmt = (Rate * Quantity * Length * Width * Height) - this.DiscountAmt
        taxPerItem = this.ExclusiveForTaxItem(this.allTaxRateForItem, totalAmt, itemTrsnId)
      }
    }

    return taxPerItem

  }
  taxCalculationForCharge(chargetranSnoId) {

    let AmountCharge = 0
    AmountCharge = (isNaN(+this.AmountCharge)) ? 0 : +this.AmountCharge
    if (AmountCharge > 0) {
      let taxPerItem = [];
      if (this.allTaxRateForCharge.length > 0) {
        if (this.taxTypeChargeId === '1') {
          taxPerItem = this.InclusiveForTaxItem(this.allTaxRateForCharge, AmountCharge, chargetranSnoId, 0)
        }
        else {
          taxPerItem = this.ExclusiveForTaxItem(this.allTaxRateForCharge, AmountCharge, chargetranSnoId)
        }
        this.allTaxRateForCharge = []
      }

      return taxPerItem



    }
  }

  calculateForTotalAmount() {
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
  calculateAllTotal() {
    let totalDiscount = 0
    let totalQty = 0
    let totalTax = 0
    let totalAmt = 0
    let TotalAmountCharge = 0
    let amountCharge = 0

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


    if (!this.clickSaleAdditionCharge) {

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
      this.TotalQuantity = totalQty
      this.totalTaxAmount = (totalTax).toFixed(this.decimalDigit)
      this.TotalChargeAmt = TotalAmountCharge
      this.calTotalBillAmount()
    }

  }

  removeBillSummery(y, type, tranIsSNO) {
    let indexofRow;
    for (let i = this.taxSlabSummery.length; i > this.taxSlabSummery.length - 1; i--) {
      if (type === 'charge') {
        indexofRow = this.taxSlabSummery.findIndex(
          objectModified => (objectModified.ParentTypeTaxId === 22 && objectModified.ItemTransTaxId === tranIsSNO)
        )
      }
      if (type === 'items') {
        indexofRow = this.taxSlabSummery.findIndex(
          objectModified => (objectModified.ParentTypeTaxId === 6 && objectModified.ItemTransTaxId === tranIsSNO)
        )
      }
      if (indexofRow !== -1) {
        this.taxSlabSummery.splice(indexofRow, 1)
      }
    }
    this.showBillingSummery(this.taxSlabSummery)

  }



  intrerestrateAmt: any
  DiscountValueType: any
  get customer() { return this.customerForm.controls }
  changeIntrate(e) {
    this.InterestRateType = e === '0' ? 0 : 1
  }
  changeCommisiontrate(e) {
    this.CommisionRateType = e === '0' ? 0 : 1
  }

  private addCustomerForm() {
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



  calTotalBillAmount() {
    let totalBillAmt = 0
    let toatltax = 0
    if (this.localItemas.length > 0) {
      for (let i = 0; i < this.localItemas.length; i++) {
        if (this.localItemas[i].TaxType === '1') {
          if (this.localItemas[i].Id > 0 && this.localItemas[i].rowEditFlagValue === undefined) {
            if (this.isInclusiveCaseBeforeDiscount === '2') {
              totalBillAmt = totalBillAmt +
                + (isNaN(+this.localItemas[i].baserate) ? 0 : +this.localItemas[i].baserate) -
                (isNaN(+this.localItemas[i].DiscountAmt) ? 0 : +this.localItemas[i].DiscountAmt) +
                (isNaN(+this.localItemas[i].TaxAmount) ? 0 : +this.localItemas[i].TaxAmount)
              toatltax = +toatltax + +this.localItemas[i].TaxAmount
            }
            else if (this.isInclusiveCaseBeforeDiscount === '1') {
              totalBillAmt = totalBillAmt +
                + (isNaN(+this.localItemas[i].baserate) ? 0 : +this.localItemas[i].baserate) +
                (isNaN(+this.localItemas[i].TaxAmount) ? 0 : +this.localItemas[i].TaxAmount)
              toatltax = +toatltax + +this.localItemas[i].TaxAmount
            }

          }

          else {
            totalBillAmt = totalBillAmt +
              + (isNaN(+this.localItemas[i].baserate) ? 0 : +this.localItemas[i].baserate) +
              (isNaN(+this.localItemas[i].TaxAmount) ? 0 : +this.localItemas[i].TaxAmount)
            toatltax = +toatltax + +this.localItemas[i].TaxAmount
          }

        }
        else {
          totalBillAmt = totalBillAmt + (isNaN(+this.localItemas[i].Rate) ? 0 : +this.localItemas[i].Rate) *
            (isNaN(+this.localItemas[i].Quantity) ? 0 : +this.localItemas[i].Quantity) *
            (isNaN(+this.localItemas[i].Height) ? 0 : +this.localItemas[i].Height) *
            (isNaN(+this.localItemas[i].Width) ? 0 : +this.localItemas[i].Width) *
            (isNaN(+this.localItemas[i].Length) ? 0 : +this.localItemas[i].Length)
            - (isNaN(+this.localItemas[i].DiscountAmt) ? 0 : +this.localItemas[i].DiscountAmt) +
            (isNaN(+this.localItemas[i].TaxAmount) ? 0 : +this.localItemas[i].TaxAmount)
          toatltax = +toatltax + +this.localItemas[i].TaxAmount
        }
      }
    }


    if (!this.clickItem) {
      if (this.Rate !== '') {
        if (this.TaxTypeId === '1') {
          if (this.isInclusiveCaseBeforeDiscount === '2') {
            totalBillAmt += +this.getBaseRateForItem + +this.totalRowTax
            toatltax = +this.totalRowTax
          }
          else {
            totalBillAmt += +this.getBaseRateForItem + +this.totalRowTax
            toatltax = +this.totalRowTax
          }

        }
        else {
          totalBillAmt += +this.Rate * this.Quantity * this.Length * this.Height * this.Width
            - (isNaN(+this.DiscountAmt) ? 0 : +this.DiscountAmt)
            + (isNaN(+this.TaxAmount) ? 0 : +this.TaxAmount)
          toatltax = +toatltax + +(isNaN(+this.TaxAmount) ? 0 : +this.TaxAmount)
        }

      }
    }

    this.subTotalBillAmount = +(totalBillAmt).toFixed(this.decimalDigit)
    console.log(this.subTotalBillAmount, 'sub total')
    this.TaxableValue = (totalBillAmt - toatltax).toFixed(this.decimalDigit)
    let localNetAmt = +(totalBillAmt + +this.TotalChargeAmt).toFixed(this.decimalDigit)

    this.RoundOff = +(Math.round(localNetAmt) - localNetAmt).toFixed(this.decimalDigit)
    this.netBillAmount = localNetAmt + this.RoundOff
    if (this.RoundOffManual) {
      this.RoundOff = +this.RoundOffManual
      this.netBillAmount = localNetAmt + this.RoundOffManual
    }
    if (localNetAmt === 0) {
      this.RoundOffManual = 0
      this.RoundOff = 0
      this.netBillAmount = 0
    }


    //  console.log(this.subTotalBillAmount ,'subo1')



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


  getPaymentTotal(): number {
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
  checkValidationForAmount(): boolean {
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

  ngOnDestroy() {
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
  PartyGstinNoCode:any
  getGSTByLedgerAddress(ledgerId) {
    this.subscribe = this._commonService.ledgerGetGSTByAddress(ledgerId).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND) {
        console.log(data.Data ,'GST---------->>')
        if (data.Data.LedgerDetails.length > 0) {
          this.creditLimitAmount = data.Data.LedgerDetails[0].CreditLimit
          this.creditDays = JSON.parse(data.Data.LedgerDetails[0].CreditDays)
          if(data.Data.LedgerDetails[0].GstinNo !==null){
            let str = data.Data.LedgerDetails[0].GstinNo
            let val =  str.trim();
            this.PartyGstinNoCode =val.substr(0,2);
            if(this.gstinTypeOfOrgnization===1){
              this.checkOtherStateByGSTNumber(this.PartyGstinNoCode)
            }
            
          }
        }
        if (data.Data.AddressDetails.length > 0) {
          this.ledgerStateId = data.Data.AddressDetails[0].StateId
          this.checkOtherStateForNewItemAdd(this.ledgerStateId)
        }
      }
    })
  }

 
  industryId: any
  @ViewChild('taxtype_select2') taxTypeForItem: Select2Component

  @ViewChild('custName') custName
  openCustomerDetails() {

    this.disbledInputMobileFlag = true
    this.searchCountryCodeForMobile(' ')
    this.customerClick = false

    $('#cust_detail_m').modal(UIConstant.MODEL_SHOW)
    setTimeout(() => {
      this.custName.nativeElement.focus()
    }, 1000)
  }
  caseSaleArrayId: any
  textItemId: any
  itemTableDisabledFlag: boolean
  withoursaveEditFlag: boolean
  getModuleSettingValue: any
  OrgGstinNo:any
  OrgGstinNoCode:any
  getOrgnizationGSTNOCode ( ){
    let CompanyDetails= JSON.parse(this._settings.CompanyDetails)  
    this.OrgGstinNo = CompanyDetails.GstinNo
    if(CompanyDetails.GstinNo !==null){
      let str = CompanyDetails.GstinNo
      let val =  str.trim();
      this.OrgGstinNoCode = val.substr(0,2);
      if(this.gstinTypeOfOrgnization ===1){
        this.checkOtherStateByGSTNumber(this.OrgGstinNoCode)

      }
    }
  }
  private unSubscribe$ = new Subject<void>()
  getCurrentDate (){
    this._commonService.getCurrentDate().pipe(
      takeUntil(this.unSubscribe$)
    ).subscribe((response: any) => {
      if(response.Code === UIConstant.THOUSAND){
        this.setCurrentDate(response.Data)
        //this.CurrentDate = this._globalService.utcToClientDateFormat(response.Data[0].CurrentDate, this.clientDateFormat)
      }
    })
  }

  openDirectModal() {
   
    this.taxDisabledFlag = true
    this.currencyValues = [{ id: 0, symbol: '%' }]
    this.netBillAmount = 0
    this.DiscountAmt = 0
    this.withoursaveEditFlag = true
    this.itemTableDisabledFlag = true
    this.caseSaleArrayId = [{ id: 1 }, { id: 5 }]
    this.Amount = 0
    this.editChargeId = 0
    this.textItemId = 0
    this.getOrgnizationGSTNOCode()
    this.getModuleSettingValue = JSON.parse(this._settings.moduleSettings)
    this.getModuleSettingData()
    this.industryId = this._settings.industryId
    this.finFromDate = this._settings.finFromDate
    this.finToDate = this._settings.finToDate
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
    this.trsnItemId = 1
    this.itemsAttribute = []
    this.transactions = []
    this.AdditionalChargeData = []
    this.getSPUtilityDataBilling()
    this.getCountry(0)
    this.editItemId = 0
    this.initComp()
    $('#sale_direct_form').modal(UIConstant.MODEL_SHOW)
    setTimeout(() => {
      this.clientSelect2.selector.nativeElement.focus()
    }, 1000)
    this.setBillDate()
    this.setPayDate()
    this.setExpiryDate()
    this.setMFDate()
    this.setDueDate()
   // this.setCurrentDate()
  }
  finToDate:any
  finFromDate:any
  closeModal() {
    if ($('#sale_direct_form').length > 0) {
      $('#sale_direct_form').modal(UIConstant.MODEL_HIDE)
    }
  }

  closeInvoice() {
    this._commonService.closeSaleDirect()
  }

  invalidObj2: any = {}

  checkValidation(): boolean {
    let isValid = 1
    if (this.clientNameId) {
      this.invalidObj2['clientNameId'] = false
    } else {
      this.invalidObj2['clientNameId'] = true
      isValid = 0
    }
    if (this.orgNameId) {
      this.invalidObj2['orgNameId'] = false
    } else {
      this.invalidObj2['orgNameId'] = true
      isValid = 0
    }
    if (this.BillNo) {
      this.invalidObj2['BillNo'] = false
    } else {
      this.invalidObj2['BillNo'] = true
      isValid = 0
    }
    if (this.InvoiceDate) {
      this.invalidObj2['InvoiceDate'] = false
    } else {
      this.invalidObj2['InvoiceDate'] = true
      isValid = 0
    }

    return !!isValid
  }
  invalidObj: any = {}
  validationForItemData() {
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
    if (this.Rate > 0) {
      this.invalidObj['Rate'] = false
    } else {
      this.invalidObj['Rate'] = true
      isValidItem = 0
    }
    if (this.industryId === '5') {
      if (this.BatchNo !== "") {
        this.invalidObj['BatchNo'] = false
      } else {
        this.invalidObj['BatchNo'] = true
        isValidItem = 0
      }
    }
    if (this.industryId === '6') {
      if (this.BatchNo !== "") {
        this.invalidObj['BatchNo'] = false
      } else {
        this.invalidObj['BatchNo'] = true
        isValidItem = 0
      }
    }

    if (this.Quantity > 0) {
      this.invalidObj['Quantity'] = false
    } else {
      this.invalidObj['Quantity'] = true
      isValidItem = 0
    }
    if (this.TotalAmount > 0) {
      this.invalidObj['TotalAmount'] = false
    } else {
      this.invalidObj['TotalAmount'] = true
      isValidItem = 0
    }
    if (this.DiscountType === '0' || 0) {
      if (this.Discount <= 100) {
        this.invalidObj['Discount'] = false
      }
      else {
        this.invalidObj['Discount'] = true
        isValidItem = 0
      }

    } else {
      if (0 < this.Discount) {
        this.invalidObj['Discount'] = false
      }
      else {
        this.invalidObj['Discount'] = true
        isValidItem = 0
      }



    }

    return !!isValidItem
  }

  currency: any
  defaultCurrency: string
  setupModules: any
  currenyValues: Array<{ id: string, symbol: string }> = [{ id: '0', symbol: '%' }]
  isDataAvailable: boolean = false

  getAvailableCurrency() {
    return this._commonService.setupSettingByType(UIConstant.SALE_TYPE)
  }
  inventoryItemSales: any
  ItemTransactionactions: any
  itemAttbute: any
  ColorCode: any
  SizeCode: any
  ArticleCode: any
  editAlreadyItemDataFlag: boolean
  setEditCustomerData(data) {
    // let mobile = data[0].MobileNo
    this.CaseCustId = data[0].Id
    this.customerForm.controls.caseCustomerName.setValue(data[0].Name)
    this.customerForm.controls.customerMobileNo.setValue(data[0].MobileNo)
    this.customerForm.controls.CustomerEmail.setValue(data[0].Email)
    this.customerForm.controls.CustomerAddress.setValue(data[0].Address)
    // this.addressId =data[0].Id
    this.getCountry(data[0].CountryId)
    setTimeout(() => {
      this.countryValue = data[0].CountryId
      this.countryselect2.setElementValue(data[0].CountryId)

    }, 100);
    setTimeout(() => {
      this.getStaeList(data[0].CountryId, data[0].StateId)
      this.stateValuedata = data[0].StateId
      this.stateselect2.setElementValue(data[0].StateId)


    }, 1000);
    setTimeout(() => {
      this.getCitylist(data[0].StateId, data[0].CityId)
      this.cityValue = data[0].CityId
      this.cityselect2.setElementValue(data[0].CityId)
    }, 1500);
    setTimeout(() => {
      this.getCitylist(data[0].StateId, data[0].AreaId)
      this.areNameId = data[0].AreaId
      this.areaSelect2.setElementValue(data[0].AreaId)
    }, 1500);

    this.countryCodeselect2.setElementValue(data[0].CountryCode)
  }
  BillingAddressName: any
  EditSaleData(id) {
    this._commonService.getSaleDirectEditData(id).subscribe(data => {
      console.log(JSON.stringify(data), 'editData----------->>')
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        if (data.Data && data.Data.CustomerTypes.length > 0) {
          this.setEditCustomerData(data.Data.CustomerTypes)
        }
        if (data.Data && data.Data.AdditionalChargeDetails.length > 0) {
          this.AdditionalChargeData = []
          data.Data.AdditionalChargeDetails.forEach(chrgeItem => {
            this.AdditionalChargeData.push({
              Id: chrgeItem.Id,
              Sno: chrgeItem.Sno,
              LedgerChargeId: chrgeItem.LedgerChargeId,
              ParentChargeId: chrgeItem.ParentChargeId,
              ParentTypeChargeId: chrgeItem.ParentTypeChargeId,
              LedgerName: chrgeItem.LedgerName,
              taxslabName: chrgeItem.TaxChargeName,
              AmountCharge: chrgeItem.AmountCharge,
              TaxSlabChargeId: chrgeItem.TaxSlabChargeId,
              TaxAmountCharge: chrgeItem.TaxAmountCharge,
              TotalAmountCharge: chrgeItem.TotalAmountCharge,
              TaxTypeChargeName: chrgeItem.TaxTypeCharge === 0 ? 'Exclusive' : 'Inclusive',
              TaxTypeCharge: chrgeItem.TaxTypeCharge,
              ParentTypeId: chrgeItem.TaxSlabType,
              type: 'charge'
            })
          })
        }

        if (data.Data && data.Data.ItemTaxTransDetails.length > 0) {
          this.taxSlabSummery = []
          data.Data.ItemTaxTransDetails.forEach(item => {
            this.taxSlabSummery.push({
              Id: item.Id,
              Sno: item.Sno,
              TaxTypeTax: item.TaxTypeCharge,
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
          this.stateId = this.inventoryItemSales[0].AddressId
          this.CurrentDate = this.inventoryItemSales[0].CurrentDate
          if (this.inventoryItemSales[0].CurrentDate !== null) {
            this.CurrentDate = this._globalService.utcToClientDateFormat(this.inventoryItemSales[0].CurrentDate, this.clientDateFormat)
          }
          else {
            this.CurrentDate = ''
          }
          if (this.inventoryItemSales[0].DueDate !== null) {
            this.DueDate = this._globalService.utcToClientDateFormat(this.inventoryItemSales[0].DueDate, this.clientDateFormat)
          }
          else {
            this.DueDate = ''
          }
          this.SupplyStateId = this.inventoryItemSales[0].SupplyState
          //this.stateBillingSelect2Id.setElementValue( this.stateId)
          // this.stateShippingSelect2Id.setElementValue(this.SupplyStateId)
          this.clientNameId = this.inventoryItemSales[0].LedgerId
          this.stateList = [{ id: '0', text: this.inventoryItemSales[0].BillingAddressName }]
          this.stateListShip = [{ id: '0', text: this.inventoryItemSales[0].SupplyAddress }]
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
              Sno: ele.Sno,
              Id: ele.Id,
              Paymode: ele.Paymode,
              PayModeId: ele.PayModeId,
              LedgerId: ele.LedgerId,
              ledgerName: ele.BankLedgerName,
              Amount: ele.Amount,
              PayDate: payDate,
              PayShowDate: payDate,
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
            let ExpiryDatevar;
            let MFDatevar;

            if (element.ExpiryDate !== null) {
              ExpiryDatevar = this._globalService.utcToClientDateFormat(element.ExpiryDate, this.clientDateFormat)

            }
            else {
              ExpiryDatevar = ''

            }
            if (element.MfdDate !== null) {
              MFDatevar = this._globalService.utcToClientDateFormat(element.MfdDate, this.clientDateFormat)

            }
            else {
              MFDatevar = ''

            }
            //  const TaxType =  element.TaxType === 0  ? 'Exclusive' : 'Inclusive'
            this.localItemas.push({
              Sno: element.Sno,
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
              MfdDate: MFDatevar,
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
              TaxTypeName: element.TaxType === 0 ? 'Exclusive' : 'Inclusive',
              TaxTypeId: element.TaxType,
              TaxType: JSON.stringify(element.TaxType),
              TaxSlabName: element.TaxSlabName,
              TaxAmount: element.TaxAmount,
              baserate: element.EffectiveRate,
              TotalAmount: element.SubTotalAmount,
              attributeData: this.seteditAttributeData,
              LableAttributeVale: this.localLabelData,
              ReversetotalAmount: element.Total

            })

          })
          console.log(data.Data.ItemTransactions, this.localItemas, 'get-item edit---->>')
          if (this.stateId === 0) {
            this.caseSaleCheckOtherState(0)
            this.isCaseSaleFlag = false
          } else {
            this.checkOtherStateForNewItemAdd(this.inventoryItemSales[0].AddressId)
          }
          this.calculateAllTotal()
        }
      }
      if (data.Code === UIConstant.SERVERERROR) {
        this.toastrService.showError('', data.Description)
      }

    })
  }
  enterPressItem(e: KeyboardEvent) {
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
  itemTaxData: any
  CurrentDateChngae: any
  saveSaleChallan() {

    this.submitSave = true

    if (this.deleteEditflag) {

      this.addItems()
      this.addTransactions()
      this.addAdditionCharge()

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
          if (this.CurrentDate !== '') {
            this.CurrentDateChngae = this._globalService.clientToSqlDateFormat(this.CurrentDate, this.clientDateFormat)
          } else {
            this.CurrentDateChngae = ''
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
          obj['AddressId'] = this.stateIdForBill
          obj['SupplyState'] = this.SupplyStateId,
            obj['ConvertedCurrencyId'] = 0
          obj['PaymentDetail'] = this.transactions
          obj['Items'] = this.items
          obj['ItemAttributeTrans'] = this.sendAttributeData
          obj['CustomerTypes'] = this.caseSaleCustomerDetails
          obj['AdditionalCharges'] = this.AdditionalChargeData
          obj['ItemTaxTrans'] = this.taxSlabSummery
          obj['CurrentDate'] = this.CurrentDateChngae
          obj['EwayBillNo']= this.EwayBillNo
          let _self = this

          console.log('sale-direct-request : ', JSON.stringify(obj))
          this._commonService.postSaleDirectAPI(obj).subscribe(
            (data: any) => {
              if (data.Code === UIConstant.THOUSAND) {
                let saveName = this.MainEditID === 0 ? UIConstant.SAVED_SUCCESSFULLY : UIConstant.UPDATE_SUCCESSFULLY
                _self.toastrService.showSuccess('', saveName)
                _self._commonService.newSaleAdded()
                if (!_self.keepOpen) {
                  _self._commonService.closeSaleDirect()
                  this._commonService.AddedItem()
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
  deleteAttribute(attribute) {
    console.log(this.sendAttributeData, 'Attr')
    if (this.sendAttributeData.length > 0) {
      this.sendAttributeData.forEach((element, index) => {
        attribute.forEach((ele, i) => {
          if (ele.AttributeValue.length > 0) {
            if ((element.Sno === ele.AttributeValue[0].Sno)) {
              this.sendAttributeData.splice(index, 1)
            }
          }

        })

      });
    }
  }
  deleteItem(type, a, sno, id, detail, attribute) {

    console.log(detail, 'delete')
    if (type === 'items') {
      this.lastItemFlag = true
      this.items.splice(a, 1)
      this.localItemas.splice(a, 1)
      console.log(this.items, this.localItemas, 'after delete')
      if (attribute.length > 0) {
        this.deleteAttribute(attribute)
      }
      if (this.items.length === 0 && this.localItemas.length === 0) {
        this.lastItemFlag = false
      }
      // this.calculate()

      this.calculateAllTotal()
      this.calculateTotalOfRow()
      // if(id>0 && sno ===1 ){
      //   this.removeBillSummery(a,'items',detail.Id)
      // }
      if (id > 0 && sno > 0) {
        this.removeBillSummery(a, 'items', detail.Id)
      }
      if (id === 0) {
        this.removeBillSummery(a, 'items', sno)
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
      this.alreadySelectCharge(+detail.LedgerChargeId, detail.LedgerName, false)
      // if(id>0 && sno ===1 ){
      //   this.removeBillSummery(a,'charge',detail.Id)
      // }
      if (id > 0 && sno > 0) {
        this.removeBillSummery(a, 'charge', detail.Id)
      }
      if (id === 0) {
        this.removeBillSummery(a, 'charge', sno)
      }
    }

  }

  AttrColourEditId: any
  AttrSizeEditId: any
  AttrArticleEditId: any
  deleteEditflag: boolean = true
  deleteEditPaymentFlag: boolean = true
  deleteEditChargeFlag: boolean = true
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
  initAttribute() {
    if (this.attrSelect2 && this.attrSelect2.length > 0) {
      this.attrSelect2.forEach((item: Select2Component, index: number, array: Select2Component[]) => {
        if ($('.attr') && $('.attr')[index]) {
        }
        item.setElementValue(0)
      })
    }
  }
  EditAttributeDataValue(data) {
    if (data !== undefined) {
      this.itemsAttribute = []
      if (this.items.length > 0) {
        this.trsnItemId = this.items.length + 1
        for (let i = 0; i < this.items.length; i++) {
          if (this.trsnItemId === this.items[i].Sno) {
            this.trsnItemId = this.trsnItemId + 1
          }
        }
      }
      else {
        this.trsnItemId = 1
      }

      data.forEach((element, index) => {
        if (element.AttributeValue.length > 0) {
          this.itemsAttribute.push({
            Id: element.AttributeValue[0].Id,
            Index: element.AttributeValue[0].Index,
            ItemId: element.AttributeValue[0].ItemId,
            Sno: this.trsnItemId,
            ItemTransId: this.trsnItemId,
            AttributeName: element.AttributeValue[0].AttributeName,
            existId: element.AttributeValue[0].AttributeValueId,
            AttributeValueId: element.AttributeValue[0].AttributeValueId,
            AttributeId: element.AttributeValue[0].AttributeId,
            ParentTypeId: element.AttributeValue[0].ParentTypeId
          })
        }

      })
      console.log(this.itemsAttribute, 'edit attr-data')

    }
  }
  editRowItem(type, index, Sno, editId, item, attributeData) {
    console.log(item, this.items[index], 'edit-item')
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
        this.ReversetotalAmount = item.ReversetotalAmount
        this.MrpRate = item.MrpRate,
          this.Length = item.Length,
          this.Width = item.Width,
          this.Height = item.Height,
          this.unitId = item.UnitId
        this.UnitName = item.UnitName
        this.categoryId = item.CategoryId
        this.updateCategories(this.categoryId)
        console.log(this.categoryId, item.ItemId, 'cat-id--itemId')
        this.itemCategoryId = +item.ItemId
        this.TotalAmount = item.TotalAmount
        this.categoryName = item.CategoryName
        this.taxSalbName = item.TaxSlabName
        setTimeout(() => {
          this.itemSelect2.setElementValue(+item.ItemId)
        }, 1)
        this.taxSelect2.setElementValue(item.TaxSlabId)
        this.unitSelect2.setElementValue(item.UnitId)
        this.taxTypeForItem.setElementValue(item.TaxType)
        this.PurchaseRate = item.PurchaseRate
        this.ExpiryDate = item.ExpiryDate
        this.MfdDate = item.MfdDate
        this.BatchNo = item.BatchNo
        this.ItemName = item.ItemName
        this.taxSlabId = item.TaxSlabId
        this.taxSlabName = item.taxSlabName
        this.TaxTypeId = item.TaxType
        this.TaxTypeName = item.TaxTypeName
        if (this.attrSelect2.length > 0) {
          if (this.editAttributeData !== undefined) {
            this.editAttributeData.forEach((value, inx) => {
              console.log(this.editAttributeData, 'set attr')
              if (value.AttributeValue.length > 0) {
                this.attrSelect2.forEach((item2: Select2Component, indexi: number, array: Select2Component[]) => {
                  let flagReturn = false
                  let findIndex = this.allAttributeData[indexi].data.findIndex(
                    element => (element.id === JSON.parse(value.AttributeValue[0].AttributeId))
                  )
                  if (findIndex !== -1) {
                    item2.setElementValue(this.allAttributeData[indexi].data[findIndex].id)
                  }
                  flagReturn = true
                  return flagReturn
                })
              }

            })
          }
        }
        this.calculateAllTotal()
        this.deleteItem('items', index, Sno, editId, item, attributeData)
        this.EditAttributeDataValue(this.editAttributeData)

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
          this.PayDate = this.transactions[index].PayShowDate
          this.PayShowDate = this.transactions[index].PayShowDate
          this.ChequeNo = this.transactions[index].ChequeNo
          this.paymodeSelect2.setElementValue(this.PayModeId)
          this.ledgerSelect2.setElementValue(this.LedgerId)
          this.deleteItem(type, index, Sno, editId, '', '')
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
        this.taxChargeId = this.AdditionalChargeData[index].TaxSlabChargeId
        this.additionaChargeName = this.AdditionalChargeData[index].LedgerName
        this.AmountCharge = this.AdditionalChargeData[index].AmountCharge
        this.taxChargeName = this.AdditionalChargeData[index].taxslabName
        this.TaxTypeChargeName = this.AdditionalChargeData[index].TaxTypeChargeName
        this.TaxAmountCharge = this.AdditionalChargeData[index].TaxAmountCharge
        this.TotalAmountCharge = this.AdditionalChargeData[index].TotalAmountCharge
        this.chargeSelect2.setElementValue(this.AdditionalChargeData[index].LedgerChargeId)
        this.taxChargeSelect2.setElementValue(this.AdditionalChargeData[index].TaxSlabChargeId)
        this.taxTypeChargeSelect2.setElementValue(this.AdditionalChargeData[index].TaxTypeCharge)
        this.deleteItem(type, index, Sno, editId, this.AdditionalChargeData[index], '')

      } else {
        this.toastrService.showWarning('', 'First Save Charge !')
      }

    }


  }
  PayShowDate: any
  snoForPAymentId: any
  snoForChargeId: any
  taxslabChargeName: any
  @ViewChildren('atrColour_id') atrColorSelect2: QueryList<Select2Component>
  invalidObj3: any = {}
  validateTransaction() {
    if (this.Paymode || +this.PayModeId > 0 || +this.LedgerId > 0 || this.ledgerName || +this.Amount > 0 || this.ChequeNo) {
      let isValid = 1
      if (+this.PayModeId > 0) {
        this.invalidObj3['PayModeId'] = false
      } else {
        isValid = 0
        this.invalidObj3['PayModeId'] = true
      }
      if (+this.LedgerId > 0) {
        this.invalidObj3['LedgerId'] = false
      } else {
        isValid = 0
        this.invalidObj3['LedgerId'] = true
      }
      if (this.ledgerName) {
        this.invalidObj['ledgerName'] = false
      } else {
        isValid = 0
        this.invalidObj3['ledgerName'] = true
      }
      if (+this.Amount > 0) {
        this.invalidObj3['Amount'] = false
      } else {
        isValid = 0
        this.invalidObj3['Amount'] = true
      }
      if (this.PayDate) {
        this.invalidObj3['PayDate'] = false
      } else {
        isValid = 0
        this.invalidObj3['PayDate'] = true
      }
      if (+this.PayModeId === 3) {
        if (this.ChequeNo) {
          this.invalidObj3['ChequeNo'] = false
          this.ChequeNoFlag = false
        } else {
          isValid = 0
          this.invalidObj3['ChequeNo'] = true
          this.ChequeNoFlag = true
        }
      } else {
        this.invalidObj3['ChequeNo'] = false
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
  initialiseTransaction() {
    this.Paymode = ''
    this.PayModeId = 0
    this.LedgerId = 0
    this.Amount = this.Amount
    this.PayDate = ''
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

  select2PaymentModeId(event) {
    if (event.data.length > 0) {
      if (event.data[0].selected) {
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

  }
  paymentLedgerId(event) {
    if (event.data.length > 0) {
      if (event.data[0].selected) {
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

  }
  setpaymentLedgerSelect2(i) {
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
        this.toastrService.showError('', data.Description)
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
            this.deleteItem('trans', i, this.snoForPAymentId, this.transactions[i].Id, this.transactions, '')
          }
        }
      })
  }
  ChequeNoFlag: boolean
  addTransactions() {
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

  unBilledAmount() {
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

  addTransaction() {
    let index;
    this.payDateVar = this._globalService.clientToSqlDateFormat(this.PayDate, this.clientDateFormat)
    if (this.transactions.length === 0) {
      index = 1
    } else {
      index = this.transactions.length + 1
      for (let i = 0; i < this.transactions.length; i++) {
        if (index === this.transactions[i].Sno) {
          index = index + 1
        }
      }
    }
  
    this.transactions.push({
      Id: this.editTransId === 0 ? 0 : this.editTransId,
      Sno: index,
      Paymode: this.Paymode,
      PayModeId: this.PayModeId,
      LedgerId: this.LedgerId,
      ledgerName: this.ledgerName,
      Amount: this.Amount,
      PayShowDate: this.PayDate,
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
  getModuleSettingData() {
    this.applyCustomRateOnItemFlag = false
    this.localItemRate = true
    if (this.getModuleSettingValue.settings.length > 0) {
      this.getModuleSettingValue.settings.forEach(ele => {
        if (ele.id === SetUpIds.catLevel) {
          this.catLevel = JSON.parse(ele.val)
          this.createModels(+this.catLevel)
        }
        if (ele.id === SetUpIds.backDateEntryForSale) {
          this.backDateEntry = JSON.parse(ele.val) === '0' ? false : true
        }
        if (ele.id === SetUpIds.applyCustomRateOnItemForSale) {
          this.applyCustomRateOnItemFlag = JSON.parse(ele.val) === 0 ? false : true
        }
        if (ele.id === SetUpIds.isManualBillNoEntryForsale) {
          this.isManualBillNoEntry = JSON.parse(ele.val)
        }
        if (ele.id === SetUpIds.taxCalInclusive) {
          this.isInclusiveCaseBeforeDiscount = ele.val
        }
        else {
          this.isInclusiveCaseBeforeDiscount = '2'
        }
        if (ele.id === SetUpIds.noOfDecimalPoint) {
          this.decimalDigit = JSON.parse(ele.val)
        }
        if (ele.id === SetUpIds.dateFormat) {
          this.clientDateFormat = ele.val[0].Val
          console.log(this.clientDateFormat)
        }
        if (ele.id === SetUpIds.currency) {
          this.defaultCurrency = ele.val[0].Val
          this.currencyValues.push({ id: 1, symbol: this.defaultCurrency })
          console.log(this.currencyValues)
        }
      })
    }
    alert(this.backDateEntry )
  }

  itemSaleRate: any
  MrpRate: any
  itemCustomSaleRate: any
  filterUnitForItem(UnitData) {
    this.unitDataType = []
    let newdataUnit = [{ id: UIConstant.BLANK, text: 'Select  Unit' }, { id: '-1', text: '+Add New' }]
    if (UnitData && UnitData.SubUnitDetails.length > 0) {
      UnitData.SubUnitDetails.forEach(element => {
        newdataUnit.push({
          id: element.Id,
          text: element.Name
        })

      })
    }
    this.unitDataType = newdataUnit
  }

  getItemRateByLedgerData(ItemId, CustomerId) {
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
        else if (Data.Data && Data.Data.ItemDetails.length > 0) {
          this.unitId = Data.Data.ItemDetails[0].UnitId
          this.taxSlabId = Data.Data.ItemDetails[0].TaxId
          this.UnitName = Data.Data.ItemDetails[0].UnitName
          this.taxSlabName = Data.Data.ItemDetails[0].TaxSlab
          this.Rate = Data.Data.ItemDetails[0].SaleRate
          this.MrpRate = Data.Data.ItemDetails[0].Mrprate
          this.taxSelect2.setElementValue(this.taxSlabId)
          this.unitSelect2.setElementValue(this.unitId)
        }

        this.filterUnitForItem(Data.Data)
    
         this.getTaxDetail(this.taxSlabId)
        this.onChangeSlabTax('item', this.taxSlabId, '')
        this.calculate()
      }
    })

  }
  filteredUniTForItem: any

  checkOtherStateByGSTNumber(GSTCode) {
    
    console.log(this.OrgGstinNoCode, GSTCode, 'GST-org --> GST-Party')
    if(this.gstinTypeOfOrgnization === 1 ){
      this.taxDisabledFlag = false
      if (this.OrgGstinNoCode === GSTCode) {
        this.taxRateForOtherStateFlag = false
      } else {
        this.taxRateForOtherStateFlag = true
      }
      return this.taxRateForOtherStateFlag
    }
    else{
      this.taxDisabledFlag = true
       this.taxRateForOtherStateFlag=true
      return  this.taxRateForOtherStateFlag

    }

  }
  caseSaleCheckOtherState(addressID) {
    if(this.gstinTypeOfOrgnization === 1 ){
      this.taxDisabledFlag=false
      if (this.officeAddressId === addressID) {
        this.taxRateForOtherStateFlag = true
      } else {
        this.taxRateForOtherStateFlag = false
      }
      return this.taxRateForOtherStateFlag
    }
  
      else{
        this.taxDisabledFlag=true
       this.taxRateForOtherStateFlag=true
       return  this.taxRateForOtherStateFlag
      }
    
 
  }
  taxDisabledFlag:boolean 
  checkOtherStateForNewItemAdd(addressID) {
    
    console.log(this.officeAddressId, addressID, 'address org-stateid')
    if(this.gstinTypeOfOrgnization === 1 ){
      this.taxDisabledFlag=false
      if (this.officeAddressId === addressID) {
        this.taxRateForOtherStateFlag = false
      } else {
        this.taxRateForOtherStateFlag = true
      }
    return  this.taxRateForOtherStateFlag

    }
   else{
     this.taxDisabledFlag=true
    this.taxRateForOtherStateFlag=true
    return  this.taxRateForOtherStateFlag
   }

  }


  categories: any
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
  }
  loading: boolean
  catLevel: any = 3
  allCategories: any = []
  getCatagoryDetail(data) {
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
    this.loading = false
  }
  AlreadySelectCategoryId: any
  AlreadySelectCategoryName: any
  disabledItem :boolean= true
  onSelectCategory(evt, levelNo) {
    if (this.catLevel > 1) {
      this.disabledItem = false
      if (+evt.value > 0) {
        if (levelNo === this.catLevel) {
          if (this.categoryId !== +evt.value) {
            this.categoryId = +evt.value
            this.AlreadySelectCategoryId = +evt.value
            this.AlreadySelectCategoryName = evt.data[0].text
            this.categoryName = evt.data[0].text
            console.log(this.categoryId, this.categoryName, '1Cat----------------------->>>>>>>>>')
            this.getItemByCategoryid(+evt.value)
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
            this.loading = false
          }
        }
      }
      if (+evt.value === 0) {
        this.getCatagoryDetail(this.allCategories)
      }
    } else {
  
      if (levelNo === this.catLevel) {
        this.disabledItem = false
        if (this.categoryId !== +evt.value) {
          this.categoryId = +evt.value
          this.categoryName = evt.data[0].text
          this.AlreadySelectCategoryId = +evt.value
          this.AlreadySelectCategoryName = evt.data[0].text
          console.log(this.categoryId, this.categoryName, '2Cat----------------------->>>>>>>>>')
          this.getItemByCategoryid(+evt.value)
          this.updateCategories(+evt.value)
        }
      }
    }
  }


  parentMostCategory: any
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
  getParentCat(id) {
    let parentId = 0
    this.allCategories.forEach(category => {
      if (id === category.Id) {
        parentId = category.ParentId
      }
    })
    return parentId
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
  getParentCatStr(id) {
    let name = ''
    this.allCategories.forEach(category => {
      if (id === category.Id) {
        name = category.Name
      }
    })
    return name
  }

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

  updateLastBillNo(date, orgNo) {
    let dateChnage
    if (date !== '') {
      dateChnage = this._globalService.clientToSqlDateFormat(date, this.clientDateFormat)
    } else {
      dateChnage = ''
    }

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
  selectCountryListId(event) {
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
  getCountry(value) {
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
  getStaeList(id, value) {
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
  selectState(event) {

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
  getCitylist(id, value) {
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
  selectedCityId(event) {
    if (event.data.length > 0) {
      this.cityId = event.value
      this.cityName = event.data[0].text
      this.cityError = false
      if (this.cityId > 0) {
        this.getAreaId(this.cityId)
      }
    }
  }

  private getAreaId(id) {

    // this.openAreaModel()
    this.subscribe = this._coustomerServices.getAreaList(id).subscribe(Data => {
      // console.log(' area list : ', Data)
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
  selectedArea(event) {
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

  validateEmail(email) {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
  }
  checkIsValidMobileNo: any
  checkvalidEmail: boolean
  customerClick: boolean
  checkValidEmail() {
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
  checkValidMobile() {
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
  checkOnInputMobile(e) {
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
  addCaseCustomer() {

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
      console.log(this.caseSaleCustomerDetails, 'customer-add')
      if (!this.editMode) {
        this.customerForm.reset()
        this.countryCodeFlag = '0'
        this.getCountry(0)
      }
      this.clearCaseCustomer()

      $('#cust_detail_m').modal(UIConstant.MODEL_HIDE)
    }

  }
  clearCaseCustomer() {
    this.customerForm.reset()
    this.countryCodeFlag = '0'
  }
  countryListWithCode: any
  searchCountryCodeForMobile(name) {
    this.subscribe = this._commonService.searchCountryByName(name).subscribe(Data => {
      if (Data.Code === 1000 && Data.Data.length > 0) {
        this.countryListWithCode = []
        let newdataList = [{ id: '0', text: 'select code', PhoneCode: '0', Length: 0 }]
        Data.Data.forEach(element => {
          newdataList.push({
            id: element.Phonecode,
            text: '+' + element.Phonecode + '-' + element.Name,
            PhoneCode: element.Phonecode,
            Length: element.Length
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

  enterPaymentSave(e: KeyboardEvent) {
    e.preventDefault()
    this.addTransactions()
    setTimeout(() => {
      this.paymodeSelect2.selector.nativeElement.focus()
    }, 10)

  }
  AmountCharge: any = 0
  TaxAmountCharge: any = 0
  TotalAmountCharge: any
  additionaChargeName: any
  additionChargeId: any
  addAdditionCharge() {
    this.deleteEditChargeFlag = true

    this.validationCharge()
    if (this.additionaChargeName && +this.additionChargeId > 0 && +this.AmountCharge > 0) {
      this.createChargeArray()
      this.alreadySelectCharge(+this.additionChargeId, this.additionaChargeName, true)

      this.clickSaleAdditionCharge = true
      this.calculateAllTotal()
      this.inilizeAdditionCharge()

    }
  }
  validChargeLedger: boolean
  validChargeAmount: boolean


  invalidObj4: any = {}

  validationCharge() {
    let isValid = 1
    if (this.additionChargeId > 0) {
      this.invalidObj4['additionChargeId'] = false
    } else {
      this.invalidObj4['additionChargeId'] = true
      isValid = 0
    }
    if (this.AmountCharge > 0) {
      this.invalidObj4['AmountCharge'] = false
    } else {
      this.invalidObj4['AmountCharge'] = true
      isValid = 0
    }

    return !!isValid
  }



  inilizeAdditionCharge() {
    this.additionaChargeName = ''
    this.additionChargeId = 0
    this.TaxAmountCharge = 0
    this.taxChargeId = 0
    this.AmountCharge = 0
    this.editChargeId = 0
    this.TotalAmountCharge = 0
    this.taxChargeName = ''
    this.allTaxRateForItem = []
    this.clickSaleAdditionCharge = false
    if (this.taxChargeSelect2 && this.taxChargeSelect2.selector.nativeElement.value) {
    }
    if (this.chargeSelect2 && this.chargeSelect2.selector.nativeElement.value) {
      this.chargeSelect2.setElementValue('')

    }
  }


  createChargeArray() {
    let sendForTaxSummery = []
    let index;
    let taxForChargeSlab;
    if (this.AdditionalChargeData.length === 0) {
      index = 1
      taxForChargeSlab = this.taxCalculationForCharge(index)

    } else {
      index = this.AdditionalChargeData.length + 1
      for (let i = 0; i < this.AdditionalChargeData.length; i++) {
        if (index === this.AdditionalChargeData[i].Sno) {
          index = index + 1
        }
      }
      //index = +this.AdditionalChargeData[this.AdditionalChargeData.length - 1].Sno + 1
      taxForChargeSlab = this.taxCalculationForCharge(index)

    }
    this.AdditionalChargeData.push({
      type: 'charge',
      Id: this.editChargeId === 0 ? 0 : this.editChargeId,
      Sno: index,
      LedgerChargeId: this.additionChargeId,
      LedgerName: this.additionaChargeName,
      AmountCharge: this.AmountCharge,
      TaxSlabChargeId: this.taxChargeId,
      taxslabName: this.taxChargeName,
      TaxAmountCharge: this.TaxAmountCharge,
      TotalAmountCharge: this.TotalAmountCharge,
      TaxTypeCharge: this.taxTypeChargeId,
      TaxTypeChargeName: this.TaxTypeChargeName,
    })
    sendForTaxSummery.push({
      type: 'charge',
      Id: this.editChargeId === 0 ? 0 : this.editChargeId,
      Sno: index,
      LedgerChargeId: this.additionChargeId,
      LedgerName: this.additionaChargeName,
      AmountCharge: this.AmountCharge,
      TaxSlabChargeId: this.taxChargeId,
      taxslabName: this.taxChargeName,
      TaxAmountCharge: this.TaxAmountCharge,
      TotalAmountCharge: this.TotalAmountCharge,
      TaxTypeCharge: this.taxTypeChargeId,
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

    console.log(this.AdditionalChargeData, 'charge')

  }
  taxSlabSummery: any
  ParentTypeTaxId: any
  getBillingSummery(data) {
    if (data.length > 0) {
      data.forEach(item => {
        if (item.taxItems.length > 0) {
          let taxDetails = item.taxItems.filter(s => s.itemTransSno === item.Sno)
          if (item.type === 'items' && taxDetails.length > 0) {
            this.ParentTypeTaxId = 6
            taxDetails.forEach(data => {
              this.taxSlabSummery.push({
                id: 0,
                TaxTypeTax: item.TaxType,
                AmountTax: data.AmountTax,
                editSno: data.Id,
                Sno: item.Sno,
                ItemTransTaxId: item.Sno,
                ParentTaxId: 0,
                ParentTypeTaxId: this.ParentTypeTaxId,
                ItemTransTypeTax: 6,
                TaxRateId: data.id,
                TaxRate: data.TaxRate,
                ValueType: data.TaxType,
                TaxSlabName: data.TaxName,
                TaxRateNameTax: data.TaxRateNameTax,
                taxSlabId: data.taxSlabId,
                type: 'items'
              })

            })
          }
          if (item.type === 'charge' && taxDetails.length > 0) {
            this.ParentTypeTaxId = 22
            taxDetails.forEach(data => {
              this.taxSlabSummery.push({
                id: 0,
                TaxTypeTax: item.TaxTypeCharge,
                AmountTax: data.AmountTax,
                ItemTransTaxId: item.Sno,
                Sno: item.Sno,
                editSno: data.Id,
                ParentTaxId: 0,
                ParentTypeTaxId: this.ParentTypeTaxId,
                ItemTransTypeTax: 6,
                TaxRateId: data.id,
                TaxRate: data.TaxRate,
                ValueType: data.TaxType,
                TaxSlabName: data.TaxName,
                TaxRateNameTax: data.TaxRateNameTax,
                taxSlabId: data.taxSlabId,
                type: 'charge'
              })

            })
          }
        }
      })
    }
    console.log(this.taxSlabSummery, "summery")
    this.showBillingSummery(this.taxSlabSummery)
  }
  showtaxSlab: any
  showBillingSummery(data) {

    this.showtaxSlab = []
    let groupOnId = _.groupBy(data, (tax) => {
      return tax.TaxRateId
    })
    //console.log(groupOnId)
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

  enterDownCharge(evt: KeyboardEvent) {
    this.addAdditionCharge()
    setTimeout(() => {
      this.chargeSelect2.selector.nativeElement.focus()
    }, 10)
  }

  CreateDynamicAttributes(data) {
    this.allAttributeData = []
    this.attributesLabels = []
    let obj = {}
    let attributeKeys = []
    let attributesData = []
    data.AttributeValueResponses.forEach(attribute => {
      attributeKeys.push({ 'label': attribute.Name, 'AttributeId': attribute.AttributeId })
      obj['name'] = attribute.Name
      obj['len'] = attribute.AttributeValuesResponse.length
      obj['data'] = [{ id: '0', text: 'Select ' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
      obj['attributeId'] = attribute.AttributeId
      obj['id'] = 0
      attributesData.push({ ...obj })
    })
    let j = 0
    let index = 0
    for (let i = 0; i < data.AttributeValues.length; i++) {
      const attr = data.AttributeValues[i]
      let obj1 = {}
      obj1['id'] = attr.Id
      obj1['text'] = attr.Name
      if (attributesData[j].len === index) {
        j++
        index = 0
      }
      index++
      if (attributesData[j]) {
        attributesData[j].data.push({ ...obj1 })
      } else {
        this.toastrService.showError('Attribute Data not fetching proper', '')
      }
    }
    let attibutesDataToSend = Object.assign([], attributesData)
    let returnObject = { 'attributeKeys': attributeKeys, 'attributesData': attibutesDataToSend }
    console.log(returnObject, 'atr----')
    return returnObject
  }
  pressF10ForSave(e: KeyboardEvent) {
    $(function () {
      $("body").keydown(function (e) {
        e.preventDefault();
        this.saveSaleChallan()
        var keyCode = e.keyCode || e.which;
        console.log(keyCode, 'key-coede');
      });
    });
  }

}
