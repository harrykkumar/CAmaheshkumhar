import { UIConstant } from './../../shared/constants/ui-constant';
import { DateFormats } from './../../settings/data-format';
import { Currencies } from './../../settings/currency';
import { SetUpIds } from './../../shared/constants/setupIds.constant';
import { SettingsService } from './../../settings/settings.service';
import { ToastrCustomService } from './../../commonServices/toastr.service';
import { LoginService } from './../../commonServices/login/login.services';
import { Settings } from './../../shared/constants/settings.constant';
import { NgForm } from '@angular/forms';
import { ApiConstant } from './../../shared/constants/api';
import { BaseServices } from 'src/app/commonServices/base-services';
import { CommonService } from './../../commonServices/commanmaster/common.services';
import { SuperAdminService } from './../super-admin.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash'
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { Subscription, throwError } from 'rxjs';
import { filter, catchError, map } from 'rxjs/operators';
@Component({
  selector: 'app-admin-master-setting',
  templateUrl: './admin-master-setting.component.html',
  styleUrls: ['./admin-master-setting.component.css']
})
export class AdminMasterSettingComponent implements OnInit {
  @ViewChild('masterSettingFormControl') masterSettingFormControl: NgForm
  utilityModal: SuperAdminMasterSettingInterface = {};
  settings: Array<SettingModal> = []
  currency: any
  dateFormat: any
  options: Select2Options
  saveSub$: Subscription
  search = ''
  constructor(
    private superAdminService: SuperAdminService,
    public commonService: CommonService,
    private baseService: BaseServices,
    private settingsService: SettingsService,
    private toastrService: ToastrCustomService,
    private _loginService: LoginService,
    private router: Router,
    private _settings: Settings,
    private spinnerService: NgxSpinnerService
  ) {
    this.options = {
      multiple: true
    }
    this.currency = {
      SetupId: SetUpIds.currency,
      data: Currencies.data,
      Value: '',
      DefaultValue: '',
      BaseType: SetUpIds.baseTypeStr,
      Type: SetUpIds.multiple,
      name: 'Currency'
    }
    this.dateFormat = {
      SetupId: SetUpIds.dateFormat,
      data: DateFormats.data,
      Value: '',
      DefaultValue: '',
      BaseType: SetUpIds.baseTypeStr,
      Type: SetUpIds.singleVal,
      name: 'Date Format'
    }
  }

  ngOnInit() {
    this.superAdminService.getClientAdminList().subscribe((res) => {
      if (res.Code === 1000) {
        this.utilityModal.clientAdminList = [...res.Data];
      } else {
        this.utilityModal.clientAdminList = []
      }
    })
  }

  onClientChange(e) {
    this.utilityModal.selectedClientObject = _.find(this.utilityModal.clientAdminList, { Id: this.utilityModal.selectedClientId });
    if (!_.isEmpty(this.utilityModal.selectedClientObject)) {
      if (Number(this.utilityModal.selectedClientObject.IsMultiOrganization) > 0) {
        this.getOrganizationList();
      } else if (Number(this.utilityModal.selectedClientObject.IsMultiBranch) > 0) {
        this.getBranchList();
      }
    }
  }

  getOrganizationList() {
    const query = {
      ClientId: this.utilityModal.selectedClientId,
      Type: 'Admin'
    }
    const queryParam = this.commonService.getQueryStringFromObject(query);
    this.baseService.getRequest(`${ApiConstant.OWNER_ORGANISATION_LIST}?${queryParam}`).subscribe((res) => {
      if (res.Code === 1000) {
        this.utilityModal.clientOrganizationList = [...res.Data];
      } else {
        this.utilityModal.clientOrganizationList = []
      }
    })
  }

  getBranchList() {
    const query = {
      ClientId: this.utilityModal.selectedClientId,
      RequestFrom: 'Admin'
    }
    const queryParam = this.commonService.getQueryStringFromObject(query);
    this.baseService.getRequest(`${ApiConstant.CLIENT_BRANCH}?${queryParam}`).subscribe((res) => {
      if (res.Code === 1000) {
        this.utilityModal.clientBranchList = [...res.Data];
      } else {
        this.utilityModal.clientBranchList = []
      }
    })
  }

  validateSearchForm() {
    if (this.utilityModal.selectedClientId && (this.utilityModal.selectedOrganizationId || this.utilityModal.selectedBranchId)) {
      return true;
    } else {
      return false
    }
  }

