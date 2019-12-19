import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { BehaviorSubject } from 'rxjs';
import { AddCust } from '../model/sales-tracker.model';
import { GlobalService } from '../commonServices/global.service';
import { BaseServices } from '../commonServices/base-services';
import { MFApiConstant } from './mfApi';
@Injectable({ providedIn: 'root' })
export class ManufacturingService {
  private styleAddSub = new Subject()
  styleAdd$ = this.styleAddSub.asObservable()
  private openStyleSub = new BehaviorSubject<AddCust>({'open': false})
  openStyle$ = this.openStyleSub.asObservable()
  constructor(private _gs: GlobalService, private _bs: BaseServices) {}
  onStyleAdd () {
    this.styleAddSub.next()
  }

  openStyle(editData, isAddNew) {
    this.openStyleSub.next({ 'open': true, 'editData': editData, 'isAddNew': isAddNew })
  }

  closeStyle(newStyle?) {
    if (newStyle) {
      this.openStyleSub.next({ 'open': false, 'name': newStyle.name, 'id': newStyle.id })
    } else {
      this.openStyleSub.next({ 'open': false })
    }
  }

  private openOPSub = new BehaviorSubject<AddCust>({'open': false})
  openOP$ = this.openOPSub.asObservable()
  openOP(orderId, editId) {
    this.openOPSub.next({ 'open': true, 'id': orderId, 'editId': editId })
  }
  closeOP() {
    this.openOPSub.next({ 'open': false })
  }

  getItemRatesOfVendor(query) {
    return this._gs.manipulateResponse(this._bs.getRequest(MFApiConstant.VENDOR_STATUS_REPORT + query))
  }

  getBOStatusList(query) {
    return this._gs.manipulateResponse(this._bs.getRequest(MFApiConstant.VENDOR_STATUS_PO_REPORT + query))
  }

  private queryStrSub = new Subject<string>()
  public queryStr$ = this.queryStrSub.asObservable()
  setSearchQueryParamsStr (str) {
    this.queryStrSub.next(str)
  }
}