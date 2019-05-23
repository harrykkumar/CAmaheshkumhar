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
@Component({
  selector: 'app-ledger-creation',
  templateUrl: './ledger-creation.component.html',
  styleUrls: ['./ledger-creation.component.css']
})
export class LedgerCreationAddComponent implements OnDestroy {
  modalSub: Subscription
  modelForLedgerGroup:Subscription
  adressArray: any
  emailAdressArray: any
  coustomerDetails: Ledger[]
  subscribe: Subscription
  id: any
  
  ledgergroupPlaceHolder: Select2Options
  adressForm: FormGroup
  mobileArray: any
  addressid: any
  emailErrMsg: any
  editMode: boolean = false
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

  public ledgerGroupData: Array<Select2OptionData>
  addressTabDiv: boolean
  customerTabDiv: boolean
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
  ledgerForm: FormGroup
  stateId: any
  cityId: any
  addresTypeId: any
  contactId: number = 0
  areaID: any
  storeAddress: any
  addressError: boolean
  clientDateFormat: any
  isAddNew: boolean = false
  renderer: any;
  catSelect2: any;
  isChangeOtherFlagValue: any
  constructor ( renderer: Renderer2,public _globalService: GlobalService, public _settings: Settings, private _CommonService: CommonService,
    private _formBuilder: FormBuilder,
    private _coustomerServices: VendorServices, public _categoryservices: CategoryServices, public _toastrcustomservice: ToastrCustomService) {
    this.createCustomerForm()
    this.clientDateFormat = this._settings.dateFormat
    this.modalSub = this._CommonService.getledgerCretionStatus().subscribe(
      (data: AddCust) => {
        if (data.open) {
          this.isAddNew = data.isAddNew
          if (data.editId === '') {
            this.editMode = false
            this.id  = 0
            this.isChangeOtherFlagValue =data.isOtherCharge
          } else {
            this.id = data.editId
            this.editMode = true
            this.isChangeOtherFlagValue = data.isOtherCharge
          }
          this.getLedgerGroupList()
          this.openModal()
        } else {
          this.closeModal()
        }
      }
    )

    this.modelForLedgerGroup = this._CommonService.getledgerGroupStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          // console.log('unit added : ', data)
          let newData = Object.assign([], this.ledgerGroupData)
          newData.push({ id: data.id, text: data.name })
          this.ledgerGroupData = newData
          this.LedgerGroupValue = data.id
        }
      }
     )
  }
  LedgerGroupValue: any
  get f () { return this.ledgerForm.controls }
  ngOnInit () {
    this.adressArray = []
    this.emailAdressArray = []
    this.collectionOfAddress = []

  }
  LgroupDetails:any
  getLedgerGroupList () {
    this.ledgergroupPlaceHolder = { placeholder: 'Select Group' }
    let newData = [{ id: '0', text: 'Select Group' },{id:'-1',text:UIConstant.ADD_NEW_OPTION}]
    this._CommonService.getLedgerGroupParentData('').subscribe(data => {
      if (data.Code === UIConstant.THOUSAND && data.Data.length > 0) {
        this.LgroupDetails = data.Data
        data.Data.forEach(element => {
          newData.push({
            id: element.Id,
            text: element.GlName
          })
        })
      }
      this.ledgerGroupData = newData
    },
    (error) => {
      console.log(error)
    },
    () => {
      //this.loading = false
    })
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
      this.stateList = [{ id: '0', text: 'select State' }]
      Data.Data.forEach(element => {
        this.stateList.push({
          id: element.Id,
          text: element.CommonDesc1
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
  onChnageGroup (event) {
    if (event.value && event.data.length > 0) {
      if(event.value !== '-1'){
        this.parentId = +event.value
        this.checkValidation()
      }
      else{ 
        this.underGroupSelect2.selector.nativeElement.value = ''
        this._CommonService.openledgerGroup('','')

      }
    }
  }
 
  selectStatelist (event) {
      if(event.data.length > 0){
        if(+event.value > 0){
          this.stateId = +event.value
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
  selectedArea (event) {
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
        //  this.areaSelect2.selector.nativeElement.value = ''
        }
      }

    }

  }
  addressValue: any
  addTypeName: any

  clearValidation () {
    this.ledgerGroupData = []
    this.getLedgerGroupList()
    this.countryList = []
    this.stateList =[]
    this.cityList=[]
    this.ledgerForm.reset()
    this.showHideFlag = true
    this.submitClick =false
    this.selectyCoustmoreRegistration =[]
    this.select2VendorValue(0)
    $('#ledger_creation_id').modal(UIConstant.MODEL_HIDE)
  }
  get add () { return this.adressForm.controls }

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
      'Difference' :[UIConstant.BLANK]
    })
  }
  showHideFlag: boolean
  showGSTYesOrNot (type) {
    //requiredGST
    if(type === 'Yes'){
      this.showHideFlag = true
      this.requiredGST = true
    }
    else{
      this.showHideFlag =false
      this.requiredGST = false

    }

  }

  addressRequiredForLedger: boolean
  mobileRequirdForSetting: boolean
  emailRequirdForSetting: boolean
  customerCustomRateFlag: boolean


  currencyValues: any
  openModal () {
    this.openingStatus()
    this.showHideFlag = true
    this.requiredGST = true
    this.submitClick = false
    this.satuariesId = UIConstant.ZERO
     this.addressId = 0
    this.currencyValues = [{ id: 1, symbol: 'CR' }, { id: 0, symbol: 'DR' }]
    if (this.editMode) {
      this.editLedgerData(this.id)
    }
      this.select2VendorValue(UIConstant.ZERO)
      this.select2CrDrValue(0)
      this.getCountry(0)
  
   
    $('#ledger_creation_id').modal(UIConstant.MODEL_SHOW)
  }
@ViewChild('ledgerName') ledgerName
  customerValue: any
  Assets: any
  Liabilities: any
  Difference: any

  selectCRDRId (event) {
    this.crDrId = event.value
    console.log(this.crDrId,'crdr')
    this.calculate()
  }

  selectCoustmoreId (event) {
    this.coustmoreRegistraionId = event.value
    this.customerRegistraionError = false
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
   console.log( this.countrId ,'cty')
    }
   
  }

  // customerTypeId: number
  // selectCustomerType (event) {
  //   this.customerTypeId = event.value
  //   this.customCustomer = true

  // }
  countryValue: any
  getCountry (value) {
    this.subscribe = this._coustomerServices.getCommonValues('101').subscribe(Data => {
      this.countryListPlaceHolder = { placeholder: 'Select Country' }
      this.countryList = [{ id: '0', text: 'select Country' }]
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
  select2VendorValue (value) {
    this.selectyCoustmoreRegistration = []
    this.selectCoustomerplaceHolder = { placeholder: 'Select Customer Regi.' }
    this.selectyCoustmoreRegistration = [{ id: UIConstant.BLANK, text: 'select Customer' }, { id: '1', text: 'Regular' }
      , { id: '2', text: 'Composition' }, { id: '3', text: 'Exempted' }
      , { id: '4', text: 'UnRegistered' }, { id: '5', text: '	E-Commerce Operator ' }]
      this.coustmoreRegistraionId = this.selectyCoustmoreRegistration[1].id
    return this.coustomerValue = this.selectyCoustmoreRegistration[1].id
  }

  select2CrDrPlaceHolder: Select2Options
  valueCRDR: any
  crDrId: number
  select2CrDrValue (value) {
    this.selectCrDr = []
    this.select2CrDrPlaceHolder = { placeholder: 'Select CR/Dr' }
    this.selectCrDr = [{ id: '1', text: 'CR' }, { id: '0', text: 'DR' }]
    this.valueCRDR = value
  }

  requiredValid: boolean
  /* ...................adding customer........................... */
  saveLedgerCreation () {
    this.submitClick = true
    this.checkGSTNumberValid()
    this.checkPANNumberValid()
      if (this.ledgerForm.valid && this.parentId > 0 && this.coustmoreRegistraionId > 0 && !this.requiredGST && !this.validPANFlag) {
                  this.subscribe = this._coustomerServices.addVendore(this.LedgerParams()).subscribe(Data => {
                    if (Data.Code === UIConstant.THOUSAND) {
                        const dataToSend = { id: Data.Data, name: this.ledgerForm.value.ledgerName }
                        this._CommonService.closeCust({ ...dataToSend })
                        $('#ledger_creation_id').modal(UIConstant.MODEL_HIDE)
                        this._toastrcustomservice.showSuccess('', UIConstant.SAVED_SUCCESSFULLY)
                        this.clearValidation()
                    }
                    if (Data.Code === UIConstant.THOUSANDONE) {
                      this._toastrcustomservice.showInfo('', Data.Description)

                    }
                  }, () => {
                    //   console.log(error)
          })
      }
  }


  stateError:any
  cityError: any
  @ViewChild('under_group_select2') underGroupSelect2: Select2Component


  validPANFlag: boolean = false
  GSTNumber: any
  PANNumber: any
  checkGSTNumber (event) {
    this.ledgerForm.value.gstin = event.target.value;
    this.checkGSTNumberValid()
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
      if(this.showHideFlag){
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
    this.submitClick = false
    this.subscribe = this._coustomerServices.editvendor(id).subscribe(Data => {
     console.log('Ledger-Response',JSON.stringify(Data))
     if(Data.Code=== UIConstant.THOUSAND){
      if (Data.Data && Data.Data.Statutories && Data.Data.Statutories.length > 0) {
        this.satuariesId = Data.Data.Statutories[0].Id
        this.ledgerForm.controls.gstin.setValue(Data.Data.Statutories[0].GstinNo)
        if(Data.Data.Statutories[0].GstinNo ==='' || Data.Data.Statutories[0].GstinNo ===null){
     
          this.showHideFlag = false
          this.requiredGST = false
        }
        this.ledgerForm.controls.panNo.setValue(Data.Data.Statutories[0].PanNo)
        
          this.underGroupSelect2.setElementValue(Data.Data.Statutories[0].GlId)
          this.LedgerGroupValue = Data.Data.Statutories[0].GlId
          this.parentId =Data.Data.Statutories[0].GlId
      }else{
          this.showHideFlag = false
          this.requiredGST = false
      }
      if (Data.Data && Data.Data.LedgerDetails && Data.Data.LedgerDetails.length > 0) {
        this.ledgerForm.controls.ledgerName.setValue(Data.Data.LedgerDetails[0].Name)
        this.ledgerForm.controls.openingblance.setValue(Data.Data.LedgerDetails[0].OpeningBalance)
        this.ledgerForm.controls.ShortName.setValue(Data.Data.LedgerDetails[0].ShortName)
        this.crDrId = Data.Data.LedgerDetails[0].Crdr
        this.customeRegistTypeSelect2.setElementValue(Data.Data.LedgerDetails[0].TaxTypeId)
        this.crdrselecto2.setElementValue(Data.Data.LedgerDetails[0].Crdr)
        this.select2CrDrValue(Data.Data.LedgerDetails[0].Crdr)
      }
      if (Data.Data && Data.Data.LedgerDetails && Data.Data.Addresses.length > 0) {
       this.countrySelect2.setElementValue(Data.Data.Addresses[0].CountryId)
       this.stateSelect2.setElementValue(Data.Data.Addresses[0].StateId)
       this.citySelect2.setElementValue(Data.Data.Addresses[0].CityId)
       this.addressId =Data.Data.Addresses[0].Id
       this.getCountry(Data.Data.Addresses[0].CountryId)
       this.getStaeList(Data.Data.Addresses[0].CountryId,Data.Data.Addresses[0].StateId)
       this.getCitylist(Data.Data.Addresses[0].StateId,Data.Data.Addresses[0].CityId)
       this.countryValue = Data.Data.Addresses[0].CountryId
       this.stateValue = Data.Data.Addresses[0].StateId
       this.cityValue = Data.Data.Addresses[0].CityId
       this.ledgerForm.controls.address.setValue(Data.Data.Addresses[0].AddressValue)
      }
     }
    })
  }
  
  @ViewChild('country_selecto') countrySelect2: Select2Component
  @ViewChild('state_select2') stateSelect2: Select2Component
  @ViewChild('city_select2') citySelect2: Select2Component

  openingStatus() {
    this.subscribe =this._CommonService.openingStatusForLedger().subscribe(data=>{
      if(data.Code === UIConstant.THOUSAND){
       if(data.Data.length > 0){
         this.ledgerForm.controls.Assets.setValue(data.Data[0].Dr)
         this.ledgerForm.controls.Liabilities.setValue(data.Data[0].Cr)
         this.ledgerForm.controls.Difference.setValue(data.Data[0].Differece)
       }
      }
    })
 }

 calculate (){
  debugger
  let dataDr = 0
  let newdataCr = 0
  if(this.ledgerForm.value.openingblance ==='' || this.ledgerForm.value.openingblance ===null){
    this.ledgerForm.value.openingblance = 0
  }
//  if(this.ledgerForm.value.openingblance !=='' && this.ledgerForm.value.openingblance !==null){
    let tempOpeingbal =  JSON.parse(this.ledgerForm.value.openingblance);
    if(this.crDrId > 0){
      // 1 CR
      //alert('CR')
      let labCr = this.ledgerForm.value.Liabilities
       newdataCr = labCr + tempOpeingbal
      this.ledgerForm.controls.Liabilities.setValue(newdataCr)
     // this.ledgerForm.controls.Difference.setValue(newdataCr-tempOpeingbal)
    }
    else{
      //0 DR
     // alert('DR')
    
      let labDr = this.ledgerForm.value.Assets
       dataDr = labDr + tempOpeingbal
        this.ledgerForm.controls.Assets.setValue(dataDr)
       // this.ledgerForm.controls.Difference.setValue(dataDr-tempOpeingbal)
    }
    let diffcr_dr = this.ledgerForm.value.Liabilities - this.ledgerForm.value.Assets
     this.ledgerForm.controls.Difference.setValue(diffcr_dr)

//  }



}
 
}
