import { Injectable } from '@angular/core'
import { BehaviorSubject, Subject, Observable } from 'rxjs'
import { AddCust } from '../../model/sales-tracker.model'
import { BaseServices } from '../base-services'
import { ApiConstant } from '../../shared/constants/api'
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private openInvoiceSub = new BehaviorSubject<AddCust>({ 'open': false })
  private openImportSub = new BehaviorSubject<AddCust>({ 'open': false })
  private openAddCustSub = new BehaviorSubject<AddCust>({ 'open': false })
  private openAddCompositeUnitAdd = new BehaviorSubject<AddCust>({ 'open': false })
  private openAddItemMasterSub = new BehaviorSubject<AddCust>({ 'open': false })
  private openAddVendSub = new BehaviorSubject<AddCust>({ 'open': false })
  private openAddRoutingSub = new BehaviorSubject<AddCust>({ 'open': false })
  private openAddCategorySub = new BehaviorSubject<AddCust>({ 'open': false })
  private openAddUnitSub = new BehaviorSubject<AddCust>({ 'open': false })
  private openAddTaxSub = new BehaviorSubject<AddCust>({ 'open': false })
  private openAddLedgerSub = new BehaviorSubject<AddCust>({ 'open': false })
  private openDeleteSub = new BehaviorSubject<AddCust>({ 'open': false })
  private openItemImportSub = new BehaviorSubject<AddCust>({ 'open': false })
  private openSaleReturnSub = new BehaviorSubject<AddCust>({ 'open': false })
  private openAddAttributeSub = new BehaviorSubject<AddCust>({ 'open': false })
  private closeAddAttribute = new BehaviorSubject<any>({})
  private openAddressAddSub = new BehaviorSubject<AddCust>({ 'open': false })
  private newInvoiceSub = new Subject()
  private newCatSub = new Subject()
  private newUnitSub = new Subject()
  private newRouteSub = new Subject()
  private newSaleSub = new Subject()
  private newTaxSub = new Subject()
  private newItemAdded = new Subject()
  private newCatOrSubCatAdded = new Subject()
  private newCompositeAdded = new Subject()
  private openChallanBillingSub = new BehaviorSubject<AddCust>({ 'open': false })
  private openSaleDirectSubject = new BehaviorSubject<AddCust>({ 'open': false })

  /* Regex Patterns  ---b */
  companyNameRegx = `^[A-Za-z0-9&-]+$`
  alphaNumericRegx = `^[A-Za-z0-9]+$`
  panRegx = `[A-Z]{5}[0-9]{4}[A-Z]{1}$`
  emailRegx = `^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|
  (\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|
  (([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$`

  gstInRegx = `^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})
  ([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$`

  constructor (private _basesService: BaseServices) { }

  public getCountry () {
    return this._basesService.getRequest(ApiConstant.BASE_URL)
  }

  openInvoice (editId) {
    this.openInvoiceSub.next({ 'open': true, 'editId': editId })
  }

  closeInvoice () {
    this.openInvoiceSub.next({ 'open': false })
  }

  getInvoiceStatus (): Observable<any> {
    return this.openInvoiceSub.asObservable()
  }

  openImport () {
    this.openImportSub.next({ 'open': true })
  }

  closeImport () {
    this.openImportSub.next({ 'open': false })
  }

  getImportStatus () {
    return this.openImportSub.asObservable()
  }

  openCust (editId) {
    this.openAddCustSub.next({ 'open': true ,'editId': editId })
  }

  closeCust (newCust) {
    if (newCust) {
      this.openAddCustSub.next({ 'open': false, 'name': newCust.name, 'id': newCust.id })
    } else {
      this.openAddCustSub.next({ 'open': false })
    }
  }

  getCustStatus () {
    return this.openAddCustSub.asObservable()
  }

  openCompositeUnit (editId) {
    this.openAddCompositeUnitAdd.next({ 'open': true, 'editId': editId })
  }

  closeCompositeUnit (newCust) {
    if (newCust) {
      this.openAddCompositeUnitAdd.next({ 'open': false, 'name': newCust.name, 'id': newCust.id })
    } else {
      this.openAddCompositeUnitAdd.next({ 'open': false })
    }
  }

  getCompositeUnitStatus () {
    return this.openAddCompositeUnitAdd.asObservable()
  }

  openItemMaster (editId) {
    this.openAddItemMasterSub.next({ 'open': true, 'editId': editId })
  }

  closeItemMaster (newItemMaster) {
    if (newItemMaster) {
      this.openAddItemMasterSub.next({ 'open': false, 'name': newItemMaster.name, 'id': newItemMaster.id })
    } else {
      this.openAddItemMasterSub.next({ 'open': false })
    }
  }

  getItemMasterStatus () {
    return this.openAddItemMasterSub.asObservable()
  }

  openVend (editId) {
    this.openAddVendSub.next({ 'open': true ,'editId': editId })
  }

  closeVend (newVend) {
    if (newVend) {
      this.openAddVendSub.next({ 'open': false, 'name': newVend.name, 'id': newVend.id })
    } else {
      this.openAddVendSub.next({ 'open': false })
    }
  }

  getVendStatus () {
    return this.openAddVendSub.asObservable()
  }

  openRouting (editId) {
    this.openAddRoutingSub.next({ 'open': true, 'editId': editId })
  }

  closeRouting (newRouting) {
    if (newRouting) {
      this.openAddRoutingSub.next({ 'open': false, 'name': newRouting.name, 'id': newRouting.id })
    } else {
      this.openAddRoutingSub.next({ 'open': false })
    }
  }

  getRoutingStatus () {
    return this.openAddRoutingSub.asObservable()
  }
  openCategory (editId, type) {
    this.openAddCategorySub.next({ 'open': true, 'editId': editId, 'type': type })
  }

  closeCategory (newCat) {
    if (newCat) {
      this.openAddCategorySub.next({ 'open': false, 'name': newCat.name, 'id': newCat.id, 'type': newCat.type, 'parentId': newCat.parentId })
    } else {
      this.openAddCategorySub.next({ 'open': false })
    }
  }

  getCategoryStatus () {
    return this.openAddCategorySub.asObservable()
  }

  openUnit (editId) {
    this.openAddUnitSub.next({ 'open': true, 'editId': editId })
  }

  closeUnit (newUnit) {
    if (newUnit) {
      this.openAddUnitSub.next({ 'open': false, 'name': newUnit.name, 'id': newUnit.id , 'type': newUnit.type })
    } else {
      this.openAddUnitSub.next({ 'open': false })
    }
  }

  getUnitStatus () {
    return this.openAddUnitSub.asObservable()
  }

  openTax (editId) {
    this.openAddTaxSub.next({ 'open': true, 'editId': editId })
  }

  closeTax (newTax) {
    if (newTax) {
      this.openAddTaxSub.next({ 'open': false, 'name': newTax.name, 'id': newTax.id })
    } else {
      this.openAddTaxSub.next({ 'open': false })
    }
  }

  getTaxStatus () {
    return this.openAddTaxSub.asObservable()
  }

  openLedger () {
    this.openAddLedgerSub.next({ 'open': true })
  }

  closeLedger (newLedger) {
    if (newLedger) {
      this.openAddLedgerSub.next({ 'open': false, 'name': newLedger.name, 'id': newLedger.id })
    } else {
      this.openAddLedgerSub.next({ 'open': false })
    }
  }

  getLedgerStatus () {
    return this.openAddLedgerSub.asObservable()
  }

  newInvoiceAdded () {
    this.newInvoiceSub.next()
  }

  getBillStatus () {
    return this.newInvoiceSub.asObservable()
  }

  categoryAdded () {
    this.newCatSub.next()
  }

  newCatStatus () {
    return this.newCatSub.asObservable()
  }

  newUnitAdded () {
    this.newUnitSub.next()
  }

  newUnitStatus () {
    return this.newUnitSub.asObservable()
  }

  newRouteAdded () {
    return this.newRouteSub.next()
  }

  newRouteStatus () {
    return this.newRouteSub.asObservable()
  }

  newSaleAdded () {
    return this.newSaleSub.next()
  }

  newSaleStatus () {
    return this.newSaleSub.asObservable()
  }

  deleteId: string
  type: string
  openDelete (id, type) {
    this.openDeleteSub.next({ 'open': true })
    this.deleteId = id
    this.type = type
  }

  closeDelete (resData) {
    if (resData) {
      this.openDeleteSub.next({ 'open': false, 'id': this.deleteId, 'type': this.type })
    } else {
      this.openDeleteSub.next({ 'open': false })
    }
  }

  getDeleteStatus () {
    return this.openDeleteSub.asObservable()
  }

  newTaxAdded () {
    this.newTaxSub.next()
  }

  getTaxAddStatus () {
    return this.newTaxSub.asObservable()
  }

  openItemImport () {
    this.openItemImportSub.next({ 'open': true })
  }

  closeItemImport () {
    this.openItemImportSub.next({ 'open': false })
  }

  getItemImportStatus () {
    return this.openItemImportSub.asObservable()
  }

  onAddItemMaster () {
    this.newItemAdded.next()
  }

  addItemMasterSub () {
    return this.newItemAdded.asObservable()
  }

  onCatOrSubCatAdded (obj) {
    this.newCatOrSubCatAdded.next({ 'id': obj.id, 'name': obj.name })
  }

  getNewCatOrSubCatStatus () {
    return this.newCatOrSubCatAdded.asObservable()
  }

  openSaleReturn (editId) {
    console.log('open called')
    this.openSaleReturnSub.next({ 'open': true, 'editId': editId })
  }

  closeSaleReturn () {
    console.log('close called')
    this.openSaleReturnSub.next({ 'open': false })
  }

  getSaleReturnStatus (): Observable<any> {
    console.log('status called')
    return this.openSaleReturnSub.asObservable()
  }

  newCompositeUnitAdd () {
    this.newCompositeAdded.next()
  }

  getNewCompositeAddedStatus () {
    return this.newCompositeAdded.asObservable()
  }

  getSettingById (id) {
    return this._basesService.getRequest(ApiConstant.GET_SETTING_BY_ID + id)
  }

  getSaleSettings () {
    return this._basesService.getRequest(ApiConstant.SETTING_SALE)
  }

  getSaleDetail () {
    return this._basesService.getRequest(ApiConstant.SALE_TRVEL_DETAIL_URL)
  }

  getPaymentLedgerDetail (id) {
    return this._basesService.getRequest(ApiConstant.LEDGER_DETAIL_URL + '?Glid=' + id)
  }

  getPaymentModeDetail () {
    return this._basesService.getRequest(ApiConstant.PAYMENT_MODE_DETAIL_URL)
  }

  getCountryList () {
    return this._basesService.getRequest(ApiConstant.COUNTRY_LIST)
  }

  getSaleReturnSetting () {
    return this._basesService.getRequest(ApiConstant.SETTING_SALE_RETURN)
  }

  openAttribute (data, isSubAttr) {
    this.openAddAttributeSub.next({ 'open': true, 'isSubAttr': isSubAttr, 'data': data })
  }

  getAttributeStatus () {
    return this.openAddAttributeSub.asObservable()
  }

  closeAttribute (data) {
    this.closeAddAttribute.next(data)
  }

  closeAttributeStatus () {
    return this.closeAddAttribute.asObservable()
  }
  getsettingforOrgnizationData (orgid,forSaleType,date) {
    return this._basesService.getRequest(ApiConstant.SETTING_FOR_ORGNIZATION_DATA + orgid + '&TransDate=' + date + '&TransactionType=' + forSaleType)
  }
  openAddress (leaderId) {
    this.openAddressAddSub.next({ 'open': true, 'legerId': leaderId })
  }

  closeAddress (address) {
    if (address) {
      this.openAddressAddSub.next({ 'open': false, 'name': address.name, 'id': address.id })
    } else {
      this.openAddressAddSub.next({ 'open': false })
    }
  }

  public addAreaNameUnderCity (param) {
    return this._basesService.postRequest(ApiConstant.ADD_AREA_UNDER_CITY_ID ,param)
  }
  public searchCountryByName (name) {
    return this._basesService.getRequest(ApiConstant.SEARCH_COUNTRY_BY_ID_AND_NAME + name)
  }

  getAddressStatus () {
    return this.openAddressAddSub.asObservable()
  }

  getSaleChallanSettings (type) {
    return this._basesService.getRequest(ApiConstant.SETTING_SALE_CHALLAN + type)
  }
  getSaleChallanInitializeData () {
    return this._basesService.getRequest(ApiConstant.SALE_CHALLAN_GET_TYPEBY_SALE_DATA)
  }

  getAddressByIdOfCustomer (parentId, ParentTypeId) {
    return this._basesService.getRequest(ApiConstant.GET_ADDRESS_OF_CUSTOMER_BY_ID_FOR_SAL_ECHALLAN + parentId + '&ParentTypeId=' + ParentTypeId)

  }
  postSaleChallan (param) {
    return this._basesService.postRequest(ApiConstant.POST_SALE_CHALLAN, param)
  }
  public getItemByCategoryId (id) {
    return this._basesService.getRequest(ApiConstant.GET_ITEM_BY_CATEGORY_URL + id)
  }

  getAllDataOfSaleChallan () {
    return this._basesService.getRequest(ApiConstant.GET_ALL_DETAILS_SALE_CHALLAN_URL)

  }
  printAndEditSaleChallan (id) {
    return this._basesService.getRequest(ApiConstant.GET_PRINT_SALE_CHALLAN_URL + id)

  }
  public postAddNewAddress (param) {
    return this._basesService.postRequest(ApiConstant.POST_NEW_ADDRESS, param)
  }
  public saleEditChallan (id) {
    return this._basesService.getRequest(ApiConstant.GET_PRINT_SALE_CHALLAN_URL + id)
  }

  public allsetupSettingAPI () {
    return this._basesService.getRequest(ApiConstant.ALL_SETUP_SETTING)
  }

  public excelForCouirerParcelData () {
    return this._basesService.getRequest(ApiConstant.GET_EXCEL_API_FOR_DATA)
  }

