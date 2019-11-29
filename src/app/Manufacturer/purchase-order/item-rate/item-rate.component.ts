import { Component, Input, SimpleChanges } from '@angular/core';
import { PurchaseOrderService } from '../purchase-order.service';
import { ToastrCustomService } from '../../../commonServices/toastr.service';
import { UIConstant } from '../../../shared/constants/ui-constant';
import { Settings } from '../../../shared/constants/settings.constant';
import { Subscription } from 'rxjs/Subscription';
declare const $: any;
@Component({
  selector: 'item-rate',
  templateUrl: './item-rate.component.html'
})
export class ItemRateComponent {
  @Input() open: boolean
  @Input() buyerId: number
  model: any = {}
  p: number = 1
  itemsPerPage: number = 20
  total: number = 0
  lastItemIndex: number = 0
  clientDateFormat = ''
  destroy$: Subscription[] = []
  constructor (private _po: PurchaseOrderService, private _ts: ToastrCustomService, private settings: Settings) {
    this.clientDateFormat = this.settings.dateFormat
  }
  ngOnChanges (changes: SimpleChanges): void {
    if (changes.open && changes.open.currentValue) {
      if (this.buyerId > 0) {
        this.getRates()
        this.openModal()
      }
    }
  }

  getRates () {
    // ${this.model.itemId} ${this.model.ledgerId} ${this.model.fromDate} ${this.model.toDate}
    const query = `?ReqNo=${this.buyerId}&ItemId=&LedgerId=&FromDate=&ToDate=&Page=${this.p}&Size=${this.itemsPerPage}`
    this.destroy$.push(this._po.getVendorRates(query).subscribe((data) => {
      console.log(data)
      this.model.Rates = data
      this.total = data[0].TotalRows
    },
    (error) => {
      this._ts.showErrorLong(error, '')
    }))
  }

  openModal() {
    this.model.show = true
    $('#rate_modal').modal(UIConstant.MODEL_SHOW)
  }

  ngOnDestroy() {
    if (this.destroy$ && this.destroy$.length > 0) {
      this.destroy$.forEach((element) => element.unsubscribe())
    }
  }
}
