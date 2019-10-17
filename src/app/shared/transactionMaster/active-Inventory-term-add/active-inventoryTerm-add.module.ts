import { SharedModule } from './../../shared.module'
import { FormsModule } from '@angular/forms'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActiveInventoryTermAddComponent } from './active-inventoryTerm-add.component'
import { Select2Module } from 'ng2-select2'

@NgModule({
  declarations: [ActiveInventoryTermAddComponent],
  imports: [
    CommonModule,
    FormsModule,
    Select2Module,
    SharedModule
  ],
  exports: [ActiveInventoryTermAddComponent]
})
export class ActiveInventoryTermAddModule { }
