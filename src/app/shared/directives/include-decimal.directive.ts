import { Directive,HostListener } from '@angular/core'
import { Settings } from '../constants/settings.constant';
import { SetUpIds } from '../constants/setupIds.constant';

@Directive({
  selector: '[appIncludeDecimal]'
})
export class IncludeDecimalDirective {
  constructor (private settings: Settings) {}
  @HostListener('keypress', ['$event'])
	onKeyPress (e: KeyboardEvent): boolean {
    let settings = JSON.parse(this.settings.moduleSettings).settings
    let noOfDecimal = 2
    let setting = settings.filter((setting) => setting.id === SetUpIds.noOfDecimalPoint)
    if (setting.length === 1) {
      noOfDecimal = setting[0].val
    }
    const amount = /^\d*\.?\d*$/
    if (e.keyCode !== 8 && !amount.test(e.key)) {
      return false
    } else {
      if (e.key === '.' && (event.target as HTMLInputElement).value.includes('.')) {
        return false
      }
      if ((event.target as HTMLInputElement).value.includes('.')) {
        let nums = (event.target as HTMLInputElement).value.split('.')
        let before = nums[0]
        // let after = nums[1]
        if (before.length > 10) {
          return false
        }
      } else {
        if ((event.target as HTMLInputElement).value.length === 10 && e.key !== '.') {
          return false
        }
      }
    }
  }
}
