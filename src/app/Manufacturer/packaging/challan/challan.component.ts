import { Component, ViewChild } from '@angular/core';
import { Settings } from '../../../shared/constants/settings.constant';
import { GlobalService } from '../../../commonServices/global.service';
import { Select2OptionData, Select2Component } from 'ng2-select2';
import { Subject, forkJoin } from 'rxjs';
import { ItemTaxTrans, AdditionalCharges } from '../../../model/sales-tracker.model';
import { Subscription } from 'rxjs/Subscription';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { PurchaseService } from 'src/app/inventory/purchase/purchase.service';
import { ToastrCustomService } from 'src/app/commonServices/toastr.service';
import { takeUntil } from 'rxjs/operators';
import { UIConstant } from 'src/app/shared/constants/ui-constant';
import { FormConstants } from 'src/app/shared/constants/forms.constant';
import { PackagingService } from '../packaging.service';
declare const $: any
@Component({
  selector: 'packaging-challan',
  templateUrl: './challan.component.html'
})
export class PackagingChallanComponent {
  onDestroy$ = new Subject()
  loading: boolean = true
  godownsData: Array<Select2OptionData>
  referralTypesData: Array<Select2OptionData>
  referralData: Array<Select2OptionData>
  taxTypeData: Array<Select2OptionData>
  taxSlabsData: Array<Select2OptionData>
  chargesData: Array<Select2OptionData>
  godownValue: number
  referralTypesValue: number
  referralValue: number
  taxSlabValue: number
  addressValue: string
  LedgerChargeValue: number
  AmountChargeValue: number
  TaxSlabChargeValue: number

  ledgerChargeValue: number
  taxSlabChargeValue: number

  clientDateFormat: string = ''

  LedgerChargeId: number
  LedgerName: string
  AmountCharge: number
  TaxableAmountCharge: number
  TaxSlabChargeId: number
  TaxChargeName: string
  TaxAmountCharge: number
  TotalAmountCharge: number
  taxChargeSlabType: number
  taxChargeRates: Array<any> = []
  TaxTypeCharge: number = 0
  itemTaxTrans: Array<ItemTaxTrans> = []
  taxTypeChargeName: string
  addItemDisbaled: boolean = true
  BillDiscount: number
  BillDiscountType: number
  BillDiscountAmt: number
  Paymode: string
  PayModeId: number
  LedgerId: number
  Amount: number
  BankLedgerName: string
  ChequeNo: string
  PayDate: string
  paymode: number
  ledger: number

  ItemTransId: number
  AttributeId: number
  ParentTypeId: number
  name: string

  ItemTaxTrans = []
  TaxTypeTax: number
  AmountTax: number
  ItemTransTaxId: number
  ParentTaxId: number
  ParentTypeTaxId: number
  ItemTransTypeTax: number
  TaxRateNameTax: string
  TaxRateId: number
  TaxRate: number
  ValueType: number
  TaxSlabName: string
  editChargeSno: number = 0

  taxSlabType: number
  taxRates: Array<any> = []
  BillAmount: number
  BillDate: string
  CurrentDate: string
  ChallanNo: string
  Id: number
  PartyId: number
  ReferralId: number
  ReferralTypeId: number
  ReferralComission: number
  ReferralComissionTypeId: number
  ReverseCharge: number
  ReverseTax: number
  Cess: number
  CessAmount: number
  RoundOff: number
  RoundOffManual: number
  SubTotalAmount: number
  TotalTaxAmount: number
  TotalChallan: number
  VehicleNo: string
  Drivername: string
  Transportation: string
  OtherCharge: number
  GodownId: number
  LocationTo: string
  AdditionalCharges: Array<AdditionalCharges> = []
  categoryId: number
  AddressId: number
  editTransId: number = -1
  editItemId: number = -1
  editItemSno: number = 0
  editChargeId: number = -1
  validItem: boolean = true
  validDiscount: boolean = true
  validTransaction: boolean = true
  validCharge: boolean = true
  clickItem = false
  clickTrans = false
  clickCharge = false

  allItems: any = []
  ReferralCommissionTypeId: number
  ReferralCommission: number
  CommissionAmount: number

  settingData: any = []
  isOtherState: boolean = true
  editMode: boolean = false
  parentMostCategory: number = 0
  submitSave: boolean = false
  industryId: number = 0


