import { Injectable } from '@angular/core'
import { Subject, Observable } from 'rxjs'
import { Select2OptionData } from 'ng2-select2'
import { BaseServices } from 'src/app/commonServices/base-services'
import { ApiConstant } from 'src/app/shared/constants/api'
import { UIConstant } from 'src/app/shared/constants/ui-constant'
import { ResponseSale } from 'src/app/model/sales-tracker.model'
import { ToastrCustomService } from '../../commonServices/toastr.service';
import { SetUpIds } from '../../shared/constants/setupIds.constant';
@Injectable({
  providedIn: 'root'
})
export class SaleDirectService {
  attributesDataSub = new Subject<{ attributeKeys: Array<string>, attributesData: Array<any> }>()
  attributesData$ = this.attributesDataSub.asObservable()
  itemDataSub = new Subject<{ data: Array<Select2OptionData> }>()
  itemData$ = this.itemDataSub.asObservable()
  vendorDataSub = new Subject<{ data: Array<Select2OptionData> }>()
  vendorData$ = this.vendorDataSub.asObservable()
  taxProcessesData = new Subject<{ data: Array<Select2OptionData> }>()
  taxProcessesData$ = this.taxProcessesData.asObservable()
  paymentModesData = new Subject<{ data: Array<Select2OptionData> }>()
  paymentModesData$ = this.paymentModesData.asObservable()
  organisationsData = new Subject<{ data: Array<Select2OptionData> }>()
  organisationsData$ = this.organisationsData.asObservable()
  godownsData = new Subject<{ data: Array<Select2OptionData> }>()
  godownsData$ = this.godownsData.asObservable()
  referralTypesData = new Subject<{ data: Array<Select2OptionData> }>()
  referralTypesData$ = this.referralTypesData.asObservable()
  subUnitsData = new Subject<{ data: Array<Select2OptionData> }>()
  subUnitsData$ = this.subUnitsData.asObservable()
  referralData = new Subject<{ data: Array<Select2OptionData> }>()
  referralData$ = this.referralData.asObservable()
  taxSlabsData = new Subject<{ data: Array<Select2OptionData> }>()
  taxSlabsData$ = this.taxSlabsData.asObservable()
  currencyData = new Subject<{ data: Array<Select2OptionData> }>()
  currencyData$ = this.currencyData.asObservable()
  freightData = new Subject<{ data: Array<Select2OptionData> }>()
  freightData$ = this.freightData.asObservable()
  addressData = new Subject<{ data: Array<Select2OptionData> }>()
  addressData$ = this.addressData.asObservable()
  settingData = new Subject<{ data: Array<any> }>()
  settingData$ = this.settingData.asObservable()
  settingData1 = new Subject<{ data: Array<any> }>()
  settingData1$ = this.settingData1.asObservable()
  chargestData = new Subject<{ data: Array<Select2OptionData> }>()
  chargestData$ = this.chargestData.asObservable()
  searchSub = new Subject<string>()
  search$ = this.searchSub.asObservable()
  private queryStrSub = new Subject<string>()
  public queryStr$ = this.queryStrSub.asObservable()

  constructor(private baseService: BaseServices, private toastrService: ToastrCustomService) { }
  getSaleDirectList(queryParams) {
    return this.baseService.getRequest(ApiConstant.SALE_DIRECT_BILLING_API + queryParams)
  }

