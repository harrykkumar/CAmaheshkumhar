import { Component } from "@angular/core";
import { PurchaseOrderService } from '../purchase-order.service';

@Component({
  selector: 'purchase-order-main',
  templateUrl: './purchase-order-main.component.html'
})
export class PurchaseOrderMainComponent {
  constructor (private _po: PurchaseOrderService) {}

  openPO () {
    this._po.openPO('')
  }
}