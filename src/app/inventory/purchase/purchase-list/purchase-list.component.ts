import { Component, ViewChild, ElementRef, OnInit } from '@angular/core'
import { Subscription } from 'rxjs/Subscription'
import { Settings } from '../../../shared/constants/settings.constant'
import { PurchaseService } from '../purchase.service'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
import { GlobalService } from 'src/app/commonServices/global.service'
import { UIConstant } from 'src/app/shared/constants/ui-constant'
import { FormConstants } from 'src/app/shared/constants/forms.constant'
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
  formName: number
  clientDateFormat: string
  @ViewChild('custom_table', { read: ElementRef }) customTable: ElementRef
  constructor (private purchaseService: PurchaseService,
    private commonService: CommonService,
    private settings: Settings,
    private gs: GlobalService
    ) {
    this.getPurchaseList()
    this.newPurchaseSub = this.commonService.getNewPurchaseAddedStatus().subscribe(
      () => {
        this.getPurchaseList()
      }
    )
    this.clientDateFormat = this.settings.dateFormat
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
  getPurchaseList () {
    this.purchaseService.getPurchaseList().subscribe(data => {
      console.log('purchase data: ', data)
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        let totalQty = 0
        let totalDiscount = 0
        let totalTaxAmount = 0
        let totalBillAmount = 0
        let customContent = data.Data
        customContent.forEach(element => {
          element.BillDate = this.gs.utcToClientDateFormat(element.BillDate, this.clientDateFormat)
          element.PartyBillDate = this.gs.utcToClientDateFormat(element.PartyBillDate, this.clientDateFormat)
          totalQty += +element.TotalQty
          totalDiscount += +element.Discount
          totalTaxAmount += +element.TaxAmount
          totalBillAmount += +element.BillAmount
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
          { type: FormConstants.Cancel, id: 0, text: 'Cancel' }
        ]
        this.customFooter = [{ colspan: 6, data: [totalQty.toFixed(2),
          totalDiscount.toFixed(2),
          totalTaxAmount.toFixed(2),
          totalBillAmount.toFixed(2)] }]
        // console.log('footer : ', this.customFooter)
        this.formName = FormConstants.Purchase
      }
    })
  }
}
