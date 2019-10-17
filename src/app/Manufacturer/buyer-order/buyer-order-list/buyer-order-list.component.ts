import { BuyerOrderService } from './../buyer-order.service';
import { AddBuyerOrderComponent } from './../add-buyer-order/add-buyer-order.component';
import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'lodash'
import { CommonService } from '../../../commonServices/commanmaster/common.services';
import { ToastrCustomService } from '../../../commonServices/toastr.service';
import { Settings } from '../../../shared/constants/settings.constant';
import { PackagingAddComponent } from '../../packaging/packaging-add/packaging-add.component';

@Component({
  selector: 'app-buyer-order-list',
  templateUrl: './buyer-order-list.component.html',
  styleUrls: ['./buyer-order-list.component.css']
})
export class BuyerOrderListComponent implements OnInit, OnDestroy, AfterViewInit {
  model: any ={}
  lastItemIndex: number = 0
  pageSize: number = 20
  pageNo: number = 1
  totalItemSize: number = 0
  buyerOrderList: Array<any> = []
  clientDateFormat = ''
  componentRef: any
  @ViewChild('addBuyerOrderFormRef') addBuyerOrderFormModal: AddBuyerOrderComponent
  private unSubscribe$ = new Subject<void>()
  @ViewChild('packagingaddcontainer', { read: ViewContainerRef }) entry: ViewContainerRef;
  constructor(
    private resolver: ComponentFactoryResolver,
    private buyerOrderService: BuyerOrderService,
    private commonService: CommonService,
    private toastrService: ToastrCustomService,
    private settings: Settings
  ) {
    this.clientDateFormat = this.settings.dateFormat
  }

  createComponent(data) {
    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(PackagingAddComponent);
    this.componentRef = this.entry.createComponent(factory);
    this.componentRef.instance.orderId = data
    this.componentRef.instance.getOrderData();
    this.componentRef.instance.openModal();
  }

  destroyComponent() {
    this.componentRef.destroy();
  }

  ngOnInit() {
    this.getBuyerOrderList()
  }

  ngAfterViewInit () {
    this.commonService.fixTableHF('buyerorder-table')
  }

  getBuyerOrderList(){
    const data = {
      Page: this.pageNo,
      Size: this.pageSize
    }
    this.buyerOrderService.getBuyerOrderList(data).subscribe((data)=> {
      this.buyerOrderList = [...data]
      if (!_.isEmpty(this.buyerOrderList) && this.buyerOrderList.length >= 1) {
        this.totalItemSize = this.buyerOrderList[0].TotalRows;
      }
    },
    (error) => {
      this.toastrService.showError(error, '')
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

  addItemRequirement (item) {
    this.buyerOrderService.getBuyerOrderData(item.Id).subscribe(
      (data) => {
        console.log('edit : ', data)
        this.addBuyerOrder({edit: true, data: data})
      },
      (error) => {
        console.log(error)
        this.toastrService.showError(error, '')
      }
    )
  }

  packOrder (item) {
    this.createComponent(item.Id)
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
