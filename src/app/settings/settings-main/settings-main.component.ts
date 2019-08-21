import { Settings } from './../../shared/constants/settings.constant';
import { LoginService } from 'src/app/commonServices/login/login.services';
import { Component } from '@angular/core'
import { SettingsService } from '../settings.service';
import { Router } from '@angular/router';
import * as _ from 'lodash'


@Component({
  selector: 'app-settings-main',
  templateUrl: './settings-main.component.html',
  styleUrls: ['./settings-main.component.css']
})
export class SettingsMainComponent {
  title = 'Master Settings'
  loggedinUserData: any = {}
  showHeader: boolean = false;
  constructor(private settingsService: SettingsService,
    private router: Router,
    public loginService: LoginService,
    private settings: Settings) {
    if (_.isEmpty(this.loginService.loginUserDetails)) {
      this.loginService.loginUserDetails = JSON.parse(localStorage.getItem('LOGIN_USER'));
    }
    if (_.includes(this.router.url, 'organization')) {
      this.showHeader = true;
      const organization = JSON.parse(localStorage.getItem('SELECTED_ORGANIZATION'))
      this.loggedinUserData =  this.loggedinUserData = Object.assign({}, {
        'fromDate': this.settings.finFromDate, 'toDate': this.settings.finToDate,
        'Name': organization.Name
      })
    }
    if (_.isEmpty(this.loginService.selectedOrganization)) {
      this.loginService.selectedOrganization = JSON.parse(localStorage.getItem('SELECTED_ORGANIZATION'))
    }
  }

  saveForm() {
    this.settingsService.saveForm()
  }
}
