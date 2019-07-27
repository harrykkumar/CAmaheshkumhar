import { Component, Output, ElementRef , EventEmitter ,ViewChild } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Subscription } from 'rxjs'
import { BankPopUpServices } from '../../../../commonServices/bank-popup-services'
import { SaniiroCommonService } from '../../../../commonServices/SaniiroCommonService'
import { CommonSetGraterServices } from '../../../../commonServices/setgatter.services'
import { UIConstant } from '../../../constants/ui-constant'
import { VendorServices } from '../../../../commonServices/TransactionMaster/vendoer-master.services'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Banks ,AddCust } from '../../../../model/sales-tracker.model'
import { ToastrCustomService } from '../../../../commonServices/toastr.service'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
import { Select2OptionData, Select2Component } from 'ng2-select2'
declare const $: any
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
  private unSubscribe$ = new Subject<void>()
  public selectCrDr: Array<Select2OptionData>
  public countryList: Array<Select2OptionData>
  public stateList: any
  public cityList: Array<Select2OptionData>
  public stateListplaceHolder: Select2Options
  public countryListPlaceHolder: Select2Options
  editID : any
  constructor (private _formBuilder: FormBuilder,
      private _bankServices: BankPopUpServices,
      private _customerServices: VendorServices,
      private _commonGaterSeterServices: CommonSetGraterServices,
      private commonService: CommonService,
      private toastrService: ToastrCustomService) {
    this.formBank()
    this.modalSub = this.commonService.getLedgerStatus().subscribe(
      (data: AddCust) => {
        if (data.open) {
          
          if (data.editId === '') {
            this.editData = false
            this.Id = 0
            this.editID =0
            
          } else {
            this.editData = true
            this.Id = data.editId
            this.editID =data.editId

          }
            
          this.submitClick = false
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
  GSTStateCode:any=0
  selectStatelist (event) {
    if(event.data.length > 0){
      if(+event.value > 0){
        this.stateId = +event.value
        this.GSTStateCode = event.data[0].stateCode
        this.matchStateCodeWithGSTNumber()
        this.countryError = false
        if (this.stateId > 0) {
          this.getCitylist(this.stateId, 0)
        }
      }
      else{
        this.stateId =0
      }
    }
 
}
cityValue: any
getCitylist (id, value) {
  this.subscribe = this._customerServices.getCityList(id).subscribe(Data => {
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
  if(event.data.length > 0){
    if(+event.value > 0){
      this.cityId = +event.value
    }
    else{
      this.cityId =0
    }
  }

}
  getStaeList (id, value) {
    this.subscribe = this._customerServices.gatStateList(id).subscribe(Data => {
      this.stateListplaceHolder = { placeholder: 'Select State' }
      this.stateList = [{ id: '0', text: 'Select State' }]
      Data.Data.forEach(element => {
        this.stateList.push({
          id: element.Id,
          text: element.CommonDesc1,
          stateCode:element.ShortName1
        })
      })
      this.stateValue = value
    })
  }
  selectCountryListId (event) {
    if(event.data.length > 0){
      if(+event.value > 0){
        this.countrId = +event.value
      
        this.countryError = false
        if (this.countrId > 0) {
          this.getStaeList(this.countrId, 0)
    
        }
      }
      else{
        this.countrId =0
      }
   console.log( this.countrId ,'cty')
    }
   
  }
  ngOnDestroy () {
    this.modalSub.unsubscribe()
  }
  CRDRType: any
  @ViewChild('bankname1') banknameFocus : ElementRef;
  openModal () {
    this.disabledGSTfor_UnRegi = false
    this.Ledgerid = 0
    this.addressId = 0
    this.satuariesId = 0
    this.requiredGST = true
    $('#bankPopup').modal(UIConstant.MODEL_SHOW)
    setTimeout(() => {
      this.banknameFocus.nativeElement.focus()
     }, 200);
    this.select2CrDrValue(0)
    this.getCountry(0)
    this.select2VendorValue(0)
  
    if (this.editData) {
      this.edibankDetails(this.Id)

    } else {
      this.bankForm.reset()
     
    }


  }

  edibankDetails (id) {
    if (id) {
      this.subscribe = this.commonService.getEditbankDetails(id).subscribe(data => {
        if (data.Code === UIConstant.THOUSAND) { 
    console.log(JSON.stringify(data),'Response-bank')

          if(data.Data.BankDetails.length >0){
            this.bankForm.controls.banName.setValue(data.Data.BankDetails[0].Name)
            this.bankForm.controls.accountNo.setValue(data.Data.BankDetails[0].AcNo)
            this.bankForm.controls.ifscCode.setValue(data.Data.BankDetails[0].IfscCode)
            this.bankForm.controls.branch.setValue(data.Data.BankDetails[0].Branch)
            this.bankForm.controls.micr.setValue(data.Data.BankDetails[0].MicrNo)
            this.bankForm.controls.openingbalance.setValue(data.Data.BankDetails[0].OpeningBalance)
            this.crDrSelect2.setElementValue(data.Data.BankDetails[0].Crdr)
            this.disabledGSTfor_UnRegi =data.Data.BankDetails[0].TaxTypeId === 4 ? true :false
            this.registerTypeSelect2.setElementValue(data.Data.BankDetails[0].TaxTypeId)
            this.coustmoreRegistraionId =JSON.stringify(data.Data.BankDetails[0].TaxTypeId)
            this.valueCRDR = data.Data.BankDetails[0].Crdr
            this.requiredGST = data.Data.BankDetails[0].TaxTypeId === 1 ? true : false
            this.Ledgerid = data.Data.BankDetails[0].Ledgerid
          }
          else{
            this.registerTypeSelect2.setElementValue(1)
            this.requiredGST = true
            //this.coustmoreRegistraionId ='1'
          }
          if(data.Data.AddressDetails.length >0){
            this.addressId =data.Data.AddressDetails[0].Id
            this.bankForm.controls.address.setValue(data.Data.AddressDetails[0].AddressValue)
            this.getCountry(data.Data.AddressDetails[0].CountryId)
            setTimeout(() => {
              this.countryValue = data.Data.AddressDetails[0].CountryId
              this.countrySelect2.setElementValue(data.Data.AddressDetails[0].CountryId)
              
            }, 100);
          setTimeout(() => {
            this.getStaeList(data.Data.AddressDetails[0].CountryId,data.Data.AddressDetails[0].StateId)
            this.stateValue = data.Data.AddressDetails[0].StateId
            this.stateSelect2.setElementValue(data.Data.AddressDetails[0].StateId)
          
          
          }, 1000);
         setTimeout(() => {
          this.getCitylist(data.Data.AddressDetails[0].StateId,data.Data.AddressDetails[0].CityId)
          this.cityValue = data.Data.AddressDetails[0].CityId
          this.citySelect2.setElementValue(data.Data.AddressDetails[0].CityId)
         }, 1500);
         
            
          }
          if(data.Data.Statutories.length >0){
            this.bankForm.controls.gstin.setValue(data.Data.Statutories[0].GstinNo)
            this.satuariesId =data.Data.Statutories[0].Id
          }
          
         
        }
      })
    }
  }
  clearbank () {
    this.bankForm.reset()
    this.countryList =[]
    this.stateList =[]
    this.cityList=[]
    //this.selectyCoustmoreRegistration = []
  this.select2VendorValue(0)
  }
  @ViewChild('select_regiType') registerTypeSelect2: Select2Component
  @ViewChild('crdr_selecto2') crDrSelect2: Select2Component
  @ViewChild('country_selecto') countrySelect2: Select2Component
  @ViewChild('state_select2') stateSelect2: Select2Component
  @ViewChild('city_select2') citySelect2: Select2Component
  crDrId: any
  selectCRDRId (event) {
    this.CrDrRateType = event.value
  }
  closeModal () {
    $('#bankPopup').modal(UIConstant.MODEL_HIDE)
  }
  get f () { return this.bankForm.controls }
  private formBank () {
    this.bankForm = this._formBuilder.group({
      'banName': [UIConstant.BLANK, Validators.required],
      'accountNo': [UIConstant.BLANK, Validators.required],
      'ifscCode': [UIConstant.BLANK, Validators.required],
      'branch': [UIConstant.BLANK, Validators.required],
      'micr': [UIConstant.BLANK],
      'openingbalance' : [UIConstant.ZERO],
      'CrDrRateType' : [UIConstant.BLANK],
      'gstin': [UIConstant.BLANK],
      'address': [UIConstant.BLANK]
    })
  }

  valueCRDR: any
  select2CrDrValue (value) {
    this.selectCrDr = []
    this.selectCrDr = [{ id: '1', text: 'CR' }, { id: '0', text: 'DR' }]
    this.valueCRDR = value
  }
  addbank (type) {
    let _self = this
    this.submitClick = true
    this.checkGSTNumberValid()
    if (this.bankForm.valid  && !this.requiredGST && this.bankForm.value.ifscCode !== null && this.bankForm.value.branch !== null && this.bankForm.value.banName !== null && this.bankForm.value.accountNo !== null && this.bankForm.value.ifscCode !== '' && this.bankForm.value.branch !== '' && this.bankForm.value.banName !== '' && this.bankForm.value.accountNo !== '') {
         if(this.matchStateCodeWithGSTNumber()){
      this.subscribe = this._bankServices.saveBank(this.bankParams()).subscribe(data => {
        console.log(data)
        if (data.Code === UIConstant.THOUSAND) {
          let toSend = { name: _self.bankForm.value.banName, id: data.Data }
          let saveNameFlag = this.editID === 0 ? UIConstant.SAVED_SUCCESSFULLY : UIConstant.UPDATE_SUCCESSFULLY
          _self.toastrService.showSuccess('', saveNameFlag)
          if (type === 'save') {
            this.disabledStateCountry=false
            this.commonService.AddedItem()
            _self.commonService.closeLedger(false,toSend)
            this.clearbank()
          } else {
            this.getCountry(0)
            this.disabledStateCountry=false

            this.commonService.AddedItem()
            _self.commonService.closeLedger(true,toSend)
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
    else{
      this.toastrService.showError('','Invalid GSTIN Number According to Selected State ')
    }
    }
  }
  CrDrRateType: any
  Ledgerid: any
  addressId: any
  satuariesId: any
  private bankParams (): Banks {
    
    const bankElement = {
      bankObj: {
        // tslint:disable-next-line: no-multi-spaces
        Id: this.Id !== 0 ? this.Id : 0,
        LedgerId: this.Ledgerid !== 0 ? this.Ledgerid : 0,
        Name: this.bankForm.value.banName,
        AcNo: this.bankForm.value.accountNo,
        Branch: this.bankForm.value.branch,
        MicrNo: this.bankForm.value.micr === null ? 0 : this.bankForm.value.micr,
        IfscCode: this.bankForm.value.ifscCode,
        OpeningBalance: this.bankForm.value.openingbalance === null ? 0 : this.bankForm.value.openingbalance,
        Crdr: this.CrDrRateType,
        ParentTypeId: 3,
        TaxTypeID: this.coustmoreRegistraionId,
         Statutories: [{
          Id: this.satuariesId === 0 ? 0 : this.satuariesId,
          GstinNo: this.bankForm.value.gstin,
          ParentTypeId: 5
        }],
        Addresses: [{
          Id: this.addressId === 0 ? 0 : this.addressId,
          ParentTypeId: 5,
          CountryId: this.countrId === undefined ? 0 :this.countrId ,
          StateId: this.stateId === undefined ? 0 :this.stateId ,
          CityId: this.cityId === undefined ? 0 :this.cityId ,
          AddressValue:this.bankForm.value.address,
        }],
      } as unknown as Banks
    }
    console.log(JSON.stringify(bankElement.bankObj),'request-bank')
    return bankElement.bankObj
  }
  countryValue: any
  getCountry (value) {
    this.subscribe = this._customerServices.getCommonValues('101').subscribe(Data => {
      this.countryListPlaceHolder = { placeholder: 'Select Country' }
      this.countryList = [{ id: '0', text: 'Select Country' }]
      Data.Data.forEach(element => {
        this.countryList.push({
          id: element.Id,
          text: element.CommonDesc
        })
      })
      this.countryValue = value
    })
  }


  checkSelectCode: boolean = false

  validMobileFlag: boolean = false
  invalidMobilelength: boolean = false


  selectCoustomerplaceHolder: Select2Options
  coustomerValue: any
  coustmoreRegistraionId: any
  selectyCoustmoreRegistration: any
  select2VendorValue (value) {
    this.selectyCoustmoreRegistration = []
    this.selectCoustomerplaceHolder = { placeholder: 'Select Customer' }
    this.selectyCoustmoreRegistration = [{ id: UIConstant.BLANK, text: 'Select Customer' }, { id: '1', text: 'Regular' }
      , { id: '2', text: 'Composition' }, { id: '3', text: 'Exempted' }
      , { id: '4', text: 'UnRegistered' }, { id: '5', text: '	E-Commerce Operator ' }]
      this.coustmoreRegistraionId = this.selectyCoustmoreRegistration[1].id
     this.coustomerValue = this.coustmoreRegistraionId
  }
  validGSTNumber: boolean = false
  requiredGST:boolean
   GstinNoCode:any
   disabledStateCountry:boolean = false
  @ViewChild('country_selecto') countryselecto: Select2Component
  @ViewChild('state_select2') stateselecto: Select2Component

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
   getStateCode = async (stateCode) =>{
    this.commonService.getStateByGStCode(stateCode).
    pipe(
      takeUntil(this.unSubscribe$)
    ).
    subscribe((response: any) => {
      //ShortName1 = statecode
  
      if(response.Code=== UIConstant.THOUSAND && response.Data.length >0){
        this.countrId =response.Data[0].CommonId
        this.stateId = response.Data[0].CommonCode
        this.countryselecto.setElementValue(response.Data[0].CommonId)
        this.getOneState(response)
        //this.stateselecto.setElementValue( response.Data[0].CommonCode)
        
      }
    })
  }
  checkGSTNumber (event) {
    this.bankForm.value.gstin = event.target.value;
    let str = this.bankForm.value.gstin
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

  GSTNumber: any
  showHideFlag: boolean
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
    if(this.bankForm.value.gstin  !=='' && this.bankForm.value.gstin !==null){
      this.GSTNumber = (this.bankForm.value.gstin).toUpperCase()
      if(this.coustmoreRegistraionId === '1'){
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
disabledGSTfor_UnRegi:boolean
selectCoustmoreId (event) {
  debugger
  if(event.data.length > 0){
        if(+event.value>0){
          this.coustmoreRegistraionId = event.value
        this.validError = false
    if(this.coustmoreRegistraionId === '1'){
      this.requiredGST = true
      this.disabledGSTfor_UnRegi= false
    }
    else if(event.value==='4'){ 
      this.disabledGSTfor_UnRegi= true
     this.bankForm.controls.gstin.setValue('')
     this.requiredGST =false
  
    }
    else{
      this.requiredGST = false
      this.disabledGSTfor_UnRegi= false

    }
        }
        else{
          this.validError = true
        }
    
      }
    
    }
    }
