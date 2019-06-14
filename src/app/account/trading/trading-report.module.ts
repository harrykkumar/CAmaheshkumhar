import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
import { TradingReportRoutingModule } from './trading-report.routing.module'
// import { SearchComponent } from './search/search'
import { BalanceSheetSearchComponent } from './balance-sheet-search/balance-sheet-search.component'

import { TradingReportComponent } from './trading-report.component'
import { SharedModule } from '../../shared/shared.module'
import { NgxBarcodeModule } from 'ngx-barcode'
@NgModule({
  declarations: [ 
    // SearchComponent,
    BalanceSheetSearchComponent,
    TradingReportComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    Select2Module,
    NgxBarcodeModule,
    TradingReportRoutingModule
  ]
})
export class TradingReportModule {}
