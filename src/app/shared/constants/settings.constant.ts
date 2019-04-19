import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class Settings {

  get dateFormat (): string {
    if (window.localStorage['dateFormat']) {
      return window.localStorage['dateFormat']
    } else {
      return ''
    }
  }

  set dateFormat (dateFormat: string) {
    window.localStorage['dateFormat'] = dateFormat
  }
}
