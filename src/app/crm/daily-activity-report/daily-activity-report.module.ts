import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DailyActivityReportRoutingModule } from './daily-activity-report-routing.module';
import { DailyActivityReportComponent } from './daily-activity-report.component';

@NgModule({
  declarations: [DailyActivityReportComponent],
  imports: [
    CommonModule,
    DailyActivityReportRoutingModule,
    SharedModule
  ]
})
export class DailyActivityReportModule { }
