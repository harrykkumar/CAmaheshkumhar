import { Settings } from './../../shared/constants/settings.constant';
import { LoginService } from './../../commonServices/login/login.services';
import { UIConstant } from './../../shared/constants/ui-constant';
import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/commonServices/token.service';
declare var $: any
import * as _ from 'lodash'
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-user-financial-years',
  templateUrl: './user-financial-years.component.html',
  styleUrls: ['./user-financial-years.component.css']
})
export class UserFinancialYearsComponent implements OnInit {
  selectedFinYearId: any;
  constructor(
    public _loginService: LoginService,
    private tokenService: TokenService,
    private spinnerService: NgxSpinnerService,
    private settings: Settings
  ) {
  }

  ngOnInit() {
    $('#fin_year_select').modal({ backdrop: 'static', keyboard: false });
    $('#fin_year_select').modal(UIConstant.MODEL_SHOW);
    this.initFinancialYearList();
  }

  async  initFinancialYearList() {
    this.spinnerService.show();
    if (_.isEmpty(this._loginService.finYearList)) {
      const organization = JSON.parse(localStorage.getItem('SELECTED_ORGANIZATION'));
      await this._loginService.getFinancialYearList(organization.Id);
    }
    this.spinnerService.hide();
  }

  ngOnDestroy(): void {
    $('#fin_year_select').modal(UIConstant.MODEL_HIDE);
  }

  async navigateToModules(selectedFinYear) {
    this.spinnerService.show();
    const token = await this._loginService.extendJwtToken(
      {
        OrgId: this._loginService.selectedOrganization.Id,
        Financialyear: selectedFinYear.Id
      });
    if (token) {
      this.tokenService.saveToken(token)
      this._loginService.selectedFinYear = selectedFinYear;
      localStorage.setItem('SELECTED_FIN_YEAR', JSON.stringify(selectedFinYear))
      this.settings.finFromDate = selectedFinYear.FromDate
      this.settings.finToDate = selectedFinYear.ToDate
      this._loginService.mapModules(this._loginService.selectedOrganization);
    }
  }
}