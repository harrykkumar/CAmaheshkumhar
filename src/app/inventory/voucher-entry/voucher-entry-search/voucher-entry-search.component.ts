import { Component, Input } from "@angular/core";

@Component({
  selector: 'voucher-entry-search',
  templateUrl: './voucher-entry-search.component.html'
})

export class VoucherEntrySearchComponent {
  @Input() toShow: boolean
}