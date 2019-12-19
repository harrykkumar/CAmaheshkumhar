import { Component, ViewChild } from '@angular/core';
import { ToastrCustomService } from '../../commonServices/toastr.service';
import { Settings } from '../../shared/constants/settings.constant';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { PagingComponent } from '../../shared/pagination/pagination.component';
import { Subscription } from 'rxjs/Subscription';
import { ManufacturingService } from '../../Manufacturer/manufacturing.service';
@Component({
  selector: 'bo-delivery-status',
  templateUrl: './bo-status-report.component.html'
})
export class  BOStatusReportComponent {
  lastItemIndex: number = 0
  itemsPerPage: number = 20
  p: number = 1
  total: number = 20
  toShowSearch = false
  clientDateFormat: string = ''
  rates: Array<any> = []
  destroy$: Subscription[] = []
  queryStr = ''
  @ViewChild('paging_comp') pagingComp: PagingComponent
  constructor(private _ts: ToastrCustomService, private settings: Settings, private _ms: ManufacturingService) {
    this.destroy$.push(this._ms.queryStr$.subscribe(
      (str) => {
        console.log(str)
        this.queryStr = str
        this.p = 1
        this.getBOStatusList()
      }
    ))
  }

  ngOnInit() {
    this.clientDateFormat = this.settings.dateFormat
    this.getBOStatusList()
  }

  getBOStatusList() {
    this.destroy$.push(this._ms.getBOStatusList(`?Page=${this.p}&Size=${this.itemsPerPage}` + this.queryStr).subscribe(
      (data) => {
        console.log(data)
        this.rates = data.PurchaseOrders
        this.total = this.rates.length > 0 ? this.rates[0].TotalRows : 0
      },
      (error) => {
        this._ts.showError(error, '')
      }
    ))
  }
  ngOnDestroy () {
    if (this.destroy$ && this.destroy$.length > 0) {
      this.destroy$.forEach((element) => element.unsubscribe())
    }
  }
}