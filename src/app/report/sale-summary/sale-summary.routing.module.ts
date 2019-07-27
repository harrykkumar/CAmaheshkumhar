import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { SaleSummaryReportComponent } from './sale-summary.component'

const routes: Routes = [
  { path: '', component: SaleSummaryReportComponent, children: [
    { path: 'ims/report/sale-summary', component: SaleSummaryReportComponent }
  ]}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SaleSummaryReportRoutingModule {}
