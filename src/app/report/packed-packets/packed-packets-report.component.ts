import { Component, ViewChild, ElementRef } from '@angular/core';
import { PackedOrdersService } from '../packed-orders-report/packed-orders.service';
import { ToastrCustomService } from '../../commonServices/toastr.service';
import { Settings } from '../../shared/constants/settings.constant';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UIConstant } from '../../shared/constants/ui-constant';
import { PagingComponent } from '../../shared/pagination/pagination.component';
import { Subscription } from 'rxjs/Subscription';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
@Component({
  selector: 'packed-packets',
  templateUrl: './packed-packets-report.component.html'
})
export class PackedPacketsReportComponent {
  lastItemIndex: number = 0
  itemsPerPage: number = 20
  p: number = 1
  total: number = 20
  toShowSearch = false
  clientDateFormat: string = ''
  orderId = 0
  packedPackets: Array<any> = []
  queryStr = ''
  destroy$: Subscription
  constructor(private _po: PackedOrdersService, private _ts: ToastrCustomService, private _formBuilder: FormBuilder,
    private settings: Settings, private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.orderId = +params.orderId;
    });
    this.destroy$ = this._po.search$.pipe(debounceTime(1000),distinctUntilChanged()).subscribe((text: string) => {
      this.searchForStr(text)
    })

    this.destroy$ = this._po.queryStr$.subscribe(
      (str) => {
        console.log(str)
        this.queryStr = str
        this.p = 1
        this.getPackedOrderList()
      }
    )
  }

  ngOnInit() {
    this.formSearch()
    this.clientDateFormat = this.settings.dateFormat
    this.getPackedOrderList()
  }

  getPackedOrderList() {
    let queryStr = ''
    if (+this.orderId > 0) {
      queryStr = '&OrderId=' + this.orderId
    }
    let term = this.searchForm.value.searchKey.trim()
    if (!term) {
      term = ''
    }
    this._po.getPackedOrderList('OrderedPacked' + queryStr + `&Page=${this.p}&Size=${this.itemsPerPage}` + this.queryStr + '&Strsearch=' + term).subscribe(
      (data) => {
        console.log(data)
        this.packedPackets = data
        this.total = this.packedPackets.length > 0 ? this.packedPackets[0].TotalRows : 0
      },
      (error) => {
        this._ts.showError(error, '')
      }
    )
  }

  getItemsForPackets (packetId, orderId) {
    this.router.navigate(['/report/packed-items'], { queryParams: { packetId: packetId, orderId: orderId}, queryParamsHandling: 'merge' });
  }

  onTextEntered () {
    let term = this.searchForm.value.searchKey.trim()
    this._po.onTextEntered(term)
  }
  @ViewChild('paging_comp') pagingComp: PagingComponent
  searchGetCall(term: string) {
    if (!term) {
      term = ''
    }
    this.pagingComp.setPage(1)
    return this._po.getPackedOrderList('BuyerOrderPacked' + `&Page=${this.p}&Size=${this.itemsPerPage}&Strsearch=${term}` + this.queryStr)
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

  searchForStr(text) {
    this.searchGetCall(text).subscribe((data) => {
      this.packedPackets = data
      this.total = this.packedPackets.length > 0 ? this.packedPackets[0].TotalRows : 0
      setTimeout(() => {
      }, 1)
    }, (err) => {
      setTimeout(() => {
      }, 1)
      this._ts.showErrorLong(err, '')
    })
  }
}