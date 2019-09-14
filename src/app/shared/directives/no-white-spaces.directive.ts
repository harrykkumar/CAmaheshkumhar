import { Directive,HostListener } from '@angular/core'

@Directive({
  selector: '[SkipWhiteSpaces]'
})
export class SkipWhiteSpacesDirective {
  @HostListener('keypress', ['$event'])
	onKeyPress (e: KeyboardEvent): boolean {
    const regex = /^\S*$/
    if (!regex.test(e.key)) {
      return false
    } else {
      return true
    }
  }
}
