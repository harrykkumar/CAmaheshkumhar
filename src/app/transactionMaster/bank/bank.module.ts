import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
import { BankComponent } from './bank.component'
import { BankSearchComponent } from './bank-search/bank-search.component'
import { CommonModule } from '@angular/common'
import { BanbkRoutingModule } from './bank.routing.module'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Select2Module,
    BanbkRoutingModule
  ],
  declarations: [
    BankComponent,
    BankSearchComponent
  ]
})
export class BankModule {

}
