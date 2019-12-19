import { Injectable } from "@angular/core";
import { GlobalService } from '../commonServices/global.service';
import { BaseServices } from '../commonServices/base-services';
import { ApiConstant } from '../shared/constants/api';
import { Subject } from 'rxjs/internal/Subject';
@Injectable({
  providedIn: 'root'
})
export class ManualStockService {
  constructor (private _gs: GlobalService, private _bs: BaseServices) {}

  postManualStock(obj) {
    return this._gs.manipulateResponse(this._bs.postRequest(ApiConstant.MANUAL_STOCK_POST, obj))
  }

  getManualStock(query) {
    return this._gs.manipulateResponse(this._bs.getRequest(ApiConstant.MANUAL_STOCK_POST + '?' + query))
  }

  private queryStrSub = new Subject<string>()
  public queryStr$ = this.queryStrSub.asObservable()
  setSearchQueryParamsStr (str) {
    this.queryStrSub.next(str)
  }
}