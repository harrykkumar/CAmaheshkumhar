import { CompanyProfileService } from './../../start/company-profile/company-profile.service';
import { NgForm } from '@angular/forms';
import { AddNewCityComponent } from './../../shared/components/add-new-city/add-new-city.component';
import { VendorServices } from './../../commonServices/TransactionMaster/vendoer-master.services';
import { BaseServices } from 'src/app/commonServices/base-services';
import { AddAddressComponent } from './../../add-address/add-address.component';
import { AddEmailComponent } from './../../add-email/add-email.component';
import { AddMobileNoComponent } from './../../add-mobile-no/add-mobile-no.component';
import { UIConstant } from 'src/app/shared/constants/ui-constant';
import { AddCommonMasterPopUpComponent } from './../../add-common-master-pop-up/add-common-master-pop-up.component';
import { ApiConstant } from 'src/app/shared/constants/api';
import { CrmService } from './../crm.service';
import { Component, OnInit, EventEmitter, Output, ComponentFactoryResolver, ViewContainerRef, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { ToastrCustomService } from 'src/app/commonServices/toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-lead-detail',
  templateUrl: './add-lead-detail.component.html',
  styleUrls: ['./add-lead-detail.component.css']
})
export class AddLeadDetailComponent implements OnInit {
  @ViewChild('addCommonMasterContainerRef', { read: ViewContainerRef }) addCommonMasterContainerRef: ViewContainerRef;
  @ViewChild('addMobileNoContainerRef', { read: ViewContainerRef }) addMobileNoContainerRef: ViewContainerRef;
  @ViewChild('addEmailContainerRef', { read: ViewContainerRef }) addEmailContainerRef: ViewContainerRef;
  @ViewChild('addAddressContainerRef', { read: ViewContainerRef }) addAddressContainerRef: ViewContainerRef;
  @ViewChild('keyPersonForm') keyPersonFormControl: NgForm
  // @ViewChild('addNewCityRef') addNewCityRefModel  : AddNewCityComponent
  addMobileNoRef: any;
  addEmailRef: any;
  addAddressRef: any;
  @Output() closeModal = new EventEmitter();
  addCommonMasterRef: any;
  model: AddLeadDetailInterface = {};
  noOfEmployeeList: Array<any> = []
  socialMediaList: Array<any> = []
  designationList: Array<any> = []
  leadStageList: Array<any> = []
  selectedSocialMediaId: boolean;
  socialMediaUrl: any;
  editSocialProfileIndex: any;
  leadEditId: number;
  isKeyPersonChanged: any;
  formtype: any;
  enquiryId: number;
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
  editKeyPersonIndex = null;
  keyPersonEditId: any;
  editKeyPersonDefault: any;
  isDefaultKeyPerson:boolean = false;
  mobileCountryCodeList: any[];
  currentContactLength: any;
  emailTypeList: any;
  emailTypeId: number;
  orgCountryCode: any;
  constructor(
    public commonService: CommonService,
    private resolver: ComponentFactoryResolver,
    private toastrService: ToastrCustomService,
    private spinner: NgxSpinnerService,
    public crmService: CrmService,
    private baseService: BaseServices,
    private _vendorService: VendorServices,
    private _orgService: CompanyProfileService,
  ) {
    this.getCountryList()
    this.getAddressTypeList()
    this.model.socialProfileList = []
    this.model.personalAddressList = []
    this.model.personalEmailList = []
    this.model.personalMobileNoList = []
    this.model.companyAddressList = []
    this.model.companyEmailList = []
    this.model.companyMobileNoList = []
    this.model.contactPersonList = []
  }

  ngOnInit() {
    this.getMobileCountryCodeList();
    this.getEmailTypeList();
    this.getFormUtilityData();
    this.getUtility('noOfEmployeeList', 195)
    this.getUtility('socialMediaList', 147)
    this.getUtility('designationList', 113)
  }

