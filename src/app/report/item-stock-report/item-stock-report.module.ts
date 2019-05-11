import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
import { ItemStockReportRoutingModule } from './item-stock-report.routing.module'
import { ItemStockSearchComponent } from './item-search/item-stock-search.component'
import { ItemStockReportComponent } from './item-stock-report.component'
import { SharedModule } from '../../shared/shared.module'
import { NgxBarcodeModule } from 'ngx-barcode'
@NgModule({
  declarations: [ 
    ItemStockReportComponent,
    ItemStockSearchComponent,
    ItemStockReportComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    Select2Module,
    NgxBarcodeModule,
    ItemStockReportRoutingModule
  ]
})
export class ItemStockReportModule {}
