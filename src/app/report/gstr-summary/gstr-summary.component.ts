import { Settings } from 'src/app/shared/constants/settings.constant';
import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/commonServices/global.service';
import { ExcelService } from 'src/app/commonServices/excel.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash'

@Component({
  selector: 'app-gstr-summary',
  templateUrl: './gstr-summary.component.html',
  styleUrls: ['./gstr-summary.component.css']
})
export class GstrSummaryComponent implements OnInit {
  reportForList = ['B2C', 'B2B']
  gstrList: Array<any> = []
  model: any = {};
  dynamicHeaderList: any[];
  constructor(
    private commonService: CommonService,
    public _settings: Settings,
    private gs: GlobalService,
    private spinner: NgxSpinnerService
  ) {
    this.model.selectedReportFor = 'B2B'
    this.model.fromDatevalue = this.gs.utcToClientDateFormat(this._settings.finFromDate, this._settings.dateFormat)
    this.model.toDateValue = this.gs.utcToClientDateFormat(this._settings.finToDate, this._settings.dateFormat)
   }

  ngOnInit() {
    this.getGstrSummaryList();
  }

  getGstrSummaryList(){
    const query = {
      Type : 'BillWise',
      ReportFor: this.model.selectedReportFor,
      FromDate: this.gs.clientToSqlDateFormat(this.model.fromDatevalue, this._settings.dateFormat),
      ToDate: this.gs.clientToSqlDateFormat(this.model.toDateValue, this._settings.dateFormat)
    }
    this.spinner.show();
    this.commonService.getGstrSummaryList(query).subscribe((res) => {
      if (res.Code === 1000 && !_.isEmpty(res.Data) && !_.isEmpty(res.Data.Gstr3BDetails)) {
        this.gstrList = [...res.Data.Gstr3BDetails];
        this.dynamicHeaderList = [...res.Data.TaxTitleDetails];
        _.forEach(this.gstrList, (item, i) => {
          this.gstrList[i].dynamicHeaderList = JSON.parse(JSON.stringify(res.Data.TaxTitleDetails));
          _.forEach(this.gstrList[i].dynamicHeaderList, (taxItem, j) => {
            const obj = _.find(res.Data.ItemTaxTrans, { ItemTransId: item.Id, TaxTitleId: taxItem.TaxTitleId });
            if (!_.isEmpty(obj)) {
              this.gstrList[i].dynamicHeaderList[j].TaxRate = obj.TaxRate ? obj.TaxRate : 0
              this.gstrList[i].dynamicHeaderList[j].Amount = obj.Amount ? obj.Amount : 0
              this.gstrList[i].dynamicHeaderList[j].TaxRateName = obj.TaxRateName ? obj.TaxRateName : ''
            } else {
              this.gstrList[i].dynamicHeaderList[j].TaxRate = 0
              this.gstrList[i].dynamicHeaderList[j].Amount = 0
              this.gstrList[i].dynamicHeaderList[j].TaxRateName = ''
            }
          })
        });
      } else {
        this.gstrList = []
      }
      this.spinner.hide();
    })
  }

}
