import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ItemVendorRateReportRoutingModule } from './item-vendor-rate-report.routing.module';
import { VendorRateSearchComponent } from './search/item-vendor-rate-search.component';
import { vendorRatesReportComponent } from './item-vendor-rate-report.component';
@NgModule({
  declarations: [
    vendorRatesReportComponent,
    VendorRateSearchComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ItemVendorRateReportRoutingModule
  ],
  exports: []
})
export class VendorRatesReportModule {

}