import { SampleApprovalListComponent } from './sample-approval-list/sample-approval-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
  path: '', component: SampleApprovalListComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SampleApprovalRoutingModule { }
