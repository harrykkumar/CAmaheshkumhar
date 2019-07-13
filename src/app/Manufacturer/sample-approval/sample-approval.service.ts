import { ApiConstant } from './../../shared/constants/api';
import { BaseServices } from 'src/app/commonServices/base-services';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import * as _ from 'lodash'
import { UIConstant } from 'src/app/shared/constants/ui-constant';

@Injectable({
  providedIn: 'root'
})
export class SampleApprovalService {

  constructor(private baseService: BaseServices) { }

  getSampleApprovalList(data){
    const url = `${ApiConstant.SAMPLING_GET}?Page=${data.Page}&Size=${data.Size}`
    return this.baseService.getRequest(url);
  }

  getShipmentByListData(){
    return this.baseService.getRequest(ApiConstant.PARCEL_PROVIDER_URL).
    pipe( map((data: any) => {
      const list = _.map(data.Data, (element) => {
        return {
          id: element.Id,
          text: element.CommonDesc
        }
      })
      return [{ id: UIConstant.ZERO, text: 'Select Shipment By' }, ...list]
    })
  ).toPromise();
  }
 

  postSampleApprovalFormData(data) {
    return this.baseService.postRequest(ApiConstant.SAMPLING_GET, data)
  }
}