  async getFormUtilityData(addedId?, commonCode?) {
    await this.crmService.getLeadUtility();
    const addNewField = ['BusinessType', 'IndustryType']
    this.addAddNewButton(addNewField);
    if (addedId) {
      this.assignAddedId(addedId, commonCode);
    }
  }

  addAddNewButton(Data) {
    _.forEach(Data, (item) => {
      this.crmService.leadUtilityData[item].unshift({ id: 0, commondesc: UIConstant.ADD_NEW_OPTION })
    })
  }

  assignAddedId(id, code) {
    if (code === 193) {
      this.model.selectedBusinessTypeId = Number(id);
    }
    if (code === 125) {
      this.model.selectedIndustryTypeId = Number(id);
    }
  }

  openModal(item?, data?) {
    this.commonService.openModal('add_lead_detail');
    if (!this.commonService.isEmpty(data)) {
      if (!this.commonService.isEmpty(data.formtype)) {
        this.formtype = data.formtype
      }
      // this.model.firstName = data.data.keyPersonName
      this.model.companyName = data.data.companyName
      this.model.selectedBusinessTypeId = data.data.businessTypeId
      // this.isKeyPersonChanged = data.isKeyPersonChanged
    }
    if (!_.isEmpty(item) && item.editLeadId) {
      this.leadEditId = Number(item.editLeadId)
      if(item.enquiryId){
        this.enquiryId = Number(item.enquiryId)
      }
      this.assignFormData()
    }
  }

  assignFormData() {
    let url = ApiConstant.CRM_LEAD
    const query = {
      ID: this.leadEditId
    }
    if (this.formtype === UIConstant.FORMTYPE_FOLLOWUP_EDIT || this.formtype === UIConstant.FORMTYPE_FOLLOWUP_FROM_FOLLOWUP) {
      query['EnquiryID'] = this.enquiryId ? this.enquiryId : 0
      url = ApiConstant.LEAD_FOLLOW_UP
    }
    this.commonService.getRequest(url, query).subscribe((res) => {
      if (res.Code === 1000 && !_.isEmpty(res.Data)) {
        if (this.formtype === UIConstant.FORMTYPE_FOLLOWUP_EDIT || this.formtype === UIConstant.FORMTYPE_FOLLOWUP_FROM_FOLLOWUP) {
          this.assignFollowUpDetailData(res);
        } else {
          this.assignLeadDetailData(res);
        }
      }
    })
  }

  assignFollowUpDetailData(res) {
    if (!_.isEmpty(res.Data.FollowUpCustomer)) {
      const data = { ...res.Data.FollowUpCustomer[0] };
      this.model.selectedIndustryTypeId = Number(data.IndustryId) ? Number(data.IndustryId) : null
      this.model.selectedNoOfEmployeeId = Number(data.NoOfEmployee) ? Number(data.NoOfEmployee): null
      this.model.companyRevenue = Number(data.Revenue) ? Number(data.Revenue) : 0
      this.model.companyWebsite = data.WebSite ? data.WebSite : ''
    }
    if (!_.isEmpty(res.Data.FollowUpContactInfo)) {
      this.model.companyMobileNoList = _.map(res.Data.FollowUpContactInfo, (item) => {
        return {
          editId: item.Id,
          id: item.CountryCode,
          mobileNo: item.ContactNo,
          displayLabel: `+${item.CountryCode}-${item.ContactNo}`
        }
      })
    }
    if (!_.isEmpty(res.Data.FollowUpEmail)) {
      this.model.companyEmailList = _.map(res.Data.FollowUpEmail, (item) => {
        return {
          editEmailId: item.Id,
          id: item.EmailType ? item.EmailType : 1,
          email: item.EmailAddress,
          emailTypeName: item.EmailType ? item.EmailTypeName : 'Personal'
        }
      })
    }

    if (!_.isEmpty(res.Data.FollowUpAddress)) {
      const data = { ...res.Data.FollowUpAddress[0] }
      res.Data.FollowUpAddress.shift();
      this.countryId = data.CountryId
      this.getStateList(this.countryId, data)
      this.addressTypeId = data.AddressType
      this.address = data.AddressValue
      this.model.companyAddressList = _.map(res.Data.FollowUpAddress, (item) => {
        return {
          editAddressId: item.Id,
          countryId: item.CountryId,
          countryName: item.Country,
          stateId: item.StateId,
          stateName: item.State,
          cityId: item.CityId,
          cityName: item.City,
          areaId: item.AreaId,
          areaName: item.Area,
          addressTypeId: item.AddressType,
          addressTypeName: item.AddressTypeName,
          address: item.AddressValue,
          displayLabel: `${item.AddressValue}`
        }
      })
    }

    if (!_.isEmpty(res.Data.FollowUpContactPerson)) {
      this.model.contactPersonList = _.map(res.Data.FollowUpContactPerson, (item, index) => {
        if (item.IsDefault === 1) {
          this.model.defaultCheckedIndex = index
          console.log(index)
        }
        return {
          id: item.Id,
          designationId: item.TypeId,
          designationName: item.TypeIdName,
          name: item.Name,
          departMentName: item.Department,
          countryCode: item.CountryCode,
          mobileNo: item.ContactNo,
          emailType: item.EmailType,
          email: item.EmailAddress,
        }
      })
    }
    if (!_.isEmpty(res.Data.CPSocialProfile)) {
      this.model.socialProfileList = _.map(res.Data.CPSocialProfile, (item) => {
        return {
          id: item.Type,
          name: item.TypeName,
          url: item.Name
        }
      })
    }
  }