  formReadySub = new Subject<boolean>()
  fromReady$ = this.formReadySub.asObservable()
  settings$: Subscription
  invalidObj: any = {}
  previousBillNo: string = ''
  keepOpen: boolean = false
  isAddNew: boolean = false
  BillDiscountApplied: any = []
  creatingForm: boolean = false

  orderStr = ''
  TransactionNoSetups: any
  loadingSummary: boolean = false
  masterData: any = {}
  constructor(private commonService: CommonService,
    private _ps: PackagingService,
    private purchaseService: PurchaseService,
    private toastrService: ToastrCustomService,
    private settings: Settings,
    private gs: GlobalService) {
    this.clientDateFormat = this.settings.dateFormat;
    this._ps.openChallan$.subscribe(
      (status: any) => {
        if (status.open && status.data.bOrderId && status.data.orderStr) {
          this.orderStr = status.data.orderStr
          this.getSPUtilityData()
          this.openModal()
          this.getAddressTaxType(status.data.bOrderId)
        } else {
          this.closeModal()
        }
      }
    )

    this.purchaseService.godownsData$.pipe(takeUntil(this.onDestroy$)).subscribe(
      data => {
        if (data.data) {
          this.godownsData = data.data
          if ( this.godownsData.length === 1) {
            // this.masterData.GodownId = + godownsData[0].id
            this.godownValue = + this.godownsData[0].id
          }
        }
      }
    )
    this.purchaseService.referralTypesData$.pipe(takeUntil(this.onDestroy$)).subscribe(
      data => {
        if (data.data) {
          this.referralTypesData = data.data
        }
      }
    )
    this.purchaseService.referralData$.pipe(takeUntil(this.onDestroy$)).subscribe(
      data => {
        if (data.data) {
          this.referralData = data.data
        }
      }
    )
    this.purchaseService.taxSlabsData$.pipe(takeUntil(this.onDestroy$)).subscribe(
      data => {
        if (data.data) {
          this.taxSlabsData = data.data
        }
      }
    )

    this.purchaseService.chargestData$.pipe(takeUntil(this.onDestroy$)).subscribe(
      data => {
        if (data.data) {
          this.chargesData = data.data
        }
      }
    )
  }

  getAddressTaxType (bOrderId) {
    this._ps.getAddressTaxType(bOrderId).subscribe(
      (data) => {
        console.log(data)
        this.isOtherState = data[0].IsForOtherState
        this.addressValue = data[0].AddressName
        this.vendorGSTType = data[0].TaxTypeId
      }
    )
  }

  getSPUtilityData () {
    this.loading = true
    let _self = this
    this.gs.manipulateResponse(this.commonService.getSPUtilityData(UIConstant.PACKAGINGCHALLAN)).subscribe(
      data => {
        console.log('sputility data : ', data)
        _self.purchaseService.createGodowns(data.Godowns)
        _self.purchaseService.createReferralTypes(data.ReferalTypes)
        _self.purchaseService.createTaxSlabs(data.TaxSlabs)
        _self.purchaseService.createReferral(data.Referals)
        _self.purchaseService.createCharges(data.LedgerCharges)
        _self.setBillNo(data.TransactionNoSetups)
        this.setCurrentDate(data.TransactionNoSetups)
      },
      (error) => {
        console.log(error)
        this.loading = false
        this.toastrService.showError(error, '')
      },
      () => {
        setTimeout(() => {
          this.loading = false
        }, 1)
      }
    )
  }

  openModal() {
    this.showHideItemCharge = true
    this.taxTypeData = [
      { id: '0', text: 'Exclusive' },
      { id: '1', text: 'Inclusive' }
    ]
    $('#challan-modal').modal(UIConstant.MODEL_SHOW)
  }

  closeModal() {
    this.resetForm()
    if ($('#challan-modal').length > 0) {
      this.submitSave = false
      $('#challan-modal').modal(UIConstant.MODEL_HIDE)
    }
  }

  setBillNo(setups) {
    if (setups && setups.length > 0) {
      this.ChallanNo = setups[0].BillNo
    }
  }
  setCurrentDate(setups) {
    if (setups && setups.length > 0) {
      this.CurrentDate = this.gs.utcToClientDateFormat(setups[0].CurrentDate, this.clientDateFormat)
    }
  }

