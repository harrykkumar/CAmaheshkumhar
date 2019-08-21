import { Select2Component } from 'ng2-select2';
import { ToastrCustomService } from './../../../commonServices/toastr.service';
import { CompanyProfileService } from '../../../start/company-profile/company-profile.service';
import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
declare var $: any
import * as _ from 'lodash'
import { UIConstant } from '../../constants/ui-constant';
@Component({
  selector: 'app-add-new-city',
  templateUrl: './add-new-city.component.html',
  styleUrls: ['./add-new-city.component.css']
})
export class AddNewCityComponent implements OnInit {
  @ViewChild('addCityForm') addCityForm 
  @Output() addCityClosed = new EventEmitter()
  countryList: Array<any> = []
  stateList: Array<any> = []
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
    $('#add_new_city').modal(UIConstant.MODEL_SHOW);
  }


  saveCity(data?){
    const requestBody = {
      Id: 0,
      ShortName2: this.model.cityName,
      CommonCode: 103 ,
      CommonId1:this.model.selectedStateId,
      CommonDesc2: this.model.cityName
    }

    this._profileService.addNewCity(requestBody).subscribe((res) => {
      if(res.Code === 1000) {
        this.toastrService.showSuccess('Success', 'City Added Succesfully');
        if (data === 'AddNew') {
          this.resetForm()
        } else {
          const selectedIds = {
            countryId: this.model.selectedCountryId,
            stateId: this.model.selectedStateId,
            cityId: Number(res.Data)
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
    this.model.countryValue = 0
    this.model.stateValue = 0
    this.addCityForm.resetForm()
  }

  closeForm(data?){
    this.resetForm()
    $('#add_new_city').modal(UIConstant.MODEL_HIDE);
    this.addCityClosed.emit(data)
  }
}
