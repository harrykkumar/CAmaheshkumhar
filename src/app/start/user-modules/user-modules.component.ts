import { MODULES_IMG_SRC } from './user-modules-image-src';
import { LoginService } from './../../commonServices/login/login.services'
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import * as _ from 'lodash'

@Component({
  selector: 'app-user-modules',
  templateUrl: './user-modules.component.html',
  styleUrls: ['./user-modules.component.css']
})
export class UserModulesComponent implements OnInit {
  modulesList: any = []
  constructor (
    private router: Router,
    private _loginService: LoginService
  ) { }

  ngOnInit () {
    this.initModulesData()
    this.initUpdatePermission()
  }

  navigateTo = (path, selectedModule, index) => {
    this._loginService.selectedUserModule = selectedModule
    this._loginService.selectedUserModule['index'] = index
    localStorage.setItem('SELECTED_MODULE', JSON.stringify(this._loginService.selectedUserModule))
    this._loginService.moduleSelected.next(true)
    this.router.navigate([path])
  }

  initModulesData = () => {
    this.modulesList = [...this._loginService.userData.Modules]
  }

  initUpdatePermission = () => {
    this._loginService.permissionUpdated.subscribe(
      (res) => {
        if (res === true) {
          this.initModulesData()
        }
      })
  }
}