  appliedTaxRatesCharge: any = []
  calculate() {
    this.TaxableAmountCharge = +this.AmountCharge
    if (this.taxChargeRates.length > 0 && +this.AmountCharge > 0) {
      if (this.TaxTypeCharge === 0) {
        let returnTax = this.purchaseService.taxCalculation(this.taxChargeRates,
          this.taxChargeSlabType,
          +this.AmountCharge,
          this.isOtherState, FormConstants.ChargeForm, this.TaxChargeName)
        this.TaxAmountCharge = +(returnTax.taxAmount).toFixed(4)
        this.appliedTaxRatesCharge = returnTax.appliedTaxRates
      } else {
        if (this.TaxTypeCharge === 1) {
          let AmountCharge = this.purchaseService.calcTaxableAmountType1(this.taxChargeRates,
            this.taxChargeSlabType, +this.AmountCharge, this.isOtherState)
          console.log('amount charge : ', AmountCharge)
          this.TaxableAmountCharge = +AmountCharge.toFixed(2)
          let returnTax = this.purchaseService.taxCalCulationForInclusive(this.taxChargeRates,
            this.taxChargeSlabType,
            +AmountCharge,
            this.isOtherState, FormConstants.ChargeForm, this.TaxChargeName)
          this.TaxAmountCharge = +(returnTax.taxAmount).toFixed(4)
          this.appliedTaxRatesCharge = returnTax.appliedTaxRates
        }
      }
    } else if (this.editChargeId === -1) {
      this.TaxAmountCharge = 0
    }
    // console.log('TaxAmountCharge : ', this.TaxAmountCharge)
    if (+this.AmountCharge > 0) {
      this.TotalAmountCharge = +(+this.AmountCharge + + ((this.TaxTypeCharge === 0) ? 
      (isNaN(+this.TaxAmountCharge) ? 0 : +this.TaxAmountCharge) : 0)).toFixed(2)
    } else {
      this.TotalAmountCharge = 0
    }
    this.TotalAmountCharge = +this.TotalAmountCharge.toFixed(4)
  }

  @ViewChild('godown_select2') godownSelect2: Select2Component
  onGodownSelect(evt) {
    if (evt.value && evt.data.length > 0) {
      if (evt.value > 0 && evt.data[0] && evt.data[0].text) {
        this.GodownId = +evt.value
      }
      this.checkForValidation()
    }
  }

  needToCheckItem: boolean = false
  needToCheckCharge: boolean = false

  vendorGSTType: any
  updateChargeTax() {
    if (this.AdditionalCharges.length > 0) {
      const observables = [];
      for (const charge of this.AdditionalCharges) {
        if (charge.TaxSlabChargeId !== 0) {
          observables.push(this.purchaseService.getSlabData(charge.TaxSlabChargeId));
        }
      }
      forkJoin(...observables).subscribe(
        data => {
          data.forEach((element, index) => {
            let appliedTaxRatesCharge = []
            let taxChargeSlabType = (element.Data.TaxSlabs[0]) ? element.Data.TaxSlabs[0].Type : 0
            if (this.vendorGSTType !== 1) {
              element.Data.TaxRates = []
            }
            if (+this.AdditionalCharges[index].AmountCharge > 0) {

              if (this.AdditionalCharges[index].TaxTypeCharge === 1) {
                let returnTax = this.purchaseService.taxCalCulationForInclusive(element.Data.TaxRates,
                  taxChargeSlabType,
                  +this.AdditionalCharges[index].AmountCharge,
                  this.isOtherState, FormConstants.ChargeForm, element.Data.TaxSlabs[0].Slab)
                this.AdditionalCharges[index]['TaxAmountCharge'] = +returnTax.taxAmount
                appliedTaxRatesCharge = returnTax.appliedTaxRates
              } else if (this.AdditionalCharges[index].TaxTypeCharge === 0) {
                let returnTax = this.purchaseService.taxCalculation(element.Data.TaxRates,
                  taxChargeSlabType,
                  +this.AdditionalCharges[index].AmountCharge,
                  this.isOtherState, FormConstants.ChargeForm, element.Data.TaxSlabs[0].Slab)
                this.AdditionalCharges[index]['TaxAmountCharge'] = returnTax.taxAmount
                appliedTaxRatesCharge = returnTax.appliedTaxRates
              }

              if (appliedTaxRatesCharge.length > 0) {
                appliedTaxRatesCharge.forEach((taxRate) => {
                  if (this.AdditionalCharges[index].Id !== 0) {
                    taxRate['ItemTransTaxId'] = this.AdditionalCharges[index].Id
                  } else {
                    taxRate['ItemTransTaxId'] = this.AdditionalCharges[index].Sno
                  }
                })
              }
              this.AdditionalCharges[index].itemTaxTrans = appliedTaxRatesCharge
            }
            this.AdditionalCharges[index]['TotalAmountCharge'] = +this.AdditionalCharges[index].AmountCharge + +this.AdditionalCharges[index]['TaxAmountCharge']
          });
        }
      )
    }
  }

