import { Component, Output, EventEmitter, OnDestroy, ViewChild, ElementRef } from '@angular/core'
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
declare const $: any
import { SetUpIds } from 'src/app/shared/constants/setupIds.constant'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
declare const flatpickr: any
import * as _ from 'lodash'
import { AddNewCityComponent } from '../../../../shared/components/add-new-city/add-new-city.component';

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
  VendorDetailShow: Ledger[]
  id: any
  statutoriesId: any = 0
  contactPersonId: any = 0
  adressArray: any
  emailAdressArray: any
  ContactInfoId: number
  bankArray: any = []
  vendorRegiError: any
  areaForm2: any
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
  EMAIL: any = 'email'
  MOBILE: any = 'mobile'
  YES: any = 'yes'
  NO: any = 'no'
  editId: any
  noOfDecimal: any = 0
  private unSubscribe$ = new Subject<void>()
  @ViewChild('vendor_registerType') vendorRegisterTypeSelect2: Select2Component

  // cleckTab:any
  constructor(private _CommonService: CommonService, private _vendorServices: VendorServices,
    private _formBuilder: FormBuilder,
    private _sanariioservices: SaniiroCommonService,
    private _commonGaterSeterServices: CommonSetGraterServices,
    private _toastrcustomservice: ToastrCustomService,
    public _globalService: GlobalService, public _settings: Settings) {
    //this.clientDateFormat = this._settings.dateFormat
    this.noOfDecimal = this._settings.noOfDecimal
    //this.formVendor()
    //this.formBank()
    //this.addTyperessForm()
    // this.addArea()
    this.modalSub = this._CommonService.getVendStatus().subscribe(
      (data: AddCust) => {
        if (data.open) {
          this.isAddNew = data.isAddNew
          if (data.editId === '') {
            this.editMode = false
            this.editId = 0
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
            this.activaTab('vendor2')
            this.adressTab()
            setTimeout(() => {
              this.select_Mobile.selector.nativeElement.focus()
            }, 10)
          }

        }
      }
    )

  }

  ngOnDestroy() {
    this.modalSub.unsubscribe()
    this.confirmSUB.unsubscribe()
    if (this.editvenderSubscribe) {
      this.editvenderSubscribe.unsubscribe()
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
  addressRequiredForLedger: boolean
  mobileRequirdForSetting: boolean
  emailRequirdForSetting: boolean
  customerError: any
  persnalError: any
  openingBlance: any
  gstin: any
  panNo: any
  registrationNo: any
  contactPerson: any
  vendorName: any
  dobDate: any
  daoDate: any
  initModel() {
    this.customerError = true
    this.persnalError = true
    this.contactPerson = ''
    this.mobileNo = ''
    this.registrationNo = ''
    this.gstin = ''
    this.gstNo = ''
    this.openingBlance = 0
    this.panNo = ''
    this.vendorName = ''
    this.daoDate = ''
    this.dobDate = ''
    this.EmailAddress = ''
    this.countryValue= null
    this.stateValue= null
    this.cityValue= null
    this.areaName = ''
  }
  openModal() {
    this.initModel()
    this.statutoriesId = 0
    this.contactPersonId = 0
    this.disabledGSTfor_UnRegi = false
    this.disabledStateCountry = false
    this.requiredGSTNumber = false
    this.activaTab('vendor1')
    this.editFlg = true
    this.editEmailFlg = true
    this.getEmailvalid = true
    this.getContactType()
    this.emailTypeDataType()
    this.validMobileFlag = false
    this.mobileNoId = 0
    this.EmailId = 0
    this.setDOADate()
    this.setDOBDate()
    this.searchCountryCodeForMobile(' ')
    this.addressRequiredForLedger = false
    this.mobileRequirdForSetting = false
    this.emailRequirdForSetting = false
    this.onloadingbank()
    if (this.editMode) {
      this.select2VendorValue(UIConstant.ZERO)
      this.getVendorEditData(this.id)
    } else {
      this.getModuleSettingValue = JSON.parse(this._settings.moduleSettings)
      this.getModuleSettingData()
      $('#vendor_form').modal(UIConstant.MODEL_SHOW)
      setTimeout(() => {
        this.ledgerName.nativeElement.focus()
      }, 1000)

      this.mobileArray = []
      this.emailArray = []
      this.collectionOfAddress = []
      this.adressArray = []
      this.emailAdressArray = []
      this.submitClick = true
      this.bankClick = false
      this.addressClick = false
      this.emailAdressArray = []
      this.select2VendorValue(UIConstant.ZERO)
      this.select2CrDrValue(1)
      this.getCountry(0)
      this.vendorRegisterTypeSelect2.setElementValue(1)
      this.bankArray = []
      this.isMsdm = false
      this.isRcm = false
      this.id = UIConstant.ZERO
      this.select_Mobile.setElementValue(1)
      this.select_email.setElementValue(1)
      this.addressDiv = false
      this.vendorDiv = true
      this.bankDiv = false
      if (!this.editMode) {
        this.getOrgnizationAddress()
      }
      $('#tradediscount').prop('checked', false)
      $('#cashdiscount').prop('checked', false)
      $('#volumediscount1').prop('checked', false)

      this.enableContactFlag = true
    }
  }
  getModuleSettingValue: any
  @ViewChild('ledgerName') ledgerName
  closeModal() {
    if ($('#vendor_form').length > 0) {
      this.id = UIConstant.ZERO
      this.editMode = false
      $('#vendor_form').modal(UIConstant.MODEL_HIDE)
    }
  }
  gstNo: any
  getVendorEditData(id) {
    setTimeout(() => {
      this.ledgerName.nativeElement.focus()
    }, 1000)
    this.submitClick = true
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
            this.vendorName = Data.Data.LedgerDetails[0].Name
            this.customerError=false
            this.select2CrDrValue(Data.Data.LedgerDetails[0].Crdr)
            this.select2VendorValue(Data.Data.LedgerDetails[0].TaxTypeId)
            this.requiredGSTNumber = Data.Data.LedgerDetails[0].TaxTypeId === 1 ? true : false

            this.vendorId = Data.Data.LedgerDetails[0].TaxTypeId
            this.vendorRegisterTypeSelect2.setElementValue(Data.Data.LedgerDetails[0].TaxTypeId)

            this.disabledGSTfor_UnRegi = Data.Data.LedgerDetails[0].TaxTypeId === 4 ? true : false


            this.openingBlance = Data.Data.LedgerDetails[0].OpeningBalance.toFixed(this.noOfDecimal)
          }

          if (Data.Data && Data.Data.Statutories.length > 0) {
            this.statutoriesId = Data.Data.Statutories[0].Id
            this.parentTypeIdofStatutoriesId = Data.Data.Statutories[0].ParentTypeId
            this.gstNo = Data.Data.Statutories[0].GstinNo
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
          // if (Data.Data && Data.Data.addresses.length > 0) {

          // }
        }
        if (Data.Code === 5000) {
          this._toastrcustomservice.showError('', Data.Description)
        }
      })

  }


  bankName: any = ''
  accountNo: any
  ifscCode: any
  branch: any
  micrNo: any
  postcode: any
  adressvalue: any

  onloadingbank() {
    this.bankName = ''
    this.ifscCode = ''
    this.branch = ''
    this.accountNo = ''
    this.micrNo = ''
  }

  ngOnInit() {
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
    //this.select2VendorValue(UIConstant.ZERO)
    this.select2CrDrValue(1)

    this.bankArray = []
    this.adressType(0)
    this.addressDiv = false
    this.vendorDiv = true
    this.bankDiv = false
  }

  mobileErrormass: any

  gstNumberRegxValidation(gstNumber) {
    let regxGST = /^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/
    return regxGST.test(gstNumber)
  }

  panNumberRegxValidation(panNumber) {
    let regxPAN = /[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    return regxPAN.test(panNumber)
  }
  validPANFlag: boolean = false

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
  GSTStateCode: any = 0
  matchStateCodeWithGSTNumber() {
    if (this.GSTStateCode > 0 && this.GstinNoCode !== '') {
      if (this.GSTStateCode === this.GstinNoCode) {
        return true
      }
      else {
        return false
      }
    } else {
      return true
    }

  }
  GstinNoCode: any
  validGSTNumber: boolean = false

  getStateCode = async (stateCode) => {
    this._CommonService.getStateByGStCode(stateCode).
      pipe(
        takeUntil(this.unSubscribe$)
      ).
      subscribe((response: any) => {
        //ShortName1 = statecode
        if (response.Code === UIConstant.THOUSAND && response.Data.length > 0) {
          this.countrId = response.Data[0].CommonId
          this.stateId = response.Data[0].Id
          this.countryValue =response.Data[0].CommonId
          //this.countryselecto.setElementValue(response.Data[0].CommonId)
          this.getOneState(response)
          this.stateValue = response.Data[0].Id
          // this.stateselecto.setElementValue(response.Data[0].Id)

        }
      })

  }
  disabledStateCountry: boolean

  getOneState(rsp) {
    let newdata = []
    newdata.push({
      id: rsp.Data[0].Id,
      text: rsp.Data[0].CommonDesc1
    })
    this.disabledStateCountry = true
    this.stateList = newdata
    this.getCitylist(rsp.Data[0].Id, 0)
  }

  checkGSTNumber(event) {
    this.gstNo = event.target.value;
    let str = this.gstNo
    let val = str.trim();
    this.GstinNoCode = val.substr(0, 2);
    if (this.GstinNoCode !== '') {
      this.getStateCode(this.GstinNoCode)
    }
    else {
      this.disabledStateCountry = false
    }

    this.matchStateCodeWithGSTNumber()
    this.checkGSTNumberValid()
  }
  checkGSTNumberValid() {
    if (this.gstNo !== '') {
      if (+this.vendorId === 1) {
        if (this._CommonService.gstNumberRegxValidation((this.gstNo).toUpperCase())) {
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

  validateMobile(mobile) {
    let regx = /\[0-9]/g
    return regx.test(mobile)
  }
  validMobileFlag: boolean = false
  mobileNo: any
  checkNumberByCountry(e) {
    this.mobileNo = e.target.value
    if (this.validmobileLength === this.mobileNo.length) {
      this.validMobileFlag = false
    } else {
      this.validMobileFlag = true
    }

  }
  checkSelectCode: boolean = false
  onSelectCountry(index, addArrayIndex) {
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
  editFlg: boolean = true
  editRowItem(i, type, id) {
    if (type === 'contact') {
      if (this.editFlg) {
        this.editFlg = false
        this.mobileNoId = id
        this.contactType = this.mobileArray[i].ContactType
        this.select_Mobile.setElementValue(this.mobileArray[i].ContactType)
        this.contactTypeName = this.mobileArray[i].ContactTypeName
        this.mobileNo = this.mobileArray[i].ContactNo
        this.countryCodeFlag =this.mobileArray[i].CountryCode
        this.CountryCode = this.mobileArray[i].CountryCode
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

  validateEmail(email) {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
  }
  emailValueFlag: any = false
  emailError: any



  /* .....................select2 values.............. */
  selectVendorPlaceHolder: Select2Options
  vendorValue: any
  vendorId: any
  select2VendorValue(value) {
    this.selectVendor = []
    this.selectVendorPlaceHolder = { placeholder: 'Select Vendor' }
    this.selectVendor = [{ id: '1', text: 'Regular' }
      , { id: '2', text: 'Composition' }, { id: '3', text: 'Exempted' }
      , { id: '4', text: 'UnRegistered' }, { id: '5', text: '	E-Commerce Operator ' }]
    this.vendorId = this.selectVendor[0].id
    this.vendorValue = this.selectVendor[0].id


  }


  // checkVendorRegiValidation () {
  //   if (this.vendorId > 0) {
  //     this.vendorRegiError = false
  //   } else {
  //     this.vendorRegiError = true
  //   }
  // }
  countryError: boolean = false
  stateError: boolean = false
  cityError: boolean = false
  addressError: boolean = false
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
  requiredGSTNumber: boolean = false
  disabledGSTfor_UnRegi: boolean = false
  selectedVendorId(event) {
    this.vendorId = +event.value
    if (+event.value === 1) {
      this.requiredGSTNumber = true
      this.disabledGSTfor_UnRegi = false
    }
    else if (+event.value === 4) {
      this.disabledGSTfor_UnRegi = true
      this.gstNo = ''
      this.requiredGSTNumber = false
    }
    else {
      this.requiredGSTNumber = false
      this.disabledGSTfor_UnRegi = false
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

    // 
    this.crDrId = value

  }

  selectCRDRId(event) {
    this.crDrId = event.value
  }

  countryValue: any = null
  getCountry(value) {
    this.subscribe = this._vendorServices.getCommonValues('101').subscribe(Data => {
      this.countryListPlaceHolder = { placeholder: 'Select Country' }
      this.countryList = [{ id: UIConstant.BLANK, text: 'select Country' }]
      Data.Data.forEach(element => {
        this.countryList.push({
          id: element.Id,
          text: element.CommonDesc
        })
      })
      // this.countryValue = value
      // });
    })
  }

  countrId: any
  selectCountryListId(event) {
    if (this.countryValue !== null) {
      this.countrId = event.id
      this.countryError = false
      if (this.countrId > 0) {
        this.getStaeList(this.countrId, 0)

      }
    }

  }
  stateValue: any = null
  getStaeList(id, value) {
    this.subscribe = this._vendorServices.gatStateList(id).subscribe(Data => {
      this.stateListplaceHolder = { placeholder: 'Select State' }
      this.stateList = [{ id: UIConstant.BLANK, text: 'select State' }]
      Data.Data.forEach(element => {
        this.stateList.push({
          id: element.Id,
          text: element.CommonDesc1
        })
      })
    })
  }

  stateId: any
  selectStatelist(event) {
    if (this.stateValue !== null) {
      this.stateId = event.id
      this.stateError = false
      if (this.stateId > UIConstant.ZERO) {
        this.getCitylist(this.stateId, 0)
      }
    }
  }
  cityValue: any = null
  getCitylist(id, value) {
    this.subscribe = this._vendorServices.getCityList(id).subscribe(Data => {
      this.cityList = []
      let newData = [{id:'-1',text:'+Add New'}]
      Data.Data.forEach(element => {
        newData.push({
          id: element.Id,
          text: element.CommonDesc2
        })
      })
      this.cityList = newData
    })
  }

  cityId: any
  
  private getAreaId(id) {
    this.subscribe = this._vendorServices.getAreaList(id).subscribe(Data => {
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
  areaID: any
  addAreaClick: boolean
  areNameId: any =null
  areaName: any = ''

  areaAdd() {
    this.addAreaClick = true
    const addValue = {
      Id: 0,
      CommonDesc3: this.areaName,
      ShortName3: this.areaName,
      CommonCode: 104,
      CommonId2: this.cityId
    }
    if (this.areaName !== '' && this.cityId > 0) {
      this.subscribe = this._CommonService.addAreaNameUnderCity(addValue).subscribe(data => {
        if (data.Code === 1000 && data.Data.length > 0) {


          let newData = Object.assign([], this.areaList)
          newData.push({ id: data.Data, text: this.areaName })
          this.areaList = newData
          this.areNameId = data.Data
          this.areaID = data.Data
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
    if (this.areNameId !== null) {
      if (event.id !== '0') {
        this.areaID = event.id
        this.Areaname = event.text
      } else {
        this.openAreaModel()
      }
    }
  }

  addresTypeId: any
  addrssValueType: any
  adressType(value) {
    this.addressError = false
    this.addressTypePlaceHolder = { placeholder: 'Selecet Address Type' }
    this.addressType = [{ id: '1', text: 'Personal' }, { id: '2', text: 'Work' }, { id: '3', text: 'Postal' }, { id: '4', text: 'Other' }]
    this.addresTypeId = this.addressType[0].id
    this.addTypeName = this.addressType[0].text
  }
  addTypeName: any
  selectedAddressTypeId(event) {
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

  checkValidationName() {
    if (this.vendorName !== "") {
      this.customerError = false
    } else {
      this.customerError = true
    }
  }
  checkValidationPerson() {
    if (this.contactPerson !== "") {
      this.persnalError = false
    } else {
      this.persnalError = true
    }
  }
  dynamicFocus() {
    if (this.customerError) {
      this.ledgerName.nativeElement.focus()
    }
   
  }
  @ViewChild('conatctPerRef') conatctPerRef: ElementRef

  
  @ViewChild('state_select2') stateselecto: Select2Component

  @ViewChild('country_selecto') countryselecto: Select2Component
  @ViewChild('bankNameref') bankNameref: ElementRef

  addressDiv: boolean
  adressTab() {
    setTimeout(() => {
     // this.countryselecto.selector.nativeElement.focus()
    }, 1000)

  }
  vendorDiv: boolean
  vendorTab() {
    setTimeout(() => {
      this.ledgerName.nativeElement.focus()
    }, 1000)

  }
  bankDiv: boolean
  bankeDetailTab() {
    setTimeout(() => {
      this.bankNameref.nativeElement.focus()
    }, 1000)

  }

  // /* ,.......checkboxvalue...... */
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
  addVendor(value) {
    this.submitClick = true
    this.checkGSTNumberValid()
    this.addConatctDetails()
    this.emailAddingArray()
    this.addNewAdress()
    this.dynamicFocus()

    if (value === 'reset') {
      this.resetForNewFoem()
      this.activaTab('vendor1')
      this.getCountry(0)
      this.select2CrDrValue(1)
      this.crdrSelect2.setElementValue(1)
    // } else if (this.vendorName !== '' && !this.validMobileFlag && this.getEmailvalid && this.vendorId > UIConstant.ZERO) {

    } else if (this.vendorName !== '' && !this.validMobileFlag && this.getEmailvalid  && this.vendorId > UIConstant.ZERO) {
      if (!this.requiredGSTNumber) {
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
                        const dataToSend = { id: Data.Data, name: this.vendorName, gstType: this.vendorId }
                        this._CommonService.closeVend({ ...dataToSend })
                        this._CommonService.AddedItem()
                        let saveFlag = this.editId === 0 ? UIConstant.SAVED_SUCCESSFULLY : UIConstant.UPDATE_SUCCESSFULLY
                        this._toastrcustomservice.showSuccess('', saveFlag)
                        $('#vendor_form').modal(UIConstant.MODEL_HIDE)
                        this.select2CrDrValue(1)
                        this.crdrSelect2.setElementValue(1)
                      } else if (value === 'new') {
                        setTimeout(() => {
                          this.ledgerName.nativeElement.focus()
                        }, 500)

                        this.getCountry(0)
                        this.activaTab('vendor1')
                        this._CommonService.AddedItem()
                        this._toastrcustomservice.showSuccess('', UIConstant.SAVED_SUCCESSFULLY)
                        this.id = 0
                        this.select2CrDrValue(1)
                        this.crdrSelect2.setElementValue(1)
                      }
                      this.disabledStateCountry = false
                      this.resetForNewFoem()
                      this.resetAddress()
                    }
                    if (Data.Code === UIConstant.THOUSANDONE) {
                      this._toastrcustomservice.showInfo('', Data.Description)

                    }
                    if (Data.Code === UIConstant.REQUIRED_5020) {
                      this._toastrcustomservice.showError('', Data.Data)

                    }
                  })
                } else {
                  this.activaTab('vendor2')
                  this.adressTab()
                  this._toastrcustomservice.showError('', 'Enter Address Details ')
                }
              } else {
                this._toastrcustomservice.showError('', 'invalid PAN No. ')
              }
            } else {
              this._toastrcustomservice.showError('', 'invalid GST No. ')
            }
          } else {
            this.select_email.selector.nativeElement.focus()
            this._toastrcustomservice.showError('', ' Enter Email Details ')

          }
        } else {
          this.select_Mobile.selector.nativeElement.focus()
          this._toastrcustomservice.showError('', ' Enter Contact Details ')

        }
      } else {
        this.validGSTNumber = true
        this._toastrcustomservice.showError('', ' Enter GSTIN No ')

      }
    }

  }
  activaTab(tab) {
    $('.tabs-cyan a[href="#' + tab + '"]').tab('show');
  };

  resetForNewFoem() {
    this.initModel()
    this.select2VendorValue(0)
    //this.phoneCodeselect2.setElementValue(0)
    this.select_Mobile.setElementValue(1)
    this.select_email.setElementValue(1)
    this.mobileArray = []
    this.emailArray = []
    this.collectionOfAddress = []
    //this.formVendor()
    this.bankArray = []
    this.submitClick = false
    this.vendorRegisterTypeSelect2.setElementValue(1)
    this.countryList = []
    this.stateList = []
    this.cityList = []
    this.areaList = []


  }
  private getopeinAmountValue() {
    if (this.openingBlance > 0) {
      return this.openingBlance
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
        Name: this.vendorName,
        TaxTypeID: this.vendorId,
        CrDr: this.crDrId,
        IsRcm: this.isRcm,
        IsMsmed: this.isMsdm,
        Statutories: [{
          Id: this.statutoriesId !== 0 ? this.statutoriesId : 0,
          PanNo: this.PANNumber,
          GstinNo: this.gstNo,
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
    this.addressClick = true
    this.addressDetailsValidation()
    if (this.countrId > 0 && this.stateId > 0 && this.cityId > 0 && this.adressvalue !== '') {
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
            PostCode: this.postcode,
            AreaName: this.Areaname,
            AreaId: this.areaID,
            AddressValue: this.adressvalue,
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
          PostCode: this.postcode,
          AreaId: this.areaID,
          AreaName: this.Areaname,
          AddressValue: this.adressvalue,
          CountryName: this.country,
          Statename: this.stateName,
          CityName: this.cityName
        })
      }

      this.addressClick = false
    }
     
    this.adressType(0)
    setTimeout(() => {
      this.bankNameref.nativeElement.focus()
    }, 500)
    this.onloadingAddress()
  }

  onloadingAddress() {
    this.countrId = 0
    this.countryValue = null
    this.stateValue = null
    this.cityValue = null
    this.areNameId = null
    this.stateId = 0
    this.cityId = 0
    this.addresTypeId = 0
    this.addTypeName = ''
    this.postcode = ''
    this.areaID = 0
    this.Areaname = ''
    this.adressvalue = ''
    this.country = ''
    this.stateName = ''
    this.cityName = ''
  }
  resetAddress() {
    this.getCountry(0)
    this.countryList = []
    this.stateList = []
    this.cityList = []
    this.areaList = []
  }
  addressIndex: any
  getEditAddress(address, index) {
    this.addressIndex = index
    this.postcode = address.PostCode
    this.adressvalue = address.AddressValue
    this.loadAddressDetails(address)
    this.adressType(address.AddressType)
  }
  countryCodeFlag:any =null
  loadAddressDetails(Address) {
    this.cityId = Address.CityId
    this.countryCodeFlag = Address.CountryCode
    let phonecode = {
      id: Address.CountryCode, text: Address.CountryName,
      PhoneCode: Address.CountryCode,
      Length: Address.Length
    }
    this.onCountryCodeSelectionChange(phonecode)
    this.countrId =Address.CountryId
    this.stateId=Address.StateId
    this.areaID = Address.AreaId
    this.adressvalue = Address.addressValue
    let country = {
      id: Address.CountryId,
      text: Address.CountryName
    }
    this.selectCountryListId(country)
    this.countryValue = Address.CountryId

    let state = {
      id: Address.StateId,
      text: Address.Statename
    }

    let city = {
      id: Address.CityId,
      text: Address.CityName
    }
    let area = {
      id: Address.AreaId,
      text: Address.AreaName
    }
    setTimeout(() => {
      this.selectStatelist(state)
    }, 100);
    this.stateValue = Address.StateId
    setTimeout(() => {
      this.selectedCityId(city)
    }, 200);
    this.cityValue = Address.CityId
    setTimeout(() => {
      this.selectedArea(area)
    }, 200);
    this.areNameId = Address.AreaId


  }

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
  crossButton() {
    this.getCountry(0)
    this.initModel()
    this.emailAdressArray = []
    this.mobileArray = []
    this.adressArray = []
    this.collectionOfAddress = []
    this.countryList = []
    this.stateList = []
    this.cityList = []
    this.areaList = []
    this.closeModal()
    this.select2VendorValue(UIConstant.ZERO)
    this.select2CrDrValue(1)
    this.crdrSelect2.setElementValue(1)
   

  }
  bankIndex: any

  getEditBankData(bankData, index) {
    this.bankIndex = index
    this.editBankDataFlag = true
    this.bankName = bankData.Name
    this.accountNo = bankData.AcNo
    this.ifscCode = bankData.IfscCode
    this.branch = bankData.Branch
    this.micrNo = bankData.MicrNo

  }

  addNewbankDetail() {
    this.bankClick = true
    if (this.bankName !== '') {
      if (this.bankIndex !== undefined) {
        if (this.bankArray.length > 0) {

          let newarray = {
            Id: this.bankArray[this.bankIndex].Id !== 0 ? this.bankArray[this.bankIndex].Id : 0,
            Name: this.bankName,
            AcNo: this.accountNo,
            IfscCode: this.ifscCode,
            ParentTypeId: 5,
            Branch: this.branch,
            MicrNo: this.micrNo
          }
          this.bankArray.splice(this.bankIndex, 1, newarray)
        }
        this.bankIndex = undefined
      } else {
        this.bankArray.push({
          Id: 0,
          Name: this.bankName,
          AcNo: this.accountNo,
          IfscCode: this.ifscCode,
          ParentTypeId: 5,
          Branch: this.branch,
          MicrNo: this.micrNo
        })
      }
      this.bankClick = false
    }
    this.onloadingbank()
    setTimeout(() => {
      this.bankNameref.nativeElement.focus()
    }, 1000)
  }
  removeIndexOfBank(index) {
    this.bankArray.splice(index, 1)
  }

  reapeatName(name: string) {
    this.contactPerson = (name)

  }

  setupCodeForAddresRequired: any
  getModuleSettingData() {
    if (this.getModuleSettingValue.settings.length > 0) {
      this.getModuleSettingValue.settings.forEach(ele => {
        if (ele.id === SetUpIds.edgerEmailorMobileRequiredorNot && ele.val === 1) {
          this.emailError = false
          this.mobileRequirdForSetting = true
        }
        if (ele.id === SetUpIds.dateFormat) {
          this.clientDateFormat = ele.val[0].Val
        }
        if (SetUpIds.edgerEmailorMobileRequiredorNot === ele.id && ele.val === 2) {
          this.emailRequirdForSetting = true
          this.mobileRequirdForSetting = true
          this.emailError = true
        }
        if (ele.id === SetUpIds.edgerEmailorMobileRequiredorNot && ele.val === 3) {
          this.emailError = true
          this.emailRequirdForSetting = true
        }
        if (ele.id === SetUpIds.edgerAddressRequiredorNot && ele.val === 1) {
          this.setupCodeForAddresRequired = 54
          this.addressRequiredForLedger = true

        }

      })
    }
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
    if (this.countryCodeFlag !== null) {
      if (event.id > 0) {
        if (event.id !== '0') {
          this.CountryCode = event.PhoneCode
          this.validmobileLength = event.Length
        }
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
  EmailId: any = 0

  editEmailFlg: boolean = true
  emailAddingArray() {
    this.editEmailFlg = true
    this.checkvalidationEmail()
    if (this.EmailType > 0 && this.getEmailvalid && this.EmailAddress !== '') {
      this.emailRequirdForSetting = false
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
  @ViewChild('select_mobiletype') select_Mobile: Select2Component
  @ViewChild('select_emailtype') select_email: Select2Component
  @ViewChild('phoneCode_select2') phoneCodeselect2: Select2Component

  clear(type) {
    if (type === 'email') {
      this.EmailAddress = ''
      this.select_email.setElementValue(1)
      this.EmailType = '1'

    }
    if (type === 'contact') {
      this.mobileNo = ''
      // this.phoneCodeselect2.setElementValue(0)
      this.select_Mobile.setElementValue(1)
      this.contactType = '1'
      this.CountryCode = this.countryCodeFlag
      this.validMobileFlag = false
    }
  }
  CodeId: any
  mobileNoId: any
  addConctFlag: boolean = false
  addConatctDetails() {
    this.addConctFlag = true
    this.editFlg = true
    this.validateContact()
    if (this.contactType > 0  && !this.validMobileFlag && this.mobileNo !== '') {

      this.mobileRequirdForSetting = false
      this.mobileArray.push({
        Id: this.mobileNoId === 0 ? 0 : this.mobileNoId,
        ContactType: this.contactType,
        ContactTypeName: this.contactTypeName,
        ContactNo: this.mobileNo,
        CountryCode: this.CountryCode,
        CodeId: this.CountryCodeId,
        ParentTypeId: 5

      })
      this.clear('contact')
    }


    console.log(this.mobileArray, 'this.adressArray')
  }
  invalidObj: any = {}
  invalidObjCont: any = {}
  validateContact() {
    let isValid = 1

    if (this.CountryCode > 0) {
      this.invalidObjCont['CountryCode'] = false
    } else {
      this.invalidObjCont['CountryCode'] = true
      isValid = 0
    }


    return !!isValid
  }
  getEmailvalid: any
  checkvalidationEmail() {
    if (this.EmailAddress === "") {
      this.getEmailvalid = true
    }
    else {
      this.getEmailvalid = this.validateEmail(this.EmailAddress)
      return this.getEmailvalid
    }


  }

  pressEnterEmailadd(e: KeyboardEvent) {
    this.emailAddingArray()
    this.activaTab('vendor2')
    this.adressTab()
    // this._CommonService.openConfirmation('email', 'Email Details')


  }

  pressEnterMobileAdd(e: KeyboardEvent) {
    this.addConatctDetails()
    setTimeout(() => {
      this.select_email.selector.nativeElement.focus()
    }, 10)
    // this._CommonService.openConfirmation('mobile', 'Contact Details')

    this.enableContactFlag = true
  }
  countryCodeId: any
  getOrgnizationAddress() {
    let Address = JSON.parse(localStorage.getItem('ORGNIZATIONADDRESS'));
    if (Address !== null) {
      this.validmobileLength = Address.Length
      this.countryCodeFlag = Address.CountryCode
      this.CountryCode = Address.CountryCode
    }
  }
  
  @ViewChild('addNewCityRef') addNewCityRefModel: AddNewCityComponent
  selectedCityId(event) {
    if (this.cityValue !== null) {
      this.cityId = event.id
      this.cityError = false
      if (this.cityId > 0) {
        this.getAreaId(this.cityId)
      }
       if(event.id === '-1'){
        const data = {
          countryList: !_.isEmpty(this.countryList) ? [...this.countryList] : [],
          countryId: this.countryValue===null ? 0 : this.countryValue,
          stateId: this.stateValue===null ? 0 :  this.stateValue
        }
        this.addNewCityRefModel.openModal(data);
      }
    }
  }
  
  addCityClosed(selectedIds?) {
    if (selectedIds !==undefined) {
      if (this.countryValue !==null && Number(this.countryValue) !== selectedIds.countryId) {
        this.countryValue = selectedIds.countryId
        this.stateValue = selectedIds.stateId
        this.cityValue = selectedIds.cityId;
      } else if (this.stateValue !==null && Number(this.stateValue) !== selectedIds.stateId) {
        this.stateValue = selectedIds.stateId
        this.cityValue = selectedIds.cityId;
      } else {
        this.cityValue = selectedIds.cityId;
       this.cityId =selectedIds.cityId
        this.getCitylist(selectedIds.stateId,0)
      }
    } else {
      this.cityValue =null
      //this.cityId =0
    }
  }

}
