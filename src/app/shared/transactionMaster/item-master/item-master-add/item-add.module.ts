import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
import { CommonModule } from '@angular/common'
import { SharedModule } from '../../../shared.module'
import { ItemAddComponent } from './item-add.component'
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Select2Module,
    NgMultiSelectDropDownModule.forRoot(),
    SharedModule
  ],
  declarations: [
    ItemAddComponent
  ],
  exports: [
    ItemAddComponent
  ],
  bootstrap: []
})
export class ItemAddModule {

}
