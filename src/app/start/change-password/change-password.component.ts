import { ToastrCustomService } from 'src/app/commonServices/toastr.service';
import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from 'src/app/commonServices/login/login.services';
import * as _ from 'lodash';
declare var $: any

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
model: any = {};
userList: Array<any> = [];
  constructor(
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private loginService: LoginService,
    private toaster: ToastrCustomService
  ) {
    this.spinner.show();
    this.commonService.getUserUtilityList('ChangePwd').subscribe(
      (res) => {
        if (res.Code === 1000 && !_.isEmpty(res.Data)) {
          this.userList = [...res.Data]
          if(this.userList.length === 1) {
            this.model.userId = this.userList[0].Id
          }
        } else {
          this.userList = []
        }
      })
  }

  ngOnInit() {
    this.commonService.openModal('change_password')
    this.spinner.hide()
  }
  
  validate() {
    if (this.model.newPassword && this.model.confirmPassword && (this.model.newPassword !== this.model.confirmPassword)) {
      return false
    } else {
      return true
    }
  }

  closeForm() {
    this.commonService.closeModal('change_password')
    this.commonService.navigateToPreviousUrl()
  }

  submit() {
    this.spinner.show()
    const data = {
      NewPassword: this.model.newPassword,
      OldPassword: this.model.password,
      NewUserId: this.model.userId
    }
    this.loginService.changePassword(data).subscribe(
      (res) => {
        if (res.Code === 1000) {
          this.toaster.showSuccess('', 'Password Changed Successfully')
          this.closeForm()
        } else {
          this.toaster.showError('', res.Message)
        }
        this.spinner.hide();
      },
      (error) => this.spinner.hide())
  }
}
