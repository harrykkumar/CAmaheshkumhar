import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-sales-search',
  templateUrl: './sales-return-header-search.component.html',
  styleUrls: ['./sales-return-header-search.component.css']
})
export class SalesSearchComponent {
  @Input() toShow: boolean = false
}
