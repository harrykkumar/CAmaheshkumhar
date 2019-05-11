import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { BankComponent } from './bank.component'

const routes: Routes = [
  { path: '', component: BankComponent, children: [
    { path: 'bank', component: BankComponent }
  ]}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class BanbkRoutingModule {}
