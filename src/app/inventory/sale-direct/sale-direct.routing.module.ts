import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { SaleDirectMainComponent } from './sale-direct-main/sale-direct-main.component'

const childRoute: Routes = [
  { path: '', component: SaleDirectMainComponent, data: { title: 'Sale Invoice' } }
]
@NgModule({
  imports: [
    RouterModule.forChild(childRoute)
  ],
  exports: [RouterModule]
})
export class SaleDirectRoutingModule {

}
