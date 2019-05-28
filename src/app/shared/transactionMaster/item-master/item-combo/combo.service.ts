import { Injectable } from '@angular/core'
import { BaseServices } from '../../../../commonServices/base-services'
import { ApiConstant } from '../../../constants/api'
import { Observable, Subject } from 'rxjs';
import { ResponseSale } from '../../../../model/sales-tracker.model'
import { Select2OptionData } from 'ng2-select2';
import { UIConstant } from '../../../constants/ui-constant';
import { ToastrCustomService } from '../../../../commonServices/toastr.service';

@Injectable({
  providedIn: 'root'
})
export class ComboService {
  subUnitsData = new Subject<{data: Array<Select2OptionData>}>()
  subUnitsData$ = this.subUnitsData.asObservable()
  itemDataSub = new Subject<{data: Array<Select2OptionData>}>()
  itemData$ = this.itemDataSub.asObservable()
  attributesDataSub = new Subject<{attributeKeys: Array<string>, attributesData: Array<any>}>()
  attributesData$ = this.attributesDataSub.asObservable()
  constructor (private baseService: BaseServices, private toastrService: ToastrCustomService) {}
  getSPUtilityData (): Observable<ResponseSale> {
    return this.baseService.getRequest(ApiConstant.SPUTILITY_TO_CREATE_COMBO)
  }

  createSubUnits (array) {
    let newData = [{ id: '0', text: 'Select Sub Units' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
    array.forEach(data => {
      newData.push({
        id: data.Id,
        text: data.Name
      })
    })
    this.subUnitsData.next({ 'data': JSON.parse(JSON.stringify(newData)) })
  }

  createItems (items) {
    let newData = [{ id: '0', text: 'Select Items' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
    items.forEach(item => {
      newData.push({
        id: item.Id,
        text: item.Name
      })
    })
    console.log('items: ', newData)
    this.itemDataSub.next({ 'data': JSON.parse(JSON.stringify(newData)) })
  }

  generateAttributes (data) {
    let obj = {}
    let attributeKeys = []
    let attributesData = []
    data.AttributeValueResponses.forEach(attribute => {
      attributeKeys.push(attribute.Name)
      obj['name'] = attribute.Name
      obj['len'] = attribute.AttributeValuesResponse.length - 1
      obj['data'] = [{ id: '0', text: 'Select Attribute' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
      obj['attributeId'] = attribute.AttributeId
      obj['id'] = 0
      attributesData.push({ ...obj })
    })
    let j = 0
    let index = 0
    for (let i = 0; i < data.AttributeValues.length; i++) {
      const attr = data.AttributeValues[i]
      let obj1 = {}
      obj1['id'] = attr.Id
      obj1['text'] = attr.Name
      if (attributesData[j].len === index) {
        j++
        index = 0
      }
      index++
      if (attributesData[j]) {
        attributesData[j].data.push({ ...obj1 })
      } else {
        this.toastrService.showError('Not getting appropriate data', '')
      }
    }
    let attibutesDataToSend = Object.assign([], attributesData)
    // console.log('attributes data : ', attibutesDataToSend)

    this.attributesDataSub.next({ 'attributeKeys': attributeKeys, 'attributesData': attibutesDataToSend })
  }
}
