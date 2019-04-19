import { Injectable } from '@angular/core'
import { BaseServices } from './base-services'
import { Observable } from 'rxjs'
import { ApiConstant } from '../shared/constants/api'

@Injectable({
  providedIn: 'root'
})
export class BankPopUpServices {
  constructor (private _basesService: BaseServices) { }

  public saveBank (params: any): Observable<any> {
    return this._basesService.postRequest(ApiConstant.BANK_DETAIL_URL, params)
  }

}
