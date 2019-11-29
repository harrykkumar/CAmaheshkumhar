import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { VendorServices } from 'src/app/commonServices/TransactionMaster/vendoer-master.services';
import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { AddNewCityComponent } from '../shared/components/add-new-city/add-new-city.component';
import { UIConstant } from '../shared/constants/ui-constant';
@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.css']
})
export class AddAddressComponent implements OnInit {
  @Output() closeModal = new EventEmitter();
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
  editAddressId: number;
  address: string;
  @ViewChild('addNewCityRef') addNewCityRefModel  : AddNewCityComponent
  constructor(
    private _vendorService: VendorServices,
    private _commonService: CommonService
  ) { }

  ngOnInit() {
    this.getCountryList()
    this.getAddressTypeList()
  }

  openModal(item?) {
    this._commonService.openModal('add_address');
    if (!_.isEmpty(item)) {
      this.editAddressId = item.editAddressId
      this.countryId = item.countryId
      this.getStateList(this.countryId, item)
      this.stateId = item.stateId
      this.cityId = item.cityId
      this.areaId = item.areaId
      this.addressTypeId = item.addressTypeId
      this.address = item.address
    }
  }

  closePopUp(data?) {
    this._commonService.closeModal('add_address')
    this.closeModal.emit(data);
  }

  submit() {
    const countryIndex = _.findIndex(this.countryList, { Id: this.countryId })
    const stateIndex = _.findIndex(this.stateList, { Id: this.stateId })
    const cityIndex = _.findIndex(this.cityList, { Id: this.cityId })
    const areaIndex = _.findIndex(this.areaList, { Id: this.areaId })
    const addressTypeIndex = _.findIndex(this.addressTypeList, { Id: this.addressTypeId })
    const data = {
      editAddressId: this.editAddressId ? this.editAddressId : 0,
      countryId: this.countryId,
      countryName: countryIndex !== -1 ? this.countryList[countryIndex].CommonDesc : '',
      stateId: this.stateId,
      stateName: stateIndex !== -1 ? this.stateList[stateIndex].CommonDesc1 : '',
      cityId: this.cityId,
      cityName: cityIndex !== -1 ? this.cityList[cityIndex].CommonDesc2 : '',
      areaId: this.areaId,
      areaName: areaIndex !== -1 ? this.areaList[areaIndex].CommonDesc3 : '',
      addressTypeId: this.addressTypeId,
      addressTypeName: addressTypeIndex !== -1 ? this.addressTypeList[addressTypeIndex].CommonDesc : '',
      address: this.address,
      displayLabel: `${this.address}`
    }
    this.closePopUp(data);
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
            this.stateId = Number(item.stateId)
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
            this.cityId = Number(item.cityId)
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
      this.addNewCityRefModel.openModal(data);
    } else {
      if (cityCode > 0) {
        this._vendorService.getAreaList(cityCode).subscribe((res) => {
          if (res.Code === UIConstant.THOUSAND && !_.isEmpty(res.Data)) {
            this.areaList = [...res.Data];
            if (!_.isEmpty(item)) {
              this.areaId = Number(item.areaId);
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

  addCityClosed(selectedIds?) {
    // if (!_.isEmpty(selectedIds) && selectedIds.cityId > 0) {
    //   this.model.countryCodeId = selectedIds.countryId
    //   this.dummyData.stateCodeId = selectedIds.stateId
    //   this.dummyData.cityCodeId = selectedIds.cityId;
    // } else {
    //   this.model.cityCodeId = 0
    // }
  }
}
