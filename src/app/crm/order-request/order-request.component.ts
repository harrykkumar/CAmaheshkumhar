import { GlobalService } from './../../commonServices/global.service';
import { Settings } from './../../shared/constants/settings.constant';
import { ApiConstant } from 'src/app/shared/constants/api';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-order-request',
  templateUrl: './order-request.component.html',
  styleUrls: ['./order-request.component.css']
})
export class OrderRequestComponent implements OnInit {
  @ViewChild('orderRequestSearchFormControl') orderRequestSearchFormControl: NgForm;
  orderRequestList: Array<any> = [];
  fromDateValue
  toDateValue
  dealerData: Array<any> = []
  customerData: Array<any> = []
  selectedDealerId: number;
  selectedCustomerId: number;
  searchText:any
  p: number = 1
  itemsPerPage: number = 20
  total: number = 0
  lastItemIndex: number = 0
  constructor(
    private commonService: CommonService,
    private router: Router,
    private _settings: Settings,
    private gs: GlobalService,
  ) {
    this.getCustomerData()
    this.getDealerData()
    this.getOrderRequestList()
  }

  ngOnInit() {
  }

  getDealerData(){
    const query = {
      DealerType : 3
    }
    this.commonService.getRequest(ApiConstant.GET_USER_DEALER, query).subscribe((res) => {
      if (res.Code === 1000 && !this.commonService.isEmpty(res.Data)) {
        this.dealerData = [...res.Data]
      }
    })
  }

  getCustomerData() {
    this.commonService.getRequest(ApiConstant.CRM_LEAD_CUSTOMER).subscribe((res) => {
      if (res.Code === 1000 && !this.commonService.isEmpty(res.Data) && !this.commonService.isEmpty(res.Data.GetLeadCustomerList)) {
        this.customerData = [...res.Data.GetLeadCustomerList]
      }
    })
  }

  getOrderRequestList() {
    const query = {
      Page: this.p,
      Size: this.itemsPerPage,
      SearchText: this.commonService.isEmpty(this.searchText) ? '' : this.searchText,
      FromDate: this.gs.clientToSqlDateFormat(this.fromDateValue, this._settings.dateFormat),
      EndDate: this.gs.clientToSqlDateFormat(this.toDateValue, this._settings.dateFormat),
      DealerType : this.selectedDealerId === -1 ? -1 : (this.selectedDealerId ? this.selectedDealerId : 0),
      DealerId : this.selectedDealerId === -1 ? 0 : (this.selectedDealerId ? this.selectedDealerId : 0),
      CustomerId: this.selectedCustomerId ? this.selectedCustomerId : 0
    }
    this.commonService.getRequest(ApiConstant.CRM_ORDER_REQUEST_REPORT, query).subscribe((res) => {
      if (res.Code === 1000) {
        this.orderRequestList = [...res.Data.CRMOrderInfos]
        this.orderRequestList.forEach((item) => {
          item.BillDate = new Date(item.BillDate);
        })
        this.total = this.orderRequestList[0].TotalRows
      }
    })
  }

  resetSearchForm(){
    this.orderRequestSearchFormControl.resetForm()
    this.fromDateValue = ""
    this.toDateValue = ""
  }

  showDetails(item) {
    this.router.navigate([`crm/order-request-details/${item.Id}/${item.ParentTypeId}`])
  }

  gotoFollowUp(item) {
    this.router.navigate([`crm/lead/${item.Id}`])
  }
}
