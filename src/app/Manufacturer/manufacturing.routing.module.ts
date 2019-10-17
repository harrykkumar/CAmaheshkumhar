import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { ManufacturingComponent } from './manufacturing.component';

const routes: Routes = [
  {
    path: '', component: ManufacturingComponent,
    children: [
      {
        path: 'packaging',
        loadChildren: () => import('./packaging/packaging.module').then(m => m.PackagingModule)
      },
      {
        path: 'buyer-order',
        loadChildren: () => import ('./buyer-order/buyer-order.module').then(m => m.BuyerOrderModule)
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