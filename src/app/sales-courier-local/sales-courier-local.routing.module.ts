import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { SalesComponent } from './sales-courier-local-list/sales-courier-local-list.component'

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
export class SalesCourierLocalRoutingModule {}
