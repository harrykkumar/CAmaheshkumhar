import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BOStatusSearchComponent } from './search/bo-status-report-search.component';
import { BOStatusReportComponent } from './bo-status-report.component';
import { BOStatusReportRoutingModule } from './bo-status-report.routing.module';
import { SharedModule } from '../../shared/shared.module';
@NgModule({
  declarations: [
    BOStatusSearchComponent,
    BOStatusReportComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    BOStatusReportRoutingModule
  ],
  exports: []
})
export class BOStatusReportModule {

}