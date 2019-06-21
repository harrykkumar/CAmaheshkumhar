import { LoginService } from './../../commonServices/login/login.services';
import { Component } from '@angular/core'
import { TokenService } from '../../commonServices/token.service'
import { Router } from '@angular/router';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
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
  constructor (
    private _tokenServices: TokenService,
    private router: Router,
    public _loginService: LoginService) {
    this.loggedinUserData = this._loginService.userData
  }
  public siderbarMenu () {
    $('.app').toggleClass('is-collapsed')
    $('.sidebar').toggleClass('page-container')
  }

  /* Function to navigate branch list page */
  navigateTo = (path) => {
    if (path === 'modules') {
      this._loginService.moduleSelected.next(false)
    }
    this.router.navigate([path])
  }
}
