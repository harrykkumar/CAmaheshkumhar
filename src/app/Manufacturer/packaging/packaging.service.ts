import { Injectable } from "@angular/core";
import { BaseServices } from '../../commonServices/base-services';
import { GlobalService } from '../../commonServices/global.service';
import { ApiConstant } from "src/app/shared/constants/api";
import * as _ from 'lodash';
import { Subject } from 'rxjs/internal/Subject';
import { Select2OptionData } from 'ng2-select2';
@Injectable({
  providedIn: 'root'
})
export class PackagingService {
  private combosSub = new Subject()
  combos$ = this.combosSub.asObservable()
  private openChallanSub = new Subject()
  openChallan$ = this.openChallanSub.asObservable()
  private challanAddedSub = new Subject()
  challanAdded$ = this.challanAddedSub.asObservable()
  constructor (private baseService: BaseServices, private gs: GlobalService) { }
  getItemList (id) {
    return this.gs.manipulateResponse(this.baseService.getRequest(`${ApiConstant.GET_ITEMS_IN_ORDER}?Id=${id}`))
  }

  getItemCombos(combos, items, bOrderId) {
    let itemSArr = []
    if (combos.length > 0) {
      _.forEach(items, (element, index) => {
        let obj = {}
        _.forEach(combos, (trans) => {
          if (element.Id === trans.ItemTransId) {
            if (trans.IsMeasurment) {
              obj['defaultAttrName'] = trans.AttributeValueName
              obj['defaultAttrId'] = trans.AttributeValueId
              obj['OrderQty'] = element.OrderQty
              obj['Id'] = 0
              obj['Sno'] = index + 1
              obj['itemName'] = element.ItemName
              obj['ItemId'] = element.ItemId
              obj['checked'] = false
              obj['Quantity'] = element.PackedQty
              obj['GroupId'] = element.GroupId
              obj['UnPackedQty'] = element.UnpackedQty
              obj['OrderPacketId'] = 0
              obj['BOTransId'] = element.Id
              obj['BorderId'] = bOrderId
              obj['Code'] = ''
              obj['ItemTransId'] = 0
            } else {
              obj['attributeValueId'] = (obj['attributeValueId']) ? obj['attributeValueId'] + '-' + trans.AttributeValueId : trans.AttributeValueId
              obj['attributeValueName'] = (obj['attributeValueName']) ? obj['attributeValueName'] + '-' + trans.AttributeValueName : trans.AttributeValueName
            }
          }
        })
        itemSArr.push({...obj})
      })
      this.combosSub.next({data: itemSArr})
    } else {
      _.forEach(items, (element, index) => {
        let obj = {}
        obj['OrderQty'] = element.OrderQty
        obj['Id'] = 0
        obj['Sno'] = index + 1
        obj['itemName'] = element.ItemName
        obj['ItemId'] = element.ItemId
        obj['checked'] = false
        obj['Quantity'] = element.PackedQty
        obj['GroupId'] = element.GroupId
        obj['UnPackedQty'] = element.UnpackedQty
        obj['OrderPacketId'] = 0
        obj['BOTransId'] = element.Id
        obj['BorderId'] = bOrderId
        obj['Code'] = ''
        obj['ItemTransId'] = 0
        itemSArr.push({...obj})
      })
      this.combosSub.next({data: itemSArr})
    }
  }

  getPCode () {
    return this.gs.manipulateResponse(this.baseService.getRequest(`${ApiConstant.GET_PACKET_CODE}`))
  }

  postData (obj) {
    return this.gs.manipulateResponse(this.baseService.postRequest(`${ApiConstant.POST_ORDER_PACKET}`, obj))
  }

  getPacketsList () {
    return this.gs.manipulateResponse(this.baseService.getRequest(`${ApiConstant.POST_ORDER_PACKET}`))
  }

  openChallan (data) {
    this.openChallanSub.next({open: true, data: data})
  }

  closeChallan () {
    this.openChallanSub.next({open: false})
  }

  getAddressTaxType (id) {
    return this.gs.manipulateResponse(this.baseService.getRequest(`${ApiConstant.GET_ADDRESS_TAX_TYPE}${id}`))
  }

  postPackagingChallan (obj) {
    return this.gs.manipulateResponse(this.baseService.postRequest(`${ApiConstant.POST_PACKAGING_CHALLAN}`, obj))
  }

  getNewBillNo (date, type,FormType) {
    let queryString = ''
    if (type === 1) {
      queryString = 'TransactionType=' + FormType + '&TransDate=' + date
      return this.gs.manipulateResponse(this.baseService.getRequest(ApiConstant.GET_NEW_BILL_NO_AUTO + queryString))
    } else if (type === 2) {
      queryString = 'Type=' + FormType+ '&BillDate=' + date
      return this.gs.manipulateResponse(this.baseService.getRequest(ApiConstant.GET_NEW_BILL_NO_MANUAL + queryString))
    }
  }

  onChallanAdded () {
    this.challanAddedSub.next()
  }
}