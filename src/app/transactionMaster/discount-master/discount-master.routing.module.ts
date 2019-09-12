import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { DiscountMasterComponent } from './discount-master.component'

const routes: Routes = [
  { path: '', component: DiscountMasterComponent, children: [
    { path: 'ims/discountMaster', component: DiscountMasterComponent }
  ]}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DiscountMasterRoutingModule {}
