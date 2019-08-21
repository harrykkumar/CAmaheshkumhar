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
  
  removeDateFormate() {
    localStorage.removeItem('dateFormat');
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
   removeModuleSettings (){
    window.localStorage.removeItem('moduleSettings');
  }

  get finFromDate (): string {
    if (window.localStorage['finFromDate']) {
      return window.localStorage['finFromDate']
    } else {
      return ''
    }
  }

  set finFromDate (finFromDate: string) {
    window.localStorage['finFromDate'] = finFromDate
  }

  get finToDate (): string {
    if (window.localStorage['finToDate']) {
      return window.localStorage['finToDate']
    } else {
      return ''
    }
  }

  set finToDate (finToDate: string) {
    window.localStorage['finToDate'] = finToDate
  }
  get CompanyDetails (): string {
    if (window.localStorage['CompanyDetails']) {
      return window.localStorage['CompanyDetails']
    } else {
      return ''
    }
  }
  set CompanyDetails (CompanyDetails: string) {
    window.localStorage['CompanyDetails'] = CompanyDetails
  }
  get noOfDecimal (): string {
    if (window.localStorage['noOfDecimal']) {
      return window.localStorage['noOfDecimal']
    } else {
      return ''
    }
  }

  set noOfDecimal (dateFormat: string) {
    window.localStorage['noOfDecimal'] = dateFormat
  }
}
