import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MsmedOutstandingRoutingModule } from './msmed-outstanding-routing.module';
import { MsmedOutstandingComponent } from './msmed-outstanding.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [MsmedOutstandingComponent],
  imports: [
    CommonModule,
    MsmedOutstandingRoutingModule,
    SharedModule
  ]
})
export class MsmedOutstandingModule { }
