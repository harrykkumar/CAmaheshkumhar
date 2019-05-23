import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { LedgerGroupComponent } from './ledger-group.component'

const routes: Routes = [
  { path: '', component: LedgerGroupComponent, children: [
    { path: 'ledgergroup', component: LedgerGroupComponent }
  ]}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ledgerGroupRoutingModule {}
