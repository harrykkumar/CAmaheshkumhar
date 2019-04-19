import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
/* Created by Bharat */

import { Component, OnInit, Input,NgModule , OnChanges, SimpleChanges, OnDestroy, Output,  EventEmitter, ViewChild } from '@angular/core'
import { UIConstant } from 'src/app/shared/constants/ui-constant'
import { Subject } from 'rxjs'
import { takeUntil, map } from 'rxjs/operators'
import * as _ from 'lodash'
import { OrganisationProfileService } from './organisation-profile.service'
import { ToastrCustomService } from 'src/app/commonServices/toastr.service'
declare var $: any
declare const flatpickr: any

@Component({
  selector: 'app-organisation-profile',
  templateUrl: './organisation-profile.component.html',
  styleUrls: ['./organisation-profile.component.css']
})
export class OrganisationProfileComponent implements OnInit, OnChanges {
  @ViewChild('mobileDetailModel') mobileDetailModel
  @ViewChild('emailDetailModel') emailDetailModel
  @ViewChild('bankFormModel') bankFormModel
  @ViewChild('addressFormModel') addressFormModel
  @ViewChild('keyPersonFormModel') keyPersonFormModel
  @ViewChild('orgProfileFormModel') orgProfileFormModel
  @Input() openProfile: any
  @Output() closeProfile = new EventEmitter<any>()
  private unSubscribe$ = new Subject<void>()
  emailDetail: any = {}
  mobileDetail: any = {}
  editEmailDetailIndex: number = null
  editMobileDetailIndex: number = null
  keyPersonTypeList: Array<any> = []
  industryTypeList: Array<any> = []
  registrationTypeList: Array<any> = []
  mobileTypeList: Array<any> = []
  mobileCountryCodeList: Array<any> = []
  personalDetail: any = {}
  keyPersonDetail: any = {}
  emailTypeList: Array<any> = []
  countryList: Array<any> = []
  stateList: Array<any> = []
  cityList: Array<any> = []
  areaList: Array<any> = []
  addressTypeList: Array<any> = []
  addressDetail: any = {}
  addressDetailArray: Array<any> = []
  editAddressDetailIndex: number = null
  bankDetail: any = {}
  bankDetailArray: Array<any> = []
  editBankDetailIndex: number = null
  keyPersonDetailArray: Array<any> = []
  editKeyPersonDetailIndex: number = null
  statutoryDetail: any = {}
  accMethodList: Array<any> = []

  constructor (
    private _orgService: OrganisationProfileService,
    private toastrService: ToastrCustomService,
    public _commonService: CommonService
  ) {
  }

  /* Function invoke when profile menu clicked  */
  ngOnChanges (changes: SimpleChanges): void {
    if (this.openProfile.profileOpen === true) {
      $('#organisationModal').modal(UIConstant.MODEL_SHOW)
      this.initDateFormat()
      this.initDropDownData()
    } else {
      $('#organisationModal').modal(UIConstant.MODEL_HIDE)
    }
  }

  // tslint:disable-next-line:no-empty
  ngOnInit () {
  }

  /* Function to initialise flatpicker date format */
  initDateFormat = () => {
    jQuery(function ($) {
      flatpickr('.dor', {
        maxDate: 'today',
        dateFormat: 'd M y'
      })
    })
  }

  /* Function to initialise dropdown list data */
  initDropDownData = () => {
    this.personalDetail.mobileArray = []
    this.personalDetail.emailArray = []
    this.stateList = [{ id: UIConstant.ZERO, text: 'Select State' }]
    this.cityList = [{ id: UIConstant.ZERO, text: 'Select City' }]
    this.areaList = [{ id: UIConstant.ZERO, text: 'Select Area' }]
    this.addressTypeList = this._orgService.getAddressTypeList()
    this.addressDetail.selectedAddressType = 2
    this.registrationTypeList = this._orgService.getRegistrationTypeList()
    this.personalDetail.selectedRegistrationType = 1
    this.getMobileCountryCodeList()
    this.getIndustryTypeList()
    this.getKeyPersonTypeList()
    this.getCountryList()
    this.getAccountingMethod()
    this.getMobileTypeList()
    this.getEmailTypeList()
    this.initPersonalDetail()
    if (this.openProfile.editMode) {
      this.getOrgProfileData()
    }
  }

