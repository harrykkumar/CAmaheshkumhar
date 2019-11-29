import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorRatesReportComponent } from './vendor-rates-report.component';
const routes: Routes = [{
  path: '', component: VendorRatesReportComponent
}]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorRatesReportRoutingModule {

}