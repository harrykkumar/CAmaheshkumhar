import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
import { NgxBarcodeModule } from 'ngx-barcode'
import { SharedModule } from '../shared/shared.module'
import { SalesCourierLocalRoutingModule } from './sales-courier-local.routing.module'
import { SalesComponent } from './sales-courier-local-list/sales-courier-local-list.component'
import { SalesSearchComponent } from './sales-courier-local-header/sales-search/sales-search.component'
import { SalesInvoiceComponent } from './sales-courier-local-header/sales-invoice/sales-invoice.component'
import { SalesCourierLocalServices } from './sales-courier-local.services'

@NgModule({
  declarations: [
    SalesComponent,
    SalesSearchComponent,
    SalesInvoiceComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    Select2Module,
    NgxBarcodeModule,
    SalesCourierLocalRoutingModule
  ],
  providers: [SalesCourierLocalServices]
})
export class SalesCourierLocalModule { }
