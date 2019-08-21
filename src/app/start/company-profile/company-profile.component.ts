
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { GlobalService } from 'src/app/commonServices/global.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Settings } from './../../shared/constants/settings.constant';
import { UIConstant } from './../../shared/constants/ui-constant';
import { ItemmasterServices } from './../../commonServices/TransactionMaster/item-master.services';
import { ToastrCustomService } from './../../commonServices/toastr.service';
import { Component, OnInit, ViewChild, Input, Output, SimpleChanges, OnChanges, EventEmitter, ElementRef, AfterViewInit, Renderer2, DoCheck } from '@angular/core';
import { Subject } from 'rxjs';
import { CompanyProfileService } from './company-profile.service';
import { takeUntil } from 'rxjs/operators';
declare var $: any
import * as _ from 'lodash'
import { Select2Component } from 'ng2-select2';
import { AddNewCityComponent } from '../../shared/components/add-new-city/add-new-city.component';
import { AddNewAreaComponent } from '../../shared/components/add-new-area/add-new-area.component';
import { TabsetComponent } from 'ngx-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from 'src/app/commonServices/login/login.services';
import { TokenService } from 'src/app/commonServices/token.service';


@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit{
  @ViewChild('addNewCityRef') addNewCityRefModel  : AddNewCityComponent
  @ViewChild('addNewAreaRef') addNewAreaRefModel  : AddNewAreaComponent
  @ViewChild('mobileDetailModel') mobileDetailModel
  @ViewChild('emailDetailModel') emailDetailModel
  @ViewChild('bankFormModel') bankFormModel
  @ViewChild('addressFormModel') addressFormModel
  @ViewChild('keyPersonFormModel') keyPersonFormModel
  @ViewChild('orgProfileFormModel') orgProfileFormControlModel
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
  @ViewChild('organizationTab') organizationTab: TabsetComponent;
  @ViewChild('companyNameReference') companyNameReference: ElementRef
  @ViewChild('keyPersonNameRef') keyPersonNameRef: ElementRef
  @ViewChild('tinNumberRef') tinNumberRef: ElementRef
  @ViewChild('bankNameRef') bankNameRef: ElementRef
  @Input() modalData: any;
  @Output() closeModal = new EventEmitter();
  private unSubscribe$ = new Subject<void>()
  imageList: any = { images: [], queue: [], safeUrls: [], baseImages: [], id: [] }
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
    private _orgService: CompanyProfileService,
    private toastrService: ToastrCustomService,
    public _commonService: CommonService,
    private itemMaster: ItemmasterServices,
    public _settings: Settings,
    private _route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    private spinnerService: NgxSpinnerService,
    private _loginService: LoginService,
    private tokenService: TokenService    
  ) {
    if(this._settings.dateFormat) {
      this.clientDateFormat = this._settings.dateFormat
    }
    this._settings.dateFormat = 'd-m-Y'  
    this._route.paramMap.subscribe((parameters) => {
      this.editId = parameters.get('id');
    })
  }

  setFocus(ref, type?) {
    setTimeout(() => {
      if (type === 'select2') {
        this[ref].selector.nativeElement.focus({ preventScroll: false })
      } else {
        this[ref].nativeElement.focus({ preventScroll: false })
      }
    },300)
  }

  // tslint:disable-next-line:no-empty
  ngOnInit () {
    $('#companyOrganisationModal').modal({ backdrop: 'static', keyboard: false })
    $('#companyOrganisationModal').modal(UIConstant.MODEL_SHOW)
    this.selectTab(0);
    this.setFocus('companyNameReference');
    this.spinnerService.show()
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
      { id: -1, text: UIConstant.ADD_NEW_OPTION }
    ]
    this.areaList = [
      { id: 0, text: 'Select Area' },
      { id: -1, text: UIConstant.ADD_NEW_OPTION }
    ]
    this.addressTypeList = await this._orgService.getAddressTypeList()
    this.registrationTypeList = [...this._orgService.getRegistrationTypeList()]
    this.industryTypeList = await this._orgService.getIndustryTypeList()
    this.branchTypeList = await this._orgService.getBranchTypeList()
    this.countryList = await this._orgService.getCountryList()
    this.accMethodList = await this._orgService.getAccountingMethod()
    this.finSessionList = await this._orgService.getFinSessionList()
    this.getMobileCountryCodeList()
    this.getMobileTypeList()
    this.getEmailTypeList()
    if (!this.modalData.editId) {
      this.personalDetailModel.registrationTypeId = 1;
      this.personalDetail.bookStartDate = '';
    }
    if(this.modalData.editId) {
      this.getOrgProfileData()
    }
    this.spinnerService.hide()
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
      if (this.dummyData.SubIndustryId) {
        this.personalDetailModel.SubIndustryId = this.dummyData.SubIndustryId
        this.dummyData.SubIndustryId = null
      }
    }
  }

  /* Function for sub industry  */
  onSubIndustryTypeSelectionChange = (event) => {
    if (event.data.length > 0) {
      this.personalDetail.selectedSubIndustry = event.data[0]
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
      this.dummyData.bookStartDateInvalid = false;
      let endDate = `${this.personalDetail.selectedFinSession.shortName}/${year}`
      endDate = this._globalService.utcToClientDateFormat(endDate, 'd-m-Y')
      this.personalDetail.bookEndDate = `${this.personalDetail.storedBookStartDate}--${endDate}`
    } else if (session === month) {
      this.personalDetail.bookStartDate = '';
      this.dummyData.bookStartDateInvalid = true;
      this.toastrService.showError('','Please Select another Book Start Month');
    } else if (session < month) {
      this.dummyData.bookStartDateInvalid = false;
      const modifiedYear = year + 1
      let endDate = `${this.personalDetail.selectedFinSession.shortName}/${modifiedYear}`
      endDate = this._globalService.utcToClientDateFormat(endDate, 'd-m-Y')
      this.personalDetail.bookEndDate = `${this.personalDetail.storedBookStartDate}--${endDate}`
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

  onFinSessionSelectionChange = (event) => {
    if (event.data.length > 0) {
      this.personalDetail.selectedFinSession = event.data[0]
      this.setEndDateOnSessionChange()
    }
  }

  /* Function invoke on registration type selection change and assign new value */
  disabledGSTfor_UnRegi:boolean = false
  onRegistrationTypeSelectionChange = (event) => {
    if(event.data.length >0){
      this.personalDetail.selectedRegistrationType = event.data[0]
      if(event.data[0].id ==='4'){
        this.disabledGSTfor_UnRegi = true
        this.statutoryDetail.gstNo =''
        this.disabledStateCountry =false
      }
      else{
        this.disabledGSTfor_UnRegi = false
  
      }
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

  getOneState (rsp){
    let  newdata =[]
       newdata.push({
         id:rsp.Data[0].Id,
         text: rsp.Data[0].CommonDesc1
       })
       this.disabledStateCountry =true
     this.stateList = newdata
     this.getCityList(rsp.Data[0].Id)
   }

  getStateCode = async (stateCode) =>{
    this._commonService.getStateByGStCode(stateCode).
    pipe(
      takeUntil(this.unSubscribe$)
    ).
    subscribe((response: any) => {
     // countryId: !_.isEmpty(this.addressDetail.selectedCountry) ? this.addressDetail.selectedCountry.id : 0,
      if(response.Code=== UIConstant.THOUSAND && response.Data.length >0){
    //  if(!_.isEmpty(this.addressDetail.selectedCountry)){
        this.addressDetail.selectedCountry.id =response.Data[0].CommonId
        this.addressDetail.selectedCountry.text =response.Data[0].CommonName
        this.GSTStateCode =response.Data[0].ShortName1
        this.countrySelect.setElementValue(response.Data[0].CommonId)
        let event ={value:response.Data[0].Id,data:[{id:response.Data[0].Id, stateCode:response.Data[0].ShortName1}]}
        this.onStateSelectionChange(event)
        this.addressDetail.selectedState.id =response.Data[0].Id
        this.getOneState(response)
        this.matchStateCodeWithGSTNumber()
      //}
      
        
        
      }
      else{
      //  countryId: !_.isEmpty(this.addressDetail.selectedCountry) ? this.addressDetail.selectedCountry.id : 0,
        //this.addressDetail.selectedCountry.id =0
        //this.addressDetail.selectedCountry.text =''
        //this.addressDetail.selectedState.id=0

      }
    })
  }


  GstinNoCode:any
  disabledStateCountry:boolean = false
  
  checkGSTNumberByState (event) {
    this.statutoryDetail.gstNo = event.target.value;
    let str =  this.statutoryDetail.gstNo
    let val =  str.trim();
    this.GstinNoCode = val.substr(0,2);
    if( this.GstinNoCode !==''){
      this.getStateCode(this.GstinNoCode)
      this.addressDetailArray.splice(0,1)
      this.RemoveAddressButtonFlag = true
    }
    else{
      this.disabledStateCountry =false
      
    }
    
    
    //this.checkGSTNumberValid()
  }
  
  GSTStateCode:any
  matchStateCodeWithGSTNumber(){
    if(this.GSTStateCode>0 &&  this.GstinNoCode !==''){
      if(this.GSTStateCode === this.GstinNoCode){
          return true 
         }
         else{
          return  false
         }
    } else{
      return true
    }
  }
  
  /* Function invoke on state dropdown selection change */
  onStateSelectionChange = (event) => {
    if (event.data.length > 0) {
      this.addressDetail.selectedState = event.data[0]
      this.GSTStateCode =event.data[0].stateCode
      
    }
    if (this.addressDetail.selectedState && this.addressDetail.selectedState.id > UIConstant.ZERO) {
      this.GSTStateCode = event.data[0].stateCode
      this.getCityList(this.addressDetail.selectedState.id)
    } else {
      this.cityList = [
      { id: 0, text: 'Select City' },
      { id: -1, text: UIConstant.ADD_NEW_OPTION },]
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
      { id: -1, text: UIConstant.ADD_NEW_OPTION }]
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
  
  AddressTypeName:string=''
  /* Function invoke on addresstype selection change */
  onAddressTypeChange = (event) => {
   if (Number(event.value) > UIConstant.ZERO) {
      this.addressDetail.selectedAddressType = Number(event.value)
      this.addressDetail.AddressTypeName = event.data[0].text
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
  emitCloseProfile (data?) {
    $('#companyOrganisationModal').modal(UIConstant.MODEL_HIDE)
    this.RemoveAddressButtonFlag = true
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
          { id: -1, text:UIConstant.ADD_NEW_OPTION },
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
        { id: -1, text: UIConstant.ADD_NEW_OPTION }, ...response]
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
      if (_.isEmpty(this.bankDetailArray)) {
        this.bankDetailArray = []
      }
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

  RemoveAddressButtonFlag:boolean = true
  /* Function to add new address details */
  addNewAddress = () => {
    this.RemoveAddressButtonFlag = false
    if (this.editAddressDetailIndex !== null) {
      this.addressDetailArray[this.editAddressDetailIndex] = { ...this.addressDetail }
      
      this.editAddressDetailIndex = null
    } else {
      if (_.isEmpty(this.addressDetailArray)) {
        this.addressDetailArray = []
      }
      this.addressDetailArray = [...this.addressDetailArray, this.addressDetail]
    }
    this.addressDetail ={
      selectedAddressType :this.addressTypeList[0].id,
      AddressTypeName : '',
      postalCode:'',
      address:'',
      selectedCountry:{id:0,text:''},
      selectedState:{id:0,text:''},
      selectedArea:{id:0,text:''}
    }
    this.model.countryCodeId = 0
    this.model.stateCodeId = 0
    this.model.cityCodeId = 0
    this.model.areaId = 0
    this.addressFormModel.submitted = false
    this.selectTab(4);
  }

  /* Function to edit existing address details */
  editAddress = (i) => {
    this.addressDetail = { ...this.addressDetailArray[i] }
    this.model.countryCodeId = this.addressDetailArray[i].selectedCountry.id
    this.dummyData.areaId = this.addressDetailArray[i].selectedArea.id
    this.dummyData.stateCodeId = this.addressDetailArray[i].selectedState.id
    this.dummyData.cityCodeId = this.addressDetailArray[i].selectedCity.id
    this.editAddressDetailIndex = i
    this.addressDetailArray.splice(i,1)
    this.RemoveAddressButtonFlag = true
  }

  /* Function to remove existing address details */
  removeAdress = (i) => {
    this.addressDetailArray.splice(i,1)
    this.RemoveAddressButtonFlag = true

  }

  /* Function to add new key person details */
  addNewKeyPerson = () => {
    if (this.editKeyPersonDetailIndex !== null) {
      this.keyPersonDetailArray[this.editKeyPersonDetailIndex] = { ...this.keyPersonDetail }
      this.editKeyPersonDetailIndex = null
    } else {
      if (_.isEmpty(this.keyPersonDetailArray)) {
        this.keyPersonDetailArray = []
      }
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
      if (!_.isEmpty(this.personalDetail.mobileArray)) {
        this.personalDetailModel.contactCodeValue = Number(this.personalDetail.mobileArray[0].selectedMobileCountryCode.id);
      }
    }
  }

  /* Function to add new mobile details */
  addNewMobileDetail = () => {
    if (this.editMobileDetailIndex !== null && this.editMobileDetailIndex >= 0) {
      this.personalDetail.mobileArray[this.editMobileDetailIndex] = { ...this.mobileDetail }
      this.editMobileDetailIndex = null
    } else {
      if (_.isEmpty(this.personalDetail.mobileArray)) {
        this.personalDetail.mobileArray = []
      }
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
      if (_.isEmpty(this.personalDetail.emailArray)) {
        this.personalDetail.emailArray = []
      }
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
        AreaId: !_.isEmpty(address.selectedArea) ?  address.selectedArea.id : 0 ,
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

    let toDate = this.personalDetail.bookEndDate.split('--')[1]
    toDate = this._globalService.clientToSqlDateFormat(toDate, 'd-m-Y')
    const startDate = this._globalService.clientToSqlDateFormat(this.personalDetail.storedBookStartDate, 'd-m-Y')
    return {
      Id: this.personalDetail.id ? this.personalDetail.id : 0,
      Name: this.personalDetail.companyName,
      TypeId: this.personalDetail.selectedBranchType.id ? this.personalDetail.selectedBranchType.id : 0,
      IndustryType: this.personalDetail.selectedIndustryType.id ? this.personalDetail.selectedIndustryType.id : 0,
      SubIndustryId: this.personalDetail.selectedSubIndustry.id ? this.personalDetail.selectedSubIndustry.id :  0,
      SessionType: this.personalDetail.selectedFinSession.id ? this.personalDetail.selectedFinSession.id : 0,
      BookStartDate: startDate ? startDate : '',
      ToDate: toDate ? toDate : '',
      RegistrationType: this.personalDetail.selectedRegistrationType.id ? this.personalDetail.selectedRegistrationType.id : 0,
      AccountingMethod: 0,
      Addresses: addressArray,
      ContactInfos: contactArray,
      Emails: emailArray,
      ContactPersons: keyPersonArray,
      Statutories: statutoriesArray,
      Banks: bankArray,
      ImageFiles: this.ImageFiles
    }
  }

  /* Function to save the profile */
  saveOrgProfile = () => {
    this.spinnerService.show();
    const data = this.prepareSavePayload()
    this._orgService.saveCompanyProfile(data).subscribe(
      (Data: any) => {
        if (Data.Code === UIConstant.THOUSAND) {
          this.toastrService.showSuccess('', UIConstant.SAVED_SUCCESSFULLY)
          if(!this.modalData.editId){
            this.navigateToSetting(Data.Data);
          } else {
            this.emitCloseProfile(Data.Data);
            this.spinnerService.hide()
          } 
        } else {
          this.toastrService.showError('', Data.Message)
          this.spinnerService.hide()
        }
      }, error => {
      console.log(error)
      this.toastrService.showError('', 'error in profile save')
      this.spinnerService.hide()
    }
    )
  }

  navigateToSetting(data) {
    const Id = Number(data)
    this._orgService.getBranchAuthentiCationParameters(Id).subscribe(
      async (res) => {
        if (res.Code === 1000 && !_.isEmpty(res.Data)) {
          const token = await this._loginService.extendJwtToken(
            {
              OrgId: Id,
              BranchId: res.Data[0].BranchId,
              OfficeId: res.Data[0].OfficeId
            })
          this.tokenService.saveToken(token)
          await this._loginService.getUserOrganization();
          this._loginService.selectedOrganization = _.find(this._loginService.organizationList, { Id: Id });
          localStorage.setItem('SELECTED_ORGANIZATION', JSON.stringify(this._loginService.selectedOrganization))
          this.emitCloseProfile(data)
          this.router.navigate(['organization/settings/setup']);
        }
      })
  }

  /* Function to get existing profile data */
  getOrgProfileData = () => {
    this.spinnerService.show();
    this._orgService.getCompanyProfileDetails(this.modalData.editId).subscribe(
      (Data: any) => {
        console.log('getCompanyProfileDetails : ', Data)
        if (Data.Code === UIConstant.THOUSAND) {
          this.initFormData(Data.Data)
        }
      }, error => console.log(error)
    )
  }

  /* Function to initialise all form fields by profile data */
  initFormData = (profileData) => {
    this.imageList = { images: [], queue: [], safeUrls: [], baseImages: [], id: [] }
    if (!_.isEmpty(profileData) && profileData.ImageFiles.length > 0) {
      profileData.ImageFiles.forEach(element => {
        this.imageList['queue'].push(element.Name)
        this.imageList['images'].push(element.FilePath)
        this.imageList['baseImages'].push(0)
        this.imageList['id'].push(element.Id)
      })
      this.createImageFiles();
    }
    this.addressDetail ={
      selectedAddressType :this.addressTypeList[0].id,
      AddressTypeName : '',
      postalCode:'',
      address:'',
      selectedCountry:{id:0,text:''},
      selectedState:{id:0,text:''},
      selectedArea:{id:0,text:''}
    }
    this.addressDetailArray = _.map(profileData.AddressesDetails, (item) => {
      return {
        id: item.Id,
        postalCode: item.PostCode,
        address: item.AddressValue,
        selectedAddressType: item.AddressType,
        addressTypeName :item.AddressTypeName,
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
    if (profileData.OrganisationDetails && profileData.OrganisationDetails.length > 0) {
      orgData = profileData.OrganisationDetails[0]
    }
    if (!_.isEmpty(orgData)) {
      const toDate = this._globalService.utcToClientDateFormat(orgData.ToDate, this._settings.dateFormat)
      const bookStartDate = this._globalService.utcToClientDateFormat(orgData.BookStartDate, this._settings.dateFormat)
      this.personalDetail = {
        id: orgData.Id,
        mobileArray: [...mobileArray],
        emailArray: [...emailArray],
        companyName: orgData.Name,
        bookStartDate: bookStartDate,
        storedBookStartDate: this._globalService.utcToClientDateFormat(orgData.BookStartDate, 'd-m-Y'),
        bookEndDate: `${bookStartDate}--${toDate}`
      }
      this.personalDetailModel.industryTypeId = orgData.IndustryId ? orgData.IndustryId : UIConstant.ZERO;
      this.dummyData.SubIndustryId = orgData.SubIndustryId ? orgData.SubIndustryId : UIConstant.ZERO;
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
    this.spinnerService.hide();
  }

  /* validating form fields on saving profile data */
  validateForm = () => {
    let valid = true
    if (valid && !_.isEmpty(this.personalDetail.selectedIndustryType) && Number(this.personalDetail.selectedIndustryType.id) === 0) {
      valid = false
    }
    if (valid && !_.isEmpty(this.personalDetail.selectedRegistrationType) && Number(this.personalDetail.selectedRegistrationType.id) === 0) {
      valid = false
    }
    if (valid && this.personalDetail.mobileArray.length === 0) {
      valid = false
    }
    if (valid && this.personalDetail.emailArray.length === 0) {
      valid = false
    }
    if (valid && this.keyPersonDetailArray.length === 0) {
      valid = false
    }
    if (valid && this.addressDetailArray.length === 0) {
      valid = false
    }
    if (valid && this.dummyData.bookStartDateInvalid) {
      valid = false;
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
     if(!_.isEmpty(value) && value.length>0 && index < value.length){
        value.splice(index, 1)
     }
    })
    this.createImageFiles()
  }

  createImageFiles() {
    let ImageFiles = []
    if (!_.isEmpty(this.imageList)) {
      for (let i = 0; i < this.imageList['images'].length; i++) {
        let obj = { Name: this.imageList['queue'][i], BaseString: this.imageList['images'][i], IsBaseImage: this.imageList['baseImages'][i], Id: this.imageList['id'][i] ? this.imageList['id'][i] : 0 }
        ImageFiles.push(obj)
      }
      this.ImageFiles = ImageFiles
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
      if (!_.isEmpty(this.addressDetail.selectedCountry) && Number(this.addressDetail.selectedCountry.id) !== selectedIds.countryId) {
        this.model.countryCodeId = selectedIds.countryId
        this.dummyData.stateCodeId = selectedIds.stateId
        this.dummyData.cityCodeId = selectedIds.cityId;
      } else if (!_.isEmpty(this.addressDetail.selectedState) && Number(this.addressDetail.selectedState.id) !== selectedIds.stateId) {
        this.model.stateCodeId = selectedIds.stateId
        this.dummyData.cityCodeId = selectedIds.cityId;
      } else {
        this.dummyData.cityCodeId = selectedIds.cityId;
        this.getCityList(selectedIds.stateId)
      }
    } else {
      this.model.cityCodeId = 0
    }
  }

  addAreaClosed(selectedIds?) {
    if (!_.isEmpty(selectedIds) && selectedIds.areaId > 0) {
      if (!_.isEmpty(this.addressDetail.selectedCountry) && Number(this.addressDetail.selectedCountry.id) !== selectedIds.countryId) {
        this.model.countryCodeId = selectedIds.countryId
        this.dummyData.stateCodeId = selectedIds.stateId
        this.dummyData.cityCodeId = selectedIds.cityId;
        this.dummyData.areaId = selectedIds.areaId
      } else if (!_.isEmpty(this.addressDetail.selectedState) && Number(this.addressDetail.selectedState.id) !== selectedIds.stateId) {
        this.model.stateCodeId = selectedIds.stateId
        this.dummyData.cityCodeId = selectedIds.cityId;
        this.dummyData.areaId = selectedIds.areaId
      } else if (!_.isEmpty(this.addressDetail.selectedCity) && Number(this.addressDetail.selectedCity.id) !== selectedIds.cityId) {
        this.model.cityCodeId = selectedIds.cityId;
        this.dummyData.areaId = selectedIds.areaId
      } else {
        this.dummyData.areaId = selectedIds.areaId
        this.getAreaList(selectedIds.cityId)
      }
    } else {
      this.model.areaId = 0
    }
  }

  selectTab(tabId: number) {
    this.organizationTab.tabs[tabId].active = true;
  }

  selectFromAddress(tabId) {
    if (!_.isEmpty(this.addressDetailArray)) {
      this.organizationTab.tabs[tabId].active = true;
    }
  }
}
