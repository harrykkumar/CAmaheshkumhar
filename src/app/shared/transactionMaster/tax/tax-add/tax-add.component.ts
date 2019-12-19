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
import { GlobalService } from '../../../../commonServices/global.service'
import { viewClassName } from '@angular/compiler';

declare var $: any
@Component({
  selector: 'app-tax-add',
  templateUrl: './tax-add.component.html',
  styleUrls: ['./tax-add-component.css']
})
export class TaxAddComponent {
  @Output() onFilter = new EventEmitter()
  @ViewChild('taxSlabRef') taxSlabRef: ElementRef
  taxTypeList: any
  IGSTDisabledBox: boolean
  SGSTDisabledBox: boolean
  gstApplyedMethod: any
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
  taxErrMsg: any
  taxErrorFlag: any
  taxErrormass: any
  taxType: any
  taxboxDivVisibale: boolean
  selectTaxTypePlaceHolde: Select2Options
  editMode: boolean
  selectTaxTpye: any
  modalSub: Subscription
  keepOpen: boolean = false
  currencies: any = []
  editMainID: any
  ParentTypeId: 5
  CodeId: any
  editFlg: boolean = true
  slab: any
  taxrate: any
  taxName: any
  CurrencyType: any
  invalidObjCont: any = {}
  requiredValueFalg: any
  setDate: any
  taxTypeId: any
  taxTypeName: any
  EditFlag: any
  TypeUid: any
  taxId: any
  CurrencyName: any
  CurrencyId: any
  isForOtherState: any
  invalidObjSlab: any = {}
  @ViewChild('first') first: ElementRef
  saveTaxRate: boolean = false
  taxrRateId: any
  addConctFlag: boolean = false
  checkBoxYes: boolean
  @ViewChild('checkBtn_focs') CheckButton

  constructor(public _globalService: GlobalService,
    public toastrCustomService: ToastrCustomService,
    private _taxMasterServices: TaxMasterService,
    private _formBuilder: FormBuilder,
    private commonService: CommonService,

  ) {

    this.modalSub = this.commonService.getTaxStatus().subscribe(
      (data: AddCust) => {
        if (data.open) {
          if (data.editId === '') {
            this.editMode = false
            this.id = 0
            this.editMainID = 0
          } else {
            this.editMode = true
            this.id = data.editId
            this.editMainID = data.editId
          }
          this.openModal()
        } else {
          this.closeModal()
        }
      }
    )
  }

  getAvailableCurrency() {
    let _self = this
    this.commonService.setupSettingByType(UIConstant.SALE_TYPE).subscribe(Settings => {
      _self.currencies = [{ id: '0', text: '%' }]
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
  }

  getTaxName() {
    this.selectTaxTpye = []
    let localdata = []
    this.subscribe = this._taxMasterServices.getTaxTypeName().subscribe(Data => {
      if (Data.Code === UIConstant.THOUSAND) {
        Data.Data.forEach(element => {
          if (element.UnderId === 0) {
            localdata.push({
              id: element.UId,
              text: element.Name,
              uid: element.UId,
            })
          }
        });
      }
      this.selectTaxTpye = localdata
    })

  }
  openModal() {
    this.clearForm()
    this.TypeUid = 0
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
    this.first.nativeElement.focus()

    }, 500)
  }