  assignLeadDetailData(res) {
    if (!_.isEmpty(res.Data.LeadCustomer)) {
      const data = { ...res.Data.LeadCustomer[0] };
      this.model.selectedIndustryTypeId = Number(data.IndustryId) ? Number(data.IndustryId) : null
      this.model.selectedNoOfEmployeeId = Number(data.NoOfEmployee) ? Number(data.NoOfEmployee): null
      this.model.companyRevenue = Number(data.Revenue) ? Number(data.Revenue) : 0
      this.model.companyWebsite = data.WebSite ? data.WebSite : ''
    }
    if (!_.isEmpty(res.Data.LeadContactInfo)) {
      this.model.companyMobileNoList = _.map(res.Data.LeadContactInfo, (item) => {
        return {
          editId: item.Id,
          id: item.CountryCode,
          mobileNo: item.ContactNo,
          displayLabel: `+${item.CountryCode}-${item.ContactNo}`
        }
      })
    }
    if (!_.isEmpty(res.Data.LeadEmail)) {
      this.model.companyEmailList = _.map(res.Data.LeadEmail, (item) => {
        return {
          editEmailId: item.Id,
          id: item.EmailType ? item.EmailType : 1,
          email: item.EmailAddress,
          emailTypeName: item.EmailType ? item.EmailTypeName : 'Personal'
        }
      })
    }
    if (!_.isEmpty(res.Data.LeadAddress)) {
      const data = { ...res.Data.LeadAddress[0] }
      // res.Data.LeadAddress.shift();
      this.countryId = data.CountryId
      this.getStateList(this.countryId, data)
      this.addressTypeId = data.AddressType
      this.address = data.AddressValue
    }
    if (!_.isEmpty(res.Data.LeadContactPerson)) {
      this.model.contactPersonList = _.map(res.Data.LeadContactPerson, (item, index) => {
        if (item.IsDefault === 1) {
          this.model.defaultCheckedIndex = index
          console.log(index)
        }
        return {
          id: item.Id,
          designationId: item.TypeId,
          designationName: item.TypeIdName,
          name: item.Name,
          departMentName: item.Department,
          countryCode: item.CountryCode,
          mobileNo: item.ContactNo,
          emailType: item.EmailType,
          email: item.EmailAddress,
        }
      })
    }
    if (!_.isEmpty(res.Data.CPSocialProfile)) {
      this.model.socialProfileList = _.map(res.Data.CPSocialProfile, (item) => {
        return {
          id: item.Type,
          name: item.TypeName,
          url: item.Name
        }
      })
    }
  }

