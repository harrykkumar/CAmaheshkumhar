import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SaleSummaryReportRoutingModule} from './sale-summary.routing.module'
import { SaleSummaryReportComponent } from './sale-summary.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [SaleSummaryReportComponent],
  imports: [
    SaleSummaryReportRoutingModule,
    CommonModule,
    SharedModule
  ]
})
export class SaleSummaryReportModule { }
