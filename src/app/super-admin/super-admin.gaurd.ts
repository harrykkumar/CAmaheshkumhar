import { TokenService } from '../commonServices/token.service';
import { Injectable } from '@angular/core';
import { 
  CanActivate,
  CanActivateChild,
  Resolve,
  CanLoad,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  Route } from '@angular/router';
import { Observable } from 'rxjs';
import { UrlTree } from '@angular/router';

@Injectable()
export class SuperAdminGaurd implements CanActivate, CanActivateChild {
  constructor(private tokenService: TokenService, private _router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.tokenService.getToken()) {
      return true;
    }
    return false;
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.tokenService.getToken()) {
      return true;
    }
    return false;
  }
}