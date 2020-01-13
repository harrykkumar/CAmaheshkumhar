import { LoginService } from 'src/app/commonServices/login/login.services';

import { Component, ViewChild, ElementRef, OnInit } from '@angular/core'
import { Subscription } from 'rxjs/Subscription'
import { Settings } from '../../../../shared/constants/settings.constant'
import { PurchaseService } from '../../purchase.service'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
import { GlobalService } from 'src/app/commonServices/global.service'
import { UIConstant } from 'src/app/shared/constants/ui-constant'
import { FormConstants } from 'src/app/shared/constants/forms.constant'
import { PagingComponent } from '../../../../shared/pagination/pagination.component';
import { filter, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastrCustomService } from '../../../../commonServices/toastr.service';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
declare const $: any
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-purchaseReturn-list',
  templateUrl: './purchaseReturn-list.component.html',
  styleUrls: ['./purchaseReturn-list.component.css']
})
export class PurchaseReturnListComponent implements OnInit {
  customHeader: any = []
  customContent: any = []
  keys: any = []
  actionList: any = []
  customFooter: any = []
  newPurchaseSub: Subscription
  redirectData:Subscription
  deleteSub:Subscription
  formName: number
  clientDateFormat: string
  p: number = 1
  itemsPerPage: number = 20
  lastItemIndex: number = 0
  total: number = 0
  isSearching: boolean = true
  @ViewChild('custom_table', { read: ElementRef }) customTable: ElementRef
  @ViewChild('paging_comp') pagingComp: PagingComponent
  private unSubscribe$ = new Subject<void>()

  onTextEnteredSub: Subscription
  searchKey: string = ''
  queryStr: string = ''
  queryStr$: Subscription
  menuData: any;
  constructor (private _loaderService :NgxSpinnerService , private _saleDirectReturnService: PurchaseService,
    private commonService: CommonService,
    private settings: Settings,
    private gs: GlobalService,
    private toastrService: ToastrCustomService,
    private _loginService: LoginService
    ) {
    this.menuData = this._loginService.getMenuDetails(43, 9);
   this.getPurchaseReturnList()
    this.newPurchaseSub = this.commonService.getNewPurchaseDirectReturnAddedStatus().subscribe(
      () => {
        this.getPurchaseReturnList()
      }
    )
    this.onTextEnteredSub = this._saleDirectReturnService.search$.subscribe(
      (text: string) => {
        //if (text.length > 0) {
          this.searchKey = text
          this.searchForStr(text)
        //}
      }
    )
    this.deleteSub = this.commonService.getDeleteStatus().subscribe(
      (obj) => {
        if (obj.id && obj.type && obj.type === 'PurchaseReturn') {
          this.deleteItem(obj.id)
        }
      }
    )
    this.queryStr$ = this._saleDirectReturnService.queryStr$.subscribe(
      (str) => {
        console.log(str)
        this.queryStr = str
        this.p = 1
        this.getPurchaseReturnList()
      }
    )

    this.commonService.reDirectViewListOfPurchaeReturnStatus().subscribe(
      (action: any) => {
        let fromDate = JSON.parse(JSON.stringify(this.gs.clientToSqlDateFormat(action.fromDate, this.settings.dateFormat)))
        let toDate = JSON.parse(JSON.stringify(this.gs.clientToSqlDateFormat(action.toDate, this.settings.dateFormat)))
        this.queryStr = '&fromDate=' + fromDate + '&toDate=' + toDate
        this.getPurchaseReturnList()
      }
    )
    this.clientDateFormat = this.settings.dateFormat
    this.noOfDecimalPoint = this.settings.noOfDecimal

  }
  noOfDecimalPoint:any
  searchForStr (text) {
    this._loaderService.show()

    this.searchGetCall(text).subscribe((data) => {
      setTimeout(() => {
        this._loaderService.hide()

      }, 100)
      // this.createTableData(data.Data, '')
      this.createTableData(data.Data.PurchaseTransactions, data.Data.PurchaseTransactionsSummary)

    },(err) => {
      setTimeout(() => {
        this._loaderService.hide()

      }, 100)
      console.log('error',err)
    },
    () => {
      setTimeout(() => {
        this._loaderService.hide()
      }, 100)
    })
  }


  searchGetCall (term: string) {
    if (!term) {
      term = ''
    }
    this.pagingComp.setPage(1)
    return this._saleDirectReturnService.getPurchaseReturnList('?StrSearch=' + term + '&Page=' + this.p + '&Size=' + this.itemsPerPage + this.queryStr)
  }

