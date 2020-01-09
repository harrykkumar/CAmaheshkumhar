import { LoginService } from 'src/app/commonServices/login/login.services';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core'
import { Subscription, fromEvent } from 'rxjs'
import { UIConstant } from '../../shared/constants/ui-constant'
import { ItemModel } from 'src/app/model/sales-tracker.model'
import { ItemmasterServices } from '../../commonServices/TransactionMaster/item-master.services'
import { ToastrCustomService } from '../../commonServices/toastr.service'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
import { FormGroup, FormBuilder } from '@angular/forms'
import { map, filter, debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { PagingComponent } from '../../shared/pagination/pagination.component'
declare var $: any
@Component({
  selector: 'app-item-master',
  templateUrl: './item-master.component.html',
  styleUrls: ['./item-master.component.css']
})
export class ItemMasterComponent implements OnInit, OnDestroy {
  itemDetail: ItemModel[]
  deleteSub: Subscription
  addItemSub: Subscription
  searchForm: FormGroup
  p: number = 1
  itemsPerPage: number = 20
  total: number = 0
  lastItemIndex: number = 0
  isSearching: boolean = false
  queryStr$: Subscription
  queryStr: string
  @ViewChild('paging_comp') pagingComp: PagingComponent
  menuData: any;
  constructor (private _itemmasterServices: ItemmasterServices,
    private commonService: CommonService,
    private toastrService: ToastrCustomService,
    private _formBuilder: FormBuilder,
    private _loginService: LoginService
    ) {
    this.menuData = this._loginService.getMenuDetails(8, 131);
    this.deleteSub = this.commonService.getDeleteStatus().subscribe(
      (obj) => {
        if (obj.id && obj.type && obj.type === 'itemMaster') {
          this.deleteItem(obj.id)
        }
      }
    )
    this.addItemSub = this.commonService.addItemMasterSub().subscribe(
      (obj) => {
        this.getItemMasterDetail()
      }
    )
    this.queryStr$ = this._itemmasterServices.queryStr$.subscribe(
      (str) => {
        console.log(str)
        this.queryStr = str
        this.p = 1
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

  searchGetCall (term: string) {
    if (!term) {
      term = ''
    }
    this.pagingComp.setPage(1)
    const queryStr = this.queryStr ? this.queryStr : ''
    return this._itemmasterServices.getItemMasterDetail('?Strsearch=' + term + '&Page=' + this.p + '&Size=' + this.itemsPerPage + queryStr)
  }

  deleteItem (id) {
    this.commonService.openDelete(id, 'itemMaster', 'Item')
    if (id) {
      this._itemmasterServices.deleteItem(id).subscribe(data => {
        if (data.Code === UIConstant.DELETESUCCESS) {
          this.toastrService.showSuccess('Sucess', 'Deleted Successfully')
          this.commonService.closeDelete('')
          this.getItemMasterDetail()
        }
        if (data.Code === UIConstant.CANNOTDELETERECORD) {
          this.toastrService.showInfo('Info', 'Can not deleted !')
          this.commonService.closeDelete('')
        }
      })
    }
  }
  getItemMasterDetail () {
    this.isSearching = true
    if (!this.searchForm.value.searckKey) {
      this.searchForm.value.searckKey = ''
    }
    const queryStr = this.queryStr ? this.queryStr : ''
    this._itemmasterServices.getItemMasterDetail('?Strsearch=' + this.searchForm.value.searckKey + '&Page=' + this.p + '&Size=' + this.itemsPerPage + queryStr).subscribe(data => {
      console.log('item master : ', data)
      if (data.Code === UIConstant.THOUSAND) {
        this.itemDetail = data.Data
        this.total = this.itemDetail[0] ? this.itemDetail[0].TotalRows : 0
        setTimeout(() => {
          this.isSearching = false
        }, 100)
      }
    })
  }

  addItemMaster () {
    this.commonService.openItemMaster('', 0)
  }

  openSearch = false
  toggleSearch () {
    this.openSearch = !this.openSearch
  }

  onOpenItemMaster () {
    this.commonService.openItemImport()
  }

  ngOnDestroy () {
    this.deleteSub.unsubscribe()
    this.addItemSub.unsubscribe()
    this.queryStr$.unsubscribe()
  }

  editItem (id) {
    console.log('edit id : ', id)
    this.commonService.openItemMaster(id, 0)
  }

  deleteItemMaster (id) {
    console.log('id : ', id)
    this.commonService.openDelete(id, 'itemMaster', 'Item')
  }

}