  addKeyPerson() {
    const designationIndex = _.findIndex(this.crmService.leadUtilityData.MeetingWith, { id: this.model.selectedDesignationId })
    console.log(this.model.countryCodeId)
    console.log(this.model.defaultCheckedIndex)
    console.log(this.editKeyPersonIndex)
    const data = {
      id: this.editKeyPersonIndex !== null ? this.model.contactPersonList[this.editKeyPersonIndex].id : 0,
      designationId: this.model.selectedDesignationId ? this.model.selectedDesignationId : 0,
      designationName: designationIndex !== -1 ? this.crmService.leadUtilityData.MeetingWith[designationIndex].commondesc : '',
      name: this.model.firstName,
      departMentName: this.model.department,
      countryCode: this.model.countryCodeId ?  this.model.countryCodeId : 0,
      mobileNo: this.model.mobileNo,
      emailType: this.model.emailType ? this.model.emailType : 1,
      email: this.model.email,
    }
    if (this.editKeyPersonIndex !== null) {
      this.model.contactPersonList[this.editKeyPersonIndex] = {...data}
      this.editKeyPersonIndex = null;
      this.model.defaultCheckedIndex = this.editKeyPersonIndex
    } else {
      this.model.contactPersonList.push({ ...data })
      this.model.defaultCheckedIndex = this.model.contactPersonList.length - 1
    }
    this.keyPersonFormControl.resetForm();
    this.model.countryCodeId = this.orgCountryCode
    this.model.emailType = 1
  }

  editKeyPerson(item, index) {
    console.log(item.countryCode)
    if (!_.isEmpty(item) && index >= 0) {
      this.editKeyPersonIndex = index;
      this.model.selectedDesignationId = item.designationId
      this.model.firstName = item.name
      this.model.department = item.departMentName
      this.model.countryCodeId = item.countryCode ? item.countryCode : this.orgCountryCode
      this.model.mobileNo = item.mobileNo
      this.model.emailType = item.emailType
      this.model.email = item.email
    }
  }

  deleteKeyPerson(index) {
    this.model.contactPersonList.splice(index, 1)
  }

  closePopUp(data?) {
    this.commonService.closeModal('add_lead_detail')
    this.closeModal.emit(data);
  }

  onChangeSelection(pageTitle, type, code) {
    if (this.model[type] === 0) {
      const data = {
        pageTitle: pageTitle,
        apiUrl: ApiConstant.COMMON_MASTER_MENU,
        commonCode: code
      }
      this.addCommonMaster(data, type);
    }
  }

  addCommonMaster(dataToSend, type?) {
    this.commonService.loadModalDynamically(this, 'addCommonMasterContainerRef', 'addCommonMasterRef', AddCommonMasterPopUpComponent,
       (res) => {
        this.model[type] = null;
        if (res) {
           this.getFormUtilityData(res, dataToSend.commonCode);
         }
       }, dataToSend);
  }

  addMobileNo(type, item?, index?) {
    this.commonService.loadModalDynamically(this, 'addMobileNoContainerRef', 'addMobileNoRef', AddMobileNoComponent,
      (res) => {
        if (res) {
          if (!_.isEmpty(item)) {
            this.model[type][index] = { ...res };
          } else {
            this.model[type].push({ ...res });
          }
        }
      }, item);
  }

  deleteMobileNo(type, index) {
    this.model[type].splice(index, 1);
  }

  addEmail(type, item?, index?) {
    this.commonService.loadModalDynamically(this, 'addEmailContainerRef', 'addEmailRef', AddEmailComponent,
      (res) => {
        if (res) {
          if (!_.isEmpty(item)) {
            this.model[type][index] = {...res};
          } else {
            this.model[type].push({ ...res });
          }
        }
      }, item);
  }

  deleteEmail(type, index) {
    this.model[type].splice(index, 1);
  }

