import { Injectable } from '@angular/core'
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { BaseServices } from '../../commonServices/base-services'
import { ApiConstant } from 'src/app/shared/constants/api'
import { Select2OptionData } from 'ng2-select2';
import { UIConstant } from '../../shared/constants/ui-constant';
@Injectable()
export class SaleTravelServices {
  private queryStrSub = new Subject<string>()
  public queryStr$ = this.queryStrSub.asObservable()
  private supplierListSub = new Subject<Array<Select2OptionData>[]>()
  public supplierList$ = this.supplierListSub.asObservable()
  private routeListSub = new Subject<Array<Select2OptionData>[]>()
  public routeList$ = this.routeListSub.asObservable()
  private clientListSub = new Subject<Array<Select2OptionData>[]>()
  public clientList$ = this.clientListSub.asObservable()
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

  setSearchQueryParamsStr (str) {
    this.queryStrSub.next(str)
  }

  createRouteList (list) {
    let newData: Array<Select2OptionData> = [
      { id: '0', text: 'Select Route' },
      { id: '-1', text: UIConstant.ADD_NEW_OPTION }
    ]
    list.forEach(element => {
      newData.push({
        id: element.Id,
        text: element.Name
      })
    });
    this.routeListSub.next(list)
  }

  createSupplierList (list) {
    let newData: Array<Select2OptionData> = [
      { id: '0', text: 'Select Suppliers' },
      { id: '-1', text: UIConstant.ADD_NEW_OPTION }
    ]
    list.forEach(element => {
      newData.push({
        id: element.Id,
        text: element.Name
      })
    });
    this.supplierListSub.next(list)
  }

  setLedgerList (list) {
    list.splice(1, 0, { id: '-1', text: UIConstant.THOUSAND })
    this.clientListSub.next(list)
  }
}
