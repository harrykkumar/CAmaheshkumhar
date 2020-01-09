import { Component, Output, EventEmitter, OnDestroy, ViewChild, ElementRef } from '@angular/core'
import { Subscription } from 'rxjs'
import { Select2OptionData, Select2Component } from 'ng2-select2'
import { AddCust, Ledger } from '../../../../model/sales-tracker.model'
import { SaniiroCommonService } from '../../../../commonServices/SaniiroCommonService'
import { CommonSetGraterServices } from '../../../../commonServices/setgatter.services'
import { UIConstant } from '../../../constants/ui-constant';
import { VendorServices } from '../../../../commonServices/TransactionMaster/vendoer-master.services'
import { ToastrCustomService } from '../../../../commonServices/toastr.service'
import { CommonService } from '../../../../commonServices/commanmaster/common.services'
import { GlobalService } from '../../../../commonServices/global.service'
import { Settings } from '../../../../shared/constants/settings.constant'
declare const $: any
import { SetUpIds } from 'src/app/shared/constants/setupIds.constant'
import { Subject } from 'rxjs';
import * as _ from 'lodash'
import { AddNewCityComponent } from '../../../../shared/components/add-new-city/add-new-city.component';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-vendor-add',
  templateUrl: './vendor-add.component.html',
  styleUrls: ['./vendor-add.component.css']
})
export class VendorAddComponent implements OnDestroy {
  @Output() onFilter = new EventEmitter()
  vendorForm2: any
  bankForm2: any
  adressForm2: any
  subscribe: Subscription
  confirmSUB: Subscription
  modalSub: Subscription
  editvenderSubscribe: Subscription
  VendorDetailShow: Ledger[]
  id: any
  satuariesId: any = 0
  contactPersonId: any = 0
  adressArray: any
  emailAdressArray: any
  ContactInfoId: number
  bankArray: any = []
  vendorRegiError: any
  areaForm2: any
  public selectyCoustmoreRegistration: any
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

  ledgerId: any
  parentTypeIdofStatutoriesId: any
  bankId: any = 0
  editBankDataFlag: boolean = false
  editMode: boolean = false
  clientDateFormat: any
  isAddNew: boolean = false
  editId: any
  noOfDecimal: any = 0
  private unSubscribe$ = new Subject<void>()
  @ViewChild('vendor_registerType') vendorRegisterTypeSelect2: Select2Component
  constructor(public _CommonService: CommonService, private _vendorServices: VendorServices,
    private _sanariioservices: SaniiroCommonService,
    public _commonGaterSeterServices: CommonSetGraterServices,
    private _toastrcustomservice: ToastrCustomService,
    public _globalService: GlobalService, public _settings: Settings) {
    this.searchCountryCodeForMobile(' ')
    this.noOfDecimal = this._settings.noOfDecimal
    this.modalSub = this._CommonService.getVendStatus().subscribe(
      (data: AddCust) => {
        if (data.open) {
          this.isAddNew = data.isAddNew
          if (data.editId === '') {
            this.editMode = false
            this.editId = 0
            this.id = 0
          } else {
            this.id = data.editId
            this.editId = data.editId
            this.editMode = true
          }
          this.openModal()
        } else {
          this.closeModal()
        }
      }
    )

  }

  ngOnDestroy() {
    if (this.editvenderSubscribe) {
      this.editvenderSubscribe.unsubscribe()
    }
    if (this.subscribe) {
      this.subscribe.unsubscribe()
    }
    if (this.modalSub) {
      this.modalSub.unsubscribe()
    }
    if (this.confirmSUB) {
      this.confirmSUB.unsubscribe()
    }
  }
  futureDateAn: any
  DateOfBirth: any = ''
  DateOfAnniry: any = ''
  futureDateB: any
  setDOBDate() {
    this.DateOfBirth = ''
    this.futureDateAn = this._globalService.getDefaultDate(this.clientDateFormat)
  }
  setDOADate() {
    this.DateOfAnniry = ''
    this.futureDateB = this._globalService.getDefaultDate(this.clientDateFormat)
  }

  openingblance: any
  gstin: any
  panNo: any
  registrationNo: any
  contactPerson: any
  customerName: any
  dobDate: any
  daoDate: any
  editFlg: boolean
  @ViewChild('customer_register_type') CustomerRegisterTypeSelect2: Select2Component


  onloadingCustomerForm() {
    this.contactPersonId = 0
    this.satuariesId = 0
    this.bankArray = []
    this.collectionOfAddress = []
    this.bankIndex = null
    this.disabledGSTfor_UnRegi = false
    this.addressIndex = null
    this.setDOBDate()
    this.setDOADate()
    this.contactPerson = ''
    this.customerName = ''
    this.gstin = ''
    this.openingblance = 0
    this.panNo = ''
    this.coustmoreRegistraionId = 0
    this.select2CrDrValue(0)
    this.crdrSelect2.setElementValue(1)
    this.CustomerRegisterTypeSelect2.setElementValue(0)
    this.enableContactFlag = true
    this.editEmailFlg = true
    this.editFlg = true
    this.addressClick = false
    this.customerRegistrationType()
    this.onLoadMobile()
    this.onLaodEmail()
    this.onloadingbank()
  }
  onLoadMobile() {
    
    this.mobileArray = []
    this.mobileNo = ''
    this.getContactType()
    this.select_Mobile.setElementValue(1)
    this.mobileNoId = 0

  }
  onLaodEmail() {
    this.emailArray = []
    this.EmailAddress = ''
    this.emailTypeDataType()
    this.select_email.setElementValue(1)
    this.EmailId = 0
  }
  openModal() {
    this.invalidObj = {}
    this.countryCodeFlag=0
    this.CountryCode=0
    this.validmobileLength = 0
    this.onloadingCustomerForm()
    this.onloadingAddress()
    this.getSetUpModules((JSON.parse(this._settings.moduleSettings).settings))
    this.getCountry(0)
    $('#vendor_form').modal(UIConstant.MODEL_SHOW)
    this.satuariesId = 0
    this.submitClick = true
    this.CustomerRegisterTypeSelect2.setElementValue(0)
    this.isMsdm = false
    this.isRcm = false
    $('#tradediscount').prop('checked', false)
    $('#cashdiscount').prop('checked', false)
    $('#volumediscount1').prop('checked', false)
    setTimeout(() => {
      this.ledgerName.nativeElement.focus()
    }, 500)
      this.getOrgnizationAddress()
    if (this.editMode) {
      this.getVendorEditData(this.id)
    }
    this.redMarkLabel()
  }

