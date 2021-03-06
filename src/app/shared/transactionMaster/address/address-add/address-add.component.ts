import { Component, Output, EventEmitter, ViewChild } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Subscription } from 'rxjs'
import { Select2OptionData, Select2Component } from 'ng2-select2'
import { UIConstant } from '../../../constants/ui-constant';
import { Addresses } from '../../../../model/sales-tracker.model'
import { VendorServices } from '../../../../commonServices/TransactionMaster/vendoer-master.services'
import { CommonService } from '../../../../commonServices/commanmaster/common.services'
import { ToastrCustomService } from '../../../../commonServices/toastr.service'
import { AddNewCityComponent } from '../../../components/add-new-city/add-new-city.component';
import * as _ from 'lodash';
import { CompanyProfileService } from 'src/app/start/company-profile/company-profile.service';
declare const $: any
@Component({
  selector: 'app-address-add',
  templateUrl: './address-add.component.html',
  styleUrls: ['./address-add.component.css']
})
export class AddressAddComponent {
  @Output() onFilter = new EventEmitter()
  addressForm: FormGroup
  subscribe: Subscription
  modalSub: Subscription
  public countryList: Array<Select2OptionData>
  public stateList: Array<Select2OptionData>
  public cityList: Array<Select2OptionData>
  public areaList: Array<Select2OptionData>
  public customerType: Array<Select2OptionData>
  public addressType: Array<Select2OptionData>
  public selectyCoustmoreRegistration: Array<Select2OptionData>
  public addressTypePlaceHolder: Select2Options
  public coustmoerTypePlaceholder: Select2Options
  public areaListPlaceHolder: Select2Options
  public stateListplaceHolder: Select2Options
  public countryListPlaceHolder: Select2Options
  countryError: boolean
  areaForm: FormGroup
  stateId: any
  cityId: any
  addresTypeId: any
  contactId: number = 0
  areaID: any
  legerId: any
  storeAddress: any
  addressError: boolean

  @ViewChild('addCityForm') addCityForm
  countryList1: Array<any> = []
  stateList1: Array<any> = []
  model: any = {}
  dummyModel: any = {}
  constructor (private _formBuilder: FormBuilder,
    private _coustomerServices: VendorServices,
    private _CommonService: CommonService,
    private toastrService: ToastrCustomService,
    private _profileService : CompanyProfileService) {
    this.addTyperessForm()
    this.addArea()
    this.modalSub = this._CommonService.getAddressStatus().subscribe(
      (status: any) => {
        if (status.open) {
          this.legerId = status.ledgerId
          this.openModal()
        } else {
          this.closeModal()
        }
      }
    )
  }

  ngOnDestroy () {
    this.modalSub.unsubscribe()
  }
  openAreaModel () {
    setTimeout(() => {
      this.areaname.nativeElement.focus()
    }, 1000)
    $('#add_area_Popup_main').modal(UIConstant.MODEL_SHOW)
  }
  closeAreaModel () {
    $('#add_area_Popup_main').modal(UIConstant.MODEL_HIDE)
  }
  openModal () {
    this.getCountry(0)
    this.adressType(0)
    $('#addressPopup').modal(UIConstant.MODEL_SHOW)
    // $('#add_area_Popup').modal(UIConstant.MODEL_SHOW)

  }

  closeModal () {
    $('#addressPopup').modal(UIConstant.MODEL_HIDE)
  }

  @ViewChild('areaSelecto2') areaSelect2: Select2Component
@ViewChild ('areaName') areaname 
  countrId: any
  countryName: any
  selectCountryListId (event) {
    if (event.data.length > 0) {
      this.countrId = event.value
      this.countryName = event.data[0].text
      this.countryError = false
      if (this.countrId > 0) {
        this.getStaeList(this.countrId, 0)

      }
    }
  }
  countryValue: any
  getCountry (value) {
    this.subscribe = this._coustomerServices.getCommonValues('101').subscribe(Data => {
      this.countryListPlaceHolder = { placeholder: 'Select Country' }
      this.countryList = [{ id: UIConstant.BLANK, text: 'select Country' }]
      Data.Data.forEach(element => {
        this.countryList.push({
          id: element.Id,
          text: element.CommonDesc
        })
      })
      this.countryValue = value
    })
  }
  stateValue: any
  getStaeList (id, value) {
    this.subscribe = this._coustomerServices.gatStateList(id).subscribe(Data => {
      this.stateListplaceHolder = { placeholder: 'Select State' }
      this.stateList = [{ id: UIConstant.BLANK, text: 'select State' }]
      Data.Data.forEach(element => {
        this.stateList.push({
          id: element.Id,
          text: element.CommonDesc1
        })
      })
      this.stateValue = value
    })
  }
  stateError: boolean
  StateName: any
  selectStatelist (event) {
    // console.log(event ,"sts")
    if (event.data.length > 0) {
      this.stateId = event.value
      this.StateName = event.data[0].text
      this.stateError = false
      if (this.stateId > UIConstant.ZERO) {
        this.getCitylist(this.stateId, 0)
      }
    }
  }
  cityValue: any
  getCitylist (id, value) {
    this.subscribe = this._coustomerServices.getCityList(id).subscribe(Data => {
      this.cityList = [{id: '0', text: 'Select City'}, {id: '-1', text: UIConstant.ADD_NEW_OPTION}]
      Data.Data.forEach(element => {
        this.cityList.push({
          id: element.Id,
          text: element.CommonDesc2
        })
      })
      this.cityValue = value
    })
  }
  get add () { return this.addressForm.controls }
  get adAre () { return this.areaForm.controls }
  cityError: boolean
  cityName: any
  @ViewChild('addNewCityRef') addNewCityRefModel  : AddNewCityComponent
  selectedCityId (event) {
    if (event.data.length > 0) {
      this.cityId = +event.value
      this.cityName = event.data[0].text
      this.cityError = false
      if (this.cityId === -1) {
        const data = {
          countryList: !_.isEmpty(this.countryList) ?  [...this.countryList] : [],
          stateList: !_.isEmpty(this.stateList)  ? [...this.stateList] : [],
          countryId: (this.countrId) ? this.countrId : 0,
          stateId: (this.stateId) ? this.stateId : 0
        }
        this.openModal1(data);
      }
      if (this.cityId > 0) {
        this.getAreaId(this.cityId)
      }
    }
  }

