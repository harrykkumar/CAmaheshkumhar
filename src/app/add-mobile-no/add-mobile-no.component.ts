import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { CompanyProfileService } from './../start/company-profile/company-profile.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
@Component({
  selector: 'app-add-mobile-no',
  templateUrl: './add-mobile-no.component.html',
  styleUrls: ['./add-mobile-no.component.css']
})
export class AddMobileNoComponent implements OnInit {
  @Output() closeModal = new EventEmitter();
  mobileCountryCodeList: Array<any> = []
  mobileNo: number;
  editId: number;
  selectedCountryCodeId: number;
  currentContactLength: number;
  constructor(
    private _orgService: CompanyProfileService,
    public _commonService: CommonService
  ) {
    this.getMobileCountryCodeList()
   }

  ngOnInit() {
  }

  /* Funtion to get all the mobile country code list  */
  getMobileCountryCodeList = () => {
    this._orgService.getMobileCountryCodeList().
      subscribe((response: any) => {
        this.mobileCountryCodeList = [...response]
        const orgAddress = JSON.parse(localStorage.getItem('ORGNIZATIONADDRESS'));
        if (!_.isEmpty(orgAddress)) {
          const obj = _.find(this.mobileCountryCodeList, { phoneCode: orgAddress.CountryCode })
          if (!_.isEmpty(obj)) {
            this.selectedCountryCodeId = obj.id
            this.setCurrentMobileNoLength()
          }
        }
      }, error => console.log(error))
  }

  setCurrentMobileNoLength() {
    if (this.selectedCountryCodeId) {
      const index = _.findIndex(this.mobileCountryCodeList, { id: this.selectedCountryCodeId })
      if (index !== -1) {
        this.currentContactLength = this.mobileCountryCodeList[index].contactLength
      }
    }
  }

  openModal(item) {
    this._commonService.openModal('add_new_mobileNo');
    if (!_.isEmpty(item)) {
      this.editId = item.editId
      this.selectedCountryCodeId = item.id
      this.mobileNo = item.mobileNo
    }
  }

  closePopUp(data?) {
    this._commonService.closeModal('add_new_mobileNo')
    this.closeModal.emit(data);
  }

  submit() {
    const data = {
      editId : this.editId ? this.editId : 0,
      id: this.selectedCountryCodeId,
      mobileNo: this.mobileNo,
      displayLabel: `+${this.selectedCountryCodeId}-${this.mobileNo}`
    }
    this.closePopUp(data);
  }

}
