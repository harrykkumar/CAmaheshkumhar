import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-route-search',
  templateUrl: './route-search.component.html'
})
export class RouteSearchComponent {
  @Input() toShow: boolean = false
}
