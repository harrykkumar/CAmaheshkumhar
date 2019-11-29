import { SharedModule } from 'src/app/shared/shared.module';
import { FollowUpListComponent } from './follow-up-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FollowUpListRoutingModule } from './follow-up-list-routing.module';
import { AddLeadDetailComponent } from '../add-lead-detail/add-lead-detail.component';
import { AddLeadComponent } from '../add-lead/add-lead.component';

@NgModule({
  declarations: [FollowUpListComponent],
  imports: [
    CommonModule,
    FollowUpListRoutingModule,
    SharedModule
  ],
  entryComponents: [
    AddLeadComponent,
    AddLeadDetailComponent,
  ]
})
export class FollowUpListModule { }
