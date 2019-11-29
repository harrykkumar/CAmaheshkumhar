import { ApiConstant } from 'src/app/shared/constants/api';
import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/commonServices/global.service';
import { ExcelService } from 'src/app/commonServices/excel.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Settings } from 'src/app/shared/constants/settings.constant';
import * as _ from 'lodash'
@Component({
  selector: 'app-gstr3b',
  templateUrl: './gstr3b.component.html',
  styleUrls: ['./gstr3b.component.css']
})
export class Gstr3bComponent implements OnInit {
  noDataFound: boolean = false;
  gstr3BList: Array<any> = []
  gstr3BListByType:Array<any> = [
    {
      type :'GSTR3B1',
      title : 'Tax on outward and reverse charge inward supplies',
      items : []
    },
    {
      type :'GSTR3B2',
      title : 'Inter-state supplies',
      items : []
    },
    {
      type :'GSTR3B3',
      title : 'Eligible ITC',
      items : []
    },
    {
      type :'GSTR3B4',
      title : 'Exempt, nil and Non GST inward supplies',
      items : []
    }
  ]
  dynamicHeaderList: Array<any> = []
  clientDateFormat: any
  model: any = {};
  lastItemIndex: number = 0
  pageSize: number = 20
  pageNo: number = 1
  totalItemSize: number = 0
  orgDetails: any;
  constructor(
    private commonService: CommonService,
    public _settings: Settings,
    private router: Router,
    private gs: GlobalService,
    private excelService: ExcelService,
    private spinner: NgxSpinnerService,
  ) {
    this.clientDateFormat = this._settings.dateFormat
    this.model.fromDatevalue = this.gs.utcToClientDateFormat(this._settings.finFromDate, this._settings.dateFormat)
    this.model.toDateValue = this.gs.utcToClientDateFormat(this._settings.finToDate, this._settings.dateFormat)
  }

  ngOnInit() {
    this.getGstr3bList();
  }

  onPageNoChange = (event) => {
    this.pageNo = event
    this.getGstr3bList()
  }

  onPageSizeChange = (event) => {
    this.pageSize = event
    this.getGstr3bList()
  }

  onLastValueChange = (event) => {
    this.lastItemIndex = event
  }

  getGstr3bList() {
    this.spinner.show();
    let fromDate = this.gs.clientToSqlDateFormat(this.model.fromDatevalue, this.clientDateFormat)
    let toDate = this.gs.clientToSqlDateFormat(this.model.toDateValue, this.clientDateFormat)
    const query = {
      FromDate: fromDate,
      ToDate: toDate
    };
    this.commonService.getRequest(ApiConstant.GSTR_3B, query).subscribe((res) => {
      if (res.Code === 1000 && !_.isEmpty(res.Data) ) {
        if(!this.commonService.isEmpty(res.Data.SaleGstrAnxs)){
          this.gstr3BList = [...res.Data.SaleGstrAnxs];
          this.noDataFound = false;
          this.dynamicHeaderList = [...res.Data.SaleTaxTitleDetails];
          _.forEach(this.gstr3BList, (item, i) => {
            const data = _.find(res.Data.SaleGstrRecords, { Rank: item.Rank, Type : item.Type });
            if (!_.isEmpty(data)) {
              this.gstr3BList[i].NoOfRecord = data.NoOfRecord ? data.NoOfRecord : 0
              this.gstr3BList[i].TaxableVal = data.TaxableVal ? data.TaxableVal : 0
            } else {
              this.gstr3BList[i].NoOfRecord =  0
              this.gstr3BList[i].TaxableVal =  0
            }
            this.gstr3BList[i].dynamicHeaderList = JSON.parse(JSON.stringify(res.Data.SaleTaxTitleDetails));
            _.forEach(this.gstr3BList[i].dynamicHeaderList, (taxItem, j) => {
                  const obj = _.find(res.Data.SaleGstrTaxSummary, {Rank: item.Rank, Type : item.Type, TaxTitleId: taxItem.Id});
                  if(!_.isEmpty(obj)){
                    this.gstr3BList[i].dynamicHeaderList[j].TaxableVal = obj.TaxableVal ? obj.TaxableVal : 0
                    this.gstr3BList[i].dynamicHeaderList[j].TaxRateName = obj.TaxRateName ? obj.TaxRateName : ''
                  } else {
                    this.gstr3BList[i].dynamicHeaderList[j].TaxableVal = 0
                    this.gstr3BList[i].dynamicHeaderList[j].TaxRateName = ''
                  }
            })
          });
          this.filterListByGstrType()
        } else {
          this.gstr3BList = []
          this.noDataFound = true;
        }
        if (!this.commonService.isEmpty(res.Data.OrganizationDetails)) {
          this.orgDetails = { ...res.Data.OrganizationDetails[0] }
        }
      }
      this.spinner.hide()
    })
  }