  searchSubmit() {
    const query = {
      ClientId: this.utilityModal.selectedClientId,
    }
    if(this.utilityModal.selectedOrganizationId){
      query['OrgId'] = this.utilityModal.selectedOrganizationId
    } else if(this.utilityModal.selectedBranchId) {
      query['BranchId'] = this.utilityModal.selectedBranchId
    }
    const queryParam = this.commonService.getQueryStringFromObject(query);
    this.baseService.getRequest(`${ApiConstant.GET_DYNAMIC_SETUP_FIELDS}?${queryParam}`).pipe(
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
      map(data => {
        console.log('old data : ', data)
        let defaultCurrency = data.SetupClients.filter(setup => +setup.SetupId === +SetUpIds.currency)
        let defaultDateFormat = data.SetupClients.filter(setup => +setup.SetupId === +SetUpIds.dateFormat)
        let newArray: Array<SettingModal> = [
          {
            SetupId: SetUpIds.currency,
            data: Currencies.data,
            Value: typeof defaultCurrency !== 'undefined' && defaultCurrency.length > 0 ? defaultCurrency[0].Value.split(',') : '',
            DefaultValue: typeof defaultCurrency !== 'undefined' && defaultCurrency.length > 0 ? defaultCurrency[0].DefaultValue : '',
            BaseType: 2,
            Type: SetUpIds.multiple,
            name: 'Currency',
            selected: false
          },
          {
            SetupId: SetUpIds.dateFormat,
            data: DateFormats.data,
            Value: typeof defaultDateFormat !== 'undefined' && defaultDateFormat.length > 0 ? defaultDateFormat[0].Value : '',
            DefaultValue: typeof defaultDateFormat !== 'undefined' && defaultDateFormat.length > 0 ? defaultDateFormat[0].Value : '',
            BaseType: 2,
            Type: SetUpIds.singleVal,
            name: 'Date Format',
            selected: false
          }
        ]
        if (data.SetupMasters && data.SetupMasters.length > 0) {
          data.SetupMasters.forEach((element) => {
            let defaultValue = data.SetupClients.filter(setup => +setup.SetupId === +element.Id)
            if (+element.Type === SetUpIds.singleVal || +element.Type === SetUpIds.singleId || +element.Type === SetUpIds.multiple) {
              let newData = data.SetupSettings.filter(setup => +setup.SetupId === +element.Id)
              // console.log(newData)
              if (+element.Type === SetUpIds.multiple) {
                let defaultVal = typeof defaultValue !== 'undefined' && defaultValue.length === 1 ? defaultValue[0].DefaultValue : ''
                let val = typeof defaultValue !== 'undefined' && defaultValue.length === 1 ? defaultValue[0].Value : ''
                val = val !== '' ? val.split(',') : ''
                newData.forEach((element, index) => {
                  let obj = {
                    id: element.Id,
                    text: element.Val
                  }
                  newData[index] = obj
                })
                newArray.push({
                  SetupId: element.Id,
                  data: newData,
                  Value: val,
                  DefaultValue: defaultVal,
                  BaseType: element.BaseType,
                  Type: element.Type,
                  name: element.SetupName,
                  selected: false
                })
              } else {
                let defaultVal = typeof defaultValue !== 'undefined' && defaultValue.length === 1 ? defaultValue[0].Value : ''
                newArray.push({
                  SetupId: element.Id,
                  data: newData,
                  Value: defaultVal,
                  DefaultValue: defaultVal,
                  BaseType: element.BaseType,
                  Type: element.Type,
                  name: element.SetupName,
                  selected: false
                })
              }
            } else if (+element.Type === SetUpIds.getBoolean || +element.Type === SetUpIds.getStrOrNum) {
              let defaultVal = typeof defaultValue !== 'undefined' && defaultValue.length === 1 ? defaultValue[0].Value : ''
              newArray.push({
                SetupId: element.Id,
                data: [],
                Value: defaultVal,
                DefaultValue: defaultVal,
                BaseType: element.BaseType,
                Type: element.Type,
                name: element.SetupName,
                selected: false
              })
            }
          });
        }
        return newArray
      }))
      .subscribe(data => {
        this.settings = data
        // this.resetForm();
      },
        (error) => {
          this.toastrService.showError(error, '')
        }
      )
  }

  resetForm() {
    this.masterSettingFormControl.resetForm();
  }

  postAdminMasterSetting() {
    let isValid = true
    let _settings = JSON.parse(JSON.stringify(this.settings))
    let newSettings = []
    _settings.forEach((setting => {
      if (setting.Type === SetUpIds.multiple) {
        if (setting.Value === '' || setting.Value === null) {
          setting.Value = setting.Value
        }
        else {
          setting.Value = setting.Value.join(',')
        }
      } else {
        setting.Value = setting.Value
        setting.DefaultValue = setting.Value
      }
      if (setting.Type === SetUpIds.getBoolean || (setting.Type === SetUpIds.getStrOrNum && setting.BaseType === SetUpIds.baseTypeNum)) {
        setting.Value = +setting.Value
        setting.DefaultValue = +setting.DefaultValue
      }
      if (+setting.SetupId === SetUpIds.catLevel) {
        if (+setting.Value > 7) {
          this.toastrService.showError('Category level can\'t be more than 7', '')
          isValid = false
        }
      }
      if (setting.selected) {
        newSettings.push(setting)
      }
    }))
    if (newSettings.length === 0) {
      this.toastrService.showErrorLong('Select atleast 1 setting to save', '')
      isValid = false
    }
    if (isValid) {
      let obj = {
        'SetupClients': newSettings,
        'ClientId': this.utilityModal.selectedClientId
      }
      if (this.utilityModal.selectedOrganizationId) {
        obj['OrgId'] = this.utilityModal.selectedOrganizationId
      } else if (this.utilityModal.selectedBranchId) {
        obj['BranchId'] = this.utilityModal.selectedBranchId
      }
      this.settingsService.postFormValues(obj).subscribe(
        (data) => {
          if (data.Code === UIConstant.THOUSAND && data.Data) {
            this.toastrService.showSuccess('Saved Successfully', '')
            this.searchSubmit()
          } else {
            throw new Error(data.Description)
          }
        }
      )
    }
  }
}

export class SuperAdminMasterSettingInterface {
  clientAdminList?: Array<any>;
  selectedClientId?: number;
  selectedClientObject?: any
  clientOrganizationList?: Array<any>;
  selectedOrganizationId?: number;
  clientBranchList?: Array<any>;
  selectedBranchId?: number;
}

export interface SettingModal {
  SetupId?: number
  data?: Array<any>
  Value?: any
  DefaultValue?: any
  BaseType?: number
  Type?: number
  name?: string
  selected?: boolean
}