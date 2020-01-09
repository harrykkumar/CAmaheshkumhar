import { NgForm } from '@angular/forms';
import { Settings } from './../../shared/constants/settings.constant';
import { GlobalService } from './../../commonServices/global.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Router } from '@angular/router';
import { BaseServices } from 'src/app/commonServices/base-services';
import { ToastrCustomService } from 'src/app/commonServices/toastr.service';
import { ApiConstant } from 'src/app/shared/constants/api';
import * as _ from 'lodash';
declare var $: any
@Component({
  selector: 'app-daily-activity-report',
  templateUrl: './daily-activity-report.component.html',
  styleUrls: ['./daily-activity-report.component.css']
})
export class DailyActivityReportComponent implements OnInit {
  @ViewChild('activitySearchFormControl') activitySearchFormControl: NgForm;
  dailyActivityData: Array<any> = [];
  dataToDisplay: Array<any> = [];
  p: number = 1
  itemsPerPage: number = 20
  total: number = 0
  lastItemIndex: number = 0
  searchText: any;
  fromDateValue
  toDateValue
  constructor(
    private commonService: CommonService,
    private router: Router,
    private baseService: BaseServices,
    private toaster: ToastrCustomService,
    private _settings: Settings,
    private gs: GlobalService,
  ) {
    this.getDailyActivityReport()
  }

  ngOnInit() {
  }

  getDailyActivityReport() {
    const query = {
      // Page: this.p,
      // Size: this.itemsPerPage,
      FromDate: this.gs.clientToSqlDateFormat(this.fromDateValue, this._settings.dateFormat),
      EndDate: this.gs.clientToSqlDateFormat(this.toDateValue, this._settings.dateFormat),
      // CustomerId
      SearchText: this.commonService.isEmpty(this.searchText) ? '' : this.searchText,
    }
    this.commonService.getRequest(ApiConstant.GET_DAILY_ACTIVITY_REPORT, query).subscribe((res) => {
      if (res.Code === 1000 && !_.isEmpty(res.Data) && !_.isEmpty(res.Data.GetDailyActivityCustomerList)) {
        this.dailyActivityData = [...res.Data.GetDailyActivityCustomerList]
        this.GroupDataBy('CustomerId')
        this.addRemoveClass('groupByCustomerId', 'groupBySourceId')
        this.total = this.dailyActivityData[0].TotalRows
      } else {
        this.dailyActivityData = []
      }
    })
  }

  GroupDataBy(type){
    this.dataToDisplay = _.map(_.groupBy(this.dailyActivityData, type), (item, key) => {
      const ncFcCount = _.countBy(item, 'CallType')
      return {
        'id': key,
        'name': type === 'CustomerId' ? item[0].OrgName : item[0].SourceName,
        'items': [...item],
        'ncCount': ncFcCount.NC,
        'fcCount': ncFcCount.FC
      }
    })
  }

  addRemoveClass(addElementId, removeElementId) {
    $(`#${addElementId}`).addClass('active')
    $(`#${removeElementId}`).removeClass('active')
    return true;
  }

  resetSearchForm(){
    this.activitySearchFormControl.resetForm()
    this.fromDateValue = ""
    this.toDateValue = ""
  }
}
