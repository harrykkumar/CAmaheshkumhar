import { BuyerOrderListComponent } from './buyer-order-list/buyer-order-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
  path: '', component: BuyerOrderListComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuyerOrderRoutingModule { }
