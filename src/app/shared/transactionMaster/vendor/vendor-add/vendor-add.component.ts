import { Component, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core'
import { Subscription } from 'rxjs'
import { Select2OptionData, Select2Component } from 'ng2-select2'
import { FormBuilder, Validators, FormGroup } from '@angular/forms'
import { AddCust, Ledger } from '../../../../model/sales-tracker.model'
import { SaniiroCommonService } from '../../../../commonServices/SaniiroCommonService'
import { CommonSetGraterServices } from '../../../../commonServices/setgatter.services'
import { UIConstant } from '../../../constants/ui-constant'
import { VendorServices } from '../../../../commonServices/TransactionMaster/vendoer-master.services'
import { ToastrCustomService } from '../../../../commonServices/toastr.service'
import { CommonService } from '../../../../commonServices/commanmaster/common.services'
import { GlobalService } from '../../../../commonServices/global.service'
import { Settings } from '../../../../shared/constants/settings.constant'
import { bypassSanitizationTrustResourceUrl } from '@angular/core/src/sanitization/bypass'
declare const $: any
declare const flatpickr: any
@Component({
  selector: 'app-vendor-add',
  templateUrl: './vendor-add.component.html',
  styleUrls: ['./vendor-add.component.css']
})

export class VendorAddComponent implements OnDestroy {
  @Output() onFilter = new EventEmitter()
  vendorForm: FormGroup
  bankForm: FormGroup
  adressForm: FormGroup
  subscribe: Subscription
  VendorDetailShow: Ledger[]
  id: any
  statutoriesId: any
  contactPersonId: any
  adressArray: any
  emailAdressArray: any
  ContactInfoId: number
  bankArray: any = []
  vendorRegiError: any
  areaForm: FormGroup
  public selectVendor: Array<Select2OptionData>
  public selectCrDr: Array<Select2OptionData>
  public countryList: Array<Select2OptionData>
  public stateList: Array<Select2OptionData>
  public cityList: Array<Select2OptionData>
  public areaList: Array<Select2OptionData>
  public addressType: Array<Select2OptionData>
  public addressTypePlaceHolder: Select2Options

  public areaListPlaceHolder: Select2Options
  public stateListplaceHolder: Select2Options
  public countryListPlaceHolder: Select2Options
  modalSub: Subscription
  editvenderSubscribe: Subscription
  ledgerId: any
  parentTypeIdofStatutoriesId: any
  bankId: any = 0
  editBankDataFlag: boolean = false
  editMode: boolean = false
  clientDateFormat: any
  isAddNew: boolean = false
  get f () { return this.vendorForm.controls }
  get bank () { return this.bankForm.controls }
  get address () { return this.adressForm.controls }
  // cleckTab:any
  constructor (private _CommonService: CommonService, private _vendorServices: VendorServices,
    private _formBuilder: FormBuilder,
    private _sanariioservices: SaniiroCommonService,
    private _commonGaterSeterServices: CommonSetGraterServices,
    private _toastrcustomservice: ToastrCustomService,
    public _globalService: GlobalService, public _settings: Settings) {
    this.clientDateFormat = this._settings.dateFormat

    this.formVendor()
    this.formBank()
    this.addTyperessForm()
    this.addArea()
    this.modalSub = this._CommonService.getVendStatus().subscribe(
      (data: AddCust) => {
        if (data.open) {
          this.isAddNew = data.isAddNew
          if (data.editId === '') {
            this.editMode = false
            this.enableContactFlag = true
          } else {
            this.id = data.editId
            this.editMode = true
          }
          this.openModal()
        } else {
          this.closeModal()
        }
      }
    )

  }

  get adAre () { return this.areaForm.controls }
  ngOnDestroy () {
    this.modalSub.unsubscribe()
    this.editvenderSubscribe.unsubscribe()
  }
  setDOBDate () {
    let _self = this
    jQuery(function ($) {
      flatpickr('#flatpickr_dob', {
        maxDate: 'today',
        dateFormat: _self.clientDateFormat

      })
    })
  }
  setDOADate () {
    let _self = this
    jQuery(function ($) {
      flatpickr('#flatpickr_doa', {
        maxDate: 'today',
        dateFormat: _self.clientDateFormat

      })
    })
  }
  addressRequiredForLedger: boolean
  mobileRequirdForSetting: boolean
  emailRequirdForSetting: boolean

  openModal () {
    this.editFlg = true
    this.editEmailFlg = true
    this.getEmailvalid = true
    this.getContactType()
    this.emailTypeDataType()
     this.validMobileFlag= false
    this.mobileNoId =0
    this.EmailId=0
    this.setDOADate()
    this.setDOBDate()
    this.searchCountryCodeForMobile(' ')
    this.addressRequiredForLedger = false
    this.mobileRequirdForSetting = false
    this.emailRequirdForSetting = false
    this.emailMobileValidationRequired()
    if (this.vendorForm) {
      this.vendorForm.reset()
      this.bankForm.reset()
    }
    if (this.editMode) {

      this.getVendorEditData(this.id)
    } else {
      this.getVendorDetail()
      $('#vendor_form').modal(UIConstant.MODEL_SHOW)
      setTimeout(() => {
        this.ledgerName.nativeElement.focus()
      }, 1000)

      this.mobileArray = []
      this.emailArray = []
      this.collectionOfAddress = []
      this.adressArray = []
      this.emailAdressArray = []
      this.submitClick = false
      this.bankClick = false
      this.addressClick = false
      this.emailAdressArray = []
      this.emailPlusAddingArray(0)
      this.select2VendorValue(UIConstant.ZERO)
      this.select2CrDrValue(0)
      this.getCountry(0)

      this.formVendor()
      this.formBank()
      this.addTyperessForm()
      this.bankArray = []
      this.isMsdm = false
      this.isRcm = false
      this.id = UIConstant.ZERO

      this.addressDiv = false
      this.vendorDiv = true
      this.bankDiv = false
      this.select2VendorValue(UIConstant.ZERO)
      $('#tradediscount').prop('checked', false)
      $('#cashdiscount').prop('checked', false)
      $('#volumediscount1').prop('checked', false)
      /* ............................completed..................... */
    }
  }
  @ViewChild('ledgerName') ledgerName
  closeModal () {
    if ($('#vendor_form').length > 0) {
      this.id = UIConstant.ZERO
      this.editMode = false
      $('#vendor_form').modal(UIConstant.MODEL_HIDE)
    }
  }
  getVendorEditData (id) {
    this.submitClick = false
    $('#vendor_form').modal(UIConstant.MODEL_SHOW)
    this.editvenderSubscribe = this._vendorServices.editvendor(id).subscribe(
      (Data) => {
        if (Data.Code === UIConstant.THOUSAND) {
          if (Data.Data && Data.Data.Addresses.length > 0) {
            this.addressRequiredForLedger = false
            this.collectionOfAddress = []
            this.collectionOfAddress = Data.Data.Addresses
          } else {
            this.collectionOfAddress = []
          }

          if (Data.Data && Data.Data.Emails.length > 0) {
            this.emailRequirdForSetting = false
            this.emailArray = []
            this.emailArray = Data.Data.Emails

          } else {
            this.emailArray = []
          }
          if (Data.Data.ContactInfo.length > 0) {
            this.mobileRequirdForSetting = false

            this.mobileArray = []
            this.mobileArray = Data.Data.ContactInfo

          } else {
            this.mobileArray = []
          }

          if (Data.Data && Data.Data.Banks.length > 0) {

            this.bankArray = []
            this.bankArray = Data.Data.Banks
          } else {

            this.bankArray = []
          }
          if (Data.Data && Data.Data.LedgerDetails.length > 0) {
            this.vendorForm.controls.vendorName.setValue(Data.Data.LedgerDetails[0].Name)
            this.select2CrDrValue(Data.Data.LedgerDetails[0].Crdr)
            this.select2VendorValue(Data.Data.LedgerDetails[0].TaxTypeId)
            this.vendorForm.controls.openingBlance.setValue(Data.Data.LedgerDetails[0].OpeningBalance)
          }

          if (Data.Data && Data.Data.Statutories.length > 0) {
            this.statutoriesId = Data.Data.Statutories[0].Id
            this.parentTypeIdofStatutoriesId = Data.Data.Statutories[0].ParentTypeId
            this.vendorForm.controls.gstNo.setValue(Data.Data.Statutories[0].GstinNo)
            this.vendorForm.controls.panNo.setValue(Data.Data.Statutories[0].PanNo)
          }
          if (Data.Data && Data.Data.ContactPersons.length > 0) {
            this.contactPersonId = Data.Data.ContactPersons[0].Id
            this.vendorForm.controls.contactPerson.setValue(Data.Data.ContactPersons[0].Name)
            if(Data.Data.ContactPersons[0].DOA !==null){
              let DOA = this._globalService.utcToClientDateFormat(Data.Data.ContactPersons[0].DOA, this.clientDateFormat)
               this.vendorForm.controls.daoDate.setValue(DOA)
            }
            else {
              this.vendorForm.controls.daoDate.setValue('')
            }
            if(Data.Data.ContactPersons[0].DOA !==null){
              let DOB = this._globalService.utcToClientDateFormat(Data.Data.ContactPersons[0].DOB, this.clientDateFormat)
              this.vendorForm.controls.dobDate.setValue(DOB)
            }
            else{
              this.vendorForm.controls.dobDate.setValue('')
           

            }
          }
          if (Data.Data.LedgerDetails[0].IsMsmed === true) {
            this.isMsdm = true
            $('#msmed').prop('checked', true)
          } else {
            $('#msmed').prop('checked', false)
            this.isMsdm = false
          }
          if (Data.Data.LedgerDetails[0].IsRcm === true) {
            $('#rcma').prop('checked', true)
            this.isRcm = true
          } else {
            $('#rcma').prop('checked', false)
            this.isRcm = false
          }
          this.adressType(0)
          // if (Data.Data && Data.Data.addresses.length > 0) {

          // }
        }
      })

  }
  private formVendor () {
    this.vendorForm = this._formBuilder.group({
      'vendorName': [UIConstant.BLANK, Validators.required],
      'contactPerson': [UIConstant.BLANK, Validators.required],
      'registrationNo': [UIConstant.BLANK],
      'gstNo': [UIConstant.BLANK],
      'panNo': [UIConstant.BLANK],
      'openingBlance': [UIConstant.BLANK],
      'daoDate': [UIConstant.BLANK],
      'dobDate': [UIConstant.BLANK],
      'mobileNo': [UIConstant.BLANK],
      'EmailAddress' :  [UIConstant.BLANK]
    })
  }

  private formBank () {
    this.bankForm = this._formBuilder.group({
      'bankName': [UIConstant.BLANK, Validators.required],
      'accountNo': [UIConstant.BLANK, Validators.required],
      'ifscCode': [UIConstant.BLANK, Validators.required],
      'branch': [UIConstant.BLANK, Validators.required],
      'micrNo': [UIConstant.BLANK, Validators]
    })
  }

  private addTyperessForm () {
    this.adressForm = this._formBuilder.group({
      'adressvalue': [UIConstant.BLANK, Validators.required],
      'postcode': [UIConstant.BLANK, Validators.required]

    })
  }

  ngOnInit () {
    this.adressArray = []
    this.emailAdressArray = []
    this.mobileArray = []
    this.emailArray = []
    this.collectionOfAddress = []
    this.bankArray = []
    this.stateList = []
    this.cityList = []
    $('#rcma').prop('checked', false)
    this.isRcm = false
    $('#msmed').prop('checked', false)
    this.isMsdm = false
    jQuery(function ($) {
      flatpickr('.vendor-add', {
        maxDate: 'today'
      })
    })
    this.submitClick = false
    this.adressArray = []
    this.emailAdressArray = []
    this.emailPlusAddingArray(0)
    this.select2VendorValue(UIConstant.ZERO)
    this.select2CrDrValue(0)
    this.formVendor()
    this.formBank()
    this.addTyperessForm()
    this.bankArray = []
    this.adressType(0)
    this.addressDiv = false
    this.vendorDiv = true
    this.bankDiv = false
  }

  mobileErrormass: any

  gstNumberRegxValidation (gstNumber) {
    let regxGST = /^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/
    return regxGST.test(gstNumber)
  }

  panNumberRegxValidation (panNumber) {
    let regxPAN = /[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    return regxPAN.test(panNumber)
  }
  validPANFlag: boolean = false

  checkPANNumberValid () {
    this.PANNumber = (this.vendorForm.value.panNo).toUpperCase()
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
  validGSTNumber: boolean = false
  checkGSTNumberValid () {
    this.GSTNumber = (this.vendorForm.value.gstNo).toUpperCase()
    // debugger
    if (this.GSTNumber !== '' && this.GSTNumber !== null) {
      if (this.gstNumberRegxValidation(this.GSTNumber)) {
        this.validGSTNumber = false
      } else {
        this.validGSTNumber = true
      }
    } else {
      this.validGSTNumber = false
    }
  }
  validateMobile (mobile) {
    let regx = /\[0-9]/g
    return regx.test(mobile)
  }
  validMobileFlag: boolean = false
  mobileNo: any
  checkNumberByCountry (e) {
    this.mobileNo = e.target.value
    if (this.checkSelectCode) {
        if (this.validmobileLength === this.mobileNo.length) {
          this.validMobileFlag = false
        } else {
          this.validMobileFlag = true
        }
    }

  }
  checkSelectCode: boolean = false
  onSelectCountry (index, addArrayIndex) {
    this.codeLengthList = this.countryListWithCode[index]
    if (this.countryListWithCode.length > 0) {
      this.checkSelectCode = true
      this.CountryCode = this.codeLengthList.Phonecode

    }

  }
  mobileValueFlag: any = false

  mobileArray: any[]

  deleteArrayMobileType (i,type) {
    if(type ==='contact'){
      if(this.mobileArray.length > 0){
        this.mobileArray.splice(i,1)
       }
    }
    if(type ==='email'){
      if(this.emailArray.length > 0){
        this.emailArray.splice(i,1)
       }
    }

  }
  editFlg: boolean = true
  editRowItem (i,type,id) {
    if(type ==='contact'){
      if(this.editFlg){
        this.editFlg = false
        this.mobileNoId =id
        this.contactType = this.mobileArray[i].ContactType
        this.select_Mobile.setElementValue(this.mobileArray[i].ContactType)
        this.contactTypeName = this.mobileArray[i].ContactTypeName
        this.vendorForm.controls.mobileNo.setValue(this.mobileArray[i].ContactNo)
        this.CountryCode = this.mobileArray[i].CountryCode
        this.phoneCodeselect2.setElementValue(this.mobileArray[i].CodeId)
        this.CodeId = this.mobileArray[i].CodeId
        this.validMobileFlag = false
        this.deleteArrayMobileType (i,'contact')
      }
      
    
    else{
      this._toastrcustomservice.showWarning('', 'Save Editable Contact')

    }
  }
    if(type ==='email'){
      if(this.editEmailFlg){
        this.editEmailFlg = false
        this.EmailId = id
        this.EmailType = this.emailArray[i].EmailType
        this.select_email.setElementValue(this.emailArray[i].EmailType)
        this.EmailAddressTypeName = this.emailArray[i].EmailTypeName
        this.vendorForm.controls.EmailAddress.setValue(this.emailArray[i].EmailAddress)
        this.deleteArrayMobileType (i,'email')
      }
      else{
      this._toastrcustomservice.showWarning('', 'Save Editable Email')

      }
      

    }
  }

  emailArray: any[]

  validateEmail (email) {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
  }
  emailValueFlag: any = false
  emailError: any

  emailPlusAddingArray (value) {
    let boolCheck = false
    for (let i = 0; i < this.emailAdressArray.length; i++) {
      if ($('#sel1parmantent' + i).val() === '') {
        $('#sel1parmantent' + i).val('1')
      }
      let email = $('#email' + i).val()
      if ($('#email' + i).val() !== '' && this.validateEmail(email)) {
        document.getElementById('email' + i).className += ' successTextBoxBorder'
        document.getElementById('email' + i).classList.remove('errorTextBoxBorder')
        if ($('#sel1parmantent' + (i + 1)).val() > 0) {
          boolCheck = true
        } else {
          boolCheck = false
          break
        }

      } else {
        $('#email' + i).focus()
        document.getElementById('email' + i).className += ' errorTextBoxBorder'
        boolCheck = false
        break
      }
    }
    if (boolCheck) {
      this.emailAdressArray.push({
        Id: 0,
        EmailType: undefined,
        EmailAddress: undefined
      })
    }
    if (this.emailAdressArray.length === 0) {
      this.emailAdressArray.push({
        Id: 0,
        EmailType: undefined,
        EmailAddress: undefined
      })
    }
  }

  /* .....................select2 values.............. */
  selectVendorPlaceHolder: Select2Options
  vendorValue: any
  vendorId: any
  select2VendorValue (value) {
    this.selectVendor = []
    this.selectVendorPlaceHolder = { placeholder: 'Select Vendor' }
    this.selectVendor = [{ id: UIConstant.BLANK, text: 'SelectVendor' }, { id: '1', text: 'Regular' }
      , { id: '2', text: 'Composition' }, { id: '3', text: 'Exempted' }
      , { id: '4', text: 'UnRegistered' }, { id: '5', text: '	E-Commerce Operator ' }]
    this.vendorId = this.selectVendor[1].id
    return this.vendorValue = this.selectVendor[1].id
  }

  checkVendorRegiValidation () {

    // debugger
    if (this.vendorId > 0) {
      this.vendorRegiError = false
    } else {
      this.vendorRegiError = true
    }
  }
  countryError: boolean = false
  stateError: boolean = false
  cityError: boolean = false
  addressError: boolean = false
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

  selectedVendorId (event) {
    this.vendorId = event.value
    this.vendorRegiError = false
  }

  select2CrDrPlaceHolder: Select2Options
  valueCRDR: any
  crDrId: number
  select2CrDrValue (value) {
    this.selectCrDr = []
    this.select2CrDrPlaceHolder = { placeholder: 'Select CR/Dr' }
    this.selectCrDr = [{ id: UIConstant.BLANK, text: 'Select CR/DR' }, { id: '1', text: 'CR' }, { id: '0', text: 'DR' }]
    this.valueCRDR = value
    this.crDrId =   +this.selectCrDr[1].id
  }

  selectCRDRId (event) {
    this.crDrId = event.value
  }

  countryValue: any
  getCountry (value) {
    this.subscribe = this._vendorServices.getCommonValues('101').subscribe(Data => {
      this.countryListPlaceHolder = { placeholder: 'Select Country' }
      this.countryList = [{ id: UIConstant.BLANK, text: 'select Country' }]
      Data.Data.forEach(element => {
        this.countryList.push({
          id: element.Id,
          text: element.CommonDesc
        })
      })
      this.countryValue = value
      // });
    })
  }
  countrId: any
  selectCountryListId (event) {
    this.countrId = event.value
    this.countryError = false
    if (this.countrId > 0) {
      this.getStaeList(this.countrId, 0)

    }
    // this.addressDetailsValidation()
  }
  stateValue: any
  getStaeList (id, value) {
    this.subscribe = this._vendorServices.gatStateList(id).subscribe(Data => {
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

  stateId: any
  selectStatelist (event) {
    this.stateId = event.value
    this.stateError = false
    if (this.stateId > UIConstant.ZERO) {
      this.getCitylist(this.stateId, 0)
    }
    // this.addressDetailsValidation()
  }
  cityValue: any
  getCitylist (id, value) {
    this.subscribe = this._vendorServices.getCityList(id).subscribe(Data => {
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

  cityId: any
  selectedCityId (event) {
    this.cityId = event.value
    this.cityError = false
    if (this.cityId > 0) {
      this.getAreaId(this.cityId)
    }
    // this.addressDetailsValidation()
  }
  private getAreaId (id) {
    this.subscribe = this._vendorServices.getAreaList(id).subscribe(Data => {
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
  addArea () {
    this.areaForm = this._formBuilder.group({
      'areaName': ['', Validators.required]
    })
  }
  openAreaModel () {
    $('#add_area_Popup1').modal(UIConstant.MODEL_SHOW)
  }
  closeAreaModel () {
    $('#add_area_Popup1').modal(UIConstant.MODEL_HIDE)
  }
  areaID: any
  addAreaClick: boolean
  areNameId: any
  areaAdd () {
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
          this._toastrcustomservice.showSuccess('Success', 'Area Added !')
          this.areaForm.reset()
          this.closeAreaModel()
        }
        if (data.Code === 5000) {
          this._toastrcustomservice.showError('Error', data.Description)
          this.closeAreaModel()

        }
      })
    }
  }

  @ViewChild('area_selecto2') areaSelect2: Select2Component
  Areaname: any
  selectedArea (event) {

    // debugger
    if (event.data.length > 0) {
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

  addresTypeId: any
  addrssValueType: any
  adressType (value) {
    this.addressError = false
    this.addressTypePlaceHolder = { placeholder: 'Selecet Address Type' }
    this.addressType = [{ id: '1', text: 'Personal' }, { id: '2', text: 'Work' }, { id: '3', text: 'Postal' }, { id: '4', text: 'Other' }]
    this.addresTypeId = this.addressType[0].id
    this.addTypeName = this.addressType[0].text
  }
  addTypeName: any
  selectedAddressTypeId (event) {
    if (event && event.data.length > 0) {
      this.addTypeName = event.data[0].text
      this.addresTypeId = event.value
    } else {
      this.addresTypeId = event.value
      this.addTypeName = event.data[0].text

    }
    this.addressDetailsValidation()
    this.addressError = false
  }

  @ViewChild('country_selecto') countryselecto: Select2Component
  @ViewChild('bankName') bankName

  addressDiv: boolean
  adressTab () {
    setTimeout(() => {
      this.countryselecto.selector.nativeElement.focus()
    }, 1000)

  }
  vendorDiv: boolean
  vendorTab () {
    setTimeout(() => {
      this.ledgerName.nativeElement.focus()
    }, 1000)

  }
  bankDiv: boolean
  bankeDetailTab () {
    setTimeout(() => {
      this.bankName.nativeElement.focus()
    }, 1000)

  }

  // /* ,.......checkboxvalue...... */
  isRcm: boolean
  rcmApplicable (event) {
    if (event === true) {
      this.isRcm = true
    } else {
      this.isRcm = false
    }
  }
  isMsdm: boolean
  msmedActComplication (event) {
    if (event === true) {
      this.isMsdm = true
    } else {
      this.isMsdm = false
    }
  }

  getVendorDetail () {
    this.subscribe = this._vendorServices.getVendor(4, '&Strsearch=' + '' + '&Page=' + 1 + '&Size=' + 20 + '').subscribe(Data => {
      if (Data.Code === UIConstant.THOUSAND) {
        this._vendorServices.sendDataWithObservable(Data.Data)
      }
    })
  }


  requiredValid: boolean


  submitClick: boolean
  bankClick: boolean
  addVendor (value) {
    this.checkGSTNumberValid()
    this.checkPANNumberValid()
    this.addConatctDetails()
    this.emailAddingArray()
    this.submitClick = true
    if (value === 'reset') {
      this.formVendor()
    } else if (this.vendorForm.valid && !this.validMobileFlag && this.getEmailvalid && this.vendorId > UIConstant.ZERO) {
      if (!this.mobileRequirdForSetting) {
        if (!this.emailRequirdForSetting) {
          if (!this.validGSTNumber) {
            if (!this.validPANFlag) {
              if (!this.addressRequiredForLedger) {
                this.subscribe = this._vendorServices.addVendore(this.addLedgerParmas()).subscribe(Data => {
                  if (Data.Code === UIConstant.THOUSAND) {
                    this._commonGaterSeterServices.setClientName(0)
                    this._commonGaterSeterServices.setVendorName(Data.Data)
                    this._sanariioservices.filter()
                    if (value === 'save') {
                      this.getVendorDetail()
                      debugger
                      const dataToSend = { id: Data.Data, name: this.vendorForm.value.vendorName }
                      this._CommonService.closeVend({ ...dataToSend })
                      this._toastrcustomservice.showSuccess('Success', 'Save successfully')

                      $('#vendor_form').modal(UIConstant.MODEL_HIDE)
                      this.formVendor()
                    }
                  }
                  if (Data.Code === 1001) {
                    this._toastrcustomservice.showInfo('Info', Data.Description)

                  }
                })
              } else {
               // this.adressTab()
                this._toastrcustomservice.showError('Error', 'Enter Address Details ')
              }
            } else {
              this._toastrcustomservice.showError('Error', 'invalid PAN No. ')
            }
          } else {
            this._toastrcustomservice.showError('Error', 'invalid GST No. ')
          }
        } else {
          //   document.getElementById('email' + '0').className += ' errorTextBoxBorder'
          $('.emailfocu').focus()
          $('.mobilefocu').focus()
          this._toastrcustomservice.showError('', ' Enter Email Details ')

        }
      } else {
        //   document.getElementById('email' + '0').className += ' errorTextBoxBorder'
        $('.emailfocu').focus()
        $('.mobilefocu').focus()
        this._toastrcustomservice.showError('', ' Enter Contact Details ')

      }
    }

  }

  private getopeinAmountValue () {
    if (this.vendorForm.value.openingBlance > 0) {
      return this.vendorForm.value.openingBlance
    } else {
      return 0
    }
  }

  GSTNumber: any
  PANNumber: any
  private addLedgerParmas () {
    // debugger
    let doa
    let dob
    if (this.vendorForm.value.daoDate !== '' ) {
      doa = this._globalService.clientToSqlDateFormat(this.vendorForm.value.daoDate, this.clientDateFormat)

    } else {
      doa = ''
    }
    if (this.vendorForm.value.dobDate !== '' ) {
      dob = this._globalService.clientToSqlDateFormat(this.vendorForm.value.dobDate, this.clientDateFormat)

    } else {
      dob = ''
    }
    let ledgerElement = {
      ledgerObj: {
        Id: this.id,
        Websites: [],
        GlId: 4,
        OpeningAmount: this.getopeinAmountValue(),
        Name: this.vendorForm.value.vendorName,
        TaxTypeID: this.vendorId,
        CrDr: this.crDrId,
        IsRcm: this.isRcm,
        IsMsmed: this.isMsdm,
        Statutories: [{
          Id: this.statutoriesId,
          PanNo: this.PANNumber,
          GstinNo: this.GSTNumber,
          ParentTypeId: 5
        }],
        ContactPersons: [{
          Id: this.contactPersonId,
          ParentTypeId: 5,
          Name: this.vendorForm.value.contactPerson,
          DOB: dob,
          DOA: doa
        }],
        ContactInfos: this.mobileArray,
        Emails: this.emailArray,
        Addresses: this.collectionOfAddress,
        Banks: this.bankArray
      }
    }
    return ledgerElement.ledgerObj
  }
  collectionOfAddress: any
  addressClick: boolean
  country: string
  stateName: string
  cityName: string
  addNewAdress () {
    this.addressClick = true
    this.addressDetailsValidation()
    if (this.stateId > 0 && this.cityId > 0 && this.countrId > 0 && this.adressForm.value.adressvalue !== '' && this.adressForm.value.adressvalue !== null) {
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
            AreaName: this.Areaname,
            AreaId: this.areaID,
            AddressValue: this.adressForm.value.adressvalue,
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
          AddressValue: this.adressForm.value.adressvalue,
          CountryName: this.country,
          Statename: this.stateName,
          CityName: this.cityName
        })
    //    console.log(this.collectionOfAddress, 'add')
      }

      this.addressClick = false
    }
    this.adressForm.reset()
    this.getCountry(0)
    this.adressType(0)
  }
  // }

  addressIndex: any
  getEditAddress (address, index) {
    this.addressIndex = index
    this.adressForm.controls.postcode.setValue(address.PostCode)
    this.adressForm.controls.adressvalue.setValue(address.AddressValue)
    this.getCountry(address.CountryId)
    this.adressType(address.AddressType)

  }

  removeAdressIndexArray (i) {
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
  crossButton () {
    this.formVendor()
    this.getCountry(0)
    this.vendorForm.reset()
    this.emailAdressArray = []
    this.mobileArray = []
    this.adressArray = []
    this.collectionOfAddress = []
    this.emailPlusAddingArray(0)
    $('#vendor_form').modal(UIConstant.MODEL_HIDE)
  }
  bankIndex: any

  getEditBankData (bankData, index) {
    this.bankIndex = index
    this.editBankDataFlag = true
    this.bankForm.controls.bankName.setValue(bankData.Name)
    this.bankForm.controls.accountNo.setValue(bankData.AcNo)
    this.bankForm.controls.ifscCode.setValue(bankData.IfscCode)
    this.bankForm.controls.branch.setValue(bankData.Branch)
    this.bankForm.controls.micrNo.setValue(bankData.MicrNo)

  }

  addNewbankDetail () {
    this.bankClick = true
    if (this.bankForm.valid) {
      if (this.bankIndex !== undefined) {
        if (this.bankArray.length > 0) {

          let newarray = {
            Id: this.bankArray[this.bankIndex].Id !== 0 ? this.bankArray[this.bankIndex].Id : 0,
            Name: this.bankForm.value.bankName,
            AcNo: this.bankForm.value.accountNo,
            IfscCode: this.bankForm.value.ifscCode,
            ParentTypeId: 5,
            Branch: this.bankForm.value.branch,
            MicrNo: this.bankForm.value.micrNo
          }
          this.bankArray.splice(this.bankIndex, 1, newarray)
        }
        this.bankIndex = undefined
      } else {
        this.bankArray.push({
          Id: 0,
          Name: this.bankForm.value.bankName,
          AcNo: this.bankForm.value.accountNo,
          IfscCode: this.bankForm.value.ifscCode,
          ParentTypeId: 5,
          Branch: this.bankForm.value.branch,
          MicrNo: this.bankForm.value.micrNo
        })
      }
      this.bankClick = false
    }

    this.formBank()
  }
  removeIndexOfBank (index) {
    this.bankArray.splice(index, 1)
  }

  reapeatName (name: string) {
    this.vendorForm.controls.contactPerson.setValue(name)

  }

  setupCodeForAddresRequired: any
  emailMobileValidationRequired () {
    this.subscribe = this._CommonService.getModulesettingAPI('').subscribe(data => {
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        if (data.Data.SetupClients.length > 0) {
          data.Data.SetupClients.forEach(ele => {
            // for only mobile required
            if (ele.SetupId === 55 && ele.Val === '1') {
              this.emailError = false
              this.mobileRequirdForSetting = true
            }
            // for only mobile and email required
            if (ele.SetupId === 55 && ele.Val === '2') {
              this.emailRequirdForSetting = true
              this.mobileRequirdForSetting = true
              // this.mobileError = true;
              this.emailError = true
            }
            // for only email required
            if (ele.SetupId === 55 && ele.Val === '3') {
              this.emailError = true
              this.emailRequirdForSetting = true
            }
            // setting for address is required or not
            if (ele.SetupId === 54 && ele.Val === '1') {
              this.setupCodeForAddresRequired = 54
              this.addressRequiredForLedger = true
            }

          })

        }

      //  console.log(data, 'setting')
      }
    })

  }
  countryListWithCode: any
  invalidMobilelength: boolean = false
  CountryCode: any = 'select'
  codeLengthList: any
  validmobileLength: any
  enableContactFlag: boolean





  contactTypeData: any
  getContactType (){
    this.contactTypeData = [{id:'0',text:'Select'},
                          {id:'1',text:'Work'},
                          {id:'2',text:'Home'},
                          {id:'3',text:'Mobile'},
                          {id:'4',text:'Fax'},
                          {id:'5',text:'Skype'},
                          {id:'6',text:'YMessenger'},
                          {id:'7',text:'Sip'},
                          {id:'8',text:'Other'},

  ]
  }
    emailTypeData: any
    emailTypeDataType (){
    this.emailTypeData =[{id:'0',text:'Select'},
    {id:'1',text:'Persnal'},
    {id:'2',text:'Work'},
    {id:'3',text:'Home'},
    {id:'4',text:'Other'}

  ]
  }

  searchCountryCodeForMobile (name) {
    this.subscribe = this._CommonService.searchCountryByName(name).subscribe(Data => {
      if (Data.Code === UIConstant.THOUSAND && Data.Data.length > 0) {
        this.countryListWithCode = []
        let newdataList = [{ id: '0',text : 'select code',PhoneCode : '0' , Length: 0 }]
        Data.Data.forEach(element => {
          newdataList.push({
            id : element.Phonecode,
            text : '+' + element.Phonecode + '-' + element.Name,
            PhoneCode : element.Phonecode,
            Length : element.Length
          })
        })
        this.countryListWithCode = newdataList
        console.log(Data ,'code')
      } else {
        this._toastrcustomservice.showError('Error', Data.Description)

      }
    })
  }
  onCountryCodeSelectionChange = (event) => {
    debugger
    if (event.data.length > 0) {
      if(event.data[0].id !== 0){
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
  onChangeContactType =(event) => {
    if(event.data.length>0){
      this.contactType = event.data[0].id
      this.contactTypeName = event.data[0].text
    }

  }
  EmailType: any
  EmailAddress: any
  EmailAddressTypeName: any
  onChangeEmailType =(event) => {
    if(event.data.length>0){
      this.EmailType = event.data[0].id
      this.EmailAddressTypeName = event.data[0].text
    }

  }
  EmailId: any = 0

  editEmailFlg: boolean= true
  emailAddingArray () {
    this.editEmailFlg = true
    if(this.EmailType > 0 && this.getEmailvalid && this.vendorForm.value.EmailAddress !== ''){
      this.emailRequirdForSetting = false
    this.emailArray.push({
      Id: this.EmailId ===0 ? 0 : this.EmailId,
      EmailType:this.EmailType,
      EmailTypeName: this.EmailAddressTypeName,
      EmailAddress : this.vendorForm.value.EmailAddress,
      ParentTypeId: 5
    
     })
     this.clear('email')
    }
   
  }
  @ViewChild('select_mobiletype') select_Mobile : Select2Component
@ViewChild('select_emailtype') select_email : Select2Component
@ViewChild('phoneCode_select2') phoneCodeselect2: Select2Component

  clear(type){
    if(type === 'email'){
      this.vendorForm.controls.EmailAddress.setValue('')
      this.select_email.setElementValue(0)
      this.EmailType ='0'

    }
    if(type ==='contact'){
      this.vendorForm.controls.mobileNo.setValue('')
      this.phoneCodeselect2.setElementValue(0)
      this.select_Mobile.setElementValue(0)
      this.select_email.setElementValue(0)
      this.contactType ='0'
      this.CountryCode =0
      this.validMobileFlag =false
    }
  }
  CodeId: any
  mobileNoId: any
 addConctFlag: boolean = false
  addConatctDetails (){
    this.addConctFlag= true
    this.editFlg = true
    this.validateContact()
    if(this.contactType > 0  && this.CountryCode > 0 && !this.validMobileFlag && this.vendorForm.value.mobileNo !== ''){
     
       this.mobileRequirdForSetting = false
      this.mobileArray.push({
       Id: this.mobileNoId ===0 ? 0 :this.mobileNoId,
       ContactType:this.contactType,
       ContactTypeName: this.contactTypeName,
       ContactNo : this.vendorForm.value.mobileNo,
       CountryCode:this.CountryCode,
       CodeId:this.CountryCodeId,
       ParentTypeId: 5
     
      })
      this.clear('contact')
    }

   
   console.log(this.mobileArray,'this.adressArray')
   }

   invalidObj ={}
validateContact (){
  let isValid = 1
  if (this.contactType !=='0') {
    this.invalidObj['contactType'] = false
  } else {
    this.invalidObj['contactType'] = true
    isValid = 0
  }
 
  if (this.CountryCode >0) {
    this.invalidObj['CountryCode'] = false
  } else {
    this.invalidObj['CountryCode'] = true
    isValid = 0
  }


  return !!isValid 
}
getEmailvalid: any
checkvalidationEmail (event) {
this.getEmailvalid =     this.validateEmail(event.target.value)
return this.getEmailvalid
}


}
