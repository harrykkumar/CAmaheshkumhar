import { Component } from '@angular/core';
import { BaseServices } from '../commonServices/base-services';
import { GlobalService } from '../commonServices/global.service';
import { ApiConstant } from '../shared/constants/api';
import { ToastrCustomService } from '../commonServices/toastr.service';
@Component({
  selector: 'app-forgot-credentials',
  templateUrl: './forgot-credentials.component.html'
})
export class ForgotCredentialsComponent {
  model: any = {
    SendOn: 'Mobile'
  }
  constructor(private _bs: BaseServices, private _gs: GlobalService, private _ts: ToastrCustomService) {

  }

  check() {
    // this._gs.manipulateResponse(this._bs.postRequest(ApiConstant.CHECK_FOR_CREDENTIALS, this.model)).subscribe(
    //   (data) => {
    //     console.log(data)
    //     this._ts.showSuccess('Otp is sent successfully on registered ' + this.model.SendOn, '')
    //   },
    //   (error) => {
    //     this._ts.showErrorLong(error, '')
    //   }
    // )
  }
}