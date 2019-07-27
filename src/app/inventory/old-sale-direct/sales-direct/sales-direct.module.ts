import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
import { SalesDirectRoutingModule } from './sales-direct.routing.module'
import { SalesSearchComponent } from './sales-header/sales-search/sales-search.component'
import { SalesListComponent } from './sales-list.component'
import { SharedModule } from '../../../shared/shared.module'
import { NgxBarcodeModule } from 'ngx-barcode'
//import {SaleCommonService}
import {SalesDirectComponent} from './sales-header/sales-direct/sales-direct.component'
@NgModule({
  declarations: [ 
    SalesListComponent,
    SalesSearchComponent,
    SalesDirectComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    Select2Module,
    NgxBarcodeModule,
    SalesDirectRoutingModule
  ]
})
export class SalesDirectModule { }