  addAddress(type, item?, index?) {
    this.commonService.loadModalDynamically(this, 'addAddressContainerRef', 'addAddressRef', AddAddressComponent,
      (res) => {
        if (!this.commonService.isEmpty(res)) {
          if (index >= 0) {
            this.model[type][index] = JSON.parse(JSON.stringify(res));
          } else {
            this.model[type].push({ ...res });
          }
        }
      }, item);
  }

  deleteAddress(type, index) {
    this.model[type].splice(index, 1);
  }

  getUtility(type, code) {
    this.baseService.getRequest(`${ApiConstant.COMMON_MASTER_MENU}?commonCode=${code}`).subscribe((res) => {
      if (res.Code === 1000 && !_.isEmpty(res.Data)) {
        this[type] = [...res.Data]
      }
    })
  }

  addSocialProfile() {
    const socialMediaIndex = _.findIndex(this.socialMediaList, { UId: this.selectedSocialMediaId })
    const data = {
      id: this.selectedSocialMediaId,
      name: socialMediaIndex !== -1 ? this.socialMediaList[socialMediaIndex].CommonDesc : '',
      url: this.socialMediaUrl
    }
    if (this.selectedSocialMediaId && this.socialMediaUrl) {
      if (!this.editSocialProfileIndex) {
        this.model.socialProfileList.push({ ...data })
      } else {
        this.model.socialProfileList[this.editSocialProfileIndex] = { ...data }
        this.editSocialProfileIndex = null;
      }
      this.socialMediaUrl = ''
      this.selectedSocialMediaId = null
    }
  }

  editSocialProfile(item, index) {
    if (!_.isEmpty(item) && index >= 0) {
      this.editSocialProfileIndex = index;
      this.selectedSocialMediaId = item.id
      this.socialMediaUrl = item.url
    }
  }

  deleteSocialProfile(index) {
    if (index) {
      this.model.socialProfileList.splice(index, 1)
    }
  }

