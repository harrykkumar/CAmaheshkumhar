import { ApiConstant } from 'src/app/shared/constants/api';
import { BaseServices } from 'src/app/commonServices/base-services';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import * as _ from 'lodash'
import { GlobalService } from '../../commonServices/global.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemRequirementService {
  private select2ArrSub = new Subject()
  select2List$ = this.select2ArrSub.asObservable()
  private attrSub = new Subject()
  attr$ = this.attrSub.asObservable()
  private formReadySub = new Subject()
  formReady$ = this.formReadySub.asObservable()
  constructor(
    private baseService: BaseServices, private _gs: GlobalService
  ) { }

  getItemList() {
    return this._gs.manipulateResponse(this.baseService.getRequest(ApiConstant.ITEM_MASTER_DETAIL_URL))
  }
  
  getStyleList(itemId) {
    return this._gs.manipulateResponse(this.baseService.getRequest(ApiConstant.SAMPLE_STYLE + '?ItemId=' + itemId ))
  }

  getItemRequirement() {
    return this._gs.manipulateResponse(this.baseService.getRequest(ApiConstant.ITEM_REQUIREMENT))
  }

  postItemRequirementDat(data){
    return this._gs.manipulateResponse(this.baseService.postRequest(ApiConstant.ITEM_REQUIRE_POST, data))
  }

  getItemRequirementData(query){
    return this._gs.manipulateResponse(this.baseService.getRequest(ApiConstant.ITEM_REQUIRE_POST + query))
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

  // getItemRequirementListData(data) {
  //   let url = ApiConstant.ITEM_REQUIRE_GET
  //   if (!_.isEmpty(data)) {
  //     url = `${ApiConstant.ITEM_REQUIRE_GET}?Page=${data.Page}&Size=${data.Size}`
  //   }
  //   return this.baseService.getRequest(url)
  //     .pipe(map((data: any) => data.Data))
  //     .toPromise()
  // }

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
    return this.baseService.deleteRequest(`${ApiConstant.ITEM_REQUIRE_POST}?ParentId=${data.ReqNo}&ParentTypeId=${data.ParentTypeId}`)
  }

  getSelect2Arr(data, key, title, id?) {
    let Id = 'Id'
    if (id) {
      Id = id
    }
    const list = _.map(data, (item) => {
      return {
        id: item[Id],
        text: item[key]
      }
    })
    this.select2ArrSub.next({data: [{ id: 0, text: 'Select ' + title }, ...list], title: title})
  }

  generateAttrs (AttributeValues) {
    return _.groupBy(AttributeValues, element => element.AttributeId)
  }

  checkForAttrsCombos (obj, defaultAttrId) {
    let defaultMesAttrs = []
    let generateCasesForIds = []
    let generateCasesForText = []
    if (defaultAttrId > 0) {
      for (const attrId in obj) {
        if (+attrId === defaultAttrId) {
          defaultMesAttrs = JSON.parse(JSON.stringify(obj[attrId]))
          delete obj[attrId]
          break;
        }
      }
    }
    if (!_.isEmpty(obj)) {
      for (const attrId in obj) {
        const Ids = _.map(obj[attrId], element => {
          return element.Id
        })
        const texts = _.map(obj[attrId], element => {
          return element.Name
        })
        generateCasesForIds.push(Ids)
        generateCasesForText.push(texts)
      }
      const ids = this._gs.allPossibleCases(generateCasesForIds)
      const text = this._gs.allPossibleCases(generateCasesForText)
      let newData = []
      ids.forEach((element, index) => {
        newData.push({
          id: element,
          text: text[index]
        })
      })
      this.attrSub.next({default: defaultMesAttrs, combos: [{id: 0, text: 'Select Attribute'}, ...newData]})
    }
  }

  getItemDetail(itemId) {
    return this._gs.manipulateResponse(this.baseService.getRequest(ApiConstant.GET_ITEM__RATE_BY_ITEMID_CUSTOMERID_SETTING + itemId))
  }

  onFormReady() {
    this.formReadySub.next()
  }

  private queryStrSub = new Subject<string>()
  public queryStr$ = this.queryStrSub.asObservable()
  setSearchQueryParamsStr (str) {
    this.queryStrSub.next(str)
  }

  editItemReq(id) {
    return this._gs.manipulateResponse(this.baseService.getRequest(ApiConstant.EDIT_MATERIAL_REQUIREMENT + id))
  }

  printInvoice(id) {
    return this._gs.manipulateResponse(this.baseService.getRequest(ApiConstant.MATERIAL_REQ_PRINT + id))
  }
}
