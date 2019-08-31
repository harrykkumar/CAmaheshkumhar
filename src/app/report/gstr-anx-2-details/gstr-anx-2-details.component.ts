import { ActivatedRoute } from '@angular/router';
import { Settings } from 'src/app/shared/constants/settings.constant';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash'
import { GlobalService } from 'src/app/commonServices/global.service';
import { ExcelService } from 'src/app/commonServices/excel.service';
declare var $: any
@Component({
  selector: 'app-gstr-anx-two-details',
  templateUrl: './gstr-anx-2-details.component.html',
  styleUrls: ['./gstr-anx-2-details.component.css']
})
export class GstrAnxTwoDetailsComponent implements OnInit {
  noDataFound: boolean = false;
  gstrAnx2DetailSummary: Array<any> = []
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
    private route: ActivatedRoute,
    private gs: GlobalService,
    private excelService: ExcelService
  ) {
    this.clientDateFormat = this._settings.dateFormat
    // this.model.fromDatevalue = this.gs.utcToClientDateFormat(new Date(2019, 3, 1), this.clientDateFormat);
    // this.model.toDateValue = this.gs.utcToClientDateFormat(new Date(), this.clientDateFormat);
    this.model.fromDatevalue = this.gs.utcToClientDateFormat(this._settings.finFromDate, this._settings.dateFormat)
    this.model.toDateValue = this.gs.utcToClientDateFormat(this._settings.finToDate, this._settings.dateFormat)
    this.route.queryParamMap.subscribe((params) => {
      this.model.Type = params.get('Type');
      this.model.ReportFor = params.get('ReportFor');
      if (params.get('FromDate')) {
        this.model.fromDatevalue = params.get('FromDate')
      }
      if (params.get('ToDate')) {
        this.model.toDateValue = params.get('ToDate')
      }
    })
  }

  ngOnInit() {
    this.getGstrAnx2DetailsList();
  }

  onPageNoChange = (event) => {
    this.pageNo = event
    this.getGstrAnx2DetailsList()
  }

  onPageSizeChange = (event) => {
    this.pageSize = event
    this.getGstrAnx2DetailsList()
  }

  onLastValueChange = (event) => {
    this.lastItemIndex = event
  }

  export() {
    this.excelService.exportByTableId('gstr_anx_2_detail_table', 'Gstr_Anx2_Details', 'gstrAnx2Details');
  }

  getGstrAnx2DetailsList() {
    const fromDate = this.gs.convertToSqlFormat(this.model.fromDatevalue)
    const toDate = this.gs.convertToSqlFormat(this.model.toDateValue)
    const data = {
      Type: this.model.Type,
      ReportFor: this.model.ReportFor,
      FromDate: fromDate,
      ToDate: toDate
    };
    this.commonService.getGstrAnxDetails(data).subscribe((res) => {
      if (res.Code === 1000 && !_.isEmpty(res.Data) && !_.isEmpty(res.Data.GstrAnxSalePurchases)) {
        this.gstrAnx2DetailSummary = [...res.Data.GstrAnxSalePurchases];
        this.noDataFound = false;
        this.dynamicHeaderList = [...res.Data.TaxTitleDetails];
        _.forEach(this.gstrAnx2DetailSummary, (item, i) => {
          this.gstrAnx2DetailSummary[i].dynamicHeaderList = JSON.parse(JSON.stringify(res.Data.TaxTitleDetails));
          _.forEach(this.gstrAnx2DetailSummary[i].dynamicHeaderList, (taxItem, j) => {
            const obj = _.find([...res.Data.GstrTaxSummary], { SaleId: item.SaleId, HsnCode: item.HsnCode, TaxTitleId: taxItem.Id, RowNumber: item.RowNumber });
            if (!_.isEmpty(obj)) {
              this.gstrAnx2DetailSummary[i].dynamicHeaderList[j].TaxableVal = obj.TaxableVal ? obj.TaxableVal : 0
              this.gstrAnx2DetailSummary[i].dynamicHeaderList[j].TaxRateName = obj.TaxRateName ? obj.TaxRateName : ''
            } else {
              this.gstrAnx2DetailSummary[i].dynamicHeaderList[j].TaxableVal = 0
              this.gstrAnx2DetailSummary[i].dynamicHeaderList[j].TaxRateName = ''
            }
          })
        });
      } else {
        this.gstrAnx2DetailSummary = [];
        this.noDataFound = true;
      }
    })
  }
}
