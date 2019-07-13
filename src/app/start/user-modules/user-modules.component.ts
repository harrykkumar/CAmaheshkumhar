import { Settings } from './../../shared/constants/settings.constant';
// import { MODULES_IMG_SRC } from './user-modules-image-src';
import { LoginService } from './../../commonServices/login/login.services'
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import * as _ from 'lodash'
import { ToastrCustomService } from '../../commonServices/toastr.service';
import { GlobalService } from 'src/app/commonServices/global.service';

@Component({
  selector: 'app-user-modules',
  templateUrl: './user-modules.component.html',
  styleUrls: ['./user-modules.component.css']
})
export class UserModulesComponent implements OnInit {
  modulesList: any = []
  loggedinUserData: any = {}
  clientDateFormat: string = ''
  constructor (
    private router: Router,
    public _loginService: LoginService,
    private gs: GlobalService,
    private settings: Settings,
    private toastrService: ToastrCustomService
  ) {
    this.clientDateFormat = this.settings.dateFormat
    const organization = JSON.parse(localStorage.getItem('SELECTED_ORGANIZATION'))
    this.loggedinUserData = Object.assign({}, {
      'fromDate': this.settings.finFromDate, 'toDate': this.settings.finToDate,
      'Name': organization.Name
    })
   }

  ngOnInit () {
    this.initModulesData()
    this.initUpdatePermission()
  }

  navigateTo = async (path, selectedModule, index) => {
    console.log(selectedModule)
    if (selectedModule.Id) {
      await this._loginService.getAllSettings(selectedModule.Id)
    }
    this._loginService.selectedUserModule = selectedModule
    this._loginService.selectedUserModule['index'] = index
    localStorage.setItem('SELECTED_MODULE', JSON.stringify(this._loginService.selectedUserModule))
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
