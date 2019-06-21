import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoOrganizationRoutingModule } from './no-organization-routing.module';
import { NoOrganizationComponent } from './no-organization.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [NoOrganizationComponent],
  imports: [
    CommonModule,
    NoOrganizationRoutingModule,
    SharedModule
  ]
})
export class NoOrganizationModule { }
