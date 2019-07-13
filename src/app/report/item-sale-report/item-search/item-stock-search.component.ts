import { Component, Input, OnInit ,ViewChild} from '@angular/core'
import { Select2OptionData, Select2Component } from 'ng2-select2'
import { Subscription } from 'rxjs'
import { FormGroup } from '@angular/forms'
import { SaleTravel, AddCust } from '../../../model/sales-tracker.model'
import { UIConstant } from '../../../shared/constants/ui-constant'
declare var $: any
declare var flatpickr: any
import { CommonService } from '../../../commonServices/commanmaster/common.services'
import { ToastrCustomService } from '../../../commonServices/toastr.service'
import { GlobalService } from '../../../commonServices/global.service'
import { Settings } from '../../../shared/constants/settings.constant'
import { ItemmasterServices } from '../../../commonServices/TransactionMaster/item-master.services'
import { VendorServices } from '../../../commonServices/TransactionMaster/vendoer-master.services'

@Component({
  selector: 'app-item-stock-search',
  templateUrl: './item-stock-search.component.html',
  styleUrls: ['./item-stock-search.component.css']
})
export class ItemSaleSearchComponent implements OnInit {
  @Input() toShow: boolean = false
  clientDateFormat: any
  subscribe: Subscription
  toDateChngae : any =''
  fromDateChange: any =''
  batchNo: any =''
  ledgerId: any =0
  categoryId: any =''
  itemId: any = ''
  clientNameSelect2: Array<Select2OptionData>
 public categoryType: Array<Select2OptionData>
  constructor (private _coustomerServices: VendorServices,private _itemmasterServices: ItemmasterServices, public _globalService: GlobalService,
    public _settings: Settings,public _commonService: CommonService, public _toastrCustomService: ToastrCustomService) {
    this.clientDateFormat = this._settings.dateFormat
    this.toDate()
    this.fromDate()
  }
  fromDate () {
    let _self = this
    this.fromDatevalue = this._globalService.utcToClientDateFormat(this._settings.finFromDate, this.clientDateFormat)

    // this.fromDatevalue = ''

  }
  fromDatevalue: string
  toDateValue: string
  toDate () {
    this.toDateValue = this._globalService.utcToClientDateFormat(this._settings.finToDate, this.clientDateFormat)

    // this.toDateValue = ''

  }
  ngOnInit () {
    $(document).ready(function () {
      $('.table_challan').tableHeadFixer({
        head: true,
        foot: true
      })
    })
    this.getAllDataForItemSarch()
  }
  searchdataList: any
  stateList: any
  getAllDataForItemSarch () {
    this.subscribe =this._commonService.getSalePurchaseUtilityItems().subscribe(data =>{
      let newDataForItems= [{id :'',text:'Select Items'}]
      let newDataForCustomer= [{id :'',text:'Select Customer'}]
      let newDataForCaegoryParent= [{id :'',text:'Select Category'}]

        if(data.Code === UIConstant.THOUSAND){
           if(data.Data.Items.length > 0){
            data.Data.Items.forEach(element => {
              newDataForItems.push({
                id: element.Id,
                text: element.Name
              })
            })  
           }
           this.itemCategoryType =newDataForItems
           if(data.Data.Customers.length > 0){
            data.Data.Customers.forEach(element => {
              newDataForCustomer.push({
                id: element.Id,
                text: element.Name
              })
            })  
           }
           this.clientNameSelect2 =newDataForCustomer
           if(data.Data && data.Data.ItemCategoryParent.length > 0){
            data.Data.ItemCategoryParent.forEach(element => {
              newDataForCaegoryParent.push({
                id: element.Id,
                text: element.Name
              })
            })  
           }
           this.categoryType =newDataForCaegoryParent
        }  
    })
  }
  onChangeCustomer (event) {
    if (event.data.length > 0) {
      if (event.data && event.data[0].id !== '') {
          this.ledgerId = event.value
        }
      }
    }
   
    onSelectItem (event) {
      
      if (event.data.length > 0) {
        if (event.data[0].id !== '') {
           this.itemId = event.value
        }
      }
    }
    SearchText :any =''
  searchItemButton () {
    if(this.toDateValue !==''){
      this.toDateChngae = this._globalService.clientToSqlDateFormat(this.toDateValue, this.clientDateFormat)
     }
     else{
       this.toDateChngae =''
     }
     if(this.fromDatevalue !==''){
       this.fromDateChange = this._globalService.clientToSqlDateFormat(this.fromDatevalue, this.clientDateFormat)
      }
      else{
        this.fromDateChange =''
      }
    this._commonService.searchByDateForItemSale( this.toDateChngae ,this.fromDateChange,this.SearchText ,this.categoryId ,this.itemId, this.ledgerId)

  }

  onChangeFromDate(event ){
    let date 
    if(event.target.value){
       date = event.target.value
    }
    else{
      date = this.fromDatevalue
    }
     this.fromDateChange = this._globalService.clientToSqlDateFormat(date, this.clientDateFormat)
   
 }
 onChangeToDate(event ){
  let date 
  if(event.target.value){
     date = event.target.value
  }
  else{
    date = this.toDateValue
  }
   this.toDateChngae = this._globalService.clientToSqlDateFormat(date, this.clientDateFormat)

}
@ViewChild('cat_select2') catSelect2: Select2Component
categoryName: any
selectedCategory (event) {
  if (event.value && event.data.length > 0) {
    if (event.data[0].id !== '' ) {
      this.categoryId = +event.value
    }
  }
}
updatedFlag: any
newdataCatItem: any
itemCategoryType: any
getItemByCategoryid (categoryId) {
  categoryId = JSON.stringify(categoryId)
  this.updatedFlag = false
  this.itemCategoryType = []
  let newdataitem = [{ id: UIConstant.BLANK, text: 'Select  Item', categoryId: '' }]
  this.subscribe = this._commonService.getItemByCategoryId(categoryId).subscribe(data => {
    if (data.Code === UIConstant.THOUSAND && data.Data.length > 0) {
      this.updatedFlag = true
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



@ViewChild('item_select2') itemSelect2: Select2Component
@ViewChild('client_select2') clientSelect2: Select2Component

searchResetButton () {
  this.itemSelect2.setElementValue('')
  this.catSelect2.setElementValue('')
  this.clientSelect2.setElementValue('')
  this.toDateValue=''
  this.fromDatevalue=''
  this.SearchText =''
  this.categoryId=''
  this.itemId=''
  this.ledgerId=0
  this._commonService.searchByDateForItemSale( this.toDateValue ,this.fromDatevalue,this.SearchText ,this.categoryId ,this.itemId, this.ledgerId)
  
}

}
