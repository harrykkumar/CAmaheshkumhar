import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ProfitReportMainComponent } from './profit-report-main/profit-report-main.component'

const childRoute: Routes = [
  { path: '', component: ProfitReportMainComponent, data: { title: 'Profit Report' } }
]
@NgModule({
  imports: [
    RouterModule.forChild(childRoute)
  ],
  exports: [RouterModule]
})
export class ProfitReportRoutingModule {

}
