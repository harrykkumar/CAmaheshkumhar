import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { BehaviorSubject } from 'rxjs';
import { AddCust } from '../../model/sales-tracker.model';
import { GlobalService } from '../../commonServices/global.service';
import { BaseServices } from '../../commonServices/base-services';
import { ApiConstant } from 'src/app/shared/constants/api';
import { UIConstant } from 'src/app/shared/constants/ui-constant';
import * as _ from 'lodash';
import { Select2OptionData } from 'ng2-select2';
@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {
  private onPOAddSub = new Subject()
  poAdded$ = this.onPOAddSub.asObservable()
  private openPOSub = new BehaviorSubject<AddCust>({ 'open': false })
  openPO$ = this.openPOSub.asObservable()
  private select2ArrSub = new Subject()
  select2List$ = this.select2ArrSub.asObservable()
  private queryStrSub = new Subject<string>()
  public queryStr$ = this.queryStrSub.asObservable()
  attributesDataSub = new Subject<{attributeKeys: Array<string>, attributesData: Array<any>}>()
  attributesData$ = this.attributesDataSub.asObservable()
  addressData = new Subject<{data: Array<Select2OptionData>}>()
  addressData$ = this.addressData.asObservable()
  constructor (private _gs: GlobalService, private _bs: BaseServices) {}
  onPOAdd () {
    this.onPOAddSub.next()
  }

  openPO (id) {
    this.openPOSub.next({ 'open': true, editId: id })
  }

  closePO () {
    this.openPOSub.next({ 'open': false })
  }

  getSPUtilityData () {
    return this._gs.manipulateResponse(this._bs.getRequest(`${ApiConstant.SPUTILITY}${UIConstant.PO}`))
  }

  getCurrentDate () {
    return this._gs.manipulateResponse(this._bs.getRequest(`${ApiConstant.GET_CURRENT_DATE}`))
  }

  getList(data, key, title){
    const list = _.map(data, (item) => {
      return {
        id: item.Id,
        text: item[key]
      }
    })
    this.select2ArrSub.next({data: [{ id: 0, text: 'Select ' + title }, {id: -1, text: UIConstant.ADD_NEW_OPTION}, ...list], title: title})
  }

  generateAttributes(data) {
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
    for (let i = 0; i < data.AttributeValues.length; i++) {
      const attr = data.AttributeValues[i]
      let obj1 = {}
      obj1['id'] = attr.Id
      obj1['text'] = attr.Name
      for (let j = 0; j < attributesData.length; j++) {
        if (attributesData[j].attributeId === data.AttributeValues[i].AttributeId) {
          if (attributesData[j]) {
            attributesData[j].data.push({ ...obj1 })
          }
        }
      }
    }
    let attibutesDataToSend = Object.assign([], attributesData)
    this.attributesDataSub.next({ 'attributeKeys': attributeKeys, 'attributesData': attibutesDataToSend })
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

  getAllAddresses (vendorId) {
    return this._gs.manipulateResponse(this._bs.getRequest(ApiConstant.GET_ADDRESS_OF_VENDOR + vendorId))
  }

  getAttributes (Attributes, AttributeValues) {
    const groupOnId = _.groupBy(AttributeValues, (attr) => {
      return attr.AttributeId
    })
    for (const key in groupOnId) {
      let values = groupOnId[key]
      values = values.map(val => {
        return { id: val.Id, text: val.Name }
      })
      groupOnId[key] = values
    }
    console.log(groupOnId)
    let attributeKeys = []
    let attributesData = []
    Attributes.forEach(attribute => {
      attributeKeys.push(attribute.Name)
      let obj = {}
      obj['name'] = attribute.Name
      obj['data'] = [
        { id: '0', text: 'Select Attribute' }, 
        { id: '-1', text: UIConstant.ADD_NEW_OPTION },
        ...groupOnId[attribute.Id]
      ]
      obj['attributeId'] = attribute.Id
      obj['id'] = 0
      attributesData.push({ ...obj })
    })
    this.attributesDataSub.next({ 'attributeKeys': attributeKeys, 'attributesData': attributesData })
  }

  getItemDetail(itemId) {
    return this._gs.manipulateResponse(this._bs.getRequest(ApiConstant.GET_ITEM__RATE_BY_ITEMID_CUSTOMERID_SETTING + itemId))
  }

  taxCalculation (taxRates, taxSlabType, rate, isOtherState, parentType, slabName) {
    let taxAmount = 0
    let singleTaxRateAmount = 0
    let appliedTaxRates = []
    if (taxRates.length > 0) {
      if ((+taxSlabType === 1 && isOtherState) || +taxSlabType === 2 || +taxSlabType === 3) {
        taxRates.forEach(element => {
          if (element.IsForOtherState) {
            if (element.ValueType === 1) {
              taxAmount = taxAmount + element.TaxRate
              singleTaxRateAmount = element.TaxRate
            } else {
              taxAmount = taxAmount + ((element.TaxRate / 100) * rate)
              singleTaxRateAmount = (element.TaxRate / 100) * rate
            }
            appliedTaxRates.push({
              TaxTypeTax: taxSlabType,
              AmountTax: +(JSON.parse(JSON.stringify(singleTaxRateAmount))).toFixed(4),
              ItemTransTaxId: 0,
              ParentTaxId: 0,
              ParentTypeTaxId: parentType,
              ItemTransTypeTax: 0,
              TaxRateId: element.Id,
              TaxRate: element.TaxRate,
              ValueType: element.ValueType,
              TaxSlabName: slabName,
              TaxRateNameTax: element.Name,
              id: 0
            })
          }
        })
      }
      if ((+taxSlabType === 1 && !isOtherState) || +taxSlabType === 2 || +taxSlabType === 3) {
        taxRates.forEach(element => {
          if (!element.IsForOtherState) {
            if (element.ValueType === 1) {
              taxAmount = taxAmount + element.TaxRate
              singleTaxRateAmount = element.TaxRate
            } else {
              taxAmount = taxAmount + ((element.TaxRate / 100) * rate)
              singleTaxRateAmount = (element.TaxRate / 100) * rate
            }
            appliedTaxRates.push({
              TaxTypeTax: taxSlabType,
              AmountTax: +(JSON.parse(JSON.stringify(singleTaxRateAmount))).toFixed(4),
              ItemTransTaxId: 0,
              ParentTaxId: 0,
              ParentTypeTaxId: parentType,
              ItemTransTypeTax: 0,
              TaxRateId: element.Id,
              TaxRate: element.TaxRate,
              ValueType: element.ValueType,
              TaxSlabName: slabName,
              TaxRateNameTax: element.Name,
              id: 0
            })
          }
        })
      }
    }
    console.log(appliedTaxRates);
    return {'taxAmount': taxAmount, 'appliedTaxRates': appliedTaxRates}
  }

  calcTaxableAmountType1 (taxRates, taxSlabType, rate, isOtherState): number {
    let sumOfAllRates = 0
    if (taxRates.length > 0) {
      if ((+taxSlabType === 1 && isOtherState) || +taxSlabType === 2 || +taxSlabType === 3) {
        taxRates.forEach(element => {
          if (element.IsForOtherState && +element.ValueType === 0) {
            sumOfAllRates = sumOfAllRates + element.TaxRate
          }
        })
      }
      if ((+taxSlabType === 1 && !isOtherState) || +taxSlabType === 2 || +taxSlabType === 3) {
        taxRates.forEach(element => {
          if (!element.IsForOtherState && +element.ValueType === 0) {
            sumOfAllRates = sumOfAllRates + element.TaxRate
          }
        })
      }
    }
    const baseRate = +(rate / ((100 + sumOfAllRates) / 100))
    console.log('taxable value for item : ', baseRate)
    return baseRate
  }

  calcTaxableAmountType2 (taxRates, taxSlabType, rate, isOtherState): number {
    let sumOfAllRates = 0
    if (taxRates.length > 0) {
      if ((+taxSlabType === 1 && isOtherState) || +taxSlabType === 2 || +taxSlabType === 3) {
        taxRates.forEach(element => {
          if (element.IsForOtherState && +element.ValueType === 0) {
            sumOfAllRates = sumOfAllRates + element.TaxRate
          }
        })
      }
      if ((+taxSlabType === 1 && !isOtherState) || +taxSlabType === 2 || +taxSlabType === 3) {
        taxRates.forEach(element => {
          if (!element.IsForOtherState && +element.ValueType === 0) {
            sumOfAllRates = sumOfAllRates + element.TaxRate
          }
        })
      }
    }
    const baseRate = +(rate / ((100 + sumOfAllRates) / 100))
    console.log('taxable value for item : ', baseRate)
    return baseRate
  }

  taxCalCulationForInclusiveType2 (taxRates, taxSlabType, rate, isOtherState, parentType, slabName) {
    let singleTaxRateAmount = 0
    const baseRate = +rate
    let taxAmount = 0
    let appliedTaxRates = []
    if (taxRates.length > 0) {
      if ((+taxSlabType === 1 && isOtherState) || +taxSlabType === 2 || +taxSlabType === 3) {
        taxRates.forEach(element => {
          if (element.IsForOtherState) {
            if (+element.ValueType === 0) {
              taxAmount += baseRate * (element.TaxRate / 100)
              singleTaxRateAmount = baseRate * (element.TaxRate / 100)
            }
            if (+element.ValueType === 1) {
              taxAmount += element.TaxRate
              singleTaxRateAmount = element.TaxRate
            }
            appliedTaxRates.push({
              TaxTypeTax: taxSlabType,
              AmountTax: +(JSON.parse(JSON.stringify(singleTaxRateAmount))).toFixed(4),
              ItemTransTaxId: 0,
              ParentTaxId: 0,
              ParentTypeTaxId: parentType,
              ItemTransTypeTax: 0,
              TaxRateId: element.Id,
              TaxRate: element.TaxRate,
              ValueType: element.ValueType,
              TaxSlabName: slabName,
              TaxRateNameTax: element.Name,
              id: 0
            })
          }
        })
      }
      if ((+taxSlabType === 1 && !isOtherState) || +taxSlabType === 2 || +taxSlabType === 3) {
        taxRates.forEach(element => {
          if (!element.IsForOtherState) {
            if (+element.ValueType === 0) {
              taxAmount += baseRate * (element.TaxRate / 100)
              singleTaxRateAmount = baseRate * (element.TaxRate / 100)
            }
            if (+element.ValueType === 1) {
              taxAmount += element.TaxRate
              singleTaxRateAmount = element.TaxRate
            }
            appliedTaxRates.push({
              TaxTypeTax: taxSlabType,
              AmountTax: +(JSON.parse(JSON.stringify(singleTaxRateAmount))).toFixed(4),
              ItemTransTaxId: 0,
              ParentTaxId: 0,
              ParentTypeTaxId: parentType,
              ItemTransTypeTax: 0,
              TaxRateId: element.Id,
              TaxRate: element.TaxRate,
              ValueType: element.ValueType,
              TaxSlabName: slabName,
              TaxRateNameTax: element.Name,
              id: 0
            })
          }
        })
      }
    }
    console.log(appliedTaxRates);
    return {'taxAmount': taxAmount, 'appliedTaxRates': appliedTaxRates}
  }

  taxCalCulationForInclusive (taxRates, taxSlabType, rate, isOtherState, parentType, slabName) {
    let singleTaxRateAmount = 0
    const baseRate = +rate
    let taxAmount = 0
    let appliedTaxRates = []
    if (taxRates.length > 0) {
      if ((+taxSlabType === 1 && isOtherState) || +taxSlabType === 2 || +taxSlabType === 3) {
        taxRates.forEach(element => {
          if (element.IsForOtherState) {
            if (+element.ValueType === 0) {
              taxAmount += baseRate * (element.TaxRate / 100)
              singleTaxRateAmount = baseRate * (element.TaxRate / 100)
            }
            if (+element.ValueType === 1) {
              taxAmount += element.TaxRate
              singleTaxRateAmount = element.TaxRate
            }
            appliedTaxRates.push({
              TaxTypeTax: taxSlabType,
              AmountTax: +(JSON.parse(JSON.stringify(singleTaxRateAmount))).toFixed(4),
              ItemTransTaxId: 0,
              ParentTaxId: 0,
              ParentTypeTaxId: parentType,
              ItemTransTypeTax: 0,
              TaxRateId: element.Id,
              TaxRate: element.TaxRate,
              ValueType: element.ValueType,
              TaxSlabName: slabName,
              TaxRateNameTax: element.Name,
              id: 0
            })
          }
        })
      }
      if ((+taxSlabType === 1 && !isOtherState) || +taxSlabType === 2 || +taxSlabType === 3) {
        taxRates.forEach(element => {
          if (!element.IsForOtherState) {
            if (+element.ValueType === 0) {
              taxAmount += baseRate * (element.TaxRate / 100)
              singleTaxRateAmount = baseRate * (element.TaxRate / 100)
            }
            if (+element.ValueType === 1) {
              taxAmount += element.TaxRate
              singleTaxRateAmount = element.TaxRate
            }
            appliedTaxRates.push({
              TaxTypeTax: taxSlabType,
              AmountTax: +(JSON.parse(JSON.stringify(singleTaxRateAmount))).toFixed(4),
              ItemTransTaxId: 0,
              ParentTaxId: 0,
              ParentTypeTaxId: parentType,
              ItemTransTypeTax: 0,
              TaxRateId: element.Id,
              TaxRate: element.TaxRate,
              ValueType: element.ValueType,
              TaxSlabName: slabName,
              TaxRateNameTax: element.Name,
              id: 0
            })
          }
        })
      }
    }
    console.log(appliedTaxRates);
    return {'taxAmount': taxAmount, 'appliedTaxRates': appliedTaxRates}
  }

  getSlabData (id) {
    return this._gs.manipulateResponse(this._bs.getRequest(ApiConstant.GET_TAX_SLAB_DATA + id))
  }
}