  getTypeOfTax(addEditModeFlg, selectedTaxId) {
    if (addEditModeFlg) {
      this.taxTypeList = []
      this.subscribe = this._taxMasterServices.getTaxSalbName(selectedTaxId).subscribe(Data => {
        if (Data.Code === UIConstant.THOUSAND) {
          Data.Data.TaxRates.forEach(element => {
            this.gstApplyedMethod = element.ApplyMethod
            if (selectedTaxId === element.UnderId && element.ApplyMethod === UIConstant.GST_APPLY_METHOD_TYPE1) {
              this.IGSTDisabledBox = element.IsForOtherState === true ? true : false
            } else
              if (selectedTaxId === element.UnderId && element.ApplyMethod === UIConstant.GST_APPLY_METHOD_TYPE2) {
                this.IGSTDisabledBox = element.IsForOtherState === true ? false : true
              }
              else if (selectedTaxId === element.UnderId && element.ApplyMethod === 0) {
                this.IGSTDisabledBox = false
              }
            this.taxTypeList.push({
              Name: element.Name,
              TaxTitleId: element.TaxTitleId,
              Id: element.Id,
              DisabledBox: this.IGSTDisabledBox,
              ApplyMethod: element.ApplyMethod,
              taxrate: 0,
              isForOtherState: element.IsForOtherState,
              ValueType: element.ValueType,
              IsOptional: element.IsOptional,
              groupid: element.GroupId,
              type: selectedTaxId
            })

          });
        }
        if (Data.Code === UIConstant.SERVERERROR) {
          this.toastrCustomService.showError('', Data.Description)
        }
      })
    }

  }
  validateTaxRates() {
    let AllrateZero = []
    let optiinalData = []
    let isValid = 1
    this.saveTaxRate = true
    this.taxTypeList.forEach((element, index) => {
      if (this.taxTypeList[index].taxrate !== null && this.taxTypeList[index].taxrate !== '') {
        if (this.taxTypeList[index].type === 1) {
          isValid = 1
          AllrateZero = this.taxTypeList.filter(
            rate => (rate.taxrate === 0 && rate.groupid === 1)
          )
          if (AllrateZero.length > 0) {
            if (!AllrateZero[0].isForOtherState) {
              if (AllrateZero[0].taxrate > 0 && AllrateZero[0].groupid === 1) {
              }
              else {
                isValid = 0
              }
            }
            else{
              isValid = 1
            }

          }
          optiinalData = this.taxTypeList.filter(
            val => (val.IsOptional === false && val.groupid === 2)
          )
          if (optiinalData.length > 0) {
            if (optiinalData[0].taxrate > 0 && optiinalData[0].groupid === 2) {

            }
            else {
              isValid = 0

            }
          }
        }
        else {
          if (this.taxTypeList[index].taxrate > 0) {
          }
          else {
            isValid = 0
          }
        }
      }
      else {
        this.taxTypeList[index].taxrate = 0
      }
    })

    return !!isValid
  }


