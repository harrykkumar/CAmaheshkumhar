
// import * as CanvasJS from '../../../../assets/js/canvasjs.min';
import { CommonService } from '../../../commonServices/commanmaster/common.services'
import { Component, Renderer2, ViewChild, ViewChildren, QueryList } from '@angular/core'
import { Subscription } from 'rxjs'
import { AddCust, ResponseSale } from '../../../model/sales-tracker.model'
import { Select2OptionData, Select2Component } from 'ng2-select2'
import { VendorServices } from '../../../commonServices/TransactionMaster/vendoer-master.services'
import { ToastrCustomService } from '../../../commonServices/toastr.service'
import { UIConstant } from '../../../shared/constants/ui-constant'
import { ItemmasterServices } from '../../../commonServices/TransactionMaster/item-master.services'
import { GlobalService } from '../../../commonServices/global.service'
import { Settings } from '../../../shared/constants/settings.constant'
import { FormConstants } from 'src/app/shared/constants/forms.constant';
import { SetUpIds } from 'src/app/shared/constants/setupIds.constant'
import { parse } from 'path';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ChartsModule } from 'ng2-charts';
import { NgxSpinnerService } from 'ngx-spinner';
// import { GlobalService } from '../../../commonServices/global.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './ims-dashboard.component.html',
  styleUrls: ['./ims-dashboard.component.css']
})
export class DashboardComponent {
  DateFormate: any
  noOfDecimal: any = 0

  constructor(public gs:GlobalService,public _settings: Settings,
    public _commonService: CommonService,
    private spinnerService: NgxSpinnerService
  ) {
    this.spinnerService.hide()
  }
  finToDate;
  FinFromDate;
  ngOnInit() {
    this.getSetUpModules((JSON.parse(this._settings.moduleSettings).settings))

    this.spinnerService.hide();
    this.DateFormate = this._settings.dateFormat
    this.noOfDecimal = this._settings.noOfDecimal
    this.finToDate = this._settings.finFromDate
    this.FinFromDate = this._settings.finToDate
    let todate = this.gs.utcToClientDateFormat( this.finToDate, this.clientDateFormat)
    let fromDate = this.gs.utcToClientDateFormat(this.FinFromDate, this.clientDateFormat)
    console.log(todate,fromDate, 'yes-findate')

    this.getDashBoard(todate,fromDate)
   
  }
  clientDateFormat:any =''
  getSetUpModules(settings) {
    console.log('settings : ', settings)
    settings.forEach(element => {
      if (element.id === SetUpIds.dateFormat) {
        this.clientDateFormat = element.val[0].Val
      }
    })
   
  }
  subscribe: Subscription
  AssestsPoints: any
  AllDataDashboard: any
  changeType(value) {
    if (value === 'sale') {
      this.SaleOverDueItem = []
      let SaleOverDue = this.AllDataDashboard.OverDueDetails.filter(d => (d.Type).toUpperCase() === "SALE")
      if (SaleOverDue.length > 0) {
        this.SaleOverDueItem = SaleOverDue
      }
    }
    else if (value === 'purchase') {
      this.SaleOverDueItem = []
      let PurchaseOverDue = this.AllDataDashboard.OverDueDetails.filter(d => (d.Type).toUpperCase() === "PURCHASE")
      if (PurchaseOverDue.length > 0) {
        this.SaleOverDueItem = PurchaseOverDue


      }
    }

  }
  SaleOverDueItem: any = []
  PuchaseOverDueItem: any = []
  assetsAmountData: any = []
  assetsLabelData: any = []

