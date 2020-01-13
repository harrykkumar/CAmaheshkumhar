import { Component, OnDestroy, ViewChild, ElementRef } from '@angular/core'
import { Subscription } from 'rxjs/Subscription'
import { Ledger, AddCust, AddLedger } from '../../../../model/sales-tracker.model'
import { Select2OptionData, Select2Component } from 'ng2-select2'
import { VendorServices } from '../../../../commonServices/TransactionMaster/vendoer-master.services'
import { CategoryServices } from '../../../../commonServices/TransactionMaster/category.services'
import { ErrorConstant } from '../../../constants/error-constants'
import { UIConstant } from '../../../constants/ui-constant';
import { ToastrCustomService } from '../../../../commonServices/toastr.service'
import { CommonService } from '../../../../commonServices/commanmaster/common.services'
import { GlobalService } from '../../../../commonServices/global.service'
import { Settings } from '../../../../shared/constants/settings.constant'
import { SetUpIds } from 'src/app/shared/constants/setupIds.constant'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash'
import { NgSelectComponent } from '@ng-select/ng-select'
import { AddNewCityComponent } from '../../../components/add-new-city/add-new-city.component';
import { IfStmt } from '@angular/compiler'

declare const $: any
declare const flatpickr: any
@Component({
  selector: 'app-customer-add',
  templateUrl: './customer-add.component.html',
  styleUrls: ['./customer-add.component.css']
})
export class CustomerAddComponent implements OnDestroy {
  modalSub: Subscription
  confirmSUB: Subscription
  subscribe: Subscription
  coustomerDetails: Ledger[]
  id: any
  AreaName: any = 'Select Area'
  CityName: any = 'Select City'
  StateName: any = 'Select State'
  CountryName: any = 'Select Country'
  mobileArray: any
  addressid: any
  emailErrMsg: any
  editMode: boolean = false
  private unSubscribe$ = new Subject<void>()
  public selectCrDr: Array<Select2OptionData>
  public countryList: Array<Select2OptionData>
  public stateList: any
  public cityList: Array<Select2OptionData>
  public areaList: Array<Select2OptionData>
  public customerType: Array<Select2OptionData>
  public addressType: Array<Select2OptionData>
  public selectyCoustmoreRegistration: any
  public addressTypePlaceHolder: Select2Options
  public coustmoerTypePlaceholder: Select2Options
  public areaListPlaceHolder: Select2Options
  public stateListplaceHolder: Select2Options
  public countryListPlaceHolder: Select2Options

  areaForm: any
  emailArray: any
  addressForm: any
  customerForm: any
  satuariesId: number
  submitClick: boolean
  collectionOfAddress: any
  istradeDiscountValue: boolean
  isVolumeDiscountValue: boolean
  isDiscountValue: boolean
  customerRegistraionError: boolean
  customCustomer: boolean
  EMAIL: any = 'email'
  MOBILE: any = 'mobile'
  YES: any = 'yes'
  NO: any = 'no'
  addresTypeId: any
  contactId: number = 0
  mobileNoId: number = 0
  storeAddress: any
  addressError: boolean
  clientDateFormat: any
  isAddNew: boolean = false
  editId: any
  noOfDecimal: any = 0
  constructor(public _globalService: GlobalService,
    public _settings: Settings, public _CommonService: CommonService,
    private _coustomerServices: VendorServices, public _categoryservices: CategoryServices,
    public _toastrcustomservice: ToastrCustomService) {
    this.searchCountryCodeForMobile(' ')
    this.noOfDecimal = this._settings.noOfDecimal
    this.modalSub = this._CommonService.getCustStatus().subscribe(
      (data: AddCust) => {
        if (data.open) {
          this.isAddNew = data.isAddNew
          if (data.editId === '') {
            this.editMode = false
            this.editId = 0
            this.id = 0
            this.enableContactFlag = true
          } else {
            this.editId = data.editId
            this.id = data.editId
            this.editMode = true
          }
          this.openModal()
        } else {
          this.closeModal()
        }
      }
    )
  }


  closeModal() {
    $('#customer_form').modal(UIConstant.MODEL_HIDE)
  }
  @ViewChild('country_selecto') countryselecto: NgSelectComponent
  @ViewChild('state_select2') stateselecto: NgSelectComponent
  @ViewChild('city_select2') cityselecto: NgSelectComponent



  stateValue: any = null
  getStaeList(id, value) {
    this.stateValue = null
    this.stateList = []
    this.subscribe = this._coustomerServices.gatStateList(id).subscribe(Data => {
      let newlist = [{ id: '0', text: 'Select State', stateCode: 0 }]
      if (Data.Code === 1000) {
        Data.Data.forEach(element => {
          newlist.push({
            id: element.Id,
            text: element.CommonDesc1,
            stateCode: element.ShortName1
          })
        })
        this.stateList = newlist
      }
    })
  }

  selectStatelist(event) {
    console.log(event)
    this.stateValue = event.id
    if (this.stateValue > 0) {
      this.stateValue = event.id
      if(this.countryValue===123){
        this.GSTStateCode = event.stateCode
      }
      else{
        this.GSTStateCode='00'
      }
      this.stateName = event.text
      if (this.stateValue > 0) {
        this.getCitylist(this.stateValue, 0)
      }
    }
    if (event.id === 0) {
      this.stateValue = null
    }
  }
  selectedCityId(event) {
    this.cityValue = event.id
    if (this.cityValue > 0) {
      this.cityName = event.text
      this.getAreaId(this.cityValue)
    }
    if (+event.id === -1) {
      const data = {
        countryList: !_.isEmpty(this.countryList) ? [...this.countryList] : [],
        countryId: !this.countryValue ? 0 : this.countryValue,
        stateId: !this.stateValue ? 0 : this.stateValue
      }
      this.addNewCityRefModel.openModal(data);
    }
    else if (event.id === 0) {
      this.stateValue = null
    }
  }
  @ViewChild('customer_register_type') CustomerRegisterTypeSelect2: Select2Component

