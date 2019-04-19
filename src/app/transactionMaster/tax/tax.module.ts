import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { TaxComponent } from './tax.component'
import { Select2Module } from 'ng2-select2'
import { CommonModule } from '@angular/common'
import { TaxRoutingModule } from './tax.routing.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Select2Module,
    TaxRoutingModule
  ],
  declarations: [
    TaxComponent
  ]
})
export class TaxModule {

}