  @ViewChild('referraltype_select2') referraltypeSelect2: Select2Component
  onReferralTypeSelect(evt) {
    if (evt.value > 0 && evt.data[0] && evt.data[0].text) {
      this.ReferralTypeId = +evt.value
    }
  }

  ConvertToCurrencyId: number
  onConvertToCurrencySelect(evt) {
    if (evt.value > 0 && evt.data[0] && evt.data[0].text) {
      this.ConvertToCurrencyId = +evt.value
    }
  }

  @ViewChild('referral_select2') referralSelect2: Select2Component
  onRefferalPartnerSelect(evt) {
    if (evt.value > 0 && evt.data[0] && evt.data[0].text) {
      this.ReferralId = +evt.value
    }
  }

  DisabledRow: boolean = true
  EditabledChargeRow: boolean = true
  showHideItemCharge: any = true
  SrNo:any =0
  editItem(i, editId, sno) {
    if (this.editChargeId === -1) {
      this.editChargeId = editId
      this.editChargeSno = sno
      i = i - 1
      this.showHideItemCharge = false
      this.AdditionalCharges[i].isEditable = false
      this.EditabledChargeRow = true
      this.LedgerName = this.AdditionalCharges[i].LedgerName
      this.LedgerChargeId = this.AdditionalCharges[i].LedgerChargeId
      this.alreadySelectCharge(this.LedgerChargeId, this.LedgerName, false)
      this.AmountCharge = this.AdditionalCharges[i].AmountCharge
      this.TaxSlabChargeId = this.AdditionalCharges[i].TaxSlabChargeId
      this.TaxChargeName = this.AdditionalCharges[i].TaxChargeName
      this.TaxAmountCharge = this.AdditionalCharges[i].TaxAmountCharge
      this.TotalAmountCharge = this.AdditionalCharges[i].TotalAmountCharge
      this.TaxTypeCharge = this.AdditionalCharges[i].TaxTypeCharge
      this.taxTypeChargeName = this.AdditionalCharges[i].taxTypeChargeName
      this.appliedTaxRatesCharge = this.AdditionalCharges[i].itemTaxTrans
      this.taxChargeRates = this.AdditionalCharges[i].taxChargeRates
      this.taxChargeSlabType = this.AdditionalCharges[i].taxChargeSlabType
      let LedgerChargeId = this.LedgerChargeId
      setTimeout(() => {
        this.LedgerChargeId = LedgerChargeId
        this.chargeSelect2.setElementValue(LedgerChargeId)
        this.taxSlabChargeSelect2.setElementValue(this.TaxSlabChargeId)
        this.taxTypeChargeSelect2.setElementValue(this.TaxTypeCharge)
        //  this.deleteItem(i, type,false)
        this.validateCharge()
      }, 100)
    }
  }

  deleteItem(i, flag) {
    if (flag) {
      this.alreadySelectCharge(this.AdditionalCharges[i].LedgerChargeId, this.AdditionalCharges[i].LedgerName, false)
    }
    this.AdditionalCharges.splice(i, 1)
  }

  closePurchase() {
    this.showHideItemCharge = true
    this.commonService.closePurchase()
  }

