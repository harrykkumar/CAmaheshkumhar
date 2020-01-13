import { NgxSpinnerService } from 'ngx-spinner';
import { MODULES_IMG_SRC } from './../../start/user-modules/user-modules-image-src';
import { UIConstant } from './../../shared/constants/ui-constant'
import { Injectable } from '@angular/core'
import { Observable, BehaviorSubject } from 'rxjs';
import { ApiConstant } from '../../shared/constants/api'
import { BaseServices } from '../base-services'
import * as _ from 'lodash'
import { Router } from '@angular/router';
import { map} from 'rxjs/operators';
import { TokenService } from '../token.service';
import { GlobalService } from '../global.service';
import { ToastrCustomService } from '../toastr.service';
import { Settings } from 'src/app/shared/constants/settings.constant';
import { CompanyProfileService } from 'src/app/start/company-profile/company-profile.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  permissionUpdated = new BehaviorSubject(false)
  selectedUserModule: any = {}
  selectedOrganization: any = {}
  selectedFinYear: any = {}
  selectedBranch: any = {}
  finYearList: Array<any> = []
  branchList: Array<any> = []
  userData: any = {}
  organizationList: Array<any> = []
  loginUserDetails: any = {}
  selectedValues: any;
  constructor(private _basesService: BaseServices,
    private router: Router,
    private gs: GlobalService,
    private tokenService: TokenService,
    private toastrService: ToastrCustomService,
    private _baseService: BaseServices,
    private settings: Settings,
    private spinner: NgxSpinnerService,
    private companyProfileService: CompanyProfileService) { }

  public login(params: any): Observable<any> {
    return this._basesService.postRequest(ApiConstant.LOGIN_URL, params)
  }

  logOut() {
    this.spinner.hide();
    this.tokenService.destroyToken()
    this.selectedUserModule = {}
    this.selectedOrganization = {}
    this.userData = {}
    this.organizationList = []
    this.loginUserDetails = {}
  }

  changePassword(data) {
    return this._baseService.postRequest(ApiConstant.CHANGE_PASSWORD, data)
  }

  /* Function to get user data, modules, menus and menu-permissions */
  getUserDetails = (OrgId) => {
    return new Promise((resolve, reject) => {
      this._basesService.getRequest(`${ApiConstant.USER_PROFILE}?Id=${OrgId}`).subscribe(
        async (data) => {
          if (data.Code === UIConstant.THOUSAND) {
            this.userData = JSON.parse(JSON.stringify(data.Data))
            await this.mapSideMenus()
            await this.mapSubMenus()
            await this.mapPermissions()
            resolve(this.userData)
          } else if (data.Code === 5018) {
            this.logOut()
            this.router.navigate(['login'])
            resolve()
          }
        },
        (error) => {
          this.spinner.hide()
        }
      )
    })
  }

  uploadUserImage = (data) => {
    return this._baseService.postRequest(ApiConstant.USER_PROFILE, data)
  }

  /* Function to map side menus and submenus */
  mapSideMenus = async () => {
    return new Promise((resolve, reject) => {
      _.forEach(this.userData.Modules, (module, i) => {
        if (this.userData.Modules[i] && MODULES_IMG_SRC[`${module.Id}`]) {
          this.userData.Modules[i]['src'] = MODULES_IMG_SRC[`${module.Id}`]['src']
        }
        const data = _.filter(this.userData.Menus, (menu) => {
          if (this.userData.Modules[i].Id === menu.ModuleId && menu.ParentId === 0) {
            return true
          }
        })
        if (this.userData.Modules[i]) {
          this.userData.Modules[i]['sideMenu'] = JSON.parse(JSON.stringify(data))
        }
      })
      resolve(true)
    })
  }

  mapSubMenus = () => {
    return new Promise((resolve, reject) => {
      _.forEach(this.userData.Modules, (module, i) => {
        if (this.userData.Modules[i]) {
          const sideMenu = this.userData.Modules[i]['sideMenu']
          _.forEach(sideMenu, (menu, j) => {
            const data = _.filter(this.userData.Menus, (allMenu) => {
              if (allMenu.ModuleId === this.userData.Modules[i].Id && sideMenu[j].Id === allMenu.ParentId) {
                return true
              }
            })
            if (sideMenu[j]) {
              sideMenu[j]['subMenu'] = JSON.parse(JSON.stringify(data))
            }
          })
        }
      })
      resolve(true)
    })
  }

  /* Function to map permissions for menus */
  mapPermissions = () => {
    return new Promise((resolve, reject) => {
      _.map(this.userData.Modules, (module) => {
        _.map(module.sideMenu, (menu) => {
          _.forEach(this.userData.UserPermissionDetails, (permission) => {
            if (module.Id === permission.ModuleId && menu.Id === permission.MenuId) {
              if (permission.GroupId === 1 || permission.GroupId === 2 || permission.GroupId === 3) {
                menu['read'] = true
              }
              if (permission.GroupId === 2 || permission.GroupId === 3) {
                menu['write'] = true
              }
              if (permission.GroupId === 3) {
                menu['delete'] = true
              }
            }
          })
          _.map(menu.subMenu, (subMenu) => {
            _.forEach(this.userData.UserPermissionDetails, (permission) => {
              if (module.Id === permission.ModuleId && subMenu.Id === permission.MenuId) {
                if (permission.GroupId === 1 || permission.GroupId === 2 || permission.GroupId === 3) {
                  subMenu['read'] = true
                }
                if (permission.GroupId === 2 || permission.GroupId === 3) {
                  subMenu['write'] = true
                }
                if (permission.GroupId === 3) {
                  subMenu['delete'] = true
                }
              }
            })
          })
        })
      })
      resolve(true)
    })
  }

  /* Function to get menu permissions */
  getMenuDetails = (menuId, parentMenuId) => {
    const selectedModule = JSON.parse(localStorage.getItem('SELECTED_MODULE'))
    if(!_.isEmpty(selectedModule)){
    const menuArray = JSON.parse(JSON.stringify(selectedModule['sideMenu']));
      if (!_.isEmpty(menuArray)) {
        const parentMenu = _.find(menuArray, { Id: parentMenuId })
        if (!_.isEmpty(parentMenu)) {
          const subMenuArray = JSON.parse(JSON.stringify(parentMenu.subMenu));
          if (!_.isEmpty(subMenuArray)) {
            const selectedMenu = _.find(subMenuArray, { Id: menuId })
            return selectedMenu;
          }
        }
      }
    }
  }

  getUserOrganization() {
    let url = ApiConstant.USER_ORGANIZATION
    return new Promise((resolve, reject) => {
      this._basesService.getRequest(url).subscribe((res) => {
        if (res.Code === UIConstant.THOUSAND) {
          this.organizationList = [...res.Data['OrganizationDetails']];
          this.loginUserDetails = { ...res.Data['LoginUserDetails'][0] }
           this.getModuleIdForAccount()
          localStorage.setItem('LOGIN_USER', JSON.stringify(this.loginUserDetails));
          resolve(this.organizationList);
        } else if (res.Code === 5018) {
          this.logOut()
        }
      },
        (error) => {

        });
    })
  }
