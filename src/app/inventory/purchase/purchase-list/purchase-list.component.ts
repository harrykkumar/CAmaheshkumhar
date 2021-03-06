import { Router } from '@angular/router';
import { LoginService } from 'src/app/commonServices/login/login.services';
/* File created by Dolly Garg */
import { Component, ViewChild, ElementRef, OnInit, DoCheck,OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription'
import { Settings } from '../../../shared/constants/settings.constant'
import { PurchaseService } from '../purchase.service'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
import { GlobalService } from 'src/app/commonServices/global.service'
import { UIConstant } from 'src/app/shared/constants/ui-constant'
import { FormConstants } from 'src/app/shared/constants/forms.constant'
import { PagingComponent } from '../../../shared/pagination/pagination.component';
import { filter, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastrCustomService } from '../../../commonServices/toastr.service';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
declare const $: any
@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.css']
})
export class PurchaseListComponent implements OnInit {
  customHeader: any = []
  customContent: any = []
  keys: any = []
  actionList: any = []
  customFooter: any = []
  newPurchaseSub: Subscription
  deleteSub: Subscription
  redirectData:Subscription
  formName: number
  clientDateFormat: string
  p: number = 1
  itemsPerPage: number = 20
  lastItemIndex: number = 0
  total: number = 0
  isSearching: boolean = true
  @ViewChild('custom_table', { read: ElementRef }) customTable: ElementRef
  @ViewChild('paging_comp') pagingComp: PagingComponent
  private onDestroy$: Subscription[] = []

  onTextEnteredSub: Subscription
  searchKey: string = ''
  queryStr: string = ''
  queryStr$: Subscription
  menuData: any
  redirectviewFlag:boolean
  redirectView:any = false
  constructor(private purchaseService: PurchaseService,
    private commonService: CommonService,
    private settings: Settings,
    private gs: GlobalService,
    private toastrService: ToastrCustomService,
    private _loginService: LoginService,
    private router: Router
    ) {

  
    this.menuData = this._loginService.getMenuDetails(15, 9);
 
    this.onDestroy$.push(this.commonService.getNewPurchaseAddedStatus().subscribe(
      () => {
        this.getPurchaseList()
      }
    ))
    this.onDestroy$.push(this.purchaseService.search$.subscribe(
      (text: string) => {
        this.searchKey = text
        this.searchForStr(text)
      }
    ))
    this.onDestroy$.push(this.commonService.getDeleteStatus().subscribe(
      (obj) => {
        if (obj.id && obj.type && obj.type === 'purchase') {
          this.deleteItem(obj.id)
        }
      }
    ))
  
    this.onDestroy$.push(this.purchaseService.queryStr$.subscribe(
      (str) => {
        console.log(str)
        this.queryStr = str
        this.p = 1
        this.getPurchaseList()
      }
    ))
    this.commonService.reDirectViewListOfPurchaeStatus().subscribe(
      (action: any) => {
        let fromDate = JSON.parse(JSON.stringify(this.gs.clientToSqlDateFormat(action.fromDate, this.settings.dateFormat)))
        let toDate = JSON.parse(JSON.stringify(this.gs.clientToSqlDateFormat(action.toDate, this.settings.dateFormat)))
        this.queryStr = '&DateType=0&fromDate=' + fromDate + '&toDate=' + toDate
        this.redirectView = action.viewflag
        this.getPurchaseList()
      }
    )
    this.clientDateFormat = this.settings.dateFormat
    this.noOfDecimalPoint = this.settings.noOfDecimal
  }
 
  noOfDecimalPoint: any = 0
  searchForStr(text) {
    this.isSearching = true
    this.onDestroy$.push(this.searchGetCall(text).subscribe((data) => {
      setTimeout(() => {
        this.isSearching = false
      }, 100)
      this.createTableData(data.Data.PurchaseTransactions, data.Data.PurchaseTransactionsSummary)

    }, (err) => {
      setTimeout(() => {
        this.isSearching = false
      }, 100)
      console.log('error', err)
    },
    () => {
      setTimeout(() => {
        this.isSearching = false
      }, 100)
    }))
  }


  searchGetCall(term: string) {
    this.pagingComp.setPage(1)
    return this.purchaseService.getPurchaseList('?StrSearch=' + term + '&Page=' + this.p +
    '&Size=' + this.itemsPerPage + this.queryStr)
  }
  ngAfterViewInit (){
      this.getPurchaseList()
  }
  
