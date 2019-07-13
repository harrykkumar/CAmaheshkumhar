import { ApiConstant } from 'src/app/shared/constants/api';
import { BaseServices } from 'src/app/commonServices/base-services';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import * as _ from 'lodash'


@Injectable({
  providedIn: 'root'
})
export class ItemRequirementService {

  constructor(
    private baseService: BaseServices
  ) { }

  getItemRequirement() {
    return this.baseService.getRequest(ApiConstant.ITEM_REQUIREMENT).pipe(
      map((res: any) => {
        return {
          Items: _.map(res.Data.Items, (element) => {
            return {
              id: element.Id,
              text: element.Name,
              CategoryId: element.CategoryId
            }
          }),
          ItemCategorys: _.map(res.Data.ItemCategorys, (element) => {
            return {
              id: element.Id,
              text: element.Name
            }
          }),
          Attributes: res.Data.Attributes,
          AttributeValues: res.Data.AttributeValues,
          // SubUnits: _.map(res.Data.SubUnits, (element) => {
          //   return {
          //     id: element.Id,
          //     text: element.Name
          //   }
          // })
        }
      })
    )
  }

  postItemRequirementDat(data){
    return this.baseService.postRequest(ApiConstant.ITEM_REQUIRE_POST, data)
  }

  getInstructionListData(){
    return this.baseService.getRequest(ApiConstant.ITEM_REQ_INSTRUCTION).pipe(
      map((data: any) => {
        const list = _.map(data.Data, (element) => {
          return {
            id: element.Id,
            text: element.CommonDesc
          }
        })
        return [{ id: 0, text: 'Select Instructions' }, ...list]
      })
    ).toPromise();
  }

  getItemRequirementListData(data) {
    let url = ApiConstant.ITEM_REQUIRE_GET
    if (!_.isEmpty(data)) {
      url = `${ApiConstant.ITEM_REQUIRE_GET}?Page=${data.Page}&Size=${data.Size}`
    }
    return this.baseService.getRequest(url)
      .pipe(map((data: any) => data.Data))
      .toPromise()
  }

  getUnitByItemId(itemId) {
    return this.baseService.getRequest(ApiConstant.GET_ITEM__RATE_BY_ITEMID_CUSTOMERID_SETTING + itemId).
    pipe(
      map((data: any) => {
        const list = _.map(data.Data.SubUnitDetails, (element) => {
          return {
            id: element.Id,
            text: element.Name
          }
        })
        return [{ id: 0, text: 'Select Unit' }, ...list]
      })
    ).toPromise();
  }

  getItemDetailsById(data){
    return this.baseService.getRequest(`${ApiConstant.ITEM_REQUIRE_POST}?ParentId=${data.ParentId}&ParentTypeId=${data.ParentTypeId}`)
  }

  deleteItemRequirement(data){
    return this.baseService.deleteRequest(`${ApiConstant.ITEM_REQUIRE_POST}?ParentId=${data.ParentId}&ParentTypeId=${data.ParentTypeId}`)
  }
}
