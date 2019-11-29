import { AddBuyerOrderComponent } from './add-buyer-order/add-buyer-order.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuyerOrderRoutingModule } from './buyer-order-routing.module';
import { BuyerOrderListComponent } from '../../Manufacturer/buyer-order/buyer-order-list/buyer-order-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AttributeCombinationComponent } from '../../Manufacturer/buyer-order/attribute-combination/attribute-combination.component';
import { BuyerOrderSearchSearchComponent } from './buyer-order-search/buyer-order-search.component';

@NgModule({
  declarations: [
    BuyerOrderListComponent,
    AddBuyerOrderComponent,
    AttributeCombinationComponent,
    BuyerOrderSearchSearchComponent
  ],
  imports: [
    CommonModule,
    BuyerOrderRoutingModule,
    SharedModule
  ]
})
export class BuyerOrderModule { }
