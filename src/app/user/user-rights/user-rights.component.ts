import { OrganisationProfileService } from './../../start/header/organisation-profile/organisation-profile.service';
import { UserFormService } from './../user-form/user-form.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastrCustomService } from 'src/app/commonServices/toastr.service';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { takeUntil, map } from 'rxjs/operators';
import { UIConstant } from 'src/app/shared/constants/ui-constant';
import { Subject } from 'rxjs';
import * as _ from 'lodash'

declare var $: any

@Component({
  selector: 'app-user-rights',
  templateUrl: './user-rights.component.html',
  styleUrls: ['./user-rights.component.css']
})
export class UserRightsComponent implements OnInit, OnDestroy {
  rights: any = {}
  model: any = {}
  private unSubscribe$ = new Subject<void>()
  userTypeData: Array<any> = []
  userData: Array<any> = []
  constructor(
    private _userService: UserFormService,
    public _orgService: OrganisationProfileService,
    private toastrService: ToastrCustomService,
    public _commonService: CommonService
  ) { }

  ngOnInit() {
    this.userTypeData = [{ id: UIConstant.ZERO, text: 'Select User Type' }]
    this.userData = [{ id: UIConstant.ZERO, text: 'Select User' }]
    this.getUserTypeList()
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
        this.getUserListData(this.rights.selectedUserType.id)
      }
    }
  }

  /* Function invoke on user type change */
  onUserChange = (event) => {
    if (event && event.data.length > 0) {
      this.rights.selectedUser = event.data[0]
    }
  }

  preparePayload = () => {
    const userMenuPermissionArray = _.map(this.rights.permissions, (element) => {
      return {
        Id: element.id ? element.id : 0,
        UserMenuId: element.menuId ? element.menuId : 0,
        PermissionType: element.type ? element.type : 0
      }
    })
    return {
      UserTypeId: this.rights.selectedUserType.id,
      UserId: this.rights.selectedUser.id,
      UserMenuPermissions: userMenuPermissionArray
    }
  }

  /* Function to save user permissions */
  savePermission = () => {
    const data = this.preparePayload()
    this._userService.postUserPermissions(data).pipe(
      takeUntil(this.unSubscribe$)
    ).subscribe((response) => {
      if (response.Code === UIConstant.THOUSAND) {
        this.toastrService.showSuccess('Success', 'Saved Successfully')
      }
    }, error => console.log(error))
  }

  resetData = () => {

  }

  ngOnDestroy() {
    this.unSubscribe$.next()
    this.unSubscribe$.complete()
  }
}
