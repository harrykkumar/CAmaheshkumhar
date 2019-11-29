import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ManufacturingRoutingModule } from './manufacturing.routing.module';
import { ManufacturingComponent } from './manufacturing.component';
import { AddStyleComponent } from './style/add-style/add-style.component';
import { PurchaseAddOrderModule } from './purchase-order/purchase-order-add/purchase-order-add.module';
import { PackagingAddComponent } from './packaging/packaging-add/packaging-add.component';

@NgModule({
  declarations: [
    ManufacturingComponent,
    AddStyleComponent,
    PackagingAddComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PurchaseAddOrderModule,
    ManufacturingRoutingModule
  ]
})
export class ManufacturingModule {

}