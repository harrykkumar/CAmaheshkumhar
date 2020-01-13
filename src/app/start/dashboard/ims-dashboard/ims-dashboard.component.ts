import { CommonService } from '../../../commonServices/commanmaster/common.services'
import { Component, ViewChild, ElementRef } from '@angular/core'
import { Subscription } from 'rxjs'
import { UIConstant } from '../../../shared/constants/ui-constant'
import { GlobalService } from '../../../commonServices/global.service'
import { Settings } from '../../../shared/constants/settings.constant'
import { SetUpIds } from 'src/app/shared/constants/setupIds.constant'
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { Color } from 'ng2-charts';
import { ToastrCustomService } from '../../../commonServices/toastr.service'
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import { ChartOptions, Chart, ChartType, ChartDataSets } from 'chart.js';
@Component({
  selector: 'app-dashboard',
  templateUrl: './ims-dashboard.component.html',
  styleUrls: ['./ims-dashboard.component.css']
})
export class DashboardComponent {
  DateFormate: any

  @ViewChild('AssetsId') AssetsId: ElementRef;
  @ViewChild('FincialPNL') FincialPNL: ElementRef;
  @ViewChild('LiabilitiesId') LiabilitiesId: ElementRef;
  @ViewChild('cashFlowId') cashFlowId: ElementRef;

