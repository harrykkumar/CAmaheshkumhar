import { async } from '@angular/core/testing';
import { Component } from '@angular/core'
import { FormBuilder, Validators, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { LoginModel } from 'src/app/model/sales-tracker.model'
import { UIConstant } from '../shared/constants/ui-constant'
import { URLConstant } from '../shared/constants/urlconstant'
import { ErrorConstant } from '../shared/constants/error-constants'
import { LoginService } from '../commonServices/login/login.services'
import { TokenService } from '../commonServices/token.service'
import { Settings } from '../shared/constants/settings.constant'
import { ToastrCustomService } from '../commonServices/toastr.service'

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
        private _route: Router,
        private settings: Settings,
        private _toastrCustomService: ToastrCustomService
    ) {
    this.loginForm = this._formBuilder.group({
      'username': [UIConstant.BLANK, Validators.required],
      'customerId': [UIConstant.BLANK, Validators.required],
      'password': [UIConstant.BLANK, Validators.required]
    })
  }

  ngOnInit () {
    if (this.tokenService.getToken() != null) {
      this._route.navigate([URLConstant.ADMIN_URL])
    }
    this.invalidUser = false
  }

  login() {
    this.submitClick = true
    if (this.loginForm.valid) {
      this._loginService.login(this.LoginParms()).subscribe(
        data => {
          console.log('login : ', data)
          if (data.Code === UIConstant.THOUSAND && data.Data) {
            this.settings.dateFormat = data.Data.DateFormat
            this.settings.catLevel = data.Data.CategoryLevel
            this.settings.industryId = data.Data.IndustryId
          }
          if (data.Code === 5003) {
            this._toastrCustomService.showError('', data.Message)
          }
          if (data.Data != null) {
            this.tokenService.saveToken(data.Data.Token)
            // this.mapModules()
            this.mapOrganizations();
          } else {
            this.invalidUser = true
            this.errorMessage = ErrorConstant.INVALID_USER
            this.loginForm.controls.password.reset()
            this.submitClick = false
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
    this._route.navigate([URLConstant.FORGOT_PASSWORD_URL])
  }

  clearErrorValidation () {
    this.invalidUser = false
  }

 async mapOrganizations(){
   await this._loginService.getUserOrganization();
   if(this._loginService.userOrganizations.length === 0){
    this._route.navigate(['no-organization'])
   } else if(this._loginService.userOrganizations.length === 1) {
    this._loginService.selectedOrganization = { ...this._loginService.userOrganizations[0] }
    const token = await this._loginService.extendJwtToken({ OrgId : this._loginService.selectedOrganization.Id})
    this.tokenService.saveToken(token)
    localStorage.setItem('SELECTED_ORGANIZATION', JSON.stringify(this._loginService.selectedOrganization))
    this._loginService.mapModules(this._loginService.selectedOrganization);
   } else {
     this._route.navigate(['organizations']);
   }
  }

}
