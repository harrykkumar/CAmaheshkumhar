import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { TradingReportComponent } from './trading-report.component'

const routes: Routes = [
  { path: '', component: TradingReportComponent, children: [
    { path: 'trading', component: TradingReportComponent }
  ]}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TradingReportRoutingModule {}