  @ViewChild('taxSlabCharge_select2') taxSlabChargeSelect2: Select2Component
  @ViewChild('charge_select2') chargeSelect2: Select2Component
  initCharge() {
    this.LedgerChargeId = 0
    this.LedgerName = ''
    this.AmountCharge = 0
    this.TaxTypeCharge = 0
    this.TaxSlabChargeId = 0
    this.TaxChargeName = ''
    this.TaxAmountCharge = 0
    this.TotalAmountCharge = 0
    this.editChargeSno = 0
    this.clickCharge = false
    this.taxChargeRates = []
    this.appliedTaxRatesCharge = []
    this.editChargeId = -1
    if (this.taxSlabChargeSelect2) {
      this.taxSlabChargeSelect2.setElementValue('')
    }
    if (this.chargeSelect2) {
      this.chargeSelect2.setElementValue('')
    }
    if (this.taxTypeChargeSelect2) {
      this.taxTypeChargeSelect2.setElementValue(0)
    }
    this.taxTypeChargeName = 'Exclusive'
  }

  AdditionalChargesToShow = []

  private preparePayload() {
    let BillDate = this.gs.clientToSqlDateFormat(this.BillDate, this.clientDateFormat)
    const payload = {
      obj: {
        Id: this.Id ? this.Id : 0,
        ReferralCommissionTypeId: 0,
        ReferralCommission: 0,
        BillAmount: 0,
        BillDate: BillDate,
        BillNo: this.ChallanNo,
        ReferralId: this.ReferralId,
        ReferralTypeId: this.ReferralTypeId,
        ReferralComission: 0,
        ReferralComissionTypeId: 0,
        ReverseCharge: 0,
        ReverseTax: 0,
        VehicleNo: this.VehicleNo,
        LocationTo: this.LocationTo,
        Drivername: this.Drivername,
        Transportation: this.Transportation,
        GodamId: +this.GodownId,
        AddressId: this.AddressId,
        OrderStr: this.orderStr,
        AdditionalCharges: this.AdditionalCharges,
        DueDate: "",
        Cess: 0,
        CessAmount: 0,
        ConvertedAmount: 0,
        CurrencyId: 0,
        CurrencyRate: 0,
        Discount: 0,
        Freight: 0,
        FreightMode: 0,
        PartyId: 0,
        ReferId: 0,
        Remark: "",
        ReversCharge: 0,
        ReversTax: 0,
        TaxAmount: 0,
        TotalChallan: 0,
        EwayBillNo: "",
        Supplydate: "",
        SupplyState: 0,
        SupplyParty: 0,
        SupplyAddress: "",
        TotalQty: 0,
        GrossAmount: 0,
        OtherCharge: 0,
        ReferalComission: 0,
        Advanceamount: 0,
        Commission: 0,
        CommissionType: 0,
        CessTax: 0,
        CreditAmount: 0
      }
    }

    console.log('obj : ', JSON.stringify(payload.obj))
    return payload.obj
  }

  postData () {
    this.submitSave = true
    this.addCharge()
    if (this.checkForValidation() && this.validCharge) {
      this._ps.postPackagingChallan(this.preparePayload()).subscribe(
        (data) => {
          console.log('data : ', data)
          this.toastrService.showSuccess('Successfully done', '')
          this._ps.closeChallan()
          this._ps.onChallanAdded()
        },
        (error) => {
          console.log(error)
          this.toastrService.showErrorLong(error, '')
        }
      )
    }
  }

  checkForValidation() {
    if (this.BillDate || this.ChallanNo || this.GodownId
    ) {
      let isValid = 1
      if (this.BillDate) {
        this.invalidObj['BillDate'] = false
      } else {
        this.invalidObj['BillDate'] = true
        isValid = 0
      }
      if (this.ChallanNo) {
        this.invalidObj['ChallanNo'] = false
      } else {
        this.invalidObj['ChallanNo'] = true
        isValid = 0
      }
      if (this.GodownId > 0) {
        this.invalidObj['GodownId'] = false
      } else {
        this.invalidObj['GodownId'] = true
        isValid = 0
      }
      return !!isValid
    }
  }

  validateCharge() {
    if (this.LedgerName || +this.LedgerChargeId > 0 || +this.AmountCharge > 0) {
      let isValid = 1
      if (+this.LedgerChargeId > 0) { this.invalidObj['LedgerChargeId'] = false } else { isValid = 0; this.invalidObj['LedgerChargeId'] = true; }
      if (+this.AmountCharge > 0) { this.invalidObj['AmountCharge'] = false; } else { isValid = 0; this.invalidObj['AmountCharge'] = true; }
      this.validCharge = !!isValid
    } else {
      this.validCharge = true; this.invalidObj['LedgerChargeId'] = false; this.invalidObj['TaxSlabChargeId'] = false; this.invalidObj['AmountCharge'] = false;
    }
    this.clickCharge = false
  }

