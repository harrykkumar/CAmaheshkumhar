import { TokenService } from './../../commonServices/token.service';
import { LoginService } from './../../commonServices/login/login.services';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash'


@Component({
  selector: 'app-user-organizations',
  templateUrl: './user-organizations.component.html',
  styleUrls: ['./user-organizations.component.css']
})
export class UserOrganizationsComponent implements OnInit {
  loggedinUserData: any = {}
  organizationList: any = []
  constructor(private router: Router,
    public _loginService: LoginService,
    private tokenService: TokenService,
  ) { }

  ngOnInit () {
    this.initOrganizationList()
  }

  navigateTo = async (path, selectedOrganization, index) => {
    const token = await this._loginService.extendJwtToken({ OrgId : selectedOrganization.Id})
    this.tokenService.saveToken(token)
    this._loginService.selectedOrganization = selectedOrganization
    localStorage.setItem('SELECTED_ORGANIZATION', JSON.stringify(this._loginService.selectedOrganization))
    this._loginService.mapModules(selectedOrganization)
  }

  initOrganizationList = async () => {
    if (_.isEmpty(this._loginService.userOrganizations)) {
      await this._loginService.getUserOrganization();
      this.organizationList = [...this._loginService.userOrganizations];
    } else {
      this.organizationList = [...this._loginService.userOrganizations];
    }
  }
}
