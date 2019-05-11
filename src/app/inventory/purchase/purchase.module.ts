import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PurchaseRoutingModule } from './purchase.routing.module'
import { PurchaseAddComponent } from './purchase-add/purchase-add.component'
import { PurchaseListComponent } from './purchase-list/purchase-list.component'
import { PurchaseSearchComponent } from './purchase-search/purchase-search.component'
import { PurchaseMainComponent } from './purchase-main/purchase-main.component'
import { Select2Module } from 'ng2-select2'
import { SharedModule } from 'src/app/shared/shared.module'
import { MatTooltipModule } from '@angular/material/tooltip'

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
    MatTooltipModule
  ]
})
export class PurchaseModule { }
