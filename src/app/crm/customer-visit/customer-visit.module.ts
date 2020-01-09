import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerVisitRoutingModule } from './customer-visit-routing.module';
import { CustomerVisitComponent } from './customer-visit.component';

@NgModule({
  declarations: [CustomerVisitComponent],
  imports: [
    CommonModule,
    CustomerVisitRoutingModule,
    SharedModule
  ]
})
export class CustomerVisitModule { }
