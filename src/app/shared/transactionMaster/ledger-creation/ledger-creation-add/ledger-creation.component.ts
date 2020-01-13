import { Component, ViewChild, OnDestroy, Renderer2, ElementRef } from '@angular/core'
import { Subscription } from 'rxjs/Subscription'
import { Ledger, AddCust, AddLedger } from '../../../../model/sales-tracker.model'
import { Select2OptionData, Select2Component } from 'ng2-select2'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { VendorServices } from '../../../../commonServices/TransactionMaster/vendoer-master.services'
import { CategoryServices } from '../../../../commonServices/TransactionMaster/category.services'
import { UIConstant } from '../../../constants/ui-constant'
import { ToastrCustomService } from '../../../../commonServices/toastr.service'
import { CommonService } from '../../../../commonServices/commanmaster/common.services'
import { GlobalService } from '../../../../commonServices/global.service'
import { Settings } from '../../../../shared/constants/settings.constant'
declare const $: any
import { LedgerCreationService } from '../../../../transactionMaster/ledger-creation/ledger-creation.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AddNewCityComponent } from '../../../../shared/components/add-new-city/add-new-city.component';
import * as _ from 'lodash'
import { NgSelectComponent } from '@ng-select/ng-select';
import { IfStmt } from '@angular/compiler'
import { SetUpIds } from 'src/app/shared/constants/setupIds.constant'
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast'

@Component({
  selector: 'app-ledger-creation',
  templateUrl: './ledger-creation.component.html',
  styleUrls: ['./ledger-creation.component.css']
})
export class LedgerCreationAddComponent implements OnDestroy {
  modalSub: Subscription
  modelForLedgerGroup: Subscription
  subscribe: Subscription
  id: any
  CountryName = 'Select Country'
  StateName = 'Select State'
  CityName = 'Select City'

