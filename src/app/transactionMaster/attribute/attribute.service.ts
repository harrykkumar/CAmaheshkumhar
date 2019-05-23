import { BaseServices } from './../../commonServices/base-services'
import { Injectable } from '@angular/core'
import { ApiConstant } from '../../shared/constants/api'
import { HttpClient } from '@angular/common/http'
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AttributeService {
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

  postAttribute = (data) => {
    return this.baseService.postRequest(ApiConstant.ATTRIBUTE_NAME_URL, data)
  }

  postAttributeValue = (data) => {
    return this.baseService.postRequest(ApiConstant.ATTRIBUTE_VALUE_URL, data)
  }

  getAttributeName = () => {
    return this.baseService.getRequest(ApiConstant.ATTRIBUTE_NAME_URL)
  }

  getAttributeList = (queryParams) => {
    return this.baseService.getRequest(ApiConstant.ATTRIBUTE_VALUE_URL + queryParams)
  }

  deleteAttribute = (deletedId) => {
    return this.baseService.deleteRequest(ApiConstant.DELETE_ATTRIBUTE_URL + deletedId)
  }

  deleteParentAttribute = (deletedId) => {
    return this.baseService.deleteRequest(ApiConstant.GET_PARENT_ATTRIBUTES_BY_ID + deletedId)
  }

  getAttributeListBySearhFilter = (data) => {
    return this.baseService.getRequest(ApiConstant.ATTRIBUTE_SEARCH_URL + data)
  }

  getParentAttributeList = () => {
    return this.baseService.getRequest(ApiConstant.GET_PARENT_ATTRIBUTES)
  }
}
