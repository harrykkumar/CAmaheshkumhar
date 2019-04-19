import { NgModule } from '@angular/core'
import { BankAddComponent } from './bank-add.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
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
    BankAddComponent
  ],
  exports: [BankAddComponent],
  bootstrap: []
})
export class BankAddModule {

}
