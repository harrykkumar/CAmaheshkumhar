import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Component, OnInit } from '@angular/core';
import { Settings } from 'src/app/shared/constants/settings.constant';
import * as _ from 'lodash'
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/commonServices/global.service';
import * as XLSX from 'xlsx'
import { ExcelService } from 'src/app/commonServices/excel.service';
declare var $: any

@Component({
  selector: 'gstr-anx-one-list',
  templateUrl: './gstr-anx-1-list.component.html',
  styleUrls: ['./gstr-anx-1-list.component.css']
})
export class GstrAnx1ListComponent implements OnInit {
  noDataFound: boolean = false;
  gstrAnxOneSummary: Array<any> = []
  dynamicHeaderList: Array<any> = []
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
    this.clientDateFormat = this._settings.dateFormat
    // this.model.fromDatevalue = this.gs.utcToClientDateFormat(new Date(2019, 3, 1), this.clientDateFormat);
    // this.model.toDateValue = this.gs.utcToClientDateFormat(new Date(), this.clientDateFormat);
    this.model.fromDatevalue = this.gs.utcToClientDateFormat(this._settings.finFromDate, this._settings.dateFormat)
    this.model.toDateValue = this.gs.utcToClientDateFormat(this._settings.finToDate, this._settings.dateFormat)
  }

  ngOnInit() {
    this.getGstrAnxOneList();
  }

  onPageNoChange = (event) => {
    this.pageNo = event
    this.getGstrAnxOneList()
  }

  onPageSizeChange = (event) => {
    this.pageSize = event
    this.getGstrAnxOneList()
  }

  onLastValueChange = (event) => {
    this.lastItemIndex = event
  }

  getGstrAnxOneList() {
    const fromDate = this.gs.convertToSqlFormat(this.model.fromDatevalue)
    const toDate = this.gs.convertToSqlFormat(this.model.toDateValue)
    const data = {
      Type: 'Sale',
      FromDate: fromDate,
      ToDate: toDate
    };
    this.commonService.getGstrAnxList(data).subscribe((res) => {
      if (res.Code === 1000 && !_.isEmpty(res.Data) && !_.isEmpty(res.Data.GstrAnxs)) {
        this.gstrAnxOneSummary = [...res.Data.GstrAnxs];
        this.noDataFound = false;
        this.dynamicHeaderList = [...res.Data.TaxTitleDetails];
        _.forEach(this.gstrAnxOneSummary, (item, i) => {
          const data = _.find(res.Data.GstrRecords, { Rank: item.Id });
          if (!_.isEmpty(data)) {
            this.gstrAnxOneSummary[i].NoOfRecord = data.NoOfRecord ? data.NoOfRecord : 0
            this.gstrAnxOneSummary[i].TaxableVal = data.TaxableVal ? data.TaxableVal : 0
          } else {
            this.gstrAnxOneSummary[i].NoOfRecord =  0
            this.gstrAnxOneSummary[i].TaxableVal =  0
          }
          this.gstrAnxOneSummary[i].dynamicHeaderList = JSON.parse(JSON.stringify(res.Data.TaxTitleDetails));
          _.forEach(this.gstrAnxOneSummary[i].dynamicHeaderList, (taxItem, j) => {
                const obj = _.find([...res.Data.GstrTaxSummary], {Rank: item.Id, TaxTitleId: taxItem.Id});
                if(!_.isEmpty(obj)){
                  this.gstrAnxOneSummary[i].dynamicHeaderList[j].TaxableVal = obj.TaxableVal ? obj.TaxableVal : 0
                  this.gstrAnxOneSummary[i].dynamicHeaderList[j].TaxRateName = obj.TaxRateName ? obj.TaxRateName : ''
                } else {
                  this.gstrAnxOneSummary[i].dynamicHeaderList[j].TaxableVal = 0
                  this.gstrAnxOneSummary[i].dynamicHeaderList[j].TaxRateName = ''
                }
          })
        });
      } else {
        this.gstrAnxOneSummary = []
        this.noDataFound = true;
      }
    })
  }

  navigateTo(item) {
    if (item.ShortName === 'B2C') {
      this.router.navigate(['report/gstr-anx-1-b2c-details'],
        {
          queryParams: {
            Type: item.Type,
            ReportFor: item.ShortName,
            FromDate: this.model.fromDatevalue,
            ToDate: this.model.toDateValue
          }
        });
    } else if (item.ShortName === 'B2B') {
      this.router.navigate(['report/gstr-anx-1-b2b-details'],
        {
          queryParams: {
            Type: item.Type,
            ReportFor: item.ShortName,
            FromDate: this.model.fromDatevalue,
            ToDate: this.model.toDateValue
          }
        });
    }
  }

  export() {
    this.excelService.exportByTableId('gstr_anx_1_table', 'Gstr_Anx1_Summary', 'gstrAnx1Summary');
  }

  async exportMultiPleSheet() {
    this.spinner.show();
    const workbook = XLSX.utils.book_new();
    const sheet1 = XLSX.utils.table_to_sheet(document.getElementById('gstr_anx_1_table'));
    XLSX.utils.book_append_sheet(workbook, sheet1, 'Gstr_Anx1_Summary');
    await _.forEach(this.gstrAnxOneSummary, async (item, i) => {
    await  this.getdetailListToExport(item, workbook, i)
    })
    this.spinner.hide()
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    this.excelService.saveAsExcelFile(excelBuffer, 'gstrAnx1SummaryAndDetails');
  }

  getdetailListToExport(item, workbook, index) {
    new Promise((resolve, reject) => {
      const fromDate = this.gs.convertToSqlFormat(this.model.fromDatevalue)
      const toDate = this.gs.convertToSqlFormat(this.model.toDateValue)
      const data = {
        Type: item.Type,
        ReportFor: item.ShortName,
        FromDate: fromDate,
        ToDate: toDate
      };
      this.commonService.getGstrAnxDetails(data).subscribe(
        async (res) => {
         let detailListToExport = []
         if (res.Code === 1000 && !_.isEmpty(res.Data) && !_.isEmpty(res.Data.GstrAnxSalePurchases)) {
           detailListToExport = [...res.Data.GstrAnxSalePurchases];
           this.noDataFound = false;
           await _.forEach(detailListToExport, async (detailItem, i) => {
           await  _.forEach(res.Data.TaxTitleDetails, (taxItem, j) => {
                   const obj = _.find([...res.Data.GstrTaxSummary], {Rank: detailItem.Id, TaxTitleId: taxItem.Id});
                   if(!_.isEmpty(obj)){
                     detailListToExport[i].TaxRateName = obj.TaxableVal ? obj.TaxableVal : 0
                   }
             })
           });
           const sheet = XLSX.utils.json_to_sheet(detailListToExport);
           XLSX.utils.book_append_sheet(workbook, sheet, `Sheet${index +1}`);
          resolve('appended');
         }
       })
    })
  }
}
