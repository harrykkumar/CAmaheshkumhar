import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Injectable } from '@angular/core';
import { ApiConstant } from '../shared/constants/api';
import * as _ from 'lodash';
@Injectable({
  providedIn: 'root'
})
export class CrmService {
  leadUtilityData: any = {}
  constructor(
    private commonService: CommonService
  ) {
    this.getLeadUtility()
  }

  getLeadUtility(){
    return new Promise((resolve, reject) => {
      this.commonService.getRequest(ApiConstant.CRM_UTILITY).subscribe((res) => {
        if (res.Code === 1000 && !_.isEmpty(res.Data)) {
          this.leadUtilityData = { ...res.Data }
          _.forEach(this.leadUtilityData.LeadCustomer, (item) => {
            item.textToDisplay = `${item.Customer},  ${item.ContactNo},  ${item.Email}`
          })
          resolve();
        }
      })
    })
  }

  convertFromRequestTime(time) {
    const d = new Date();
    if (_.includes(time, 'AM')) {
      time = time.replace('AM', '');
      time = time.split(':');
      d.setHours(time[0], time[1]);
    } else if (_.includes(time, 'PM')) {
      time = time.replace('PM', '');
      time = time.split(':');
      d.setHours((12 + time[0]), time[1]);
    }
    return d;
  }
}
