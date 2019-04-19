import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
import { CategoryAddComponent } from './category-add.component'
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
    CategoryAddComponent
  ],
  exports: [
    CategoryAddComponent
  ],
  bootstrap: []
})
export class CategoryAddModule {

}
