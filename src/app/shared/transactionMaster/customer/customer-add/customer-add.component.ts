import { Component, OnDestroy, HostListener ,ViewChild } from '@angular/core'
import { Subscription } from 'rxjs/Subscription'
import { Ledger, AddCust, AddLedger } from '../../../../model/sales-tracker.model'
import { Select2OptionData, Select2Component } from 'ng2-select2'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { VendorServices } from '../../../../commonServices/TransactionMaster/vendoer-master.services'
import { CategoryServices } from '../../../../commonServices/TransactionMaster/category.services'
import { ErrorConstant } from '../../../constants/error-constants'
import { UIConstant } from '../../../constants/ui-constant'
import { ToastrCustomService } from '../../../../commonServices/toastr.service'
import { CommonService } from '../../../../commonServices/commanmaster/common.services'
import { GlobalService } from '../../../../commonServices/global.service'
import { Settings } from '../../../../shared/constants/settings.constant'
import { disableBindings } from '@angular/core/src/render3';
import { IfStmt } from '@angular/compiler';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import {SetUpIds} from 'src/app/shared/constants/setupIds.constant'
import { Alert } from 'selenium-webdriver';
// import { sep } from 'path';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

declare const $: any
declare const flatpickr: any
@Component({
  selector: 'app-customer-add',
  templateUrl: './customer-add.component.html',
  styleUrls: ['./customer-add.component.css']
})
export class CustomerAddComponent implements OnDestroy {
  modalSub: Subscription
  confirmSUB: Subscription
  coustomerDetails: Ledger[]
  subscribe: Subscription
  id: any
  adressForm: FormGroup
  mobileArray: any
  addressid: any
  emailErrMsg: any
  editMode: boolean = false
  private unSubscribe$ = new Subject<void>()
  areaForm: FormGroup
  public selectCrDr: Array<Select2OptionData>
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
  addressTabDiv: boolean
  customerTabDiv: boolean
  @ViewChild('state_select2') stateselecto: Select2Component

  emailArray: any
  satuariesId: number
  submitClick: boolean
  collectionOfAddress: any
  istradeDiscountValue: boolean
  isVolumeDiscountValue: boolean
  isDiscountValue: boolean
  customerRegistraionError: boolean
  customCustomer: boolean
  countryError: boolean
  coustomerForm: FormGroup
  stateId: any
  cityId: any
  EMAIL: any = 'email'
  MOBILE: any = 'mobile'
  YES: any = 'yes'
  NO: any = 'no'

  addresTypeId: any
  contactId: number = 0
  mobileNoId: number = 0
  areaID: any
  storeAddress: any
  addressError: boolean
  clientDateFormat: any
  isAddNew: boolean = false
  editId: any
  noOfDecimal:any =0
  constructor(public _globalService: GlobalService, public _settings: Settings, private _CommonService: CommonService,
    private _formBuilder: FormBuilder,
    private _coustomerServices: VendorServices, public _categoryservices: CategoryServices, public _toastrcustomservice: ToastrCustomService) {
    this.createCustomerForm()
    this.addTyperessForm()
    this.addArea()
    this.noOfDecimal = this._settings.noOfDecimal
    this.modalSub = this._CommonService.getCustStatus().subscribe(
      (data: AddCust) => {
        if (data.open) {
          this.isAddNew = data.isAddNew
          if (data.editId === '') {
            this.editMode = false
            this.editId = 0
            this.enableContactFlag = true
          } else {
            this.editId = data.editId
            this.id = data.editId
            this.editMode = true
          }

          this.openModal()
        } else {
          this.closeModal()
        }
      }
    )
    this.confirmSUB = this._CommonService.getConfirmationStatus().subscribe(
      (data: AddCust) => {
        
        if (data) {
          if (data.type === this.YES && data.name === this.MOBILE) {
            setTimeout(() => {
              this.select_Mobile.selector.nativeElement.focus()
            }, 10)
          }
          else if (data.type === this.YES && data.name === this.EMAIL) {
            setTimeout(() => {
              this.select_email.selector.nativeElement.focus()
            }, 10)
          }
          else if (data.type === this.NO && data.name === this.MOBILE) {

            setTimeout(() => {
              this.select_email.selector.nativeElement.focus()
            }, 10)
          }
          else if (data.type === this.NO && data.name === this.EMAIL) {
            this.activaTab('customer2')
            this.adressTab()
            setTimeout(() => {
              this.select_Mobile.selector.nativeElement.focus()
            }, 10)
          }

        }
      }
    )
  }
  get f() { return this.coustomerForm.controls }
  ngOnInit() {
    this.collectionOfAddress = []
    this.errormassage = ErrorConstant.REQUIRED
    this.adressType(1)

  }

  closeModal() {
    if ($('#customer_form').length > 0) {
      this.id = UIConstant.ZERO
      this.editMode = false
      $('#customer_form').modal(UIConstant.MODEL_HIDE)
    }
  }


  @ViewChild('country_selecto') countryselecto: Select2Component
  adressTab() {
    setTimeout(() => {
      this.countryselecto.selector.nativeElement.focus()
    }, 1000)

  }
  activaTab(tab) {
    $('.tabs-cyan a[href="#' + tab + '"]').tab('show');
  };
  vendorDiv: boolean
  customerTab() {
    setTimeout(() => {
      this.ledgerName.nativeElement.focus()
    }, 1000)

  }
  bankDiv: boolean

  stateValue: any
  getStaeList(id, value) {
    this.subscribe = this._coustomerServices.gatStateList(id).subscribe(Data => {
      this.stateListplaceHolder = { placeholder: 'Select State' }
      this.stateList = [{ id: UIConstant.BLANK, text: 'Select State' }]
      Data.Data.forEach(element => {
        this.stateList.push({
          id: element.Id,
          text: element.CommonDesc1
        })
      })
      this.stateValue = value
    })
  }

  selectStatelist(event) {
    this.stateId = event.value
    this.stateError = false
    if (this.stateId > UIConstant.ZERO) {
      this.getCitylist(this.stateId, 0)
    }
  }
  @ViewChild('customer_register_type') CustomerRegisterTypeSelect2 :Select2Component

