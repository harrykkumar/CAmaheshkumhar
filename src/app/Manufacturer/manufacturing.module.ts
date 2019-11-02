import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ManufacturingRoutingModule } from './manufacturing.routing.module';
import { ManufacturingComponent } from './manufacturing.component';
import { AddStyleComponent } from './style/add-style/add-style.component';
import { PurchaseOrderAddComponent } from './purchase-order/purchase-order-add/purchase-order-add.component';

@NgModule({
  declarations: [
    ManufacturingComponent,
    AddStyleComponent,
    PurchaseOrderAddComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ManufacturingRoutingModule
  ],
  providers: [
  ]
})
export class ManufacturingModule {

}