  /* Function invoke on key person type selection change and assign new value */
  onKeyPersonTypeSelectionChange = (event) => {
    if (event.data.length > 0) {
      this.keyPersonDetail.selectedKeyPersonType = event.data[0]
    }
  }

  /* Function invoke on industry type selection change and assign new value */
  onIndustryTypeSelectionChange = (event) => {
    if (Number(event.value) >= UIConstant.ZERO) {
      this.personalDetail.selectedIndustryType = Number(event.value)
    }
  }

  /* Function invoke on registration type selection change and assign new value */
  onRegistrationTypeSelectionChange = (event) => {
    if (Number(event.value) >= UIConstant.ZERO) {
      this.personalDetail.selectedRegistrationType = Number(event.value)
    }
  }

  /* Function invoke on country dropdown selection change */
  onCountrySelectionChange = (event) => {
    if (event.data.length > 0) {
      this.addressDetail.selectedCountry = event.data[0]
    }
    if (this.editAddressDetailIndex === null && this.addressDetail.selectedCountry && this.addressDetail.selectedCountry.id > UIConstant.ZERO) {
      this.getStateList(this.addressDetail.selectedCountry.id)
    }
  }

  /* Function invoke on state dropdown selection change */
  onStateSelectionChange = (event) => {
    if (event.data.length > 0) {
      this.addressDetail.selectedState = event.data[0]
    }
    if (this.editAddressDetailIndex === null && this.addressDetail.selectedState && this.addressDetail.selectedState.id > UIConstant.ZERO) {
      this.getCityList(this.addressDetail.selectedState.id)
    }
  }

  /* Function invoke on city dropdown selection change and assign new value */
  onCitySelectionChange = (event) => {
    if (event.data.length > 0) {
      this.addressDetail.selectedCity = event.data[0]
    }
    if (this.editAddressDetailIndex === null && this.addressDetail.selectedCity && this.addressDetail.selectedCity.id > UIConstant.ZERO) {
      this.getAreaList(this.addressDetail.selectedCity.id)
    }
  }

  /* Function invoke on area dropdown selection change and assign new value */
  onAreaSelectionChange = (event) => {
    if (event.data.length > 0) {
      this.addressDetail.selectedArea = event.data[0]
    }
  }

  /* Function invoke on addresstype selection change */
  onAddressTypeChange = (event) => {
    if (Number(event.value) >= UIConstant.ZERO) {
      this.addressDetail.selectedAddressType = Number(event.value)
    }
  }

  /* Function invoke on key person contact country code selection change */
  onKeyPersonMobileCountryCodeChange = (event) => {
    if (event.data.length > 0) {
      this.keyPersonDetail.keyPersonMobileCountryCode = event.data[0]
    }
  }

  /* Function invoke on accounting method type selection change  */
  onAccMethodTypeChange = (event) => {
    if (event.data.length > 0) {
      this.statutoryDetail.accMethod = event.value
    }
  }

  /* Function invoke on click of close profile icon
      will close the dialog box and reset data */
  emitCloseProfile () {
    this.closeProfile.emit()
    this.resetFormData()
  }

  /* Function to get all the country list for dropdown */
  getCountryList = () => {
    this._orgService.getCountryList().
      pipe(
        takeUntil(this.unSubscribe$)
      ).
      subscribe((response: any) => {
        this.countryList = [...response]
      }, error => console.log(error))
  }

  /* Function to get all the state list */
  getStateList = (countryCode) => {
    this._orgService.getStateList(countryCode).
    pipe(
      takeUntil(this.unSubscribe$)
    ).
    subscribe((response: any) => {
      this.stateList = [...this.stateList, ...response]
    }, error => console.log(error))
  }

  /* Function to get all the city list  */
  getCityList = (stateCode) => {
    this._orgService.getCityList(stateCode).
      pipe(
        takeUntil(this.unSubscribe$)
      ).
      subscribe((response: any) => {
        this.cityList = [...this.cityList, ...response]
      }, error => console.log(error))
  }

  /* Function to get all the area list  */
  getAreaList = (cityCode) => {
    this._orgService.getAreaList(cityCode).
      pipe(
        takeUntil(this.unSubscribe$)
      ).
      subscribe((response: any) => {
        this.areaList = [...this.areaList, ...response]
      }, error => console.log(error))
  }

