import { BuyerOrderService } from './../buyer-order.service';
import { AddBuyerOrderComponent } from './../add-buyer-order/add-buyer-order.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'lodash'

@Component({
  selector: 'app-buyer-order-list',
  templateUrl: './buyer-order-list.component.html',
  styleUrls: ['./buyer-order-list.component.css']
})
export class BuyerOrderListComponent implements OnInit {
  model: any ={}
  lastItemIndex: number = 0
  pageSize: number = 20
  pageNo: number = 1
  totalItemSize: number = 0
  buyerOrderList: Array<any> = []
  @ViewChild('addBuyerOrderFormRef') addBuyerOrderFormModal: AddBuyerOrderComponent
  private unSubscribe$ = new Subject<void>()
  constructor(
    private buyerOrderService: BuyerOrderService
  ) { }

  ngOnInit() {
    this.getBuyerOrderList()
  }

  getBuyerOrderList(){
    const data = {
      Page: this.pageNo,
      Size: this.pageSize
    }
    this.buyerOrderService.getBuyerOrderList(data).subscribe((res)=> {
      this.buyerOrderList = [...res.Data]
      if (!_.isEmpty(this.buyerOrderList) && this.buyerOrderList.length >= 1) {
        this.totalItemSize = this.buyerOrderList[0].TotalRows;
      }
    })
  }

  addBuyerOrder(data?) {
    this.addBuyerOrderFormModal.openModal(data)
  }

  onPageNoChange = (event) => {
    this.pageNo = event
    this.getBuyerOrderList()
  }

  onPageSizeChange = (event) => {
    this.pageSize = event
    this.getBuyerOrderList()
  }

  onLastValueChange = (event) => {
    this.lastItemIndex = event
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next()
    this.unSubscribe$.complete()
  }

  onModalClosed(event){
    this.getBuyerOrderList()
  }

  // deleteItemRequirement(item) {
  //   this._itemRequirementService.deleteItemRequirement(item).subscribe((res) => {
  //     if (res.Code === 5015) {
  //       this._toastService.showSuccess('Success', 'Item Requirement Successfully')
  //       this.getItemRequirementListData()
  //     } else {
  //       this._toastService.showError('Error', res.Message)
  //     }
  //   })
  // }
}
