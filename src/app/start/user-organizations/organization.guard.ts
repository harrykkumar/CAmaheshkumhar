import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from 'src/app/commonServices/token.service';
import { LoginService } from 'src/app/commonServices/login/login.services';
import * as _ from 'lodash'

@Injectable({
  providedIn: 'root'
})
export class OrganizationGuard implements CanLoad, CanActivate {
  constructor(
    private _validUser: TokenService,
    private _loginService: LoginService,

  ) { }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this.authenticate()
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
      return true;
    }
  }
}
