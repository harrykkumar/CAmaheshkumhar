import { UIConstant } from 'src/app/shared/constants/ui-constant';
import { ApiConstant } from 'src/app/shared/constants/api';
import { BaseServices } from 'src/app/commonServices/base-services';
import { Injectable } from '@angular/core';
import * as _ from 'lodash'
import { map } from 'rxjs/operators';
import { GlobalService } from '../../commonServices/global.service';

@Injectable({
  providedIn: 'root'
})
export class StyleService {

  constructor(private baseService: BaseServices, private _gs: GlobalService) { }

   
  getStyleNumberListData(data?){
    let url = ApiConstant.SAMPLE_STYLE
    if (!_.isEmpty(data)) {
      url = `${ApiConstant.SAMPLE_STYLE}?Page=${data.Page}&Size=${data.Size}`
    }
    return this.baseService.getRequest(url).
    pipe( map((data: any) => {
      const list = _.map(data.Data, (element) => {
        return {
          id: element.Id,
          text: element.Name,
          Name: element.Name,
          Code: element.Code,
          Id: element.Id,
          Remark: element.Remark,
          TotalRows: element.TotalRows
        }
      })
      return [{ id: UIConstant.ZERO, text: 'Select Style Number' }, ...list]
    })
  ).toPromise();
  }

  postStyleFormData(data){
    return this._gs.manipulateResponse(this.baseService.postRequest(ApiConstant.SAMPLE_STYLE, data))
  }

  deleteStyle(id){
    return this.baseService.deleteRequest(`${ApiConstant.SAMPLE_STYLE}?Id=${id}`)
  }
}
