import { Component, ViewChild, ElementRef, OnInit } from '@angular/core'
import { Subscription } from 'rxjs/Subscription'
import { Settings } from '../../../shared/constants/settings.constant'
import { SaleDirectService } from '../saleDirectService.service'
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
  selector: 'app-sale-direct-list',
  templateUrl: './sale-direct-list.component.html',
  styleUrls: ['./sale-direct-list.component.css']
})
export class SaleDirectListComponent implements OnInit {
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
  noOfDecimalPoint:any= 0 
  onTextEnteredSub: Subscription
  searchKey: string = ''
  queryStr: string = ''
  queryStr$: Subscription
  constructor (private _saleDirectService: SaleDirectService,
    private commonService: CommonService,
    private settings: Settings,
    private gs: GlobalService,
    private toastrService: ToastrCustomService
    ) {
    this.getSaleDirectList()
    this.newPurchaseSub = this.commonService.getNewPurchaseAddedStatus().subscribe(
      () => {
        this.getSaleDirectList()
      }
    )
    this.onTextEnteredSub = this._saleDirectService.search$.subscribe(
      (text: string) => {
        //if (text.length > 0) {
          this.searchKey = text
          this.searchForStr(text)
      // }
      }
    )
    this.deleteSub = this.commonService.getDeleteStatus().subscribe(
      (obj) => {
        if (obj.id && obj.type && obj.type === 'Sale') {
          this.deleteItem(obj.id)
        }
      }
    ) 
  this.commonService.newRefreshItemStatus().subscribe(
      (obj) => {
        this.getSaleDirectList()
      }
    ) 
    
    this.queryStr$ = this._saleDirectService.queryStr$.subscribe(
      (str) => {
        console.log(str)
        this.queryStr = str
        this.p = 1
        this.getSaleDirectList()
      }
    )
    this.clientDateFormat = this.settings.dateFormat
    this.noOfDecimalPoint = this.settings.noOfDecimal

  }

  searchForStr (text) {
    debugger
    this.isSearching = true
    this.searchGetCall(text).subscribe((data) => {
      setTimeout(() => {
        this.isSearching = false
      }, 100)
      // this.createTableData(data.Data, '')
      this.createTableData(data.Data.SaleDetails, data.Data.SaleSummary)

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
    return this._saleDirectService.getSaleDirectList('?StrSearch=' + term + '&Page=' + this.p + '&Size=' + this.itemsPerPage + this.queryStr)
  }

  ngOnInit () {
    setTimeout(() => {
      this.commonService.fixTableHF('cat-table')
    }, 1000)
  }
  onClicked (action, id) {
    action.id = id
    action['formname'] = this.formName
    this.commonService.onsaleDirectActionClicked(action)
    if(action.type ===4){
    this.commonService.openDelete(id, 'Sale', 'Sale')
    
    }
    
  }
  getSaleDirectList () {
    console.log(this.customContent ,"ffff---")
    if (!this.searchKey || this.searchKey.length === 0) {
      this.searchKey = ''
    }
    this.isSearching = true
    this._saleDirectService.getSaleDirectList('?StrSearch=' + this.searchKey + '&Page=' + this.p + '&Size=' + this.itemsPerPage + this.queryStr)
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
      if (data.SaleDetails.length >0) {
        this.notRecordFound= false
        this.createTableData(data.SaleDetails, data.SaleSummary)
      } else {
        // this.createTableData(data.SaleDetails, data.SaleSummary)
      this.isSearching = false
      this.notRecordFound= true
      // this.customHeader  =[]
      // this.customFooter=[]
      // this.customHeader=[]
      // this.keys=[]
      }
    },(error) => {
      this.isSearching = false
      this.toastrService.showError(error, '')
    })
  }
  notRecordFound:any =true
  createTableData (data, summary) {
    this.notRecordFound = false
  //if(data.length>0){
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
      { text: 'Party Details', isRightAligned: false },
      { text: 'Invoice No.', isRightAligned: false },
      { text: 'Invoice Date', isRightAligned: false },
      { text: 'Quantity', isRightAligned: true },
      { text: 'Discount', isRightAligned: true },
      { text: 'Tax Amount', isRightAligned: true },
      { text: 'Bill Amount', isRightAligned: true },
      { text: 'Action', isRightAligned: true }
    ]
    this.keys = [
      { text: 'LedgerName', isRightAligned: false },
      { text: 'BillNo', isRightAligned: false },
      { text: 'BillDate', isRightAligned: false },
      { text: 'TotalQty', isRightAligned: true ,},
      { text: 'Discount', isRightAligned: true },
      { text: 'TaxAmount', isRightAligned: true },
      { text: 'BillAmount', isRightAligned: true }]
    this.actionList = [
      { type: FormConstants.Print, id: 0, text: 'Print', printId: 'saleDirect_Print' ,viewPrint: false },
      { type: FormConstants.Print, id: 0, text: 'View Print', printId: 'saleDirect_Print' ,viewPrint: true },

      { type: FormConstants.Edit, id: 0, text: 'Edit' },
      { type: FormConstants.Cancel, id: 0, text: 'Cancel' },
      { type: FormConstants.Return, id: 0, text: 'Return' }

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
      this.isSearching = false
    }, 100)
  //}
  }

  
  deleteItem (id) {
    if (id) {
      this.commonService.cancelSale(id).pipe(
        takeUntil(this.unSubscribe$)
      ).subscribe((Data: any) => {
        if (Data.Code === UIConstant.DELETESUCCESS) {
          this.toastrService.showSuccess('', UIConstant.DELETED_SUCCESSFULLY)
          this.commonService.closeDelete('')
          this.getSaleDirectList()
        }
        if (Data.Code === UIConstant.CANNOTDELETERECORD) {
          this.toastrService.showInfo('', Data.Description)
          this.commonService.closeDelete('')
        }
      })
    }
  }
}
