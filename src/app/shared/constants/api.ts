import { Injectable } from '@angular/core'
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ApiConstant {

  static BASE_URL = environment.BASE_URL

  public static get OTP_VERIFY_URL(): string { return this.BASE_URL + '/api/v1/otp' }

  public static get SEND_EMAIL_OTP_URL(): string { return this.BASE_URL + '/api/v1/otp?' }

  public static get ITEM_MASTER_DETAIL_URL(): string { return this.BASE_URL + '/api/v1/Item' }

  public static get TAX_DETAIL_URL(): string { return this.BASE_URL + '/api/v1/Tax' }

  public static get ITEM_DETAIL_URL(): string { return this.BASE_URL + '/api/v1/Setting/CommonMaster?CommonCode=143' }

  public static get CATEGORY_DETAIL_URL(): string { return this.BASE_URL + '/api/v1/category' }

  public static get GET_CATEGORY_BY_ID(): string { return this.BASE_URL + '/api/v1/category?Id=' }

  public static get DELETE_CATEGORY_URL(): string { return this.BASE_URL + '/api/v1/category?Id=' }

  public static get GET_PACKING_DETAIL(): string { return this.BASE_URL + '/api/v1/Setting/CommonMaster?CommonCode=150' }

  public static get LOGIN_URL(): string { return this.BASE_URL + '/api/v1/authentication/login' }

  public static get GET__SUB_UNIT_DETAIL(): string { return this.BASE_URL + '/api/v1/Subunit' }

  public static get GET__SUB_UNIT_BY_ID(): string { return this.BASE_URL + '/api/v1/Subunit?Id=' }

  public static get GET_UNIT_DETAIL(): string { return this.BASE_URL + '/api/v1/unit' }

  public static get GET_UNIT_BY_ID(): string { return this.BASE_URL + '/api/v1/unit?Id=' }

  public static get GET_BRAND_DETAIL(): string { return this.BASE_URL + '/api/v1/Brand' }

  public static get GET_SAVE_AND_UPDATE_CATEGORY_URL(): string { return this.BASE_URL + '/api/v1/category' }

  public static get ADD_UNIT_URL(): string { return this.BASE_URL + '/api/v1/unit' }

  public static get GET_TAX_DETAIL_URL(): string { return this.BASE_URL + '/api/v1/tax' }

  public static get VENDOR_URL(): string { return this.BASE_URL + '/api/v1/ledger' }

  public static get COUNTRY_LIST_URL(): string { return this.BASE_URL + '/api/v1/setting/CommonMaster?CommonCode=' }

  public static get GET_STATE_LIST_URL(): string { return this.BASE_URL + '/api/v1/setting/CommonMaster1?CommonCode=102&CommonId=' }

  public static get CITY_LIST_URL(): string { return this.BASE_URL + '/api/v1/setting/CommonMaster2?CommonCode=103&CommonId1=' }

  public static get AREA_LIST_URL(): string { return this.BASE_URL + '/api/v1/setting/CommonMaster3?CommonCode=104&CommonId2=' }

  public static get IMPORT_EXPORT_SALE_TRAVEL_URL(): string { return this.BASE_URL + '/api/v1/ims/sale/import' }

  public static get SALE_TRVEL_DETAIL_URL(): string { return this.BASE_URL + '/api/v1/ims/sale/travel' }

  public static get SALE_TOURISM_DETAIL_URL(): string { return this.BASE_URL + '/api/v1/ims/sale/TravelCourier' }

  public static get PAYMENT_MODE_DETAIL_URL(): string { return this.BASE_URL + '/api/v1/Paymode' }

  public static get BANK_DETAIL_URL(): string { return this.BASE_URL + '/api/v1/setting/bank' }

  public static get LEDGER_DETAIL_URL(): string { return this.BASE_URL + '/api/v1/Ledger' }

  public static get SETTING_SETUP(): string { return this.BASE_URL + '/api/v1/SetupSetting' }

  public static get SALE_PRINT_DETAILS_DATA(): string { return this.BASE_URL + '/api/v1/ims/sale/importdetail?id=' }

  public static get EDIT_LEDGER_BY_ID_URL(): string { return this.BASE_URL + '/api/v1/LedgerEdit?Id=' }

  public static get STATUS_URL(): string { return this.BASE_URL + '/api/v1/authentication/ExpiryStatus' }

  public static get EDIT_TAX_BY_ID_URL(): string { return this.BASE_URL + '/api/v1/tax?Id=' }

  public static get SALE_PRINT_COURIER_DETAILS_DATA(): string { return this.BASE_URL + '/api/v1/ims/sale/Report/TravelCourier?Id=' }

  public static get COUNTRY_LIST(): string { return this.BASE_URL + '/api/v1/setting/CommonMaster?CommonCode=101' }

  public static get PARCEL_PROVIDER_URL(): string { return this.BASE_URL + '/api/v1/setting/CommonMaster?CommonCode=141' }

  public static get SALE_COURIER_PARCEL_POST(): string { return this.BASE_URL + '/api/v1/ims/sale/CourierParcel' }

  public static get SALE_PRINT_COURIER_PARCEL_DATA_BY_ID(): string { return this.BASE_URL + '/api/v1/ims/sale/CourierParcel/Print?Id=' }

  public static get SALE_TRAVEL_EDIT_DATA(): string { return this.BASE_URL + '/api/v1/ims/sale/traveldetail?Id=' }

  public static get SALE_COURIER_PARCEL_EDIT_DATA(): string { return this.BASE_URL + '/api/v1/ims/sale/courierparcel?Id=' }

  public static get GET_ALL_SUB_CATEGORIES(): string { return this.BASE_URL + '/api/v1/categoryparent?type=' }

  public static get IMPORT_ITEM_MASTER(): string { return this.BASE_URL + '/api/v1/ItemImport' }

  public static get UPDATE_PENDING_LIST(): string { return this.BASE_URL + '/api/v1/importitemupdate' }

  public static get GET_BAR_CODE(): string { return this.BASE_URL + '/api/v1/ItemBarCode?StrSearchFor=' }

  public static get NAME_EXISTENCE(): string { return this.BASE_URL + '/api/v1/existency' }

  public static get POST_SALE_RETURN(): string { return this.BASE_URL + '/api/v1/ims/sale/travelreturn' }

  public static get GET_SALE_RETURN_LIST(): string { return this.BASE_URL + '/api/v1/ims/sale/travelreturn' }

  public static get GET_UNIT_BY_TYPE(): string { return this.BASE_URL + '/api/v1/Unit?IsBaseUnit=' }

  public static get EDIT_ITEM_MASTER(): string { return this.BASE_URL + '/api/v1/ItemEdit?Id=' }

  public static get SALE_TRAVEL_RETURN_PRINT(): string { return this.BASE_URL + '/api/v1/ims/travel/travelreturnprint?Id=' }

  public static get GET_SETTING_BY_ID(): string { return this.BASE_URL + '/api/v1/setting/setupsetting?Id=' }

  public static get SALE_CHALLAN_GET_TYPEBY_SALE_DATA(): string { return this.BASE_URL + '/api/v1/ims/SPUtility?type=saleChallan' }

  public static get SETTING_FOR_ORGNIZATION_DATA(): string { return this.BASE_URL + '/api/v1/setting/transactionno?OrgId=' }

  public static get GET_ADDRESS_OF_CUSTOMER_BY_ID_FOR_SAL_ECHALLAN(): string { return this.BASE_URL + '/api/v1/setting/Address?ParentId=' }

  public static get POST_SALE_CHALLAN(): string { return this.BASE_URL + '/api/v1/ims/sale/SaleChallan' }

  public static get GET_ITEM_BY_CATEGORY_URL(): string { return this.BASE_URL + '/api/v1/Item?CategoryId=' }

  public static get GET_ALL_DETAILS_SALE_CHALLAN_URL(): string { return this.BASE_URL + '/api/v1/ims/sale/SaleChallan' }

  public static get GET_PRINT_SALE_CHALLAN_URL(): string { return this.BASE_URL + '/api/v1/ims/sale/SaleChallanDetails?Id=' }

  public static get POST_NEW_ADDRESS(): string { return this.BASE_URL + '/api/v1/setting/Address' }

  public static get ALL_SETUP_SETTING(): string { return this.BASE_URL + '/api/v1/SetupSetting' }

  public static get ADD_AREA_UNDER_CITY_ID(): string { return this.BASE_URL + '/api/v1/setting/CommonMaster3' }

  public static get SEARCH_COUNTRY_BY_ID_AND_NAME(): string { return this.BASE_URL + '/api/v1/setting/countryutility?Id=0&Strvalue=' }

  public static get GET_EXCEL_API_FOR_DATA(): string { return this.BASE_URL + '/api/v1/ims/courierparcel/saleexport' }

  public static get GET_ATTRIBUTE_SALE_CHALLAN_DATA(): string { return this.BASE_URL + '/api/v1/AttributevalueNode' }

  public static get ATTRIBUTE_NAME_URL(): string { return this.BASE_URL + '/api/v1/Attribute' }

  public static get ATTRIBUTE_VALUE_URL(): string { return this.BASE_URL + '/api/v1/AttributeValue' }

  public static get ATTRIBUTE_SEARCH_URL(): string { return this.BASE_URL + '/api/v1/AttributeValue?Name=' }

  public static get DELETE_ATTRIBUTE_URL(): string { return this.BASE_URL + '/api/v1/AttributeValue?Id=' }

  public static get PURCHASE_LIST(): string { return this.BASE_URL + '/api/v1/IMS/Purchase' }

  public static get SPUTILITY(): string { return this.BASE_URL + '/api/v1/ims/SPUtility?type=' }

  public static get GET_ADDRESS_OF_VENDOR(): string { return this.BASE_URL + '/api/v1/setting/LedgerUtility?Id=' }

  public static get GET_ITEM_DETAIL(): string { return this.BASE_URL + '/api/v1/Item?Id=' }

  public static get GET_TAX_SLAB_DATA(): string { return this.BASE_URL + '/api/v1/Tax?Id=' }

  public static get GET_MODULE_SETTING(): string { return this.BASE_URL + '/api/v1/setting/setupsetting?StrSearch=' }

  public static get SETTING_SETUP_BY_TYPE(): string { return this.BASE_URL + '/api/v1/SetupSetting?type=' }

  public static get CHECK_FOR_EXISTENCE(): string { return this.BASE_URL + '/api/v1/checkexistency' }

  public static get GET_DEPENDENCY_FOR_FORM(): string { return this.BASE_URL + '/api/v1/existency?Formname=' }

  public static get GET_NEW_BILL_NO_AUTO(): string { return this.BASE_URL + '/api/v1/setting/transactionno?' }

  public static get GET_DETAIL_OF_PURCHASE_BY_ID(): string { return this.BASE_URL + '/api/v1/IMS/purchasedetail?Id=' }

  public static get RETURN_PURCHASE_BY_ID(): string { return this.BASE_URL + '/api/v1/IMS/' }

  public static get GET_PURCHASE_PRINT_DATA(): string { return this.BASE_URL + '/api/v1/ims/purchase/print?Id=' }

  public static get GET_PROFIT_REPORT_DATA(): string { return this.BASE_URL + '/api/v1/ims/sale/travel/profit' }

  public static get GET_NEW_BILL_NO_MANUAL(): string { return this.BASE_URL + '/api/v1/ims/lastbillno?' }

  public static get CREATE_USER(): string { return this.BASE_URL + '/api/v1/setting/User' }

  public static get USER_CLIENT(): string { return this.BASE_URL + '/api/v1/Owner/client' }

  public static get USER_OFFICE(): string { return this.BASE_URL + '/api/v1/Owner/Office' }

  public static get USER_TYPE(): string { return this.BASE_URL + '/api/v1/setting/usertype' }

  public static get USER_PERMISSION(): string { return this.BASE_URL + '/api/v1/setting/userpermission' }

  public static get GET_CHALLAN_DETAILS_FOR_BILLING_BY_ID(): string { return this.BASE_URL + '/api/v1/ims/sale/salechallandetails?CallFor=Sale&IDSearch=' }

  public static get INDUSTRY_TYPE_LIST_URL(): string { return this.BASE_URL + '/api/v1/setting/CommonMaster?CommonCode=125' }

  public static get KEY_PERSON_TYPE_LIST_URL(): string { return this.BASE_URL + '/api/v1/setting/CommonMaster?CommonCode=110' }

  public static get ACCOUNTING_METHOD_LIST_URL(): string { return this.BASE_URL + '/api/v1/setting/CommonMaster?CommonCode=153' }

  public static get ORG_PROFILE_URL(): string { return this.BASE_URL + '/api/v1/Owner/profile' }

  // HARRY
  public static get LEDGER_GET_ADDRESS_FOR_GST(): string { return this.BASE_URL + '/api/v1/setting/LedgerUtility?Id=' }

  public static get GET_ITEM__RATE_BY_ITEMID_CUSTOMERID_SETTING(): string { return this.BASE_URL + '/api/v1/setting/ItemUtility?Id=' }

  public static get BRANCH_TYPE_LIST_URL(): string { return this.BASE_URL + '/api/v1/setting/CommonMaster?CommonCode=109' }

  public static get BRANCH_OFFICE_LIST_URL(): string { return this.BASE_URL + '/api/v1/owner/branchoffice' }

  public static get BRANCH_OFFICE_URL(): string { return this.BASE_URL + '/api/v1/owner/branchofficedetails' }

  public static get POST_ALL_SLECTED_CHALLAN_BILL_API(): string { return this.BASE_URL + '/api/v1/ims/sale/salechallandetails' }

  public static get SALE_DIRECT_BILLING_API(): string { return this.BASE_URL + '/api/v1/ims/sale' }

  public static get DIRECT_SALE_PRINT_API(): string { return this.BASE_URL + '/api/v1/ims/sale/print?Id=' }

  public static get DIRECT_SALE_EDIT_GET_API(): string { return this.BASE_URL + '/api/v1/ims/saledetails?Id=' }

  public static get REPORT_ITEM_STOCK(): string { return this.BASE_URL + '/api/v1/ims/itemcurrentstock' }

  public static get EDIT_BANK_DATA(): string { return this.BASE_URL + '/api/v1/setting/bankdetails?id=' }

  public static get REPORT_ITEM_BY_CATEGORY_SALE_DATA(): string { return this.BASE_URL + '/api/v1/ims/ItemCategorisedsummary' }

  public static get SPUTILITY_TO_CREATE_COMBO(): string { return this.BASE_URL + '/api/v1/ItemDetailForCombo' }

  public static get GET_PARENT_ATTRIBUTES(): string { return this.BASE_URL + '/api/v1/Attribute' }

  public static get GET_PARENT_ATTRIBUTES_BY_ID(): string { return this.BASE_URL + '/api/v1/Attribute?Id=' }

  public static get GET_DYNAMIC_SETUP_FIELDS(): string { return this.BASE_URL + '/api/v1/CommonSetupsetting' }

  public static get POST_DYNAMIC_SETUP_FIELDS(): string { return this.BASE_URL + '/api/v1/CommonSetupsetting' }

  public static get GET_SALE_COURIER_LIST(): string { return this.BASE_URL + '/api/v1/ims/sale/courierparcel' }

  public static get EDIT_SALE_COURIER(): string { return this.BASE_URL + '/api/v1/ims/sale/courierparcel/details?Id=' }

  public static get LEDGER_GROUP_API(): string { return this.BASE_URL + '/api/v1/account/group' }

  public static get LEDGER_GROUP_PARENT_DATA_API(): string { return this.BASE_URL + '/api/v1/account/groupparent' }

  public static get LEDGER_OPENING_BALANCE_STATUS_API(): string { return this.BASE_URL + '/api/v1/account/OpeningStatus' }

  public static get LEDGER_SUMMARY(): string { return this.BASE_URL + '/api/v1/account/LedgerSummary' }

  public static get BALANCE_SHEET_API(): string { return this.BASE_URL + '/api/v1/account/Balancesheet' }

  public static get USER_PROFILE(): string { return this.BASE_URL + '/api/v1/UserProfile' }

  public static get REPORT_ITEM_SALE_PURCHASE(): string { return this.BASE_URL + '/api/v1/ims/itemtractiondetails?Type=' }

  public static get SALE_PURCHASE_ITEM_UTILITY(): string { return this.BASE_URL + '/api/v1/ims/SalePurchaseItemUtility' }

  public static get OPENING_STK(): string { return this.BASE_URL + '/api/v1/ims/itembarcodeOpening' }

  public static get ACCOUNT_PROFIT_AND_LOSS_BY_DATE(): string { return this.BASE_URL + '/api/v1/account/pnl' }

  public static get ACCOUNT_TRADING_BY_DATE(): string { return this.BASE_URL + '/api/v1/account/Trading' }

  public static get OWNER_ORGANISATION_LIST(): string { return this.BASE_URL + '/api/v1/Owner/Organization' }

  public static get TRANSACTIONNO_VOUCHER(): string { return this.BASE_URL + '/api/v1/setting/transactionno' }

  public static get GET_VOUCHER_LIST(): string { return this.BASE_URL + '/api/v1/ims/OutStanding' }

  public static get POST_VOUCHER(): string { return this.BASE_URL + '/api/v1/ims/receiptpaymentvoucher' }

  public static get GET_CURRENT_DATE(): string { return this.BASE_URL + '/api/v1/CurrentDate' }

  public static get COMMON_MENU_CODE(): string { return this.BASE_URL + '/api/v1/setting/commoncode' }

  public static get COMMON_MASTER_MENU(): string { return this.BASE_URL + '/api/v1/setting/CommonMaster' }

  public static get FIN_YEAR(): string { return this.BASE_URL + '/api/v1/FinancialYear' }

  public static get ORG_COMPANY_DETAILS(): string { return this.BASE_URL + '/api/v1/Owner/OrganizationDetails' }

  public static get USER_ORGANIZATION(): string { return this.BASE_URL + '/api/v1/authentication/userorganization' }

  public static get EXTENDJWT(): string { return this.BASE_URL + '/api/v1/authentication/ExtendJwt' }

  public static get GET_VOUCHER_TYPE(): string { return this.BASE_URL + '/api/v1/account/VoucherType' }

  public static get FIN_SESSION(): string { return this.BASE_URL + '/api/v1/setting/CommonMaster?CommonCode=164' }

  public static get POST_VOUCHER_CONTRA_JOURNAL(): string { return this.BASE_URL + '/api/v1/account/JournalContraVoucher' }

  public static get SUB_INDUSTRY(): string { return this.BASE_URL + '/api/v1/setting/CommonMaster1?CommonId' }

  public static get PAYMENT_RECEIPT_PRINT(): string { return this.BASE_URL + '/api/v1/ims/receiptprint' }

  public static get MODULE_SETTING_ON_TOP(): string { return this.BASE_URL + '/api/v1/setting/setupsetting?ModuleId=' }

  public static get SAMPLING_GET(): string { return this.BASE_URL + '/api/v1/manufacture/sampling' }

  public static get SAMPLE_STYLE(): string { return this.BASE_URL + '/api/v1/manufacture/style' }


  public static get GET_TAXTYPE_NAME(): string { return this.BASE_URL + '/api/v1/TaxTitle' }

  public static get GET_TAX_SLAB_NAME_URL(): string { return this.BASE_URL + '/api/v1/tax?Uid=' }

  // api/v1/TaxTitle
  public static get ORG_INDUSTRY(): string { return this.BASE_URL + '/api/v1/common/industry' }

  public static get CITY_ADD(): string { return this.BASE_URL + '/api/v1/setting/CommonMaster2' }

  public static get AREA_ADD(): string { return this.BASE_URL + '/api/v1/setting/CommonMaster3' }

  public static get ITEM_REQUIREMENT(): string { return this.BASE_URL + '/api/v1/ims/SalePurchaseItemUtility?Type=Itemrequirement' }

  public static get TRANS_SESSION(): string { return this.BASE_URL + '/api/v1/setting/CommonMaster?CommonCode=167' }

  public static get TRANS_FORMAT(): string { return this.BASE_URL + '/api/v1/setting/CommonMaster?CommonCode=165' }

  public static get TRANS_POSITION(): string { return this.BASE_URL + '/api/v1/setting/CommonMaster?CommonCode=168' }

  public static get INIT_DASHBOARD(): string { return this.BASE_URL + '/api/v1/common/dashboard' }

  public static get ITEM_REQUIRE_POST(): string { return this.BASE_URL + '/api/v1/Manufacturer/ItemRequirement' }

  public static get ITEM_REQUIRE_GET(): string { return this.BASE_URL + '/api/v1/Manufacturer/ItemRequirementSummary' }

  public static get TRANS_EXISTENCY_GET(): string { return this.BASE_URL + '/api/v1/existency?Formname=TransactionNo' }

  public static get TRANS_EXISTENCY_POST(): string { return this.BASE_URL + '/api/v1/checkexistency' }

  public static get ITEM_REQ_INSTRUCTION(): string { return this.BASE_URL + '/api/v1/setting/CommonMaster?CommonCode=169' }

  public static get CHECK_GST_FOR_STATE(): string { return this.BASE_URL + '/api/v1/setting/CommonMaster1?CommonCode=102&Strvalue=' }

  public static get GET_ITEM_REPORT_INVENTORY(): string { return this.BASE_URL + '/api/v1/ims/ItemInventory' }

  public static get GET_REPORT_TRAIL_BALANCE(): string { return this.BASE_URL + '/api/v1/account/TrailBalance' }

  public static get BUYER_ORDER(): string { return this.BASE_URL + '/api/v1/Manufacturer/BuyerOrder' }

  public static get TERMS_UTILITY(): string { return this.BASE_URL + '/api/v1/setting/CommonMaster?CommonCode=170' }

  public static get REPORT_OUT_STANDING(): string { return this.BASE_URL + '/api/v1/ims/PartyOutStanding' }

  public static get REPORT_CASHBOOK(): string { return this.BASE_URL + '/api/v1/account/CashBook' }

  public static get REPORT_DAYBOOK(): string { return this.BASE_URL + '/api/v1/account/DayBook' }

  public static get REPORT_BANKBOOK(): string { return this.BASE_URL + '/api/v1/account/Bankbook' }

  public static get REPORT_SALE_PURCHASE_REGISTER(): string { return this.BASE_URL + '/api/v1/ims/SalePurchaseRegister' }

  public static get REPORT_SALE_PURCHASE_SUMMARY(): string { return this.BASE_URL + '/api/v1/ims/SalePurchaseSummary' }

  public static get SERVICE_ITEM_MASTER(): string { return this.BASE_URL + '/api/v1/saleservice/Item' }

  public static get SERVICE_EDIT_ITEM_MASTER(): string { return this.BASE_URL + '/api/v1/saleservice/itemedit' }

  public static get SERVICE_BILLING_API(): string { return this.BASE_URL + '/api/v1/saleservice/sale' }

  public static get SERVICE_BILLING_API_BY_EDIT(): string { return this.BASE_URL + '/api/v1/ims/saledetails?id=' }

  public static get RETURN_SALE_DIRECT(): string { return this.BASE_URL + '/api/v1/ims/SaleReturn' }
  
  public static get  GSTR_AN_X () : string { return this.BASE_URL +'/api/v1/account/GstrAnx'}

  public static get RERTURN_PURCHASE_LIST(): string { return this.BASE_URL + '/api/v1/IMS/PurchaseReturn' }

  public static get  GSTR_AN_X_DETAILS () : string { return this.BASE_URL +'/api/v1/account/Gstranxdetails'}

  public static get  TERMS_CONDITION_FORM_TYPE () : string { return this.BASE_URL +'/api/v1/common/Interface?Type='}

  public static get  TERMS_CONDITION_POST () : string { return this.BASE_URL +'/api/v1/common/TermConditions'}

  public static get RETURN_SALE(): string { return this.BASE_URL + '/api/v1/ims/' }
 
  public static get PRINT_SALE_RETURN(): string { return this.BASE_URL + '/api/v1/ims/SaleReturn/print?Id=' }
  
  public static get PRINT_PURCHASE_RETURN(): string { return this.BASE_URL + '/api/v1/ims/PurchaseReturn/print?Id=' }
 
  public static get BRANCH_AUTH(): string { return this.BASE_URL + '/api/v1/authentication/userbranch' }

  public static get VOUCHER_ENTRY_DETAILS(): string { return this.BASE_URL + '/api/v1/account/voucherentrydetails' }

  public static get MSMED_OUTSTANDING(): string { return this.BASE_URL + '/api/v1/ims/msmedoutstanding' }

  public static get LEDGER_UTILITY(): string { return this.BASE_URL + '/api/v1/setting/LedgerUtility' }

  public static get MSMED_OUTSTANDING_DETAILS(): string { return this.BASE_URL + '/api/v1/ims/MsmedTransactions' }

  public static get USER_UTILITY(): string { return this.BASE_URL + '/api/v1/setting/UserUtility' }

  public static get CHANGE_PASSWORD(): string { return this.BASE_URL + '/api/v1/ChangePassword' }

  public static get ORG_DETAILS_PRINT(): string { return this.BASE_URL + '/api/v1/common/printutility' }

  public static get GET_DISCOUNT_FOR_APPLY ():string { return this.BASE_URL +'/api/v1/Ims/Discount'}

  public static get POST_CAT_IMPORT (): string { return this.BASE_URL + '/api/v1/CategoryImport' }

  public static get POST_LEDGER_IMPORT (): string { return this.BASE_URL + '/api/v1/ledgerimport' }

  public static get SUPER_ADMIN_MODULES_LIST (): string { return this.BASE_URL + '/api/v1/Modules' }

  public static get SUPER_ADMIN_INDUSTRY_LIST (): string { return this.BASE_URL + '/api/v1/common/industry' }

  public static get POST_CLIENT_SUPER_ADMIN (): string { return this.BASE_URL + '/api/v1/clientadmin' }

  public static get GET_SUB_MENU_LIST (): string { return this.BASE_URL + '/api/v1/menuwithindmodwise' }

  public static get GET_BORCODES_OPENING_STOCK (): string { return this.BASE_URL + '/api/v1/ItemBarCode' }

  public static get MENU_SUPERADMIN (): string { return this.BASE_URL + '/api/v1/menu' }

  public static get GET_SUBMODULES_LIST (): string { return this.BASE_URL + '/api/v1/SubModule?Id=0' }

  public static get POST_MODULE_SUPERADMIN (): string { return this.BASE_URL + '/api/v1/moduledefination' }

  public static get CUSTOM_RATE (): string { return this.BASE_URL + '/api/v1/Customerate' }

  public static get ADDITIONAL_SETTINGS (): string { return this.BASE_URL + '/api/v1/setting/user/individualpermission' }

  public static get DASHBOARD_ASSET_LIBILITIES (): string { return this.BASE_URL + '/api/v1/dashboardassetlibilities' }

  public static get DASHBOARD_CASHIN_CASHOUT(): string { return this.BASE_URL + '/api/v1/dashboardpnlcash' }

  public static get DASHBOARD_INVENTORY(): string { return this.BASE_URL + '/api/v1/DashboardInventory' }

  public static get DASHBOARD_CashStatutory(): string { return this.BASE_URL + '/api/v1/DashboardCashStatutory' }

  public static get DASHBOARD_DashboardOverDues(): string { return this.BASE_URL + '/api/v1/DashboardOverDues' }

  public static get DASHBOARD_CreditorDebitor(): string { return this.BASE_URL + '/api/v1/DashboardCreditorDebitor' }

  public static get REVUGAIN_FOR_CUSTOMER_DETAILS(): string { return   'https://api.revugain.com/api/v1/PostCustomersData' }

  public static get EDIT_BUYER_ORDER (): string { return this.BASE_URL + '/api/v1/Manufacture/BuyerOrderEdit' }
  
  public static get GET_ITEMS_IN_ORDER (): string { return this.BASE_URL + '/api/v1/manufacture/buyerorderforpacket' }

  public static get GET_PACKET_CODE (): string { return this.BASE_URL + '/api/v1/randomnumber?Type=OrderPacket' }

  public static get POST_ORDER_PACKET (): string { return this.BASE_URL + '/api/v1/manufacture/orderpacket' }

  public static get ACTIVE_INVENTORY_ADD_NAME_URL(): string { return this.BASE_URL + '/api/v1/ims/activeinventorycategory' }

  public static get POST_ACTIVE_INVENTORY_TERMURL(): string { return this.BASE_URL + '/api/v1/ims/activeinventoryterms' }

  public static get GET_TYPE_ACVTIVE_INVE_URL(): string { return this.BASE_URL + '/api/v1/setting/CommonMaster?CommonCode=178' }

  public static get GET_ADDRESS_TAX_TYPE (): string { return this.BASE_URL + '/api/v1/manufacture/buyerorderforchallan?Id=' }

  public static get POST_PACKAGING_CHALLAN (): string { return this.BASE_URL + '/api/v1/manufacture/orderpacketchallan' }

  public static get GET_ORDER_DATA_BY_TYPE (): string { return this.BASE_URL + '/api/v1/manufacture/buyerorderpacket?Type=' }

  public static get REPORT_ACTIVE_INVENTORY(): string { return this.BASE_URL + '/api/v1/inventory/itemactivestatus' }

  public static get CLIENT_BRANCH(): string { return this.BASE_URL + '/api/v1/Owner/Branch' }
}