  cityValue: any = null
  getCitylist(id, value) {
    this.cityValue = null
    this.cityList = []
    this.subscribe = this._coustomerServices.getCityList(id).subscribe(Data => {
      let newData = [{ id: '0', text: 'Select City' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
      Data.Data.forEach(element => {
        newData.push({
          id: element.Id,
          text: element.CommonDesc2
        })
      })
      this.cityList = newData
    })
  }


  getAreaId(id) {
    this.areNameId = null
    this.areaList = []
    this.subscribe = this._coustomerServices.getAreaList(id).subscribe(Data => {
      this.areaList = [{ id: '0', text: 'Select Area' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
      Data.Data.forEach(element => {
        this.areaList.push({
          id: element.Id,
          text: element.CommonDesc3
        })
      })
    })
  }

  @ViewChild('areaNameRef') areaNameRef: ElementRef

  openAreaModel() {
    setTimeout(() => {
      this.areaNameRef.nativeElement.focus()
    }, 500)
    $('#add_area_Popup').modal(UIConstant.MODEL_SHOW)
  }
  closeAreaModel() {
    $('#add_area_Popup').modal(UIConstant.MODEL_HIDE)
  }
  areaName: any
  addAreaClick: boolean
  areNameId: any = null


  areaAdd() {
    this.addAreaClick = true
    const addValue = {
      Id: 0,
      CommonDesc3: this.areaName,
      ShortName3: this.areaName,
      CommonCode: 104,
      CommonId2: this.cityValue
    }
    if (!_.isEmpty(this.areaName) && this.areaName !== '' && this.cityValue > 0) {
      this.subscribe = this._CommonService.addAreaNameUnderCity(addValue).subscribe(data => {
        if (data.Code === 1000 && data.Data.length > 0) {
          let newData = Object.assign([], this.areaList)
          newData.push({ id: data.Data, text: this.areaName })
          this.areaList = newData
          this.areNameId = data.Data
          this.Areaname = this.areaName
          this._toastrcustomservice.showSuccess('', 'Area Added !')
          this.closeAreaModel()
          setTimeout(() => {
            //  this.areaSelect2.selector.nativeElement.focus()
          }, 500)
        }
        if (data.Code === 5000) {
          this._toastrcustomservice.showError('', data.Description)
          this.closeAreaModel()
        }
      })
    }

  }
  Areaname: any
  selectedArea(event) {
    this.areNameId = +event.id
    if (+event.id === -1) {
      this.Areaname = ''
      this.openAreaModel()
    } else if (+event.id > 0) {
      this.areNameId = +event.id
      this.Areaname = event.text
    } else if(event.id===0) {
      this.Areaname = ''
      this.areNameId =0
    }
  }
  addressValue: any
  addTypeName: any
  adressType(value) {
    this.addressType = [{ id: '1', text: 'Personal' }, { id: '2', text: 'Work' }, { id: '3', text: 'Postal' }, { id: '4', text: 'Other' }]
    this.addresTypeId = this.addressType[0].id
    this.addTypeName = this.addressType[0].text
  }

  selectedAddressTypeId(event) {
    if (event.value > 0 && event.data.length > 0) {
      this.addTypeName = event.data[0].text
      this.addresTypeId = event.value
    }

  }
  



  clearValidation() {
    this.closeConfirmation()
  }


  addressRequiredForLedger: boolean
  mobileRequirdForSetting: boolean
  emailRequirdForSetting: boolean
  customerCustomRateFlag: boolean
  futureDateAn: any
  DateOfBirth: any = ''
  DateOfAnniry: any = ''
  futureDateB: any
  setDOBDate() {
    this.DateOfBirth = ''
    this.futureDateAn = this._globalService.getDefaultDate(this.clientDateFormat)
  }
  setDOADate() {
    this.DateOfAnniry = ''
    this.futureDateB = this._globalService.getDefaultDate(this.clientDateFormat)
  }
  validMobileFlag: boolean
  editFlg: boolean
  EmailId: number
  requiredGSTNumber: boolean = false

  onloadingCustomerForm() {
    this.disabledGSTfor_UnRegi = false
    this.collectionOfAddress = []
    this.addressIndex = null
   // this.countryValue = null
    this.setDOBDate()
    this.setDOADate()
    this.contactPerson = ''
    this.customerName = ''
    this.gstin = ''
    this.openingblance = 0
    this.panNo = ''
    this.creditDays = 0
    this.creditlimit = 0
    this.coustmoreRegistraionId = 0
    this.select2CrDrValue(0)
    this.crdrSelect2.setElementValue(1)
    this.customerTypeSelect2.setElementValue(0)
    this.CustomerRegisterTypeSelect2.setElementValue(0)
    this.satuariesId = 0
    this.enableContactFlag = true
    this.editEmailFlg = true
    this.editFlg = true
    this.validMobileFlag = false
    this.customerCustomRateFlag = false
    this.addressClick = false
    this.customerRegistrationType()
    this.onLoadMobile()
    this.onLaodEmail()

  }
addressReset(){
  this.countryValue= null
  this.stateValue=null
  this.cityValue=null
  this.areNameId=null
  this.adresss=''
  this.postcode=''

}
  onLoadMobile() {
    this.mobileArray = []
    this.mobileNo = ''
    this.getContactType()
    this.select_Mobile.setElementValue(1)
    this.mobileNoId = 0

  }
  onLaodEmail() {
    this.emailArray = []
    this.EmailAddress = ''
    this.emailTypeDataType()
    this.select_email.setElementValue(1)
    this.EmailId = 0
  }
  onloadingAddress() {
    this.adressType(0)
    this.addressid = 0
    this.stateValue = null
    this.cityValue = null
    this.areNameId = null
    this.addresTypeId = 0
    this.addTypeName = ''
    this.postcode = ''
    this.Areaname = ''
    this.country = ''
    this.stateName = ''
    this.cityName = ''
    this.adresss = ''
    this.addressValue = 1
  }
  openModal() {
    this.validmobileLength = 0
    this.invalidObj = {}
    this.onloadingCustomerForm()
    this.onloadingAddress()
    this.getSetUpModules((JSON.parse(this._settings.moduleSettings).settings))
    this.getCountry(0)
    this.getCustomoerType()
    $('#customer_form').modal(UIConstant.MODEL_SHOW)
    this.satuariesId = 0
    this.submitClick = true
    this.istradeDiscountValue = false
    this.isVolumeDiscountValue = false
    this.isDiscountValue = false
    this.CustomerRegisterTypeSelect2.setElementValue(0)
    $('#tradediscount').prop('checked', false)
    $('#cashdiscount').prop('checked', false)
    $('#volumediscount1').prop('checked', false)
    setTimeout(() => {
      this.ledgerName.nativeElement.focus()
    }, 500)
        this.getOrgnizationAddress()
    if (this.editMode) {
      this.getCustomerEditData(this.id)
    }
    this.redMarkLabel()
  }

  getModuleSettingValue: any
  @ViewChild('select_mobiletype') select_Mobile: Select2Component
  @ViewChild('select_emailtype') select_email: Select2Component
  @ViewChild('ledgerName') ledgerName: ElementRef
  @ViewChild('conatctPerRef') conatctPerRef: ElementRef

  customerValue: any
  getCustomoerType() {
    this.customerType=[]
    this.subscribe = this._coustomerServices.getCommonValues('116').subscribe(Data => {
      let newdata = [{ id: '0', text: 'Customer Type' }]
      if (Data.Code === 1000 && Data.Data.length > 0) {
        Data.Data.forEach(element => {
          newdata.push({
            id: element.Id,
            text: element.CommonDesc
          })
        })
      }
      this.customerType = newdata
    })
  }

  isvolumeDisount(event) {
    if (event === true) {
      this.isVolumeDiscountValue = true
    } else {
      this.isVolumeDiscountValue = false
    }
  }

  isDicount(event) {
    if (event === true) {
      this.isDiscountValue = true
    } else {
      this.isDiscountValue = false
    }
  }

  istradeDiscount(event) {
    if (event === true) {
      this.istradeDiscountValue = true
    } else {
      this.istradeDiscountValue = false
    }
  }
  selectCRDRId(event) {
    this.crDrId = event.value
  }
  disabledGSTfor_UnRegi: any = false
  selectCoustmoreId(event) {
    if (event.value > 0 && event.data.length > 0) {
      this.coustmoreRegistraionId = event.value
      if (event.value === '4') {
        this.disabledGSTfor_UnRegi = true
        this.gstin = ''
      }
      else {
        this.disabledGSTfor_UnRegi = false
      }
    }
    if (+event.value === 0) {
      this.disabledGSTfor_UnRegi = false
      this.gstin = ''
    }
  }

  selectCountryListId(event) {
    this.countryValue = +event.id
    this.CountryName = event.text
    if (this.countryValue > 0) {
      this.getListCountryLabelList(event.id)
      this.getStaeList(this.countryValue, 0)

    }
    else if (event.id === 0) {
      this.countryValue = null
    }
  }

  customerTypeId: number = 0
  selectCustomerType(event) {
    if (event.value > 0) {
      this.customerTypeId = event.value
    }
    else {
      this.customerTypeId = 0
    }
  }
  countryValue: any = null
  getCountry(value) {
    this.subscribe = this._coustomerServices.getCommonValues('101').subscribe(Data => {
      this.countryListPlaceHolder = { placeholder: 'Select Country' }
      this.countryList = [{ id: UIConstant.BLANK, text: 'Select Country' }]
      Data.Data.forEach(element => {
        this.countryList.push({
          id: element.Id,
          text: element.CommonDesc
        })
      })
    })
  }
  deleteArrayMobileType(i, type) {
    if (type === 'contact') {
      if (this.mobileArray.length > 0) {
        this.mobileArray.splice(i, 1)
      }
    }
    if (type === 'email') {
      if (this.emailArray.length > 0) {
        this.emailArray.splice(i, 1)
      }
    }
  }

  ParentTypeId: 5
  CodeId: any
  editRowItem(i, type, id) {
    if (type === 'contact') {
      if (this.editFlg) {
        this.editFlg = false
        this.mobileNoId = id
        this.contactType = this.mobileArray[i].ContactType
        this.select_Mobile.setElementValue(this.mobileArray[i].ContactType)
        this.contactTypeName = this.mobileArray[i].ContactTypeName
        this.mobileNo = this.mobileArray[i].ContactNo
        this.CountryCode = this.mobileArray[i].CountryCode
        this.countryCodeFlag = this.mobileArray[i].CountryCode
        this.CodeId = this.mobileArray[i].CodeId
        this.validMobileFlag = false
        this.deleteArrayMobileType(i, 'contact')
      }
      else {
        this._toastrcustomservice.showWarning('', 'Save Editable Contact')
      }
    }
    if (type === 'email') {
      if (this.editEmailFlg) {
        this.editEmailFlg = false
        this.EmailId = id
        this.EmailType = this.emailArray[i].EmailType
        this.select_email.setElementValue(this.emailArray[i].EmailType)
        this.EmailAddressTypeName = this.emailArray[i].EmailTypeName
        this.EmailAddress = this.emailArray[i].EmailAddress
        this.deleteArrayMobileType(i, 'email')
      }
      else {
        this._toastrcustomservice.showWarning('', 'Save Editable Email')
      }
    }
  }


  checkSelectCode: boolean = false
  validateMobile(mobile) {
    let regx = /\[0-9]/g
    return regx.test(mobile)
  }
  invalidMobilelength: boolean = false
  checkNumberByCountry(e) {
    this.mobileNo = e.target.value
    if (this.validmobileLength === this.mobileNo.toString().length) {
      this.validMobileFlag = false
    } else {
      this.validMobileFlag = true
    }
  }


  mobileNo: any
  mobileErrMsg: any
  code: any
  selectCoustomerplaceHolder: Select2Options
  coustmoreRegistraionId: any = 0
  customerRegistrationType() {
    this.selectyCoustmoreRegistration = []
    this.selectyCoustmoreRegistration = [{ id: 0, text: 'Select Registration Type' }, { id: 1, text: 'Regular' }
      , { id: 2, text: 'Composition' }, { id: 3, text: 'Exempted' }
      , { id: 4, text: 'UnRegistered' }, { id: 5, text: '	E-Commerce Operator ' }]

  }

  select2CrDrPlaceHolder: Select2Options
  valueCRDR: any
  crDrId: number
  @ViewChild('crdrSelect2') crdrSelect2: Select2Component
  select2CrDrValue(value) {
    this.selectCrDr = []
    this.select2CrDrPlaceHolder = { placeholder: 'Select CR/DR' }
    this.selectCrDr = [{ id: '1', text: 'CR' }, { id: '0', text: 'DR' }]
    this.valueCRDR = value
    this.crDrId = value
  }

  requiredValid: boolean
  customername: any
  redMarkLabel() {
    this.invalidObj['EmailAddress'] = false
    this.invalidObj['mobileNo'] = false
    this.invalidObj['address'] = false
    this.invalidObj['cityValue'] = false
    this.invalidObj['stateValue'] = false
    this.invalidObj['countryValue'] = false

    if (_.isEmpty(this.customerName) && this.customerName === '') {
      this.invalidObj['customerName'] = true
    } else {
      this.invalidObj['customerName'] = false
    }
    if (this.mobile_email_setting_required === 1) {
      //mobile
      if (!_.isEmpty(this.mobileNo) && this.mobileNo !== '' && this.checkValidMobile() && this.mobileArray.length === 0) {
        this.invalidObj['mobileNo'] = false
      } else if (this.mobileArray.length === 0) {
        this.invalidObj['mobileNo'] = true
      }

    }

    if (this.mobile_email_setting_required === 2) {
      // mobile and email
      if (!_.isEmpty(this.mobileNo) && this.mobileNo !== '' && this.checkValidMobile() && this.mobileArray.length === 0) {
        this.invalidObj['mobileNo'] = false
      } else if (this.mobileArray.length === 0) {
        this.invalidObj['mobileNo'] = true
      }
      if (!_.isEmpty(this.EmailAddress) && this.EmailAddress !== '' && this.checkvalidationEmail() && this.emailArray.length === 0) {
        this.invalidObj['EmailAddress'] = false
      } else if (this.emailArray.length === 0) {
        this.invalidObj['EmailAddress'] = true
      }
    }
    if (this.mobile_email_setting_required === 3) {
      //email
      if (!_.isEmpty(this.EmailAddress) && this.EmailAddress !== '' && this.checkvalidationEmail() && this.emailArray.length === 0) {
        this.invalidObj['EmailAddress'] = false
      } else if (this.emailArray.length === 0) {
        this.invalidObj['EmailAddress'] = true
      }
    }

    if (this.address_setting_required) {
      if (this.countryValue === null && this.collectionOfAddress.length===0) {
        this.invalidObj['countryValue'] = true
      }
      else {
        this.invalidObj['countryValue'] = false
      }

      if (this.stateValue === null && this.collectionOfAddress.length===0) {
        this.invalidObj['stateValue'] = true
      }
      else {
        this.invalidObj['stateValue'] = false
      }
      if (this.cityValue === null && this.collectionOfAddress.length===0) {
        this.invalidObj['cityValue'] = true
      }
      else {
        this.invalidObj['cityValue'] = false
      }
      if (_.isEmpty(this.adresss) && this.adresss === '' && this.collectionOfAddress.length===0) {
        this.invalidObj['address'] = true
      }
      else {
        this.invalidObj['address'] = false
      }

    }

    if ((this.coustmoreRegistraionId === '1' || this.coustmoreRegistraionId === '2') && (this.countryValue === 123 || this.countryValue === '123')) {
      this.invalidObj['gst_required'] = true
    }
    else {
      this.invalidObj['gst_required'] = false

    }

  }
  dynamicFocusValidation = () => {
    let valid = true
    if (!_.isEmpty(this.customerName) && this.customerName !== '') {
      this.invalidObj['customerName'] = false
    } else {
      this.invalidObj['customerName'] = true
      valid = false
      this.ledgerName.nativeElement.focus();
    }
    if (this.mobile_email_setting_required === 1) {
      // mobile  validation

      if (!_.isEmpty(this.mobileNo) && this.mobileNo !== '' && this.checkValidMobile() && this.mobileArray.length === 0) {
        this.invalidObj['mobileNo'] = false
      } else if (!this.invalidObj.customerName && this.mobileArray.length === 0) {
        this.invalidObj['mobileNo'] = true
        valid = false
        this.mobileRef.nativeElement.focus();
      }
    }
    if (this.mobile_email_setting_required === 3) {
      //eamil validation
      if (!_.isEmpty(this.EmailAddress) && this.EmailAddress !== '' && this.checkvalidationEmail() && this.emailArray.length === 0) {
        this.invalidObj['EmailAddress'] = false
      } else if (!this.invalidObj.customerName && this.emailArray.length === 0) {

        this.invalidObj['EmailAddress'] = true
        valid = false
        this.emailRef.nativeElement.focus();
      }
    }
    if (this.mobile_email_setting_required === 2) {
      // both email and mobile no
      if (!_.isEmpty(this.mobileNo) && this.mobileNo !== '' && this.checkValidMobile() && this.mobileArray.length === 0) {
        this.invalidObj['mobileNo'] = false
      } else if (!this.invalidObj.customerName && this.mobileArray.length === 0) {
        this.invalidObj['mobileNo'] = true
        valid = false
        this.mobileRef.nativeElement.focus();
      }
      if (!_.isEmpty(this.EmailAddress) && this.EmailAddress !== '' && this.checkvalidationEmail() && this.emailArray.length === 0) {
        this.invalidObj['EmailAddress'] = false
      } else if (!this.invalidObj.customerName && !this.invalidObj.mobileNo && this.emailArray.length === 0) {

        this.invalidObj['EmailAddress'] = true
        valid = false
        this.emailRef.nativeElement.focus();
      }


    }
    if (this.address_setting_required) {
      if (this.countryValue > 0 && this.countryValue !== null && this.collectionOfAddress.length === 0) {
        this.invalidObj['countryValue'] = false
      }
      else if (!this.invalidObj.customerName && this.collectionOfAddress.length === 0 && !this.invalidObj.EmailAddress && !this.invalidObj.mobileNo) {
        this.invalidObj['countryValue'] = true
        this.countryselecto.focus()
        valid = false
      }
      if (this.stateValue > 0 && this.stateValue !== null && this.collectionOfAddress.length === 0) {
        this.invalidObj['stateValue'] = false
      }
      else if (!this.invalidObj.customerName && !this.invalidObj.EmailAddress && !this.invalidObj.mobileNo && !this.invalidObj.countryValue && this.collectionOfAddress.length === 0) {
        this.invalidObj['stateValue'] = true
        this.stateselecto.focus()
        valid = false
      }
      if (this.cityValue > 0 && this.cityValue !== null && this.collectionOfAddress.length === 0) {
        this.invalidObj['cityValue'] = false
      }
      else if (!this.invalidObj.customerName && !this.invalidObj.EmailAddress && !this.invalidObj.mobileNo && !this.invalidObj.countryValue && !this.invalidObj.stateValue && this.collectionOfAddress.length === 0) {
        this.invalidObj['cityValue'] = true
        this.cityselecto.focus()
        valid = false
      }
      if (!_.isEmpty(this.adresss) && this.adresss !== '' && this.collectionOfAddress.length === 0) {
        this.invalidObj['address'] = false
      }
      else if (!this.invalidObj.customerName && !this.invalidObj.EmailAddress && !this.invalidObj.mobileNo && !this.invalidObj.countryValue && !this.invalidObj.stateValue && !this.invalidObj.cityValue && this.collectionOfAddress.length === 0) {
        if (this.mobile_email_setting_required === 1 || this.mobile_email_setting_required === 2) {
          if (this.mobileArray.length > 0) {
            this.invalidObj['address'] = true
            this.addressRef.nativeElement.focus()
            valid = false
          }
        }
        else if (this.mobile_email_setting_required === 3) {
          if (this.emailArray.length > 0) {
            this.invalidObj['address'] = true
            this.addressRef.nativeElement.focus()
            valid = false
          }
        }
        else if (this.mobile_email_setting_required === 0) {
          this.invalidObj['address'] = true
          this.addressRef.nativeElement.focus()
          valid = false

        }

      }
        if (!this.chekGSTvalidation() && !this.invalidObj.EmailAddress && !this.invalidObj.mobileNo && !this.invalidObj.customerName && !this.invalidObj.countryValue && !this.invalidObj.stateValue && !this.invalidObj.cityValue) {
          this.invalidObj['gst_required'] = true
          this.gstRef.nativeElement.focus()
          valid = false
        } else {
          this.invalidObj['gst_required'] = false
        }
      
        if (!this.chekGSTvalidation() && !this.invalidObj.EmailAddress && !this.invalidObj.mobileNo && !this.invalidObj.customerName && !this.invalidObj.countryValue && !this.invalidObj.stateValue && !this.invalidObj.cityValue) {
          this.invalidObj['gst_required'] = true
          this.gstRef.nativeElement.focus()
          valid = false
        } else {
          this.invalidObj['gst_required'] = false
        }
     
        if (!this.checkPANNumberValid() && !this.invalidObj.customerName && !this.invalidObj.countryValue && !this.invalidObj.stateValue && !this.invalidObj.cityValue) {
          this.panRef.nativeElement.focus()
          valid = false
        } else {
          this.invalidObj['panRef'] = false
        }
    
    }

    return valid
  }
  splitGSTNumber() {
    let parts = this.gstin.trim()
    this.GSTStateCode = parts.substring(0, 2);
    this._CommonService.getStateByGStCode(this.GSTStateCode).subscribe(d => {
      if (d.Code === 1000 && d.Data.length > 0) {
        this.stateValue = d.Data[0].Id
        if(this.countryValue===123){
          this.GSTStateCode = d.Data[0].ShortName1
        }
        else{
          this.GSTStateCode='00'
        }
        let state = {
          id: d.Data[0].Id,
          text: d.Data[0].CommonDesc1,
          stateCode: d.Data[0].ShortName1
        }
        this.selectStatelist(state)
      }
    })
  }
  onPasteGST(e) {
    this._CommonService.allowOnlyNumericValueToPaste(e, (res) => {
      this.gstin = res
    })
  };
  onPastePAN(e) {
    this._CommonService.allowOnlyNumericValueToPaste(e, (res) => {
      this.panNo = res
    })
  };
  chekGSTvalidation() {
    if (!_.isEmpty(this.gstin) && this.gstin !== '') {
      this.GSTNumber = (this.gstin).toUpperCase()
      if(this.multipleCountry()){
        if (this._CommonService.regxGST.test(this.GSTNumber)) {
          return true
        } else {
          return false
        }
      }
      else{
        return true
      }  
    }
    else if ((this.coustmoreRegistraionId === '1' || this.coustmoreRegistraionId === '2') && this.multipleCountry()) {
      return false
    }
    else {
      return true

    }
  }

  multipleCountry() {
    if (this.collectionOfAddress.length > 0) {
      let dvalue = this.collectionOfAddress.filter(
        d => (d.CountryId===123))
      if (dvalue.length > 0) { return true }
      else { return false }
    }
    else { return true }
  }
  checkPANNumberValid() {
    if (!_.isEmpty(this.panNo) && this.panNo !== '') {
      this.PANNumber = (this.panNo).toUpperCase()
      if(this.multipleCountry()){
        if (this._CommonService.panNumberRegxValidation(this.PANNumber)) {
          return true
        } else {
          return false
        }
      }
      else{
        return true
      }
    }
    else {
      return true
    }
  }
  saveCustomer(value) {
    this.submitClick = true
    if (value === 'reset') {
      this.onloadingCustomerForm()
      this.onloadingAddress()
    }
    this.addConatctDetails()
    this.addEmailDetail()
    this.addNewAdress()
    if (this.dynamicFocusValidation()) {
      if (this.matchStateCodeWithGSTNumber()) {
        if (this.checkvalidationEmail()) {
          if (this.checkValidMobile()) {
            if (this.chekGSTvalidation()) {
              if (this.checkPANNumberValid()) {
                this.subscribe = this._coustomerServices.addVendore(this.customerParams()).subscribe(Data => {
                  if (Data.Code === UIConstant.THOUSAND) {
                    if (value === 'save') {
                      const dataToSend = { id: Data.Data, name: this.customerName }
                      this._CommonService.AddedItem()
                      this._CommonService.closeCust({ ...dataToSend })
                      let saveFlag = this.editId === 0 ? UIConstant.SAVED_SUCCESSFULLY : UIConstant.UPDATE_SUCCESSFULLY
                      this._toastrcustomservice.showSuccess('', saveFlag)
                      this.select2CrDrValue(0)
                      this.crdrSelect2.setElementValue(1)
                    }
                    if (value === 'new') {
                      setTimeout(() => {
                        this.ledgerName.nativeElement.focus()
                      }, 200)
                      this.onloadingCustomerForm()
                      this.id = 0
                      this._CommonService.AddedItem()
                      this._toastrcustomservice.showSuccess('', UIConstant.SAVED_SUCCESSFULLY)
                      if(!this.addressByDefaultForLedger){
                        this.addressReset()
                      }
                       this.redMarkLabel()
                    }

                  }
                  if (Data.Code === UIConstant.THOUSANDONE) {
                    this._toastrcustomservice.showInfo('', Data.Description)
                  }
                  if (Data.Code === 5004) {
                    this._toastrcustomservice.showInfo('', Data.Description)
                  }

                  if (Data.Code === 5001) {
                    this._toastrcustomservice.showError('', Data.Description)
                  }
                  if (Data.Code === UIConstant.REQUIRED_5020) {
                    this._toastrcustomservice.showError('', Data.Data)
                  }
                })
              }
              else {
                this.panRef.nativeElement.focus()
              }
            }
            else {
              this.gstRef.nativeElement.focus()
            }
          }
          else {
            this.mobileRef.nativeElement.focus()
          }
        } else {
          this.emailRef.nativeElement.focus()
        }

      }
      else {
        this.gstRef.nativeElement.focus()
        this._toastrcustomservice.showError('', 'Invalid GSTIN Number According to Selected State ')
      }
    }

  }


  @ViewChild('gstRef') gstRef: ElementRef
  @ViewChild('mobileRef') mobileRef: ElementRef
  @ViewChild('emailRef') emailRef: ElementRef
  @ViewChild('panRef') panRef: ElementRef

  errormassage: string
  stateError: boolean
  cityError: boolean
  mobileError: boolean
  emailError: boolean
  mobileErrormass: string
  emailErrormass: string
  reqEmailMobile: boolean


  @ViewChild('area_selecto2') areaSelect2: Select2Component
  @ViewChild('address_value') addressRef: ElementRef



  GSTNumber: any
  PANNumber: any
  GSTStateCode: any = 0
  GstinNoCode: any

  returnsplitGSTcode() {
    if (!_.isEmpty(this.gstin) && this.gstin !== '') {
      let str = this.gstin
      let val = str.trim();
      this.GstinNoCode = val.substr(0, 2);
      if (this.GstinNoCode !== '') {
        return this.GstinNoCode
      }
    } else {
      return ''
    }
  }


  multipleGSTmatch() {
    if (this.collectionOfAddress.length > 0) {
      let dvalue = this.collectionOfAddress.filter(
        d => (d.StateCode === this.GstinNoCode))
      if (dvalue.length > 0) { return true }
      else { return false }
    }
    else { return true }
  }

  matchStateCodeWithGSTNumber() {
    if ((!_.isEmpty(this.returnsplitGSTcode()))  && this.GstinNoCode !== '') {
      if(this.multipleCountry()){
        if(this.multipleGSTmatch()){
          return true
        }
        else{
          return false
        }
      }else{
        return true
      }
    } else {
      return true
    }

  }



  private customerParams(): AddLedger {
    let DOA;
    let DOB;
    if (this.DateOfAnniry !== '') {
      DOA = this._globalService.clientToSqlDateFormat(this.DateOfAnniry, this.clientDateFormat)
    }
    else {
      DOA = ''
    }
    if (this.DateOfBirth !== '') {
      DOB = this._globalService.clientToSqlDateFormat(this.DateOfBirth, this.clientDateFormat)
    }
    else {
      DOB = ''
    }

    let customerElement = {
      customerOBJ: {
        Id: this.id !== 0 ? this.editId : 0,
        Websites: [],
        GlId: 5,
        CustomerTypeId: this.customerTypeId,
        Name: this.customerName,
        TaxTypeID: this.coustmoreRegistraionId,
        CrDr: this.crDrId,
        OpeningAmount: this.getopeinAmountValue(),
        CreditDays: this.creditDaysValue(),
        CreditLimit: this.getCreditLimit(),
        IsTradeDiscountable: this.istradeDiscountValue,
        IsVolumeDiscountable: this.isVolumeDiscountValue,
        IsCashDiscountable: this.isDiscountValue,

        Statutories: [{
          Id: this.satuariesId !== 0 ? this.satuariesId : 0,
          PanNo: this.PANNumber,
          GstinNo: this.gstin,
          ParentTypeId: 5
        }],
        ContactPersons: [{
          Id: this.contactId !== 0 ? this.contactId : 0,
          ParentTypeId: 5,
          Name: this.contactPerson,
          DOB: DOB,
          DOA: DOA
        }],

        ContactInfos: this.mobileArray,
        Addresses: this.collectionOfAddress,
        Emails: this.emailArray
      } as AddLedger
    }
    console.log(customerElement, 'customer-Req-')
    return customerElement.customerOBJ
  }
  private getCreditLimit() {
    if (this.creditlimit > 0) {
      return this.creditlimit
    } else {
      return 0
    }
  }
  private creditDaysValue() {
    if (this.creditDays > 0) {
      return this.creditDays
    } else {
      return 0
    }
  }
  private getopeinAmountValue() {
    if (this.openingblance > 0) {
      return this.openingblance
    } else {
      return 0
    }
  }
  addressClick: boolean
  country: string
  stateName: string
  cityName: string

  dynamicFocusAddress() {
    let isvalid = true
    if (this.countryValue !== 0 && this.countryValue !== null) {
      this.invalidObj['countryValue'] = false
    }
    else {
      this.invalidObj['countryValue'] = true
      this.countryselecto.focus()
      isvalid = false
    }
    if (this.stateValue !== 0 && this.stateValue !== null) {
      this.invalidObj['stateValue'] = false
    }
    else if (this.collectionOfAddress.length === 0) {
      this.invalidObj['stateValue'] = true
      this.stateselecto.focus()

      isvalid = false
    }
    if (this.cityValue !== 0 && this.cityValue !== null) {
      this.invalidObj['cityValue'] = false
    }
    else {
      this.invalidObj['cityValue'] = true
      this.cityselecto.focus()

      isvalid = false
    }
    if (this.adresss !== '' && (!_.isEmpty(this.adresss))) {
      this.invalidObj['adresss'] = false
    }
    else {
      this.invalidObj['adresss'] = true
      this.addressRef.nativeElement.focus()
      isvalid = false
    }
    return isvalid
  }

  addNewAdress() {
    // if (this.dynamicFocusAddress()) {
    if (this.countryValue !== 0 && this.countryValue !== null && this.stateValue !== 0 && this.stateValue !== null && this.cityValue !== 0 && this.cityValue !== null && (!_.isEmpty(this.adresss)) && this.adresss !== '') {
      if (this.addressIndex !== null) {
        if (this.collectionOfAddress.length > 0) {
          let newArray = {
            Id: this.collectionOfAddress[this.addressIndex].Id !== 0 ? this.collectionOfAddress[this.addressIndex].Id : 0,
            ParentTypeId: 5,
            CountryId: this.countryValue,
            StateId: this.stateValue,
            CityId: this.cityValue,
            StateCode: this.GSTStateCode,
            AddressType: this.addresTypeId,
            AddressTypeName: this.addTypeName,
            PostCode: this.postcode,
            AreaId: this.areNameId===null ? 0 : this.areNameId,
            AreaName: this.areNameId===null ? '' : this.areaName,
            AddressValue: this.adresss,
            CountryName: this.CountryName,
            Statename: this.stateName,
            CityName: this.cityName
          }
          this.collectionOfAddress.splice(this.addressIndex, 1, newArray)
        }
        this.addressIndex = null
      } else {
        this.collectionOfAddress.push({
          Id: 0,
          ParentTypeId: 5,
          CountryId: this.countryValue,
          StateId: this.stateValue,
          CityId: this.cityValue,
          AddressType: this.addresTypeId,
          AddressTypeName: this.addTypeName,
          StateCode: this.GSTStateCode,
          PostCode: this.postcode,
          AreaId: this.areNameId===null ? 0 : this.areNameId,
          AreaName: this.areNameId===null ? '' : this.areaName,
          AddressValue: this.adresss,
          CountryName: this.CountryName,
          Statename: this.stateName,
          CityName: this.cityName
        })
      }
      this.addressClick = false
      this.adresss = ''
    }
  }
  getAddressIdForEdit(Address) {
    this.countryValue = Address.CountryId
    this.stateValue = Address.StateId
    this.cityValue = Address.cityId
    this.areNameId = Address.AreaId
    if(this.countryValue===123){
      this.GSTStateCode = Address.StateCode
    }
    else{
      this.GSTStateCode='00'
    }
    this.CountryName = Address.CountryName
    this.stateName = Address.Statename
    this.cityName = Address.CityName
    this.adresss = Address.AddressValue
    this.Areaname = Address.AreaName
    this.postcode = Address.PostCode
    this.addTypeName = Address.AddressTypeName
    let country = {
      id: Address.CountryId,
      text: Address.CountryName
    }
    this.selectCountryListId(country)
    this.getListCountryLabelList(Address.CountryId)
    let state = {
      id: Address.StateId,
      text: Address.Statename,
      stateCode: this.GSTStateCode
    }
    let city = {
      id: Address.CityId,
      text: Address.CityName
    }
    setTimeout(() => {
      this.selectStatelist(state)
    }, 100);
    setTimeout(() => {
      this.selectedCityId(city)
    }, 200);
    let area = {
      id: Address.AreaId,
      text: Address.AreaName
    }
    setTimeout(() => {
      this.selectedArea(area)
    }, 200);
  }
  addressIndex: any = null
  getEditAddress(address, index) {
    this.addressIndex = index
    this.getAddressIdForEdit(address)
    this.adressType(address.AddressType)
  }
  getOrgnizationAddress() {
    let Address = JSON.parse(localStorage.getItem('ORGNIZATIONADDRESS'));
    if (Address !== null && this.addressByDefaultForLedger) {
      this.loadAddressDetails(Address)
    }
    if (Address !== null  && !this.addressByDefaultForLedger) {
      this.getCountryCodeForMobile(Address)
    }
  }
  getCountryCodeForMobile (Address){
    this.validmobileLength = Address.Length
    this.countryCodeFlag = Address.CountryCode
    this.CountryCode = Address.CountryCode
    this.getListCountryLabelList(0)
    this.GSTStateCode='00'
    
  }
  loadAddressDetails(Address) {
    this.validmobileLength = Address.Length
    this.countryValue = Address.CountryId
    this.stateValue = Address.StateId
    this.cityValue = Address.CityId
    this.countryCodeFlag = Address.CountryCode
    this.CountryCode = Address.CountryCode
    if(this.countryValue===123){
      this.GSTStateCode = Address.ShortNameState
    }
    else{
      this.GSTStateCode='00'
    }
    this.CountryName = Address.CountryName
    let country = {
      id: Address.CountryId,
      text: Address.CountryName
    }
    this.selectCountryListId(country)

    this.getListCountryLabelList(Address.CountryId)
    let state = {
      id: Address.StateId,
      text: Address.Statename,
      stateCode: this.GSTStateCode
    }
    let city = {
      id: Address.CityId,
      text: Address.CityName
    }
    let area = {
      id: Address.AreaId,
      text: Address.AreaName
    }


    setTimeout(() => {
      this.selectStatelist(state)
    }, 100);
    setTimeout(() => {
      this.selectedCityId(city)
    }, 200);
    setTimeout(() => {
      this.selectedArea(area)
    }, 200);

  }


  postcode: any
  adresss: any = ''
  ngOnDestroy() {
    if (this.modalSub) this.modalSub.unsubscribe()
    if (this.confirmSUB) this.confirmSUB.unsubscribe()
    if (this.subscribe) this.subscribe.unsubscribe()
  }
  setupCodeForAddresRequired: any
  removeAdressIndexArray(i) {
    this.collectionOfAddress.splice(i, 1)
  }
  openingblance: any
  gstin: any
  panNo: any
  customerName: any
  creditDays: any
  doa: any
  dob: any
  creditlimit: any
  getCustomerEditData(id) {
    setTimeout(() => {
      this.ledgerName.nativeElement.focus()
    }, 1000)
    //this.getCountry(0)
    this.submitClick = true
    $('#customer_form').modal(UIConstant.MODEL_SHOW)
    this.subscribe = this._coustomerServices.editvendor(id).subscribe(Data => {
      if (Data.Code === UIConstant.THOUSAND) {
        if (Data.Data && Data.Data.Statutories && Data.Data.Statutories.length > 0) {
          this.satuariesId = Data.Data.Statutories[0].Id
          this.gstin = Data.Data.Statutories[0].GstinNo
          this.panNo = Data.Data.Statutories[0].PanNo
        }

        if (Data.Data && Data.Data.Addresses && Data.Data.Addresses.length > 0) {
          this.collectionOfAddress = Data.Data.Addresses
          this.addressRequiredForLedger = false

        }
        if (Data.Data && Data.Data.ContactPersons && Data.Data.ContactPersons.length > 0) {
          this.contactId = Data.Data.ContactPersons[0].Id
          this.contactPerson = Data.Data.ContactPersons[0].Name
          if (Data.Data.ContactPersons[0].DOA !== null) {
            this.DateOfAnniry = this._globalService.utcToClientDateFormat(Data.Data.ContactPersons[0].DOA, this.clientDateFormat)
          }
          else {
            this.doa = ''
          }
          if (Data.Data.ContactPersons[0].DOB !== null) {
            this.DateOfBirth = this._globalService.utcToClientDateFormat(Data.Data.ContactPersons[0].DOB, this.clientDateFormat)
          }
          else {
            this.dob = ''
          }
        }
        if (Data.Data && Data.Data.LedgerDetails && Data.Data.LedgerDetails.length > 0) {
          this.customerName = Data.Data.LedgerDetails[0].Name
          this.creditDays = Data.Data.LedgerDetails[0].CreditDays
          this.creditlimit = Data.Data.LedgerDetails[0].CreditLimit.toFixed(this.noOfDecimal)
          this.openingblance = Data.Data.LedgerDetails[0].OpeningBalance.toFixed(this.noOfDecimal)
          this.customerTypeId = Data.Data.LedgerDetails[0].CustomerTypeId
          this.customerTypeSelect2.setElementValue(Data.Data.LedgerDetails[0].CustomerTypeId)
          this.coustmoreRegistraionId = Data.Data.LedgerDetails[0].TaxTypeId.toString()
          this.requiredGSTNumber = Data.Data.LedgerDetails[0].TaxTypeId === 1 ? true : false
          this.crDrId = Data.Data.LedgerDetails[0].Crdr

          this.CustomerRegisterTypeSelect2.setElementValue(Data.Data.LedgerDetails[0].TaxTypeId)
          this.disabledGSTfor_UnRegi = Data.Data.LedgerDetails[0].TaxTypeId === 4 ? true : false
          this.select2CrDrValue(Data.Data.LedgerDetails[0].Crdr)
        }
        if (Data.Data.ContactInfo.length > 0) {
          this.mobileArray = Data.Data.ContactInfo

        }
        if (Data.Data && Data.Data.Emails.length > 0) {
          this.emailArray = Data.Data.Emails
        }
        if (Data.Data.LedgerDetails[0].IsTradeDiscountable === true) {
          this.istradeDiscountValue = true
          $('#tradediscount').prop('checked', true)
        } else {
          $('#tradediscount').prop('checked', false)
          this.istradeDiscountValue = false
        }
        if (Data.Data.LedgerDetails[0].IsVolumeDiscountable === true) {
          $('#volumediscount1').prop('checked', true)
          this.isVolumeDiscountValue = true
        } else {
          $('#volumediscount1').prop('checked', false)
          this.isVolumeDiscountValue = false
        }

        if (Data.Data.LedgerDetails[0].IsCashDiscountable === true) {
          $('#cashdiscount').prop('checked', true)
          this.isDiscountValue = true
        } else {
          $('#cashdiscount').prop('checked', false)
          this.isDiscountValue = false
        }
      }
      if (Data.Code === 5000) {
        this._toastrcustomservice.showError('', Data.Description)
      }
    })
    this.redMarkLabel()
  }

  @ViewChild('customer_type_select2') customerTypeSelect2: Select2Component
  contactPerson: any
  reapeatName(name: string) {
    this.contactPerson = name
  }
  mobile_email_setting_required: any
  address_setting_required: any
  addressByDefaultForLedger:boolean = false
  getSetUpModules(settings) {
    settings.forEach(element => {
      if (element.id === SetUpIds.dateFormat) {
        this.clientDateFormat = element.val[0].Val
      }
      if (element.id === SetUpIds.edgerEmailorMobileRequiredorNot) {
        this.mobile_email_setting_required = element.val
      }
      if (element.id === SetUpIds.edgerAddressRequiredorNot) {
        this.address_setting_required = element.val
      }
      if (element.id === SetUpIds.addressByDefaultForLedger) {
        this.addressByDefaultForLedger = element.val
      }

    })

  }

  contactTypeData: any
  getContactType() {
    this.contactTypeData = [
      { id: '1', text: 'Work' },
      { id: '2', text: 'Home' },
      { id: '3', text: 'Mobile' },
      { id: '4', text: 'Fax' },
      { id: '5', text: 'Skype' },
      { id: '6', text: 'YMessenger' },
      { id: '7', text: 'Sip' },
      { id: '8', text: 'Other' }
    ]
  }
  selectMobileId: any
  emailTypeData: any
  emailTypeDataType() {
    this.emailTypeData = [
      { id: '1', text: 'Personal' },
      { id: '2', text: 'Work' },
      { id: '3', text: 'Home' },
      { id: '4', text: 'Other' }
    ]
  }
  selectEmailId: any
  countryListWithCode: any
  searchCountryCodeForMobile(name) {
    this.subscribe = this._CommonService.searchCountryByName(name).subscribe(Data => {
      if (Data.Code === UIConstant.THOUSAND && Data.Data.length > 0) {
        this.countryListWithCode = []
        let newdataList = [{ id: '0', text: 'Country-Code', PhoneCode: '0', Length: 0 }]
        Data.Data.forEach(element => {
          newdataList.push({
            id: element.Phonecode,
            text: '+' + element.Phonecode + '-' + element.Name,
            PhoneCode: element.Phonecode,
            Length: element.Length
          })
        })
        this.countryListWithCode = newdataList
        console.log(Data, 'code')
      } else {
        this._toastrcustomservice.showError('', Data.Description)
      }
    })
  }
  CountryCode: any = 'select'
  codeLengthList: any
  validmobileLength: any
  enableContactFlag: boolean
  onCountryCodeSelectionChange = (event) => {
    console.log(event)
    if (this.countryCodeFlag !== null) {
      if (event.id > 0) {
        if (event.id !== '0') {
          this.CountryCode = event.PhoneCode
          this.validmobileLength = event.Length
          //this.countryValue =
        }
      }
    }
    if (event.id === '0') {
      this.CountryCode = 0
      this.validmobileLength = 0
    }
  }

  contactType: any
  contactTypeName: any
  CountryCodeId: any
  onChangeContactType = (event) => {
    if (event.data.length > 0) {
      this.contactType = event.data[0].id
      this.contactTypeName = event.data[0].text
    }
  }
  EmailType: any
  EmailAddress: any
  EmailAddressTypeName: any
  onChangeEmailType = (event) => {
    if (event.data.length > 0) {
      this.EmailType = event.data[0].id
      this.EmailAddressTypeName = event.data[0].text
    }
  }

  editEmailFlg: boolean = true
  addEmailDetail() {
    this.editEmailFlg = true
    if (this.EmailType > 0 && (!_.isEmpty(this.EmailAddress)) && this.checkvalidationEmail()) {
      this.emailArray.push({
        Id: this.EmailId === 0 ? 0 : this.EmailId,
        EmailType: this.EmailType,
        EmailTypeName: this.EmailAddressTypeName,
        EmailAddress: this.EmailAddress,
        ParentTypeId: 5
      })
      this.clear('email')
    }
  }
  @ViewChild('phoneCode_select2') phoneCodeselect2: Select2Component

  clear(type) {
    if (type === 'email') {
      this.EmailAddress = ''
      this.select_email.setElementValue(1)
      this.EmailType = '1'
    }
    if (type === 'contact') {
      this.mobileNo = ''
      //this.phoneCodeselect2.setElementValue(0)
      this.select_Mobile.setElementValue(1)
      this.contactType = '1'
      this.CountryCode = this.countryCodeFlag
      this.validMobileFlag = false
    }
  }

  addConctFlag: boolean = false
  addConatctDetails() {
    this.addConctFlag = true
    this.editFlg = true
    if (this.contactType > 0 && (!_.isEmpty(this.mobileNo)) && this.checkValidMobile()) {
      this.mobileArray.push({
        Id: this.mobileNoId === 0 ? 0 : this.mobileNoId,
        ContactType: this.contactType,
        ContactTypeName: this.contactTypeName,
        ContactNo: this.mobileNo,
        CountryCode: this.CountryCode,
        CodeId: this.CountryCodeId,
        ParentTypeId: 5
      })
      this.enableContactFlag = true
      this.clear('contact')
    }
  }
  invalidObj: any = {}
  invalidObjCont: any = {}
  getEmailvalid: any

  checkvalidationEmail() {
    if (!_.isEmpty(this.EmailAddress) && this.EmailAddress !== '') {
      if (this._CommonService.regxEMAIL.test(this.EmailAddress)) {
        return true
      } else {
        return false
      }
    } else {
      return true
    }
  }
  customerMobileNo: any = ''
  checkValidMobile() {
    if (!_.isEmpty(this.mobileNo) && this.mobileNo !== '') {
      if (this.validmobileLength === this.mobileNo.toString().length) {
        return true
      } else {
        return false
      }
    } else {
      return true
    }
  }


  getListCountryLabelList(id) {
    this._CommonService.COUNTRY_LABEL_CHANGE(id).subscribe(resp => {
      if (resp.Code === UIConstant.THOUSAND && resp.Data.length > 0) {
        this.TinNoValue = resp.Data[0].TinNo
        this.PanNoValue = resp.Data[0].PanNo
        this.GstinNoValue = resp.Data[0].GstinNo
        this.CinNoValue = resp.Data[0].CinNo
        this.FssiNoValue = resp.Data[0].FssiNo
      }
    })
  }
  TinNoValue: any
  PanNoValue: any
  GstinNoValue: any
  CinNoValue: any
  FssiNoValue: any
  pressEnterEmailadd(e: KeyboardEvent) {
    this.addEmailDetail()
  }

  pressEnterMobileAdd(e: KeyboardEvent) {
    this.addConatctDetails()
    setTimeout(() => {
      this.select_email.selector.nativeElement.focus()
    }, 10)
  }
  countryValue1: any = null
  stateValuedata1: any = null
  countryCodeFlag: any = null

  @ViewChild('addNewCityRef') addNewCityRefModel: AddNewCityComponent


  addCityClosed(selectedIds?) {
    if (selectedIds !== undefined) {
      if (this.countryValue !== null && Number(this.countryValue) !== selectedIds.countryId) {
        this.countryValue = selectedIds.countryId
        this.stateValue = selectedIds.stateId
        this.cityValue = selectedIds.cityId;
      } else if (this.stateValue !== null && Number(this.stateValue) !== selectedIds.stateId) {
        this.stateValue = selectedIds.stateId
        this.cityValue = selectedIds.cityId;
      } else {
        this.cityValue = selectedIds.cityId;
        this.cityValue = selectedIds.cityId
        this.getCitylist(selectedIds.stateId, 0)
      }
    } else {
      this.cityValue = null
    }
  }
  yesConfirmationClose() {
    $('#close_confirm_customer').modal(UIConstant.MODEL_HIDE)
    this.onloadingCustomerForm()
    this._CommonService.closeCust('')
  }
  closeConfirmation() {
    $('#close_confirm_customer').modal(UIConstant.MODEL_SHOW)
  }
}
