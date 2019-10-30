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
  CountryName='Select Country'
  StateName='Select State'
  CityName='Select City'

  customerValue: any
  heroForm:any
  Assets: any
  Liabilities: any
  Difference: any
  geteditOpeningbal: any
  ledgergroupPlaceHolder: Select2Options
  addressid: any
  state_select2
  gstin:any=''
  ShortName:any
  panNo:any
  openingblance:any
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
  editID: any =0
  cityId: any =0
  clientDateFormat: any
  isAddNew: boolean = false
  renderer: any;
  noOfDecimal: any = 1
  isChangeOtherFlagValue: any
  constructor(private ledgerService: LedgerCreationService, renderer: Renderer2, public _globalService: GlobalService, public _settings: Settings, private _CommonService: CommonService,
    private _formBuilder: FormBuilder,
    private _coustomerServices: VendorServices, public _categoryservices: CategoryServices, public _toastrcustomservice: ToastrCustomService) {
    //this.createCustomerForm()

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
  @ViewChild('taxSlab_select2') taxSlabSelect2: Select2Component
  @ViewChild('itc_select2') itcSlabSelect2: Select2Component
  @ViewChild('rcm_select2') rcmSelect2: Select2Component


  ITCName:any ='Select ITC'
  RCMName:any='Select RCM'
  ListITCType: any = [];
  ListRCMType: any = [];
  getITCType() {
    this.ledgerService.getItcTypeList().subscribe(response => {
      if (response.Code === UIConstant.THOUSAND) {
        this.ListITCType = []
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
        this.ListRCMType = []
        response.Data.forEach(element => {
          this.ListRCMType.push({
            id: element.Id,
            text: element.ShortName
          })
        });
      }
    })
  }
  LedgerGroupValue: any
 
  onDestroy$ = new Subject()
  LgroupDetails: any
  getLedgerGroupList() {
    this.ledgergroupPlaceHolder = { placeholder: 'Select Group' }
    let newData = [{ id: '0', text: 'Select Group', headId: '0', IsTaxed: 0 }, { id: '-1', text: UIConstant.ADD_NEW_OPTION, headId: '0', IsTaxed: 0 }]
    this._CommonService.getLedgerGroupParentData('').pipe(takeUntil(this.onDestroy$)).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND) {
        this.LgroupDetails = data.Data
        data.Data.forEach(element => {
          newData.push({
            id: element.Id,
            text: element.GlName,
            headId: element.HeadId,
            IsTaxed: element.IsTaxed
          })
        })
      }
      if (data.Code === UIConstant.SERVERERROR) {
        this._toastrcustomservice.showError('Data Fetching Error', '')
      }
      this.ledgerGroupData = newData
    }
    )
  }
  closeModal() {
    if ($('#ledger_creation_id').length > 0) {
      this.id = UIConstant.ZERO
      this.editMode = false
      $('#ledger_creation_id').modal(UIConstant.MODEL_HIDE)
    }
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
  isSelectParentGrp: boolean
  ledgerNameEr:boolean
  checkValidation() {
    if (this.parentId > 0) {
      return this.isSelectParentGrp = false
    } else {
      return this.isSelectParentGrp = true

    }
  }
  checkValidationName() {
    if (this.ledgerName!=="" ) {
       this.ledgerNameEr = false
    } else {
       this.ledgerNameEr = true
    }
  }

  dynamicFocus(){
    if(this.ledgerNameEr){
      this.ledgerNameRef.nativeElement.focus();
    }
    if(this.isSelectParentGrp){
      this.underGroupSelect2.selector.nativeElement.focus()
    }
    if(this.coustmoreRegistraionId ==='1' && this.requiredGST){
      this.GStRequire.nativeElement.focus()
    }
  }

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
  onChnageGroup(event) {
    if (event.value && event.data.length > 0) {
      if (event.data[0].selected) {
        if (event.value !== '-1') {
          this.disabledInputField = false
          this.parentId = +event.value
          this.headId = event.data[0].headId
          this.isTaxedAplly = event.data[0].IsTaxed
          this.select2CrDrValue()
          this.checkValidation()
          this.openingStatus()
          this.openingblance=0

        }
        else {
          this.underGroupSelect2.selector.nativeElement.value = ''
          this._CommonService.openledgerGroup('', '')
        }
      }

    }
  }

  GSTStateCode: any

  matchGStno: boolean
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
  
  selectStatelist(event) {
    if (this.stateValue !==null) {
      if (+event.id > 0) {
        this.stateId = +event.id
        this.GSTStateCode = event.stateCode
         this.stateValue =+event.id
        this.matchStateCodeWithGSTNumber()
        this.countryError = false
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
    this.subscribe = this._coustomerServices.getCityList(id).subscribe(Data => {
      this.cityList = [{id:'-1',text:'+Add New'}]
      Data.Data.forEach(element => {
        this.cityList.push({
          id: element.Id,
          text: element.CommonDesc2
        })
      })
    })
  }
 

  Areaname: any
  addressValue: any
  addTypeName: any
  ledgerGroupData: any = []
  cityCountrysatateReset() {
  }
  clearValidation() {
     this.onLoading()
    this.showHideFlag = true
    this.submitClick = false
    this.disabledInputField = true
    this.underGroupSelect2.setElementValue(0)
   if(this.taxSlabSelect2){
     this.taxSlabSelect2.setElementValue(0)
    }
    if(this.rcmSelect2){
      this.rcmSelect2.setElementValue(0)

    }
    if(this.itcSlabSelect2){
      this.itcSlabSelect2.setElementValue(0)
    }
    this.isTaxedAplly =null
    this.selectyCoustmoreRegistration = []
    this.select2VendorValue(1)
    if(this.customeRegistTypeSelect2){
      this.customeRegistTypeSelect2.setElementValue(1)

    }
  }

  showHideFlag: boolean
  showGSTYesOrNot(type) {
    if (type === 'Yes') {
      this.showHideFlag = true
      this.requiredGST = true
    }
    else {
      this.showHideFlag = false
      this.requiredGST = false
      this.coustmoreRegistraionId = 0
      this.TaxSlabId = 0
      this.ITCTypeId = 0
      this.RCMTypeId = 0
      this.HSNNo = ''
    }

  }
  taxId: any = 0
  addressRequiredForLedger: boolean
  mobileRequirdForSetting: boolean
  emailRequirdForSetting: boolean
  customerCustomRateFlag: boolean
  disabledInputField: boolean = false
  currencyValues: any
  taxName='Select Tax'
  getTax() {
    this._CommonService.getAllTax().subscribe(resp => {
      this.taxSlabsData = []
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
  address:any
  onLoading() {
    this.ITCTypeId = 0
    this.RCMTypeId = 0
    this.getITCType()
    this.getRCMType()
    this.getTax()
    this.disabledGSTfor_UnRegi = false
    this.matchGStno = true
    this.GstinNoCode = ''
    this.GSTStateCode = 0
    this.TaxSlabId = 0
    this.ITCTypeId = 0
    this.RCMTypeId = 0
    this.gstin=''
    this.ShortName=''
    this.panNo=''
    this.openingblance=0
    this.ledgerName=''
    this.address =''
    this.HSNNo = ''
    this.countryValue= null
    this.stateValue= null
    this.cityValue= null
  }

  openModal() {
    this.onLoading()
    if(!this.editMode){
      this.getOrgnizationAddress()
    }
    this.getLedgerGroupList()
    this.disabledInputField = true
    this.headId = 0
    this.openingStatus()
    this.showHideFlag = true
    this.requiredGST = true
    this.submitClick = true
    this.isSelectParentGrp = true
    this.ledgerNameEr = true
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
  ledgerName:any=''
  @ViewChild('ledgerNameRef') ledgerNameRef :ElementRef
  @ViewChild('GStRequire') GStRequire :ElementRef

  
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
        if (this.coustmoreRegistraionId === '1') {
          this.requiredGST = true
          this.disabledGSTfor_UnRegi = false
        }
        else if (event.value === '4') {
          this.disabledGSTfor_UnRegi = true
          this.gstin=''
          this.requiredGST = false

        }
        else {
          this.requiredGST = false
          this.disabledGSTfor_UnRegi = false
        }
      }

    }

  }


  countrId: any
  selectCountryListId(event) {
   if (this.countryValue !==null) {
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
     // this.countryValue = value
    })
  }


  checkSelectCode: boolean = false

  validMobileFlag: boolean = false
  invalidMobilelength: boolean = false


  selectCoustomerplaceHolder: Select2Options
  coustomerValue: any
  coustmoreRegistraionId: any
  select2VendorValue(value) {
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
    this.checkGSTNumberValid()
    this.checkPANNumberValid()
    this.dynamicFocus()
    if (this.ledgerName !=='' && this.parentId > 0 && !this.requiredGST && !this.validPANFlag) {
      if (this.matchStateCodeWithGSTNumber()) {
        this.subscribe = this._coustomerServices.addVendore(this.LedgerParams()).subscribe(Data => {
          if (Data.Code === UIConstant.THOUSAND) {
            if (value === 'save') {
              const dataToSend = { id: Data.Data, name: this.ledgerName }
              this._CommonService.closeledgerCretion({ ...dataToSend })
              this._CommonService.AddedItem()
              this.disabledStateCountry = false
              $('#ledger_creation_id').modal(UIConstant.MODEL_HIDE)
              let saveName = this.editID === 0 ? UIConstant.SAVED_SUCCESSFULLY : UIConstant.UPDATE_SUCCESSFULLY
              this._toastrcustomservice.showSuccess('', saveName)
              if (this.countrId > 0 && this.stateId) {
                this.cityCountrysatateReset()
              }

            } else if (value === 'new') {
              this.getCountry(0)
              this.disabledStateCountry = false
              this._CommonService.AddedItem()
              setTimeout(() => {
                this.underGroupSelect2.selector.nativeElement.focus()
              }, 1000)
              if (this.countrId > 0 && this.stateId) {
                this.cityCountrysatateReset()
              }
              this._toastrcustomservice.showSuccess('', UIConstant.SAVED_SUCCESSFULLY)
            }
            this.disabledGSTfor_UnRegi = false
            this.clearValidation()



          }
          if (Data.Code === UIConstant.THOUSANDONE) {
            this._toastrcustomservice.showInfo('', Data.Description)
          }
          if (Data.Code === UIConstant.REQUIRED_5020) {
            this._toastrcustomservice.showError('', Data.Data)
          }
          if (Data.Code === UIConstant.SERVERERROR) {
            this._toastrcustomservice.showError('', Data.Data)
          }
        })
      }
      else {
        this._toastrcustomservice.showError('', 'Invalid GSTIN Number According to Selected State ')
      }
    }
  }


  stateError: any
  cityError: any
  @ViewChild('under_group_select2') underGroupSelect2: Select2Component


  validPANFlag: boolean = false
  GSTNumber: any
  PANNumber: any
  GstinNoCode: any = ''
  disabledStateCountry: boolean = false
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

    //getGStnumber =event.target.value
    this.checkGSTNumberValid()
  }
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
    this._CommonService.getStateByGStCode(stateCode).
      pipe(
        takeUntil(this.unSubscribe$)
      ).
      subscribe((response: any) => {
        //ShortName1 = statecode

        if (response.Code === UIConstant.THOUSAND && response.Data.length > 0) {
          this.countrId = response.Data[0].CommonId
          this.stateId = response.Data[0].CommonCode
          this.countryValue =response.Data[0].CommonId
          // this.countryselecto.setElementValue()
          this.getOneState(response)
          //   this.stateselecto.setElementValue( response.Data[0].CommonCode)

        }
      })
  }
  checkPANNumberValid() {
    if (this.panNo !== '' && this.panNo !== null) {
      this.PANNumber = (this.panNo).toUpperCase()
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
  requiredGST: boolean
  checkGSTNumberValid() {

    if (this.gstin !== '' && this.gstin !== null) {
      this.GSTNumber = (this.gstin).toUpperCase()
      if (this.showHideFlag && this.coustmoreRegistraionId === '1') {
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
  private LedgerParams(): AddLedger {
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
          CountryId: this.countrId === undefined ? 0 : this.countrId,
          StateId: this.stateId === undefined ? 0 : this.stateId,
          CityId: this.cityId === undefined ? 0 : this.cityId,
          AddressValue: this.address,
        }],
      } as AddLedger
    }
    console.log('Ledger-Request', JSON.stringify(obj.Ledger))
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
  @ViewChild('state_select2') stateselecto2: Select2Component
  @ViewChild('city_select2') cityselecto2: Select2Component
  @ViewChild('country_selecto') countryselecto: Select2Component

  editLedgerData(id) {
    setTimeout(() => {
      this.underGroupSelect2.selector.nativeElement.focus()
    }, 1000)
    this.submitClick = false
    this.isSelectParentGrp = false
    this.ledgerNameEr=false
    this.subscribe = this._coustomerServices.editvendor(id).subscribe(Data => {
      console.log('Ledger-Response', JSON.stringify(Data))
      if (Data.Code === UIConstant.THOUSAND) {
        if (Data.Data && Data.Data.Statutories && Data.Data.Statutories.length > 0) {
          this.satuariesId = Data.Data.Statutories[0].Id
          this.gstin=Data.Data.Statutories[0].GstinNo
          this.panNo=Data.Data.Statutories[0].PanNo

        }
        if (Data.Data && Data.Data.LedgerDetails && Data.Data.LedgerDetails.length > 0) {
          this.disabledInputField = false
          this.headId = Data.Data.LedgerDetails[0].HeadId
          this.isTaxedAplly =Data.Data.LedgerDetails[0].IsTaxed
          this.geteditOpeningbal = Data.Data.LedgerDetails[0].OpeningBalance
          this.openingblance =Data.Data.LedgerDetails[0].OpeningBalance
          this.ShortName=Data.Data.LedgerDetails[0].ShortName
          this.ledgerName =Data.Data.LedgerDetails[0].Name
 
          this.crDrId = Data.Data.LedgerDetails[0].Crdr
          this.parentId = Data.Data.LedgerDetails[0].GlId
          if(Data.Data.LedgerDetails[0].IsTaxed===1){
            this.HSNNo =Data.Data.LedgerDetails[0].HsnNo
            if(this.taxSlabSelect2){
              this.taxSlabSelect2.setElementValue(Data.Data.LedgerDetails[0].TaxSlabId)
            }
            this.taxSlabValue =Data.Data.LedgerDetails[0].TaxSlabId
            this.ITCTypeValue=Data.Data.LedgerDetails[0].ITCType
            this.RCMTypeValue =Data.Data.LedgerDetails[0].RCMType
            // if(this.itcSlabSelect2){
            //   this.itcSlabSelect2.setElementValue(Data.Data.LedgerDetails[0].ITCType)
            // }
            this.TaxSlabId = Data.Data.LedgerDetails[0].TaxSlabId 
            this.ITCTypeId = Data.Data.LedgerDetails[0].ITCType
            this.RCMTypeId = Data.Data.LedgerDetails[0].RCMType
            // if(this.rcmSelect2){
            //   this.rcmSelect2.setElementValue(Data.Data.LedgerDetails[0].RCMType)
            // }
          }
          this.underGroupSelect2.setElementValue(Data.Data.LedgerDetails[0].GlId)
          this.disabledGSTfor_UnRegi = Data.Data.LedgerDetails[0].TaxTypeId === 4 ? true : false
          this.customeRegistTypeSelect2.setElementValue(Data.Data.LedgerDetails[0].TaxTypeId)
          this.coustmoreRegistraionId = JSON.stringify(Data.Data.LedgerDetails[0].TaxTypeId)
          if (this.coustmoreRegistraionId === '0') {
            this.showHideFlag = false
            this.requiredGST = false
          } else {
            this.requiredGST = this.coustmoreRegistraionId === '1' ? true : false
          }
          this.crdrselecto2.setElementValue(Data.Data.LedgerDetails[0].Crdr)
          this.crdrselecto2.setElementValue(Data.Data.LedgerDetails[0].Crdr)
        }
        if (Data.Data && Data.Data.Addresses && Data.Data.Addresses.length > 0) {
          this.addressId = Data.Data.Addresses[0].Id
          this.address=Data.Data.Addresses[0].AddressValue
         
         // setTimeout(() => {
        ////   this.countryValue =Data.Data.Addresses[0].CountryId
        ////    this.getStaeList(Data.Data.Addresses[0].CountryId, Data.Data.Addresses[0].StateId)
        //  }, 500);
        //  this.stateValue = Data.Data.Addresses[0].StateId
        //  this.getCitylist(Data.Data.Addresses[0].StateId, Data.Data.Addresses[0].CityId)
          //this.cityValue = Data.Data.Addresses[0].CityId
         this.loadAddressDetails(Data.Data.Addresses[0])
          
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
    this.subscribe = this._CommonService.openingStatusForLedger().subscribe(data => {
      if (data.Code === UIConstant.THOUSAND) {
        if (data.Data.length > 0) {
          this.initilzedAssets = data.Data[0].Dr
          this.initilzedLiabilities = data.Data[0].Cr
          this.initilzedDifference = data.Data[0].Differece
          this.Assets=(data.Data[0].Dr).toFixed(this.noOfDecimal)
          this.Liabilities=(data.Data[0].Cr).toFixed(this.noOfDecimal)
          this.Difference=(data.Data[0].Differece).toFixed(this.noOfDecimal)
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
          this.Assets=newdataCr
        }
        else { //0 DR
          dataDr = this.initilzedAssets + tempOpeingbal
          this.Assets=dataDr
        }
      }
      else if (this.headId === UIConstant.TWO) {
        let getTotalSum = 0
        getTotalSum = this.initilzedLiabilities + tempOpeingbal
        if (this.crDrId > 0) {
          newdataCr = this.initilzedLiabilities + tempOpeingbal
          this.Liabilities=newdataCr
        }
        else {
          dataDr = this.initilzedLiabilities - tempOpeingbal
          this.Liabilities=dataDr
        }
      }
      let diffcr_dr = this.Assets - this.Liabilities

       this.Difference=diffcr_dr
    }
    else {
      this._toastrcustomservice.showError('', 'Please Select Ledger Group')
    }

  }
  countryValue1: any = null
  stateValuedata1: any = null
  countryCodeFlag: any = null
  cityValue1: any = null
  getOrgnizationAddress() {
    let Address = JSON.parse(localStorage.getItem('ORGNIZATIONADDRESS'));
    if (Address !== null) {
     this.loadAddressDetails(Address)
    }
  }
  loadAddressDetails(Address){
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
@ViewChild('addNewCityRef') addNewCityRefModel: AddNewCityComponent
  selectedCityId(event) {
    if (this.cityValue !== null) {
      this.cityId = event.id
      this.cityError = false
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
