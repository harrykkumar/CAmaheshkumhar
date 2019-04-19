import { Injectable } from '@angular/core'
@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  public static getValidatorErrorMessage (validatorName: string, validatorValue?: any) {

    const config = {
      'required': 'field mandatory !',
      'invalidphonetNumber': 'invalid contact number',
      'email': 'not valid email !'
    }
    return config[validatorName]
  }
  public static phoneValidator (control: any) {
    const contact: any = control.value
    if (null != contact && contact.toString().match(/^[0-9]/) && (contact.toString().length === 10)) {
      return null
    } else {
      return { 'invalidphonetNumber': true }
    }
  }
  public static emailValidator (control: any) {
    if ((control.value.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/) || control.value.match(/^[789]\d{9}$/)) && (control.value.length <= 30)) {
      return null
    } else {
      return { 'invalidEmailContact': true }
    }
  }
}
