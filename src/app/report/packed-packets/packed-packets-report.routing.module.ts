import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PackedPacketsReportComponent } from './packed-packets-report.component';
const routes: Routes = [{
  path: '', component: PackedPacketsReportComponent
}]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackedPacketsReportRoutingModule {

}