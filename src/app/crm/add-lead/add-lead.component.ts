import { NgForm, NgSelectOption } from '@angular/forms';
import { UIConstant } from 'src/app/shared/constants/ui-constant';
import { BaseServices } from './../../commonServices/base-services';
import { CompanyProfileService } from './../../start/company-profile/company-profile.service';
import { CrmService } from './../crm.service';
import { AddItemDetailsComponent } from './../add-item-details/add-item-details.component';
import { AddEmailComponent } from './../../add-email/add-email.component';
import { AddMobileNoComponent } from './../../add-mobile-no/add-mobile-no.component';
import { Settings } from './../../shared/constants/settings.constant';
import { GlobalService } from 'src/app/commonServices/global.service';
import { ApiConstant } from 'src/app/shared/constants/api';
import { AddCommonMasterPopUpComponent } from './../../add-common-master-pop-up/add-common-master-pop-up.component';
import { AddLeadDetailComponent } from './../add-lead-detail/add-lead-detail.component';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Component, OnInit, EventEmitter, Output, ViewContainerRef, ViewChild, ComponentFactoryResolver, AfterViewInit } from '@angular/core';
import * as _ from 'lodash';
declare var $: any
import { ToastrCustomService } from 'src/app/commonServices/toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-lead',
  templateUrl: './add-lead.component.html',
  styleUrls: ['./add-lead.component.css']
})
export class AddLeadComponent implements OnInit, AfterViewInit{
  @ViewChild('addLeadForm') addLeadForm: NgForm;
  @ViewChild('customerSelect') customerSelectControl;
  @ViewChild('addLeadDetailContainerRef', { read: ViewContainerRef }) addLeadDetailContainerRef: ViewContainerRef;
  @ViewChild('addCommonMasterContainerRef', { read: ViewContainerRef }) addCommonMasterContainerRef: ViewContainerRef;
  @ViewChild('addMobileNoContainerRef', { read: ViewContainerRef }) addMobileNoContainerRef: ViewContainerRef;
  @ViewChild('addEmailContainerRef', { read: ViewContainerRef }) addEmailContainerRef: ViewContainerRef;
  @ViewChild('addItemDetailsContainerRef', { read: ViewContainerRef }) addItemDetailsContainerRef: ViewContainerRef;
  @Output() closeModal = new EventEmitter();
  addLeadDetailRef: any;
  addCommonMasterRef: any;
  addMobileNoRef: any;
  addEmailRef: any;
  addItemDetailsRef: any;
  formUtility: any = {};
  model: AddLeadInterface = {}
  mobileCountryCodeList: Array<any> = []
  currentContactLength: number;
  editLeadId: number;
  setUpToCheckRequiredField: any;
  lastLeadDetails: any;
  formType: any;
  isKeyPersonDisable = false;
  followUpDetail: any;
  enquiryId: number;
  constructor(
    public commonService: CommonService,
    private resolver: ComponentFactoryResolver,
    private toastrService: ToastrCustomService,
    private spinner: NgxSpinnerService,
    public _settings: Settings,
    private gs: GlobalService,
    public crmService: CrmService,
    private _orgService: CompanyProfileService,
    private baseService: BaseServices
  ) {
    this.model.mobileNoList = []
    this.model.emailList = []
    this.model.itemDetailList = []
    const setUpSettingArray = JSON.parse(localStorage.getItem('moduleSettings'))
    if (!_.isEmpty(setUpSettingArray && setUpSettingArray.settings)) {
      const data = _.find(setUpSettingArray.settings, { id: 84 });
      if (!_.isEmpty(data)) {
        this.setUpToCheckRequiredField = Number(data.val)
      }
    }
    this.getFormUtilityData();
    this.getMobileCountryCodeList();
  }

  ngOnInit() {}
  ngAfterViewInit() {
    setTimeout(() => {
      this.focusOnComapny();
    }, 500);
  }

  async getFormUtilityData(addedId?, commonCode?) {
    await this.crmService.getLeadUtility();
    const addNewField = ['BusinessType', 'MeetingWith', 'EnquirySource']
    this.addAddNewButton(addNewField);
    if (!this.editLeadId) {
      if (!_.isEmpty(this.crmService.leadUtilityData.EnquiryType)) {
        this.model.selectedEnquiryTypeId = this.crmService.leadUtilityData.EnquiryType[0].id
      }
      if (!_.isEmpty(this.crmService.leadUtilityData.MeetingWithType)) {
        this.model.selectedMeetingWithSaleId = this.crmService.leadUtilityData.MeetingWithType[0].id
      }
      if (!_.isEmpty(this.crmService.leadUtilityData.EnquiryStatus)) {
        this.model.selectedEnquiryStatusId = Number(this.crmService.leadUtilityData.EnquiryStatus[0].id);
      }
    }
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
    if (code === 189) {
      this.model.selectedDesignationId = Number(id);
    }
    if (code === 105) {
      this.model.selectedSourceId = Number(id);
    }
  }

