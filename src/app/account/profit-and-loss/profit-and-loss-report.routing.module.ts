import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ProfitAndLossReportComponent } from './profit-and-loss-report.component'

const routes: Routes = [
  { path: '', component: ProfitAndLossReportComponent, children: [
    { path: 'Profit-and-Loss', component: ProfitAndLossReportComponent }
  ]}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ProfitAndLossReportRoutingModule {}
