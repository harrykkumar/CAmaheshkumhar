import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GstrSummaryRoutingModule } from './gstr-summary-routing.module';
import { GstrSummaryComponent } from './gstr-summary.component';

@NgModule({
  declarations: [GstrSummaryComponent],
  imports: [
    CommonModule,
    GstrSummaryRoutingModule,
    SharedModule
  ]
})
export class GstrSummaryModule { }
