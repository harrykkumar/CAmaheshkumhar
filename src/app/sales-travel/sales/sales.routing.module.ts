import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { SalesComponent } from './sales-list/sales.component'

const routes: Routes = [
  { path: 'sale', component: SalesComponent }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SalesTravelRoutingModule {}