  addCharge() {
    if (this.LedgerName && +this.LedgerChargeId > 0 && +this.AmountCharge > 0) {
      this.alreadySelectCharge(this.LedgerChargeId, this.LedgerName, true)
      this.addCustomCharge()
      if (this.editChargeId > 0) {
        this.showHideItemCharge = true
      }
      this.AdditionalCharges.forEach((element, i) => {
        if (element.Id === 0) {
          this.showHideItemCharge = true
        }
      })
      this.clickCharge = true
      this.initCharge()
    }
  }

  alreadySelectCharge(chargeId, name, enableflag) {
    if (chargeId > 0) {
      this.chargesData.forEach(data => {
        let index = this.chargesData.findIndex(
          selectedItem => selectedItem.id === chargeId)
        if (index !== -1) {
          this.chargesData.splice(index, 1)
          let newData = Object.assign([], this.chargesData)
          newData.push({ id: chargeId, text: name, disabled: enableflag })
          this.chargesData = newData
        }
      })
    }
  }

  addCustomCharge() {
    if (this.appliedTaxRatesCharge.length > 0) {
      this.ItemTaxTrans = this.ItemTaxTrans.concat(this.appliedTaxRatesCharge)
    }
    console.log('ItemTaxTrans : ', this.ItemTaxTrans)
    let index = 0
    if (this.AdditionalCharges.length === 0) {
      index = 1
    } else {
      index = +this.AdditionalCharges[this.AdditionalCharges.length - 1].Sno + 1
      this.AdditionalCharges.forEach((element, i) => {
        if (this.editChargeId > 0) {
          if (element.Id === this.editChargeId) {
            this.AdditionalCharges.splice(i, 1)
          }
        }
        if (element.Id === 0) {
          if (element.Sno === this.editChargeSno) {
            this.AdditionalCharges.splice(i, 1)
          }
        }
      })
    }
    this.appliedTaxRatesCharge.forEach(element => {
      element['Sno'] = index
      element['ItemTransTaxId'] = index
    })
    this.AdditionalCharges.push({
      Id: 0,
      Sno: index,
      LedgerChargeId: this.LedgerChargeId,
      LedgerName: this.LedgerName,
      AmountCharge: this.AmountCharge,
      TaxSlabChargeId: this.TaxSlabChargeId,
      TaxChargeName: this.TaxChargeName,
      TaxAmountCharge: this.TaxAmountCharge,
      TotalAmountCharge: this.TotalAmountCharge,
      TaxTypeCharge: this.TaxTypeCharge,
      taxTypeChargeName: this.taxTypeChargeName,
      taxChargeSlabType: this.taxChargeSlabType,
      taxChargeRates: this.taxChargeRates,
      itemTaxTrans: this.appliedTaxRatesCharge,
      TaxableAmountCharge: this.TaxableAmountCharge,
      isEditable: this.EditabledChargeRow
    })
    setTimeout(() => {
      this.commonService.fixTableHFL('charge-table')
    }, 1)
    if (this.editChargeId !== -1) {
      this.AdditionalCharges[this.AdditionalCharges.length - 1].Id = this.editChargeId
    }
  }

  onChargeSelect(evt) {
    if (+evt.value === -1 && evt.data[0].selected) {
      this.chargeSelect2.selector.nativeElement.value = ''
      this.commonService.openledgerCretion('', FormConstants.PurchaseForm)

    } else {
      this.LedgerChargeId = +evt.value
      if (evt.value > 0) {
        this.LedgerName = evt.data[0].text
      }
    }
    this.validateCharge()
    this.calculate()
  }

  onTaxSlabChargeSelect(evt) {
    // console.log('on change of tax slab : ', evt)
    if (+evt.value === -1) {
      this.commonService.openTax('')
      this.taxSlabChargeSelect2.selector.nativeElement.value = ''
    } else {
      if (evt.value > 0 && evt.data[0] && evt.data[0].text) {
        this.TaxSlabChargeId = +evt.value
        this.TaxChargeName = evt.data[0].text
        this.getTaxChargeDetail(this.TaxSlabChargeId)
      }
    }
    this.validateCharge()
  }

