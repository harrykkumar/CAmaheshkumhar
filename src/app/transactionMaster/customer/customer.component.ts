import { Component, OnInit, ElementRef, ViewChild } from '@angular/core'
import { UIConstant } from '../../shared/constants/ui-constant'
import { Subscription, fromEvent } from 'rxjs'
import { Ledger } from '../../model/sales-tracker.model'
import { VendorServices } from '../../commonServices/TransactionMaster/vendoer-master.services'
import { ToastrCustomService } from '../../commonServices/toastr.service'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
import { FormGroup, FormBuilder } from '@angular/forms'
import { map, filter, debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { PagingComponent } from '../../shared/pagination/pagination.component'
import { Settings } from '../../shared/constants/settings.constant'

declare var $: any
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  coustomerDetails: Ledger[]
  deleteSub: Subscription
  subscribe: Subscription
  searchForm: FormGroup
  p: number = 1
  itemsPerPage: number = 20
  total: number = 0
  lastItemIndex: number = 0
  isSearching: boolean = false
  queryStr$: Subscription
  noOfDecimal:any =0
  queryStr: string = ''
  @ViewChild('paging_comp') pagingComp: PagingComponent
  constructor (private _coustomerServices: VendorServices,
    private commonService: CommonService,
    private toastrService: ToastrCustomService,
    private _formBuilder: FormBuilder,
    private Settings:Settings) {
      this.noOfDecimal= this.Settings.noOfDecimal
    this.deleteSub = this.commonService.getDeleteStatus().subscribe(
      (obj) => {
        if (obj.id && obj.type && obj.type === 'customer') {
          this.deleteItem(obj.id)
        }
      }
    )

    this.queryStr$ = this._coustomerServices.queryStr$.subscribe(
      (str) => {
        console.log(str)
        this.queryStr = str
        this.p = 1
        this.getCustomerDetail()
      }
    )
    this.deleteSub = this.commonService.newRefreshItemStatus().subscribe(
      (obj) => {  
          this.getCustomerDetail()
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
      this._coustomerServices.deleteLedger(id).subscribe(Data => {
        console.log('Delete customer : ', Data)
        if (Data.Code === UIConstant.DELETESUCCESS) {
          this.toastrService.showSuccess(UIConstant.SUCCESS, 'Deleted Successfully')
          this.commonService.closeDelete('')
          this.getCustomerDetail()
        } if (Data.Code === UIConstant.NORECORDFOUND) {
          this.toastrService.showError('Fail', ' Record Already Deleted ,Please Refresh Page')
          this.commonService.closeDelete('')

        }
        if (Data.Code === UIConstant.CANNOTDELETERECORD) {
          this.toastrService.showInfo('', Data.Description)
          this.commonService.closeDelete('')
        }
      })
    }
  }

  ngOnInit () {
    this.commonService.fixTableHF('cat-table')
    this.coustomerDetails = []
    this.getCustomerDetail()
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
          this.coustomerDetails = data.Data
          this.total = this.coustomerDetails[0] ? this.coustomerDetails[0].TotalRows : 0
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
    return this._coustomerServices.getVendor(5, '&Strsearch=' + term + '&Page=' + this.p + '&Size=' + this.itemsPerPage + this.queryStr)
  }

  ngOnDestroy () {
    this.subscribe.unsubscribe()
  }

  addnewCoustomer () {
    this.commonService.openCust('', false)
  }

  editCoustomer (editid) {
    this.commonService.openCust(editid, false)
  }

  openSearch: boolean = false
  toggleSearch () {
    this.openSearch = !this.openSearch
  }

  getCustomerDetail () {
    if (!this.searchForm.value.searckKey) {
      this.searchForm.value.searckKey = ''
    }
    this.subscribe = this._coustomerServices.getVendor(5, '&Strsearch=' + this.searchForm.value.searckKey + '&Page=' + this.p + '&Size=' + this.itemsPerPage + this.queryStr).subscribe(Data => {
      console.log('customers : ', Data)
      if (Data.Code === UIConstant.THOUSAND) {
        this.coustomerDetails = Data.Data
        this.total = this.coustomerDetails[0] ? this.coustomerDetails[0].TotalRows : 0
      }
    })
  }

  delteCustomerPopup (id) {
    this.commonService.openDelete(id, 'customer', 'Customer')
  }
}
