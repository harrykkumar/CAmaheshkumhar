import { Injectable } from '@angular/core'
import { BaseServices } from '../base-services'
import { ApiConstant } from '../../shared/constants/api'

@Injectable({
  providedIn: 'root'
})
export class ForgotpasswordService {

  constructor (private _basesService: BaseServices) { }

  public sendEmailOtpService (ParentId: number, ParentTypeId: number, mobileNo, email) {
    return this._basesService.getRequest(ApiConstant.SEND_EMAIL_OTP_URL + 'ParentId=' + ParentId + '&' + 'ParentTypeId=' +
            ParentTypeId + '&' + 'MobileNo=' + mobileNo + '&' +
            'EmailId=' + email)
  }

  public verifyOtp (params) {
    return this._basesService.postRequest(ApiConstant.OTP_VERIFY_URL, params)
  }
}
