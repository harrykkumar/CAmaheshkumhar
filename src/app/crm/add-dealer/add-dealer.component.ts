import { NgForm } from '@angular/forms';
import { ToastrCustomService } from 'src/app/commonServices/toastr.service';
import { ApiConstant } from 'src/app/shared/constants/api';
import { BaseServices } from 'src/app/commonServices/base-services';
import { UIConstant } from './../../shared/constants/ui-constant';
import { VendorServices } from './../../commonServices/TransactionMaster/vendoer-master.services';
import { CompanyProfileService } from './../../start/company-profile/company-profile.service';
import { CommonService } from './../../commonServices/commanmaster/common.services';
import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-add-dealer',
  templateUrl: './add-dealer.component.html',
  styleUrls: ['./add-dealer.component.css']
})
export class AddDealerComponent implements OnInit {
  @Output() closeModal = new EventEmitter();
  @ViewChild('addressForm') addressFormControl: NgForm
  @ViewChild('addContactTypeForm') addContactTypeFormControl: NgForm
  @ViewChild('addEmailForm') addEmailFormControl: NgForm
  contactTypeData: Array<any> = []
  mobileCountryCodeList: Array<any> = []
  dealerName: string
  dealerShortName:string
  contactType: number
  countryCodeId: number
  contactNo: any
  currentContactLength: number
  contactEditIndex: number = null
  mobileArray: Array<any> = []
  emailTypeData: Array<any> = []
  emailType: number
  emailAddress: string
  emailArray: Array<any> = []
  editEmailIndex: number = null
  countryList: Array<any> = [];
  stateList: Array<any> = [];
  cityList: Array<any> = [];
  areaList: Array<any> = [];
  addressTypeList: Array<any> = [];
  countryId: number;
  stateId: number;
  cityId: number;
  areaId: number;
  addressTypeId: number;
  address: string;
  postalCode: number
  editAddressIndex: number = null
  addressArray: Array<any> = []
  registrationTypeList: Array<any> = []
  registrationType: number;
  validGSTNumber: boolean = false;
  gstNo: any
  panNo: any
  validPANFlag: boolean = false;
  dealerEditId: any;
  statutoryEditId: any;
  constructor(
    public commonService: CommonService,
    private _orgService: CompanyProfileService,
    private _vendorService: VendorServices,
    private baseService: BaseServices,
    private toaster: ToastrCustomService
  ) {

  }

  ngOnInit() {
    this.getMobileCountryCodeList();
    this.getContactTypeData()
    this.getEmailTypeData()
    this.getRegistrationTypeList()
    this.getCountryList()
  }

  getContactTypeData() {
    const data =  [
      { id: '1', text: 'Work' },
      { id: '2', text: 'Home' },
      { id: '3', text: 'Mobile' },
      { id: '4', text: 'Fax' },
      { id: '5', text: 'Skype' },
      { id: '6', text: 'YMessenger' },
      { id: '7', text: 'Sip' },
      { id: '8', text: 'Other' },
    ]
    this.contactTypeData =  [...data]
  }

  getEmailTypeData() {
    const data =  [
      { id: '1', text: 'Personal' },
      { id: '2', text: 'Work' },
      { id: '3', text: 'Home' },
      { id: '4', text: 'Other' }
    ]
    this.emailTypeData = [...data]
  }

  getRegistrationTypeList() {
    const data = [
      { id: '1', text: 'Regular' },
      { id: '2', text: 'Composition' },
      { id: '3', text: 'Exempted' },
      { id: '4', text: 'UnRegistered' },
      { id: '5', text: '	E-Commerce Operator ' }
    ]
    this.registrationTypeList = [...data]
  }

  getCountryList() {
    this._vendorService.getCommonValues('101').subscribe((res) => {
      if (res.Code === UIConstant.THOUSAND && !_.isEmpty(res.Data)) {
        this.countryList = [...res.Data];
        // this.countryId = 123
        // this.getStateList(123);
      }
    })
  }