  cityValue: any
  getCitylist(id, value) {
    this.subscribe = this._coustomerServices.getCityList(id).subscribe(Data => {
      this.cityList = []
      Data.Data.forEach(element => {
        this.cityList.push({
          id: element.Id,
          text: element.CommonDesc2
        })
      })
      this.cityValue = value
    })
  }

  selectedCityId(event) {
    this.cityId = event.value
    this.cityError = false
    if (this.cityId > 0) {
      this.getAreaId(this.cityId)
    }
  }
  get adAre() { return this.areaForm.controls }

  private getAreaId(id) {
    this.subscribe = this._coustomerServices.getAreaList(id).subscribe(Data => {
      // console.log(' area list : ', Data)
      this.areaListPlaceHolder = { placeholder: 'Select Area' }
      this.areaList = [{ id: UIConstant.BLANK, text: 'Select Area' }, { id: '0', text: '+Add New' }]
      Data.Data.forEach(element => {
        this.areaList.push({
          id: element.Id,
          text: element.CommonDesc3
        })
      })
    })
  }
  addArea() {
    this.areaForm = this._formBuilder.group({
      'areaName': ['', Validators.required]
    })
  }
  @ViewChild('areaName') areaname
  openAreaModel() {
    setTimeout(() => {
      this.areaname.nativeElement.focus()
    }, 500)
    $('#add_area_Popup').modal(UIConstant.MODEL_SHOW)
  }
  closeAreaModel() {
    $('#add_area_Popup').modal(UIConstant.MODEL_HIDE)
  }

