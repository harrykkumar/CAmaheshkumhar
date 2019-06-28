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

  get catLevel (): number {
    if (window.localStorage['catLevel']) {
      return window.localStorage['catLevel']
    } else {
      return 1
    }
  }

  set catLevel (catLevel: number) {
    window.localStorage['catLevel'] = catLevel
  }

  get industryId (): number {
    if (window.localStorage['industryId']) {
      return window.localStorage['industryId']
    } else {
      return 1
    }
  }

  set industryId (industryId: number) {
    window.localStorage['industryId'] = industryId
  }

  get moduleSettings (): string {
    if (window.localStorage['moduleSettings']) {
      return window.localStorage['moduleSettings']
    } else {
      return ''
    }
  }

  set moduleSettings (moduleSettings: string) {
    window.localStorage['moduleSettings'] = moduleSettings
  }
}
