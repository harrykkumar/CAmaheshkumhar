import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-sales-search',
  templateUrl: './sales-search.component.html',
  styleUrls: ['./sales-search.component.css']
})
export class SalesSearchComponent {
  @Input() toShow: boolean = false
}
