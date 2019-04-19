import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ApiConstant } from '../../shared/constants/api'
import { BaseServices } from '../base-services'

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor (private _basesService: BaseServices) { }

  public login (params: any): Observable<any> {
    return this._basesService.postRequest(ApiConstant.LOGIN_URL, params)
  }
}
