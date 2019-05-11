import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SharedModule } from '../../shared/shared.module'
import { ProfitReportMainComponent } from './profit-report-main/profit-report-main.component'
import { ProfitReportSearchComponent } from './profit-report-search/profit-report-search.component'
import { ProfitReportRoutingModule } from './profit-report.routing.module'
import { ProfitReportListComponent } from './profit-report-list/profit-report-list.component'

@NgModule({
  declarations: [
    ProfitReportSearchComponent,
    ProfitReportMainComponent,
    ProfitReportListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ProfitReportRoutingModule
  ]
})
export class ProfitReportModule { }
