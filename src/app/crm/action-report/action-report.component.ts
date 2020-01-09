import { ApiConstant } from 'src/app/shared/constants/api';
import { CommonService } from './../../commonServices/commanmaster/common.services';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-action-report',
  templateUrl: './action-report.component.html',
  styleUrls: ['./action-report.component.css']
})
export class ActionReportComponent implements OnInit {
  searchText:any
  p: number = 1
  itemsPerPage: number = 20
  total: number = 0
  lastItemIndex: number = 0
  actionData: Array<any> = []
  constructor(
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.getActionData()
  }

  getActionData() {
    const query = {
      Page: this.p,
      Size: this.itemsPerPage,
      SearchText: this.commonService.isEmpty(this.searchText) ? '' : this.searchText,
    }
    this.commonService.getRequest(ApiConstant.CRM_ACTION_REPORT, query).subscribe((res) => {
      if (res.Code === 1000 && !this.commonService.isEmpty(res.Data) && !this.commonService.isEmpty(res.Data.ActionDetails)) {
        this.actionData = [...res.Data.ActionDetails]
        this.actionData.forEach((item) => {
          item.ActionOn = new Date(item.ActionOn);
        })
        this.total = this.actionData[0].TotalRows
      }
    })
  }

}
