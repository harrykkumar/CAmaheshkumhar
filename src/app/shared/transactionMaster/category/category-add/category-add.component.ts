import { Component, ViewChild, Renderer2, ElementRef } from '@angular/core'
import { Validators, FormGroup, FormBuilder } from '@angular/forms'
import { UIConstant } from '../../../constants/ui-constant'
import { SaveCategoryModel, ResponseCategory, CatagoryDetailModel, AddCust } from '../../../../model/sales-tracker.model'
import { Subscription } from 'rxjs/Subscription'
import { Select2OptionData, Select2Component } from 'ng2-select2'
import { CategoryServices } from '../../../../commonServices/TransactionMaster/category.services'
import { ToastrCustomService } from '../../../../commonServices/toastr.service'
import { ItemmasterServices } from 'src/app/commonServices/TransactionMaster/item-master.services'
import { CommonService } from '../../../../commonServices/commanmaster/common.services'
import { Settings } from '../../../constants/settings.constant';
import { SetUpIds } from '../../../constants/setupIds.constant';
declare var $: any
@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.css']
})
export class CategoryAddComponent {
  parentId: number
  private Id: any
  deletedId: number
  searchForm: FormGroup
  categoryForm: FormGroup
  subscribe: Subscription
  submitClick: boolean
  categoryDetail: CatagoryDetailModel[]
  catagoriesPlaceHolder: Select2Options
  modalSub: Subscription
  categoryValue: any
  editMode: boolean = false
  addForItem: boolean = false
  toEmitName: string = ''
  catLevel: number = 1
  catDetails: any = []
  loading: boolean = true
  catOrSubCatSub: Subscription
  keepOpen: boolean
  editID:any
  public selectCategory: Array<Select2OptionData>