  libiabititsAmountData: any = []
  libiabititsLabelData: any = []
  ChartFlowdata:any =[]
  ChartflowLabelData:any =[]
  fincialdata:any=[]
  getDashBoard(todate ,fromDate) {
    this.subscribe = this._commonService.getDashBoardData('?TypeWise=Month'+'&fromDate='+todate+'&todate='+fromDate).subscribe(resp => {
      if (resp.Code === UIConstant.THOUSAND) {
        console.log(resp.Data, 'Dashboard')
        this.AllDataDashboard = resp.Data
        this.assetsAmountData = []
        this.libiabititsAmountData = []
        this.libiabititsLabelData = []
        this.ChartFlowdata =[]
        this.ChartflowLabelData=[]
        resp.Data.AssestsLiabilities.forEach(element => {
          if (element.HeadId === 2) {
            this.libiabititsAmountData.push(
              element.Amount1
            )
            this.libiabititsLabelData.push(element.GlName
            )
          }
          if (element.HeadId === 1) {
            this.assetsAmountData.push(
              element.Amount1
            )
            this.assetsLabelData.push(
              element.GlName
            )
          }
        });
        //CashFlow
        resp.Data.CashFlow.forEach(element => {
          this.ChartFlowdata.push({
            label: element.Status,
            backgroundColor: "#3e95cd",
            data:[ element.CashIn,element.CashOut]
          })
          this.ChartflowLabelData.push(element.Status)
        });
        console.log(this.ChartFlowdata,'Data-cash flow')
         this.fincialdata=[]
        let fincialLable=[]
        let data=[]
        resp.Data.Finance.forEach(element => {
          if(element.GlId ===18 || element.GlId ===17 || element.GlId === -999){
            this.fincialdata.push({
              label:element.GlName,
              borderColor: "#3e95cd",
              data :(element.Amount1)
            })
            fincialLable.push(
              (element.GlName)
            )
         
          }
        });
        console.log(this.fincialdata,'finacial-Data')
       // {
          //   data: [5586, 15514, 5555, 54454, 10755, 1115, 1353, 2251, 7853, 24578],
          //   label: "Sale",
          //   borderColor: "#3e95cd",
          //   fill: false
          // }
        this.ChartLiabilities(this.libiabititsAmountData, this.libiabititsLabelData)
        this.chartForAssets(this.assetsAmountData, this.assetsLabelData)
        this.chartForCashFlow(this.ChartFlowdata,this.ChartflowLabelData)
        this.ChartForFinance(this.fincialdata,fincialLable)
        console.log(resp.Data, 'kkk')
        this.AssestsPoints = []
        let assets = []
        resp.Data.Assests.forEach(element => {
          assets.push({
            y: element.TotalAsset,
            name: element.LedgerName
          })
        });
        this.AssestsPoints = assets
      }
      else if (resp.Code === UIConstant.THOUSAND && resp.Data.length === 0) {
        this.AllDataDashboard = {
          Assests: [],
          Creators: [],
          Debtors: [],
          InventoryGrowths: [],
          Libilities: [],
          OverDueDetails: [],
          ProfitDetails: []
        }
      }
    })
  }
  finacialLabels;
  finacialchartOptions;
  finacialchartData;
  ChartForFinance(FincialData,label) {
    this.finacialchartOptions = {
      responsive: true
    };
if(FincialData.length>0){
  this.finacialchartData = FincialData

}
    // this.finacialchartData = [{
    //   data: [5586, 15514, 5555, 54454, 10755, 1115, 1353, 2251, 7853, 24578],
    //   label: "Sale",
    //   borderColor: "#3e95cd",
    //   fill: false
    // }, 

    // ]
    if(label.length>0){
      this.finacialLabels = label;

    }
  }
  AssetschartOptions;
  assetschartData;
  assetschartLabels;
  onChartFinacilClick() {

  }
  chartForAssets(AmountData,LabelData) {
    this.AssetschartOptions = {
      responsive: true
    };
    if(AmountData.length >0){
      this.assetschartData = [
        { data: AmountData}
      ]
    }
    if(LabelData.length >0){
      this.assetschartLabels = LabelData;
    }
  }



  onChartClick(event) {
    console.log(event);
  }
  onChartLibiClick() {

  }

  LiabilitieschartOptions;
  LiabilitieschartData;
  LiabilitieschartLabels;
  ChartLiabilities(AmountData, labelData) {
    this.LiabilitieschartOptions = {
      responsive: true
    };
    if(AmountData.length >0){
      this.LiabilitieschartData = [
        { data: AmountData },
      ];
    }
    if(labelData.length >0){
      this.LiabilitieschartLabels = labelData;
    }
  
  }
  cashflowLabels;
  cashflowchartOptions;
  cashflowchartData;
  chartForCashFlow(AmountData,labelData) {
    this.cashflowchartOptions = {
      responsive: true
    };
    if(AmountData.length>0){
      this.cashflowchartData = AmountData
    }
    if(labelData.length>0){
      this.cashflowLabels = labelData; 
    }
  
  }
}
