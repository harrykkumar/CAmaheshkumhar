import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DuesOverduesOutstandingRoutingModule } from './dues-overdues-outstanding-routing.module';
import { DuesOverduesOutstandingComponent } from './dues-overdues-outstanding.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [DuesOverduesOutstandingComponent],
  imports: [
    CommonModule,
    DuesOverduesOutstandingRoutingModule,
    SharedModule
  ]
})
export class DuesOverduesOutstandingModule { }
