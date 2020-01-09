import { CompanyProfileService } from './../../start/company-profile/company-profile.service';
import { ToastrCustomService } from './../../commonServices/toastr.service';
import { ApiConstant } from 'src/app/shared/constants/api';
import { BaseServices } from './../../commonServices/base-services';
import { VendorServices } from './../../commonServices/TransactionMaster/vendoer-master.services';
import { CommonService } from './../../commonServices/commanmaster/common.services';
import { CrmService } from './../crm.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { UIConstant } from 'src/app/shared/constants/ui-constant';
import * as _ from 'lodash';

@Component({
  selector: 'app-add-crm-customer',
  templateUrl: './add-crm-customer.component.html',
  styleUrls: ['./add-crm-customer.component.css']
})
export class AddCrmCustomerComponent implements OnInit {
  @Output() closeModal = new EventEmitter();
  countryList: Array<any> = []
  countryId: number
  stateList: Array<any> = []
  stateId: number
  cityList: Array<any> = []
  cityId: number
  mobileCountryCodeList: Array<any> = []
  remark: string
  address: string
  selectedBusinessTypeId: number;
  mobileNo: any
  email: string
  customerName: string
  countryCodeId: any;
  currentContactLength: any;
  editId: any;
  constructor(
    public crmService: CrmService,
    public commonService: CommonService,
    private _vendorService: VendorServices,
    private baseService: BaseServices,
    private toaster: ToastrCustomService,
    private _orgService: CompanyProfileService
  ) {
    this.getCountryList()
    this.getMobileCountryCodeList()
  }

  ngOnInit() {
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
          }
        }
      })
    }
  }


  setCurrentMobileNoLength() {
    if (this.countryCodeId) {
      const index = _.findIndex(this.mobileCountryCodeList, { id: this.countryCodeId })
      if (index !== -1) {
        this.currentContactLength = this.mobileCountryCodeList[index].contactLength
      }
    }
  }


  getMobileCountryCodeList = () => {
    this._orgService.getMobileCountryCodeList().
      subscribe((response: any) => {
        this.mobileCountryCodeList = [...response]
        const orgAddress = JSON.parse(localStorage.getItem('ORGNIZATIONADDRESS'));
        if (!_.isEmpty(orgAddress)) {
          const obj = _.find(this.mobileCountryCodeList, { phoneCode: orgAddress.CountryCode })
          if (!_.isEmpty(obj)) {
            this.countryCodeId = obj.id
            this.setCurrentMobileNoLength()
          }
        }
      }, error => console.log(error))
  }

  openModal(item) {
    if (!_.isEmpty(item)) {
      this.editId = item.Id
      this.countryId = item.CountryId
      this.getStateList(this.countryId, item)
      this.countryCodeId = item.CountryCode
      this.setCurrentMobileNoLength()
      this.mobileNo = item.ContactNo
      this.email = item.EmailAddress
      this.selectedBusinessTypeId = item.BusinessTypeId
      this.customerName = item.CustomerName
      this.address = item.Address
      this.remark = item.Remark
    }
    this.commonService.openModal('add_crm_customer');
  }

  closePopUp(type?) {
    this.commonService.closeModal('add_crm_customer')
    this.closeModal.emit(type);
  }

  submit() {
    const data = {
      "Id": this.editId ? this.editId : 0,
      "CustomerName": this.customerName,
      "BusinessTypeId": this.selectedBusinessTypeId,
      "Remark": this.remark,
      "CountryCode": this.countryCodeId,
      "ContactNo": this.mobileNo,
      "Email": this.email,
      "Address": this.address,
      "CountryId": this.countryId,
      "StateId": this.stateId,
      "CityId": this.cityId
    }
    this.baseService.postRequest(ApiConstant.CRM_LEAD_CUSTOMER, data).subscribe((res) => {
      if(res.Code === 1000) {
        this.toaster.showSuccess('Saved Successfully', '')
        this.closePopUp(true);
      } else {
        this.toaster.showError(res.Message, '')
      }
    })
  }


  focusOnMandatoryField() {
    let focusFieldArray = [
      {
        elementId: 'customerNameId',
        elementModal: 'customerName',
        type: 'input'
      },
      {
        elementId: 'mobileId',
        elementModal: 'mobileNo',
        type: 'input'
      },
      {
        elementId: 'emailId',
        elementModal: 'email',
        type: 'input'
      },
      {
        elementId: 'businessTypeId',
        elementModal: 'selectedBusinessTypeId',
        type: 'ng-select'
      },
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

    ]
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
}
