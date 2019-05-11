import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core'
import { Subscription, fromEvent } from 'rxjs'
import { UnitModel } from '../../model/sales-tracker.model'
import { CompositeUnitService } from '../../commonServices/TransactionMaster/composite-unit.services'
import { UIConstant } from '../../shared/constants/ui-constant'
import { ToastrCustomService } from '../../commonServices/toastr.service'
import { CommonService } from '../../commonServices/commanmaster/common.services'
import { map, filter, debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { FormGroup, FormBuilder } from '@angular/forms'
import { PagingComponent } from '../../shared/pagination/pagination.component'

declare const $: any
declare const _: any
@Component({
  selector: 'app-composite-unit',
  templateUrl: './composite-unit.component.html',
  styleUrls: ['./composite-unit.component.css']
})
export class CompositeUnitComponent implements OnInit, OnDestroy {
  subUnitDetail: UnitModel[]
  deleteSub: Subscription
  compositeUnitAddSub: Subscription
  p: number = 1
  itemsPerPage: number = 20
  total: number = 0
  lastItemIndex: number = 0
  searchForm: FormGroup
  isSearching: boolean = false
  @ViewChild('paging_comp') pagingComp: PagingComponent
  constructor (private _compositeUnitserivices: CompositeUnitService,
    private commonService: CommonService,
    private toastrService: ToastrCustomService,
    private _formBuilder: FormBuilder) {
    this.formSearch()
    this.deleteSub = this.commonService.getDeleteStatus().subscribe(
      (obj) => {
        if (obj.id && obj.type && obj.type === 'composite') {
          this.deleteItem(obj.id)
        }
      }
    )

    this.compositeUnitAddSub = this.commonService.getNewCompositeAddedStatus().subscribe(
      (obj) => {
        this.getCompositeDetail()
      }
    )
  }

  deleteItem (id) {
    if (id) {
      this._compositeUnitserivices.delteSubUnit(id).subscribe(Data => {
        if (Data.Code === UIConstant.DELETESUCCESS) {
          this.toastrService.showSuccess('Sucess', 'Deleted Successfully')
          this.commonService.closeDelete('')
          this.getCompositeDetail()
        }
        if (Data.Code === UIConstant.CANNOTDELETERECORD) {
          this.toastrService.showInfo('Info', 'Can not deleted data')
        }
      })
    }
  }

  addCompositeUnit () {
    this.commonService.openCompositeUnit('')
  }

  searchSubUnit: any
  @ViewChild('searchData') searchData: ElementRef
  ngOnInit () {
    this.getCompositeDetail()
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
          this.subUnitDetail = data.Data
          this.total = this.subUnitDetail[0] ? this.subUnitDetail[0].TotalRows : 0
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
    return this._compositeUnitserivices.getSubUnitDetails('?WithOutUnit=1' + '&Name=' + term + '&Page=' + this.p + '&Size=' + this.itemsPerPage)
  }

  private formSearch () {
    this.searchForm = this._formBuilder.group({
      'searckKey': [UIConstant.BLANK]
    })
  }

  getCompositeDetail () {
    if (!this.searchForm.value.searckKey) {
      this.searchForm.value.searckKey = ''
    }
    this._compositeUnitserivices.getSubUnitDetails('?WithOutUnit=1&Name=' + this.searchForm.value.searckKey + '&Page=' + this.p + '&Size=' + this.itemsPerPage).pipe(
      filter(data => data.Code),
      map(data => data.Data),
      map(data => {
        console.log('old data : ', data)
        let newData = data.filter(element => element.PrimaryUnitId !== element.SecondaryUnitId)
        return newData
      }))
      .subscribe(data => {
        this.subUnitDetail = data
        this.total = this.subUnitDetail[0] ? this.subUnitDetail[0].TotalRows : 0
        console.log('composite unit : ', this.subUnitDetail)
      }
    )
  }

  editSubUnit (id) {
    this.commonService.openCompositeUnit(id)
  }
  deleteSubUnit (id) {
    this.commonService.openDelete(id, 'composite')
  }

  ngOnDestroy () {
    this.compositeUnitAddSub.unsubscribe()
  }
}
