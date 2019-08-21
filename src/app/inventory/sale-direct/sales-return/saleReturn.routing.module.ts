import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { SaleReturnDirectMainComponent } from './saleReturn-main/saleReturn-main.component'

const childRoute: Routes = [
  { path: '', component: SaleReturnDirectMainComponent, data: { title: 'Return' } }
]
@NgModule({
  imports: [
    RouterModule.forChild(childRoute)
  ],
  exports: [RouterModule]
})
export class SaleReturnDirectRoutingModule {

}
