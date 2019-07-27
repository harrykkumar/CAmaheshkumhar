import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { PurchaseSummaryReportComponent } from './purchase-summary.component'

const routes: Routes = [
  { path: '', component: PurchaseSummaryReportComponent, children: [
    { path: 'ims/report/purchase-summary', component: PurchaseSummaryReportComponent }
  ]}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PurchaseSummaryReportRoutingModule {}
