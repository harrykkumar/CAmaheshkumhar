import { Component, Output, EventEmitter, ViewChild, Renderer2 } from '@angular/core'
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
  addPulsSign: any
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
  public selectTaxTpye: Array<Select2OptionData>
  modalSub: Subscription
  constructor (public toastrCustomService: ToastrCustomService , private _taxMasterServices: TaxMasterService,
    private _formBuilder: FormBuilder,
    private _commonGetSetServices: CommonSetGraterServices,
    private commonService: CommonService,
    private renderer: Renderer2
    ) {
  //  this.selectTaxTpye = [{ id: '1', text: 'GST' }, { id: '2', text: 'VAT' },{ id: '3', text: 'Other' }]

    this.formTax()
   // this.getSelectTaxType(0)
    this.modalSub = this.commonService.getTaxStatus().subscribe(
      (data: AddCust) => {
        if (data.open) {
          if (data.editId === '') {
            this.editMode = false
          } else {
            this.editMode = true
            this.id = data.editId
          }
          this.openModal()
        } else {
          this.closeModal()
        }
      }
    )
  }

  currencies: Array<any> = []
  getAvailableCurrency () {
    let _self = this
    this.commonService.setupSettingByType(UIConstant.SALE_TYPE).subscribe(Settings => {
      _self.currencies = []
      if (Settings.Code === UIConstant.THOUSAND) {
        let currencies = Settings.Data.SetupSettings
        currencies.forEach(element => {
          if (+element.SetupId === 37 && +element.Type === 3) {
            //// debugger;
          //   this.currencies = [{ cuyId: 0, id: 0, val: '%' }]

            _self.currencies.push({
              cuyId:1,
              id: element.Id,
              val: element.Val
            })
          }
        })
         // console.log('currencies available : ', _self.currencies)
      }
    }
    )
  }

  ngOnDestroy () {
    this.modalSub.unsubscribe()
    this.subscribe.unsubscribe()
  }
  ngOnInit(){

      //this.getSelectTaxType(0)
  }


  get f () { return this.taxForm.controls }

  openModal () {

   // this.currencies =[{id:0 , val:'%'}]
    if (this.taxForm.valid) {
      this.taxForm.reset()
    }
    if (this.editMode) {
      this.getTaxEditData(this.id)
    } else {
      this.id = UIConstant.ZERO
      this.taxForm.reset()
      this.type = UIConstant.ZERO
    
    }
  
    this.addPulsSign = []
    this.taxboxDivVisibale = false
    this.plusValue = 0
    this.getAvailableCurrency()
    this.taxboxDivVisibale = false
    this.submitClick = false
   //
    $('#add_tax').modal(UIConstant.MODEL_SHOW)
      this.getSelectTaxType(0)
  }

  @ViewChild('taxtype_select2') taxtypeSelect2: Select2Component
  closeModal () {
    if ($('#add_tax').length > 0) {
      this.clearValidation()
      this.addPulsSign = []
      this.taxboxDivVisibale = false
      this.plusValue = 0
      this.taxboxDivVisibale = false
      this.submitClick = false
      this.id = UIConstant.ZERO
     // this.type = UIConstant.ZERO
      $('#add_tax').modal(UIConstant.MODEL_HIDE)
    }
  }
  clearValidation () {
    this.taxForm.reset()
    this.type = UIConstant.ZERO
    this.getSelectTaxType(0)
  }
  private formTax () {
    this.taxForm = this._formBuilder.group({
      'slab': [UIConstant.BLANK, Validators.required],
      'taxRateName': [UIConstant.BLANK],
      'taxRate': [UIConstant.BLANK]
    })
  }

  taxErrMsg: any
  taxErrorFlag: any
  taxErrormass: any
  taxType: any
  getTaxEditData (id) {
    debugger
    this.taxboxDivVisibale = true
    this.subscribe = this._taxMasterServices.editTax(id).subscribe(Data => {
      //console.log('tax edit : ', Data)
      if (Data.Data && Data.Data.TaxRates.length > 0) {
        this.addPulsSign = []
        for (let i = 0 ; i < Data.Data.TaxRates.length; i++) {
        
          this.addPulsSign.push({
            id: Data.Data.TaxRates[i].Id,
            name: Data.Data.TaxRates[i].Name,
            taxRate: Data.Data.TaxRates[i].TaxRate,
            valueType: Data.Data.TaxRates[i].ValueType,
            isForOtherState: Data.Data.TaxRates[i].IsForOtherState
          })
          if (this.addPulsSign[i].isForOtherState === true) {
           $('#customCheck' + i).prop('checked', true)
          } else {
            $('#customCheck' + i).prop('checked', false)
          }

        }
      } else {
        this.addPulsSign = []
      }
      if (Data.Data && Data.Data.TaxSlabs.length > 0) {
        this.taxForm.controls.slab.setValue(Data.Data.TaxSlabs[0].Slab)
        this.type = Data.Data.TaxSlabs[0].Type
        this.getSelectTaxType(this.type)
      //  this.taxType = Data.Data.taxSlabs
        // this.selectTaxTpye = [{ id: Data.Data.taxSlabs[0].type, text: Data.Data.taxSlabs[0].typeName }, { id: '1', text: 'GST' }, { id: '2', text: 'VAT' },{ id: '3', text: 'Other' }]
      }
    })
  }
