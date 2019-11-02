import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PurchaseOrderMainComponent } from './purchase-order-main/purchase-order-main.component';
const routes: Routes = [
  {
    path: '',
    component: PurchaseOrderMainComponent,
    data: {title: 'Purchase Order'}
  }
]
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class PurchaseOrderRoutingModule {

}