
// import * as CanvasJS from '../../../../assets/js/canvasjs.min';
import { CommonService } from '../../../commonServices/commanmaster/common.services'
import { Component} from '@angular/core'
import { Subscription } from 'rxjs'
import { UIConstant } from '../../../shared/constants/ui-constant'
import { GlobalService } from '../../../commonServices/global.service'
import { Settings } from '../../../shared/constants/settings.constant'
import { SetUpIds } from 'src/app/shared/constants/setupIds.constant'
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
// import { GlobalService } from '../../../commonServices/global.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './ims-dashboard.component.html',
  styleUrls: ['./ims-dashboard.component.css']
})
export class DashboardComponent {
  DateFormate: any
  noOfDecimal: any = 0
  overDueValue:any = 'Sale'
  constructor(
    public gs: GlobalService,
    public _settings: Settings,
    public _commonService: CommonService,
    private spinnerService: NgxSpinnerService,
    private router: Router
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
    this.finToDate =  this._settings.finToDate 
    this.FinFromDate = this._settings.finFromDate
    let todate = this.gs.utcToClientDateFormat( this.finToDate, this.clientDateFormat)
    let fromDate = this.gs.utcToClientDateFormat(this.FinFromDate, this.clientDateFormat)
    this.getDashBoard(todate,fromDate)
   
  }
  clientDateFormat:any =''
  getSetUpModules(settings) {
    // console.log('settings : ', settings)
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
    this.subscribe = this._commonService.getDashBoardData('?TypeWise=Month'+'&fromDate='+fromDate+'&todate='+todate).subscribe(resp => {
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

  navigateTo() {
    const fromDate = this.gs.utcToClientDateFormat(new Date(this.FinFromDate), this.clientDateFormat)
    const toDate = this.gs.utcToClientDateFormat(new Date(this.finToDate), this.clientDateFormat)
    this.router.navigate([`report/msmed-outstanding/details`],
      {
        queryParams: {
          FromDate: fromDate,
          ToDate: toDate,
          ReportType: 'DUE',
          Type: this.overDueValue ? this.overDueValue : ''
        }
      });
  }

}
