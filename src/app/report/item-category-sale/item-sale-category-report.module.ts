import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ItemSaleCategoryReportRoutingModule } from './item-sale-category-report.routing.module'
import { ItemSaleCategoryReportComponent } from './item-sale-category-report.component'
import { SharedModule } from '../../shared/shared.module'

@NgModule({
  declarations: [ItemSaleCategoryReportComponent],
  imports: [
    CommonModule,
    ItemSaleCategoryReportRoutingModule,
    SharedModule
  ]
})
export class ItemSaleCategoryReportModule { }
