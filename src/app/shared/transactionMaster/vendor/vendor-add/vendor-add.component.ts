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
  get f() { return this.vendorForm.controls }
  get bank() { return this.bankForm.controls }
  get address() { return this.adressForm.controls }
  // cleckTab:any
  constructor(private _CommonService: CommonService, private _vendorServices: VendorServices,
    private _formBuilder: FormBuilder,
    private _sanariioservices: SaniiroCommonService,
    private _commonGaterSeterServices: CommonSetGraterServices,
    private _toastrcustomservice: ToastrCustomService) {
    //  this.cleckTab = document.getElementsByClassName("list_group")[0];
    this.formVendor()
    this.formBank()
    this.addTyperessForm()
    this.addArea()
    this.modalSub = this._CommonService.getVendStatus().subscribe(
      (data: AddCust) => {
        if (data.open) {
          //  $('#vendorName').focus()
          if (data.editId === '') {
            this.editMode = false
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

  get adAre() { return this.areaForm.controls }
  ngOnDestroy() {
    this.modalSub.unsubscribe()
    this.editvenderSubscribe.unsubscribe()
  }

  addressRequiredForLedger: boolean 
  mobileRequirdForSetting: boolean 
  emailRequirdForSetting: boolean 
  
  openModal() {
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

      jQuery(function ($) {
        flatpickr('.vendor-add', {
          maxDate: 'today',
          dateFormat: 'd M y'
        })
      })

      this.mobileArray = []
      this.emailArray = []
      this.collectionOfAddress = []
      this.adressArray = []
      this.emailAdressArray = []
      this.submitClick = false
      this.bankClick = false
      this.addressClick = false
      this.emailAdressArray = []
      this.addingPulsContact(0)
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

  closeModal() {
    if ($('#vendor_form').length > 0) {
      this.id = UIConstant.ZERO
      this.editMode = false
      $('#vendor_form').modal(UIConstant.MODEL_HIDE)
    }
  }
  getVendorEditData(id) {
    this.submitClick = false
    $('#vendor_form').modal(UIConstant.MODEL_SHOW)
    jQuery(function ($) {
      flatpickr('.vendor-add', {
        maxDate: 'today',
        dateFormat: 'd M y'
      })
    })
    // this.addingMobileType()
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
            this.emailAdressArray = []
            this.emailAdressArray = Data.Data.Emails

          } else {
            this.emailPlusAddingArray(0)
          }
          if (Data.Data.ContactInfo.length > 0) {
            this.mobileRequirdForSetting = false

            this.adressArray = []
            this.adressArray = Data.Data.ContactInfo

          } else {
            this.addingPulsContact(0)
          }

          if (Data.Data && Data.Data.Banks.length > 0) {

            this.bankArray = []
            this.bankArray = Data.Data.Banks
          } else {

            this.bankArray = []
          }
          if (Data.Data && Data.Data.LedgerDetails.length > 0) {
            // this.id = Data.Data.LedgerDetails[0].id
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
            this.vendorForm.controls.dobDate.setValue(Data.Data.ContactPersons[0].Dob)
            this.vendorForm.controls.daoDate.setValue(Data.Data.ContactPersons[0].Doa)
          }
          // this.statusoriesId = Data.Data.Statutories[0].id
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
  private formVendor() {
    this.vendorForm = this._formBuilder.group({
      'vendorName': [UIConstant.BLANK, Validators.required],
      'contactPerson': [UIConstant.BLANK, Validators.required],
      'registrationNo': [UIConstant.BLANK],
      // "vendorCode": [UIConstant.BLANK],
      'gstNo': [UIConstant.BLANK],
      'panNo': [UIConstant.BLANK],
      'openingBlance': [UIConstant.BLANK],
      // "dueOn": [UIConstant.BLANK],
      'daoDate': [UIConstant.BLANK],
      'dobDate': [UIConstant.BLANK],
      'mobileNo': [UIConstant.BLANK]
      //  'adressvalue': [UIConstant.BLANK]
    })
  }

  private formBank() {
    this.bankForm = this._formBuilder.group({
      'bankName': [UIConstant.BLANK, Validators.required],
      'accountNo': [UIConstant.BLANK, Validators.required],
      'ifscCode': [UIConstant.BLANK, Validators.required],
      'branch': [UIConstant.BLANK, Validators.required],
      'micrNo': [UIConstant.BLANK, Validators]
    })
  }

  private addTyperessForm() {
    this.adressForm = this._formBuilder.group({
      'adressvalue': [UIConstant.BLANK, Validators.required],
      'postcode': [UIConstant.BLANK, Validators.required]

    })
  }

  ngOnInit() {
    //  this.cleckTab.addEventListener("click", this.changeActivetab());
    this.adressArray = []
    this.emailAdressArray = []
    this.mobileArray = []
    this.emailArray = []
    this.collectionOfAddress = []
    // this.storeAddress = []
    this.bankArray = []
    this.stateList = []
    this.cityList = []
    this.searchCountryCodeForMobile(' ')
    // this.add
    // this.cate
    // this.addressArray = []
    $('#rcma').prop('checked', false)
    this.isRcm = false
    $('#msmed').prop('checked', false)
    this.isMsdm = false
    // this.bankArray = [];
    // this.pulsAdress=0;
    // this.

    jQuery(function ($) {
      flatpickr('.vendor-add', {
        maxDate: 'today'
      })
    })
    this.submitClick = false
    // this.id = 0
    this.adressArray = []
    this.emailAdressArray = []
    this.addingPulsContact(0)
    this.emailPlusAddingArray(0)
    this.select2VendorValue(UIConstant.ZERO)
    this.select2CrDrValue(0)
    // this.getCountry(0)
    this.mobileArray = []
    this.emailArray = []
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

  checkPANNumberValid() {
    this.PANNumber = (this.vendorForm.value.panNo).toUpperCase()
    if (this.PANNumber !== '' && this.PANNumber !== null) {
      if (this.panNumberRegxValidation(this.PANNumber)) {
        this.validPANFlag = false
      } else {
        this.validPANFlag = true
      }
    }
    else {
      this.validPANFlag = false
    }
  }
  validGSTNumber: boolean = false
  checkGSTNumberValid() {
    this.GSTNumber = (this.vendorForm.value.gstNo).toUpperCase()
    debugger;
    if (this.GSTNumber !== '' && this.GSTNumber !== null) {
      if (this.gstNumberRegxValidation(this.GSTNumber)) {
        this.validGSTNumber = false
      } else {
        this.validGSTNumber = true
      }
    }
    else {
      this.validGSTNumber = false
    }
  }
  validateMobile(mobile) {
   // let l = this.codeLengthList.Length
    let regx = /\[0-9]/g
    return regx.test(mobile)
  }
validMobileFlag  :boolean = false
  mobileNo: any
  checkNumberByCountry(e) {
    this.mobileNo = e.target.value
    if(this.checkSelectCode){
    for (let i = 0; i < this.adressArray.length; i++) {
      if (this.codeLengthList.Length === this.mobileNo.length) {
        this.validMobileFlag = true
        document.getElementById('contactno' + i).className += ' successTextBoxBorder'
        document.getElementById('contactno' + i).classList.remove('errorTextBoxBorder')
      }
      else {
        this.validMobileFlag = false
        document.getElementById('contactno' + i).className += ' errorTextBoxBorder'

      }
    }
  }
  }
  checkSelectCode:boolean = false
  onSelectCountry(index, addArrayIndex) {
    this.codeLengthList = this.countryListWithCode[index]
    if (this.countryListWithCode.length > 0) {
       this.checkSelectCode = true
      this.CountryCode = this.codeLengthList.Phonecode

    }

  }
  mobileValueFlag: any = false
  addingPulsContact(value) {
    //   this.mobileError = false
    let boolCheck = false
    for (let i = 0; i < this.adressArray.length; i++) {
      if ($('#sel1' + i).val() === '') {
        $('#sel1' + i).val('1')
      }
      this.mobileNo = $('#contactno' + i).val()
      if (this.CountryCode !== 'Select') {
        // if ($('#ctryPhoneCode' + i).val() !== '') {
        //   // this.CountryCode = ' '
        //   this.code = $('#ctryPhoneCode' + i).val()
        //   console.log(this.code, "h")
        // }
        boolCheck = true
        //   alert("j")
      }
      else {
        this._toastrcustomservice.showError('Error', 'Select Country Code')
        boolCheck = false
        break

      }
      if ($('#contactno' + i).val() !== '' && ($('#contactno' + i).val() !== undefined)) {

        document.getElementById('contactno' + i).className += ' successTextBoxBorder'
        document.getElementById('contactno' + i).classList.remove('errorTextBoxBorder')

        if ($('#sel1' + i).val() > 0) {
          boolCheck = true

        } else {

          boolCheck = false
          break
        }

      } else {
        $('#contactno' + i).focus()
        document.getElementById('contactno' + i).className += ' errorTextBoxBorder'
        boolCheck = false
        break
      }
    }
    if (boolCheck) {
      this.adressArray.push({
        Id: 0,
        ContactNo: undefined,
        ContactType: undefined,
        CountryCode: undefined
      })
    }
    if (this.adressArray.length === 0) {
      this.adressArray.push({
        Id: 0,
        ContactNo: undefined,
        ContactType: undefined,
        CountryCode: undefined
      })
    }
    
  }
  mobileArray: any[]

  deleteArrayMobileType(i) {
    if (this.adressArray.length > 1) {
      this.adressArray.splice(i, 1)
    } else if (i === 0) {
      this.adressArray.splice(i, 1)
      this.adressArray.push({
        Id: 0,
        ContactNo: undefined,
        ContactType: undefined
      })
    }
  }

  delteEmailArray(i) {
    if (this.emailAdressArray.length > 1) {
      this.emailAdressArray.splice(i, 1)
    } else if (i === 0) {
      this.emailAdressArray.splice(i, 1)
      this.emailAdressArray.push({
        Id: 0,
        EmailAddress: undefined,
        EmailType: undefined
      })
    }

  }
  emailArray: any[]

  validateEmail(email) {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
  }
  emailValueFlag: any = false
  emailError: any

  emailPlusAddingArray(value) {
    let boolCheck = false
    for (let i = 0; i < this.emailAdressArray.length; i++) {
      if ($('#sel1parmantent' + i).val() === '') {
        $('#sel1parmantent' + i).val("1")
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
  select2VendorValue(value) {
    this.selectVendor = []
    this.selectVendorPlaceHolder = { placeholder: 'Select Vendor' }
    this.selectVendor = [{ id: UIConstant.BLANK, text: 'SelectVendor' }, { id: '1', text: 'Regular' }
      , { id: '2', text: 'Composition' }, { id: '3', text: 'Exempted' }
      , { id: '4', text: 'UnRegistered' }, { id: '5', text: '	E-Commerce Operator ' }]
    this.vendorId = this.selectVendor[1].id
    return this.vendorValue = this.selectVendor[1].id
  }

  checkVendorRegiValidation() {

    debugger;
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

  selectedVendorId(event) {
    this.vendorId = event.value
    this.vendorRegiError = false
  }

  select2CrDrPlaceHolder: Select2Options
  valueCRDR: any
  crDrId: number
  select2CrDrValue(value) {
    this.selectCrDr = []
    this.select2CrDrPlaceHolder = { placeholder: 'Select CR/Dr' }
    this.selectCrDr = [{ id: UIConstant.BLANK, text: 'Select CR/DR' }, { id: '1', text: 'CR' }, { id: '0', text: 'DR' }]
    this.valueCRDR = value
  }

  selectCRDRId(event) {
    this.crDrId = event.value
  }

  countryValue: any
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
      this.countryValue = value
      // });
    })
  }
  countrId: any
  selectCountryListId(event) {
    this.countrId = event.value
    this.countryError = false
    if (this.countrId > 0) {
      this.getStaeList(this.countrId, 0)

    }
    // this.addressDetailsValidation()
  }
  stateValue: any
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
      this.stateValue = value
    })
  }

  stateId: any
  selectStatelist(event) {
    this.stateId = event.value
    this.stateError = false
    if (this.stateId > UIConstant.ZERO) {
      this.getCitylist(this.stateId, 0)
    }
    // this.addressDetailsValidation()
  }
  cityValue: any
  getCitylist(id, value) {
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
  selectedCityId(event) {
    this.cityId = event.value
    this.cityError = false
    if (this.cityId > 0) {
      this.getAreaId(this.cityId)
    }
    // this.addressDetailsValidation()
  }
  private getAreaId(id) {
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
  addArea() {
    this.areaForm = this._formBuilder.group({
      'areaName': ['', Validators.required]
    })
  }
  openAreaModel() {
    $('#add_area_Popup1').modal(UIConstant.MODEL_SHOW)
  }
  closeAreaModel() {
    $('#add_area_Popup1').modal(UIConstant.MODEL_HIDE)
  }
  areaID: any
  addAreaClick: boolean
  areNameId: any;
  areaAdd() {
    this.addAreaClick = true
    const addValue = {
      Id: 0,
      CommonDesc3: this.areaForm.value.areaName,
      ShortName3: this.areaForm.value.areaName,
      CommonCode: 104,
      CommonId2: this.cityId,
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
          this.areaForm.reset();
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
  selectedArea(event) {

    debugger
    if (event.data.length > 0) {
      if (event.data[0].id !== "0") {
        if (event.data[0].text !== 'Select Area') {
          this.areaID = event.value
          this.Areaname = event.data[0].text
        }
        else {
          this.areaID = undefined
          this.Areaname = ' '
        }
      }
      else {
        this.areaSelect2.selector.nativeElement.value = ''
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
    }
    else {
      this.addresTypeId = event.value
      this.addTypeName = event.data[0].text

    }
    this.addressDetailsValidation()
    this.addressError = false
  }
  // changeActivetab(){
  //   // document.getElementById('tab').classList.remove('active')
  //   $('.list_group li a').click(function() {
  //     $(this).addClass('active');
  //    // document.getElementById('tab').classList.remove('active')
  //   })
  //   }


  //  changeActivetab(e) {

  //     var elems = document.querySelector(".active");
  //     if(elems !=null) {
  //       elems.classList.remove("active");
  //     }
  //     e.target.className = "active";
  //   }





  addressDiv: boolean
  adressTab() {
    //  this.changeActivetab()
    this.addressDiv = true
    this.vendorDiv = false
    this.bankDiv = false
  }
  vendorDiv: boolean
  vendorTab() {
    // this.changeActivetab()
    this.vendorDiv = true
    this.addressDiv = false
    this.bankDiv = false
  }
  bankDiv: boolean
  bankeDetailTab() {
    //  this.changeActivetab()
    this.bankDiv = true
    this.vendorDiv = false
    this.addressDiv = false

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
  // /* .......completed............................ */

  /* Completed...........................*/
  getVendorDetail() {
    this.subscribe = this._vendorServices.getVendor(4).subscribe(Data => {
      if (Data.Code === UIConstant.THOUSAND) {
        this._vendorServices.sendDataWithObservable(Data.Data)
      }
    })
  }

  addingMobileType() {
    //  if (this.mobileRequirdForSetting) {
    // this.requiredValid = false;
    this.mobileArray = []
    if (this.adressArray.length > 0) {
      for (let i = 0; i <= this.adressArray.length; i++) {
        if ($('#sel1' + i).val() === '') {
          $('#sel1' + i).val("1")
        }
        let mobile = $('#contactno' + i).val()
       
          if ($('#sel1' + i).val() > 0 && $('#contactno' + i).val() !== '' && ($('#contactno' + i) !== undefined)) {
            if(this.validMobileFlag){
              this.mobileArray.push({
                Id: this.adressArray[i].Id !== 0 ? this.adressArray[i].Id : 0,
                ContactType: $('#sel1' + i).val(),
                ContactNo: $('#contactno' + i).val(),
                CountryCode: $('#ctryPhoneCode' + i).val(),
                ParentTypeId: 5
              })
              //  console.log( this.mobileArray,"ssssssssss")
              this.mobileRequirdForSetting = false
            }
            else{
              this._toastrcustomservice.showError('Error','Invalid mobile')
            }

          }
        }
        


     // }
      //}
    }

  }


  requiredValid: boolean
  fillEmailDetails() {
    //  if (this.emailRequirdForSetting) {
    this.emailArray = []
    for (let i = 0; i <= this.emailAdressArray.length; i++) {
      if ($('#sel1parmantent' + i).val() === '') {
        $('#sel1parmantent' + i).val('1')
      }
      let email = $('#email' + i).val()
      if ($('#sel1parmantent' + i).val() > 0 && $('#email' + i).val() !== '' && this.validateEmail(email) && ($('#email' + i) !== undefined)) {
        this.emailArray.push({
          Id: this.emailAdressArray[i].Id !== 0 ? this.emailAdressArray[i].Id : 0,
          EmailType: $('#sel1parmantent' + i).val(),
          EmailAddress: $('#email' + i).val(),
          ParentTypeId: 5
        })
        this.emailRequirdForSetting = false
      }
      //}
    }
  }

  submitClick: boolean
  bankClick: boolean
  addVendor(value) {
    // $('#vendorName').focus()
    this.addingMobileType()
    this.fillEmailDetails()
    this.checkGSTNumberValid()
    this.checkPANNumberValid()
    //  this.addNewbankDetail()
    //  this.addNewAdress()
    // this.checkVendorRegiValidation()

    this.submitClick = true
    if (value === 'reset') {
      this.deleteArrayMobileType(0)
      this.delteEmailArray(0)
      this.formVendor()
    } else if (this.vendorForm.valid && this.vendorId > UIConstant.ZERO) {
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
                      const dataToSend = { id: Data.Data, name: this.vendorForm.value.vendorName }
                      this._CommonService.closeVend({ ...dataToSend })
                      this._toastrcustomservice.showSuccess('Success', 'Save successfully')

                      $('#vendor_form').modal(UIConstant.MODEL_HIDE)
                      this.formVendor()
                    }
                  }
                    if(Data.Code === 1001){
                        this._toastrcustomservice.showInfo('Info', Data.Description)

                    }
                })
              }
              else {
               this.adressTab()
                this._toastrcustomservice.showError('Error', 'Please Enter Address ')
              }
            }
            else {
              this._toastrcustomservice.showError('Error', 'invalid PAN No. ')
            }
          }
          else {
            this._toastrcustomservice.showError('Error', 'invalid GST No. ')
          }
        } else {
          //   document.getElementById('email' + '0').className += ' errorTextBoxBorder'
          $('.emailfocu').focus()
          $('.mobilefocu').focus()
          this._toastrcustomservice.showError('Error', 'Please enter  email ')

        }
      } else {
        //   document.getElementById('email' + '0').className += ' errorTextBoxBorder'
        $('.emailfocu').focus()
        $('.mobilefocu').focus()
        this._toastrcustomservice.showError('Error', 'Please enter mobile  ')

      }
    }

  }
  GSTNumber: any
  PANNumber: any
  private addLedgerParmas() {
    let ledgerElement = {
      ledgerObj: {
        Id: this.id,
        Websites: [],
        GlId: 4,
        openingBlance: this.vendorForm.value.openingBlance,
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
          DOB: this.vendorForm.value.dobDate,
          DOA: this.vendorForm.value.daoDate
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
        console.log(this.collectionOfAddress, 'add')
      }

      this.addressClick = false
    }
    this.adressForm.reset()
    this.getCountry(0)
    this.adressType(0)
  }
  //}

  addressIndex: any
  getEditAddress(address, index) {
    this.addressIndex = index
    this.adressForm.controls.postcode.setValue(address.PostCode)
    this.adressForm.controls.adressvalue.setValue(address.AddressValue)
    this.getCountry(address.CountryId)
    this.adressType(address.AddressType)
    //  this.getStaeList(address.StateId,0);
    // this.getCitylist(address.stateId,0)
    // this.getCitylist(address.sityId,0)

  }

  removeAdressIndexArray(i) {
    this.collectionOfAddress.splice(i, 1)
    if (this.collectionOfAddress.length > 0) {
      this.addressRequiredForLedger = false
    }
    else
      if (this.setupCodeForAddresRequired === 54) {
        this.addressRequiredForLedger = true
      }
      else {
        this.addressRequiredForLedger = false

      }
  }
  crossButton() {
    this.formVendor()
    this.getCountry(0)
    this.vendorForm.reset()
    this.emailAdressArray = []
    this.mobileArray = []
    this.adressArray = []
    this.collectionOfAddress = []
    this.emailPlusAddingArray(0)
    this.addingPulsContact(0)
    $('#vendor_form').modal(UIConstant.MODEL_HIDE)
  }
  bankIndex: any

  getEditBankData(bankData, index) {
    this.bankIndex = index
    this.editBankDataFlag = true
    this.bankForm.controls.bankName.setValue(bankData.Name)
    this.bankForm.controls.accountNo.setValue(bankData.AcNo)
    this.bankForm.controls.ifscCode.setValue(bankData.IfscCode)
    this.bankForm.controls.branch.setValue(bankData.Branch)
    this.bankForm.controls.micrNo.setValue(bankData.MicrNo)

  }

  addNewbankDetail() {
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
  removeIndexOfBank(index) {
    this.bankArray.splice(index, 1)
  }

  reapeatName(name: string) {
    this.vendorForm.controls.contactPerson.setValue(name)

  }

  setupCodeForAddresRequired: any
  emailMobileValidationRequired() {
    this.subscribe = this._CommonService.allsetupSettingAPI().subscribe(data => {
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        if (data.Data.SetupSettings.length > 0) {
          data.Data.SetupSettings.forEach(ele => {
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
            if (ele.SetupId === 54) {
              this.setupCodeForAddresRequired === 54
              this.addressRequiredForLedger = true
            }

          })

        }

        console.log(data, 'setting')
      }
    })

  }
  countryListWithCode: any
  searchCountryCodeForMobile(name) {
    this.subscribe = this._CommonService.searchCountryByName(name).subscribe(Data => {

      if (Data.Code === 1000 && Data.Data.length > 0) {
        this.countryListWithCode = Data.Data
        console.log(Data.Data, "country code phone")
      }
      else {
        this._toastrcustomservice.showError('Error', Data.Description)

      }
    })
  }
  CountryCode: any = 'Select'
  codeLengthList: any
}
