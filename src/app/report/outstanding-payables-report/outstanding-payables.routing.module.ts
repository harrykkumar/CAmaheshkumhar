import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { OutStandingPayablesReportComponent } from './outstanding-payables-report.component'

const routes: Routes = [
  { path: '', component: OutStandingPayablesReportComponent, children: [
    { path: 'report/outstanding-payables', component: OutStandingPayablesReportComponent }
  ]}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class OutstandingPayablesRoutingModule {}
