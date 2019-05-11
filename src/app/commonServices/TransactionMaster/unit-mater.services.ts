import { Injectable } from '@angular/core'
import { ApiConstant } from '../../shared/constants/api'
import { BaseServices } from '../base-services'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class UnitMasterServices {

  getDataObject: object
  getdata: object
  checkboxValue: boolean
  private sendArrayData = new BehaviorSubject<any>([])
  castArray = this.sendArrayData.asObservable()

  private stringData = new BehaviorSubject<any>({})
  castString = this.stringData.asObservable()

  sendDataWithObservable (e) {
    this.sendArrayData.next(e)
  }
  sendStringDataWithObservable (e) {
    this.stringData.next(e)
  }
  setUnitCheckBoxValue (value) {
    this.checkboxValue = value

  }
  getCheckUnitTextVale () {
    return this.checkboxValue
  }
  constructor (private _basesService: BaseServices) {
  }

  getUnitDetail (queryParams) {
    return this._basesService.getRequest(ApiConstant.GET_UNIT_DETAIL + queryParams)
  }

  getUnit (id) {
    return this._basesService.getRequest(ApiConstant.GET_UNIT_BY_ID + id)
  }

  public addUnit (parmas) {
    return this._basesService.postRequest(ApiConstant.ADD_UNIT_URL, parmas)
  }

  public delteUnit (id) {
    return this._basesService.deleteRequest(ApiConstant.ADD_UNIT_URL + '?id=' + id)
  }

  public getUnitType (type) {
    return this._basesService.getRequest(ApiConstant.GET_UNIT_BY_TYPE + type)
  }

  public getSubUnits () {
    return this._basesService.getRequest(ApiConstant.GET__SUB_UNIT_DETAIL)
  }
}
