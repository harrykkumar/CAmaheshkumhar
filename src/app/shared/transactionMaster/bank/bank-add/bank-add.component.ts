import { Component, Output, ElementRef, EventEmitter, ViewChild } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Subscription } from 'rxjs'
import { BankPopUpServices } from '../../../../commonServices/bank-popup-services'
import { SaniiroCommonService } from '../../../../commonServices/SaniiroCommonService'
import { CommonSetGraterServices } from '../../../../commonServices/setgatter.services'
import { UIConstant } from '../../../constants/ui-constant'
import { VendorServices } from '../../../../commonServices/TransactionMaster/vendoer-master.services'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Banks, AddCust } from '../../../../model/sales-tracker.model'
import { ToastrCustomService } from '../../../../commonServices/toastr.service'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
import { Select2OptionData, Select2Component } from 'ng2-select2'
declare const $: any
import { AddNewCityComponent } from '../../../../shared/components/add-new-city/add-new-city.component';
import * as _ from 'lodash'
@Component({
  selector: 'app-bank-add',
  templateUrl: './bank-add.component.html',
  styleUrls: ['./bank-add.component.css']
})
export class BankAddComponent {
  @Output() onFilter = new EventEmitter()
  bankForm: FormGroup
  subscribe: Subscription
  modalSub: Subscription
  Id: any
  submitClick: boolean
  editData: any
  bankFormRef: any
  private unSubscribe$ = new Subject<void>()
  public selectCrDr: Array<Select2OptionData>
  public countryList: Array<Select2OptionData>
  public stateList: any
  public cityList: Array<Select2OptionData>
  public stateListplaceHolder: Select2Options
  public countryListPlaceHolder: Select2Options
  editID: any
  constructor(private _formBuilder: FormBuilder,
    private _bankServices: BankPopUpServices,
    private _customerServices: VendorServices,
    private _commonGaterSeterServices: CommonSetGraterServices,
    private commonService: CommonService,
    private toastrService: ToastrCustomService) {
    this.modalSub = this.commonService.getLedgerStatus().subscribe(
      (data: AddCust) => {
        if (data.open) {
          if (data.editId === '') {
            this.editData = false
            this.Id = 0
            this.editID = 0
          } else {
            this.editData = true
            this.Id = data.editId
            this.editID = data.editId
          }
          this.openModal()
        } else {
          this.closeModal()
        }
      }
    )
  }
  countrId: any
  stateValue: any
  stateId: any
  countryError: any
  GSTStateCode: any = 0
  selectStatelist(event) {
    if (this.stateValue !== null) {
      if (+event.id > 0) {
        this.stateId = +event.id
        this.GSTStateCode = event.stateCode
        this.stateValue = +event.id
        this.matchStateCodeWithGSTNumber()
        if (this.stateId > 0) {
          this.getCitylist(this.stateId, 0)
        }
      }
      else {
        this.stateId = 0
      }
    }

  }

  cityValue: any
  getCitylist(id, value) {
    this.subscribe = this._customerServices.getCityList(id).subscribe(Data => {
      this.cityList =  [{id:'-1',text:'+Add New'}]
      Data.Data.forEach(element => {
        this.cityList.push({
          id: element.Id,
          text: element.CommonDesc2
        })
      })
    })
  }
  cityId: any
  CityName: any


  getStaeList(id, value) {
    this.subscribe = this._customerServices.gatStateList(id).subscribe(Data => {
      this.stateListplaceHolder = { placeholder: 'Select State' }
      this.stateList = [{ id: '0', text: 'Select State' }]
      Data.Data.forEach(element => {
        this.stateList.push({
          id: element.Id,
          text: element.CommonDesc1,
          stateCode: element.ShortName1
        })
      })
    })
  }

