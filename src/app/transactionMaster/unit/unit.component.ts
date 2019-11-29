import { LoginService } from 'src/app/commonServices/login/login.services';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core'
import { Subscription, fromEvent } from 'rxjs'
import { UnitMasterServices } from '../../commonServices/TransactionMaster/unit-mater.services'
import { UIConstant } from '../../shared/constants/ui-constant'
import { UnitModel } from 'src/app/model/sales-tracker.model'
import { ToastrCustomService } from '../../commonServices/toastr.service'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
import { FormGroup, FormBuilder } from '@angular/forms'
import { map, filter, debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { PagingComponent } from '../../shared/pagination/pagination.component'
@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css']
})
export class UnitComponent implements OnInit, OnDestroy {
  unitDetail: UnitModel[]
  newUnitSub: Subscription
  deleteSub: Subscription
  searchForm: FormGroup
  p: number = 1
  itemsPerPage: number = 20
  total: number = 0
  lastItemIndex: number = 0
  isSearching: boolean = false
  @ViewChild('paging_comp') pagingComp: PagingComponent
  menuData: any;
  constructor (private _unitmasterServices: UnitMasterServices,
    private commonService: CommonService,
    private toastrService: ToastrCustomService,
    private _formBuilder: FormBuilder,
    private _loginService: LoginService) {
    this.menuData = this._loginService.getMenuDetails(3, 1);
    this.newUnitSub = this.commonService.newUnitStatus().subscribe(
      (obj) => {
        this.getUnitDetail()
      }
    )
    this.deleteSub = this.commonService.getDeleteStatus().subscribe(
      (obj) => {
        if (obj.id && obj.type && obj.type === 'unit') {
          this.deleteItem(obj.id)
        }
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

  deleteItem (id) {
    if (id) {
      this._unitmasterServices.delteUnit(id).subscribe(Data => {
        if (Data.Code === UIConstant.DELETESUCCESS) {
          this.toastrService.showSuccess('Success', 'Deleted Successfully')
          this.commonService.closeDelete('')
          this.getUnitDetail()
        }
        if (Data.Code === UIConstant.CANNOTDELETERECORD) {
          this.toastrService.showInfo('', Data.Description)
          this.commonService.closeDelete('')
          this.getUnitDetail()
        }
        if (Data.Code === UIConstant.SERVERERROR) {
          this.toastrService.showError('', Data.Description)

        }
      })
    }
  }

  ngOnInit () {
    this.getUnitDetail()
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
          this.unitDetail = data.Data
          this.total = this.unitDetail[0] ? this.unitDetail[0].TotalRows : 0
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
    return this._unitmasterServices.getUnitDetail('?Name=' + term + '&Page=' + this.p + '&Size=' + this.itemsPerPage)
  }

  getUnitDetail () {
    if (!this.searchForm.value.searckKey) {
      this.searchForm.value.searckKey = ''
    }
    this._unitmasterServices.getUnitDetail('?Name=' + this.searchForm.value.searckKey + '&Page=' + this.p + '&Size=' + this.itemsPerPage).subscribe(data => {
      console.log('unit data : ', data)
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        this.unitDetail = data.Data
        this.total = this.unitDetail[0] ? this.unitDetail[0].TotalRows : 0
      }
    })
  }

  addunit () {
    this.commonService.openUnit('')
  }

  ngOnDestroy () {
    this.newUnitSub.unsubscribe()
    this.deleteSub.unsubscribe()
  }

  editunit (unitId) {
    this.commonService.openUnit(unitId)
  }

  deleteUnit (id) {
    this.commonService.openDelete(id, 'unit', 'Unit')
  }

}
