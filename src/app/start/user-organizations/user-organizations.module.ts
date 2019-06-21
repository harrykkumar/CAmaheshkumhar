import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserOrganizationsRoutingModule } from './user-organizations-routing.module';
import { UserOrganizationsComponent } from './user-organizations.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [UserOrganizationsComponent],
  imports: [
    CommonModule,
    UserOrganizationsRoutingModule,
    SharedModule
  ]
})
export class UserOrganizationsModule { }