  /* Function to get all the industry type list  */
  getIndustryTypeList = () => {
    this._orgService.getIndustryTypeList().
      pipe(
        takeUntil(this.unSubscribe$)
      ).
      subscribe((response: any) => {
        this.industryTypeList = [...response]
      }, error => console.log(error))
  }

  /* Function to get all the key person type list */
  getKeyPersonTypeList = () => {
    this._orgService.getKeyPersonTypeList().
      pipe(
        takeUntil(this.unSubscribe$)
      ).
      subscribe((response: any) => {
        this.keyPersonTypeList = [...response]
      }, error => console.log(error))
  }

  /* Function to get all accounting method type list */
  getAccountingMethod = () => {
    this._orgService.getAccountingMethod().
      pipe(
        takeUntil(this.unSubscribe$)
      ).
      subscribe((response: any) => {
        this.accMethodList = [...response]
      }, error => console.log(error))
  }

  /* Function to initialise personal detail */
  initPersonalDetail = () => {
    this.personalDetail = {
      mobileArray: [{
        selectedMobileType: 1, selectedMobileCountryCode: UIConstant.ZERO, mobileNo: ''
      }],
      emailArray: [{
        selectedEmailType: 2, selectedEmail: ''
      }]
    }
  }

  /* Function to reset all the form data fields on close of profile */
  resetFormData = () => {
    this.addressDetail = {}
    this.addressDetailArray = []
    this.keyPersonDetail = {}
    this.keyPersonTypeList = []
    this.keyPersonDetailArray = []
    this.personalDetail = {}
    this.bankDetail = {}
    this.bankDetailArray = []
    this.statutoryDetail = {}
    this.industryTypeList = []
    this.registrationTypeList = []
    this.mobileTypeList = []
    this.mobileCountryCodeList = []
    this.emailTypeList = []
    this.countryList = []
    this.stateList = []
    this.cityList = []
    this.areaList = []
    this.addressTypeList = []
    this.addressDetailArray = []
    this.accMethodList = []
    this.editAddressDetailIndex = null
    this.editBankDetailIndex = null
    this.editKeyPersonDetailIndex = null
    this.orgProfileFormModel.submitted = false
    this.unSubscribe$.next()
    this.unSubscribe$.complete()
  }

  /* Function to add new bank details */
  addNewbankDetail = () => {
    if (this.editBankDetailIndex !== null) {
      this.bankDetailArray[this.editBankDetailIndex] = { ...this.bankDetail }
      this.editBankDetailIndex = null
    } else {
      this.bankDetailArray = [...this.bankDetailArray, this.bankDetail]
    }
    this.bankDetail = {}
    this.bankFormModel.submitted = false
  }

  /* Function to edit existing bank details */
  editBankData = (i) => {
    this.bankDetail = { ...this.bankDetailArray[i] }
    this.editBankDetailIndex = i
  }

  /* Function to remove existing bank details */
  removeBankDetail = (i) => {
    this.bankDetailArray.splice(i,1)
  }

  /* Function to add new address details */
  addNewAddress = () => {
    if (this.editAddressDetailIndex !== null) {
      this.addressDetailArray[this.editAddressDetailIndex] = { ...this.addressDetail }
      this.editAddressDetailIndex = null
    } else {
      this.addressDetailArray = [...this.addressDetailArray, this.addressDetail]
    }
    this.addressDetail = {}
    this.addressFormModel.submitted = false
  }

  /* Function to edit existing address details */
  editAddress = (i) => {
    this.addressDetail = { ...this.addressDetailArray[i] }
    this.editAddressDetailIndex = i
  }

  /* Function to remove existing address details */
  removeAdress = (i) => {
    this.addressDetailArray.splice(i,1)
  }

  /* Function to add new key person details */
  addNewKeyPerson = () => {
    if (this.editKeyPersonDetailIndex !== null) {
      this.keyPersonDetailArray[this.editKeyPersonDetailIndex] = { ...this.keyPersonDetail }
      this.editKeyPersonDetailIndex = null
    } else {
      this.keyPersonDetailArray = [...this.keyPersonDetailArray, this.keyPersonDetail]
    }
    this.keyPersonDetail = {}
    this.keyPersonFormModel.submitted = false
  }

