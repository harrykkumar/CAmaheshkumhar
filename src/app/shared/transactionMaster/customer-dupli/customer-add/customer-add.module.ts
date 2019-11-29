import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
import { CustomerAddComponent } from './customer-add.component'
import { CommonModule } from '@angular/common'
import { SharedModule } from '../../../shared.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Select2Module,
    SharedModule
  ],
  declarations: [
    CustomerAddComponent
  ],
  exports: [
    CustomerAddComponent
  ],
  bootstrap: []
})
export class CustomerAddModule {

}
