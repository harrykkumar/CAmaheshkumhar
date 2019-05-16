import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
import { CommonModule } from '@angular/common'
import { PagingUtilityModule } from '../../shared/pagination/pagination.module'
import { NgxPaginationModule } from 'ngx-pagination'
import { BanbkRoutingModule } from './bank.routing.module'
import { BankComponent } from './bank.component'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Select2Module,
    BanbkRoutingModule,
    PagingUtilityModule,
    NgxPaginationModule
  ],
  declarations: [
    BankComponent
  ]
})
export class BankModule {

}