  customerValue: any
  heroForm: any
  Assets: any
  Liabilities: any
  Difference: any
  geteditOpeningbal: any
  ledgergroupPlaceHolder: Select2Options
  addressid: any
  state_select2
  gstin: any = ''
  ShortName: any
  panNo: any
  openingblance: any
  emailErrMsg: any
  editMode: boolean = false
  private unSubscribe$ = new Subject<void>()
  public selectCrDr: Array<Select2OptionData>
  public countryList: Array<Select2OptionData>
  public stateList: any
  public cityList: Array<Select2OptionData>
  public selectyCoustmoreRegistration: Array<Select2OptionData>
  public stateListplaceHolder: Select2Options
  public countryListPlaceHolder: Select2Options
  satuariesId: number
  submitClick: boolean
  countryError: boolean
  stateId: any
  taxSlabsData: any = []
  taxSlabValue: any
  TaxSlabId: any
  ITCTypeValue: any
  RCMTypeId: any = 0
  ITCTypeId: any = 0
  HSNNo: any = ''
  RCMTypeValue: any
  editID: any = 0
  clientDateFormat: any
  isAddNew: boolean = false
  renderer: any;
  noOfDecimal: any = 1
  isChangeOtherFlagValue: any
  constructor(private ledgerService: LedgerCreationService, renderer: Renderer2, public _globalService: GlobalService, public _settings: Settings, private _CommonService: CommonService,
    private _formBuilder: FormBuilder,
    private _coustomerServices: VendorServices, public _categoryservices: CategoryServices, public _toastrcustomservice: ToastrCustomService) {


    this.clientDateFormat = this._settings.dateFormat
    this.noOfDecimal = this._settings.noOfDecimal

    this._CommonService.getTaxStatus().pipe(takeUntil(this.onDestroy$)).subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.taxSlabsData)
          newData.push({ id: data.id, text: data.name })
          this.taxSlabsData = newData
          if (this.TaxSlabId === -1) {
            this.TaxSlabId = +data.id
            this.taxSlabValue = data.id
            setTimeout(() => {
              if (this.taxSlabSelect2) {
                const element = this.renderer.selectRootElement(this.taxSlabSelect2.selector.nativeElement, true)
                element.focus({ preventScroll: false })
              }
            }, 2000)
          }
        }
      }
    )
    this.modalSub = this._CommonService.getledgerCretionStatus().subscribe(
      (data: AddCust) => {
        if (data.open) {
          this.isAddNew = data.isAddNew
          if (data.editId === '') {
            this.editMode = false
            this.id = 0
            this.editID = 0
            this.isChangeOtherFlagValue = data.isOtherCharge
          } else {
            this.id = data.editId
            this.editID = data.editId
            this.editMode = true
            this.isChangeOtherFlagValue = data.isOtherCharge
          }

          this.openModal()
        } else {
          this.closeModal()
        }
        this.getLedgerGroupList()
      }
    )

    this.modelForLedgerGroup = this._CommonService.getledgerGroupStatus().subscribe(
      (data: AddCust) => {
        if (data.id >0 && data.name) {
          this.getLedgerGroupList()
          let newData = Object.assign([], this.ledgerGroupData)
          newData.push({ id: data.id, text: data.name })
          this.ledgerGroupData = newData
          //this.LedgerGroupValue = data.id
          this.parentId = data.id
          this.headId = data.headId
          setTimeout(() => {
            this.underGroupSelect2.selector.nativeElement.focus()
          }, 1000)
        }
      }
    )
  }
  @ViewChild('taxSlab_select2') taxSlabSelect2: Select2Component
  @ViewChild('itc_select2') itcSlabSelect2: Select2Component
  @ViewChild('rcm_select2') rcmSelect2: Select2Component


  ITCName: any = 'Select ITC'
  RCMName: any = 'Select RCM'
  ListITCType: any = [];
  ListRCMType: any = [];
  getITCType() {
    this.ledgerService.getItcTypeList().subscribe(response => {
      if (response.Code === UIConstant.THOUSAND) {
        this.ListITCType = [{ id: 0, text: 'Slect Type' }]
        response.Data.forEach(element => {
          this.ListITCType.push({
            id: element.Id,
            text: element.ShortName
          })
        });
      }
    })
  }
  getRCMType() {
    this.ledgerService.getRcmTypeList().subscribe(response => {
      if (response.Code === UIConstant.THOUSAND) {
        this.ListRCMType = [{ id: 0, text: 'Slect Type' }]
        response.Data.forEach(element => {
          this.ListRCMType.push({
            id: element.Id,
            text: element.ShortName
          })
        });
      }
    })
  }
  // LedgerGroupValue: any

  onDestroy$ = new Subject()
  LgroupDetails: any

  getLedgerGroupList() {
    let newData = [{ id: '0', text: 'Select Group', headId: '0', IsTaxed: 0,IsAddressedGl:0  }, { id: '-1', text: UIConstant.ADD_NEW_OPTION, headId: '0', IsTaxed: 0,IsAddressedGl:0 }]
    this._CommonService.getLedgerGroupParentData('').subscribe(data => {
      if (data.Code === UIConstant.THOUSAND) {
        data.Data.forEach(element => {
          newData.push({
            id: element.Id,
            text: element.GlName,
            headId: element.HeadId,
            IsTaxed: element.IsTaxed,
            IsAddressedGl:element.IsAddressedGl,
          })
        })
        this.ledgerGroupData = newData
      }
    }
    )

  }
  closeModal() {
    $('#ledger_creation_id').modal(UIConstant.MODEL_HIDE)

  }



  stateValue: any
  getStaeList(id, value) {
    this.subscribe = this._coustomerServices.gatStateList(id).subscribe(Data => {
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



  invalidObj: any = {}

  mandatoryField() {
    this.invalidObj['address'] = false
    this.invalidObj['cityValue'] = false
    this.invalidObj['stateValue'] = false
    this.invalidObj['countryValue'] = false

    if (this.parentId === 0) {
      this.invalidObj['parentId'] = true
    } else {
      this.invalidObj['parentId'] = false
    }
    if (_.isEmpty(this.ledgerName) && this.ledgerName === '') {
      this.invalidObj['ledgerName'] = true
    } else {
      this.invalidObj['ledgerName'] = false
    }

    if(this.IsAddressedGlReguiredForHeadGroup){

      if (this.countryValue === null) {
        this.invalidObj['countryValue'] = true
      }
      else {
        this.invalidObj['countryValue'] = false
      }
      if (this.stateValue === null) {
        this.invalidObj['stateValue'] = true
      }
      else {
        this.invalidObj['stateValue'] = false
      }
      if (this.cityValue === null) {
        this.invalidObj['cityValue'] = true
      }
      else {
        this.invalidObj['cityValue'] = false
      }
      if (_.isEmpty(this.address) && this.address === '') {
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

 @ViewChild('AddressRef') AddressRef : ElementRef
  dynamicFocusValidation = () => {
    let valid = true
    if (this.parentId === 0) {
      this.invalidObj['parentId'] = true
      this.underGroupSelect2.selector.nativeElement.focus({ preventScroll: false })
      valid = false
    } else {
      this.invalidObj['parentId'] = false
    }
    if (!_.isEmpty(this.ledgerName) && this.ledgerName !== '') {
      this.invalidObj['ledgerName'] = false
    } else if (!this.invalidObj.parentId) {
      this.invalidObj['ledgerName'] = true
      valid = false
      this.ledgerNameRef.nativeElement.focus();
    }
    if (this.showHideFlag) {
      if(this.IsAddressedGlReguiredForHeadGroup){
        if (this.countryValue > 0 && this.countryValue !== null) {
          this.invalidObj['countryValue'] = false
        }
       else if (!this.invalidObj.parentId && !this.invalidObj.ledgerName) {
          this.invalidObj['countryValue'] = true
          this.countryselecto.focus()
          valid = false
        }
        if (this.stateValue > 0 && this.stateValue !== null) {
          this.invalidObj['stateValue'] = false
        }
        else if (!this.invalidObj.parentId && !this.invalidObj.ledgerName &&  !this.invalidObj.countryValue) {
          this.invalidObj['stateValue'] = true
          this.stateselecto2.focus()
          valid = false
        }
        if (this.cityValue > 0 && this.cityValue !== null) {
          this.invalidObj['cityValue'] = false
        }
        else if (!this.invalidObj.parentId && !this.invalidObj.ledgerName &&  !this.invalidObj.countryValue && !this.invalidObj.stateValue) {
          this.invalidObj['cityValue'] = true
          this.cityselecto2.focus()
          valid = false
        }
        if (!_.isEmpty(this.address) && this.address !== '') {
          this.invalidObj['address'] = false
        }
        else if (!this.invalidObj.parentId && !this.invalidObj.ledgerName &&  !this.invalidObj.countryValue && !this.invalidObj.stateValue && !this.invalidObj.cityValue) {
          this.invalidObj['address'] = true
          this.AddressRef.nativeElement.focus()
          valid = false
        }
      }
    
      if ((this.coustmoreRegistraionId === '1' || this.coustmoreRegistraionId === '2') ) {
        this.invalidObj['gst_required'] = true
      if (!this.chekGSTvalidation() && !this.invalidObj.address  && !this.invalidObj.parentId && !this.invalidObj.ledgerName &&  !this.invalidObj.countryValue && !this.invalidObj.stateValue && !this.invalidObj.cityValue) {
        this.invalidObj['gst_required'] = true
        this.GStRequire.nativeElement.focus()
        valid = false
      } else {
        this.invalidObj['gst_required'] = false
      }
      }
      else {
        this.invalidObj['gst_required'] = false

      }
      
    }
    
   // if (this.countryValue === 123 || this.countryValue === '123'){
      if (!this.checkPANNumberValid() && !this.invalidObj.gst_required && !this.invalidObj.address  && !this.invalidObj.parentId && !this.invalidObj.ledgerName &&  !this.invalidObj.countryValue && !this.invalidObj.stateValue && !this.invalidObj.cityValue) {
        this.invalidObj['panNum_Ref'] = true
        this.panNum_Ref.nativeElement.focus()
        valid = false
      } else {
        this.invalidObj['panNum_Ref'] = false
      }
   // }
    
  
    return valid
  }
@ViewChild('panNum_Ref') panNum_Ref: ElementRef


  taxSlabName: any = ''
  onTaxSlabSelect(evt) {
    if (+evt.value === 0 && evt.data && evt.data[0] && evt.data[0].selected) {
      this.TaxSlabId = 0
      this.taxSlabName = ''
    }
    else {
      if (evt.value > 0 && evt.data[0] && evt.data[0].text && evt.data && evt.data[0] && evt.data[0].selected) {
        this.TaxSlabId = +evt.value
        this.taxSlabName = evt.data[0].text
      }
    }
  }
  parentId: any
  headId: any
  isTaxedAplly: any = 0
  IsAddressedGlReguiredForHeadGroup:any=0
  onChnageGroup(event) {
    if (event.value && event.data.length > 0) {
      if (event.data[0].selected) {
        if (event.value !== '-1') {
          if(this.editMode){
            this.disabledOpeningBalance = false
            this.parentId = +event.value
            this.headId = event.data[0].headId
            this.isTaxedAplly = event.data[0].IsTaxed
            this.IsAddressedGlReguiredForHeadGroup = event.data[0].IsAddressedGl 
            this.openingStatus()

          }
       else{
        this.disabledOpeningBalance = false
        this.parentId = +event.value
        this.headId = event.data[0].headId
        this.isTaxedAplly = event.data[0].IsTaxed
        this.IsAddressedGlReguiredForHeadGroup = event.data[0].IsAddressedGl 
        this.select2CrDrValue()
        this.openingStatus()
        this.openingblance = 0
          }
        }
        else  {
          this.underGroupSelect2.selector.nativeElement.value = ''
          this._CommonService.openledgerGroup('', '')
        }
        if(event.value==='0'){
          this.disabledOpeningBalance = true
          this.IsAddressedGlReguiredForHeadGroup =0
          this.parentId=0
          this.isTaxedAplly=0
          this.headId =0
        }
      }
    }
   
  }

  GSTStateCode: any='00'

  matchGStno: boolean
  

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
    this.subscribe = this._coustomerServices.getCityList(id).subscribe(Data => {
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


  Areaname: any
  addressValue: any
  addTypeName: any
  ledgerGroupData: any = []
  cityCountrysatateReset() {
  }
closeResetData(){
  if(this.underGroupSelect2){
    setTimeout(() => {
      this.underGroupSelect2.setElementValue(0)
    }, 100)
  }
  if(this.customeRegistTypeSelect2){
    setTimeout(() => {
      this.customeRegistTypeSelect2.setElementValue(0)
    }, 100)
  } 
  this.gstin=''
  this.id=0
}

  yesConfirmationClose() {
    $('#close_confirm7').modal(UIConstant.MODEL_HIDE)
    this.closeModal()
    if(this.underGroupSelect2){
      setTimeout(() => {
        this.underGroupSelect2.setElementValue(0)
      }, 100)
    }
    if(this.customeRegistTypeSelect2){
      setTimeout(() => {
        this.customeRegistTypeSelect2.setElementValue(0)
      }, 100)
    }

  }


  closeLedgerModel() {
    $('#close_confirm7').modal(UIConstant.MODEL_SHOW)
  }

  showHideFlag: boolean
  IsGstApply:any= 1
  showGSTYesOrNot(type) {
    if (type === 'Yes') {
      this.showHideFlag = true
      this.IsGstApply=1
    }
    else if (type === 'No') {
      this.showHideFlag = false
      this.IsGstApply=0
      this.TaxSlabId = 0
      this.ITCTypeId = 0
      this.RCMTypeId = 0
      this.countryValue=null
      this.stateValue=null
      this.cityValue=null
      this.address=''
      if(this.customeRegistTypeSelect2){
        setTimeout(() => {
          this.customeRegistTypeSelect2.setElementValue(0)
        }, 100)
      } 
      this.coustmoreRegistraionId=0
      this.gstin =''
       this.panNo=''
      this.HSNNo = ''
    }

  }
  taxId: any = 0
  addressRequiredForLedger: boolean
  mobileRequirdForSetting: boolean
  emailRequirdForSetting: boolean
  customerCustomRateFlag: boolean
  disabledOpeningBalance: boolean = false
  currencyValues: any
  taxName = 'Select Tax'
  getTax() {
    this._CommonService.getAllTax().subscribe(resp => {
      this.taxSlabsData = [{ id: 0, text: 'Slect Tax' }]
      if (resp.Code === UIConstant.THOUSAND) {
        if (resp.Data && resp.Data.TaxSlabs && resp.Data.TaxSlabs.length > 0) {
          resp.Data.TaxSlabs.forEach(element => {
            this.taxSlabsData.push({
              id: element.Id,
              text: element.Slab
            })
          });
        }
      }
    })
  }
  address: any = ''
  onLoading() {
    this.IsGstApply =1
    this.parentId = 0
    this.ITCTypeId = 0
    this.RCMTypeId = 0
    this.disabledGSTfor_UnRegi = false
    this.matchGStno = true
    this.GstinNoCode = ''
    this.GSTStateCode = '00'
    this.TaxSlabId = 0
    this.ITCTypeId = 0
    this.RCMTypeId = 0
    this.gstin = ''
    this.ShortName = ''
    this.panNo = ''
    this.openingblance = 0
    this.ledgerName = ''
    this.coustmoreRegistraionId=0
    this.address = ''
    this.HSNNo = ''
    this.countryValue = null
    this.stateValue = null
    this.cityValue = null
 //this.LedgerGroupValue =0
      this.getOrgnizationAddress()

  }
  addressByDefaultForLedger:boolean = false
  getSetUpModules(settings) {
    settings.forEach(element => {
      if (element.id === SetUpIds.dateFormat) {
        this.clientDateFormat = element.val[0].Val
      }
      if (element.id === SetUpIds.addressByDefaultForLedger) {
        this.addressByDefaultForLedger = element.val
      }

    })

  }
  openModal() {
    this.getSetUpModules((JSON.parse(this._settings.moduleSettings).settings))
    this.onLoading()
    this.getITCType()
    this.getRCMType()
    this.getTax()
    this.mandatoryField()
    this.disabledOpeningBalance = true
    this.headId = 0
    this.openingStatus()
    this.showHideFlag = true
    this.submitClick = true
    this.satuariesId = UIConstant.ZERO
    this.addressId = 0
    this.currencyValues = [{ id: 1, symbol: 'CR' }, { id: 0, symbol: 'DR' }]
    if (this.editMode) {
      this.editLedgerData(this.id)
    }
    this.select2VendorValue()
    this.select2CrDrValue()
    this.getCountry(0)
    $('#ledger_creation_id').modal(UIConstant.MODEL_SHOW)
    setTimeout(() => {
      this.underGroupSelect2.selector.nativeElement.focus()
    }, 1000)


  }
  ledgerName: any = ''
  @ViewChild('ledgerNameRef') ledgerNameRef: ElementRef
  @ViewChild('GStRequire') GStRequire: ElementRef


  selectCRDRId(event) {

    if (event.data[0].selected) {
      this.crDrId = +event.value
      this.checkGlagLib = false
      this.calculate()
    }
  }
  disabledGSTfor_UnRegi: boolean = false

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

  getListCountryLabelList(id) {
    this._CommonService.COUNTRY_LABEL_CHANGE(id).subscribe(resp => {
      if (resp.Code === 1000 && resp.Data.length > 0) {
        this.TinNoValue = resp.Data[0].TinNo
        this.PanNoValue = resp.Data[0].PanNo
        this.countrId = id
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
  countrId: any

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

  countryValue: any
  getCountry(value) {
    this.subscribe = this._coustomerServices.getCommonValues('101').subscribe(Data => {
      this.countryListPlaceHolder = { placeholder: 'Select Country' }
      this.countryList = [{ id: '0', text: 'Select Country' }]
      if (Data.Code === UIConstant.THOUSAND) {
        Data.Data.forEach(element => {
          this.countryList.push({
            id: element.Id,
            text: element.CommonDesc
          })
        })
      }
    })
  }


  checkSelectCode: boolean = false

  validMobileFlag: boolean = false
  invalidMobilelength: boolean = false
  coustomerValue: any
  coustmoreRegistraionId: any
  select2VendorValue() {
    this.selectyCoustmoreRegistration = [{ id: '0', text: 'Select Type' }, { id: '1', text: 'Regular' }
      , { id: '2', text: 'Composition' }, { id: '3', text: 'Exempted' }
      , { id: '4', text: 'UnRegistered' }, { id: '5', text: '	E-Commerce Operator ' }]
  }

  select2CrDrPlaceHolder: Select2Options
  valueCRDR: any
  crDrId: number
  select2CrDrValue() {
    this.selectCrDr = []
    this.select2CrDrPlaceHolder = { placeholder: 'Select CR/Dr' }
    this.selectCrDr = [{ id: '1', text: 'CR' }, { id: '0', text: 'DR' }]
    if (this.headId === UIConstant.ONE) {
      this.valueCRDR = this.selectCrDr[1].id
      this.crdrselecto2.setElementValue(this.valueCRDR)
      this.crDrId = +this.selectCrDr[1].id
    }
    else if (this.headId === UIConstant.TWO) {
      this.valueCRDR = this.selectCrDr[0].id
      this.crdrselecto2.setElementValue(this.valueCRDR)
      this.crDrId = +this.selectCrDr[0].id

    }
    this.valueCRDR = this.selectCrDr[0].id
  }

  requiredValid: boolean
  /* ...................adding customer........................... */
  saveLedgerCreation(value) {
    this.submitClick = true
    if (this.dynamicFocusValidation()) {
      if (this.matchStateCodeWithGSTNumber()) {
        if(this.chekGSTvalidation()){
          if(this.checkPANNumberValid()){
            this.subscribe = this._coustomerServices.ledgerCreation(this.LedgerParams()).subscribe(Data => {
              if (Data.Code === UIConstant.THOUSAND) {
                if (value === 'save') {
                  const dataToSend = { id: Data.Data, name: this.ledgerName }
                  this._CommonService.closeledgerCretion({ ...dataToSend })
                  this._CommonService.AddedItem()
                  $('#ledger_creation_id').modal(UIConstant.MODEL_HIDE)
                  let saveName = this.editID === 0 ? UIConstant.SAVED_SUCCESSFULLY : UIConstant.UPDATE_SUCCESSFULLY
                  this._toastrcustomservice.showSuccess('', saveName)
                  this.closeResetData()
                  if (this.countryValue > 0 && this.stateValue) {
                    this.cityCountrysatateReset()
                  }
    
                } else if (value === 'new') {
                   this.onLoading()
                  this.closeResetData()
                  this.getCountry(0)
                  this._CommonService.AddedItem()
                  setTimeout(() => {
                    this.underGroupSelect2.selector.nativeElement.focus()
                  }, 1000)
                  if (this.countryValue > 0 && this.stateValue) {
                    this.cityCountrysatateReset()
                  }
                  this._toastrcustomservice.showSuccess('', UIConstant.SAVED_SUCCESSFULLY)
                  if(!this.addressByDefaultForLedger){
                    this.addressReset()
                  }
                  this.mandatoryField()
                }
                   this.disabledGSTfor_UnRegi = false
              }
              if (Data.Code === UIConstant.THOUSANDONE) {
                this._toastrcustomservice.showInfo('', Data.Description)
              }
              if (Data.Code === 5004) {
                this._toastrcustomservice.showInfo('', Data.Description)
              }
              if (Data.Code === UIConstant.REQUIRED_5020) {
                this._toastrcustomservice.showError('', Data.Data)
              }
              if (Data.Code === UIConstant.SERVERERROR) {
                this._toastrcustomservice.showError('', Data.Data)
              }
            })
          }else{
            this.panNum_Ref.nativeElement.focus()
          }

        }
        else{
          this.GStRequire.nativeElement.focus()
        }

      }
      else {
        this._toastrcustomservice.showError('', 'Invalid GSTIN Number According to Selected State ')
      }
    }
  }

  @ViewChild('under_group_select2') underGroupSelect2: Select2Component
  addressReset(){
    this.countryValue= null
    this.stateValue=null
    this.cityValue=null
    this.address=''
  
  }
  GSTNumber: any
  PANNumber: any
  GstinNoCode: any = ''
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

  
  splitGSTNumber(){
    let  parts = this.gstin.trim()
     this.GSTStateCode = parts.substring(0, 2);
    this._CommonService.getStateByGStCode(this.GSTStateCode).subscribe(d=>{
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
  
  checkPANNumberValid() {
    if (!_.isEmpty(this.panNo) && this.panNo !== '') {
      this.PANNumber = (this.panNo).toUpperCase()
      if(this.countryValue===123){
        if ( this._CommonService.panNumberRegxValidation(this.PANNumber)) {
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

  
  chekGSTvalidation() {
    if (!_.isEmpty(this.gstin) && this.gstin !== '') {
      this.GSTNumber = (this.gstin).toUpperCase()
      if(this.countryValue===123 ){
        if (  this._CommonService.regxGST.test(this.gstin)) {
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
  
  addressId: any
  private LedgerParams() {
    let obj = {
      Ledger: {
        Id: this.id === 0 ? 0 : this.id,
        GlId: this.parentId,
        Name: this.ledgerName,
        TaxTypeID: this.coustmoreRegistraionId,
        CrDr: this.crDrId,
        RCMType: this.RCMTypeId,
        ITCType: this.ITCTypeId,
        TaxSlabId: this.TaxSlabId,
        HsnNo: this.HSNNo,
        IsGstApply: this.IsGstApply,
        ShortName: this.ShortName,
        OpeningAmount: this.getopeinAmountValue(),
        IsChargeLedger: this.isChangeOtherFlagValue,
        Statutories: [{
          Id: this.satuariesId === 0 ? 0 : this.satuariesId,
          PanNo: this.PANNumber,
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
    return obj.Ledger
  }


  private getopeinAmountValue() {
    if (this.openingblance > 0) {
      return this.openingblance
    } else {
      return 0
    }
  }

  ngOnDestroy() {
    this.modalSub.unsubscribe()
    this.modelForLedgerGroup.unsubscribe()
  }
  setupCodeForAddresRequired: any
  @ViewChild('select_regiType') customeRegistTypeSelect2: Select2Component
  @ViewChild('crdr_selecto2') crdrselecto2: Select2Component
  @ViewChild('country_selecto') countryselecto: NgSelectComponent

  @ViewChild('state_select2') stateselecto2: NgSelectComponent
  @ViewChild('city_select2') cityselecto2: NgSelectComponent

  editLedgerData(id) {
    setTimeout(() => {
      this.underGroupSelect2.selector.nativeElement.focus()
    }, 1000)
    this.submitClick = false
    this.subscribe = this._coustomerServices.editLedgerCreation(id).subscribe(Data => {
      if (Data.Code === UIConstant.THOUSAND) {
        console.log(Data)
        if (Data.Data && Data.Data.Statutories && Data.Data.Statutories.length > 0) {
          this.satuariesId = Data.Data.Statutories[0].Id
          this.gstin = Data.Data.Statutories[0].GstinNo === null ? '' : Data.Data.Statutories[0].GstinNo
          this.panNo = Data.Data.Statutories[0].PanNo=== null ? '' : Data.Data.Statutories[0].PanNo
          if (!_.isEmpty(this.gstin)) {
            this.GstinNoCode = this.returnsplitGSTcode()
          }
        }
        if (Data.Data && Data.Data.LedgerDetails && Data.Data.LedgerDetails.length > 0) {
          this.showHideFlag =Data.Data.LedgerDetails[0].IsGstApply ===0 ? false : true
          this.disabledOpeningBalance = false
          this.headId = Data.Data.LedgerDetails[0].HeadId
          this.isTaxedAplly = Data.Data.LedgerDetails[0].IsTaxed
          this.geteditOpeningbal = Data.Data.LedgerDetails[0].OpeningBalance
          this.openingblance = Data.Data.LedgerDetails[0].OpeningBalance
          this.ShortName = Data.Data.LedgerDetails[0].ShortName
          this.ledgerName = Data.Data.LedgerDetails[0].Name
          this.crDrId = Data.Data.LedgerDetails[0].Crdr
          this.parentId = Data.Data.LedgerDetails[0].GlId
          if (Data.Data.LedgerDetails[0].IsTaxed === 1) {
            this.HSNNo = Data.Data.LedgerDetails[0].HsnNo
            if (this.taxSlabSelect2) {
              this.taxSlabSelect2.setElementValue(Data.Data.LedgerDetails[0].TaxSlabId)
            }
            this.taxSlabValue = Data.Data.LedgerDetails[0].TaxSlabId
            this.ITCTypeValue = Data.Data.LedgerDetails[0].ITCType
            this.RCMTypeValue = Data.Data.LedgerDetails[0].RCMType
            this.TaxSlabId = Data.Data.LedgerDetails[0].TaxSlabId
            this.ITCTypeId = Data.Data.LedgerDetails[0].ITCType
            this.RCMTypeId = Data.Data.LedgerDetails[0].RCMType
          }
          this.underGroupSelect2.setElementValue(Data.Data.LedgerDetails[0].GlId)
          this.disabledGSTfor_UnRegi = Data.Data.LedgerDetails[0].TaxTypeId === 4 ? true : false
          this.customeRegistTypeSelect2.setElementValue(Data.Data.LedgerDetails[0].TaxTypeId)
          this.coustmoreRegistraionId = JSON.stringify(Data.Data.LedgerDetails[0].TaxTypeId)
          this.crdrselecto2.setElementValue(Data.Data.LedgerDetails[0].Crdr)
        }
        if (Data.Data && Data.Data.Addresses && Data.Data.Addresses.length > 0) {
          console.log(Data.Data.Addresses)
          this.addressId = Data.Data.Addresses[0].Id
          this.address = Data.Data.Addresses[0].AddressValue
          this.loadAddressDetails(Data.Data.Addresses[0])

        }
        this.mandatoryField()
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
    this.subscribe = this._CommonService.openingStatusForLedger().subscribe(data => {
      if (data.Code === UIConstant.THOUSAND) {
        if (data.Data.length > 0) {
          this.initilzedAssets = data.Data[0].Dr
          this.initilzedLiabilities = data.Data[0].Cr
          this.initilzedDifference = data.Data[0].Differece
          this.Assets = (data.Data[0].Dr).toFixed(this.noOfDecimal)
          this.Liabilities = (data.Data[0].Cr).toFixed(this.noOfDecimal)
          this.Difference = (data.Data[0].Differece).toFixed(this.noOfDecimal)
        }
      }
    })
  }
  checkGlagLib: any


  calculate() {

    if (this.headId > 0) {
      let dataDr = 0
      let newdataCr = 0
      let tempOpeingbal;
      if (this.openingblance === '' || this.openingblance === null) {
        this.openingblance = 0
      }
      if (this.editMode) {
        if (this.geteditOpeningbal !== undefined || this.geteditOpeningbal > 0) {
          let editdata = JSON.parse(this.geteditOpeningbal);
          let data = JSON.parse(this.openingblance)
          tempOpeingbal = data - editdata
        }
      }
      else {
        tempOpeingbal = JSON.parse(this.openingblance)
      }
      if (this.headId === UIConstant.ONE) {
        let getTotalSum = 0
        getTotalSum = this.initilzedAssets + tempOpeingbal
        let lastLib = 0
        if (this.crDrId > 0) { // 1 CR
          newdataCr = this.initilzedAssets - tempOpeingbal
          this.Assets = newdataCr
        }
        else { //0 DR
          dataDr = this.initilzedAssets + tempOpeingbal
          this.Assets = dataDr
        }
      }
      else if (this.headId === UIConstant.TWO) {
        let getTotalSum = 0
        getTotalSum = this.initilzedLiabilities + tempOpeingbal
        if (this.crDrId > 0) {
          newdataCr = this.initilzedLiabilities + tempOpeingbal
          this.Liabilities = newdataCr
        }
        else {
          dataDr = this.initilzedLiabilities - tempOpeingbal
          this.Liabilities = dataDr
        }
      }
      let diffcr_dr = this.Assets - this.Liabilities

      this.Difference = diffcr_dr
    }
    else {
      this._toastrcustomservice.showError('', 'Please Select Ledger Group')
    }

  }

  stateValuedata1: any = null
  countryCodeFlag: any = null
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
    this.getListCountryLabelList(0)
    this.GSTStateCode='00'
    
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
}
