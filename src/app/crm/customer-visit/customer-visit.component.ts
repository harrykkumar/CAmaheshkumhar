import { ToastrCustomService } from 'src/app/commonServices/toastr.service';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { ApiConstant } from 'src/app/shared/constants/api';
import { ViewMapComponent } from '../view-map/view-map.component';

@Component({
  selector: 'app-customer-visit',
  templateUrl: './customer-visit.component.html',
  styleUrls: ['./customer-visit.component.css']
})
export class CustomerVisitComponent implements OnInit {
  @ViewChild('viewMapContainerRef', { read: ViewContainerRef }) viewMapContainerRef: ViewContainerRef;
  viewMapRef: any;
  customerVisitList: Array<any> = [];
  p: number = 1
  itemsPerPage: number = 20
  total: number = 0
  lastItemIndex: number = 0
  searchText: any;
  constructor(
    public commonService: CommonService,
    private router: Router,
    private toaster: ToastrCustomService,
    private resolver: ComponentFactoryResolver,
  ) {
    this.getCustomerVisitList()
  }

  ngOnInit() {
  }

  getCustomerVisitList(item?) {
    const query = {
      Id: this.commonService.isEmpty(item) ? 0 : item.Id,
      Page: this.p,
      Size: this.itemsPerPage,
      SearchText: this.commonService.isEmpty(this.searchText) ? '' : this.searchText,
      // LoginID
      IsAdmin: 1
    }
    this.commonService.getRequest(ApiConstant.CUSTOMER_VISIT, query).subscribe((res) => {
      if (res.Code === 1000 && !this.commonService.isEmpty(res.Data) && !this.commonService.isEmpty(res.Data.GetLeadLeadStartEndMeetingList)) {
        if (!this.commonService.isEmpty(item)) {
          this.viewMap(res.Data.GetLeadLeadStartEndMeetingList);
        } else {
          this.customerVisitList = [...res.Data.GetLeadLeadStartEndMeetingList]
          this.total = this.customerVisitList[0].TotalRows
        }
      } else {
        if (!this.commonService.isEmpty(item)) {
          this.toaster.showError('No Coordinates Availabel', '')
        }
      }
    })
  }

  viewMap(Data) {
    this.commonService.loadModalDynamically(this, 'viewMapContainerRef', 'viewMapRef', ViewMapComponent,
      (res) => {
      }, Data);
  }
}
