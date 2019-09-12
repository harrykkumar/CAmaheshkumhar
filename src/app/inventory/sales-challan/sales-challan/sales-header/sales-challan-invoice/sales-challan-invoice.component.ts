import { Component, Renderer2,ViewChild, ViewChildren, QueryList } from '@angular/core'
import { Subscription } from 'rxjs'
import { AddCust, ResponseSale } from '../../../../../model/sales-tracker.model'
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
import {SetUpIds} from 'src/app/shared/constants/setupIds.constant'

declare const _: any
declare var $: any
declare var flatpickr: any
@Component({
  selector: 'app-sales-challan-invoice',
  templateUrl: './sales-challan-invoice.component.html',
  styleUrls: ['./sales-challan-invoice.component.css']
})
export class SalesChallanInvoiceComponent {
  BillNo: string
  SenderId: any
  ReceiverId: string
  InvoiceDate: string
  SupplyDate: any
  CurrencyId: string
  BillAmount: number
  RoundOff: number
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

  Paymode: string
  PayModeId: string
  LedgerId: string
  ledgerName: string
  Amount: number
  PayDate: string
  ChequeNo: string
  paymode: any

  ParcelLength: number
  ParcelHeight: number
  ParcelWidth: number
  items = []
  transactions = []

  VehicleNo: string
  Drivername: string
  Transportation: string
  LocationTo: string
  TotalFreight: number
  TotalQuantity: number
  clientNameSelect2: Array<Select2OptionData>
  suplierNameSelect2: Array<Select2OptionData>
  paymentModeSelect2: Array<Select2OptionData>
  parcelBySelect2: Array<Select2OptionData>
  destinationSelect2: Array<Select2OptionData>
  currenciesSelect2: Array<Select2OptionData>
  paymentLedgerselect2: Array<Select2OptionData>
  public subCategoryType: Array<Select2OptionData>
  public itemcategoryPlaceHolder: Select2Options
  public referalsPlaceHolder: Select2Options
  public frightPlaceholder: Select2Options
  public CommissionTypePlcaholder: Select2Options
  public referalsType: Array<Select2OptionData>
  public stateList:any
  public stateListplaceHolder: Select2Options
  public ledgerChargePlaceHolder :Select2Options
  public referalsTypePlaceHolder: Select2Options
  clientnamePlaceHolder: Select2Options
  paymentPlaceHolder: Select2Options
  ledgerPlaceHolder: Select2Options
  supplierPlaceHolder: Select2Options
  currencyPlaceholder: Select2Options
  destinationPlaceholder: Select2Options
  parcelByPlaceHolder: Select2Options
  orgnazationPlaceHolder: Select2Options
  godownPlaceholder: Select2Options

