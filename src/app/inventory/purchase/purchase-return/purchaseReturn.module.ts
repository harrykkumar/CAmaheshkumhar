import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PurchaseReturnDirectRoutingModule } from './purchaseReturn.routing.module'
import { PurchaseReturnListComponent } from './purchaseReturn-list/purchaseReturn-list.component'
import { PurchaseReturnSearchComponent } from './purchaseReturn-search/purchaseReturn-search.component'
import { PurchaseReturnMainComponent } from './purchaseReturn-main/purchaseReturn-main.component'
import { Select2Module } from 'ng2-select2'
import { SharedModule } from 'src/app/shared/shared.module'
import { PagingUtilityModule } from 'src/app/shared/pagination/pagination.module'
import { NgxPaginationModule } from 'ngx-pagination'
import {PurchaseService} from '../purchase.service'
import {PurchaseReturnComponent} from '../../purchase/purchaseReturn-add/purchaseReturn-add.component'

@NgModule({
  declarations: [
    PurchaseReturnListComponent,
    PurchaseReturnSearchComponent,
    PurchaseReturnMainComponent,
    PurchaseReturnComponent
  ],
  imports: [
    CommonModule,
    PurchaseReturnDirectRoutingModule,
    SharedModule,
    Select2Module,
    PagingUtilityModule,
    NgxPaginationModule
  ],
  exports:[
    PurchaseReturnComponent
  ],
  providers: [PurchaseService]
})
export class PurchaseReturnModule { }
