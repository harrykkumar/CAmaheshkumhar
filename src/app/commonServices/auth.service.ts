import { Injectable } from '@angular/core'
import {
  Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate,
  CanActivateChild, UrlTree
} from '@angular/router'
import { TokenService } from './token.service'
import { LoginService } from './login/login.services'
import * as _ from 'lodash'
import { Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
@Injectable({
  providedIn: 'root'
})

export class AuthService implements CanActivateChild, CanActivate {
  // private changesSub = new Subject()
  constructor(
    private _validUser: TokenService,
    private _router: Router,
    private _loginService: LoginService,
    private spinnerService: NgxSpinnerService

  ) { }
  public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authenticate()
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authenticate()
  }

async  authenticate() {
    const token = this._validUser.getToken();
    if (!token) {
      this._loginService.logOut()
      return false;
    } else if (token) {
      const organization = JSON.parse(localStorage.getItem('SELECTED_ORGANIZATION'))
      if (_.isEmpty(organization)) {
        this._router.navigate(['organizations'])
        return false
      }
      if (_.isEmpty(this._loginService.userData) || (!_.isEmpty(this._loginService.userData) &&
        _.isEmpty(this._loginService.userData.Modules))) {
        this.spinnerService.show()
        await this._loginService.getAllSettings(this._loginService.selectedUserModule.Id)
        await this._loginService.getUserDetails(organization.Id)
        this._loginService.selectedUserModule = JSON.parse(localStorage.getItem('SELECTED_MODULE'))
        this._loginService.loginUserDetails = JSON.parse(localStorage.getItem('LOGIN_USER'));
        this.spinnerService.hide()
      }
      const module = JSON.parse(localStorage.getItem('SELECTED_MODULE'))
      if (_.isEmpty(module)) {
        this._router.navigate(['modules']);
        return false;
      } else if (!_.isEmpty(module)) {
        return true;
      }
    }
  }
}
