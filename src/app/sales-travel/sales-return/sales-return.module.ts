import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
import { SharedModule } from '../../shared/shared.module'
import { SalesReturnRoutingModule } from './sales-return.routing.module'
import { SaleTravelReturnServices } from './sale-travel-return.services'
import { SalesSearchComponent } from './sales-return-header/sales-reutrn-header-search/sales-return-header-search.component'
import { SalesReturnListComponent } from './sales-return-list/sales-return-list.component'
@NgModule({
  declarations: [
    SalesReturnListComponent,
    SalesSearchComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    Select2Module,
    SalesReturnRoutingModule,
    SharedModule
  ],
  providers: [SaleTravelReturnServices]
})
export class SalesReturnModule { }