  TaxRateEntry(event, groupId) {
    if (groupId === 1) {
      this.taxTypeList.forEach((element, index) => {
        if (this.taxTypeList[index].ApplyMethod === UIConstant.GST_APPLY_METHOD_TYPE2 && this.taxTypeList[index].groupid === 1 && this.taxTypeList[index].isForOtherState === true) {
          this.taxTypeList[index + 1].taxrate = event.target.value / 2
          this.taxTypeList[index + 2].taxrate = event.target.value / 2

        }
        else if (this.taxTypeList[index].ApplyMethod === UIConstant.GST_APPLY_METHOD_TYPE1 && this.taxTypeList[index].groupid === 1 && this.taxTypeList[index].isForOtherState === false) {

          let a = this.taxTypeList[1].taxrate
          let b = this.taxTypeList[2].taxrate
          this.taxTypeList[0].taxrate = a + b
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


  getTaxEditData(id) {
    this.EditFlag = false
    this.taxboxDivVisibale = true
    this.subscribe = this._taxMasterServices.editTax(id).subscribe(Data => {
      if (Data.Code === UIConstant.THOUSAND) {
        console.log('tax-response :-', JSON.stringify(Data))
        if (Data.Data && Data.Data.TaxRates.length > 0) {
          this.taxTypeList = []

          for (let i = 0; i < Data.Data.TaxRates.length; i++) {
            if (Data.Data.TaxRates[i].ApplyMethod === UIConstant.GST_APPLY_METHOD_TYPE1) {
              this.IGSTDisabledBox = Data.Data.TaxRates[i].IsForOtherState === true ? true : false
            } else
              if (Data.Data.TaxRates[i].ApplyMethod === UIConstant.GST_APPLY_METHOD_TYPE2) {
                this.IGSTDisabledBox = Data.Data.TaxRates[i].IsForOtherState === true ? false : true
              }
              else if (Data.Data.TaxRates[i].ApplyMethod === 0) {
                this.IGSTDisabledBox = false
              }
            this.taxTypeList.push({
              Name: Data.Data.TaxRates[i].Name,
              TaxTitleId: Data.Data.TaxRates[i].TaxTitleId,
              Id: Data.Data.TaxRates[i].Id,
              DisabledBox: this.IGSTDisabledBox,
              ApplyMethod: Data.Data.TaxRates[i].ApplyMethod,
              taxrate: Data.Data.TaxRates[i].TaxRate,
              isForOtherState: Data.Data.TaxRates[i].IsForOtherState,
              ValueType: Data.Data.TaxRates[i].ValueType,
              IsOptional: Data.Data.TaxRates[i].IsOptional,
              CurrencyName: Data.Data.TaxRates[i].ValueType,
              groupid: Data.Data.TaxRates[i].GroupId,
              type: Data.Data.TaxSlabs[0].Type

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
          this.deafaultValue = Data.Data.TaxSlabs[0].Type
          let localdata = [{ id: Data.Data.TaxSlabs[0].Type, text: Data.Data.TaxSlabs[0].TypeName }]
          this.selectTaxTpye = localdata
          this.taxtypeSelect2.setElementValue(this.deafaultValue)
        }
      }
      if (Data.Code === UIConstant.SERVERERROR) {
        this.toastrCustomService.showError('', Data.Description)
      }

    })
  }
  selectedTaxType(event) {
    if (event.value && event.data.length > 0) {
      this.TypeUid = +event.data[0].id
      if (this.editMode && !this.EditFlag) {
        this.getTypeOfTax(false, this.TypeUid)
      }
      else {
        this.getTypeOfTax(true, this.TypeUid)

      }
    }

  }
  onSelectCurrency(event) {

    if (event.data.length > 0) {
      if (event.data && event.data[0].text) {
        this.CurrencyId = event.value
        this.CurrencyName = event.data[0].text
      }
    }

  }

  setDueDate() {
  }


  checkValidation() {
    let isValid3 = 1
    if (this.slab !== '' && this.slab.length > 3) {
      this.invalidObjSlab['slab'] = false
    } else {
      this.invalidObjSlab['slab'] = true
      isValid3 = 0
    }

    return !!isValid3
  }

  addTax() {
    this.submitClick = true
    this.addtaxrates()
    this.checkValidation()
    this.select2Validation()
    if (this.TypeUid > 0 && this.slab !== '') {
      if (this.validateTaxRates()) {
        this._taxMasterServices.addTax(this.taxParams()).subscribe(Data => {
          if (Data.Code === UIConstant.THOUSAND) {
            if (this.keepOpen) {
              let savename = this.editMainID === 0 ? UIConstant.SAVED_SUCCESSFULLY : UIConstant.UPDATE_SUCCESSFULLY
              this.toastrCustomService.showSuccess('', savename)
              this.commonService.newTaxAdded()
              this.taxTypeList = []
              this.clearForm()
              this.getTypeOfTax(true, this.TypeUid)
              this.id = 0
            } else {
              const dataToSend = { id: Data.Data, name: this.slab }
              this.commonService.newTaxAdded()
              this.commonService.closeTax(dataToSend)
              let savename = this.editMainID === 0 ? UIConstant.SAVED_SUCCESSFULLY : UIConstant.UPDATE_SUCCESSFULLY
              this.EditFlag = true
              this.toastrCustomService.showSuccess('', savename)
            }
          }
          if (Data.Code === UIConstant.THOUSANDONE) {
            this.toastrCustomService.showInfo('', Data.Description)
          }
          if (Data.Code === UIConstant.SERVERERROR) {
            this.toastrCustomService.showInfo('', Data.Description)
          }
          if (Data.Code === UIConstant.REQUIRED_5020) {
            this.toastrCustomService.showError('', Data.Data)

          }
        })
     }
      // else {
      //   this.toastrCustomService.showError('', 'Please Fill Rate')
      //   this.rateref.nativeElement.focus()
      // }

    }else{
      this.first.nativeElement.focus()

    }
  }
@ViewChild('rateref') rateref : ElementRef

  private taxParams(): TaxModule {
    const taxElement = {
      taxObj: {
        Id: this.id === 0 ? 0 : this.editMainID,
        Slab: this.slab,
        Type: this.TypeUid,
        taxrates: this.taxrates
      } as TaxModule
    }
    console.log(JSON.stringify(taxElement.taxObj), 'tax-Request')
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

  addtaxrates() {
    this.taxrates = []
    this.saveTaxRate = true
    this.editFlg = true
    this.taxTypeList.forEach((element) => {
      this.taxrates.push({
        Id: element.Id,
        Rate: element.taxrate,
        Name: element.Name,
        TaxTitleId: element.TaxTitleId,
        ValueType: this.CurrencyId,
        IsotherState: element.isForOtherState
      })
    });
    this.isForOtherState = true

  }

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


  }

  SaveOnF10(event) {
    if ((event.keyCode ? event.keyCode : event.which) == 121) {

    }

  }
}
