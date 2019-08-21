import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { serviceBillingMainComponent } from './serviceBilling-main/serviceBilling-main.component'

const childRoute: Routes = [
  { path: '', component: serviceBillingMainComponent, data: { title: 'Service' } }
]
@NgModule({
  imports: [
    RouterModule.forChild(childRoute)
  ],
  exports: [RouterModule]
})
export class serviceBillingRoutingModule {

}
