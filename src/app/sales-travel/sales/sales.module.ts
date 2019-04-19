import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SalesTravelRoutingModule } from './sales.routing.module'
import { SalesSearchComponent } from './sales-header/sales-search/sales-search.component'
import { SalesImportComponent } from './sales-header/sales-import/sales-import.component'
import { SalesInvoiceComponent } from './sales-header/sales-invoice/sales-invoice.component'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
import { SharedModule } from '../../shared/shared.module'
import { SalesReturnComponent } from './sales-header/sale-return/sales-return.component'
import { SaleTravelServices } from './sale-travel.services'
import { SalesComponent } from './sales-list/sales.component'
@NgModule({
  declarations: [
    SalesComponent,
    SalesSearchComponent,
    SalesImportComponent,
    SalesInvoiceComponent,
    SalesReturnComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    Select2Module,
    SalesTravelRoutingModule,
    SharedModule
  ],
  providers: [SaleTravelServices]
})
export class SalesTravelModule { }
