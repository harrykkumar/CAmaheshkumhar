import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
import { BalanceSheetReportRoutingModule } from './balance-sheet-report.routing.module'
// import { BalanceSheetSearchComponent } from './balance-sheet-search/balance-sheet-search.component'
import { BalanceSheetReportComponent } from './balance-sheet-report.component'
import { SharedModule } from '../../shared/shared.module'
import { NgxBarcodeModule } from 'ngx-barcode'
@NgModule({
  declarations: [ 
    BalanceSheetReportComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    Select2Module,
    NgxBarcodeModule,
    BalanceSheetReportRoutingModule
  ]
})
export class BalanceSheetReportModule {}
