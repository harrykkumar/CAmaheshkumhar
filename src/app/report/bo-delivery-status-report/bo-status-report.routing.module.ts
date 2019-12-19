import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BOStatusReportComponent} from './bo-status-report.component';
const routes: Routes = [{
  path: '', component: BOStatusReportComponent
}]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BOStatusReportRoutingModule {

} 