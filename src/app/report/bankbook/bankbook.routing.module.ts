import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { BankbookComponent } from './bankbook.component'

const routes: Routes = [
  { path: '', component: BankbookComponent, children: [
    { path: 'ims/report/bankbook', component: BankbookComponent }
  ]}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class BankBookRoutingModule {}
