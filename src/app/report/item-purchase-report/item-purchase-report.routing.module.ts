import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ItemPurchaseReportComponent } from './item-purchase-report.component'

const routes: Routes = [
  { path: '', component: ItemPurchaseReportComponent, children: [
    { path: 'purchase-item', component: ItemPurchaseReportComponent }
  ]}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ItemPurchaseReportRoutingModule {}
