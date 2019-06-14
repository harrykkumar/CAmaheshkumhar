import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
import { ItemPurchaseReportRoutingModule } from './item-purchase-report.routing.module'
import { ItemSaleSearchComponent } from './item-search/item-stock-search.component'
import { ItemPurchaseReportComponent } from './item-purchase-report.component'
import { SharedModule } from '../../shared/shared.module'
import { NgxBarcodeModule } from 'ngx-barcode'
@NgModule({
  declarations: [ 
    
    ItemSaleSearchComponent,
    ItemPurchaseReportComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    Select2Module,
    NgxBarcodeModule,
    ItemPurchaseReportRoutingModule
  ]
})
export class ItemPurchaseReportModule {}
