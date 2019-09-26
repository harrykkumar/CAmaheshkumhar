import { PagingComponent } from './../../shared/pagination/pagination.component';
import { GlobalService } from 'src/app/commonServices/global.service';
import {SaleDirectMainComponent} from 'src/app/inventory/sale-direct/sale-direct-main/sale-direct-main.component'
import { Settings } from './../../shared/constants/settings.constant';
import { UIConstant } from 'src/app/shared/constants/ui-constant';
import { ToastrCustomService } from './../../commonServices/toastr.service';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash'
import { Subject } from 'rxjs';
declare var $: any
declare var flatpickr: any
import { ExcelService } from '../../commonServices/excel.service';
import { Select2OptionData, Select2Component } from 'ng2-select2'
import { FormConstants } from 'src/app/shared/constants/forms.constant'
import { Router } from '@angular/router';

@Component({
  providers:[SaleDirectMainComponent ],
  selector: 'app-sale-summary',
  templateUrl: './sale-summary.component.html',
  styleUrls: ['./sale-summary.component.css']
})
export class SaleSummaryReportComponent implements OnInit, AfterViewInit {
  cashBook: any = {}
  ledgerItemList: any = [];
  clientDateFormat: any
  model: any = {};
  lastItemIndex: number = 0
  pageSize: number = 20
  pageNo: number = 1
  totalItemSize: number = 0
  @ViewChild('ledger_paging') ledgerPagingModel: PagingComponent
  private unSubscribe$ = new Subject<void>()

  constructor(
    private _router : Router,
    private saleMainComponent:SaleDirectMainComponent,
    public excelService:ExcelService,
    public _globalService: GlobalService,
    public _settings: Settings,
    public _commonService: CommonService,
    private _toastService: ToastrCustomService,
  ) {
    this.clientDateFormat = this._settings.dateFormat
    this.noOfDecimal = this._settings.noOfDecimal
    this.getLedgerItemList();
  }
  noOfDecimal: any
  viewFlag: any
  ngOnInit() {
    //this.allTotal =0
    this.viewFlag = true
    this.isViewPrint = false
    this._commonService.fixTableHF('cat-table')
    this.getSaleSummaryData();
    let event = {
      data: [{
        id: 1,
        text: 'Month',
        type: 'monthWise'
      }]
    }
    this.onLedgerItemChange(event)
    this.model = {
      selectedLedgerItem: { type: 'monthWise' }
    }
  }

  ngAfterViewInit() {
    this.toDate()
    this.fromDate()
  }
  fromDate = () => {
    this.model.fromDatevalue = this._globalService.utcToClientDateFormat(this._settings.finFromDate, this.clientDateFormat)
 
  }

  toDate = () => {
    this.model.toDateValue =  this._globalService.utcToClientDateFormat(this._settings.finToDate, this.clientDateFormat)
  }
  selectedType: any;
  onLedgerItemChange = (event) => {
    this.viewFlag = true
    this.isViewPrint = false
    this.getTypeEWise = event.data[0].type
    this.selectedType = event.data[0].text
    if (+event.value === 1) {
      this.model.startDate = ''
      this.model.endDate = ''
    }
    this.getSaleSummaryData()
  }

  getLedgerItemList = () => {
    this.ledgerItemList = [
      { id: 1, text: 'Month ', type: 'monthWise' },
      { id: 2, text: 'Day ', type: 'dayWise' },
      { id: 3, text: 'Bill ', type: 'billWise' }
    ]
  }
  getsetTypeWise = (type) => {
    if (type === 'monthWise') {
      let event1 = {
        data: [{
          id: 2,
          text: 'Day',
          type: 'dayWise'
        }]
      }
      this.onLedgerItemChange(event1)
      this.setTypeWise.setElementValue(event1.data[0].id)
      return 'dayWise'
    }
    if (type === 'dayWise') {
      let event2 = {
        data: [{
          id: 3,
          text: 'Bill No.',
          type: 'billWise'
        }]
      }
    
      this.onLedgerItemChange(event2)
      this.setTypeWise.setElementValue(event2.data[0].id)
      return 'billWise'
    }
    if (type === 'billWise') {
      let event3 = {
        data: [{
          id: 3,
          text: 'Bill No.',
          type: 'billWise'
        }]
      }
     

      this.onLedgerItemChange(event3)
      this.setTypeWise.setElementValue(event3.data[0].id)
        return 'billWise'
    }

  }
  getTypeEWise: any
  getNextData(item) {
    this.viewFlag = true
    this.isViewPrint = false
    this.model.startDate = item.startDate
    this.model.endDate = item.endDate
    this.getTypeEWise = this.getsetTypeWise(item.type)
    this.getSaleSummaryData()
    if(this.getTypeEWise ==='billWise' && item.saleId >0 ){
        let action={}
         action =
               { type: FormConstants.ViewPrint,
                 id: item.saleId
             ,isViewPrint :true}
          //  this._router.navigate(['ims/sale'])
           // this.saleMainComponent.onPrintForDirectSale(item.saleId,'saleDirect_PrintType1',true)

      }

  }
  // onLoadPrint() {
  //   if (this.PrintFormateType === 1) {
  //     return 'saleDirect_PrintType1'
  //   }
  //   if (this.PrintFormateType === 2) {
  //     return 'saleDirect_PrintType2'
  //   }
  //   if (this.PrintFormateType === 3) {
  //     return 'saleDirect_PrintType3'
  //   }
  //   if (this.PrintFormateType === 4) {
  //     return 'saleDirect_PrintType4'
  //   }

