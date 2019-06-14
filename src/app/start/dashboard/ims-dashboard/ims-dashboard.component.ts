import { Component, OnInit } from '@angular/core'
import * as CanvasJS from '../../../../assets/js/canvasjs.min';
@Component({
  selector: 'app-dashboard',
  templateUrl: './ims-dashboard.component.html',
  styleUrls: ['./ims-dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  	 this.chartForAssets()
    this.ChartForFinance()
    this.ChartLiabilities()
    this.chartForCashFlow()
  }
      ChartForFinance(){
        let chart = new CanvasJS.Chart("chartContainer", {
          theme: "light2",
          animationEnabled: true,
          exportEnabled: true,
          title:{
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
      chartForAssets (){

        let chartForAssets = new CanvasJS.Chart("chartContainerAssets", {
          theme: "light2",
          animationEnabled: true,
          exportEnabled: true,
          title:{
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
            ]
          }]
        });
        chartForAssets.render()
      } 
      ChartLiabilities () {
        let chartLiabilitie = new CanvasJS.Chart("chartContainerLiabilities", {
          theme: "light2",
          animationEnabled: true,
          exportEnabled: true,
          title:{
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

      chartForCashFlow(){
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
