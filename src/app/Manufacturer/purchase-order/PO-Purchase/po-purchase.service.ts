// File is created by Dolly Garg

import { Injectable } from '@angular/core'
import { Subject, Observable } from 'rxjs'
import { Select2OptionData } from 'ng2-select2'
import { BaseServices } from 'src/app/commonServices/base-services'
import { ApiConstant } from 'src/app/shared/constants/api'
import { UIConstant } from 'src/app/shared/constants/ui-constant'
import { ResponseSale } from 'src/app/model/sales-tracker.model'
import { GlobalService } from '../../../commonServices/global.service';
import { MFApiConstant } from '../../mfApi';
import * as _ from 'lodash';
import { FormConstants } from '../../../shared/constants/forms.constant';
@Injectable({
  providedIn: 'root'
})
export class POPurchaseService {
  attributesDataSub = new Subject<{attributeKeys: Array<string>, attributesData: Array<any>}>()
  attributesData$ = this.attributesDataSub.asObservable()
  itemDataSub = new Subject<{data: Array<Select2OptionData>}>()
  itemData$ = this.itemDataSub.asObservable()
  vendorDataSub = new Subject<{data: Array<Select2OptionData>}>()
  vendorData$ = this.vendorDataSub.asObservable()
  IMEInumberSub = new Subject<{data: Array<Select2OptionData>}>()
  IMEInumber$ = this.IMEInumberSub.asObservable()
  taxProcessesData = new Subject<{data: Array<Select2OptionData>}>()
  taxProcessesData$ = this.taxProcessesData.asObservable()
  paymentModesData = new Subject<{data: Array<Select2OptionData>}>()
  paymentModesData$ = this.paymentModesData.asObservable()
  organisationsData = new Subject<{data: Array<Select2OptionData>}>()
  organisationsData$ = this.organisationsData.asObservable()
  godownsData = new Subject<{data: Array<Select2OptionData>}>()
  godownsData$ = this.godownsData.asObservable()
  referralTypesData = new Subject<{data: Array<Select2OptionData>}>()
  referralTypesData$ = this.referralTypesData.asObservable()
  subUnitsData = new Subject<{data: Array<Select2OptionData>}>()
  subUnitsData$ = this.subUnitsData.asObservable()
  referralData = new Subject<{data: Array<Select2OptionData>}>()
  referralData$ = this.referralData.asObservable()
  taxSlabsData = new Subject<{data: Array<Select2OptionData>}>()
  taxSlabsData$ = this.taxSlabsData.asObservable()
  currencyData = new Subject<{data: Array<Select2OptionData>}>()
  currencyData$ = this.currencyData.asObservable()
  freightData = new Subject<{data: Array<Select2OptionData>}>()
  freightData$ = this.freightData.asObservable()
  addressData = new Subject<{data: Array<Select2OptionData>}>()
  addressData$ = this.addressData.asObservable()
  settingData = new Subject<{data: Array<any>}>()
  settingData$ = this.settingData.asObservable()
  settingData1 = new Subject<{data: Array<any>}>()
  settingData1$ = this.settingData1.asObservable()
  chargestData = new Subject<{data: Array<Select2OptionData>}>()
  chargestData$ = this.chargestData.asObservable()
  searchSub = new Subject<string>()
  search$ = this.searchSub.asObservable()
  private queryStrSub = new Subject<string>()
  public queryStr$ = this.queryStrSub.asObservable()

  constructor (private baseService: BaseServices, private _gs: GlobalService) {}
  getPurchaseList (queryParams) {
    return this.baseService.getRequest(ApiConstant.PURCHASE_LIST + queryParams)
  }

