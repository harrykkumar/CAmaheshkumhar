/* File created by Dolly Garg */
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core'
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
  constructor (private purchaseService: PurchaseService,
    private commonService: CommonService,
    private settings: Settings,
    private gs: GlobalService,
    private toastrService: ToastrCustomService
    ) {
    this.getPurchaseList()
    this.newPurchaseSub = this.commonService.getNewPurchaseAddedStatus().subscribe(
      () => {
        this.getPurchaseList()
      }
    )
    this.onTextEnteredSub = this.purchaseService.search$.subscribe(
      (text: string) => {
        if (text.length > 0) {
          this.searchKey = text
          this.searchForStr(text)
        }
      }
    )
    this.deleteSub = this.commonService.getDeleteStatus().subscribe(
      (obj) => {
        if (obj.id && obj.type && obj.type === 'purchase') {
          this.deleteItem(obj.id)
        }
      }
    ) 
    this.queryStr$ = this.purchaseService.queryStr$.subscribe(
      (str) => {
        console.log(str)
        this.queryStr = str
        this.p = 1
        this.getPurchaseList()
      }
    )
    this.clientDateFormat = this.settings.dateFormat
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
    return this.purchaseService.getPurchaseList('?StrSearch=' + term + '&Page=' + this.p + '&Size=' + this.itemsPerPage + this.queryStr)
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
    if(action.type ===4){
    this.commonService.openDelete(id, 'purchase', 'purchase')
    
    }
    // if(action.type ===6){
    // this.commonService.onActionPurchaseClicked(action) 
    //   }
    
  }
  getPurchaseList () {
    if (!this.searchKey || this.searchKey.length === 0) {
      this.searchKey = ''
    }
    this.isSearching = true
    this.purchaseService.getPurchaseList('?StrSearch=' + this.searchKey + '&Page=' + this.p + '&Size=' + this.itemsPerPage + this.queryStr)
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
      // console.log('purchase data: ', data)
      if (data.PurchaseTransactions) {
        this.createTableData(data.PurchaseTransactions, data.PurchaseTransactionsSummary)
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
    customContent.forEach(element => {
      element.BillDate = this.gs.utcToClientDateFormat(element.BillDate, this.clientDateFormat)
      element.PartyBillDate = this.gs.utcToClientDateFormat(element.PartyBillDate, this.clientDateFormat)
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
      { text: 'TaxAmount', isRightAligned: true },
      { text: 'BillAmount', isRightAligned: true }]
    this.actionList = [
      { type: FormConstants.Print, id: 0, text: 'Print', printId: 'purchase_print_id' },
      { type: FormConstants.Edit, id: 0, text: 'Edit' },
      { type: FormConstants.Cancel, id: 0, text: 'Cancel' },
      { type: FormConstants.Return, id: 0, text: 'Return' }

    ]
    this.customFooter = [{ 
      colspan: 6, data: [
        +summary[0].TotalQty.toFixed(2),
        +summary[0].Discount.toFixed(2),
        +summary[0].TaxAmount.toFixed(2),
        +summary[0].BillAmount.toFixed(2)
      ] }]
    // console.log('footer : ', this.customFooter)
    this.formName = FormConstants.Purchase
    this.total = data[0] ? data[0].TotalRows : 0
    setTimeout(() => {
      this.isSearching = false
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
          this.getPurchaseList()
        }
        if (Data.Code === UIConstant.CANNOTDELETERECORD) {
          this.toastrService.showInfo('', Data.Description)
          this.commonService.closeDelete('')
        }
      })
    }
  }
}