  // }
  @ViewChild('setWise') setTypeWise: Select2Component
  HeadingLedger: any = []
  getValueFalg: boolean = true
  getLedgerUniqName(data) {
    this.HeadingLedger = []
    let groupOnId = _.groupBy(data, (lgr) => {
      return lgr.Name
    })
    //  console.log(groupOnId)
    for (const name in groupOnId) {
      if (groupOnId.hasOwnProperty(name)) {
        const element = groupOnId[name];
        let obj = {}
        obj['name'] = name
        obj['id'] = element[0]['Id']
        this.HeadingLedger.push(obj)
      }
    }
  }
  MonthlyData: any = []
  monthGroup: any = []
  getData: any = []





  orgDetails: any = {}
  startDateChanage: any
  endDateChanage: any
  getSaleSummaryData = () => {
    let fromDate, toDate
    if (this.model.fromDatevalue) {
      fromDate = this._globalService.clientToSqlDateFormat(this.model.fromDatevalue, this.clientDateFormat)
    }
    if (this.model.toDateValue) {
      toDate = this._globalService.clientToSqlDateFormat(this.model.toDateValue, this.clientDateFormat)
    }
    if (this.model.startDate) {
      fromDate = this._globalService.clientToSqlDateFormat(this.model.startDate, this.clientDateFormat)
    }
    if (this.model.endDate) {
      toDate = this._globalService.clientToSqlDateFormat(this.model.endDate, this.clientDateFormat)
    }
    const data = {
      FromDate: fromDate ? fromDate : '',
      ToDate: toDate ? toDate : '',
      Type: 'sale',
      Page: this.pageNo,
      Size: this.pageSize,
      ReportFor: this.getTypeEWise ? this.getTypeEWise : 'monthWise',
    }
    this._commonService.getReporSalePurchaserSummary(data).pipe(
      takeUntil(this.unSubscribe$)
    ).subscribe((response: any) => {
      if (response.Code === UIConstant.THOUSAND && response.Data && response.Data.Itemstockdetails.length > 0) {
        this.orgDetails = response.Data;
        let value = []
        this.getLedgerUniqName(response.Data.Ledgers)
        this.totalMonthSummary(response.Data.LedgerBottomSummary)

        response.Data.Itemstockdetails.forEach(element => {
          this.startDateChanage = this._globalService.utcToClientDateFormat(element.StartDate, this.clientDateFormat)
          this.endDateChanage = this._globalService.utcToClientDateFormat(element.EndDate, this.clientDateFormat)

          let ledger = response.Data.Ledgers.filter(
            s => s.Id === element.Id)
          if (ledger.length > 0) {
            value.push({
              id: element.Id,
              saleId:element.TransId,
              month: element.Month,
              endDate: this.endDateChanage,
              startDate: this.startDateChanage,
              name: ledger[0].Name,
              balance: element.Balance,
              type: element.ItemType
            })
          }
        });
        this.getMonthWiseData(value, response.Data.TopRightSummary)
        this.getValueFalg = false
        //  this.totalItemSize = response.Data.CashBook[0].TotalRows;
        if (this.isViewPrint) {
          this.printLoad(this.htmlLoadid, this.isViewPrint)
        }
      } else if (response.Code === UIConstant.THOUSAND && response.Data && response.Data.Itemstockdetails.length === 0) {
        this.getValueFalg = true
        this.orgDetails = {
          Itemstockdetails: [],
          TopRightSummary: [],
          LedgerBottomSummary: [],
          AddressDetails: [],
          ContactInfoDetails: [],
          EmailDetails: [],
          OrganizationDetails: [],
          ImageContents: []
        }
        this.totalItemSize = 0;
      } else {
        this._toastService.showError("Error in Data Fetching", '');
      }
    }, (error) => {
      //console.log(error);
    });
    this.viewPrint = false

  }

