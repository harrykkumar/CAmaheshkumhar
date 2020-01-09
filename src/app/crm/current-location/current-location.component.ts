import { ViewMapComponent } from './../view-map/view-map.component';
import { ApiConstant } from 'src/app/shared/constants/api';
import { CommonService } from './../../commonServices/commanmaster/common.services';
import { Component, OnInit, ViewContainerRef, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-current-location',
  templateUrl: './current-location.component.html',
  styleUrls: ['./current-location.component.css']
})
export class CurrentLocationComponent implements OnInit {
  @ViewChild('viewMapContainerRef', { read: ViewContainerRef }) viewMapContainerRef: ViewContainerRef;
  viewMapRef: any;
  currentLocationList: Array<any> = [];
  p: number = 1
  itemsPerPage: number = 20
  total: number = 0
  lastItemIndex: number = 0
  searchText: any;
  constructor(
    private commonService: CommonService,
    private router: Router,
    private resolver: ComponentFactoryResolver,
  ) {
    this.getCurrentLocationList()
  }

  ngOnInit() {
  }

  getCurrentLocationList() {
    const query = {
      Page: this.p,
      Size: this.itemsPerPage,
      SearchText: this.commonService.isEmpty(this.searchText) ? '' : this.searchText,
    }
    this.commonService.getRequest(ApiConstant.CURRENT_LOCATION, query).subscribe((res) => {
      if (res.Code === 1000) {
        this.currentLocationList = [...res.Data.GetUserCurrentLocationList]
        this.total = this.currentLocationList[0].TotalRows
      }
    })
  }

  viewMap(item?) {
    this.commonService.loadModalDynamically(this, 'viewMapContainerRef', 'viewMapRef', ViewMapComponent,
      (res) => {

      }, item);
  }
}
