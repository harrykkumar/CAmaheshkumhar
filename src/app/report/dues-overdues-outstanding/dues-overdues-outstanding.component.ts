import { Settings } from './../../shared/constants/settings.constant';
import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/commonServices/global.service';
import { ExcelService } from 'src/app/commonServices/excel.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash'
@Component({
  selector: 'app-dues-overdues-outstanding',
  templateUrl: './dues-overdues-outstanding.component.html',
  styleUrls: ['./dues-overdues-outstanding.component.css']
})
export class DuesOverduesOutstandingComponent implements OnInit {
  overDueList: Array<any> = []
  ledgerData: Array<any> = []
  reportForData: Array<any> = ['OverDue', 'Upcomming']
  typeData: Array<any> = ['Sale', 'Purchase']
  clientDateFormat: any
  model: any = {};
  lastItemIndex: number = 0
  pageSize: number = 20
  pageNo: number = 1
  totalItemSize: number = 0
  constructor(
    private commonService: CommonService,
    public _settings: Settings,
    private router: Router,
    private gs: GlobalService,
    private excelService: ExcelService,
    private spinner: NgxSpinnerService
  ) {
    this.commonService.getLedgerData(2).subscribe((res) => {
      if (!_.isEmpty(res) && !_.isEmpty(res.Data) && !_.isEmpty(res.Data.LedgerExtra)) {
        this.ledgerData = [...res.Data.LedgerExtra];
      }
    })
    this.model.reportFor = this.reportForData[0]
    this.model.typeValue = this.typeData[0]
    this.clientDateFormat = this._settings.dateFormat
    this.model.fromDatevalue = this.gs.utcToClientDateFormat(new Date(2019, 3, 1), this.clientDateFormat);
    this.model.toDateValue = this.gs.utcToClientDateFormat(new Date(2020,2,31), this.clientDateFormat);
  }

  ngOnInit() {
    this.getDuesList();
  }

  onPageNoChange = (event) => {
    this.pageNo = event
    this.getDuesList()
  }

  onPageSizeChange = (event) => {
    this.pageSize = event
    this.getDuesList()
  }

  onLastValueChange = (event) => {
    this.lastItemIndex = event
  }

  getDuesList() {
    this.spinner.show()
    let fromDate, toDate
    if (this.model.fromDatevalue) {
      fromDate = this.gs.convertToSqlFormat(this.model.fromDatevalue)
    }
    if (this.model.toDateValue) {
      toDate = this.gs.convertToSqlFormat(this.model.toDateValue)
    }
    const data = {
      ReportFor:  this.model.reportFor ? this.model.reportFor : 0,
      ReportType: 'DUE',
      Type: this.model.typeValue,
      FromDate: fromDate,
      ToDate: toDate,
      LedgerId: this.model.LedgerId ? this.model.LedgerId : 0
    };
    this.commonService.getMsmedList(data).subscribe((res) => {
      if (res.Code === 1000 && !_.isEmpty(res.Data) && !_.isEmpty(res.Data.OutstandingDetails)) {
        this.overDueList = [...res.Data.OutstandingDetails];
      } else {
        this.overDueList = []
      }
      this.spinner.hide()
    })
  }

  navigateTo(item) {
    this.router.navigate([`report/msmed-outstanding/${item.Id}/details`],
      {
        queryParams: {
          LedgerId: this.model.LedgerId ? this.model.LedgerId : 0,
          ReportFor: this.model.reportFor ? this.model.reportFor : 0,
          FromDate: this.model.fromDatevalue,
          ToDate: this.model.toDateValue,
          ReportType: 'DUE',
          Type: this.model.typeValue ? this.model.typeValue : ''
        }
      });
  }

  
  export() {
    this.excelService.exportByTableId('due_overdue_table', 'OverDue_Summary', 'overDue');
  }
}
