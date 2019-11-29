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
  constructor(
    private commonService: CommonService,
    private resolver: ComponentFactoryResolver,
    private toastrService: ToastrCustomService,
    private spinner: NgxSpinnerService,
    public crmService: CrmService,
    private baseService: BaseServices
  ) {
    this.model.socialProfileList = []
    this.model.personalAddressList = []
    this.model.personalEmailList = []
    this.model.personalMobileNoList = []
    this.model.companyAddressList = []
    this.model.companyEmailList = []
    this.model.companyMobileNoList = []
  }

  ngOnInit() {
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
    if(!this.commonService.isEmpty(data)){
      this.formtype = data.formtype
      $("a[href='#keyperson_org']").click()
      this.isKeyPersonChanged = data.isKeyPersonChanged
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

  assignFollowUpDetailData(res){
    // if (!_.isEmpty(res.Data.FollowUpCustomer)) {
    //   const data = {...res.Data.FollowUpCustomer[0]};
    //   if (!this.formtype){
    //     this.model.companyName = data.OrgName
    //     this.model.selectedBusinessTypeId = Number(data.BusinessTypeId)
    //     this.model.selectedIndustryTypeId = Number(data.IndustryId)
    //     this.model.selectedNoOfEmployeeId = Number(data.NoOfEmployee)
    //     this.model.companyRevenue = Number(data.Revenue)
    //     this.model.companyWebsite = data.WebSite
    //   }
    //   if (!this.formtype || (this.formtype === UIConstant.FORMTYPE_FOLLOWUP_EDIT)
    //     || ((this.formtype === UIConstant.FORMTYPE_FOLLOWUP) && !this.isKeyPersonChanged)) {
    //     this.model.firstName = data.FirstName
    //     this.model.department = data.Department
    //     this.model.lastName = data.LastName
    //     this.model.jobTitle = data.JobTitle
    //     this.model.selectedDesignationId = Number(data.CustDesignationID)
    //   }
    // }
    // if (!this.formtype){
    //   if (!_.isEmpty(res.Data.FollowUpContactInfo)) {
    //     this.model.companyMobileNoList = _.map(res.Data.FollowUpContactInfo, (item) => {
    //       return {
    //         editId : item.Id,
    //         id: item.CountryCode,
    //         mobileNo: item.ContactNo,
    //         displayLabel: `+${item.CountryCode}-${item.ContactNo}`
    //       }
    //     })
    //   }
    //   if (!_.isEmpty(res.Data.FollowUpEmail)) {
    //     this.model.companyEmailList = _.map(res.Data.FollowUpEmail, (item) => {
    //       return {
    //         editEmailId : item.Id,
    //         id: item.EmailType ? item.EmailType : 1,
    //         email: item.EmailAddress,
    //         emailTypeName: item.EmailType ? item.EmailTypeName : 'Personal'
    //       }
    //     })
    //   }
    //   if (!_.isEmpty(res.Data.FollowUpAddress)) {
    //     this.model.companyAddressList = _.map(res.Data.FollowUpAddress, (item) => {
    //       return {
    //         editAddressId : item.Id,
    //         countryId: item.CountryId,
    //         countryName: item.Country,
    //         stateId: item.StateId,
    //         stateName: item.State,
    //         cityId: item.CityId,
    //         cityName: item.City,
    //         areaId: item.AreaId,
    //         areaName: item.Area,
    //         addressTypeId: item.AddressType,
    //         addressTypeName: item.AddressTypeName,
    //         address: item.AddressValue,
    //         displayLabel: `${item.AddressValue}`
    //       }
    //     })
    //   }
    // }
    // if (!this.formtype || (this.formtype === UIConstant.FORMTYPE_FOLLOWUP_EDIT)
    //   || ((this.formtype === UIConstant.FORMTYPE_FOLLOWUP) && !this.isKeyPersonChanged)) {
      if (!_.isEmpty(res.Data.CPContactInfo)) {
        this.model.personalMobileNoList = _.map(res.Data.CPContactInfo, (item) => {
          return {
            editId: item.Id,
            id: item.CountryCode,
            mobileNo: item.ContactNo,
            displayLabel: `+${item.CountryCode}-${item.ContactNo}`
          }
        })
      }
      if (!_.isEmpty(res.Data.CPEmailDetails)) {
        this.model.personalEmailList = _.map(res.Data.CPEmailDetails, (item) => {
          return {
            editEmailId: item.Id,
            id: item.EmailType ? item.EmailType : 1,
            email: item.EmailAddress,
            emailTypeName: item.EmailType ? item.EmailTypeName : 'Personal'
          }
        })
      }
      if (!_.isEmpty(res.Data.CPAddress)) {
        this.model.personalAddressList = _.map(res.Data.CPAddress, (item) => {
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
      if (!_.isEmpty(res.Data.CPSocialProfile)) {
        this.model.socialProfileList = _.map(res.Data.CPSocialProfile, (item) => {
          return {
            id: item.Type,
            name: item.TypeName,
            url: item.Name
          }
        })
      }
    // }
  }

  assignLeadDetailData(res){
    if (!_.isEmpty(res.Data.LeadCustomer)) {
      const data = {...res.Data.LeadCustomer[0]};
      if (!this.formtype){
        this.model.companyName = data.OrgName
        this.model.selectedBusinessTypeId = Number(data.BusinessTypeId)
        this.model.selectedIndustryTypeId = Number(data.IndustryId)
        this.model.selectedNoOfEmployeeId = Number(data.NoOfEmployee)
        this.model.companyRevenue = Number(data.Revenue)
        this.model.companyWebsite = data.WebSite
      }
      if (!this.formtype || (this.formtype === UIConstant.FORMTYPE_FOLLOWUP_EDIT)
        || ((this.formtype === UIConstant.FORMTYPE_FOLLOWUP) && !this.isKeyPersonChanged)) {
        this.model.firstName = data.FirstName
        this.model.department = data.Department
        this.model.lastName = data.LastName
        this.model.jobTitle = data.JobTitle
        this.model.selectedDesignationId = Number(data.CustDesignationID)
      }
    }
    if (!this.formtype){
      if (!_.isEmpty(res.Data.LeadContactInfo)) {
        this.model.companyMobileNoList = _.map(res.Data.LeadContactInfo, (item) => {
          return {
            editId : item.Id,
            id: item.CountryCode,
            mobileNo: item.ContactNo,
            displayLabel: `+${item.CountryCode}-${item.ContactNo}`
          }
        })
      }
      if (!_.isEmpty(res.Data.LeadEmail)) {
        this.model.companyEmailList = _.map(res.Data.LeadEmail, (item) => {
          return {
            editEmailId : item.Id,
            id: item.EmailType ? item.EmailType : 1,
            email: item.EmailAddress,
            emailTypeName: item.EmailType ? item.EmailTypeName : 'Personal'
          }
        })
      }
      if (!_.isEmpty(res.Data.LeadAddress)) {
        this.model.companyAddressList = _.map(res.Data.LeadAddress, (item) => {
          return {
            editAddressId : item.Id,
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
    }
    if (!this.formtype || (this.formtype === UIConstant.FORMTYPE_FOLLOWUP_EDIT)
      || ((this.formtype === UIConstant.FORMTYPE_FOLLOWUP) && !this.isKeyPersonChanged)) {
      if (!_.isEmpty(res.Data.CPContactInfo)) {
        this.model.personalMobileNoList = _.map(res.Data.CPContactInfo, (item) => {
          return {
            editId: item.Id,
            id: item.CountryCode,
            mobileNo: item.ContactNo,
            displayLabel: `+${item.CountryCode}-${item.ContactNo}`
          }
        })
      }
      if (!_.isEmpty(res.Data.CPEmail)) {
        this.model.personalEmailList = _.map(res.Data.CPEmail, (item) => {
          return {
            editEmailId: item.Id,
            id: item.EmailType ? item.EmailType : 1,
            email: item.EmailAddress,
            emailTypeName: item.EmailType ? item.EmailTypeName : 'Personal'
          }
        })
      }
      if (!_.isEmpty(res.Data.CPAddress)) {
        this.model.personalAddressList = _.map(res.Data.CPAddress, (item) => {
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

  preparePayload() {
    return {
      "Id":this.leadEditId,
      // "CustomerId": this.leadEditId,
      // "IsActive": "1",
      // "ContactPerson": "Admin",
      "FirstName": this.model.firstName,
      "LastName": this.model.lastName,
      // "AddressID": "1",
      // "LeadStage": this.model.selectedLeadStageId,
      "JobTitle": this.model.jobTitle,
      "Department": this.model.department,
      "NoOfEmployee": this.model.selectedNoOfEmployeeId ? this.model.selectedNoOfEmployeeId : 0,
      "Revenue": this.model.companyRevenue,
      "WebSite": this.model.companyWebsite,
      "ComapanyName": this.model.companyName,
      "CustBusinessTypeId": this.model.selectedBusinessTypeId ? this.model.selectedBusinessTypeId : 0,
      "CustIndustryId": this.model.selectedIndustryTypeId ? this.model.selectedIndustryTypeId : 0,
      "CustDesignationID": this.model.selectedDesignationId ? this.model.selectedDesignationId : 0,
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
          "PostCode": "326502",
          "AddressValue": item.address,
          "AddressType": item.addressTypeId
        }
      }),
      // "ListLeadContactPerson": [
      //   {
      //     "ParentId": "1",
      //     "ParentTypeId": "1",
      //     "Code": "001",
      //     "Id": "1",
      //     "Name": "Test Contact Person"
      //   }
      // ],
      "ListCPAddress" : _.map(this.model.personalAddressList, (item) => {
        return {
          "CountryId": item.countryId,
          "StateId": item.stateId,
          "CityId": item.cityId,
          "AreaId": item.areaId,
          "PostCode": "326502",
          "AddressValue": item.address,
          "AddressType": item.addressTypeId
        }
      }),
      "ListCPEmailDetails": _.map(this.model.personalEmailList, (item) => {
        return {
          "EmailAddress": item.email,
          "EmailType": item.id
        }
      }),
      "ListCPContactinfo": _.map(this.model.personalMobileNoList, (item) => {
        return {
          "ContactNo": item.mobileNo,
          "CountryCode": item.id,
          "ContactType": "1"
        }
      }),
      "ListCPSocialProfile": _.map(this.model.socialProfileList, (item) => {
        return {
          "Name": item.url,
          "Type": item.id
        }
      })
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
}


export interface AddLeadDetailInterface {
  companyRevenue?: number;
  selectedIndustryTypeId?: number
  selectedBusinessTypeId?: number
  personalMobileNoList?: Array<any>
  personalEmailList?: Array<any>
  companyMobileNoList?: Array<any>
  companyEmailList?: Array<any>
  personalAddressList?: Array<any>
  companyAddressList?: Array<any>
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
}
