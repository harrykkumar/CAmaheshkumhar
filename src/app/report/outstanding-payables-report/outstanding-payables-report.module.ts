import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OutStandingPayablesReportComponent } from './outstanding-payables-report.component';
import { SharedModule } from 'src/app/shared/shared.module';
import {OutstandingPayablesRoutingModule} from './outstanding-payables.routing.module'
import { from } from 'rxjs';
@NgModule({
  declarations: [OutStandingPayablesReportComponent],
  imports: [
    CommonModule,
    SharedModule,
    OutstandingPayablesRoutingModule
  ]
})
export class OutStandingPayablesReportModule { }
