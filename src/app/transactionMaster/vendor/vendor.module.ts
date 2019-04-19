import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
import { VendorComponent } from './vendor.component'
import { VendorSearchComponent } from './vendor-search/vendor-search.component'
import { CommonModule } from '@angular/common'
import { VendorRoutingModule } from './vendor.routing.module'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Select2Module,
    VendorRoutingModule
  ],
  declarations: [
    VendorComponent,
    VendorSearchComponent
  ]
})
export class VendorModule {

}
