import { UserOrganizationsComponent } from './user-organizations.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizationGuard } from './organization.guard';

const routes: Routes = [{
  path: '', component: UserOrganizationsComponent,
  canActivate: [OrganizationGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserOrganizationsRoutingModule { }
