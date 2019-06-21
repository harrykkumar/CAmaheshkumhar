import { Injectable } from '@angular/core'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor(private router: Router){
  }

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

  destroyToken() {
    window.localStorage.removeItem('token')
    window.localStorage.clear();
    this.router.navigate(['login']);
  }
}
