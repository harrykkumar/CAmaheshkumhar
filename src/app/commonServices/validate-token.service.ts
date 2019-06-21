import { Injectable } from '@angular/core'
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router'
import { TokenService } from './token.service'
import { URLConstant } from '../shared/constants/urlconstant'
import { BaseServices } from './base-services'
import { ApiConstant } from '../shared/constants/api'
import { UIConstant } from '../shared/constants/ui-constant'
import { map } from 'rxjs/internal/operators/map'
import { ToastrCustomService } from './toastr.service'
import { LoginService } from './login/login.services'
import * as _ from 'lodash'


@Injectable({
  providedIn: 'root'
})

export class ValidateTokenService implements CanActivate {
  constructor (
        private _validUser: TokenService,
        private _router: Router,
        private baseService: BaseServices,
        private toastrService: ToastrCustomService,
        private _loginService: LoginService

    ) { }
  public canActivate (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.baseService.postRequest(ApiConstant.STATUS_URL, { 'token': this._validUser.getToken() }).pipe(
      map((data) => {
        return data.Code === UIConstant.THOUSAND && data.Data.Status === 'false' ? (this._validUser.destroyToken(), this._router.parseUrl(URLConstant.LOGIN_URL)) : !!data.Data.Status
      })
    )
  }
}