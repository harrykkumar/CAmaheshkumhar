import { LoginService } from './../../commonServices/login/login.services';
import { Component } from '@angular/core'
import { TokenService } from '../../commonServices/token.service'
import { Router } from '@angular/router';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Settings } from 'src/app/shared/constants/settings.constant';
declare const $: any
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  loggedinUserData: any = {}
  showProfileStatus: any = {
    profileOpen: false,
    editMode: false
  }
  clientDateFormat: string = ''
  constructor (
    private _tokenServices: TokenService,
    private router: Router,
    private settings: Settings,
    public _loginService: LoginService) {
    this.clientDateFormat = this.settings.dateFormat
    const organization = JSON.parse(localStorage.getItem('SELECTED_ORGANIZATION'))
    this.loggedinUserData = {
      'fromDate': this.settings.finFromDate,
      'toDate': this.settings.finToDate,
      'name': organization.Name
    }
  }
  public siderbarMenu () {
    $('.app').toggleClass('is-collapsed')
    $('.sidebar').toggleClass('page-container')
  }
}
