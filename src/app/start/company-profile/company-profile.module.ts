import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyProfileListRoutingModule } from './company-profile-routing.module';
import { CompanyProfileComponent } from './company-profile.component';
import { CompanyProfileListComponent } from './company-profile-list/company-profile-list.component';

@NgModule({
  declarations: [
    CompanyProfileListComponent],
  imports: [
    CommonModule,
    CompanyProfileListRoutingModule,
    SharedModule
  ]
})
export class CompanyProfileListModule { }
