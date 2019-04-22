import { Component, ViewChild } from '@angular/core'
import { Subscription } from 'rxjs'
import { AddCust, ResponseSale } from '../../../../model/sales-tracker.model'
import { Select2OptionData, Select2Component } from 'ng2-select2'
import { VendorServices } from '../../../../commonServices/TransactionMaster/vendoer-master.services'
import { ToastrCustomService } from '../../../../commonServices/toastr.service'
import { UIConstant } from '../../../../shared/constants/ui-constant'
import { CategoryServices } from '../../../../commonServices/TransactionMaster/category.services'
import { ItemmasterServices } from '../../../../commonServices/TransactionMaster/item-master.services'
import { CommonService } from '../../../../commonServices/commanmaster/common.services'
import { GlobalService } from '../../../../commonServices/global.service'
import { Settings } from '../../../../shared/constants/settings.constant'
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
  public frightPlaceholder: Select2Options;
  public CommissionTypePlcaholder: Select2Options;
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
  newAttributeADDModel:Subscription
  newCustAddCutomer: Subscription
  newNewAddress: Subscription
  // newLedgerAddSub: Subscription
  subscribe: Subscription
  modalOpen: Subscription
  // modalSub3:Subscription
  modalCategory: Subscription
  clickItem: boolean = false
  clickTrans: boolean = false
  isValidAmount: boolean = true
  keepOpen: boolean
  submitSave: boolean = false
  itemSubmit:boolean = false
  categoryType: any
  cateGoryValue: any
  attributeValue:any
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
  editItemId: any
  clientDateFormat: string = ''

  constructor(private _itemmasterServices: ItemmasterServices, private _categoryServices: CategoryServices,
    private _ledgerServices: VendorServices,
    private toastrService: ToastrCustomService,
    public _commonService: CommonService,
    public _globalService: GlobalService,
    public _settings: Settings) {
this.clientDateFormat = this._settings.dateFormat

    this.clientNameSelect2 = []
    this.suplierNameSelect2 = []
    this.paymentModeSelect2 = []
    this.destinationSelect2 = []
     this.sendAttributeData =[]
    this.parcelBySelect2 = []

    // this.getClientName(0)

    //for new add unit 
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
//add new attribute
    this.newAttributeADDModel = this._commonService.getAttributeStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
         // let newData = Object.assign([], this.unitDataType)
        //  newData.push({ id: data.id, text: data.name })
         // this.unitDataType = newData
        //  this.unitId = data.id
        //  this.getUnitId = data.id
        }
      }
    )
    //for new add customer 
    this.newCustAddCutomer = this._commonService.getCustStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.clientNameSelect2)
          newData.push({ id: data.id, text: data.name })
          this.clientNameSelect2 = newData
          this.clientNameId = data.id
          //this.SenderId = data.id
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
          //this.SenderId = data.id
        }
      }
    )

    this.modalOpen = this._commonService.getInvoiceStatus().subscribe(
      (status: any) => {
        if (status.open) {
          if (status.editId === UIConstant.BLANK) {
            this.editMode = false
             this.Id = 0
          } else {
            this.editMode = true
            this.Id = status.editId
          }
          this.setDefaultSelectovalue()
          this.openModal()
        } else {
          this.closeModal()
        }
      }

    )
    this.modalCategory = this._commonService.getCategoryStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name && data.type) {
          if (data.type === 'cat') {
            let newData = Object.assign([], this.categoryType)
            newData.push({ id: data.id, text: data.name })
            this.categoryType = newData
            this.cateGoryValue = +data.id
            this.categoryId = +data.id
            this.catSelect2.setElementValue(this.categoryId)
          }
          if (data.type === 'subCat' && data.parentId) {
            let newData = Object.assign([], this.subCategoryType)
            newData.push({ id: data.id, text: data.name })

          }
        }
      }
    )
  }

  ngOnInit() {
    this.Id = 0
    this.AttrId = 0
    this.editItemId = 0
    this.getDataforItemSaleChallan();
    this.getFreightValueData()
    
    this.initComp()
    //  this.getCurrency()
    this.setSupplyDate()
    // this.getItemMasterDetail()
    this.selectTax = []

    //  this.getTaxtDetail(0)


    // this.categoryList(0)
    //  this.getCategoryDetails()
   
  }
  @ViewChild('cat_select2') catSelect2: Select2Component
  @ViewChild('item_select2') itemSelect2: Select2Component
  @ViewChild('atrColour_id') atrColorSelect2: Select2Component
  @ViewChild('atrSize_id') atrSizeSelect2: Select2Component
  @ViewChild('atrArticle_id') atrArticleSelect2: Select2Component

  initComp() {
    this.initialiseItem()
    this.initialiseParams()
    //  this.initialiseTransaction()
  }
  attributesLabels: any;
  unitDataType: any
  godownDataType:any
  unitPlaceHolder: any
  godownPlaceHolder:any
  itemCategoryType: any
  itemCategoryData: any
  attributeValues: any
  attributesLabesId: any
  AttributeSize: any
  AttributeArticle: any
  referals: Array<Select2OptionData>
  CommissionType: Array<Select2OptionData>
allAttributeData:any
prototype:any
tempAttribute:any
  getDataforItemSaleChallan() {
        this.subscribe = this._commonService.getSPUtilityData(UIConstant.SALE_CHALLAN_TYPE).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND) {
        if (data.Data && data.Data.AttributeValueResponses && data.Data.AttributeValueResponses.length > 0) {

         this.allAttributeData =[]
         this.allAttributeData =[]
         let newData  =[]
         this.attributeColourPlaceHolder = { placeholder: 'Select' }
         this.attributesLabels =[]
        for(let j=0; j < data.Data.AttributeValueResponses.length; j++ ){ 
          newData.push({
            Name :data.Data.AttributeValueResponses[j].Name,
             AttributeId :data.Data.AttributeValueResponses[j].AttributeId
          })
}
this.attributesLabels = newData
console.log(this.attributesLabels ,'attrilabel')
      for(let k=0; k < this.attributesLabels.length; k++ ){
        for(let n=0; n < data.Data.AttributeValueResponses.length; n++ ){
                 if(this.attributesLabels[k].AttributeId === data.Data.AttributeValueResponses[n].AttributeId){
      let abs = data.Data.AttributeValueResponses[n].AttributeValues
       for(let p = 0; p <  data.Data.AttributeValueResponses[n].AttributeValuesResponse.length; p++ ){
            abs.push({
                      id: data.Data.AttributeValueResponses[n].AttributeValuesResponse[p].Id,
                      text: data.Data.AttributeValueResponses[n].AttributeValuesResponse[p].Name,
                      attributeId:data.Data.AttributeValueResponses[n].AttributeValuesResponse[p].AttributeId

      })
      }
  this.allAttributeData.push({
         item: abs
  })
     }  

  }
}

        

    

          this.unitDataType = []
          this.unitPlaceHolder = { placeholder: 'Select Unit' }
          this.unitDataType = [{ id: UIConstant.BLANK, text: 'Select  Unit' }, { id: '-1', text: '+Add New' }]
          data.Data.SubUnits.forEach(element => {
            if (element.PrimaryUnitId === UIConstant.ZERO) {
              this.unitDataType.push({
                id: element.Id,
                text: element.Name
              })
            }
          })
        }

      this.godownDataType = []
          this.godownPlaceHolder = { placeholder: 'Select Godown' }
          this.godownDataType = [ { id: '-1', text: '+Add New' }]
          data.Data.Godowns.forEach(element => {
              this.godownDataType.push({
                id: element.Id,
                text: element.Name
              })
            
          })
          this.godownId =  this.godownDataType[1].id
        
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

       //  this.categoryType = []
       // this.categoryPlaceHolder = { placeholder: 'Select Category' }
       // this.categoryType = [{ id: UIConstant.BLANK, text: 'Select  Category' }, { id: '-1', text: '+Add New' }]
       //  if (data.Data && data.Data.ItemCategorys.length > 0) {
       //    data.Data.ItemCategorys.forEach(element => {
       //      if (element.ParentId === UIConstant.ZERO) {
       //        this.categoryType.push({
       //          id: element.Id,
       //          text: element.Name
       //        })
       //      }
       //    })
       //  }
        this.itemCategoryType = []
        this.itemCategoryData = data.Data.Items
        this.itemcategoryPlaceHolder = { placeholder: 'Select Item' }
        this.itemCategoryType = [{ id: UIConstant.BLANK, text: 'Select  Item' }, { id: '-1', text: '+Add New' }]
        if (data.Data && data.Data.Items.length > 0) {
          data.Data.Items.forEach(element => {
            this.itemCategoryType.push({
              id: element.Id,
              text: element.Name,
              categoryId: element.CategoryId
            })
          })
        }
        // add Referals  
        this.referals = []
        this.referalsPlaceHolder = { placeholder: 'Select  Referals' }
        this.referals = [{ id: UIConstant.BLANK, text: 'Select Referals' }]
        if (data.Data && data.Data.Referals.length > 0) {
          data.Data.Referals.forEach(element => {
            this.referals.push({
              id: element.Id,
              text: element.Name,

            })

          })
        }
        // add Referals  type
        this.referalsType = []
        this.referalsTypePlaceHolder = { placeholder: 'Select  Type' }
        this.referalsType = [{ id: UIConstant.BLANK, text: 'Select Type' }]
        if (data.Data && data.Data.ReferalTypes.length > 0) {
          data.Data.ReferalTypes.forEach(element => {
            this.referalsType.push({
              id: element.Id,
              text: element.CommonDesc
            })

          })
        }

      }
    })
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

  Commission: any
  CommissionTypeID: any
  onChangeCommissionType(event) {
      if (event.data[0].id === '1') {
        if (event.data[0].text) {
     // this.commision_TypeSelect2.selector.nativeElement.value = ''
          this.CommissionTypeID = event.value
        }
      }
      else {
      //this.commision_TypeSelect2.selector.nativeElement.value = ''
        this.CommissionTypeID = event.value
      }
  
  }

  attributeColorId: any
  attributeSizeId: any
  attributeArticleId: any
  attributeColorName: any
  attributeSizeName: any
  attributeArticleName: any
  attributeIndex :any
  attributeName:any
  attributeId:any
  existId:any
  validAttribute:any
  AttrValueId:any
  onChangeAttribute(event ,indexAttribute ,attributeData) {
    debugger;
let editAttributValue;
    let attributeEdit = this.editAttributeData

    console.log(attributeEdit,'edit-attr-data')
    debugger;



let editAttrId = 0;
    if (event.data.length > 0) {
      if (event.data[0].id !== '0') {
        if (event.data[0].text) {
          this.AttrValueId =  event.data[0].id
          this.existId = event.data[0].attributeId;
if(attributeEdit !== undefined){
   editAttributValue = this.editAttributeData.filter(value=>value.AttributeValueId === this.existId)
  if(editAttributValue.length > 0){
  let index = this.sendAttributeData.findIndex(n=> n.Id === editAttributValue[0].Id)
   editAttrId = editAttributValue[0].Id
     this.trsnItemId = editAttributValue[0].ItemTransId
  this.sendAttributeData.splice(index, 1)
}

}

          this.attributeName = event.data[0].text;
          this.attributeIndex = indexAttribute 
          this.itemAttribute(this.existId ,  this.attributeIndex , editAttrId)
        }
      }
      else{
         this.atrColorSelect2.selector.nativeElement.value = ''
         this._commonService.openAttribute({},true)
      }
    }
  }
  itemsAttribute: any
  itemAttribute(existid,attrIndex,AttrEditId) {
if( this.itemsAttribute.length > 0){
  var data =  this.itemsAttribute.filter(s => s.existId === existid);
  let index = this.itemsAttribute.findIndex(n=> n.existId === existid)
if(data.length > 0){
  let newArray ={
        Id: AttrEditId,
        Index:attrIndex,
        ItemId: this.itemCategoryId,
        ItemTransId:  this.trsnItemId,
        AttributeName: this.attributeName,
        existId:existid,
        AttributeValueId:existid,
        AttributeId: this.AttrValueId,
}
  this.itemsAttribute.splice(index, 1, newArray)
}
else{
      this.itemsAttribute.push({
        Id: AttrEditId ,
        Index:attrIndex,
        ItemId: this.itemCategoryId,
        ItemTransId:  this.trsnItemId,
        AttributeName: this.attributeName,
        existId:existid,
        AttributeValueId:existid,
        AttributeId: this.AttrValueId,

      })
}
}
else{
      this.itemsAttribute.push({
        Id: AttrEditId ,
        Index:attrIndex,
        ItemId: this.itemCategoryId,
        ItemTransId:  this.trsnItemId,
        AttributeName: this.attributeName,
        existId:existid,
        AttributeValueId:existid,
        AttributeId: this.AttrValueId,

      })
}
console.log(this.itemsAttribute ,'attribute')
  }

