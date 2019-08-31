import { PagingComponent } from './../../shared/pagination/pagination.component';
import { GlobalService } from 'src/app/commonServices/global.service';
import { Settings } from './../../shared/constants/settings.constant';
import { UIConstant } from 'src/app/shared/constants/ui-constant';
import { ToastrCustomService } from './../../commonServices/toastr.service';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash'
import { Subject } from 'rxjs';
declare var $: any
declare var flatpickr: any
import { ExcelService } from '../../commonServices/excel.service';


@Component({
  selector: 'app-item-group-stock',
  templateUrl: './item-group-stock.component.html',
  styleUrls: ['./item-group-stock.component.css']
})
export class ItemGroupStockReportComponent implements OnInit, AfterViewInit {
  ledgerSummary: any = {}
  ledgerItemList: Array<any> = [];
  clientDateFormat: any
  model: any = {};
  lastItemIndex: number = 0
  pageSize: number = 20
  pageNo: number = 1
  totalItemSize: number = 0
  @ViewChild('ledger_paging') ledgerPagingModel: PagingComponent
  private unSubscribe$ = new Subject<void>()

  constructor(public excelService: ExcelService,
    public _globalService: GlobalService,
    public _settings: Settings,
    public _commonService: CommonService,
    private _toastService: ToastrCustomService,
  ) {
    this.clientDateFormat = this._settings.dateFormat
    this.noOfDecimal =this._settings.noOfDecimal
    this.getLedgerItemList();
  }
  noOfDecimal:any
  ngOnInit() {
    this._commonService.fixTableHF('cat-table')
    this.getLedgerSummaryData();
  }

  ngAfterViewInit(){
    this.toDate()
    this.fromDate()
  }
  fromDate = () => {
    this.model.fromDatevalue = this._globalService.getDefaultDate(this.clientDateFormat)
  }

  toDate = () => {
        this.model.toDateValue =   this._globalService.getDefaultDate(this.clientDateFormat)
  }

  onLedgerItemChange = (event) => {
    this.model.selectedLedgerItem = event.data[0]
  }
  ExcelSummary:any
  getLedgerItemList = () => {
    this._commonService.getLedgerItemList().pipe(
      takeUntil(this.unSubscribe$),
      map((data: any) => {
        return _.map(data.Data, (element) => {
          return {
            id: element.Id,
            text: element.Name
          }
        })
      })
    )
      .subscribe((response: any) => {
        this.ledgerItemList = [{ id: UIConstant.ZERO, text: 'Select Ledger' }, ...response];
      })
  }
  getValueFalg: boolean = true

  getLedgerSummaryData = () => {
    let fromDate, toDate
    if (this.model.fromDatevalue) {
      fromDate = this._globalService.clientToSqlDateFormat(this.model.fromDatevalue, this.clientDateFormat)
    }
    if (this.model.toDateValue) {
      toDate = this._globalService.clientToSqlDateFormat(this.model.toDateValue, this.clientDateFormat)
    }
    const data = {
      LedgerId: this.model.selectedLedgerItem ? this.model.selectedLedgerItem.id : 0,
      FromDate: fromDate ? fromDate : '',
      ToDate: toDate ? toDate : '',
      Page: this.pageNo,
      Size: this.pageSize
    }
    this._commonService.getLedgerSummaryData(data).pipe(
      takeUntil(this.unSubscribe$)
    ).subscribe((response: any) => {
      if (response.Code === UIConstant.THOUSAND && response.Data && response.Data.LedgerStatements.length > 0) {
        this.ExcelSummary =[]
        this.ledgerSummary = response.Data;
     
        this.ExcelSummary =[ "","Total :-","","","",response.Data.LedgerStatementsSummary[0].Dr.toFixed(this.noOfDecimal),response.Data.LedgerStatementsSummary[0].Cr.toFixed(this.noOfDecimal)]

        this.ExcelHeaders =[ "SNo","Particulars","VoucherNo","VoucherType","Narration","Dr","Cr"]
       this.getValueFalg = false
       response.Data.LedgerStatements.forEach((element,int) => {
        this.mainDataExcel.push([
          int +1 ,
          element.Particular,
          element.VoucherNo,
          element.VoucherType,
          element.Narration,
          (element.Dr).toFixed(this.noOfDecimal),
          (element.Cr).toFixed(this.noOfDecimal)

        ])
      });
        this.totalItemSize = response.Data.LedgerStatements[0].TotalRows;
      } else if (response.Code === UIConstant.THOUSAND && response.Data && response.Data.LedgerStatements.length === 0) {
        this.getValueFalg = true
        this.ledgerSummary = {
          LedgerStatements: [],
          LedgerStatementsSummary: []
        }
        this.totalItemSize = 0;
      } else {
        this._toastService.showError("Error in Data Fetching", '');
      }

    }, (error) => {

    });
  }
  ExcelHeaders:any =[]
  onPageNoChange = (event) => {
    this.pageNo = event
    this.getLedgerSummaryData()
  }

  onPageSizeChange = (event) => {
    this.pageSize = event
    this.getLedgerSummaryData()
  }

  onLastValueChange = (event) => {
    this.lastItemIndex = event
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next()
    this.unSubscribe$.complete()
  }
  mainDataExcel:any =[]
  exportExcel (){
    if(this.mainDataExcel.length > 0){  
         this.excelService.generateExcel(this.ledgerSummary.OrganizationDetails[0].OrgName,
        this.ledgerSummary.AddressDetails[0].CityName + ' ' +
        this.ledgerSummary.AddressDetails[0].StateName + ' ' + this.ledgerSummary.AddressDetails[0].CountryName, this.ExcelHeaders,
        this.mainDataExcel, 'Item Group Report', this.model.fromDatevalue, this.model.toDateValue,this.ExcelSummary)
  
  
  

    }
}
}
