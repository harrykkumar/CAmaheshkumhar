import { Component, ElementRef, ViewChild } from '@angular/core';
import { PackedOrdersService } from '../packed-orders-report/packed-orders.service';
import { ToastrCustomService } from '../../commonServices/toastr.service';
import { Settings } from '../../shared/constants/settings.constant';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UIConstant } from '../../shared/constants/ui-constant';
import { PagingComponent } from '../../shared/pagination/pagination.component';
import { Subscription } from 'rxjs/Subscription';
import { ManufacturingService } from '../../Manufacturer/manufacturing.service';
@Component({
  selector: 'item-vendor-rate-report',
  templateUrl: './item-vendor-rate-report.component.html'
})
export class vendorRatesReportComponent {
  lastItemIndex: number = 0
  itemsPerPage: number = 20
  p: number = 1
  total: number = 20
  toShowSearch = false
  clientDateFormat: string = ''
  rates: Array<any> = []
  destroy$: Subscription
  queryStr = ''
  @ViewChild('paging_comp') pagingComp: PagingComponent
  constructor(private _ts: ToastrCustomService,
     private settings: Settings, private route: ActivatedRoute, private _formBuilder: FormBuilder,
     private _ms: ManufacturingService) {

    this.destroy$ = this._ms.queryStr$.subscribe(
      (str) => {
        console.log(str)
        this.queryStr = str
        this.p = 1
        this.getVendorRates()
      }
    )
  }

  ngOnInit() {
    // this.formSearch()
    this.clientDateFormat = this.settings.dateFormat
    this.getVendorRates()
  }

  getVendorRates() {
    this._ms.getItemRatesOfVendor(`?Page=${this.p}&Size=${this.itemsPerPage}` + this.queryStr).subscribe(
      (data) => {
        console.log(data)
        this.rates = data
        this.total = this.rates.length > 0 ? this.rates[0].TotalRows : 0
      },
      (error) => {
        this._ts.showError(error, '')
      }
    )
  }

  toggleSearch() {
    this.toShowSearch = !this.toShowSearch
  }

  ngOnDestroy () {
    this.destroy$.unsubscribe()
  }
}