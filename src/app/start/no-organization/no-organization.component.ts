import { LoginService } from './../../commonServices/login/login.services';
import { Component, OnInit, ComponentFactoryResolver, ViewContainerRef, ViewChild } from '@angular/core';
import * as _ from 'lodash'
import { CompanyProfileComponent } from '../company-profile/company-profile.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-no-organization',
  templateUrl: './no-organization.component.html',
  styleUrls: ['./no-organization.component.css']
})
export class NoOrganizationComponent implements OnInit {
  modalData: { open: boolean; };
  @ViewChild('companyContainer', { read: ViewContainerRef }) companyContainerRef: ViewContainerRef;
  companyComponentRef: any;

  constructor(
    public _loginService: LoginService,
    private resolver: ComponentFactoryResolver,
    private spinnerService: NgxSpinnerService,
  ) {
    this.spinnerService.hide()
   }

  ngOnInit() {
    if (_.isEmpty(this._loginService.loginUserDetails)) {
      this._loginService.loginUserDetails = JSON.parse(localStorage.getItem('LOGIN_USER'));
    }
  }

  createComponent() {
    this.companyContainerRef.clear();
    const factory = this.resolver.resolveComponentFactory(CompanyProfileComponent);
    this.companyComponentRef = this.companyContainerRef.createComponent(factory);
    this.companyComponentRef.instance.modalData = {
      open: true
    };
    this.companyComponentRef.instance.closeModal.subscribe(
      (data:any) => {
        this.companyComponentRef.destroy();
      });
  }

  ngOnDestroy(): void {
    if (!_.isEmpty(this.companyComponentRef)) {
      this.companyComponentRef.destroy();
    }
  }
}
