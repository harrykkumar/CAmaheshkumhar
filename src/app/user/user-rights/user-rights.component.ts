import { MODULES_IMG_SRC } from './../../start/user-modules/user-modules-image-src';
import { LoginService } from './../../commonServices/login/login.services'
import { CompanyProfileService } from '../../start/company-profile/company-profile.service';
import { UserFormService } from './../user-form/user-form.service'
import { Component, OnInit, OnDestroy } from '@angular/core'
import { ToastrCustomService } from 'src/app/commonServices/toastr.service'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
import { takeUntil, map } from 'rxjs/operators'
import { UIConstant } from 'src/app/shared/constants/ui-constant'
import { Subject } from 'rxjs'
import * as _ from 'lodash'

declare var $: any

@Component({
  selector: 'app-user-rights',
  templateUrl: './user-rights.component.html',
  styleUrls: ['./user-rights.component.css']
})
export class UserRightsComponent implements OnInit, OnDestroy {
  postPermissionArray: Array<any> = []
  moduleList: Array<any> = []
  toggledModule: any = {}
  sideMenu: Array<any> = []
  rights: any = {}
  dummyData: any = {}
  orgnizationData: Array<any> = []
  branchData: Array<any> = []
  model: any = {}
  disabledFlagOrgBranch: boolean
  Multiorgnization: number = 0
  MultiBranch: number = 0
  private unSubscribe$ = new Subject<void>()
  userTypeData: Array<any> = []
  userData: Array<any> = []
  constructor(
    private _userService: UserFormService,
    public _orgService: CompanyProfileService,
    private toastrService: ToastrCustomService,
    public _commonService: CommonService,
    private _loginService: LoginService
  ) {
    this.getBranchList('Branch')
    this.getOrgnizationList()
    this.checkLoginUserCodematch()
  }
  // onOrgChange(evt) {
  //   if (evt && evt.data && evt.data.length > 0) {
  //     this.model.orgId = evt.data[0].id
  //   }
  // }
  ngOnInit() {
    this.userTypeData = [{ id: UIConstant.ZERO, text: 'Select User Type' }]
    this.userData = [{ id: UIConstant.ZERO, text: 'Select User' }]
    this.Multiorgnization = this._loginService.userData.LoginUserDetailsinfo[0].MO
    this.MultiBranch = this._loginService.userData.LoginUserDetailsinfo[0].MB

    this.getUserTypeList()
    this.initSideMenuData()
    this.initUpdatePermission()
  }

  checkLoginUserCodematch() {
    if (this._loginService.loginUserDetails.Code === this._loginService.userData.LoginUserDetailsinfo[0].Code) {
      this.disabledFlagOrgBranch = true
    }
    else {
      this.disabledFlagOrgBranch = false
    }
  }
  /* Function to get branch list data */
  getBranchList = (type) => {
    this._userService.getBranchListByType('?RequestFrom=' + type).
      pipe(takeUntil(this.unSubscribe$),
        map((data) => {
          const list = _.map(data.Data, (element) => {
            return {
              id: element.Id,
              text: element.Name,
              data: { ...element }
            }
          })
          return [{ id: UIConstant.ZERO, text: 'Select' + type }, ...list]
        })
      ).subscribe((res) => {
        this.branchData = res
        if (this.branchData.length > 1 && this.dummyData.selectedBranch && this.dummyData.selectedBranch.id) {
          this.model.branchId = this.dummyData.selectedBranch.id
          this.dummyData.selectedBranch.id = 0
        }
      }, error => console.log(error))
  }

  /* Function to get office list data */
  getOrgnizationList = () => {
    this._orgService.getCompanyProfile().
      pipe(takeUntil(this.unSubscribe$),
        map((data) => {
          const list = _.map(data.Data, (element) => {
            return {
              id: element.Id,
              text: element.Name,
              data: { ...element }
            }
          })
          return [...list]
        })
      ).subscribe((res) => {
        this.orgnizationData = res
        if (this.orgnizationData.length > 1 && this.dummyData.selectedOffice && this.dummyData.selectedOffice.id) {
          this.model.officeId = this.dummyData.selectedOffice.id
          this.dummyData.selectedOffice.id = 0
        }
      }, error => console.log(error))
  }

  initSideMenuData = () => {
    const data = {
      Id: 0,
      UserTypeId: 0
    }
    this._userService.getUserPermissions(data).pipe(
      takeUntil(this.unSubscribe$)
    ).subscribe(async (response) => {
      if (response && response.Code === UIConstant.THOUSAND) {
        await this.mapSideMenus(response)
        await this.mapPermissions(response)
        this.moduleList = [...response.Data.Modules]
        if (_.isEmpty(this.toggledModule)) {
          this.toggledModule = {
            'module': { ...this.moduleList[0] },
            'index': 0
          }
        }
      }
    })
  }

