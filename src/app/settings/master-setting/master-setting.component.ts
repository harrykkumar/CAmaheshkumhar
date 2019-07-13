import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
// File created by dolly garg
import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../settings.service';
import { UIConstant } from '../../shared/constants/ui-constant';
import { ToastrCustomService } from '../../commonServices/toastr.service';
import { filter, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Currencies } from '../currency';
import { SetUpIds } from '../../shared/constants/setupIds.constant'; 
import { DateFormats } from '../data-format';
import { Subscription } from 'rxjs/Subscription';
import { LoginService } from 'src/app/commonServices/login/login.services';
import * as _ from 'lodash'
import { Router } from '@angular/router';
import { Settings } from 'src/app/shared/constants/settings.constant';


@Component({
  selector: 'app-setting-master',
  templateUrl: './master-setting.component.html',
  styleUrls: ['./master-setting.component.css']
})
export class MasterSettingComponent implements OnInit {
  isNewSetting: boolean = false
  currency: any
  dateFormat: any
  options: Select2Options
  saveSub$: Subscription
  constructor (private settingsService: SettingsService,
     private toastrService: ToastrCustomService,
     private _loginService: LoginService,
     private _commonService: CommonService,
     private router: Router,
     private _settings:Settings) {
    this.saveSub$ = this.settingsService.saveSub$.subscribe(
      (obj) => {
        this.postFormValue()
      }
    )
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

  settings: Array<modelType> = []
  getFormFields () {
    this.settingsService.getFormFields().pipe(
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
        let newArray: Array<modelType> = [
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
              console.log(newData)
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
        // console.log('settings : ', data)
        this.settings = data
      },
      (error) => {
        this.toastrService.showError(error, '')
      }
    )
  }

  ngOnInit() {
    if (_.includes(this.router.url, 'organization')) {
      this.isNewSetting = true
    }
    this.getFormFields()
  }

  postFormValue () {
    let isValid = true
    let _settings = JSON.parse(JSON.stringify(this.settings))
    let newSettings = []
    _settings.forEach((setting => {
      if (setting.Type === SetUpIds.multiple) {
        // setting.DefaultValue = setting.DefaultValue
      //  setting.Value = setting.Value.join(',')
        if(setting.Value === '' || setting.Value === null){
          setting.Value = setting.Value
        }
        else{
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
      if(this.isNewSetting){
        setting.selected = true
      }
      if (setting.selected) {
        newSettings.push(setting)
      }
    }))
    if (newSettings.length === 0) {
      this.toastrService.showError('Select atleast 1 setting to save', '')
      isValid = false
    }
    if (isValid) {
      let obj = {'SetupClients': newSettings}
      console.log('obj: ', JSON.stringify(obj))
      this.settingsService.postFormValues(obj).subscribe(
      async  (data) => {
          if (data.Code === UIConstant.THOUSAND && data.Data) {
            this.toastrService.showSuccess('Saved Successfully', '')
            if (this.isNewSetting) {
              this.router.navigate(['organization/transaction-number']);
            } else {
              const selectedModule =  JSON.parse(localStorage.getItem('SELECTED_MODULE'))
              this._settings.removeModuleSettings()
              await this._loginService.getAllSettings(selectedModule.Id)
            }
          } else {
            throw new Error(data.Description)
          }
        },
        (error) => {
          this.toastrService.showError(error, '')
        }
      )
    }
  }

  ngOnDestroy () {
    this.saveSub$.unsubscribe()
  }
}

interface modelType {
  SetupId: number
  data: Array<any>
  Value: any
  DefaultValue: any
  BaseType: number
  Type: number
  name: string
  selected: boolean
}
