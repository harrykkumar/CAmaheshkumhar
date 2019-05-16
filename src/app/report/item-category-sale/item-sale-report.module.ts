import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
import { ItemSaleReportRoutingModule } from './item-sale-report.routing.module'
import { ItemSaleSearchComponent } from './item-search/item-sale-search.component'
import { ItemSaleReportComponent } from './item-sale-report.component'
import { SharedModule } from '../../shared/shared.module'
import { NgxBarcodeModule } from 'ngx-barcode'
@NgModule({
  declarations: [
    ItemSaleSearchComponent,
    ItemSaleReportComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    Select2Module,
    NgxBarcodeModule,
    ItemSaleReportRoutingModule
  ]
})
export class ItemSaleReportModule {}