  openModal(item?, type?) {
    if (type) {
      this.formType = type;
    }
    this.commonService.openModal('lead_New_sm');
    if (!_.isEmpty(item)) {
      this.editLeadId = Number(item.Id)
      if(item.EnquiryID){
        this.enquiryId = Number(item.EnquiryID)
      }
      this.assignFormData(item);
    }
  }

  closePopUp(type?) {
    this.commonService.closeModal('lead_New_sm')
    this.closeModal.emit(type);
  }

  addLeadDetail() {
    const item = {
      editLeadId: this.editLeadId,
      enquiryId: this.enquiryId
    }
    const dataToPass = this.formType ? {
      isKeyPersonChanged : !this.model.keyPersonId,
      formtype : this.formType
    } : {}
    this.commonService.loadModalDynamically(this, 'addLeadDetailContainerRef', 'addLeadDetailRef', AddLeadDetailComponent,
      (res) => {
        if (res) {
          this.followUpDetail =  {...res}
        }
      }, item, dataToPass);
  }

  addMobileNo(item?, index?) {
    this.commonService.loadModalDynamically(this, 'addMobileNoContainerRef', 'addMobileNoRef', AddMobileNoComponent,
      (res) => {
        if (res) {
          if (!_.isEmpty(item)) {
            this.model.mobileNoList[index] = { ...res };
          } else {
            this.model.mobileNoList.push({ ...res });
          }
        }
      }, item);
  }

  deleteMobileNo(index) {
    this.model.mobileNoList.splice(index, 1);
  }

  addEmail(item?, index?) {
    this.commonService.loadModalDynamically(this, 'addEmailContainerRef', 'addEmailRef', AddEmailComponent,
      (res) => {
        if (res) {
          if (!_.isEmpty(item)) {
            this.model.emailList[index] = {...res};
          } else {
            this.model.emailList.push({ ...res });
          }
        }
      }, item);
  }

  deleteEmail(index) {
    this.model.emailList.splice(index, 1);
  }

  addItemDetails(item?, index?) {
    this.commonService.loadModalDynamically(this, 'addItemDetailsContainerRef', 'addItemDetailsRef', AddItemDetailsComponent,
      (res) => {
        if (res) {
          if (!_.isEmpty(item)) {
            this.model.itemDetailList[index] = {...res};
          } else {
            this.model.itemDetailList.push({ ...res });
          }
        }
      }, item);
  }

