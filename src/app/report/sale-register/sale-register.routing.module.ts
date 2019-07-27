import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { SaleRegisterComponent } from './sale-register.component'

const routes: Routes = [
  { path: '', component: SaleRegisterComponent, children: [
    { path: 'ims/report/sale-register', component: SaleRegisterComponent }
  ]}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SaleRegisterRoutingModule {}
