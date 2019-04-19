import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-customer-search',
  templateUrl: './customer-search.component.html'
})
export class CustomerSearchComponent {
  @Input() toShow: boolean = false
}
