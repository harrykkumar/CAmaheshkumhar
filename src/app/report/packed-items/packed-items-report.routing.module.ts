import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PackedItemsReportComponent } from './packed-items-report.component';
const routes: Routes = [{
  path: '', component: PackedItemsReportComponent
}]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackedItemsReportRoutingModule {

}