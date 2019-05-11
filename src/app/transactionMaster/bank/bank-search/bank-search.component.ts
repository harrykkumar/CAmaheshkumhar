import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-bank-search',
  templateUrl: './bank-search.component.html',
  styleUrls: ['./bank-search.component.css']
})
export class BankSearchComponent {
  @Input() toShow: boolean = false
}
