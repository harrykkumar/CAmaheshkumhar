import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
import { ProfitAndLossReportRoutingModule } from './profit-and-loss-report.routing.module'
import { BalanceSheetSearchComponent } from './balance-sheet-search/balance-sheet-search.component'
import { ProfitAndLossReportComponent } from './profit-and-loss-report.component'
import { SharedModule } from '../../shared/shared.module'
import { NgxBarcodeModule } from 'ngx-barcode'
@NgModule({
  declarations: [ 
     BalanceSheetSearchComponent,
    ProfitAndLossReportComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    Select2Module,
    NgxBarcodeModule,
    ProfitAndLossReportRoutingModule
  ]
})
export class ProfitAndLossReportModule {}
