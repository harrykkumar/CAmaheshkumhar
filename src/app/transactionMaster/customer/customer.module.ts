import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
import { CustomerComponent } from './customer.component'
import { CustomerRoutingModule } from './customer.routing.module'
import { CustomerSearchComponent } from './customer-search/customer-search.component'
import { CommonModule } from '@angular/common'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Select2Module,
    CustomerRoutingModule
  ],
  declarations: [
    CustomerComponent,
    CustomerSearchComponent
  ]
})
export class CustomerModule {

}
