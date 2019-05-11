import { Component, OnInit } from '@angular/core'
import { UIConstant } from '../constants/ui-constant'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
import { SetUpIds } from '../constants/setupIds.constant'
import { CategoryServices } from 'src/app/commonServices/TransactionMaster/category.services'
import { Select2OptionData } from 'ng2-select2'

@Component({
  selector: 'category-add-custom',
  templateUrl: './dynamic-category-add.component.html'
})
export class DynamicCategoryAddComponent implements OnInit {
  catLevel: number = 1
  loading: boolean = true
  categories: Array<{ placeholder: string, value: string, data: Array<Select2OptionData>, level: number }> = []
  constructor (private commonService: CommonService, private categoryService: CategoryServices) {
    this.getCatLevel()
  }

  ngOnInit () {
    //
  }

  getCatLevel () {
    let _self = this
    this.commonService.getSettingById(SetUpIds.catLevel).subscribe(
      (data) => {
        if (data.Code === UIConstant.THOUSAND) {
          const setUpSettings = data.Data.SetupClients
          _self.catLevel = +setUpSettings[0].Val
          console.log('setting catl level : ', _self.catLevel)
          _self.createModels(_self.catLevel)
          _self.getCatagoryDetail()
        }
      }
    )
  }

  createModels (levels) {
    this.categories = []
    let obj = { placeholder: 'Select Category',
      value: 'category',
      data: [{ id: '0', text: 'Select Category' }],
      level: 1
    }
    this.categories.push({ ...obj })
    if (this.catLevel > 1) {
      for (let i = 0; i < levels - 1; i++) {
        obj['value'] = 'sub' + this.categories[this.categories.length - 1].value
        obj['level'] = this.categories[this.categories.length - 1].level + 1
        obj['data'] = []
        this.categories.push({ ...obj })
      }
    }
    console.log('categories : ', this.categories)
  }

  getCatagoryDetail () {
    let _self = this
    this.categoryService.GetCatagoryDetail('').subscribe(
      data => {
        console.log('category data : ', data)
        if (data.Code === UIConstant.THOUSAND && data.Data.length > 0) {
          data.Data.forEach(category => {
            _self.categories[category.LevelNo - 1].data.push({
              text: category.Name,
              id: category.Id
            })
          })
        }
        console.log('dynamic categories : ', _self.categories)
        _self.loading = false
      }
    )
  }

  selectCategory (evt, levelNo) {
    console.log('evt on change of category : ', evt)
  }

}
