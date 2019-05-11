import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { ActivatedRoute } from '@angular/router'
import { ExcelService } from '../../../commonServices/excel.service'
import { UIConstant } from '../../../shared/constants/ui-constant'
import { ProfitReportService } from '../profit-report.service'
import { GlobalService } from '../../../commonServices/global.service'
import { Settings } from '../../../shared/constants/settings.constant'
declare const $: any
@Component({
  selector: 'app-profit-report-main',
  templateUrl: './profit-report-main.component.html'
})
export class ProfitReportMainComponent implements OnInit, OnDestroy {
  toShowSearch: boolean = false
  sub: Subscription
  title: string = ''
  clientDateFormat: string = ''
  constructor (private route: ActivatedRoute,
    private excelService: ExcelService,
    private profitReportService: ProfitReportService,
    private gs: GlobalService,
    private settings: Settings) {
    this.clientDateFormat = this.settings.dateFormat
  }
  toggleSearch () {
    this.toShowSearch = !this.toShowSearch
  }
  ngOnInit () {
    this.sub = this.route.data.subscribe(data => {
      this.title = data.title
    })
  }

  ngOnDestroy () {
    this.sub.unsubscribe()
  }

  getProfitReportData () {
    this.profitReportService.getProfitReportData().subscribe(data => {
      console.log('profit report data: ', data)
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        this.downloadSample(data.Data.TravelProfits)
      }
    })
  }
  downloadSample (data) {
    let datatoexport = []
    data.forEach((element, index) => {
      element.BillDate = this.gs.utcToClientDateFormat(element.BillDate, this.clientDateFormat)
      element.TravelDate = this.gs.utcToClientDateFormat(element.TravelDate, this.clientDateFormat)
      element.CommissionType = (+element.CommissionType === 0) ? '%' : element.Currency
      datatoexport.push({
        Sno: index + 1,
        ClientName: element['ClientName'],
        BillDate: element['BillDate'],
        Currency: element['Currency'],
        BookingNo: element['BookingNo'],
        SupplierName: element['SupplierName'],
        AirlineTicket: element['AirlineTicket'],
        Routing: element['Routing'],
        TicketNo: element['TicketNo'],
        TravelDate: element['TravelDate'],
        Company: element['Company'],
        Fare: element['Fare'],
        TaxAmount: element['TaxAmount'],
        ReIssueCharge: element['ReIssueCharge'],
        RefundPanelty: element['RefundPanelty'],
        Miscellaneouse: element['Miscellaneouse'],
        OtherCharge: element['OtherCharge'],
        LangiTax: element['LangiTax'],
        BillAmount: element['BillAmount'],
        CommissionToAuthorizor: element['CommissionToAuthorizor'],
        Commission: element['Commission'],
        CommissionType: element['CommissionType'],
        Profit: element['Profit']
      })
    })
    console.log('datatoexport : ', datatoexport)
    this.excelService.exportAsExcelFile(datatoexport, 'profit_report')
  }
}
