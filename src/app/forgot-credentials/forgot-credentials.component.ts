import { Router } from '@angular/router';
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
  model: any = {}
  constructor(private _bs: BaseServices, private _gs: GlobalService, private _ts: ToastrCustomService,
    private router: Router) {
    this.model = {
      SendOn: 'Mobile',
      Code: '',
      LoginId: ''
    }
  }

  onChange(val) {
    console.log(this.model)
  }

  validate() {
    let valid = 1;
    if (this.model.Abbreviation === 'ForgotPassword' && (!this.model.Code || !this.model.LoginId))  {
      valid = 0
    }
    return !!valid
  }

  check() {
    this._gs.manipulateResponse(this._bs.postRequest(ApiConstant.CHECK_FOR_CREDENTIALS, this.model)).subscribe(
      (data) => {
        console.log(data)
        this._ts.showSuccess('Password is sent successfully on registered ' + this.model.SendOn, '')
        this.router.navigate(['login'])
      },
      (error) => {
        this._ts.showErrorLong(error, '')
      }
    )
  }
}
