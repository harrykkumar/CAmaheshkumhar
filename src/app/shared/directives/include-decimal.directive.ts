import { Directive,HostListener } from '@angular/core'

@Directive({
  selector: '[appIncludeDecimal]'
})
export class IncludeDecimalDirective {

  @HostListener('keypress', ['$event'])
	onKeyPress (e: KeyboardEvent): boolean {
    const amount = /^\d*\.?\d*$/
    if (e.keyCode !== 8 && !amount.test(e.key)) {
      return false
    } else {
      if (e.key === '.' && (event.target as HTMLInputElement).value.includes('.')) {
        return false
      }
      return true
    }
  }
}