  getStateList(countryCode, item?) {
    if (countryCode) {
      this._vendorService.gatStateList(countryCode).subscribe((res) => {
        if (res.Code === UIConstant.THOUSAND && !_.isEmpty(res.Data)) {
          this.stateList = [...res.Data];
          if (!_.isEmpty(item)) {
            this.stateId = Number(item.StateId)
            this.getCityList(this.stateId, item);
          }
        }
      })
    }
  }

  getCityList(stateCode, item?) {
    if (stateCode) {
      this._vendorService.getCityList(stateCode).subscribe((res) => {
        if (res.Code === UIConstant.THOUSAND && !_.isEmpty(res.Data)) {
          console.log(res.Data)
          this.cityList = [...res.Data];
          if (!_.isEmpty(item)) {
            this.cityId = Number(item.CityId)
            this.getAreaList(this.cityId, item);
          }
        }
      })
    }
  }

  getAreaList(cityCode, item?) {
    if (+cityCode === -1) {
      const data = {
        countryList: !_.isEmpty(this.countryList) ?  [...this.countryList] : [],
        stateList: !_.isEmpty(this.stateList)  ? [...this.stateList] : [],
        countryId: (this.countryId) ? this.countryId : 0,
        stateId: (this.stateId) ? this.stateId : 0
      }
    } else {
      if (cityCode > 0) {
        this._vendorService.getAreaList(cityCode).subscribe((res) => {
          if (res.Code === UIConstant.THOUSAND && !_.isEmpty(res.Data)) {
            this.areaList = [...res.Data];
            if (!_.isEmpty(item)) {
              this.areaId = Number(item.AreaId);
            }
          }
        })
      }
    }
  }

  getAddressTypeList() {
    this._vendorService.getCommonValues('166').subscribe((res) => {
      if (res.Code === UIConstant.THOUSAND && !_.isEmpty(res.Data)) {
        this.addressTypeList = [...res.Data];
      }
    })
  }

  openModal(item?) {
    if(!this.commonService.isEmpty(item)){
      this.assignFormData(item);
    }
    this.commonService.openModal('dealer_form');
    setTimeout(() => {
      $('#dealerNameId').focus()
    }, 300);
  }

  closePopUp(){
    this.commonService.closeModal('dealer_form')
    this.closeModal.emit();
  }

  assignFormData(item) {
    const query = {
      Id: item.Id
    }
    this.commonService.getRequest(ApiConstant.DEALER_EDIT_DETAILS, query).subscribe((res) => {
      if(res.Code === 1000  && !this.commonService.isEmpty(res.Data)){
        if (!this.commonService.isEmpty(res.Data.LedgerDetails)) {
          this.dealerEditId = res.Data.LedgerDetails[0].Id
          this.dealerName = res.Data.LedgerDetails[0].Name
          this.dealerShortName = res.Data.LedgerDetails[0].ShortName
          this.registrationType = res.Data.LedgerDetails[0].TaxTypeId
        }
        if(!this.commonService.isEmpty(res.Data.Addresses)){
          this.addressArray = _.map(res.Data.Addresses, (item) => {
            return {
              id: item.Id,
              countryId: item.CountryId,
              countryName: item.CountryName,
              stateId: item.StateId,
              stateName: item.Statename,
              cityId: item.CityId,
              cityName: item.CityName,
              areaId: item.AreaId,
              areaName: item.AreaName,
              addressTypeId: item.AddressType,
              addressTypeName: item.AddressTypeName,
              postalCode: item.PostCode,
              address: item.AddressValue
            }
          })
        }
        if(!this.commonService.isEmpty(res.Data.Emails)){
          this.emailArray = _.map(res.Data.Emails, (item) => {
            return {
              id: item.Id,
              emailType: item.EmailType,
              emailTypeName: item.EmailTypeName,
              email: item.EmailAddress
            }
          })
        }
        if(!this.commonService.isEmpty(res.Data.ContactInfo)){
          this.mobileArray = _.map(res.Data.ContactInfo, (item) => {
            return {
              id: item.Id,
              contactType: item.ContactType,
              contactTypeName: item.ContactTypeName,
              countryCode: item.CountryCode,
              contactNo: item.ContactNo
            }
          })
        }
        if(!this.commonService.isEmpty(res.Data.Statutories)){
          const data = {...res.Data.Statutories[0]}
          this.panNo = data.PanNo
          this.gstNo = data.GstinNo
          this.statutoryEditId = data.Id
        }
      }
    })
  }


