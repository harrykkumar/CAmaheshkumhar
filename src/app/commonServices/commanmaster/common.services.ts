import { ApiConstant } from './../../shared/constants/api';
import { ToastrCustomService } from 'src/app/commonServices/toastr.service';
import { Injectable, Inject } from '@angular/core'
import { BehaviorSubject, Subject, Observable } from 'rxjs'
import { AddCust } from '../../model/sales-tracker.model';
import { BaseServices } from '../base-services'
import { Router, NavigationEnd } from '@angular/router'
import { map } from 'rxjs/operators';
import { UIConstant } from 'src/app/shared/constants/ui-constant';
import { ConnectionService } from 'ng-connection-service';
declare const $: any
import * as _ from 'lodash';
import { DOCUMENT } from '@angular/common';

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
  private openSaleReturnDirectAddSub = new BehaviorSubject<AddCust>({ 'open': false })
  private openPurchaseDirectReturnAddSub = new BehaviorSubject<AddCust>({ 'open': false })
  private openVoucherAddSub = new BehaviorSubject<AddCust>({ 'open': false })
  private openCatImportSub = new BehaviorSubject<AddCust>({ 'open': false })
  private newVoucherAdded = new Subject()
  private newInvoiceSub = new Subject()
  private newCatSub = new Subject()
  private newUnitSub = new Subject()
  private newRouteSub = new Subject()
  private newSaleSub = new Subject()
  private newTaxSub = new Subject()
  private newItemAdded = new Subject()
  private newImportCatAdded = new Subject()
  public getCatImportAddStatus = this.newImportCatAdded.asObservable()
  private newCatOrSubCatAdded = new Subject()
  private newCompositeAdded = new Subject()
  private newPurchaseAdded = new Subject()
  private onActionClicked$ = new Subject()
  private openChallanBillingSub = new BehaviorSubject<AddCust>({ 'open': false })
  private openSaleDirectSubject = new BehaviorSubject<AddCust>({ 'open': false })
  private openPrintAddSub = new BehaviorSubject<AddCust>({ 'open': false })
  private openAddledgerGroupSub = new BehaviorSubject<AddCust>({ 'open': false })
  private openAddledgerCreationSub = new BehaviorSubject<AddCust>({ 'open': false })
  private sendDataForSearchSub = new BehaviorSubject<AddCust>({ 'open': false })
  private newRefreshSub = new Subject()
  private redirectSub = new Subject()
  private ledgerSummarySub = new BehaviorSubject<AddCust>({ 'open': false })
  private openSaleDirectReturnSubject = new BehaviorSubject<AddCust>({ 'open': false })
  private onsaleDirectActionClicked$ = new Subject()
  private onsaleDirectRetuenActionClicked$ = new Subject()
  private onPurchaseDirectReturnActionClicked$ = new Subject()
  private AfterSaveShowPrint$ = new Subject()
  public previousUrl: String;
  public currentUrl: String;
  private openConfirmationeSubJect = new BehaviorSubject<AddCust>({ 'open': false })
  private sendDataForSearchBalanceSheetSub = new BehaviorSubject<AddCust>({ 'open': false })
  private sendDataForSearcProfitLossSub = new BehaviorSubject<AddCust>({ 'open': false })
  private sendDataForSearcTradingSub = new BehaviorSubject<AddCust>({ 'open': false })
  private sendDataForSearchPurchaseSub = new BehaviorSubject<AddCust>({ 'open': false })
  private searchToggle = new BehaviorSubject<AddCust>({ 'open': false })
  private openAddServiceItemSub = new BehaviorSubject<AddCust>({ 'open': false })
  private openSaleDirectReturnSub = new BehaviorSubject<AddCust>({ 'open': false })
  private onAClickForSaleReturn$ = new Subject()
  private openPurchaseReturnSub = new BehaviorSubject<AddCust>({ 'open': false })
  private openPurchaseReturnSub$ = new Subject()
  private subjectOftermAndCondition = new BehaviorSubject<AddCust>({ 'open': false })
  private discountMasterSubect = new BehaviorSubject<AddCust>({ 'open': false })
  private setpupsChange = new Subject()
  setupChange$ = this.setpupsChange.asObservable()
  private openAddActiveInventorySub = new BehaviorSubject<AddCust>({ 'open': false })
  private openAddTaxProcessSub= new BehaviorSubject<AddCust>({ 'open': false })
  domainLogo: string = 'assets/img/logo.png';
  workdomain: string = 'Saniiro Technologies Pvt Ltd';
  isInternet: boolean = true;
  orgUserName: string
  sideMenuProfileImg: string;

  //  validation reg ex
  companyNameRegx = `^[ A-Za-z0-9_@./#&+-]*$`
  alphaNumericRegx = `^[A-Za-z0-9]+$`
  panRegx = `[A-Z]{5}[0-9]{4}[A-Z]{1}$`
  gstInRegx = `^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$`

  constructor(private router: Router, private baseService: BaseServices,
    @Inject(DOCUMENT) private _document: HTMLDocument,
    private connectionService: ConnectionService,
    private toaster: ToastrCustomService) {
    this.catchInternetConnectionEvent();
    this.setPreviousUrl();
    this.storeNoConnectionImageUrl();
    this.getLogoAndDomain();
  }

  storeNoConnectionImageUrl(){
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "../../../assets/img/no-internet-connection.png", true);
    xhr.responseType = "blob";
    xhr.onload = (event : any) => {
        const file = event.target.response;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e: any) => {
          localStorage.setItem('NO_CONNECTION_IMG_URL', e.target.result);
        };
    };
    xhr.send()
  }

  catchInternetConnectionEvent = () =>  {
    this.connectionService.monitor().subscribe(
      (isConnected) => {
        if (isConnected) {
          this.isInternet = true;
          setTimeout(() => {
            this.navigateToPreviousUrl()
          }, 5000)
        }
        else {
          this.isInternet = false;
          this.toaster.showError('', 'Network Connection Failed Please Try Again');
          this.router.navigate(['noconnection'])
        }
      })
  }

  onSetupChange () {
    this.setpupsChange.next()
  }

  public getCountry() {
    return this.baseService.getRequest(ApiConstant.BASE_URL)
  }

  openInvoice(editId) {
    this.openInvoiceSub.next({ 'open': true, 'editId': editId })
  }

  closeInvoice() {
    this.openInvoiceSub.next({ 'open': false })
  }

  getInvoiceStatus(): Observable<any> {
    return this.openInvoiceSub.asObservable()
  }

  openImport() {
    this.openImportSub.next({ 'open': true })
  }

  closeImport() {
    this.openImportSub.next({ 'open': false })
  }

  getImportStatus() {
    return this.openImportSub.asObservable()
  }

  openCust(editId, isAddNew) {
    this.openAddCustSub.next({ 'open': true, 'editId': editId, 'isAddNew': isAddNew })
  }

  closeCust(newCust) {
    if (newCust) {
      this.openAddCustSub.next({ 'open': false, 'name': newCust.name, 'id': newCust.id })
    } else {
      this.openAddCustSub.next({ 'open': false })
    }
  }

  getCustStatus() {
    return this.openAddCustSub.asObservable()
  }

  openCompositeUnit(editId) {
    this.openAddCompositeUnitAdd.next({ 'open': true, 'editId': editId })
  }

  closeCompositeUnit(newCust) {
    if (newCust) {
      this.openAddCompositeUnitAdd.next({ 'open': false, 'name': newCust.name, 'id': newCust.id })
    } else {
      this.openAddCompositeUnitAdd.next({ 'open': false })
    }
  }

  getCompositeUnitStatus() {
    return this.openAddCompositeUnitAdd.asObservable()
  }

  openItemMaster(editId, categoryId) {
    this.openAddItemMasterSub.next({ 'open': true, 'editId': editId, 'categoryId': categoryId })
  }

  closeItemMaster(newItemMaster) {
    if (newItemMaster) {
      this.openAddItemMasterSub.next({ 'open': false, 'name': newItemMaster.name, 'id': newItemMaster.id, 'categoryId': newItemMaster.categoryId })
    } else {
      this.openAddItemMasterSub.next({ 'open': false })
    }
  }

  getItemMasterStatus() {
    return this.openAddItemMasterSub.asObservable()
  }

  openVend(editId, isAddNew) {
    this.openAddVendSub.next({ 'open': true, 'editId': editId, 'isAddNew': isAddNew })
  }

  closeVend(newVend) {
    if (newVend) {
      this.openAddVendSub.next({ 'open': false, 'name': newVend.name, 'id': newVend.id, 'gstType': newVend.gstType })
    } else {
      this.openAddVendSub.next({ 'open': false })
    }
  }

  getVendStatus() {
    return this.openAddVendSub.asObservable()
  }

  openRouting(editId) {
    this.openAddRoutingSub.next({ 'open': true, 'editId': editId })
  }
  getRoutingStatus() {
    return this.openAddRoutingSub.asObservable()
  }
  closeRouting(newRouting) {
    if (newRouting) {
      this.openAddRoutingSub.next({ 'open': false, 'name': newRouting.name, 'id': newRouting.id })
    } else {
      this.openAddRoutingSub.next({ 'open': false })
    }
  }


  openCategory(editId, type) {
    this.openAddCategorySub.next({ 'open': true, 'editId': editId, 'type': type })
  }

  closeCategory(newCat) {
    if (newCat) {
      this.openAddCategorySub.next({
        'open': false,
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

  getCategoryStatus() {
    return this.openAddCategorySub.asObservable()
  }

  openUnit(editId) {
    this.openAddUnitSub.next({ 'open': true, 'editId': editId })
  }

  closeUnit(newUnit) {
    if (newUnit) {
      this.openAddUnitSub.next({ 'open': false, 'name': newUnit.name, 'id': newUnit.id, 'type': newUnit.type })
    } else {
      this.openAddUnitSub.next({ 'open': false })
    }
  }

  getUnitStatus() {
    return this.openAddUnitSub.asObservable()
  }

  openTax(editId) {
    this.openAddTaxSub.next({ 'open': true, 'editId': editId })
  }

  closeTax(newTax) {
    if (newTax) {
      this.openAddTaxSub.next({ 'open': false, 'name': newTax.name, 'id': newTax.id })
    } else {
      this.openAddTaxSub.next({ 'open': false })
    }
  }

  getTaxStatus() {
    return this.openAddTaxSub.asObservable()
  }

  openLedger(editId) {
    this.openAddLedgerSub.next({ 'open': true, 'editId': editId })
  }

  closeLedger(flg, newLedger) {
    if (!flg) {
      this.openAddLedgerSub.next({ 'open': flg, 'name': newLedger.name, 'id': newLedger.id })
    } else {
      this.openAddLedgerSub.next({ 'open': flg, 'name': newLedger.name, 'id': newLedger.id })
    }
  }

  getLedgerStatus() {
    return this.openAddLedgerSub.asObservable()
  }

  newInvoiceAdded() {
    this.newInvoiceSub.next()
  }

  getBillStatus() {
    return this.newInvoiceSub.asObservable()
  }

  categoryAdded() {
    this.newCatSub.next()
  }

  newCatStatus() {
    return this.newCatSub.asObservable()
  }

  newUnitAdded() {
    this.newUnitSub.next()
  }

  newUnitStatus() {
    return this.newUnitSub.asObservable()
  }

  newRouteAdded() {
    return this.newRouteSub.next()
  }

  newRouteStatus() {
    return this.newRouteSub.asObservable()
  }

  newSaleAdded() {
    return this.newSaleSub.next()
  }

  newSaleStatus() {
    return this.newSaleSub.asObservable()
  }

  deleteId: string
  type: string
  openDelete(id, type, title) {
    this.openDeleteSub.next({ 'open': true, 'title': title })
    this.deleteId = id
    this.type = type
  }

  closeDelete(resData) {
    if (resData) {
      this.openDeleteSub.next({ 'open': false, 'id': this.deleteId, 'type': this.type })
    } else {
      this.openDeleteSub.next({ 'open': false })
    }
  }

  getDeleteStatus() {
    return this.openDeleteSub.asObservable()
  }

  newTaxAdded() {
    this.newTaxSub.next()
  }

  getTaxAddStatus() {
    return this.newTaxSub.asObservable()
  }

  openItemImport() {
    this.openItemImportSub.next({ 'open': true })
  }

  closeItemImport() {
    this.openItemImportSub.next({ 'open': false })
  }

  getItemImportStatus() {
    return this.openItemImportSub.asObservable()
  }

  openCatImport() {
    this.openCatImportSub.next({ 'open': true })
  }

  closeCatImport() {
    this.openCatImportSub.next({ 'open': false })
  }

  getCatImportStatus() {
    return this.openCatImportSub.asObservable()
  }

  onAddCatImport() {
    this.newImportCatAdded.next()
  }

  onAddItemMaster() {
    this.newItemAdded.next()
  }

  addItemMasterSub() {
    return this.newItemAdded.asObservable()
  }

  onCatOrSubCatAdded(obj) {
    this.newCatOrSubCatAdded.next({ 'id': obj.id, 'name': obj.name })
  }

  getNewCatOrSubCatStatus() {
    return this.newCatOrSubCatAdded.asObservable()
  }

  openSaleReturn(editId) {
    this.openSaleReturnSub.next({ 'open': true, 'editId': editId })
  }

  closeSaleReturn() {
    this.openSaleReturnSub.next({ 'open': false })
  }

  getSaleReturnStatus(): Observable<any> {
    // //console.log('status called')
    return this.openSaleReturnSub.asObservable()
  }

  newCompositeUnitAdd() {
    this.newCompositeAdded.next()
  }

  getNewCompositeAddedStatus() {
    return this.newCompositeAdded.asObservable()
  }

  newPurchaseAdd() {
    this.newPurchaseAdded.next()
  }

  getNewPurchaseAddedStatus() {
    return this.newPurchaseAdded.asObservable()
  }

  getSettingById(id) {
    return this.baseService.getRequest(ApiConstant.GET_SETTING_BY_ID + id)
  }

  // getSaleSettings () {
  //   return this.baseService.getRequest(ApiConstant.SETTING_SETUP_BY_TYPE + 'sale')
  // }

  getSaleDetail(queryParams) {
    return this.baseService.getRequest(ApiConstant.SALE_TRVEL_DETAIL_URL + queryParams)
  }

  getPaymentLedgerDetail(id) {
    return this.baseService.getRequest(ApiConstant.LEDGER_DETAIL_URL + '?Glid=' + id)
  }

  getPaymentModeDetail() {
    return this.baseService.getRequest(ApiConstant.PAYMENT_MODE_DETAIL_URL)
  }

  getCountryList() {
    return this.baseService.getRequest(ApiConstant.COUNTRY_LIST)
  }

  openAttribute(data, isSubAttr) {
    this.openAddAttributeSub.next({ 'open': true, 'isSubAttr': isSubAttr, 'data': data })
  }
  getAttributeStatus() {
    return this.openAddAttributeSub.asObservable()
  }
  closeAttributeForDynamicAdd(attribute) {
    if (attribute) {
      this.openAddAttributeSub.next({ 'open': false, 'status': attribute.status, 'name': attribute.name, 'id': attribute.id, 'AttributeId': attribute.AttributeId })
    } else {
      this.openAddAttributeSub.next({ 'open': false })
    }
  }
  closeAttributePopup() {
    this.openAddAttributeSub.next({ 'open': false })
  }
  closeAttribute(data) {
    if (data) {
      this.openAddAttributeSub.next({ 'open': false, 'name': data.name, 'id': data.id })
    } else {
      this.openAddAttributeSub.next({ 'open': false })
    }
  }
  closeAttributeStatus() {
    return this.openAddAttributeSub.asObservable()
  }

  closeActiveInventoryPopup() {
    this.openAddActiveInventorySub.next({ 'open': false })
  }
  closeActiveInventory(data) {
    if (data) {
      this.openAddActiveInventorySub.next({ 'open': false, 'name': data.name, 'id': data.id })
    } else {
      this.openAddActiveInventorySub.next({ 'open': false })
    }
  }

  openActiveInventory(data, isSubAttr) {
    this.openAddActiveInventorySub.next({ 'open': true, 'isSubAttr': isSubAttr, 'data': data })
  }
  getActiveInventoryStatus() {
    return this.openAddActiveInventorySub.asObservable()
  }

  closeActiveInventoryForDynamicAdd(attribute) {
    if (attribute) {
      this.openAddActiveInventorySub.next({ 'open': false, 'status': attribute.status, 'name': attribute.name, 'id': attribute.id, 'AttributeId': attribute.AttributeId })
    } else {
      this.openAddActiveInventorySub.next({ 'open': false })
    }
  }
  closeActiveInventoryStatus() {
    return this.openAddActiveInventorySub.asObservable()
  }
  getsettingforOrgnizationData(orgid, forSaleType, date) {
    return this.baseService.getRequest(ApiConstant.SETTING_FOR_ORGNIZATION_DATA + orgid + '&TransDate=' + date + '&TransactionType=' + forSaleType)
  }
  openAddress(leaderId) {
    this.openAddressAddSub.next({ 'open': true, 'ledgerId': leaderId })
  }

  closeAddress(address) {
    if (address) {
      this.openAddressAddSub.next({ 'open': false, 'name': address.name, 'id': address.id, 'stateId': address.stateId })
    } else {
      this.openAddressAddSub.next({ 'open': false })
    }
  }

  public addAreaNameUnderCity(param) {
    return this.baseService.postRequest(ApiConstant.ADD_AREA_UNDER_CITY_ID, param)
  }
  public searchCountryByName(name) {
    return this.baseService.getRequest(ApiConstant.SEARCH_COUNTRY_BY_ID_AND_NAME + name)
  }

  getAddressStatus() {
    return this.openAddressAddSub.asObservable()
  }

  // getSaleChallanSettings () {
  //   return this.baseService.getRequest(ApiConstant.SETTING_SALE_CHALLAN)
  // }
  getSaleChallanInitializeData() {
    return this.baseService.getRequest(ApiConstant.SALE_CHALLAN_GET_TYPEBY_SALE_DATA)
  }

  getAddressByIdOfCustomer(parentId, ParentTypeId) {
    return this.baseService.getRequest(ApiConstant.GET_ADDRESS_OF_CUSTOMER_BY_ID_FOR_SAL_ECHALLAN + parentId + '&ParentTypeId=' + ParentTypeId)

  }
  postSaleChallan(param) {
    return this.baseService.postRequest(ApiConstant.POST_SALE_CHALLAN, param)
  }
  public getItemByCategoryId(id) {
    return this.baseService.getRequest(ApiConstant.GET_ITEM_BY_CATEGORY_URL + id)
  }

  getAllDataOfSaleChallan(queryParams) {
    return this.baseService.getRequest(ApiConstant.GET_ALL_DETAILS_SALE_CHALLAN_URL + queryParams)

  }
  printAndEditSaleChallan(id) {
    return this.baseService.getRequest(ApiConstant.GET_PRINT_SALE_CHALLAN_URL + id)

  }
  public postAddNewAddress(param) {
    return this.baseService.postRequest(ApiConstant.POST_NEW_ADDRESS, param)
  }
  public saleEditChallan(id) {
    return this.baseService.getRequest(ApiConstant.GET_PRINT_SALE_CHALLAN_URL + id)
  }

  public allsetupSettingAPI() {
    return this.baseService.getRequest(ApiConstant.ALL_SETUP_SETTING)
  }

  public excelForCouirerParcelData() {
    return this.baseService.getRequest(ApiConstant.GET_EXCEL_API_FOR_DATA)
  }

  public attributeData() {
    return this.baseService.getRequest(ApiConstant.GET_ATTRIBUTE_SALE_CHALLAN_DATA)
  }

  openPurchase(editId, id?) {
    this.openPurchaseAddSub.next({ 'open': true, 'editId': editId, 'id': id })
  }

  getPurchaseStatus() {

    return this.openPurchaseAddSub.asObservable()
  }
  closePurchase() {
    this.openPurchaseAddSub.next({ 'open': false })
  }
  closePurchaseDirectReturn() {
    this.openPurchaseDirectReturnAddSub.next({ 'open': false })
  }
  openPurchaseDirectReturn(editId) {
    this.openPurchaseDirectReturnAddSub.next({ 'open': true, 'editId': editId })
  }

  getPurchaseDirectReturnStatus() {
    return this.openPurchaseDirectReturnAddSub.asObservable()
  }


  openSaleReturnDirect(editId) {
    this.openSaleReturnDirectAddSub.next({ 'open': true, 'editId': editId })
  }

  getSaleReturnDirectStatus() {

    return this.openSaleReturnDirectAddSub.asObservable()
  }

  closeSaleReturnDirect() {
    this.openSaleReturnDirectAddSub.next({ 'open': false })
  }

  getModuleSettings(name) {
    return this.baseService.getRequest(ApiConstant.GET_MODULE_SETTING + name)
  }

  getSPUtilityData(type) {
    return this.baseService.getRequest(ApiConstant.SPUTILITY + type)
  }

  setupSettingByType(type) {
    return this.baseService.getRequest(ApiConstant.SETTING_SETUP_BY_TYPE + type)
  }

  getAllCategories() {
    return this.baseService.getRequest(ApiConstant.GET_SAVE_AND_UPDATE_CATEGORY_URL)
  }

  onActionClicked(action) {
    this.onActionClicked$.next(action)
  }

  getActionClickedStatus() {
    return this.onActionClicked$.asObservable()
  }
  onsaleDirectActionClicked(action) {
    this.onsaleDirectActionClicked$.next(action)
  }

  getSaleDirectActionClickedStatus() {
    return this.onsaleDirectActionClicked$.asObservable()
  }
  onsaleReturnDirectActionClicked(action) {
    this.onsaleDirectRetuenActionClicked$.next(action)
  }

  getSaleReturnDirectActionClickedStatus() {
    return this.onsaleDirectRetuenActionClicked$.asObservable()
  }


  AfterSaveShowPrint(action) {
    this.AfterSaveShowPrint$.next(action)
  }

  AfterSaveShowPrintStatus() {
    return this.AfterSaveShowPrint$.asObservable()
  }


  getBranchTypeList = () => {
    return this.baseService.getRequest(ApiConstant.BRANCH_TYPE_LIST_URL)
  }

  /* Function to allow numeric input only for input type text  ----b */
  isNumber(evt, checkZeroAtBegin?, mobileNo?) {
    evt = (evt) ? evt : window.event
    const charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57) || (checkZeroAtBegin && !mobileNo && charCode === 48)) {
      return false
    }
  }

  allowOnlyNumericValueToPaste(e, cb) {
    setTimeout(() => {
      cb(e.clipboardData.getData('text/plain').replace(/\D/g, ''))
    }, 0);
  }

  notAllowSpace(evt) {
    const charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode === 32) {
      return false;
    }
  }

  /* Function to get industry type list ----b */
  getIndustryType = () => {
    return this.baseService.getRequest(ApiConstant.ORG_INDUSTRY)
  }

  /* Function to get key person type type list ----b */
  getPersonType = () => {
    return this.baseService.getRequest(ApiConstant.KEY_PERSON_TYPE_LIST_URL)
  }

  /* Fucntion to get accounting method list ----b */
  getAccountingMethod = () => {
    return this.baseService.getRequest(ApiConstant.ACCOUNTING_METHOD_LIST_URL)
  }

  getFinYearIdList = () => {
    return this.baseService.getRequest(ApiConstant.FIN_YEAR)
  }

  getTransactionSession = () => {
    return this.baseService.getRequest(ApiConstant.TRANS_SESSION)
  }

  getTransactionFormat = () => {
    return this.baseService.getRequest(ApiConstant.TRANS_FORMAT)
  }

  getTransactionPosition = () => {
    return this.baseService.getRequest(ApiConstant.TRANS_POSITION)
  }

  getFinSessionList() {
    return this.baseService.getRequest(ApiConstant.FIN_SESSION)
  }

  openSaleDirect(editId, flag) {
    this.openSaleDirectSubject.next({ 'open': true, 'editId': editId, 'isAddNew': flag })
  }

  closeSaleDirect() {
    this.openSaleDirectSubject.next({ 'open': false })
  }

  getSaleDirectStatus(): Observable<any> {

    return this.openSaleDirectSubject.asObservable()
  }
  postSaleDirectAPI(input) {
    return this.baseService.postRequest(ApiConstant.SALE_DIRECT_BILLING_API, input)
  }
  getListSaleDirect(queryParams) {
    return this.baseService.getRequest(ApiConstant.SALE_DIRECT_BILLING_API + queryParams)
  }

  openPrint(id, type, isViewPrint) {
    this.openPrintAddSub.next({ 'open': true, 'id': id, 'type': type, 'isViewPrint': isViewPrint })
  }

  closePrint(address) {
    if (address) {
      this.openPrintAddSub.next({ 'open': false, 'name': address.name, 'id': address.id })
    } else {
      this.openPrintAddSub.next({ 'open': false })
    }
  }
  getprintStatus() {
    return this.openPrintAddSub.asObservable()
  }
  printDirectSale(id) {
    return this.baseService.getRequest(ApiConstant.DIRECT_SALE_PRINT_API + id)

  }
  printSaleReturn(id) {
    return this.baseService.getRequest(ApiConstant.PRINT_SALE_RETURN + id)

  }
  printPurchaseReturn(id) {
    return this.baseService.getRequest(ApiConstant.PRINT_PURCHASE_RETURN + id)

  }


  getSaleDirectEditData(id) {
    return this.baseService.getRequest(ApiConstant.DIRECT_SALE_EDIT_GET_API + id)
  }

  getReportItemStock(data) {
    const url = `${ApiConstant.REPORT_ITEM_STOCK}?CategoryId=${data.CategoryId}&FromDate=${data.FromDate}&ToDate=${data.ToDate}&AttributeSearch=${data.AttributeSearch}&ItemId=${data.ItemId}&UnitId=${data.UnitId}&Page=${data.Page}&Status=${data.Status}&Size=${data.Size}`;
    return this.baseService.getRequest(url)
  }

  postSaleChallanBillingAPI(input) {
    return this.baseService.postRequest(ApiConstant.POST_ALL_SLECTED_CHALLAN_BILL_API, input)
  }

  getSaleChallanSettings(type) {
    return this.baseService.getRequest(ApiConstant.SETTING_SETUP_BY_TYPE + type)
  }

  openChallanBill(data, challanNos) {
    this.openChallanBillingSub.next({ 'open': true, 'data': data, 'challanNos': challanNos })
  }

  closeChallanBill() {
    this.openChallanBillingSub.next({ 'open': false })
  }

  getChallanBillStatus(): Observable<any> {
    return this.openChallanBillingSub.asObservable()
  }
  getChallanDataByIdForBilling(id) {
    return this.baseService.getRequest(ApiConstant.GET_CHALLAN_DETAILS_FOR_BILLING_BY_ID + id)
  }

  getSaleTravelDetail() {
    return this.baseService.getRequest(ApiConstant.SALE_TRVEL_DETAIL_URL)
  }

  ledgerGetGSTByAddress = (Leaderid) => {
    return this.baseService.getRequest(ApiConstant.LEDGER_GET_ADDRESS_FOR_GST + Leaderid)
  }
  onChangeSlabGetTaxRate(slabId) {
    return this.baseService.getRequest(ApiConstant.EDIT_TAX_BY_ID_URL + slabId)
  }
  getModulesettingAPI(type) {
    return this.baseService.getRequest(ApiConstant.GET_MODULE_SETTING + type)
  }
  barcodeAPIForSale(billDate,barcode,ItemId, CustomerId,mobileIMEi_id) {
    return this.baseService.getRequest(ApiConstant.GET_ITEM__RATE_BY_ITEMID_CUSTOMERID_SETTING + ItemId + '&Barcode='+barcode +'&Ledgerid=' + CustomerId+'&BillDate='+billDate+'&ItemPropertyTransIds='+mobileIMEi_id)
  }
  barcodeAPI(billDate,barcode,ItemId, CustomerId) {
    return this.baseService.getRequest(ApiConstant.GET_ITEM__RATE_BY_ITEMID_CUSTOMERID_SETTING + ItemId + '&Barcode='+barcode +'&Ledgerid=' + CustomerId+'&BillDate='+billDate)
  }
  barcodeAPIReturn(billDate,barcode,ItemId, CustomerId,type) {
    return this.baseService.getRequest(ApiConstant.GET_ITEM__RATE_BY_ITEMID_CUSTOMERID_SETTING + ItemId + '&Barcode='+barcode +'&Ledgerid=' + CustomerId+'&BillDate='+billDate+'&TransType='+type)
  }
  getItemRateByLedgerAPI(ItemId, CustomerId) {
    return this.baseService.getRequest(ApiConstant.GET_ITEM__RATE_BY_ITEMID_CUSTOMERID_SETTING + ItemId + '&Ledgerid='+ CustomerId)
  }

  getSearchItemStock(getSearchItemStock) {
    this.baseService.postRequest(ApiConstant.REPORT_ITEM_STOCK + '?=AttributeSearch', getSearchItemStock)
  }

  /**
   * Gets form dependency - get a form dependency
   * @param name - form name
   * @returns - observable
   */
  getFormDependency(name) {
    return this.baseService.getRequest(ApiConstant.GET_DEPENDENCY_FOR_FORM + name)
  }

  /**
   * Checks for existence - Created by Dolly Garg
   * @param checkForExistence - array returned from backend
   * @param others - the top data of each form
   * @returns Observable
   */
  checkForExistence(checkForExistence, others): Observable<any> {
    checkForExistence.forEach(element => {
      if (!element.IsIdentity) {
        element.FieldValue = others[element.FormKeyName]
      }
    })
    //console.log('checkForExistence : ', checkForExistence)
    let obj = {
      ExistencyNames: checkForExistence
    }
    //console.log('existency : ', JSON.stringify(obj))
    return this.baseService.postRequest(ApiConstant.CHECK_FOR_EXISTENCE, obj)
  }

  /**
   * Fixs table hf - Created by Dolly Garg
   * @param classname - the table class name
   */
  fixTableHF(classname) {
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
  fixTableHFL(classname) {
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
  getLastBillNo(type, date, orgNo) {
    return this.baseService.getRequest(ApiConstant.GET_NEW_BILL_NO_MANUAL + 'Type=' + type + '&BillDate=' + date + '&OrgId=' + orgNo)
  }
  getBankList(queryParams) {
    return this.baseService.getRequest(ApiConstant.BANK_DETAIL_URL + queryParams)
  }
  getEditbankDetails(id) {
    return this.baseService.getRequest(ApiConstant.EDIT_BANK_DATA + id)
  }
  deleteBankDetails(id) {
    return this.baseService.deleteRequest(ApiConstant.BANK_DETAIL_URL + '?id=' + id)
  }
  obj: any

  openledgerGroup(editId, type) {
    this.openAddledgerGroupSub.next({ 'open': true, 'editId': editId, 'type': type })
  }

  closeledgerGroup(LegerGroup) {
    if (LegerGroup) {
      this.openAddledgerGroupSub.next({
        'open': false,
        'name': LegerGroup.name,
        'id': LegerGroup.id,
        'type': LegerGroup.type,
        'parentId': LegerGroup.parentId,
        'headId': LegerGroup.headId
      })
    } else {
      this.openAddledgerGroupSub.next({ 'open': false })
    }
  }

  getledgerGroupStatus() {
    return this.openAddledgerGroupSub.asObservable()
  }

  getledgerCretionStatus() {
    return this.openAddledgerCreationSub.asObservable()
  }
  openledgerCretion(editId, isOtherCharge) {
    this.openAddledgerCreationSub.next({ 'open': true, 'editId': editId, 'isOtherCharge': isOtherCharge })
  }

  closeledgerCretion(newItemMaster) {
    if (newItemMaster) {
      this.openAddledgerCreationSub.next({ 'open': false, 'name': newItemMaster.name, 'id': newItemMaster.id })
    } else {
      this.openAddledgerCreationSub.next({ 'open': false })
    }
  }


  public postLedgerGroupAPI(parms: any): Observable<any> {
    return this.baseService.postRequest(ApiConstant.LEDGER_GROUP_API, parms)
  }

  public getLedgerGroupParentData(type) {
    return this.baseService.getRequest(ApiConstant.LEDGER_GROUP_PARENT_DATA_API + type)
  }
  public getLedgerGroupAPI(queryParams): Observable<any> {
    return this.baseService.getRequest(ApiConstant.LEDGER_GROUP_API + queryParams)
  }
  deleteLedgerGroup(id) {
    return this.baseService.deleteRequest(ApiConstant.LEDGER_GROUP_API + id)
  }
  gstNumberRegxValidation(gstNumber) {
    let regxGST = /^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/
    return regxGST.test(gstNumber)
  }

  panNumberRegxValidation(panNumber) {
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
  getCustomer = (id) => {
    return this.baseService.getRequest(`${ApiConstant.LEDGER_DETAIL_URL+'?Glid='+id}`)
  }

  getBalanceSheetList(todate, fromdate) {
    return this.baseService.getRequest(ApiConstant.BALANCE_SHEET_API + '?OnDate=' + fromdate + '&ToDate=' + todate)
  }

  getOpeningStkList() {
    return this.baseService.getRequest(ApiConstant.OPENING_STK);
  }


  postOpeningStkList(data) {
    return this.baseService.postRequest(ApiConstant.OPENING_STK, data);
  }


  getsearchByDateForBalancesheetStatus() {
    return this.sendDataForSearchBalanceSheetSub.asObservable()
  }
  searchByDateForBalancesheet(todate, fromdate) {
    this.sendDataForSearchBalanceSheetSub.next({ 'open': true, 'toDate': todate, 'fromDate': fromdate })
  }
  getsearchByDateForProfitLossStatus() {
    return this.sendDataForSearcProfitLossSub
  }
  searchByDateForProfitLoss(todate, fromdate) {
    this.sendDataForSearcProfitLossSub.next({ 'open': true, 'toDate': todate, 'fromDate': fromdate })
  }
  getsearchByDateForTradingStatus() {
    return this.sendDataForSearcTradingSub
  }
  searchByDateForTrading(todate, fromdate) {
    this.sendDataForSearcTradingSub.next({ 'open': true, 'toDate': todate, 'fromDate': fromdate })
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
  itemSalePurchaseReportDetails(type, LedgerId, CategoryId, ItemId, FromDate, ToDate, BatchNo, Pagenumber, Size) {
    return this.baseService.getRequest(ApiConstant.REPORT_ITEM_SALE_PURCHASE + type + '&LedgerId=' + LedgerId + '&CategoryId=' + CategoryId + '&ItemId=' + ItemId + '&FromDate=' + FromDate + '&ToDate=' + ToDate + '&BatchNo=' + BatchNo + '&Page=' + Pagenumber + '&Size=' + Size)

  }
  getSearchForStatus() {
    return this.sendDataForSearchSub.asObservable()
  }
  searchByDateForItemSale(todate, fromDate, batchNo, categoryId, itemId, ledgerId) {
    this.sendDataForSearchSub.next({ 'open': true, 'itemId': itemId, 'ledgerId': ledgerId, 'categoryId': categoryId, 'toDate': todate, 'fromDate': fromDate, 'batchNo': batchNo })
  }
  getSearchForPurchaseStatus() {
    return this.sendDataForSearchPurchaseSub.asObservable()
  }
  searchByDateForPurchaseItemSale(todate, fromDate, batchNo, categoryId, itemId, ledgerId) {
    this.sendDataForSearchPurchaseSub.next({ 'open': true, 'itemId': itemId, 'ledgerId': ledgerId, 'categoryId': categoryId, 'toDate': todate, 'fromDate': fromDate, 'batchNo': batchNo })
  }
  getProfitAndLossList(todate, fromdate) {
    return this.baseService.getRequest(ApiConstant.ACCOUNT_PROFIT_AND_LOSS_BY_DATE + '?OnDate=' + fromdate + '&ToDate=' + todate)
  }

  getTradingList(todate, fromdate) {
    return this.baseService.getRequest(ApiConstant.ACCOUNT_TRADING_BY_DATE + '?OnDate=' + fromdate + '&ToDate=' + todate)
  }

  openVoucher(editId) {
    this.openVoucherAddSub.next({ 'open': true, 'editId': editId })
  }

  getVoucherStatus() {
    return this.openVoucherAddSub.asObservable()
  }

  closeVoucher() {
    this.openVoucherAddSub.next({ 'open': false })
  }
  AddedItem() {
    this.newRefreshSub.next()
  }

  newRefreshItemStatus() {
    return this.newRefreshSub.asObservable()
  }

  newVoucherAdd() {
    this.newVoucherAdded.next()
  }

  getNewVoucherAddedStatus() {
    return this.newVoucherAdded.asObservable()
  }

  getCurrentDate() {
    return this.baseService.getRequest(ApiConstant.GET_CURRENT_DATE)
  }


  getCommonMenu(code) {
    const url = `${ApiConstant.COMMON_MENU_CODE}?CommonCode=${code}`
    return this.baseService.getRequest(url).pipe(map((response) => {
      return response.Data[0];
    })).toPromise();
  }

  getCommonMenuDataList(code, id?) {
    const url = `${ApiConstant.COMMON_MASTER_MENU}?CommonCode=${code}&Id=${id}`
    return this.baseService.getRequest(url);
  }

  postCommonMenuFormData(data) {
    return this.baseService.postRequest(ApiConstant.COMMON_MASTER_MENU, data);
  }

  deleteCommonMenu(code, id) {
    return this.baseService.deleteRequest(`${ApiConstant.COMMON_MASTER_MENU}?CommonCode=${code}&Id=${id}`);
  }

  getTransationNumberList(data, transactionFor) {
    data.FinYearId = data.FinYearId ? data.FinYearId : 0
    data.OrgId = data.OrgId ? data.OrgId : 0
    return this.baseService.getRequest(`${ApiConstant.TRANSACTIONNO_VOUCHER}?FinYearId=${data.FinYearId}&OrgId=${data.OrgId}&TransactionFor=${transactionFor}`)
  }

  postTransactionNumberList(data) {
    return this.baseService.postRequest(ApiConstant.TRANSACTIONNO_VOUCHER, data);
  }

  postFinacialYearCreationData(data) {
    return this.baseService.postRequest(ApiConstant.FINANCE_CREATE, data);
  }
  name: any
  openConfirmation(type, title) {
    this.openConfirmationeSubJect.next({ 'open': true, 'title': title, 'name': type })
    this.name = type
  }

  closeConfirmation(resData) {
    if (resData) {
      this.openConfirmationeSubJect.next({ 'open': false, 'name': this.name, 'type': resData.type })
    } else {
      this.openConfirmationeSubJect.next({ 'open': false })
    }
  }

  getConfirmationStatus() {
    return this.openConfirmationeSubJect.asObservable()
  }

  openSearchToggle(editId) {
    this.searchToggle.next({ 'open': true, 'editId': editId })
  }

  searchTogglestatus() {
    return this.searchToggle.asObservable()
  }

  searchToggleClose() {
    this.searchToggle.next({ 'open': false })
  }
  //


  private querySaleStrSub = new Subject<string>()
  public querySaleStr$ = this.querySaleStrSub.asObservable()
  setSearchQueryParamsStr(str) {
    this.querySaleStrSub.next(str)
  }

  word: string = ''
  NumInWords(value) {
    let fraction = Math.round(this.frac(value) * 100)
    let fText = ''

    if (fraction > 0) {
      fText = 'AND ' + this.convertNumber(fraction) + ' PAISE'
    }

    return this.convertNumber(value) + '  ' + fText + ' Only'
  }

  frac(f) {
    return f % 1
  }

  convertNumber(num1) {
    if ((num1 < 0) || (num1 > 999999999)) {
      return 'Number not count !!-Sysytem issue'
    }
    let Gn = Math.floor(num1 / 10000000)  /* Crore */
    num1 -= Gn * 10000000
    let kn = Math.floor(num1 / 100000)     /* lakhs */
    num1 -= kn * 100000
    let Hn = Math.floor(num1 / 1000)      /* thousand */
    num1 -= Hn * 1000
    let Dn = Math.floor(num1 / 100)       /* Tens (deca) */
    num1 = num1 % 100               /* Ones */
    let tn = Math.floor(num1 / 10)
    let one = Math.floor(num1 % 10)
    this.word = ''

    if (Gn > 0) {
      this.word += (this.convertNumber(Gn) + ' Crore')
    }
    if (kn > 0) {
      this.word += (((this.word === '') ? '' : ' ') +
        this.convertNumber(kn) + ' Lakh')
    }
    if (Hn > 0) {
      this.word += (((this.word === '') ? '' : ' ') +
        this.convertNumber(Hn) + ' Thousand')
    }

    if (Dn) {
      this.word += (((this.word === '') ? '' : ' ') +
        this.convertNumber(Dn) + ' Hundred')
    }

    let ones = Array('', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', ' Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen')
    let tens = Array('', '', 'Twenty', 'Thirty', 'Fourty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety')

    if (tn > 0 || one > 0) {
      if (!(this.word === '')) {
        this.word += ' And '
      }
      if (tn < 2) {
        this.word += ones[tn * 10 + one]
      } else {

        this.word += tens[tn]
        if (one > 0) {
          this.word += ('-' + ones[one])
        }
      }
    }

    if (this.word === '') {
      this.word = ' zero'
    }
    return this.word
  }


  getStateByGStCode(statecode) {
    return this.baseService.getRequest(ApiConstant.CHECK_GST_FOR_STATE + statecode)
  }
  getReportItemInventory(data) {
    const url = `${ApiConstant.GET_ITEM_REPORT_INVENTORY}?CategoryId=${data.CategoryId}&FromDate=${data.FromDate}&ToDate=${data.ToDate}&ItemId=${data.ItemId}&Page=${data.Page}&Size=${data.Size}&Type=${data.Type}`;
    return this.baseService.getRequest(url)
  }
  getTrailBalanceReport(fromadate, todate) {
    return this.baseService.getRequest(`${ApiConstant.GET_REPORT_TRAIL_BALANCE}?OnDate=${fromadate}&ToDate=${todate}`)
  }

  getOutStanding(data) {
    const url = `${ApiConstant.REPORT_OUT_STANDING}?ReportFor=${data.TypeWise}&FromAmount=${data.ToAmount}&ToAmount=${data.ToAmount}&FromDate=${data.FromDate}&ToDate=${data.ToDate}&LedgerId=${data.LedgerId}&Page=${data.Page}&Size=${data.Size}&Type=${data.Type}`;
    return this.baseService.getRequest(url)
  }

  getCashBook(data) {
    const url = `${ApiConstant.REPORT_CASHBOOK}?FromDate=${data.FromDate}&ToDate=${data.ToDate}&Page=${data.Page}&Size=${data.Size}&Type=${data.Type}`;
    return this.baseService.getRequest(url)
  }
  getDayBook(data) {
    const url = `${ApiConstant.REPORT_DAYBOOK}?FromDate=${data.FromDate}&ToDate=${data.ToDate}&Page=${data.Page}&Size=${data.Size}&Type=${data.type}`;
    return this.baseService.getRequest(url)
  }
  cancelSale(id) {
    return this.baseService.deleteRequest(ApiConstant.SALE_DIRECT_BILLING_API + '?id=' + id)
  }
  cancelPurchase(id) {
    return this.baseService.deleteRequest(ApiConstant.PURCHASE_LIST + '?id=' + id)
  }
  cancelserviceBilling(id) {
    return this.baseService.deleteRequest(ApiConstant.SERVICE_BILLING_API + '?id=' + id)
  }
  getBankBookReport(data) {
    const url = `${ApiConstant.REPORT_BANKBOOK}?FromDate=${data.FromDate}&ToDate=${data.ToDate}&Page=${data.Page}&Size=${data.Size}&Type=${data.Type}`;
    return this.baseService.getRequest(url)
  }

  getSalePurchaseRegisterReport(data) {
    const url = `${ApiConstant.REPORT_SALE_PURCHASE_REGISTER}?FromDate=${data.FromDate}&ToDate=${data.ToDate}&Page=${data.Page}&Size=${data.Size}&Type=${data.Type}`;
    return this.baseService.getRequest(url)
  }
  getReportItemByCategorySale2(data) {
    const url = `${ApiConstant.REPORT_ITEM_BY_CATEGORY_SALE_DATA}?Type=${data.Type}&Page=${data.Page}&Size=${data.Size}`;
    return this.baseService.getRequest(url)
  }
  getReportItemByCategorySale(data) {
    const url = `${ApiConstant.REPORT_ITEM_BY_CATEGORY_SALE_DATA}?CategoryId=${data.CategoryId}&ToDate=${data.ToDate}&Type=${data.Type}&FromDate=${data.FromDate}&Page=${data.Page}&Size=${data.Size}`;
    return this.baseService.getRequest(url)
  }
  getReporSalePurchaserSummary(data) {
    const url = `${ApiConstant.REPORT_SALE_PURCHASE_SUMMARY}?ReportFor=${data.ReportFor}&FromDate=${data.FromDate}&ToDate=${data.ToDate}&Page=${data.Page}&Size=${data.Size}&Type=${data.Type}`;
    return this.baseService.getRequest(url)

  }


  getBankBook(data) {
    const url = `${ApiConstant.REPORT_BANKBOOK}?FromDate=${data.FromDate}&ToDate=${data.ToDate}&Page=${data.Page}&Size=${data.Size}&Type=${data.Type}`;
    return this.baseService.getRequest(url)
  }
  // getJournalRegisterReport (data){
  //   const url = `${ApiConstant.LEDGER_SUMMARY}?VoucherType=104&FromDate=${data.FromDate}&ToDate=${data.ToDate}&Page=${data.Page}&Size=${data.Size}&Type=${data.Type}`;
  //   return this.baseService.getRequest(url)
  // }

  getJournalRegisterReport(data) {
    const url = `${ApiConstant.REPORT_DAYBOOK}?FromDate=${data.FromDate}&ToDate=${data.ToDate}&Page=${data.Page}&Size=${data.Size}&Type=${data.type}`;
    return this.baseService.getRequest(url)
  }

  openServiceItem(editId, catId) {
    this.openAddServiceItemSub.next({ 'open': true, 'editId': editId, 'categoryId': catId })
  }

  closeServiceItem(newItemMaster) {
    if (newItemMaster) {
      this.openAddServiceItemSub.next({ 'open': false, 'name': newItemMaster.name, 'id': newItemMaster.id, 'categoryId': newItemMaster.categoryId })
    } else {
      this.openAddServiceItemSub.next({ 'open': false })
    }
  }

  getServiceItemStatus() {
    return this.openAddServiceItemSub.asObservable()
  }

  getServiceItemListData(queryParams) {
    return this.baseService.getRequest(ApiConstant.SERVICE_ITEM_MASTER + queryParams)
  }
  PostServiceItemMaster(param) {
    return this.baseService.postRequest(ApiConstant.SERVICE_ITEM_MASTER, param)
  }
  getEditServiceItemMaster(id) {
    return this.baseService.getRequest(ApiConstant.SERVICE_EDIT_ITEM_MASTER + '?id=' + id)
  }


  ledgerSummaryStatus() {
    return this.ledgerSummarySub.asObservable()
  }
  ledgerSummary(ledgerid, name) {
    this.ledgerSummarySub.next({ 'open': true, 'id': ledgerid, 'name': name })
  }
  closeRedirectLegderSummary(flag) {
    this.ledgerSummarySub.next({ 'open': flag })
  }
  openSaleDirectReturnStatus() {
    return this.openSaleDirectReturnSubject.asObservable()
  }
  openSaleDirectReturn2(id, htmlid) {
    this.openSaleDirectReturnSubject.next({ 'open': true, 'id': id, 'name': htmlid })
  }

  openSaleDirectReturn(editId, type) {
    this.openSaleDirectReturnSub.next({ 'open': true, 'editId': editId, 'type': type })
  }

  getSaleDirectReturnStatus() {

    return this.openSaleDirectReturnSub.asObservable()
  }

  closeSaleDirectReturn() {
    this.openSaleDirectReturnSub.next({ 'open': false })
  }
  onActionSaleReturnClicked(action) {
    this.onAClickForSaleReturn$.next(action)
  }

  getActionSaleReturnClickedStatus() {
    return this.onAClickForSaleReturn$.asObservable()
  }

  //purchase -return
  openPurchaseReturn(editId) {
    this.openPurchaseReturnSub.next({ 'open': true, 'editId': editId })
  }

  getPurchaseReturnStatus() {

    return this.openPurchaseReturnSub.asObservable()
  }

  closePurchaseReturn() {
    this.openPurchaseReturnSub.next({ 'open': false })
  }

  onActionPurchaseClicked(action) {
    this.openPurchaseReturnSub$.next(action)
  }

  onActionPurchaseClickedStatus() {
    return this.openPurchaseReturnSub$.asObservable()
  }
  getGstrAnxList(data) {
    const url = `${ApiConstant.GSTR_AN_X}?FromDate=${data.FromDate}&ToDate=${data.ToDate}&Type=${data.Type}`;
    return this.baseService.getRequest(url)
  }

  getGstrSummaryList(query) {
    const queryParam = this.getQueryStringFromObject(query);
    return this.baseService.getRequest(`${ApiConstant.GSTR_REPORT}?${queryParam}`);
  }

  getGstrAnxDetails(data) {
    const queryParam = this.getQueryStringFromObject(data);
    return this.baseService.getRequest(`${ApiConstant.GSTR_AN_X_DETAILS}?${queryParam}`);
  }

  getQueryStringFromObject(obj) {
    const str = [];
    for (const p in obj) {
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
      }
    }
    return str.join('&');
  }

  openTermAndCondition(editId) {
    this.subjectOftermAndCondition.next({ 'open': true, 'editId': editId })
  }
  getTermAndConditionStatus() {
    return this.subjectOftermAndCondition.asObservable()
  }
  openDiscountMaster(editId, isOpenForm,DiscountData,EditData) {
    this.discountMasterSubect.next({ 'open': true, 'editId': editId, 'type': isOpenForm ,'discountParam':DiscountData ,'editData':EditData})
  }
  openDiscountMasterStatus() {
    return this.discountMasterSubect.asObservable()
  }

  closeDiscountMaster(discountData) {
    if (discountData) {
      this.discountMasterSubect.next({ 'open': false, 'data':discountData  })
    } else {
      this.discountMasterSubect.next({ 'open': false })
    }
  }
  gettermsAndCondtionType(type) {
    return this.baseService.getRequest(ApiConstant.TERMS_CONDITION_FORM_TYPE + type)
  }
  postTermsAndCondition(param) {
    return this.baseService.postRequest(ApiConstant.TERMS_CONDITION_POST, param)
  }
  getListData(param) {
    return this.baseService.getRequest(ApiConstant.TERMS_CONDITION_POST)
  }
  changeTypeTermsAndCondition(id) {
    return this.baseService.getRequest(ApiConstant.TERMS_CONDITION_POST + '?ParentTypeId=' + id)
  }

  getMsmedList(data) {
    const queryParam = this.getQueryStringFromObject(data);
    return this.baseService.getRequest(`${ApiConstant.MSMED_OUTSTANDING}?${queryParam}`);
  }

  getMsmedDetailsList(data) {
    const queryParam = this.getQueryStringFromObject(data);
    return this.baseService.getRequest(`${ApiConstant.MSMED_OUTSTANDING_DETAILS}?${queryParam}`);
  }

  getLedgerData(type) {
    return this.baseService.getRequest(`${ApiConstant.LEDGER_UTILITY}?Type=${type}`);
  }

  openModal(id) {
    $(`#${id}`).modal({ backdrop: 'static', keyboard: false });
    $(`#${id}`).modal(UIConstant.MODEL_SHOW);
  }

  closeModal(id) {
    $(`#${id}`).modal(UIConstant.MODEL_HIDE);
  }

  getUserUtilityList(type) {
    return this.baseService.getRequest(`${ApiConstant.USER_UTILITY}?Type=${type}`)
  }
  getOrgDetailsForPrintExcelPDF() {
    return this.baseService.getRequest(`${ApiConstant.ORG_DETAILS_PRINT}`)
  }
  getNewBill(orgId, date, type) {
    let queryString = ''
    if (type === 1) {
      queryString = 'TransactionType=' + type + '&&OrgId=' + orgId + '&&TransDate=' + date
      return this.baseService.getRequest(ApiConstant.GET_NEW_BILL_NO_AUTO + queryString)
    } else if (type === 2) {
      queryString = 'Type=' + type + '&&BillDate=' + date + '&OrgId=' + orgId
      return this.baseService.getRequest(ApiConstant.GET_NEW_BILL_NO_MANUAL + queryString)
    }
  }
  getListApplyedDiscount(DiscountData) {
    return this.baseService.getRequest(`${ApiConstant.GET_DISCOUNT_FOR_APPLY}?Qty=${DiscountData.Qty}&BillAmount=${DiscountData.BillAmount}&BillDate=${DiscountData.BillDate}&LedgerId=${DiscountData.LedgerId}&Type=${DiscountData.Type}`)
  }
  postMultipleDiscount(param) {
    return this.baseService.postRequest(ApiConstant.GET_DISCOUNT_FOR_APPLY, param)
  }
  getDiscountList(queryParams) {
    return this.baseService.getRequest(ApiConstant.GET_DISCOUNT_FOR_APPLY+'?' + queryParams)
  }
  deleteDiscount (id){
    return this.baseService.deleteRequest(ApiConstant.GET_DISCOUNT_FOR_APPLY+'?' +id)
  }

  reDirectPrintSale(action) {
    this.redirectSub.next(action)
  }

  reDirectPrintSaleStatus() {
    return this.redirectSub.asObservable()
  }


  reDirectViewListOfSale(action) {
    this.redirectSub.next(action)
  }

  reDirectViewListOfSaleStatus() {
    return this.redirectSub.asObservable()
  }
  reDirectViewListOfPurchase(action) {
    this.redirectSub.next(action)
  }

  reDirectViewListOfPurchaeStatus() {
    return this.redirectSub.asObservable()
  }
  getDashBoardData(type) {
    return this.baseService.getRequest(ApiConstant.INIT_DASHBOARD + type)
  }
  getDashBoardAssestsLiabilities (FromDate,ToDate) {
    return this.baseService.getRequest(ApiConstant.DASHBOARD_ASSET_LIBILITIES +"?FromDate="+FromDate+"&ToDate="+ToDate)
  }
  getDashBoardCashInCashOut (FromDate,ToDate) {
    return this.baseService.getRequest(ApiConstant.DASHBOARD_CASHIN_CASHOUT +"?FromDate="+FromDate+"&ToDate="+ToDate)
  }

  getDashboardInventory (FromDate,ToDate,type) {
    return this.baseService.getRequest(ApiConstant.DASHBOARD_INVENTORY +"?FromDate="+FromDate+"&ToDate="+ToDate+"&Type=" + type)
  }
  getDashboarCashStatutory (FromDate,ToDate) {
    return this.baseService.getRequest(ApiConstant.DASHBOARD_CashStatutory +"?FromDate="+FromDate+"&ToDate="+ToDate)
  }
  getDashboardOverDues (FromDate,ToDate) {
    return this.baseService.getRequest(ApiConstant.DASHBOARD_DashboardOverDues +"?FromDate="+FromDate+"&ToDate="+ToDate)
  }
  getDashboardCreditorDebitors (FromDate,ToDate,type) {
    return this.baseService.getRequest(ApiConstant.DASHBOARD_CreditorDebitor +"?FromDate="+FromDate+"&ToDate="+ToDate+"&Type=" + type)
  }
  getAllTax () {
    return this.baseService.getRequest(ApiConstant.GET_TAX_DETAIL_URL )
  }
  geActiveInventoryReport(data) {
    const url = `${ApiConstant.REPORT_ACTIVE_INVENTORY}?FromDate=${data.FromDate}&ToDate=${data.ToDate}&Page=${data.Page}&Size=${data.Size}&ItemId=${data.ItemId}&ActiveCategoryId=${data.ActiveCategoryId}&StrSearch=${data.StrSearch}`;
    return this.baseService.getRequest(url)
  }
  getItem () {
    return this.baseService.getRequest(ApiConstant.ITEM_MASTER_DETAIL_URL)
  }


  private openCommonMenuSub = new BehaviorSubject<AddCust>({'open': false})
  openCommonMenu$ = this.openCommonMenuSub.asObservable()
  private onCommonMenuAddSub = new Subject()
  onCommonMenuAdd$ = this.onCommonMenuAddSub.asObservable()
  openCommonMenu (data) {
    this.openCommonMenuSub.next(data)
  }
  closeCommonMenu (data?) {
    if (data) {
      this.openCommonMenuSub.next({ 'open': false, 'name': data.name, 'id': data.id, 'code': data.code})
    } else {
      this.openCommonMenuSub.next({ 'open': false })
    }
  }
  onCommonMenuAdd () {
    this.onCommonMenuAddSub.next()
  }

  openTaxProcess(editId) {
    this.openAddTaxProcessSub.next({ 'open': true, 'editId': editId })
  }

  closeTaxProcess(newTax) {
    if (newTax) {
      this.openAddTaxProcessSub.next({ 'open': false, 'name': newTax.name, 'id': newTax.id })
    } else {
      this.openAddTaxProcessSub.next({ 'open': false })
    }
  }

  getTaxProcessStatus() {
    return this.openAddTaxProcessSub.asObservable()
  }

  getFinanceParameters() {
    return this.baseService.getRequest(ApiConstant.FINANCE_CREATE)
  }

  getLogoAndDomain() {
    const domain = window.location.origin;
    this.baseService.getRequest(`${ApiConstant.CUSTOMER_AGENT}?WorkDomain=${domain}`).subscribe(
      (res) => {
        if (res.Code === 1000 && !_.isEmpty(res.Data)) {
          const data = res.Data[0];
          localStorage.setItem(UIConstant.WORK_DOMAIN_ID, data.Id)
          this._document.getElementById('appFavIcon').setAttribute('href', data.LogoPath);
          this.domainLogo = data.LogoPath
          this.workdomain = data.WorkDomain
        }
      })
  }

  getRequest(path, query?) {
    const queryParam = this.getQueryStringFromObject(query);
    let url = path
    if (!_.isEmpty(query)) {
      url = `${path}?${queryParam}`
    }
    return this.baseService.getRequest(url)
  }

  loadModalDynamically(that, containerRef, componentRef, componentToLoad, next, item?, dataToPass?) {
    that[containerRef].clear();
    const factory = that.resolver.resolveComponentFactory(componentToLoad);
    that[componentRef] = that[containerRef].createComponent(factory);
    that[componentRef].instance.openModal(item, dataToPass);
    that[componentRef].instance.closeModal.subscribe(
      (data) => {
        that[componentRef].destroy();
        next(data);
      });
  }

  isEmpty(val) {
    if (typeof val === "object" || Array.isArray(val)) {
      if (_.isEmpty(val)) {
        return true
      } else {
        return false
      }
    } else if (val === undefined || val === null || val === NaN || val === "" || val === 0 || val === false) {
      return true
    } else {
      return false
    }
  }
  COUNTRY_LABEL_CHANGE = (id) => {
    return this.baseService.getRequest(ApiConstant.COUNTRY_CHANGE_LABEL_VALUE+id)
  }
/* Function to collection sorting */
  sortByColumn(isAsc, key, dataToIterate) {
    const orderType = isAsc ? 'asc' : 'desc';
    return _.orderBy(dataToIterate, ((item) => {
      if (_.isString(item[key])) {
        return item[key].trim().toLowerCase()
      } else {
        return item[key]
      }
    }), [orderType]);
  }
}
