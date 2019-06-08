import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { BalanceSheetReportComponent } from './balance-sheet-report.component'

const routes: Routes = [
  { path: '', component: BalanceSheetReportComponent, children: [
    { path: 'balance-sheet', component: BalanceSheetReportComponent }
  ]}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class BalanceSheetReportRoutingModule {}
