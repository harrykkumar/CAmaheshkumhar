import { Injectable } from '@angular/core'
import { ApiConstant } from '../../shared/constants/api'
import { BaseServices } from '../base-services'
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class CompositeUnitService {
  private sendArrayData = new BehaviorSubject<any>([])
  castArray = this.sendArrayData.asObservable()
  private stringData = new BehaviorSubject<any>({})
  castString = this.stringData.asObservable()
  constructor (private _basesService: BaseServices) {
  }

  getSubUnitDetails (queryParams): Observable<any> {
    return this._basesService.getRequest(ApiConstant.GET__SUB_UNIT_DETAIL + queryParams)
  }

  getSubUnit (id) {
    return this._basesService.getRequest(ApiConstant.GET__SUB_UNIT_BY_ID + id)
  }

  addSubUnitId (parmas) {
    return this._basesService.postRequest(ApiConstant.GET__SUB_UNIT_DETAIL, parmas)
  }
  delteSubUnit (id) {
    return this._basesService.deleteRequest(ApiConstant.GET__SUB_UNIT_DETAIL + '?id=' + id)
  }

  sendDataWithObservable (e) {
    this.sendArrayData.next(e)
  }
  sendStringDataWithObservable (e) {
    this.stringData.next(e)
  }
}
