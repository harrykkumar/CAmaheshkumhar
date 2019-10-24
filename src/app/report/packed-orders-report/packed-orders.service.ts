import { Injectable } from "@angular/core";
import { BaseServices } from '../../commonServices/base-services';
import { GlobalService } from '../../commonServices/global.service';
import { ApiConstant } from "src/app/shared/constants/api";
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class PackedOrdersService {
  private queryStrSub = new Subject<string>()
  public queryStr$ = this.queryStrSub.asObservable()
  private searchSub = new Subject<string>()
  public search$ = this.searchSub.asObservable()
  constructor (private _bs: BaseServices, private _gs: GlobalService) {}

  getPackedOrderList(type) {
    return this._gs.manipulateResponse(this._bs.getRequest(`${ApiConstant.GET_ORDER_DATA_BY_TYPE}${type}`))
  }

  setSearchQueryParamsStr (str) {
    this.queryStrSub.next(str)
  }

  onTextEntered (str) {
    this.searchSub.next(str)
  }

  getItems () {
    return this._gs.manipulateResponse(this._bs.getRequest(`${ApiConstant.ITEM_MASTER_DETAIL_URL}`))
  }
}