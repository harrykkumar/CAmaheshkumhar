import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ItemGroupStockReportComponent } from './item-group-stock.component'

const routes: Routes = [
  { path: '', component: ItemGroupStockReportComponent, children: [
    { path: 'report/item-group-stock', component: ItemGroupStockReportComponent }
  ]}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ItemGroupStockRoutingModule {}