  addAreaClick: boolean
  areNameId: any
  areaAdd() {
    this.addAreaClick = true
    const addValue = {
      Id: 0,
      CommonDesc3: this.areaForm.value.areaName,
      ShortName3: this.areaForm.value.areaName,
      CommonCode: 104,
      CommonId2: this.cityId
    }
    if (this.areaForm.valid && this.cityId > 0) {
      this.subscribe = this._CommonService.addAreaNameUnderCity(addValue).subscribe(data => {
        if (data.Code === 1000 && data.Data.length > 0) {
          //  const Send = { id: data.Data, name: this.areaForm.value.areaName }

          let newData = Object.assign([], this.areaList)
          newData.push({ id: data.Data, text: this.areaForm.value.areaName })
          this.areaList = newData
          this.areNameId = data.Data
          this.areaID = data.Data
          this.Areaname = this.areaForm.value.areaName
          this._toastrcustomservice.showSuccess('', 'Area Added !')
          this.areaForm.reset()
          this.closeAreaModel()
          setTimeout(() => {
            this.areaSelect2.selector.nativeElement.focus()
          }, 500)
        }
        if (data.Code === 5000) {
          this._toastrcustomservice.showError('', data.Description)
          this.closeAreaModel()

        }
      })
    }

  }
  Areaname: any
  selectedArea(event) {
    if (event.data.length > 0) {
      if (event.data[0].selected) {
        if (event.data[0].id !== '0') {
          if (event.data[0].text !== 'Select Area') {
            this.areaID = event.value
            this.Areaname = event.data[0].text
          } else {
            this.areaID = undefined
            this.Areaname = ' '
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
  adressType(value) {
    this.addressError = false
    this.addressTypePlaceHolder = { placeholder: 'Select Address Type' }
    this.addressType = [{ id: '1', text: 'Personal' }, { id: '2', text: 'Work' }, { id: '3', text: 'Postal' }, { id: '4', text: 'Other' }]
    this.addresTypeId = this.addressType[0].id
    this.addTypeName = this.addressType[0].text

  }

  selectedAddressTypeId(event) {
    if (event && event.data.length > 0) {
      this.addTypeName = event.data[0].text
      this.addresTypeId = event.value
    } else {
      this.addresTypeId = event.value
      this.addTypeName = event.data[0].text

    }
    this.addressError = false
    this.addressDetailsValidation()
  }
  @ViewChild('state_select2') cityselecto: Select2Component

  /* clear validation */
  clearValidation() {
    this.createCustomerForm()
    this.coustomerForm.reset()
    this.getContactType()
    this.emailTypeDataType()
    this.collectionOfAddress = []
    this.closeAreaModel()
    this.select_Mobile.setElementValue(1)
    this.select_email.setElementValue(1)
   // this.phoneCodeselect2.setElementValue(0)
    this.countryList=[]
    this.stateList =[]
    this.cityList=[]
    this.areaList=[]
    this.select2VendorValue(UIConstant.ZERO)
    this.select2CrDrValue(1)
    this.crdrSelect2.setElementValue(1)
    this.customerTypeSelect2.setElementValue(0)
  }
  get add() { return this.adressForm.controls }

  private createCustomerForm() {
    this.coustomerForm = this._formBuilder.group({
      'customerName': [UIConstant.BLANK, Validators.required],
      'contactPerson': [UIConstant.BLANK, Validators.required],
      'doa': [UIConstant.BLANK],
      'dob': [UIConstant.BLANK],
      'gstin': [UIConstant.BLANK],
      'panNo': [UIConstant.BLANK],
      'openingblance': [0],
      'creditlimit': [0],
      'creditDays': [UIConstant.BLANK],
      'mobileNo': [UIConstant.BLANK],
      'EmailAddress': [UIConstant.BLANK]
    })
  }
  private addTyperessForm() {
    this.adressForm = this._formBuilder.group({
      'adresss': [UIConstant.BLANK, Validators.required],
      'postcode': [UIConstant.BLANK, Validators.required]
    })
  }
  addressRequiredForLedger: boolean
  mobileRequirdForSetting: boolean
  emailRequirdForSetting: boolean
  customerCustomRateFlag: boolean
  futureDateAn: any
  DateOfBirth: any=''
  DateOfAnniry:any=''
  futureDateB:any
  setDOBDate() {
    this.DateOfBirth =''
    this.futureDateAn = this._globalService.getDefaultDate(this.clientDateFormat)

  }
  setDOADate() {
    this.DateOfAnniry = ''
    this.futureDateB =this._globalService.getDefaultDate(this.clientDateFormat)
   
  }
  validMobileFlag: boolean
  editFlg: boolean
  EmailId: number
  requiredGSTNumber:boolean = false
  openModal() {
  
    this.contactId =0
    this.satuariesId =0
    this.disabledGSTfor_UnRegi = false
    this.disabledStateCountry = false
    this.requiredGSTNumber = false
    this.getEmailvalid = true
    this.mobileArray = []
    this.emailArray = []
    this.activaTab('customer1')
    this.enableContactFlag = true
    this.editEmailFlg = true
    this.editFlg = true
    this.getContactType()
    this.emailTypeDataType()
    this.validMobileFlag = false
    this.mobileNoId = 0
    this.EmailId = 0
    this.searchCountryCodeForMobile(' ')
    this.addressRequiredForLedger = false
    this.customerCustomRateFlag = false
    this.mobileRequirdForSetting = false
    this.emailRequirdForSetting = false
    this.addressClick = false
   
    this.setDOBDate()
    this.setDOADate()
   
    if (this.coustomerForm) {
      this.coustomerForm.reset()
    }
    if (this.editMode) {
      this.enableContactFlag = false
      this.select2VendorValue(UIConstant.ZERO)
      this.getCustomerEditData(this.id)
      this.adressType(0)
    } else {
      this.select2VendorValue(UIConstant.ZERO)
      this.getModuleSettingValue = JSON.parse(this._settings.moduleSettings)
      this.getModuleSettingData()
      this.id = UIConstant.ZERO
      $('#customer_form').modal(UIConstant.MODEL_SHOW)
      setTimeout(() => {
        this.ledgerName.nativeElement.focus()
      }, 500)
      this.collectionOfAddress = []
      this.customerTabDiv = false
      this.addressTabDiv = true
      this.createCustomerForm()
      this.id = UIConstant.ZERO
      this.satuariesId = UIConstant.ZERO
      this.submitClick = false
      this.addressid = UIConstant.ZERO
      this.select2CrDrValue(1)
      this.getCountry(0)
      this.adressType(0)
      this.getCustomoerType(0)
     //
     this.getOrgnizationAddress()
      this.select_Mobile.setElementValue(1)
      this.select_email.setElementValue(1)
      this.istradeDiscountValue = false
      this.isVolumeDiscountValue = false
      this.isDiscountValue = false
       this.CustomerRegisterTypeSelect2.setElementValue(1)
      this.VendorValidation()
      $('#tradediscount').prop('checked', false)
      $('#cashdiscount').prop('checked', false)
      $('#volumediscount1').prop('checked', false)
      /* ............................completed..................... */
    }
  }
  getModuleSettingValue:any
  @ViewChild('select_mobiletype') select_Mobile: Select2Component
  @ViewChild('select_emailtype') select_email: Select2Component

  @ViewChild('ledgerName') ledgerName
  customerValue: any
  getCustomoerType(value) {
    this.subscribe = this._coustomerServices.getCommonValues('116').subscribe(Data => {
    //  this.coustmoerTypePlaceholder = { placeholder: 'Select CustomerType' }
      this.customerType = [{ id: '0', text: 'Customer Type' }]
      Data.Data.forEach(element => {
        this.customerType.push({
          id: element.Id,
          text: element.CommonDesc
        })
      })
      this.customerValue = value
    })
  }

  isvolumeDisount(event) {
    if (event === true) {
      this.isVolumeDiscountValue = true
    } else {
      this.isVolumeDiscountValue = false
    }
  }

  isDicount(event) {
    if (event === true) {
      this.isDiscountValue = true
    } else {

      this.isDiscountValue = false
    }

  }

  istradeDiscount(event) {
    if (event === true) {
      this.istradeDiscountValue = true
    } else {
      this.istradeDiscountValue = false
    }
  }
  selectCRDRId(event) {
    this.crDrId = event.value
  }
  disabledGSTfor_UnRegi:boolean=false
  selectCoustmoreId(event) {
    this.coustmoreRegistraionId = +event.value
    if(+event.value===1){
      this.requiredGSTNumber = true
      this.disabledGSTfor_UnRegi= false
    }
    else if(+event.value===4){ 
      this.disabledGSTfor_UnRegi= true
      this.coustomerForm.controls.gstin.setValue('')
      this.requiredGSTNumber =false

    }
    else{
      this.requiredGSTNumber = false
      this.disabledGSTfor_UnRegi=false
      }


  }

  countrId: any
  selectCountryListId(event) {
    this.countrId = event.value
    this.countryError = false
    if (this.countrId > 0) {
      this.getStaeList(this.countrId, 0)

    }
  }

  customerTypeId: number = 0
  selectCustomerType(event) {
    if(event.value >0){
      this.customerTypeId = event.value
      this.customCustomer = false
      this.customerCustomRateFlag = false
    }
    else{
      this.customerTypeId = 0
  //    this.customerCustomRateFlag = false

      //this.customCustomer = false
    }

  }
  countryValue: any
  getCountry(value) {
    this.subscribe = this._coustomerServices.getCommonValues('101').subscribe(Data => {
      this.countryListPlaceHolder = { placeholder: 'Select Country' }
      this.countryList = [{ id: UIConstant.BLANK, text: 'Select Country' }]
      Data.Data.forEach(element => {
        this.countryList.push({
          id: element.Id,
          text: element.CommonDesc
        })
      })
      this.countryValue = value
    })
  }
  deleteArrayMobileType(i, type) {
    if (type === 'contact') {
      if (this.mobileArray.length > 0) {
        this.mobileArray.splice(i, 1)
      }
    }
    if (type === 'email') {
      if (this.emailArray.length > 0) {
        this.emailArray.splice(i, 1)
      }
    }

  }

  ParentTypeId: 5
  CodeId: any
  editRowItem(i, type, id) {
    if (type === 'contact') {
      if (this.editFlg) {
        this.editFlg = false
        this.mobileNoId = id
        this.contactType = this.mobileArray[i].ContactType
        this.select_Mobile.setElementValue(this.mobileArray[i].ContactType)
        this.contactTypeName = this.mobileArray[i].ContactTypeName
        this.coustomerForm.controls.mobileNo.setValue(this.mobileArray[i].ContactNo)
        this.CountryCode = this.mobileArray[i].CountryCode
        this.phoneCodeselect2.setElementValue(this.mobileArray[i].CodeId)
        this.CodeId = this.mobileArray[i].CodeId
        this.validMobileFlag = false
        this.deleteArrayMobileType(i, 'contact')
      }


      else {
        this._toastrcustomservice.showWarning('', 'Save Editable Contact')

      }
    }
    if (type === 'email') {
      if (this.editEmailFlg) {
        this.editEmailFlg = false
        this.EmailId = id
        this.EmailType = this.emailArray[i].EmailType
        this.select_email.setElementValue(this.emailArray[i].EmailType)
        this.EmailAddressTypeName = this.emailArray[i].EmailTypeName
        this.coustomerForm.controls.EmailAddress.setValue(this.emailArray[i].EmailAddress)
        this.deleteArrayMobileType(i, 'email')
      }
      else {
        this._toastrcustomservice.showWarning('', 'Save Editable Email')

      }


    }
  }


  checkSelectCode: boolean = false
  validateMobile(mobile) {
    let regx = /\[0-9]/g
    return regx.test(mobile)
  }
  invalidMobilelength: boolean = false
  checkNumberByCountry(e) {
    this.mobileNo = e.target.value
   // if (this.checkSelectCode) {
      if (this.validmobileLength === this.mobileNo.length) {
        this.validMobileFlag = false
      } else {
        this.validMobileFlag = true
      }
   // }

  }


  mobileNo: any
  mobileErrMsg: any
  code: any

  selectCoustomerplaceHolder: Select2Options
  coustomerValue: any
  coustmoreRegistraionId: number
  select2VendorValue(value) {
    this.selectyCoustmoreRegistration = []
    this.selectCoustomerplaceHolder = { placeholder: 'Select Customer Registration' }
    this.selectyCoustmoreRegistration = [ { id: '1', text: 'Regular' }
      , { id: '2', text: 'Composition' }, { id: '3', text: 'Exempted' }
      , { id: '4', text: 'UnRegistered' }, { id: '5', text: '	E-Commerce Operator ' }]
    this.coustomerValue = this.selectyCoustmoreRegistration[0].id
    this.coustmoreRegistraionId = +this.selectyCoustmoreRegistration[0].id

    // if(!this.editMode){
    //   this.coustmoreRegistraionId = +this.selectyCoustmoreRegistration[0].id
    // }
  
   // this.CustomerRegisterTypeSelect2.setElementValue(1)

  }

  select2CrDrPlaceHolder: Select2Options
  valueCRDR: any
  crDrId: number
  @ViewChild('crdrSelect2') crdrSelect2 :Select2Component

  select2CrDrValue (value) {
    this.selectCrDr = []
    this.select2CrDrPlaceHolder = { placeholder: 'Select CR/DR' }
    this.selectCrDr = [ { id: '1', text: 'CR' }, { id: '0', text: 'DR' }]
    this.valueCRDR = value
    this.crDrId =  value
   
  }

  addnewCoustomer() {
    $('#customer_form').modal(UIConstant.MODEL_SHOW)
    jQuery(function ($) {
      flatpickr('.customer-add', {
        maxDate: 'today',
        dateFormat: 'd M y'
      })
    })
    this.customerTabDiv = false
    this.addressTabDiv = true
    this.createCustomerForm()
    this.id = UIConstant.ZERO
    this.satuariesId = UIConstant.ZERO
    this.submitClick = false
    this.addressid = UIConstant.ZERO

    /* ..select 2 calling */
    this.select2VendorValue(UIConstant.ZERO)
    this.select2CrDrValue(1)
    this.getCountry(0)
    this.adressType(0)
    this.getCustomoerType(0)
    /* ....completd...... */

    /* ....................checkBox ......................*/
    this.istradeDiscountValue = false
    this.isVolumeDiscountValue = false
    this.isDiscountValue = false
    $('#tradediscount').prop('checked', false)
    $('#cashdiscount').prop('checked', false)
    $('#volumediscount1').prop('checked', false)
    /* ............................completed..................... */
  }
  requiredValid: boolean
  /* ...................adding customer........................... */
  saveCustomer(value) {
    this.submitClick = true
    
    this.checkGSTNumberValid()
    this.VendorValidation()
    this.emailAddingArray()
    this.addConatctDetails()
    this.addNewAdress()
    if (value === 'reset') {
        this.resetForNew()
         this.activaTab('customer1')
         this.getCountry(0)
         this.select2CrDrValue(1)
         this.crdrSelect2.setElementValue(1)
    } else {
      
      if (this.coustomerForm.valid && !this.validMobileFlag  &&  this.getEmailvalid && this.coustmoreRegistraionId > 0 && !this.customerCustomRateFlag) {
        if(!this.requiredGSTNumber){
        if (!this.mobileRequirdForSetting) {
          if (!this.emailRequirdForSetting) {
            if (!this.validGSTNumber) {
              if (!this.validPANFlag) {
                if (!this.addressRequiredForLedger) {
                  this.subscribe = this._coustomerServices.addVendore(this.customerParams()).subscribe(Data => {

                    if (Data.Code === UIConstant.THOUSAND) {
                      if (value === 'save') {
                        const dataToSend = { id: Data.Data, name: this.coustomerForm.value.customerName }
                        this._CommonService.AddedItem()
                        this._CommonService.closeCust({ ...dataToSend })
                        $('#customer_form').modal(UIConstant.MODEL_HIDE)
                        let saveFlag = this.editId === 0 ? UIConstant.SAVED_SUCCESSFULLY : UIConstant.UPDATE_SUCCESSFULLY
                        this._toastrcustomservice.showSuccess('', saveFlag)
                        this.select2CrDrValue(1)
                        this.crdrSelect2.setElementValue(1)
                      } else if (value === 'new') {
                        this.activaTab('customer1')
                        setTimeout(() => {
                          this.ledgerName.nativeElement.focus()
                        }, 500)
                        this.getCountry(0)
                        this._CommonService.AddedItem()
                        this._toastrcustomservice.showSuccess('', UIConstant.SAVED_SUCCESSFULLY)
                        this.id = 0
                        this.satuariesId = 0
                        this.contactId = 0
                        this.addressid = 0
                        this.select2CrDrValue(1)
                        this.crdrSelect2.setElementValue(1)
                        
                      }
                      this.disabledStateCountry = false
                      this.resetForNew()
                      this.resetAddress()
                    }
                    if (Data.Code === UIConstant.THOUSANDONE) {
                      this._toastrcustomservice.showInfo('', Data.Description)
                    }
                    if (Data.Code === 5001) {
                      this._toastrcustomservice.showError('', Data.Description)

                    }
                    if (Data.Code === UIConstant.REQUIRED_5020) {
                      this._toastrcustomservice.showError('', Data.Data)
  
                    }
                  }, () => {
                    //   console.log(error)
                  })
                } else {
                  this.activaTab('customer2')
                  this.adressTab()
                  this._toastrcustomservice.showError('', ' Enter Address ')
                }
              } else {
                this._toastrcustomservice.showError('', 'invalid PAN No.')
              }
            } else {
              this._toastrcustomservice.showError('', 'invalid GST No.')
            }

          } else {
            this.select_email.selector.nativeElement.focus()
            this._toastrcustomservice.showError('', ' Enter Email')
          }
        } else {
          this.select_Mobile.selector.nativeElement.focus()
          this._toastrcustomservice.showError('', '  Enter Contact Details')
        }
      } else {
        this.validGSTNumber = true
        this._toastrcustomservice.showError('', 'Enter GSTIN No.')
      }
      }
    }
  }

  resetForNew() {

    this.submitClick = false
    this.coustomerForm.reset()
    this.createCustomerForm()
    //this.select2VendorValue(0)
    this.getCustomoerType(0)
    this.mobileArray = []
    this.emailArray = []
    this.collectionOfAddress = []
    this.createCustomerForm()
    this.countryList=[]
    this.stateList =[]
    this.cityList=[]
    this.areaList=[]
  }
  errormassage: string
  stateError: boolean
  cityError: boolean
  mobileError: boolean
  emailError: boolean
  mobileErrormass: string
  emailErrormass: string
  reqEmailMobile: boolean
  VendorValidation() {
    if (this.coustmoreRegistraionId > 0) {
      this.customerRegistraionError = false
    } else {
      this.customerRegistraionError = true

    }
   
   if(this.customerCustomRateFlag){
    if ( this.customerTypeId===0) {
      this.customCustomer = true
     // this.customerCustomRateFlag = false
    } else {
      this.customCustomer = false
      //this.customerCustomRateFlag = true
    }
   }
  
    if (!this.mobileRequirdForSetting) {
      this.mobileError = false
      this.reqEmailMobile = false

    } else {
      this.mobileError = true
      this.mobileErrormass = ErrorConstant.ATLEAST_ADD_SINGLE_RECORD
      this.reqEmailMobile = false

    }
    if (!this.emailRequirdForSetting) {
      this.emailError = false
      this.reqEmailMobile = false

    } else {
      this.emailError = true
      this.emailErrormass = ErrorConstant.ATLEAST_ADD_SINGLE_RECORD
      this.reqEmailMobile = false

    }
  }

  @ViewChild('area_selecto2') areaSelect2: Select2Component
  addressDetailsValidation() {
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
  gstNumberRegxValidation(gstNumber) {
    //  /^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$ // working
    //  /^([0-9]{2}[a-zA-Z]{4}([a-zA-Z]{1}|[0-9]{1})[0-9]{4}[a-zA-Z]{1}([a-zA-Z]|[0-9]){3}){0,15}$/
    let regxGST = /^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/
    return regxGST.test(gstNumber)
  }
  panNumberRegxValidation(panNumber) {
    let regxPAN = /[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    return regxPAN.test(panNumber)
  }
  validPANFlag: boolean = false
  GSTNumber: any
  PANNumber: any
  onInputCheckPANNumber(event) {
    this.PANNumber = (event.target.value).toUpperCase()
    if (this.PANNumber !== '' && this.PANNumber !== null) {
      if (this.panNumberRegxValidation(this.PANNumber)) {
        this.validPANFlag = false
      } else {
        this.validPANFlag = true
      }
    } else {
      this.validPANFlag = false
    }
  }
  disabledStateCountry:any
  validGSTNumber: boolean = false


  getStateCode = async (stateCode) =>{
    this._CommonService.getStateByGStCode(stateCode).
    pipe(
      takeUntil(this.unSubscribe$)
    ).
    subscribe((response: any) => {
      if(response.Code=== UIConstant.THOUSAND && response.Data.length){
        this.countrId =response.Data[0].CommonId
        this.stateId = response.Data[0].Id
        this.countryselecto.setElementValue(response.Data[0].CommonId)
        this.getOneState(response)
        this.stateselecto.setElementValue( response.Data[0].Id)
        
      }
    })
  }

  
    getOneState (rsp){
     let  newdata =[]
        newdata.push({
          id:rsp.Data[0].Id,
          text: rsp.Data[0].CommonDesc1
        })
        this.disabledStateCountry =true
      this.stateList = newdata
      this.getCitylist(rsp.Data[0].Id, 0)
    }
  checkGSTNumber (event) {
    this.coustomerForm.value.gstin = event.target.value;
    let str = this.coustomerForm.value.gstin
    let val =  str.trim();
    this.GstinNoCode = val.substr(0,2);
    if( this.GstinNoCode !==''){
      this.getStateCode(this.GstinNoCode)
    }
    else{
      this.disabledStateCountry =false
      
    }
    
    this.matchStateCodeWithGSTNumber()
    this.checkGSTNumberValid()
  }
  GSTStateCode:any=0
  GstinNoCode:any
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
  checkGSTNumberValid () {
    if(this.coustomerForm.value.gstin  !=='' && this.coustomerForm.value.gstin !==null){
      if(this.coustmoreRegistraionId === 1){
        if (this._CommonService.gstNumberRegxValidation((this.coustomerForm.value.gstin).toUpperCase())) {
          this.validGSTNumber = false
          this.requiredGSTNumber = false
          
        } else {
          this.validGSTNumber = true
          this.requiredGSTNumber = true
        }
      }
     
    } else {
      this.validGSTNumber = false
    }
 
}


  private customerParams(): AddLedger {
    let DOA;
    let DOB;
    // DateOfAnniry:any
  if(this.DateOfAnniry !==''){
     DOA = this._globalService.clientToSqlDateFormat(this.DateOfAnniry, this.clientDateFormat)
  }
  else{
    DOA=''
  }
  if(this.DateOfBirth !==''){
     DOB = this._globalService.clientToSqlDateFormat(this.DateOfBirth, this.clientDateFormat)
 }
 else{
  DOB=''
 }

    let customerElement = {
      customerOBJ: {
        Id: this.id !==0 ? this.editId :0,
        Websites: [],
        GlId: 5,
        CustomerTypeId: this.customerTypeId,
        Name: this.coustomerForm.value.customerName,
        TaxTypeID: this.coustmoreRegistraionId,
        CrDr: this.crDrId,
        OpeningAmount: this.getopeinAmountValue(),
        CreditDays: this.creditDaysValue(),
        CreditLimit: this.getCreditLimit(),
        IsTradeDiscountable: this.istradeDiscountValue,
        IsVolumeDiscountable: this.isVolumeDiscountValue,
        IsCashDiscountable: this.isDiscountValue,

        Statutories: [{
          Id: this.satuariesId !==0 ? this.satuariesId : 0,
          PanNo: this.PANNumber,
          GstinNo: this.coustomerForm.value.gstin,
          ParentTypeId: 5
        }],
        ContactPersons: [{
          Id: this.contactId !==0 ?this.contactId : 0,
          ParentTypeId: 5,
          Name: this.coustomerForm.value.contactPerson,
          DOB: DOB,
          DOA: DOA
        }],

        ContactInfos: this.mobileArray,
        Addresses: this.collectionOfAddress,
        Emails: this.emailArray
      } as AddLedger
    }
console.log(customerElement,'customer-Req-')
    return customerElement.customerOBJ
  }
  private getCreditLimit() {
    if (this.coustomerForm.value.creditlimit > 0) {
      return this.coustomerForm.value.creditlimit
    } else {
      return 0
    }
  }
  private creditDaysValue() {
    if (this.coustomerForm.value.creditDays > 0) {
      return this.coustomerForm.value.creditDays
    } else {
      return 0
    }
  }
  private getopeinAmountValue() {
    if (this.coustomerForm.value.openingblance > 0) {
      return this.coustomerForm.value.openingblance
    } else {
      return 0
    }
  }
  addressClick: boolean
  country: string
  stateName: string
  cityName: string
  addNewAdress() {
    this.addressClick = true
    this.addressDetailsValidation()
    if (this.stateId > 0 && this.cityId > 0 && this.countrId > 0 && this.adressForm.value.adresss !== '' && this.adressForm.value.adresss !== null) {
      this.addressRequiredForLedger = false
      this.countryList.forEach(element => {
        if (element.id === JSON.parse(this.countrId)) {

          this.country = element.text
        }
      })
      this.stateList.forEach(element => {
        if (element.id === JSON.parse(this.stateId)) {
          this.stateName = element.text
        }
      })

      this.cityList.forEach(element => {
        if (element.id === JSON.parse(this.cityId)) {
          this.cityName = element.text
        }
      })
      if (this.addressIndex !== undefined) {

        if (this.collectionOfAddress.length > 0) {

          let newArray = {
            Id: this.collectionOfAddress[this.addressIndex].Id !== 0 ? this.collectionOfAddress[this.addressIndex].Id : 0,
            ParentTypeId: 5,
            CountryId: this.countrId,
            StateId: this.stateId,
            CityId: this.cityId,
            AddressType: this.addresTypeId,
            AddressTypeName: this.addTypeName,
            PostCode: this.adressForm.value.postcode,
            AreaId: this.areaID,
            AreaName: this.Areaname,
            AddressValue: this.adressForm.value.adresss,
            CountryName: this.country,
            Statename: this.stateName,
            CityName: this.cityName
          }

          this.collectionOfAddress.splice(this.addressIndex, 1, newArray)

        }

        this.addressIndex = undefined

      } else {
        this.collectionOfAddress.push({
          Id: 0,
          ParentTypeId: 5,
          CountryId: this.countrId,
          StateId: this.stateId,
          CityId: this.cityId,
          AddressType: this.addresTypeId,
          AddressTypeName: this.addTypeName,
          PostCode: this.adressForm.value.postcode,
          AreaId: this.areaID,
          AreaName: this.Areaname,
          AddressValue: this.adressForm.value.adresss,
          CountryName: this.country,
          Statename: this.stateName,
          CityName: this.cityName
        })
      }
      this.addressClick = false
    }

    this.adressForm.reset()
    //this.resetAddress()
    this.adressType(0)
    setTimeout(() => {
      this.countryselecto.selector.nativeElement.focus()
    }, 1000)
  }
  resetAddress(){
    this.getCountry(0)
    this.countryList =[]
    this.stateList=[]
    this.cityList=[]
    this.areaList=[]
  }
  addressIndex: any
  getEditAddress(address, index) {
    this.addressIndex = index
    this.adressForm.controls.postcode.setValue(address.PostCode)
    this.adressForm.controls.adresss.setValue(address.AddressValue)
    this.getCountry(address.CountryId)
    this.adressType(address.AddressType)

  }




  ngOnDestroy() {
    this.modalSub.unsubscribe()
    this.confirmSUB.unsubscribe()
  }
  setupCodeForAddresRequired: any
  removeAdressIndexArray(i) {
    this.collectionOfAddress.splice(i, 1)
    if (this.collectionOfAddress.length > 0) {
      this.addressRequiredForLedger = false
    } else
      if (this.setupCodeForAddresRequired === 54) {
        this.addressRequiredForLedger = true
      } else {
        this.addressRequiredForLedger = false

      }
  }

  getCustomerEditData(id) {
    setTimeout(() => {
      this.ledgerName.nativeElement.focus()
    }, 1000)
    this.getCountry(0)
    this.submitClick = false
    $('#customer_form').modal(UIConstant.MODEL_SHOW)
    this.customerTabDiv = false
    this.addressTabDiv = true

    this.subscribe = this._coustomerServices.editvendor(id).subscribe(Data => {
      if (Data.Code === UIConstant.THOUSAND) {
        if (Data.Data && Data.Data.Statutories && Data.Data.Statutories.length > 0) {
          this.satuariesId = Data.Data.Statutories[0].Id
          this.coustomerForm.controls.gstin.setValue(Data.Data.Statutories[0].GstinNo)
          this.coustomerForm.controls.panNo.setValue(Data.Data.Statutories[0].PanNo)
        }
        if (Data.Data && Data.Data.Addresses && Data.Data.Addresses.length > 0) {
          this.collectionOfAddress = []
          this.collectionOfAddress = Data.Data.Addresses
          this.addressRequiredForLedger = false

        } else {
          this.collectionOfAddress = []
        }

        if (Data.Data && Data.Data.ContactPersons && Data.Data.ContactPersons.length > 0) {
          this.contactId = Data.Data.ContactPersons[0].Id
          this.coustomerForm.controls.contactPerson.setValue(Data.Data.ContactPersons[0].Name)
          if (Data.Data.ContactPersons[0].DOA !== null) {
            this.DateOfAnniry = this._globalService.utcToClientDateFormat(Data.Data.ContactPersons[0].DOA, this.clientDateFormat)
            // this.coustomerForm.controls.doa.setValue(DOA)
          }
          else {
            this.coustomerForm.controls.doa.setValue('')
          }
          if (Data.Data.ContactPersons[0].DOB !== null) {
            this.DateOfBirth = this._globalService.utcToClientDateFormat(Data.Data.ContactPersons[0].DOB, this.clientDateFormat)
            // this.coustomerForm.controls.dob.setValue(DOB)
          }
          else {
            this.coustomerForm.controls.dob.setValue('')
          }
        }

        if (Data.Data && Data.Data.LedgerDetails && Data.Data.LedgerDetails.length > 0) {
          this.coustomerForm.controls.customerName.setValue(Data.Data.LedgerDetails[0].Name)
          this.coustomerForm.controls.creditDays.setValue(Data.Data.LedgerDetails[0].CreditDays)
          this.coustomerForm.controls.creditlimit.setValue((Data.Data.LedgerDetails[0].CreditLimit).toFixed(this.noOfDecimal))
          this.coustomerForm.controls.openingblance.setValue(( Data.Data.LedgerDetails[0].OpeningBalance).toFixed(this.noOfDecimal) )
          this.customerTypeId = Data.Data.LedgerDetails[0].CustomerTypeId
          this.coustmoreRegistraionId = Data.Data.LedgerDetails[0].TaxTypeId
          this.requiredGSTNumber =  Data.Data.LedgerDetails[0].TaxTypeId ===1 ? true : false
          this.crDrId = Data.Data.LedgerDetails[0].Crdr
          this.getCustomoerType(Data.Data.LedgerDetails[0].CustomerTypeId)
          this.CustomerRegisterTypeSelect2.setElementValue(Data.Data.LedgerDetails[0].TaxTypeId)
          // this.select2VendorValue(Data.Data.LedgerDetails[0].TaxTypeId)
          this.disabledGSTfor_UnRegi = Data.Data.LedgerDetails[0].TaxTypeId === 4 ? true :false
          
         
          this.select2CrDrValue(Data.Data.LedgerDetails[0].Crdr)
        }

        if (Data.Data.ContactInfo.length > 0) {

          this.mobileRequirdForSetting = false
          this.mobileArray = []
          this.mobileArray = Data.Data.ContactInfo
          console.log(this.mobileArray, 'hhhh---')
        } else {
          this.mobileArray = []
          //   this.addingArrayinMobleType(0)
        }
        if (Data.Data && Data.Data.Emails.length > 0) {
          this.emailRequirdForSetting = false
          this.emailArray = []
          this.emailArray = Data.Data.Emails
        } else {
          this.emailArray = []
          //this.emailAddingArray(0)
        }

        if (Data.Data.LedgerDetails[0].IsTradeDiscountable === true) {
          this.istradeDiscountValue = true
          $('#tradediscount').prop('checked', true)
        } else {
          $('#tradediscount').prop('checked', false)
          this.istradeDiscountValue = false
        }
        if (Data.Data.LedgerDetails[0].IsVolumeDiscountable === true) {
          $('#volumediscount1').prop('checked', true)
          this.isVolumeDiscountValue = true
        } else {
          $('#volumediscount1').prop('checked', false)
          this.isVolumeDiscountValue = false
        }

        if (Data.Data.LedgerDetails[0].IsCashDiscountable === true) {
          $('#cashdiscount').prop('checked', true)
          this.isDiscountValue = true
        } else {
          $('#cashdiscount').prop('checked', false)
          this.isDiscountValue = false
        }
      }
      if(Data.Code ===5000){
        this._toastrcustomservice.showError('',Data.Description)
      }
    })
  }
  
  @ViewChild('customer_type_select2') customerTypeSelect2 :Select2Component

  reapeatName(name: string) {
    this.coustomerForm.controls.contactPerson.setValue(name)
  }
  getModuleSettingData () {
        if ( this.getModuleSettingValue.settings.length > 0) {
          this.getModuleSettingValue.settings.forEach(ele => {
            if (ele.id=== SetUpIds.edgerEmailorMobileRequiredorNot && ele.val === '1') {
              this.emailError = false
              this.mobileRequirdForSetting = true
            } 
            if (ele.id=== SetUpIds.dateFormat) {
              this.clientDateFormat =  ele.val[0].Val
              console.log(this.clientDateFormat)
             }
            if (SetUpIds.edgerEmailorMobileRequiredorNot === ele.id && ele.val === '2') {
              this.emailRequirdForSetting = true
              this.mobileRequirdForSetting = true
              this.mobileError = true
              this.emailError = true
            }
            if (ele.id === SetUpIds.edgerEmailorMobileRequiredorNot && ele.val === '3') {
              this.emailError = true
              this.mobileError = false
              this.emailRequirdForSetting = true
            }
            if (ele.id === SetUpIds.edgerAddressRequiredorNot && ele.val === '1') {
              this.setupCodeForAddresRequired = 54
              this.addressRequiredForLedger = true

            }
            if (ele.id === SetUpIds.applyCustomRateOnItemForSale && ele.val === '1') {
              this.customerCustomRateFlag = true

            }
          })
          }
          }








  contactTypeData: any
  getContactType() {
    this.contactTypeData = [
      { id: '1', text: 'Work' },
      { id: '2', text: 'Home' },
      { id: '3', text: 'Mobile' },
      { id: '4', text: 'Fax' },
      { id: '5', text: 'Skype' },
      { id: '6', text: 'YMessenger' },
      { id: '7', text: 'Sip' },
      { id: '8', text: 'Other' }
    ]
   
  }
  selectMobileId: any
  emailTypeData: any
  emailTypeDataType() {
    this.emailTypeData = [
      { id: '1', text: 'Personal' },
      { id: '2', text: 'Work' },
      { id: '3', text: 'Home' },
      { id: '4', text: 'Other' }
    ]

  }
  selectEmailId: any
  countryListWithCode: any
  searchCountryCodeForMobile(name) {
    this.subscribe = this._CommonService.searchCountryByName(name).subscribe(Data => {
      if (Data.Code === UIConstant.THOUSAND && Data.Data.length > 0) {
        this.countryListWithCode = []
        let newdataList = [{ id: '0', text: 'Country-Code', PhoneCode: '0', Length: 0 }]
        Data.Data.forEach(element => {
          newdataList.push({
            id: element.Phonecode,
            text: '+' + element.Phonecode + '-' + element.Name,
            PhoneCode: element.Phonecode,
            Length: element.Length
          })
        })
        this.countryListWithCode = newdataList
        console.log(Data, 'code')
      } else {
        this._toastrcustomservice.showError('', Data.Description)

      }
    })
  }
  CountryCode: any = 'select'
  codeLengthList: any
  validmobileLength: any
  enableContactFlag: boolean
  onCountryCodeSelectionChange = (event) => {
    if (event.data.length > 0) {
      if(event.data[0].id !== '0'){
        this.checkSelectCode = true
        this.enableContactFlag = false
        this.CountryCode = '+' + event.data[0].PhoneCode
        this.validmobileLength = event.data[0].Length
        this.CountryCodeId =  event.data[0].PhoneCode
      }
      else{
        this.enableContactFlag = true
      }
      
    }
  }
  
  contactType: any
  contactTypeName: any
  CountryCodeId: any
  onChangeContactType = (event) => {
    if (event.data.length > 0) {
      this.contactType = event.data[0].id
      this.contactTypeName = event.data[0].text
    }

  }
  EmailType: any
  EmailAddress: any
  EmailAddressTypeName: any
  onChangeEmailType = (event) => {
    if (event.data.length > 0) {
      this.EmailType = event.data[0].id
      this.EmailAddressTypeName = event.data[0].text
    }

  }
  validateEmail(email) {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
  }
  editEmailFlg: boolean = true
  emailAddingArray() {
    
    this.editEmailFlg = true
    this.checkvalidationEmail()
    if (this.EmailType > 0 && this.getEmailvalid && this.coustomerForm.value.EmailAddress !== null && this.coustomerForm.value.EmailAddress !== '') {
      this.emailRequirdForSetting = false
      this.emailArray.push({
        Id: this.EmailId === 0 ? 0 : this.EmailId,
        EmailType: this.EmailType,
        EmailTypeName: this.EmailAddressTypeName,
        EmailAddress: this.coustomerForm.value.EmailAddress,
        ParentTypeId: 5

      })

      this.clear('email')
    }

  }
  @ViewChild('phoneCode_select2') phoneCodeselect2: Select2Component

  clear(type) {
    if (type === 'email') {
      this.coustomerForm.controls.EmailAddress.setValue('')
      this.select_email.setElementValue(1)
      this.EmailType = '1'
    }
    if (type === 'contact') {
      this.coustomerForm.controls.mobileNo.setValue('')
      //this.phoneCodeselect2.setElementValue(0)
      this.select_Mobile.setElementValue(1)
      this.contactType = '1'
      this.CountryCode = 0
      this.validMobileFlag = false
    }
  }

  addConctFlag: boolean = false
  addConatctDetails() {
    this.addConctFlag = true
    this.editFlg = true
    if (this.contactType > 0 && this.CountryCode > 0 && !this.validMobileFlag && this.coustomerForm.value.mobileNo !== '') {

      this.mobileRequirdForSetting = false
      this.mobileArray.push({
        Id: this.mobileNoId === 0 ? 0 : this.mobileNoId,
        ContactType: this.contactType,
        ContactTypeName: this.contactTypeName,
        ContactNo: this.coustomerForm.value.mobileNo,
        CountryCode: this.CountryCode,
        CodeId: this.CountryCodeId,
        ParentTypeId: 5

      })

      this.enableContactFlag = true
      this.clear('contact')
    }


  }
  invalidObj: any = {}
  invalidObjCont: any = {}

  getEmailvalid: any
  checkvalidationEmail() {
    if (this.coustomerForm.value.EmailAddress === "" || this.coustomerForm.value.EmailAddress === null) {
      this.getEmailvalid = true
    }
    else {
      this.getEmailvalid = this.validateEmail(this.coustomerForm.value.EmailAddress)
      return this.getEmailvalid
    }


  }

  pressEnterEmailadd(e: KeyboardEvent) {
    this.emailAddingArray()
            
            this.activaTab('customer2')
            this.adressTab()
  //  this._CommonService.openConfirmation('email', 'Email Details')

  }

  pressEnterMobileAdd(e: KeyboardEvent) {
    this.addConatctDetails()
    setTimeout(() => {
    this.select_email.selector.nativeElement.focus()
    }, 10)


  }
  countryValue1:any =null
  stateValuedata1:any =null
  countryCodeFlag:any =null
  cityValue1:any = null
  getOrgnizationAddress (){
    let Address= JSON.parse(localStorage.getItem('ORGNIZATIONADDRESS'));
    this.validmobileLength=Address.Length
    this.countryCodeFlag =Address.CountryCode
    this.phoneCodeselect2.setElementValue(Address.CountryCode)
   }

}
