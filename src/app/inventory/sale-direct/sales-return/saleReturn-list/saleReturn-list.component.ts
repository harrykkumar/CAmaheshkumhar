
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core'
import { Subscription } from 'rxjs/Subscription'
import { Settings } from '../../../../shared/constants/settings.constant'
import { SaleDirectReturnService } from '../saleReturn.service'
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
  selector: 'app-saleReturn-list',
  templateUrl: './saleReturn-list.component.html',
  styleUrls: ['./saleReturn-list.component.css']
})
export class SaleReturnDirectListComponent implements OnInit {
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
  constructor (private _loaderService :NgxSpinnerService , private _saleDirectReturnService: SaleDirectReturnService,
    private commonService: CommonService,
    private settings: Settings,
    private gs: GlobalService,
    private toastrService: ToastrCustomService
    ) {
   this.getSaleReturnList()
    this.newPurchaseSub = this.commonService.getNewPurchaseAddedStatus().subscribe(
      () => {
        this.getSaleReturnList()
      }
    )
    this.onTextEnteredSub = this._saleDirectReturnService.search$.subscribe(
      (text: string) => {
        //if (text.length > 0) {
          this.searchKey = text
          this.searchForStr(text)
       // }
      }
    )
    this.deleteSub = this.commonService.getDeleteStatus().subscribe(
      (obj) => {
        if (obj.id && obj.type && obj.type === 'saleDirectReturn') {
          this.deleteItem(obj.id)
        }
      }
    ) 
    this.queryStr$ = this._saleDirectReturnService.queryStr$.subscribe(
      (str) => {
        console.log(str)
        this.queryStr = str
        this.p = 1
        this.getSaleReturnList()
      }
    )
    this.clientDateFormat = this.settings.dateFormat
    this.noOfDecimalPoint = this.settings.noOfDecimal

  }
  noOfDecimalPoint:any=0
  searchForStr (text) {
    this._loaderService.show()

    this.searchGetCall(text).subscribe((data) => {
      setTimeout(() => {
        this._loaderService.hide()
      
      }, 100)
      this.createTableData(data.Data.SaleDetails, data.Data.SaleSummary)
      // this.createTableData(data.Data, '')
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
    return this._saleDirectReturnService.getSaleReturnList('?StrSearch=' + term + '&Page=' + this.p + '&Size=' + this.itemsPerPage + this.queryStr)
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
    this.commonService.openDelete(id, 'saleDirectReturn', 'saleDirectReturn')
    
    }
    
  }
  getSaleReturnList () {
    if (!this.searchKey || this.searchKey.length === 0) {
      this.searchKey = ''
    }
    this._loaderService.show()
    this._saleDirectReturnService.getSaleReturnList('?StrSearch=' + this.searchKey + '&Page=' + this.p + '&Size=' + this.itemsPerPage + this.queryStr)
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
      if (data.SaleDetails.length >0) {
        this.notRecordFound = false
        this.createTableData(data.SaleDetails, data.SaleSummary)
      } else {
        this.notRecordFound = true

      this._loaderService.hide()
      }
    },(error) => {
      this._loaderService.hide()
      this.toastrService.showError(error, '')
    })
  }
  notRecordFound:any= false
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
      { text: 'Bill No.', isRightAligned: false },
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
      { type: FormConstants.Print, id: 0, text: 'Print', printId: 'SaleReturn_print_id',isViewForm: true },
      { type: FormConstants.Edit, id: 0, text: 'Edit' },
      { type: FormConstants.Cancel, id: 0, text: 'Cancel' }
    ]
    this.customFooter = [{ 
      colspan: 4, data: [
        +summary[0].TotalQty.toFixed(2),
        +summary[0].Discount.toFixed(2),
        +summary[0].TaxAmount.toFixed(2),
        +summary[0].BillAmount.toFixed(2)
      ] }]
    // console.log('footer : ', this.customFooter)
    this.formName = FormConstants.SaleForm
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
         this.getSaleReturnList()
        }
        if (Data.Code === UIConstant.CANNOTDELETERECORD) {
          this.toastrService.showInfo('', Data.Description)
          this.commonService.closeDelete('')
        }
      })
    }
  }
}
