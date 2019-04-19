import { Injectable } from '@angular/core'
import { BaseServices } from '../../commonServices/base-services'
import { ApiConstant } from '../../shared/constants/api'

@Injectable()
export class SaleTravelReturnServices {
  constructor (private _basesService: BaseServices) { }

  getSaleReturnList () {
    return this._basesService.getRequest(ApiConstant.GET_SALE_RETURN_LIST)
  }

  getSaleTravelReturnPrint (id) {
    return this._basesService.getRequest(ApiConstant.SALE_TRAVEL_RETURN_PRINT + id)
  }
}
