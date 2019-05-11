import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-purchase-search',
  templateUrl: './purchase-search.component.html',
  styleUrls: ['./purchase-search.component.css']
})
export class PurchaseSearchComponent {
  @Input() toShow = false
}
