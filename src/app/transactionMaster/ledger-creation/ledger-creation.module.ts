import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
import { CommonModule } from '@angular/common'
import { PagingUtilityModule } from '../../shared/pagination/pagination.module'
import { NgxPaginationModule } from 'ngx-pagination'
import { LedgerCreationRoutingModule } from './ledger-creation.routing.module'
import { LedgerCreationComponent } from './ledger-creation.component'
import { LedgerImportModule } from '../../shared/transactionMaster/ledger-creation/ledger-import/ledger-import.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Select2Module,
    LedgerCreationRoutingModule,
    PagingUtilityModule,
    NgxPaginationModule,
    LedgerImportModule
  ],
  declarations: [
    LedgerCreationComponent
  ]
})
export class LedgerCreationModule {

}