  getMobileCountryCodeList = () => {
    this._orgService.getMobileCountryCodeList().
      subscribe((response: any) => {
        this.mobileCountryCodeList = [...response]
        const orgAddress = JSON.parse(localStorage.getItem('ORGNIZATIONADDRESS'));
        if (!this.commonService.isEmpty(orgAddress)) {
          const obj = _.find(this.mobileCountryCodeList, { phoneCode: orgAddress.CountryCode })
          if (!_.isEmpty(obj)) {
            this.countryCodeId = obj.id
            this.setCurrentMobileNoLength()
          }
        }
      }, error => console.log(error))
  }

  setCurrentMobileNoLength() {
    if (this.countryCodeId) {
      const index = _.findIndex(this.mobileCountryCodeList, { id: this.countryCodeId })
      if (index !== -1) {
        this.currentContactLength = this.mobileCountryCodeList[index].contactLength
      }
    }
  }

  addConatctDetails() {
    const currentContactType = _.find(this.contactTypeData, { id: this.contactType })
    const data = {
      id: this.contactEditIndex !== null ? this.mobileArray[this.contactEditIndex].id : 0,
      contactType: this.contactType,
      contactTypeName: this.commonService.isEmpty(currentContactType) ? '' : currentContactType.text,
      countryCode: this.countryCodeId,
      contactNo: this.contactNo
    }
    if (this.contactEditIndex !== null) {
      this.mobileArray[this.contactEditIndex] = { ...data }
      this.contactEditIndex = null
    } else {
      this.mobileArray.push({ ...data })
    }
    setTimeout(() => {
      this.addContactTypeFormControl.resetForm();
    }, 100);
  }

  editContactDetails(index) {
    this.contactEditIndex = index;
    this.contactNo = this.mobileArray[index].contactNo
    this.countryCodeId = this.mobileArray[index].countryCode
    this.contactType = this.mobileArray[index].contactType
  }

  deleteContact(index) {
    this.mobileArray.splice(index, 1)
  }

  addEmail() {
    const currentEmailType = _.find(this.emailTypeData, { id: this.emailType })
    const data = {
      id: this.editEmailIndex !== null ? this.emailArray[this.editEmailIndex].id : 0,
      emailType: this.emailType,
      emailTypeName: this.commonService.isEmpty(currentEmailType) ? '' : currentEmailType.text,
      email: this.emailAddress
    }
    if (this.editEmailIndex !== null) {
      this.emailArray[this.editEmailIndex] = { ...data }
      this.editEmailIndex = null
    } else {
      this.emailArray.push({ ...data })
    }
    setTimeout(() => {
      this.addEmailFormControl.resetForm();
    }, 100);
  }

  editEmail(index) {
    this.editEmailIndex = index;
    this.emailType = this.emailArray[index].emailType
    this.emailAddress = this.emailArray[index].email
  }

  deleteEmail(index) {
    this.emailArray.splice(index, 1)
  }

