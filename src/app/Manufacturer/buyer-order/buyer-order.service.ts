import { ApiConstant } from './../../shared/constants/api';
import { BaseServices } from 'src/app/commonServices/base-services';
import { Injectable } from '@angular/core';
import * as _ from 'lodash'
import { GlobalService } from '../../commonServices/global.service';
import { UIConstant } from '../../shared/constants/ui-constant';
import { Select2OptionData } from 'ng2-select2';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BuyerOrderService {
  addressData = new Subject<{data: Array<Select2OptionData>}>()
  addressData$ = this.addressData.asObservable()
  private select2ArrSub = new Subject()
  select2List$ = this.select2ArrSub.asObservable()
  private attrSub = new Subject()
  attr$ = this.attrSub.asObservable()
  private queryStrSub = new Subject<string>()
  public queryStr$ = this.queryStrSub.asObservable()
  constructor(
    private baseService: BaseServices,
    private gs: GlobalService
  ) { }


  
  getList(data, key, title, id?){
    let id1 = 'Id'
    if (id) {
      id1 = id
    }
    const list = _.map(data, (item) => {
      return {
        id: item[id1],
        text: item[key]
      }
    })
    this.select2ArrSub.next({data: [{ id: 0, text: 'Select ' + title }, {id: -1, text: UIConstant.ADD_NEW_OPTION}, ...list], title: title})
  }

  getUtilityItemList(){
    return this.baseService.getRequest(ApiConstant.SPUTILITY + 'buyerOrder')
  }

  getAttr(data) {
    const defaultAttrIndex = _.findIndex(data.AttributeValueResponses, {IsRequired : true})
    console.log(defaultAttrIndex)
    const defaultAttr = JSON.parse(JSON.stringify(data.AttributeValueResponses[defaultAttrIndex]))
    const list = _.map(data.AttributeValueResponses[defaultAttrIndex].AttributeValuesResponse, (item) => {
      return {
        id: item['Id'],
        text: item['Name']
      }
    })
    const defaultList = {
      Name: defaultAttr.Name,
      values: [...list]
    }
    const listCopy = JSON.parse(JSON.stringify(defaultList))
    data.AttributeValueResponses.splice(defaultAttrIndex, 1)
    const list1 = _.map(data.AttributeValueResponses, (element) => {
      const valueList = _.map((element.AttributeValuesResponse), (attributeValue) => {
        return {
          id: attributeValue.Id,
          text: attributeValue.Name
        }
      })
      return {
        Name: element.Name,
        values: [...valueList]
      }
    })
    this.attrSub.next({defaults: listCopy, combos: list1})
  }

  getGenderList() {
    return [
      { id: 0, text: 'Select Gender' },
      { id: 1, text: 'Male' },
      { id: 1, text: 'Female' }
    ]
  }

  postBuyerOrderData(Data){
    return this.gs.manipulateResponse(this.baseService.postRequest(ApiConstant.BUYER_ORDER, Data))
  }

  getBuyerOrderData(id){
    return this.gs.manipulateResponse(this.baseService.getRequest(`${ApiConstant.EDIT_BUYER_ORDER}?Id=${id}`))
  }

  getBuyerOrderList(data){
    return this.gs.manipulateResponse(this.baseService.getRequest(`${ApiConstant.BUYER_ORDER}?Page=${data.Page}&Size=${data.Size}`))
  }
  getUnitAndRateByItemId(itemId) {
    return this.baseService.getRequest(ApiConstant.GET_ITEM__RATE_BY_ITEMID_CUSTOMERID_SETTING + itemId)
  }

  getNewBillNo (date, type,FormType) {
    let queryString = ''
    if (type === 1) {
      queryString = 'TransactionType=' + FormType+ '&TransDate=' + date
      return this.baseService.getRequest(ApiConstant.GET_NEW_BILL_NO_AUTO + queryString)
    } else if (type === 2) {
      queryString = 'Type=' + FormType+ '&BillDate=' + date
      return this.baseService.getRequest(ApiConstant.GET_NEW_BILL_NO_MANUAL + queryString)
    }
  }

  getAllAddresses (id) {
    return this.gs.manipulateResponse(this.baseService.getRequest(ApiConstant.GET_ADDRESS_OF_VENDOR + id))
  }

  createAddress (array) {
    let newData = [{ id: '0', text: 'Select Address' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
    array.forEach(address => {
      let addressValue = this.getAddress(address)
      newData.push({
        id: address.Id,
        text: addressValue
      })
    })
    this.addressData.next({ 'data': newData })
  }

  getAddress (address) {
    return address.AddressTypeName + ' - ' + address.AddressValue
    + ' ' + ((typeof (address.AreaName) === 'object' || address.AreaName === '' || typeof (address.AreaName) === 'undefined') ? '' : address.AreaName)
    + ' ' + ((typeof (address.CityName) === 'object' || address.CityName === '' || typeof (address.CityName) === 'undefined') ? '' : address.CityName)
    + ' ' + ((typeof (address.StateName) === 'object' || address.StateName === '' || typeof (address.StateName) === 'undefined') ? '' : address.StateName)
    + ' ' + ((typeof (address.CountryName) === 'object' || address.CountryName === '' || typeof (address.CountryName) === 'undefined') ? '' : address.CountryName)
    + ' ' + ((typeof (address.PostCode) === 'object' || address.PostCode === '' || typeof (address.PostCode) === 'undefined') ? '' : address.PostCode)
  }

  getSetTypeData () {
    return this.gs.manipulateResponse(this.baseService.getRequest(ApiConstant.COUNTRY_LIST_URL + 186))
  }

  setSearchQueryParamsStr (str) {
    this.queryStrSub.next(str)
  }

  getBuyerListOnSearch (queryParams) {
    return this.gs.manipulateResponse(this.baseService.getRequest(ApiConstant.BUYER_ORDER + queryParams))
  }

  getStatusList () {
    return this.gs.manipulateResponse(this.baseService.getRequest(ApiConstant.COUNTRY_LIST_URL + 195))
  }

  deleteBO (id) {
    return this.gs.manipulateResponse(this.baseService.deleteRequest(ApiConstant.BUYER_ORDER + '?Id=' + id))
  }

  printInvoice (id) {
    return this.gs.manipulateResponse(this.baseService.getRequest(ApiConstant.PRINT_BUYER_ORDER + id))
  }

  printPOInvoice(orderId) {
    return this.gs.manipulateResponse(this.baseService.getRequest(ApiConstant.PRINT_ALL_PACKAGING_ORDER + orderId))
  }
}
