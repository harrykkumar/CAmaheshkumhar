import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-vendor-search',
  templateUrl: './vendor-search.component.html',
  styleUrls: ['./vendor-search.component.css']
})
export class VendorSearchComponent {
  @Input() toShow: boolean = false
}
