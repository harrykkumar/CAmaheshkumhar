import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerAgentRoutingModule } from './customer-agent-routing.module';
import { CustomerAgentComponent } from './customer-agent.component';
import { AddCustomerAgentComponent } from '../add-customer-agent/add-customer-agent.component';

@NgModule({
  declarations: [CustomerAgentComponent],
  imports: [
    CommonModule,
    CustomerAgentRoutingModule,
    SharedModule
  ],
  entryComponents: []
})
export class CustomerAgentModule { }
