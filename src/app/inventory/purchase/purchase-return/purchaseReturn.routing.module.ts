import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { PurchaseReturnMainComponent } from './purchaseReturn-main/purchaseReturn-main.component'

const childRoute: Routes = [
  { path: '', component: PurchaseReturnMainComponent, data: { title: 'Return' } }
]
@NgModule({
  imports: [
    RouterModule.forChild(childRoute)
  ],
  exports: [RouterModule]
})
export class PurchaseReturnDirectRoutingModule {

}
