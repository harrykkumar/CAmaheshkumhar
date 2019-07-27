import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { OutStandingReceiablesReportComponent } from './outstanding-receiables-report.component'

const routes: Routes = [
  { path: '', component: OutStandingReceiablesReportComponent, children: [
    { path: 'ims/report/daybook', component: OutStandingReceiablesReportComponent }
  ]}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class OutstandingReceiablesRoutingModule {}
