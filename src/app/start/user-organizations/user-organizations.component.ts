import { TokenService } from './../../commonServices/token.service';
import { LoginService } from './../../commonServices/login/login.services';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash'
import { GlobalService } from '../../commonServices/global.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CompanyProfileService } from '../company-profile/company-profile.service';
import {
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef,
  ComponentFactory
} from '@angular/core';
import { CompanyProfileComponent } from '../company-profile/company-profile.component';

@Component({
  selector: 'app-user-organizations',
  templateUrl: './user-organizations.component.html',
  styleUrls: ['./user-organizations.component.css']
})
export class UserOrganizationsComponent implements OnInit {
  @ViewChild('companyContainer', { read: ViewContainerRef }) companyContainerRef: ViewContainerRef;
  companyComponentRef: any;
  loggedinUserData: any = {}
  modalData: { open: boolean; editId?: number };
  constructor(private router: Router,
    public _loginService: LoginService,
    private tokenService: TokenService,
    private gs: GlobalService,
    private spinnerService: NgxSpinnerService,
    private resolver: ComponentFactoryResolver,
    private orgProfileService: CompanyProfileService
  ) { 
    this.spinnerService.hide()
  }

  createComponent(item?) {
    this.companyContainerRef.clear();
    const factory = this.resolver.resolveComponentFactory(CompanyProfileComponent);
    this.companyComponentRef = this.companyContainerRef.createComponent(factory);
    if (_.isEmpty(item)) {
      this.companyComponentRef.instance.modalData = {
        open: true
      };
    } else {
      this.companyComponentRef.instance.modalData = {
        open: true,
        editId: item.Id
      };
    }
    this.companyComponentRef.instance.closeModal.subscribe(
      (data) => {
        this.companyComponentRef.destroy();
        if (!_.isEmpty(data)) {
          this.initOrganizationList();
        }
      });
  }

  ngOnInit() {
    this.initOrganizationList()
  }

  ngOnDestroy(): void {
    if (!_.isEmpty(this.companyComponentRef)) {
      this.companyComponentRef.destroy();
    }
  }

  navigateTo = async (selectedOrganization) => {
    this.spinnerService.show();
    const token = await this._loginService.extendJwtToken({ OrgId: selectedOrganization.Id })
    this.tokenService.saveToken(token)
    this.gs.getOrgDetails()
    this._loginService.selectedOrganization = selectedOrganization
    localStorage.setItem('SELECTED_ORGANIZATION', JSON.stringify(this._loginService.selectedOrganization))
    this._loginService.mapBranch(selectedOrganization);
  }

  initOrganizationList = async () => {
    this.spinnerService.show();
    if (_.isEmpty(this._loginService.organizationList)) {
      await this._loginService.getUserOrganization();
    }
    this.spinnerService.hide();
  }
}
