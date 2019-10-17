import { ActiveInventoryService } from './activeInventory.service'
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { UIConstant } from 'src/app/shared/constants/ui-constant'
import { Subject, fromEvent } from 'rxjs'
import { takeUntil, map, filter, debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { ToastrCustomService } from 'src/app/commonServices/toastr.service'
import _ from 'lodash'
import { CommonService } from '../../commonServices/commanmaster/common.services'
import { FormGroup, FormBuilder } from '@angular/forms'
import { PagingComponent } from '../../shared/pagination/pagination.component'
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-activeInventory',
  templateUrl: './activeInventory.component.html',
  styleUrls: ['./activeInventory.component.css']
})
export class ActiveInventoryComponent implements OnInit {
  private unSubscribe$ = new Subject<void>()
  searchString: string = ''

  activeInventList: Array<any> = []
  activeinventoryParentList: Array<any> = []
  searchForm: FormGroup
  p: number = 1
  itemsPerPage: number = 20
  total: number = 0
  lastItemIndex: number = 0
  isSearching: boolean = false
  refreshPage:Subscription
  parentAttrAdd$: Subscription
  @ViewChild('paging_comp') pagingComp: PagingComponent
  constructor (
    private activeService: ActiveInventoryService,
    private toastrService: ToastrCustomService,
    public commonService: CommonService,
    private _formBuilder: FormBuilder) {
    this.initDeleteStatus()
    this.initCloseActiveStatus()
    this.formSearch()

    this.refreshPage = this.commonService.newRefreshItemStatus().subscribe(
      (obj) => {
        this.initActiveList() 
      }
    ) 
  }

  ngOnInit () {
    this.initActiveList()
    this.getParentActiveList()
    this.parentAttrAdd$ = this.activeService.parentAttrAdd$.subscribe(
      () => {
        this.getParentActiveList()
      }
    )
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
          this.activeInventList = data.Data
          this.total = this.activeInventList[0] ? this.activeInventList[0].TotalRows : 0
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

  @ViewChild('searchData') searchData: ElementRef
  private formSearch () {
    this.searchForm = this._formBuilder.group({
      'searckKey': [UIConstant.BLANK]
    })
  }

  searchGetCall (term: string) {
    if (!term) {
      term = ''
    }
    this.pagingComp.setPage(1)
    return this.activeService.getActiveInventoryWithTermList('?Name=' + term + '&Page=' + this.p + '&Size=' + this.itemsPerPage).
        pipe(takeUntil(this.unSubscribe$))
  }
  /* Function to intialising attribute list to show in table */
  initActiveList = () => {
    if (!this.searchForm.value.searckKey) {
      this.searchForm.value.searckKey = ''
    }
    this.activeService.getActiveInventoryWithTermList('?Name=' + this.searchForm.value.searckKey + '&Page=' + this.p + '&Size=' + this.itemsPerPage).
    pipe(takeUntil(this.unSubscribe$)).
    subscribe((Data: any) => {
      if (Data.Code === UIConstant.THOUSAND && Data.Data) {
        this.activeInventList = [...Data.Data]
        this.total = this.activeInventList[0] ? this.activeInventList[0].TotalRows : 0
      }
    }, error => console.log(error))
  }

  getParentActiveList = () => {
    if (!this.searchForm.value.searckKey) {
      this.searchForm.value.searckKey = ''
    }
    this.activeService.getParentActiveList().
    pipe(takeUntil(this.unSubscribe$)).
    subscribe((Data: any) => {
      // console.log('data : ', Data)
      if (Data.Code === UIConstant.THOUSAND && Data.Data) {
        this.activeinventoryParentList = [...Data.Data]
      }
    }, error => console.log(error))
  }

  /* Function to listen add attribute save */
  initCloseActiveStatus = () => {
    this.commonService.closeAttributeStatus().
    pipe(takeUntil(this.unSubscribe$)).
    subscribe((response) => {
      if (response.status === 'saved') {
        this.initActiveList()
        this.getParentActiveList()
      }
    }, error => console.log(error))
  }

  /* Function to emit and open add-attribute-modal  */
  addActiveInventory = () => {
    this.commonService.openActiveInventory({}, true)
  }

  // Funtion to emit and open delete confirm dialog box
  deleteActiveInventory = (id) => {
    this.commonService.openDelete(id, 'activeInventory', 'ActiveInventory')
  }

  deleteActiveParent = (id) => {
    this.commonService.openDelete(id, 'activeInventory', 'ActiveInventory')
  }

  //  Function to emit and open add-attribute-modal in edit mode
  editActive (editAttrId, attrValue, attrId, isParent) {
    const data = { 'editId': editAttrId, 'attrValue': attrValue, 'attrNameId': attrId, 'isParent': isParent }
    this.commonService.openActiveInventory(data, true)
  }

  // Function to initialising delete attribute event
  initDeleteStatus = () => {
    this.commonService.getDeleteStatus().
    pipe(takeUntil(this.unSubscribe$)).
    subscribe(
      (obj) => {
        if (obj.id && obj.type && obj.type === 'activeInventory') {
          this.confirmDeleteActive(obj.id)
        }
        if (obj.id && obj.type && obj.type === 'activeInventory') {
          this.confirmDeleteParentActive(obj.id)
        }
      }, error => console.log(error)
    )
  }

  /* Function to listen the confirm delete action */
  confirmDeleteActive = (id) => {
    this.activeService.deleteActiveInventory(id).
    pipe(takeUntil(this.unSubscribe$)).
    subscribe((Data) => {
      if (Data.Code === UIConstant.DELETESUCCESS) {
        this.toastrService.showSuccess('Sucess', 'Deleted Successfully')
        this.commonService.closeDelete('')
        this.initActiveList()
      }
      if (Data.Code === UIConstant.CANNOTDELETERECORD) {
        this.toastrService.showInfo('', Data.Description)
        this.commonService.closeDelete('')
      }
    }, error => console.log(error))
  }

  confirmDeleteParentActive = (id) => {
    this.activeService.deleteParentActive(id).
    pipe(takeUntil(this.unSubscribe$)).
    subscribe((Data) => {
      console.log('delete : ', Data)
      if (Data.Code === UIConstant.DELETESUCCESS) {
        this.toastrService.showSuccess('Sucess', 'Deleted Successfully')
        this.commonService.closeDelete('')
        this.getParentActiveList()
        this.initActiveList()
        this.activeService.onDeleteStatus(true)
      }
      if (Data.Code === UIConstant.CANNOTDELETERECORD) {
        this.toastrService.showInfo('', Data.Description)
        this.commonService.closeDelete('')
      }
    }, error => console.log(error))
  }

  /* Function to filter the list on bases of search string */
  searchAttribute = () => {
    this.activeService.getAttributeListBySearhFilter(this.searchString).
    pipe(takeUntil(this.unSubscribe$)).
    subscribe((Data) => {
      if (Data.Code === UIConstant.THOUSAND && Data.Data) {
        this.activeInventList = [...Data.Data]
      }
    }, error => console.log(error))
  }

  /* Function call on component destroy */
  ngOnDestroy (): void {
    this.unSubscribe$.next()
    this.unSubscribe$.complete()
  }
}
