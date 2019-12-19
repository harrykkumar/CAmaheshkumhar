import { Settings } from './../../shared/constants/settings.constant';
import { LoginService } from './../../commonServices/login/login.services'
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import * as _ from 'lodash'
import { ToastrCustomService } from '../../commonServices/toastr.service';
import { GlobalService } from 'src/app/commonServices/global.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-user-modules',
  templateUrl: './user-modules.component.html',
  styleUrls: ['./user-modules.component.css']
})
export class UserModulesComponent implements OnInit {
  loggedinUserData: any = {}
  clientDateFormat: string = ''
  constructor(
    private router: Router,
    public _loginService: LoginService,
    private gs: GlobalService,
    private settings: Settings,
    private toastrService: ToastrCustomService,
    private spinnerService: NgxSpinnerService
  ) {
    this.spinnerService.hide()
    const organization = JSON.parse(localStorage.getItem('SELECTED_ORGANIZATION'))
    // if (_.isEmpty(this.clientDateFormat)) {
    //   this.clientDateFormat = 'd M Y'
    // }
    if(_.isEmpty(this._loginService.loginUserDetails)){
      this._loginService.loginUserDetails = JSON.parse(localStorage.getItem('LOGIN_USER'));
    }
    this.loggedinUserData = {
      'fromDate': this.settings.finFromDate,
      'toDate': this.settings.finToDate,
      'Name': organization.Name
    };
  }

  ngOnInit() {
    this.spinnerService.hide();
    this.initModulesData()
    this.initUpdatePermission()
  }

  navigateTo = async (path, selectedModule, index) => {
    this.spinnerService.show();
    if (selectedModule.Id) {
      await this._loginService.getAllSettings(selectedModule.Id)
    }
    selectedModule['index'] = index
    localStorage.setItem('SELECTED_MODULE', JSON.stringify(selectedModule))
    if (selectedModule.Id === 4) {
      this.router.navigate(['crm/dashboard']);
    } else {
      this.router.navigate([path])
    }
  }

  initModulesData = async () => {
    // debugger
    this.spinnerService.show()
    const organization = JSON.parse(localStorage.getItem('SELECTED_ORGANIZATION'))
    if (_.isEmpty(this._loginService.userData) || (!_.isEmpty(this._loginService.userData) && _.isEmpty(this._loginService.userData.Modules))) {
      await this._loginService.getUserDetails(organization.Id)
    }
    this.spinnerService.hide()
  }

  initUpdatePermission = () => {
    this._loginService.permissionUpdated.subscribe(
      (res) => {
        if (res === true) {
          this.initModulesData()
        }
      })
  }
}
