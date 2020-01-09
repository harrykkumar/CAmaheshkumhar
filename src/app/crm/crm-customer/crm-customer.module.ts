import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrmCustomerRoutingModule } from './crm-customer-routing.module';
import { CrmCustomerComponent } from './crm-customer.component';

@NgModule({
  declarations: [CrmCustomerComponent],
  imports: [
    CommonModule,
    CrmCustomerRoutingModule,
    SharedModule
  ]
})
export class CrmCustomerModule { }