  public taxTypePlaceHolder: Select2Options
  newCustAddSub: Subscription
  newAttributeADDModel3: Subscription
  newCustAddCutomer: Subscription
  newNewAddress: Subscription
  // newLedgerAddSub: Subscription
  subscribe: Subscription
  modalOpen: Subscription
  additionChargeLedgerModel:Subscription
  modalCategory: Subscription
  itemAddSub :Subscription
  clickItem: boolean = false
  clickTrans: boolean = false
  isValidAmount: boolean = true
  keepOpen: boolean
  submitSave: boolean = false
  itemSubmit: boolean = false
  categoryType: any
  cateGoryValue: any
  attributeValue: any
  itemCatValue: any
  categoryId: any
  public attributeColourPlaceHolder: Select2Options
  public attributeSizePlaceHolder: Select2Options
  public attributeArticlePlaceHolder: Select2Options
  public selectTax: Array<Select2OptionData>
  //
  getUnitId: any
  unitId: any
  taxId: any
  taxValue: any
  categoryPlaceHolder: Select2Options
  editMode: boolean
  Id: any
  CommisionRateType: any
  editItemId: any
  clientDateFormat: string = ''
  industryId: any
  constructor (public renderer2: Renderer2,private _itemmasterServices: ItemmasterServices, private _categoryServices: CategoryServices,
    private _ledgerServices: VendorServices,
    private toastrService: ToastrCustomService,
    public _commonService: CommonService,
    public _globalService: GlobalService,
    public _settings: Settings) {
    this.clientDateFormat = this._settings.dateFormat

    this.CommisionRateType = 0

    this.clientNameSelect2 = []
    this.suplierNameSelect2 = []
    this.paymentModeSelect2 = []
    this.destinationSelect2 = []
    this.sendAttributeData = []
    this.parcelBySelect2 = []

    // this.getClientName(0)

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
          }, 200)
        }
      }
    )
    // add new attribute
    this.newAttributeADDModel3 = this._commonService.getAttributeStatus().subscribe(
      (Attri: AddCust) => {
        if (Attri.id > 0) {
          
          if (this.attributesLabels.length > 0) {
            for (let i = 0; i < this.attributesLabels.length; i++) { 
              if (this.allAttributeData[i].attributeId === Attri.AttributeId) {
                let newData = Object.assign([], this.allAttributeData[i].data)
                newData.push({ id: Attri.id, text: Attri.name, AttributeId: Attri.AttributeId })
                this.allAttributeData[i].data = newData
                this.attrinuteSetDataId = Attri.id
              }
            }
          }
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
          // this.SenderId = data.id
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
          // this.SenderId = data.id
        }
      }
    )
    this.newNewAddress = this._commonService.getAddressStatus().subscribe(
      (data: AddCust) => {

        if (data.id && data.name) {
          let newData = Object.assign([], this.stateList)
          newData.push({ id: data.id, text: data.name })
          this.stateList = newData
          this.stateList  = newData
          this.stateValue = data.id
          this.stateId = +data.stateId
          this.checkOtherStateForNewItemAdd(JSON.parse(data.stateId))
         
        }
      }
    )

    this.modalOpen = this._commonService.getInvoiceStatus().subscribe(
      (status: any) => {
        if (status.open) {
          if (status.editId === UIConstant.BLANK) {
            this.editMode = false
            this.Id = 0
            this.MainEditID =0
           // this.editRowFlag = false
          } else {
            this.editMode = true
            this.MainEditID = status.editId
            this.Id = status.editId
            this.editRowFlag = false
          }
          //  this.setDefaultSelectovalue()
          this.openModalPopup()
        } else {
          this.closeModal()
        }
      }

    )
    this.itemAddSub = this._commonService.getItemMasterStatus().subscribe(
      (data: AddCust) => {
        console.log(data ,'Item_address')
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
          setTimeout(() => {
            this.categoryId = this.AlreadySelectCategoryId
            this.categoryName = this.AlreadySelectCategoryName
            this.updateCategories(this.AlreadySelectCategoryId)
          },100)
          this.getItemRateByLedgerData(+data.id, this.clientNameId)

        }
      }
    )
    this.modalCategory = this._commonService.getCategoryStatus().subscribe(
      (data: AddCust) => {
        
        if (data.id && data.name) {
          let categoryId = data.id
          let categoryName = data.name
          this.isAddNew = true
          this.getAllCategories(categoryName, categoryId, this.isAddNew)
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

  }
  MainEditID: any
  ledgerChargeValue: any
  isAddNew: boolean
  attrinuteSetDataId: any
  ngOnInit () {
    this.Id = 0
    this.AttrId = 0
    this.editItemId = 0
    this.getFreightValueData()
    this.initComp()
    //this.setSupplyDate()
    this.selectTax = []
  }
  @ViewChild('item_select2') itemSelect2: Select2Component
  @ViewChildren('atrColour_id') atrColorSelect2: QueryList<Select2Component>
  @ViewChild('atrSize_id') atrSizeSelect2: Select2Component
  @ViewChild('atrArticle_id') atrArticleSelect2: Select2Component

  getAllCategories (categoryName, categoryId, isAddNew) {
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
  initComp () {
    this.initialiseItem()
    this.initialiseParams()
  }
  attributesLabels: any
  unitDataType: any
  godownDataType: any
  unitPlaceHolder: any
  godownPlaceHolder: any
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
  categorylabels: any
  lastBillNo: any
  officeAddressId: any
  OrgnizationName:any =''
  SPUtilityData() {

    this.subscribe = this._commonService.getSPUtilityData(UIConstant.SALE_CHALLAN_TYPE).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND) {
        if (data.Data && data.Data.Organizations.length > 0) {
          this.orgNameId = data.Data.Organizations[0].Id
          this.OrgnizationName= data.Data.Organizations[0].Name
         }
        if (data.Data.TransactionNoSetups.length > 0) {
          if (!this.editMode) {
            this.BillNo = data.Data.TransactionNoSetups[0].BillNo
            // if (this.isManualBillNoEntry) {
            //   this.BillNo = ''
            //   this.updateLastBillNo(this.InvoiceDate , this.orgNameId)

            // } else {
            //   this.BillNo = data.Data.TransactionNoSetups[0].BillNo

            // }
          }

        }
        this.allAttributeData = []
        this.attributesLabels = []
        if (data.Data && data.Data.AttributeValueResponses && data.Data.AttributeValueResponses.length > 0) {
          
        // if(this.industryId ==='2'){
          let AttributeDetails= this.CreateDynamicAttributes(data.Data)
          this.attributesLabels = AttributeDetails.attributeKeys
          this.allAttributeData = AttributeDetails.attributesData
       //  }
       
        }
        if (this.Id !== 0 && this.editMode && !this.editRowFlag) {
          this.itemTableDisabledFlag =false
          this.editSaleData(this.Id)
        }
        if (data.Data && data.Data.ClientAddresses.length > 0) {
          this.officeAddressId = data.Data.ClientAddresses[0].StateId
        }
     
        this.unitDataType = []
        this.unitPlaceHolder = { placeholder: 'Select Unit' }
        let newdataunit = [{ id: UIConstant.BLANK, text: 'Select  Unit' }, { id: '-1', text: '+Add New' }]
        if (data.Data && data.Data.SubUnits.length > 0) {
          data.Data.SubUnits.forEach(element => {
            if (element.PrimaryUnitId === UIConstant.ZERO) {
              newdataunit.push({
                id: element.Id,
                text: element.Name
              })
            }
          })
        }
        this.unitDataType = newdataunit

        this.godownDataType = []

        this.godownPlaceHolder = { placeholder: 'Select Godown' }
        let newdataGodam = [{ id: '-1', text: '+Add New' }]
        if (data.Data && data.Data.Godowns.length > 0) {
          data.Data.Godowns.forEach(element => {
            newdataGodam.push({
              id: element.Id,
              text: element.Name
            })

          })

          this.godownId = newdataGodam[1].id
        }
        this.godownDataType = newdataGodam

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

        this.itemCategoryType = []
        this.allItemsData = []
        this.itemcategoryPlaceHolder = { placeholder: 'Select Item' }
      //  console.log(data.Data,'itam-data')
        this.itemCategoryType  = [{ id: UIConstant.BLANK, text: 'Select  Item' }, { id: '-1', text: '+Add New' }]
        if (data.Data && data.Data.Items.length > 0) {
          this.allItemsData =  data.Data.Items
          data.Data.Items.forEach(element => {
            this.itemCategoryType.push({
              id: element.Id,
              text: element.Name,
              categoryId: element.CategoryId
            })
          })
        }
        this.itemCategoryType = this.itemCategoryType
       // console.log(this.itemCategoryType ,'iyem-data--')

        // add Referals
        this.referals = []
        let newRefdata = []
        this.referalsPlaceHolder = { placeholder: 'Select  Referals' }
        this.referals = [{ id: '-1', text: 'Select Referals' }]
        if (data.Data && data.Data.Referals.length > 0) {
          data.Data.Referals.forEach(element => {
            newRefdata.push({
              id: element.Id,
              text: element.Name

            })

          })
          this.referals = newRefdata
        }

        // add Referals  type

        this.referalsType = []
        let newRftype = []
        this.referalsTypePlaceHolder = { placeholder: 'Select  Type' }
        this.referalsType = [{ id: '-1', text: 'Select Type' }]
        if (data.Data && data.Data.ReferalTypes.length > 0) {
          data.Data.ReferalTypes.forEach(element => {
            newRftype.push({
              id: element.Id,
              text: element.CommonDesc
            })

          })
          this.referalsType = newRftype
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
        
        //this.taxslabPlaceHolder = { placeholder: 'Tax Slab' }
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
      }
    })
  }
 
 
  TaxTypeId: any
  taxTypeSelectData: any
  getTaxTypeExcluInclusiv () {
    let newDataTaxType = [{ id: '0', text: 'Exclusive' }, { id: '1', text: 'Inclusive' }]
    this.taxTypeSelectData = newDataTaxType
    this.TaxTypeId =  this.taxTypeSelectData[0].id
    this.taxTypeForItem.setElementValue(this.taxTypeSelectData[0].id)
  }


  @ViewChild('taxTypeCharge_select2') taxTypeForItem :Select2Component
  taxSlabSelectoData: any
  additionChargeLedger: any
  editRowFlag: boolean
  referalsID: any
  onChangeReferals (event) {
    if (event.data.length > 0) {
      if (event.data[0].id !== '-1') {
        if (event.data[0].text) {
          this.referalsID = event.value
        }
      }
    }
  }
  allItemsData: any
  referalsTypeID: any
  onChangeReferalsType (event) {
    if (event.data.length > 0) {
      if (event.data[0].id !== '-1') {
        if (event.data[0].text) {
          this.referalsTypeID = event.value
        }
      }
    }
  }

  Commission: any
  CommissionTypeID: any
  onChangeCommissionType (event) {
    if (event.data[0].id === '1') {
      if (event.data[0].text) {
        // this.commision_TypeSelect2.selector.nativeElement.value = ''
        this.CommissionTypeID = event.value
      }
    } else {
      // this.commision_TypeSelect2.selector.nativeElement.value = ''
      this.CommissionTypeID = event.value
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
          if( this.editItemId >0 &&this.editAttributeData.length ===0){
            //this.trsnItemId =  this.editItemId
            this.trsnItemId  = this.items.length + 1
            for(let i=0; i < this.items.length; i ++){
              if(this.trsnItemId === this.items[i].Sno){
                this.trsnItemId =  this.trsnItemId + 1
              }
            }
          }
          if(this.editItemId ===0 && this.items.length >0){
            this.trsnItemId = this.items.length + 1
            for(let i=0; i < this.items.length; i ++){
              if(this.trsnItemId === this.items[i].Sno){
                this.trsnItemId =  this.trsnItemId + 1
              }
            }

          }
          this.attributeName = event.data[0].text
          this.attributeIndex = indexAttribute
          this.itemAttribute(this.existId, this.attributeIndex, editAttrId)
        }
      } else {
        let data = {
          addNewId:  attributeData.attributeId,
          attrNameId:  attributeData.attributeId,
          attrValue:  attributeData.attributeId,
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

  itemAttribute (existid, attrIndex, AttrEditId) {
    if (this.itemsAttribute.length > 0) {
      let data = this.itemsAttribute.filter(s => s.existId === existid)
      let index = this.itemsAttribute.findIndex(n => n.existId === existid)
      if (data.length > 0) {
        let newArray = {
          Id: AttrEditId,
          Index: attrIndex,
          Sno:this.trsnItemId,
          ItemId: this.itemCategoryId,
          ItemTransId: this.trsnItemId,
          AttributeName: this.attributeName,
          existId: existid,
          AttributeValueId: existid,
          AttributeId: this.AttrValueId
        }
        this.itemsAttribute.splice(index, 1, newArray)
      } else {
        this.itemsAttribute.push({
          Id: AttrEditId,
          Index: attrIndex,
          Sno:this.trsnItemId,
          ItemId: this.itemCategoryId,
          ItemTransId: this.trsnItemId,
          AttributeName: this.attributeName,
          existId: existid,
          AttributeValueId: existid,
          AttributeId: this.AttrValueId

        })
      }
    } else {
      this.itemsAttribute.push({
        Id: AttrEditId,
        Index: attrIndex,
        Sno:this.trsnItemId,
        ItemId: this.itemCategoryId,
        ItemTransId: this.trsnItemId,
        AttributeName: this.attributeName,
        existId: existid,
        AttributeValueId: existid,
        AttributeId: this.AttrValueId

      })
    }
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

  CommissionTypeId: any
  getCommisionTypeValue () {
    // ;
    this.CommissionType = []
    this.CommissionType = [{ id: '1', text: '%' }, { id: '2', text: '$' }]
    this.CommissionTypeId = this.CommissionType[0].id

    // this.onChangeCommissionType(this.CommissionTypeID)
  }
  onChangeFreight (event) {
    if (event.data.length > 0) {
      if (event.data[0].text) {
        this.freightById = event.value
      }

    }
  }
  godownId: any

  godownName: any
  onChangeGodown (event) {
    if (event.data.length > 0) {
      if (event.data && event.data[0].text) {
        this.godownId = event.value
        this.godownName = event.data[0].text
        //  this.currencyValues[1] = { id: 1, symbol: event.data[0].text }

      }
    }

  }

  UnitName: any
  onSelectUnitId (event) {
    if (event.data.length > 0) {
      if (event.data[0].id !== UIConstant.BLANK) {
        if (event.value === '-1' && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
          this.unitSelect2.selector.nativeElement.value = ''
          if (+this.unitSettingType === 1) {
            this._commonService.openUnit('')
          }
          if (+this.unitSettingType === 2) {
            this._commonService.openCompositeUnit('')
          }
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
  clientNameId: any
  itemTableDisabledFlag: boolean

  @ViewChild('client_select2') clientSelect2: Select2Component
  @ViewChild('unit_select2') unitSelect2: Select2Component

  onSelected2clientId (event) {
    if (event.data.length > 0) {
      this.stateList = []
      if (event.data && event.data[0].id !== '') {
        if (event.value === '-1' && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
          this.clientSelect2.selector.nativeElement.value = ''
          this._commonService.openCust('',true)
        } else {
          this.itemTableDisabledFlag = false
          this.clientNameId = event.value
          let parentTypeId = 5
          this.getGSTByLedgerAddress( this.clientNameId )
          this.getAddressOfCustomerByID(this.clientNameId, parentTypeId)

        }
      }
    }
  }
  stateAddressId: any
  stateValue: any
  stateId: any
  stateError: boolean
  addressStateId: any
  getAddressOfCustomerByID (customerId, parentTypeId) {
    
    this.subscribe = this._commonService.getAddressByIdOfCustomer(customerId, parentTypeId).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND) {
        this.stateList = []
        this.stateListplaceHolder = { placeholder: 'Select Address' }
        this.stateList = [{ id: '', text: 'Select Address' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
        if (data.Data && data.Data.length > 0) {
         let localId = this.getBillingAddressList(data)
         this.stateSelect2Id.setElementValue(localId)
          let  localEvent ={value:this.stateList[2].id,data:[{id:this.stateList[2].id,text:this.stateList[2].text,stateId:this.stateList[2].stateId}]}
          this.selectStatelist(localEvent)
         
        } 

      }
    })
  }
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
    return this.stateValue
  }
  updatedFlag: any
  newdataCatItem: any
  getItemByCategoryid (categoryId) {
    if(+categoryId >0){
    categoryId = JSON.stringify(categoryId)
    this.updatedFlag = false
    this.itemCategoryType = []
    let newdataitem = [{ id: UIConstant.BLANK, text: 'Select  Item' ,categoryId: '' }, { id: '-1', text: '+Add New', categoryId: '' }]
    this.subscribe = this._commonService.getItemByCategoryId(categoryId).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND && data.Data.length > 0) {
        this.updatedFlag = true
        data.Data.forEach(element => {
            // 
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
  }
  categoryName: any

  itemCategoryId: any
  ItemName: any
  itemAddRequiredFlag: boolean
  onSelectItemCategory (event) {
    if (event.data.length > 0) {
      if (event.data[0].id !== '') {
        this.editRowFlag = true
        if (event.value === '-1' && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
          this.itemSelect2.selector.nativeElement.value = ''
          this._commonService.openItemMaster('',this.categoryId)
        } else {
          this.itemCategoryId = event.value
          this.ItemName = event.data[0].text
          this.categoryId = event.data[0].categoryId
          if (event.data[0].selected) {
            this.getItemRateByLedgerData(this.itemCategoryId, this.clientNameId)
          }
          this.updateCategories(this.categoryId)
          this.validationForItemData()
        }
      }
    }
  }
  itemSaleRate: any
  MrpRate: any
  taxSlabId:any
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
  getItemRateByLedgerData (ItemId, CustomerId) {
    this.itemSaleRate = 0
    this.itemCustomSaleRate = 0
    this.MrpRate = 0
    this.subscribe = this._commonService.getItemRateByLedgerAPI(ItemId, CustomerId).subscribe(Data => {
      if (Data.Code === UIConstant.THOUSAND) {
          if (Data.Data && Data.Data.ItemCustomRateWithItemDetails.length > 0) {
            if (this.applyCustomRateOnItemFlag) {
              this.Rate = Data.Data.ItemCustomRateWithItemDetails[0].SaleRate
              this.MrpRate = Data.Data.ItemCustomRateWithItemDetails[0].Mrp
              this.taxSlabId = Data.Data.ItemCustomRateWithItemDetails[0].TaxId
              this.unitId = Data.Data.ItemCustomRateWithItemDetails[0].UnitId
              this.UnitName = Data.Data.ItemCustomRateWithItemDetails[0].UnitName
              this.unitSelect2.setElementValue(this.unitId)
            }
          }
       else if (Data.Data && Data.Data.ItemDetails.length > 0) {
          this.unitId = Data.Data.ItemDetails[0].UnitId
          this.taxSlabId = Data.Data.ItemDetails[0].TaxId
          this.UnitName = Data.Data.ItemDetails[0].UnitName
          this.Rate = Data.Data.ItemDetails[0].SaleRate
          this.MrpRate = Data.Data.ItemDetails[0].Mrprate
          this.unitSelect2.setElementValue(this.unitId)
        }
        this.filterUnitForItem(Data.Data)
        //this.onChangeSlabTax('item',this.taxSlabId,'')
        this.calculate()
      }
    })

  }
  categoryTypeData: any
  autoCategory: any
  setupOrganization: any
  organizationData: any
  enableDisableflagOrgName: boolean = true


  getNewBillNo () {
    if(this.InvoiceDate !=='' && this.orgNameId>0){
      let dateChnage = this._globalService.clientToSqlDateFormat(this.InvoiceDate, this.clientDateFormat)
      this.subscribe = this._commonService.getsettingforOrgnizationData(this.orgNameId, 'SaleChallan ', dateChnage).subscribe(data => {
        if (data.Code === UIConstant.THOUSAND && data.Data.length > 0) {
          this.BillNo = data.Data[0].BillNo
        }
  
      })
    }
  
  }

  orgNameId: any =0
  OrgId: any
  
  updateLastBillNo (date,orgNo) {
    let dateChnage = this._globalService.clientToSqlDateFormat(date, this.clientDateFormat)
    this._commonService.getLastBillNo(UIConstant.SALE_TYPE,dateChnage,orgNo).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND && data.Data.length > 0) {
        this.lastBillNo = data.Data[0].BillNo
      ///  console.log(this.lastBillNo ,'last-bill')

      }
    })

  }

  Remark: any
  showItemAttributeArray: any
  newShowlocalarray: any
  labeldata: any
  localLabelData: any

  localAddAttribute () {
    if( this.itemsAttribute.length > 0){
      for (let i = 0; i < this.itemsAttribute.length; i++) {
        this.sendAttributeData.push({
          AttributeId: this.itemsAttribute[i].AttributeId,
          AttributeName: this.itemsAttribute[i].AttributeName,
          Index: this.itemsAttribute[i].Index,
          Sno: this.itemsAttribute[i].Sno,
          Id: this.itemsAttribute[i].Id,
          ItemId: this.itemsAttribute[i].ItemId,
          AttributeValueId: this.itemsAttribute[i].AttributeValueId,
          ItemTransId: this.itemsAttribute[i].ItemTransId,
          existId: this.itemsAttribute[i].existId
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
              value = this.labeldata.filter(v => v.Sno === element.Sno)

            }
            this.localLabelData.push({
              AttributeId: label.AttributeId,
              Label: label.Name,
              AttributeValue: value

            })
          })
        }
        else{
          if(this.attributesLabels.length > 0 ){
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
          CategoryName: element.CategoryName,
          CategoryId:element.CategoryId,
          ItemName: element.ItemName,
          UnitName: element.UnitName,
          UnitId: element.UnitId,
          Length: element.Length,
          Height: element.Height,
          Width: element.Width,
          ExpiryDate: element.ExpiryDateToshow,
          MfdDate: element.MfDateToshow,
          BatchNo: element.BatchNo,
          ItemId: element.ItemId,
          Remark: element.Remark,
          Quantity: +element.Quantity,
          Rate: +element.SaleRate,
          TotalAmount: +element.TotalAmount,
          TransId: element.TransId,
          LableAttributeVale: this.localLabelData,
          ReversetotalAmount:element.ReversetotalAmount,


        })
      } else if (this.editItemId > 0 && element.rowEditFlagValue && (element.Sno === this.snoIndex)) {
        // ;
        if (this.sendAttributeData.length > 0) {
          this.attributesLabels.forEach(label => {
            this.labeldata = this.sendAttributeData.filter(s => (s.AttributeValueId === label.AttributeId) && (s.Sno === element.Sno))
            value = []
            if (this.labeldata.length > 0) {
              value = this.labeldata.filter(v => v.Sno === element.Sno)

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
          CategoryName: element.CategoryName,
          CategoryId:element.CategoryId,
          ItemName: element.ItemName,
          UnitName: element.UnitName,
          Length: element.Length,
          Height: element.Height,
          Width: element.Width,
          ExpiryDate: element.ExpiryDateToshow,
          MfdDate: element.MfDateToshow,
          BatchNo: element.BatchNo,
          UnitId: element.UnitId,
          ItemId: element.ItemId,
          Remark: element.Remark,
          Quantity: +element.Quantity,
          Rate: +element.SaleRate,
          TotalAmount: +element.TotalAmount,
          TransId: element.TransId,
          LableAttributeVale: this.localLabelData,
          ReversetotalAmount:element.ReversetotalAmount,


        })
      }
    })
    this.editAttributeData = undefined
    this.disabledAddressFlag = true

    console.log(this.localItemas,this.showAttributeData,this.localLabelData ,"localitem----")
  }

  addItems () {
    this.deleteEditflag = true
    if (this.editAlreadyItemDataFlag) {
      this.localItemas = []

    } else {
      this.itemSubmit = true

    }
    if (this.validationForItemData()) {
      if (this.categoryId > 0 && this.itemCategoryId > 0 && this.Quantity) {
        this.addItem()
        this.clickItem = true
        this.calculateAllTotal()
        this.calculateTotalOfRow()
        this.calTotalBillAmount()
        this.clickItem = true
        this.initialiseItem()
      }

    }
  }

  Length: any
  Height: any
  Width: any
  ExpiryDate: any
  MfdDate: any
  BatchNo: any
  lastItemFlag: boolean
  trsnItemId: any
  snoIndex: any
  ExpiryDateChngae: any
  MFDateChngae: any
  addItem () {
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
    if (this.items.length === 0) {
      this.snoIndex = 1

    } else {
      this.snoIndex = this.items.length + 1
      for(let i=0; i < this.items.length; i ++){
        if(this.snoIndex === this.items[i].Sno){
          this.snoIndex =  this.snoIndex + 1
        }
      }

    }
    
    this.items.push({
      Id: this.editItemId !== 0 ? this.editItemId : 0,
      Sno: this.snoIndex,
      CategoryId:this.categoryId,
      CategoryName: this.getPattern(),
      ItemName: this.ItemName,
      UnitName: this.UnitName,
      UnitId: this.unitId,
      Length: this.Length,
      Height: this.Height,
      Width: this.Width,
      ExpiryDate: this.ExpiryDateChngae,
      ExpiryDateToshow: this.ExpiryDate,
      MfDateToshow: this.MfdDate,
      MfdDate: this.MFDateChngae,
      BatchNo: this.BatchNo,
      ItemId: this.itemCategoryId,
      Remark: this.Remark,
      Quantity: +this.Quantity,
      SaleRate:+this.Rate,
      TotalAmount: +this.TotalAmount,
      TransId: 0,
      rowEditFlagValue: true,
      ReversetotalAmount:+this.ReversetotalAmount,

    })
    setTimeout(() => {
      this._commonService.fixTableHFL('item-table')
    }, 1)
    console.log(this.items,'recently add -item')
    this.localAddAttribute()
    this.localItems()
    

  }

  rowIndex: any
  AttrId: any
  ReversetotalAmount: any
  initialiseItem () {
    this.ReversetotalAmount = 0

    this.Remark = ''
    this.Rate = ''
    this.Quantity = 1
    this.TotalAmount = 0
    this.Width = 1
    this.Length = 1
    this.Height = 1
    this.RoundOff = 0
    this.BatchNo = ''
    this.ExpiryDate = ''
    this.MfdDate = ''
    this.clickItem = false
    this.unitId = 0
    this.itemCategoryId = 0
    if (this.allCategories && this.allCategories.length > 0) {
      this.getCatagoryDetail(this.allCategories)
    }
    this.initAttribute()
  
  }
  initAttribute () {
    if (this.attrSelect2 && this.attrSelect2.length > 0) {
      this.attrSelect2.forEach((item: Select2Component, index: number, array: Select2Component[]) => {
        if ($('.attr') && $('.attr')[index]) {
        }
        item.setElementValue(0)
      })
    }
  }
  @ViewChild('orgnization_select2') orgnizationSelect2: Select2Component
  @ViewChild('state_Select2Id') stateSelect2Id: Select2Component
  @ViewChild('currency_select2') currencySelect2: Select2Component
  @ViewChild('parcelby_select2') parcelbySelect2: Select2Component
  @ViewChild('dest_select2') destSelect2: Select2Component
  @ViewChild('freight_By') freightBySelect2: Select2Component
   // tslint:disable-next-line:variable-name
  @ViewChild('referal_type') referal_typeSelect2: Select2Component
  // tslint:disable-next-line:variable-name
  @ViewChild('referal_id') referal_idSelect2: Select2Component
  //  @ViewChild('commision_Type') commision_TypeSelect2: Select2Component
  currencyValues: any
  clickSaleAdditionCharge: boolean
  initialiseParams () {
    this.items = []
    this.clickSaleAdditionCharge =false
    this.localItemas = []
    this.sendAttributeData = []
    this.showAttributeData = []
    this.taxSlabSummery=[]
    this.showtaxSlab=[]
    this.transactions = []
    this.submitSave = false
    this.itemSubmit = false
    this.clickItem = false
    this.clickTrans = false
    this.isValidAmount = true
    this.deleteEditflag = true
    this.InvoiceDate = ''
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
    this.ParcelLength = 0
    this.ParcelHeight = 0
    this.ParcelWidth = 0
    this.Width = 1
    this.Length = 1
    this.BatchNo = ''
    this.Height = 1
    this.ExpiryDate = ''
    this.MfdDate = ''
    

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
    // if (this.commision_TypeSelect2 && this.commision_TypeSelect2.selector.nativeElement.value) {
    //   this.commision_TypeSelect2.setElementValue('')
    // }
    if (this.stateSelect2Id && this.stateSelect2Id.selector.nativeElement.value) {
      this.stateSelect2Id.setElementValue('')
    }
    if (this.orgnizationSelect2 && this.orgnizationSelect2.selector.nativeElement.value) {
      this.orgnizationSelect2.setElementValue('')
    }

  }


  setExpiryDate () {
       this.ExpiryDate =''
  }
  setMFDate () {
          this.MfdDate =''    
  }
  CurrentDate: any
  // setCurrentDate () {
  //   this.CurrentDate = this._globalService.getDefaultDate(this.clientDateFormat)
  // }
  setBillDate (setups) {
    if (setups && setups.length > 0) {
      this.InvoiceDate  = this._globalService.utcToClientDateFormat(setups[0].CurrentDate, this.clientDateFormat)

    }
   // this.InvoiceDate = this._globalService.getDefaultDate(this.clientDateFormat)
  }
  setSupplyDate () {
    this.SupplyDate = this._globalService.getDefaultDate(this.clientDateFormat)
  }
  

  clearExtras () {
    this.setupModules = {}
    this.currenyValues = [{ id: '0', symbol: '%' }]
    this.clientNameId = ''
    this.BillNo = ''
    this.clientNameSelect2 = []
    this.organizationData = []

    this.inilizeAdditionCharge()

  }
  

  calculateTotalOfRow () {
    let totalQty = 0
    let Rate = (isNaN(+this.Rate)) ? 0 : +this.Rate
    let Quantity = (isNaN(+this.Quantity)) ? 1 : +this.Quantity
    let Height = (this.Height === 0 || this.Height === null) ? 1 : +this.Height
    let Length = (this.Length === 0 || this.Length === null) ? 1 : +this.Length
    let Width = (this.Width === 0 || this.Width === null) ? 1 : +this.Width
    this.TotalAmount = Rate * Quantity * Height * Length * Width
    let totalAmount = this.TotalAmount
    return isNaN(totalAmount) ? 0 : totalAmount

  }

  netBillAmount: any =0

  calculate () {

    this.TotalAmount = +this.calculateTotalOfRow()
   this.ReversetotalAmount = +this.reversetotalCalcution()

    this.calculationAdditionCharge()
    this.calculateForTotalAmount()
    this.calculateAllTotal()
    this.calTotalBillAmount()

  }


  reversetotalCalcution ( ){
    
    this.ReversetotalAmount  = 0
    let Rate = (isNaN(+this.Rate)) ? 0 : +this.Rate
    let Quantity = (isNaN(+this.Quantity)) ? 1 : +this.Quantity
    let Height = (this.Height === 0 || this.Height === null) ? 1 : +this.Height
    let Length = (this.Length === 0 || this.Length === null) ? 1 : +this.Length
    let Width = (this.Width === 0 || this.Width === null) ? 1 : +this.Width
    this.ReversetotalAmount = ( Rate *  Quantity * Height * Length * Width )

    return isNaN(this.ReversetotalAmount) ? 0 : this.ReversetotalAmount
  }
  getReverseSaleRate (){
    let Quantity = (isNaN(+this.Quantity)) ? 1 : +this.Quantity
    this.Rate = this.ReversetotalAmount / Quantity
    this.calculate()
  }
  calTotalBillAmount () {
    let totalBillAmt = 0
    let totalQty = 0
    for (let i = 0; i < this.localItemas.length; i++) {
      totalBillAmt = totalBillAmt + (isNaN(+this.localItemas[i].Rate) ? 0 : +this.localItemas[i].Rate) *
        (isNaN(+this.localItemas[i].Quantity) ? 1 : +this.localItemas[i].Quantity) *
        (isNaN(+this.localItemas[i].Height) ? 0 : +this.localItemas[i].Height) *
        (isNaN(+this.localItemas[i].Width) ? 0 : +this.localItemas[i].Width) *
        (isNaN(+this.localItemas[i].Length) ? 0 : +this.localItemas[i].Length)
      totalQty = totalQty + (isNaN(+this.localItemas[i].Quantity) ? 0 : +this.localItemas[i].Quantity)
    }
    if (!this.clickItem) {

      if (this.Rate !== '') {
        totalBillAmt += +this.Rate * this.Quantity  * this.Length * this.Height * this.Width
      }
    }
    if (totalQty) {
      totalQty = totalQty
    }
    this.TotalQuantity = totalQty
    this.netBillAmount = (totalBillAmt + +this.TotalChargeAmt).toFixed(this.decimalDigitData)

  }
  TotalAllFreight: any
  OtherAllCharge: any
  totalCommsion: any
  calculateAllTotal () {
    let totalQty = 0
    let totalAmt = 0
    let totalDiscount = 0
    let totalTax = 0
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
    if (!this.clickItem) {

      if (totalQty) {
        totalQty = totalQty
      }

      this.TotalQuantity = totalQty
      this.TotalChargeAmt = TotalAmountCharge
      this.calTotalBillAmount()
    }

  }
  TotalChargeAmt: number
  calculateForTotalAmount () {
    let totalAmount = 0
    for (let i = 0; i < this.localItemas.length; i++) {
      totalAmount = +totalAmount + +(this.localItemas[i].Quantity * this.localItemas[i].Rate * 
         this.localItemas[i].Height * this.localItemas[i].Length * this.localItemas[i].Width )

    }

    if (!this.clickItem) {
      if (this.TotalAmount !== 0 && typeof this.TotalAmount !== 'undefined' && !isNaN(+this.TotalAmount)) {
        totalAmount = totalAmount + +this.TotalAmount

      }
    }

    if (!isNaN(totalAmount)) {
      this.RoundOff = +(Math.round(totalAmount) - totalAmount).toFixed(this.decimalDigitData)
      this.netBillAmount = Math.round(totalAmount).toFixed(this.decimalDigitData)

    }

  }

  identify (index, item) {
    item.Sno = index + 1
    return item.Sno - 1
  }

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

  ngOnDestroy () {
    this.modalOpen.unsubscribe()
    this.newAttributeADDModel3.unsubscribe()
    this.modalCategory.unsubscribe()
    this.additionChargeLedgerModel.unsubscribe()
    this.itemAddSub.unsubscribe()
    this.newCustAddSub.unsubscribe()
    this.newCustAddCutomer.unsubscribe()
    this.newNewAddress.unsubscribe()
  }
  loginCategoryLevel: any
  editChargeId: any
  deleteEditChargeFlag: boolean
  getModuleSettingValue:any
  OrgGstinNo:any
  OrgGstinNoCode:any
  getOrgnizationGSTNOCode ( ){
    let CompanyDetails= JSON.parse(this._settings.CompanyDetails)  
    this.OrgGstinNo = CompanyDetails.GstinNo
    if(CompanyDetails.GstinNo !==null){
      let str = CompanyDetails.GstinNo
      let val =  str.trim();
      this.OrgGstinNoCode = val.substr(0,2);
      this.checkOtherStateByGSTNumber(this.OrgGstinNoCode)
    }
  }

  checkOtherStateByGSTNumber(GSTCode) {
    console.log(this.OrgGstinNoCode, GSTCode, 'GST-org --> GST-Party')
    if (this.OrgGstinNoCode === GSTCode) {
      this.taxRateForOtherStateFlag = false
    } else {
      this.taxRateForOtherStateFlag = true
    }
    return this.taxRateForOtherStateFlag
  }
  ledgerStateId:any
  PartyGstinNoCode:any
  outStandingBalance:any =0
  setCRDR:any
  getGSTByLedgerAddress(ledgerId) {
    this.subscribe = this._commonService.ledgerGetGSTByAddress(ledgerId).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND) {
        console.log(data.Data ,'GST---------->>')
        if (data.Data.LedgerDetails.length > 0) {
          this.outStandingBalance = (data.Data.LedgerDetails[0].OpeningAmount).toFixed(this.decimalDigitData)
          this.setCRDR = data.Data.LedgerDetails[0].Crdr ===0 ? 'Dr' :'Cr' ;
          if(data.Data.LedgerDetails[0].GstinNo !==null){
            let str = data.Data.LedgerDetails[0].GstinNo
            let val =  str.trim();
            this.PartyGstinNoCode =val.substr(0,2);
            this.checkOtherStateByGSTNumber(this.PartyGstinNoCode)
          }
        }
        if (data.Data.AddressDetails.length > 0) {
          this.ledgerStateId = data.Data.AddressDetails[0].StateId
          this.checkOtherStateForNewItemAdd(this.ledgerStateId)
        }
      }
    })
  }
  openModalPopup () {
    this.outStandingBalance =0
    
    this.currencyValues = [{ id: 0, symbol: '%' }]
    this.deleteEditChargeFlag= true
    this.allTaxRateForCharge=[]
    this.itemTableDisabledFlag = true
    this.editChargeId =0
    this.getOrgnizationGSTNOCode()
    this.getModuleSettingValue = JSON.parse(this._settings.moduleSettings)
    this.getModuleSettingData()
    this.industryId =this._settings.industryId
    this.getCommisionTypeValue()
    this.godownId = 0
    this.itemAddRequiredFlag = false
    this.editAlreadyItemDataFlag = false
    this.showAttributeData = []
    this.localLabelData = []
    this.trsnItemId = 1
    this.itemsAttribute = []
    this.SPUtilityData()
    this.getNewCurrentDate()
    this.getNewBillNo()
    this.editItemId = 0
    this.initComp()
    this.getModuleSettingData()
    
    this.setSupplyDate()
    // this.setBillDate()
   
    this.setExpiryDate()
    this.setMFDate()   
    //this.setCurrentDate()
   

    this.AdditionalChargeData =[]
    $('#sale_challan_form1').modal(UIConstant.MODEL_SHOW)
    setTimeout(() => {
      this.clientSelect2.selector.nativeElement.focus()
    }, 1000)
  }

  closeModal () {
    if ($('#sale_challan_form1').length > 0) {
      $('#sale_challan_form1').modal(UIConstant.MODEL_HIDE)
    }
  }
  getNewCurrentDate() {
    this._commonService.getCurrentDate().subscribe(
      data => {
        if (data.Code === UIConstant.THOUSAND && data.Data.length > 0) {
          this.setBillDate(data.Data)
          //this.setDueDate(data.Data)

        }
      }
    )
  }
  closeInvoice () {
    this._commonService.closeInvoice()
  }
  disabledAddressFlag: boolean = false
  stateIdForBill: any
  selectStatelist (event) {
    if (event.data.length > 0) {
      if (event.data[0].id !== '') {
        if (event.value === '-1' && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
          this.stateSelect2Id.selector.nativeElement.value = ''

          this._commonService.openAddress(this.clientNameId)

        } else {
          this.stateId = event.value
          this.disabledAddressFlag = false
          if( event.data[0].stateId > 0){
            this.checkOtherStateForNewItemAdd(event.data[0].stateId)
          }
         // this.onChangeSlabTax('item',this.taxSlabId,'')
         // this.calculate()
          this.stateIdForBill = event.data[0].id
          this.stateError = false
          this.checkValidation()
        }

      }

    }

  }
  invalidObjmain: any ={}

  checkValidation (): boolean {
    let isValid = 1
    if (this.clientNameId) {
      this.invalidObjmain['clientNameId'] = false
    } else {
      this.invalidObjmain['clientNameId'] = true
      isValid = 0
    }
   
    if (this.BillNo) {
      this.invalidObjmain['BillNo'] = false
    } else {
      this.invalidObjmain['BillNo'] = true
      isValid = 0
    }

    if (this.SupplyDate) {
      this.invalidObjmain['SupplyDate'] = false
    } else {
      this.invalidObjmain['SupplyDate'] = true
      isValid = 0
    }
    if (this.stateId) {
      this.invalidObjmain['stateId'] = false
    } else {
      this.invalidObjmain['stateId'] = true
      isValid = 0
    }
    if (this.InvoiceDate) {
      this.invalidObjmain['InvoiceDate'] = false
    } else {
      this.invalidObjmain['InvoiceDate'] = true
      isValid = 0
    }
    if (this.InvoiceDate) {
      this.invalidObjmain['CurrentDate'] = false
    } else {
      this.invalidObjmain['CurrentDate'] = true
      isValid = 0
    }
    return !!isValid
  }
  invalidObj: any ={}
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
    if (this.Quantity > 0) {
      this.invalidObj['Quantity'] = false
    } else {
      this.invalidObj['Quantity'] = true
      isValidItem = 0
    }
    if(this.industryId === '5' ){
      if (this.BatchNo !=="") {
        this.invalidObj['BatchNo'] = false
      } else {
        this.invalidObj['BatchNo'] = true
        isValidItem = 0
      }
    }
    if(this.industryId === '6' ){
      if (this.BatchNo !=="") {
        this.invalidObj['BatchNo'] = false
      } else {
        this.invalidObj['BatchNo'] = true
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

  getAvailableCurrency () {
    return this._commonService.setupSettingByType(UIConstant.SALE_CHALLAN_TYPE)
  }

  getEditableUnitData: any = []
  setEditableUnit = (itemId) => {
    this.unitDataType = []
    let newdataUnit = [{ id: UIConstant.BLANK, text: 'Select  Unit' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
    if (this.getEditableUnitData.length > 0) {
      this.getEditableUnitData.forEach(element => {
        if (itemId === element.ItemId) {
          newdataUnit.push({
            id: element.UnitId,
            text: element.SubUnitName
          })
        }
      })
    }
    this.unitDataType = newdataUnit
  }
  inventoryItemSales: any
  ItemTransactionactions: any
  itemAttbute: any
  ColorCode: any
  SizeCode: any
  ArticleCode: any
  editAlreadyItemDataFlag: boolean
  editSaleData (id) {
    this._commonService.saleEditChallan(id).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        console.log(JSON.stringify(data) ,'editdata---')
        if (data.Data && data.Data.SubUnitWithItems && data.Data.SubUnitWithItems.length > 0) {
          this.getEditableUnitData = []
          this.getEditableUnitData = data.Data.SubUnitWithItems
        }
        if (data.Data && data.Data.InventoryTransactionSales.length > 0) {
          this.inventoryItemSales = []
          this.inventoryItemSales = data.Data.InventoryTransactionSales
          this.itemsAttribute = []
          this.clientNameId = this.inventoryItemSales[0].LedgerId
          this.orgNameId = this.inventoryItemSales[0].OrgId
          this.stateId = this.inventoryItemSales[0].SupplyState
          this.orgnizationSelect2.setElementValue(this.inventoryItemSales[0].OrgId)
          this.clientSelect2.setElementValue(this.inventoryItemSales[0].LedgerId)
          this.BillNo = this.inventoryItemSales[0].BillNo
          this.InvoiceDate = this._globalService.utcToClientDateFormat(this.inventoryItemSales[0].BillDate, this.clientDateFormat)
          if(this.inventoryItemSales[0].CurrentDate !== null ){
            this.CurrentDate = this._globalService.utcToClientDateFormat(this.inventoryItemSales[0].CurrentDate, this.clientDateFormat)
         }
         else{
          this.CurrentDate = ''
         }
         if(this.inventoryItemSales[0].SupplyDate	 !== null ){
          this.SupplyDate = this._globalService.utcToClientDateFormat(this.inventoryItemSales[0].SupplyDate, this.clientDateFormat)
        }
        else{
          this.SupplyDate = ''
        }
          // this.SupplyDate = this._globalService.utcToClientDateFormat(this.inventoryItemSales[0].SupplyDate, this.clientDateFormat)
          this.EwayBillNo = this.inventoryItemSales[0].EwayBillNo
          this.LocationTo = this.inventoryItemSales[0].LocationTo
          this.VehicleNo = this.inventoryItemSales[0].VehicleNo
          this.Drivername = this.inventoryItemSales[0].DriverName
          this.Transportation = this.inventoryItemSales[0].Transportation
          this.TotalQuantity = this.inventoryItemSales[0].TotalQty
          this.Commission = this.inventoryItemSales[0].Commission
          this.TotalFreight = this.inventoryItemSales[0].Freight
          this.OtherCharge = this.inventoryItemSales[0].OtherCharge
         // let newDataUnit = Object.assign([], this.unitDataType)
         // newDataUnit.push({ id: this.inventoryItemSales[0].OrgId, text: this.inventoryItemSales[0].UnitName })
          //this.unitDataType = newDataUnit
          this.unitId = this.inventoryItemSales[0].UnitId
          this.getUnitId = this.inventoryItemSales[0].UnitId
          this.stateSelect2Id.setElementValue(this.inventoryItemSales[0].SupplyState)

        } else {
          this.inventoryItemSales = []
        }
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
        if (data.Data &&  data.Data.ItemTransactionactions.length > 0) {
          this.editAlreadyItemDataFlag = false
          this.localItemas = []
          this.items = []
          this.ItemTransactionactions = []
          this.itemsAttribute = []
          this.items = data.Data.ItemTransactionactions
          this.ItemTransactionactions = data.Data.ItemTransactionactions
          data.Data.ItemTransactionactions.forEach(element => {
            let value
            this.localLabelData = []
            if (data.Data && data.Data.ItemTransactionactions &&  data.Data.ItemTransactionactions.length > 0) {
              if (data.Data &&  data.Data.ItemAttributesTransactions && data.Data.ItemAttributesTransactions.length > 0) {
                this.sendAttributeData = data.Data.ItemAttributesTransactions
                this.editAttributeDataSet = data.Data.ItemAttributesTransactions.filter(itm => itm.ItemTransId === element.Id)
                this.attributesLabels.forEach(label => {
                  this.labeldata = data.Data.ItemAttributesTransactions.filter(v => v.AttributeValueId === label.AttributeId)
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
            if(element.ExpiryDate !== null ){
              ExpiryDatevar = this._globalService.utcToClientDateFormat(element.ExpiryDate, this.clientDateFormat)

           }
           else{
             ExpiryDatevar = ''

           }
           if(element.MfdDate !== null ){
             MFDatevar  = this._globalService.utcToClientDateFormat(element.MfdDate, this.clientDateFormat)

           }
           else{
             MFDatevar = ''

           }
            this.localItemas.push({
              Sno: element.Sno,
              Id: element.Id,
              CategoryName: element.CategoryName,
              CategoryId: element.CategoryId,
              ItemName: element.ItemName,
              Remark: element.Remark,
              Length: element.Length,
              Width: element.Width,
              Height: element.Height,
              ExpiryDate: ExpiryDatevar,
              MfdDate: MFDatevar,
              BatchNo: element.BatchNo,
              UnitName: element.UnitName,
              Quantity: element.Quantity,
              Rate: element.SaleRate,
              UnitId: element.UnitId,
              ItemId: element.ItemId,
              TotalAmount: (element.SaleRate) * (element.Quantity),
              attributeData: this.editAttributeDataSet,
              LableAttributeVale: this.localLabelData,
              ReversetotalAmount:element.Total


            })
            // this.items = this.localItemas;

          }
          )
          this.calculateAllTotal()
        //  console.log(this.localItemas ,'item edit================')
        }

      }
      if(data.Code === UIConstant.SERVERERROR){
        this.toastrService.showError('',data.Description)
      }

    })
  }
  DisabledSaveBtn: boolean = false
  editAttributeDataSet: any
  InvoiceDateChngae: any
  sendAttributeData: any
  SupplyDateChngae: any
  CurrentDateChngae: any
  saveSaleChallan () {
    this.submitSave = true
    if (this.deleteEditflag) {
       this.addItems()
      this.calculateTotalOfRow()
      this.calculateAllTotal()
      if (this.checkValidation()) {
        this.DisabledSaveBtn = true
        if (this.items.length !== 0) {

          this.InvoiceDateChngae = this._globalService.clientToSqlDateFormat(this.InvoiceDate, this.clientDateFormat)
          this.SupplyDateChngae = this._globalService.clientToSqlDateFormat(this.SupplyDate, this.clientDateFormat)
          if (this.CurrentDate !== '') {
            this.CurrentDateChngae = this._globalService.clientToSqlDateFormat(this.CurrentDate, this.clientDateFormat)
          } else {
            this.CurrentDateChngae = ''
          }
          let obj = {}
          obj['Id'] = this.Id === 0 ? 0 : this.Id
          obj['PartyId'] = this.clientNameId
          obj['OrgId'] = this.orgNameId
          obj['BillNo'] = this.BillNo
          obj['GodownId'] = this.godownId
          obj['BillDate'] = this.InvoiceDateChngae
          obj['EwayBillNo'] = this.EwayBillNo
          obj['Supplydate'] = this.SupplyDateChngae
          obj['VehicleNo'] = this.VehicleNo
          obj['Drivername'] = this.Drivername
          obj['SupplyState'] = this.stateIdForBill
          obj['Transportation'] = this.Transportation
          obj['LocationTo'] = this.LocationTo === '' ? '  ' : this.LocationTo
          obj['OtherCharge'] = this.OtherCharge
          obj['TotalQuantity'] = this.TotalQuantity
          obj['BillAmount'] = this.netBillAmount
          obj['Items'] = this.items
          obj['AdditionalCharges'] = this.AdditionalChargeData
          obj['itemAttributeTrans'] = this.sendAttributeData
          obj['ItemTaxTrans'] = this.taxSlabSummery
          obj['AddressId'] = this.stateIdForBill
          // obj['CurrentDate'] = this.CurrentDateChngae
          
          let _self = this
          console.log('sale-challan-request : ', JSON.stringify(obj))
          this._commonService.postSaleChallan(obj).subscribe(
            (data: any) => {
              if (data.Code === UIConstant.THOUSAND) {
                let saveName = this.MainEditID ===0 ? UIConstant.SAVED_SUCCESSFULLY :UIConstant.UPDATE_SUCCESSFULLY
                this.DisabledSaveBtn = false

                _self.toastrService.showSuccess('',saveName )
                _self._commonService.newSaleAdded()
                this._commonService.AddedItem()
                if (!_self.keepOpen) {
                  _self._commonService.closeInvoice()
                } else {
                  _self.initComp()
                  _self.clearExtras()
                  this.openModalPopup()
                  this.getNewCurrentDate()
                 this.getNewBillNo()
                }
              } else {
                this.DisabledSaveBtn = false

                _self.toastrService.showError(data.Code, data.Message)
              }
              if(data.Code === UIConstant.SERVERERROR){
                this.DisabledSaveBtn = false

                _self.toastrService.showError(data.Code, data.Message)
                
              }
            }
          )

        } else {
          this.DisabledSaveBtn = false

          this.toastrService.showError('', 'Please Add Item')
        }
      }
    } else {
      this.DisabledSaveBtn = false

      this.toastrService.showWarning('', 'First Save Item')
    }
  }

  deleteAttribute (attribute){
    if(this.sendAttributeData.length > 0){
      this.sendAttributeData.forEach((element,index) => {
        attribute.forEach((ele,i)=>{
          if(ele.AttributeValue.length >0){
            if( (element.Sno === ele.AttributeValue[0].Sno)){
              this.sendAttributeData.splice(index ,1)
            }
          }
        
        })
        
      });
    }
  }
  deleteItem (type,a ,GetData) {
    if (type === 'items') {
    this.lastItemFlag = true
    this.items.splice(a, 1)
    this.localItemas.splice(a, 1)
    if (this.items.length === 0 && this.localItemas.length === 0) {
      this.lastItemFlag = false
    }
    if(GetData.length >0){
      this.deleteAttribute(GetData)
    }
    this.calculateAllTotal()
  }
    if (type === 'charge') {
      
      this.AdditionalChargeData.splice(a, 1)
      this.calculateAllTotal()
      this.alreadySelectCharge(GetData.LedgerChargeId, GetData.LedgerName,false)
      if(GetData.Id>0 && GetData.Sno >0 ){
        this.removeBillSummery('charge',GetData.Id)
      }
      // if(GetData.Id>0 && GetData.Sno >1 ){
      //   this.removeBillSummery('charge',GetData.Sno)
      // }
      if(GetData.Id === 0){
        this.removeBillSummery('charge',GetData.Sno)

      }
      

    }
  }
  removeBillSummery (type,tranIsSNO){
    let indexofRow;
      for(let i=this.taxSlabSummery.length; i  > this.taxSlabSummery.length -1; i--  ){
        if(type ==='charge'){
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
      //this.showBillingSummery(this.taxSlabSummery)
  
  }
  EditAttributeDataValue (data){
    if(data !== undefined ){
      this.itemsAttribute =[]
      if(this.items.length >0){
        this.trsnItemId = this.items.length + 1
        for(let i=0; i < this.items.length; i ++){
          if(this.trsnItemId === this.items[i].Sno){
            this.trsnItemId =  this.trsnItemId + 1
          }
        }
      }
      else{
        this.trsnItemId =1
      }
      
      data.forEach((element,index) => {
        if(element.AttributeValue.length> 0){
          this.itemsAttribute.push({
            Id: element.AttributeValue[0].Id,
            Index: element.AttributeValue[0].Index,
            ItemId:element.AttributeValue[0].ItemId,
            Sno:this.trsnItemId,
            ItemTransId: this.trsnItemId,
            AttributeName: element.AttributeValue[0].AttributeName,
            existId: element.AttributeValue[0].AttributeValueId,
            AttributeValueId: element.AttributeValue[0].AttributeValueId,
            AttributeId: element.AttributeValue[0].AttributeId,
            ParentTypeId: element.AttributeValue[0].ParentTypeId
          })
        }
  
      })
      console.log( this.itemsAttribute ,'edit attr-data')

    }
  }
  AttrColourEditId: any
  AttrSizeEditId: any
  AttrArticleEditId: any
  deleteEditflag: boolean = true
  editAttributeData: any
  @ViewChildren('attr_select2') attrSelect2: QueryList<Select2Component>

  editRowItem (type,index, item, editId, attributeData,Sno) {

    this.editAttributeData = attributeData
    if(type === 'items'){
      if (this.deleteEditflag) {
        this.editRowFlag = true
        this.deleteEditflag = false
        this.editItemId = editId,
        this.Length= item.Length,
        this.Width= item.Width,
        this.Height= item.Height,
        this.ExpiryDate= item.ExpiryDate,
        this.BatchNo = item.BatchNo,
        this.MfdDate = item.MfdDate,
        this.Remark = item.Remark
        this.categoryId = item.CategoryId
        this.Quantity = item.Quantity
        this.unitId = item.UnitId
        this.UnitName = item.UnitName
        this.ItemName = item.ItemName
        this.itemCategoryId = item.ItemId
        this.Rate = item.Rate
        this.TotalAmount = item.TotalAmount
        this.setEditableUnit(+item.ItemId)
        this.ReversetotalAmount = item.ReversetotalAmount
        this.updateCategories(this.categoryId)
        this.unitSelect2.setElementValue(item.UnitId)
        setTimeout(() => {
          this.itemSelect2.setElementValue(+item.ItemId)
        }, 10)
        if (this.attrSelect2.length > 0) {
          if(  this.editAttributeData !== undefined ){
          this.editAttributeData.forEach( (value,inx  )=> {
            if(value.AttributeValue.length > 0){
              this.attrSelect2.forEach((item2: Select2Component, indexi: number, array: Select2Component[]) => {
                let flagReturn = false
                let findIndex =  this.allAttributeData[indexi].data.findIndex(
                  element => ( element.id === JSON.parse(value.AttributeValue[0].AttributeId) )
                    )
                if(findIndex !== -1){
                  item2.setElementValue(this.allAttributeData[indexi].data[findIndex].id)   
                }
                flagReturn = true
                return  flagReturn
             })
            }
    
          })
        }
        }
        this.deleteItem('items',index,attributeData)
        this.EditAttributeDataValue (this.editAttributeData)
      } else {
        this.toastrService.showWarning('Warning', 'First save item!')
      }
    }
    if (type === 'charge' && !this.editChargeId) {
      if (this.deleteEditChargeFlag) {
        this.editChargeId = editId
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
          this.deleteItem(type, index,this.AdditionalChargeData[index])

      } else {
        this.toastrService.showWarning('', 'First Save Charge !')
      }

    }
  

  }
  snoForChargeId: any
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
    // console.log('categories : ', this.categories)
  }
  loading: boolean
  catLevel: any
  allCategories: any = []
  getCatagoryDetail (data) {
    this.catLevel = JSON.parse(this.catLevel)
    for (let i = 0; i < this.catLevel; i++) {
      if (this.categories[i]) {
        this.categories[i].data = [{ id: '0', text: 'Select Category' }]
      }
    }
    this.allCategories = [ ...data ]
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
   // console.log('dynamic categories : ', this.categories)
    this.loading = false
  }
  getParentCatStr (id) {
    let name = ''
    this.allCategories.forEach(category => {
      if (id === category.Id) {
        name = category.Name
      }
    })
    return name
  }
  getPattern (): string {
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
  getParentCat (id) {
    let parentId = 0
    this.allCategories.forEach(category => {
      if (id === category.Id) {
        parentId = category.ParentId
      }
    })
    return parentId
  }
  AlreadySelectCategoryId :any
AlreadySelectCategoryName : any
  onSelectCategory (evt, levelNo) {
    //console.log('evt on change of category : ', evt, 'level : ', levelNo)
    if (this.catLevel > 1) {
      if (+evt.value > 0) {
        
        if (levelNo === this.catLevel) {
          if (this.categoryId !== +evt.value) {
            this.categoryId = +evt.value
            this.categoryName = evt.data[0].text
            this.AlreadySelectCategoryId =+evt.value
this.AlreadySelectCategoryName = evt.data[0].text
            this.getItemByCategoryid(+evt.value)
           // this.validateItem()
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
        this.getItemByCategoryid(+evt.value)
      }
    } else {
      if (levelNo === this.catLevel) {
        if (this.categoryId !== +evt.value) {
          this.categoryId = +evt.value
          this.categoryName = evt.data[0].text
          this.AlreadySelectCategoryId =+evt.value
this.AlreadySelectCategoryName = evt.data[0].text
          this.getItemByCategoryid(+evt.value)
         // this.validateItem()
          this.updateCategories(+evt.value)
        }
      }
    }
  }

  parentMostCategory: any
  @ViewChildren('cat_select2') catSelect2: QueryList<Select2Component>
  updateCategories (childmostId) {
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
    //   console.log('parentMostCategory : ', parentMostCategory)
    this.parentMostCategory = parentMostCategory
  }
  applyCustomRateOnItemFlag: any
  localItemRate: any
  backDateEntry: boolean = false
  isManualBillNoEntry: boolean = false
  decimalDigitData: any
  isInclusiveCaseBeforeDiscount: any
  unitSettingType: any = 1

  getModuleSettingData () {
    this.applyCustomRateOnItemFlag = false
    this.localItemRate = true
        if ( this.getModuleSettingValue.settings.length > 0) {
          this.getModuleSettingValue.settings.forEach(ele => {
            if (ele.id=== SetUpIds.catLevel) {
             this.catLevel =JSON.parse(ele.val) 
              this.createModels(+this.catLevel)
            } 
            // if (ele.id=== SetUpIds.catLevel) {
            //   this.industryId =JSON.parse(ele.val) 
            //  }
          
            //  if (ele.id === SetUpIds.isManualBillNoEntryForsale) {
            //   this.isManualBillNoEntry = !!(+ele.val)
            // }
            if (ele.id === SetUpIds.backDateEntryForSale) {
              this.backDateEntry = !!(+ele.val)
            }
             if (ele.id=== SetUpIds.applyCustomRateOnItemForSale) {
              this.applyCustomRateOnItemFlag =JSON.parse(ele.val) === 0 ? false :true
             }
           
             if (ele.id === SetUpIds.unitType) {
              this.unitSettingType = +ele.val
            }
             if (ele.id=== SetUpIds.taxCalInclusive) {
              this.isInclusiveCaseBeforeDiscount = ele.val
             }
             else{
              this.isInclusiveCaseBeforeDiscount='2'
             }  
             if (ele.id=== SetUpIds.noOfDecimalPoint) {
              this.decimalDigitData = JSON.parse(ele.val)
             }
             if (ele.id=== SetUpIds.dateFormat) {
              this.clientDateFormat =  ele.val[0].Val
              console.log(this.clientDateFormat)
             }
             if (ele.id=== SetUpIds.currency) {
               this.defaultCurrency = ele.val[0].Val
               this.currencyValues.push({ id: 1, symbol: this.defaultCurrency })
              console.log(this.currencyValues)
             }
          })
          }
        }
  changeCommisiontrate (e) {
    this.CommisionRateType = e === '0' ? 0 : 1
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
  CreateDynamicAttributes(data) {
    let obj = {}
    let attributeKeys = []
    let attributesData = []
    data.AttributeValueResponses.forEach(attribute => {
      attributeKeys.push(attribute.Name)
      obj['name'] = attribute.Name
      obj['len'] = attribute.AttributeValuesResponse.length - 1
      obj['data'] = [{ id: '0', text: 'Select Attribute' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
      obj['attributeId'] = attribute.AttributeId
      obj['id'] = 0
      attributesData.push({ ...obj })
    })
    for (let i = 0; i < data.AttributeValues.length; i++) {
      const attr = data.AttributeValues[i]
      let obj1 = {}
      obj1['id'] = attr.Id
      obj1['text'] = attr.Name
      for (let j = 0; j < attributesData.length; j++) {
        if (attributesData[j].attributeId === data.AttributeValues[i].AttributeId) {
          if (attributesData[j]) {
            attributesData[j].data.push({ ...obj1 })
          }
        }
      }
    }
    let attibutesDataToSend = Object.assign([], attributesData)
       let  returnObject = { 'attributeKeys': attributeKeys, 'attributesData': attibutesDataToSend }
 
     return returnObject
  }
  // CreateDynamicAttributes (data) {
  //   this.allAttributeData = []
  //  this.attributesLabels = []
  //  let obj = {}
  // let attributeKeys = []
  // let attributesData = []
  // data.AttributeValueResponses.forEach(attribute => {
  //   attributeKeys.push({'label':attribute.Name ,'AttributeId':attribute.AttributeId})

  //   obj['name'] = attribute.Name
  //   obj['len'] = attribute.AttributeValuesResponse.length
  //   obj['data'] = [{ id: '0', text: 'Select ' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
  //   obj['attributeId'] = attribute.AttributeId
  //   obj['id'] = 0
  //   attributesData.push({ ...obj })
  // })
  // let j = 0
  // let index = 0
  // for (let i = 0; i < data.AttributeValues.length; i++) {
  //   const attr = data.AttributeValues[i]
  //   let obj1 = {}
  //   obj1['id'] = attr.Id
  //   obj1['text'] = attr.Name
  //   if (attributesData[j].len === index) {
  //     j++
  //     index = 0
  //   }
  //   index++
  //   if (attributesData[j]) {
  //     attributesData[j].data.push({ ...obj1 })
  //   } else {
  //     this.toastrService.showError('Server on error', '')
  //   }
  // }
  //    let attibutesDataToSend = Object.assign([], attributesData)
  
  //    let  returnObject = { 'attributeKeys': attributeKeys, 'attributesData': attibutesDataToSend }
 
  //    return returnObject
  // }
  additionChargeId: any
  additionaChargeName: any
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
  invalidObjCharge : any = {}
validationCharge () {
  let isValid = 1
  if (this.additionChargeId>0) {
    this.invalidObjCharge['additionChargeId'] = false
  } else {
    this.invalidObjCharge['additionChargeId'] = true
    isValid = 0
  }
  if (this.AmountCharge>0) {
    this.invalidObjCharge['AmountCharge'] = false
  } else {
    this.invalidObjCharge['AmountCharge'] = true
    isValid = 0
  }
  
  return !!isValid
  }


  AmountCharge: any =0
  TaxAmountCharge: any =0
  TotalAmountCharge: any
  
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
taxDetailsPerItem: any
ExclusiveForTaxItem(TaxArray,totalrate,itemTrsnId){
  if (TaxArray.length > 0) {
    this.taxDetailsPerItem =[]
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
           let localDiscontAmt =0
           baserate = (dataTotalrate/(100+sumOfAllRate)*100) 
           if (this.DiscountType === '0') {
             this.DiscountAmt = ((+this.Discount / 100) * (+baserate)).toFixed(this.decimalDigitData)
             localDiscontAmt = (+this.Discount / 100) * (+baserate)
           } else {
             this.DiscountAmt = (+this.Discount).toFixed(this.decimalDigitData)
           } 
           withoutTax = baserate -  localDiscontAmt  

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
taxCalculationForCharge (chargetranSnoId){
  
  let AmountCharge = 0
     AmountCharge = (isNaN(+this.AmountCharge)) ? 0 : +this.AmountCharge
   if(AmountCharge >0){
    let taxPerItem =[];
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
AdditionalChargeData: any
createChargeArray () {
  let sendForTaxSummery=[]
  let index;
  let taxForChargeSlab;
  if (this.AdditionalChargeData.length === 0) {
     index =1
    taxForChargeSlab = this.taxCalculationForCharge(index)

  } else {
    index = this.AdditionalChargeData.length + 1
    for(let i=0; i < this.AdditionalChargeData.length; i ++){
      if(index === this.AdditionalChargeData[i].Sno){
        index=  index + 1
      }
    }
    // index = +this.AdditionalChargeData[this.AdditionalChargeData.length - 1].Sno + 1
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
taxSlabName: any
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
@ViewChild('taxCharge_select2') taxChargeSelect2: Select2Component
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

taxSlabSummery: any
ParentTypeTaxId: any
getBillingSummery(data) {
  if(data.length> 0){
  data.forEach(item=>{
    if(item.taxItems.length > 0){
    let taxDetails = item.taxItems.filter(s=>s.itemTransSno === item.Sno)
    if(item.type ==='items' && taxDetails.length >0){
      this.ParentTypeTaxId = 6
      taxDetails.forEach(data=>{
      this.taxSlabSummery.push({
        id: 0,
        TaxTypeTax: item.TaxType,
        AmountTax:data.AmountTax ,
        editSno:data.Id,
        Sno:item.Sno,
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
          Sno:item.Sno,
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
  }
  })
}
  console.log( this.taxSlabSummery,"summery")
  //this.showBillingSummery(this.taxSlabSummery)
}
showtaxSlab: any
showBillingSummery (data){
  
  this.showtaxSlab =[]
  let groupOnId = _.groupBy(data, (tax) => {
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
      this.showtaxSlab.push(obj)
    }
  }
}
taxRateForOtherStateFlag: any
checkOtherStateForNewItemAdd (addressID) {
  
  console.log(this.officeAddressId,addressID,'address org-stateid')
  if (this.officeAddressId === addressID) {
    this.taxRateForOtherStateFlag = false
  } else {
    this.taxRateForOtherStateFlag = true
  }
  return this.taxRateForOtherStateFlag
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
@ViewChild('taxTypeCharge_select2') taxTypeChargeSelect2: Select2Component

enterDownCharge (evt: KeyboardEvent) {
 this.addAdditionCharge()
 setTimeout(() => {
   this.chargeSelect2.selector.nativeElement.focus()
 }, 10)
}
FinalAmount: number
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
  
this.TotalAmountCharge = (((isNaN(+this.FinalAmount)) ? 0 : +this.FinalAmount ) + ((isNaN(+this.TaxAmountCharge)) ? 0 : +this.TaxAmountCharge)).toFixed(this.decimalDigitData)

}
}

taxableValueInclusive: any
getBaseRateForItem: any
DiscountAmtForInclusiveAmt: any
totalRowTax: any
DiscountAmt: any
DiscountType: any

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
            let localDiscoutAmt = 0
            let value = (rateofitem/(100+sumOfAllRate)*100)  
            if (this.DiscountType === '0') {
              this.DiscountAmt = ((+this.Discount / 100) * (+value)).toFixed(this.decimalDigitData)
              localDiscoutAmt =  (+this.Discount / 100) * (+value)
            } else {
              this.DiscountAmt = (+this.Discount).toFixed(this.decimalDigitData)
            }
            baserate = value - localDiscoutAmt
            this.FinalAmount = baserate
            totalTaxAmt = (sumOfAllRate/100) * baserate 
    
          }
         else if(this.isInclusiveCaseBeforeDiscount ==='1'){
          
            baserate =( ((rateofitem-DiscountAmt)/(100+sumOfAllRate))*100)  
            this.taxableValueInclusive = baserate
            this.FinalAmount =baserate
            totalTaxAmt = (sumOfAllRate/100) * baserate 
         
          }
         
       }
       this.getBaseRateForItem =  baserate
       this.totalRowTax=+totalTaxAmt
       TaxAmountCargeValue = +(totalTaxAmt).toFixed(UIConstant.DECIMAL_FOUR_DIGIT)
       return TaxAmountCargeValue
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
        returmTaxAmount = +(totalTaxAmt).toFixed(this.decimalDigitData)  
        return returmTaxAmount
 }

}
