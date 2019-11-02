import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class FormConstants {

  public static get Edit (): number {
    return 1
  }
  public static get Excel (): number {
    return 9
  }
  public static get Print (): number {
    return 2
  }
  public static get ViewPrint (): number {
    return 6
  }
  public static get Purchase (): number {
    return 3
  }

  public static get Cancel (): number {
    return 4
  }

  public static get Return (): number {
    return 5
  }

  public static get ProfitReport (): number {
    return 6
  }
  
  public static get PurchaseForm (): number {
    return 7
  }

  public static get SaleForm (): number {
    return 6
  }

  public static get ChargeForm (): number { 
    return 22
  }

  public static get VoucherForm (): number { 
    return 9
  }
  public static get PurchaseReturn (): number {
    return 6
  }
  public static get PURCHASEORDER (): number {
    return 46
  }
}