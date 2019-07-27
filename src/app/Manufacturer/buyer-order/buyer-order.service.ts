import { ApiConstant } from './../../shared/constants/api';
import { BaseServices } from 'src/app/commonServices/base-services';
import { Injectable } from '@angular/core';
import * as _ from 'lodash'


@Injectable({
  providedIn: 'root'
})
export class BuyerOrderService {
  constructor(
    private baseService: BaseServices
  ) { }

  getUtilityItemList(){
    return this.baseService.getRequest(ApiConstant.SPUTILITY + 'buyerOrder')
  }

  getList(Data, key, title){
    const list = _.map(Data, (item) => {
      return {
        id: item.Id,
        text: item[key]
      }
    })
    return [{ id: 0, text: title }, ...list]
  }

  getGenderList() {
    return [
      { id: 0, text: 'Select Gender' },
      { id: 1, text: 'Male' },
      { id: 1, text: 'Female' }
    ]
  }

  postBuyerOrderData(Data){
    return this.baseService.postRequest(ApiConstant.BUYER_ORDER, Data)
  }

  getBuyerOrderList(data){
    return this.baseService.getRequest(`${ApiConstant.BUYER_ORDER}?Page=${data.Page}&Size=${data.Size}`)
  }
  getUnitAndRateByItemId(itemId) {
    return this.baseService.getRequest(ApiConstant.GET_ITEM__RATE_BY_ITEMID_CUSTOMERID_SETTING + itemId)
  }
}
