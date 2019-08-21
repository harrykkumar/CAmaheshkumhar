import { Component } from '@angular/core'
import { FormBuilder, Validators, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { LoginModel } from 'src/app/model/sales-tracker.model'
import { UIConstant } from '../shared/constants/ui-constant'
import { URLConstant } from '../shared/constants/urlconstant'
import { ErrorConstant } from '../shared/constants/error-constants'
import { LoginService } from '../commonServices/login/login.services'
import { TokenService } from '../commonServices/token.service'
import { ToastrCustomService } from '../commonServices/toastr.service'
import { GlobalService } from '../commonServices/global.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'auth-login',
  templateUrl: './login.component.html'
})

export class LoginComponent {
  loginForm: FormGroup
  submitClick: boolean
  invalidUser: boolean
  title = 'LoginComponent'
  errorMessage: string

  constructor (private _loginService: LoginService,
        private tokenService: TokenService,
        private _formBuilder: FormBuilder,
        private router: Router,
        private _toastrCustomService: ToastrCustomService,
        private spinnerService: NgxSpinnerService        
    ) {
    this.loginForm = this._formBuilder.group({
      'username': [UIConstant.BLANK, Validators.required],
      'customerId': [UIConstant.BLANK, Validators.required],
      'password': [UIConstant.BLANK, Validators.required]
    })
  }

  ngOnInit () {
    this._loginService.destroyParametersOnLogin();
    if (this.tokenService.getToken() != null) {
      this.router.navigate([URLConstant.ADMIN_URL])
    }
    this.invalidUser = false
  }

  login() {
    this.submitClick = true
    if (this.loginForm.valid) {
      this.spinnerService.show();
      this._loginService.login(this.LoginParms()).subscribe(
        data => {
          if (data.Code === 5003) {
            this._toastrCustomService.showError('', data.Message)
            this.spinnerService.hide();
          }
          if (data.Code ===UIConstant.THOUSAND && data.Data != null) {
            this.tokenService.saveToken(data.Data.Token)
            this._loginService.mapOrganizations();
          } else {
            this.invalidUser = true
            this.errorMessage = ErrorConstant.INVALID_USER
            this.loginForm.controls.password.reset()
            this.submitClick = false
            this.spinnerService.hide();
          }
        }
      )
    }
  }

  private LoginParms (): LoginModel {
    const loginElement = {
      loginObj: {
        username: this.loginForm.value.username,
        customerId: this.loginForm.value.customerId,
        password: this.loginForm.value.password
      } as LoginModel
    }
    return loginElement.loginObj
  }

  forgotPassword () {
    this.router.navigate([URLConstant.FORGOT_PASSWORD_URL])
  }

  clearErrorValidation () {
    this.invalidUser = false
  }
}
