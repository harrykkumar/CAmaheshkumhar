import { Injectable } from '@angular/core'
import { ApiConstant } from '../../shared/constants/api'
import { BaseServices } from '../base-services'

@Injectable({
  providedIn: 'root'
})
export class TaxMasterService {

  constructor (private _basesService: BaseServices) {
  }

  getTaxDetail (queryParams) {
    return this._basesService.getRequest(ApiConstant.GET_TAX_DETAIL_URL + queryParams)
  }

  deleteTax (id) {
    return this._basesService.deleteRequest(ApiConstant.GET_TAX_DETAIL_URL + '?id=' + id)
  }

  addTax (params) {
    return this._basesService.postRequest(ApiConstant.GET_TAX_DETAIL_URL, params)
  }
  editTax (id) {
    return this._basesService.getRequest(ApiConstant.EDIT_TAX_BY_ID_URL + id )
  }
  getTaxSalbName(uid){
    return this._basesService.getRequest(ApiConstant.GET_TAX_SLAB_NAME_URL+uid);
  }
  getTaxTypeName(){
    return this._basesService.getRequest(ApiConstant.GET_TAXTYPE_NAME);
  }
}
