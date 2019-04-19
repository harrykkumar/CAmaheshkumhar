import { Component, OnInit, ViewChild } from '@angular/core'
import { FormGroup, FormBuilder } from '@angular/forms'
import { CatagoryDetailModel } from '../../model/sales-tracker.model'
import { Subscription } from 'rxjs/Subscription'
import { Select2OptionData } from 'ng2-select2'
import { CategoryServices } from '../../commonServices/TransactionMaster/category.services'
import { ToastrCustomService } from '../../commonServices/toastr.service'
import { UIConstant } from '../../shared/constants/ui-constant'
import { CommonService } from '../../commonServices/commanmaster/common.services'

declare const $: any
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  parentId: number
  private Id: number
  deletedId: number
  searchForm: FormGroup
  categoryForm: FormGroup
  subscribe: Subscription
  submitClick: boolean
  categoryDetail: CatagoryDetailModel[]
  catagoriesPlaceHolder: Select2Options
  public selectCategory: Array<Select2OptionData>
  newCatSub: Subscription
  deleteSub: Subscription
  @ViewChild('open_add_form') myModal
  constructor (private _catagoryservices: CategoryServices,
    private _formBuilder: FormBuilder,
    private commonService: CommonService,
    private toastrService: ToastrCustomService
    ) {
    this.newCatSub = this.commonService.newCatStatus().subscribe(
      (obj) => {
        this.Id = UIConstant.ZERO
        this.parentId = UIConstant.ZERO
        this.categoryDetail = []
        this.getCategoryDetails()
      }
    )
    this.deleteSub = this.commonService.getDeleteStatus().subscribe(
      (obj) => {
        if (obj.id && obj.type && obj.type === 'category') {
          this.deleteItem(obj.id)
        }
      }
    )
    this.formSearch()
  }

  deleteItem (id) {
    if (id) {
      this._catagoryservices.deleteCatagory(id).subscribe(Data => {
        if (Data.Code === UIConstant.DELETESUCCESS) {
          this.toastrService.showSuccess('Sucess', 'Deleted Successfully')
          this.commonService.closeDelete('')
          this.getCategoryDetails()
        }
        if (Data.Code === UIConstant.CANNOTDELETERECORD) {
          this.toastrService.showInfo('Info', 'Can not deleted !')
          this.commonService.closeDelete('')
        }
      })
    }
  }

  private formSearch () {
    this.searchForm = this._formBuilder.group({
      'searckKey': [UIConstant.BLANK]
    })
  }

  ngOnInit () {
    this.Id = UIConstant.ZERO
    this.parentId = UIConstant.ZERO
    this.categoryDetail = []
    this.getCategoryDetails()
    this.getCategoryAllData()
  }

  ngOnDestroy () {
    this.newCatSub.unsubscribe()
  }

  getCategoryAllData () {
    this._catagoryservices.castArray.subscribe(categoryDetail => this.categoryDetail = categoryDetail)
  }

  getCategoryDetails () {
    this._catagoryservices.GetCatagoryDetail(UIConstant.BLANK).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        this.categoryDetail = data.Data
      }
    })
  }

  editCatagory (id) {
    this.commonService.openCategory(id, '2')
  }

  deleteCatagory (id) {
    this.commonService.openDelete(id, 'category')
  }

  addCatagory () {
    this.commonService.openCategory('', '2')
  }

  searchingCategory () {
    if (this.searchForm.value.searckKey.length > UIConstant.THREE) {
      this.subscribe = this._catagoryservices.GetCatagoryDetail(this.searchForm.value.searckKey).subscribe(Data => {
        this.categoryDetail = Data.Data
      })
    } else if (this.searchForm.value.searckKey.length === UIConstant.ZERO) {
      this.subscribe = this._catagoryservices.GetCatagoryDetail(this.searchForm.value.searckKey).subscribe(Data => {
        this.categoryDetail = Data.Data
      })
    }
  }
}