  deleteItemDetail(index) {
    this.model.itemDetailList.splice(index, 1);
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

  /* Funtion to get all the mobile country code list  */
  getMobileCountryCodeList = () => {
    this._orgService.getMobileCountryCodeList().
      subscribe((response: any) => {
        this.mobileCountryCodeList = [...response]
        const orgAddress = JSON.parse(localStorage.getItem('ORGNIZATIONADDRESS'));
        if (!_.isEmpty(orgAddress)) {
          const obj = _.find(this.mobileCountryCodeList, { phoneCode : orgAddress.CountryCode})
          if (!_.isEmpty(obj)) {
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

  preparePayload() {
    return {
      "Id": this.editLeadId ? this.editLeadId : 0,
      "CustomerId": this.model.selectedCustomerId ? this.model.selectedCustomerId : 0,
      "SourceId": this.model.selectedSourceId ? this.model.selectedSourceId : 0,
      "BusinessTypeId": this.model.selectedBusinessTypeId ? this.model.selectedBusinessTypeId : 0,
      "EnquiryTypeId": this.model.selectedEnquiryTypeId ? this.model.selectedEnquiryTypeId : 0,
      "MeetingWithId": this.model.selectedDesignationId ? this.model.selectedDesignationId : 0,
      "MeetingWithSaleId": this.model.selectedMeetingWithSaleId ? this.model.selectedMeetingWithSaleId : 0,
      "NextFollowUpDate": this.gs.clientToSqlDateFormat(this.model.followUpDate, this._settings.dateFormat),
      "NextFollowUpTime": "",
      "Status": this.model.selectedEnquiryStatusId,
      "Remark": this.model.remark ? this.model.remark : '',
      "Company": this.model.company,
      "CountryCode": this.model.countryCodeId ? this.model.countryCodeId : 0,
      "ContactNo": this.model.mobileNo,
      "Email": this.model.email,
      "ContactPerson": this.model.keyPerson,
      "ListLeadProductDetails": _.map(this.model.itemDetailList, (item) => {
        return {
          "ItemID": item.id,
          "Quantity": item.quantity,
          "Rate": item.itemValue
        }
      })
    }
  }

  preparePayloadForFollowUp() {
    return {
      "Id": (this.formType === UIConstant.FORMTYPE_FOLLOWUP_EDIT) ? this.editLeadId : 0,
      "EnquiryId": this.formType === UIConstant.FORMTYPE_FOLLOWUP ? this.editLeadId : (this.enquiryId ? this.enquiryId : 0),
      "CustomerId": this.model.selectedCustomerId ? this.model.selectedCustomerId : 0,
      "SourceId": this.model.selectedSourceId ? this.model.selectedSourceId : 0,
      "BusinessTypeId": this.model.selectedBusinessTypeId ? this.model.selectedBusinessTypeId : 0,
      "MeetingWithSaleId": this.model.selectedMeetingWithSaleId ? this.model.selectedMeetingWithSaleId : 0,
      "EnquiryTypeId": this.model.selectedEnquiryTypeId ? this.model.selectedEnquiryTypeId : 0,
      "NextFollowUpDate": this.gs.clientToSqlDateFormat(this.model.followUpDate, this._settings.dateFormat),
      "NextFollowUpTime": "",
      // "IsImportant": "1",
      // "Priority": "1",
      "Status": this.model.selectedEnquiryStatusId,
      // "EnquiryWithStatus": "1",
      // "UpdatedStatus": "1",
      "Remark": this.model.remark ? this.model.remark : '',
      // "ReferalRemark": "Test Ref",
      "Company": this.model.company,
      "CountryCode": this.model.countryCodeId ? this.model.countryCodeId : 0,
      "ContactNo": this.model.mobileNo,
      "Email": this.model.email,
      "KeyPersonId": this.model.keyPersonId ? this.model.keyPersonId : 0,
      "KeyPersonName": this.model.keyPerson ? this.model.keyPerson : "",
      "ListLeadProductDetails": this.commonService.isEmpty(this.model.itemDetailList) ? [] : _.map(this.model.itemDetailList, (item) => {
        return {
          "ItemID": item.id,
          "Quantity": item.quantity,
          "Rate": item.itemValue
        }
      }),
      "ListCPEmailDetails": this.commonService.isEmpty(this.followUpDetail) ? [] : _.map(this.followUpDetail.model.personalEmailList, (item) => {
        return {
          "EmailAddress": item.email,
          "EmailType": item.id
        }
      }),
      "ListCPContactinfo": this.commonService.isEmpty(this.followUpDetail) ? [] : _.map(this.followUpDetail.model.personalMobileNoList, (item) => {
        return {
          "ContactNo": item.mobileNo,
          "CountryCode": item.id,
          "ContactType": "1"
        }
      }),
      "ListCPAddress": this.commonService.isEmpty(this.followUpDetail) ? [] : _.map(this.followUpDetail.model.personalAddressList, (item) => {
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
      "ListCPSocialProfile": this.commonService.isEmpty(this.followUpDetail) ? [] : _.map(this.followUpDetail.model.socialProfileList, (item) => {
        return {
          "Name": item.url,
          "Type": item.id
        }
      })
    }
  }

  submit() {
    this.spinner.show()
    const url = this.formType ? ApiConstant.LEAD_FOLLOW_UP : ApiConstant.CRM_LEAD
    const data = this.formType ? this.preparePayloadForFollowUp() : this.preparePayload()
    this.baseService.postRequest(url, data).subscribe((res) => {
      if (res.Code === 1000) {
        this.toastrService.showSuccess('Saved Success', '');
        this.closePopUp(true);
      } else {
        this.toastrService.showError(res.Message, '');
      }
      this.spinner.hide()
    })
  }

  focusOnMandatoryField() {
    const focusFieldArray = [
      {
        elementId: 'companyId',
        elementModal: 'company',
        type: 'input'
      },
      {
        elementId: 'designationId',
        elementModal: 'selectedDesignationId',
        type: 'ng-select'
      },
      {
        elementId: 'keyPersonId',
        elementModal: 'keyPerson',
        type: 'input'
      },
      {
        elementId: 'businessTypeId',
        elementModal: 'selectedBusinessTypeId',
        type: 'ng-select'
      },
      {
        elementId: 'mobileId',
        elementModal: 'mobileNo',
        type: 'input'
      },
      {
        elementId: 'sourceId',
        elementModal: 'selectedSourceId',
        type: 'ng-select'
      },
      {
        elementId: 'followUpdateId',
        elementModal: 'followUpDate',
        type: 'follow-up-date'
      }
    ]
    for (let i = 0; i < focusFieldArray.length; i++) {
      if (this.commonService.isEmpty(this.model[focusFieldArray[i].elementModal])) {
        if (focusFieldArray[i].type === 'input') {
          $(`#${focusFieldArray[i].elementId}`).focus()
        } else if(focusFieldArray[i].type === 'ng-select') {
          $(`#${focusFieldArray[i].elementId} input`).focus()
        } else if(focusFieldArray[i].type === 'follow-up-date') {
          if (this.formType && (this.model.selectedEnquiryStatusId !== 5 && this.model.selectedEnquiryStatusId !== 6)) {
            $(`#${focusFieldArray[i].elementId} input`).focus()
          }
        }
        break;
      }
    }
    return true;
  }

  assignFormData(item) {
    let url = ApiConstant.CRM_LEAD
    const query = {
      ID: this.editLeadId,
    }
    if (this.formType === UIConstant.FORMTYPE_FOLLOWUP_EDIT || this.formType === UIConstant.FORMTYPE_FOLLOWUP_FROM_FOLLOWUP) {
      query['EnquiryID'] = item.EnquiryID ? item.EnquiryID : 0
      url = ApiConstant.LEAD_FOLLOW_UP
    }
    this.commonService.getRequest(url, query).subscribe((res) => {
      if (res.Code === 1000 && !_.isEmpty(res.Data)) {
        if (this.formType === UIConstant.FORMTYPE_FOLLOWUP_EDIT || this.formType === UIConstant.FORMTYPE_FOLLOWUP_FROM_FOLLOWUP) {
          this.assignFollowUpData(res);
        } else {
          this.assignLeadData(res);
        }
      }
    })
  }

  assignFollowUpData(res){
    if (!_.isEmpty(res.Data.FollowUpList)) {
      // if (!this.commonService.isEmpty(res.Data.FollowUpContactPerson)) {
        this.model.keyPerson = res.Data.FollowUpList[0].KeyPersonName
        this.model.keyPersonId = res.Data.FollowUpList[0].KeyPersonId
        // if (this.formType === UIConstant.FORMTYPE_FOLLOWUP) {
          this.model.leadKeyPerson = this.model.keyPerson
        // }
        // if (this.formType) {
          this.isKeyPersonDisable = true;
        // }
      // }
      const data = {...res.Data.FollowUpList[0]};
      this.model.selectedSourceId = Number(data.SourceId)
      this.model.selectedBusinessTypeId = Number(data.BusinessTypeId)
      // this.model.selectedEnquiryTypeId = data.EnquiryTypeId
      if (this.formType) {
        this.model.selectedEnquiryTypeId = 2
      }
      // this.model.selectedDesignationId = Number(data.MeetingWithId)
      this.model.selectedMeetingWithSaleId = data.MeetingWithSaleId
      this.model.selectedEnquiryStatusId = data.Status
      this.model.remark = data.Remark
      if (!this.commonService.isEmpty(data.NextFollowUpDate)) {
        this.model.followUpDate = this.gs.utcToClientDateFormat(new Date(data.NextFollowUpDate), this._settings.dateFormat)
      }
    }
    if (!_.isEmpty(res.Data.FollowUpContactInfo)) {
      const data = { ...res.Data.FollowUpContactInfo[0] }
      this.model.mobileNo = data.ContactNo
    }
    if (!_.isEmpty(res.Data.FollowUpEmail)) {
      const data = { ...res.Data.FollowUpEmail[0] }
      this.model.email = data.EmailAddress
    }
    if (!_.isEmpty(res.Data.FollowUpCustomer)) {
      const data = { ...res.Data.FollowUpCustomer[0] }
      this.model.company = data.OrgName
    }
    if (!_.isEmpty(res.Data.FollowUpDetails)) {
      this.model.itemDetailList = _.map(res.Data.FollowUpDetails, (item) => {
        return {
          id: item.ItemId,
          quantity: item.Quantity,
          itemValue: item.Rate,
          itemName: item.ItemName
        }
      })
    }
  }

  assignLeadData(res){
    if (!_.isEmpty(res.Data.LeadList)) {
      if (!this.commonService.isEmpty(res.Data.LeadContactPerson)) {
        this.model.keyPerson = res.Data.LeadContactPerson[0].Name
        this.model.keyPersonId = res.Data.LeadContactPerson[0].Id
        if (this.formType === UIConstant.FORMTYPE_FOLLOWUP) {
          this.model.leadKeyPerson = this.model.keyPerson
        }
        if (this.formType) {
          this.isKeyPersonDisable = true;
        }
      }
      const data = {...res.Data.LeadList[0]};
      this.model.selectedSourceId = Number(data.SourceId)
      this.model.selectedBusinessTypeId = Number(data.BusinessTypeId)
      this.model.selectedEnquiryTypeId = data.EnquiryTypeId
      if (this.formType) {
        this.model.selectedEnquiryTypeId = 2
      }
      this.model.selectedDesignationId = Number(data.MeetingWithId)
      this.model.selectedMeetingWithSaleId = data.MeetingWithSaleId
      this.model.selectedEnquiryStatusId = data.Status
      this.model.remark = data.Remark
      if (!this.commonService.isEmpty(data.NextFollowUpDate)) {
        this.model.followUpDate = this.gs.utcToClientDateFormat(new Date(data.NextFollowUpDate), this._settings.dateFormat)
      }
    }
    if (!_.isEmpty(res.Data.LeadContactInfo)) {
      const data = { ...res.Data.LeadContactInfo[0] }
      this.model.mobileNo = data.ContactNo
    }
    if (!_.isEmpty(res.Data.LeadEmail)) {
      const data = { ...res.Data.LeadEmail[0] }
      this.model.email = data.EmailAddress
    }
    if (!_.isEmpty(res.Data.LeadCustomer)) {
      const data = { ...res.Data.LeadCustomer[0] }
      this.model.company = data.OrgName
    }
    if (!_.isEmpty(res.Data.LeadDetails)) {
      this.model.itemDetailList = _.map(res.Data.LeadDetails, (item) => {
        return {
          id: item.ItemId,
          quantity: item.Quantity,
          itemValue: item.Rate,
          itemName: item.ItemName
        }
      })
    }
  }

  validate() {
    if (this.formType && (this.model.selectedEnquiryStatusId !== 5 && this.model.selectedEnquiryStatusId !== 6)
      && this.commonService.isEmpty(this.model.followUpDate)) {
      return false;
    } else {
      return true
    }
  }

  onChangeCustomer() {
    const query = {
      CustomerID : this.model.selectedCustomerId
    }
    this.commonService.getRequest(ApiConstant.CUSTOMER_LEAD_DETAILS, query).subscribe((res) => {
      if (res.Code === 1000 && !_.isEmpty(res.Data)) {
        this.lastLeadDetails = { ...res.Data[0] }
        if (!this.lastLeadDetails.AllowNewEnquiry) {
          this.toastrService.showError('No Enquiry Allow for this customer', '')
          this.model.selectedCustomerId = null;
          // this.onChangeCustomer();
        }
      } else {
        this.lastLeadDetails = {}
      }
    })
    if (this.model.selectedCustomerId) {
      const selectedCustomerObj = _.find(this.crmService.leadUtilityData.LeadCustomer, { Id: this.model.selectedCustomerId })
      this.model.mobileNo = selectedCustomerObj.ContactNo
      this.model.email = selectedCustomerObj.Email
      this.model.company = selectedCustomerObj.Customer
      this.focusOnComapny();
    }
  }

  focusOnComapny() {
    this.customerSelectControl.close();
    $('#companyId').focus();
  }

  onChangeKeyPerson() {
    if (this.formType && (this.model.keyPerson !== this.model.leadKeyPerson)) {
      this.model.keyPersonId = 0
    }
  }
}


export interface AddLeadInterface {
  leadKeyPerson?: string;
  selectedDesignationId?: number
  selectedBusinessTypeId?: number
  selectedSourceId?: number
  selectedMeetingWithSaleId?: any
  selectedEnquiryTypeId?: any
  selectedCustomerId?: number
  selectedEnquiryStatusId?: any
  countryCodeId?: number
  email?: string
  company?: string
  keyPerson?: string
  keyPersonId?: number
  mobileNo?: number
  mobileNoList?: Array<any>
  emailList?: Array<any>
  itemDetailList?: Array<any>
  followUpDate?: any
  remark?: string
}

// export interface LeadFormUtility
