
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core'
import { Subscription ,fromEvent} from 'rxjs'
import { UIConstant } from '../../../shared/constants/ui-constant'
declare const $: any
import { map, filter, debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { CommonService } from '../../../commonServices/commanmaster/common.services'
import { ToastrCustomService } from '../../../commonServices/toastr.service'
import { VendorServices } from '../../../commonServices/TransactionMaster/vendoer-master.services'
import { PagingComponent } from '../../../shared/pagination/pagination.component'
import { FormGroup, FormBuilder } from '@angular/forms'

@Component({
  selector: 'app-sales-list',
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.css']
})
export class SalesListComponent implements   OnInit   {
  DIRECT_SALE_TYPE: any = 'DirectSale'
  saleDirectDetails: any
  itemsPerPage: number = 20
  totalDiscount: number
  totaltax: number
  totalBillAmount: number
  refreshingpage: Subscription
  newBillSub: Subscription
  queryStr$: Subscription
  total: number = 0
  searchForm: FormGroup
  isSearching: boolean = false
  queryStr: string = ''
  lastItemIndex: number = 0
  p: number = 1
  constructor (private _formBuilder : FormBuilder,private _coustomerServices: VendorServices,public _commonService: CommonService ,public _toastrCustomService: ToastrCustomService) {
    this.formSearch()
    this.getSaleDetail()
    
    this.newBillSub = this._commonService.newSaleStatus().subscribe(
      (obj: any) => {
        this.getSaleDetail()

      }
    )
    this.queryStr$ = this._coustomerServices.queryStr$.subscribe(
      (str) => {
        console.log(str)
        this.queryStr = str
        this.p = 1
        this.getSaleDetail()
      }
    )
    this.refreshingpage = this._commonService.newRefreshItemStatus().subscribe(
      (obj) => {  
          this.getSaleDetail()
      }
    )

  }

  openSaleDirect (id) {
    this._commonService.openSaleDirect(id)
  }
  @ViewChild('searchData') searchData: ElementRef

  ngOnInit () {
    debugger
    this._commonService.fixTableHF('cat-table')
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
          this.saleDirectDetails = data.Data
          this.total = this.saleDirectDetails[0] ? this.saleDirectDetails[0].TotalRows : 0
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
  toShowSearch = false
  @ViewChild('paging_comp') pagingComp: PagingComponent
  private formSearch () {
    this.searchForm = this._formBuilder.group({
      'searckKey': [UIConstant.BLANK]
    })
  }
  toggleSearch () {
    this.toShowSearch = !this.toShowSearch
  }
  searchGetCall (term: string) {
    if (!term) {
      term = ''
    }
    this.pagingComp.setPage(1)
    return this._commonService.getListSaleDirect( '?Strsearch=' + term + '&Page=' + this.p + '&Size=' + this.itemsPerPage + this.queryStr)
  }
  getSaleDetail () {
    debugger
    if (!this.searchForm.value.searckKey) {
      this.searchForm.value.searckKey = ''
    }
    this._commonService.getListSaleDirect('?Strsearch=' + this.searchForm.value.searckKey + '&Page=' + this.p + '&Size=' + this.itemsPerPage + this.queryStr).subscribe(data => {
      console.log('sales data: ', data)
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        this.totalDiscount = 0
        this.totaltax = 0
        this.totalBillAmount = 0
        this.saleDirectDetails = data.Data
        this.total = this.saleDirectDetails[0] ? this.saleDirectDetails[0].TotalRows : 0

        data.Data.forEach(element => {
          this.totalDiscount = +(this.totalDiscount + +element.Discount).toFixed(2)
          this.totaltax = +(this.totaltax + +element.TaxAmount).toFixed(2)
          this.totalBillAmount = +(this.totalBillAmount + +element.BillAmount).toFixed(2)
        })

      }
    })
  }
  openPrint (id,isViewPrint) {
    this._commonService.openPrint(id,this.DIRECT_SALE_TYPE,isViewPrint)
  }


}
