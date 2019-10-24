import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { PackedPacketsReportRoutingModule } from './packed-packets-report.routing.module';
import { PackedPacketsReportComponent } from './packed-packets-report.component';
import { PackedPacketsSearchComponent } from './search/packed-packets-search.component';
@NgModule({
  declarations: [
    PackedPacketsReportComponent,
    PackedPacketsSearchComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PackedPacketsReportRoutingModule
  ],
  exports: []
})
export class PackedPacketsReportingModule {

}