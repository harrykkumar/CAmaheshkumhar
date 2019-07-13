import { Component, Output, EventEmitter, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Subscription } from 'rxjs/Subscription'
import { Select2OptionData, Select2Component } from 'ng2-select2'
import { TaxModal, AddCust } from '../../../../model/sales-tracker.model'
import { ToastrCustomService } from '../../../../commonServices/toastr.service'
import { TaxMasterService } from '../../../../commonServices/TransactionMaster/tax-master.services'
import { CommonSetGraterServices } from '../../../../commonServices/setgatter.services'
import { UIConstant } from '../../../constants/ui-constant'
import { ErrorConstant } from '../../../constants/error-constants'
import { TaxModule } from '../../../../transactionMaster/tax/tax.module'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
import { SetUpIds } from '../../../constants/setupIds.constant';
declare var $: any
@Component({
  selector: 'app-tax-add',
  templateUrl: './tax-add.component.html',
  styleUrls: ['./tax-add-component.css']
})
export class TaxAddComponent {
  @Output() onFilter = new EventEmitter()

  id: any
  type: any
  deafaultValue = ''
  taxrates: any[]
  plusValue: number
  taxForm: FormGroup
  errorMassage: string
  submitClick: boolean
  select2Error: boolean = false
  taxDetail: TaxModal[]
  subscribe: Subscription
  taxboxDivVisibale: boolean
  selectTaxTypePlaceHolde: Select2Options
  editMode: boolean
   selectTaxTpye: any
  modalSub: Subscription
  keepOpen: boolean = false
  constructor(public toastrCustomService: ToastrCustomService, private _taxMasterServices: TaxMasterService,
    private _formBuilder: FormBuilder,
    private _commonGetSetServices: CommonSetGraterServices,
    private commonService: CommonService,
    private renderer: Renderer2
  ) {

    this.modalSub = this.commonService.getTaxStatus().subscribe(
      (data: AddCust) => {
        if (data.open) {
          if (data.editId === '') {
            this.editMode = false
            this.id =0
            this.editMainID =0
          } else {
            this.editMode = true
            this.id = data.editId
            this.editMainID =data.editId
          }
          this.openModal()
        } else {
          this.closeModal()
        }
      }
    )
  }
  currencies: any = []
editMainID :any
  getAvailableCurrency() {
    let _self = this
    this.commonService.setupSettingByType(UIConstant.SALE_TYPE).subscribe(Settings => {
      _self.currencies = [{ id: '0', text: '%' }]

      // if (Settings.Code === UIConstant.THOUSAND) {
      //   let currencies = Settings.Data.SetupSettings
      //   currencies.forEach(element => {
      //     if (+element.SetupId === SetUpIds.currency && +element.Type === SetUpIds.multiple) {
      //       _self.currencies.push({
      //         id: element.Id,
      //         text: element.Val
      //       })

      //     }
      //   })
      // }

    }
    )
  }

  ngOnDestroy() {
    this.modalSub.unsubscribe()
    if (this.subscribe) {
      this.subscribe.unsubscribe()
    }
  }
  ngOnInit() {
    //this.getTaxName()
  }
 
  getTaxName(){
    
    this.selectTaxTpye =[]
    let localdata=[]
    this.subscribe = this._taxMasterServices.getTaxTypeName().subscribe(Data => {
      if(Data.Code===UIConstant.THOUSAND){
          Data.Data.forEach(element => {
            if(element.UnderId === 0){
              localdata.push({
              id:element.UId,
              text:element.Name,
              uid:element.UId,
              })
            }
          });
      }
      this.selectTaxTpye =  localdata
      //this.taxtype_select2.setElementValue()
    })
    
  }
  openModal() {
    this.clearForm()
    this.TypeUid=0
    this.isForOtherState = false
    this.taxrRateId = 0
    this.currencies = [{ id: 0, text: '%' }]
    if (this.editMode) {
      this.getTaxEditData(this.id)
    } else {
      this.taxrates = []
      this.id = UIConstant.ZERO
      this.taxboxDivVisibale = true
      this.getTaxName()
    }
    this.taxboxDivVisibale = false
    this.plusValue = 0
    this.getAvailableCurrency()
    this.taxboxDivVisibale = false
    this.submitClick = false
    $('#add_tax').modal(UIConstant.MODEL_SHOW)
    setTimeout(() => {
      this.taxtypeSelect2.selector.nativeElement.focus()
    }, 500)
  }
  taxTypeList: any
  getTypeOfTax(addEditModeFlg,selectedTaxId) {
    if(addEditModeFlg){
      this.taxTypeList =[]
      this.subscribe = this._taxMasterServices.getTaxSalbName(selectedTaxId).subscribe(Data => {
        if (Data.Code === UIConstant.THOUSAND) {
          Data.Data.TaxRates.forEach(element => {
            if (selectedTaxId === element.UnderId) {
              this.taxTypeList.push({
                Name: element.Name,
                TaxTitleId: element.TaxTitleId,
                Id: element.Id,
                taxrate:0,
                isForOtherState:element.IsForOtherState,
                ValueType:element.ValueType
      
              })
            }
           
          });
          console.log(Data, 'get-tax-->')
        }
        if(Data.Code ===UIConstant.SERVERERROR){
          this.toastrCustomService.showError('',Data.Description)
        }
      })
    }

  }
  @ViewChild('taxtype_select2') taxtypeSelect2: Select2Component
  closeModal() {
    if ($('#add_tax').length > 0) {
      this.clearValidation()
      this.taxrates = []
      this.taxboxDivVisibale = false
      this.plusValue = 0
      this.submitClick = false
      this.id = UIConstant.ZERO
      $('#add_tax').modal(UIConstant.MODEL_HIDE)
    }
  }
  clearValidation() {
    this.slab = ''
    this.type = UIConstant.ZERO
    this.clearForm()
  }


