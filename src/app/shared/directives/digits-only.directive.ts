import { Directive,HostListener } from '@angular/core'

@Directive({
  selector: '[appDigitsOnlyDirective]'
})
export class DigitsOnlyDirective {
  @HostListener('keypress', ['$event'])
	onKeyPress (e: KeyboardEvent): boolean {
    const digits = /^\d{0,9}?$/
    if (e.keyCode !== 8 && !digits.test(e.key)) {
      return false
    } else {
      return true
    }
  }
}
