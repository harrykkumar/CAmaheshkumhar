import { Directive, HostListener, Input, ElementRef } from '@angular/core';
@Directive({
  selector: '[limitqty]'
})
export class LimitQty {
  @Input() maxNum: number;
  constructor (private el: ElementRef) {}
  @HostListener('keypress', ['$event'])
	onKeyPress (e: KeyboardEvent): boolean {
    // console.log('this.maxNum : ', this.maxNum)
    const digits = /^\d{0,9}?$/
    if (e.keyCode !== 8 && !digits.test(e.key)) {
      return false
    } else {
      if ((event.target as HTMLInputElement).value.length > 10) {
        return false
      } else {
        if (+((this.el.nativeElement.value) + e.key) > this.maxNum) {
          return false
        } else {
          return true
        }
      }
    }
  }
}

/*
  if (e.key === '.' && (event.target as HTMLInputElement).value.includes('.')) {
    return false
  }
  if ((event.target as HTMLInputElement).value.includes('.')) {
    let nums = (event.target as HTMLInputElement).value.split('.')
    let before = nums[0]
    if (before.length > 10) {
      return false
    }
  } else {
    if ((event.target as HTMLInputElement).value.length === 10 && e.key !== '.') {
      return false
    }
  } 
*/
