import { Directive, HostListener } from '@angular/core'

@Directive({
  selector: 'open-close-modal'
})
export class ModalDirective {
  @HostListener('click') onClick () {
    //
  }
}