  getCountryList() {
    this._vendorService.getCommonValues('101').subscribe((res) => {
      if (res.Code === UIConstant.THOUSAND && !_.isEmpty(res.Data)) {
        this.countryList = [...res.Data];
        this.countryId = 123
        this.getStateList(123);
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

  preparePayload() {
    const addr = {
      countryId: this.countryId ? this.countryId : 0,
      stateId: this.stateId ? this.stateId : 0,
      cityId: this.cityId ? this.cityId : 0,
      areaId: this.areaId ? this.areaId : 0,
      addressTypeId: this.addressTypeId ? this.addressTypeId : 0,
      address: this.address ? this.address : ''
    }
    this.model.companyAddressList.push({ ...addr });
    if (this.model.firstName && this.model.selectedDesignationId) {
      this.addKeyPerson();
    }
    return {
      "Id":this.leadEditId,
      // "CustomerId": this.leadEditId,
      "FirstName": this.model.firstName,
      "JobTitle": this.model.jobTitle,
      "Department": this.model.department,
      "NoOfEmployee": this.model.selectedNoOfEmployeeId ? this.model.selectedNoOfEmployeeId : 0,
      "Revenue": this.model.companyRevenue,
      "WebSite": this.model.companyWebsite,
      "ComapanyName": this.model.companyName,
      "CustBusinessTypeId": this.model.selectedBusinessTypeId ? this.model.selectedBusinessTypeId : 0,
      "CustIndustryId": this.model.selectedIndustryTypeId ? this.model.selectedIndustryTypeId : 0,
      "ListLeadEmailDetails": _.map(this.model.companyEmailList, (item) => {
        return {
          "EmailAddress": item.email,
          "EmailType": item.id
        }
      }),
      "ListLeadContactinfo": _.map(this.model.companyMobileNoList, (item) => {
        return {
          "ContactNo": item.mobileNo,
          "CountryCode": item.id,
          "ContactType": "1"
        }
      }),
      "ListLeadAddress": _.map(this.model.companyAddressList, (item) => {
        return {
          "CountryId": item.countryId,
          "StateId": item.stateId,
          "CityId": item.cityId,
          "AreaId": item.areaId,
          "AddressValue": item.address,
          "AddressType": item.addressTypeId
        }
      }),
     "ListCPEmailDetails": [],
      "ListCPContactinfo": [],
      "ListCPSocialProfile": _.map(this.model.socialProfileList, (item) => {
        return {
          "Name": item.url,
          "Type": item.id
        }
      }),
      "ListLeadContactPerson": _.map(this.model.contactPersonList, (item, index) => {
        return {
          "Id": item.id,
          "Name": item.name,
          "Department": item.departMentName,
          "TypeId": item.designationId,
          "IsDefault": this.model.defaultCheckedIndex === index ? 1 : 0,
          "CountryCode": item.countryCode,
          "ContactNo": item.mobileNo,
          "EmailType":item.emailType,
          "EmailAddress":item.email,
        }
      }),
    }
  }

  submit() {
    const data = this.preparePayload()
    if (this.formtype) {
      this.closePopUp(this)
    } else {
      this.spinner.show()
      this.baseService.postRequest(ApiConstant.CRM_LEAD_UPDATE, data).subscribe((res) => {
        if (res.Code === 1000) {
          this.toastrService.showSuccess('', 'Saved Successfully')
          this.closePopUp(true);
        } else {
          this.toastrService.showError('', res.Message);
        }
        this.spinner.hide();
      })
    }
  }

  onChangeKeyPersonSelection(event, index) {
    this.model.defaultCheckedIndex = index
  }


  getMobileCountryCodeList = () => {
    this._orgService.getMobileCountryCodeList().
      subscribe((response: any) => {
        this.mobileCountryCodeList = [...response]
        const orgAddress = JSON.parse(localStorage.getItem('ORGNIZATIONADDRESS'));
        if (!_.isEmpty(orgAddress)) {
          const obj = _.find(this.mobileCountryCodeList, { phoneCode: orgAddress.CountryCode })
          if (!_.isEmpty(obj)) {
            this.orgCountryCode = obj.id
            this.model.countryCodeId = obj.id
            this.setCurrentMobileNoLength()
          }
        }
      }, error => console.log(error))
  }

  setCurrentMobileNoLength() {
    if (this.model.countryCodeId) {
      const index = _.findIndex(this.mobileCountryCodeList, { id: this.model.countryCodeId })
      if (index !== -1) {
        this.currentContactLength = this.mobileCountryCodeList[index].contactLength
      }
    }
  }

  /* Function to get all the email type list */
  getEmailTypeList = () => {
    const data = [
      {
        id: 1,
        text: 'Personal'
      },
      {
        id: 2,
        text: 'Work'
      },
      {
        id: 3,
        text: 'Home'
      },
      {
        id: 4,
        text: 'Other'
      }
    ]
    this.emailTypeList = JSON.parse(JSON.stringify(data))
    // this.emailTypeId = 1;
    this.model.emailType = 1
  }

  trackByFn(index) {
    return index;
  }
}


export interface AddLeadDetailInterface {
  countryCodeId?: any;
  companyRevenue?: number;
  selectedIndustryTypeId?: number
  selectedBusinessTypeId?: number
  personalMobileNoList?: Array<any>
  personalEmailList?: Array<any>
  companyMobileNoList?: Array<any>
  companyEmailList?: Array<any>
  personalAddressList?: Array<any>
  companyAddressList?: Array<any>
  contactPersonList?: Array<any>
  selectedNoOfEmployeeId?: number
  firstName?: string;
  lastName?: string;
  // selectedLeadStageId?: number
  selectedDesignationId?: number
  jobTitle?: string;
  department?: string;
  socialProfileList?: Array<any>;
  companyName?: string;
  companyWebsite?: string;
  email?: string;
  emailType?: number;
  mobileNo?: number;
  defaultCheckedIndex?: number;
}
