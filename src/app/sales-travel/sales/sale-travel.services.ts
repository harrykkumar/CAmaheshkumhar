import { Injectable } from '@angular/core'
import { Observable, BehaviorSubject } from 'rxjs'
import { BaseServices } from '../../commonServices/base-services'
import { ApiConstant } from 'src/app/shared/constants/api'
@Injectable()
export class SaleTravelServices {
  constructor (private _basesService: BaseServices) { }

  public importExportSale (params: any): Observable<any> {
    return this._basesService.postRequest(ApiConstant.IMPORT_EXPORT_SALE_TRAVEL_URL, params)
  }

  getRouteFare (id) {
    return this._basesService.getRequest(ApiConstant.ITEM_MASTER_DETAIL_URL + '?Id=' + id)
  }

  postTravelDetails (obj) {
    return this._basesService.postRequest(ApiConstant.SALE_TRVEL_DETAIL_URL, obj)
  }

  postTourismDetails (obj) {
    return this._basesService.postRequest(ApiConstant.SALE_TOURISM_DETAIL_URL, obj)
  }

  // code print
  printScreenForSale (id) {
    return this._basesService.getRequest(ApiConstant.SALE_PRINT_DETAILS_DATA + id)
  }

  private salesPrintData = new BehaviorSubject<any>({})
  salesPrint = this.salesPrintData.asObservable()

  sendSalesPrintData (e) {
    this.salesPrintData.next(e)
  }

  getSaleTravelEditData (id) {
    return this._basesService.getRequest(ApiConstant.SALE_TRAVEL_EDIT_DATA + id)
  }

  postSaleReturn (obj) {
    return this._basesService.postRequest(ApiConstant.POST_SALE_RETURN, obj)
  }
}
