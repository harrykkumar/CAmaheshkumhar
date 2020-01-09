import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActionReportRoutingModule } from './action-report-routing.module';
import { ActionReportComponent } from './action-report.component';

@NgModule({
  declarations: [ActionReportComponent],
  imports: [
    CommonModule,
    ActionReportRoutingModule,
    SharedModule
  ]
})
export class ActionReportModule { }