//by hari
  public attributeData () {
    return this._basesService.getRequest(ApiConstant.GET_ATTRIBUTE_SALE_CHALLAN_DATA)
  }

    openChallanBill (data,challanNos) {
    this.openChallanBillingSub.next({ 'open': true ,'data' : data , 'challanNos':challanNos })
  }

  closeChallanBill () {
    this.openChallanBillingSub.next({ 'open': false })
  }

  getChallanBillStatus (): Observable<any> {
    return this.openChallanBillingSub.asObservable()
  }
    getChallanDataByIdForBilling(id){
    return this._basesService.getRequest(ApiConstant.GET_CHALLAN_DETAILS_FOR_BILLING_BY_ID + id)
}

  getSaleTravelDetail() {
    return this._basesService.getRequest(ApiConstant.SALE_TRVEL_DETAIL_URL)
  }

 public exportAsExcelFile(json: any[], excelFileName: string): void {
    
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    console.log('worksheet',worksheet);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
    /* Function to get industry type list ----b */
  getIndustryType = () => {
    return this._basesService.getRequest(ApiConstant.INDUSTRY_TYPE_LIST_URL)
  }

  /* Function to get key person type type list ----b */
  getPersonType = () => {
    return this._basesService.getRequest(ApiConstant.KEY_PERSON_TYPE_LIST_URL)
  }

  /* Fucntion to get accounting method list ----b */
  getAccountingMethod = () => {
    return this._basesService.getRequest(ApiConstant.ACCOUNTING_METHOD_LIST_URL)
  }

/* HARRY*/
  ledgerGetGSTByAddress = (Leaderid) => {
    return this._basesService.getRequest(ApiConstant.LEDGER_GET_ADDRESS_FOR_GST + Leaderid)
  }
 onChangeSlabGetTaxRate (slabId) {
    return this._basesService.getRequest(ApiConstant.EDIT_TAX_BY_ID_URL + slabId)
  }
getModulesettingAPI (type) {
  return this._basesService.getRequest(ApiConstant.GET_MODULE_SETTING + type)
}
getItemRateByLedgerAPI (ItemId,CustomerId) {
  return this._basesService.getRequest(ApiConstant.GET_ITEM__RATE_BY_ITEMID_CUSTOMERID_SETTING + ItemId + '&Ledgerid=' + CustomerId)
}


  /* Fucntion to get branch type list ----b */
  getBranchTypeList = () => {
    return this._basesService.getRequest(ApiConstant.BRANCH_TYPE_LIST_URL)
  }

  /* Function to allow numeric input only for input type text  ----b */
  isNumber (evt) {
    evt = (evt) ? evt : window.event
    const charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false
    }
  }
postSaleChallanBillingAPI (input) {
  return this._basesService.postRequest( ApiConstant.POST_ALL_SLECTED_CHALLAN_BILL_API,input)
}
  getSPUtilityData (type) {
    return this._basesService.getRequest(ApiConstant.SPUTILITY + type)
  }

  setupSettingByType (type) {
    return this._basesService.getRequest(ApiConstant.SETTING_SETUP_BY_TYPE + type)
  }

//sale direct HARRY
   openSaleDirect (editId) {
    this.openSaleDirectSubject.next({ 'open': true ,'editId' : editId })
  }

  closeSaleDirect () {
    this.openSaleDirectSubject.next({ 'open': false })
  }

  getSaleDirectStatus (): Observable<any> {
    return this.openSaleDirectSubject.asObservable()
  }
  postSaleDirectAPI (input) {
  return this._basesService.postRequest( ApiConstant.SALE_DIRECT_BILLING_API,input)
}
getListSaleDirect (){
  return this._basesService.getRequest( ApiConstant.SALE_DIRECT_BILLING_API)


}
}
