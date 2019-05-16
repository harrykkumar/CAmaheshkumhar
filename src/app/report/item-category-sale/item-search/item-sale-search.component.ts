import { Component, Input, OnInit } from '@angular/core'
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
@Component({
  selector: 'app-item-sale-search',
  templateUrl: './item-sale-search.component.html',
  styleUrls: ['./item-sale-search.component.css']
})
export class ItemSaleSearchComponent implements OnInit {
  @Input() toShow: boolean = false
  clientDateFormat: any
  subscribe: Subscription
  constructor (public _globalService: GlobalService,
    public _settings: Settings,public _commonService: CommonService, public _toastrCustomService: ToastrCustomService) {
    this.clientDateFormat = this._settings.dateFormat
    this.toDate()
    this.fromDate()
  }
  fromDate () {
    let _self = this
    jQuery(function ($) {
      flatpickr('#from-date', {
        dateFormat: _self.clientDateFormat,
        defaultDate: [_self._globalService.getDefaultDate(_self.clientDateFormat)]
      })
    })
    this.fromDatevalue = _self._globalService.getDefaultDate(_self.clientDateFormat)

  }
  fromDatevalue: string
  toDateValue: string
  toDate () {
    let _self = this
    jQuery(function ($) {
      flatpickr('#to-date', {
        dateFormat: _self.clientDateFormat,
        defaultDate: [_self._globalService.getDefaultDate(_self.clientDateFormat)]
      })
    })
    this.toDateValue = _self._globalService.getDefaultDate(_self.clientDateFormat)

  }
  ngOnInit () {
    $(document).ready(function () {
      $('.table_challan').tableHeadFixer({
        head: true,
        foot: true
      })
    })
    // this.getSaleChallanDetail()
  }
  searchdataList: any
  // tslint:disable-next-line: no-empty
  searchItemButton (searchparam) {
    // tslint:disable-next-line:no-multi-spaces

  //  this.sub this._commonService.getSearchItemStock(searchparam).subscribe(data =>{

  //   })
    // this._commonService.getSearchItemStock(searchparam).subscribe(data =>  {
    //   if (data.Code === UIConstant.THOUSAND && data.Data.length > 0) {
    //     this.searchdataList = data.Data

    //   }
    // })
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
    if (data.length > 0) {
      // console.log('category data : ', data)
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

  // onSelectCategory(evt, levelNo) {
  //   if (+evt.value > 0) {
  //     if (levelNo === this.catLevel) {
  //       if (this.categoryId !== +evt.value) {
  //         this.categoryId = +evt.value
  //         this.categoryName = evt.data[0].text
  //         console.log('categoryname : ', this.categoryName)
  //         console.log('category id : ', this.categoryId)
  //         this.getItemByCategoryid(this.categoryId);

  //         //this.validateItem()
  //         this.updateCategories(+evt.value)
  //       }
  //     } else {
  //       if (levelNo < this.catLevel) {
  //         let categoryId = +evt.value
  //         let newData = []
  //         this.categories[levelNo].data = [{ id: '0', text: 'Select Category' }]
  //         this.allCategories.forEach(category => {
  //           if (category.LevelNo !== levelNo && category.LevelNo > levelNo) {
  //             if (category.ParentId === categoryId) {
  //               newData.push({
  //                 text: category.Name,
  //                 id: category.Id
  //               })
  //             }
  //           } else {
  //             this.categories[category.LevelNo - 1].data.push({
  //               text: category.Name,
  //               id: category.Id
  //             })
  //           }
  //         })
  //         this.categories[levelNo].data = Object.assign([], newData)
  //         this.loading = false
  //       }
  //     }
  //   } else if (+evt.value === 0) {
  //     this.getCatagoryDetail(this.allCategories)
  //   }
  // }
  // categoryId: any
  // parentMostCategory: any
  // @ViewChildren('cat_select2') catSelect2: QueryList<Select2Component>

  // updateCategories(childmostId) {
  //   let categoryId = childmostId
  //   this.getParentMostCat(childmostId, this.catLevel)
  //   categoryId = this.parentMostCategory
  //   if (+this.categoryId !== +childmostId || this.editItemId !== -1) {
  //     this.categoryId = +childmostId
  //     this.catSelect2.forEach((item: Select2Component, index: number, array: Select2Component[]) => {
  //       if (index === 0) {
  //         item.setElementValue(categoryId)
  //       } else if (index === (this.catLevel - 1)) {
  //         item.setElementValue(+childmostId)
  //       }
  //     })
  //     let evt = { value: categoryId, data: [{ text: '' }] }
  //     this.onSelectCategory(evt, 1)
  //   }
  // }
  // getParentMostCat(id, level) {
  //   let parentMostCategory = 0
  //   while (level !== 0) {
  //     this.allCategories.forEach(category => {
  //       if (id === category.Id) {
  //         parentMostCategory = category.Id
  //         id = category.ParentId
  //         level--
  //       }
  //     })
  //   }
  //   this.parentMostCategory = parentMostCategory
  // }

}
