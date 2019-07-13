import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ItemInventoryReportComponent } from './item-inventory-report.component'

const routes: Routes = [
  { path: '', component: ItemInventoryReportComponent, children: [
    { path: 'ims/report/item-inventory', component: ItemInventoryReportComponent }
  ]}
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ItemInventoryReportRoutingModule {}
