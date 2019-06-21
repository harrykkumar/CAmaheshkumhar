import { CompanyProfileListComponent } from './company-profile-list/company-profile-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyProfileComponent } from './company-profile.component';

const routes: Routes = [
  {
    path: '', component: CompanyProfileListComponent ,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyProfileListRoutingModule { }
