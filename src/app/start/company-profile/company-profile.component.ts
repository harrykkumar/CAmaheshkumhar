import { AddNewAreaComponent } from './../../shared/components/add-new-area/add-new-area.component';
import { AddNewCityComponent } from './../../shared/components/add-new-city/add-new-city.component';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { GlobalService } from 'src/app/commonServices/global.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Settings } from './../../shared/constants/settings.constant';
import { UIConstant } from './../../shared/constants/ui-constant';
import { ItemmasterServices } from './../../commonServices/TransactionMaster/item-master.services';
import { ToastrCustomService } from './../../commonServices/toastr.service';
import { Component, OnInit, ViewChild, Input, Output, SimpleChanges, OnChanges, EventEmitter, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { OrganisationProfileService } from '../header/organisation-profile/organisation-profile.service';
import { takeUntil } from 'rxjs/operators';
declare var $: any
import * as _ from 'lodash'
import { Select2Component } from 'ng2-select2';


@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit, OnChanges {
  @ViewChild('addNewCityRef') addNewCityRefModel  : AddNewCityComponent
  @ViewChild('addNewAreaRef') addNewAreaRefModel  : AddNewAreaComponent
  @ViewChild('mobileDetailModel') mobileDetailModel
  @ViewChild('emailDetailModel') emailDetailModel
  @ViewChild('bankFormModel') bankFormModel
  @ViewChild('addressFormModel') addressFormModel
  @ViewChild('keyPersonFormModel') keyPersonFormModel
  @ViewChild('orgProfileFormModel') orgProfileFormModel
  @ViewChild('industryTypeSelect') industryTypeSelect : Select2Component
  @ViewChild('registrationTypeSelect') registrationTypeSelect : Select2Component
  @ViewChild('branchTypeSelect') branchTypeSelect : Select2Component
  @ViewChild('finYearSelect') finYearSelect : Select2Component
  @ViewChild('mobileCountryCodeSelect') mobileCountryCodeSelect : Select2Component
  @ViewChild('countrySelect') countrySelect : Select2Component
  @ViewChild('stateSelect') stateSelect : Select2Component
  @ViewChild('citySelect') citySelect : Select2Component
  @ViewChild('areaSelect') areaSelect : Select2Component
  @ViewChild('addressTypeSelect') addressTypeSelect : Select2Component
  @ViewChild('accMethodSelect') accMethodSelect : Select2Component
  @ViewChild('contactNoSelect') contactNoSelect : Select2Component
  @ViewChild('keyPersonSelect') keyPersonSelect : Select2Component
  @ViewChild('companyNameModel') companyNameModel : ElementRef
  @Input('modalData') modalData: any;
  @Output() closeModal = new EventEmitter();
  private unSubscribe$ = new Subject<void>()
  imageList: any = { images: [], queue: [], safeUrls: [], baseImages: [], id: [], imageType: 'logo' }
  ImageFiles: any = []
  model: any = {}
  personalDetailModel:any = {}
  dummyData: any = {}
  emailDetail: any = {}
  mobileDetail: any = {}
  editEmailDetailIndex: number = null
  editMobileDetailIndex: number = null
  keyPersonTypeList: Array<any> = []
  industryTypeList: Array<any> = []
  subIndustryTypeList: Array<any> = []
  registrationTypeList: Array<any> = []
  mobileTypeList: Array<any> = []
  mobileCountryCodeList: Array<any> = []
  personalDetail: any = {}
  keyPersonDetail: any = {}
  emailTypeList: Array<any> = []
  countryList: Array<any> = []
  stateList: Array<any> = []
  cityList: Array<any> = []
  areaList: Array<any> = []
  // finYearIdList: Array<any> = []
  addressTypeList: Array<any> = []
  addressDetail: any = {}
  addressDetailArray: Array<any> = []
  editAddressDetailIndex: number = null
  bankDetail: any = {}
  bankDetailArray: Array<any> = []
  editBankDetailIndex: number = null
  keyPersonDetailArray: Array<any> = []
  editKeyPersonDetailIndex: number = null
  statutoryDetail: any = {}
  accMethodList: Array<any> = []
  branchTypeList:Array<any> = []
  clientDateFormat: any
  editId: any;
  finSessionList:Array<any> = []
  constructor (
    public _globalService: GlobalService,
    private _orgService: OrganisationProfileService,
    private toastrService: ToastrCustomService,
    public _commonService: CommonService,
    private itemMaster: ItemmasterServices,
    public _settings: Settings,
    private _route: ActivatedRoute,
    private router: Router
  ) {
    if(this._settings.dateFormat) {
      this.clientDateFormat = this._settings.dateFormat
    }
    this._settings.dateFormat = 'd-m-Y'  
    this._route.paramMap.subscribe((parameters) => {
      this.editId = parameters.get('id');
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.modalData && this.modalData.open === true) {
      if (!this.registrationTypeSelect.value || Number(this.registrationTypeSelect.value) !== 1) {
        this.personalDetailModel.registrationTypeId = 1;
      }
      if(this.modalData.editId) {
        this.getOrgProfileData()
      }
      $('#companyOrganisationModal').modal(UIConstant.MODEL_SHOW)
    } else if (this.modalData && this.modalData.open === false) {
      $('#companyOrganisationModal').modal(UIConstant.MODEL_HIDE)
      this.resetFormData();
    }
  }

  // tslint:disable-next-line:no-empty
  ngOnInit () {
    this.initDropDownData()
    this.getUploadedImages()
  }
  

  /* Function to initialise dropdown list data */
  initDropDownData = async () => {
    this.personalDetail.mobileArray = []
    this.personalDetail.emailArray = []
    this.stateList = [{ id: UIConstant.ZERO, text: 'Select State' }]
    this.cityList = [
      { id: 0, text: 'Select City' },
      { id: -1, text: '+Add New' }
    ]
    this.areaList = [
    { id: 0, text: 'Select Area' },
    { id: -1, text: '+Add New' }]
    this.addressTypeList = await this._orgService.getAddressTypeList()
    this.registrationTypeList = this._orgService.getRegistrationTypeList()
    this.industryTypeList = await this._orgService.getIndustryTypeList()
    this.branchTypeList = await this._orgService.getBranchTypeList()
    this.countryList = await this._orgService.getCountryList()
    this.accMethodList = await this._orgService.getAccountingMethod()
    // this.finYearIdList = await this._orgService.getFinYearIdList()
    this.finSessionList = await this._orgService.getFinSessionList()
    this.getMobileCountryCodeList()
    this.getMobileTypeList()
    this.getEmailTypeList()
  }


  /* Function to reset all the form data fields on close of profile */
  resetFormData = () => {
    this.emailDetail = {
      selectedEmailType: 1,
      selectedEmail: ''
    }
    this.mobileDetail = {
      selectedMobileType: 1,
      selectedMobileCountryCode:
        { id: UIConstant.ZERO, text: 'Select Country Code' },
      mobileNo: ''
    }
    this.personalDetail = {}
    this.personalDetail.mobileArray = []
    this.personalDetail.emailArray = []
    if (!_.isEmpty(this.industryTypeSelect) && this.industryTypeSelect.value && Number(this.industryTypeSelect.value) > 0 ) {
      this.industryTypeSelect.setElementValue(0);
    }
    if (!_.isEmpty(this.finYearSelect) && this.finYearSelect.value && Number(this.finYearSelect.value) > 0) {
      this.finYearSelect.setElementValue(0)
    }
    if (!_.isEmpty(this.branchTypeSelect) && this.branchTypeSelect.value && Number(this.branchTypeSelect.value) > 0) {
      this.branchTypeSelect.setElementValue(0)
    }
    if (!_.isEmpty(this.mobileCountryCodeSelect.value) && this.mobileCountryCodeSelect.value && Number(this.mobileCountryCodeSelect.value) > 0) {
      this.mobileCountryCodeSelect.setElementValue(0)
    }
    if (!_.isEmpty(this.countrySelect.value) && this.countrySelect.value && Number(this.countrySelect.value) > 0) {
      this.countrySelect.setElementValue(0);

    }
    if (!_.isEmpty(this.stateSelect.value) && this.stateSelect.value && Number(this.stateSelect.value) > 0 ) {
      this.stateSelect.setElementValue(0)
    }
    if (!_.isEmpty(this.citySelect.value) && this.citySelect.value && Number(this.citySelect.value) > 0 ) {
      this.citySelect.setElementValue(0)

    }
    if (!_.isEmpty(this.areaSelect.value) && this.areaSelect.value && Number(this.areaSelect.value) > 0 ) {
      this.areaSelect.setElementValue(0)

    }
    if (!_.isEmpty(this.addressTypeSelect.value) && this.addressTypeSelect.value && Number(this.addressTypeSelect.value) > 0 ) {
      this.addressTypeSelect.setElementValue(0)

    }
    if (!_.isEmpty(this.keyPersonSelect.value) && this.keyPersonSelect.value && Number(this.keyPersonSelect.value) > 0 ) {
      this.keyPersonSelect.setElementValue(0)

    }
    if (!_.isEmpty(this.contactNoSelect.value) && this.contactNoSelect.value && Number(this.contactNoSelect.value) > 0 ) {
      this.contactNoSelect.setElementValue(0)
    }
    this.addressDetailArray = []
    this.keyPersonDetailArray = []
    this.bankDetailArray = []
    this.statutoryDetail = {}
    this.accMethodList = []
    this.imageList = []
    this.editAddressDetailIndex = null
    this.editBankDetailIndex = null
    this.editKeyPersonDetailIndex = null
    this.addressFormModel.resetForm()
    this.keyPersonFormModel.resetForm()
    this.bankFormModel.resetForm()
    this.orgProfileFormModel.resetForm()
    $('.active').removeClass('active');
    $('#activeTab').click();
  }


  /* Function invoke on key person type selection change and assign new value */
  onKeyPersonTypeSelectionChange = (event) => {
    if (event.data.length > 0) {
      this.keyPersonDetail.selectedKeyPersonType = event.data[0]
    }
  }

  /* Function invoke on industry type selection change and assign new value */
  onIndustryTypeSelectionChange = (event) => {
    if (event.data.length > 0) {
      this.personalDetail.selectedIndustryType = event.data[0]
      this.subIndustryTypeList = [...this._orgService.getSubIndustryTypeList(Number(event.value))]
    }
  }

  /* Function for sub industry  */
  onSubIndustryTypeSelectionChange = (event) => {
    if (event.data.length > 0) {
      this.personalDetail.selectedSubIndustry = event.data[0]
    }
  }


    /* Function invoke on industry type selection change and assign new value */
    // onFinYearIdSelectionChange = (event) => {
    //   if (event.data.length > 0) {
    //     this.personalDetail.selectedFinYearId = event.data[0]
    //   }
    // }

    onFinSessionSelectionChange = (event) => {
      if (event.data.length > 0) {
        this.personalDetail.selectedFinSession = event.data[0]
        this.setEndDateOnSessionChange()
      }
    }

  setEndDateOnSessionChange() {
    let month, session, year;
    if (!_.isEmpty(this.personalDetail.selectedFinSession) && this.personalDetail.selectedFinSession.shortName && this.personalDetail.storedBookStartDate) {
      month = Number(this.personalDetail.storedBookStartDate.split('-')[1])
      year = Number(this.personalDetail.storedBookStartDate.split('-')[2])
      session = Number(this.personalDetail.selectedFinSession.shortName.split('/')[0])
      this.setEndDataValue(month, session, year)
    }
  }

  setEndDataValue(month, session, year) {
    if (session > month) {
      let endDate = `${this.personalDetail.selectedFinSession.shortName}/${year}`
      endDate = this._globalService.utcToClientDateFormat(endDate, 'd-m-Y')
      this.personalDetail.bookEndDate = `${this.personalDetail.storedBookStartDate}---${endDate}`
    } else if (session === month) {
    } else if (session < month) {
      const modifiedYear = year + 1
      let endDate = `${this.personalDetail.selectedFinSession.shortName}/${modifiedYear}`
      endDate = this._globalService.utcToClientDateFormat(endDate, 'd-m-Y')
      this.personalDetail.bookEndDate = `${this.personalDetail.storedBookStartDate}---${endDate}`
    }
  }

  onBookStartDateChange(event) {
    let month, session, year
    this.personalDetail.storedBookStartDate = event  
    if (!_.isEmpty(this.personalDetail.selectedFinSession) && this.personalDetail.selectedFinSession.shortName && event) {
      month = Number(this.personalDetail.storedBookStartDate.split('-')[1])
      year = Number(this.personalDetail.storedBookStartDate.split('-')[2])
      session = Number(this.personalDetail.selectedFinSession.shortName.split('/')[0])
      this.setEndDataValue(month, session, year)
    }
  }

  /* Function invoke on registration type selection change and assign new value */
  onRegistrationTypeSelectionChange = (event) => {
    if (event.data.length > 0) {
      this.personalDetail.selectedRegistrationType = event.data[0]
    }
  }

  onBranchTypeSelectionChange = (event) => {
    if (event.data.length > 0) {
      this.personalDetail.selectedBranchType = event.data[0]
      this.getKeyPersonTypeList(Number(event.value))
    }
  }

  /* Function invoke on country dropdown selection change */
  onCountrySelectionChange = (event) => {
    if (event.data.length > 0) {
      this.addressDetail.selectedCountry = event.data[0]
    }
    if (this.addressDetail.selectedCountry && this.addressDetail.selectedCountry.id > UIConstant.ZERO) {
      this.getStateList(this.addressDetail.selectedCountry.id)
    } else {
      this.stateList = [{ id: UIConstant.ZERO, text: 'Select State' }];
    }
  }

  /* Function invoke on state dropdown selection change */
  onStateSelectionChange = (event) => {
    if (event.data.length > 0) {
      this.addressDetail.selectedState = event.data[0]
    }
    if (this.addressDetail.selectedState && this.addressDetail.selectedState.id > UIConstant.ZERO) {
      this.getCityList(this.addressDetail.selectedState.id)
    } else {
      this.cityList = [
      { id: 0, text: 'Select City' },
      { id: -1, text: '+Add New' },]
    }
  }

  /* Function invoke on city dropdown selection change and assign new value */
  onCitySelectionChange = (event) => {
    if(Number(event.value) === -1) {
      const data = {
        countryList: !_.isEmpty(this.countryList) ?  [...this.countryList] : [],
        countryId: !_.isEmpty(this.addressDetail.selectedCountry) ? this.addressDetail.selectedCountry.id : 0,
        stateId: !_.isEmpty(this.addressDetail.selectedState) ? this.addressDetail.selectedState.id : 0
      }
      this.addNewCityRefModel.openModal(data);
    }
    if (event.data.length > 0) {
      this.addressDetail.selectedCity = event.data[0]
    }
    if (this.addressDetail.selectedCity && this.addressDetail.selectedCity.id > UIConstant.ZERO) {
      this.getAreaList(this.addressDetail.selectedCity.id)
    } else {
      this.areaList = [
      { id: 0, text: 'Select Area' },
      { id: -1, text: '+Add New' }]
    }
  }

  /* Function invoke on area dropdown selection change and assign new value */
  onAreaSelectionChange = (event) => {
    if(Number(event.value) === -1) {
      const data = {
        countryList: !_.isEmpty(this.countryList) ?  [...this.countryList] : [],
        countryId: !_.isEmpty(this.addressDetail.selectedCountry) ? this.addressDetail.selectedCountry.id : 0,
        stateId: !_.isEmpty(this.addressDetail.selectedState) ? this.addressDetail.selectedState.id : 0,
        cityId: !_.isEmpty(this.addressDetail.selectedCity) ? this.addressDetail.selectedCity.id : 0
      }
      this.addNewAreaRefModel.openModal(data);
    }
    if (event.data.length > 0) {
      this.addressDetail.selectedArea = event.data[0]
    }
  }

  /* Function invoke on addresstype selection change */
  onAddressTypeChange = (event) => {
    if (Number(event.value) >= UIConstant.ZERO) {
      this.addressDetail.selectedAddressType = Number(event.value)
    }
  }

  /* Function invoke on key person contact country code selection change */
  onKeyPersonMobileCountryCodeChange = (event) => {
    if (event.data.length > 0) {
      this.keyPersonDetail.keyPersonMobileCountryCode = event.data[0]
    }
  }

  /* Function invoke on accounting method type selection change  */
  onAccMethodTypeChange = (event) => {
    if (event.data.length > 0) {
      this.statutoryDetail.accMethod =  event.data[0]
    }
  }


  /* Function invoke on click of close profile icon
      will close the dialog box and reset data */
  emitCloseProfile (data) {
    this.closeModal.emit(data);
  }

  /* Function to get all the state list */
  getStateList = (countryCode) => {
    this._orgService.getStateList(countryCode).
    pipe(
      takeUntil(this.unSubscribe$)
    ).
    subscribe((response: any) => {
      this.stateList = [{ id: UIConstant.ZERO, text: 'Select State' }, ...response]
      if(this.dummyData.stateCodeId) {
        this.model.stateCodeId = this.dummyData.stateCodeId
        this.dummyData.stateCodeId = null
      }
    }, error => console.log(error))
  }

  /* Function to get all the city list  */
  getCityList = (stateCode) => {
    this._orgService.getCityList(stateCode).
      pipe(
        takeUntil(this.unSubscribe$)
      ).
      subscribe((response: any) => {
        this.cityList = [
          { id: 0, text: 'Select City' },
          { id: -1, text: '+Add New' },
          ...response]
        if(this.dummyData.cityCodeId) {
          this.model.cityCodeId = this.dummyData.cityCodeId
          this.dummyData.cityCodeId = null
        }
      }, error => console.log(error))
  }

  /* Function to get all the area list  */
  getAreaList = (cityCode) => {
    this._orgService.getAreaList(cityCode).
      pipe(
        takeUntil(this.unSubscribe$)
      ).
      subscribe((response: any) => {
        this.areaList = [{ id: 0, text: 'Select Area' },
        { id: -1, text: '+Add New' }, ...response]
        if (this.dummyData.areaId) {
          this.model.areaId = this.dummyData.areaId
          this.dummyData.areaId = null
        }
      }, error => console.log(error))
  }

  

  /* Function to get all the key person type list */
  getKeyPersonTypeList = (organizationTypeId) => {
    this._orgService.getKeyPersonTypeList(organizationTypeId).
      pipe(
        takeUntil(this.unSubscribe$)
      ).
      subscribe((response: any) => {
        this.keyPersonTypeList = [...response]
      }, error => console.log(error))
  }

  /* Function to initialise personal detail */
  initPersonalDetail = () => {
    this.personalDetail = {
      mobileArray: [{
        selectedMobileType: 1, selectedMobileCountryCode: UIConstant.ZERO, mobileNo: ''
      }],
      emailArray: [{
        selectedEmailType: 2, selectedEmail: ''
      }]
    }
  }

  /* Function to add new bank details */
  addNewbankDetail = () => {
    if (this.editBankDetailIndex !== null) {
      this.bankDetailArray[this.editBankDetailIndex] = { ...this.bankDetail }
      this.editBankDetailIndex = null
    } else {
      this.bankDetailArray = [...this.bankDetailArray, this.bankDetail]
    }
    this.bankDetail = {}
    this.bankFormModel.submitted = false
  }

  /* Function to edit existing bank details */
  editBankData = (i) => {
    this.bankDetail = { ...this.bankDetailArray[i] }
    this.editBankDetailIndex = i
  }

  /* Function to remove existing bank details */
  removeBankDetail = (i) => {
    this.bankDetailArray.splice(i,1)
  }

  /* Function to add new address details */
  addNewAddress = () => {
    if (this.editAddressDetailIndex !== null) {
      this.addressDetailArray[this.editAddressDetailIndex] = { ...this.addressDetail }
      this.editAddressDetailIndex = null
    } else {
      this.addressDetailArray = [...this.addressDetailArray, this.addressDetail]
    }
    this.addressDetail = {}
    this.model.countryCodeId = 0
    this.model.stateCodeId = 0
    this.model.cityCodeId = 0
    this.model.areaId = 0
    this.addressFormModel.submitted = false
  }

  /* Function to edit existing address details */
  editAddress = (i) => {
    this.addressDetail = { ...this.addressDetailArray[i] }
    this.model.countryCodeId = this.addressDetailArray[i].selectedCountry.id
    this.dummyData.areaId = this.addressDetailArray[i].selectedArea.id
    this.dummyData.stateCodeId = this.addressDetailArray[i].selectedState.id
    this.dummyData.cityCodeId = this.addressDetailArray[i].selectedCity.id
    this.editAddressDetailIndex = i
  }

  /* Function to remove existing address details */
  removeAdress = (i) => {
    this.addressDetailArray.splice(i,1)
  }

  /* Function to add new key person details */
  addNewKeyPerson = () => {
    if (this.editKeyPersonDetailIndex !== null) {
      this.keyPersonDetailArray[this.editKeyPersonDetailIndex] = { ...this.keyPersonDetail }
      this.editKeyPersonDetailIndex = null
    } else {
      this.keyPersonDetailArray = [...this.keyPersonDetailArray, {...this.keyPersonDetail}]
    }
    this.keyPersonSelect.setElementValue(0)
    this.contactNoSelect.setElementValue(0)
    this.keyPersonFormModel.resetForm()
  }

  /* Function to edit existing key person details  */
  editKeyPerson = (i) => {
    const keyPersonTypeId = this.keyPersonDetailArray[i].selectedKeyPersonType.id 
    const contactCodeId = this.keyPersonDetailArray[i].keyPersonMobileCountryCode.id 
    this.keyPersonSelect.setElementValue(keyPersonTypeId)
    this.contactNoSelect.setElementValue(contactCodeId)
    this.keyPersonDetail = { ...this.keyPersonDetailArray[i] }
    this.editKeyPersonDetailIndex = i
  }

  /* Function to remove existing key person details */
  removeKeyPerson = (i) => {
    if (this.keyPersonDetailArray[i].isActive === true) {
      this.keyPersonDetailArray[i].isActive = false
    } else {
      this.keyPersonDetailArray.splice(i, 1)
    }
  }

    /* Function to assign mobile type list  */
  getMobileTypeList = () => {
    this.mobileTypeList = this._orgService.getMobileTypeList()
    this.mobileDetail.selectedMobileType = 1
  }

  /* Funtion to get all the mobile country code list  */
  getMobileCountryCodeList = () => {
    this._orgService.getMobileCountryCodeList().
      pipe(
        takeUntil(this.unSubscribe$)
      ).
      subscribe((response: any) => {
        this.mobileCountryCodeList = [...response]
      }, error => console.log(error))
  }

  /* Function invoke on coutnry code selection change */
  onCountryCodeSelectionChange = (event) => {
    if (event.data.length > 0) {
      this.mobileDetail.selectedMobileCountryCode = event.data[0]
    }
  }

  /* Function to add new mobile details */
  addNewMobileDetail = () => {
    if (this.editMobileDetailIndex !== null && this.editMobileDetailIndex >= 0) {
      this.personalDetail.mobileArray[this.editMobileDetailIndex] = { ...this.mobileDetail }
      this.editMobileDetailIndex = null
    } else {
      this.personalDetail.mobileArray = [...this.personalDetail.mobileArray, this.mobileDetail]
    }
    this.mobileDetail = {
      selectedMobileType: 1,
      selectedMobileCountryCode:
        { id: UIConstant.ZERO, text: 'Select Country Code' },
      mobileNo: ''
    }
    this.mobileDetailModel.submitted = false
  }

  /* Function to edit mobile details */
  editMobileDetail = (index) => {
    this.mobileDetail = { ...this.personalDetail.mobileArray[index] }
    this.editMobileDetailIndex = index
  }

   /* Function to remove mobile detail */
  removeMobileDetail = (index) => {
    this.personalDetail.mobileArray.splice(index, 1)
  }

    /* Function to validate mobile detail */
  validateMobileDetail = () => {
    let valid = true
    if (!_.isEmpty(this.mobileDetail.selectedMobileCountryCode) && Number(this.mobileDetail.selectedMobileCountryCode.id) === 0) {
      valid = false
    }
    return valid
  }

    /* Function to validate key person details */
  validateKeyPersonDetail = () => {
    let valid = true
    if (!_.isEmpty(this.keyPersonDetail.keyPersonMobileCountryCode) && Number(this.keyPersonDetail.keyPersonMobileCountryCode.id) === 0) {
      valid = false
    }
    if (!_.isEmpty(this.keyPersonDetail.selectedKeyPersonType) && Number(this.keyPersonDetail.selectedKeyPersonType.id) === 0) {
      valid = false
    }
    return valid
  }

    /* Function to validate address details */
  validateAddressDetail = () => {
    let valid = true
    if (!_.isEmpty(this.addressDetail.selectedCountry) && Number(this.addressDetail.selectedCountry.id) === 0) {
      valid = false
    }
    if (!_.isEmpty(this.addressDetail.selectedState) && Number(this.addressDetail.selectedState.id) === 0) {
      valid = false
    }
    if (!_.isEmpty(this.addressDetail.selectedCity) && Number(this.addressDetail.selectedCity.id) === 0) {
      valid = false
    }
    if (!_.isEmpty(this.addressDetail.selectedAddressType) && Number(this.addressDetail.selectedAddressType.id) === 0) {
      valid = false
    }
    return valid
  }

  /* Function to get all the email type list */
  getEmailTypeList = () => {
    this.emailTypeList = this._orgService.getEmailTypeList()
    this.emailDetail.selectedEmailType = 1
  }

/* Function to add new email details */
  addNewEmailDetail = () => {
    if (this.editEmailDetailIndex !== null && this.editEmailDetailIndex >= 0) {
      this.personalDetail.emailArray[this.editEmailDetailIndex] = { ...this.emailDetail }
      this.editEmailDetailIndex = null
    } else {
      this.personalDetail.emailArray =
        [...this.personalDetail.emailArray, this.emailDetail]
    }
    this.emailDetail = {
      selectedEmailType: 1,
      selectedEmail: ''
    }
    this.emailDetailModel.submitted = false
  }

  /* Function to edit email detail */
  editEmailDetail = (index) => {
    this.emailDetail = { ...this.personalDetail.emailArray[index] }
    this.editEmailDetailIndex = index
  }

  /* Function to remove email detail */
  removeEmailDetail = (index) => {
    this.personalDetail.emailArray.splice(index, 1)
  }

  /* Function to prepare prepare the request payload data for post */
  prepareSavePayload = () => {
    const addressArray = _.map(this.addressDetailArray, (address) => {
      return {
        Id: address.id ? address.id : 0,
        AddressValue: address.address,
        AddressType: address.selectedAddressType,
        CountryId: address.selectedCountry.id,
        StateId: address.selectedState.id,
        CityId: address.selectedCity.id,
        AreaId: address.selectedArea.id,
        PostCode: address.postalCode,
        ParentTypeId: 3
      }
    })

    const contactArray = _.map(this.personalDetail.mobileArray, (mobile) => {
      return {
        Id: mobile.id ? mobile.id : 0,
        ContactNo: mobile.mobileNo,
        ContactType: mobile.selectedMobileType,
        CountryCode: mobile.selectedMobileCountryCode.id,
        ParentTypeId: 3
      }
    })

    const emailArray = _.map(this.personalDetail.emailArray, (email) => {
      return {
        Id: email.id ? email.id : 0,
        EmailAddress: email.selectedEmail,
        EmailType: email.selectedEmailType,
        ParentTypeId: 3
      }
    })

    const bankArray = _.map(this.bankDetailArray, (item) => {
      return {
        Id: item.id ? item.id : 0,
        Name: item.name,
        Branch: item.branch,
        AcNo: item.accountNumber,
        ParentTypeId: 5,
        Ifsccode: item.ifscCode,
        MicrNo: item.micrNo
      }
    })

    const websiteArray = [
      {
        Id: 0,
        Name: '',
        Type: 1,
        ParentTypeId: 3
      },
      {
        Id: 0,
        Name: '',
        Type: 1,
        ParentTypeId: 3
      }
    ]

    const statutoriesArray = [
      {
        Id: this.statutoryDetail.id ? this.statutoryDetail.id : 0,
        PanNo: this.statutoryDetail.panNo,
        GSTinNo: this.statutoryDetail.gstNo,
        CinNo: this.statutoryDetail.cinNo,
        TinNo: this.statutoryDetail.tinNo,
        FssiNo: this.statutoryDetail.fassiNo,
        ParentTypeId: 3
      }
    ]

    const keyPersonArray = _.map(this.keyPersonDetailArray, (item) => {
      if (item.isActive !== false && item.isActive !== true) {
        item.isActive = true
      }
      return {
        IsActive: item.isActive,
        Id: item.id ? item.id : 0,
        Name: item.keyPerson,
        ParentTypeId: 3,
        TypeId: item.selectedKeyPersonType.id,
        PanNo: item.panNo,
        ContactNo: item.contactNo,
        CountryCode: item.keyPersonMobileCountryCode.id,
        ContactType: 1,
        EmailAddress: item.email,
        EmailType: 1,
        IdEmail: item.idEmail ? item.idEmail : 0 ,
        IdContact: item.idContact ? item.idContact : 0
      }
    })

    let toDate = this.personalDetail.bookEndDate.split('---')[1]
    toDate = this._globalService.clientToSqlDateFormat(toDate, 'd-m-Y')
    const startDate = this._globalService.clientToSqlDateFormat(this.personalDetail.storedBookStartDate, 'd-m-Y')
    return {
      Id: this.personalDetail.id ? this.personalDetail.id : 0,
      Name: this.personalDetail.companyName,
      TypeId: this.personalDetail.selectedBranchType.id ? this.personalDetail.selectedBranchType.id : 0,
      IndustryType: this.personalDetail.selectedIndustryType.id ? this.personalDetail.selectedIndustryType.id : 0,
      SessionType: this.personalDetail.selectedFinSession.id ? this.personalDetail.selectedFinSession.id : 0,
      BookStartDate: startDate ? startDate : '' ,
      ToDate: toDate ? toDate : '',
      RegistrationType: this.personalDetail.selectedRegistrationType.id ? this.personalDetail.selectedRegistrationType.id : 0,
      AccountingMethod: 0,
      Addresses: addressArray,
      ContactInfos: contactArray,
      Emails: emailArray,
      Websites: websiteArray,
      ContactPersons: keyPersonArray,
      Statutories: statutoriesArray,
      Banks: bankArray,
      ImageFiles: this.ImageFiles
    }
  }

  /* Function to save the profile */
  saveOrgProfile = () => {
    const data = this.prepareSavePayload()
    this._orgService.saveCompanyProfile(data).subscribe(
      (Data: any) => {
        if (Data.Code === UIConstant.THOUSAND) {
          this.toastrService.showSuccess('Success', 'Saved Successfully')
          this.emitCloseProfile(Data.Data);
        } else {
          this.toastrService.showError('Error', Data.Message)
        }
      }, error => {
      console.log(error)
      this.toastrService.showError('Error', 'error in profile save')
    }
    )
  }

  /* Function to get existing profile data */
  getOrgProfileData = () => {
    this._orgService.getCompanyProfileDetails(this.modalData.editId).subscribe(
      (Data: any) => {
        if (Data.Code === UIConstant.THOUSAND) {
          this.initFormData(Data.Data)
        }
      }, error => console.log(error)
    )
  }

  /* Function to initialise all form fields by profile data */
  initFormData = (profileData) => {
    if (profileData && profileData.ImageFiles && profileData.ImageFiles.length > 0) {
      profileData.ImageFiles.forEach(element => {
        this.imageList['queue'].push(element.Name)
        this.imageList['images'].push(element.FilePath)
        this.imageList['baseImages'].push(0)
        this.imageList['id'].push(element.Id)
      })
      this.createImageFiles();
    }

    this.addressDetailArray = _.map(profileData.Addressesdetails, (item) => {
      return {
        id: item.Id,
        postalCode: item.PostCode,
        address: item.AddressValue,
        selectedAddressType: item.AddressType,
        selectedCountry: {
          id: item.CountryId,
          text: item.CountryName
        },
        selectedState: {
          id: item.StateId,
          text: item.Statename
        },
        selectedCity: {
          id: item.CityId,
          text: item.CityName
        },
        selectedArea: {
          id: item.AreaId,
          text: item.AreaName
        }
      }
    })

    this.bankDetailArray = _.map(profileData.Banks, (item) => {
      return {
        id: item.Id,
        name: item.Name,
        accountNumber: item.AcNo,
        branch: item.Branch,
        ifscCode: item.IfscCode,
        micrNo: item.MicrNo
      }
    })
    let statutory 
    if (profileData.Statutories && profileData.Statutories.length > 0) {
       statutory = profileData.Statutories[0]
    }
    if (statutory) {
      this.statutoryDetail = {
        id: statutory.Id,
        tinNo: statutory.TinNo,
        panNo: statutory.PanNo,
        gstNo: statutory.GstinNo,
        cinNo: statutory.CinNo,
        fassiNo: statutory.FssiNo
      }
      this.personalDetailModel.accMethodId = 0
    }

    const emailArray = _.map(profileData.Emails, (item) => {
      return {
        id: item.Id,
        selectedEmailType: item.EmailType,
        selectedEmail: item.EmailAddress
      }
    })

    const mobileArray = _.map(profileData.ContactInfos, (item) => {
      return {
        id: item.Id,
        selectedMobileType: item.ContactType,
        selectedMobileCountryCode: {
          id: item.CountryCode === null ? 0 : item.CountryCode
        },
        mobileNo: item.ContactNo
      }
    })
    let orgData
    if (profileData.Organisationdetails && profileData.Organisationdetails.length > 0) {
      orgData = profileData.Organisationdetails[0]
    }
    if (orgData) {
      const toDate = this._globalService.utcToClientDateFormat(orgData.ToDate, this._settings.dateFormat)
      const bookStartDate = this._globalService.utcToClientDateFormat(orgData.BookStartDate, this._settings.dateFormat)
      this.personalDetail = {
        id: orgData.Id,
        mobileArray: [...mobileArray],
        emailArray: [...emailArray],
        companyName: orgData.Name,
        bookStartDate: bookStartDate,
        storedBookStartDate: this._globalService.utcToClientDateFormat(orgData.BookStartDate, 'd-m-Y'),
        bookEndDate: `${bookStartDate}---${toDate}`
      }
      this.personalDetailModel.industryTypeId = orgData.IndustryType ? orgData.IndustryType : UIConstant.ZERO;
      this.personalDetailModel.finSessionValue = orgData.SessionType ? orgData.SessionType : UIConstant.ZERO;
      this.personalDetailModel.registrationTypeId = orgData.GstnTypeId ? orgData.GstnTypeId : UIConstant.ZERO;
      this.personalDetailModel.branchTypeId = orgData.TypeId ? orgData.TypeId : UIConstant.ZERO;
    }

    this.keyPersonDetailArray = _.map(profileData.ContactPersonsBrief, (item) => {
      if (item.IsActive === true) {
        return {
          isActive: item.IsActive,
          id: item.Id,
          keyPerson: item.Name,
          contactNo: item.ContactNo,
          selectedKeyPersonType: {
            id: item.TypeId,
            text: item.TypeName
          },
          keyPersonMobileCountryCode: {
            id: item.CountryCode === null ? 0 : item.CountryCode
          },
          panNo: item.PanNo,
          idEmail: item.IdEmail,
          idContact: item.IdContact
        }
      }
    })
  }

   /* validating form fields on saving profile data */
  validateForm = () => {
    let valid = true
    if (!_.isEmpty(this.personalDetail.selectedIndustryType) && Number(this.personalDetail.selectedIndustryType.id) === 0) {
      valid = false
    }
    if (!_.isEmpty(this.personalDetail.selectedRegistrationType) && Number(this.personalDetail.selectedRegistrationType.id) === 0) {
      valid = false
    }
    if (this.personalDetail.mobileArray.length === 0) {
      valid = false
    }
    if (this.personalDetail.emailArray.length === 0) {
      valid = false
    }
    if (this.keyPersonDetailArray.length === 0) {
      valid = false
    }
    if (this.addressDetailArray.length === 0) {
      valid = false
    }
    return valid
  }


  openImageModal () {
    this.itemMaster.openImageModal(this.imageList)
  }

  getUploadedImages = () => {
    this.itemMaster.imageAdd$.subscribe((response)=> {
      this.imageList = response;
      this.createImageFiles()
    })
  }

  removeImage = (index) => {
    _.forIn(this.imageList, (value) => {
      value.splice(index, 1)
    })
    this.createImageFiles()
  }

  createImageFiles () {
    let ImageFiles = []
    for (let i = 0; i < this.imageList['images'].length; i++) {
      let obj = { Name: this.imageList['queue'][i], BaseString: this.imageList['safeUrls'][i], IsBaseImage: this.imageList['baseImages'][i], Id: this.imageList['id'][i] ? this.imageList['id'][i] : 0 }
      ImageFiles.push(obj)
    }
    this.ImageFiles = ImageFiles
  }
  removeActiveClass(){
    $('#activeTab').click();
  }

  onTabOut(value){
    $(`a[href=${JSON.stringify(value)}]`).click()
  }

  focuOnTabOut(value, type){
    $(`#${value}`).focus();
    if (type === 'ref') {
     this[value].selector.nativeElement.focus();
    }
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next()
    this.unSubscribe$.complete()
  }
  onMobileNoChange(control){
    if(control.valid){
      this.addNewMobileDetail();
    }
  }
  onEmailChange(control){
    if (control.valid) {
      this.addNewEmailDetail();
    }
  }

  addCityClosed(selectedIds?) {
    if (!_.isEmpty(selectedIds) && selectedIds.cityId > 0) {
      // if (!_.isEmpty(this.addressDetail.selectedCountry) && this.addressDetail.selectedCountry.id !== selectedIds.countryId) {
        this.model.countryCodeId = selectedIds.countryId
      // }
      // if (!_.isEmpty(this.addressDetail.selectedState) && this.addressDetail.selectedState.id !== selectedIds.stateId) {
        this.dummyData.stateCodeId = selectedIds.stateId
        this.dummyData.cityCodeId = selectedIds.cityId;
      // } else {
        // this.model.cityCodeId = selectedIds.cityId;
      // }
    } else {
      this.model.cityCodeId = 0
    }
  }
  addAreaClosed(selectedIds?) {
    if (!_.isEmpty(selectedIds) && selectedIds.areaId > 0) {
      this.model.countryCodeId = selectedIds.countryId
      this.dummyData.stateCodeId = selectedIds.stateId
      this.dummyData.cityCodeId = selectedIds.cityId
      this.dummyData.areaId = selectedIds.areaId;

      // if (!_.isEmpty(this.addressDetail.selectedState) && this.addressDetail.selectedState.id !== selectedIds.stateId) {
      //   this.dummyData.stateCodeId = selectedIds.stateId
      // } else {
      //   this.model.stateCodeId = selectedIds.stateId
      // }

      // if (!_.isEmpty(this.addressDetail.selectedCity) && this.addressDetail.selectedCity.id !== selectedIds.cityId) {
      //   this.dummyData.cityCodeId = selectedIds.cityId;
      //   this.dummyData.areaId = selectedIds.areaId;
      // } else {
      //   this.model.cityCodeId = selectedIds.cityId;
      //   this.model.areaId = selectedIds.areaId
      // }


      // if (!_.isEmpty(this.addressDetail.selectedCountry) && this.addressDetail.selectedCountry.id !== selectedIds.countryId) {
      //   this.model.countryCodeId = selectedIds.countryId
      //   this.dummyData.stateCodeId = selectedIds.stateId
      // } else {
      //   this.model.stateCodeId = selectedIds.stateId
      // }
      // if (!_.isEmpty(this.addressDetail.selectedState) && this.addressDetail.selectedState.id !== selectedIds.stateId) {
      //   this.dummyData.stateCodeId = selectedIds.stateId
      //   this.dummyData.cityCodeId = selectedIds.cityId;
      // } else {
      //   this.model.cityCodeId = selectedIds.cityId;
      // }
      // if (!_.isEmpty(this.addressDetail.selectedCity) && this.addressDetail.selectedCity.id !== selectedIds.cityId) {
      //   this.dummyData.cityCodeId = selectedIds.cityId;
      //   this.dummyData.areaId = selectedIds.areaId;
      // } else {
      //   this.model.areaId = selectedIds.areaId
      // }
    } else {
      this.model.areaId = 0
    }
  }
}
