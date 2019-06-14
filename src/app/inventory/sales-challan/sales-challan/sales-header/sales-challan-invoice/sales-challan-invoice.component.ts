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
  public stateList: Array<Select2OptionData>
  public stateListplaceHolder: Select2Options

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
  // modalSub3:Subscription
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
        if (data.id && data.name) {
          let newData = Object.assign([], this.unitDataType)
          newData.push({ id: data.id, text: data.name })
          this.unitDataType = newData
          this.unitId = data.id
          this.getUnitId = data.id
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

    this.modalOpen = this._commonService.getInvoiceStatus().subscribe(
      (status: any) => {
        if (status.open) {
          if (status.editId === UIConstant.BLANK) {
            this.editMode = false
            this.Id = 0
           // this.editRowFlag = false
          } else {
            this.editMode = true
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
        }
      }
    )
    this.modalCategory = this._commonService.getCategoryStatus().subscribe(
      (data: AddCust) => {
        debugger
        if (data.id && data.name) {
          let categoryId = data.id
          let categoryName = data.name
          this.isAddNew = true
          this.getAllCategories(categoryName, categoryId, this.isAddNew)
        }
     
      }
    )

  }
  isAddNew: boolean
  attrinuteSetDataId: any
  ngOnInit () {
    this.Id = 0
    this.AttrId = 0
    this.editItemId = 0
    this.getFreightValueData()
    this.initComp()
    this.setSupplyDate()
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
  getDataforItemSaleChallan () {

    this.subscribe = this._commonService.getSPUtilityData(UIConstant.SALE_CHALLAN_TYPE).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND) {

        if (data.Data.TransactionNoSetups.length > 0) {
          if (!this.editMode) {
            this.BillNo = data.Data.TransactionNoSetups[0].BillNo
            if (this.isManualBillNoEntry) {
              this.BillNo = ''
              this.updateLastBillNo(this.InvoiceDate , this.orgNameId)

            } else {
              this.BillNo = data.Data.TransactionNoSetups[0].BillNo

            }
          }

        }
        this.allAttributeData = []
        this.attributesLabels = []
        if (data.Data && data.Data.AttributeValueResponses && data.Data.AttributeValueResponses.length > 0) {

          let AttributeDetails= this.CreateDynamicAttributes(data.Data)
          this.attributesLabels = AttributeDetails.attributeKeys
          this.allAttributeData = AttributeDetails.attributesData
        }
        if (this.Id !== 0 && this.editMode && !this.editRowFlag) {
          this.getSaleChllanEditData(this.Id)
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

      }
    })
  }
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
    // debugger;
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
  clientNameId: any
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
          this.clientNameId = event.value
          let parentTypeId = 5
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
        this.stateList = [{ id: '0', text: 'select Address' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
        if (data.Data && data.Data.length > 0) {
          data.Data.forEach(element => {
            this.stateList.push({
              id: element.Id,
              text: ((element.AddressTypeName ? (element.AddressTypeName + '-') : '') + (element.AddressValue ? (element.AddressValue + ' , ') : '') + (element.AreaName ? element.AreaName + ' , ' : '') + element.CityName + ' , ' + element.StateName + ' , ' + element.CountryName)

            })
            this.stateId = this.stateList[2].id
            this.stateValue = this.stateList[2].id
            this.checkValidation()
            return this.stateValue
          })
        } else {
          this.stateId = 0
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
    let newdataitem = [{ id: UIConstant.BLANK, text: 'Select  Item' ,categoryId: '' }, { id: '-1', text: '+Add New', categoryId: '' }]
    this.subscribe = this._commonService.getItemByCategoryId(categoryId).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND && data.Data.length > 0) {
        this.updatedFlag = true
        data.Data.forEach(element => {
            // debugger
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
            this.UnitName = Data.Data.ItemCustomRateWithItemDetails[0].UnitName
            this.unitSelect2.setElementValue(this.unitId)
          }
        }
        if (Data.Data && Data.Data.ItemDetails.length > 0) {
          this.unitId = Data.Data.ItemDetails[0].UnitId
          this.UnitName = Data.Data.ItemDetails[0].UnitName
          this.Rate = Data.Data.ItemDetails[0].SaleRate
          this.MrpRate = Data.Data.ItemDetails[0].Mrprate
          this.unitSelect2.setElementValue(this.unitId)
        }
        this.calculate()
      }
    })

  }
  categoryTypeData: any
  autoCategory: any
  setupOrganization: any
  organizationData: any
  enableDisableflagOrgName: boolean = true
  getCurrency () {
    let _self = this
// tslint:disable-next-line: no-floating-promises
    this.getAvailableCurrency().toPromise().then(
      (data: ResponseSale) => {
        if (data.Code === UIConstant.THOUSAND && data.Data.SetupModules.length > 0) {
          // console.log(data, "hhhhhhhhhhhhh")
          _self.setSupplyDate()
          _self.setBillDate()
          _self.setPayDate()
          _self.setTravelDate()
          this.setExpiryDate()
          this.setMFDate()
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
        }

        if (data.Data && data.Data.SetupOrganization && data.Data.SetupOrganization.length > 0) {
          this.organizationData = []
          this.orgnazationPlaceHolder = { placeholder: 'Select Organization' }
          this.organizationData = [{ id: UIConstant.BLANK, text: 'Select  Organization' }]
          _self.setupOrganization = data.Data.SetupOrganization
          // console.log(  data.Data.SetupOrganization  ,"organizationData4")
          data.Data.SetupOrganization.forEach(ele => {
            this.organizationData.push({
              id: ele.Id,
              text: ele.Name
            })
          })
          this.orgnizationSelect2.setElementValue(this.orgNameId)
          this.orgNameId = this.organizationData[1].id
          return this.orgNameId

        }

      }
    )
  }

  changeBillDate (eDate) {
// debugger
    let _self = this
    let dateChnage = this._globalService.clientToSqlDateFormat(eDate, this.clientDateFormat)
    this.subscribe = this._commonService.getsettingforOrgnizationData(this.orgNameId, UIConstant.SALE_TYPE, dateChnage).subscribe(data => {
      if (data.Code === 1000 && data.Data.length > 0) {
        this.BillNo = data.Data[0].BillNo
        if (this.isManualBillNoEntry) {
          this.BillNo = ''
          this.updateLastBillNo(this.InvoiceDate ,this.orgNameId)
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
      if (e.data[0].id !== '') {

        let dateChnage = this._globalService.clientToSqlDateFormat(this.InvoiceDate, this.clientDateFormat)
        this.orgNameId = e.value
        this.checkValidation()
        this.subscribe = this._commonService.getsettingforOrgnizationData(this.orgNameId, 'SaleChallan', dateChnage).subscribe(data => {
          if (data.Code === 1000 && data.Data.length > 0) {
            this.OrgId = data.Data[0].Id
            this.BillNo = data.Data[0].BillNo
            if (this.isManualBillNoEntry) {
              this.BillNo = ''
              this.updateLastBillNo(this.InvoiceDate ,this.orgNameId)
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
debugger
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
          SaleRate: +element.SaleRate,
          TotalAmount: +element.TotalAmount,
          TransId: element.TransId,
          LableAttributeVale: this.localLabelData

        })
      } else if (this.editItemId > 0 && element.rowEditFlagValue && (element.Sno === this.snoIndex)) {
        // debugger;
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
          SaleRate: +element.SaleRate,
          TotalAmount: +element.TotalAmount,
          TransId: element.TransId,
          LableAttributeVale: this.localLabelData

        })
      }
    })
    this.editAttributeData = undefined
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
    debugger
    this.items.push({
      Id: this.editItemId !== 0 ? this.editItemId : 0,
      Sno: this.snoIndex,
      //CategoryName: this.categoryName,
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
      SaleRate: +this.Rate,
      TotalAmount: +this.TotalAmount,
      TransId: 0,
      rowEditFlagValue: true
    })
    setTimeout(() => {
      this._commonService.fixTableHFL('item-table')
    }, 1)
    console.log(this.items,'recently add -item')
    //this.trsnItemId = this.items[this.items.length - 1].Sno + 1
    this.localAddAttribute()
    this.localItems()

  }

  rowIndex: any
  AttrId: any

  initialiseItem () {
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
    if (this.allAttributeData && this.allAttributeData.length > 0) {
      this.getDataforItemSaleChallan()
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
  initialiseParams () {
    this.items = []
    this.localItemas = []
    this.sendAttributeData = []
    this.showAttributeData = []
    this.transactions = []
    this.submitSave = false
    this.itemSubmit = false
    this.clickItem = false
    this.clickTrans = false
    this.isValidAmount = true
    this.deleteEditflag = true
    this.InvoiceDate = ''
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
    this.ParcelLength = 0
    this.ParcelHeight = 0
    this.ParcelWidth = 0
    this.Width = 1
    this.Length = 1
    this.BatchNo = ''
    this.Height = 1
    this.ExpiryDate = ''
    this.MfdDate = ''
    this.currencyValues = [{ id: 0, symbol: '%' }, { id: 1, symbol: '$' }]

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
  setTravelDate () {

    let _self = this
    jQuery(function ($) {
      flatpickr('#travel-date', {
        minDate: 'today',
        dateFormat: _self.clientDateFormat,
        enableTime: true
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

        }
        )
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

  setSupplyDate () {
    let _self = this
    if (this.backDateEntry) {
      jQuery(function ($) {
        flatpickr('#supply-date', {
          dateFormat: _self.clientDateFormat,
          defaultDate: [_self._globalService.getDefaultDate(_self.clientDateFormat)]
        })
      })
    } else {
      jQuery(function ($) {
        flatpickr('#supply-date', {
          minDate: 'today',
          dateFormat: _self.clientDateFormat,
          defaultDate: [_self._globalService.getDefaultDate(_self.clientDateFormat)]
        })
      })
    }
    this.SupplyDate = _self._globalService.getDefaultDate(_self.clientDateFormat)

  }

  clearExtras () {
    this.setupModules = {}
    this.currenyValues = [{ id: '0', symbol: '%' }]
    this.clientNameId = ''
    this.BillNo = ''
    this.clientNameSelect2 = []
    this.organizationData = []
    this.getDataforItemSaleChallan()

  }
  closebtn () {
    // this.commision_TypeSelect2.setElementValue('')

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

  netBillAmount: any

  calculate () {

    this.TotalAmount = +this.calculateTotalOfRow()
    this.calculateForTotalAmount()
    this.calculateAllTotal()
    this.calTotalBillAmount()

  }
  calTotalBillAmount () {
    let totalBillAmt = 0
    let totalQty = 0
    for (let i = 0; i < this.localItemas.length; i++) {
      totalBillAmt = totalBillAmt + (isNaN(+this.localItemas[i].SaleRate) ? 0 : +this.localItemas[i].SaleRate) *
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
    this.netBillAmount = (totalBillAmt + +this.TotalAllFreight + +this.OtherAllCharge + +this.totalCommsion).toFixed(this.decimalDigitData)

  }
  TotalAllFreight: any
  OtherAllCharge: any
  totalCommsion: any
  calculateAllTotal () {
    // debugger;
    let totalDiscount = 0
    let totalQty = 0
    let commsion = 0
    let totalAmt = 0
    let fright = 0
    let otherChange = 0
    let totalRate = 0
    for (let i = 0; i < this.localItemas.length; i++) {
      totalAmt = +totalAmt + +this.localItemas[i].TotalAmount
      totalQty = +totalQty + +this.localItemas[i].Quantity

    }

    if (!this.clickItem) {

      if (totalQty) {
        totalQty = totalQty
      }

      if (!isNaN(this.TotalFreight)) {
        fright += +this.TotalFreight

      }
      if (!isNaN(this.Commission)) {
        commsion += +this.Commission

      }
      if (!isNaN(this.OtherCharge)) {
        otherChange += +this.OtherCharge

      }
      this.TotalQuantity = totalQty

      this.TotalAllFreight = (fright).toFixed(this.decimalDigitData)
      this.OtherAllCharge = (otherChange).toFixed(this.decimalDigitData)
      this.totalCommsion = (commsion).toFixed(this.decimalDigitData)
      this.calTotalBillAmount()
    }

  }
  calculateForTotalAmount () {
    let totalAmount = 0
    let totalQty = 0
    let totalfright = 0
    let totalOther = 0
    let netAmt = 0
    for (let i = 0; i < this.localItemas.length; i++) {
      totalAmount = +totalAmount + +(this.localItemas[i].Quantity * this.localItemas[i].SaleRate * 
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
    this.itemAddSub.unsubscribe()
    this.newCustAddSub.unsubscribe()
    this.newCustAddCutomer.unsubscribe()
    this.newNewAddress.unsubscribe()
  }
  loginCategoryLevel: any
  openModalPopup () {
    // debugger;
    let data = JSON.stringify(this._settings.industryId)
    this.industryId = JSON.parse(data)
    let datacatLevel = JSON.stringify(this._settings.catLevel)
    this.catLevel = JSON.parse(datacatLevel)
    this.createModels(this.catLevel)
    this.getCommisionTypeValue()
    this.godownId = 0
    this.itemAddRequiredFlag = false
    this.editAlreadyItemDataFlag = false
    this.showAttributeData = []
    this.localLabelData = []
    this.trsnItemId = 1
    this.itemsAttribute = []
    this.getCurrency()
    this.getDataforItemSaleChallan()
    this.editItemId = 0
    this.setSupplyDate()
    this.initComp()
    this.getModuleSettingData()
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

  closeInvoice () {
    this._commonService.closeInvoice()
  }

  selectStatelist (event) {
    if (event.data.length > 0) {
      if (event.data[0].id !== '') {
        if (event.value === '-1' && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
          this.stateSelect2Id.selector.nativeElement.value = ''

          this._commonService.openAddress(this.clientNameId)

        } else {
          this.stateId = event.value
          this.stateError = false
          this.checkValidation()
        }

      }

    }

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

    if (this.SupplyDate) {
      this.invalidObj['SupplyDate'] = false
    } else {
      this.invalidObj['SupplyDate'] = true
      isValid = 0
    }
    if (this.stateId) {
      this.invalidObj['stateId'] = false
    } else {
      this.invalidObj['stateId'] = true
      isValid = 0
    }
    if (this.InvoiceDate) {
      this.invalidObj['InvoiceDate'] = false
    } else {
      this.invalidObj['InvoiceDate'] = true
      isValid = 0
    }

    // if (this.itemsAttribute.length === 0) {
    // isValid = 0
    // if (this.attributeArticleId) {
    // //   this.invalidObj['attributeColorId'] = false
    //  } else {
    //    this.invalidObj['attributeColorId'] = true
    //    isValid = 0
    //  }

    // }
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
    // if (this.TotalAmount > 0) {
    //   this.invalidObj['TotalAmount'] = false
    // } else {
    //   this.invalidObj['TotalAmount'] = true
    //   isValidItem = 0
    // }

    // }
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
  inventoryItemSales: any
  ItemTransactionactions: any
  itemAttbute: any
  ColorCode: any
  SizeCode: any
  ArticleCode: any
  editAlreadyItemDataFlag: boolean
  getSaleChllanEditData (id) {
    // debugger
    this._commonService.saleEditChallan(id).subscribe(data => {
      // debugger
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        console.log(JSON.stringify(data) ,'editdata---')
        if (data.Data && data.Data.InventoryTransactionSales.length > 0) {
          this.inventoryItemSales = []
          this.inventoryItemSales = data.Data.InventoryTransactionSales
          this.itemsAttribute = []
          this.clientNameId = this.inventoryItemSales[0].LedgerId
          this.orgNameId = this.inventoryItemSales[0].OrgId
          this.stateId = this.inventoryItemSales[0].SupplyState
          this.orgnizationSelect2.setElementValue(this.inventoryItemSales[0].OrgId)
          this.clientSelect2.setElementValue(this.inventoryItemSales[0].LedgerId)
          this.CommisionRateType = this.inventoryItemSales[0].CommissionType
          this.freightBySelect2.setElementValue(this.inventoryItemSales[0].FreightMode)
          this.referal_typeSelect2.setElementValue(this.inventoryItemSales[0].ReferTypeid)
          this.referal_idSelect2.setElementValue(this.inventoryItemSales[0].ReferId)
          this.BillNo = this.inventoryItemSales[0].BillNo
          this.InvoiceDate = this._globalService.utcToClientDateFormat(this.inventoryItemSales[0].BillDate, this.clientDateFormat)
          this.SupplyDate = this._globalService.utcToClientDateFormat(this.inventoryItemSales[0].SupplyDate, this.clientDateFormat)
          this.EwayBillNo = this.inventoryItemSales[0].EwayBillNo
          this.LocationTo = this.inventoryItemSales[0].LocationTo
          this.VehicleNo = this.inventoryItemSales[0].VehicleNo
          this.Drivername = this.inventoryItemSales[0].DriverName
          this.Transportation = this.inventoryItemSales[0].Transportation
          this.TotalQuantity = this.inventoryItemSales[0].TotalQty
          this.Commission = this.inventoryItemSales[0].Commission
          this.TotalFreight = this.inventoryItemSales[0].Freight
          this.OtherCharge = this.inventoryItemSales[0].OtherCharge
          let newDataUnit = Object.assign([], this.unitDataType)
          newDataUnit.push({ id: this.inventoryItemSales[0].OrgId, text: this.inventoryItemSales[0].UnitName })
          this.unitDataType = newDataUnit
          this.unitId = this.inventoryItemSales[0].UnitId
          this.getUnitId = this.inventoryItemSales[0].UnitId
          this.stateSelect2Id.setElementValue(this.inventoryItemSales[0].SupplyState)

        } else {
          this.inventoryItemSales = []
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
              SaleRate: element.SaleRate,
              UnitId: element.UnitId,
              ItemId: element.ItemId,
              TotalAmount: (element.SaleRate) * (element.Quantity),
              attributeData: this.editAttributeDataSet,
              LableAttributeVale: this.localLabelData

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
  editAttributeDataSet: any
  InvoiceDateChngae: any
  sendAttributeData: any
  SupplyDateChngae: any
  saveSaleChallan () {
    // debugger;
    this.submitSave = true
    if (this.deleteEditflag) {

       this.addItems()
      this.calculateTotalOfRow()
      this.calculateAllTotal()
      if (this.checkValidation()) {
        // console.log(JSON.stringify(this.items) ,"Request")
        if (this.items.length !== 0) {

          this.InvoiceDateChngae = this._globalService.clientToSqlDateFormat(this.InvoiceDate, this.clientDateFormat)
          this.SupplyDateChngae = this._globalService.clientToSqlDateFormat(this.SupplyDate, this.clientDateFormat)

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
          obj['SupplyState'] = this.stateId
          obj['Transportation'] = this.Transportation
          obj['LocationTo'] = this.LocationTo === '' ? '  ' : this.LocationTo
          obj['Freight'] = this.TotalFreight
          obj['FreightMode'] = this.freightById
          obj['ReferId'] = this.referalsID
          obj['ReferTypeId'] = this.referalsTypeID
          obj['Commission'] = this.CommisionRate
          obj['CommissionType'] = this.CommisionRateType
          obj['OtherCharge'] = this.OtherCharge
          obj['TotalQuantity'] = this.TotalQuantity
          obj['BillAmount'] = this.netBillAmount
          obj['Items'] = this.items
          obj['itemAttributeTrans'] = this.sendAttributeData
          let _self = this
          console.log('sale-challan-request : ', JSON.stringify(obj))
          this._commonService.postSaleChallan(obj).subscribe(
            (data: any) => {
              if (data.Code === UIConstant.THOUSAND) {
                _self.toastrService.showSuccess('Success', 'Saved Successfully')
                _self._commonService.newSaleAdded()
                if (!_self.keepOpen) {
                  _self._commonService.closeInvoice()
                } else {
                  _self.initComp()
                  _self.clearExtras()
                }
              } else {
                _self.toastrService.showError(data.Code, data.Message)
              }
              if(data.Code === UIConstant.SERVERERROR){
                _self.toastrService.showError(data.Code, data.Message)
                
              }
            }
          )

        } else {
          this.toastrService.showError('Error', 'Please Add Item')
        }
      }
    } else {
      this.toastrService.showWarning('Warning', 'First Save Item')
    }
  }
  // else{
  //    this.toastrService.showWarning('Add','Do you want add item');
  //  }

  // for (j = 0; j < this.itemsAttribute.length; j++) {
  //   if (this.itemsAttribute[j].ItemTransId === this.items[a].Id) {
  //     this.itemsAttribute.splice(j, 1);
  //     j = -1
  //     continue;
  //   }
  // }
  deleteAttribute (attribute){
  //  debugger
    //console.log(this.sendAttributeData,'Attr')
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
  deleteItem (a ,attribute) {
    this.lastItemFlag = true
    this.items.splice(a, 1)
    this.localItemas.splice(a, 1)
    if (this.items.length === 0 && this.localItemas.length === 0) {
      this.lastItemFlag = false
    }
    if(attribute.length >0){
      this.deleteAttribute(attribute)
    }
    this.calculateAllTotal()
    //  console.log( this.localItemas,'delete items')

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

  editRowItem (index, item, editId, attributeData) {
    this.editAttributeData = attributeData
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
      this.Rate = item.SaleRate
      this.TotalAmount = item.TotalAmount
      this.updateCategories(this.categoryId)
      this.unitSelect2.setElementValue(item.UnitId)
      setTimeout(() => {
        this.itemSelect2.setElementValue(+item.ItemId)
      }, 10)
  //this.onSelectCategory()
      if (this.attrSelect2.length > 0) {
        if(  this.editAttributeData !== undefined ){
        this.editAttributeData.forEach( (value,inx  )=> {
          if(value.AttributeValue.length > 0){
            //console.log(this.editAttributeData ,'set attr')
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
      this.deleteItem(index,attributeData)
      this.EditAttributeDataValue (this.editAttributeData)
    } else {
      this.toastrService.showWarning('Warning', 'First save item!')
    }

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
  getModuleSettingData () {
    let checkForCustomItemRate
    let checkForCatLevel
    let checkForBackDateEntry
    let checkforBillManualNo
    let decimalDigit
    this.applyCustomRateOnItemFlag = false
    this.localItemRate = true
    this.subscribe = this._commonService.getModulesettingAPI('SaleChallan').subscribe(data => {
      if (data.Code === UIConstant.THOUSAND) {
        console.log(data.Data, 'getModulesettingAPI')
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
              this.loginCategoryLevel = JSON.parse(checkForCatLevel[0].Val)

            }
            // back date entry
            checkForBackDateEntry = data.Data.SetupClients.filter(s => (s.SetupId === ele.Id) && (ele.Id === 58))
            if (checkForBackDateEntry.length > 0) {
              this.backDateEntry = JSON.parse(checkForBackDateEntry[0].Val)

            }
            //  id master 22 /Sale BillNo Manual Entry
            checkforBillManualNo = data.Data.SetupClients.filter(s => (s.SetupId === ele.Id) && (ele.Id === 22))
            if (checkforBillManualNo.length > 0) {
              this.isManualBillNoEntry = JSON.parse(checkforBillManualNo[0].Val)

            }
            decimalDigit = data.Data.SetupClients.filter(s => (s.SetupId === ele.Id) && (ele.Id === 43))
            if (decimalDigit.length > 0) {
              this.decimalDigitData = JSON.parse(decimalDigit[0].Val)
              console.log(this.decimalDigitData ,'decimal')

            }
          })
        }
      }
    })
  }
  CommisionRate: any
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
  CreateDynamicAttributes (data) {
    this.allAttributeData = []
   this.attributesLabels = []
    let obj = {}
    let attributeKeys = []
    let attributesData = []
    data.AttributeValueResponses.forEach(attribute => {
      attributeKeys.push({'label':attribute.Name ,'AttributeId':attribute.AttributeId})
      obj['name'] = attribute.Name
      obj['len'] = attribute.AttributeValuesResponse.length - 1
      obj['data'] = [{ id: '0', text: 'Select' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
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
        this.toastrService.showError('', 'Error on Serve')
      }
    }
     let attibutesDataToSend = Object.assign([], attributesData)
  
     let  returnObject = { 'attributeKeys': attributeKeys, 'attributesData': attibutesDataToSend }
    // console.log(returnObject ,'atr----')
     return returnObject
  }

}
