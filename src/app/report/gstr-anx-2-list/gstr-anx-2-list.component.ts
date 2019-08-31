import { Settings } from 'src/app/shared/constants/settings.constant';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash'
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/commonServices/global.service';
import { ExcelService } from 'src/app/commonServices/excel.service';

@Component({
  selector: 'gstr-anx-two-list',
  templateUrl: './gstr-anx-2-list.component.html',
  styleUrls: ['./gstr-anx-2-list.component.css']
})
export class GstrAnx2ListComponent implements OnInit {
  noDataFound: boolean = false;
  gstrAnxTwoSummary: Array<any> = []
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
    private excelService: ExcelService
  ) {
    this.clientDateFormat = this._settings.dateFormat
    // this.model.fromDatevalue = this.gs.utcToClientDateFormat(new Date(2019, 3, 1), this.clientDateFormat);
    // this.model.toDateValue = this.gs.utcToClientDateFormat(new Date(), this.clientDateFormat);

    this.model.fromDatevalue = this.gs.utcToClientDateFormat(this._settings.finFromDate, this._settings.dateFormat)
    this.model.toDateValue = this.gs.utcToClientDateFormat(this._settings.finToDate, this._settings.dateFormat)

  }

  ngOnInit() {
    this.getGstrAnxTwoList()
  }

  onPageNoChange = (event) => {
    this.pageNo = event
    this.getGstrAnxTwoList()
  }

  onPageSizeChange = (event) => {
    this.pageSize = event
    this.getGstrAnxTwoList()
  }

  onLastValueChange = (event) => {
    this.lastItemIndex = event
  }

  getGstrAnxTwoList() {
    const fromDate = this.gs.convertToSqlFormat(this.model.fromDatevalue)
    const toDate = this.gs.convertToSqlFormat(this.model.toDateValue)
    const data = {
      Type: 'Purchase',
      FromDate: fromDate,
      ToDate: toDate
    };
    this.commonService.getGstrAnxList(data).subscribe((res) => {
      if (res.Code === 1000 && !_.isEmpty(res.Data) && !_.isEmpty(res.Data.GstrAnxs)) {
        this.gstrAnxTwoSummary = [...res.Data.GstrAnxs];
        this.noDataFound = false;
        this.dynamicHeaderList = [...res.Data.TaxTitleDetails];
        _.forEach(this.gstrAnxTwoSummary, (item, i) => {
          const data = _.find(res.Data.GstrRecords, { Rank: item.Rank });
          if (!_.isEmpty(data)) {
            this.gstrAnxTwoSummary[i].NoOfRecord = data.NoOfRecord ? data.NoOfRecord : 0
            this.gstrAnxTwoSummary[i].TaxableVal = data.TaxableVal ? data.TaxableVal : 0
          } else {
            this.gstrAnxTwoSummary[i].NoOfRecord = 0
            this.gstrAnxTwoSummary[i].TaxableVal = 0
          }
          this.gstrAnxTwoSummary[i].dynamicHeaderList = JSON.parse(JSON.stringify(res.Data.TaxTitleDetails));
          _.forEach(this.gstrAnxTwoSummary[i].dynamicHeaderList, (taxItem, j) => {
            const obj = _.find([...res.Data.GstrTaxSummary], { Rank: item.Rank, TaxTitleId: taxItem.Id });
            if (!_.isEmpty(obj)) {
              this.gstrAnxTwoSummary[i].dynamicHeaderList[j].TaxableVal = obj.TaxableVal ? obj.TaxableVal : 0
              this.gstrAnxTwoSummary[i].dynamicHeaderList[j].TaxRateName = obj.TaxRateName ? obj.TaxRateName : ''
            } else {
              this.gstrAnxTwoSummary[i].dynamicHeaderList[j].TaxableVal = 0
              this.gstrAnxTwoSummary[i].dynamicHeaderList[j].TaxRateName = ''
            }
          })
        });
      } else {
        this.gstrAnxTwoSummary = []
        this.noDataFound = true;
      }
    })
  }

  navigateTo(item) {
    this.router.navigate([`report/gstr-anx-2-details`],
      {
        queryParams: {
          Type: item.Type,
          ReportFor: item.ShortName,
          FromDate: this.model.fromDatevalue,
          ToDate: this.model.toDateValue
        }
      });
  }

  export() {
    this.excelService.exportByTableId('gstr_anx_2_table', 'Gstr_Anx2_Summary', 'gstrAnx2Summary');
    // this.excelService.generateExcel(this.saleRegister.OrganizationDetails[0].OrgName,
    //   this.saleRegister.AddressDetails[0].CityName + ' ' +
    //   this.saleRegister.AddressDetails[0].StateName + ' ' + this.saleRegister.AddressDetails[0].CountryName, this.ExcelHeaders,
    //   this.mainDataExcel, 'Sale Register Report', this.model.fromDatevalue, this.model.toDateValue)

  }
}
