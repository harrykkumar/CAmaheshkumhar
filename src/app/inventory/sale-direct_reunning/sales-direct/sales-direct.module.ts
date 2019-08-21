import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
import { SalesDirectRoutingModule } from './sales-direct.routing.module'
import { SalesSearchComponent } from './sales-header/sales-search/sales-search.component'
import { SalesListComponent } from './sales-list.component'
import { SharedModule } from '../../../shared/shared.module'
import { NgxBarcodeModule } from 'ngx-barcode'
// import {SaleDirectReturnComponent} from '../sales-direct/sales-header/saleReturn-add/saleReturn-add.component'
import {SalesDirectComponent} from './sales-header/sales-direct/sales-direct.component'
import {SaleDirectReturnModule}  from '../sales-return/saleReturn.module'
@NgModule({
  declarations: [ 
    SalesListComponent,
    SalesSearchComponent,
    SalesDirectComponent,
    // SaleDirectReturnComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    Select2Module,
    NgxBarcodeModule,
    SalesDirectRoutingModule,
    SaleDirectReturnModule
   
  ]
})
export class SalesDirectModule { }
