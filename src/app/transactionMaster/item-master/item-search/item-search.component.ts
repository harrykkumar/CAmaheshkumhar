import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-item-search',
  templateUrl: './item-search.component.html',
  styleUrls: ['./item-search.component.css']
})
export class ItemSearchComponent {
  @Input() toShow: boolean = false
}
