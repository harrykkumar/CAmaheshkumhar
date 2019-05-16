import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})

export class UIConstant {

  public static get ONE (): number {
    return 1
  }

  public static get TWO (): number {
    return 2
  }

  public static get ZERO (): number {
    return 0
  }

  public static get THREE (): number {
    return 3
  }

  public static get THIRTY (): number {
    return 30
  }

  public static get BLANK (): string {
    return ''
  }

  public static get TRUE (): string {
    return 'true'
  }

  public static get THOUSAND (): number {
    return 1000
  }

  public static get THOUSANDONE (): number {
    return 1001
  }

  public static get DELETESUCCESS (): number {
    return 5015
  }

  public static get NORECORDFOUND (): number {
    return 5004
  }

  public static get CANNOTDELETERECORD (): number {
    return 5016
  }

  public static get INVALIDRIGHT (): number {
    return 5017
  }

  public static get TOKENEXPIRED (): number {
    return 5018
  }

  public static get PARTIALLY_SAVED (): number {
    return 5019
  }

  public static get EMAIL (): string {
    return 'email'
  }

  public static get MODEL_HIDE (): string {
    return 'hide'
  }

  public static get MODEL_SHOW (): string {
    return 'show'
  }

  public static get MOBILE_NO (): string {
    return 'mobileNo'
  }

  public static get DELTE_CONFARMATION_YES (): string {
    return 'yes'
  }

  public static get ADD_NEW_OPTION (): string {
    return '+Add New'
  }
  public static get INFO (): string {
    return 'info'
  }
  public static get SUCCESS (): string {
    return 'Success'
  }

  public static get SAVED_SUCCESSFULLY (): string {
    return 'Saved Successfully'
  }

  public static get DELETED_SUCCESSFULLY (): string {
    return 'Deleted Successfully'
  }

  public static get FILE_SAVED_SUCCESSFULLY (): string {
    return 'File Saved'
  }

  public static get INVALID_DATE_FORMAT (): string {
    return 'Invalid Date Format, Expected mm/dd/yyyy'
  }

  public static get INVALID_PAYMENT_AMOUNT (): string {
    return 'Payment can\'t be more the bill amount'
  }

  public static get INVALID_RETURN_DATE (): string {
    return 'Return date can\'t be greater then Travel Date'
  }

  public static get SAME_UNIT_ERROR (): string {
    return 'Packing Unit and Main Unit can\'t be same'
  }

  public static get DELETED_RECORD_SUCCESSFULLY (): string {
    return 'Record is deleted successfully'
  }

  public static get RECORD_IS_ALREADY_DELTED (): string {
    return 'Record is already deleted, please try and refreshing the page again'
  }

  public static get CANNOT_DELETE_DATA (): string {
    return 'Record can\'t be deleted'
  }

  public static get DUPLICATE_ITEM (): string {
    return 'Pleae remove the duplicate items in order to move further'
  }

  public static get IMPORT_ITEM_PENDING (): string {
    return 'Some Items were left out, please upload them in order to move further'
  }

  public static get PURCHASE_TYPE (): string {
    return 'purchase'
  }

  public static get SALE_TYPE (): string {
    return 'sale'
  }
  public static get SALE_CHALLAN_TYPE (): string {
    return 'saleChallan'
  }
  public static get SALE_RETURN (): string {
    return 'saleReturn'
  }

  public static get FIRST_SAVE_EDIT_ITEM (): string {
    return 'First Edit & Save Item'
  }
  public static get ADD_ITEM (): string {
    return 'Please Add Item'
  }
  public static get ERROR (): string {
    return 'Error'
  }
  public static get WARNING (): string {
    return 'Warning'
  }

  public static get PAYMENT_NOT_MORE_BILLAMOUNT (): string {
    return 'Payment can\'t be more the bill amount'
  }
  public static get SERVERERROR (): number {
    return 5000
  }
}
