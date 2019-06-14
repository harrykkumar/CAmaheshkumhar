import { Injectable } from '@angular/core'
import { BehaviorSubject, Subject, Observable } from 'rxjs'
import { AddCust } from '../../model/sales-tracker.model'
import { BaseServices } from '../base-services'
import { ApiConstant } from '../../shared/constants/api'
import { Router, NavigationEnd } from '@angular/router'
declare const $: any
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
  private openAddressAddSub = new BehaviorSubject<AddCust>({ 'open': false })
  private openPurchaseAddSub = new BehaviorSubject<AddCust>({ 'open': false })
  private openVoucherAddSub = new BehaviorSubject<AddCust>({ 'open': false })
  private newVoucherAdded = new Subject()
  private newInvoiceSub = new Subject()
  private newCatSub = new Subject()
  private newUnitSub = new Subject()
  private newRouteSub = new Subject()
  private newSaleSub = new Subject()
  private newTaxSub = new Subject()
  private newItemAdded = new Subject()
  private newCatOrSubCatAdded = new Subject()
  private newCompositeAdded = new Subject()
  private newPurchaseAdded = new Subject()
  private onActionClicked$ = new Subject()
  private openChallanBillingSub = new BehaviorSubject<AddCust>({ 'open': false })
  private openSaleDirectSubject = new BehaviorSubject<AddCust>({ 'open': false })
  private openPrintAddSub = new BehaviorSubject<AddCust>({ 'open': false })
  private openAddledgerGroupSub = new BehaviorSubject<AddCust>({ 'open': false })
  private openAddledgerCreationSub = new BehaviorSubject<AddCust>({ 'open': false })
