import { BaseServices } from './../../commonServices/base-services'
import { Injectable } from '@angular/core'
import { ApiConstant } from '../../shared/constants/api'
import { HttpClient } from '@angular/common/http'
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ActiveInventoryService {
  deleteParentSub = new Subject<boolean>()
  deleteParent$ = this.deleteParentSub.asObservable()
  parentAttrAddSub = new Subject()
  parentAttrAdd$ = this.parentAttrAddSub.asObservable()
  constructor (private _http: HttpClient, private baseService: BaseServices) {
  }

  onDeleteStatus (status) {
    this.deleteParentSub.next(status)
  }

  onParentAttrAdd () {
    this.parentAttrAddSub.next()
  }

  postActiveCategory = (data) => {
    return this.baseService.postRequest(ApiConstant.ACTIVE_INVENTORY_ADD_NAME_URL, data)
  }
  
  postActiveInventoryValue = (data) => {
    return this.baseService.postRequest(ApiConstant.POST_ACTIVE_INVENTORY_TERMURL, data)
  }
  
  getActiveCategoryName = () => {
    return this.baseService.getRequest(ApiConstant.ACTIVE_INVENTORY_ADD_NAME_URL)
  }
  editActiveCategoryName = (id) => {
    return this.baseService.getRequest(ApiConstant.ACTIVE_INVENTORY_ADD_NAME_URL+'?id=' +id)
  }

  editTermsForInventory = (id) => {
    return this.baseService.getRequest(ApiConstant.POST_ACTIVE_INVENTORY_TERMURL +'?id=' +id)
  }
  getActiveInvTypeList = () => {
    return this.baseService.getRequest(ApiConstant.GET_TYPE_ACVTIVE_INVE_URL)
  }


  getActiveInventoryWithTermList = (queryParams) => {
    return this.baseService.getRequest(ApiConstant.POST_ACTIVE_INVENTORY_TERMURL + queryParams)
  }

  deleteActiveInventory = (deletedId) => {
    return this.baseService.deleteRequest(ApiConstant.POST_ACTIVE_INVENTORY_TERMURL+'?id=' + deletedId)
  }

  deleteParentActive = (deletedId) => {
    return this.baseService.deleteRequest(ApiConstant.ACTIVE_INVENTORY_ADD_NAME_URL+'?id=' + deletedId)
  }

  getAttributeListBySearhFilter = (data) => {
    return this.baseService.getRequest(ApiConstant.ATTRIBUTE_SEARCH_URL + data)
  }

  getParentActiveList = () => {
    return this.baseService.getRequest(ApiConstant.ACTIVE_INVENTORY_ADD_NAME_URL)
  }
}
