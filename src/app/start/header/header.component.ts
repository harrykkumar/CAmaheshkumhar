import { Component } from '@angular/core'
import { TokenService } from '../../commonServices/token.service'
import { Router } from '@angular/router';
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
    private _tokenServices: TokenService,
    private router: Router) {
  }
  public siderbarMenu () {
    $('.app').toggleClass('is-collapsed')
    $('.sidebar').toggleClass('page-container')
  }

  logOut () {
    console.log('dfgdfdh')
    this._tokenServices.destroyToken()
  }

  /* Function invoke on click of organisation profile menu */
  showProfile = () => {
    this.showProfileStatus = {
      profileOpen: true,
      editMode: true
    }
  }

  /* Function to navigate branch list page */
  navigate = (path) => {
    this.router.navigate([path])
  }

  /* Function invoke on click of save and close org-profile modal  */
  closeProfile = (event) => {
    this.showProfileStatus = {
      profileOpen: false,
      editMode: false
    }
  }

}
