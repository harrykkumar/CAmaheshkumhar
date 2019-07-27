import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CashbookDayBalanceComponent } from './cashbook-dayBalance.component'

const routes: Routes = [
  { path: '', component: CashbookDayBalanceComponent, children: [
    { path: 'ims/report/cashbook-day', component: CashbookDayBalanceComponent }
  ]}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class CashbookDayBalanceRoutingModule {}
