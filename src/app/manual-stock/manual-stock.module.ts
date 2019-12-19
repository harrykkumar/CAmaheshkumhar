import { NgModule } from "@angular/core";
import { ManualStockComponent } from './manual-stock.component'
import { ManualStockRoutingModule } from './manual-stock.routing.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ManualStockSearchComponent } from './manual-stock-search/manual-stock-search.component';
@NgModule({
  declarations: [
    ManualStockComponent,
    ManualStockSearchComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ManualStockRoutingModule
  ]
})
export class ManualStockModule {

}