import { Settings } from 'src/app/shared/constants/settings.constant';
import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/app/commonServices/global.service';
import { ExcelService } from 'src/app/commonServices/excel.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash'

@Component({
  selector: 'app-msmed-outstanding-details',
  templateUrl: './msmed-outstanding-details.component.html',
  styleUrls: ['./msmed-outstanding-details.component.css']
})
export class MsmedOutstandingDetailsComponent implements OnInit {
  noDataFound: boolean = false;
  msmedDetailsDataList: Array<any> = []
  ledgerData: Array<any> = []
  reportForData: Array<any> = ['OverDue', 'Upcomming']
  clientDateFormat: any
  model: any = {};
  lastItemIndex: number = 0
  pageSize: number = 20
  pageNo: number = 1
  totalItemSize: number = 0
  msmedId: string;
  constructor(
    private commonService: CommonService,
    public _settings: Settings,
    private gs: GlobalService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute
  ) {
    this.commonService.getLedgerData(1).subscribe((res) => {
      if (!_.isEmpty(res) && !_.isEmpty(res.Data) && !_.isEmpty(res.Data.LedgerExtra)) {
        this.ledgerData = [...res.Data.LedgerExtra];
      }
    })
    
    this.model.reportFor = this.reportForData[0]
    this.clientDateFormat = this._settings.dateFormat
    this.model.fromDatevalue = this.gs.utcToClientDateFormat(new Date(2019, 3, 1), this.clientDateFormat);
    this.model.toDateValue = this.gs.utcToClientDateFormat(new Date(2020, 2, 31), this.clientDateFormat);
    this.route.paramMap.subscribe((parmeters) => {
      this.msmedId = parmeters.get('id')
    })
    this.route.queryParamMap.subscribe((queryParmeters) => {
      if (!_.isEmpty(queryParmeters)) {
        this.model.reportFor = queryParmeters.get('ReportFor')
        this.model.fromDatevalue = queryParmeters.get('FromDate')
        this.model.toDateValue = queryParmeters.get('ToDate')
        this.model.LedgerId = queryParmeters.get('LedgerId')
      }
    })
  }

  ngOnInit() {
    this.getMsmedDetailsList();
  }

  onPageNoChange = (event) => {
    this.pageNo = event
    this.getMsmedDetailsList()
  }

  onPageSizeChange = (event) => {
    this.pageSize = event
    this.getMsmedDetailsList()
  }

  onLastValueChange = (event) => {
    this.lastItemIndex = event
  }

  getMsmedDetailsList() {
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
      ReportType: 'MSMEDDUE',
      Type: 'Purchase',
      FromDate: fromDate,
      ToDate: toDate,
      LedgerId: this.model.LedgerId ? this.model.LedgerId : 0
    };
    this.commonService.getMsmedDetailsList(data).subscribe((res) => {
      if (res.Code === 1000 && !_.isEmpty(res.Data) && !_.isEmpty(res.Data.OutstandingDetails)) {
        this.msmedDetailsDataList = [...res.Data.OutstandingDetails];
        this.noDataFound = false;
      } else {
        this.msmedDetailsDataList = []
        this.noDataFound = true;
      }
      this.spinner.hide()
    })
  }
}
