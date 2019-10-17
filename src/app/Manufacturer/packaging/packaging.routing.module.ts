import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PackagingMainComponent } from './packaging-main/packaging-main.component';
const routes: Routes = [
  {
    path: '',
    component: PackagingMainComponent,
    data: {title: 'Order Pakaging'}
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
export class PackagingRoutingModule {

}