  public context: CanvasRenderingContext2D;
  public lineChartType = 'line';
  public lineChartPlugins = [pluginAnnotations];
  public lineChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: ['#2196f3', '#f44336', '#3f51b5', '#3fb5a3', '#b53f51', '#51b53f', '#3f8cb5']
    },
  ];
  LiabilitieschartOptions: any;
  LiabilitieschartData: any;
  LiabilitieschartLabels: any;
  cashflowLabels: any;
  cashflowchartOptions: any;
  public cashflowchartData: ChartDataSets[]
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  SaleOverDueItem: any = []
  PuchaseOverDueItem: any = []
  assetsAmountData: any = []
  assetsLabelData: any = []
  libiabititsAmountData: any = []
  libiabititsLabelData: any = []
  ChartFlowdata: any = []
  ChartflowLabelData: any = []
  fincialdata: any = []
  CashIn: any = []
  CashOut: any = []
  finacialLabels: any;
  finacialchartOptions: any;
  finacialchartData: ChartDataSets[];;
  subscribe: Subscription
  AssestsPoints: any
  AllDataDashboard: any

  Creditor: any = []
  Debitors: any = []
  public lineChartColors: Color[] = [
    {
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  noOfDecimal: any = 0
  overDueValue: any = 'Sale'
  constructor(
    public gs: GlobalService,
    public _settings: Settings,
    public _commonService: CommonService,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private notification: ToastrCustomService

  ) {
    this.InventoryGrowths=[]
    this.Creditor = []
    this.Debitors= []
    this.getSetUpModules((JSON.parse(this._settings.moduleSettings).settings))
    this.spinnerService.hide()
  }
  finToDate;
  FinFromDate;
  todate: any
  fromDate: any
  ngAfterViewInit(): void {
    this.getAssetLiblity()
    this.getCashInCashOut()
    this.getInventory()
    this.getCashStatutory()
    this.getOverDues()
    this.getCreditorDebitors()
  }
  ngOnInit() {
    this.chartLoader = true
    this.chartLoaderFinacial =true
    this.DateFormate = this._settings.dateFormat
    this.noOfDecimal = this._settings.noOfDecimal
    this.todate = this.gs.convertToSqlFormat(this._settings.finToDate)
    this.fromDate = this.gs.convertToSqlFormat(this._settings.finFromDate)

  }
  chartLoader:boolean
  getAssetLiblity() {
    this._commonService.getDashBoardAssestsLiabilities(this.fromDate, this.todate).subscribe(resp => {
      if (resp.Code === UIConstant.THOUSAND) {
        let asstLibData= resp.Data
        this.assetsAmountData = []
        this.assetsLabelData = []
        this.LiabilitieschartData = []
        this.LiabilitieschartLabels = []
        if(resp.Data.length>0){
          asstLibData.forEach(element => {
            if(element.HeadId===1){
              this.assetsAmountData.push(
                element.Amount1.toFixed(this.noOfDecimal)
              )
              this.assetsLabelData.push(
                element.GlName
              )
            }
            if(element.HeadId===2){
              this.LiabilitieschartData.push(
                element.Amount1.toFixed(this.noOfDecimal)
              )
              this.LiabilitieschartLabels.push(
                element.GlName
              )
            }

          });
        }
        else{
          this.assetsAmountData = [100]
          this.assetsLabelData = ['']
          this.LiabilitieschartData = [100]
          this.LiabilitieschartLabels = ['']
        }

        this.chartLoader = false
        let assets = (<HTMLCanvasElement>this.AssetsId.nativeElement).getContext('2d');

        let data = {
          type: 'pie',
          data: {
            labels: this.assetsLabelData,
            datasets: [{
              data: this.assetsAmountData,

              borderColor: ['#ffffff'],
              backgroundColor: ['#3333cc', '#0066ff', '#ff8080', '#ace600', '#ff9933', '#00ace6', '#99994d'],
              fill: false
            }]
          },
          options: {
            legend: {
                display: false,
                fullWidth:true,

            }
        }
        }
        new Chart(assets, data);
        let Liabilities = (<HTMLCanvasElement>this.LiabilitiesId.nativeElement).getContext('2d');
         new Chart(Liabilities, {
          type: 'pie',
          data: {
            labels: this.LiabilitieschartLabels,
            datasets: [{
              data: this.LiabilitieschartData, // Specify the data values array

              borderColor: ['#ffffff'], // Add custom color border
              backgroundColor: ['#809fff', '#3fb5a3', '#00cc99', '#3fb5a5', '#b53f51', '#3fb5a3', '#3f8cb5'], // Add custom color background (Points and Fill)
              borderWidth: 1 // Specify bar border width
            }]
          },
          options: {
            legend: {
                display: false,

            }
        }
        });
      }
      if(resp.Code === UIConstant.SERVERERROR){
        this.chartLoader =false

      }
    })

  }


  getCashInCashOut() {
    this._commonService.getDashBoardCashInCashOut(this.fromDate, this.todate).subscribe(resp => {
      if (resp.Code === UIConstant.THOUSAND) {
        this.CashIn = []
        this.CashOut = []

        let fincialLable = []
        resp.Data.CashFlow.forEach(element => {
          this.CashIn.push((element.CashIn).toFixed(this.noOfDecimal))
          this.CashOut.push((element.CashOut).toFixed(this.noOfDecimal))
          this.ChartflowLabelData.push(element.Status)
        });
        this.chartLoaderFinacial = false

        resp.Data.Finance.forEach(element => {
          if (element.GlId === 18 || element.GlId === 17 || element.GlId === -999) {
            this.fincialdata.push( element.Amount1.toFixed(this.noOfDecimal))
            fincialLable.push( (element.GlName))
          }
        });
        var config = {
          type: 'line',
          data: {
            labels: fincialLable,
            datasets: [{
              data: this.fincialdata,
              backgroundColor: ['#99c2ff'], // Add custom color background (Points and Fill)

            }]
          },
          options: {
            legend: {
              display: false
            },
            tooltips: {
              callbacks: {
                label: function(tooltipItem) {
                  return tooltipItem.yLabel;
                }
              }
            }
          }
        };
        let ctx = (<HTMLCanvasElement>this.FincialPNL.nativeElement).getContext('2d');

        new Chart(ctx, config);

        let cashConfig = {
          type: 'bar',
          data: {
            datasets: [
              {
                label: "CashIn",
                backgroundColor: "#3e95cd",
                data: this.CashIn
              }, {
                label: "CashOut",
                backgroundColor: "#8e5ea2",
                data:this.CashOut
              }
            ]
            ,
              labels:  this.ChartflowLabelData
          },

      }

      let cashFlow = (<HTMLCanvasElement>this.cashFlowId.nativeElement).getContext('2d');

      new Chart(cashFlow, cashConfig);
      }
      if(resp.Code === UIConstant.SERVERERROR){
        this.chartLoaderFinacial =false

      }
    })
  }
  InventoryGrowths: any =[]
  getInventory() {
    this._commonService.getDashboardInventory(this.fromDate, this.todate,'active').subscribe(resp => {
      if (resp.Code === UIConstant.THOUSAND) {
        this.InventoryGrowths = resp.Data
      }
    })
  }
  CashStatutory: any=[]
  getCashStatutory() {
    this._commonService.getDashboarCashStatutory(this.fromDate, this.todate).subscribe(resp => {
      if (resp.Code === UIConstant.THOUSAND) {
        this.CashStatutory = resp.Data
      }
    })
  }
  salePurchaseOverDue: any = []
  getOverDues() {
    this._commonService.getDashboardOverDues(this.fromDate, this.todate).subscribe(resp => {
      if (resp.Code === UIConstant.THOUSAND) {
        this.salePurchaseOverDue = resp.Data
        this.changeType('sale')
      }
    })
  }
  imageForCreditor:any =[]
  getCreditorDebitors() {
    this._commonService.getDashboardCreditorDebitors(this.fromDate, this.todate, 'Creditor').subscribe(resp => {
      if (resp.Code === UIConstant.THOUSAND) {
        if(resp.Data.length>0){
          this.Creditor = resp.Data
        }

      }
    })
    this._commonService.getDashboardCreditorDebitors(this.fromDate, this.todate, 'Debtors').subscribe(resp => {
      if (resp.Code === UIConstant.THOUSAND) {
        this.Debitors = resp.Data
      }
    })
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
  }
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
  }

  clientDateFormat: any = ''
  getSetUpModules(settings) {
    settings.forEach(element => {
      if (element.id === SetUpIds.dateFormat) {
        this.clientDateFormat = element.val[0].Val
      }
    })

  }

  changeType(value) {
    if (value === 'sale') {
      this.SaleOverDueItem = []
      if (this.salePurchaseOverDue && this.salePurchaseOverDue.length > 0) {
        let SaleOverDue = this.salePurchaseOverDue.filter(d => (d.Type).toUpperCase() === "SALE")
        if (SaleOverDue.length > 0) {
          this.SaleOverDueItem = SaleOverDue
        }
      }

    }
    else if (value === 'purchase') {
      this.SaleOverDueItem = []
      if (this.salePurchaseOverDue && this.salePurchaseOverDue.length > 0) {
        let PurchaseOverDue = this.salePurchaseOverDue.filter(d => (d.Type).toUpperCase() === "PURCHASE")
        if (PurchaseOverDue.length > 0) {
          this.SaleOverDueItem = PurchaseOverDue


        }
      }

    }

  }



  assetschartData: any;
  assetschartLabels: any;



  options: {
    legend: {
        display: true,
        labels: {
            fontColor: 'rgb(255, 99, 132)'
        }
    }
}
chartLoaderFinacial:boolean

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };


  navigateTo() {
    const fromDate = this.gs.utcToClientDateFormat(new Date(this._settings.finToDate), this.clientDateFormat)
    const toDate = this.gs.utcToClientDateFormat(new Date(this._settings.finToDate), this.clientDateFormat)
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
  onLedgerStatement (item){
    if (item.LedgerId>0) {
      this._commonService.ledgerSummary(item.LedgerId, item.Name)
      this.router.navigate(['/account/ledger-summary'])
    }
  }
  gstrReport (){
      this.router.navigate(['/report/gstr-summary'])

  }

}
