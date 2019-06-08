import { Injectable } from '@angular/core'
import { Subject, Observable } from 'rxjs'
import { Select2OptionData } from 'ng2-select2'
import { BaseServices } from 'src/app/commonServices/base-services'
import { ApiConstant } from 'src/app/shared/constants/api'
import { UIConstant } from 'src/app/shared/constants/ui-constant'
import { ResponseSale } from 'src/app/model/sales-tracker.model'
import { ToastrCustomService } from '../../commonServices/toastr.service';
@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  attributesDataSub = new Subject<{attributeKeys: Array<string>, attributesData: Array<any>}>()
  attributesData$ = this.attributesDataSub.asObservable()
  itemDataSub = new Subject<{data: Array<Select2OptionData>}>()
  itemData$ = this.itemDataSub.asObservable()
  vendorDataSub = new Subject<{data: Array<Select2OptionData>}>()
  vendorData$ = this.vendorDataSub.asObservable()
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
  settingData = new Subject<{data: Array<Select2OptionData>}>()
  settingData$ = this.settingData.asObservable()
  chargestData = new Subject<{data: Array<Select2OptionData>}>()
  chargestData$ = this.chargestData.asObservable()
  searchSub = new Subject<string>()
  search$ = this.searchSub.asObservable()
  private queryStrSub = new Subject<string>()
  public queryStr$ = this.queryStrSub.asObservable()
  constructor (private baseService: BaseServices, private toastrService: ToastrCustomService) {}
  getPurchaseList (queryParams) {
    return this.baseService.getRequest(ApiConstant.PURCHASE_LIST + queryParams)
  }

  postPurchaseList (obj) {
    return this.baseService.postRequest(ApiConstant.PURCHASE_LIST, obj)
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
    let newData = [{ id: '0', text: 'Select Payment Modes' }]
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
    let newData = [{ id: '0', text: 'Select Sub Units' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
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

  getItemDetail (itemId) {
    return this.baseService.getRequest(ApiConstant.GET_ITEM_DETAIL + itemId)
  }

  getSlabData (id) {
    console.log('id tax slab : ', id)
    return this.baseService.getRequest(ApiConstant.GET_TAX_SLAB_DATA + id)
  }

  getAllSettings (settings) {
    let setting = []
    let setupMasters = settings.SetupMasters
    let setupClient = settings.SetupClients
    let i = 0
    setupMasters.forEach(element => {
      let val: string | Array<any> | boolean
      if (+element.Type === 2 || +element.Type === 3) {
        val = setupClient[i].Val
      } else if (+element.Type === 4) {
        val = setupClient[i].Val.split(',')
      } else if (+element.Type === 1) {
        val = !!(+setupClient[i].Val)
      }
      setting.push({
        id: element.Id,
        val: val
      })
      i++
    })
    this.settingData.next({ 'data': setting })
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

  taxCalCulationForInclusive (taxRates, taxSlabType, rate, isOtherState, parentType, slabName) {
    let sumOfAllRates = 0
    let singleTaxRateAmount = 0
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

  getNewBillNoPurchase (orgId, date, type) {
    let queryString = ''
    if (type === 1) {
      queryString = 'TransactionType=' + 'purchase' + '&&OrgId=' + orgId + '&&TransDate=' + date
      return this.baseService.getRequest(ApiConstant.GET_NEW_BILL_NO_AUTO + queryString)
    } else if (type === 2) {
      queryString = 'Type=' + 'purchase' + '&&BillDate=' + date + '&OrgId=' + orgId
      return this.baseService.getRequest(ApiConstant.GET_NEW_BILL_NO_MANUAL + queryString)
    }
  }

  getPurchaseDetailById (id): Observable<ResponseSale> {
    return this.baseService.getRequest(ApiConstant.GET_DETAIL_OF_PURCHASE_BY_ID + id)
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

  removeByAttr (arr, attr, value) {
    var i = arr.length;
    while(i--){
      if( arr[i] 
          && arr[i].hasOwnProperty(attr) 
          && (arguments.length > 2 && arr[i][attr] === value ) ){ 
          arr.splice(i,1);
      }
    }
    return arr;
  }
}