  taxErrMsg: any
  taxErrorFlag: any
  taxErrormass: any
  taxType: any
  getTaxEditData(id) {
    this.EditFlag = false
    this.taxboxDivVisibale = true
    this.subscribe = this._taxMasterServices.editTax(id).subscribe(Data => {
      if (Data.Code === UIConstant.THOUSAND) {
        // setTimeout(() => {
        //   const element = this.first.nativeElement.focus()
        //   element.focus({ preventScroll: false })
        // }, 500)
        console.log('tax-response :-' ,JSON.stringify(Data))
        if (Data.Data && Data.Data.TaxRates.length > 0) {
          this.taxTypeList = []
          for (let i = 0; i < Data.Data.TaxRates.length; i++) {
            this.taxTypeList.push({
              Id: Data.Data.TaxRates[i].Id,
              TaxTitleId: Data.Data.TaxRates[i].TaxTitleId,
              Name: Data.Data.TaxRates[i].Name,
              taxrate: Data.Data.TaxRates[i].TaxRate,
              ValueType: Data.Data.TaxRates[i].ValueType,
              CurrencyName: Data.Data.TaxRates[i].ValueType ,
              isForOtherState: Data.Data.TaxRates[i].IsForOtherState
            })
            
            if (this.taxTypeList[i].isForOtherState === true) {
              $('#customCheck' + i).prop('checked', true)
            } else {
              $('#customCheck' + i).prop('checked', false)
            }

          }
        } else {
          this.taxTypeList = []
        }
        if (Data.Data && Data.Data.TaxSlabs.length > 0) {
          this.slab = Data.Data.TaxSlabs[0].Slab
          this.TypeUid = Data.Data.TaxSlabs[0].Type 
          this.deafaultValue =Data.Data.TaxSlabs[0].Type
          let localdata =[{id:Data.Data.TaxSlabs[0].Type,text: Data.Data.TaxSlabs[0].TypeName}]
          this.selectTaxTpye =  localdata
          this.taxtypeSelect2.setElementValue(this.deafaultValue)
        }
      }
      if (Data.Code === UIConstant.SERVERERROR) {
        this.toastrCustomService.showError('', Data.Description)
      }

    })
  }
  taxTypeId: any
  taxTypeName: any
 
  EditFlag:any
  TypeUid:any
  selectedTaxType(event) {
    if (event.value && event.data.length > 0) {
      this.TypeUid = +event.data[0].id
      console.log( this.TypeUid)
      if(this.editMode && !this.EditFlag){
        this.getTypeOfTax(false,this.TypeUid)
      }
      else{
        this.getTypeOfTax(true,this.TypeUid)

      }
    }

  }
  taxId: any
  CurrencyName: any
  CurrencyId: any
  isForOtherState: any

  onSelectCurrency(event) {

    if (event.data.length > 0) {
      if (event.data && event.data[0].text) {
        this.CurrencyId = event.value
        this.CurrencyName = event.data[0].text
      }
    }

  }
  slab: any
  taxrate: any
  taxName: any
  CurrencyType: any
  invalidObjCont: any = {}
  requiredValueFalg:any
  validateTaxRates() {
    let isValid = 1
    this.taxTypeList.forEach((element,index )=> {
      if ( this.taxTypeList[index].taxrate > 0) {
        this.taxTypeList[index]['taxrateFlag'] = false
      } else {
       this.taxTypeList[index]['taxrateFlag'] = true
        isValid = 0
      }
    });

    return !!isValid
  }
  invalidObjSlab: any = {}
  checkValidation() {
    
    let isValid3 = 1
    if (this.slab !== '' && this.slab.length > 3 ) {
      this.invalidObjSlab['slab'] = false
    } else {
      this.invalidObjSlab['slab'] = true
      isValid3 = 0
    }

    return !!isValid3
  }

