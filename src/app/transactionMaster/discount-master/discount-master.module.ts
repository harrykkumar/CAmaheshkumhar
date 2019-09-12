import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
import { CommonModule } from '@angular/common'
import { DiscountMasterComponent } from './discount-master.component'
import { DiscountMasterRoutingModule } from './discount-master.routing.module'
import { PagingUtilityModule } from '../../shared/pagination/pagination.module'
import { NgxPaginationModule } from 'ngx-pagination'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Select2Module,
    DiscountMasterRoutingModule,
    PagingUtilityModule,
    NgxPaginationModule
  ],
  declarations: [
    DiscountMasterComponent,
  ]
})
export class DiscountMasterModule {

}