  addAddress() {
    const currentCountry = _.find(this.countryList, { Id: this.countryId })
    const currentState = _.find(this.stateList, { Id: this.stateId })
    const currentCity = _.find(this.cityList, { Id: this.cityId })
    const currentArea = _.find(this.areaList, { id: this.areaId })
    const currentAddressType = _.find(this.addressTypeList, { UId: this.addressTypeId })
    const data = {
      id: this.editAddressIndex !== null ? this.addressArray[this.editAddressIndex].id : 0,
      countryId: this.countryId,
      countryName: this.commonService.isEmpty(currentCountry) ? '' : currentCountry.CommonDesc,
      stateId: this.stateId,
      stateName: this.commonService.isEmpty(currentState) ? '' : currentState.CommonDesc1,
      cityId: this.cityId,
      cityName: this.commonService.isEmpty(currentCity) ? '' : currentCity.CommonDesc2,
      areaId: this.areaId,
      areaName: this.commonService.isEmpty(currentArea) ? '' : currentArea.CommonDesc3,
      addressTypeId: this.addressTypeId,
      addressTypeName: this.commonService.isEmpty(currentAddressType) ? '' : currentAddressType.CommonDesc,
      postalCode: this.postalCode,
      address: this.address
    }
    if (this.editAddressIndex !== null) {
      this.addressArray[this.editAddressIndex] = { ...data }
      this.editAddressIndex = null
    } else {
      this.addressArray.push({ ...data })
    }
    setTimeout(() => {
      this.addressFormControl.resetForm();
    }, 100);
  }

  editAddress(index) {
    this.editAddressIndex = index;
    this.emailType = this.addressArray[index].emailType
    this.emailAddress = this.addressArray[index].email
  }

  deleteAddress(index) {
    this.addressArray.splice(index, 1)
  }

  checkGSTNumber(event) {
    this.gstNo = event.target.value;
    // const str = this.gstNo
    // const val = str.trim();
    // const gstInCode = val.substr(0, 2);
    // if (gstInCode !== '') {
    //   this.getStateCode(gstInCode)
    // }
    // this.matchStateCodeWithGSTNumber()
    this.checkGSTNumberValid()
  }
  checkGSTNumberValid() {
    if (this.gstNo !== '') {
      if (+this.registrationType === 1) {
        if (this.commonService.gstNumberRegxValidation((this.gstNo).toUpperCase())) {
          this.validGSTNumber = true
        } else {
          this.validGSTNumber = false
        }
      }
    } else {
      this.validGSTNumber = true
    }
  }

  // matchStateCodeWithGSTNumber() {
  //   if (this.GSTStateCode > 0 && this.GstinNoCode !== '') {
  //     if (this.GSTStateCode === this.GstinNoCode) {
  //       return true
  //     }
  //     else {
  //       return false
  //     }
  //   } else {
  //     return true
  //   }
  // }

