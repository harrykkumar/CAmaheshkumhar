import { TokenService } from './../../commonServices/token.service';
import { ToastrCustomService } from 'src/app/commonServices/toastr.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/commonServices/login/login.services';
import { GlobalService } from 'src/app/commonServices/global.service';
import { Settings } from 'src/app/shared/constants/settings.constant';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash'

@Component({
  selector: 'app-user-branches',
  templateUrl: './user-branches.component.html',
  styleUrls: ['./user-branches.component.css']
})
export class UserBranchesComponent implements OnInit {
  loggedinUserData: any = {}
  clientDateFormat: string = ''
  organization: any = {};
  constructor(
    private router: Router,
    public _loginService: LoginService,
    private gs: GlobalService,
    private settings: Settings,
    private toastrService: ToastrCustomService,
    private spinnerService: NgxSpinnerService,
    private tokenService: TokenService
  ) {
    this.spinnerService.hide()
    this.clientDateFormat = this.settings.dateFormat
    this.organization = JSON.parse(localStorage.getItem('SELECTED_ORGANIZATION'))
    if(_.isEmpty(this._loginService.loginUserDetails)){
      this._loginService.loginUserDetails = JSON.parse(localStorage.getItem('LOGIN_USER'));
    }
    this.loggedinUserData = {
      'fromDate': this.settings.finFromDate,
      'toDate': this.settings.finToDate,
      'Name': this.organization.Name
    };
  }

  ngOnInit() {
    this.initBranchList();
  }

  initBranchList() {
    this.spinnerService.show();
    if (_.isEmpty(this._loginService.branchList)) {
      this._loginService.mapBranch(this.organization)
    }
    this.spinnerService.hide();
  }

  navigateTo = async (selectedBranch) => {
    this.spinnerService.show();
    const token = await this._loginService.extendJwtToken(
      {
        OrgId: this.organization.Id,
        BranchId: selectedBranch.BranchId,
        OfficeId: selectedBranch.OfficeId
      });
    if (token) {
      this.tokenService.saveToken(token)
      localStorage.setItem('SELECTED_BRANCH', JSON.stringify(selectedBranch))
      const finYear = JSON.parse(localStorage.getItem('SELECTED_FIN_YEAR'));
      if (!_.isEmpty(finYear) && this.organization.Id === finYear.OrgId) {
        this._loginService.mapModules(this.organization);
      } else {
        localStorage.removeItem('SELECTED_FIN_YEAR');
        this._loginService.mapFinYear(this.organization);
      }
    } else {
      this.spinnerService.hide();
    }
  }
}
