import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
import { ItemSaleCategoryReportRoutingModule } from './item-sale-category-report.routing.module'
import { ItemSaleSearchComponent } from './item-search/item-sale-search.component'
import { ItemSaleCategoryReportComponent } from './item-sale-category-report.component'
import { SharedModule } from '../../shared/shared.module'
import { NgxBarcodeModule } from 'ngx-barcode'
@NgModule({
  declarations: [
    ItemSaleSearchComponent,
    ItemSaleCategoryReportComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    Select2Module,
    NgxBarcodeModule,
    ItemSaleCategoryReportRoutingModule
  ]
})
export class ItemSaleCategoryReportModule {}