  getMonthWiseData(data, totalMonthValue) {
    this.MonthlyData = []
    this.monthGroup = _.groupBy(data, (lgr) => {
      return lgr.month
    })
    for (const month in this.monthGroup) {
      let calTotalMonth = this.topToBottomSummary(totalMonthValue)
     // console.log(calTotalMonth, 'tatal')
      let ledger = []
      let obj = {}
      if (this.monthGroup.hasOwnProperty(month)) {
        const element = this.monthGroup[month];
        const totalelement = calTotalMonth[month];
        this.HeadingLedger.forEach(del => {
          let index = element.findIndex(n => n.id === del.id)
          if (index >= 0) {
            ledger.push({
              balance: (element[index].balance).toFixed(this.noOfDecimal),
            })
            obj['month'] = element[index].month
            obj['saleId'] = element[index].saleId
            obj['type'] = element[index].type
            obj['endDate'] = element[index].endDate
            obj['startDate'] = element[index].startDate
            obj['ledger'] = [...ledger]
            obj['MonthwiseTotal'] = calTotalMonth[month][0].Balance.toFixed(this.noOfDecimal)

          } else {
            ledger.push({
              balance: ' '
            })
            obj['month'] = element[0].month
            obj['saleId'] = element[0].saleId
            obj['type'] = element[0].type
            obj['endDate'] = element[0].endDate
            obj['startDate'] = element[0].startDate
            obj['ledger'] = [...ledger]
          }
        });
      }
      this.MonthlyData.push(obj)
    }
    
   // console.log(this.MonthlyData, 'monthlys')

  }

  totalSummary: any = []
  totalLegummary: any = []
  allTotal: any = 0
  totalMonthSummary = (data) => {
   
    //this.allTotal = 0
    this.totalSummary = []
    let totalgroup = _.groupBy(data, (lgr) => {
      return lgr.Id
    })
    for (const Lid in totalgroup) {
      let obj = {}
      if (totalgroup.hasOwnProperty(Lid)) {
        const element = totalgroup[Lid];
        element.forEach(del => {
          let index = this.HeadingLedger.findIndex(n => n.id === del.Id)
          if (index >= 0) {
            obj['balance'] = element[0].Balance
          }
        });
      }
      this.totalSummary.push(obj)
    }
    if (this.totalSummary.length > 0) {
      this.allTotal = this.calculateallTotal(this.totalSummary)
    //  console.log( this.allTotal,this.totalSummary)
    }

  }


  calculateallTotal = (summay) => {
    let totalJediScore = 0
    totalJediScore = summay
      .filter(sum => sum.balance)
      .map(val => val.balance)
      .reduce((i, m) => i + m, 0);
    return totalJediScore;
  }
  monthWiseSummary: any

  topToBottomSummary = (valdata) => {
    this.monthWiseSummary = []
    let totalgroup = _.groupBy(valdata, (delr) => {
      return delr.Month
    })
    return totalgroup

  }
  onPageNoChange = (event) => {
    this.pageNo = event
    this.isViewPrint = false

    this.getSaleSummaryData()
  }

  onPageSizeChange = (event) => {
    this.pageSize = event
    this.isViewPrint = false
    this.getSaleSummaryData()
  }
  searchButton() {
    this.viewFlag = true
    this.isViewPrint = false
    this.getSaleSummaryData()
  }
  onLastValueChange = (event) => {
    this.lastItemIndex = event
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next()
    this.unSubscribe$.complete()
  }

  searchResetButton() {
    this.viewFlag = true
    this.isViewPrint = false
    this.model.toDateValue = ''
    this.model.fromDatevalue = ''
    this.model.startDate = ''
    this.model.endDate = ''
    this.getSaleSummaryData()
  }
  isViewPrint: boolean = false
  htmlLoadid: any = 0
  viewPrint: any
  openPrint(HtmlId, isViewPrint) {
    this.viewFlag = false
    this.isViewPrint = isViewPrint
    this.htmlLoadid = HtmlId
    this.getSaleSummaryData()
  }
  closeBtn() {
    this.viewFlag = true
  }

