import { Component } from '@angular/core';
@Component({
  selector: 'custom-rate-main',
  templateUrl: './custom-rate-main.component.html'
})
export class CustomRateMainComponent {
  toShowSearch = false

  toggleSearch () {
    this.toShowSearch = !this.toShowSearch
  }
}