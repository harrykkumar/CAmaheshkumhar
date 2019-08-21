import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from 'src/app/commonServices/token.service';
import { BaseServices } from 'src/app/commonServices/base-services';
import { LoginService } from 'src/app/commonServices/login/login.services';
import * as _ from 'lodash'
@Injectable({
  providedIn: 'root'
})
export class FinancialYearGuard implements CanLoad {
  constructor(
    private _validUser: TokenService,
    private _loginService: LoginService,
    private _router: Router
  ) { }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this.authenticate();
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authenticate()
  }

  authenticate() {
    const token = this._validUser.getToken();
    if (_.isEmpty(token)) {
      this._loginService.logOut()
      return false;
    } else if (token) {
      const branch = JSON.parse(localStorage.getItem('SELECTED_BRANCH'))
            if (_.isEmpty(branch)) {
              this._router.navigate(['org-branches'])
              return false;
            } else if (!_.isEmpty(branch)) {
              return true;
            }
    }
  }
}
