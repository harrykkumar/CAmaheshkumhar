import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class ErrorConstant {
  public static get INVALID_USER (): string { return 'Username password combination is not valid' }

  public static get REQUIRED (): string { return 'field mandatory !' }

  public static get ATLEAST_ADD_SINGLE_RECORD (): string { return 'AtLeast Select Single Filed' }

  public static get RECORD_NOT_FOUND_TABLE (): string { return 'Record not found' }
}
