import { Component, ElementRef, ViewChild } from '@angular/core';
import { PackedOrdersService } from '../packed-orders-report/packed-orders.service';
import { ToastrCustomService } from '../../commonServices/toastr.service';
import { Settings } from '../../shared/constants/settings.constant';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UIConstant } from '../../shared/constants/ui-constant';
import { PagingComponent } from '../../shared/pagination/pagination.component';
import { Subscription } from 'rxjs/Subscription';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
@Component({
  selector: 'packed-items',
  templateUrl: './packed-items-report.component.html'
})
export class PackedItemsReportComponent {
  lastItemIndex: number = 0
  itemsPerPage: number = 20
  p: number = 1
  total: number = 20
  toShowSearch = false
  clientDateFormat: string = ''
  packedItems: Array<any> = []
  packetId = 0
  orderId = 0
  destroy$: Subscription
  queryStr = ''
  @ViewChild('paging_comp') pagingComp: PagingComponent
  constructor(private _po: PackedOrdersService, private _ts: ToastrCustomService,
     private settings: Settings, private route: ActivatedRoute, private _formBuilder: FormBuilder) {
    this.route.queryParams
    .subscribe(params => {
      console.log(params);
      this.packetId = +params.packetId;
      this.orderId = +params.orderId
    });

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

  ngOnInit() {
    this.formSearch()
    this.clientDateFormat = this.settings.dateFormat
    this.getPackedOrderList()
  }

  getPackedOrderList() {
    let queryStr = ''
    if (+this.orderId > 0 && +this.packetId > 0) {
      queryStr = '&OrderId=' + this.orderId + '&PacketId=' + this.packetId
    }
    let term = this.searchForm.value.searchKey.trim()
    if (!term) {
      term = ''
    }
    this._po.getPackedOrderList('OrderedPackedDetails' + queryStr + `&Page=${this.p}&Size=${this.itemsPerPage}` + '&Strsearch=' + term + this.queryStr).subscribe(
      (data) => {
        console.log(data)
        this.packedItems = data
        this.total = this.packedItems.length > 0 ? this.packedItems[0].TotalRows : 0
      },
      (error) => {
        this._ts.showError(error, '')
      }
    )
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
    this.searchGetCall(text).subscribe((data) => {
      this.packedItems = data
      this.total = this.packedItems.length > 0 ? this.packedItems[0].TotalRows : 0
    }, (err) => {
      this._ts.showErrorLong(err, '')
    })
  }

  ngOnDestroy () {
    this.destroy$.unsubscribe()
  }
}