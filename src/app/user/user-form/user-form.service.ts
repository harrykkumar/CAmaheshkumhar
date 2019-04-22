import { Injectable } from '@angular/core'
import { BaseServices } from '../../commonServices/base-services'
import { ApiConstant } from '../../shared/constants/api'

@Injectable({
  providedIn: 'root'
})
export class UserFormService {
  constructor (private _baseService: BaseServices) { }

  /* Function to get the client list */
  getClientList = () => {
    const url = `${ApiConstant.USER_CLIENT}`
    return this._baseService.getRequest(url)
  }

  /* Function to get the branch list */
  getBranchList = (id) => {
    const url = `${ApiConstant.BRANCH_OFFICE_LIST_URL}?RequestClientId=${id}`
    return this._baseService.getRequest(url)
  }

  /* Function to get the office list */
  getOfficeList = (id) => {
    const url = `${ApiConstant.USER_OFFICE}?BranchId=${id}`
    return this._baseService.getRequest(url)
  }

  /* Function to get the user type list */
  getUserTypeList = () => {
    const url = `${ApiConstant.USER_TYPE}`
    return this._baseService.getRequest(url)
  }

  /* Function to get the under type list */
  getUnderTypeList = (id) => {
    const url = `${ApiConstant.USER_TYPE}?IndexId=${id}`
    return this._baseService.getRequest(url)
  }

  /* Function to get the under user list */
  getUnderUserList = (id) => {
    const url = `${ApiConstant.CREATE_USER}?UserTypeId=${id}`
    return this._baseService.getRequest(url)
  }

  /* Function to post user data */
  createUser = (data) => {
    return this._baseService.postRequest(ApiConstant.CREATE_USER, data)
  }

  /* Function to get user data */
  getUserDetails = (id) => {
    const url = `${ApiConstant.CREATE_USER}?Id=${id}`
    return this._baseService.getRequest(url)
  }

  /* Function to get user list */
  getUserListData = () => {
    return this._baseService.getRequest(ApiConstant.CREATE_USER)
  }

  /* Function to get user type data */
  getUserTypeData = (id) => {
    const url = `${ApiConstant.USER_TYPE}?Id=${id}`
    return this._baseService.getRequest(url)
  }

  /* Function to post user type form data */
  postUserTypeFormData = (data) => {
    return this._baseService.postRequest(ApiConstant.USER_TYPE, data)
  }

  /* Function to post user permissions  */
  postUserPermissions = (data) => {
    return this._baseService.postRequest(ApiConstant.USER_PERMISSION, data)
  }
}
