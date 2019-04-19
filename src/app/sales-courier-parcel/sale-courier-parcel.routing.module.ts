import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { SalesComponent } from './sale-courier-parcel-list/sales.component'

const routes: Routes = [
  { path: '', component: SalesComponent, children: [
    { path: 'sale', component: SalesComponent }
  ]}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SalesCourierParcelRoutingModule {}
