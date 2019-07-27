import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemGroupStockReportComponent } from './item-group-stock.component';
import { SharedModule } from 'src/app/shared/shared.module';
import {ItemGroupStockRoutingModule} from './item-group-stock.routing.module'
@NgModule({
  declarations: [ItemGroupStockReportComponent],
  imports: [
    CommonModule,
    ItemGroupStockRoutingModule,
    SharedModule
  ]
})
export class ItemGroupStockModule { }
