import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackedOrdersReportComponent } from './packed-orders-report.component';
import { SharedModule } from '../../shared/shared.module';
import { PackedOrdersRoutingModule } from './packed-orders-report.routing.module';
import { PackedOrderSearchComponent } from './search/packed-orders-search.component';
@NgModule({
  declarations: [
    PackedOrdersReportComponent,
    PackedOrderSearchComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PackedOrdersRoutingModule
  ],
  exports: []
})
export class PackedOrderReportModule {

}