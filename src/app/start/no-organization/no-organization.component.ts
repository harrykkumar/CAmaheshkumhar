import { LoginService } from './../../commonServices/login/login.services';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/commonServices/token.service';
import * as _ from 'lodash'

@Component({
  selector: 'app-no-organization',
  templateUrl: './no-organization.component.html',
  styleUrls: ['./no-organization.component.css']
})
export class NoOrganizationComponent implements OnInit {
  modalData: { open: boolean; };

  constructor(
    private router: Router,
    public _loginService: LoginService,
    private tokenService: TokenService
  ) { }

  ngOnInit() {
  }
  addNewCompany = () => {
    this.modalData = {
      open: true
    }
  }
  closeModal = async (data) => {
    this.modalData = {
      open: false
    }
    if (data) {
      const Id = Number(data)
      const token = await this._loginService.extendJwtToken({ OrgId: Id })
      this.tokenService.saveToken(token)
      await this._loginService.getUserOrganization()
      this._loginService.selectedOrganization = _.find(this._loginService.userOrganizations, { Id: Id });
      localStorage.setItem('SELECTED_ORGANIZATION', JSON.stringify(this._loginService.selectedOrganization))
      this.router.navigate(['organization/settings/setup']);
    }
  }
}