  selectCountryListId(event) {
    if (this.countryValue !== null) {
      if (+event.id > 0) {
        this.countrId = +event.id
        this.countryError = false
        if (this.countrId > 0) {
          this.getStaeList(this.countrId, 0)
        }
      }
      else {
        this.countrId = 0
      }
    }

  }
  ngOnDestroy() {
    this.modalSub.unsubscribe()
  }
  CRDRType: any
  @ViewChild('bankname1') banknameFocus: ElementRef;
  openModal() {
    this.submitClick = true
    this.onloading()
    this.disabledGSTfor_UnRegi = false
    this.Ledgerid = 0
    this.addressId = 0
    this.satuariesId = 0

    $('#bankPopup').modal(UIConstant.MODEL_SHOW)
    setTimeout(() => {
      this.banknameFocus.nativeElement.focus()
    }, 200);
    this.select2CrDrValue(0)
    this.getCountry(0)
    this.select2VendorValue(0)
    if (!this.editData) {
      this.getOrgnizationAddress()
    }
    if (this.editData) {
      this.edibankDetails(this.Id)

    } else {
      this.onloading()

    }
  }
  getOrgnizationAddress() {
    let Address = JSON.parse(localStorage.getItem('ORGNIZATIONADDRESS'));
    if (Address !== null) {
      this.loadAddressDetails(Address)
    }
  }