getModuleIdForAccount(){
  if( typeof this.loginUserDetails ==='object'){
    if(this.loginUserDetails.ModuleId===17) {
      return true
    }else{
     return false
    }
  }
  else{
    return false

  }

}
  extendJwtToken(data) {
    return this._basesService.postRequest(ApiConstant.EXTENDJWT, data).
      pipe(map((res) => {
        if (!_.isEmpty(res.Data) && res.Data.Token) {
          return res.Data.Token
        }
      })).toPromise();
  }


  mapOrganizations = async (data?) => {
    await this.getUserOrganization();
    if(!_.isEmpty(this.organizationList) && !_.isEmpty(data) && data.ISD === 1){
      this.selectedOrganization = _.find(this.organizationList, {Id: this.selectedValues.OrgId})
      this.setOrganization(data)
    } else {
      if (this.organizationList.length === 0) {
        this.router.navigate(['no-organization'])
      } else if (this.organizationList.length === 1) {
        this.selectedOrganization = { ...this.organizationList[0] }
        const token = await this.extendJwtToken({ OrgId: this.selectedOrganization.Id })
        this.tokenService.saveToken(token)
        this.setOrganization()
      } else {
        this.router.navigate(['organizations']);
      }
    }
  }

  async setOrganization(data?){
    await this.companyProfileService.getOrgDetails()
    localStorage.setItem('SELECTED_ORGANIZATION', JSON.stringify(this.selectedOrganization))
    this.mapBranch(this.selectedOrganization, data);
  }

  setDetailsForIsdOne(data){
    if(!_.isEmpty(data) && data.ISD === 1){
      this._basesService.getRequest(`${ApiConstant.USER_PROFILE}`).subscribe((res) => {
        if(res.Code === 1000 && !_.isEmpty(res.Data) && !_.isEmpty(res.Data.CommonUserOrgInfos)){
          this.selectedValues = {...res.Data.CommonUserOrgInfos[0]}
          this.mapOrganizations(data)
        }
      })
    } else {
      this.mapOrganizations();
    }
  }

  mapBranch = async (selectedOrganization, data?) => {
    await this.getUserBranchsList(Number(selectedOrganization.Id));
    if(!_.isEmpty(this.branchList) && !_.isEmpty(data) && data.ISD === 1){
      this.selectedBranch = _.find(this.branchList, {Id: this.selectedValues.BranchId})
      this.setBranch(selectedOrganization, data)
    } else {
      if (this.branchList.length === 1) {
        this.selectedBranch = { ...this.branchList[0] }
        const token = await this.extendJwtToken(
          {
            OrgId: selectedOrganization.Id,
            BranchId: this.selectedBranch.BranchId,
            OfficeId: this.selectedBranch.OfficeId
          });
        if (token) {
          this.tokenService.saveToken(token)
          this.setBranch(selectedOrganization)
        }
      } else {
        this.router.navigate([`org-branches`]);
      }
    }
  }

  setBranch(selectedOrganization, data?){
    localStorage.setItem('SELECTED_BRANCH', JSON.stringify(this.selectedBranch))
    const finYear = JSON.parse(localStorage.getItem('SELECTED_FIN_YEAR'));
    if (!_.isEmpty(finYear) && selectedOrganization.Id === finYear.OrgId) {
      this.mapModules(selectedOrganization, data);
    } else {
      localStorage.removeItem('SELECTED_FIN_YEAR');
      this.mapFinYear(selectedOrganization, data);
    }
  }

  mapFinYear = async (selectedOrganization, tokenData?) => {
    const data = {
      OrgId: selectedOrganization.Id
    };
    await this.getFinancialYearList(data)
    if(!_.isEmpty(this.finYearList) && !_.isEmpty(tokenData) && tokenData.ISD === 1){
      this.selectedFinYear = _.find(this.finYearList, {Id: this.selectedValues.FinYearId})
      this.setFinYear(selectedOrganization, data)
    } else {
      if (!_.isEmpty(this.finYearList)) {
        this.selectedFinYear = { ...this.finYearList[this.finYearList.length - 1] }
        const token = await this.extendJwtToken(
          {
            OrgId: this.selectedOrganization.Id,
            Financialyear: this.selectedFinYear.Id
          });
        if (token) {
          this.tokenService.saveToken(token)
          this.setFinYear(selectedOrganization)
        }
      }
    }
  }

  setFinYear(selectedOrganization, data?){
    this.settings.finFromDate = this.selectedFinYear.FromDate
    this.settings.finToDate = this.selectedFinYear.ToDate
    localStorage.setItem('SELECTED_FIN_YEAR', JSON.stringify(this.selectedFinYear))
    this.mapModules(selectedOrganization, data);
  }

  mapModules = async (selectedOrganization, data?) => {
    await this.getUserDetails(selectedOrganization.Id)
    if(!_.isEmpty(this.userData.Modules) && !_.isEmpty(data) && data.ISD === 1){
      this.selectedUserModule = _.find(this.userData.Modules, {Id: this.selectedValues.ModuleId})
      this.setModule(data)
    } else {
      if (this.userData.Modules.length === 1) {
        this.selectedUserModule = { ...this.userData.Modules[0] }
        this.setModule()
      } else {
        this.router.navigate(['modules'])
      }
    }
  }

  async setModule(data?) {
    this.selectedUserModule['index'] = 0
    localStorage.setItem('SELECTED_MODULE', JSON.stringify(this.selectedUserModule))
    await this.getAllSettings(this.selectedUserModule.Id)
    if (this.selectedUserModule.Id === 4) {
      this.router.navigate(['crm/dashboard']);
    } else {
      this.router.navigate(['dashboard'])
    }
  }

  getFinancialYearList(data) {
    return new Promise((resolve, reject) => {
      this._baseService.getRequest(`${ApiConstant.FIN_YEAR}?OrgId=${data.OrgId}`).subscribe(
        (res: any) => {
          if (res.Code === 1000) {
            this.finYearList = [...res.Data];
            resolve(this.finYearList);
          }
        }
      )
    })
  }

  getUserBranchsList(orgId) {
    return new Promise((resolve, reject) => {
      const url = `${ApiConstant.BRANCH_AUTH}?OrgId=${orgId}`
      this._baseService.getRequest(url).subscribe(
        (res: any) => {
          if (res.Code === 1000) {
            this.branchList = [...res.Data];
            resolve(this.finYearList);
          }
        }
      )
    })
  }

  getModuleSetting(id) {
    return this._basesService.getRequest(ApiConstant.MODULE_SETTING_ON_TOP + id)
  }

  getAllSettings(id): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getModuleSetting(id).subscribe(
        async (data) => {
        if (data.Code === UIConstant.THOUSAND && data.Data) {
          await this.gs.getAllSettings(data.Data, id)
          resolve('')
        } else {
          resolve()
        }
      })
    })
  }

  destroyParametersOnLogin() {
    window.localStorage.removeItem('token')
    // window.localStorage.clear();
    this.selectedUserModule = {}
    this.selectedOrganization = {}
    this.userData = {}
    this.organizationList = []
    this.loginUserDetails = {}
  }
}