private sendDataForSearchSub= new BehaviorSubject<AddCust>({ 'open': false })
private newRefreshSub = new Subject()
public previousUrl: String;
public currentUrl: String;
  //  validation reg ex
  companyNameRegx = `^[A-Za-z0-9& -]+$`
  alphaNumericRegx = `^[A-Za-z0-9]+$`
  panRegx = `[A-Z]{5}[0-9]{4}[A-Z]{1}$`
  emailRegx = `^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|
  (\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|
  (([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$`

  gstInRegx = `^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})
  ([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$`

  constructor (    private router: Router ,private baseService: BaseServices) { 
    
    this.setPreviousUrl();
  }

  public getCountry () {
    return this.baseService.getRequest(ApiConstant.BASE_URL)
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

  openCust (editId, isAddNew) {
    this.openAddCustSub.next({ 'open': true ,'editId': editId, 'isAddNew': isAddNew })
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

  openItemMaster (editId, categoryId) {
    this.openAddItemMasterSub.next({ 'open': true, 'editId': editId, 'categoryId': categoryId })
  }

  closeItemMaster (newItemMaster) {
    if (newItemMaster) {
      this.openAddItemMasterSub.next({ 'open': false, 'name': newItemMaster.name, 'id': newItemMaster.id, 'categoryId': newItemMaster.categoryId })
    } else {
      this.openAddItemMasterSub.next({ 'open': false })
    }
  }

  getItemMasterStatus () {
    return this.openAddItemMasterSub.asObservable()
  }

  openVend (editId, isAddNew) {
    this.openAddVendSub.next({ 'open': true ,'editId': editId, 'isAddNew': isAddNew })
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
      this.openAddCategorySub.next({ 'open': false,
        'name': newCat.name,
        'id': newCat.id,
        'type': newCat.type,
        'parentId': newCat.parentId,
        'level': newCat.level
      })
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

  openLedger (editId) {
    this.openAddLedgerSub.next({ 'open': true , 'editId': editId })
  }

  closeLedger (flg,newLedger) {
    if (!flg) {
      this.openAddLedgerSub.next({ 'open': flg, 'name': newLedger.name, 'id': newLedger.id })
    } else {
      this.openAddLedgerSub.next({ 'open': flg, 'name': newLedger.name, 'id': newLedger.id })
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
  openDelete (id, type, title) {
    this.openDeleteSub.next({ 'open': true, 'title': title })
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
    this.openSaleReturnSub.next({ 'open': true, 'editId': editId })
  }

  closeSaleReturn () {
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

  newPurchaseAdd () {
    this.newPurchaseAdded.next()
  }

  getNewPurchaseAddedStatus () {
    return this.newPurchaseAdded.asObservable()
  }

  getSettingById (id) {
    return this.baseService.getRequest(ApiConstant.GET_SETTING_BY_ID + id)
  }

  // getSaleSettings () {
  //   return this.baseService.getRequest(ApiConstant.SETTING_SETUP_BY_TYPE + 'sale')
  // }

  getSaleDetail (queryParams) {
    return this.baseService.getRequest(ApiConstant.SALE_TRVEL_DETAIL_URL + queryParams)
  }

  getPaymentLedgerDetail (id) {
    return this.baseService.getRequest(ApiConstant.LEDGER_DETAIL_URL + '?Glid=' + id)
  }

  getPaymentModeDetail () {
    return this.baseService.getRequest(ApiConstant.PAYMENT_MODE_DETAIL_URL)
  }

  getCountryList () {
    return this.baseService.getRequest(ApiConstant.COUNTRY_LIST)
  }

  openAttribute (data, isSubAttr) {
    this.openAddAttributeSub.next({ 'open': true, 'isSubAttr': isSubAttr, 'data': data })
  }

  getAttributeStatus () {
    return this.openAddAttributeSub.asObservable()
  }

  closeAttributeForDynamicAdd (attribute) {
    if (attribute) {
      this.openAddAttributeSub.next({ 'open': false, 'status': attribute.status, 'name': attribute.name, 'id': attribute.id, 'AttributeId': attribute.AttributeId })
    } else {
      this.openAddAttributeSub.next({ 'open': false })
    }
  }

  closeAttribute (data) {
    if (data) {
      this.openAddAttributeSub.next({ 'open': false, 'name': data.name, 'id': data.id })
    } else {
      this.openAddAttributeSub.next({ 'open': false })
    }
  }

  closeAttributeStatus () {
    return this.openAddAttributeSub.asObservable()
  }
  getsettingforOrgnizationData (orgid,forSaleType,date) {
    return this.baseService.getRequest(ApiConstant.SETTING_FOR_ORGNIZATION_DATA + orgid + '&TransDate=' + date + '&TransactionType=' + forSaleType)
  }
  openAddress (leaderId ) {
    this.openAddressAddSub.next({ 'open': true, 'ledgerId': leaderId })
  }

  closeAddress (address) {
    if (address) {
      this.openAddressAddSub.next({ 'open': false, 'name': address.name, 'id': address.id ,'stateId':address.stateId})
    } else {
      this.openAddressAddSub.next({ 'open': false })
    }
  }

  public addAreaNameUnderCity (param) {
    return this.baseService.postRequest(ApiConstant.ADD_AREA_UNDER_CITY_ID ,param)
  }
  public searchCountryByName (name) {
    return this.baseService.getRequest(ApiConstant.SEARCH_COUNTRY_BY_ID_AND_NAME + name)
  }

  getAddressStatus () {
    return this.openAddressAddSub.asObservable()
  }

  // getSaleChallanSettings () {
  //   return this.baseService.getRequest(ApiConstant.SETTING_SALE_CHALLAN)
  // }
  getSaleChallanInitializeData () {
    return this.baseService.getRequest(ApiConstant.SALE_CHALLAN_GET_TYPEBY_SALE_DATA)
  }

  getAddressByIdOfCustomer (parentId, ParentTypeId) {
    return this.baseService.getRequest(ApiConstant.GET_ADDRESS_OF_CUSTOMER_BY_ID_FOR_SAL_ECHALLAN + parentId + '&ParentTypeId=' + ParentTypeId)

  }
  postSaleChallan (param) {
    return this.baseService.postRequest(ApiConstant.POST_SALE_CHALLAN, param)
  }
  public getItemByCategoryId (id) {
    return this.baseService.getRequest(ApiConstant.GET_ITEM_BY_CATEGORY_URL + id)
  }

  getAllDataOfSaleChallan () {
    return this.baseService.getRequest(ApiConstant.GET_ALL_DETAILS_SALE_CHALLAN_URL)

  }
  printAndEditSaleChallan (id) {
    return this.baseService.getRequest(ApiConstant.GET_PRINT_SALE_CHALLAN_URL + id)

  }
  public postAddNewAddress (param) {
    return this.baseService.postRequest(ApiConstant.POST_NEW_ADDRESS, param)
  }
  public saleEditChallan (id) {
    return this.baseService.getRequest(ApiConstant.GET_PRINT_SALE_CHALLAN_URL + id)
  }

  public allsetupSettingAPI () {
    return this.baseService.getRequest(ApiConstant.ALL_SETUP_SETTING)
  }

  public excelForCouirerParcelData () {
    return this.baseService.getRequest(ApiConstant.GET_EXCEL_API_FOR_DATA)
  }

  public attributeData () {
    return this.baseService.getRequest(ApiConstant.GET_ATTRIBUTE_SALE_CHALLAN_DATA)
  }

  openPurchase (editId) {
    this.openPurchaseAddSub.next({ 'open': true, 'editId': editId })
  }

  getPurchaseStatus () {
    return this.openPurchaseAddSub.asObservable()
  }

  closePurchase () {
    this.openPurchaseAddSub.next({ 'open': false })
  }

  getModuleSettings (name) {
    return this.baseService.getRequest(ApiConstant.GET_MODULE_SETTING + name)
  }

  getSPUtilityData (type) {
    return this.baseService.getRequest(ApiConstant.SPUTILITY + type)
  }

  setupSettingByType (type) {
    return this.baseService.getRequest(ApiConstant.SETTING_SETUP_BY_TYPE + type)
  }

  getAllCategories () {
    return this.baseService.getRequest(ApiConstant.GET_SAVE_AND_UPDATE_CATEGORY_URL)
  }

  onActionClicked (action) {
    this.onActionClicked$.next(action)
  }

  getActionClickedStatus () {
    return this.onActionClicked$.asObservable()
  }

  getBranchTypeList = () => {
    return this.baseService.getRequest(ApiConstant.BRANCH_TYPE_LIST_URL)
  }

  /* Function to allow numeric input only for input type text  ----b */
  isNumber (evt) {
    evt = (evt) ? evt : window.event
    const charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false
    }
  }

  /* Function to get industry type list ----b */
  getIndustryType = () => {
    return this.baseService.getRequest(ApiConstant.INDUSTRY_TYPE_LIST_URL)
  }

/* Function to get key person type type list ----b */
  getPersonType = () => {
    return this.baseService.getRequest(ApiConstant.KEY_PERSON_TYPE_LIST_URL)
  }

/* Fucntion to get accounting method list ----b */
  getAccountingMethod = () => {
    return this.baseService.getRequest(ApiConstant.ACCOUNTING_METHOD_LIST_URL)
  }

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
    return this.baseService.postRequest(ApiConstant.SALE_DIRECT_BILLING_API,input)
  }
  getListSaleDirect () {
    return this.baseService.getRequest(ApiConstant.SALE_DIRECT_BILLING_API)

  }

   openPrint (id,type,isViewPrint) {
    this.openPrintAddSub.next({ 'open': true, 'id': id ,'type': type ,'isViewPrint' :isViewPrint })
  }

  closePrint (address) {
    if (address) {
      this.openPrintAddSub.next({ 'open': false, 'name': address.name, 'id': address.id })
    } else {
      this.openPrintAddSub.next({ 'open': false })
    }
  }
  getprintStatus () {
    return this.openPrintAddSub.asObservable()
  }
  printDirectSale (id) {
    return this.baseService.getRequest(ApiConstant.DIRECT_SALE_PRINT_API + id)

  }

  getSaleDirectEditData (id) {
    return this.baseService.getRequest(ApiConstant.DIRECT_SALE_EDIT_GET_API + id)
  }

  getReportItemStock (data) {
    const url = `${ApiConstant.REPORT_ITEM_STOCK}?CategoryId=${data.CategoryId}&FromDate=${data.FromDate}&ToDate=${data.ToDate}&AttributeSearch=${data.AttributeSearch}&ItemId=${data.ItemId}&UnitId=${data.UnitId}&Page=${data.Page}&Size=${data.Size}`;
    return this.baseService.getRequest(url)
  }

  postSaleChallanBillingAPI (input) {
    return this.baseService.postRequest(ApiConstant.POST_ALL_SLECTED_CHALLAN_BILL_API,input)
  }

  getSaleChallanSettings (type) {
    return this.baseService.getRequest(ApiConstant.SETTING_SETUP_BY_TYPE + type)
  }

  openChallanBill (data,challanNos) {
    this.openChallanBillingSub.next({ 'open': true, 'data': data , 'challanNos': challanNos })
  }

  closeChallanBill () {
    this.openChallanBillingSub.next({ 'open': false })
  }

  getChallanBillStatus (): Observable<any> {
    return this.openChallanBillingSub.asObservable()
  }
  getChallanDataByIdForBilling (id) {
    return this.baseService.getRequest(ApiConstant.GET_CHALLAN_DETAILS_FOR_BILLING_BY_ID + id)
  }

  getSaleTravelDetail () {
    return this.baseService.getRequest(ApiConstant.SALE_TRVEL_DETAIL_URL)
  }

  ledgerGetGSTByAddress = (Leaderid) => {
    return this.baseService.getRequest(ApiConstant.LEDGER_GET_ADDRESS_FOR_GST + Leaderid)
  }
  onChangeSlabGetTaxRate (slabId) {
    return this.baseService.getRequest(ApiConstant.EDIT_TAX_BY_ID_URL + slabId)
  }
  getModulesettingAPI (type) {
    return this.baseService.getRequest(ApiConstant.GET_MODULE_SETTING + type)
  }
  getItemRateByLedgerAPI (ItemId,CustomerId) {
    return this.baseService.getRequest(ApiConstant.GET_ITEM__RATE_BY_ITEMID_CUSTOMERID_SETTING + ItemId + '&Ledgerid=' + CustomerId)
  }

  getSearchItemStock (getSearchItemStock) {
    this.baseService.postRequest(ApiConstant.REPORT_ITEM_STOCK + '?=AttributeSearch', getSearchItemStock)
  }

  /**
   * Gets form dependency - get a form dependency
   * @param name - form name
   * @returns - observable
   */
  getFormDependency (name) {
    return this.baseService.getRequest(ApiConstant.GET_DEPENDENCY_FOR_FORM + name)
  }

  /**
   * Checks for existence - Created by Dolly Garg
   * @param checkForExistence - array returned from backend
   * @param others - the top data of each form
   * @returns Observable
   */
  checkForExistence (checkForExistence, others): Observable<any> {
    checkForExistence.forEach(element => {
      if (!element.IsIdentity) {
        element.FieldValue = others[element.FormKeyName]
      }
    })
    console.log('checkForExistence : ', checkForExistence)
    let obj = {
      ExistencyNames: checkForExistence
    }
    console.log('existency : ', JSON.stringify(obj))
    return this.baseService.postRequest(ApiConstant.CHECK_FOR_EXISTENCE, obj)
  }

  /**
   * Fixs table hf - Created by Dolly Garg
   * @param classname - the table class name
   */
  fixTableHF (classname) {
    $(document).ready(function () {
      $('.' + classname).tableHeadFixer({
        head: true,
        foot: true
      })
    })
  }

  /**
   * Fixs table hf - Created by Dolly Garg
   * @param classname - the table class name
   */
  fixTableHFL (classname) {
    $('.' + classname).tableHeadFixer({
      head: true,
      foot: true,
      left: 1
    })
  }

  /**
   * Gets last bill no - for manual case - created by Dolly Garg
   * @param type - form type
   * @param date - billdate
   * @param orgNo - organisation id
   * @returns - observable
   */
  getLastBillNo (type,date,orgNo) {
    return this.baseService.getRequest(ApiConstant.GET_NEW_BILL_NO_MANUAL + 'Type=' + type + '&BillDate=' + date + '&OrgId=' + orgNo)
  }
  getBankList (queryParams) {
    return this.baseService.getRequest(ApiConstant.BANK_DETAIL_URL + queryParams)
  }
  getEditbankDetails (id) {
    return this.baseService.getRequest(ApiConstant.EDIT_BANK_DATA + id)
  }
  deleteBankDetails (id) {
    return this.baseService.deleteRequest(ApiConstant.BANK_DETAIL_URL +'?id=' + id)
  }
  obj: any
  getReportItemByCategorySale (type) {
    return this.baseService.getRequest(ApiConstant.REPORT_ITEM_BY_CATEGORY_SALE_DATA + type)
  }
  openledgerGroup (editId, type) {
    this.openAddledgerGroupSub.next({ 'open': true, 'editId': editId, 'type': type })
  }

  closeledgerGroup (LegerGroup) {
    if (LegerGroup) {
      this.openAddledgerGroupSub.next({ 'open': false,
        'name': LegerGroup.name,
        'id': LegerGroup.id,
        'type': LegerGroup.type,
        'parentId': LegerGroup.parentId,
        'headId':LegerGroup.headId
      })
    } else {
      this.openAddledgerGroupSub.next({ 'open': false })
    }
  }

  getledgerGroupStatus () {
    return this.openAddledgerGroupSub.asObservable()
  }
  
  getledgerCretionStatus () {
    return this.openAddledgerCreationSub.asObservable()
  }
  openledgerCretion (editId, isOtherCharge) {
    this.openAddledgerCreationSub.next({ 'open': true, 'editId': editId, 'isOtherCharge': isOtherCharge })
  }

  closeledgerCretion (newItemMaster) {
    if (newItemMaster) {
      this.openAddledgerCreationSub.next({ 'open': false, 'name': newItemMaster.name, 'id': newItemMaster.id })
    } else {
      this.openAddledgerCreationSub.next({ 'open': false })
    }
  }

 
  public postLedgerGroupAPI (parms: any): Observable<any> {
    return this.baseService.postRequest(ApiConstant.LEDGER_GROUP_API, parms)
  }
 
  public getLedgerGroupParentData (type) {
    return this.baseService.getRequest(ApiConstant.LEDGER_GROUP_PARENT_DATA_API + type)
  }
  public getLedgerGroupAPI (queryParams): Observable<any> {
    return this.baseService.getRequest(ApiConstant.LEDGER_GROUP_API + queryParams)
  }
  deleteLedgerGroup (id) {
    return this.baseService.deleteRequest(ApiConstant.LEDGER_GROUP_API + id)
  }
  gstNumberRegxValidation (gstNumber) {
    let regxGST = /^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/
    return regxGST.test(gstNumber)
  }
  
  panNumberRegxValidation (panNumber) {
    let regxPAN = /[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    return regxPAN.test(panNumber)
  }
  openingStatusForLedger() {
    return this.baseService.getRequest(ApiConstant.LEDGER_OPENING_BALANCE_STATUS_API)

  }

  getLedgerSummaryData = (data) => {
    return this.baseService.getRequest(`${ApiConstant.LEDGER_SUMMARY}?LedgerId=${data.LedgerId}&FromDate=${data.FromDate}&ToDate=${data.ToDate}&Page=${data.Page}&Size=${data.Size}`)
  }

  getLedgerItemList = () => {
    return this.baseService.getRequest(`${ApiConstant.LEDGER_DETAIL_URL}`)
  }
  
  getBalanceSheetList(date){
    return this.baseService.getRequest(ApiConstant.BALANCE_SHEET_API + date)
  }

  getOpeningStkList(){
    return this.baseService.getRequest(ApiConstant.OPENING_STK);
  }
  
  
  postOpeningStkList(data){
    return this.baseService.postRequest(ApiConstant.OPENING_STK, data);
  }

  
  getsearchByDateForBalancesheetStatus () {
    return this.sendDataForSearchSub.asObservable()
  }
  searchByDateForBalancesheet (date) {
    this.sendDataForSearchSub.next({ 'open': true, 'date': date })
  }
  setPreviousUrl = () => {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      }
    });
  }

  // hanlding of navigation to the previous url
  navigateToPreviousUrl() {
    if (this.previousUrl) {
      this.router.navigateByUrl(`${this.previousUrl}`);
    } else {
      this.router.navigate(['dashboard'])
    }
  }
  getSalePurchaseUtilityItems = () => {
    return this.baseService.getRequest(ApiConstant.SALE_PURCHASE_ITEM_UTILITY)
  }
itemSalePurchaseReportDetails (type ,LedgerId,CategoryId,ItemId,FromDate,ToDate,BatchNo ,Pagenumber,Size) {
  return this.baseService.getRequest(ApiConstant.REPORT_ITEM_SALE_PURCHASE + type + '&LedgerId='+LedgerId + '&CategoryId=' + CategoryId + '&ItemId=' + ItemId + '&FromDate=' + FromDate + '&ToDate=' + ToDate + '&BatchNo='+ BatchNo + '&Page='+ Pagenumber + '&Size='+ Size)

}
getSearchForStatus () {
  return this.sendDataForSearchSub.asObservable()
}
searchByDateForItemSale (todate,fromDate,batchNo,categoryId,itemId ,ledgerId) {
  this.sendDataForSearchSub.next({ 'open': true,'itemId':itemId ,'ledgerId':ledgerId , 'categoryId':categoryId , 'toDate': todate,'fromDate':fromDate,'batchNo':batchNo })
}
getSearchForPurchaseStatus () {
  return this.sendDataForSearchSub.asObservable()
}
searchByDateForPurchaseItemSale (todate,fromDate,batchNo,categoryId,itemId ,ledgerId) {
  this.sendDataForSearchSub.next({ 'open': true,'itemId':itemId ,'ledgerId':ledgerId , 'categoryId':categoryId , 'toDate': todate,'fromDate':fromDate,'batchNo':batchNo })
}
getProfitAndLossList(date){
  return this.baseService.getRequest(ApiConstant.ACCOUNT_PROFIT_AND_LOSS_BY_DATE + date)
}

getTradingList(date){
  return this.baseService.getRequest(ApiConstant.ACCOUNT_TRADING_BY_DATE + date)
}

openVoucher (editId) {
  this.openVoucherAddSub.next({ 'open': true, 'editId': editId })
}

getVoucherStatus () {
  return this.openVoucherAddSub.asObservable()
}

closeVoucher () {
  this.openVoucherAddSub.next({ 'open': false })
}
AddedItem () {
  this.newRefreshSub.next()
}

newRefreshItemStatus () {
  return this.newRefreshSub.asObservable()
}
}
