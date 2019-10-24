import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PackedOrdersReportComponent } from './packed-orders-report.component';
const routes: Routes = [{
  path: '', component: PackedOrdersReportComponent
}]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackedOrdersRoutingModule {

}