  loadAddressDetails(Address) {
    this.countryValue = Address.CountryId
    let country = {
      id: Address.CountryId,
      text: Address.CountryName
    }
    this.selectCountryListId(country)
    let state = {
      id: Address.StateId,
      text: Address.Statename
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
  }
  // his.bankNameErr= true
  //   this.IFSCCodeErr=true
  //   this.bankNameErr = true
  //   this.accountErr=true
  //   this.BrancNameErr=true
  edibankDetails(id) {
    if (id > 0) {
      this.subscribe = this.commonService.getEditbankDetails(id).subscribe(data => {
        if (data.Code === UIConstant.THOUSAND) {
          if (data.Data.BankDetails.length > 0) {
            this.banName = data.Data.BankDetails[0].Name
            this.accountNo = data.Data.BankDetails[0].AcNo
            this.ifscCode = data.Data.BankDetails[0].IfscCode
            this.branch = data.Data.BankDetails[0].Branch
            this.micr = data.Data.BankDetails[0].MicrNo
            this.openingbalance = data.Data.BankDetails[0].OpeningBalance
            this.crDrSelect2.setElementValue(data.Data.BankDetails[0].Crdr)
            this.disabledGSTfor_UnRegi = data.Data.BankDetails[0].TaxTypeId === 4 ? true : false
            this.registerTypeSelect2.setElementValue(data.Data.BankDetails[0].TaxTypeId)
            this.coustmoreRegistraionId = JSON.stringify(data.Data.BankDetails[0].TaxTypeId)
            this.valueCRDR = data.Data.BankDetails[0].Crdr
            this.CrDrRateType = data.Data.BankDetails[0].Crdr
            this.requiredGST = data.Data.BankDetails[0].TaxTypeId === 1 ? true : false
            this.Ledgerid = data.Data.BankDetails[0].Ledgerid
            this.bankNameErr = false
            this.IFSCCodeErr = false
            this.bankNameErr = false
            this.accountErr = false
            this.BrancNameErr = false
          }
          else {
            this.registerTypeSelect2.setElementValue(1)
            this.requiredGST = true
          }
          if (data.Data.AddressDetails.length > 0) {
            this.addressId = data.Data.AddressDetails[0].Id
            this.address = data.Data.AddressDetails[0].AddressValue
            this.loadAddressDetails(data.Data.AddressDetails[0])

          }
          if (data.Data.Statutories.length > 0) {
            this.gstin = data.Data.Statutories[0].GstinNo
            this.satuariesId = data.Data.Statutories[0].Id
          }
        }
      })
    }
  }
  clearbank() {
    this.onloading()
    this.countryValue = null
    this.stateValue = null
    this.cityValue = null
    this.submitClick = false
    this.select2VendorValue(0)
  }
  @ViewChild('select_regiType') registerTypeSelect2: Select2Component
  @ViewChild('crdr_selecto2') crDrSelect2: Select2Component
  @ViewChild('country_selecto') countrySelect2: Select2Component
  @ViewChild('state_select2') stateSelect2: Select2Component
  @ViewChild('city_select2') citySelect2: Select2Component
  crDrId: any
  selectCRDRId(event) {
    this.CrDrRateType = event.value
  }
  closeModal() {
    $('#bankPopup').modal(UIConstant.MODEL_HIDE)
  }
  get f() { return this.bankForm.controls }
  banName: any
  accountNo: any
  branch: any
  ifscCode: any
  micr: any
  address: any
  gstin: any
  openingbalance: any
  onloading() {
    this.banName = ''
    this.accountNo = ''
    this.openingbalance = 0
    this.ifscCode = ''
    this.CrDrRateType = ''
    this.branch = ''
    this.micr = ''
    this.address = ''
    this.gstin = ''
    this.requiredGST = true
    this.bankNameErr = true
    this.IFSCCodeErr = true
    this.bankNameErr = true
    this.accountErr = true
    this.BrancNameErr = true
    this.countryValue= null
    this.stateValue= null
    this.cityValue= null
  }
  bankNameErr: any
  BrancNameErr: any
  IFSCCodeErr: any
  accountErr: any
  checkValidationName() {
    if (this.banName !== "") {
      this.bankNameErr = false
    } else {
      this.bankNameErr = true
    }
  }
  checkValidAccount() {
    if (this.accountNo !== "") {
      this.accountErr = false
    } else {
      this.accountErr = true
    }
  }
  checkValidBranch() {
    if (this.branch !== "") {
      this.BrancNameErr = false
    } else {
      this.BrancNameErr = true
    }
  }
  checkValidIFSC() {
    if (this.ifscCode !== "") {
      this.IFSCCodeErr = false
    } else {
      this.IFSCCodeErr = true
    }
  }

  valueCRDR: any
  select2CrDrValue(value) {
    this.selectCrDr = []
    this.selectCrDr = [{ id: '1', text: 'CR' }, { id: '0', text: 'DR' }]
    this.valueCRDR = value
  }

  addbank(type) {
    let _self = this
    this.submitClick = true
    this.checkGSTNumberValid()
    if (this.banName !== '' && this.ifscCode !== null && this.branch !== null && this.banName !== null && this.accountNo !== null && this.ifscCode !== '' && this.branch !== '' && this.banName !== '' && this.accountNo !== '') {
      if (this.matchStateCodeWithGSTNumber()) {
        this.subscribe = this._bankServices.saveBank(this.bankParams()).subscribe(data => {
          console.log(data)
          if (data.Code === UIConstant.THOUSAND) {
            let toSend = { name: _self.banName, id: data.Data }
            let saveNameFlag = this.editID === 0 ? UIConstant.SAVED_SUCCESSFULLY : UIConstant.UPDATE_SUCCESSFULLY
            _self.toastrService.showSuccess('', saveNameFlag)
            if (type === 'save') {
              this.closeModal()
              this.disabledStateCountry = false
              this.commonService.AddedItem()
              _self.commonService.closeLedger(false, toSend)
              this.clearbank()
            } else {
              this.getCountry(0)
              this.disabledStateCountry = false

              this.commonService.AddedItem()
              _self.commonService.closeLedger(true, toSend)
              this.clearbank()
            }
          }
          if (data.Code === UIConstant.THOUSANDONE) {
            _self.toastrService.showInfo('', data.Message)
          }
          if (data.Code === UIConstant.SERVERERROR) {
            _self.toastrService.showError('', data.Message)
          }
        })
      }
      // else{
      //   this.toastrService.showError('','Invalid GSTIN Number According to Selected State ')
      // }
    }
  }
  CrDrRateType: any
  Ledgerid: any
  addressId: any
  satuariesId: any
  private bankParams(): Banks {

    const bankElement = {
      bankObj: {
        // tslint:disable-next-line: no-multi-spaces
        Id: this.Id !== 0 ? this.Id : 0,
        LedgerId: this.Ledgerid !== 0 ? this.Ledgerid : 0,
        Name: this.banName,
        AcNo: this.accountNo,
        Branch: this.branch,
        MicrNo: this.micr === null ? 0 : this.micr,
        IfscCode: this.ifscCode,
        OpeningBalance: this.openingbalance === null ? 0 : this.openingbalance,
        Crdr: this.CrDrRateType,
        ParentTypeId: 3,
        TaxTypeID: this.coustmoreRegistraionId,
        Statutories: [{
          Id: this.satuariesId === 0 ? 0 : this.satuariesId,
          GstinNo: this.gstin,
          ParentTypeId: 5
        }],
        Addresses: [{
          Id: this.addressId === 0 ? 0 : this.addressId,
          ParentTypeId: 5,
          CountryId: this.countrId === undefined ? 0 : this.countrId,
          StateId: this.stateId === undefined ? 0 : this.stateId,
          CityId: this.cityId === undefined ? 0 : this.cityId,
          AddressValue: this.address,
        }],
      } as unknown as Banks
    }
    console.log(JSON.stringify(bankElement.bankObj), 'request-bank')
    return bankElement.bankObj
  }
  countryValue: any
  getCountry(value) {
    this.subscribe = this._customerServices.getCommonValues('101').subscribe(Data => {
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


  checkSelectCode: boolean = false

  validMobileFlag: boolean = false
  invalidMobilelength: boolean = false


  selectCoustomerplaceHolder: Select2Options
  coustomerValue: any
  coustmoreRegistraionId: any
  selectyCoustmoreRegistration: any
  select2VendorValue(value) {
    this.selectyCoustmoreRegistration = []
    this.selectCoustomerplaceHolder = { placeholder: 'Select Customer' }
    this.selectyCoustmoreRegistration = [{ id: UIConstant.BLANK, text: 'Select Customer' }, { id: '1', text: 'Regular' }
      , { id: '2', text: 'Composition' }, { id: '3', text: 'Exempted' }
      , { id: '4', text: 'UnRegistered' }, { id: '5', text: '	E-Commerce Operator ' }]
    this.coustmoreRegistraionId = this.selectyCoustmoreRegistration[1].id
    this.coustomerValue = this.coustmoreRegistraionId
  }
  validGSTNumber: boolean = false
  requiredGST: boolean
  GstinNoCode: any
  disabledStateCountry: boolean = false
  @ViewChild('country_selecto') countryselecto: Select2Component
  @ViewChild('state_select2') stateselecto: Select2Component

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
  getStateCode = async (stateCode) => {
    this.commonService.getStateByGStCode(stateCode).
      pipe(
        takeUntil(this.unSubscribe$)
      ).
      subscribe((response: any) => {
        if (response.Code === UIConstant.THOUSAND && response.Data.length > 0) {
          this.countrId = response.Data[0].CommonId
          this.stateId = response.Data[0].CommonCode
          this.countryValue = response.Data[0].CommonId
          this.getOneState(response)
          //this.stateselecto.setElementValue( response.Data[0].CommonCode)

        }
      })
  }
  checkGSTNumber(event) {
    this.gstin = event.target.value;
    let str = this.gstin
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

  GSTNumber: any
  showHideFlag: boolean
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
  checkGSTNumberValid() {
    if (this.gstin !== '' && this.gstin !== null) {
      this.GSTNumber = (this.gstin).toUpperCase()
      if (this.coustmoreRegistraionId === '1') {
        if (this.commonService.gstNumberRegxValidation(this.GSTNumber)) {
          this.validGSTNumber = false
          this.requiredGST = false

        } else {
          this.validGSTNumber = true
          this.requiredGST = true
        }
      }

    } else {
      this.validGSTNumber = false
    }

  }
  validError: boolean
  customerRegistraionError: any
  disabledGSTfor_UnRegi: boolean
  selectCoustmoreId(event) {
    debugger
    if (event.data.length > 0) {
      if (+event.value > 0) {
        this.coustmoreRegistraionId = event.value
        this.validError = false
        if (this.coustmoreRegistraionId === '1') {
          this.requiredGST = true
          this.disabledGSTfor_UnRegi = false
        }
        else if (event.value === '4') {
          this.disabledGSTfor_UnRegi = true
          this.gstin = ''
          this.requiredGST = false

        }
        else {
          this.requiredGST = false
          this.disabledGSTfor_UnRegi = false

        }
      }
      else {
        this.validError = true
      }

    }

  }
  @ViewChild('addNewCityRef') addNewCityRefModel: AddNewCityComponent
  selectedCityId(event) {
    if (this.cityValue !== null) {
      this.cityId = event.id
      if (this.cityId > 0) {
      //  this.getAreaId(this.cityId)
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
    if (this.countryValue > 0) {
      if (this.countryValue !==null && Number(this.countryValue) !== selectedIds.countryId) {
        this.countryValue = selectedIds.countryId
        // this.cityId =selectedIds.cityId
        // this.stateId = selectedIds.stateId
        this.stateValue = selectedIds.stateId
        this.cityValue = selectedIds.cityId;
      } else if (this.stateValue !==null && Number(this.stateValue) !== selectedIds.stateId) {
        this.stateValue = selectedIds.stateId
        this.cityValue = selectedIds.cityId;
        // this.cityId =selectedIds.cityId
        // this.stateId = selectedIds.stateId
      } else {
        this.cityValue = selectedIds.cityId;
        this.cityId =selectedIds.cityId
        this.getCitylist(selectedIds.stateId,0)
      }
    } else {
      this.cityValue =null
      this.cityId =0
    }
  }
}