  ngOnInit() {
    setTimeout(() => {
      this.commonService.fixTableHF('cat-table')
    }, 1000)
  }
  onActionClicked(action, id) {
    action.id = id
    action['formname'] = this.formName
    this.commonService.onActionClicked(action)
    if (action.type === 4) {
      this.commonService.openDelete(id, 'purchase', 'purchase')
    }
    if (action.type === 10) {
      this.router.navigate([`ims/voucher-entry/purchase/${id}`])
    }
  }
  getPurchaseList() {
    if (!this.searchKey || this.searchKey.length === 0) {
      this.searchKey = ''
    }
    this.isSearching = true
    this.onDestroy$.push(this.purchaseService.
        getPurchaseList('?StrSearch=' + this.searchKey + '&Page=' + this.p + '&Size=' + 
        this.itemsPerPage + this.queryStr)
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
        if (data.PurchaseTransactions.length > 0) {
          this.notRecordFound = false
          this.createTableData(data.PurchaseTransactions, data.PurchaseTransactionsSummary)
        } else {
          this.createTableData(data.PurchaseTransactions, data.PurchaseTransactionsSummary)
          this.notRecordFound = true
          this.isSearching = false
        }
      }, (error) => {
        this.isSearching = false
        this.toastrService.showError(error, '')
      }))
  }
  notRecordFound: any
  createTableData(data, summary) {
    let customContent = [...data]
    customContent.forEach(element => {
      element.BillDate = this.gs.utcToClientDateFormat(element.BillDate, this.clientDateFormat)
      element.PartyBillDate = this.gs.utcToClientDateFormat(element.PartyBillDate, this.clientDateFormat)
      element.BillAmount = element.BillAmount.toFixed(this.noOfDecimalPoint)
      element.Discount = element.Discount.toFixed(this.noOfDecimalPoint)
      element.TaxAmount = element.TaxAmount.toFixed(this.noOfDecimalPoint)
      element.TotalTaxableAmount = element.TotalTaxableAmount.toFixed(this.noOfDecimalPoint)

    })
    this.customContent = customContent
    this.customHeader = [
      { text: 'S.No.', isRightAligned: false },
      { text: 'Ledger Name', isRightAligned: false },
      { text: 'Bill No.', isRightAligned: false },
      { text: 'Bill Date', isRightAligned: false },
      { text: 'Party Bill No', isRightAligned: false },
      { text: 'Party Bill Date', isRightAligned: false },
      { text: 'Quantity', isRightAligned: true },
      { text: 'Discount', isRightAligned: true },
      { text: 'Taxable Amt', isRightAligned: true },
      { text: 'TaxAmount', isRightAligned: true },
      { text: 'Bill Amount', isRightAligned: true },
      { text: 'Action', isRightAligned: true }
    ]
    this.keys = [
      { text: 'LedgerName', isRightAligned: false },
      { text: 'BillNo', isRightAligned: false },
      { text: 'BillDate', isRightAligned: false },
      { text: 'PartyBillNo', isRightAligned: false },
      { text: 'PartyBillDate', isRightAligned: false },
      { text: 'TotalQty', isRightAligned: true },
      { text: 'Discount', isRightAligned: true },
      { text: 'TotalTaxableAmount', isRightAligned: true },
      { text: 'TaxAmount', isRightAligned: true },
      { text: 'BillAmount', isRightAligned: true }]
    this.actionList = [
      { type: FormConstants.Print, id: 0, text: 'Print', printId: 'purchase_print_id' ,isViewPrint :false },
      { type: FormConstants.ViewPrint, id: 0, text: 'View Print', printId: 'purchase_print_id' ,isViewPrint :true},
      { type: FormConstants.Edit, id: 0, text: 'Edit' },
      { type: FormConstants.Cancel, id: 0, text: 'Cancel' },
      { type: FormConstants.Return, id: 0, text: 'Return' },
      { type: FormConstants.PAYMENT, id: 0, text: 'Payment' }

    ]
    this.customFooter = [{
      colspan: 6, data: [
        +summary[0].TotalQty.toFixed(this.noOfDecimalPoint),
        +summary[0].Discount.toFixed(this.noOfDecimalPoint),
        +summary[0].TotalTaxableAmount.toFixed(this.noOfDecimalPoint),
        +summary[0].TaxAmount.toFixed(this.noOfDecimalPoint),
        +summary[0].BillAmount.toFixed(this.noOfDecimalPoint)
      ]
    }]
    this.formName = FormConstants.Purchase
    this.total = data[0] ? data[0].TotalRows : 0
    setTimeout(() => {
      this.isSearching = false
    }, 10)
  }

  OnDestroy() {
    if (this.onDestroy$ && this.onDestroy$.length > 0) {
      this.onDestroy$.forEach((element) => {
        element.unsubscribe()
      })
    }
  }

  deleteItem(id) {
    if (id) {
      this.onDestroy$.push(this.commonService.cancelPurchase(id).subscribe((Data: any) => {
        if (Data.Code === UIConstant.DELETESUCCESS) {
          this.toastrService.showSuccess('', UIConstant.DELETED_SUCCESSFULLY)
          this.commonService.closeDelete('')
          this.getPurchaseList()
        }
        if (Data.Code === UIConstant.CANNOTDELETERECORD) {
          this.toastrService.showInfo('', Data.Description)
          this.commonService.closeDelete('')
        }
      }))
    }
  }
}
