import { Component, ViewChild,OnDestroy, Renderer2, ElementRef } from '@angular/core'
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
import { Alert } from 'selenium-webdriver';
declare const $: any
declare const flatpickr: any
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { disableDebugTools } from '@angular/platform-browser';
@Component({
  selector: 'app-ledger-creation',
  templateUrl: './ledger-creation.component.html',
  styleUrls: ['./ledger-creation.component.css']
})
export class LedgerCreationAddComponent implements OnDestroy {
  modalSub: Subscription
  modelForLedgerGroup:Subscription
  subscribe: Subscription
  id: any
  customerValue: any
  Assets: any
  Liabilities: any
  Difference: any
  geteditOpeningbal: any
  ledgergroupPlaceHolder: Select2Options
  addressid: any
  emailErrMsg: any
  editMode: boolean = false
  areaForm: FormGroup
  private unSubscribe$ = new Subject<void>()
  public selectCrDr: Array<Select2OptionData>
  public countryList: Array<Select2OptionData>
  public stateList:any
  public cityList: Array<Select2OptionData>
  public selectyCoustmoreRegistration: Array<Select2OptionData>
  public stateListplaceHolder: Select2Options
  public countryListPlaceHolder: Select2Options

  satuariesId: number
  submitClick: boolean
  countryError: boolean
  ledgerForm: FormGroup
  stateId: any
  editID:any
  cityId: any
  clientDateFormat: any
  isAddNew: boolean = false
  renderer: any;
  noOfDecimal:any=1
  isChangeOtherFlagValue: any
  constructor ( renderer: Renderer2,public _globalService: GlobalService, public _settings: Settings, private _CommonService: CommonService,
    private _formBuilder: FormBuilder,
    private _coustomerServices: VendorServices, public _categoryservices: CategoryServices, public _toastrcustomservice: ToastrCustomService) {
    this.createCustomerForm()
    this.clientDateFormat = this._settings.dateFormat
    this.noOfDecimal =this._settings.noOfDecimal
    this.modalSub = this._CommonService.getledgerCretionStatus().subscribe(
      (data: AddCust) => {
        if (data.open) {
          this.isAddNew = data.isAddNew
          if (data.editId === '') {
            this.editMode = false
            this.id  = 0
            this.editID =0
            this.isChangeOtherFlagValue =data.isOtherCharge
          } else {
            this.id = data.editId
            this.editID =data.editId
            this.editMode = true
            this.isChangeOtherFlagValue = data.isOtherCharge
          }
          
          this.openModal()
        } else {
          this.closeModal()
        }
      }
    )

    this.modelForLedgerGroup = this._CommonService.getledgerGroupStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.ledgerGroupData)
          newData.push({ id: data.id, text: data.name })
          this.ledgerGroupData = newData
          this.LedgerGroupValue = data.id
          this.parentId = data.id
          this.headId = data.headId
          setTimeout(() => {
            this.underGroupSelect2.selector.nativeElement.focus()
          }, 1000)
          this.getLedgerGroupList()
        }
      }
     )
  }
  LedgerGroupValue: any
  get f () { return this.ledgerForm.controls }
  ngOnInit () {

  }
  onDestroy$ = new Subject()
  LgroupDetails:any
  getLedgerGroupList  ()  {
    
  //  this.ledgerGroupData =[]
    this.ledgergroupPlaceHolder = { placeholder: 'Select Group' }
    let newData = [{ id: '0', text: 'Select Group' ,headId:'0'},{id:'-1',text:UIConstant.ADD_NEW_OPTION ,headId:'0'}]

    this._CommonService.getLedgerGroupParentData('').pipe(takeUntil(this.onDestroy$)).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND) {
        this.LgroupDetails = data.Data
        console.log( this.LgroupDetails ,'HeadId')
        data.Data.forEach(element => {
          newData.push({
            id: element.Id,
            text: element.GlName,
            headId:element.HeadId
          })
        })
      }
      if(data.Code === UIConstant.SERVERERROR){
        this._toastrcustomservice.showError('Data Fetching Error','')
      }
      this.ledgerGroupData = newData
    }
    )
  }
  closeModal () {
    if ($('#ledger_creation_id').length > 0) {
      this.id = UIConstant.ZERO
      this.editMode = false
      $('#ledger_creation_id').modal(UIConstant.MODEL_HIDE)
    }
  }
 


  stateValue: any
  getStaeList (id, value) {
    this.subscribe = this._coustomerServices.gatStateList(id).subscribe(Data => {
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
  isSelectParentGrp: boolean
  checkValidation () {
    if (this.parentId > 0) {
      return  this.isSelectParentGrp = false
    } else {
      return this.isSelectParentGrp = true

    }
  }
  parentId: any
  headId: any
  onChnageGroup (event) {
   // alert(4)
  //  console.log(this.LedgerGroupValue,event ,'evyt')
    if (event.value && event.data.length > 0) {
      if(event.data[0].selected){
     if(event.value !== '-1'){
       this.disabledInputField = false
        this.parentId = +event.value
        this.headId = event.data[0].headId
        this.select2CrDrValue()
        this.checkValidation()
        this.openingStatus()
        this.ledgerForm.controls.openingblance.setValue(0)

      }
      else{ 
        this.underGroupSelect2.selector.nativeElement.value = ''
        this._CommonService.openledgerGroup('','')
      }
      }
    
    }
  }
  GSTStateCode:any

  matchGStno:boolean
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




  Areaname: any

  addressValue: any
  addTypeName: any
  ledgerGroupData : any
  cityCountrysatateReset () {
   this.countryselecto.setElementValue(0)
    this.cityselecto2.setElementValue(0)
    this.stateselecto2.setElementValue(0)
  }
  clearValidation () {
    this.ledgerForm.reset()
    this.showHideFlag = true
    this.submitClick =false
    this.disabledInputField = true
    this.underGroupSelect2.setElementValue(0)
    this.selectyCoustmoreRegistration =[]
    this.select2VendorValue(1)
    this.customeRegistTypeSelect2.setElementValue(1) 
  }
  private createCustomerForm () {
    this.ledgerForm = this._formBuilder.group({
      'ledgerName': [UIConstant.BLANK, Validators.required],
      'address': [UIConstant.BLANK],
      'ShortName': [UIConstant.BLANK],
      'gstin': [UIConstant.BLANK],
      'panNo': [UIConstant.BLANK],
      'openingblance': [0],
      'Assets': [UIConstant.BLANK],
      'Liabilities': [UIConstant.BLANK],
      'Difference' :[UIConstant.BLANK],
      'LedgerGroupValue':[UIConstant.BLANK]
    })
  }
  showHideFlag: boolean
  showGSTYesOrNot (type) {
    if(type === 'Yes'){
      this.showHideFlag = true
      this.requiredGST = true
    }
    else{
      this.showHideFlag =false
      this.requiredGST = false
      this.coustmoreRegistraionId = 0
    // this.customeRegistTypeSelect2.setElementValue(1)


    }

  }

  addressRequiredForLedger: boolean
  mobileRequirdForSetting: boolean
  emailRequirdForSetting: boolean
  customerCustomRateFlag: boolean
  disabledInputField:boolean = false

  currencyValues: any
  openModal () {
    this.getOrgnizationAddress()
    this.disabledGSTfor_UnRegi = false
    this.matchGStno =true
    this.GstinNoCode =''
    this.GSTStateCode  =0
    this.getLedgerGroupList()
    this.disabledInputField = true
    this.headId =0
    this.openingStatus()
    this.showHideFlag = true
   this.requiredGST = true
    this.submitClick = false
    this.isSelectParentGrp = true
    this.satuariesId = UIConstant.ZERO
     this.addressId = 0
    this.currencyValues = [{ id: 1, symbol: 'CR' }, { id: 0, symbol: 'DR' }]
    if (this.editMode) {
      this.editLedgerData(this.id)
    }
      this.select2VendorValue(1)
      this.select2CrDrValue()
      this.getCountry(0)
    $('#ledger_creation_id').modal(UIConstant.MODEL_SHOW)
    setTimeout(() => {
      this.underGroupSelect2.selector.nativeElement.focus()
    }, 1000)
    // this.customeRegistTypeSelect2.setElementValue(1)

  }
@ViewChild('ledgerName') ledgerName

  selectCRDRId (event) {
    
   if(event.data[0].selected){
      this.crDrId = +event.value
      this.checkGlagLib = false
      this.calculate()
   }
    
   

 
  }
  disabledGSTfor_UnRegi:boolean=false

  selectCoustmoreId (event) {
 debugger
    if(event.data.length > 0){
      if(+event.value>0){
        this.coustmoreRegistraionId = event.value
  if(this.coustmoreRegistraionId === '1'){
    this.requiredGST = true
    this.disabledGSTfor_UnRegi= false
  }
  else if(event.value==='4'){ 
    this.disabledGSTfor_UnRegi= true
   this.ledgerForm.controls.gstin.setValue('')
   this.requiredGST =false

  }
  else{
    this.requiredGST = false
    this.disabledGSTfor_UnRegi= false
  }
      }
   
    }
   
  }


  countrId: any
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
    }
   
  }

  countryValue: any
  getCountry (value) {
    this.subscribe = this._coustomerServices.getCommonValues('101').subscribe(Data => {
      this.countryListPlaceHolder = { placeholder: 'Select Country' }
      this.countryList = [{ id: '0', text: 'Select Country' }]
      if(Data.Code === UIConstant.THOUSAND){
      Data.Data.forEach(element => {
        this.countryList.push({
          id: element.Id,
          text: element.CommonDesc
        })
      })
    }
      this.countryValue = value
    })
  }


  checkSelectCode: boolean = false

  validMobileFlag: boolean = false
  invalidMobilelength: boolean = false


  selectCoustomerplaceHolder: Select2Options
  coustomerValue: any
  coustmoreRegistraionId: any
  select2VendorValue (value) {
    this.selectyCoustmoreRegistration = []
    this.selectCoustomerplaceHolder = { placeholder: 'Select Customer .' }
    this.selectyCoustmoreRegistration = [{ id: '1', text: 'Regular' }
      , { id: '2', text: 'Composition' }, { id: '3', text: 'Exempted' }
      , { id: '4', text: 'UnRegistered' }, { id: '5', text: '	E-Commerce Operator ' }]
      this.coustmoreRegistraionId = this.selectyCoustmoreRegistration[0].id
     this.coustomerValue = this.coustmoreRegistraionId 
  }

  select2CrDrPlaceHolder: Select2Options
  valueCRDR: any
  crDrId: number
  select2CrDrValue () {
    this.selectCrDr = []
    this.select2CrDrPlaceHolder = { placeholder: 'Select CR/Dr' }
    this.selectCrDr = [{ id: '1', text: 'CR' }, { id: '0', text: 'DR' }]
    if(this.headId===UIConstant.ONE){
      this.valueCRDR = this.selectCrDr[1].id
      this.crdrselecto2.setElementValue( this.valueCRDR)
      this.crDrId =+this.selectCrDr[1].id
    }
    else if(this.headId===UIConstant.TWO){
      this.valueCRDR = this.selectCrDr[0].id
      this.crdrselecto2.setElementValue( this.valueCRDR)
      this.crDrId =+this.selectCrDr[0].id

    }
    this.valueCRDR = this.selectCrDr[0].id
  }

  requiredValid: boolean
  /* ...................adding customer........................... */
  saveLedgerCreation (value) {
    this.submitClick = true
    debugger
    this.checkGSTNumberValid()
    this.checkPANNumberValid()
      if (  this.ledgerForm.valid && this.parentId > 0  && !this.requiredGST && !this.validPANFlag) {
        if(this.matchStateCodeWithGSTNumber()){
                  this.subscribe = this._coustomerServices.addVendore(this.LedgerParams()).subscribe(Data => {
                    if (Data.Code === UIConstant.THOUSAND) {
                      if(value ==='save'){
                        const dataToSend = { id: Data.Data, name: this.ledgerForm.value.ledgerName }
                        this._CommonService.closeledgerCretion({ ...dataToSend })
                        this._CommonService.AddedItem()
                        this.disabledStateCountry=false
                        $('#ledger_creation_id').modal(UIConstant.MODEL_HIDE)
                        let saveName =this.editID ===0 ? UIConstant.SAVED_SUCCESSFULLY : UIConstant.UPDATE_SUCCESSFULLY
                        this._toastrcustomservice.showSuccess('', saveName)
                        if(this.countrId>0 && this.stateId){
                          this.cityCountrysatateReset()
                        }
                    
                      }else if(value === 'new'){
                        this.getCountry(0)
                        this.disabledStateCountry=false
                        this._CommonService.AddedItem()
                        setTimeout(() => {
                          this.underGroupSelect2.selector.nativeElement.focus()
                        }, 1000)
                        if(this.countrId>0 && this.stateId){
                          this.cityCountrysatateReset()
                        }
                        this._toastrcustomservice.showSuccess('', UIConstant.SAVED_SUCCESSFULLY)
                      }
                      this.disabledGSTfor_UnRegi=false
                      this.clearValidation()
           

                        
                    }
                    if (Data.Code === UIConstant.THOUSANDONE) {
                      this._toastrcustomservice.showInfo('', Data.Description)
                    }
                    if(Data.Code === UIConstant.REQUIRED_5020){
                      this._toastrcustomservice.showError('', Data.Data)
                    }
                    if(Data.Code === UIConstant.SERVERERROR){
                      this._toastrcustomservice.showError('', Data.Data)
                    }
                  })
                }
                else{
                  this._toastrcustomservice.showError('','Invalid GSTIN Number According to Selected State ')
                }
      }
  }


  stateError:any
  cityError: any
  @ViewChild('under_group_select2') underGroupSelect2: Select2Component


  validPANFlag: boolean = false
  GSTNumber: any
  PANNumber: any
  GstinNoCode:any = ''
  disabledStateCountry:boolean= false
  checkGSTNumber (event) {
    this.ledgerForm.value.gstin = event.target.value;
    let str = this.ledgerForm.value.gstin
    let val =  str.trim();
    this.GstinNoCode = val.substr(0,2);
    if( this.GstinNoCode !==''){
      this.getStateCode(this.GstinNoCode)
    }
    else{
      this.disabledStateCountry =false
      
    }
    this.matchStateCodeWithGSTNumber()
    
   //getGStnumber =event.target.value
    this.checkGSTNumberValid()
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
  getStateCode = async (stateCode) =>{
    this._CommonService.getStateByGStCode(stateCode).
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
     //   this.stateselecto.setElementValue( response.Data[0].CommonCode)
        
      }
    })
  }
  checkPANNumberValid () {
    if(this.ledgerForm.value.panNo !=='' && this.ledgerForm.value.panNo !==null){
    this.PANNumber = (this.ledgerForm.value.panNo).toUpperCase()
      if (this._CommonService.panNumberRegxValidation(this.PANNumber)) {
        this.validPANFlag = false
        
      } else {
        this.validPANFlag = true
      }
    } else {
      this.validPANFlag = false
    }
}
  validGSTNumber: boolean = false
  requiredGST:boolean 
  checkGSTNumberValid () {
  
    if(this.ledgerForm.value.gstin  !=='' && this.ledgerForm.value.gstin !==null){
      this.GSTNumber = (this.ledgerForm.value.gstin).toUpperCase()
      if(this.showHideFlag && this.coustmoreRegistraionId === '1'){
        if (this._CommonService.gstNumberRegxValidation(this.GSTNumber)) {
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
addressId: any
  private LedgerParams (): AddLedger {
    let obj = {
      Ledger: {
        Id: this.id === 0 ? 0 : this.id,
        GlId: this.parentId,
        Name: this.ledgerForm.value.ledgerName,
        TaxTypeID: this.coustmoreRegistraionId,
        CrDr: this.crDrId,
        ShortName:  this.ledgerForm.value.ShortName,
        OpeningAmount: this.getopeinAmountValue(),
        IsChargeLedger:this.isChangeOtherFlagValue,
        Statutories: [{
          Id: this.satuariesId === 0 ? 0 : this.satuariesId,
          PanNo: this.PANNumber,
          GstinNo: this.ledgerForm.value.gstin,
          ParentTypeId: 5
        }],
        Addresses: [{
          Id: this.addressId === 0 ? 0 : this.addressId,
          ParentTypeId: 5,
          CountryId: this.countrId === undefined ? 0 :this.countrId ,
          StateId: this.stateId === undefined ? 0 :this.stateId ,
          CityId: this.cityId === undefined ? 0 :this.cityId ,
          AddressValue:this.ledgerForm.value.address,
        }],
      } as AddLedger
    }
console.log('Ledger-Request',JSON.stringify(obj.Ledger))
    return obj.Ledger
  }


  private getopeinAmountValue () {
    if (this.ledgerForm.value.openingblance > 0) {
      return this.ledgerForm.value.openingblance
    } else {
      return 0
    }
  }

  ngOnDestroy () {
    this.modalSub.unsubscribe()
    this.modelForLedgerGroup.unsubscribe()
  }
  setupCodeForAddresRequired: any
  @ViewChild('select_regiType') customeRegistTypeSelect2: Select2Component
  @ViewChild('crdr_selecto2') crdrselecto2: Select2Component
  @ViewChild('state_select2') stateselecto2: Select2Component
  @ViewChild('city_select2') cityselecto2: Select2Component
  @ViewChild('country_selecto') countryselecto: Select2Component
  state_select2

  editLedgerData (id) {
    setTimeout(() => {
      this.underGroupSelect2.selector.nativeElement.focus()
    }, 1000)
    this.submitClick = false 
    this.isSelectParentGrp = false
    this.subscribe = this._coustomerServices.editvendor(id).subscribe(Data => {
     console.log('Ledger-Response',JSON.stringify(Data))
     if(Data.Code=== UIConstant.THOUSAND){
      if (Data.Data && Data.Data.Statutories && Data.Data.Statutories.length > 0) {
        this.satuariesId = Data.Data.Statutories[0].Id
        this.ledgerForm.controls.gstin.setValue(Data.Data.Statutories[0].GstinNo)
        this.ledgerForm.controls.panNo.setValue(Data.Data.Statutories[0].PanNo)
       
      }
      if (Data.Data && Data.Data.LedgerDetails && Data.Data.LedgerDetails.length > 0) {
        this.disabledInputField = false
        this.headId = Data.Data.LedgerDetails[0].HeadId
        this.geteditOpeningbal =Data.Data.LedgerDetails[0].OpeningBalance
        this.ledgerForm.controls.openingblance.setValue(Data.Data.LedgerDetails[0].OpeningBalance)
        this.ledgerForm.controls.ShortName.setValue(Data.Data.LedgerDetails[0].ShortName)
        this.ledgerForm.controls.ledgerName.setValue(Data.Data.LedgerDetails[0].Name)
        this.crDrId = Data.Data.LedgerDetails[0].Crdr
        this.parentId =Data.Data.LedgerDetails[0].GlId
        this.underGroupSelect2.setElementValue(Data.Data.LedgerDetails[0].GlId)
    
        this.disabledGSTfor_UnRegi =Data.Data.LedgerDetails[0].TaxTypeId === 4 ? true :false

        this.customeRegistTypeSelect2.setElementValue(Data.Data.LedgerDetails[0].TaxTypeId)
        this.coustmoreRegistraionId = JSON.stringify( Data.Data.LedgerDetails[0].TaxTypeId)
       if(this.coustmoreRegistraionId === '0') {
        this.showHideFlag = false
        this.requiredGST = false
       } else{
        this.requiredGST = this.coustmoreRegistraionId === '1' ? true : false
       } 
        this.crdrselecto2.setElementValue(Data.Data.LedgerDetails[0].Crdr)
        this.crdrselecto2.setElementValue(Data.Data.LedgerDetails[0].Crdr)
      }
      if (Data.Data && Data.Data.Addresses && Data.Data.Addresses.length > 0) {
        this.addressId =Data.Data.Addresses[0].Id
     this.ledgerForm.controls.address.setValue(Data.Data.Addresses[0].AddressValue)
        this.getCountry(Data.Data.Addresses[0].CountryId)
        setTimeout(() => {
          this.countrySelect2.setElementValue(Data.Data.Addresses[0].CountryId)
          this.getStaeList(Data.Data.Addresses[0].CountryId,Data.Data.Addresses[0].StateId)
        }, 500);
        
     // setTimeout(() => {
       this.stateValue = Data.Data.Addresses[0].StateId
        this.stateSelect2.setElementValue(Data.Data.Addresses[0].StateId)
      this.getCitylist(Data.Data.Addresses[0].StateId,Data.Data.Addresses[0].CityId)

    //  }, 1000);
    // setTimeout(() => {
      this.cityValue = Data.Data.Addresses[0].CityId
      this.citySelect2.setElementValue(Data.Data.Addresses[0].CityId)
    
   //  }, 1500);
      }
     }
    })
  }
  
  @ViewChild('country_selecto') countrySelect2: Select2Component
  @ViewChild('state_select2') stateSelect2: Select2Component
  @ViewChild('city_select2') citySelect2: Select2Component
  initilzedAssets: any
  initilzedLiabilities: any
  initilzedDifference: any
  openingStatus() {
    this.subscribe =this._CommonService.openingStatusForLedger().subscribe(data=>{
      if(data.Code === UIConstant.THOUSAND){
       if(data.Data.length > 0){ 
         this.initilzedAssets = data.Data[0].Dr
         this.initilzedLiabilities = data.Data[0].Cr
         this.initilzedDifference = data.Data[0].Differece
         this.ledgerForm.controls.Assets.setValue( (data.Data[0].Dr).toFixed(this.noOfDecimal) )
         this.ledgerForm.controls.Liabilities.setValue((data.Data[0].Cr ).toFixed(this.noOfDecimal))
         this.ledgerForm.controls.Difference.setValue((data.Data[0].Differece).toFixed(this.noOfDecimal) )
       }
      }
    })
 }
 checkGlagLib: any


 calculate (){
   
if(this.headId > 0){
  let dataDr = 0
  let newdataCr = 0
  let tempOpeingbal;
  if(this.ledgerForm.value.openingblance ==='' || this.ledgerForm.value.openingblance ===null){
    this.ledgerForm.value.openingblance = 0
  }
  if(this.editMode){
    if(this.geteditOpeningbal !==undefined || this.geteditOpeningbal >0 ){
      let editdata =  JSON.parse(this.geteditOpeningbal);
      let data = JSON.parse(this.ledgerForm.value.openingblance)
      tempOpeingbal =  data - editdata
    }
  }
  else{
     tempOpeingbal =  JSON.parse(this.ledgerForm.value.openingblance)
  }
  if(this.headId ===UIConstant.ONE){
    let getTotalSum =0
     getTotalSum = this.initilzedAssets + tempOpeingbal
    let lastLib =0
    if(this.crDrId > 0){ // 1 CR
        newdataCr = this.initilzedAssets - tempOpeingbal
        this.ledgerForm.controls.Assets.setValue(newdataCr)
    }
    else{ //0 DR
       dataDr = this.initilzedAssets + tempOpeingbal
       this.ledgerForm.controls.Assets.setValue(dataDr)
    }
  }
  else if(this.headId ===UIConstant.TWO){
    let getTotalSum =0
     getTotalSum = this.initilzedLiabilities + tempOpeingbal
    if(this.crDrId > 0){
       newdataCr = this.initilzedLiabilities + tempOpeingbal
      this.ledgerForm.controls.Liabilities.setValue(newdataCr)
    }
    else{
        dataDr = this.initilzedLiabilities - tempOpeingbal
        this.ledgerForm.controls.Liabilities.setValue(dataDr)
    }
  }
    let diffcr_dr = this.ledgerForm.value.Assets - this.ledgerForm.value.Liabilities 
    
    // let diffcr_dr = this.ledgerForm.value.Liabilities - this.ledgerForm.value.Assets
     this.ledgerForm.controls.Difference.setValue(diffcr_dr)
}
else{
  this._toastrcustomservice.showError('','Please Select Ledger Group')
}

}
   countryValue1:any =null
  stateValuedata1:any =null
  countryCodeFlag:any =null
  cityValue1:any = null
  getOrgnizationAddress (){
    debugger
    let Address= JSON.parse(localStorage.getItem('ORGNIZATIONADDRESS'));
    this.countryValue = Address.CountryId
    this.stateValue = Address.StateId
    this.cityValue = Address.CityId
    let country = {
      value:Address.CountryId,
      data :[{id:Address.CountryId,text:Address.CountryName}]
      
    }
    this.selectCountryListId(country)
    

    let state = {
      value:Address.StateId,
      data :[{stateCode:Address.StateId,text:Address.StateName}]
     
    }
   this.selectStatelist(state)


    let city = {
      value:Address.CityId,
      data :[{id:Address.CityId,text:Address.CityName}]

    }
    this.selectedCityId(city) 
setTimeout(() => {
  this.countryselecto.setElementValue( Address.CountryId)
  this.stateselecto2.setElementValue(Address.StateId)
  this.cityselecto2.setElementValue(Address.CityId)
}, 102);
   

   }



}
