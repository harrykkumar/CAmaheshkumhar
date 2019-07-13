import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { TrailBalanceReportComponent } from './trail-balance-report.component'

const routes: Routes = [
  { path: '', component: TrailBalanceReportComponent, children: [
    { path: 'account/trail-balance', component: TrailBalanceReportComponent }
  ]}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TailBalanceReportRoutingModule {}
