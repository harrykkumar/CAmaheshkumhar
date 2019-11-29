import { Component, Input, OnInit, AfterViewInit, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core'
import { Subscription } from 'rxjs'
declare var $: any
declare var flatpickr: any
import { CommonService } from '../../../commonServices/commanmaster/common.services'
import { ToastrCustomService } from '../../../commonServices/toastr.service'
import { GlobalService } from '../../../commonServices/global.service'
import { Settings } from '../../../shared/constants/settings.constant'
import { map } from 'rxjs/operators';
import * as _ from 'lodash'

@Component({
  selector: 'app-item-stock-search',
  templateUrl: './item-stock-search.component.html',
  styleUrls: ['./item-stock-search.component.css']
})
export class ItemStockSearchComponent implements OnInit, AfterViewInit, OnChanges {
  model: any = {};
  @Input() toShow: boolean = false
  @Input() getFilterParameters: any
  @Output() searchByFilter = new EventEmitter();
  allItems: Array<any> = [];
  clientDateFormat: any
  subscribe: Subscription
  masterData: any = {};
  categoryOption: Select2Options;
  itemOption: Select2Options;
  attributeOption: Select2Options;
  unitOption: { placeholder: string; };
  loading: boolean
  catLevel: any = 3
  allCategories: any = []
  searchdataList: any
  categories: any
  
  constructor(public _globalService: GlobalService,
    public _settings: Settings, public _commonService: CommonService,
     public _toastrCustomService: ToastrCustomService) {
    this.clientDateFormat = this._settings.dateFormat
    this.categoryOption = {
      multiple: true,
      placeholder: 'Select Categories'
    };
    this.itemOption = {
      multiple: true,
      placeholder: 'Select Items'
    };
    this.attributeOption = {
      multiple: true,
      placeholder: 'Select Items'
    };
    this.unitOption = {
      placeholder: 'Select Unit'
    };
  }

  ngAfterViewInit(){
    this.model.statusTypeName ='Itemwise'
    this.getStatusType()
    this.toDate()
    this.fromDate()
  }
StatusType:any=[]
 getStatusType(){
  this.StatusType =[{id:1,text:'ItemWise'},{id:2,text:'ExpiryWise'},{id:3,text:'CategoryWise'}]
 }
 statusTypeName:any ='ItemWise'
 
 StatusTypeChange (evt){
if(evt && evt.value>0){
  this.model.statusTypeName =evt.data[0].text
  this.statusTypeName = evt.text
}
 }
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.toShow) {
      this.resetValues()
    }
    if (this.getFilterParameters.pageNo || this.getFilterParameters.pageSize) {
      this.model.pageNo = this.getFilterParameters.pageNo
      this.model.pageSize = this.getFilterParameters.pageSize
      this.search()
    }
  }

  fromDate = () => {
    this.model.fromDatevalue = this._globalService.utcToClientDateFormat(this._settings.finFromDate, this.clientDateFormat)
  }

  toDate = () => {
    this.model.toDateValue = this._globalService.utcToClientDateFormat(this._settings.finToDate, this.clientDateFormat)

  }

  getSalePurchaseUtilityItems = () => {
    this._commonService.getSalePurchaseUtilityItems()
    .pipe(
      map((data: any) => {
        const category =  _.map(data.Data.ItemCategorys, (element) => {
          return {
            id: element.Id,
            text: element.Name
          }
        })
        let attribute = [];
        _.forEach(data.Data.AttributeValueResponses, (attributeType) => {
          _.forEach(attributeType.AttributeValuesResponse, (attributeValue) => {
            if(attributeValue.Id !== -1) {
              const data = {
                id: attributeValue.Id,
                text: `${attributeValue.Name} ( ${attributeValue.AttributeName} ) `
              }
              attribute.push(data);
            }
          })
        })
        const items =  _.map(data.Data.Items, (element) => {
          return {
            id: element.Id,
            text: element.Name,
            CategoryId: element.CategoryId
          }
        })
        const units =  _.map(data.Data.SubUnits, (element) => {
          return {
            id: element.Id,
            text: element.Name
          }
        })
        data.Data.ItemCategorys = [...category]
        data.Data.AttributeValueResponses = [...attribute]
        data.Data.Items = [...items]
        this.allItems = [...items]
        data.Data.SubUnits = [{ id: 0, text: 'Select Unit' }, ...units]
        return data
      }))
    .subscribe((response) => {
      this.masterData = { ...response.Data };
    })
  }

  ngOnInit() {
    this._commonService.fixTableHF('table_challan')
    this.getSalePurchaseUtilityItems();
  }

  searchItemButton(searchparam) {

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
  }

  
  getCatagoryDetail(data) {
    if (data.length > 0) {
      for (let i = 0; i < this.catLevel; i++) {
        this.categories[i].data = [{ id: '0', text: 'Select Category' }]
      }
      this.allCategories = [...data]
      let _self = this
      data.forEach(category => {
        _self.categories[category.LevelNo - 1].data.push({
          text: category.Name,
          id: category.Id
        })
      })
      for (let i = 0; i < this.catLevel; i++) {
        this.categories[i].data = Object.assign([], this.categories[i].data)
      }
      this.loading = false
    }
  }

  onCategoryChange = (event) => {
    let dummyArray = [];
    if(event.value.length > 0) {
      const value = [...event.value];
      this.model.selectedCategory = value.toString();
      _.forEach(event.value, (category) => {
       const data =  _.filter(this.allItems, {CategoryId : Number(category)});
       dummyArray = [...dummyArray, ...data];
      })
      this.masterData.Items = [...dummyArray];
    } else {
      this.model.selectedCategory = "";
    }
  }
  onItemChange = (event) => {
    if(event.value.length > 0) {
      const value = [...event.value];
      this.model.selectedItem = value.toString();
    } else {
      this.model.selectedItem = ""
    }
  }
  onAttributeChange = (event) => {
    if(event.value.length > 0) {
      const value = [...event.value];
      this.model.selectedAttribute = value.toString();
    } else {
      this.model.selectedAttribute = ""
    }
  }
  onUnitChange = (event) => {
    if(event.value.length > 0) {
      this.model.selectdUnit = [...event.value];
    } else {
      this.model.selectdUnit = ""
    }
  }

  search = () => {
    
    if (this.model.fromDatevalue) {
      this.model.formattedFromDatevalue = this._globalService.clientToSqlDateFormat(this.model.fromDatevalue, this.clientDateFormat)
      alert( this.model.formattedFromDatevalue)
    }
    

    if (this.model.toDateValue) {
      this.model.formattedToDateValue = this._globalService.clientToSqlDateFormat(this.model.toDateValue, this.clientDateFormat)
    }
    
    this.searchByFilter.emit(this.model);
  }

  resetValues() {
    this.model.selectedCategory = ""
    this.model.selectedItem = ""
    this.model.selectedAttribute = ""
    this.model.selectdUnit = ""
    this.model.formattedFromDatevalue = ""
    this.model.formattedToDateValue = ""
    this.model.categoryValue = []
    this.model.itemValue = []
    this.model.attributeValue = []
    this.model.unitValue = 0
    this.model.fromDatevalue = ""
    this.model.toDateValue = ""
   // this.statusTypeName=
  }

}
