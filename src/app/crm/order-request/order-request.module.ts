import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRequestRoutingModule } from './order-request-routing.module';
import { OrderRequestComponent } from './order-request.component';

@NgModule({
  declarations: [OrderRequestComponent],
  imports: [
    CommonModule,
    OrderRequestRoutingModule,
    SharedModule
  ]
})
export class OrderRequestModule { }