  @ViewChild('first') first: ElementRef
  addTax() {
    this.submitClick = true
    this.addtaxrates()
    this.checkValidation()
    this.select2Validation()
    if (this.TypeUid > 0) {
   //   if (this.taxrates.length > UIConstant.ZERO) {

        this._taxMasterServices.addTax(this.taxParams()).subscribe(Data => {
          if (Data.Code === UIConstant.THOUSAND) {
            if (this.keepOpen) {
              let savename = this.editMainID===0 ? UIConstant.SAVED_SUCCESSFULLY :UIConstant.UPDATE_SUCCESSFULLY
              this.toastrCustomService.showSuccess('', savename)
              this.commonService.newTaxAdded()
              this.taxTypeList = []
              this.clearForm()
               this.getTypeOfTax(true,this.TypeUid)
              
               this.id =0
               
              // setTimeout(() => {
              //   const element = this.first.nativeElement
              //   element.focus({ preventScroll: false })
              // }, 1000)
             
              
            } else {
              // setTimeout(() => {
              //   const element = this.first.nativeElement.focus()
              //   element.focus({ preventScroll: false })
              // }, 1000)
              //this._commonGetSetServices.setTax(Data.Data)
              const dataToSend = { id: Data.Data, name: this.slab }
              this.commonService.newTaxAdded()
              this.commonService.closeTax(dataToSend)
              let savename = this.editMainID===0 ? UIConstant.SAVED_SUCCESSFULLY :UIConstant.UPDATE_SUCCESSFULLY
               this.EditFlag = true
              this.toastrCustomService.showSuccess('',savename)
            //  this.selectTaxTpye = [{ id: '1', text: 'GST' }, { id: '2', text: 'VAT' }, { id: '3', text: 'Other' }]
            }
          }
          if (Data.Code === UIConstant.THOUSANDONE) {
            this.toastrCustomService.showInfo('', Data.Description)
          }
          if (Data.Code === UIConstant.SERVERERROR) {
            this.toastrCustomService.showInfo('', Data.Description)
          }
          if(Data.Code === UIConstant.REQUIRED_5020){
            this.toastrCustomService.showError('', Data.Data)
            
          }
        })
    //  } 
     // else {
        //this.toastrCustomService.showWarning('', 'Please Enter Rate!')
       // this.CheckButton.nativeElement.focus()

     // }
    }
  }

  private taxParams(): TaxModule {
    const taxElement = {
      taxObj: {
        Id: this.id ===0 ? 0 : this.editMainID,
        Slab: this.slab,
        Type: this.TypeUid,
        taxrates: this.taxrates
      } as TaxModule
    }
    console.log(JSON.stringify( taxElement.taxObj) ,'tax-Request')
    return taxElement.taxObj
  }

  /* select2 validation */

  select2Validation() {
    if (this.type > UIConstant.ZERO) {
      this.select2Error = false
    } else {
      this.select2Error = true
      this.errorMassage = ErrorConstant.REQUIRED
    }
  }
  /* ...................completed................. */
  currencyValues: any
  texboxDiv() {
    if (this.taxboxDivVisibale === true) {
      this.taxboxDivVisibale = false
    } else {
      this.taxboxDivVisibale = true
      //this.addPulsFuctionality()
    }
  }

  deleteArrayMobileType(i) {
    if (this.taxrates.length > 0) {
      this.taxrates.splice(i, 1)
    }
  }
  ParentTypeId: 5
  CodeId: any
  editFlg: boolean = true

  editRowItem(i, item) {
    this.checkBoxYes = false
    if (this.editFlg) {
      this.editFlg = false
      this.taxrRateId = this.taxrates[i].Id
      this.taxrate = this.taxrates[i].Rate
      this.taxName = this.taxrates[i].Name
      this.CurrencyName = this.taxrates[i].CurrencyName
      this.CurrencyId = this.taxrates[i].ValueType
      this.isForOtherState = this.taxrates[i].IsotherState
      this.deleteArrayMobileType(i)
    }
    else {
      this.toastrCustomService.showWarning('', 'First edit Tax')
    }
  }
  saveTaxRate: boolean = false
  taxrRateId: any
  addConctFlag: boolean = false
  addtaxrates() {
    this.taxrates=[]
    this.saveTaxRate = true
    this.editFlg = true
   if(this.validateTaxRates()) {
    this.taxTypeList.forEach(element => {
      if(element.taxrate>0){
        this.taxrates.push({
          Id: element.Id,
          Rate: element.taxrate,
          Name: element.Name,
          TaxTitleId:element.TaxTitleId,
          ValueType:  this.CurrencyId,
          IsotherState: element.isForOtherState
        })
      }

    });
   }



      
        this.isForOtherState = true

  }
  checkBoxYes: boolean
  selectKeyChecked(event) {
    if ((event.keyCode ? event.keyCode : event.which) == 13) {
      if (event.target.checked) {
        this.isForOtherState = false
      }
      else {
        this.isForOtherState = true
      }

    }

  }

  clearForm() {
    this.taxrate = 0
    this.slab = ''
   this.EditFlag = true
  
    //this.isForOtherState = true

  }
  @ViewChild('checkBtn_focs') CheckButton
  // enterPressItem(e: KeyboardEvent) {
  //   this.addtaxrates()
  //   setTimeout(() => {
  //     this.CheckButton.nativeElement.focus()
  //   }, 10)

  // }



  SaveOnF10(event) {
    if ((event.keyCode ? event.keyCode : event.which) == 121) {
     // this.addTax()

    }

  }
}
