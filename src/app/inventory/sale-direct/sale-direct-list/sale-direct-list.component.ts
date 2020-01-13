import { Router } from '@angular/router';
import { LoginService } from 'src/app/commonServices/login/login.services';
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
  deleteSub: Subscription
  //redirectData:Subscription
  formName: number
  clientDateFormat: string
  p: number = 1
  itemsPerPage: number = 20
  lastItemIndex: number = 0
  total: number = 0
  SaleRegisterViewflag: boolean = false
  isSearching: boolean = true
  @ViewChild('custom_table', { read: ElementRef }) customTable: ElementRef
  @ViewChild('paging_comp') pagingComp: PagingComponent
  private unSubscribe$ = new Subject<void>()
  noOfDecimalPoint: any = 0
  onTextEnteredSub: Subscription
  searchKey: string = ''
  queryStr: string = ''
  queryStr$: Subscription
  menuData: any;
  constructor(private _saleDirectService: SaleDirectService,
    private commonService: CommonService,
    private settings: Settings,
    private gs: GlobalService,
    private toastrService: ToastrCustomService,
    private _loginService: LoginService,
    private router: Router
  ) {

    this.menuData = this._loginService.getMenuDetails(13, 9);
    this.clientDateFormat = this.settings.dateFormat
    this.noOfDecimalPoint = this.settings.noOfDecimal
    this.newPurchaseSub = this.commonService.getNewSaleDirectAddedStatus().subscribe(
      () => {
        this.getSaleDirectList()
      }
    )
    this.onTextEnteredSub = this._saleDirectService.search$.subscribe(
      (text: string) => {
        this.searchKey = text
        this.searchForStr(text)
      }
    )
    this.deleteSub = this.commonService.getDeleteStatus().subscribe(
      (obj) => {
        if (obj.id && obj.type && obj.type === 'Sale') {
          this.deleteItem(obj.id)
        }
      }
    )

    this.queryStr$ = this._saleDirectService.queryStr$.subscribe(
      (str) => {
        this.queryStr = str
        this.p = 1
        this.getSaleDirectList()
      }
    )

    this.commonService.reDirectViewListOfSaleStatus().subscribe(
      (action: any) => {
        let fromDate = JSON.parse(JSON.stringify(this.gs.clientToSqlDateFormat(action.fromDate, this.settings.dateFormat)))
        let toDate = JSON.parse(JSON.stringify(this.gs.clientToSqlDateFormat(action.toDate, this.settings.dateFormat)))
        this.queryStr = '&fromDate=' + fromDate + '&toDate=' + toDate
        this.redirectView = action.viewflag
        this.getSaleDirectList()
      }
    )
   
  }
  redirectView: boolean =  true
  searchForStr(text) {
    this.isSearching = true
    this.searchGetCall(text).subscribe((data) => {
      setTimeout(() => {
        this.isSearching = false
      }, 100)
      this.createTableData(data.Data.SaleDetails, data.Data.SaleSummary)

    }, (err) => {
      setTimeout(() => {
        this.isSearching = false
      }, 100)
    },
      () => {
        setTimeout(() => {
          this.isSearching = false
        }, 100)
      })
  }
  ngOnDestroy() {
    this.queryStr$.unsubscribe()
    this.deleteSub.unsubscribe()
    this.newPurchaseSub.unsubscribe()
    this.onTextEnteredSub.unsubscribe()
  }

  searchGetCall(term: string) {
    if (!term) {
      term = ''
    }
    this.pagingComp.setPage(1)
    return this._saleDirectService.getSaleDirectList('?StrSearch=' + term + '&Page=' + this.p + '&Size=' + this.itemsPerPage + this.queryStr)
  }

  ngOnInit() {
    setTimeout(() => {
      this.commonService.fixTableHF('cat-table')
    }, 500)
   // if(this.redirectView){
      this.getSaleDirectList()
    //}

  }

  onClicked(action, id) {
    action.id = id
    action['formname'] = this.formName
    this.commonService.onsaleDirectActionClicked(action)
    if (action.type === 4) {
      this.commonService.openDelete(id, 'Sale', 'Sale')
    }
    if (action.type === 11) {
      this.router.navigate([`ims/voucher-entry/sale/${id}`])
    }
  }
  getSaleDirectList() {
    //alert(1)
    if (!this.searchKey || this.searchKey.length === 0) {
      this.searchKey = ''
    }
    this.isSearching = true
    this._saleDirectService.getSaleDirectList('?StrSearch=' + this.searchKey + '&Page=' + this.p + '&Size=' + this.itemsPerPage + this.queryStr)
      .subscribe(data => {
        console.log(data)
        if (data.Code === UIConstant.THOUSAND) {
          if (data.Data.SaleDetails.length > 0) {
            this.notRecordFound = false
            this.createTableData(data.Data.SaleDetails, data.Data.SaleSummary)
          } else {
            this.createTableData(data.Data.SaleDetails, data.Data.SaleSummary)
            this.isSearching = false
            this.notRecordFound = true
          }
        }
      }, (error) => {
        this.isSearching = false
        this.toastrService.showError(error, '')
      })

  }
  notRecordFound: any = true
  createTableData(data, summary) {
    this.notRecordFound = false
    let customContent = [...data]
    let FlagReturn;
    customContent.forEach(element => {
      element.BillDate = this.gs.utcToClientDateFormat(element.BillDate, this.clientDateFormat)
      element.PartyBillDate = this.gs.utcToClientDateFormat(element.PartyBillDate, this.clientDateFormat)
      element.BillAmount = element.BillAmount.toFixed(this.noOfDecimalPoint)
      element.Discount = element.Discount.toFixed(this.noOfDecimalPoint)
      element.TaxAmount = element.TaxAmount.toFixed(this.noOfDecimalPoint)
      element.TotalTaxableAmount = element.TotalTaxableAmount.toFixed(this.noOfDecimalPoint)

      FlagReturn = element.PartialReturn === 1 ? {} : { type: FormConstants.Return, id: 0, text: 'Return' }

      this.actionList = [
        { type: FormConstants.Print, id: 0, text: 'Print', printId: 'saleDirect_Print', viewPrint: false },
        { type: FormConstants.ViewPrint, id: 0, text: 'View Print', printId: 'saleDirect_Print', viewPrint: true },
        { type: FormConstants.Edit, id: 0, text: 'Edit' },
        { type: FormConstants.Cancel, id: 0, text: 'Cancel' },
        { type: FormConstants.RECEIPT, id: 0, text: 'Receipt' },
        FlagReturn
      ]

    })
    this.customContent = customContent
    this.customHeader = [
      { text: 'S.No.', isRightAligned: false },
      { text: 'Party Details', isRightAligned: false },
      { text: 'Invoice No.', isRightAligned: false },
      { text: 'Invoice Date', isRightAligned: false },
      { text: 'Quantity', isRightAligned: true },
      { text: 'Discount', isRightAligned: true },
      { text: 'Taxable Amt', isRightAligned: true },
      { text: 'Tax Amount', isRightAligned: true },
      { text: 'Bill Amount', isRightAligned: true },
      { text: 'Action', isRightAligned: true }
    ]
    this.keys = [
      { text: 'LedgerName', isRightAligned: false },
      { text: 'BillNo', isRightAligned: false },
      { text: 'BillDate', isRightAligned: false },
      { text: 'TotalQty', isRightAligned: true, },
      { text: 'Discount', isRightAligned: true },
      { text: 'TotalTaxableAmount', isRightAligned: true },
      { text: 'TaxAmount', isRightAligned: true },
      { text: 'BillAmount', isRightAligned: true }]

    this.customFooter = [{
      colspan: 4, data: [
        +summary[0].TotalQty.toFixed(this.noOfDecimalPoint),
        +summary[0].Discount.toFixed(this.noOfDecimalPoint),
        +summary[0].Discount.toFixed(this.noOfDecimalPoint),
        +summary[0].TotalTaxableAmount.toFixed(this.noOfDecimalPoint),
        +summary[0].BillAmount.toFixed(this.noOfDecimalPoint)
      ]
    }]

    this.formName = FormConstants.SaleForm
    this.total = data[0] ? data[0].TotalRows : 0
    setTimeout(() => {
      this.isSearching = false
    }, 100)
    //}
  }


  deleteItem(id) {
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
