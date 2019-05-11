import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { PurchaseMainComponent } from './purchase-main/purchase-main.component'

const childRoute: Routes = [
  { path: '', component: PurchaseMainComponent, data: { title: 'Purchase' } }
]
@NgModule({
  imports: [
    RouterModule.forChild(childRoute)
  ],
  exports: [RouterModule]
})
export class PurchaseRoutingModule {

}
