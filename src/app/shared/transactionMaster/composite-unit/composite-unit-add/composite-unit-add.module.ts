import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
import { CompositeUnitAddComponent } from './composite-unit-add.component'
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
    CompositeUnitAddComponent
  ],
  exports: [CompositeUnitAddComponent],
  bootstrap: []
})
export class CompositeUnitAddModule {

}
