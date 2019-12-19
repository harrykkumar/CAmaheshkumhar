import { ApiConstant } from 'src/app/shared/constants/api';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
@Component({
  selector: 'app-crm-dashboard',
  templateUrl: './crm-dashboard.component.html',
  styleUrls: ['./crm-dashboard.component.css']
})
export class CrmDashboardComponent implements OnInit {
  dashboardDetails: any = {};
  SourceEnqury: Array<any> = [];
  OverdueFollowupList: Array<any> = [];
  tentativeList: Array<any> = [];

  constructor(
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.getDashboardDetails();
  }

  getDashboardDetails(){
    this.commonService.getRequest(ApiConstant.CRM_DASHBOARD).subscribe((res) => {
      if (res.Code === 1000) {
        if(!_.isEmpty(res.Data.CRMDashboard)){
          this.dashboardDetails = { ...res.Data.CRMDashboard[0] }
        }
        if(!_.isEmpty(res.Data.SourceEnqury)){
          this.SourceEnqury = JSON.parse(JSON.stringify(res.Data.SourceEnqury))
        }
        if(!_.isEmpty(res.Data.OverdueFollowupList)){
          this.OverdueFollowupList = JSON.parse(JSON.stringify(res.Data.OverdueFollowupList))
          this.tentativeList = JSON.parse(JSON.stringify(res.Data.OverdueFollowupList))
        }
      }
    })
  }

}
