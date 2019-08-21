import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { serviceBillingRoutingModule } from './serviceBilling.routing.module'
import { serviceBillingAddComponent } from './serviceBilling-add/serviceBilling-add.component'
import { serviceBillingListComponent } from './serviceBilling-list/serviceBilling-list.component'
import { serviceBillingSearchComponent } from './serviceBilling-search/serviceBilling-search.component'
import { serviceBillingMainComponent } from './serviceBilling-main/serviceBilling-main.component'
import { Select2Module } from 'ng2-select2'
import { SharedModule } from 'src/app/shared/shared.module'
import { PagingUtilityModule } from 'src/app/shared/pagination/pagination.module'
import { NgxPaginationModule } from 'ngx-pagination'
@NgModule({
  declarations: [
    serviceBillingAddComponent,
    serviceBillingListComponent,
    serviceBillingSearchComponent,
    serviceBillingMainComponent
  ],
  imports: [
    CommonModule,
    serviceBillingRoutingModule,
    SharedModule,
    Select2Module,
    PagingUtilityModule,
    NgxPaginationModule
  ]
})
export class serviceBillingModule { }
