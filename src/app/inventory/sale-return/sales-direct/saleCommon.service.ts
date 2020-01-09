// File is created by Dolly Garg

import { Injectable } from '@angular/core'
import { Subject, Observable } from 'rxjs'
import { Select2OptionData } from 'ng2-select2'

@Injectable({
  providedIn: 'root'
})
export class SaleCommonService {

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
}