  private getAreaId (id) {
    // // debugger
    // this.openAreaModel()
    this.subscribe = this._coustomerServices.getAreaList(id).subscribe(Data => {
      console.log(' area list : ', Data)
      this.areaListPlaceHolder = { placeholder: 'Select Area' }
      this.areaList = [{ id: UIConstant.BLANK, text: 'select Area' }, { id: '0', text: '+Add New' }]
      if (Data.Code === 1000 && Data.Data.length > 0) {
        Data.Data.forEach(element => {
          this.areaList.push({
            id: element.Id,
            text: element.CommonDesc3
          })
        })

      }

     // console.log(this.areaList, Data.Data, "arelist")

    })
  }

  private addTyperessForm () {
    this.addressForm = this._formBuilder.group({
      'address': [UIConstant.BLANK, Validators.required],
      'postcode': [UIConstant.BLANK, Validators.required]
    })
  }
  addArea () {
    this.areaForm = this._formBuilder.group({
      'areaName': ['', Validators.required]
    })
  }
  addAreaClick: boolean
  areNameId: any
  areaName: any
  areaAdd () {
    this.addAreaClick = true
    // // debugger
    const addValue = {
      Id: 0,
      CommonDesc3: this.areaForm.value.areaName,
      ShortName3: this.areaForm.value.areaName,
      CommonCode: 104,
      CommonId2: this.cityId
    }
    if (this.areaForm.valid && this.cityId > 0) {
      this.subscribe = this._CommonService.addAreaNameUnderCity(addValue).subscribe(data => {
        if (data.Code === UIConstant.THOUSAND && data.Data.length > 0) {
          //  const Send = { id: data.Data, name: this.areaForm.value.areaName }

          let newData = Object.assign([], this.areaList)
          newData.push({ id: data.Data, text: this.areaForm.value.areaName })
          this.areaList = newData
          this.areNameId = data.Data
          this.areaID = data.Data
          this.areaName = this.areaForm.value.areaName

          //   this.saleService.closeAddress({ ...Send })
          this.toastrService.showSuccess('Success', 'Area Added !')
          this.areaForm.reset()
          this.closeAreaModel()
        }
        if (data.Code === UIConstant.SERVERERROR) {
          this.toastrService.showError('Error', data.Description)
          this.closeAreaModel()

        }
      })
    }
  }

  selectedArea (event) {
    if (event.data.length > 0) {
      if (event.data[0].selected) {
        if (event.data[0].id !== '0') {
          if (event.data[0].text) {
            this.areaID = event.value
            this.areaName = event.data[0].text
          }
        } else {
          this.areaSelect2.selector.nativeElement.value = ''
          this.openAreaModel()
        }
      }

    }

  }
  addressValue: any
  addTypeName: any
  adressType (value) {
    this.addressTypePlaceHolder = { placeholder: 'Select Address Type' }
    this.addressType = [{ id: UIConstant.BLANK, text: 'Select Address Type' }, { id: '1', text: 'Personal' }, { id: '2', text: 'Work' }, { id: '3', text: 'Postal' }, { id: '4', text: 'Other' }]
    this.addTypeName = this.addressType[1].text
    this.addresTypeId = this.addressType[1].id
    console.log(this.addresTypeId, 'jj')

  }

  selectedAddressTypeId (event) {
    this.addresTypeId = event.value
    if (event && event.data.length > 0) {
      if (event.data[0].id !== '') {
        this.addTypeName = event.data[0].text
      }
    }
    this.addressError = false

  }

