import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SaleReturnDirectRoutingModule } from './saleReturn.routing.module'
import { SaleReturnDirectListComponent } from './saleReturn-list/saleReturn-list.component'
import { SaleReturnDirectSearchComponent } from './saleReturn-search/saleReturn-search.component'
import { SaleReturnDirectMainComponent } from './saleReturn-main/saleReturn-main.component'
import { Select2Module } from 'ng2-select2'
import { SharedModule } from 'src/app/shared/shared.module'
import { PagingUtilityModule } from 'src/app/shared/pagination/pagination.module'
import { NgxPaginationModule } from 'ngx-pagination'
import {SaleDirectReturnService} from './saleReturn.service'
import {SaleDirectReturnComponent} from '../saleReturn-add/saleReturn-add.component'

@NgModule({
  declarations: [
    SaleReturnDirectListComponent,
    SaleReturnDirectSearchComponent,
    SaleReturnDirectMainComponent,
    SaleDirectReturnComponent
  ],
  imports: [
    CommonModule,
    SaleReturnDirectRoutingModule,
    SharedModule,
    Select2Module,
    PagingUtilityModule,
    NgxPaginationModule
  ],
  exports:[
    SaleDirectReturnComponent
  ],
  providers: [SaleDirectReturnService]
})
export class SaleDirectReturnModule { }
