import { SharedModule } from './../../shared.module'
import { FormsModule } from '@angular/forms'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AttributeAddComponent } from './attribute-add.component'
import { Select2Module } from 'ng2-select2'

@NgModule({
  declarations: [AttributeAddComponent],
  imports: [
    CommonModule,
    FormsModule,
    Select2Module,
    SharedModule
  ],
  exports: [AttributeAddComponent]
})
export class AttributeAddModule { }