  redMarkLabel() {
    this.invalidObj['EmailAddress'] = false
    this.invalidObj['mobileNo'] = false
    this.invalidObj['address'] = false
    this.invalidObj['cityValue'] = false
    this.invalidObj['stateValue'] = false
    this.invalidObj['countryValue'] = false

    if (_.isEmpty(this.customerName) && this.customerName === '') {
      this.invalidObj['customerName'] = true
    } else {
      this.invalidObj['customerName'] = false
    }
    if (this.mobile_email_setting_required === 1) {
      //mobile
      if (!_.isEmpty(this.mobileNo) && this.mobileNo !== '' && this.checkValidMobile() && this.mobileArray.length === 0) {
        this.invalidObj['mobileNo'] = false
      } else if (this.mobileArray.length === 0) {
        this.invalidObj['mobileNo'] = true
      }

    }

    if (this.mobile_email_setting_required === 2) {
      // mobile and email
      if (!_.isEmpty(this.mobileNo) && this.mobileNo !== '' && this.checkValidMobile() && this.mobileArray.length === 0) {
        this.invalidObj['mobileNo'] = false
      } else if (this.mobileArray.length === 0) {
        this.invalidObj['mobileNo'] = true
      }
      if (!_.isEmpty(this.EmailAddress) && this.EmailAddress !== '' && this.checkvalidationEmail() && this.emailArray.length === 0) {
        this.invalidObj['EmailAddress'] = false
      } else if (this.emailArray.length === 0) {
        this.invalidObj['EmailAddress'] = true
      }
    }
    if (this.mobile_email_setting_required === 3) {
      //email
      if (!_.isEmpty(this.EmailAddress) && this.EmailAddress !== '' && this.checkvalidationEmail() && this.emailArray.length === 0) {
        this.invalidObj['EmailAddress'] = false
      } else if (this.emailArray.length === 0) {
        this.invalidObj['EmailAddress'] = true
      }
    }

    if (this.address_setting_required) {
      if (this.countryValue === null && this.collectionOfAddress.length===0) {
        this.invalidObj['countryValue'] = true
      }
      else {
        this.invalidObj['countryValue'] = false
      }

      if (this.stateValue === null && this.collectionOfAddress.length===0) {
        this.invalidObj['stateValue'] = true
      }
      else {
        this.invalidObj['stateValue'] = false
      }
      if ((this.cityValue === null) && this.collectionOfAddress.length===0) {
        this.invalidObj['cityValue'] = true
      }
      else {
        this.invalidObj['cityValue'] = false
      }
      if (_.isEmpty(this.adresss) && this.adresss === '' && this.collectionOfAddress.length===0) {
        this.invalidObj['address'] = true
      }
      else {
        this.invalidObj['address'] = false
      }

    }

    if ((this.coustmoreRegistraionId === '1' || this.coustmoreRegistraionId === '2') && (this.countryValue === 123 || this.countryValue === '123')) {
      this.invalidObj['gst_required'] = true
    }
    else {
      this.invalidObj['gst_required'] = false

    }

  }
  mobile_email_setting_required: any
  address_setting_required: any
  addressByDefaultForLedger:boolean= false
  getSetUpModules(settings) {
    settings.forEach(element => {
      if (element.id === SetUpIds.dateFormat) {
        this.clientDateFormat = element.val[0].Val
      }
      if (element.id === SetUpIds.edgerEmailorMobileRequiredorNot) {
        this.mobile_email_setting_required = element.val
      }
      if (element.id === SetUpIds.edgerAddressRequiredorNot) {
        this.address_setting_required = element.val
      }
      if (element.id === SetUpIds.addressByDefaultForLedger) {
        this.addressByDefaultForLedger = element.val
      }
      
    })

  }

  getModuleSettingValue: any
  @ViewChild('ledgerName') ledgerName
  closeModal() {
    $('#vendor_form').modal(UIConstant.MODEL_HIDE)
  }

