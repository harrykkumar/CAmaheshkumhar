import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { FormGroup, FormBuilder } from '@angular/forms'
import { CatagoryDetailModel } from '../../model/sales-tracker.model'
import { Subscription } from 'rxjs/Subscription'
import { Select2OptionData, Select2Component } from 'ng2-select2'
import { CategoryServices } from '../../commonServices/TransactionMaster/category.services'
import { ToastrCustomService } from '../../commonServices/toastr.service'
import { UIConstant } from '../../shared/constants/ui-constant'
import { CommonService } from '../../commonServices/commanmaster/common.services'
import { fromEvent } from 'rxjs'
import { map, filter, debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { PagingComponent } from '../../shared/pagination/pagination.component'
import { Settings } from '../../shared/constants/settings.constant'
import { SetUpIds } from '../../shared/constants/setupIds.constant';
declare const $: any
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  parentId: number
  Id: number
  deletedId: number
  categoryForm: FormGroup
  subscribe: Subscription
  submitClick: boolean
  categoryDetail: CatagoryDetailModel[]
  catagoriesPlaceHolder: Select2Options
  public selectCategory: Array<Select2OptionData>
  newCatSub: Subscription
  deleteSub: Subscription
  searchForm: FormGroup
  p: number = 1
  itemsPerPage: number = 20
  total: number = 0
  lastItemIndex: number = 0
  catLevel: number = 0
  categoryLevels: Array<Select2OptionData> = []
  categoryPlaceholder: Select2Options
  LevelNo: number = 0
  @ViewChild('open_add_form') myModal
  @ViewChild('searchData') searchData: ElementRef
  isSearching: boolean = false
  @ViewChild('paging_comp') pagingComp: PagingComponent
  constructor (private _catagoryservices: CategoryServices,
    private _formBuilder: FormBuilder,
    private commonService: CommonService,
    private toastrService: ToastrCustomService,
    private settings: Settings
    ) {
    this.getCatLevel()
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
    this.newCatSub = this.commonService.getCatImportAddStatus.subscribe(() => {
      this.getCategoryDetails()
    })
    this.formSearch()
  }

  openImport() {
    this.commonService.openCatImport()
  }

  getCatLevel () {
    let settings = JSON.parse(this.settings.moduleSettings).settings
    settings.forEach(element => {
      if (element.id === SetUpIds.catLevel) {
        this.catLevel = +element.val
        if (this.catLevel > 1) {
          this.createLevels()
        }
      }
    })
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
          this.toastrService.showInfo('', Data.Description)
          this.commonService.closeDelete('')
        }
      })
    }
  }

  @ViewChild('catlevel_select2') catlevelSelect2: Select2Component
  catLevelValue: number = 0
  createLevels () {
    if (this.catlevelSelect2) {
      this.catlevelSelect2.setElementValue(0)
    }
    this.catLevelValue = 0
    this.categoryPlaceholder = { placeholder: 'Filter on category level' }
    this.categoryLevels.push({
      id: '0',
      text: 'Select Category Level'
    })
    this.categoryLevels.push({
      id: '1',
      text: '1 - Main'
    })
    for (let i = 2; i <= this.catLevel; i++) {
      this.categoryLevels.push({
        id: '' + i,
        text: '' + i + ' - Child'
      })
    }
  }

  private formSearch () {
    this.searchForm = this._formBuilder.group({
      'searckKey': [UIConstant.BLANK]
    })
  }

  selectCatLevel (evt) {
    if (evt.value && evt.data.length > 0) {
      this.LevelNo = +evt.value
      this.getCategoryDetails()
    }
  }

  ngOnInit () {
    this.Id = UIConstant.ZERO
    this.parentId = UIConstant.ZERO
    this.categoryDetail = []
    this.getCategoryDetails()
    this.commonService.fixTableHF('cat-table')
    fromEvent(this.searchData.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value
      }),
      filter(res => res.length > 1 || res.length === 0),
      debounceTime(1000),
      distinctUntilChanged()
      ).subscribe((text: string) => {
        this.isSearching = true
        this.searchGetCall(text).subscribe((data) => {
          setTimeout(() => {
            this.isSearching = false
          }, 100)
          this.categoryDetail = data.Data
          this.total = this.categoryDetail[0] ? this.categoryDetail[0].TotalRows : 0
          // console.log('categories : ', this.categoryDetail)
        },(err) => {
          setTimeout(() => {
            this.isSearching = false
          }, 100)
          console.log('error',err)
        },
        () => {
          setTimeout(() => {
            this.isSearching = false
          }, 100)
        })
      })
  }

  searchGetCall (term: string) {
    if (!term) {
      term = ''
    }
    this.pagingComp.setPage(1)
    return this._catagoryservices.GetCatagoryDetail('?Name=' + term + '&Page=' + this.p + '&Size=' + this.itemsPerPage + '&LevelNo=' + this.LevelNo)
  }

  ngOnDestroy () {
    this.newCatSub.unsubscribe()
    this.deleteSub.unsubscribe()
  }

  getCategoryDetails () {
    if (!this.searchForm.value.searckKey) {
      this.searchForm.value.searckKey = ''
    }
    this.isSearching = true
    this._catagoryservices.GetCatagoryDetail('?Name=' + this.searchForm.value.searckKey + '&Page=' + this.p + '&Size=' + this.itemsPerPage + '&LevelNo=' + this.LevelNo).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        this.categoryDetail = data.Data
        this.total = this.categoryDetail[0] ? this.categoryDetail[0].TotalRows : 0
        // console.log('categories : ', this.categoryDetail)
        setTimeout(() => {
          this.isSearching = false
        }, 100)
      } else {
        this.toastrService.showError(data.Description, '')
        setTimeout(() => {
          this.isSearching = false
        }, 100)
      }
    })
  }

  editCatagory (id) {
    this.commonService.openCategory(id, '2')
  }

  deleteCatagory (id) {
    this.commonService.openDelete(id, 'category', 'Category')
  }

  addCatagory () {
    this.commonService.openCategory('', '2')
  }
}
