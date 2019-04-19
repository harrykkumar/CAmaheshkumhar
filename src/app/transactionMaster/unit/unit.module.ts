import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
import { CommonModule } from '@angular/common'
import { UnitComponent } from './unit.component'
import { UnitRoutingModule } from './unit.routing.module'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Select2Module,
    UnitRoutingModule
  ],
  declarations: [
    UnitComponent
  ]
})
export class UnitModule {

}