taxTypeId:any
taxTypeName:any
  getSelectTaxType (value) {
    let data;
    this.selectTaxTpye = []
    this.selectTaxTypePlaceHolde = { placeholder: 'Select Tax Type' }
    this.selectTaxTpye = [{ id: '1', text: 'GST' }, { id: '2', text: 'VAT' },{ id: '3', text: 'Other' }]

    this.type = this.selectTaxTpye[0].id
    this.deafaultValue = this.selectTaxTpye[0].id

    if(value > 0){
       data = this.selectTaxTpye.filter(s=> JSON.parse(s.id) === value)
      //console.log(data ,'jjj')
    this.deafaultValue = data[0].id

    }
    // this.deafaultValue = this.selectTaxTpye[0].id

   // this.taxTypeName = this.s.electTaxTpye[0].text
  }
  addPulsFuctionality () {
    this.taxErrMsg = $('#taxErrMsg')
    this.taxErrMsg.text('')
    let boolCheck = false

    if (this.addPulsSign.length > 0) {
      for (let i = 0; i < this.addPulsSign.length; i++) {
        if ($('#taxrateName' + i).val() !== '') {
         // document.getElementById('taxRate' + i).className += ' successTextBoxBorder'
         // document.getElementById('taxRate' + i).classList.remove('errorTextBoxBorder')

          if ($('#taxRate' + i).val() > 0) {
            boolCheck = true
            this.taxErrorFlag = false
          } else {
            this.taxErrorFlag = true
            boolCheck = false
            break
          }
        } else {
          $('#taxrateName' + i).focus()
          this.taxErrorFlag = true
          document.getElementById('taxRate' + i).className += ' errorTextBoxBorder'
          boolCheck = false
          break
        }
      }
    }
    if (boolCheck) {
      this.addPulsSign.push({
        id: 0,
        Rate: undefined,
        Name: undefined,
        ValueType: undefined,
        Isforotherstate: undefined
      })
    }
    if (this.addPulsSign.length === 0) {
      this.addPulsSign.push({
        id: 0,
        Rate: undefined,
        Name: undefined,
        ValueType: undefined,
        Isforotherstate: undefined
      })
    }
  }

  selectedTaxType (event) {
    if (event.value && event.data.length >0) {
      this.type = event.value
     // this.select2Error = false
    }

  }
  taxId: any
  getTaxFormValue () {
    // debugger;
    this.taxrates = []
    for (let i = 0; i < this.addPulsSign.length; i++) {
     if ($('#exampleFormControlSelect1' + i).val() === '') {
          $('#exampleFormControlSelect1' + i).val("0")
        }
      if ($('#taxrateName' + i).val() !== UIConstant.BLANK && $('#taxRate' + i).val() >= 0) {
        if (($('#customCheck' + i).prop('checked') === true)) {
          this.taxrates.push({
            Id: this.addPulsSign[i].id !== 0 ? this.addPulsSign[i].id : 0,
            Rate: $('#taxRate' + i).val(),
            Name: $('#taxrateName' + i).val(),
            ValueType: $('#exampleFormControlSelect1' + i).val(),
            IsotherState: UIConstant.ONE
          })
        } else {
          this.taxrates.push({
            Id: this.addPulsSign[i].id !== 0 ? this.addPulsSign[i].id : 0,
            Rate: $('#taxRate' + i).val(),
            Name: $('#taxrateName' + i).val(),
            ValueType: $('#exampleFormControlSelect1' + i).val(),
            IsotherState: UIConstant.ZERO
          })
        }
      }
    }
  }

  addTax () {
    this.submitClick = true
    this.getTaxFormValue()
    this.select2Validation()
    if (this.taxForm.valid && JSON.parse(this.type) > UIConstant.ZERO) {
      if (this.taxrates.length > UIConstant.ZERO) {

        this._taxMasterServices.addTax(this.taxParams()).subscribe(Data => {
        //  console.log('tax add : ', Data)
          if (Data.Code === UIConstant.THOUSAND) {
            $('#add_tax').modal(UIConstant.MODEL_HIDE)
            this._commonGetSetServices.setTax(Data.Data)
            const dataToSend = { id: Data.Data, name: this.taxForm.value.slab }
            this.commonService.newTaxAdded()
            this.commonService.closeTax(dataToSend)
            this.toastrCustomService.showSuccess('Success','Saved Successfully!')
            this.selectTaxTpye = [{ id: '1', text: 'GST' }, { id: '2', text: 'VAT' },{ id: '3', text: 'Other' }]

          }
          if(Data.Code ===UIConstant.THOUSANDONE){
            this.toastrCustomService.showInfo('Info',Data.Description)

          }
        })

      } else {
        this.toastrCustomService.showWarning('Warning','fill tax name & tax rate!')
      }
    }

  }

  private taxParams (): TaxModule {
    // debugger;
    const taxElement = {
      taxObj: {
        Id: this.id,
        Slab: this.taxForm.value.slab,
        Type: this.type,
        taxrates: this.taxrates
      } as TaxModule
    }
    return taxElement.taxObj
  }

    /* select2 validation */

  select2Validation () {
    if (this.type > UIConstant.ZERO) {
      this.select2Error = false
    } else {
      this.select2Error = true
      this.errorMassage = ErrorConstant.REQUIRED
    }
  }
    /* ...................completed................. */

  texboxDiv () {
    if (this.taxboxDivVisibale === true) {

      this.taxboxDivVisibale = false
    } else {
      this.taxboxDivVisibale = true
      this.addPulsFuctionality()
    }
  }
  deleteTaxArray (i) {
    if (this.addPulsSign.length > 1) {
      this.addPulsSign.splice(i, 1)
    } else if (i === 0) {
      this.addPulsSign.splice(i, 1)
      this.addPulsSign.push({
        id: 0,
        Rate: undefined,
        Name: undefined,
        ValueType: undefined,
        Isforotherstate: undefined
      })
    }
    this.taxErrorFlag = false
  }

}
