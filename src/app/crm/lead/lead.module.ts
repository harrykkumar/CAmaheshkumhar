import { SharedModule } from '../../shared/shared.module';
import { LeadComponent } from './lead.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AddLeadComponent } from '../add-lead/add-lead.component';
import { AddLeadDetailComponent } from '../add-lead-detail/add-lead-detail.component';
import { LeadRoutingModule } from './lead.routing';
import { LeadReportComponent } from '../lead-report/lead-report.component';

@NgModule({
  declarations: [
    LeadComponent
  ],
  imports: [
    CommonModule,
    LeadRoutingModule,
    SharedModule
  ],
  entryComponents: [
    AddLeadComponent,
    AddLeadDetailComponent
  ]
})
export class LeadModule { }
