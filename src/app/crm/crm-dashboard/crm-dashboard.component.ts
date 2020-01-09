import { Router } from '@angular/router';
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
  dashboardDetails: any
  SourceEnqury: Array<any>
  OverdueFollowupList: Array<any>
  TantativeList: Array<any>
  constructor(
    private commonService: CommonService,
    private router: Router
  ) {
    this.getDashboardDetails();
  }

  ngOnInit() {
  }

  getDashboardDetails(){
    this.commonService.getRequest(ApiConstant.CRM_DASHBOARD).subscribe((res) => {
      if (res.Code === 1000) {
        if(!_.isEmpty(res.Data.CRMDashboard)){
          this.dashboardDetails = { ...res.Data.CRMDashboard[0] }
        }
        if(!_.isEmpty(res.Data.SourceEnqury)){
          this.SourceEnqury = [...res.Data.SourceEnqury]
        }
        if(!_.isEmpty(res.Data.OverdueFollowupList)){
          this.OverdueFollowupList = [...res.Data.OverdueFollowupList]
          console.log(this.OverdueFollowupList);
        }
        if(!_.isEmpty(res.Data.TantativeList)){
          this.TantativeList = [...res.Data.TantativeList]
        }
      }
    })
  }

  navigateTo(value) {
    if (value === 'source') {
      this.router.navigate(['crm/lead'])
    } else if (value === 'overdue') {
      this.router.navigate(['crm/follow-up'], { queryParams: { type: value } })
    } else if (value === 'tentative') {
      this.router.navigate(['crm/follow-up'], { queryParams: { type: value } })
    }
  }

}
