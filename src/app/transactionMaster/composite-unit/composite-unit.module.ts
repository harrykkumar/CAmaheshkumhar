import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
import { CompositeUnitComponent } from './composite-unit.component'
import { CommonModule } from '@angular/common'
import { CompositeUnitRoutingModule } from './composite-unit.routing.module'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Select2Module,
    CompositeUnitRoutingModule
  ],
  declarations: [
    CompositeUnitComponent
  ]
})
export class CompositeUnitModule {

}
