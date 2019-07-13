import { AddBuyerOrderComponent } from './../add-buyer-order/add-buyer-order.component';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-buyer-order-list',
  templateUrl: './buyer-order-list.component.html',
  styleUrls: ['./buyer-order-list.component.css']
})
export class BuyerOrderListComponent implements OnInit {
@ViewChild('addBuyerOrderFormRef') addBuyerOrderFormModal: AddBuyerOrderComponent
  constructor() { }

  ngOnInit() {
  }

  addBuyerOrder(data?) {
    this.addBuyerOrderFormModal.openModal(data)
  }
}
