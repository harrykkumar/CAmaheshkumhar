import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LedgerSummaryRoutingModule } from './ledger-summary-routing.module';
import { LedgerSummaryComponent } from './ledger-summary.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [LedgerSummaryComponent],
  imports: [
    CommonModule,
    LedgerSummaryRoutingModule,
    SharedModule
  ]
})
export class LedgerSummaryModule { }
