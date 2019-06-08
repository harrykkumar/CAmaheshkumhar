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


@Component({
  selector: 'app-ledger-summary',
  templateUrl: './ledger-summary.component.html',
  styleUrls: ['./ledger-summary.component.css']
})
export class LedgerSummaryComponent implements OnInit, AfterViewInit {
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

  constructor(
    public _globalService: GlobalService,
    public _settings: Settings,
    public _commonService: CommonService,
    private _toastService: ToastrCustomService,
  ) {
    this.clientDateFormat = this._settings.dateFormat
    this.getLedgerItemList();
  }

  ngOnInit() {
    this.getLedgerSummaryData();
  }

  ngAfterViewInit(){
    this.toDate()
    this.fromDate()
  }
  fromDate = () => {
    $('#ledger-from-date').flatpickr({
      dateFormat: this.clientDateFormat,
      onOpen: () => {
        this.model.fromDatevalue = ''
      }
    })
  }

  toDate = () => {
    $('#ledger-to-date').flatpickr({
      dateFormat: this.clientDateFormat,
      onOpen: () => {
        this.model.toDateValue = ''
      }
    })
  }

  onLedgerItemChange = (event) => {
    this.model.selectedLedgerItem = event.data[0]
  }

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
      if (response.Code === 1000 && response.Data && response.Data.LedgerStatements.length > 0) {
        this.ledgerSummary = response.Data;
        this.totalItemSize = response.Data.LedgerStatements[0].TotalRows;
      } else if (response.Code === 1000 && response.Data && response.Data.LedgerStatements.length === 0) {
        this.ledgerSummary = {
          LedgerStatements: [],
          LedgerStatementsSummary: []
        }
        this.totalItemSize = 0;
      } else {
        this._toastService.showError("Error in Data Fetching", 'error');
      }
    }, (error) => {
      console.log(error);
    });
  }

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

}
