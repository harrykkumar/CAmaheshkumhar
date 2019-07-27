import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CashbookComponent } from './cashbook.component'

const routes: Routes = [
  { path: '', component: CashbookComponent, children: [
    { path: 'ims/report/cashbook', component: CashbookComponent }
  ]}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class CashBookRoutingModule {}
