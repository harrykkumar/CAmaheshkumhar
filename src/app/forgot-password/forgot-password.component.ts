import { Component } from '@angular/core'
import { Subscription } from 'rxjs'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { OtpModel } from 'src/app/model/sales-tracker.model'
import { UIConstant } from '../shared/constants/ui-constant'
import { ErrorConstant } from '../shared/constants/error-constants'
import { ForgotpasswordService } from '../commonServices/login/forgot-password.service'
import { ValidationService } from '../commonServices/validatio-services'
declare var $: any

@Component({
  selector: 'auth-login',
  templateUrl: './forgot-password.component.html'
})

export class ForGotPasswordComponent {

  custId: number
  userName: number
  password: number
  emailDiv: boolean
  emailorPhoneNo: any
  submitClick: boolean
  resendTimer: number
  otpErrorDiv: boolean
  resendButton: boolean
  errorMassage: string
  subscribe: Subscription
  emailRadioButton: boolean
  otpVerifyForm: FormGroup
  forGotpaswordForm: FormGroup

  constructor (private _forgotPasswordServices: ForgotpasswordService,
        private _formBuilder: FormBuilder) {
    this.emailMobileForm()
    this.otpForm()
  }

  private emailMobileForm () {
    this.forGotpaswordForm = this._formBuilder.group({
      'email': [UIConstant.BLANK],
      'mobileNo': [UIConstant.BLANK, [Validators.required, ValidationService.phoneValidator]]
    })
  }
  private otpForm () {
    this.otpVerifyForm = this._formBuilder.group({
      'Code': [UIConstant.BLANK, [Validators.required]]
    })
  }

  emaolOrPhone (event) {
    this.submitClick = false
    if (event === UIConstant.EMAIL) {
      this.emailDiv = true
      this.emailMobileForm()
      this.forGotpaswordForm.get(UIConstant.EMAIL).setValidators([Validators.required, ValidationService.emailValidator])
      this.forGotpaswordForm.get(UIConstant.EMAIL).updateValueAndValidity()
      this.forGotpaswordForm.get(UIConstant.MOBILE_NO).clearValidators()
    } else {
      this.emailMobileForm()
      this.forGotpaswordForm.get(UIConstant.MOBILE_NO).setValidators([Validators.required, ValidationService.phoneValidator])
      this.forGotpaswordForm.get(UIConstant.MOBILE_NO).updateValueAndValidity()
      this.forGotpaswordForm.get(UIConstant.EMAIL).clearValidators()
      this.emailDiv = false
    }
  }

  custIdCheckBox (event) {
    if (event === true) {
      this.custId = UIConstant.ONE
      this.disabledEmail()
    } else {
      this.custId = UIConstant.ZERO
      this.disabledEmail()
    }
  }

  userCheckBox (event) {
    if (event === true) {
      this.userName = UIConstant.ONE
      this.disabledEmail()
    } else {
      this.userName = UIConstant.ZERO
      this.disabledEmail()
    }
  }

  forGotPaaswordCheckBox (event) {
    if (event === true) {
      this.password = UIConstant.ONE
      this.disabledEmail()
    } else {
      this.password = UIConstant.ZERO
      this.disabledEmail()
    }
  }

  disabledEmail () {
    if (this.custId === UIConstant.ONE && this.password === UIConstant.ONE && this.userName === UIConstant.ONE) {
      this.emailRadioButton = true
      this.emailDiv = false
      $('#phone').prop('checked', true)
    } else {
      this.emailRadioButton = false
    }
  }

  sendeOtp () {
    this.submitClick = true
    this.resendButton = false
    if (this.forGotpaswordForm.valid) {
      this.subscribe = this._forgotPasswordServices.sendEmailOtpService(0, 16, this.forGotpaswordForm.value.mobileNo, this.forGotpaswordForm.value.email).subscribe(data => {
        this.emailorPhoneNo = data.Data.otp.data
        $('#otp_model').modal(UIConstant.MODEL_SHOW)
        this.otpTimer()
      })

    }
  }

  private otpTimer () {
    this.otpForm()
    this.submitClick = false
    this.otpErrorDiv = false
    this.resendTimer = UIConstant.THIRTY
    const tempTimer = setInterval(() => {
      if (this.resendTimer === UIConstant.ZERO) {
        this.resendButton = true
        clearTimeout(tempTimer)
      } else {
        this.resendTimer--
      }
    }, UIConstant.THOUSAND)
  }

  verifyOtp () {
    this.submitClick = true
    if (this.otpVerifyForm.valid) {
      this.subscribe = this._forgotPasswordServices.verifyOtp(this.varigyOtpParams()).subscribe(data => {
        console.log(data)
        const otpData = data.Data.otp.data
        if (otpData === UIConstant.TRUE) {
          $('#otp_model').modal(UIConstant.MODEL_HIDE)
          this.otpErrorDiv = true
        } else {
          this.otpForm()
          this.otpErrorDiv = true
          this.submitClick = false
          this.errorMassage = ErrorConstant.INVALID_USER
        }
      })
    }
  }

  private varigyOtpParams (): OtpModel {
    const otpElement = {
      loginObj: {
        ParentId: 0,
        ParentTypeId: 16,
        MobileNo: this.forGotpaswordForm.value.mobileNo,
        Code: this.otpVerifyForm.value.Code,
        EmailId: this.forGotpaswordForm.value.email
      } as OtpModel
    }
    return otpElement.loginObj
  }

  closeButtonClearbutton () {
    this.submitClick = false
    this.otpForm()
    this.otpErrorDiv = false
    this.resendButton = false
  }
  otpClearValidation () {
    this.otpErrorDiv = false
  }

}
