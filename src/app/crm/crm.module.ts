import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrmRoutingModule } from './crm-routing.module';
import { CrmComponent } from './crm.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [CrmComponent],
  imports: [
    CommonModule,
    CrmRoutingModule,
    SharedModule
  ]
})
export class CrmModule { }
