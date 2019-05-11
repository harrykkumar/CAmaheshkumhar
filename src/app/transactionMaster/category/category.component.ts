import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { FormGroup, FormBuilder } from '@angular/forms'
import { CatagoryDetailModel } from '../../model/sales-tracker.model'
import { Subscription } from 'rxjs/Subscription'
import { Select2OptionData } from 'ng2-select2'
import { CategoryServices } from '../../commonServices/TransactionMaster/category.services'
import { ToastrCustomService } from '../../commonServices/toastr.service'
import { UIConstant } from '../../shared/constants/ui-constant'
import { CommonService } from '../../commonServices/commanmaster/common.services'
import { fromEvent } from 'rxjs'
import { map, filter, debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { PagingComponent } from '../../shared/pagination/pagination.component'

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
  @ViewChild('open_add_form') myModal
  @ViewChild('searchData') searchData: ElementRef
  isSearching: boolean = false
  @ViewChild('paging_comp') pagingComp: PagingComponent
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
    this.commonService.fixTableHF('cat-table')
    fromEvent(this.searchData.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value
      }),
      filter(res => res.length > 3 || res.length === 0),
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
    return this._catagoryservices.GetCatagoryDetail('?Name=' + term + '&Page=' + this.p + '&Size=' + this.itemsPerPage)
  }

  ngOnDestroy () {
    this.newCatSub.unsubscribe()
  }

  getCategoryDetails () {
    if (!this.searchForm.value.searckKey) {
      this.searchForm.value.searckKey = ''
    }
    this._catagoryservices.GetCatagoryDetail('?Name=' + this.searchForm.value.searckKey + '&Page=' + this.p + '&Size=' + this.itemsPerPage).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        this.categoryDetail = data.Data
        this.total = this.categoryDetail[0] ? this.categoryDetail[0].TotalRows : 0
        // console.log('categories : ', this.categoryDetail)
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

  // searchingCategory () {
  //   if (this.searchForm.value.searckKey.length > UIConstant.THREE) {
  //     this.subscribe = this._catagoryservices.GetCatagoryDetail(this.searchForm.value.searckKey, '').subscribe(Data => {
  //       this.categoryDetail = Data.Data
  //     })
  //   } else if (this.searchForm.value.searckKey.length === UIConstant.ZERO) {
  //     this.subscribe = this._catagoryservices.GetCatagoryDetail(this.searchForm.value.searckKey).subscribe(Data => {
  //       this.categoryDetail = Data.Data
  //     })
  //   }
  // }
}
