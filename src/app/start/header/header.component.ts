import { Component } from '@angular/core'
import { TokenService } from '../../commonServices/token.service'
declare const $: any
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  showProfileStatus: any = {
    profileOpen: false,
    editMode: false
  }
  constructor (
    private _tokenServices: TokenService) {
  }
  public siderbarMenu () {
    $('.app').toggleClass('is-collapsed')
    $('.sidebar').toggleClass('page-container')
  }

  logOut () {
    console.log('dfgdfdh')
    this._tokenServices.destroyToken()
  }

  /* Function to navigate branch list page */
  // navigate = (path) => {
  //   this.router.navigate([path])
  // }

  /* Function invoke on click of save and close org-profile modal  */
  // closeProfile = (event) => {
  //   this.showProfileStatus = {
  //     profileOpen: false,
  //     editMode: false
  //   }
  // }

  // navToSettings = () => {
  //   this.router.navigate([URLConstant.SETTINGS_PAGE])
  // }
}