  /* Function to edit existing key person details  */
  editKeyPerson = (i) => {
    this.keyPersonDetail = { ...this.keyPersonDetailArray[i] }
    this.editKeyPersonDetailIndex = i
  }

  /* Function to remove existing key person details */
  removeKeyPerson = (i) => {
    if (this.keyPersonDetailArray[i].isActive === true) {
      this.keyPersonDetailArray[i].isActive = false
    } else {
      this.keyPersonDetailArray.splice(i, 1)
    }
  }

    /* Function to assign mobile type list  */
  getMobileTypeList = () => {
    this.mobileTypeList = this._orgService.getMobileTypeList()
    this.mobileDetail.selectedMobileType = 1
  }

  /* Funtion to get all the mobile country code list  */
  getMobileCountryCodeList = () => {
    this._orgService.getMobileCountryCodeList().
      pipe(
        takeUntil(this.unSubscribe$)
      ).
      subscribe((response: any) => {
        this.mobileCountryCodeList = [...response]
      }, error => console.log(error))
  }

  /* Function invoke on coutnry code selection change */
  onCountryCodeSelectionChange = (event) => {
    if (event.data.length > 0) {
      this.mobileDetail.selectedMobileCountryCode = event.data[0]
    }
  }

  /* Function to add new mobile details */
  addNewMobileDetail = () => {
    if (this.editMobileDetailIndex !== null && this.editMobileDetailIndex >= 0) {
      this.personalDetail.mobileArray[this.editMobileDetailIndex] = { ...this.mobileDetail }
      this.editMobileDetailIndex = null
    } else {
      this.personalDetail.mobileArray =
        [...this.personalDetail.mobileArray, this.mobileDetail]
    }
    this.mobileDetail = {
      selectedMobileType: 1,
      selectedMobileCountryCode:
        { id: UIConstant.ZERO, text: 'Select Country Code' },
      mobileNo: ''
    }
    this.mobileDetailModel.submitted = false
  }

  /* Function to edit mobile details */
  editMobileDetail = (index) => {
    this.mobileDetail = { ...this.personalDetail.mobileArray[index] }
    this.editMobileDetailIndex = index
  }

   /* Function to remove mobile detail */
  removeMobileDetail = (index) => {
    this.personalDetail.mobileArray.splice(index, 1)
  }

    /* Function to validate mobile detail */
    validateMobileDetail = () => {
      let valid = true
      if (this.mobileDetail.selectedMobileCountryCode && Number(this.mobileDetail.selectedMobileCountryCode.id) === 0) {
        valid = false
      }
      return valid
    }
  
    /* Function to validate key person details */
    validateKeyPersonDetail = () => {
      let valid = true
      if (this.keyPersonDetail.keyPersonMobileCountryCode && Number(this.keyPersonDetail.keyPersonMobileCountryCode.id) === 0) {
        valid = false
      }
      if (this.keyPersonDetail.selectedKeyPersonType && Number(this.keyPersonDetail.selectedKeyPersonType.id) === 0) {
        valid = false
      }
      return valid
    }
  
    /* Function to validate address details */
    validateAddressDetail = () => {
      let valid = true
      if (this.addressDetail.selectedCountry && Number(this.addressDetail.selectedCountry.id) === 0) {
        valid = false
      }
      if (this.addressDetail.selectedState && Number(this.addressDetail.selectedState.id) === 0) {
        valid = false
      }
      if (this.addressDetail.selectedCity && Number(this.addressDetail.selectedCity.id) === 0) {
        valid = false
      }
      if (this.addressDetail.selectedAddressType && Number(this.addressDetail.selectedAddressType.id) === 0) {
        valid = false
      }
      return valid
    }

  /* Function to get all the email type list */
  getEmailTypeList = () => {
    this.emailTypeList = this._orgService.getEmailTypeList()
    this.emailDetail.selectedEmailType = 1
  }

/* Function to add new email details */
  addNewEmailDetail = () => {
    if (this.editEmailDetailIndex !== null && this.editEmailDetailIndex >= 0) {
      this.personalDetail.emailArray[this.editEmailDetailIndex] = { ...this.emailDetail }
      this.editEmailDetailIndex = null
    } else {
      this.personalDetail.emailArray =
        [...this.personalDetail.emailArray, this.emailDetail]
    }
    this.emailDetail = {
      selectedEmailType: 1,
      selectedEmail: ''
    }
    this.emailDetailModel.submitted = false
  }

