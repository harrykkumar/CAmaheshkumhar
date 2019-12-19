import { ChangeUserNameComponent } from 'src/app/shared/components/change-user-name/change-user-name.component';
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
import {timeout, catchError} from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-add-lead',
  templateUrl: './add-lead.component.html',
  styleUrls: ['./add-lead.component.css']
})
export class AddLeadComponent implements OnInit, AfterViewInit {
  @ViewChild('addLeadForm') addLeadForm: NgForm;
  @ViewChild('addLeadDetailContainerRef', { read: ViewContainerRef }) addLeadDetailContainerRef: ViewContainerRef;
  @ViewChild('addCommonMasterContainerRef', { read: ViewContainerRef }) addCommonMasterContainerRef: ViewContainerRef;
  @ViewChild('addMobileNoContainerRef', { read: ViewContainerRef }) addMobileNoContainerRef: ViewContainerRef;
  @ViewChild('addEmailContainerRef', { read: ViewContainerRef }) addEmailContainerRef: ViewContainerRef;
  @ViewChild('addItemDetailsContainerRef', { read: ViewContainerRef }) addItemDetailsContainerRef: ViewContainerRef;
  @ViewChild('changeUserNameContainerRef', { read: ViewContainerRef }) changeUserNameContainerRef: ViewContainerRef;
  changeUserNameRef: any;
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
  // isKeyPersonDisable = false;
  followUpDetail: any;
  enquiryId: number;
  mobileNoSearchText: number;
  emailSearchText: string;
  isClosedRemark: number;
  isAllowDynamicField: boolean;
  dynamicLabelFields: Array<any> = []

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
      const data1 = _.find(setUpSettingArray.settings, { id: 90 });
      if (!_.isEmpty(data1)) {
        this.isClosedRemark = data1.val
      }
      const data2 = _.find(setUpSettingArray.settings, { id: 91 });
      if (!_.isEmpty(data2)) {
        this.isAllowDynamicField = data2.val
      }
    }
    this.getFormUtilityData();
    this.getMobileCountryCodeList();
    this.getDynamicLabelFields()
  }

  getDynamicLabelFields() {
    this.commonService.getRequest(ApiConstant.DYNAMIC_LABEL).subscribe((res) => {
      if(!this.commonService.isEmpty(res.Data) && !this.commonService.isEmpty(res.Data.DynamicFormLabelList)){
        this.dynamicLabelFields = [...res.Data.DynamicFormLabelList];
      }
    })
  }

  postDynamicLabel() {
    const data = {
      "ListDynamicFormLabel": [
        {
          "Id": 1957,
          "DisplayName": "Test Display 1"
        }
      ]
    }
  }

  getLabelName(id) {
    const data = _.find(this.dynamicLabelFields, { Id: id })
    if (!this.commonService.isEmpty(data)) {
      return data.DisplayName
    }
  }

  openChangeUserNameModal(data) {
    const data1 = {
      title: 'Add Label',
      label: 'Label',
      value: this.getLabelName(data),
      changeLabelId: data
    }
    this.commonService.loadModalDynamically(this, 'changeUserNameContainerRef', 'changeUserNameRef', ChangeUserNameComponent,
      (res) => {
        this.getDynamicLabelFields()
      }, data1);
  }

  ngOnInit() { }
  ngAfterViewInit() {
   this.setTimePickerOptions();
  }

  setTimePickerOptions(){
    setTimeout(() => {
      this.focusOnComapny();
      $('input.timepicker').timepicker({
        timeFormat: 'h:mm p',
        interval: 5,
        dynamic: false,
        dropdown: true,
        scrollbar: true,
        zindex: 99999,
        change: (event) => {
          this.model.followUpTime = $('#timePickerId').timepicker().format(event);
          console.log(this.model.followUpTime)
        }
      });
    }, 400);
  }

  async getFormUtilityData(addedId?, commonCode?) {
    await this.crmService.getLeadUtility();
    // const addNewField = ['BusinessType', 'MeetingWith', 'EnquirySource']
    // this.addAddNewButton(addNewField);
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
    if (!_.isEmpty(item)) {
      this.editLeadId = Number(item.Id)
      if (item.EnquiryID) {
        this.enquiryId = Number(item.EnquiryID)
      }
      this.assignFormData(item);
    }
    this.commonService.openModal('lead_New_sm');
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
    const dataToPass = {
      // isKeyPersonChanged: this.model.keyPersonId ? false : true,
      formtype: this.formType,
      data: {
        // keyPersonName: this.model.keyPerson,
        companyName: this.model.company,
        businessTypeId: this.model.selectedBusinessTypeId
      }
    }
    this.commonService.loadModalDynamically(this, 'addLeadDetailContainerRef', 'addLeadDetailRef', AddLeadDetailComponent,
      (res) => {
        if (res) {
          this.followUpDetail = { ...res }
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
            this.model.emailList[index] = { ...res };
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
            this.model.itemDetailList[index] = { ...res };
          } else {
            this.model.itemDetailList.push({ ...res });
          }
        }
      }, item, this.model.selectedEnquiryStatusId);
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

  getMobileCountryCodeList = () => {
    this._orgService.getMobileCountryCodeList().
      subscribe((response: any) => {
        this.mobileCountryCodeList = [...response]
        const orgAddress = JSON.parse(localStorage.getItem('ORGNIZATIONADDRESS'));
        if (!_.isEmpty(orgAddress)) {
          const obj = _.find(this.mobileCountryCodeList, { phoneCode: orgAddress.CountryCode })
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
      "FollowAction": this.model.selectedFollowUpTypeId,
      "NextFollowUpDate": this.gs.clientToSqlDateFormat(this.model.followUpDate, this._settings.dateFormat),
      "NextFollowUpTime": this.model.followUpTime ? this.model.followUpTime : "",
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
          "Rate": 0,
          "TotalAmount": item.itemValue,
          "IsAMC": item.isAmc,
          "AMCAmount": item.amcAmount,
          "AMCDurationID": item.amcDurationId
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
      "MeetingWithId": this.model.selectedDesignationId ? this.model.selectedDesignationId : 0,
      "MeetingWithSaleId": this.model.selectedMeetingWithSaleId ? this.model.selectedMeetingWithSaleId : 0,
      "EnquiryTypeId": this.model.selectedEnquiryTypeId ? this.model.selectedEnquiryTypeId : 0,
      "NextFollowUpDate": this.gs.clientToSqlDateFormat(this.model.followUpDate, this._settings.dateFormat),
      "NextFollowUpTime": this.model.followUpTime ? this.model.followUpTime : "",
      // "JobTitle": !this.commonService.isEmpty(this.followUpDetail) ? this.followUpDetail.model.jobTitle : '',
      "Department": !this.commonService.isEmpty(this.followUpDetail) ? this.followUpDetail.model.department : '',
      "FollowAction": this.model.selectedFollowUpTypeId,
      "Status": this.model.selectedEnquiryStatusId,
      "Remark": this.model.remark ? this.model.remark : '',
      "Company": this.model.company,
      "CountryCode": this.model.countryCodeId ? this.model.countryCodeId : 0,
      "ContactNo": this.model.mobileNo,
      "Email": this.model.email,
      "KeyPersonId": this.model.keyPersonId ? this.model.keyPersonId : 0,
      "KeyPersonName": this.model.keyPerson ? this.model.keyPerson : "",
      "NoOfEmployee": !this.commonService.isEmpty(this.followUpDetail) ? this.followUpDetail.model.selectedNoOfEmployeeId : 0,
      "Revenue": !this.commonService.isEmpty(this.followUpDetail) ? this.followUpDetail.model.companyRevenue : 0,
      "WebSite": !this.commonService.isEmpty(this.followUpDetail) ? this.followUpDetail.model.companyWebsite : '',
      "ComapanyName": this.model.company ? this.model.company : '',
      "CustBusinessTypeId": this.model.selectedBusinessTypeId ? this.model.selectedBusinessTypeId : 0,
      "CustIndustryId": !this.commonService.isEmpty(this.followUpDetail) ? this.followUpDetail.model.selectedIndustryTypeId : 0,
      "ListLeadProductDetails": _.map(this.model.itemDetailList, (item) => {
        return {
          "ItemID": item.id,
          "Quantity": item.quantity,
          "Rate": 0,
          "TotalAmount": item.itemValue,
          "IsAMC": item.isAmc,
          "AMCAmount": item.amcAmount,
          "AMCDurationID": item.amcDurationId
        }
      }),
      "ListEmailDetails": this.commonService.isEmpty(this.followUpDetail) ? [] : _.map(this.followUpDetail.model.companyEmailList, (item) => {
        return {
          "EmailAddress": item.email,
          "EmailType": item.id
        }
      }),
      "ListContactinfo": this.commonService.isEmpty(this.followUpDetail) ? [] : _.map(this.followUpDetail.model.companyMobileNoList, (item) => {
        return {
          "ContactNo": item.mobileNo,
          "CountryCode": item.id,
          "ContactType": "1"
        }
      }),
      "ListLeadAddress": this.commonService.isEmpty(this.followUpDetail) ? [] : _.map(this.followUpDetail.model.companyAddressList, (item) => {
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
      "ListLeadContactPerson": this.commonService.isEmpty(this.followUpDetail) ? [] : _.map(this.followUpDetail.model.contactPersonList, (item, index) => {
        return {
          "Id": item.id,
          "Name": item.name,
          "Department": item.departMentName,
          "TypeId": item.designationId,
          "IsDefault": this.followUpDetail.model.defaultCheckedIndex === index ? 1 : 0,
          "CountryCode": item.countryCode,
          "ContactNo": item.mobileNo,
          "EmailType":item.emailType,
          "EmailAddress":item.email,
        }
      }),
      "ListSocialProfile": this.commonService.isEmpty(this.followUpDetail) ? [] : _.map(this.followUpDetail.model.socialProfileList, (item) => {
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
    this.baseService.postRequest(url, data)
      .pipe(
        timeout(2000),
        catchError((error) => {
          this.spinner.hide()
          return of({
            Message: `Connection Slow Please Submit Again`
          })
        })
      ).subscribe((res: any) => {
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
    let focusFieldArray = [
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
        elementId: 'sourceId',
        elementModal: 'selectedSourceId',
        type: 'ng-select'
      },
      {
        elementId: 'followUpdateId',
        elementModal: 'followUpDate',
        type: 'follow-up-date'
      },
      {
        elementId: 'followUpActionId',
        elementModal: 'selectedFollowUpTypeId',
        type: 'ng-select'
      },
    ]

    if (this.setUpToCheckRequiredField === 1) {
      if (!this.model.email && !this.model.mobileNo) {
        focusFieldArray.push({
          elementId: 'mobileId',
          elementModal: 'mobileNo',
          type: 'input'
        },
        {
          elementId: 'emailId',
          elementModal: 'email',
          type: 'input'
        })
      }
    }
    for (let i = 0; i < focusFieldArray.length; i++) {
      if (this.commonService.isEmpty(this.model[focusFieldArray[i].elementModal])) {
        if (focusFieldArray[i].type === 'input') {
          $(`#${focusFieldArray[i].elementId}`).focus()
        } else if (focusFieldArray[i].type === 'ng-select') {
          $(`#${focusFieldArray[i].elementId} input`).focus()
        } else if (focusFieldArray[i].type === 'follow-up-date') {
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

  assignFollowUpData(res) {
    if (!_.isEmpty(res.Data.FollowUpList)) {
      const data = { ...res.Data.FollowUpList[0] };
      if (this.formType === 'follow-up-edit') {
        this.model.selectedSourceId = Number(data.SourceId)
        this.model.selectedFollowUpTypeId = Number(data.FollowAction)
      } else {
        this.model.sourceName = data.SourceName
      }
      this.model.selectedBusinessTypeId = Number(data.BusinessTypeId)
      this.model.selectedEnquiryTypeId = 2
      this.model.selectedMeetingWithSaleId = data.MeetingWithSaleId
      this.model.selectedEnquiryStatusId = data.Status
      this.model.remark = data.Remark
      if (!this.commonService.isEmpty(data.NextFollowUpDate)) {
        if (this.formType === 'follow-up-edit') {
          this.model.followUpDate = this.gs.utcToClientDateFormat(new Date(data.NextFollowUpDate), this._settings.dateFormat)
          setTimeout(() => {
            const t  = new Date(data.NextFollowUpTime)
            $('#timePickerId').timepicker().setTime(t);
          }, 1000);
        } else {
          this.model.lastFollowUpDate = this.gs.utcToClientDateFormat(new Date(data.NextFollowUpDate), this._settings.dateFormat)
        }
      }
    }
    if (!_.isEmpty(res.Data.FollowUpContactPerson)) {
      const currentContactPerson = _.find(res.Data.FollowUpContactPerson, { IsDefault: 1 })
      if (!_.isEmpty(currentContactPerson)) {
        this.model.keyPerson = currentContactPerson.Name
        this.model.leadKeyPerson = currentContactPerson.Name
        this.model.selectedDesignationId = currentContactPerson.TypeId
        this.model.keyPersonId = currentContactPerson.Id
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
          itemValue: item.TotalAmount,
          itemName: item.ItemName,
          isAmc: item.IsAMC,
          amcAmount: item.AMCAmount,
          amcDurationId: item.AMCDurationID
        }
      })
    }
  }

  assignLeadData(res) {
    if (!_.isEmpty(res.Data.LeadList)) {
      const data = { ...res.Data.LeadList[0] };
      if (this.formType) {
        this.model.sourceName = data.SourceName
        if (!this.commonService.isEmpty(data.NextFollowUpDate)) {
          this.model.lastFollowUpDate = this.gs.utcToClientDateFormat(new Date(data.NextFollowUpDate), this._settings.dateFormat)
        }
      }
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
        this.model.followUpTime = data.NextFollowUpTime
      }
    }
    if (!_.isEmpty(res.Data.LeadContactPerson)) {
      const currentContactPerson = _.find(res.Data.LeadContactPerson, { IsDefault: 1 })
      if (!_.isEmpty(currentContactPerson)) {
        this.model.keyPerson = currentContactPerson.Name
        this.model.leadKeyPerson = currentContactPerson.Name
        this.model.selectedDesignationId = currentContactPerson.TypeId
        this.model.keyPersonId = currentContactPerson.Id
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
          itemValue: item.TotalAmount,
          itemName: item.ItemName,
          isAmc: item.IsAMC,
          amcAmount: item.AMCAmount,
          amcDurationId: item.AMCDurationID
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

  onTextSearch(type) {
    if (this.mobileNoSearchText || this.emailSearchText) {
      const query = {
        SearchText: type === 'mobile' ? this.mobileNoSearchText : this.emailSearchText
      }
      this.commonService.getRequest(ApiConstant.CUSTOMER_LEAD_DETAILS, query).subscribe((res) => {
        if (res.Code === 1000 && !_.isEmpty(res.Data)) {
          this.lastLeadDetails = { ...res.Data[0] }
          if (!this.lastLeadDetails.AllowNewEnquiry) {
            this.toastrService.showError('No Enquiry Allow for this customer', '')
            this.model.selectedCustomerId = null;
            // this.onChangeCustomer();
          }
          this.model.selectedCustomerId = this.lastLeadDetails.Id
          this.model.company = this.lastLeadDetails.Customer
          this.model.remark = this.lastLeadDetails.Remark
          this.model.mobileNo = this.lastLeadDetails.ContactNo
          this.model.email = this.lastLeadDetails.Email
          this.mobileNoSearchText = null
          this.emailSearchText = ''
          this.focusOnComapny();
        } else {
          this.lastLeadDetails = {}
          if (type === 'mobile') {
            this.model.mobileNo = this.mobileNoSearchText
          } else {
            this.model.email = this.emailSearchText
          }
          this.mobileNoSearchText = null
          this.emailSearchText = ''
        }
      })
    }
  }

  focusOnComapny() {
    $('#companyId').focus();
  }

  onChangeKeyPerson() {
    if (this.formType && (this.model.keyPerson !== this.model.leadKeyPerson)) {
      this.model.keyPersonId = 0
    }
  }

  onInputChange(e) {
    if (this.commonService.isEmpty(e)) {
      this.model.followUpDate = "";
    }
  }
}


export interface AddLeadInterface {
  leadKeyPerson?: string;
  selectedDesignationId?: number
  selectedBusinessTypeId?: number
  selectedSourceId?: number
  sourceName?: string
  selectedMeetingWithSaleId?: any
  selectedEnquiryTypeId?: any
  selectedCustomerId?: number
  selectedEnquiryStatusId?: any
  countryCodeId?: number
  selectedFollowUpTypeId?: number
  email?: string
  company?: string
  keyPerson?: string
  keyPersonId?: number
  mobileNo?: number
  mobileNoList?: Array<any>
  emailList?: Array<any>
  itemDetailList?: Array<any>
  followUpDate?: any
  lastFollowUpDate?: any
  remark?: string
  selectedRemarkId?: number
  followUpTime?: any
  subscriptionAmount?: number;
  subscriptionDuration?: number;
}
