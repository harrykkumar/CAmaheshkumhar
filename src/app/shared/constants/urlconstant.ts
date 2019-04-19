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

  public static get ATTRIBUTE_ADD (): string { return 'ims/attribute' }

 public static get SALE_CHALLAN_BILLING (): string {return 'ims/sale-billing/billing'}
}
