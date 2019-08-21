import { CompanyProfileService } from '../../../start/company-profile/company-profile.service';
import { ToastrCustomService } from './../../../commonServices/toastr.service';
import { Component, OnInit, EventEmitter, ViewChild, Output } from '@angular/core';
declare var $: any
import * as _ from 'lodash'
import { UIConstant } from '../../constants/ui-constant';
@Component({
  selector: 'app-add-new-area',
  templateUrl: './add-new-area.component.html',
  styleUrls: ['./add-new-area.component.css']
})
export class AddNewAreaComponent implements OnInit {
  @ViewChild('addAreaForm') addAreaForm 
  @ViewChild('addNewCityFromAreaRef') addNewCityFromAreaRefModel 
  @Output() addAreaClosed = new EventEmitter()
  countryList: Array<any> = []
  stateList: Array<any> = []
  cityList: Array<any> = []
  model: any = {}
  dummyModel: any = {}
  constructor(
    private _profileService : CompanyProfileService,
    private toastrService: ToastrCustomService,
  ) { }

  ngOnInit() {
  }

  onStateSelectionChange(event) {
      this.model.selectedStateId = Number(event.value)
      if (this.model.selectedStateId > 0) {
        this._profileService.getCityList(this.model.selectedStateId).subscribe((res) => {
          this.cityList = [
            { id: 0, text: 'Select City' },
            { id: -1, text: '+Add New' },
            ...res]
            if (!_.isEmpty(this.dummyModel) && this.dummyModel.cityValue > 0) {
              this.model.cityValue = this.dummyModel.cityValue
              this.dummyModel.cityValue = null
            }
        })
      } else {
        this.cityList = [
        { id: 0, text: 'Select City' },
        { id: -1, text: '+Add New' }]
      }
  }

  onCitySelectionChange(event){
    this.model.selectedCityId = Number(event.value)
  }

  onCountrySelectionChange(event) {
    this.model.selectedCountryId = Number(event.value)
    if (this.model.selectedCountryId > 0) {
      this._profileService.getStateList(this.model.selectedCountryId).subscribe((res) => {
        this.stateList = [{ id: UIConstant.ZERO, text: 'Select State' }, ...res]
        if (!_.isEmpty(this.dummyModel) && this.dummyModel.stateValue > 0) {
          this.model.stateValue = this.dummyModel.stateValue
          this.dummyModel.stateValue = null
        }
      })
    } else {
      this.stateList = [{ id: UIConstant.ZERO, text: 'Select State' }];
    }
  }

  openModal(Data?){
    this.countryList = [...Data.countryList]
    this.model.countryValue = Data.countryId
    if (Number(Data.stateId) > 0) {
      this.dummyModel.stateValue = Number(Data.stateId)
    }
    if (Number(Data.cityId) > 0) {
      this.dummyModel.cityValue = Number(Data.cityId)
    }
    $('#add_new_area').modal(UIConstant.MODEL_SHOW);
  }


  saveArea(data?){
    const requestBody = {
      Id:0,
      CommonDesc3:this.model.areaName,
      ShortName3:this.model.areaName,
      CommonCode:104,
      CommonId2:this.model.selectedCityId
    }

    this._profileService.addNewArea(requestBody).subscribe((res) => {
      if(res.Code === 1000) {
        this.toastrService.showSuccess('Success', 'Area Added Succesfully');
        if (data === 'AddNew') {
          this.resetForm()
        } else {
          const selectedIds = {
            countryId: this.model.selectedCountryId,
            stateId: this.model.selectedStateId,
            cityId: this.model.selectedCityId,
            areaId: Number(res.Data)
          }
          this.closeForm(selectedIds)
        }
      } else {
        this.toastrService.showError('Error', res.Message);
      }
    })
  }

  resetForm(){
    this.stateList = [{ id: UIConstant.ZERO, text: 'Select State' }];
    this.cityList = [{ id: 0, text: 'Select City' },
    { id: -1, text: '+Add New' }]
    this.model.countryValue = 0
    this.model.stateValue = 0
    this.model.cityValue = 0
    this.addAreaForm.resetForm()
  }

  closeForm(data?){
    this.resetForm()
    $('#add_new_area').modal(UIConstant.MODEL_HIDE);
    this.addAreaClosed.emit(data)
  }
}