  addressDetailsValidation () {
    if (this.countrId > 0) {
      this.countryError = false
    } else {
      this.countryError = true
    }
    if (this.stateId > 0) {
      this.stateError = false
    } else {
      this.stateError = true
    }

    if (this.cityId > 0) {
      this.cityError = false
    } else {
      this.cityError = true
    }
    if (this.addresTypeId > 0) {
      this.addressError = false
    } else {
      this.addressError = true
    }

  }
  close () {
    this.getCountry(0)
    this.addressForm.reset()
  }
  addressClick: boolean
  // {
  // addressRequest.Id = 0/Id,
  // addressRequest.AddressType = Home Person,
  // addressRequest.AddressValue,
  // addressRequest.AreaId,
  // addressRequest.CityId,
  // addressRequest.CountryId,
  // addressRequest.StateId,
  // addressRequest.PostCode,
  // addressRequest.ParentId =Customer or
  // addressRequest.ParentTypeId=5
  // }

  onSaveAddress () {
    // // debugger
    this.addressClick = true
    this.addressDetailsValidation()
    // // debugger
    if (this.countrId > 0 && this.stateId > 0 && this.cityId > 0 && this.addressForm.value.address) {
      this.subscribe = this._CommonService.postAddNewAddress(this.addressParam()).subscribe(data => {
        if (data.Code === 1000 && data.Data.length > 0) {

          const dataToSend = { id: data.Data, stateId: this.stateId ,name: this.addTypeName + '-' + this.addressForm.value.address + ',' + this.areaName + ',' + this.cityName + ',' + this.StateName + ',' + this.countryName }
          this._CommonService.closeAddress({ ...dataToSend })
          this.closeModal()
          this.toastrService.showSuccess('Success', 'Added successfully')
          this.close()
          console.log(dataToSend ,'addes')

        }
        if (data.Code === 5001) {
          this.toastrService.showError('Error', data.Description)
        }
        if (data.Code === 5000) {
          this.toastrService.showError('Error', data.Description)
        }
      })
    }
  }
  addressParam (): Addresses {
    // // // debugger;
    const Obj = {
      addressObj: {
        Id: 0,
        AddressType: this.addresTypeId,
        AddressValue: this.addressForm.value.address,
        AreaId: this.areaID,
        CityId: this.cityId,
        CountryId: this.countrId,
        StateId: this.stateId,
        PostCode: this.addressForm.value.postcode,
        ParentId: this.legerId,
        ParentTypeId: 5
      } as Addresses
    }
    console.log(Obj.addressObj, 'add address')
    return Obj.addressObj
  }

  onStateSelectionChange(event) {
    this.model.selectedStateId = Number(event.value)
}

onCountrySelectionChange(event) {
    this.model.selectedCountryId = Number(event.value)
  if (this.model.selectedCountryId > 0) {
    this._profileService.getStateList(this.model.selectedCountryId).subscribe((res) => {
      this.stateList1 = [{ id: UIConstant.ZERO, text: 'Select State' }, ...res]
      if (!_.isEmpty(this.dummyModel) && this.dummyModel.stateValue > 0) {
        this.model.stateValue = this.dummyModel.stateValue
        this.dummyModel.stateValue = null
      }
    })
  } else {
    this.stateList1 = [{ id: UIConstant.ZERO, text: 'Select State' }];
  }
}

openModal1(Data?){
  // debugger
  this.countryList1 = [...Data.countryList]
  this.model.countryValue = Data.countryId
  if (Number(Data.stateId) > 0) {
    this.dummyModel.stateValue = Number(Data.stateId)
  }
  $('#city_modal').modal(UIConstant.MODEL_SHOW)

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
    if(res.Code === UIConstant.THOUSAND) {
      this.toastrService.showSuccess('Success', 'City Added Succesfully');
      if (data === 'AddNew') {
        this.resetForm()
      } else {
        const selectedIds = {
          countryId: this.model.selectedCountryId,
          stateId: this.model.selectedStateId,
          cityId: Number(res.Data),
          cityName: this.model.cityName
        }
        this.closeForm(selectedIds)
      }
    } else {
      this.toastrService.showError('Error', res.Message);
    }
  })
}

  resetForm(){
    this.stateList1 = [{ id: UIConstant.ZERO, text: 'Select State' }];
    this.model.countryValue = 0
    this.model.stateValue = 0
    this.addCityForm.resetForm()
  }

  closeForm(data?){
    this.resetForm()
    $('#city_modal').modal(UIConstant.MODEL_HIDE);
    if (!_.isEmpty(data) && data.cityId > 0) {
      this.countryValue = data.countryId
      this.countrId = data.countryId
      let newData = Object.assign([], this.cityList)
      newData.push({ id: data.cityId, text: data.cityName })
      this.cityList = newData
      setTimeout(() => {
        this.stateValue = data.stateId
        this.stateId = data.stateId
      }, 2000)
      setTimeout(() => {
        this.cityValue = data.cityId
        this.cityId = data.cityId
      }, 4000)
    } else {
      this.cityValue = 0
    }
  }
}
