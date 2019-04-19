import { Injectable } from '@angular/core'
import { BaseServices } from '../commonServices/base-services'
import { ApiConstant } from '../shared/constants/api'
@Injectable()
export class SalesCourierLocalServices {
  constructor (private _basesService: BaseServices) { }

  printSCourierSale (id) {
    return this._basesService.getRequest(ApiConstant.SALE_PRINT_COURIER_DETAILS_DATA + id)
  }

  postLocalCourier (obj) {
    return this._basesService.postRequest(ApiConstant.SALE_TOURISM_DETAIL_URL, obj)
  }
}
