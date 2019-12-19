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
import { FormConstants } from '../../shared/constants/forms.constant';
import { MFApiConstant } from '../mfApi';
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

  postPO (obj) {
    return this._bs.postRequest(ApiConstant.POST_PO, obj)
  }

  getNewBillNo (date, type,FormType) {
    let queryString = ''
    if (type === 1) {
      queryString = 'TransactionType=' + FormType + '&TransDate=' + date
      return this._gs.manipulateResponse(this._bs.getRequest(ApiConstant.GET_NEW_BILL_NO_AUTO + queryString))
    } else if (type === 2) {
      queryString = 'Type=' + FormType+ '&BillDate=' + date
      return this._gs.manipulateResponse(this._bs.getRequest(ApiConstant.GET_NEW_BILL_NO_MANUAL + queryString))
    }
  }

  listPO (query) {
    return this._gs.manipulateResponse(this._bs.getRequest(ApiConstant.POST_PO + query))
  }

  getPODetail(id) {
    return this._gs.manipulateResponse(this._bs.getRequest(ApiConstant.GET_PO_BY_ID + '?Id=' + id))
  }

  getBODetail (id) {
    return this._gs.manipulateResponse(this._bs.getRequest(ApiConstant.BUYER_ORDER_ITEMS + id))
  }

  getVendorRates (query) {
    return this._gs.manipulateResponse(this._bs.getRequest(ApiConstant.GET_VENDOR_RATES_FOR_ORDER + query))
  }

  setItems (items, itemsBefore, attributesData, ItemAttributeTrans, buyerId) {
    let Sno = 0
    if (itemsBefore.length === 0) {
      Sno = 1
    } else if (itemsBefore.length > 0) {
      Sno = +itemsBefore[itemsBefore.length - 1].Sno + 1
    }
    items.forEach((element) => {
      if (+element.TaxType === 0) {
        element.taxTypeName = 'Exclusive'
      } else {
        element.taxTypeName = 'Inclusive'
      }
      itemsBefore.push({
        Id: 0,
        Sno: Sno,
        TransType: element.TransType,
        TransId: element.TransId,
        CategoryId: +element.CategoryId,
        ItemId: +element.ItemId,
        UnitId: +element.UnitId,
        Length: +element.Length,
        Height: +element.Height,
        Width: +element.Width,
        Quantity: +element.ApprovedQty,
        SaleRate: +element.SaleRate,
        MrpRate: +element.MrpRate,
        PurchaseRate: +element.PurchaseRate,
        TotalRate: +element.TotalRate,
        TaxSlabId: element.TaxSlabId,
        TaxType: +element.TaxType,
        TaxAmount: +element.TaxAmount,
        ExpiryDate: element.ExpiryDate,
        MfdDate: element.MfdDate,
        BatchNo: element.BatchNo,
        Remark: element.Remark,
        itemName: element.ItemName,
        categoryName: element.CategoryName,
        unitName: element.UnitName,
        taxSlabName: element.TaxSlabName,
        taxTypeName: element.taxTypeName,
        Amount: element.Amount,
        itemAttributeTrans: this.attributeForItem(itemsBefore, attributesData, ItemAttributeTrans),
        AmountItem: this.getAmountItem(element),
        taxSlabType: element.taxSlabType,
        taxRates: [],
        itemTaxTrans: [],
        isDisabled: true,
        ChallanId: 0,
        IsNotDiscountable: true,
        AmountItemBillDiscount: 0,
        DiscountType: 0,
        Discount: 0,
        DiscountAmt: 0,
        buyerId: buyerId
      })
      Sno++
    })
    return itemsBefore
  }

  getAmountItem(element) {
    return +element.RemainingQty * +element.PurchaseRate
  }

  attributeForItem(itemsBefore, attributesData, ItemAttributeTrans) {
    let itemAttributeTrans = []
     let Sno = 0
     if (itemsBefore.length === 0) {
      Sno = 1
    } else {
      Sno = itemsBefore[itemsBefore.length - 1].Sno + 1
    }
    let index_sno = 0
    if (ItemAttributeTrans.length === 0) {
      index_sno = 1
    } else {
      index_sno = ItemAttributeTrans[ItemAttributeTrans.length - 1]['Sno'] + 1
    }
    attributesData.forEach((element, index) => {
      itemAttributeTrans[index] = {
        ItemId: 0,
        ItemTransId: Sno,
        AttributeId: 0,
        ParentTypeId: FormConstants.PURCHASEORDER,
        name: '',
        id: 0,
        Sno: index_sno
      }
      index_sno++
    });

    return itemAttributeTrans
  }

  getBuyerOrderList () {
    return this._gs.manipulateResponse(this._bs.getRequest(ApiConstant.BUYER_ORER_LIST_FOR_SEARCH))
  }

  getStatusList () {
    return this._gs.manipulateResponse(this._bs.getRequest(ApiConstant.COUNTRY_LIST_URL + 194))
  }

  private queryStrSub = new Subject<string>()
  public queryStr$ = this.queryStrSub.asObservable()
  setSearchQueryParamsStr (str) {
    this.queryStrSub.next(str)
  }

  deletePO (id) {
    return this._gs.manipulateResponse(this._bs.deleteRequest(ApiConstant.POST_PO + '?Id=' + id))
  }

  getPOItems(id) {
    return this._gs.manipulateResponse(this._bs.getRequest(ApiConstant.GET_PO_BY_ID + '?Id=' + id + '&type=PoApproval'))
  }

  private openPOApprovalSub = new BehaviorSubject<AddCust>({ 'open': false })
  openPOApproval$ = this.openPOApprovalSub.asObservable()

  openPOApproval (id) {
    this.openPOApprovalSub.next({'open': true, 'id': id})
  }

  closePOApproval() {
    this.openPOApprovalSub.next({'open': false})
  }

  postPOApproval (data) {
    return this._gs.manipulateResponse(this._bs.postRequest(MFApiConstant.PO_QTY_APPROVAL_POST, data))
  }

  getPOItemsForPurchase (idStr) {
    return this._gs.manipulateResponse(this._bs.getRequest(MFApiConstant.GET_PO_DETAILS_BY_ID_STR + idStr + '&Type=PoPurchase'))
  }
}