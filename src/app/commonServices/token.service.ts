import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  getToken (): any {
    if (window.localStorage['token']) {
      return window.localStorage['token']
    } else {
      return false
    }
  }

  saveToken (token: String) {
    window.localStorage['token'] = token
  }

  destroyToken () {
    window.localStorage.removeItem('token')
  }
}
