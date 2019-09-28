import { Injectable } from '@angular/core';
import { BaseServices } from '../../commonServices/base-services';
import { GlobalService } from '../../commonServices/global.service';
import { ApiConstant } from '../../shared/constants/api';
import { Subject } from 'rxjs/internal/Subject';
@Injectable({
  providedIn: 'root'
})
export class CustomRateService {
  unitSub = new Subject()
  unit$ = this.unitSub.asObservable()
  constructor (private baseService: BaseServices, private gs: GlobalService) {
  }

  getCustomRateList () {
    return this.gs.manipulateResponse(this.baseService.getRequest(ApiConstant.CUSTOM_RATE))
  }

  postCustomRate (obj) {
    return this.gs.manipulateResponse(this.baseService.postRequest(ApiConstant.CUSTOM_RATE, obj))
  }

  returnUnits (units, types) {
    let newData = [{id: '0', text: 'Select Type'}]
    types.forEach(element => {
      newData.push({
        id: element.Id,
        text: element.CommonDesc
      })
    })
    const results = this.reduceArr(units)
    this.unitSub.next({units: results, types: newData})
  }

  reduceArr (units) {
    let results = units.reduce((results, unit) => {
      (results[unit.Id] = results[unit.Id] || []).push(unit);
      return results;
    }, {})
    return results
  }

  reduceCustomerArr (arr) {
    let results = arr.reduce((results, item) => {
      (results[item.ItemId] = results[item.ItemId] || []).push(item);
      return results;
    }, {})
    return results
  }
}