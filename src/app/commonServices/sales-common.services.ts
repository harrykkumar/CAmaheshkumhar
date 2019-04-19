import { Injectable } from '@angular/core'
import { BaseServices } from '../commonServices/base-services'
import { ApiConstant } from '../shared/constants/api'
@Injectable({
  providedIn: 'root'
})
export class SalesCommonServices {
  constructor (private _basesService: BaseServices) { }

  getPaymentModeDetail () {
    return this._basesService.getRequest(ApiConstant.PAYMENT_MODE_DETAIL_URL)
  }

  getPaymentLedgerDetail (id) {
    return this._basesService.getRequest(ApiConstant.LEDGER_DETAIL_URL + '?Glid=' + id)
  }

  getAllTaxType () {
    return this._basesService.getRequest(ApiConstant.GET_TAX_DETAIL_URL)
  }

  getTaxRates (id) {
    return this._basesService.getRequest(ApiConstant.GET_TAX_DETAIL_URL + '?Id=' + id)
  }

  getRouteFare (id) {
    return this._basesService.getRequest(ApiConstant.ITEM_MASTER_DETAIL_URL + '?Id=' + id)
  }

  dataObject = {}
  setDataObject (key,data) {
    this.dataObject[key] = data
  }
  getDataObject (key) {
    return this.dataObject[key]
  }
}
