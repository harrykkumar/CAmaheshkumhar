import { SharedModule } from 'src/app/shared/shared.module';
import { FollowUpListComponent } from './follow-up-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FollowUpListRoutingModule } from './follow-up-list-routing.module';
import { AddLeadDetailComponent } from '../add-lead-detail/add-lead-detail.component';
import { AddLeadComponent } from '../add-lead/add-lead.component';
import { FollowUpCountInfoComponent } from '../follow-up-count-info/follow-up-count-info.component';

@NgModule({
  declarations: [FollowUpListComponent, FollowUpCountInfoComponent],
  imports: [
    CommonModule,
    FollowUpListRoutingModule,
    SharedModule
  ],
  entryComponents: [
    AddLeadComponent,
    AddLeadDetailComponent,
    FollowUpCountInfoComponent,
  ]
})
export class FollowUpListModule { }