  getTaxChargeDetail(TaxSlabId) {
    this.purchaseService.getSlabData(TaxSlabId).subscribe(
      data => {
        console.log('tax slab data : ', data)
        if (data.Code === UIConstant.THOUSAND && data.Data) {

          if (this.vendorGSTType === 1) {
            this.taxChargeSlabType = (data.Data.TaxSlabs[0]) ? data.Data.TaxSlabs[0].Type : 0
            this.taxChargeRates = data.Data.TaxRates
          }
          else {
            this.taxChargeSlabType = 0
            this.taxChargeRates = []
          }
          this.calculate()
          this.createTaxes(FormConstants.ChargeForm)
        }
      }
    )
  }

  createTaxes(parentType) {
    let Sno = 0
    if (parentType === FormConstants.ChargeForm) {
      if (this.editChargeId !== -1) {
        Sno = this.editChargeSno
      } else {
        if (this.AdditionalCharges.length === 0) {
          Sno = 1
        } else {
          Sno = this.AdditionalCharges[this.AdditionalCharges.length - 1].Sno + 1
        }
      }
      if (this.appliedTaxRatesCharge.length > 0) {
        this.appliedTaxRatesCharge.forEach((taxRate) => {
          taxRate['ItemTransTaxId'] = Sno
          taxRate['Sno'] = Sno
        })
      }
      let charge = this.AdditionalCharges.find((charge) => charge.Sno === Sno)
      if (charge) {
        charge['itemTaxTrans'] = this.appliedTaxRatesCharge
      }
      console.log('tax rates applied : ', this.appliedTaxRatesCharge)
    }
  }

  @ViewChild('taxTypecharge_select2') taxTypeChargeSelect2: Select2Component
  onTaxTypeChargeSelect(evt) {
    // console.log('on change of tax Type charge : ', evt)
    if (+evt.value >= 0 && evt.data[0] && evt.data[0].text) {
      this.TaxTypeCharge = +evt.value
      this.taxTypeChargeName = evt.data[0].text
      this.calculate()
    }
  }

  enterPressCharge(evt: KeyboardEvent) {
    this.addCharge()
    setTimeout(() => {
      this.chargeSelect2.selector.nativeElement.focus()
    }, 10)
  }

  getNewBillNo() {
    if (this.BillDate) {
      let newBillDate = this.gs.clientToSqlDateFormat(this.BillDate, this.clientDateFormat)
      let type = 1
      this._ps.getNewBillNo(newBillDate, type, UIConstant.SALE_CHALLAN_TYPE).subscribe(
        data => {
          console.log('bill no : ', data)
          if (data.length > 0) {
            this.ChallanNo = data[0].BillNo
          } else {
            this.previousBillNo = ''
            this.ChallanNo = ''
          }
        },
        (error) => {
          this.toastrService.showErrorLong(error, '')
        }
      )
    }
  }

  resetForm () {
    this.ReferralId = 0
    this.ReferralTypeId = 0
    this.ReferralComission = 0
    this.ReferralComissionTypeId = 0
    this.VehicleNo = ''
    this.LocationTo = ''
    this.Drivername = ''
    this.Transportation = ''
    this.ReferralCommission = 0
    this.ReferralCommissionTypeId = 0
    this.AdditionalCharges = []
    this.ItemTaxTrans = []
    this.clickCharge = false
    this.submitSave = false
    this.invalidObj = {}
    this.AdditionalChargesToShow = []
    if (this.godownsData && this.godownsData.length === 1) {
      this.GodownId = +this.godownsData[0].id
      this.godownValue = +this.godownsData[0].id
      if (this.godownSelect2) {
        this.godownSelect2.setElementValue(this.GodownId)
      }
    }
    if (this.chargeSelect2) {
      this.chargeSelect2.setElementValue(0)
    }
    if (this.taxSlabChargeSelect2) {
      this.taxSlabChargeSelect2.setElementValue(0)
    }
    if (this.referralSelect2) {
      this.referralSelect2.setElementValue(0)
    }
    if (this.referraltypeSelect2) {
      this.referraltypeSelect2.setElementValue(0)
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next()
    this.onDestroy$.complete()
  }

}
