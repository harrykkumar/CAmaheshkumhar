import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MsmedOutstandingDetailsRoutingModule } from './msmed-outstanding-details-routing.module';
import { MsmedOutstandingDetailsComponent } from './msmed-outstanding-details.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [MsmedOutstandingDetailsComponent],
  imports: [
    CommonModule,
    MsmedOutstandingDetailsRoutingModule,
    SharedModule
  ]
})
export class MsmedOutstandingDetailsModule { }
