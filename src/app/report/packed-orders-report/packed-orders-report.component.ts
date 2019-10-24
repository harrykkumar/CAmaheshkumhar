import { Component, ViewChild, ElementRef } from '@angular/core';
import { PackedOrdersService } from './packed-orders.service';
import { ToastrCustomService } from '../../commonServices/toastr.service';
import { Settings } from '../../shared/constants/settings.constant';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UIConstant } from '../../shared/constants/ui-constant';
import { PagingComponent } from '../../shared/pagination/pagination.component';
import { Subscription } from 'rxjs/Subscription';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
@Component({
  selector: 'order-packaging-report',
  templateUrl: './packed-orders-report.component.html'
})
export class PackedOrdersReportComponent {
  lastItemIndex: number = 0
  itemsPerPage: number = 20
  p: number = 1
  total: number = 20
  toShowSearch = false
  clientDateFormat: string = ''
  packedOrders: Array<any> = []
  isSearching: boolean = false
  destroy$: Subscription
  queryStr = ''
  @ViewChild('paging_comp') pagingComp: PagingComponent
  constructor(private _po: PackedOrdersService,
    private _ts: ToastrCustomService, private _formBuilder: FormBuilder,
    private settings: Settings, private router: Router) {
    this.destroy$ = this._po.queryStr$.subscribe(
      (str) => {
        console.log(str)
        this.queryStr = str
        this.p = 1
        this.getPackedOrderList()
      }
    )

    this.destroy$ = this._po.search$.pipe(debounceTime(1000),distinctUntilChanged()).subscribe((text: string) => {
      this.searchForStr(text)
    })
  }
  @ViewChild('searchData') textSearch: ElementRef
  ngOnInit() {
    this.formSearch()
    this.clientDateFormat = this.settings.dateFormat
    this.getPackedOrderList()
  }

  toggleSearch() {
    this.toShowSearch = !this.toShowSearch
  }

  @ViewChild('searchData') searchData: ElementRef
  searchForm: FormGroup
  private formSearch() {
    this.searchForm = this._formBuilder.group({
      'searchKey': [UIConstant.BLANK]
    })
  }

  getPackedOrderList() {
    let term = this.searchForm.value.searchKey.trim()
    if (!term) {
      term = ''
    }
    this._po.getPackedOrderList('BuyerOrderPacked' + `&Page=${this.p}&Size=${this.itemsPerPage}` + this.queryStr + '&Strsearch=' + term).subscribe(
      (data) => {
        console.log(data)
        this.packedOrders = data
        this.total = this.packedOrders.length > 0 ? this.packedOrders[0].TotalRows : 0
      },
      (error) => {
        this._ts.showError(error, '')
      }
    )
  }

  getPacketsForOrder (id) {
    this.router.navigate(['/report/packed-packets'], { queryParams: { orderId: id}, queryParamsHandling: 'merge' });
  }

  onTextEntered () {
    let term = this.searchForm.value.searchKey.trim()
    this._po.onTextEntered(term)
  }

  searchGetCall(term: string) {
    if (!term) {
      term = ''
    }
    this.pagingComp.setPage(1)
    return this._po.getPackedOrderList('BuyerOrderPacked' + `&Page=${this.p}&Size=${this.itemsPerPage}&Strsearch=${term}` + this.queryStr)
  }

  searchForStr(text) {
    this.isSearching = true
    this.searchGetCall(text).subscribe((data) => {
      this.packedOrders = data
      this.total = this.packedOrders.length > 0 ? this.packedOrders[0].TotalRows : 0
      setTimeout(() => {
        this.isSearching = false
      }, 1)
    }, (err) => {
      setTimeout(() => {
        this.isSearching = false
      }, 1)
      this._ts.showErrorLong(err, '')
    })
  }

  ngOnDestroy () {
    this.destroy$.unsubscribe()
  }
}