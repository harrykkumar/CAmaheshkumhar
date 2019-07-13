import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
import { ItemInventoryReportRoutingModule } from './item-inventory-report.routing.module'
import { ItemStockSearchComponent } from './item-search/item-stock-search.component'
import { ItemInventoryReportComponent } from './item-inventory-report.component'
import { SharedModule } from '../../shared/shared.module'
import { NgxBarcodeModule } from 'ngx-barcode'
@NgModule({
  declarations: [ 
    ItemInventoryReportComponent,
    ItemStockSearchComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    Select2Module,
    NgxBarcodeModule,
    ItemInventoryReportRoutingModule
  ]
})
export class ItemInventoryReportModule {}