// checkAttributeValidation(attributeIndex){
// if(attributeIndex){

//   let attrIndex = this.itemsAttribute.filter(s=>s.Index === attributeIndex)

// }
// }

  
  freightByData: any
  freightByValue: any
  freightById: any
  getFreightValueData() {
    this.freightByData = []
    this.frightPlaceholder = { placeholder: 'Select freight ' }
    this.freightByData = [{ id: '0', text: 'Select freight' }, { id: '1', text: 'Paid' }, { id: '2', text: 'To-pay' }]
    this.freightById =this.freightByData[1].id
    //return this.freightByValue = value
  }
setDefaultSelectovalue(){
  this.commision_TypeSelect2.selector.nativeElement.value = ''
  this.orgnizationSelect2.selector.nativeElement.value = ''

  this.commision_TypeSelect2.setElementValue(this.CommissionTypeID)
  this.orgnizationSelect2.setElementValue(this.orgNameId)
}


  getCommisionTypeValue() {
    debugger;
    this.CommissionType = []
    this.CommissionType = [ { id: '1', text: '%' }, { id: '2', text: '$' }]
     this.CommissionTypeID =   this.CommissionType[0].id
     
    // this.onChangeCommissionType(this.CommissionTypeID)
  }
  onChangeFreight(event) {
    if (event.data.length > 0) {
      if (event.data[0].id !== '0') {
        if (event.data[0].text) {
          this.freightById = event.value
        }
      }
      else {
        this.freightById = '0'
      }
    }
  }
  godownId:any

godownName:any
onChangeGodown(event){
  if(event.data.length > 0){
         if (event.data && event.data[0].text) {
      this.godownId = event.value
      this.godownName = event.data[0].text
    //  this.currencyValues[1] = { id: 1, symbol: event.data[0].text }


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
          this.unitDataType.selector.nativeElement.value = ''
        } else {
          if (event.data[0] && event.data[0].text) {
            this.unitId = event.value;
            this.UnitName = event.data[0].text;
            this.validationForItemData()
          }
        }
      }
    }
  }
  clientNameId: any
  @ViewChild('client_select2') clientSelect2: Select2Component
  @ViewChild('unit_select2') unitSelect2: Select2Component
  onSelected2clientId(event) {
    if (event.data.length > 0) {
      this.stateList = []
      if (event.data && event.data[0].id !== "") {
        if (event.value === '-1' && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
          this.clientSelect2.selector.nativeElement.value = ''
          this._commonService.openCust('')
        } else {
          this.clientNameId = event.value
          let parentTypeId = 5;
          this.getAddressOfCustomerByID(this.clientNameId, parentTypeId)


        }
      }
    }
  }
  stateAddressId: any
  stateValue: any
  stateId: any
  stateError: boolean
  addressStateId: any;
  getAddressOfCustomerByID(customerId, parentTypeId) {
    this.subscribe = this._commonService.getAddressByIdOfCustomer(customerId, parentTypeId).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND) {
        this.stateList = []
        this.stateListplaceHolder = { placeholder: 'Select Address' }
        this.stateList = [{ id: '0', text: 'select Address' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
        if (data.Data && data.Data.length > 0) {
         

          //text: element.AddressTypeName +'-'+   element.AddressValue ? element.AddressValue +  ' , ' : ""  +  element. AreaName ? element.AreaName +  ' , ' : " "  + element.CityName+ ' , ' + element.StateName + ' , ' + element.CountryName

          data.Data.forEach(element => {
            this.stateList.push({
              id: element.Id,
              text: ((element.AddressTypeName ? (element.AddressTypeName + '-') : '') + (element.AddressValue ? (element.AddressValue + ' , ') : '') + (element.AreaName ? element.AreaName + ' , ' : '') + element.CityName + ' , ' + element.StateName + ' , ' + element.CountryName)

            })
            return this.stateValue = this.stateAddressId;
          })
          this.stateId = ''
          this.checkValidation()
        }
        else {
          this.stateId = ''
          this.checkValidation()
        }

      }
    })
  }




  getItemByCategoryid(categoryId) {
    this.subscribe = this._commonService.getItemByCategoryId(categoryId).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND && data.Data.length > UIConstant.ZERO) {
        this.itemCategoryType = []
        this.itemCategoryData = data.Data
        this.itemcategoryPlaceHolder = { placeholder: 'Select Item' }
        this.itemCategoryType = [{ id: UIConstant.BLANK, text: 'Select  Item' }, { id: '-1', text: '+Add New' }]
        if (data.Data && data.Data.length > 0) {
          data.Data.forEach(element => {
            // if (element.CategoryId === JSON.parse(this.SenderId) ) {
            this.itemCategoryType.push({
              id: element.Id,
              text: element.Name,
              categoryId: element.CategoryId
            })
            //}
          })
        }
      }
      if (data.Code === 5004) {
        this.itemCategoryType = [{ id: UIConstant.BLANK, text: 'Select  Item' }, { id: '-1', text: '+Add New' }]

      }
    })
  }
  categoryName: any
  onSelectCategory(event) {
    if (event.data.length > 0) {
      if (event.data[0].id !== UIConstant.BLANK) {
        if (event.value === '-1' && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
          this.catSelect2.selector.nativeElement.value = ''
          this._commonService.openCategory('', false)
        } else {
          this.categoryId = event.value
          this.categoryName = event.data[0].text;
          this.getItemByCategoryid(this.categoryId);
          this.validationForItemData()
        }
      }
    }
  }
  itemCategoryId: any
  ItemName: any;
  itemAddRequiredFlag:boolean 
  onSelectItemCategory(event) {
   // alert("kk")
      //this.itemAddRequiredFlag = true
    if (event.data.length > 0) {
      if (event.data[0].id !== "") {
        if (event.value === '-1' && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
          this.itemSelect2.selector.nativeElement.value = ''
          this._commonService.openItemMaster('')
        } else {
         this.itemCategoryId = event.value
          this.ItemName = event.data[0].text;

          this.categoryId = event.data[0].categoryId;
         //this.getAllSubCategory(this.categoryId)
          this.validationForItemData()
        }
      }
    }
  }
     // data.Data.ItemCategorys.forEach(element => {
          //   if (element.ParentId === UIConstant.ZERO) {
          //     this.categoryType.push({
          //       id: element.Id,
          //       text: element.Name
          //     })
          //   }
          // })
  //
  categoryTypeData:any
