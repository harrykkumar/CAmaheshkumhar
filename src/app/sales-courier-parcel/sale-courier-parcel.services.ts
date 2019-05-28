import { Injectable } from '@angular/core'
import { BaseServices } from '../commonServices/base-services'
import { ApiConstant } from '../shared/constants/api'
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SalesCourierParcelServices {

  sendersListSub = new Subject<any>()
  recieversListSub = new Subject<any>()
  parcelByListSub = new Subject<any>()
  destinationsListSub = new Subject<any>()
  destinationsList$ = this.destinationsListSub.asObservable()
  sendersList$ = this.sendersListSub.asObservable()
  parcelByList$ = this.parcelByListSub.asObservable()
  recieversList$ = this.recieversListSub.asObservable()
  private queryStrSub = new Subject<string>()
  public queryStr$ = this.queryStrSub.asObservable()
  constructor (private _basesService: BaseServices) { }

  postCourierParcelDetails (obj) {
    return this._basesService.postRequest(ApiConstant.SALE_COURIER_PARCEL_POST, obj)
  }

  getParcelByList () {
    return this._basesService.getRequest(ApiConstant.PARCEL_PROVIDER_URL)
  }

  printSCourierParcelSale (id) {
    return this._basesService.getRequest(ApiConstant.SALE_PRINT_COURIER_PARCEL_DATA_BY_ID + id)
  }

  getCourierEditData (id) {
    return this._basesService.getRequest(ApiConstant.SALE_COURIER_PARCEL_EDIT_DATA + id)
  }

  getSaleList (queryParams) {
    return this._basesService.getRequest(ApiConstant.GET_SALE_COURIER_LIST + queryParams)
  }

  getEditSaleData (id) {
    return this._basesService.getRequest(ApiConstant.EDIT_SALE_COURIER + id)
  }

  setSendersList (list) {
    this.sendersListSub.next(list)
  }

  setRecieversList (list) {
    this.recieversListSub.next(list)
  }

  setParcelByList (list) {
    this.parcelByListSub.next(list)
  }

  setDestinationsList (list) {
    this.destinationsListSub.next(list)
  }

  
  setSearchQueryParamsStr (str) {
    this.queryStrSub.next(str)
  }
}