  constructor (private _catagoryservices: CategoryServices,
    private _formBuilder: FormBuilder,
    private commonService: CommonService,
    private toastrService: ToastrCustomService,
    private itemService: ItemmasterServices,
    private settings: Settings,
    private renderer: Renderer2) {
    this.formCategory()
    this.modalSub = this.commonService.getCategoryStatus().subscribe(
      (data: AddCust) => {
        if (data.open) {
          if (+data.type === 1) {
            this.addForItem = true
          } else {
            this.addForItem = false
            if (data.editId === '') {
              this.editID =0
              this.editMode = false
            } else {
              this.editMode = true
              this.Id = data.editId
              this.editID= data.editId
            }
          }
          this.getCategoryList()
          this.getCatLevel()
          this.openModal()
        } else {
          this.closeModal()
        }
      }
    )

    this.catOrSubCatSub = this.commonService.getNewCatOrSubCatStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.selectCategory)
          newData.push({ id: data.id, text: data.name })
          this.selectCategory = newData
          this.categoryValue = data.id
        }
      }
    )
  }

  getCategoryList () {
    this.catagoriesPlaceHolder = { placeholder: 'Select Category' }
    let newData = [{ id: '0', text: 'Select Category' }]
    this.itemService.getAllSubCategories(2).subscribe(data => {
      // console.log('on cat addd : ', data)
      if (data.Code === UIConstant.THOUSAND && data.Data.length > 0) {
        this.catDetails = data.Data
        data.Data.forEach(element => {
          newData.push({
            id: element.Id,
            text: element.Name
          })
        })
        this.selectCategory = Object.assign([], newData)
        // console.log('available categories : ', this.selectCategory)
      }
    },
    (error) => {
      console.log(error)
    },
    () => {
      this.loading = false
    })
  }

  ngOnDestroy () {
    this.modalSub.unsubscribe()
    this.catOrSubCatSub.unsubscribe()
  }
  ngOnInit () {
    this.submitClick = false
  }

  get f () {
    // console.log(this.categoryForm.controls)
    return this.categoryForm.controls
  }

  select2PopuValue = false
  openModal () {
    this.submitClick = false
    if (this.catSelect2) {
      this.catSelect2.setElementValue('')
    }
    if (this.editMode) {
      this.getEditDetailData(this.Id)
    } else {
      this.parentId = UIConstant.ZERO
      this.Id = UIConstant.ZERO
      $('#category_master').modal(UIConstant.MODEL_SHOW)
      setTimeout(() => {
        if (this.catname) {
          const element = this.renderer.selectRootElement(this.catname.nativeElement, true)
          element.focus({ preventScroll: false })
        }
      }, 1000)
    }
  }

  closeModal () {
    if ($('#category_master').length > 0) {
      this.Id = UIConstant.ZERO
      $('#category_master').modal(UIConstant.MODEL_HIDE)
    }
  }

  @ViewChild('cat_select2') catSelect2: Select2Component
  @ViewChild('catname') catname: ElementRef
  formValue: ResponseCategory = {}
  getEditDetailData (id) {
    let _self = this
    this._catagoryservices.GetCatagory(id).subscribe(data => {
      // console.log('category : ', data)
      if (data.Code === UIConstant.THOUSAND && data.Data.length > 0) {
        this.categoryForm.controls.CategoryName.setValue(data.Data[0].Name)
        this.categoryForm.controls.ShortName.setValue(data.Data[0].ShortName)
        this.categoryForm.controls.CategoryName.markAsDirty()
        setTimeout(() => {
          // console.log('_self.catSelect2 : ', _self.catSelect2)
          if (_self.catSelect2) {
            _self.catSelect2.setElementValue(data.Data[0].ParentId)
          }
          this.parentId = data.Data[0].ParentId
          // console.log('parent id : ', this.parentId)
          if (this.catname) {
            const element = this.renderer.selectRootElement(this.catname.nativeElement, true)
            element.focus({ preventScroll: false })
          }
        }, 1000)
        $('#category_master').modal(UIConstant.MODEL_SHOW)
      }
    })
  }

  private formCategory () {
    this.categoryForm = this._formBuilder.group({
      'CategoryName': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      'ShortName': [''],
      'level': [0]
    })
  }

  selectedCategory (event) {
    console.log('on select of category : ', event)
    if (event.value && event.data.length > 0) {
      if (+event.value > 0) {
        this.parentId = +event.value
        for (let i = 0; i < this.catDetails.length; i++) {
          if (+this.catDetails[i].Id === this.parentId) {
            this.toEmitName = this.catDetails[i].Name
            this.categoryForm.controls.level.setValue(+this.catDetails[i].LevelNo)
          }
        }
      }
    }
  }

  saveAndUpdateCategory () {
    this.submitClick = true
    let _self = this
    if (this.categoryForm.valid) {
      this._catagoryservices.saveAndUpdateCategory(this.CategoryParams()).subscribe(data => {
        console.log('added category: ', data)
        if (data.Code === UIConstant.THOUSAND && data.Data) {
          if (this.addForItem) {
            if (!this.toEmitName) {
              this.toEmitName = this.categoryForm.value.CategoryName
            } else {
              this.toEmitName += ' >> ' + this.categoryForm.value.CategoryName
            }
            console.log('to emit name : ', this.toEmitName)
            if (this.categoryForm.value.level < this.catLevel) {
              let toSend = { name: _self.toEmitName, id: data.Data }
              this.commonService.onCatOrSubCatAdded(toSend)
              this.categoryForm.controls.level.setValue(this.categoryForm.value.level + 1)
              this.categoryForm.controls.CategoryName.setValue('')
              this.categoryForm.controls.ShortName.setValue('')
              setTimeout(() => {
                if (this.catname) {
                  const element = this.renderer.selectRootElement(this.catname.nativeElement, true)
                  element.focus({ preventScroll: false })
                }
              }, 500)
            }
            if (this.categoryForm.value.level === this.catLevel) {
              _self.commonService.categoryAdded()
              let toSend = { name: _self.toEmitName, id: data.Data }
              _self.clearCategoryvalidation()
              _self.commonService.closeCategory(toSend)
            }
          } else {
            if (this.keepOpen) {
              _self.toastrService.showSuccess('',UIConstant.SAVED_SUCCESSFULLY)
              let toSend = { name: _self.categoryForm.value.CategoryName, id: data.Data,
                level: _self.categoryForm.value.level + 1 }
              // this.commonService.closeCategory(toSend)

              this.getCategoryList()
              this.initialiseExtras()
              
              _self.commonService.categoryAdded()
            } else {
              let namesave = this.editID ===0 ?UIConstant.SAVED_SUCCESSFULLY : UIConstant.UPDATE_SUCCESSFULLY
              _self.commonService.categoryAdded()
              _self.toastrService.showSuccess('',namesave)
              this.getCategoryList()
              setTimeout(() => {
                if (this.catname) {
                  const element = this.renderer.selectRootElement(this.catname.nativeElement, true)
                  element.focus({ preventScroll: false })
                }
              }, 500)
              // this.commonService.closeCategory(toSend)
              _self.initData()
            }
          }
        } else if (data.Code === UIConstant.THOUSANDONE) {
          this.toastrService.showError(data.Description, '')
        } else {
          _self.toastrService.showError('', data.Description)
        }
      })
    } else {
      this.toastrService.showError('', 'Form is Invalid')
    }
  }

  private CategoryParams (): SaveCategoryModel {
    const categoryElement = {
      categoryObj: {
        ParentId: this.parentId > 0 ? this.parentId : 0,
        CategoryName: this.categoryForm.value.CategoryName.trim(),
        Id: this.Id ? this.Id : 0,
        ShortName: this.categoryForm.value.ShortName
      } as SaveCategoryModel
    }
    console.log('CategoryParams : ', JSON.stringify(categoryElement.categoryObj))
    return categoryElement.categoryObj
  }
initData (){
  this.categoryForm.reset()
  this.toEmitName = ''
  this.submitClick = false
  this.selectCategory = []
}
  clearCategoryvalidation () {
    this.initData()
    this.commonService.closeCategory('')
  }

  getCatLevel () {
    let settings = JSON.parse(this.settings.moduleSettings).settings
    settings.forEach(element => {
      if (element.id === SetUpIds.catLevel) {
        this.catLevel = +element.val
      }
    })
  }

  initialiseExtras () {
    this.categoryForm.controls.ShortName.setValue('')
    this.categoryForm.controls.CategoryName.setValue('')
    setTimeout(() => {
      if (this.catname) {
        const element = this.renderer.selectRootElement(this.catname.nativeElement, true)
        element.focus({ preventScroll: false })
      }
    }, 10)
  }
}
