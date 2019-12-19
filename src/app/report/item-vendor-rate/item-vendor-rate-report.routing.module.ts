import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { vendorRatesReportComponent } from './item-vendor-rate-report.component';
const routes: Routes = [{
  path: '', component: vendorRatesReportComponent
}]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemVendorRateReportRoutingModule {

}