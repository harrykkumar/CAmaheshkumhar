import { Injectable } from '@angular/core'
import { BaseServices } from '../../../../commonServices/base-services'
import { ApiConstant } from '../../../constants/api'
import { Observable } from 'rxjs'
import { ResponseSale } from '../../../../model/sales-tracker.model'

@Injectable({
  providedIn: 'root'
})
export class ComboService {
  constructor (private baseService: BaseServices) {}
  getSPUtilityData (): Observable<ResponseSale> {
    return this.baseService.getRequest(ApiConstant.SPUTILITY_TO_CREATE_COMBO)
  }
}