  filterListByGstrType() {
    _.forEach(this.gstr3BListByType, (item, i) => {
      const data = _.filter(this.gstr3BList, { Type: item.type })
      this.gstr3BListByType[i].items = JSON.parse(JSON.stringify(data));
    })
  }

  export() {
    this.excelService.exportByTableId('gstr_3b_table', 'Gstr_3b_Summary', 'gstr3bSummary');
  }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('tableContainerId').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Form GSTR-3B</title>
         <style>body{font-size:.75rem;color:#000!important;overflow-x:hidden;
          font-family:Calibri,sans-serif!important;position:relative;width:21cm;height:29.7cm;margin:0 auto}
          div{display:block}.row{display:flex;flex-wrap:wrap;padding-right:5px;padding-left:5px}
          .col-md-12{flex:0 0 100%;max-width:100%}.col-md-3{flex:0 0 25%;max-width:25%}
          .col-md-3{flex:0 0 25%;max-width:25%}.col-md-4{flex:0 0 33.333333%;max-width:33.333333%}
          .col-md-6{flex:0 0 50%;max-width:50%}.col,.col-1,.col-10,.col-11,.col-12,.col-2,.col-3,.col-4,.col-5,.col-6,.col-7,.col-8,.col-9,.col-auto,.col-lg,.col-lg-1,.col-lg-10,.col-lg-11,.col-lg-12,.col-lg-2,.col-lg-3,.col-lg-4,.col-lg-5,.col-lg-6,.col-lg-7,.col-lg-8,.col-lg-9,.col-lg-auto,.col-md,.col-md-1,.col-md-10,.col-md-11,.col-md-12,.col-md-2,.col-md-3,.col-md-4,.col-md-5,.col-md-6,.col-md-7,.col-md-8,.col-md-9,.col-md-auto,.col-sm,.col-sm-1,.col-sm-10,.col-sm-11,.col-sm-12,.col-sm-2,.col-sm-3,.col-sm-4,.col-sm-5,.col-sm-6,.col-sm-7,.col-sm-8,.col-sm-9,.col-sm-auto,.col-xl,.col-xl-1,.col-xl-10,.col-xl-11,.col-xl-12,.col-xl-2,.col-xl-3,.col-xl-4,.col-xl-5,.col-xl-6,.col-xl-7,.col-xl-8,.col-xl-9,.col-xl-auto{position:relative;width:100%;min-height:1px}.justify-content-center{justify-content:center!important}.bdr_left{border-left:1px solid #000}.bdr_right{border-right:1px solid #000}.bdr_top{border-top:1px solid #000}.bdr_bottom{border-bottom:1px solid #000}.text-center{text-align:center!important}.text-right{text-align:right!important}.text-left{text-align:left!important}.p-2{padding:.5rem!important}.p-1{padding:.25rem!important}.font-weight-bold{font-weight:700!important}.name_size{font-size:22px}.amount_bs{text-align:right;padding:0 3px}.main-balance .tfoot,.main-balance .thead{font-weight:600;padding:5px 3px;font-size:.8rem;border-top:1px solid #000;border-bottom:1px solid #000}.col-3{flex:0 0 25%;max-width:25%}.col{flex-basis:0;flex-grow:1;max-width:100%}.p-0{padding:0!important}.ittelic{font-style:italic}*,::after,::before{box-sizing:border-box}.bdr_right_fix{min-height:25px;border-right:1px solid #000}.bdr_left_fix{min-height:25px;border-left:1px solid #000}.d-block{display:block}table{width:100%;border-collapse:collapse;border-spacing:0;margin-bottom:20px}thead{display:table-header-group;vertical-align:middle;border-color:inherit}table td,table th{padding:3px;text-align:left;border-bottom:1px solid #fff;word-break:break-word}table th{white-space:nowrap;font-weight:600;font-size:.8rem;border:1px solid #000;background-color:#000!important;color:#fff!important;text-align:center}tr:nth-child(even){background-color:#d9e1f2}table td{text-align:left;border:1px solid #000;font-size:.75rem;}@media print{table th{background-color:#000!important;-webkit-print-color-adjust:exact}tr:nth-child(even){background-color:#d9e1f2;-webkit-print-color-adjust:exact}}
          @media print{table th{color:#fff!important}}
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }
}
