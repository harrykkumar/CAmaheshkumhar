import { Injectable } from '@angular/core'
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MFApiConstant {

  static BASE_URL = environment.BASE_URL

  public static get VENDOR_STATUS_REPORT(): string { return this.BASE_URL + '/api/v1/Manufacturer/report/VendorItemRateStatus' }

  public static get VENDOR_STATUS_PO_REPORT(): string { return this.BASE_URL + '/api/v1/Manufacturer/report/Vendorwisepo' }

  public static get PO_QTY_APPROVAL_POST (): string { return this.BASE_URL + '/api/v1/Manufacturer/Approvalpoqty' }

  public static get GET_PO_DETAILS_BY_ID_STR (): string { return this.BASE_URL + '/api/v1/Manufacturer/purchaseorderdetails?IdStr=' }

  public static get POST_PO (): string { return this.BASE_URL + '/api/v1/manufacture/popurchase' }
}
