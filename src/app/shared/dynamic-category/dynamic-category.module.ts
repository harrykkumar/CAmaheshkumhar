import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { DynamicCategoryAddComponent } from './dynamic-category-add.component'
import { Select2Module } from 'ng2-select2'
@NgModule({
  declarations: [
    DynamicCategoryAddComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    Select2Module
  ],
  exports: [
    DynamicCategoryAddComponent
  ]
})
export class DynamicCategoryModule {

}
