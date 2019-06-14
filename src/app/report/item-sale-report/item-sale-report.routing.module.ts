import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ItemSaleReportComponent } from './item-sale-report.component'

const routes: Routes = [
  { path: '', component: ItemSaleReportComponent, children: [
    { path: 'sale-item', component: ItemSaleReportComponent }
  ]}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ItemSaleReportRoutingModule {}
