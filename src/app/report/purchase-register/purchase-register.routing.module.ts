import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { PurchaseRegisterComponent } from './purchase-register.component'

const routes: Routes = [
  { path: '', component: PurchaseRegisterComponent, children: [
    { path: 'ims/report/purchase-register', component: PurchaseRegisterComponent }
  ]}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PurchaseRegisterRoutingModule {}
