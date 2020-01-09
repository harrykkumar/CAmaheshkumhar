import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderRequestDetailsRoutingModule } from './order-request-details-routing.module';
import { OrderRequestDetailsComponent } from './order-request-details.component';

@NgModule({
  declarations: [OrderRequestDetailsComponent],
  imports: [
    CommonModule,
    OrderRequestDetailsRoutingModule,
    SharedModule
  ]
})
export class OrderRequestDetailsModule { }