  /* Function to edit email detail */
  editEmailDetail = (index) => {
    this.emailDetail = { ...this.personalDetail.emailArray[index] }
    this.editEmailDetailIndex = index
  }

  /* Function to remove email detail */
  removeEmailDetail = (index) => {
    this.personalDetail.emailArray.splice(index, 1)
  }

  /* Function to prepare prepare the request payload data for post */
  prepareSavePayload = () => {
    const addressArray = _.map(this.addressDetailArray, (address) => {
      return {
        Id: address.id ? address.id : 0,
        AddressValue: address.address,
        AddressType: address.selectedAddressType,
        CountryId: address.selectedCountry.id,
        StateId: address.selectedState.id,
        CityId: address.selectedCity.id,
        AreaId: address.selectedArea.id,
        PostCode: address.postalCode,
        ParentTypeId: 3
      }
    })

    const contactArray = _.map(this.personalDetail.mobileArray, (mobile) => {
      return {
        Id: mobile.id ? mobile.id : 0,
        ContactNo: mobile.mobileNo,
        ContactType: mobile.selectedMobileType,
        CountryCode: mobile.selectedMobileCountryCode.id,
        ParentTypeId: 3
      }
    })

    const emailArray = _.map(this.personalDetail.emailArray, (email) => {
      return {
        Id: email.id ? email.id : 0,
        EmailAddress: email.selectedEmail,
        EmailType: email.selectedEmailType,
        ParentTypeId: 3
      }
    })

    const bankArray = _.map(this.bankDetailArray, (item) => {
      return {
        Id: item.id ? item.id : 0,
        Name: item.name,
        Branch: item.branch,
        AcNo: item.accountNumber,
        ParentTypeId: 5,
        Ifsccode: item.ifscCode,
        MicrNo: item.micrNo
      }
    })

    const websiteArray = [
      {
        Id: 0,
        Name: 'www.san.com',
        Type: 1,
        ParentTypeId: 3
      },
      {
        Id: 0,
        Name: 'www.tlinfo.com',
        Type: 1,
        ParentTypeId: 3
      }
    ]

    const statutoriesArray = [
      {
        Id: this.statutoryDetail.id ? this.statutoryDetail.id : 0,
        PanNo: this.statutoryDetail.panNo,
        GSTinNo: this.statutoryDetail.gstNo,
        CinNo: this.statutoryDetail.cinNo,
        TinNo: this.statutoryDetail.tinNo,
        FssiNo: this.statutoryDetail.fassiNo,
        ParentTypeId: 3
      }
    ]

    const keyPersonArray = _.map(this.keyPersonDetailArray, (item) => {
      if (item.isActive !== false && item.isActive !== true) {
        item.isActive = true
      }
      return {
        IsActive: item.isActive,
        Id: item.id ? item.id : 0,
        Name: item.keyPerson,
        ParentTypeId: 3,
        TypeId: item.selectedKeyPersonType.id,
        PanNo: item.panNo,
        ContactNo: item.contactNo,
        CountryCode: item.keyPersonMobileCountryCode.id,
        ContactType: 1,
        EmailAddress: item.email,
        EmailType: 1,
        IdEmail: item.idEmail ? item.idEmail : 0 ,
        IdContact: item.idContact ? item.idContact : 0
      }
    })

    return {
      Id: this.personalDetail.id ? this.personalDetail.id : 0,
      Name: this.personalDetail.companyName,
      IndustryType: this.personalDetail.selectedIndustryType,
      RegistrationDate: this.personalDetail.registrationDate,
      RegistrationType: this.personalDetail.selectedRegistrationType,
      AccountingMethod: this.statutoryDetail.accMethod,
      Addresses: addressArray,
      ContactInfos: contactArray,
      Emails: emailArray,
      Websites: websiteArray,
      ContactPersons: keyPersonArray,
      Statutories: statutoriesArray,
      Banks: bankArray
    }
  }