  ngOnInit () {
    this._loaderService.hide()
    setTimeout(() => {
      this.commonService.fixTableHF('cat-table')
    }, 1000)
  }
  onActionClicked (action, id) {
    action.id = id
    action['formname'] = this.formName
    this.commonService.onActionSaleReturnClicked(action)
    if(action.type ===4){
    this.commonService.openDelete(id, 'PurchaseReturn', 'PurchaseReturn')

    }

  }
  getPurchaseReturnList () {
    if (!this.searchKey || this.searchKey.length === 0) {
      this.searchKey = ''
    }
    this._loaderService.show()
    this._saleDirectReturnService.getPurchaseReturnList('?StrSearch=' + this.searchKey + '&Page=' + this.p + '&Size=' + this.itemsPerPage + this.queryStr)
    .pipe(
      filter(data => {
        if (data.Code === UIConstant.THOUSAND) {
          this._loaderService.hide()

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
      if (data.PurchaseTransactions.length >0) {
        this.notRecordFound = false
        this.createTableData(data.PurchaseTransactions, data.PurchaseTransactionsSummary)
      } else {
        this.createTableData(data.PurchaseTransactions, data.PurchaseTransactionsSummary)
        this.notRecordFound = true
        this._loaderService.hide()
      }
    },(error) => {
      this._loaderService.hide()
      this.toastrService.showError(error, '')
    })
  }
  notRecordFound:any
  createTableData (data, summary) {
    let customContent = [...data]
    customContent.forEach(element => {
      element.BillDate = this.gs.utcToClientDateFormat(element.BillDate, this.clientDateFormat)
      element.PartyBillDate = this.gs.utcToClientDateFormat(element.PartyBillDate, this.clientDateFormat)
      element.BillAmount = element.BillAmount.toFixed(this.noOfDecimalPoint)
      element.Discount = element.Discount.toFixed(this.noOfDecimalPoint)
      element.TaxAmount = element.TaxAmount.toFixed(this.noOfDecimalPoint)
    })
    this.customContent = customContent
    this.customHeader = [
      { text: 'S.No.', isRightAligned: false },
      { text: 'Ledger Name', isRightAligned: false },
      { text: 'PV No.', isRightAligned: false },
      { text: 'Bill Date', isRightAligned: false },
      { text: 'Quantity', isRightAligned: true },
      { text: 'Discount', isRightAligned: true },
      { text: 'TaxAmount', isRightAligned: true },
      { text: 'Bill Amount', isRightAligned: true },
      { text: 'Action', isRightAligned: true }
    ]
    this.keys = [
      { text: 'LedgerName', isRightAligned: false },
      { text: 'BillNo', isRightAligned: false },
      { text: 'BillDate', isRightAligned: false },
      { text: 'TotalQty', isRightAligned: true },
      { text: 'Discount', isRightAligned: true },
      { text: 'TaxAmount', isRightAligned: true },
      { text: 'BillAmount', isRightAligned: true }]
    this.actionList = [
      { type: FormConstants.Print, id: 0, text: 'Print', printId: 'PurchaseReturn_print_id',isViewPrint: false},
      { type: FormConstants.ViewPrint, id: 0, text: 'View Print', printId: 'PurchaseReturn_print_id',isViewPrint: true},

      { type: FormConstants.Edit, id: 0, text: 'Edit' },
      { type: FormConstants.Cancel, id: 0, text: 'Cancel' },

    ]
    this.customFooter = [{
      colspan: 4, data: [
        +summary[0].TotalQty.toFixed(2),
        +summary[0].Discount.toFixed(2),
        +summary[0].TaxAmount.toFixed(2),
        +summary[0].BillAmount.toFixed(2)
      ] }]
    // console.log('footer : ', this.customFooter)
    this.formName = FormConstants.Purchase
    this.total = data[0] ? data[0].TotalRows : 0
    setTimeout(() => {
      this._loaderService.hide()
    }, 100)
  }


  deleteItem (id) {
    if (id) {
      this.commonService.cancelPurchase(id).pipe(
        takeUntil(this.unSubscribe$)
      ).subscribe((Data: any) => {
        if (Data.Code === UIConstant.DELETESUCCESS) {
          this.toastrService.showSuccess('', UIConstant.DELETED_SUCCESSFULLY)
          this.commonService.closeDelete('')
         this.getPurchaseReturnList()
        }
        if (Data.Code === UIConstant.CANNOTDELETERECORD) {
          this.toastrService.showInfo('', Data.Description)
          this.commonService.closeDelete('')
        }
      })
    }
  }
}
