import { Injectable } from '@angular/core'
import { BaseServices } from '../commonServices/base-services'
import { ApiConstant } from '../shared/constants/api'
@Injectable()
export class SalesCourierParcelServices {
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
}