  getStateCode = (stateCode) => {
    this.commonService.getStateByGStCode(stateCode).subscribe((response: any) => {
      if (response.Code === UIConstant.THOUSAND && response.Data.length > 0) {
        // this.countrId = response.Data[0].CommonId
        // this.stateId = response.Data[0].Id
        // this.countryValue =response.Data[0].CommonId
        // this.getOneState(response)
        // this.stateValue = response.Data[0].Id
      }
    })
  }
  panNumberRegxValidation(panNumber) {
    let regxPAN = /[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    return regxPAN.test(panNumber)
  }

  onInputCheckPANNumber(event) {
    const val = (event.target.value).toUpperCase()
    if (val !== '' && val !== null) {
      if (this.panNumberRegxValidation(val)) {
        this.validPANFlag = true
      } else {
        this.validPANFlag = false
      }
    } else {
      this.validPANFlag = true
    }
  }

  focusLoop(focusFieldArray){
    for (let i = 0; i < focusFieldArray.length; i++) {
      if (this.commonService.isEmpty(this[focusFieldArray[i].elementModal])) {
        if (focusFieldArray[i].type === 'input') {
          $(`#${focusFieldArray[i].elementId}`).focus()
        } else if (focusFieldArray[i].type === 'ng-select') {
          $(`#${focusFieldArray[i].elementId} input`).focus()
        }
        break;
      }
    }
    return true;
  }

  focusOnMandatoryField() {
    let focusFieldArray = [
      {
        elementId: 'dealerNameId',
        elementModal: 'dealerName',
        type: 'input'
      }
    ]
    if (this.registrationType) {
      focusFieldArray.push({
        elementId: 'gstInNoId',
        elementModal: 'gstNo',
        type: 'input'
      })
    }
    return this.focusLoop(focusFieldArray)
  }

  focusOnContactForm(){
    let focusFieldArray = [
      {
        elementId: 'contactTypeId',
        elementModal: 'contactType',
        type: 'ng-select'
      },
      {
        elementId: 'countryCodeElementId',
        elementModal: 'countryCodeId',
        type: 'ng-select'
      },
      {
        elementId: 'mobileId',
        elementModal: 'contactNo',
        type: 'input'
      }
    ]
    return this.focusLoop(focusFieldArray)
  }

  focusOnEmailForm() {
    let focusFieldArray = [
      {
        elementId: 'emailTypeElementId',
        elementModal: 'emailType',
        type: 'ng-select'
      },
      {
        elementId: 'emailAddressElementid',
        elementModal: 'emailAddress',
        type: 'input'
      }
    ]
    return this.focusLoop(focusFieldArray)
  }

  focusOnAddressForm() {
    let focusFieldArray = [
      {
        elementId: 'countryElementId',
        elementModal: 'countryId',
        type: 'ng-select'
      },
      {
        elementId: 'stateElementId',
        elementModal: 'stateId',
        type: 'ng-select'
      },
      {
        elementId: 'cityElementId',
        elementModal: 'cityId',
        type: 'ng-select'
      },
      {
        elementId: 'addressElementId',
        elementModal: 'address',
        type: 'input'
      }
    ]
    return this.focusLoop(focusFieldArray)
  }

  preparePaylod() {
    if (this.contactType && this.countryCodeId && this.contactNo) {
      this.addConatctDetails()
    }
    if (this.emailType && this.emailAddress) {
      this.addEmail()
    }
    if (this.countryId && this.stateId && this.cityId && this.address) {
      this.addAddress()
    }
    return {
      "Id": this.dealerEditId ? this.dealerEditId : 0,
      "Name": this.dealerName,
      "TaxTypeId": this.registrationType,
      "ShortName": this.commonService.isEmpty(this.dealerShortName) ? '' : this.dealerShortName,
      "Emails": _.map(this.emailArray, (item) => {
        return {
          "Id": item.id,
          "EmailAddress": item.email,
          "EmailType": item.emailType
        }
      }),
      "ContactInfos": _.map(this.mobileArray, (item) => {
        return {
          "Id": item.id,
          "ContactNo": item.contactNo,
          "CountryCode": item.countryCode,
          "ContactType": item.contactType
        }
      }),
      "Addresses": _.map(this.addressArray, (item) => {
        return {
          "Id": item.id,
          "CountryId": item.countryId,
          "StateId": item.stateId,
          "CityId": item.cityId,
          "AreaId": item.areaId,
          "AddressValue": item.address,
          "AddressType": item.addressTypeId
        }
      }),
      "Statutories": this.commonService.isEmpty(this.statutoryEditId) ? [] : [
        {
          "Id": !this.commonService.isEmpty(this.statutoryEditId) ? this.statutoryEditId : 0,
          "TaxTypeId": this.registrationType,
          "PanNo": this.panNo,
          "GstinNo": this.gstNo
        }
      ]
    }
  }

  submit() {
    this.baseService.postRequest(ApiConstant.DEALER_REGISTRATION, this.preparePaylod()).subscribe((res) => {
      if (res.Code === 1000) {
        this.toaster.showSuccess('Saved Success', '')
      } else {
        this.toaster.showError(res.Message, '')
      }
    })
  }
}
