// import { MODULES_IMG_SRC } from './user-modules-image-src';
import { LoginService } from './../../commonServices/login/login.services'
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import * as _ from 'lodash'
import { filter, catchError, map } from 'rxjs/internal/operators';
import { UIConstant } from '../../shared/constants/ui-constant';
import { throwError } from 'rxjs';
import { ToastrCustomService } from '../../commonServices/toastr.service';
import { GlobalService } from 'src/app/commonServices/global.service';

@Component({
  selector: 'app-user-modules',
  templateUrl: './user-modules.component.html',
  styleUrls: ['./user-modules.component.css']
})
export class UserModulesComponent implements OnInit {
  modulesList: any = []
  constructor (
    private router: Router,
    public _loginService: LoginService,
    private gs: GlobalService,
    private toastrService: ToastrCustomService
  ) { }

  ngOnInit () {
    this.initModulesData()
    this.initUpdatePermission()
  }

  navigateTo = (path, selectedModule, index) => {
    console.log(selectedModule)
    if (selectedModule.Id) {
      this._loginService.getAllSettings(selectedModule.Id)
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
