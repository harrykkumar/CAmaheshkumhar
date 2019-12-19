import { NgModule } from "@angular/core";
import { PurchaseOrderMainComponent } from './purchase-order-main/purchase-order-main.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { PurchaseOrderRoutingModule } from './purchase-order.routing,module';
import { PurchaseOrderSearchSearchComponent } from './purchase-order-search/purchase-order-search.component';
import { POApprovalComponent } from './po-approval/po-approval.component';
import { PoPurchaseComponent } from './PO-Purchase/po-purchase.component';

@NgModule({
  declarations: [
    PoPurchaseComponent,
    POApprovalComponent,
    PurchaseOrderMainComponent,
    PurchaseOrderSearchSearchComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PurchaseOrderRoutingModule
  ]
})
export class PurchaseOrderModule {

}