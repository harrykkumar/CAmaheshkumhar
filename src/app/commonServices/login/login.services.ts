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
  constructor(private _basesService: BaseServices,
    private router: Router,
    private gs: GlobalService,
    private tokenService: TokenService,
    private toastrService: ToastrCustomService,
    private _baseService: BaseServices,
    private settings: Settings,
    private spinner: NgxSpinnerService) { }

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

  /* Function to get user data, modules, menus and menu-permissions */
  getUserDetails = (OrgId) => {
    return new Promise((resolve, reject) => {
      this._basesService.getRequest(`${ApiConstant.USER_PROFILE}?Id=${OrgId}`).subscribe(
        async (data) => {
          if (data.Code === UIConstant.THOUSAND) {
            this.userData = data.Data
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
          //console.log(error)
        }
      )
    })
  }

  /* Function to map side menus and submenus */
  mapSideMenus = async () => {
    return new Promise((resolve, reject) => {
      _.forEach(this.userData.Modules, (module, i) => {
        if (this.userData.Modules[i] && MODULES_IMG_SRC[`${module.Name}`]) {
          this.userData.Modules[i]['src'] = MODULES_IMG_SRC[`${module.Name}`]['src']
        }
        const data = _.filter(this.userData.Menus, (menu) => {
          if (menu.ParentId === 0) {
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
  getMenuPermission = (menuName, subMenuName) => {
    let menuPermission;
    const sideMenuArray = [...this.userData.Modules[this.selectedUserModule['index']]['sideMenu']]
    const subMenuArray = _.find(sideMenuArray, (Menu) => {
      if (Menu.Name === menuName) {
        return true;
      }
    })
    menuPermission = _.find(subMenuArray.subMenu, (subMenu) => {
      if (subMenu.Name === subMenuName) {
        return true;
      }
    })
    return menuPermission;
  }

  getUserOrganization() {
    let url = ApiConstant.USER_ORGANIZATION
    return new Promise((resolve, reject) => {
      this._basesService.getRequest(url).subscribe((res) => {
        if (res.Code === UIConstant.THOUSAND) {
          this.organizationList = [...res.Data['OrganizationDetails']];
          this.loginUserDetails = { ...res.Data['LoginUserDetails'][0] }
          localStorage.setItem('LOGIN_USER', JSON.stringify(this.loginUserDetails));
          resolve(this.organizationList);
        } else if (res.Code === 5018) {
          this.logOut()
        }
      },
        (error) => {
          //console.log(error)
        });
    })
  }

  extendJwtToken(data) {
    return this._basesService.postRequest(ApiConstant.EXTENDJWT, data).
      pipe(map((res) => {
        if (!_.isEmpty(res.Data) && res.Data.Token) {
          return res.Data.Token
        }
      })).toPromise();
  }

  mapOrganizations = async () => {
    await this.getUserOrganization();
    if (this.organizationList.length === 0) {
      this.router.navigate(['no-organization'])
    } else if (this.organizationList.length === 1) {
      this.selectedOrganization = { ...this.organizationList[0] }
      const token = await this.extendJwtToken({ OrgId: this.selectedOrganization.Id })
      this.tokenService.saveToken(token)
      await this.gs.getOrgDetails()
      localStorage.setItem('SELECTED_ORGANIZATION', JSON.stringify(this.selectedOrganization))
      this.mapBranch(this.selectedOrganization);
    } else {
      this.router.navigate(['organizations']);
    }
  }

  mapBranch = async (selectedOrganization) => {
    await this.getUserBranchsList(Number(selectedOrganization.Id));
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
        localStorage.setItem('SELECTED_BRANCH', JSON.stringify(this.selectedBranch))
        const finYear = JSON.parse(localStorage.getItem('SELECTED_FIN_YEAR'));
        if (!_.isEmpty(finYear) && selectedOrganization.Id === finYear.OrgId) {
          this.mapModules(selectedOrganization);
        } else {
          localStorage.removeItem('SELECTED_FIN_YEAR');
          this.mapFinYear(selectedOrganization);
        }
      }
    } else {
      this.router.navigate([`org-branches`]);
    }
  }

  mapFinYear = async (selectedOrganization) => {
    const data = {
      OrgId: selectedOrganization.Id
    };
    await this.getFinancialYearList(data)
    if (!_.isEmpty(this.finYearList)) {
      this.selectedFinYear = { ...this.finYearList[this.finYearList.length - 1] }
      const token = await this.extendJwtToken(
        {
          OrgId: this.selectedOrganization.Id,
          Financialyear: this.selectedFinYear.Id
        });
      if (token) {
        this.tokenService.saveToken(token)
        this.settings.finFromDate = this.selectedFinYear.FromDate
        this.settings.finToDate = this.selectedFinYear.ToDate
        localStorage.setItem('SELECTED_FIN_YEAR', JSON.stringify(this.selectedFinYear))
        this.mapModules(selectedOrganization);
      }
    }
  }

  mapModules = async (selectedOrganization) => {
    await this.getUserDetails(selectedOrganization.Id)
    if (this.userData.Modules.length === 1) {
      this.selectedUserModule = { ...this.userData.Modules[0] }
      await this.getAllSettings(this.userData.Modules[0].Id)
      this.selectedUserModule['index'] = 0
      localStorage.setItem('SELECTED_MODULE', JSON.stringify(this.selectedUserModule))
      this.router.navigate(['dashboard'])
    } else {
      this.router.navigate(['modules'])
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
      this.getModuleSetting(id).subscribe(async (data) => {
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
    window.localStorage.clear();
    this.selectedUserModule = {}
    this.selectedOrganization = {}
    this.userData = {}
    this.organizationList = []
    this.loginUserDetails = {}
  }
}
