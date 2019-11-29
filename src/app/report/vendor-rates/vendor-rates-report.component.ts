import { Component, ElementRef, ViewChild } from '@angular/core';
import { ToastrCustomService } from '../../commonServices/toastr.service';
import { Settings } from '../../shared/constants/settings.constant';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UIConstant } from '../../shared/constants/ui-constant';
import { PagingComponent } from '../../shared/pagination/pagination.component';
import { Subscription } from 'rxjs/Subscription';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { PurchaseOrderService } from '../../Manufacturer/purchase-order/purchase-order.service';
import { VendorRatesService } from './vendor-rates.service';
@Component({
  selector: 'vendor-rates',
  templateUrl: './vendor-rates-report.component.html'
})
export class VendorRatesReportComponent {
  lastItemIndex: number = 0
  itemsPerPage: number = 20
  p: number = 1
  total: number = 20
  toShowSearch = false
  clientDateFormat: string = ''
  vendorRates: Array<any> = []
  packetId = 0
  orderId = 0
  destroy$: Subscription
  queryStr = ''
  @ViewChild('paging_comp') pagingComp: PagingComponent
  constructor(private _po: PurchaseOrderService, private _vrs: VendorRatesService, private _ts: ToastrCustomService,
     private settings: Settings, private route: ActivatedRoute, private _formBuilder: FormBuilder) {

    this.destroy$ = this._vrs.queryStr$.subscribe(
      (str) => {
        console.log(str)
        this.queryStr = str
        this.p = 1
        this.getVendorRatesList()
      }
    )

    this.destroy$ = this._vrs.search$.pipe(debounceTime(1000),distinctUntilChanged()).subscribe((text: string) => {
      this.searchForStr(text)
    })
  }

  ngOnInit() {
    this.formSearch()
    this.clientDateFormat = this.settings.dateFormat
    this.getVendorRatesList()
  }

  getVendorRatesList() {
    let term = this.searchForm.value.searchKey.trim()
    if (!term) {
      term = ''
    }
    this._po.getVendorRates(`?Page=${this.p}&Size=${this.itemsPerPage}` + '&Strsearch=' + term + this.queryStr).subscribe(
      (data) => {
        console.log(data)
        this.vendorRates = data
        this.total = this.vendorRates.length > 0 ? this.vendorRates[0].TotalRows : 0
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
    this._vrs.onTextEntered(term)
  }

  searchGetCall(term: string) {
    if (!term) {
      term = ''
    }
    this.pagingComp.setPage(1)
    return this._po.getVendorRates(`?Page=${this.p}&Size=${this.itemsPerPage}&Strsearch=${term}` + this.queryStr)
  }

  searchForStr(text) {
    this.searchGetCall(text).subscribe((data) => {
      this.vendorRates = data
      this.total = this.vendorRates.length > 0 ? this.vendorRates[0].TotalRows : 0
    }, (err) => {
      this._ts.showErrorLong(err, '')
    })
  }

  ngOnDestroy () {
    if (this.destroy$) this.destroy$.unsubscribe()
  }
}