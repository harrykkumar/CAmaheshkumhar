import { SIDE_MENU_MODEL } from './side-menu-modal'
import { LoginService } from '../../commonServices/login/login.services'
import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { URLConstant } from '../../shared/constants/urlconstant'
import * as _ from 'lodash'

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent {
  loggedinUserData: any = {}
  moduleList: Array<any> = []
  sideMenu: Array<any> = []
  constructor (private _route: Router,
    private _loginService: LoginService) {
    this.initSideMenuData()
    this.initUpdatePermission()
  }
  Homepage(){
    this._route.navigate(['/dashboard'])

  }

  initSideMenuData = () => {
    this.loggedinUserData = { ...this._loginService.userData }
    if (!_.isEmpty(this._loginService.userData) && !_.isEmpty(this._loginService.userData.Modules) && !_.isEmpty(this._loginService.selectedUserModule))
      if (this._loginService.userData.Modules[this._loginService.selectedUserModule['index']]) {
        this.sideMenu = [...this.loggedinUserData.Modules[this._loginService.selectedUserModule['index']]['sideMenu']]
        this.initMenuPath()
      }
  }

  initMenuPath = () => {
    _.map(this.sideMenu, (menu) => {
      if (SIDE_MENU_MODEL && SIDE_MENU_MODEL[menu.Name]) {
        menu['path'] = SIDE_MENU_MODEL[menu.Name]['path']
        menu['icon'] = SIDE_MENU_MODEL[menu.Name]['icon']
      }
      if (menu && menu.subMenu && menu.subMenu.length > 0) {
        _.map(menu.subMenu, (subMenu) => {
          if (SIDE_MENU_MODEL && SIDE_MENU_MODEL[subMenu.Name]) {
            subMenu['path'] = SIDE_MENU_MODEL[subMenu.Name]['path']
            subMenu['icon'] = SIDE_MENU_MODEL[subMenu.Name]['icon']
          }
        })
      }
    })
  }

  navigateTo = (selectedMenu) => {
    if (selectedMenu.path === "") {
      this._route.navigate(['dashboard'])
    } else if (selectedMenu.CommonCode > 0) {
      this._route.navigate([`${selectedMenu.path}/${selectedMenu.CommonCode}`]);
    } else {
      this._route.navigate([selectedMenu.path])
    }
  }

  initUpdatePermission = () => {
    this._loginService.permissionUpdated.subscribe(
      (res) => {
        if (res === true) {
          this.initSideMenuData()
        }
      })
  }
}
