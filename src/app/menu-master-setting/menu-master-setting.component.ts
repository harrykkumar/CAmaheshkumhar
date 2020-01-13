import { Component, QueryList, ViewChildren, Renderer2 } from '@angular/core';
import { SettingsService } from '../settings/settings.service';
import { ToastrCustomService } from '../commonServices/toastr.service';
import { Settings } from '../shared/constants/settings.constant';
import { CommonService } from '../commonServices/commanmaster/common.services';
import { Router, ActivatedRoute } from '@angular/router';
import { SetUpIds } from '../shared/constants/setupIds.constant';
import { Currencies } from '../settings/currency';
import { DateFormats } from '../settings/data-format';
import { filter, catchError } from 'rxjs/internal/operators';
import { UIConstant } from '../shared/constants/ui-constant';
import { throwError, Subscription } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import * as _ from 'lodash';
import { LoginService } from '../commonServices/login/login.services';
import { Select2Component } from 'ng2-select2';
@Component({
  selector: 'menu-master-setting',
  templateUrl: './menu-master-setting.component.html'
})
export class MenuMasterSettingComponent {
  isNewSetting: boolean = false
  currency: any
  dateFormat: any
  options: Select2Options
  search = ''
  menuId: number = 0
  destroy$: Subscription[] = []
  constructor (private settingsService: SettingsService,
    private toastrService: ToastrCustomService,
    private route: ActivatedRoute,
    private router: Router,
    private _settings: Settings,
    private commonService: CommonService,
    private renderer: Renderer2,
    private _loginService: LoginService) {
    this.destroy$.push(this.route.paramMap.subscribe(
      (parameters) => {
        this.menuId = +(parameters.get('id'));
        this.search = ''
        if (+this.menuId > 0) {
          this.getFormFields('')
        } else if (+this.menuId === 0) {
          // this.isNewSetting = true
          this.getFormFields('OrgSetup')
        }
      }))

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
  menuName: string = ''
  getFormFields (type) {
    this.destroy$.push(this.settingsService.getSettingsById(this.menuId + '&Type=' + type).pipe(
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
        this.menuName = (+this.menuId === 0) ? 'Organisation Settings' : (data.MenuDetails && data.MenuDetails[0]) ? data.MenuDetails[0].Name : 'Settings'
        console.log('old data : ', data)
        let newArray: Array<modelType> = []
        if (+this.menuId == 51 || +this.menuId === 0) {
          let dateMaster = []
          let currencyMaster = []
          let defaultCurrency = []
          let defaultDateFormat = []
          dateMaster = data.SetupMasters.filter(setup => setup.Id === SetUpIds.dateFormat)
          currencyMaster = data.SetupMasters.filter(setup => setup.Id === SetUpIds.currency)
          defaultCurrency = data.SetupClients.filter(setup => +setup.SetupId === +SetUpIds.currency)
          defaultDateFormat = data.SetupClients.filter(setup => +setup.SetupId === +SetUpIds.dateFormat)
          newArray.push({
              SetupId: SetUpIds.currency,
              data: Currencies.data,
              Value: typeof defaultCurrency !== 'undefined' && defaultCurrency.length > 0 ? defaultCurrency[0].Value.split(',') : '',
              DefaultValue: typeof defaultCurrency !== 'undefined' && defaultCurrency.length > 0 ? defaultCurrency[0].DefaultValue : '',
              BaseType: 2,
              Type: SetUpIds.multiple,
              name: 'Currency',
              selected: (this.menuId === 0) ? true : false,
              mandatory: (currencyMaster && currencyMaster[0]) ? currencyMaster[0].IsMandatory : true
            },
            {
              SetupId: SetUpIds.dateFormat,
              data: DateFormats.data,
              Value: typeof defaultDateFormat !== 'undefined' && defaultDateFormat.length > 0 ? defaultDateFormat[0].Value : -1,
              DefaultValue: typeof defaultDateFormat !== 'undefined' && defaultDateFormat.length > 0 ? defaultDateFormat[0].Value : -1,
              BaseType: 2,
              Type: SetUpIds.singleVal,
              name: 'Date Format',
              selected: (this.menuId === 0) ? true : false,
              mandatory: (dateMaster && dateMaster[0]) ? dateMaster[0].IsMandatory : true
            }
          )
        }
        if (data.SetupMasters && data.SetupMasters.length > 0) {
          data.SetupMasters.forEach((element) => {
            let defaultValue = data.SetupClients.filter(setup => +setup.SetupId === +element.Id)
            // console.log('disable : ', data.SetupMasters.filter(setup => +setup.IsDisable === 1))
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
                  selected: (this.menuId === 0) ? true : false,
                  mandatory: element.IsMandatory
                })
              } else {
                let defaultVal = typeof defaultValue !== 'undefined' && defaultValue.length === 1 ? defaultValue[0].Value : -1
                newArray.push({
                  SetupId: element.Id,
                  data: newData,
                  Value: defaultVal,
                  DefaultValue: defaultVal,
                  BaseType: element.BaseType,
                  Type: element.Type,
                  name: element.SetupName,
                  selected: (this.menuId === 0) ? true : false,
                  mandatory: element.IsMandatory
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
                selected: (this.menuId === 0) ? true : false
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
    ))
  }

  validate () {
    let valid = 1
    if (+this.menuId > 0) {
      this.settings.forEach((element) => {
        if (element.mandatory && (+element.Value === -1 || 
          element.Value.length === 0)) {
          valid = 0
        }
      })
    } else {
      this.settings.forEach((element) => {
        if ((element.Type === 2 && !element.Value) || 
          (element.Type === 4 && element.Value.length === 0 ) 
          || ((element.Type === 3 || element.Type === 5) && +element.Value === -1)) {
          valid = 0
        }
      })
    }
    this.checkForFocus()
    return !!valid
  }

  seechanges(e){
    console.log(e);
    if(e.value.indexOf('53') !== -1){
      console.log('exists');
    }
  }

  @ViewChildren('error') errorSelect2: QueryList<Select2Component>
  checkForFocus () {
    let stack = []
    setTimeout(() => {
      if ($(".errorSelecto:first")[0].nodeName === 'SELECT2') {
        this.errorSelect2.forEach((item: Select2Component, index: number) => {
          if (item.selector.nativeElement.parentElement.classList.contains('errorSelecto')) {
            stack.push(index)
          }
        })
        this.errorSelect2.forEach((item: Select2Component, index: number) => {
          if (stack[0] === index) {
            const element = this.renderer.selectRootElement(item.selector.nativeElement, true)
            element.focus({ preventScroll: false })
          }
        })
      } else {
        $(".errorSelecto:first").focus()
      }
    }, 10)
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
      this.toastrService.showErrorLong('Select atleast 1 setting to save', '')
      isValid = false
    }
    if (isValid) {
      console.log(newSettings)
      let obj = {'SetupClients': newSettings}
      console.log('obj: ', JSON.stringify(obj))
      this.destroy$.push(this.settingsService.postFormValues(obj).subscribe(
      async (data) => {
          if (data.Code === UIConstant.THOUSAND && data.Data) {
            this.toastrService.showSuccess('Saved Successfully', '')
            if (+this.menuId === 0) {
              // this.router.navigate(['organization/transaction-number']);
              this.router.navigate(['organizations']);
            } else {
              const selectedModule =  JSON.parse(localStorage.getItem('SELECTED_MODULE'))
              this._settings.removeModuleSettings()
              await this._loginService.getAllSettings(selectedModule.Id)
              this.commonService.onSetupChange()
            }
          } else {
            throw new Error(data.Description)
          }
        },
        (error) => {
          this.toastrService.showError(error, '')
        },
        () => {
          if (+this.menuId > 0) this.getFormFields('')
        }
      ))
    }
  }

  ngOnDestroy () {
    this.isNewSetting = false
    this.search = ''
    this.menuId = 0
    if (this.destroy$ && this.destroy$.length > 0) {
      this.destroy$.forEach((element) => {
        element.unsubscribe()
      })
    }
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
  selected: boolean,
  mandatory?: boolean
}