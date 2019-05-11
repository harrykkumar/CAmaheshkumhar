import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
import { SalesChallanRoutingModule } from './sales-challan.routing.module'
import { SalesChallanInvoiceComponent } from './sales-header/sales-challan-invoice/sales-challan-invoice.component'
import { SalesSearchComponent } from './sales-header/sales-search/sales-search.component'
import { SalesChallanComponent } from './sales-challan.component'
import { SharedModule } from '../../../shared/shared.module'
import { NgxBarcodeModule } from 'ngx-barcode'
import {SalesChallanBillingComponent} from './sales-header/sales-challan-billing/sales-billing.component'
@NgModule({
  declarations: [ 
    SalesChallanComponent,
    SalesSearchComponent,
    SalesChallanInvoiceComponent,
    SalesChallanBillingComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    Select2Module,
    NgxBarcodeModule,
    SalesChallanRoutingModule
  ]
})
export class SalesChallanModule { }
