import { NgModule } from '@angular/core'
import { LedgerCreationAddComponent } from './ledger-creation.component'
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
    LedgerCreationAddComponent
  ],
  exports: [LedgerCreationAddComponent],
  bootstrap: []
})
export class LedgerCreationAddModule {

}
