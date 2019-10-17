// File created by dolly garg
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AdditionalSettingsService } from '../additional-settings.service';
import { UIConstant } from '../../shared/constants/ui-constant';
import { ToastrCustomService } from '../../commonServices/toastr.service';
import { filter, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { SetUpIds } from '../../shared/constants/setupIds.constant'; 
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash'
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserFormService } from '../../user/user-form/user-form.service';
import { GlobalService } from '../../commonServices/global.service';
declare const localstorage: Storage
@Component({
  selector: 'additional-setting-master',
  templateUrl: './additional-master-setting.component.html',
  styleUrls: ['./additional-master-setting.component.css']
})
export class AddtionalSettingComponent implements OnInit, AfterViewInit {
  isNewSetting: boolean = false
  currency: any
  dateFormat: any
  options: Select2Options
  saveSub$: Subscription
  moduleList = []
  userTypeData = []
  userData = []
  UserTypeId: number
  ModuleId: number
  UserId: number
  masterValues: any = {}
  search = ''
  constructor (private settingsService: AdditionalSettingsService,
    private toastrService: ToastrCustomService,
    private router: Router,
    private spinnerService: NgxSpinnerService,
    private _userService: UserFormService,
    private gs: GlobalService) {
    this.masterValues = {moduleId: '0'}
    this.getModuleList()
    this.getUserTypeList()
    this.saveSub$ = this.settingsService.saveSub$.subscribe(
      (obj) => {
        this.postFormValue()
      }
    )
    this.saveSub$ = this.settingsService.search$.subscribe(
      (data) => {
        this.search = data
      }
    )
    this.options = {
      multiple: true
    }
  }

  settings = []
  getFormFields () {
    if (!this.ModuleId) {
      this.ModuleId = JSON.parse(localStorage.getItem('SELECTED_MODULE')).Id
    }
    if (this.UserId && this.ModuleId) {
      const queryParams = `?PUserId=${this.UserId}&ModuleId=${this.ModuleId}&UserTypeId=${this.UserTypeId}`
      this.settingsService.getFormFields(queryParams).pipe(
        filter(data => {
          if (data.Code === UIConstant.THOUSAND) {
            return true
          } else {
            throw new Error(data.Description)
          }
        }),
        catchError(error => {
          return throwError(error)
        }),
        map(data => data.Data),
        map((data: any) => {
          console.log('old data : ', data)
          let newArray = []
          if (data.UserSetups && data.UserSetups.length > 0) {
            data.UserSetups.forEach((element) => {
              let defaultValue = data.UserSetupDetails.filter(setup => +setup.UserIndividualSetupId === +element.Id)
              if (+element.Type === SetUpIds.getBoolean) {
                let defaultVal = typeof defaultValue !== 'undefined' && defaultValue.length === 1 ? defaultValue[0].Value : ''
                newArray.push({
                  Id: element.Id,
                  Value: defaultVal,
                  DefaultValue: defaultVal,
                  name: element.Name,
                  selected: false,
                  Type: +element.Type,
                  UserIndividualSetupId: defaultValue[0].UserIndividualSetupId
                })
              }
            });
          }
          return newArray
        })
        )
        .subscribe(data => {
          console.log('settings : ', data)
          this.settings = data
        },
        (error) => {
          this.toastrService.showError(error, '')
          console.log(error)
        }
      )
    }
  }

  ngOnInit() {
    if (_.includes(this.router.url, 'organization')) {
      this.isNewSetting = true
    }
  }

  ngAfterViewInit() {
    this.spinnerService.hide()
  }

  postFormValue () {
    let settings = []
    this.settings.forEach((element) => {
      if (element.selected) {
        settings.push(element)
      }
    })
    let obj = {
      UserTypeId: this.UserTypeId,
      ModuleId: this.ModuleId,
      UserId: this.UserId,
      UserSetupDetails: settings
    }
    console.log(JSON.stringify(obj))
    this.gs.manipulateResponse(this.settingsService.postFormValues(obj)).subscribe(
      (data) => {
        if (data) {
          this.toastrService.showSuccess('Saved Successfully', '')
          this.getFormFields()
        }
      },
      (error) => {
        this.toastrService.showError(error, '')
      }
    )
  }

  getModuleList () {
    const data = {
      Id: 0,
      UserTypeId: 0
    }
    this.gs.manipulateResponse(this._userService.getUserPermissions(data)).subscribe((response) => {
      let newData = []
      if (response && response.Modules) {
        response.Modules.forEach((element) => {
          newData.push({
            id: element.Id,
            text: element.Name
          })
        })
      }
      this.moduleList = [{id: '0', text: 'Select Module'}, ...newData]
      this.masterValues['moduleId'] = JSON.parse(localStorage.getItem('SELECTED_MODULE')).Id
      this.getFormFields()
      console.log(this.moduleList)
    },
    (error) => {
      console.log(error)
      this.toastrService.showError(error, '')
    })
  }

  getUserTypeList () {
    this.gs.manipulateResponse(this._userService.getUserTypeList())
    .subscribe((response) => {
      console.log('type : ', response)
      let newData = []
      if (response) {
        response.forEach((element) => {
          newData.push({
            id: element.Id,
            text: element.Name
          })
        })
      }
      this.userTypeData = [{ id: UIConstant.ZERO, text: 'Select User Type' }, ...newData]
      }, (error) => {
        console.log(error)
        this.toastrService.showError(error, '')
      })
  }

  /* Function to get user data */
  getUserListData (id) {
    this.gs.manipulateResponse(this._userService.getUnderUserList(id))
    .subscribe((response) => {
      console.log('list : ', response)
      let newData = []
      if (response && response.LoginUserDetails) {
        response.LoginUserDetails.forEach((element) => {
          newData.push({
            id: element.Id,
            text: element.Name
          })
        })
      }
      this.userData = [{ id: UIConstant.ZERO, text: 'Select User' }, ...newData]
      }, (error) => {
        this.toastrService.showError(error, '')
        console.log(error)
      })
  }

  ngOnDestroy () {
    this.saveSub$.unsubscribe()
  }
}