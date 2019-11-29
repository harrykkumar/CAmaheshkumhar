import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { VendorRatesReportRoutingModule } from './vendor-rates-report.routing.module';
import { VendorRatesReportComponent } from './vendor-rates-report.component';
import { VendorRatesSearchComponent } from './search/vendor-rates-search.component';
@NgModule({
  declarations: [
    VendorRatesReportComponent,
    VendorRatesSearchComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    VendorRatesReportRoutingModule
  ],
  exports: []
})
export class VendorRatesReportModule {

}