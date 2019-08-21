import { SIDE_MENU_MODEL } from './side-menu-modal'
import { LoginService } from '../../commonServices/login/login.services'
import { Component } from '@angular/core'
import { Router } from '@angular/router'
import * as _ from 'lodash'
import { NgxSpinnerService } from 'ngx-spinner';

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
    private _loginService: LoginService,
    private spinnerService: NgxSpinnerService
    ) {
    this.initSideMenuData();
    this.initUpdatePermission()
  }
  Homepage(){
    this._route.navigate(['/dashboard'])
  }

  initSideMenuData = async () => {
    this.spinnerService.show()
    const selectedModule = JSON.parse(localStorage.getItem('SELECTED_MODULE'))
    this.loggedinUserData = { ...this._loginService.userData }
    if (!_.isEmpty(this._loginService.userData) &&
      !_.isEmpty(this._loginService.userData.Modules)) {
      if (this._loginService.userData.Modules[selectedModule['index']]) {
        this.sideMenu = [...this.loggedinUserData.Modules[selectedModule['index']]['sideMenu']]
        this.initMenuPath()
      }
    }
    this.spinnerService.hide()
  }

  initMenuPath = () => {
    _.map(this.sideMenu, (menu) => {
      const matchedMenu = _.find(SIDE_MENU_MODEL, {Id: menu.Id});
      if (!_.isEmpty(matchedMenu)) {
        menu['path'] = matchedMenu.path
        menu['icon'] = matchedMenu.icon
      }
      if (menu && menu.subMenu && menu.subMenu.length > 0) {
        _.map(menu.subMenu, (subMenu) => {
          const matchedSubMenu = _.find(SIDE_MENU_MODEL, {Id: subMenu.Id});
          if (!_.isEmpty(matchedSubMenu)) {
            subMenu['path'] = matchedSubMenu.path
            subMenu['icon'] = matchedSubMenu.icon
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
