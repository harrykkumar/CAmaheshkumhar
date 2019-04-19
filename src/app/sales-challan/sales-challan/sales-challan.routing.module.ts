import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { SalesChallanComponent } from './sales-challan.component'

const routes: Routes = [
  { path: '', component: SalesChallanComponent, children: [
    { path: 'challan', component: SalesChallanComponent }
  ]}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SalesChallanRoutingModule {}
