import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class URLConstant {

  public static get LOGIN_URL (): string { return 'login' }

  public static get ADMIN_URL (): string { return 'admin' }

  public static get IMS_TAX_URL (): string { return 'ims/tax' }

  public static get IMS_UNIT_URL (): string { return 'ims/unit' }

  public static get IMS_VENDOR_URL (): string { return 'ims/vendor' }

  public static get IMS_COUSTMER_URL (): string { return 'ims/customer' }

  public static get IMS_ITEM_MASTER_URL (): string { return 'ims/item' }

  public static get IMS_CATEGORY_URL (): string { return 'ims/category' }

  public static get IMS_COMPOSITE_URL (): string { return 'ims/composite' }

  public static get FORGOT_PASSWORD_URL (): string { return 'forgot-password' }

  public static get IMS_VOUCHER_URL (): string { return 'ims/voucher' }

  public static get PURCHASES (): string { return 'purchase' }

  public static get IMS_ROUTING_URL (): string { return 'ims/routing' }

  public static get SETTING_USER_URL (): string { return 'setting/user' }

  public static get BANK_URL (): string { return 'ims/bank' }

  public static get SALE_TOURISM (): string { return 'ims/sale-travel/sale' }

  public static get SALE_COURIER (): string { return 'ims/sale-courier/sale' }

  public static get SALE_COURIER_PARCEL (): string { return 'ims/sale-courier-parcel/sale' }

  public static get SALE_RETURN_URL (): string { return 'ims/sale-travel/sale-return' }

  public static get SALE_CHALLAN (): string { return 'ims/sale-challan/challan' }

  public static get PURCHASE (): string { return 'ims/purchase' }

  public static get REPORT_ITEM_STOCK (): string { return 'ims/report/item-stock' }

  public static get PROFIT_REPORT (): string { return 'ims/profit-report' }

  public static get ATTRIBUTE_ADD (): string { return 'ims/attribute' }

  public static get SALE_CHALLAN_BILLING (): string { return 'ims/sale-billing/billing' }

  public static get SALE_DIRECT (): string { return 'ims/sale' }

  public static get REPORT_ITEM_BY_CATEGORY_SALE (): string { return 'ims/report/item-sale' }

  public static get SETTINGS_PAGE (): string { return 'settings/setup' }

  public static get BRANCH_PAGE (): string { return 'owner/branch' }

  public static get USER_RIGHTS (): string { return 'user-rights' }

  public static get OFFICE_PAGE (): string { return 'owner/branch/office' }

  public static get USER_TYPES (): string { return 'usertypes' }

  public static get USERS (): string { return 'users' }

  public static get LEDGER_GROUP (): string { return 'account/ledgergroup' }

  public static get LEDGER_CREATION  (): string { return 'account/ledgercreation' }

  public static get LEDGER_SUMMARY  (): string { return 'account/ledger-summary' }

  public static get ACCOUNT_BALANCE_SHEET  (): string { return 'account/balance-sheet' }

  public static get SUPER_ADMIN_CLIENT_MODULE (): string { return 'super-admin/client' }

}