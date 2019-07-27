import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Subscription, throwError } from "rxjs";
import { PagingComponent } from "src/app/shared/pagination/pagination.component";
import { CommonService } from "src/app/commonServices/commanmaster/common.services";
import { GlobalService } from "src/app/commonServices/global.service";
import { ToastrCustomService } from "src/app/commonServices/toastr.service";
import { filter, catchError, } from "rxjs/operators";
import { UIConstant } from "src/app/shared/constants/ui-constant";
import { FormConstants } from "src/app/shared/constants/forms.constant";
import { Settings } from '../../../shared/constants/settings.constant';
import { VoucherEntryServie } from "../voucher-entry.service";
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

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
  newVoucherSub: Subscription
  deleteSub:Subscription
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
  LedgerStatements = []
  summary: any
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
      this.formName = FormConstants.VoucherForm
      this.newVoucherSub = this.commonService.getNewVoucherAddedStatus().subscribe(
        () => {
          this.getLedgerSummaryData()
        }
      )
      this.onTextEnteredSub = this.voucherService.search$.subscribe(
        (text: string) => {
          if (text.length > 0) {
            this.searchKey = text
            this.searchForStr(text)
          }
        }
      )
      this.deleteSub = this.commonService.getDeleteStatus().subscribe(
        (obj) => {
          if (obj.id && obj.type && obj.type === 'voucher') {
            this.deleteItem(obj.id)
          }
        }
      ) 
      this.queryStr$ = this.voucherService.queryStr$.subscribe(
        (str) => {
          console.log(str)
          this.queryStr = str
          this.p = 1
          this.getLedgerSummaryData()
        }
      )
    this.clientDateFormat = this.settings.dateFormat
    this.noOfdecimal = this.settings.noOfDecimal
   
    let today = this.gs.convertToSqlFormat(new Date())
    // console.log(today)
    this.data = {
      FromDate: today,
      ToDate: today,
      Type: UIConstant.VOUCHER_TYPE
    }
    this.getLedgerSummaryData()
  }
  noOfdecimal:any

    
  deleteItem (id) {
    if (id) {
      this.voucherService.deleteVouncherData(id).pipe(
        takeUntil(this.unSubscribe$)
      ).subscribe((Data: any) => {
        if (Data.Code === UIConstant.DELETESUCCESS) {
          this.toastrService.showSuccess('', UIConstant.DELETED_SUCCESSFULLY)
          this.commonService.closeDelete('')
          this.getLedgerSummaryData()
        }
        if (Data.Code === UIConstant.CANNOTDELETERECORD) {
          this.toastrService.showInfo('', Data.Description)
          this.commonService.closeDelete('')
        }
      })
    }
  }
  searchForStr (text) {
    this.isSearching = true
    this.searchGetCall(text).subscribe((data) => {
      this.LedgerStatements = data.Data.LedgerStatements
      this.total = data.Data.LedgerStatements[0] ? data.Data.LedgerStatements[0].TotalRows : 0
      this.summary = data.Data.LedgerStatementsSummary[0]
      setTimeout(() => {
        this.isSearching = false
      }, 100)
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
    return this.voucherService.getLedgerSummaryData(`?Type=${this.data.Type}&FromDate=${this.data.FromDate}&ToDate=${this.data.ToDate}` + this.queryStr)
  }
  private unSubscribe$ = new Subject<void>()

  ngOnInit () {
    setTimeout(() => {
      this.commonService.fixTableHF('cat-table')
    }, 1000)
  }
  onActionClicked (action, id) {
    action.id = id
    action['formname'] = this.formName
    this.commonService.onActionClicked(action)
    if(action.type ===4){
      this.commonService.openDelete(id, 'voucher', 'voucher')
      
      }
  }
  getLedgerSummaryData () {
    if (!this.searchKey || this.searchKey.length === 0) {
      this.searchKey = ''
    }
    this.isSearching = true
    // this.voucherService.getLedgerSummaryData(`?Type=${this.data.Type}&FromDate=${this.data.FromDate}&ToDate=${this.data.ToDate}&Page=${this.p}&Size=${this.itemsPerPage}` + this.queryStr)

    this.voucherService.getLedgerSummaryData(`?Type=${this.data.Type}&Page=${this.p}&Size=${this.itemsPerPage}` + this.queryStr)
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
        this.LedgerStatements = data.LedgerStatements
        this.total = data.LedgerStatements[0] ? data.LedgerStatements[0].TotalRows : 0
        this.summary = data.LedgerStatementsSummary[0]
        setTimeout(() => {
          this.isSearching = false
        }, 100)
        // this.createTableData(data.LedgerStatements, data.LedgerStatementsSummary)
      } else {
        this.isSearching = false
      }
    },(error) => {
      this.isSearching = false
      this.toastrService.showError(error, '')
    })
  }

  // createTableData (data, summary) {
  //   let customContent = [...data]
  //   this.customContent = customContent
  //   this.customHeader = [
  //     { text: 'S.No.', isRightAligned: false },
  //     { text: 'Particular', isRightAligned: false },
  //     { text: 'Ledger Name', isRightAligned: false },
  //     { text: 'Voucher No.', isRightAligned: false },
  //     { text: 'Voucher Type', isRightAligned: false },
  //     { text: 'Narration', isRightAligned: false },
  //     { text: 'Cr', isRightAligned: true },
  //     { text: 'Dr', isRightAligned: true }
  //   ]
  //   this.keys = [
  //     { text: 'Particular', isRightAligned: false },
  //     { text: 'LedgerName', isRightAligned: false },
  //     { text: 'VoucherNo', isRightAligned: false },
  //     { text: 'VoucherType', isRightAligned: false },
  //     { text: 'Narration', isRightAligned: false },
  //     { text: 'Cr', isRightAligned: true },
  //     { text: 'Dr', isRightAligned: true }
  //   ]
    // VoucherTypeId
  //   this.actionList = [
  //     { type: FormConstants.Print, id: 0, text: 'Print', printId: 'payment_print_id' }
  //   ]
  //   this.customFooter = [{
  //     colspan: 6, data: [
  //       +summary[0].Cr.toFixed(2),
  //       +summary[0].Dr.toFixed(2)
  //     ] }]
    // console.log('footer : ', this.customFooter)
  //   this.formName = FormConstants.VoucherForm
  //   this.total = summary[0] ? summary[0].TotalRows : 0
  //   setTimeout(() => {
  //     this.isSearching = false
  //   }, 100)
  // }

  ngOnDestroy () {
    this.newVoucherSub.unsubscribe()
    this.onTextEnteredSub.unsubscribe()
    this.queryStr$.unsubscribe()
    this.deleteSub.unsubscribe()
  }
}