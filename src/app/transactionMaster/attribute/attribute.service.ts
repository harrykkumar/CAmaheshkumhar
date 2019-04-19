import { BaseServices } from './../../commonServices/base-services'
import { Injectable } from '@angular/core'
import { ApiConstant } from '../../shared/constants/api'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})

export class AttributeService {
  constructor (private _http: HttpClient, private baseService: BaseServices) {
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

  getAttributeList = () => {
    return this.baseService.getRequest(ApiConstant.ATTRIBUTE_VALUE_URL)
  }

  deleteAttribute = (deletedId) => {
    return this.baseService.deleteRequest(ApiConstant.DELETE_ATTRIBUTE_URL + deletedId)
  }

  getAttributeListBySearhFilter = (data) => {
    return this.baseService.getRequest(ApiConstant.ATTRIBUTE_SEARCH_URL + data)
  }
}
