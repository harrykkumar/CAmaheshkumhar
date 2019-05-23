import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
import { CommonModule } from '@angular/common'
import { PagingUtilityModule } from '../../shared/pagination/pagination.module'
import { NgxPaginationModule } from 'ngx-pagination'
import { ledgerGroupRoutingModule } from './ledger-group.routing.module'
import { LedgerGroupComponent } from './ledger-group.component'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Select2Module,
    ledgerGroupRoutingModule,
    PagingUtilityModule,
    NgxPaginationModule
  ],
  declarations: [
    LedgerGroupComponent
  ]
})
export class LedgerGroupModule {

}