  postPurchaseList(obj) {
    return this.baseService.postRequest(ApiConstant.PURCHASE_LIST, obj)
  }
  //retrun Api Purchase
  postPurchaseReturnList(obj) {
    return this.baseService.postRequest(ApiConstant.RERTURN_PURCHASE_LIST, obj)
  }
  getPurchaseReturnList(queryParams) {
    return this.baseService.getRequest(ApiConstant.RERTURN_PURCHASE_LIST + queryParams)
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

  createItems(items) {
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

  createCustomers(array) {
    // console.log(array)
    let newData = [{ id: '0', text: 'Select Customers' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
    array.forEach(data => {
      newData.push({
        id: data.Id,
        text: data.Name
      })
    })
    this.vendorDataSub.next({ 'data': newData })
  }

  createTaxProcess(array) {
    let newData = [{ id: '0', text: 'Select Tax Process' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
    array.forEach(data => {
      newData.push({
        id: data.Id,
        text: data.Name
      })
    })
    this.taxProcessesData.next({ 'data': newData })
  }

  createPaymentModes(array) {
    let newData = [{ id: '0', text: 'Select Modes' }]
    array.forEach(data => {
      newData.push({
        id: data.Id,
        text: data.PayModeName
      })
    })
    this.paymentModesData.next({ 'data': newData })
  }



  createGodowns(array) {
    let newData = []
    array.forEach(data => {
      newData.push({
        id: data.Id,
        text: data.Name
      })
    })
    this.godownsData.next({ 'data': newData })
  }


  createSubUnits(array) {
    let newData = [{ id: '0', text: 'Select Unit' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
    array.forEach(data => {
      newData.push({
        id: data.Id,
        text: data.Name
      })
    })
    this.subUnitsData.next({ 'data': JSON.parse(JSON.stringify(newData)) })
  }



  createTaxSlabs(array) {
    let newData = [{ id: '0', text: 'Select Tax Slab' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
    array.forEach(data => {
      newData.push({
        id: data.Id,
        text: data.Slab
      })
    })
    this.taxSlabsData.next({ 'data': newData })
  }

  createCurrencies(array) {
    let newData = []
    array.forEach(data => {
      newData.push({
        id: data.Id,
        text: data.Symbol
      })
    })
    this.currencyData.next({ 'data': newData })
  }


  createAddress(array) {
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

  getAddress(address) {
    return address.AddressTypeName + ' - ' + address.AddressValue
      + ' ' + ((typeof (address.AreaName) === 'object' || address.AreaName === '' || typeof (address.AreaName) === 'undefined') ? '' : address.AreaName)
      + ' ' + ((typeof (address.CityName) === 'object' || address.CityName === '' || typeof (address.CityName) === 'undefined') ? '' : address.CityName)
      + ' ' + ((typeof (address.StateName) === 'object' || address.StateName === '' || typeof (address.StateName) === 'undefined') ? '' : address.StateName)
      + ' ' + ((typeof (address.CountryName) === 'object' || address.CountryName === '' || typeof (address.CountryName) === 'undefined') ? '' : address.CountryName)
      + ' ' + ((typeof (address.PostCode) === 'object' || address.PostCode === '' || typeof (address.PostCode) === 'undefined') ? '' : address.PostCode)
  }

  getAddressForPrint(address) {
    return address.AddressValue
      + ' ' + ((typeof (address.AreaName) === 'object' || address.AreaName === '' || typeof (address.AreaName) === 'undefined') ? '' : address.AreaName)
      + ' ' + ((typeof (address.CityName) === 'object' || address.CityName === '' || typeof (address.CityName) === 'undefined') ? '' : address.CityName)
      + ' ' + ((typeof (address.StateName) === 'object' || address.StateName === '' || typeof (address.StateName) === 'undefined') ? '' : address.StateName)
      + ' ' + ((typeof (address.CountryName) === 'object' || address.CountryName === '' || typeof (address.CountryName) === 'undefined') ? '' : address.CountryName)
      + ' ' + ((typeof (address.PostCode) === 'object' || address.PostCode === '' || typeof (address.PostCode) === 'undefined') ? '' : address.PostCode)
  }

  getAllAddresses(vendorId) {
    return this.baseService.getRequest(ApiConstant.GET_ADDRESS_OF_VENDOR + vendorId)
  }

  getItemDetail(itemId) {
    return this.baseService.getRequest(ApiConstant.GET_ITEM_DETAIL + itemId)
  }

  getSlabData(id) {
    console.log('id tax slab : ', id)
    return this.baseService.getRequest(ApiConstant.GET_TAX_SLAB_DATA + id)
  }

  getAllSettings(settings) {
    this.settingData1.next({ 'data': settings })
  }

  taxCalculation(taxRates, taxSlabType, rate, isOtherState, parentType, slabName) {
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
    return { 'taxAmount': taxAmount, 'appliedTaxRates': appliedTaxRates }
  }

  calcTaxableAmountType1(taxRates, taxSlabType, rate, isOtherState): number {
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

  calcTaxableAmountType2(taxRates, taxSlabType, rate, isOtherState): number {
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

  taxCalCulationForInclusiveType2(taxRates, taxSlabType, rate, isOtherState, parentType, slabName) {
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
    return { 'taxAmount': taxAmount, 'appliedTaxRates': appliedTaxRates }
  }

  taxCalCulationForInclusive(taxRates, taxSlabType, rate, isOtherState, parentType, slabName) {
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
    return { 'taxAmount': taxAmount, 'appliedTaxRates': appliedTaxRates }
  }

  createCharges(array) {
    let newData = [{ id: '0', text: 'Select Charge' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
    array.forEach(data => {
      newData.push({
        id: data.Id,
        text: data.Name
      })
    })
    this.chargestData.next({ 'data': newData })
  }

  postSaleDirect(obj) {
    return this.baseService.postRequest(ApiConstant.SALE_DIRECT_BILLING_API, obj)
  }

  getNewBillNoSale(orgId, date, type, FormType) {
    let queryString = ''
    if (type === 1) {
      queryString = 'TransactionType=' + FormType + '&&OrgId=' + orgId + '&&TransDate=' + date
      return this.baseService.getRequest(ApiConstant.GET_NEW_BILL_NO_AUTO + queryString)
    } else if (type === 2) {
      queryString = 'Type=' + FormType + '&&BillDate=' + date + '&OrgId=' + orgId
      return this.baseService.getRequest(ApiConstant.GET_NEW_BILL_NO_MANUAL + queryString)
    }
  }

  // getReturnPurchaseEdit (type,id): Observable<ResponseSale> {
  //   return this.baseService.getRequest(ApiConstant.RETURN_PURCHASE_BY_ID+ type + id)
  // }
  getEditsaleDirect(id): Observable<ResponseSale> {
    return this.baseService.getRequest(ApiConstant.DIRECT_SALE_EDIT_GET_API + id)
  }


  getPrintData(id): Observable<ResponseSale> {
    return this.baseService.getRequest(ApiConstant.GET_PURCHASE_PRINT_DATA + id)
  }

  onTextEntered(text: string) {
    this.searchSub.next(text)
  }

  setSearchQueryParamsStr(str) {
    this.queryStrSub.next(str)
  }

  getCurrentDate(): Observable<ResponseSale> {
    return this.baseService.getRequest(ApiConstant.GET_CURRENT_DATE)
  }
  CustomerDetailsForRevugain(post)  {
    return this.baseService.postRequest(ApiConstant.REVUGAIN_FOR_CUSTOMER_DETAILS, post)
  }

}
