import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ItemStockReportComponent } from './item-stock-report.component'

const routes: Routes = [
  { path: '', component: ItemStockReportComponent, children: [
    { path: 'item-stock', component: ItemStockReportComponent }
  ]}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ItemStockReportRoutingModule {}
