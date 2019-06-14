import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ItemSaleCategoryReportComponent } from './item-sale-category-report.component'

const routes: Routes = [
  { path: '', component: ItemSaleCategoryReportComponent, children: [
    { path: 'item-sale', component: ItemSaleCategoryReportComponent }
  ]}
]
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ItemSaleCategoryReportRoutingModule {}
