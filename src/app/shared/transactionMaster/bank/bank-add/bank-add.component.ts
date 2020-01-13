import { Component, Output, ElementRef, EventEmitter, ViewChild } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Subscription } from 'rxjs'
import { BankPopUpServices } from '../../../../commonServices/bank-popup-services'
import { CommonSetGraterServices } from '../../../../commonServices/setgatter.services'
import { UIConstant } from '../../../constants/ui-constant'
import { VendorServices } from '../../../../commonServices/TransactionMaster/vendoer-master.services'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {AddCust } from '../../../../model/sales-tracker.model'
import { ToastrCustomService } from '../../../../commonServices/toastr.service'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
import { Select2OptionData, Select2Component } from 'ng2-select2'
declare const $: any
import { AddNewCityComponent } from '../../../../shared/components/add-new-city/add-new-city.component';
import * as _ from 'lodash'
import { SetUpIds } from 'src/app/shared/constants/setupIds.constant'
import { Settings } from '../../../../shared/constants/settings.constant'

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
    private toastrService: ToastrCustomService,
    private _settings: Settings) {
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
  StateName:any
  GSTStateCode: any = 0
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
      this.StateName = event.text
      if (this.stateValue > 0) {
        this.getCitylist(this.stateValue, 0)
      }
    }
    if (event.id === 0) {
      this.stateValue = null
    }
  }


  cityValue: any
  getCitylist(id, value) {
    this.cityValue = null
    this.cityList =[]
    this.subscribe = this._customerServices.getCityList(id).subscribe(Data => {
    let dataNew= [{ id: '-1', text: '+Add New' }]
      if(Data.Code===1000){
        Data.Data.forEach(element => {
          dataNew.push({
            id: element.Id,
            text: element.CommonDesc2
          })
        })
      }
      this.cityList = dataNew
    
    })
  }
  cityId: any
  CityName: any
  getStaeList(id, value) {
    this.stateValue= null
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

 
  getListCountryLabelList(id){
    this.commonService.COUNTRY_LABEL_CHANGE(id).subscribe(resp=>{
      if(resp.Code===1000 && resp.Data.length>0){
        this.TinNoValue=resp.Data[0].TinNo
        this.PanNoValue=resp.Data[0].PanNo
        this.countrId =id
        this.GstinNoValue=resp.Data[0].GstinNo
        this.CinNoValue=resp.Data[0].CinNo
        this.FssiNoValue=resp.Data[0].FssiNo 
      }
    })
  }
  TinNoValue:any
  PanNoValue:any
  GstinNoValue:any
  CinNoValue:any
  FssiNoValue:any
  selectCountryListId(event) {
    if (this.countryValue !== null) {
      if (+event.id > 0) {
        this.countryValue =+ event.id
          this.getStaeList(this.countryValue, 0)
      }
      else {
        this.countryValue=0
      }
    }
  }
  ngOnDestroy() {
    this.modalSub.unsubscribe()
  }
  CRDRType: any
  @ViewChild('bankname1') banknameFocus: ElementRef;
  openModal() {
    this.getSetUpModules((JSON.parse(this._settings.moduleSettings).settings))
    this.submitClick = true
    this.onloading()
    this.addressReset()
    this.disabledGSTfor_UnRegi = false
    $('#bankPopup').modal(UIConstant.MODEL_SHOW)
    setTimeout(() => {
      this.banknameFocus.nativeElement.focus()
    }, 200);
    this.select2CrDrValue(1)
    this.getCountry(0)
    this.select2VendorValue()
    this.coustmoreRegistraionId=0
    this.getOrgnizationAddress()
    if (this.editData) {
      this.edibankDetails(this.Id)
    }
    this.mandatoryField()
    
  }
  getOrgnizationAddress() {
    let Address = JSON.parse(localStorage.getItem('ORGNIZATIONADDRESS'));
    if (Address !== null && this.addressByDefaultForLedger) {
      this.loadAddressDetails(Address)
    }
    
  }
  addressByDefaultForLedger:boolean = false
  getSetUpModules(settings) {
    settings.forEach(element => {
      if (element.id === SetUpIds.addressByDefaultForLedger) {
        this.addressByDefaultForLedger = element.val
      }

    })

  }
 
  loadAddressDetails(Address) {
    console.log(Address)
    this.countryValue = Address.CountryId
    this.stateValue = Address.StateId
    this.cityValue = Address.CityId
    if(this.countryValue===123){
      this.GSTStateCode = Address.StateCode
     }else{
      this.GSTStateCode='00' 
     }
    let country = {
      id: Address.CountryId,
      text: Address.CountryName
    }
    this.selectCountryListId(country)
    this.getListCountryLabelList(Address.CountryId)
    let state = {
      id: Address.StateId,
      text: Address.Statename,
      stateCode:this.GSTStateCode
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

  edibankDetails(id) {
    if (id > 0) {
      this.subscribe = this.commonService.getEditbankDetails(id).subscribe(data => {
        if (data.Code === UIConstant.THOUSAND) {
          if (data.Data.BankDetails.length > 0) {
            this.bankName = data.Data.BankDetails[0].Name
            this.AccountHolderName = data.Data.BankDetails[0].AccountHolderName
            this.accountNo = data.Data.BankDetails[0].AcNo
            this.ifscCode = data.Data.BankDetails[0].IfscCode
            this.branch = data.Data.BankDetails[0].Branch
            this.micr = data.Data.BankDetails[0].MicrNo
            this.openingbalance = data.Data.BankDetails[0].OpeningBalance
            this.crDrSelect2.setElementValue(data.Data.BankDetails[0].Crdr)
            this.disabledGSTfor_UnRegi = data.Data.BankDetails[0].TaxTypeId === 4 ? true : false
            this.coustomerValue =JSON.stringify(data.Data.BankDetails[0].TaxTypeId)
            this.coustmoreRegistraionId = JSON.stringify(data.Data.BankDetails[0].TaxTypeId)
            this.registerTypeSelect2.setElementValue(this.coustmoreRegistraionId)
            this.valueCRDR = data.Data.BankDetails[0].Crdr
            this.CrDrRateType = data.Data.BankDetails[0].Crdr
            this.Ledgerid = data.Data.BankDetails[0].Ledgerid
           
          }
          
          if (data.Data.AddressDetails.length > 0) {
            this.addressId = data.Data.AddressDetails[0].Id
            this.address = data.Data.AddressDetails[0].AddressValue
            this.loadAddressDetails(data.Data.AddressDetails[0])

          }
          if (data.Data.Statutories.length > 0) {
            this.gstin = data.Data.Statutories[0].GstinNo
            if (!_.isEmpty(this.gstin)) {
              this.GstinNoCode = this.returnsplitGSTcode()
            }
            this.satuariesId = data.Data.Statutories[0].Id
          }
          this.mandatoryField()

        }
      })
    }
  }
  clearbank() {
    this.onloading()
    this.coustomerValue =2
    this.submitClick = false
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
  bankName: any
  accountNo: any
  branch: any
  ifscCode: any
  micr: any
  address: any
  gstin: any
  openingbalance: any
  onloading() {
    this.Ledgerid = 0
    this.addressId = 0
    this.satuariesId = 0
    this.bankName = ''
    this.GstinNoCode=''
    this.AccountHolderName =''
    this.accountNo = ''
    this.openingbalance = 0
    this.ifscCode = ''
    this.CrDrRateType = 1
    this.branch = ''
    this.micr = ''
    this.address = ''
    this.gstin = ''
  }

  AccountHolderName:any

  invalidObj: any ={}
  
  
  @ViewChild('accountNoRef')  accountNoRef :ElementRef
  @ViewChild('accoundHolderNameRef')  accoundHolderNameRef :ElementRef
  @ViewChild('ifscCodeRef')  ifscCodeRef :ElementRef
  @ViewChild('branchRef')  branchRef :ElementRef
  @ViewChild('GStRequireRef')  GStRequireRef :ElementRef
  
  
  dynamicFocus() {
    let isValid = 1
    if ( !_.isEmpty(this.bankName) && this.bankName.trim()) {
      this.invalidObj['bankName'] = false
    } else  {
      this.invalidObj['bankName'] = true
      this.banknameFocus.nativeElement.focus()
      isValid = 0
    }
    if ( !_.isEmpty(this.AccountHolderName) && this.AccountHolderName !==' ' && this.AccountHolderName.trim()) {
      this.invalidObj['AccountHolderName'] = false
    } else if (!this.invalidObj.bankName ) {
      this.invalidObj['AccountHolderName'] = true
      this.accoundHolderNameRef.nativeElement.focus()
      isValid = 0
    }
    if ( !_.isEmpty(this.accountNo) && this.accountNo!=='' && this.accountNo.trim()) {
      this.invalidObj['accountNo'] = false
    } else if (!this.invalidObj.bankName && !this.invalidObj.AccountHolderName) {
      this.invalidObj['accountNo'] = true
      this.accountNoRef.nativeElement.focus()
      isValid = 0
    }
    if ( !_.isEmpty(this.branch) && this.branch !=='' && this.branch.trim()) {
      this.invalidObj['branch'] = false
    } else if (!this.invalidObj.bankName && !this.invalidObj.AccountHolderName && !this.invalidObj.accountNo) {
      this.invalidObj['branch'] = true
      this.branchRef.nativeElement.focus()
      isValid = 0
    }
     if (!this.chekGSTvalidation() && !this.invalidObj.bankName  && !this.invalidObj.AccountHolderName && !this.invalidObj.accountNo && !this.invalidObj.branch) {
      this.invalidObj['gst_required'] = true
      this.GStRequireRef.nativeElement.focus()
      isValid = 0
    } else {
      this.invalidObj['gst_required'] = false
    }
    return  isValid 
  }

  mandatoryField() {
    this.invalidObj['bankName'] = false
    this.invalidObj['AccountHolderName'] = false
    this.invalidObj['accountNo'] = false
    this.invalidObj['branch'] = false
    if ( _.isEmpty(this.bankName) && this.bankName === '') {
      this.invalidObj['bankName'] = true
    } else {
      this.invalidObj['bankName'] = false
    }
    if ( _.isEmpty(this.AccountHolderName) && this.AccountHolderName === '') {
      this.invalidObj['AccountHolderName'] = true
    } else {
      this.invalidObj['AccountHolderName'] = false
    }
    if ( _.isEmpty(this.accountNo) && this.accountNo === '') {
      this.invalidObj['accountNo'] = true
    } else {
      this.invalidObj['accountNo'] = false
    }
    if ( _.isEmpty(this.branch) && this.branch === '') {
      this.invalidObj['branch'] = true
    } else {
      this.invalidObj['branch'] = false
    }
   
  }
 

  valueCRDR: any
  select2CrDrValue(value) {
    this.selectCrDr = []
    this.selectCrDr = [{ id: '1', text: 'CR' }, { id: '0', text: 'DR' }]
    this.valueCRDR = value
    this.crDrSelect2.setElementValue(value)
    

  }

  returnsplitGSTcode() {
    if (!_.isEmpty(this.gstin) && this.gstin !== '') {
      let str = this.gstin
      let val = str.trim();
      this.GstinNoCode = val.substr(0, 2);
      if (this.GstinNoCode !== '') {
        return this.GstinNoCode
      }
    }
  }
  matchStateCodeWithGSTNumber() {
    if (!_.isEmpty(this.returnsplitGSTcode()) && this.GstinNoCode !== '') {
      if(this.countryValue===123){
        if (this.GSTStateCode === this.GstinNoCode) {
          return true
        }
        else {
          return false
        }
      }
      else{
        return true
      }
    } else {
      return true
    }
  }
  addbank(type) {
    let _self = this
    this.submitClick = true
    if (this.dynamicFocus()) {
      if (this.matchStateCodeWithGSTNumber()) {
        if(this.chekGSTvalidation()){
          this.subscribe = this._bankServices.saveBank(this.bankParams()).subscribe(data => {
            console.log(data)
            if (data.Code === UIConstant.THOUSAND) {
              let toSend = { name: _self.bankName, id: data.Data }
              let saveNameFlag = this.editID === 0 ? UIConstant.SAVED_SUCCESSFULLY : UIConstant.UPDATE_SUCCESSFULLY
              _self.toastrService.showSuccess('', saveNameFlag)
              if (type === 'save') {
                 this.closeModal()
                 this.commonService.AddedItem()
                _self.commonService.closeLedger(false, toSend)
              } else if(type === 'new') {
                this.mandatoryField()
                this.commonService.AddedItem()
                this.Id=0
                _self.commonService.closeLedger(true, toSend)
                this.onloading()
                if(!this.addressByDefaultForLedger){
                  this.addressReset()
                }
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
        else{
          this.GStRequireRef.nativeElement.focus()
        }
      }
      else{
        this.toastrService.showError('','Invalid GSTIN Number According to Selected State ')
      }
    }
  }

  addressReset(){
    this.countryValue= null
    this.stateValue=null
    this.cityValue=null
    this.address=''
  
  }
  CrDrRateType: any
  Ledgerid: any
  addressId: any
  satuariesId: any
  private bankParams() {

    const bankElement = {
      bankObj: {
        // tslint:disable-next-line: no-multi-spaces
        Id: this.Id !== 0 ? this.Id : 0,
        LedgerId: this.Ledgerid !== 0 ? this.Ledgerid : 0,
        Name: this.bankName,
        AcNo: this.accountNo,
        AccountHolderName:this.AccountHolderName,
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
          CountryId: this.countryValue === null ? 0 : this.countryValue,
          StateId: this.stateValue === null ? 0 : this.stateValue,
          CityId: this.cityValue === null ? 0 : this.cityValue,
          AddressValue: this.address,
        }],
      }
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
  select2VendorValue() {
    this.selectyCoustmoreRegistration = []
    this.selectCoustomerplaceHolder = { placeholder: 'Select Register Type' }
    this.selectyCoustmoreRegistration = [{ id: '0', text: 'Select Register Type' }, { id: '1', text: 'Regular' }
      , { id: '2', text: 'Composition' }, { id: '3', text: 'Exempted' }
      , { id: '4', text: 'UnRegistered' }, { id: '5', text: '	E-Commerce Operator ' }]

  }
  validGSTNumber: boolean = false
  requiredGST: boolean
  GstinNoCode: any
  @ViewChild('country_selecto') countryselecto: Select2Component
  @ViewChild('state_select2') stateselecto: Select2Component

  getOneState(rsp) {
    let newdata = []
    newdata.push({
      id: rsp.Data[0].Id,
      text: rsp.Data[0].CommonDesc1
    })
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


  GSTNumber: any
  showHideFlag: boolean
 

  chekGSTvalidation() {
    if (!_.isEmpty(this.gstin) && this.gstin !== '') {
      this.GSTNumber = (this.gstin).toUpperCase()
      if(this.countryValue===123 ){
        if (  this.commonService.regxGST.test(this.gstin)) {
          return true
        } else {
          return false
        }
      }
      else{
        return true

      }
      
    }
    else if((this.coustmoreRegistraionId === '1' || this.coustmoreRegistraionId === '2') &&  this.countryValue===123 ) {
      return false
    }
    else{
      return true

    }
  }
  
  validError: boolean
  customerRegistraionError: any
  disabledGSTfor_UnRegi: boolean
  
  splitGSTNumber(){
    let  parts = this.gstin.trim()
     this.GSTStateCode = parts.substring(0, 2);
    this.commonService.getStateByGStCode(this.GSTStateCode).subscribe(d=>{
      if(d.Code===1000 &&d.Data.length>0){
        console.log(d)
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


selectCoustmoreId(event) {
  if (event.data.length > 0) {
    if (+event.value > 0) {
      this.coustmoreRegistraionId = event.value
      if (event.value === '4') {
        this.disabledGSTfor_UnRegi = true
        this.gstin = ''
      }
      else {
        this.disabledGSTfor_UnRegi = false
      }
    }

  }

}
  @ViewChild('addNewCityRef') addNewCityRefModel: AddNewCityComponent

  selectedCityId(event) {
    this.cityValue= event.id
    if (this.cityValue !== null) {
      this.cityValue = event.id
      if (event.id> 0) {
        this.cityValue = event.id
      }
    }
    if (+event.id === -1) {
      const data = {
        countryList: !_.isEmpty(this.countryList) ? [...this.countryList] : [],
        countryId: !this.countryValue ? 0 : this.countryValue,
        stateId: !this.stateValue ? 0 : this.stateValue
      }
      //this.
      this.addNewCityRefModel.openModal(data);
    }
    else  if (event.id===0) { 
      this.stateValue = null
    }
  }
  addCityClosed(selectedIds?) {
    if (selectedIds !==undefined) {
      if (this.countryValue !==null && Number(this.countryValue) !== (selectedIds && selectedIds.countryId)) {
        this.countryValue = selectedIds.countryId
        this.stateValue = selectedIds.stateId
        this.cityValue = selectedIds.cityId;
      } else if (this.stateValue !==null && Number(this.stateValue) !== (selectedIds && selectedIds.stateId )) {
        this.stateValue = selectedIds.stateId
        this.cityValue = selectedIds.cityId;
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
