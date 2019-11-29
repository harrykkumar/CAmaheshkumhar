import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { PurchaseOrderAddComponent } from './purchase-order-add.component';
import { ItemRateComponent } from '../item-rate/item-rate.component';
import { ItemsReqComponent } from '../item-requirement-items/items-req.component';

@NgModule({
  declarations: [
    PurchaseOrderAddComponent,
    ItemRateComponent,
    ItemsReqComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    PurchaseOrderAddComponent
  ]
})
export class PurchaseAddOrderModule {

}