  printLoad(cmpName, isViewForm) {
    let title = document.title
    let divElements = document.getElementById(cmpName).innerHTML
    let printWindow = window.open()
    printWindow.document.open()
    printWindow.document.write('<html><head><title>' + title + '</title><style>body{font-size:.75rem;color:#000!important;overflow-x:hidden;font-family:Calibri,sans-serif!important;position:relative;width:21cm;height:29.7cm;margin:0 auto}div{display:block}.row{display:flex;flex-wrap:wrap;padding-right:5px;padding-left:5px}.col-md-12{flex:0 0 100%;max-width:100%}.col-md-3{flex:0 0 25%;max-width:25%}.col-md-3{flex:0 0 25%;max-width:25%}.col-md-4{flex:0 0 33.333333%;max-width:33.333333%}.col-md-6{flex:0 0 50%;max-width:50%}.col,.col-1,.col-10,.col-11,.col-12,.col-2,.col-3,.col-4,.col-5,.col-6,.col-7,.col-8,.col-9,.col-auto,.col-lg,.col-lg-1,.col-lg-10,.col-lg-11,.col-lg-12,.col-lg-2,.col-lg-3,.col-lg-4,.col-lg-5,.col-lg-6,.col-lg-7,.col-lg-8,.col-lg-9,.col-lg-auto,.col-md,.col-md-1,.col-md-10,.col-md-11,.col-md-12,.col-md-2,.col-md-3,.col-md-4,.col-md-5,.col-md-6,.col-md-7,.col-md-8,.col-md-9,.col-md-auto,.col-sm,.col-sm-1,.col-sm-10,.col-sm-11,.col-sm-12,.col-sm-2,.col-sm-3,.col-sm-4,.col-sm-5,.col-sm-6,.col-sm-7,.col-sm-8,.col-sm-9,.col-sm-auto,.col-xl,.col-xl-1,.col-xl-10,.col-xl-11,.col-xl-12,.col-xl-2,.col-xl-3,.col-xl-4,.col-xl-5,.col-xl-6,.col-xl-7,.col-xl-8,.col-xl-9,.col-xl-auto{position:relative;width:100%;min-height:1px}.justify-content-center{justify-content:center!important}.bdr_left{border-left:1px solid #000}.bdr_right{border-right:1px solid #000}.bdr_top{border-top:1px solid #000}.bdr_bottom{border-bottom:1px solid #000}.text-center{text-align:center!important}.text-right{text-align:right!important}.text-left{text-align:left!important}.p-2{padding:.5rem!important}.p-1{padding:.25rem!important}.font-weight-bold{font-weight:700!important}.name_size{font-size:22px}.amount_bs{text-align:right;padding:0 3px}.main-balance .tfoot,.main-balance .thead{font-weight:600;padding:5px 3px;font-size:.8rem;border-top:1px solid #000;border-bottom:1px solid #000}.col-3{flex:0 0 25%;max-width:25%}.col{flex-basis:0;flex-grow:1;max-width:100%}.p-0{padding:0!important}.ittelic{font-style:italic}*,::after,::before{box-sizing:border-box}.bdr_right_fix{min-height:25px;border-right:1px solid #000}.bdr_left_fix{min-height:25px;border-left:1px solid #000}.d-block{display:block}table{width:100%;border-collapse:collapse;border-spacing:0;margin-bottom:20px}thead{display:table-header-group;vertical-align:middle;border-color:inherit}table td,table th{padding:3px;text-align:left;border-bottom:1px solid #fff;word-break:break-word}table th{white-space:nowrap;font-weight:600;font-size:.8rem;border:1px solid #000;background-color:#000!important;color:#fff!important;text-align:center}tr:nth-child(even){background-color:#d9e1f2}table td{text-align:left;border:1px solid #000;font-size:.75rem;}@media print{table th{background-color:#000!important;-webkit-print-color-adjust:exact}tr:nth-child(even){background-color:#d9e1f2;-webkit-print-color-adjust:exact}}@media print{table th{color:#fff!important}}</style></head><body>')
    printWindow.document.write(divElements)
    printWindow.document.write('</body></html>')
    printWindow.document.close()
    printWindow.focus()
    // $('#' + cmpName).modal(UIConstant.MODEL_HIDE)
    this.viewFlag = true
    setTimeout(function () {
      //   if(this.isViewForm){
      document.getElementsByTagName('body')[0].classList.add('hidden-print');
      printWindow.print()
      printWindow.close()
      //}

    }, 100)

  }
  mainDataExcel:any =[]
  exportExcel (){
    if(this.MonthlyData.length > 0){
      this.excelService.exportAsExcelFile(this.MonthlyData, 'Sale-summary Report')
    }
}
}