  getVendorEditData(id) {
    setTimeout(() => {
      this.ledgerName.nativeElement.focus()
    }, 1000)
    this.submitClick = true
   // $('#vendor_form').modal(UIConstant.MODEL_SHOW)
    this.editvenderSubscribe = this._vendorServices.editvendor(id).subscribe(
      (Data) => {
        if (Data.Code === UIConstant.THOUSAND) {
          if (Data.Data && Data.Data.Addresses.length > 0) {
            this.collectionOfAddress = Data.Data.Addresses
            //   this.loadAddressDetails(Data.Data.Addresses[0])
          }
          if (Data.Data && Data.Data.Emails.length > 0) {
            this.emailArray = Data.Data.Emails
          }
          if (Data.Data.ContactInfo.length > 0) {
            //this.CountryCode = Data.Data.ContactInfo[0].CountryCode
           // this.countryCodeFlag = Data.Data.ContactInfo[0].CountryCode
            this.mobileArray = Data.Data.ContactInfo
          }
          if (Data.Data && Data.Data.Banks.length > 0) {
            this.bankArray = Data.Data.Banks
          }
          if (Data.Data && Data.Data.LedgerDetails.length > 0) {
            this.customerName = Data.Data.LedgerDetails[0].Name
            this.select2CrDrValue(Data.Data.LedgerDetails[0].Crdr)
            this.coustmoreRegistraionId = Data.Data.LedgerDetails[0].TaxTypeId.toString()
            this.CustomerRegisterTypeSelect2.setElementValue(Data.Data.LedgerDetails[0].TaxTypeId)
            this.disabledGSTfor_UnRegi = Data.Data.LedgerDetails[0].TaxTypeId === 4 ? true : false
            this.openingblance = Data.Data.LedgerDetails[0].OpeningBalance.toFixed(this.noOfDecimal)
          }
          if (Data.Data && Data.Data.Statutories.length > 0) {
            this.satuariesId = Data.Data.Statutories[0].Id
            this.parentTypeIdofStatutoriesId = Data.Data.Statutories[0].ParentTypeId
            this.gstin = Data.Data.Statutories[0].GstinNo
            this.panNo = Data.Data.Statutories[0].PanNo
          }
          if (Data.Data && Data.Data.ContactPersons.length > 0) {
            this.contactPersonId = Data.Data.ContactPersons[0].Id
            this.contactPerson = Data.Data.ContactPersons[0].Name
            if (Data.Data.ContactPersons[0].DOA !== null) {
              this.DateOfAnniry = this._globalService.utcToClientDateFormat(Data.Data.ContactPersons[0].DOA, this.clientDateFormat)
            }
            else {
              this.daoDate = ''
            }
            if (Data.Data.ContactPersons[0].DOA !== null) {
              this.DateOfBirth = this._globalService.utcToClientDateFormat(Data.Data.ContactPersons[0].DOB, this.clientDateFormat)
            }
            else {
              this.dobDate = ''
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
        }
        if (Data.Code === 5000) {
          this._toastrcustomservice.showError('', Data.Description)
        }

      })
    this.redMarkLabel()

  }


  bankName: any = ''
  accountNo: any
  accountHolderName: any
  ifscCode: any
  branch: any
  micrNo: any
  postcode: any
  adressvalue: any
  addressValue: any
  adresss: any
  onloadingbank() {
    this.bankName = ''
    this.ifscCode = ''
    this.branch = ''
    this.accountNo = ''
    this.accountHolderName = ''
    this.micrNo = ''
  }

  ngOnInit() {

  }

  returnsplitGSTcode() {
    if (!_.isEmpty(this.gstin) && this.gstin !== '') {
      let str = this.gstin
      let val = str.trim();
      this.GstinNoCode = val.substr(0, 2);
      if (this.GstinNoCode !== '') {
        return this.GstinNoCode
      }
    } else {
      return ''
    }
  }
  GSTStateCode: any = '00'
  multipleGSTmatch() {
    if (this.collectionOfAddress.length > 0) {
      let dvalue = this.collectionOfAddress.filter(
        d => (d.StateCode === this.GstinNoCode))
      if (dvalue.length > 0) { return true }
      else { return false }
    }
    else { return true }
  }


  matchStateCodeWithGSTNumber() {
    if ((!_.isEmpty(this.returnsplitGSTcode()))  && this.GstinNoCode !== '') {
      if(this.multipleCountry()){
        if(this.multipleGSTmatch()){
          return true
        }
        else{
          return false
        }
      }else{
        return true
      }
    } else {
      return true
    }

  }
  GstinNoCode: any


  validMobileFlag: boolean = false
  mobileNo: any
  checkNumberByCountry(e) {
    this.mobileNo = e.target.value
    if (this.validmobileLength === this.mobileNo.toString().length) {
      this.validMobileFlag = false
    } else {
      this.validMobileFlag = true
    }
  }

  checkSelectCode: boolean = false
  onSelectCountry(index) {
    this.codeLengthList = this.countryListWithCode[index]
    if (this.countryListWithCode.length > 0) {
      this.checkSelectCode = true
      this.CountryCode = this.codeLengthList.Phonecode
    }
  }
  mobileValueFlag: any = false
  mobileArray: any[]
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
        this.mobileNo = this.mobileArray[i].ContactNo
        this.CountryCode = this.mobileArray[i].CountryCode
        this.countryCodeFlag = this.mobileArray[i].CountryCode
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
        this.EmailAddress = this.emailArray[i].EmailAddress
        this.deleteArrayMobileType(i, 'email')
      }
      else {
        this._toastrcustomservice.showWarning('', 'Save Editable Email')
      }
    }
  }



  emailArray: any[]
  emailValueFlag: any = false
  emailError: any
  vendorValue: any
  coustmoreRegistraionId: any

  customerRegistrationType() {
    this.selectyCoustmoreRegistration = []
    this.selectyCoustmoreRegistration = [{ id: 0, text: 'Select Registration Type' }, { id: 1, text: 'Regular' }
      , { id: 2, text: 'Composition' }, { id: 3, text: 'Exempted' }
      , { id: 4, text: 'UnRegistered' }, { id: 5, text: '	E-Commerce Operator ' }]

  }
  countryError: boolean = false
  stateError: boolean = false
  cityError: boolean = false
  addressError: boolean = false
  @ViewChild('address_value') addressSelector: ElementRef


  disabledGSTfor_UnRegi: boolean = false
  selectCoustmoreId(event) {
    if (event.value > 0 && event.data.length > 0) {
      this.coustmoreRegistraionId = event.value
      if (event.value === '4') {
        this.disabledGSTfor_UnRegi = true
        this.gstin = ''
      }
      else {
        this.disabledGSTfor_UnRegi = false
      }
    }
    if (event.value === 0) {
      this.disabledGSTfor_UnRegi = false
      this.gstin = ''
    }
  }
  @ViewChild('crdrSelect2') crdrSelect2: Select2Component
  select2CrDrPlaceHolder: Select2Options
  valueCRDR: any
  crDrId: number
  select2CrDrValue(value) {
    this.selectCrDr = []
    this.select2CrDrPlaceHolder = { placeholder: 'Select CR/Dr' }
    this.selectCrDr = [{ id: '1', text: 'CR' }, { id: '0', text: 'DR' }]
    this.valueCRDR = value
    this.crDrId = value
  }

  selectCRDRId(event) {
    this.crDrId = event.value
  }

  countryValue: any = null
  getCountry(value) {
    this.subscribe = this._vendorServices.getCommonValues('101').subscribe(Data => {
      this.countryListPlaceHolder = { placeholder: 'Select Country' }
      this.countryList = [{ id: '0', text: 'Select Country' }]
      Data.Data.forEach(element => {
        this.countryList.push({
          id: element.Id,
          text: element.CommonDesc
        })
      })
    })
  }

  countrId: any
  CountryName: any = ''
  selectCountryListId(event) {
    this.countryValue = +event.id
    this.CountryName = event.text
    if (this.countryValue > 0) {
      this.getListCountryLabelList(event.id)
      this.getStaeList(this.countryValue, 0)

    }
    else if (event.id === 0) {
      this.countryValue = null
    }
  }



  stateValue: any = null
  getStaeList(id, value) {
    this.stateValue = null
    this.stateList = []
    this.subscribe = this._vendorServices.gatStateList(id).subscribe(Data => {
      let newlist = [{ id: '0', text: 'Select State', stateCode: 0 }]
      if (Data.Code === 1000) {
        Data.Data.forEach(element => {
          newlist.push({
            id: element.Id,
            text: element.CommonDesc1,
            stateCode: element.ShortName1
          })
        })
        this.stateList = newlist
      }
    })
  }


  selectStatelist(event) {
    console.log(event)
    this.stateValue = event.id
    if (this.stateValue > 0) {
      this.stateValue = event.id
      if(this.countryValue===123){
        this.GSTStateCode = event.stateCode
      }
      else{
        this.GSTStateCode='00'
      }
      this.stateName = event.text
      if (this.stateValue > 0) {
        this.getCitylist(this.stateValue, 0)
      }
    }
    if (event.id === 0) {
      this.stateValue = null
    }
  }
  cityValue: any = null

  getCitylist(id, value) {
    this.cityValue = null
    this.cityList = []
    this.subscribe = this._vendorServices.getCityList(id).subscribe(Data => {
      let newData = [{ id: '0', text: 'Select City' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
      Data.Data.forEach(element => {
        newData.push({
          id: element.Id,
          text: element.CommonDesc2
        })
      })
      this.cityList = newData
    })
  }

  getAreaId(id) {
    this.areNameId = null
    this.areaList = []
    this.subscribe = this._vendorServices.getAreaList(id).subscribe(Data => {
      this.areaList = [{ id: '0', text: 'Select Area' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
      Data.Data.forEach(element => {
        this.areaList.push({
          id: element.Id,
          text: element.CommonDesc3
        })
      })
    })
  }

  @ViewChild('areaNameRef') areanameRef: ElementRef

  openAreaModel() {
    setTimeout(() => {
      this.areanameRef.nativeElement.focus()
    }, 500)
    $('#add_area_Popup1').modal(UIConstant.MODEL_SHOW)
  }
  closeAreaModel() {
    $('#add_area_Popup1').modal(UIConstant.MODEL_HIDE)
  }
  addAreaClick: boolean
  areNameId: any = null
  areaName: any = ''

  areaAdd() {
    this.addAreaClick = true
    const addValue = {
      Id: 0,
      CommonDesc3: this.areaName,
      ShortName3: this.areaName,
      CommonCode: 104,
      CommonId2: this.cityValue
    }
    if (this.areaName !== '' && this.cityValue > 0) {
      this.subscribe = this._CommonService.addAreaNameUnderCity(addValue).subscribe(data => {
        if (data.Code === UIConstant.THOUSAND && data.Data.length > 0) {
          let newData = Object.assign([], this.areaList)
          newData.push({ id: data.Data, text: this.areaName })
          this.areaList = newData
          this.areNameId = data.Data
          this._toastrcustomservice.showSuccess('', 'Area Added !')
          this.areaName = ''
          this.closeAreaModel()
          setTimeout(() => {
            //   this.areaSelect2.selector.nativeElement.focus()
          }, 500)
        }
        if (data.Code === UIConstant.SERVERERROR) {
          this._toastrcustomservice.showError('', data.Description)
          this.closeAreaModel()
        }
      })
    }
  }

  @ViewChild('area_selecto2') areaSelect2: Select2Component
  Areaname: any
  selectedArea(event) {
    this.areNameId = +event.id
    if (+event.id === -1) {
      this.Areaname = ''
   //   this.areaSelect2.setElementValue(0)
      this.openAreaModel()
    } else if (+event.id > 0) {
      this.areNameId = +event.id
      this.Areaname = event.text
    } else if(event.id===0) {
      this.Areaname = ''
      this.areNameId =0
    }
  }

  addresTypeId: any
  addrssValueType: any
  adressType(value) {
    this.addressType = [{ id: '1', text: 'Personal' }, { id: '2', text: 'Work' }, { id: '3', text: 'Postal' }, { id: '4', text: 'Other' }]
    this.addresTypeId = this.addressType[0].id
    this.addTypeName = this.addressType[0].text
  }
  addTypeName: any
  selectedAddressTypeId(event) {
    if (event.value > 0 && event.data.length > 0) {
      this.addTypeName = event.data[0].text
      this.addresTypeId = event.value
    }

  }


  @ViewChild('address_value') addressRef: ElementRef
  @ViewChild('conatctPerRef') conatctPerRef: ElementRef
  @ViewChild('bankNameref') bankNameref: ElementRef

  @ViewChild('country_selecto') countryselecto: NgSelectComponent
  @ViewChild('state_select2') stateselecto: NgSelectComponent
  @ViewChild('city_select2') cityselecto: NgSelectComponent

  isRcm: boolean
  rcmApplicable(event) {
    if (event === true) {
      this.isRcm = true
    } else {
      this.isRcm = false
    }
  }
  isMsdm: boolean
  msmedActComplication(event) {
    if (event === true) {
      this.isMsdm = true
    } else {
      this.isMsdm = false
    }
  }
  requiredValid: boolean
  submitClick: boolean
  bankClick: boolean
  saveCustomer(value) {
    this.submitClick = true
    if (value === 'reset') {
      this.onloadingCustomerForm()
      this.onloadingAddress()
    }
    this.addConatctDetails()
    this.addEmailDetail()
    this.addNewbankDetail()
    this.addNewAdress()
    if (this.dynamicFocusValidation() ) {
      if (this.matchStateCodeWithGSTNumber()) {
        if(this.checkvalidationEmail()){
          if(this.checkValidMobile()){
            if(this.chekGSTvalidation()){
              if(this.checkPANNumberValid()){
                this.subscribe = this._vendorServices.addVendore(this.addLedgerParmas()).subscribe(Data => {
                  if (Data.Code === UIConstant.THOUSAND) {
                    if (value === 'save') {
                      const dataToSend = { id: Data.Data, name: this.customerName, gstType: this.coustmoreRegistraionId }
                      this._CommonService.closeVend({ ...dataToSend })
                      this._CommonService.AddedItem()
                      let saveFlag = this.editId === 0 ? UIConstant.SAVED_SUCCESSFULLY : UIConstant.UPDATE_SUCCESSFULLY
                      this._toastrcustomservice.showSuccess('', saveFlag)
                      $('#vendor_form').modal(UIConstant.MODEL_HIDE)
                    }
                    if (value === 'new') {
                      setTimeout(() => {
                        this.ledgerName.nativeElement.focus()
                      }, 200)
                      this.onloadingCustomerForm()
                      this.id = 0
                     // this.countryValue = null
                      this._CommonService.AddedItem()
                      this._toastrcustomservice.showSuccess('', UIConstant.SAVED_SUCCESSFULLY)
                    }
        
                  }
                  if (Data.Code === UIConstant.THOUSANDONE) {
                    this._toastrcustomservice.showInfo('', Data.Description)
                  }
                  if (Data.Code === 5004) {
                    this._toastrcustomservice.showInfo('', Data.Description)
                  }
        
                  if (Data.Code === 5001) {
                    this._toastrcustomservice.showError('', Data.Description)
                  }
                  if (Data.Code === UIConstant.REQUIRED_5020) {
                    this._toastrcustomservice.showError('', Data.Data)
                  }
                })
              }
              else{
                this.panRef.nativeElement.focus()
              }
            }
            else{
              this.gstRef.nativeElement.focus()
            }
          }
          else{
            this.mobileRef.nativeElement.focus()
          }
        }
        else{
          this.emailRef.nativeElement.focus()
        }
      }
      else {
        this.gstRef.nativeElement.focus()
        this._toastrcustomservice.showError('', 'Invalid GSTIN Number According to Selected State ')
      }
    }

  }


  onPasteGST(e) {
    this._CommonService.allowOnlyNumericValueToPaste(e, (res) => {
      this.gstin = res
    })
  };
  onPastePAN(e) {
    this._CommonService.allowOnlyNumericValueToPaste(e, (res) => {
      this.panNo = res
    })
  };
  splitGSTNumber() {
    let parts = this.gstin.trim()
    this.GSTStateCode = parts.substring(0, 2);
    this._CommonService.getStateByGStCode(this.GSTStateCode).subscribe(d => {
      if (d.Code === 1000 && d.Data.length > 0) {
        this.stateValue = d.Data[0].Id
        if(this.countryValue===123){
          this.GSTStateCode = d.Data[0].ShortName1
        }
        else{
          this.GSTStateCode='00'
        }
        let state = {
          id: d.Data[0].Id,
          text: d.Data[0].CommonDesc1,
          stateCode: this.GSTStateCode
        }
        this.selectStatelist(state)
      }
    })
  }

  multipleCountry() {
    if (this.collectionOfAddress.length > 0) {
      let dvalue = this.collectionOfAddress.filter(
        d => (d.CountryId===123))
      if (dvalue.length > 0) { return true }
      else { return false }
    }
    else { return true }
  }

  chekGSTvalidation() {
    if (!_.isEmpty(this.gstin) && this.gstin !== '') {
      this.GSTNumber = (this.gstin).toUpperCase()
      if(this.multipleCountry()){
        if (this._CommonService.regxGST.test(this.GSTNumber)) {
          return true
        } else {
          return false
        }
      }
      else{
        return true
      }  
    }
    else if ((this.coustmoreRegistraionId === '1' || this.coustmoreRegistraionId === '2') && this.multipleCountry()) {
      return false
    }
    else {
      return true

    }
  }
  checkPANNumberValid() {
    if (!_.isEmpty(this.panNo) && this.panNo !== '') {
      this.PANNumber = (this.panNo).toUpperCase()
      if(this.multipleCountry()){
        if (this._CommonService.panNumberRegxValidation(this.PANNumber)) {
          return true
        } else {
          return false
        }
      }
      else{
        return true
      }
    }
    else {
      return true
    }
  }


  dynamicFocusValidation = () => {
    let valid = true
    if (!_.isEmpty(this.customerName) && this.customerName !== '') {
      this.invalidObj['customerName'] = false
    } else {
      this.invalidObj['customerName'] = true
      valid = false
      this.ledgerName.nativeElement.focus();
    }
    if (this.mobile_email_setting_required === 1) {
      // mobile  validation

      if (!_.isEmpty(this.mobileNo) && this.mobileNo !== '' && this.checkValidMobile() && this.mobileArray.length === 0) {
        this.invalidObj['mobileNo'] = false
      } else if (!this.invalidObj.customerName && this.mobileArray.length === 0) {
        this.invalidObj['mobileNo'] = true
        valid = false
        this.mobileRef.nativeElement.focus();
      }
    }
    if (this.mobile_email_setting_required === 3) {
      //eamil validation
      if (!_.isEmpty(this.EmailAddress) && this.EmailAddress !== '' && this.checkvalidationEmail() && this.emailArray.length === 0) {
        this.invalidObj['EmailAddress'] = false
      } else if (!this.invalidObj.customerName && this.emailArray.length === 0) {

        this.invalidObj['EmailAddress'] = true
        valid = false
        this.emailRef.nativeElement.focus();
      }
    }
    if (this.mobile_email_setting_required === 2) {
      // both email and mobile no
      if (!_.isEmpty(this.mobileNo) && this.mobileNo !== '' && this.checkValidMobile() && this.mobileArray.length === 0) {
        this.invalidObj['mobileNo'] = false
      } else if (!this.invalidObj.customerName && this.mobileArray.length === 0) {
        this.invalidObj['mobileNo'] = true
        valid = false
        this.mobileRef.nativeElement.focus();
      }
      if (!_.isEmpty(this.EmailAddress) && this.EmailAddress !== '' && this.checkvalidationEmail() && this.emailArray.length === 0) {
        this.invalidObj['EmailAddress'] = false
      } else if (!this.invalidObj.customerName && !this.invalidObj.mobileNo && this.emailArray.length === 0) {

        this.invalidObj['EmailAddress'] = true
        valid = false
        this.emailRef.nativeElement.focus();
      }


    }
    if (this.address_setting_required) {
      if (this.countryValue > 0 && this.countryValue !== null && this.collectionOfAddress.length === 0) {
        this.invalidObj['countryValue'] = false
      }
      else if (!this.invalidObj.customerName && this.collectionOfAddress.length === 0 && !this.invalidObj.EmailAddress && !this.invalidObj.mobileNo) {
        this.invalidObj['countryValue'] = true
        this.countryselecto.focus()
        valid = false
      }
      if (this.stateValue > 0 && this.stateValue !== null && this.collectionOfAddress.length === 0) {
        this.invalidObj['stateValue'] = false
      }
      else if (!this.invalidObj.customerName && !this.invalidObj.EmailAddress && !this.invalidObj.mobileNo && !this.invalidObj.countryValue && this.collectionOfAddress.length === 0) {
        this.invalidObj['stateValue'] = true
        this.stateselecto.focus()
        valid = false
      }
      if (this.cityValue > 0 && this.cityValue !== null && this.collectionOfAddress.length === 0) {
        this.invalidObj['cityValue'] = false
      }
      else if (!this.invalidObj.customerName && !this.invalidObj.EmailAddress && !this.invalidObj.mobileNo && !this.invalidObj.countryValue && !this.invalidObj.stateValue && this.collectionOfAddress.length === 0) {
        this.invalidObj['cityValue'] = true
        this.cityselecto.focus()
        valid = false
      }
      if (!_.isEmpty(this.adresss) && this.adresss !== '' && this.collectionOfAddress.length === 0) {
        this.invalidObj['address'] = false
      }
      else if (!this.invalidObj.customerName && !this.invalidObj.EmailAddress && !this.invalidObj.mobileNo && !this.invalidObj.countryValue && !this.invalidObj.stateValue && !this.invalidObj.cityValue && this.collectionOfAddress.length === 0) {
        if (this.mobile_email_setting_required === 1 || this.mobile_email_setting_required === 2) {
          if (this.mobileArray.length > 0) {
            this.invalidObj['address'] = true
            this.addressRef.nativeElement.focus()
            valid = false
          }
        }
        else if (this.mobile_email_setting_required === 3) {
          if (this.emailArray.length > 0) {
            this.invalidObj['address'] = true
            this.addressRef.nativeElement.focus()
            valid = false
          }
        }
        else if (this.mobile_email_setting_required === 0) {
          this.invalidObj['address'] = true
          this.addressRef.nativeElement.focus()
          valid = false

        }

      }
     // if ((this.countryValue === 123 || this.countryValue === '123')) {
     //   this.invalidObj['gst_required'] = true
        if (!this.chekGSTvalidation() && !this.invalidObj.EmailAddress && !this.invalidObj.mobileNo && !this.invalidObj.customerName && !this.invalidObj.countryValue && !this.invalidObj.stateValue && !this.invalidObj.cityValue ) {
          this.invalidObj['gst_required'] = true
          this.gstRef.nativeElement.focus()
          valid = false
        } else {
          this.invalidObj['gst_required'] = false
        }
      // }
      // else {
      //   this.invalidObj['gst_required'] = false

      // }
      //if ((this.countryValue === 123 || this.countryValue === '123') ) {
      //  this.invalidObj['gst_required'] = true
        if (!this.chekGSTvalidation() && !this.invalidObj.EmailAddress && !this.invalidObj.mobileNo && !this.invalidObj.customerName && !this.invalidObj.countryValue && !this.invalidObj.stateValue && !this.invalidObj.cityValue ) {
          this.invalidObj['gst_required'] = true
          this.gstRef.nativeElement.focus()
          valid = false
        } else {
          this.invalidObj['gst_required'] = false
        }
      // }
      // else {
      //   this.invalidObj['gst_required'] = false

      // }
   //   if (this.countryValue === 123 || this.countryValue === '123' ) {
        if (!this.checkPANNumberValid() && !this.invalidObj.customerName && !this.invalidObj.countryValue && !this.invalidObj.stateValue && !this.invalidObj.cityValue ) {

          this.panRef.nativeElement.focus()
          valid = false
        } else {
          this.invalidObj['panRef'] = false
        }
     // }
    }

    return valid
  }

  @ViewChild('gstRef') gstRef: ElementRef
  @ViewChild('mobileRef') mobileRef: ElementRef
  @ViewChild('emailRef') emailRef: ElementRef
  @ViewChild('panRef') panRef: ElementRef
  private getopeinAmountValue() {
    if (this.openingblance > 0) {
      return this.openingblance
    } else {
      return 0
    }
  }

  GSTNumber: any
  PANNumber: any
  private addLedgerParmas() {
    let doa
    let dob
    if (this.DateOfAnniry !== '') {
      doa = this._globalService.clientToSqlDateFormat(this.DateOfAnniry, this.clientDateFormat)
    } else {
      doa = ''
    }
    if (this.DateOfBirth !== '') {
      dob = this._globalService.clientToSqlDateFormat(this.DateOfBirth, this.clientDateFormat)
    } else {
      dob = ''
    }
    let ledgerElement = {
      ledgerObj: {
        Id: this.id !== 0 ? this.id : 0,
        Websites: [],
        GlId: 4,
        OpeningAmount: this.getopeinAmountValue(),
        Name: this.customerName,
        TaxTypeID: this.coustmoreRegistraionId,
        CrDr: this.crDrId,
        IsRcm: this.isRcm,
        IsMsmed: this.isMsdm,
        Statutories: [{
          Id: this.satuariesId !== 0 ? this.satuariesId : 0,
          PanNo: this.panNo,
          GstinNo: this.gstin,
          ParentTypeId: 5
        }],
        ContactPersons: [{
          Id: this.contactPersonId !== 0 ? this.contactPersonId : 0,
          ParentTypeId: 5,
          Name: this.contactPerson,
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


  addNewAdress() {
    // if (this.dynamicFocusAddress()) {
    if (this.countryValue !== 0 && this.countryValue !== null && this.stateValue !== 0 && this.stateValue !== null && this.cityValue !== 0 && this.cityValue !== null && (!_.isEmpty(this.adresss)) && this.adresss !== '') {
      if (this.addressIndex !== null) {
        if (this.collectionOfAddress.length > 0) {
          let newArray = {
            Id: this.collectionOfAddress[this.addressIndex].Id !== 0 ? this.collectionOfAddress[this.addressIndex].Id : 0,
            ParentTypeId: 5,
            CountryId: this.countryValue,
            StateId: this.stateValue,
            CityId: this.cityValue,
            StateCode: this.GSTStateCode,
            AddressType: this.addresTypeId,
            AddressTypeName: this.addTypeName,
            PostCode: this.postcode,
            AreaId: this.areNameId===null ? 0 : this.areNameId,
            AreaName: this.areNameId===null ? '' : this.areaName,
            AddressValue: this.adresss,
            CountryName: this.CountryName,
            Statename: this.stateName,
            CityName: this.cityName
          }
          this.collectionOfAddress.splice(this.addressIndex, 1, newArray)
        }
        this.addressIndex = null
      } else {
        this.collectionOfAddress.push({
          Id: 0,
          ParentTypeId: 5,
          CountryId: this.countryValue,
          StateId: this.stateValue,
          CityId: this.cityValue,
          AddressType: this.addresTypeId,
          AddressTypeName: this.addTypeName,
          StateCode: this.GSTStateCode,
          PostCode: this.postcode,
          AreaId: this.areNameId===null ? 0 : this.areNameId,
          AreaName: this.areNameId===null ? '' : this.areaName,
          AddressValue: this.adresss,
          CountryName: this.CountryName,
          Statename: this.stateName,
          CityName: this.cityName
        })
      }
      this.addressClick = false
      this.adresss = ''
    }
  }
  addressid: any = 0
  onloadingAddress() {
    this.adressType(0)
    this.addressid = 0
    this.stateValue = null
    this.cityValue = null
    this.areNameId = null
    this.addresTypeId = 0
    this.addTypeName = ''
    this.postcode = ''
    this.Areaname = ''
    this.country = ''
    this.stateName = ''
    this.cityName = ''
    this.adresss = ''
    this.addressValue = 1
  }
 
  addressIndex: any
  getAddressIdForEdit(Address) {
    this.countryValue = Address.CountryId
    this.stateValue = Address.StateId
    this.cityValue = Address.cityId
    this.areNameId = Address.AreaId
    if(this.countryValue===123){
      this.GSTStateCode = Address.StateCode
    }
    else{
      this.GSTStateCode='00'
    }
    this.CountryName = Address.CountryName
    this.stateName = Address.Statename
    this.cityName = Address.CityName
    this.adresss = Address.AddressValue
    this.Areaname = Address.AreaName
    this.postcode = Address.PostCode
    this.addTypeName = Address.AddressTypeName
    let country = {
      id: Address.CountryId,
      text: Address.CountryName
    }
    this.selectCountryListId(country)

    this.getListCountryLabelList(Address.CountryId)
    let state = {
      id: Address.StateId,
      text: Address.Statename,
      stateCode: Address.StateCode
    }
    let city = {
      id: Address.CityId,
      text: Address.CityName
    }
    setTimeout(() => {
      this.selectStatelist(state)
    }, 100);
    setTimeout(() => {
      this.selectedCityId(city)
    }, 200);
    let area = {
      id: Address.AreaId,
      text: Address.AreaName
    }
    setTimeout(() => {
      this.selectedArea(area)
    }, 200);
  }

  getEditAddress(address, index) {
    this.addressIndex = index
    this.getAddressIdForEdit(address)
    this.adressType(address.AddressType)
  }
  countryCodeFlag: any = 0
 
  loadAddressDetails(Address) {
    this.validmobileLength = Address.Length
    this.countryValue = Address.CountryId
    this.stateValue = Address.StateId
    this.cityValue = Address.CityId
    this.countryCodeFlag = Address.CountryCode
    this.CountryCode = Address.CountryCode
    if(this.countryValue===123){
      this.GSTStateCode = Address.ShortNameState
    }
    else{
      this.GSTStateCode='00'
    }
    this.CountryName = Address.CountryName
    let country = {
      id: Address.CountryId,
      text: Address.CountryName
    }
    this.selectCountryListId(country)
    this.getListCountryLabelList(Address.CountryId)
    let state = {
      id: Address.StateId,
      text: Address.Statename,
      stateCode: this.GSTStateCode
    }
    let city = {
      id: Address.CityId,
      text: Address.CityName
    }
    setTimeout(() => {
      this.selectStatelist(state)
    }, 100);
    setTimeout(() => {
      this.selectedCityId(city)
    }, 200);
    let area = {
      id: Address.AreaId,
      text: Address.AreaName
    }
    setTimeout(() => {
      this.selectedArea(area)
    }, 200);
  }

  removeAdressIndexArray(i) {
    this.collectionOfAddress.splice(i, 1)
  }

  bankIndex: any = null

  getEditBankData(bankData, index) {
    this.bankIndex = index
    this.editBankDataFlag = true
    this.bankName = bankData.Name
    this.accountNo = bankData.AcNo
    this.ifscCode = bankData.IfscCode
    this.branch = bankData.Branch
    this.micrNo = bankData.MicrNo
    this.accountHolderName = bankData.accountHolderName
    this.bankNameref.nativeElement.focus()

  }

  @ViewChild('account_holder_name') account_holder_name: ElementRef
  @ViewChild('account_number') account_number: ElementRef
  @ViewChild('branch_name') branch_name: ElementRef

  redmarkBank() {
    this.invalidObj['bankName'] = false
    this.invalidObj['accountHolderName'] = false
    this.invalidObj['accountNo'] = false
    this.invalidObj['branch'] = false

    if (_.isEmpty(this.bankName) && this.bankName === '') {
      this.invalidObj['bankName'] = true
    } else {
      this.invalidObj['bankName'] = false
    }
    if (_.isEmpty(this.accountHolderName) && this.accountHolderName === '') {
      this.invalidObj['accountHolderName'] = true
    } else {
      this.invalidObj['accountHolderName'] = false
    }
    if (_.isEmpty(this.accountNo) && this.accountNo === '') {
      this.invalidObj['accountNo'] = true
    } else {
      this.invalidObj['accountNo'] = false
    }
    if (_.isEmpty(this.branch) && this.branch === '') {
      this.invalidObj['branch'] = true
    } else {
      this.invalidObj['branch'] = false
    }
  }
  DynamicFocusBank() {
    let isValid = true
    if (_.isEmpty(this.bankName) && this.bankName === ''  ) {
      this.invalidObj['bankName'] = true
      this.bankNameref.nativeElement.focus()
      isValid = false
    } else {
      this.invalidObj['bankName'] = false
    }
    if (_.isEmpty(this.accountHolderName) && this.accountHolderName === '' && !this.invalidObj.bankName) {
      this.invalidObj['accountHolderName'] = true
      this.account_holder_name.nativeElement.focus()
      isValid = false
    } else {
      this.invalidObj['accountHolderName'] = false
    }
    if (_.isEmpty(this.accountNo) && this.accountNo === '' && !this.invalidObj.bankName && !this.invalidObj.accountHolderName) {
      this.invalidObj['accountNo'] = true
      this.account_number.nativeElement.focus()
      isValid = false
    } else {
      this.invalidObj['accountNo'] = false
    }
    if (_.isEmpty(this.branch) && this.branch === '' && !this.invalidObj.bankName && !this.invalidObj.accountHolderName && !this.invalidObj.accountNo) {
      this.invalidObj['branch'] = true
      this.branch_name.nativeElement.focus()
      isValid = false
    } else {
      this.invalidObj['branch'] = false
    }

    return isValid
  }



  addNewbankDetail() {
    if (this.DynamicFocusBank()) {
      if (this.bankIndex !== null) {
        if (this.bankArray.length > 0) {
          let newarray = {
            Id: this.bankArray[this.bankIndex].Id !== 0 ? this.bankArray[this.bankIndex].Id : 0,
            Name: this.bankName,
            AcNo: this.accountNo,
            accountHolderName: this.accountHolderName,
            IfscCode: this.ifscCode,
            ParentTypeId: 5,
            Branch: this.branch,
            MicrNo: this.micrNo
          }
          this.bankArray.splice(this.bankIndex, 1, newarray)
        }
        this.bankIndex = null
      } else {
        this.bankArray.push({
          Id: 0,
          Name: this.bankName,
          AcNo: this.accountNo,
          accountHolderName: this.accountHolderName,
          IfscCode: this.ifscCode,
          ParentTypeId: 5,
          Branch: this.branch,
          MicrNo: this.micrNo
        })
      }
      this.bankClick = false
      this.onloadingbank()
    }
  }

  removeIndexOfBank(index) {
    this.bankArray.splice(index, 1)
  }


  reapeatName(name: string) {
    this.contactPerson = (name)
    this.accountHolderName = (name)

  }

  countryListWithCode: any
  invalidMobilelength: boolean = false
  CountryCode: any = 'select'
  codeLengthList: any
  validmobileLength: any
  enableContactFlag: boolean
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
      { id: '8', text: 'Other' },
    ]
  }
  emailTypeData: any
  emailTypeDataType() {
    this.emailTypeData = [
      { id: '1', text: 'Personal' },
      { id: '2', text: 'Work' },
      { id: '3', text: 'Home' },
      { id: '4', text: 'Other' }
    ]
  }

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

  onCountryCodeSelectionChange = (event) => {
    console.log(event)
    if (this.countryCodeFlag !== null) {
      if (event.id > 0) {
        if (event.id !== '0') {
          this.CountryCode = event.PhoneCode
          this.validmobileLength = event.Length
          //this.countryValue =
        }
      }
    }
    if (event.id === '0') {
      this.CountryCode = 0
      this.validmobileLength = 0
    }
  }

  contactType: any
  contactTypeName: any
  CountryCodeId: any

  EmailType: any
  EmailAddress: any
  EmailAddressTypeName: any


  editEmailFlg: boolean = true
  addEmailDetail() {
    this.editEmailFlg = true
    if (this.EmailType > 0 && (!_.isEmpty(this.EmailAddress)) && this.checkvalidationEmail()) {
      this.emailArray.push({
        Id: this.EmailId === 0 ? 0 : this.EmailId,
        EmailType: this.EmailType,
        EmailTypeName: this.EmailAddressTypeName,
        EmailAddress: this.EmailAddress,
        ParentTypeId: 5
      })
      this.clear('email')
    }
  }
  @ViewChild('phoneCode_select2') phoneCodeselect2: Select2Component

  clear(type) {
    if (type === 'email') {
      this.EmailAddress = ''
      this.select_email.setElementValue(1)
      this.EmailType = '1'
    }
    if (type === 'contact') {
      this.mobileNo = ''
      //this.phoneCodeselect2.setElementValue(0)
      this.select_Mobile.setElementValue(1)
      this.contactType = '1'
      this.CountryCode = this.countryCodeFlag
      this.validMobileFlag = false
    }
  }

  addConctFlag: boolean = false
  addConatctDetails() {
    this.addConctFlag = true
    this.editFlg = true
    if (this.contactType > 0 && (!_.isEmpty(this.mobileNo)) && this.checkValidMobile()) {
      this.mobileArray.push({
        Id: this.mobileNoId === 0 ? 0 : this.mobileNoId,
        ContactType: this.contactType,
        ContactTypeName: this.contactTypeName,
        ContactNo: this.mobileNo,
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
    if (!_.isEmpty(this.EmailAddress) && this.EmailAddress !== '') {
      if (this._CommonService.regxEMAIL.test(this.EmailAddress)) {
        return true
      } else {
        return false
      }
    } else {
      return true
    }
  }
  customerMobileNo: any = ''
  checkValidMobile() {
    if (!_.isEmpty(this.mobileNo) && this.mobileNo !== '') {
      if (this.validmobileLength === this.mobileNo.toString().length) {
        return true
      } else {
        return false
      }
    } else {
      return true
    }
  }

  onChangeContactType = (event) => {
    if (event.data.length > 0) {
      this.contactType = event.data[0].id
      this.contactTypeName = event.data[0].text
    }
  }

  onChangeEmailType = (event) => {
    if (event.data.length > 0) {
      this.EmailType = event.data[0].id
      this.EmailAddressTypeName = event.data[0].text
    }
  }
  EmailId: any = 0


  @ViewChild('select_mobiletype') select_Mobile: Select2Component
  @ViewChild('select_emailtype') select_email: Select2Component

  mobileNoId: any

  pressEnterEmailadd(e: KeyboardEvent) {
    this.addEmailDetail()
  }
  getListCountryLabelList(id) {
    this._CommonService.COUNTRY_LABEL_CHANGE(id).subscribe(resp => {
      if (resp.Code === 1000 && resp.Data.length > 0) {
        this.TinNoValue = resp.Data[0].TinNo
        this.PanNoValue = resp.Data[0].PanNo
        this.GstinNoValue = resp.Data[0].GstinNo
        this.CinNoValue = resp.Data[0].CinNo
        this.FssiNoValue = resp.Data[0].FssiNo
      }
    })
  }
  TinNoValue: any
  PanNoValue: any
  GstinNoValue: any
  CinNoValue: any
  FssiNoValue: any
  pressEnterMobileAdd(e: KeyboardEvent) {
    this.addConatctDetails()
    setTimeout(() => {
      this.select_email.selector.nativeElement.focus()
    }, 10)

    this.enableContactFlag = true
  }
  countryCodeId: any
  getOrgnizationAddress() {
    let Address = JSON.parse(localStorage.getItem('ORGNIZATIONADDRESS'));
    
    if (Address !== null && this.addressByDefaultForLedger) {
      this.loadAddressDetails(Address)
    }
    if (Address !== null  && !this.addressByDefaultForLedger) {
      this.getCountryCodeForMobile(Address)
    }
  }
  getCountryCodeForMobile (Address){
    this.validmobileLength = Address.Length
    this.countryCodeFlag = Address.CountryCode
    this.CountryCode = Address.CountryCode
    this.getListCountryLabelList(0)
    this.GSTStateCode='00'
    
  }
  @ViewChild('addNewCityRef') addNewCityRefModel: AddNewCityComponent
  selectedCityId(event) {
    this.cityValue = event.id
    if (this.cityValue > 0) {
      this.cityName = event.text
      this.getAreaId(this.cityValue)
    }
    if (+event.id === -1) {
      const data = {
        countryList: !_.isEmpty(this.countryList) ? [...this.countryList] : [],
        countryId: !this.countryValue ? 0 : this.countryValue,
        stateId: !this.stateValue ? 0 : this.stateValue
      }
      this.addNewCityRefModel.openModal(data);
    }
    else if (event.id === 0) {
      this.stateValue = null
    }
  }

  addCityClosed(selectedIds?) {
    debugger
    if (selectedIds !== undefined) {
      if (this.countryValue !== null && Number(this.countryValue) !== selectedIds.countryId) {
        this.countryValue = selectedIds.countryId
        this.stateValue = selectedIds.stateId
        this.cityValue = selectedIds.cityId;
      } else if (this.stateValue !== null && Number(this.stateValue) !== selectedIds.stateId) {
        this.stateValue = selectedIds.stateId
        this.cityValue = selectedIds.cityId;
      } else {
        this.cityValue = selectedIds.cityId;
        this.getCitylist(selectedIds.stateId, 0)
      }
    } else {
      this.cityValue = null
    }
  }
  yesConfirmationClose() {
    $('#close_confirm_vendor').modal(UIConstant.MODEL_HIDE)
    this.onloadingCustomerForm()
    this.closeModal()
  }

  clearValidation() {
    this.closeConfirmation()
  }
  closeConfirmation() {
    $('#close_confirm_vendor').modal(UIConstant.MODEL_SHOW)
  }

}
