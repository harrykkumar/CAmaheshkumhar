import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class CommonSetGraterServices {

    /* .............taxt gater seter....................*/
  select2TaxId: number
    /* ................completd.......................... */

    /* cat5egory setter gater serivces ..................... */
  buttonvalueis: boolean
  categoryId: any
    /* ............completed...................... */

    /* ...........UnitgaterSater */

  unitId: number
  primaryUnit: boolean
    /* ...........completed............ */
    /* ......subUnit................ */
  subUnitIdValue: number
  setTax (Id) {
    this.select2TaxId = Id
  }
  getTax () {
    return this.select2TaxId
  }

  categoryhideButton (button) {
    this.buttonvalueis = button
  }
  getValueForSelect2 () {
    return this.buttonvalueis
  }
  setSelect2CategoryValue (categoryid) {
    this.categoryId = categoryid
  }
  getSelectedCategoryValue () {
    return this.categoryId
  }
  setUnit (id) {
    this.unitId = id

  }
  getUnitId () {
    return this.unitId
  }

  setPrimaryUnit (value) {
    this.primaryUnit = value
  }
  getprimaryUnit () {
    return this.primaryUnit
  }
  setSubUnitId (id) {
    this.subUnitIdValue = id
  }

  getSubUnitId () {
    return this.subUnitIdValue
  }
  clientid: number
  setClientName (id) {
    this.clientid = id
    console.log('setter client id' + id)
    console.log('client name using setter' + this.clientid)
  }
  getClientId () {
    console.log('client id in getter settrs')

    return this.clientid

  }
  vendorName: number
  getVendorName () {
    return this.vendorName
  }
  setVendorName (id) {
    this.vendorName = id

  }
  bankId: number
  setbankName (id) {
    this.bankId = id
  }

  getbank () {
    return this.bankId
  }
  routingName: number
  setRoutingName (id) {
    this.routingName = id
  }
  getRoutingname () {
    return this.routingName
  }
}
