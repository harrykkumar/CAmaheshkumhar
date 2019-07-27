import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OutStandingReceiablesReportComponent } from './outstanding-receiables-report.component';
import { SharedModule } from 'src/app/shared/shared.module';
import {OutstandingReceiablesRoutingModule} from './outstanding-receiables.routing.module'
@NgModule({
  declarations: [OutStandingReceiablesReportComponent],
  imports: [
    CommonModule,
    OutstandingReceiablesRoutingModule,
    SharedModule
  ]
})
export class OutStandingReceiablesReportModule { }
