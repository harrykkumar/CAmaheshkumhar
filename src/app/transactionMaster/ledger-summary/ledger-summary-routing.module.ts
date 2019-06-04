import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LedgerSummaryComponent } from './ledger-summary.component';

const routes: Routes = [
  { path: '', component: LedgerSummaryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LedgerSummaryRoutingModule { }
