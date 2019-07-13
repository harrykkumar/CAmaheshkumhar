import { ApiConstant } from './../../shared/constants/api';
import { BaseServices } from 'src/app/commonServices/base-services';
import { Injectable } from '@angular/core';

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
}
