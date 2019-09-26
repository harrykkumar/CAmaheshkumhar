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
//import * as jsPDF from 'jspdf'
import { GlobalService } from '../../commonServices/global.service'

@Component({
  selector: 'app-trail-balance-report',
  templateUrl: './trail-balance-report.component.html',
  styleUrls: ['./trail-balance-report.component.css']
})
export class TrailBalanceReportComponent implements OnInit {
  DIRECT_SALE_TYPE: any = 'DirectSale'
  saleDirectDetails: any
  totalDiscount: number
  totaltax: number
  totalBillAmount: number
  newDateSub: Subscription
  toDateShow: any
  fromDateShow: any
  ListTypeFilter: any = []
  clientDateFormat: any
  constructor(public gs: GlobalService, public _loginService: LoginService, public _settings: Settings, public _commonService: CommonService, public _toastrCustomService: ToastrCustomService) {
    this.newDateSub = this._commonService.getsearchByDateForTradingStatus().subscribe(
      (obj: any) => {
        this.getModuleSettingValue = JSON.parse(this._settings.moduleSettings)
        this.getModuleSettingData()
        this.mainDataList = []
        this.selectedid = false
        this.onload()
        this.ListTypeFilter = [{ id: 0, name: 'Summary' }, { id: 1, name: 'Details' }]

        this.toDateShow = this.gs.utcToClientDateFormat(this._settings.finToDate, this.clientDateFormat)
        this.fromDateShow = this.gs.utcToClientDateFormat(this._settings.finFromDate, this.clientDateFormat)
        this.getbalancesheetdata()


      }
    )
  }

  loggedinUserData: any
  ngOnInit() {
    this.onload()
  }
  searchResetButton() {
    this.toDateShow = ''
    this.fromDateShow = ''
    this.getbalancesheetdata()
  }
  searchButton() {
    this.getbalancesheetdata()
  }
  decimalDigit: any
  onload() {
    this.headervalue2 = 0
    this.headervalue1 = 0
    this.headervalue1First = 0
    this.headervalue2First = 0
    const organization = JSON.parse(localStorage.getItem('SELECTED_ORGANIZATION'))
    this.loggedinUserData = organization
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

  headI1dDataList: any = []
  headI2dDataList: any = []
  selectedid: boolean = false
  changeSummary(evt) {
    this.mainData = []
    if (evt.target.checked) {
      this.mainData = this.mainDataList
      
    }
    else {
      this.selectedid = false
      let data = this.mainDataList
      this.SummaryData(data)
    }
  }
  headI1dData: any = []
  headI2dData: any = []
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
  mainDataList: any = []
  getbalancesheetdata() {
    let todate;
    let fromDate;
    if (this.toDateShow !== '') {
      todate = this.gs.clientToSqlDateFormat(this.toDateShow, this.clientDateFormat)
    }
    else {
      todate = ''
    }
    if (this.fromDateShow !== '') {
      fromDate = this.gs.clientToSqlDateFormat(this.fromDateShow, this.clientDateFormat)
    }
    else {
      fromDate = ''
    }
    // this.mainData = []
    this.mainDataList = []
    this._commonService.getTrailBalanceReport(fromDate, todate).subscribe(data => {
      this.headervalue2 = 0
      this.headervalue1 = 0
      if (data.Code === UIConstant.THOUSAND) {
        if (data.Data && data.Data.TrailBalance && data.Data.TrailBalance.length > 0) {
          this.mainDataList = data.Data.TrailBalance
          // this.headI1dDataList = data.Data.TrailBalance.filter(s => s.HeadId === 1)
          // this.headI2dDataList = data.Data.TrailBalance.filter(s => s.HeadId === 2)
          let evt = {
            target: {
              checked: false
            }
          }
          this.changeSummary(evt)

        }
        if (data.Data && data.Data.TrailBalanceSummary.length > 0) {
          data.Data.TrailBalanceSummary.forEach(element => {
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


  SummaryData(head1) {
    this.headI1dData = [];
    this.headI2dData = []
    if (head1.length > 0) {
      head1.forEach(element => {
        if (element.LevelNo === 1) {
          this.mainData.push(element)
        }
      });
    }
    if (head1.length > 0) {
      // head2.forEach(element => {
      //   if (element.LevelNo === 1 || element.LevelNo === 2) {
      //     this.headI2dData.push(element)
      //   }
      // });
    }

  }
}








