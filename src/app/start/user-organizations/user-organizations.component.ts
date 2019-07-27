import { TokenService } from './../../commonServices/token.service';
import { LoginService } from './../../commonServices/login/login.services';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash'
import { GlobalService } from '../../commonServices/global.service';


@Component({
  selector: 'app-user-organizations',
  templateUrl: './user-organizations.component.html',
  styleUrls: ['./user-organizations.component.css']
})
export class UserOrganizationsComponent implements OnInit {
  loggedinUserData: any = {}
  modalData: { open: boolean; editId?: number };
  organizationList: any = []
  constructor(private router: Router,
    public _loginService: LoginService,
    private tokenService: TokenService,
    private gs: GlobalService
  ) { }

  ngOnInit () {
    this.initOrganizationList()
  }

  navigateTo = async (path, selectedOrganization, index) => {
    const token = await this._loginService.extendJwtToken({ OrgId : selectedOrganization.Id})
    console.log(token)
    this.tokenService.saveToken(token)
    this.gs.getOrgDetails()
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

  addNewCompany = () => {
    this.modalData = {
      open: true
    }
  }

  editCompany = (item) => {
    this.modalData = {
      open: true,
      editId: item.Id
    }
  }

  closeModal = async (data) => {
    if (!data || (!_.isEmpty(this.modalData) && Number(data) === this.modalData.editId)) {
      this.modalData = {
        open: false
      }
      await this._loginService.getUserOrganization();
      this.organizationList = [...this._loginService.userOrganizations];
    } else if (data) {
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
