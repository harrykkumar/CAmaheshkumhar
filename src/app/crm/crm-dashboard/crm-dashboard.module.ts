import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrmDashboardRoutingModule } from './crm-dashboard-routing.module';
import { CrmDashboardComponent } from './crm-dashboard.component';

@NgModule({
  declarations: [CrmDashboardComponent],
  imports: [
    CommonModule,
    CrmDashboardRoutingModule,
    SharedModule
  ]
})
export class CrmDashboardModule { }
