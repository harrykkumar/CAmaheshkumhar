import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PurchaseRoutingModule } from './purchase.routing.module'
import { PurchaseAddComponent } from './purchase-add/purchase-add.component'
import { PurchaseListComponent } from './purchase-list/purchase-list.component'
import { PurchaseSearchComponent } from './purchase-search/purchase-search.component'
import { PurchaseMainComponent } from './purchase-main/purchase-main.component'
import { Select2Module } from 'ng2-select2'
import { SharedModule } from 'src/app/shared/shared.module'
import { PagingUtilityModule } from 'src/app/shared/pagination/pagination.module'
import { NgxPaginationModule } from 'ngx-pagination'

@NgModule({
  declarations: [
    PurchaseAddComponent,
    PurchaseListComponent,
    PurchaseSearchComponent,
    PurchaseMainComponent
  ],
  imports: [
    CommonModule,
    PurchaseRoutingModule,
    SharedModule,
    Select2Module,
    PagingUtilityModule,
    NgxPaginationModule
  ]
})
export class PurchaseModule { }
