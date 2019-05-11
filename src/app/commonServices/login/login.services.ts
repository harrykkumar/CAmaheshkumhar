import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ApiConstant } from '../../shared/constants/api'
import { BaseServices } from '../base-services'
import { CommonService } from '../commanmaster/common.services'
import { Settings } from 'src/app/shared/constants/settings.constant'

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor (private _basesService: BaseServices, private commonService: CommonService, private settings: Settings) { }

  public login (params: any): Observable<any> {
    return this._basesService.postRequest(ApiConstant.LOGIN_URL, params)
  }
}
