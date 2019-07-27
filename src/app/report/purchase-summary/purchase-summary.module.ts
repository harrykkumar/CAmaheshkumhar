import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PurchaseSummaryReportRoutingModule} from './purchase-summary.routing.module'
import { PurchaseSummaryReportComponent } from './purchase-summary.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [PurchaseSummaryReportComponent],
  imports: [
    PurchaseSummaryReportRoutingModule,
    CommonModule,
    SharedModule
  ]
})
export class PurchaseSummaryReportModule { }
