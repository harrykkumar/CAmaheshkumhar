import { Component, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { FormGroup } from '@angular/forms'
import { SaleTravel, AddCust } from '../../model/sales-tracker.model'
import { UIConstant } from '../../shared/constants/ui-constant'
declare const $: any
import { CommonService } from '../../commonServices/commanmaster/common.services'
import { ToastrCustomService } from '../../commonServices/toastr.service'
import { LoginService } from './../../commonServices/login/login.services';
import { SetUpIds } from 'src/app/shared/constants/setupIds.constant'
import { Settings } from '../../shared/constants/settings.constant'
@Component({
  selector: 'app-profit-and-loss-report',
  templateUrl: './profit-and-loss-report.component.html',
  styleUrls: ['./profit-and-loss-report.component.css']
})
export class ProfitAndLossReportComponent implements OnInit {
  DIRECT_SALE_TYPE: any = 'DirectSale'
  saleDirectDetails: any
  totalDiscount: number
  totaltax: number
  totalBillAmount: number
  newDateSub: Subscription
  toDateShow: any
  fromDateShow: any
  clientDateFormat: any
  constructor(public _loginService: LoginService, public _settings: Settings, public _commonService: CommonService, public _toastrCustomService: ToastrCustomService) {

    this.newDateSub = this._commonService.getsearchByDateForProfitLossStatus().subscribe(
      (obj: any) => {
        this.getModuleSettingValue = JSON.parse(this._settings.moduleSettings)
        this.getModuleSettingData()
        this.getbalancesheetdata(obj.toDate, obj.fromDate)
        this.toDateShow = obj.toDate
        this.fromDateShow = obj.fromDate
      }
    )

  }
  loggedinUserData: any
  ngOnInit() {
    this.onload()
    this.getbalancesheetdata(this.toDateShow, this.fromDateShow)


  }
  decimalDigit: any
  onload() {
    this.headervalue2 = 0
    this.headervalue1 = 0
    this.headervalue1First = 0
    this.headervalue2First = 0
    const organization = JSON.parse(localStorage.getItem('SELECTED_ORGANIZATION'))
    this.loggedinUserData = organization
    this.getModuleSettingValue = JSON.parse(this._settings.moduleSettings)
    this._commonService.fixTableHF('cat-table')
  }
  getModuleSettingValue: any
  getModuleSettingData() {
    if (this.getModuleSettingValue.settings.length > 0) {
      this.getModuleSettingValue.settings.forEach(ele => {
        if (ele.id === SetUpIds.noOfDecimalPoint) {
          this.decimalDigit = JSON.parse(ele.val)
        }
        if (ele.id === SetUpIds.dateFormat) {
          this.clientDateFormat = ele.val[0].Val
        }
      })
    }
  }

  toShowSearch = false

  toggleSearch() {
    this.toShowSearch = !this.toShowSearch
  }
  Attributelabel: any
  ItemDetails: any
  attributePerLableValue: any
  attributevalue: any
  allAttributeData: any
  localArray: any
  labelLength: any
  mainData: any
  AttributeValues: any
  headervalue1: any
  headervalue2: any
  headervalue1First: any = 0
  headervalue2First: any = 0

  getbalancesheetdata(todate, fromdate) {
    this.mainData = []
    this._commonService.getProfitAndLossList(todate, fromdate).subscribe(data => {
      this.headervalue2 = 0
      this.headervalue1 = 0
      if (data.Code === UIConstant.THOUSAND) {
        if (data.Data && data.Data.ProfitLosses && data.Data.ProfitLosses.length > 0) {
          this.mainData = data.Data.ProfitLosses
        }
        if (data.Data && data.Data.ProfitLossSummary.length > 0) {
          data.Data.ProfitLossSummary.forEach(element => {
            if (element.HeadId === 1) {
              this.headervalue1 = element.Amount1
              this.headervalue1First = element.Amount
            }
            else if (element.HeadId === 2) {
              this.headervalue2 = element.Amount1
              this.headervalue2First = element.Amount

            }
          });
        }
      }
    })

  }
}








