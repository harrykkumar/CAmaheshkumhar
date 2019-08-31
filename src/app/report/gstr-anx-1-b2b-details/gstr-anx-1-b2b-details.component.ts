import { Settings } from './../../shared/constants/settings.constant';
import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash'
import { GlobalService } from 'src/app/commonServices/global.service';
import { ExcelService } from 'src/app/commonServices/excel.service';

@Component({
  selector: 'gstr-anx-one-b2b-details',
  templateUrl: './gstr-anx-1-b2b-details.component.html',
  styleUrls: ['./gstr-anx-1-b2b-details.component.css']
})
export class GstrAnx1B2bDetailsComponent implements OnInit {
  noDataFound: boolean = false;
  gstrAnx1B2bDetailSummary: Array<any> = []
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
    this.getGstrAnx1B2bDetailsList();
  }

  onPageNoChange = (event) => {
    this.pageNo = event
    this.getGstrAnx1B2bDetailsList()
  }

  onPageSizeChange = (event) => {
    this.pageSize = event
    this.getGstrAnx1B2bDetailsList()
  }

  onLastValueChange = (event) => {
    this.lastItemIndex = event
  }

  export() {
    this.excelService.exportByTableId('gstr_anx_1_b2b_table', 'Gstr_Anx1_B2b_Details', 'gstrAnx1B2bDetails');
  }

  getGstrAnx1B2bDetailsList() {
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
        this.gstrAnx1B2bDetailSummary = [...res.Data.GstrAnxSalePurchases];
        this.noDataFound = false;
        this.dynamicHeaderList = [...res.Data.TaxTitleDetails];
        _.forEach(this.gstrAnx1B2bDetailSummary, (item, i) => {
          this.gstrAnx1B2bDetailSummary[i].dynamicHeaderList = JSON.parse(JSON.stringify(res.Data.TaxTitleDetails));
          _.forEach(this.gstrAnx1B2bDetailSummary[i].dynamicHeaderList, (taxItem, j) => {
                const obj = _.find([...res.Data.GstrTaxSummary], {SaleId: item.SaleId, HsnCode: item.HsnCode, TaxTitleId: taxItem.Id, RowNumber: item.RowNumber});
                if(!_.isEmpty(obj)){
                  this.gstrAnx1B2bDetailSummary[i].dynamicHeaderList[j].TaxableVal = obj.TaxableVal ? obj.TaxableVal : 0 
                  this.gstrAnx1B2bDetailSummary[i].dynamicHeaderList[j].TaxRateName = obj.TaxRateName ? obj.TaxRateName : ''
                } else {
                  this.gstrAnx1B2bDetailSummary[i].dynamicHeaderList[j].TaxableVal = 0
                  this.gstrAnx1B2bDetailSummary[i].dynamicHeaderList[j].TaxRateName = ''
                }
          })
        });
      } else {
        this.gstrAnx1B2bDetailSummary = [];
        this.noDataFound = true;
      }
    })
  }
}
