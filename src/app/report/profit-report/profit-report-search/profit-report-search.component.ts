import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-profit-report-search',
  templateUrl: './profit-report-search.component.html',
  styleUrls: ['./profit-report-search.component.css']
})
export class ProfitReportSearchComponent {
  @Input() toShow = false
}