  mapSideMenus = (response) => {
    return new Promise((resolve, reject) => {
      _.map(response.Data.Modules, (module) => {
        if (MODULES_IMG_SRC[`${module.Id}`]) {
          module['src'] = MODULES_IMG_SRC[`${module.Id}`]['src']
        }
        module.sideMenu = _.filter(response.Data.Menus, (menu) => {
          if (menu.ParentId === 0 && menu.ModuleId === module.Id) {
            return true
          }
        })
        if (module.sideMenu && module.sideMenu.length > 0) {
          _.map(module.sideMenu, (menu) => {
            menu['subMenu'] = _.filter(response.Data.Menus, (allMenu) => {
              if (allMenu.ModuleId === module.Id && menu.Id === allMenu.ParentId) {
                return true
              }
            })
          })
        }
      })
      resolve(true)
    })
  }

  mapPermissions = (response) => {
    return new Promise((resolve, reject) => {
      _.map(response.Data.Modules, (module) => {
        _.forEach(response.Data.UserPermissionDetails, (permission) => {
          _.map(module.sideMenu, (menu) => {
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
            } else {
              menu['read'] = false
              menu['write'] = false
              menu['delete'] = false
            }
            _.map(menu.subMenu, (subMenu) => {
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
              } else {
                subMenu['read'] = false
                subMenu['write'] = false
                subMenu['delete'] = false
              }
            })
          })
        })
      })
      resolve(true)
    })
  }


  /* Function to get user type list data */
  getUserTypeList = () => {
    this._userService.getUserTypeList().
      pipe(takeUntil(this.unSubscribe$),
        map((data) => {
          return _.map(data.Data, (element) => {
            return {
              id: element.Id,
              text: element.Name,
              data: { ...element }
            }
          })
        })
      ).subscribe((response) => {
        this.userTypeData = [{ id: UIConstant.ZERO, text: 'Select User Type' }, ...response]
      }, error => console.log(error))
  }

  /* Function to get user data */
  getUserListData = (id) => {
    this._userService.getUnderUserList(id).
      pipe(takeUntil(this.unSubscribe$),
        map((data) => {
          const list = _.map(data.Data.LoginUserDetails, (element) => {
            return {
              id: element.Id,
              text: element.Name
            }
          })
          return [{ id: UIConstant.ZERO, text: 'Select User' }, ...list]
        })
      ).subscribe((response) => {
        this.userData = response
      }, error => console.log(error))
  }

  /* Function invoke on user type change */
  onUserTypeChange = (event) => {
    if (event && event.data.length > 0) {
      this.rights.selectedUserType = event.data[0]
      if (this.rights.selectedUserType.id > 0) {
        if (event.value > 0) {
          this.getUserPermissions()
        }
        this.getUserListData(this.rights.selectedUserType.id)
      }
    }
  }

  /* Function invoke on user type change */
  onUserChange = (event) => {
    if (event && event.data.length > 0) {
      this.rights.selectedUser = event.data[0]
      if (event.value > 0) {
        this.getUserPermissions()
      }
    }
  }

  /* Function to get user permission */
  getUserPermissions = () => {
    const permissionData = {
      Id: 0,
      UserTypeId: this.rights.selectedUserType ? this.rights.selectedUserType.id : 0,
      ModuleId: !_.isEmpty(this.toggledModule.module) ? this.toggledModule.module.Id : 0
    };
    if (this.rights.selectedUser && this.rights.selectedUser.id > 0) {
      permissionData['UserId'] = this.rights.selectedUser.id
    }
    this._userService.getUserPermissions(permissionData).pipe(
      takeUntil(this.unSubscribe$)
    ).subscribe((response) => {
      if (response && response.Code === UIConstant.THOUSAND) {
        this.mapPermission(response.Data)
      }
    })
  }

  /* Function to map form field with permissions */
  mapPermission = (Data) => {
    _.map(this.moduleList, (module) => {
      _.forEach(Data.UserPermissionDetails, (permission) => {
        _.map(module.sideMenu, (menu) => {
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
          _.map(menu.subMenu, (subMenu) => {
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
  }

  onToggleModule = (selectedModule, index) => {
    this.toggledModule = {
      'module': selectedModule,
      'index': index
    }
    if ((this.rights.selectedUserType && this.rights.selectedUserType.id > 0)
      || (this.rights.selectedUser && this.rights.selectedUser.id > 0)) {
      this.getUserPermissions();
    }
  }

  /* Function to prepare post payload */
  preparePayload = () => {
    _.map(this.moduleList, (module) => {
      _.map(module.sideMenu, (menu) => {
        if (menu.read) {
          this.postPermissionArray.push({
            Id: 0,
            UserMenuId: menu.Id ? menu.Id : 0,
            PermissionType: 1,
            ModuleId: menu.ModuleId
          })
        }
        if (menu.write) {
          this.postPermissionArray.push({
            Id: 0,
            UserMenuId: menu.Id ? menu.Id : 0,
            PermissionType: 2,
            ModuleId: menu.ModuleId
          })
        }
        if (menu.delete) {
          this.postPermissionArray.push({
            Id: 0,
            UserMenuId: menu.Id ? menu.Id : 0,
            PermissionType: 3,
            ModuleId: menu.ModuleId
          })
        }
        if (menu && menu.subMenu && menu.subMenu.length > 0) {
          _.map(menu.subMenu, (subMenu) => {
            if (subMenu.read) {
              this.postPermissionArray.push({
                Id: 0,
                UserMenuId: subMenu.Id ? subMenu.Id : 0,
                PermissionType: 1,
                ModuleId: subMenu.ModuleId
              })
            }
            if (subMenu.write) {
              this.postPermissionArray.push({
                Id: 0,
                UserMenuId: subMenu.Id ? subMenu.Id : 0,
                PermissionType: 2,
                ModuleId: subMenu.ModuleId
              })
            }
            if (subMenu.delete) {
              this.postPermissionArray.push({
                Id: 0,
                UserMenuId: subMenu.Id ? subMenu.Id : 0,
                PermissionType: 3,
                ModuleId: subMenu.ModuleId
              })
            }
          })
        }
      })
    })
    return {
      UserTypeId: this.rights.selectedUserType.id,
      UserId: this.rights.selectedUser.id,
      OrgId: this.model.orgId ? this.model.orgId : 0,
      ModuleId: !_.isEmpty(this.toggledModule.module) ? this.toggledModule.module.Id : 0,
      UserMenuPermissions: this.postPermissionArray
    }
  }

  /* Function to save user permissions */
  savePermission = async () => {
    const data = this.preparePayload()
    this._userService.postUserPermissions(data).pipe(
      takeUntil(this.unSubscribe$)
    ).subscribe(async (response) => {
      if (response.Code === UIConstant.THOUSAND) {
        this.toastrService.showSuccess('Success', 'Saved Successfully')
        this.postPermissionArray = []
        const org = JSON.parse(localStorage.getItem('SELECTED_ORGANIZATION'))
        const userData: any = await this._loginService.getUserDetails(org.Id)
        const existModuleData = JSON.parse(localStorage.getItem('SELECTED_MODULE'))
        if (!this._commonService.isEmpty(existModuleData)) {
          const currentModuleData = _.find(userData.Modules, { Id: existModuleData.Id })
          currentModuleData['index'] = existModuleData['index']
          localStorage.setItem('SELECTED_MODULE', JSON.stringify(currentModuleData))
        }
        this._loginService.permissionUpdated.next(true)
      }
    }, error => console.log(error))
  }

  /* Function on change of checkbox */
  menuPermissionChange = (event, selectedMenu, permissionType) => {
    if (permissionType === 'READ') {
      _.map(selectedMenu.subMenu, (subMenu) => {
        subMenu['read'] = event.target.checked
      })
    } else if (permissionType === 'WRITE') {
      selectedMenu['read'] = event.target.checked
      _.map(selectedMenu.subMenu, (subMenu) => {
        subMenu['read'] = event.target.checked
        subMenu['write'] = event.target.checked
      })
    } else if (permissionType === 'DELETE') {
      selectedMenu['read'] = event.target.checked
      selectedMenu['write'] = event.target.checked
      _.map(selectedMenu.subMenu, (subMenu) => {
        subMenu['read'] = event.target.checked
        subMenu['write'] = event.target.checked
        subMenu['delete'] = event.target.checked
      })
    }
  }

  /* Function invoke on subMenu change */
  onChangeSubMenu = (event, subMenu, permissionType) => {
    if (permissionType === 'WRITE') {
      subMenu['read'] = event.target.checked
    } else if (permissionType === 'DELETE') {
      subMenu['read'] = event.target.checked
      subMenu['write'] = event.target.checked
    }
  }

  /* Function to check all permission of modules */
  selectAllPermission = (event) => {
    _.map(this.toggledModule.module.sideMenu, (menu) => {
      menu['read'] = event.target.checked
      menu['write'] = event.target.checked
      menu['delete'] = event.target.checked
      if (menu && menu.subMenu && menu.subMenu.length > 0) {
        _.map(menu.subMenu, (subMenu) => {
          subMenu['read'] = event.target.checked
          subMenu['write'] = event.target.checked
          subMenu['delete'] = event.target.checked
        })
      }
    })
  }

  validateForm = () => {
    let valid = true
    if (this.rights.selectedUserType && Number(this.rights.selectedUserType.id) === 0) {
      valid = false
    }
    return valid
  }

  initUpdatePermission = () => {
    this._loginService.permissionUpdated.subscribe(
      (res) => {
        if (res === true) {
          this.initSideMenuData()
          this.getUserPermissions()
        }
      })
  }
  ngOnDestroy() {
    this.unSubscribe$.next()
    this.unSubscribe$.complete()
  }
}
