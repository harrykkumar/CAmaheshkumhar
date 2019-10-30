import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { ManufacturingComponent } from './manufacturing.component';

const routes: Routes = [
  {
    path: '', component: ManufacturingComponent,
    children: [
      {
        path: 'packaging',
        loadChildren: './packaging/packaging.module#PackagingModule'
      },
      {
        path: 'buyer-order',
        loadChildren: './buyer-order/buyer-order.module#BuyerOrderModule'
      },
      {
        path: 'style',
        loadChildren: './style/style.module#StyleModule'
      },
      {
        path: 'sample-approval',
        loadChildren: './sample-approval/sample-approval.module#SampleApprovalModule'
      }
    ]
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
export class ManufacturingRoutingModule {

}