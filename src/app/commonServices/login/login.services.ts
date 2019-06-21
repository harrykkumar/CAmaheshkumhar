import { MODULES_IMG_SRC } from './../../start/user-modules/user-modules-image-src';
import { UIConstant } from './../../shared/constants/ui-constant'
import { Injectable } from '@angular/core'
import { Observable, BehaviorSubject } from 'rxjs'
import { ApiConstant } from '../../shared/constants/api'
import { BaseServices } from '../base-services'
import { CommonService } from '../commanmaster/common.services'
import { Settings } from 'src/app/shared/constants/settings.constant'
import * as _ from 'lodash'
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { TokenService } from '../token.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  moduleSelected = new BehaviorSubject(false)
  permissionUpdated = new BehaviorSubject(false)
  selectedUserModule: any = {}
  selectedOrganization: any = {}
  userData: any = {}
  userOrganizations: any = {}
  constructor(private _basesService: BaseServices,
    private commonService: CommonService,
    private settings: Settings,
    private router: Router,
    private tokenService: TokenService) { }

  public login (params: any): Observable<any> {
    return this._basesService.postRequest(ApiConstant.LOGIN_URL, params)
  }

  logOut () {
    this.tokenService.destroyToken()
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
            this.router.navigate(['login'])
            resolve()
          }
        },
        (error) => {
          console.log(error)
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
        if (res.Code === 1000) {
          this.userOrganizations = res.Data;
          resolve(this.userOrganizations);
        }
      },
        (error) => {
          console.log(error)
        });
    })
  }

  extendJwtToken(data){
    return  this._basesService.postRequest(ApiConstant.EXTENDJWT, data).pipe(map(res => res.Data.Token)).toPromise();
  }

  mapModules = async (selectedOrganization) => {
    await this.getUserDetails(selectedOrganization.Id)
    if (this.userData.Modules.length === 1) {
      this.selectedUserModule = { ...this.userData.Modules[0] }
      this.selectedUserModule['index'] = 0
      localStorage.setItem('SELECTED_MODULE', JSON.stringify(this.selectedUserModule))
      this.moduleSelected.next(true)
      this.router.navigate(['dashboard'])
    } else {
      this.router.navigate(['modules'])
    }
  }
}