  /* Function to save the profile */
  saveOrgProfile = () => {
    const data = this.prepareSavePayload()
    this._orgService.saveOrgProfile(data).subscribe(
      (Data: any) => {
        if (Data.Code === UIConstant.THOUSAND) {
          this.toastrService.showSuccess('Success', 'Saved Successfully')
          this.emitCloseProfile()
        }
      }, error => {
      console.log(error)
      this.toastrService.showError('Error', 'error in profile save')
    }
    )
  }

  /* Function to get existing profile data */
  getOrgProfileData = () => {
    this._orgService.getOrgProfile().subscribe(
      (Data: any) => {
        if (Data.Code === UIConstant.THOUSAND) {
          this.initFormData(Data.Data)
        }
      }, error => console.log(error)
    )
  }

  /* Function to initialise all form fields by profile data */
  initFormData = (profileData) => {
    this.addressDetailArray = _.map(profileData.Addressesdetail, (item) => {
      return {
        id: item.Id,
        postalCode: item.PostCode,
        address: item.AddressValue,
        selectedAddressType: item.AddressType,
        selectedCountry: {
          id: item.CountryId,
          text: item.CountryName
        },
        selectedState: {
          id: item.StateId,
          text: item.Statename
        },
        selectedCity: {
          id: item.CityId,
          text: item.CityName
        },
        selectedArea: {
          id: item.AreaId,
          text: item.AreaName
        }
      }
    })

    this.bankDetailArray = _.map(profileData.Banks, (item) => {
      return {
        id: item.Id,
        name: item.Name,
        accountNumber: item.AcNo,
        branch: item.Branch,
        ifscCode: item.IfscCode,
        micrNo: item.MicrNo
      }
    })

    const statutory = profileData.Statutories[0]
    if (statutory) {
      this.statutoryDetail = {
        id: statutory.Id,
        tinNo: statutory.TinNo,
        panNo: statutory.PanNo,
        gstNo: statutory.GstinNo,
        cinNo: statutory.CinNo,
        fassiNo: statutory.FssiNo,
        accMethod: statutory.TinNo
      }
    }

    const emailArray = _.map(profileData.Emails, (item) => {
      return {
        id: item.Id,
        selectedEmailType: item.EmailType,
        selectedEmail: item.EmailAddress
      }
    })

    const mobileArray = _.map(profileData.ContactInfo, (item) => {
      return {
        id: item.Id,
        selectedMobileType: item.ContactType,
        selectedMobileCountryCode: {
          id: item.CountryCode === null ? 0 : item.CountryCode
        },
        mobileNo: item.ContactNo
      }
    })
    const orgData = profileData.OrganisationProfiles[0]
    if (orgData) {
      this.personalDetail = {
        id: orgData.Id,
        mobileArray: [...mobileArray],
        emailArray: [...emailArray],
        companyName: orgData.Name,
        selectedIndustryType: orgData.IndustryType ? orgData.IndustryType : UIConstant.ZERO,
        selectedRegistrationType: orgData.GstnTypeId ? orgData.GstnTypeId : UIConstant.ZERO,
        registrationDate: orgData.RegistrationDate
      }
    }

    this.keyPersonDetailArray = _.map(profileData.ContactPersonsBrief, (item) => {
      if (item.IsActive === true) {
        return {
          isActive: item.IsActive,
          id: item.Id,
          keyPerson: item.Name,
          contactNo: item.ContactNo,
          selectedKeyPersonType: {
            id: item.TypeId,
            text: item.TypeName
          },
          keyPersonMobileCountryCode: {
            id: item.CountryCode === null ? 0 : item.CountryCode
          },
          panNo: item.PanNo,
          idEmail: item.IdEmail,
          idContact: item.IdContact
        }
      }
    })
  }

   /* validating form fields on saving profile data */
  validateForm = () => {
    let valid = true
    if (Number(this.personalDetail.selectedIndustryType) === 0) {
      valid = false
    }
    if (Number(this.personalDetail.selectedRegistrationType) === 0) {
      valid = false
    }
    if (this.personalDetail.mobileArray.length === 0) {
      valid = false
    }
    if (this.personalDetail.emailArray.length === 0) {
      valid = false
    }
    return valid
  }

}
