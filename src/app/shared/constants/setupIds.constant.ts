import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class SetUpIds {

  public static get catLevel (): number {
    return 1
  }

  public static get dateFormat (): number {
    return 39
  }

  public static get currency (): number {
    return 37
  }

  public static get noOfDecimalPoint (): number {
    return 43
  }

  public static get unitType (): number {
    return 56
  }

  public static get backDateEntry (): number {
    return 58
  }

  public static get godamWiseStockManagement (): number {
    return 5
  }

  public static get gstCalculationOnFreightOrOtherChange (): number {
    return 57
  }

  public static get allowForAdvancePayment (): number {
    return 59
  }

  public static get purchaseBillNoManually (): number {
    return 60
  }

  public static get multiple (): number {
    return 4
  }

  public static get single (): number {
    return 3
  }

  public static get getBoolean (): number {
    return 1
  }

  public static get getStrOrNum (): number {
    return 2
  }

  public static get baseTypeNum (): number {
    return 1
  }

  public static get baseTypeStr (): number {
    return 2
  }
}
