import { NgModule } from '@angular/core'
import { PrintComponent } from './print.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
import { CommonModule } from '@angular/common'
import { SharedModule } from '../../../shared/shared.module'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Select2Module,
    SharedModule
  ],
  declarations: [
    PrintComponent
  ],
  exports: [PrintComponent],
  bootstrap: []
})
export class PrintModule {

}
