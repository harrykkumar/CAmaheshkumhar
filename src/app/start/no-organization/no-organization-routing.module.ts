import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoOrganizationComponent } from './no-organization.component';

const routes: Routes = [{
  path: '', component: NoOrganizationComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoOrganizationRoutingModule { }
