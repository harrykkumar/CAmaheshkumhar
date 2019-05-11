import { Component, OnInit } from '@angular/core'
import { Subscription } from 'rxjs/Subscription'
import { Settings } from '../../../shared/constants/settings.constant'
import { GlobalService } from '../../../commonServices/global.service'
import { ProfitReportService } from '../profit-report.service'
import { UIConstant } from '../../../shared/constants/ui-constant'
import { FormConstants } from '../../../shared/constants/forms.constant'
import { CommonService } from '../../../commonServices/commanmaster/common.services'
@Component({
  selector: 'app-profit-report-list',
  templateUrl: './profit-report-list.component.html',
  styleUrls: ['./profit-report-list.component.css']
})
export class ProfitReportListComponent implements OnInit {
  customHeader: any = []
  customContent: any = []
  keys: any = []
  actionList: any = []
  customFooter: any = []
  newPurchaseSub: Subscription
  formName: number
  class: string
  clientDateFormat: string
  constructor (
    private settings: Settings,
    private gs: GlobalService,
    private profitReportService: ProfitReportService,
    private commonService: CommonService
    ) {
    this.getProfitReportData()
    this.clientDateFormat = this.settings.dateFormat
  }

  ngOnInit () {
    setTimeout(() => {
      this.commonService.fixTableHF('cat-table')
    }, 1000)
  }

  getProfitReportData () {
    this.profitReportService.getProfitReportData().subscribe(data => {
      console.log('profit report data: ', data)
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        let totalFare = 0
        let totalDiscount = 0
        let totalTaxAmount = 0
        let totalBillAmount = 0
        let totalReissue = 0
        let totalRefund = 0
        let misc = 0
        let otherCharge = 0
        let langiTax = 0
        let commissionAuth = 0
        let totalProfit = 0
        let customContent = data.Data.TravelProfits
        customContent.forEach(element => {
          element.BillDate = this.gs.utcToClientDateFormat(element.BillDate, this.clientDateFormat)
          element.TravelDate = this.gs.utcToClientDateFormat(element.TravelDate, this.clientDateFormat)
          element.CommissionType = (+element.CommissionType === 0) ? '%' : element.Currency
          totalFare += +element.Fare
          totalDiscount += +element.Discount
          totalTaxAmount += +element.TaxAmount
          totalBillAmount += +element.BillAmount
          totalReissue += +element.ReIssueCharge
          totalRefund += +element.RefundPanelty
          misc += +element.Miscellaneouse
          otherCharge += +element.OtherCharge
          langiTax += +element.LangiTax
          commissionAuth += +element.CommissionToAuthorizor
          totalProfit += +element.Profit
        })
        this.customContent = customContent
        this.customHeader = [
          { text: 'S.No.', isRightAligned: false },
          { text: 'Client Name', isRightAligned: false },
          { text: 'Bill Date', isRightAligned: false },
          { text: 'Currency', isRightAligned: false },
          { text: 'Booking No', isRightAligned: false },
          { text: 'Supplier Name', isRightAligned: true },
          { text: 'Airline Ticket', isRightAligned: true },
          { text: 'Routing', isRightAligned: true },
          { text: 'Ticket No', isRightAligned: true },
          { text: 'Travel Date', isRightAligned: true },
          { text: 'Company', isRightAligned: true },
          { text: 'Fare', isRightAligned: true },
          { text: 'Total Tax', isRightAligned: true },
          { text: 'ReIssue Charges', isRightAligned: true },
          { text: 'Refund Panelty', isRightAligned: true },
          { text: 'Miscellaneous', isRightAligned: true },
          { text: 'Other Charge', isRightAligned: true },
          { text: 'Langi Tax', isRightAligned: true },
          { text: 'Bill Amount', isRightAligned: true },
          { text: 'Discount', isRightAligned: true },
          { text: 'Commission Authorizer', isRightAligned: true },
          { text: 'Commission', isRightAligned: true },
          { text: 'Commision Type', isRightAligned: true },
          { text: 'Profit', isRightAligned: true },
          { text: 'Action', isRightAligned: true }
        ]
        this.keys = [
          { text: 'ClientName', isRightAligned: false },
          { text: 'BillDate', isRightAligned: false },
          { text: 'Currency', isRightAligned: false },
          { text: 'BookingNo', isRightAligned: false },
          { text: 'SupplierName', isRightAligned: false },
          { text: 'AirlineTicket', isRightAligned: false },
          { text: 'Routing', isRightAligned: false },
          { text: 'TicketNo', isRightAligned: false },
          { text: 'TravelDate', isRightAligned: false },
          { text: 'Company', isRightAligned: false },
          { text: 'Fare', isRightAligned: true },
          { text: 'TaxAmount', isRightAligned: true },
          { text: 'ReIssueCharge', isRightAligned: true },
          { text: 'RefundPanelty', isRightAligned: true },
          { text: 'Miscellaneouse', isRightAligned: true },
          { text: 'OtherCharge', isRightAligned: true },
          { text: 'LangiTax', isRightAligned: true },
          { text: 'Discount', isRightAligned: true },
          { text: 'BillAmount', isRightAligned: true },
          { text: 'CommissionToAuthorizor', isRightAligned: true },
          { text: 'Commission', isRightAligned: true },
          { text: 'CommissionType', isRightAligned: true },
          { text: 'Profit', isRightAligned: true }
        ]
        this.actionList = [
          { type: FormConstants.Print, id: 0, text: 'Print', printId: '' },
          { type: FormConstants.Edit, id: 0, text: 'Edit' },
          { type: FormConstants.Cancel, id: 0, text: 'Cancel' }
        ]
        this.customFooter = [
          { colspan: 11, data: [
            totalFare.toFixed(2),
            totalTaxAmount.toFixed(2),
            totalReissue.toFixed(2),
            totalRefund.toFixed(2),
            misc.toFixed(2),
            otherCharge.toFixed(2),
            langiTax.toFixed(2),
            totalDiscount.toFixed(2),
            totalBillAmount.toFixed(2),
            commissionAuth.toFixed(2)
          ]
          },
          { colspan: 2, data: [
            totalProfit.toFixed(2)] }
        ]
        console.log('footer : ', this.customFooter)
        this.formName = FormConstants.ProfitReport
        this.class = 'fixTable1'
      }
    })
  }
}
