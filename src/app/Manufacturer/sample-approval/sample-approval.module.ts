import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SampleApprovalRoutingModule } from './sample-approval-routing.module';
import { SampleApprovalListComponent } from '../../Manufacturer/sample-approval/sample-approval-list/sample-approval-list.component';
import { AddSampleApprovalComponent } from '../../Manufacturer/sample-approval/add-sample-approval/add-sample-approval.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [SampleApprovalListComponent, AddSampleApprovalComponent],
  imports: [
    CommonModule,
    SampleApprovalRoutingModule,
    SharedModule
  ],
  entryComponents: [AddSampleApprovalComponent]
})
export class SampleApprovalModule { }
