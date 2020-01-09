import { ToastrCustomService } from 'src/app/commonServices/toastr.service';
import { ApiConstant } from 'src/app/shared/constants/api';
import { BaseServices } from 'src/app/commonServices/base-services';
import { AddDealerComponent } from './../add-dealer/add-dealer.component';
import { CommonService } from './../../commonServices/commanmaster/common.services';
import { Component, OnInit, ViewContainerRef, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dealer',
  templateUrl: './dealer.component.html',
  styleUrls: ['./dealer.component.css']
})
export class DealerComponent implements OnInit {
  @ViewChild('addDealerContainerRef', { read: ViewContainerRef }) addDealerContainerRef: ViewContainerRef;
  addDealerRef: any;
  dealerList: Array<any> = [];
  p: number = 1
  itemsPerPage: number = 20
  total: number = 0
  lastItemIndex: number = 0
  searchText: any;
  constructor(
    private commonService: CommonService,
    private router: Router,
    private resolver: ComponentFactoryResolver,
    private baseService: BaseServices,
    private toaster: ToastrCustomService
  ) {
    this.getDealerList()
  }

  ngOnInit() {
  }

  getDealerList() {
    const query = {
      Page: this.p,
      Size: this.itemsPerPage,
      SearchText: this.commonService.isEmpty(this.searchText) ? '' : this.searchText,
    }
    this.commonService.getRequest(ApiConstant.DEALER_REGISTRATION, query).subscribe((res) => {
      if (res.Code === 1000) {
        this.dealerList = [...res.Data]
        this.total = this.dealerList[0].TotalRows
      }
    })
  }

  addDealer(item?) {
    this.commonService.loadModalDynamically(this, 'addDealerContainerRef', 'addDealerRef', AddDealerComponent,
      (res) => {
        this.getDealerList();
      }, item);
  }

  deleteDealer(index,id){
    this.baseService.deleteRequest(`${ApiConstant.DEALER_REGISTRATION}?Id=${id}`).subscribe((res) => {
      if(res.Code === 5018) {
        this.toaster.showSuccess('Removed Success', '')
        this.dealerList.splice(index, 1);
      } else {
        this.toaster.showError(res.Message, '')
      }
    })
  }

}
