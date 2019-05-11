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
declare const $: any
@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css']
})
export class RouteComponent implements OnInit {
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
  constructor (private _itemmasterServices: ItemmasterServices,
    private commonService: CommonService,
    private toastrService: ToastrCustomService,
    private _formBuilder: FormBuilder) {
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
        this.getItemMasterDetail()
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
  }

  deleteItem (id) {
    if (id) {
      this._itemmasterServices.deleteItem(id).subscribe(Data => {
        if (Data.Code === UIConstant.DELETESUCCESS) {
          console.log(Data,'deleted route')
          this.toastrService.showSuccess('Sucess', 'Deleted Successfully')
          this.commonService.closeDelete('')
          this.getItemMasterDetail()
        }
        if (Data.Code === UIConstant.NORECORDFOUND) {
          this.toastrService.showInfo('Info', Data.Message)
          this.commonService.closeDelete('')

        }
      })
    }
  }

  ngOnInit () {
    this.itemDetail = []
    this.getItemMasterDetail()
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

  editRoute (id) {
    this.commonService.openRouting(id)
  }

  searchGetCall (term: string) {
    if (term !== '') {
      this.p = 1
      return this._itemmasterServices.getItemMasterDetail('?Strsearch=' + term + '&Page=' + this.p + '&Size=' + this.itemsPerPage)
    } else {
      return this._itemmasterServices.getItemMasterDetail('?Page=' + this.p + '&Size=' + this.itemsPerPage)
    }
  }

  getItemMasterDetail () {
    this.subscribe = this._itemmasterServices.getItemMasterDetail('?Strsearch=' + this.searchForm.value.searckKey + '&Page=' + this.p + '&Size=' + this.itemsPerPage).subscribe(Data => {
      console.log('route data : ', Data)
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
    this.commonService.openRouting('')
  }

  deleteRoute (id) {
    this.commonService.openDelete(id, 'route')
  }

}
