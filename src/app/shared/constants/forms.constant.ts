import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class FormConstants {

  public static get Edit (): number {
    return 1
  }

  public static get Print (): number {
    return 2
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
}
