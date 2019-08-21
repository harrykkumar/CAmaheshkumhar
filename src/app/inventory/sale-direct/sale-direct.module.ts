import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SaleDirectRoutingModule } from './sale-direct.routing.module'
import { SaleDirectAddComponent } from './sale-direct-add/sale-direct-add.component'
import { SaleDirectListComponent } from './sale-direct-list/sale-direct-list.component'
import { SaleDirectSearchComponent } from './sale-direct-search/sale-direct-search.component'
import { SaleDirectMainComponent } from './sale-direct-main/sale-direct-main.component'
import { Select2Module } from 'ng2-select2'
import { SharedModule } from 'src/app/shared/shared.module'
import { PagingUtilityModule } from 'src/app/shared/pagination/pagination.module'
import { NgxPaginationModule } from 'ngx-pagination'
import { SaleDirectReturnModule} from './sales-return/saleReturn.module'
@NgModule({
  declarations: [
    SaleDirectAddComponent,
    SaleDirectListComponent,
    SaleDirectSearchComponent,
    SaleDirectMainComponent
  ],
  imports: [
    CommonModule,
    SaleDirectRoutingModule,
    SharedModule,
    Select2Module,
    PagingUtilityModule,
    NgxPaginationModule,
    SaleDirectReturnModule
  ]
})
export class SalesDirectModule { }
