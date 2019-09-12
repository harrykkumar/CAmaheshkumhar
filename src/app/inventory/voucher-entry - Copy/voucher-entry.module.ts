import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoucherEntryMainComponent } from './voucher-entry-main/voucher-entry-main.component';
import { VoucherEntryAddComponent } from './voucher-entry-add/voucher-entry-add.component';
import { VoucherEntrySearchComponent } from './voucher-entry-search/voucher-entry-search.component';
import { VoucherEntryRoutingModule } from './voucher-entry.routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { Select2Module } from 'ng2-select2';
import { PagingUtilityModule } from 'src/app/shared/pagination/pagination.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { VoucherEntryListComponent } from './voucher-entry-list/voucher-entry-list.component';

@NgModule({
  declarations: [
    VoucherEntryMainComponent,
    VoucherEntryAddComponent,
    VoucherEntrySearchComponent,
    VoucherEntryListComponent
  ],
  imports: [
    CommonModule,
    VoucherEntryRoutingModule,
    SharedModule,
    Select2Module,
    PagingUtilityModule,
    NgxPaginationModule
  ],
  entryComponents: [
    VoucherEntryAddComponent
  ]
})
export class VoucherEntryModule { }