getAllSubCategory(value){
     this.categoryType = []
       this.categoryPlaceHolder = { placeholder: 'Select Category' }
        let newData = [{ id: UIConstant.BLANK, text: 'Select Category' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }] 
 this.subscribe = this._itemmasterServices.getAllSubCategories(1).subscribe(data => {
if (data.Code === UIConstant.THOUSAND && data.Data.length > 0) {
//if(value !== 0){
        data.Data.forEach(element => {
         // if(element.Id === value){
           newData.push({
            id: element.Id,
            text: element.Name
          })
        //  }
 // return  this.cateGoryValue = value
    this.categoryType = newData
//console.log(data,'category')

        })
       
//}
// else{
//    data.Data.forEach(element => {
//            newData.push({
//             id: element.Id,
//             text: element.Name
//           })
//         })
//     this.categoryType = newData
//       }
    }
  })
 }

  autoCategory: any
  getCategoryDetails(value) {
    let newData = [{ id: UIConstant.BLANK, text: 'Select  Category' }, { id: '-1', text: '+Add New' }]
    this.subscribe = this._categoryServices.GetCatagoryDetail(UIConstant.BLANK).subscribe(Data => {
      if (Data.Code === UIConstant.THOUSAND && Data.Data.length > UIConstant.ZERO) {
        Data.Data.forEach(element => {
          if (element.Id === value) {
            newData.push({
              id: element.Id,
              text: element.Name
            })
          }
        })
        this.cateGoryValue = value
      }
    })
  }

  setupOrganization: any
  organizationData: any
  enableDisableflagOrgName: boolean = true
  getCurrency() {
    let _self = this
    this.getAvailableCurrency().toPromise().then(
      (data: ResponseSale) => {
  

        if (data.Code === UIConstant.THOUSAND && data.Data.SetupModules.length > 0) {
          _self.setupModules = data.Data.SetupModules[0]
          if (!this.editMode) {
            //   alert("ih")
            if (!_self.setupModules.IsBillNoManual) {
              _self.BillNo = _self.setupModules.BillNo
            }
          }

          _self.setSupplyDate()
          _self.setBillDate()
          _self.setPayDate()
          _self.setTravelDate()
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


        if (data.Data && data.Data.SetupOrganization && data.Data.SetupOrganization.length > 1) {
          this.organizationData = []
          this.orgnazationPlaceHolder = { placeholder: 'Select Organization' }
          this.organizationData = [{ id: UIConstant.BLANK, text: 'Select  Organization' }]
          _self.setupOrganization = data.Data.SetupOrganization;
          console.log(  data.Data.SetupOrganization  ,"organizationData4")
          data.Data.SetupOrganization.forEach(ele => {
            this.organizationData.push({
              id: ele.Id,
              text: ele.Name
            })
          })
          this.orgnizationSelect2.setElementValue('')
            this.orgNameId = this.organizationData[1].id
          console.log(this.orgNameId  ,"organizationData4")

          if (data.Data&& data.Data.SetupOrganization && data.Data.SetupOrganization.length === UIConstant.ONE) {
            _self.BillNo = _self.setupModules.BillNo
          _self.setupOrganization = data.Data.SetupOrganization;
            this.enableDisableflagOrgName = true
                  data.Data.SetupOrganization.forEach(ele => {
            this.organizationData.push({
              id: ele.Id,
              text: ele.Name
            })
          })
          this.orgnizationSelect2.setElementValue('')

            this.organizationData = this.organizationData[1].id
            this.OrgId = data.Data.SetupOrganization[1].id
         //   this.BillNo =  data.Data.SetupOrganization[0].BillNo
            console.log( this.organizationData ,"--->organizationData1")
          }
          else {
            this.enableDisableflagOrgName = true
          }
        }


      }
    )
  }





  orgNameId: any
  OrgId: any
  onChangeOrganizationId(e) {
    if (e.data.length > 0) {
      if (e.data[0].id !== "") {
        this.orgNameId = e.value;
        this.checkValidation()
        this.subscribe = this._commonService.getsettingforOrgnizationData(this.orgNameId,'SaleChallan',this.InvoiceDate).subscribe(data => {
          if (data.Code === 1000 && data.Data.length > 0) {
            this.OrgId = data.Data[0].Id
            this.BillNo = data.Data[0].BillNo
            console.log(this.BillNo,data,"kkk")
          }

        })
      }
      else {
        this.orgNameId = 0;

      }
    }

  }


Remark:any
showItemAttributeArray:any
newShowlocalarray:any
labeldata:any
localLabelData:any


            localAddAttribute(){
            for(let i=0; i < this.itemsAttribute.length ; i++){
              this.sendAttributeData.push({
            AttributeId:  this.itemsAttribute[i].AttributeId,
            AttributeName: this.itemsAttribute[i].AttributeName,
            Index:this.itemsAttribute[i].Index,
            Id: this.itemsAttribute[i].Id,
            ItemId: this.itemsAttribute[i].ItemId,
            AttributeValueId:this.itemsAttribute[i].AttributeValueId,
            ItemTransId: this.itemsAttribute[i].ItemTransId,
            existId: this.itemsAttribute[i].existId,
              })
            }
         
            }
            localItemas:any
            showAttributeData:any

     localItems(){
            let value=[];

              this.items.forEach(element=>{
                this.localLabelData =[]
            if(element.Id === 0  && ( element.Sno === this.snoIndex ) ){
              this.attributesLabels.forEach(label=>{
                  this.labeldata =  this.sendAttributeData.filter(v=>v.existId === label.AttributeId   )
                  value=[];
                if(this.labeldata.length > 0){
                  value =  this.labeldata.filter(v=>v.ItemTransId === element.Sno)

                   }
                   this.localLabelData.push({
                      AttributeId: label.AttributeId,
                      Label: label.Name,
                      AttributeValue: value

                   })
              })


            this.localItemas.push({
             Id: element.Id,
             Sno:  element.Sno,
             CategoryName: element.CategoryName,
             ItemName: element.ItemName,
             UnitName: element.UnitName,
             UnitId: element.UnitId,
             ChallanId: element.ChallanId,
             ItemId: element.ItemId,
             Remark: element.Remark,
             Quantity: +element.Quantity,
             SaleRate: +element.SaleRate,
             TotalAmount: +element.TotalAmount,
             TransId: element.TransId,
             LableAttributeVale: this.localLabelData

              })
          }
          else if(this.editItemId > 0 && element.rowEditFlagValue && ( element.Sno === this.snoIndex )){
            debugger;
               this.attributesLabels.forEach(label=>{
                  this.labeldata =  this.sendAttributeData.filter(s=> (s.AttributeValueId === label.AttributeId) && (s.ItemTransId === element.Id) )
                  value=[];
                if(this.labeldata.length > 0){
                  value =  this.labeldata.filter(v=>v.ItemTransId === element.Id)

                   }
                   this.localLabelData.push({
                      AttributeId: label.AttributeId,
                      Label: label.Name,
                      AttributeValue: value

                   })
              })
           this.localItemas.push({
             Id: element.Id,
             Sno:  element.Sno,
             CategoryName: element.CategoryName,
             ItemName: element.ItemName,
             UnitName: element.UnitName,
             UnitId: element.UnitId,
             ChallanId: element.ChallanId,
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
          
         


  addItems() {
    this.deleteEditflag =true
debugger;
//this.itemAddRequiredFlag = false;
if(this.editAlreadyItemDataFlag){
   this.localItemas=[]

}
else{
this.itemSubmit =true;
 // alert("jj")
}
 //this.localLabelData=[]
   if(this.validationForItemData()){
    if (this.categoryId > 0 && this.itemCategoryId > 0  && this.Quantity) {
   //  this.deleteEditflag = true;
     this.addItem()
    // this.showItemAttributeArray =  this.sendAttributeData
   //  this.itemsAttribute = []
   this.clickItem =true
     //this.totalQty()
     //this.totalRowCalculation()
     this.calculateAllTotal()
     this.calculateTotalOfRow()
     this.calTotalBillAmount()
     this.clickItem = true
     this.initialiseItem()
    }

  }
  }
  lastItemFlag:boolean;
trsnItemId:any
snoIndex:any
  addItem() {
    if (this.items.length === 0) {
      this.snoIndex = 1
      this.items.push({
        Id: this.editItemId !== 0 ? this.editItemId : 0,
        Sno:  this.snoIndex,
        CategoryName: this.categoryName,
        ItemName: this.ItemName,
        UnitName: this.UnitName,
        UnitId: this.unitId,
        ChallanId: 0,
        ItemId: this.itemCategoryId,
        Remark: this.Remark,
        Quantity: +this.Quantity,
        SaleRate: +this.Rate,
        TotalAmount: +this.TotalAmount,
        TransId: 0,
        rowEditFlagValue:true

      })
    } else {
      this.snoIndex = +this.items[this.items.length - 1].Sno + 1
      this.items.push({
        Id: this.editItemId !== 0 ? this.editItemId : 0,
        Sno: this.snoIndex,
        CategoryName: this.categoryName,
        ItemName: this.ItemName,
        UnitName: this.UnitName,
        UnitId: this.unitId,
        ChallanId: 0,
        ItemId: this.itemCategoryId,
        Remark: this.Remark,
        Quantity: +this.Quantity,
        SaleRate: +this.Rate,
        TotalAmount: +this.TotalAmount,
        TransId: 0,
        rowEditFlagValue:true
      })
    }
       this.trsnItemId = this.items[this.items.length - 1].Sno + 1
       this.localAddAttribute()
       this.localItems()

  }


  rowIndex: any
  AttrId: any



  initialiseItem() {
    this.Remark=''
    this.Rate = ''
    this.Quantity = ''
    this.TotalAmount = 0
    this.clickItem = false
    this.getCategoryDetails(0)
    this.getItemByCategoryid(0)
   
  }




  @ViewChild('orgnization_select2') orgnizationSelect2: Select2Component
  @ViewChild('state_Select2Id') stateSelect2Id: Select2Component
  @ViewChild('currency_select2') currencySelect2: Select2Component
  @ViewChild('parcelby_select2') parcelbySelect2: Select2Component
  @ViewChild('dest_select2') destSelect2: Select2Component
  @ViewChild('freight_By') freightBySelect2: Select2Component
  @ViewChild('referal_type') referal_typeSelect2: Select2Component
  @ViewChild('referal_id') referal_idSelect2: Select2Component
  @ViewChild('commision_Type') commision_TypeSelect2: Select2Component

  initialiseParams() {
    this.items = []
    this.localItemas =[]
     this.sendAttributeData =[]
     this.showAttributeData=[]
    this.transactions = []
    this.submitSave = false
    this.itemSubmit = false
    this.clickItem = false
    this.clickTrans = false
    this.isValidAmount = true
    this.deleteEditflag =true
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


    if (this.clientSelect2  && this.clientSelect2.selector.nativeElement.value) {
      this.clientSelect2.setElementValue('')
    }
    if (this.catSelect2 && this.catSelect2.selector.nativeElement.value) {
      this.catSelect2.setElementValue('')
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
    if (this.commision_TypeSelect2 && this.commision_TypeSelect2.selector.nativeElement.value) {
      this.commision_TypeSelect2.setElementValue('')
    }
    if (this.stateSelect2Id && this.stateSelect2Id.selector.nativeElement.value) {
      this.stateSelect2Id.setElementValue('')
    }
    if (this.orgnizationSelect2 && this.orgnizationSelect2.selector.nativeElement.value) {
      this.orgnizationSelect2.setElementValue('')
    }

  }
  // cat_select2
  // item_select2
  setTravelDate() {

    let _self = this
    jQuery(function ($) {
      flatpickr('#travel-date', {
        minDate: 'today',
        dateFormat:  _self.clientDateFormat,
        enableTime: true
      })
    })
  }

  setPayDate() {

    let _self = this
    jQuery(function ($) {
      flatpickr('#pay-date', {
        minDate: 'today',
        dateFormat:  _self.clientDateFormat,
      })
    })
  }

  setBillDate() {
 
    let _self = this
    if (this.setupModules && this.setupModules.IsBackDateEntryAllow) {
      jQuery(function ($) {
        flatpickr('#bill-date', {
          maxDate: 'today',
          dateFormat: _self.clientDateFormat,
          // defaultDate: 'today',
          //enableTime: true

        }
)      })
    } else {
      jQuery(function ($) {
        flatpickr('#bill-date', {
          
          minDate: 'today',
          dateFormat:_self.clientDateFormat,
          defaultDate: 'today',
         // enableTime: true

        })
      })
    }
  }


  setSupplyDate() {

    let _self = this
    jQuery(function ($) {
      flatpickr('#supply-date', {
        minDate: 'today',
        dateFormat: _self.clientDateFormat,
      //  defaultDate: 'today',
        //enableTime: true
      })
    })

  }



  clearExtras() {
    this.setupModules = {}
    this.currenyValues = [{ id: '0', symbol: '%' }]
    this.clientNameId = ''
    this.BillNo = ''
    this.clientNameSelect2 = []
    this.organizationData = []
    this.getDataforItemSaleChallan()

  }
closebtn(){
     this.commision_TypeSelect2.setElementValue('')

}


  // totalQty() {
  //   if (this.items.length === 0) {
  //     this.TotalQuantity = (isNaN(+this.Quantity)) ? 0 : +this.Quantity
  //   }
  //   else {
  //     let totalQty = 0
  //     for (let i = 0; i < this.items.length; i++) {
  //       totalQty = +totalQty + +this.items[i].Quantity
  //     }
  //     this.TotalQuantity = (isNaN(+totalQty)) ? 0 : +totalQty
  //   }
  // }







  calculateTotalOfRow() {
    let  totalQty = 0;
    let Rate = (isNaN(+this.Rate)) ? 0 : +this.Rate
    let Quantity = (isNaN(+this.Quantity)) ? 0 : +this.Quantity

this.TotalAmount = Rate * Quantity
    // if(totalQty){
    //     totalQty = totalQty + +this.TotalQuantity 
     
    // }
    // this.TotalQuantity  = totalQty
        let totalAmount = this.TotalAmount
        return isNaN(totalAmount) ? 0 : totalAmount

  }

  netBillAmount: number

  calculate () {

    this.TotalAmount = +this.calculateTotalOfRow()
    this.calculateForTotalAmount()
    this.calculateAllTotal()
    this.calTotalBillAmount()

  }
  //   totalQty() {
  //   if (this.items.length === 0) {
  //     this.TotalQuantity = (isNaN(+this.Quantity)) ? 0 : +this.Quantity
  //   }
  //   else {
  //     let totalQty = 0
  //     for (let i = 0; i < this.items.length; i++) {
  //       totalQty = +totalQty + +this.items[i].Quantity
  //     }
  //     this.TotalQuantity = (isNaN(+totalQty)) ? 0 : +totalQty
  //   }
  // }
  calTotalBillAmount(){
   let totalBillAmt = 0
   let totalQty = 0
    for (let i = 0; i < this.localItemas.length; i++) {
      totalBillAmt = totalBillAmt +  (isNaN(+this.localItemas[i].SaleRate) ? 0 : +this.localItemas[i].SaleRate) *
      (isNaN(+this.localItemas[i].Quantity) ? 0 : +this.localItemas[i].Quantity)
        totalQty = totalQty +   (isNaN(+this.localItemas[i].Quantity) ? 0 : +this.localItemas[i].Quantity)
    }
    if (!this.clickItem) {

      if (this.Rate !== "" ){
        totalBillAmt += +this.Rate * this.Quantity
      }
    }
    if(totalQty){
            totalQty = totalQty
         }
    this.TotalQuantity = totalQty

    // else{

    //     totalBillAmt += +this.Rate * this.Quantity

    // }
    this.netBillAmount = totalBillAmt + +this.TotalAllFreight + +this.OtherAllCharge + +this.totalCommsion 

}
  TotalAllFreight :any
OtherAllCharge:any
totalCommsion:any
    calculateAllTotal () {
    debugger;
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

      if(totalQty){
            totalQty = totalQty
         }

      if( !isNaN(this.TotalFreight)){
    fright += +this.TotalFreight

    }
         if( !isNaN(this.Commission)){
    commsion += +this.Commission

    }
      if( !isNaN(this.OtherCharge)){
    otherChange += +this.OtherCharge

    }
    this.TotalQuantity = totalQty
   
    this.TotalAllFreight = fright
    this.OtherAllCharge = otherChange
    this.totalCommsion = commsion
    this.calTotalBillAmount()
  }


}
  calculateForTotalAmount() {
    let totalAmount = 0
    let totalQty = 0
    let totalfright =0
    let totalOther=0
    let netAmt =0
    for (let i = 0; i < this.localItemas.length; i++) {
      totalAmount = +totalAmount + +(this.localItemas[i].Quantity * this.localItemas[i].SaleRate)
     // totalQty = +totalQty + +this.localItemas[i].Quantity 


    }

    if (!this.clickItem) {
      if (this.TotalAmount !== 0 && typeof this.TotalAmount !== 'undefined' && !isNaN(+this.TotalAmount)) {
        totalAmount = totalAmount + +this.TotalAmount 

      }
    }



    if (!isNaN(totalAmount)) {
      this.RoundOff = +(Math.round(totalAmount) - totalAmount).toFixed(5)
      this.netBillAmount = Math.round(totalAmount)

    }

  }


  identify(index, item) {
    item.Sno = index + 1
    return item.Sno - 1
  }


  checkValidationForAmount(): boolean {
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



  ngOnDestroy() {
    this.modalOpen.unsubscribe()
    this.newAttributeADDModel.unsubscribe()
    this.modalCategory.unsubscribe()
    this.newCustAddSub.unsubscribe()
    this.newCustAddCutomer.unsubscribe()
    this.newNewAddress.unsubscribe()
    //   this.newVendAddSub.unsubscribe()
    // this.newLedgerAddSub.unsubscribe()
  }

  openModal() {
    this.getCommisionTypeValue()
    this.godownId = 0
    this.itemAddRequiredFlag = false
    this.editAlreadyItemDataFlag =false;
    this.showAttributeData=[]
    this.localLabelData =[]
    this.trsnItemId = 1
    this.itemsAttribute = []
    this.getAllSubCategory(0)
     this.getDataforItemSaleChallan();
 this.editItemId = 0
    if (this.editMode) {
      this.getSaleChllanEditData(this.Id)
     // this.editItemId = 0
    }
    else {

    }
    this.getCurrency()
    this.setSupplyDate()
    this.initComp()
    $('#sale_challan_form').modal(UIConstant.MODEL_SHOW)
  }

  closeModal() {
    if ($('#sale_challan_form').length > 0) {
      $('#sale_challan_form').modal(UIConstant.MODEL_HIDE)
    }
  }

  closeInvoice() {
    this._commonService.closeInvoice()
  }

  selectStatelist(event) {
    if (event.data.length > 0) {
      if (event.data[0].id !== "") {
        if (event.value === '-1' && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
          this.stateSelect2Id.selector.nativeElement.value = ''

          this._commonService.openAddress(this.clientNameId)

        }
        else {
          this.stateId = event.value
          this.stateError = false
          this.checkValidation()
        }

      }

    }

  }
  invalidObj: Object = {}

  checkValidation(): boolean {
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

 
    //if (this.itemsAttribute.length === 0) {
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


validationForItemData(){
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
      if (this.Quantity) {
        this.invalidObj['Quantity'] = false
      } else {
        this.invalidObj['Quantity'] = true
        isValidItem = 0
      }

    //}
     return !!isValidItem
}



  currency: any
  defaultCurrency: string
  setupModules: any
  currenyValues: Array<{ id: string, symbol: string }> = [{ id: '0', symbol: '%' }]
  isDataAvailable: boolean = false

  getAvailableCurrency() {
        return this._commonService.setupSettingByType(UIConstant.SALE_CHALLAN_TYPE)
  }
  inventoryItemSales: any
  ItemTransactionactions: any
  itemAttbute: any
  ColorCode: any
  SizeCode: any
  ArticleCode: any
  editAlreadyItemDataFlag:boolean
  getSaleChllanEditData(id) {
    // this.getAddressOfCustomerByID(0,0)
    this._commonService.saleEditChallan(id).subscribe(data => {
   //   console.log(JSON.stringify(data), 'editData----------->>');
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        if (data.Data && data.Data.InventoryTransactionSales.length > 0) {
          this.inventoryItemSales = []
          this.inventoryItemSales = data.Data.InventoryTransactionSales;
          this.itemsAttribute = []
          this.stateSelect2Id.setElementValue(this.inventoryItemSales[0].SupplyState)
          this.clientNameId = this.inventoryItemSales[0].LedgerId
          this.orgNameId = this.inventoryItemSales[0].OrgId
          this.stateId = this.inventoryItemSales[0].SupplyState
          this.orgnizationSelect2.setElementValue(this.inventoryItemSales[0].OrgId)
          this.clientSelect2.setElementValue(this.inventoryItemSales[0].LedgerId)
          this.commision_TypeSelect2.setElementValue(this.inventoryItemSales[0].CommissionType)
          this.freightBySelect2.setElementValue(this.inventoryItemSales[0].FreightMode)
          this.referal_typeSelect2.setElementValue(this.inventoryItemSales[0].ReferTypeid)
          this.referal_idSelect2.setElementValue(this.inventoryItemSales[0].ReferId)
          this.catSelect2.setElementValue(this.inventoryItemSales[0].CategoryId)
          this.BillNo = this.inventoryItemSales[0].BillNo;
          this.InvoiceDate = this._globalService.utcToClientDateFormat(this.inventoryItemSales[0].BillDate, this.clientDateFormat) 
          this.SupplyDate = this._globalService.utcToClientDateFormat(this.inventoryItemSales[0].SupplyDate, this.clientDateFormat)
          this.EwayBillNo = this.inventoryItemSales[0].EwayBillNo;
          this.LocationTo = this.inventoryItemSales[0].LocationTo;
          this.VehicleNo = this.inventoryItemSales[0].VehicleNo;
          this.Drivername = this.inventoryItemSales[0].DriverName;
          this.Transportation = this.inventoryItemSales[0].Transportation;
          this.TotalQuantity = this.inventoryItemSales[0].TotalQty;
          this.Commission = this.inventoryItemSales[0].Commission;
          this.TotalFreight = this.inventoryItemSales[0].Freight;
          this.OtherCharge = this.inventoryItemSales[0].OtherCharge;




          let newDataUnit = Object.assign([], this.unitDataType)
          newDataUnit.push({ id: this.inventoryItemSales[0].OrgId, text: this.inventoryItemSales[0].UnitName })
          this.unitDataType = newDataUnit
          this.unitId = this.inventoryItemSales[0].UnitId
          this.getUnitId = this.inventoryItemSales[0].UnitId

        } else {
          this.inventoryItemSales = []
        }
        // this.attributesLabels =[]
          // data.Data.AttributeValues.forEach(ele=>{
          //  this.attributesLabels.push({
          //             Name :ele.Name,
          //              AttributeId :ele.AttributeId
                      
          //           })
          // })
        
        if (data.Data.ItemTransactionactions.length > 0) {
          this.editAlreadyItemDataFlag = false;
          this.localItemas =[]
          this.items =[]
          this.items =  data.Data.ItemTransactionactions
         
          this.ItemTransactionactions = []
          this.itemsAttribute = []
          // this.attributesLabels =[]
          this.ItemTransactionactions = data.Data.ItemTransactionactions
          //for (let i = 0; i < data.Data.ItemTransactionactions.length; i++)
          data.Data.ItemTransactionactions.forEach(element=>{
            let value;
        console.log(data.Data.ItemAttributesTransactions,"edit-attribut")
           this.localLabelData =[]
          this.sendAttributeData =  data.Data.ItemAttributesTransactions;
        let editAttributeData = data.Data.ItemAttributesTransactions.filter (itm=> itm.ItemTransId === element.Id)
            // this.showAttributeData  = this.sendAttributeData.filter(s=>s.ItemTransId === element.Sno)
              this.attributesLabels.forEach(label=>{
                  this.labeldata =  data.Data.ItemAttributesTransactions.filter(v=>v.AttributeValueId === label.AttributeId)
                  value=[];
                if(this.labeldata.length > 0){
                        value =  this.labeldata.filter(v=>v.ItemTransId === element.Id)

                      }
                   this.localLabelData.push({
                      AttributeId: label.AttributeValueId,
                      Label: label.Name,
                      AttributeValue: value

                   })
              })
            this.localItemas.push({
              Sno: 0,
              Id: element.Id,
              CategoryName: element.CategoryName,
              CategoryId :element.CategoryId,
              ItemName: element.ItemName,
              Remark: element.Remark,
              UnitName: element.UnitName,
              Quantity: element.Quantity,
              SaleRate: element.SaleRate,
              UnitId: element.UnitId,
              ItemId: element.ItemId,
              TotalAmount: (element.SaleRate) * (element.Quantity),
              attributeData: editAttributeData,
              LableAttributeVale: this.localLabelData

            })
          // this.items = this.localItemas;
            console.log(data.Data.ItemTransactionactions ,'item edit')

          }
        )
           this.calculateAllTotal()
        }


      }


    })
  }
InvoiceDateChngae:any
sendAttributeData:any
SupplyDateChngae:any
  saveSaleChallan() {
    debugger;
    this.submitSave = true
    if(this.deleteEditflag){

   // this.addItems()
    this.calculateTotalOfRow()
    this.calculateAllTotal()
    if (this.checkValidation()) {
      console.log(JSON.stringify(this.items) ,"Request")
     if(this.items.length !== 0){
     
     this.InvoiceDateChngae = this._globalService.clientToSqlDateFormat(this.InvoiceDate, this.clientDateFormat)
     this.SupplyDateChngae = this._globalService.clientToSqlDateFormat(this.SupplyDate, this.clientDateFormat)

      let obj = {}
      obj['Id'] = this.Id === 0 ? 0 : this.Id
      obj['PartyId'] = this.clientNameId
      obj['OrgId'] = this.orgNameId
      obj['BillNo'] = this.BillNo
      obj['GodownId'] =this.godownId
      obj['BillDate'] = this.InvoiceDateChngae
      obj['EwayBillNo'] = this.EwayBillNo
      obj['Supplydate'] = this.SupplyDateChngae
      obj['VehicleNo'] = this.VehicleNo
      obj['Drivername'] = this.Drivername
      obj['SupplyState'] = this.stateId
      obj['Transportation'] = this.Transportation
      obj['LocationTo'] = this.LocationTo === '' ? "  " : this.LocationTo
      obj['Freight'] = this.TotalFreight
      obj['FreightMode'] = this.freightById
      obj['ReferId'] = this.referalsID
      obj['ReferTypeId'] = this.referalsTypeID
      obj['Commission'] = this.Commission
      obj['CommissionType'] = this.CommissionTypeID
      obj['OtherCharge'] = this.OtherCharge
      obj['TotalQuantity'] = this.TotalQuantity
      obj['BillAmount'] = this.BillAmount
      obj['Items'] = this.items
      obj['itemAttributeTrans'] = this.sendAttributeData
      let _self = this
      console.log('sale-challan-request : ',JSON.stringify(obj))
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
        }
      )

    }

    else{
      this.toastrService.showError('Error','Please Add Item');
    }
     }
     }
    else{
      this.toastrService.showWarning('Warning','First Save Item');
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
  deleteItem(a) {
    debugger;
      this.lastItemFlag = true;
    this.items.splice(a, 1)
    this.localItemas.splice(a, 1)
    if(this.items.length === 0 &&  this.localItemas.length === 0){
      this.lastItemFlag = false 
    }
    this.calculateAllTotal()
    console.log( this.localItemas,'delete items')

  }
  AttrColourEditId: any
  AttrSizeEditId: any
  AttrArticleEditId: any
  deleteEditflag: boolean = true
  editAttributeData:any
  editRowItem(index, item, editId, attributeData,) {
   this.editAttributeData = attributeData
    debugger;
    if(this.deleteEditflag){
      this.deleteEditflag = false;
      this.editItemId = editId
      this.Remark =item.Remark
      this.Quantity = item.Quantity
      this.unitId =item.UnitId
      this.UnitName = item.UnitName
      this.ItemName = item.ItemName
      this.itemCategoryId =item.ItemId
      this.categoryId =item.CategoryId

      this.Rate = item.SaleRate
      this.TotalAmount = this.Quantity * this.Rate
      this.catSelect2.setElementValue(item.CategoryId)
      this.unitSelect2.setElementValue(item.UnitId)
      this.itemSelect2.setElementValue(item.ItemId)
      this.deleteItem(index)
    }
    else{
      this.toastrService.showWarning('Warning','First save item!')
    }
   
  
  }



}