  postPurchaseList (obj) {
    return this.baseService.postRequest(ApiConstant.PURCHASE_LIST, obj)
  }
  //retrun Api Purchase
  postPurchaseReturnList (obj) {
    return this.baseService.postRequest(ApiConstant.RERTURN_PURCHASE_LIST, obj)
  }
  getPurchaseReturnList (queryParams) {
    return this.baseService.getRequest(ApiConstant.RERTURN_PURCHASE_LIST + queryParams)
  }
  generateAttributes(data) {
    let obj = {}
    let attributeKeys = []
    let attributesData = []
    data.forEach(attribute => {
      obj = {}
      attributeKeys.push(attribute.Name)
      obj['name'] = attribute.Name
      obj['attributeId'] = attribute.AttributeId
      obj['id'] = 0
      obj['data'] = [{ id: '0', text: 'Select Attribute' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
      attribute.AttributeValuesResponse.forEach((element) => {
        obj['data'].push({
          id: element.Id,
          text: element.Name
        })
      })
      attributesData.push({ ...obj })
    })
    let attibutesDataToSend = Object.assign([], attributesData)
    this.attributesDataSub.next({ 'attributeKeys': attributeKeys, 'attributesData': attibutesDataToSend })
  }

  createItems (items) {
    let newData = [{ id: '0', text: 'Select Items' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
    items.forEach(item => {
      newData.push({
        id: item.Id,
        text: item.Name
      })
    })
    // console.log('items: ', newData)
    this.itemDataSub.next({ 'data': JSON.parse(JSON.stringify(newData)) })
  }
  IMEINumber (array) {
    let newData = []
    array.forEach(data => {
      newData.push({
        id: data.Id,
        text: data.Name
      })
    })
    this.IMEInumberSub.next({ 'data': newData })
  }
  createVendors (array) {
    // console.log(array)
    let newData = [{ id: '0', text: 'Select Vendor' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
    array.forEach(data => {
      newData.push({
        id: data.Id,
        text: data.Name
      })
    })
    this.vendorDataSub.next({ 'data': newData })
  }

  createTaxProcess (array) {
    let newData = [{ id: '0', text: 'Select Tax Process' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
    array.forEach(data => {
      newData.push({
        id: data.Id,
        text: data.Name
      })
    })
    this.taxProcessesData.next({ 'data': newData })
  }

  createPaymentModes (array) {
    let newData = [{ id: '0', text: 'Select Payment Mode' }]
    array.forEach(data => {
      newData.push({
        id: data.Id,
        text: data.PayModeName
      })
    })
    this.paymentModesData.next({ 'data': newData })
  }

  createOrganisations (array) {
    let newData = []
    array.forEach(data => {
      newData.push({
        id: data.Id,
        text: data.Name
      })
    })
    this.organisationsData.next({ 'data': newData })
  }

  createGodowns (array) {
    let newData = []
    array.forEach(data => {
      newData.push({
        id: data.Id,
        text: data.Name
      })
    })
    this.godownsData.next({ 'data': newData })
  }

  createReferralTypes (array) {
    let newData = [{ id: '0', text: 'Select Refferal Types' }]
    array.forEach(data => {
      newData.push({
        id: data.Id,
        text: data.CommonDesc
      })
    })
    this.referralTypesData.next({ 'data': newData })
  }

  createSubUnits (array) {
    let newData = [{ id: '0', text: 'Select Units' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
    array.forEach(data => {
      newData.push({
        id: data.Id,
        text: data.Name
      })
    })
    this.subUnitsData.next({ 'data': JSON.parse(JSON.stringify(newData)) })
  }

  createReferral (array) {
    let newData = [{ id: '0', text: 'Select Referrals' }]
    array.forEach(data => {
      newData.push({
        id: data.Id,
        text: data.Name
      })
    })
    this.referralData.next({ 'data': newData })
  }

  createTaxSlabs (array) {
    let newData = [{ id: '0', text: 'Select Tax Slab' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
    array.forEach(data => {
      newData.push({
        id: data.Id,
        text: data.Slab
      })
    })
    this.taxSlabsData.next({ 'data': newData })
  }

  createCurrencies (array) {
    let newData = []
    array.forEach(data => {
      newData.push({
        id: data.Id,
        text: data.Symbol
      })
    })
    this.currencyData.next({ 'data': newData })
  }

  createFreightBy (array) {
    let newData = []
    array.forEach(data => {
      newData.push({
        id: data.Id,
        text: data.Name
      })
    })
    this.freightData.next({ 'data': newData })
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

  getAddressForPrint (address) {
    return address.AddressValue
    + ' ' + ((typeof (address.AreaName) === 'object' || address.AreaName === '' || typeof (address.AreaName) === 'undefined') ? '' : address.AreaName)
    + ' ' + ((typeof (address.CityName) === 'object' || address.CityName === '' || typeof (address.CityName) === 'undefined') ? '' : address.CityName)
    + ' ' + ((typeof (address.StateName) === 'object' || address.StateName === '' || typeof (address.StateName) === 'undefined') ? '' : address.StateName)
    + ' ' + ((typeof (address.CountryName) === 'object' || address.CountryName === '' || typeof (address.CountryName) === 'undefined') ? '' : address.CountryName)
    + ' ' + ((typeof (address.PostCode) === 'object' || address.PostCode === '' || typeof (address.PostCode) === 'undefined') ? '' : address.PostCode)
  }

  getAllAddresses (vendorId) {
    return this.baseService.getRequest(ApiConstant.GET_ADDRESS_OF_VENDOR + vendorId)
  }

  getItemDetail (itemId,BillDate,Barcode) {
    return this.baseService.getRequest(ApiConstant.GET_ITEM_DETAIL + itemId +'&BillDate='+BillDate+'&BarCode='+Barcode)
  }

  getSlabData (id) {
    return this.baseService.getRequest(ApiConstant.GET_TAX_SLAB_DATA + id)
  }

  getAllSettings (settings) {
    this.settingData1.next({ 'data': settings })
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
    // console.log(appliedTaxRates);
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

  createCharges (array) {
    let newData = [ {id: '0', text: 'Select Charge'}, {id: '-1', text: UIConstant.ADD_NEW_OPTION} ]
    array.forEach(data => {
      newData.push({
        id: data.Id,
        text: data.Name
      })
    })
    this.chargestData.next({ 'data': newData })
  }

  postPurchase (obj) {
    return this.baseService.postRequest(ApiConstant.PURCHASE_LIST, obj)
  }

  getNewBillNoPurchase (orgId, date, type,FormType) {
    let queryString = ''
    if (type === 1) {
      queryString = 'TransactionType=' + FormType+ '&&OrgId=' + orgId + '&&TransDate=' + date
      return this.baseService.getRequest(ApiConstant.GET_NEW_BILL_NO_AUTO + queryString)
    } else if (type === 2) {
      queryString = 'Type=' + FormType+ '&&BillDate=' + date + '&OrgId=' + orgId
      return this.baseService.getRequest(ApiConstant.GET_NEW_BILL_NO_MANUAL + queryString)
    }
  }

  getReturnPurchaseEdit (type,id): Observable<ResponseSale> {
    return this.baseService.getRequest(ApiConstant.RETURN_PURCHASE_BY_ID+ type + id)
  }
  getPurchaseDetailById (id): Observable<ResponseSale> {
    return this.baseService.getRequest(ApiConstant.GET_DETAIL_OF_PURCHASE_BY_ID+ id)
  }
  

  getPrintData (id): Observable<ResponseSale> {
    return this.baseService.getRequest(ApiConstant.GET_PURCHASE_PRINT_DATA + id)
  }

  onTextEntered (text: string) {
    this.searchSub.next(text)
  }

  setSearchQueryParamsStr (str) {
    this.queryStrSub.next(str)
  }

  getCurrentDate (): Observable<ResponseSale> {
    return this.baseService.getRequest(ApiConstant.GET_CURRENT_DATE)
  }

  postPoPurchase(obj) {
    return this._gs.manipulateResponse(this.baseService.postRequest(MFApiConstant.POST_PO, obj))
  }

  private select2ArrSub = new Subject()
  select2List$ = this.select2ArrSub.asObservable()
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
    this.select2ArrSub.next({data: [{ id: 0, text: 'Select ' + title }, 
    {id: -1, text: UIConstant.ADD_NEW_OPTION}, ...list], title: title})
  }

  setItems (items, itemsBefore, attributesData, ItemAttributeTrans) {
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
        Quantity: +element.ItemReqQty,
        SaleRate: +element.SaleRate,
        MrpRate: +element.MrpRate,
        PurchaseRate: +element.PurchaseRate,
        TotalRate: +element.Total,
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
        DiscountAmt: 0
      })
      Sno++
    })
    return itemsBefore
  }

  getAmountItem(element) {
    return +element.Quantity * +element.PurchaseRate
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
        ParentTypeId: FormConstants.Purchase,
        name: '',
        id: 0,
        Sno: index_sno
      }
      index_sno++
    });

    return itemAttributeTrans
  }
}
