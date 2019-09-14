import { Component, OnInit, ElementRef, ViewChild } from '@angular/core'
import { ItemModel } from '../../model/sales-tracker.model'
import { Subscription } from 'rxjs/Subscription'
import { Select2OptionData } from 'ng2-select2'
import { ItemmasterServices } from '../../commonServices/TransactionMaster/item-master.services'
import { ToastrCustomService } from '../../commonServices/toastr.service'
import { UIConstant } from '../../shared/constants/ui-constant'
import { ErrorConstant } from '../../shared/constants/error-constants'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
import { fromEvent } from 'rxjs'
import { map, filter, debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { FormGroup, FormBuilder } from '@angular/forms'
import { PagingComponent } from '../../shared/pagination/pagination.component'
declare const $: any
import { GlobalService } from '../../commonServices/global.service'
import { SetUpIds } from 'src/app/shared/constants/setupIds.constant'
import { Settings } from '../../shared/constants/settings.constant'

@Component({
  selector: 'app-discount-master',
  templateUrl: './discount-master.component.html',
  styleUrls: ['./discount-master.component.css']
})
export class DiscountMasterComponent implements OnInit {
  id: number
  itemDetail: ItemModel[]
  subscribe: Subscription
  searchForm: FormGroup
  p: number = 1
  itemsPerPage: number = 20
  total: number = 0
  lastItemIndex: number = 0
  isSearching: boolean = false
  public subCategoryType: Array<Select2OptionData>
  public selectUnitType: Array<Select2OptionData>
  public selectTax: Array<Select2OptionData>
  taxTypePlaceHolder: Select2Options
  subCategoryPlaceHolder: Select2Options
  unitTypePlaceHolder: Select2Options
  categoryPlaceHolder: Select2Options
  isTradeDiscountApply: number
  isVolumeDiscountApply: number
  isNotDiscountable: number
  newRouteSub: Subscription
  deleteSub: Subscription
  recordNotFoundMessage: string = ''
  dateFormate:string =''
  queryStr$: Subscription
  queryStr: string = ''
  @ViewChild('paging_comp') pagingComp: PagingComponent
  constructor (public _settings :Settings,
    public gs :GlobalService,
    private _itemmasterServices: ItemmasterServices,
    private commonService: CommonService,
    private toastrService: ToastrCustomService,
    private _formBuilder: FormBuilder) {
      this.dateFormate = this._settings.dateFormat
    this.deleteSub = this.commonService.getDeleteStatus().subscribe(
      (obj) => {
        if (obj.id && obj.type && obj.type === 'route') {
          this.deleteItem(obj.id)
        }
      }
    )

    this.newRouteSub = this.commonService.newRouteStatus().subscribe(
      (obj) => {
        this.id = UIConstant.ZERO
        this.itemDetail = []
       this.getDiscountList()
      }
    )
    this.queryStr$ = this._itemmasterServices.queryStr$.subscribe(
      (str) => {
        console.log(str)
        this.queryStr = str
        this.p = 1
       this.getDiscountList()
      }
    )
    this.formSearch()
  }

  @ViewChild('searchData') searchData: ElementRef
  private formSearch () {
    this.searchForm = this._formBuilder.group({
      'searckKey': [UIConstant.BLANK]
    })
  }

  ngOnDestroy () {
    this.newRouteSub.unsubscribe()
    this.queryStr$.unsubscribe()
    this.deleteSub.unsubscribe()
  }

  deleteItem (id) {
    if (id) {
      this.commonService.deleteDiscount(id).subscribe(Data => {
        if (Data.Code === UIConstant.DELETESUCCESS) {
          this.toastrService.showSuccess('', 'Deleted Successfully')
          this.commonService.closeDelete('')
          this.getDiscountList()
        }
        if (Data.Code === UIConstant.NORECORDFOUND) {
          this.toastrService.showInfo('Info', Data.Message)
          this.commonService.closeDelete('')

        }
      })
    }
  }
  clientDateFormat:any
  DiscountFor100Perct:any
  noOfDecimalPoint:any
  getSetUpModules(settings) {
    settings.forEach(element => {
      if (element.id === SetUpIds.dateFormat) {
        this.clientDateFormat = element.val[0].Val
      }
      if (element.id === SetUpIds.noOfDecimalPoint) {
        this.noOfDecimalPoint = +element.val
      }
      if (element.id === SetUpIds.DiscountFor100) {
        this.DiscountFor100Perct = +element.val
      }
    
    })
  
  }
  ngOnInit () {
    this.itemDetail = []
   this.getDiscountList()
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
          console.log('search data : ', data)
          setTimeout(() => {
            this.isSearching = false
          }, 100)
          this.itemDetail = data.Data
          this.total = this.itemDetail[0] ? this.itemDetail[0].TotalRows : 0
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

  editDiscount (id) {
    this.commonService.openDiscountMaster(id,false,{},[])

  }

  searchGetCall (term: string) {
    if (!term) {
      term = ''
    }
    this.pagingComp.setPage(1)
    return this.commonService.getDiscountList('?Strsearch=' + term + '&Page=' + this.p + '&Size=' + this.itemsPerPage + this.queryStr)
  }

  getDiscountList () {
    this.isSearching = true
    if (!this.searchForm.value.searckKey) {
      this.searchForm.value.searckKey = ''
    }
    this.commonService.getDiscountList('type=Discount' +'&Strsearch=' + this.searchForm.value.searckKey + '&Page=' + this.p + '&Size=' + this.itemsPerPage + this.queryStr).subscribe(Data => {
      setTimeout(() => {
        this.isSearching = false
      }, 100)
      if (Data.Code === UIConstant.THOUSAND && Data.Data) {
        this.itemDetail = Data.Data
        this.total = this.itemDetail[0] ? this.itemDetail[0].TotalRows : 0
      } else {
        this.recordNotFoundMessage = ErrorConstant.RECORD_NOT_FOUND_TABLE
      }
    })
  }

  openSearch = false
  toggleSearch () {
    this.openSearch = !this.openSearch
  }
  addRoutinPopup () {
    this.commonService.openDiscountMaster('',false,{},[])
  }

  deleteRoute (id) {
    this.commonService.openDelete(id, 'route', 'Route')
  }

}
