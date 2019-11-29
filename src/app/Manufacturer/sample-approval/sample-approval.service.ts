import { ApiConstant } from './../../shared/constants/api';
import { BaseServices } from 'src/app/commonServices/base-services';
import { Injectable } from '@angular/core';
import * as _ from 'lodash'
import { UIConstant } from 'src/app/shared/constants/ui-constant';
import { GlobalService } from '../../commonServices/global.service';
import { Subject } from 'rxjs/internal/Subject';
import { AddCust } from '../../model/sales-tracker.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SampleApprovalService {
  private select2ArrSub = new Subject()
  select2List$ = this.select2ArrSub.asObservable()
  private queryStrSub = new Subject<string>()
  public queryStr$ = this.queryStrSub.asObservable()
  private openSampleSub = new BehaviorSubject<AddCust>({ 'open': false })
  openSample$ = this.openSampleSub.asObservable()
  constructor(private baseService: BaseServices, private _gs: GlobalService) { }

  getSampleApprovalList(query){
    return this._gs.manipulateResponse(this.baseService.getRequest(`${ApiConstant.SAMPLING_GET}` + query));
  }

  postSampleApprovalFormData(data) {
    return this.baseService.postRequest(ApiConstant.SAMPLING_GET, data)
  }

  getStyleList () {
    return this._gs.manipulateResponse(this.baseService.getRequest(ApiConstant.SAMPLE_STYLE))
  }

  getShipmentByList () {
    return this._gs.manipulateResponse(this.baseService.getRequest(ApiConstant.PARCEL_PROVIDER_URL))
  }

  getStageList () {
    return this._gs.manipulateResponse(this.baseService.getRequest(ApiConstant.SAMPLE_STAGE_URL))
  }

  getList(data, key, title){
    const list = _.map(data, (item) => {
      return {
        id: item.Id,
        text: item[key]
      }
    })
    this.select2ArrSub.next({data: [{ id: 0, text: 'Select ' + title }, {id: -1, text: UIConstant.ADD_NEW_OPTION}, ...list], title: title})
  }

  setSearchQueryParamsStr (str) {
    this.queryStrSub.next(str)
  }

  private onSampleAddSub = new Subject()
  sampleAdded$ = this.onSampleAddSub.asObservable()
  
  onSampleAdd () {
    this.onSampleAddSub.next()
  }

  openSample (id) {
    this.openSampleSub.next({ 'open': true, editId: id })
  }

  closeSample () {
    this.openSampleSub.next({ 'open': false })
  }

  getSampleEditData (id) {
    return this._gs.manipulateResponse(this.baseService.getRequest(ApiConstant.EDIT_SAMPLE_DATA + id))
  }

  getStatusList () {
    return this._gs.manipulateResponse(this.baseService.getRequest(ApiConstant.COUNTRY_LIST_URL + 192))
  }

  deleteSample(id) {
    return this._gs.manipulateResponse(this.baseService.deleteRequest(ApiConstant.DELETE_SAMPLE + id))
  }
}
