import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { LedgerCreationComponent } from './ledger-creation.component'

const routes: Routes = [
  { path: '', component: LedgerCreationComponent, children: [
    { path: 'ledgercreation', component: LedgerCreationComponent }
  ]}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class LedgerCreationRoutingModule {}
