import { Settings } from 'src/app/shared/constants/settings.constant';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/commonServices/global.service';
import { ExcelService } from 'src/app/commonServices/excel.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash'
import * as XLSX from 'xlsx'

@Component({
  selector: 'app-msmed-outstanding',
  templateUrl: './msmed-outstanding.component.html',
  styleUrls: ['./msmed-outstanding.component.css']
})
export class MsmedOutstandingComponent implements OnInit {
  noDataFound: boolean = false;
  msmedDataList: Array<any> = []
  ledgerData: Array<any> = []
  reportForData: Array<any> = ['OverDue', 'Upcomming']
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
    this.commonService.getLedgerData(1).subscribe((res) => {
      if (!_.isEmpty(res) && !_.isEmpty(res.Data) && !_.isEmpty(res.Data.LedgerExtra)) {
        this.ledgerData = [...res.Data.LedgerExtra];
      }
    })
    this.model.reportFor = this.reportForData[0]
    this.clientDateFormat = this._settings.dateFormat
    this.model.fromDatevalue = this.gs.utcToClientDateFormat(new Date(2019, 3, 1), this.clientDateFormat);
    this.model.toDateValue = this.gs.utcToClientDateFormat(new Date(2020,2,31), this.clientDateFormat);
  }

  ngOnInit() {
    this.getMsmedList();
  }

  onPageNoChange = (event) => {
    this.pageNo = event
    this.getMsmedList()
  }

  onPageSizeChange = (event) => {
    this.pageSize = event
    this.getMsmedList()
  }

  onLastValueChange = (event) => {
    this.lastItemIndex = event
  }

  getMsmedList() {
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
    this.commonService.getMsmedList(data).subscribe((res) => {
      if (res.Code === 1000 && !_.isEmpty(res.Data) && !_.isEmpty(res.Data.OutstandingDetails)) {
        this.msmedDataList = [...res.Data.OutstandingDetails];
        this.noDataFound = false;
      } else {
        this.msmedDataList = []
        this.noDataFound = true;
      }
      this.spinner.hide()
    })
  }

  navigateTo(item) {
      this.router.navigate([`report/msmed-outstanding/${item.Id}/details`],
        {
          queryParams: {
            LedgerId: this.model.LedgerId ? this.model.LedgerId : 0,            
            ReportFor:  this.model.reportFor ? this.model.reportFor : 0,            
            FromDate: this.model.fromDatevalue,
            ToDate: this.model.toDateValue
          }
        });
  }
}
