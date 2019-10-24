import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { PackedItemsReportComponent } from './packed-items-report.component';
import { PackedItemsReportRoutingModule } from './packed-items-report.routing.module';
import { PackedItemsSearchComponent } from './search/packed-items-search.component';
@NgModule({
  declarations: [
    PackedItemsReportComponent,
    PackedItemsSearchComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PackedItemsReportRoutingModule
  ],
  exports: []
})
export class PackedItemsReportModule {

}