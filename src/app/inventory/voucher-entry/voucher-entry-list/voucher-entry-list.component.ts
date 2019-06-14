import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Subscription, throwError } from "rxjs";
import { PagingComponent } from "src/app/shared/pagination/pagination.component";
import { CommonService } from "src/app/commonServices/commanmaster/common.services";
import { GlobalService } from "src/app/commonServices/global.service";
import { ToastrCustomService } from "src/app/commonServices/toastr.service";
import { filter, catchError, map } from "rxjs/operators";
import { UIConstant } from "src/app/shared/constants/ui-constant";
import { FormConstants } from "src/app/shared/constants/forms.constant";
import { Settings } from '../../../shared/constants/settings.constant';
import { VoucherEntryServie } from "../voucher-entry.service";

@Component({
  selector: 'voucher-entry-list',
  templateUrl: './voucher-entry-list.component.html'
})

export class VoucherEntryListComponent implements OnInit {
  customHeader: any = []
  customContent: any = []
  keys: any = []
  actionList: any = []
  customFooter: any = []
  newPurchaseSub: Subscription
  formName: number
  p: number = 1
  itemsPerPage: number = 20
  total: number = 0
  lastItemIndex: number = 0
  isSearching: boolean = true
  data = {
    FromDate: '',
    ToDate: '',
    Type: ''
  }
  clientDateFormat: string = ''
  @ViewChild('custom_table', { read: ElementRef }) customTable: ElementRef
  @ViewChild('paging_comp') pagingComp: PagingComponent

  onTextEnteredSub: Subscription
  searchKey: string = ''
  queryStr: string = ''
  queryStr$: Subscription
  constructor (private voucherService: VoucherEntryServie,
    private commonService: CommonService,
    private settings: Settings,
    private gs: GlobalService,
    private toastrService: ToastrCustomService
    ) {
    this.clientDateFormat = this.settings.dateFormat
    let today = this.gs.convertToSqlFormat(new Date())
    console.log(today)
    this.data = {
      FromDate: today,
      ToDate: today,
      Type: UIConstant.VOUCHER_TYPE
    }
    this.getLedgerSummaryData()
  }

  searchForStr (text) {
    this.isSearching = true
    this.searchGetCall(text).subscribe((data) => {
      setTimeout(() => {
        this.isSearching = false
      }, 100)
      this.createTableData(data.Data, '')
    },(err) => {
      setTimeout(() => {
        this.isSearching = false
      }, 100)
      console.log('error',err)
    },
    () => {
      setTimeout(() => {
        this.isSearching = false
      }, 100)
    })
  }

  searchGetCall (term: string) {
    if (!term) {
      term = ''
    }
    this.pagingComp.setPage(1)
    return this.voucherService.getLedgerSummaryData(`?FromDate=${this.data.FromDate}&ToDate=${this.data.ToDate}` + this.queryStr)
  }

  ngOnInit () {
    setTimeout(() => {
      this.commonService.fixTableHF('cat-table')
    }, 1000)
  }
  onActionClicked (action, id) {
    action.id = id
    action['formname'] = this.formName
    this.commonService.onActionClicked(action)
  }
  getLedgerSummaryData () {
    if (!this.searchKey || this.searchKey.length === 0) {
      this.searchKey = ''
    }
    this.isSearching = true
    this.voucherService.getLedgerSummaryData(`?FromDate=${this.data.FromDate}&ToDate=${this.data.ToDate}&Page=${this.p}&Size=${this.itemsPerPage}` + this.queryStr)
    .pipe(
      filter(data => {
        if (data.Code === UIConstant.THOUSAND) {
          return true
        } else {
          throw new Error(data.Description)
        }
      }),
      catchError(error => {
        return throwError(error)
      }),
      map(data => data.Data)
    )
    .subscribe(data => {
      console.log('voucher data: ', data)
      if (data) {
        this.createTableData(data.LedgerStatements, data.LedgerStatementsSummary)
      } else {
      this.isSearching = false
      }
    },(error) => {
      this.isSearching = false
      this.toastrService.showError(error, '')
    })
  }

  createTableData (data, summary) {
    let customContent = [...data]
    this.customContent = customContent
    this.customHeader = [
      { text: 'S.No.', isRightAligned: false },
      { text: 'Particular', isRightAligned: false },
      { text: 'Ledger Name', isRightAligned: false },
      { text: 'Voucher No.', isRightAligned: false },
      { text: 'Voucher Type', isRightAligned: false },
      { text: 'Narration', isRightAligned: false },
      { text: 'Cr', isRightAligned: true },
      { text: 'Dr', isRightAligned: true }
    ]
    this.keys = [
      { text: 'Particular', isRightAligned: false },
      { text: 'LedgerName', isRightAligned: false },
      { text: 'VoucherNo', isRightAligned: false },
      { text: 'VoucherType', isRightAligned: false },
      { text: 'Narration', isRightAligned: false },
      { text: 'Cr', isRightAligned: true },
      { text: 'Dr', isRightAligned: true }
    ]
    this.actionList = [
    ]
    this.customFooter = [{
      colspan: 6, data: [
        +summary[0].Cr.toFixed(2),
        +summary[0].Dr.toFixed(2)
      ] }]
    // console.log('footer : ', this.customFooter)
    this.formName = FormConstants.VoucherForm
    this.total = summary[0] ? summary[0].TotalRows : 0
    setTimeout(() => {
      this.isSearching = false
    }, 100)
  }
}