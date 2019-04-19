import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
import { NgxBarcodeModule } from 'ngx-barcode'
import { SalesCourierParcelServices } from './sale-courier-parcel.services'
import { SalesCourierParcelRoutingModule } from './sale-courier-parcel.routing.module'
import { SharedModule } from '../shared/shared.module'
import { SalesComponent } from './sale-courier-parcel-list/sales.component'
import { SalesSearchComponent } from './sale-courier-parcel-header/sales-search/sales-search.component'
import { SalesInvoiceComponent } from './sale-courier-parcel-header/sales-invoice/sales-invoice.component'

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
    SalesCourierParcelRoutingModule
  ],
  providers: [SalesCourierParcelServices]
})
export class SalesCourierParcelModule { }
