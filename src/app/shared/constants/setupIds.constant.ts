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
}
