import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { Select2Module } from 'ng2-select2'
import { BalanceSheetSearchComponent } from './balance-sheet-search/balance-sheet-search.component'
import { TrailBalanceReportComponent } from './trail-balance-report.component'
import { SharedModule } from '../../shared/shared.module'
import {TailBalanceReportRoutingModule} from './trail-balance-report.routing.module'
import { NgxBarcodeModule } from 'ngx-barcode'
@NgModule({
  declarations: [ 
    // SearchComponent,
    BalanceSheetSearchComponent,
    TrailBalanceReportComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    Select2Module,
    NgxBarcodeModule,
    TailBalanceReportRoutingModule
  ]
})
export class TrailBalanceReportModule {}
