import { Injectable } from '@angular/core'
import { ApiConstant } from '../../shared/constants/api'
import { Subject, Observable, BehaviorSubject } from 'rxjs'
import { BaseServices } from '../base-services'
@Injectable({
  providedIn: 'root'
})
export class VendorServices {

  private _listners = new Subject<any>()

  listen (): Observable<any> {
    return this._listners.asObservable()
  }

  filter (filterBy: string) {
    this._listners.next(filterBy)
  }

  constructor (private _baseServices: BaseServices) { }

  getVendor (id, queryParams) {
    return this._baseServices.getRequest(ApiConstant.VENDOR_URL + '?GLID=' + id + queryParams)
  }

  addVendore (parmas) {
    return this._baseServices.postRequest(ApiConstant.VENDOR_URL, parmas)
  }

  getCommonValues (id) {
    return this._baseServices.getRequest(ApiConstant.COUNTRY_LIST_URL + id)
  }

  gatStateList (id) {
    return this._baseServices.getRequest(ApiConstant.GET_STATE_LIST_URL + id)
  }

  getCityList (id) {
    return this._baseServices.getRequest(ApiConstant.CITY_LIST_URL + id)
  }

  getAreaList (id) {
    return this._baseServices.getRequest(ApiConstant.AREA_LIST_URL + id)
  }

  editvendor (id) {
    return this._baseServices.getRequest(ApiConstant.EDIT_LEDGER_BY_ID_URL + id)
  }

  delteVendor (id) {
    return this._baseServices.deleteRequest(ApiConstant.VENDOR_URL + '?id=' + id)
  }

  private sendVendorAddData = new BehaviorSubject<any>([])
  getvenderData = this.sendVendorAddData.asObservable()

  sendDataWithObservable (e) {
    this.sendVendorAddData.next(e)
  }

  private sendVendorEditData = new BehaviorSubject<any>([])

  getEditVenderData () {
    return this.sendVendorEditData.asObservable()
  }

  sendEditVendoWithObservable (e) {
    this.sendVendorEditData.next(e)
  }
  private sendCustomerData = new BehaviorSubject<any>([])
  getCustomerData = this.sendCustomerData.asObservable()

  sendCustomerDataObservable (e) {
    this.sendCustomerData.next(e)
  }
}
