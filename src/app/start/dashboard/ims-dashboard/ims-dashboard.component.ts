
import * as CanvasJS from '../../../../assets/js/canvasjs.min';
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
@Component({
  selector: 'app-dashboard',
  templateUrl: './ims-dashboard.component.html',
  styleUrls: ['./ims-dashboard.component.css']
})
export class DashboardComponent {
  DateFormate: any
  constructor(public _settings: Settings, public _commonService: CommonService) { }

  ngOnInit() {
    this.DateFormate = this._settings.dateFormat
    this.getDashBoard()
    this.chartForAssets()
    this.ChartForFinance()
    this.ChartLiabilities()
    this.chartForCashFlow()
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

  getDashBoard() {
    this.subscribe = this._commonService.getDashBoardData('?TypeWise=Month').subscribe(resp => {
      if (resp.Code === UIConstant.THOUSAND) {
        console.log(resp.Data, 'Dashboard')
        this.AllDataDashboard = resp.Data
        // this.SaleOverDueItem  =[]
        // this.PuchaseOverDueItem =[]
        //   let PurchaseOverDue = resp.Data.OverDueDetails.filter(d => (d.Type).toUpperCase() === "PURCHASE" )

        //   if(PurchaseOverDue.length>0){
        //     this.PuchaseOverDueItem = PurchaseOverDue

        //   }


        this.AssestsPoints = []
        let assets = []
        resp.Data.Assests.forEach(element => {
          assets.push({
            y: element.TotalAsset,
            name: element.LedgerName
          })
        });
        this.AssestsPoints = assets
        console.log(this.AssestsPoints, 'oooo--')


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

  ChartForFinance() {
    let chart = new CanvasJS.Chart("chartContainer", {
      theme: "light2",
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: ""
      },
      data: [{
        type: "pie",
        showInLegend: true,
        toolTipContent: "<b>{name}</b>: ${y} (#percent%)",
        indexLabel: "{name} - #percent%",
        dataPoints: [
          { y: 450, name: "Sale" },
          { y: 120, name: "Purchase" },
          { y: 300, name: "Profit" },
          { y: 800, name: "Lose" }
        ]
      }]
    });

    chart.render();
  }
  chartForAssets() {

    let chartForAssets = new CanvasJS.Chart("chartContainerAssets", {
      theme: "light2",
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: ""
      },
      data: [{
        type: "pie",
        showInLegend: true,
        toolTipContent: "<b>{name}</b>: ${y} (#percent%)",
        indexLabel: "{name} - #percent%",
        dataPoints: [
          { y: 800, name: "Sale" },
          { y: 50, name: "Purchase" },
          { y: 200, name: "Profit" },
          { y: 30, name: "Lose" }
        ],
        // dataPoints : this.AllDataDashboard.Assests 
      }]
    });
    chartForAssets.render()
  }
  ChartLiabilities() {
    let chartLiabilitie = new CanvasJS.Chart("chartContainerLiabilities", {
      theme: "light2",
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: ""
      },
      data: [{
        type: "pie",
        showInLegend: true,
        toolTipContent: "<b>{name}</b>: ${y} (#percent%)",
        indexLabel: "{name} - #percent%",
        dataPoints: [
          { y: 500, name: "Sale" },
          { y: 400, name: "Purchase" },
          { y: 600, name: "Profit" },
          { y: 20, name: "Lose" }
        ]
      }]
    });

    chartLiabilitie.render();
  }

  chartForCashFlow() {
    let chart = new CanvasJS.Chart("chartContainerForCashFlow", {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: ""
      },
      data: [{
        type: "column",
        dataPoints: [
          // { y: 71, label: "Apple" },
          { y: 55, label: "Mango" },
          { y: 50, label: "Orange" },
          { y: 65, label: "Banana" },
          { y: 95, label: "Pineapple" },
          { y: 68, label: "Pears" },
          { y: 28, label: "Grapes" },
          { y: 34, label: "Lychee" },
          { y: 14, label: "Jackfruit" }
        ]
      }]
    });
    chart.render();
  }
}
