/* File created by Dolly Garg*/

import { Component, ViewChild, QueryList, ViewChildren, Renderer2, ElementRef } from '@angular/core'
import { UIConstant } from 'src/app/shared/constants/ui-constant'
import { Select2OptionData, Select2Component } from 'ng2-select2'
import { Subject, forkJoin, Subscription } from 'rxjs';
import { PurchaseAttribute, AddCust } from '../../../model/sales-tracker.model'
import { CommonService } from '../../../commonServices/commanmaster/common.services'
import { ToastrCustomService } from '../../../commonServices/toastr.service'
import { Settings } from '../../../shared/constants/settings.constant'
import { GlobalService } from '../../../commonServices/global.service'
import { SetUpIds } from 'src/app/shared/constants/setupIds.constant'
import { AdditionalCharges, ItemTaxTrans } from '../../../model/sales-tracker.model';
import { FormConstants } from 'src/app/shared/constants/forms.constant';
import { CategoryServices } from '../../../commonServices/TransactionMaster/category.services';
import { PurchaseOrderService } from '../purchase-order.service';
import * as _ from 'lodash';
declare const $: any
@Component({
  selector: 'purchase-order-add',
  templateUrl: './purchase-order-add.component.html',
  styleUrls: ['./purchase-order-add.component.css']
})
export class PurchaseOrderAddComponent {
  destroy$: Subscription[] = []
  ParentId: any
  model: any = {}
  loading: boolean = true
  catLevel: number = 1
  categories: Array<{ placeholder: string, value: string, data: Array<Select2OptionData>, level: number }> = []
  item: any = {}
  attributesData: Array<Select2OptionData> = []
  taxProcessesData: Array<Select2OptionData>
  taxTypeData: Array<Select2OptionData>
  currencyData: Array<Select2OptionData>
  convertToCurrencyData: Array<Select2OptionData>
  vendorData: Array<Select2OptionData>
  AddressData: Array<Select2OptionData>
  subUnitsData: Array<Select2OptionData>
  itemData: Array<Select2OptionData>
  taxSlabsData: Array<Select2OptionData>
  chargesData: Array<Select2OptionData>
  tempChargeData: any = []
  AmountChargeValue: number
  TaxAmountChargeValue: number
  TotalAmountChargeValue: number

  clientDateFormat: string = ''
  setupModules: any
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
  ItemTransId: number
  AttributeId: number
  name: string

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

  ItemTaxTrans: Array<ItemTaxTrans> = []

  TransType: number
  TransId: number
  ItemId: number
  UnitId: number
  Length: number
  Height: number
  Width: number
  Quantity: number
  SaleRate: number
  MrpRate: number
  PurchaseRate: number
  TotalRate: number
  TaxSlabId: number
  TaxType: number
  TaxAmount: number
  ExpiryDate: string
  MfdDate: string
  BatchNo: string
  Remark: string
  itemName: string
  categoryName: string
  unitName: string
  taxSlabName: string
  taxTypeName: string
  AmountItem: number
  Amount: number
  taxSlabType: number
  taxRates: Array<any> = []
  attributeKeys: any = []
  BillAmount: number
  Id: number
  LedgerId: number
  SubTotalAmount: number
  TotalTaxAmount: number
  TotalQty: number
  OtherCharge: number
  Advanceamount: number
  NetAmount: number
  itemAttributeTrans: Array<PurchaseAttribute> = []
  ItemAttributeTrans: Array<PurchaseAttribute> = []
  AdditionalCharges: Array<AdditionalCharges> = []
  Items: Array<any> = []
  categoryId: number
  AddressId: number
  editItemId: number = -1
  editItemSno: number = 0
  editChargeId: number = -1
  validItem: boolean = true
  validCharge: boolean = true
  clickItem = false
  clickTrans = false
  clickCharge = false

  allItems: any = []

  clientStateId: number = 0
  allAddressData: Array<any> = []
  isOtherState: boolean = true
  editMode: boolean = false
  parentMostCategory: number = 0
  submitSave: boolean = false
  industryId: number = 0

  formReadySub = new Subject<boolean>()
  fromReady$ = this.formReadySub.asObservable()
  invalidObj: any = {}
  previousBillNo: string = ''
  keepOpen: boolean = false
  isAddNew: boolean = false
  creatingForm: boolean = false
  loadingSummary: boolean = false
  constructor(private commonService: CommonService,
    private _po: PurchaseOrderService,
    private toastrService: ToastrCustomService,
    private settings: Settings,
    private renderer: Renderer2,
    private gs: GlobalService,
    private _catagoryservices: CategoryServices) {
    this.model = {}
    this.getSPUtilityData()
    this.clientDateFormat = this.settings.dateFormat
    this.destroy$.push(this._po.select2List$.subscribe((data: any) => {
      if (data.data && data.title) {
        // console.log(data.data)
        if (data.title === 'Customer') {
          let arr = JSON.parse(JSON.stringify(data.data))
          arr.splice(1, 1)
          this.model.customerData = arr
        }
        if (data.title === 'Vendor') {
          this.model.vendorData = data.data
        }
        if (data.title === 'Tax') {
          this.taxSlabsData = data.data
        }
        if (data.title === 'Delivery Mode') {
          this.model.deliveryModeData = data.data
        }
        if (data.title === 'Item') {
          this.itemData = data.data
          console.log(this.itemData)
        }
        if (data.title === 'Charge') {
          this.chargesData = data.data
        }
        if (data.title === 'Unit') {
          this.subUnitsData = data.data
        }
      }
    }))
    this.destroy$.push(this._po.openPO$.subscribe((status: AddCust) => {
      if (status.open) {
        if (status.editId !== '') {
          this.creatingForm = true
          this.editMode = true
          this.Id = +status.editId
        } else {
          this.Id = UIConstant.ZERO
          this.editMode = false
          this.creatingForm = false
        }
        this.initComp()
        this.openModal()
      } else {
        this.closeModal()
      }
    }))
    this.destroy$.push(this._po.attributesData$.subscribe((data) => {
      if (data.attributeKeys && data.attributesData) {
        this.attributeKeys = data.attributeKeys
        this.attributesData = data.attributesData
        this.initAttribute()
      }
    }))

    let _self = this
    this.destroy$.push(this._po.addressData$.subscribe(
      data => {
        console.log('address data : ', data)
        if (data.data) {
          _self.AddressData = Object.assign([], data.data)
          let id = 0
          if (_self.AddressData.length > 2) {
            id = +_self.AddressData[2].id
          }
          _self.model.addressValue = id
        }
      }
    ))

    this.destroy$.push(this.commonService.getCatImportAddStatus.subscribe(
      () => {
        this.getAllCategoriesOnImport()
      }
    ))

    this.destroy$.push(this.commonService.getAttributeStatus().subscribe(
      data => {
        if (data.id && data.name && data.AttributeId) {
          let indexOfAttr = -1
          if (this.attributesData.length > 0) {
            for (let i = 0; i < this.attributesData.length; i++) { if (this.attributesData[i]['attributeId'] === data.AttributeId) { indexOfAttr = i; break; } }
            if (indexOfAttr >= 0) {
              let itemAttributeTrans = JSON.parse(JSON.stringify(this.itemAttributeTrans))
              let newData = Object.assign([], this.attributesData[indexOfAttr]['data'])
              newData.push({ id: +data.id, text: data.name });
              this.attributesData[indexOfAttr]['data'] = Object.assign([], newData)
              console.log('this.attributesData : ', this.attributesData)
              setTimeout(() => {
                this.attrSelect2.forEach((attr: Select2Component, index: number, array: Select2Component[]) => {
                  if (index === indexOfAttr) {
                    attr.setElementValue(data.id)
                  } else if (itemAttributeTrans[index].AttributeId) {
                    attr.setElementValue(itemAttributeTrans[index].AttributeId)
                  } else {
                  }
                })
              }, 100)
            }
          }
        }
      }
    ))

    this.destroy$.push(this.commonService.getledgerCretionStatus().subscribe(
      data => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.chargesData)
          newData.push({ id: +data.id, text: data.name })
          this.chargesData = newData
          this.LedgerChargeId = +data.id
          this.model.ledgerChargeValue = data.id
          setTimeout(() => {
            if (this.chargeSelect2) {
              const element = this.renderer.selectRootElement(this.chargeSelect2.selector.nativeElement, true)
              element.focus({ preventScroll: false })
            }
          }, 2000)
        }
      }
    ))

    this.destroy$.push(this.commonService.getCategoryStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let categoryId = data.id
          let categoryName = data.name
          this.isAddNew = true
          this.getAllCategories(categoryName, categoryId, this.isAddNew)
        }
      }
    ))

    this.destroy$.push(this.fromReady$.subscribe(
      (formReady) => {
        if (formReady) {
          this.loading = false
          if (this.editMode) {
            this.vendorSelect2.setElementValue(this.LedgerId)
            this.addressSelect2.setElementValue(this.AddressId)
            this.deliverySelect2.setElementValue(this.model.DeliveryMode)
            this.buyerOrderSelect2.setElementValue(this.ParentId)
            this.model.ExDeliveryFromDate = this.gs.utcToClientDateFormat(this.other.ExDeliveryFromDate, this.clientDateFormat)
            this.model.ExDeliveryToDate = this.gs.utcToClientDateFormat(this.other.ExDeliveryToDate, this.clientDateFormat)
            this.model.PoDate = this.gs.utcToClientDateFormat(this.other.PoDate, this.clientDateFormat)
          }
        }
      }
    ))

    this.destroy$.push(this.commonService.getVendStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.model.vendorData)
          newData.push({ id: data.id, text: data.name })
          this.model.vendorData = newData
          this.LedgerId = +data.id
          this.model.vendorValue = data.id
          // this.vendorSelect2.setElementValue(data.id)
          this.vendorGSTType = data.gstType
          setTimeout(() => {
            if (this.vendorSelect2) {
              const element = this.renderer.selectRootElement(this.vendorSelect2.selector.nativeElement, true)
              element.focus({ preventScroll: false })
            }
          }, 2000)
        }
      }
    ))

    this.destroy$.push(this.commonService.getAddressStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.AddressData)
          newData.push({ id: data.id, text: data.name })
          this.AddressData = newData
          this.AddressId = +data.id
          this.model.addressValue = data.id
          this.loadingSummary = true
          this.checkForGST()
          setTimeout(() => {
            if (this.addressSelect2) {
              const element = this.renderer.selectRootElement(this.addressSelect2.selector.nativeElement, true)
              element.focus({ preventScroll: false })
            }
          }, 2000)
        }
      }
    ))

    this.destroy$.push(this.commonService.getCompositeUnitStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.subUnitsData)
          newData.push({ id: +data.id, text: data.name })
          this.subUnitsData = newData
          this.UnitId = +data.id
          this.model.subUnitsValue = data.id
          setTimeout(() => {
            if (this.unitSelect2) {
              const element = this.renderer.selectRootElement(this.unitSelect2.selector.nativeElement, true)
              element.focus({ preventScroll: false })
            }
          }, 2000)
        }
      }
    ))

    this.destroy$.push(this.commonService.getUnitStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.subUnitsData)
          newData.push({ id: +data.id, text: data.name })
          this.subUnitsData = newData
          this.UnitId = +data.id
          this.model.subUnitsValue = data.id
          setTimeout(() => {
            if (this.unitSelect2) {
              const element = this.renderer.selectRootElement(this.unitSelect2.selector.nativeElement, true)
              element.focus({ preventScroll: false })
            }
          }, 2000)
        }
      }
    ))

    this.destroy$.push(this.commonService.getItemMasterStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name && data.categoryId) {
          let newData = Object.assign([], this.itemData)
          newData.push({ id: data.id, text: data.name })
          this.itemData = Object.assign([], newData)
          this.allItems.push({
            Id: +data.id,
            Name: data.name,
            CategoryId: +data.categoryId
          })
          this.ItemId = +data.id
          this.model.itemValue = data.id
          setTimeout(() => {
            if (this.itemselect2) {
              const element = this.renderer.selectRootElement(this.itemselect2.selector.nativeElement, true)
              element.focus({ preventScroll: false })
            }
          }, 2000)
        }
      }
    ))

    this.destroy$.push(this.commonService.getTaxStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.taxSlabsData)
          newData.push({ id: data.id, text: data.name })
          this.taxSlabsData = newData
          if (this.TaxSlabId === -1) {
            this.TaxSlabId = +data.id
            this.model.taxSlabValue = data.id
            setTimeout(() => {
              if (this.taxSlabSelect2) {
                const element = this.renderer.selectRootElement(this.taxSlabSelect2.selector.nativeElement, true)
                element.focus({ preventScroll: false })
              }
            }, 2000)
          } else if (this.TaxSlabChargeId === -1) {
            this.TaxSlabChargeId = +data.id
            this.model.taxSlabChargeValue = data.id
            setTimeout(() => {
              if (this.taxSlabChargeSelect2) {
                const element = this.renderer.selectRootElement(this.taxSlabChargeSelect2.selector.nativeElement, true)
                element.focus({ preventScroll: false })
              }
            }, 2000)
          }
        }
      }
    ))

    this.destroy$.push(this.commonService.openCommonMenu$.subscribe(
      (data: AddCust) => {
        if (data.id && data.name && data.code) {
          if (data.code === 190) {
            let newData = Object.assign([], this.model.deliveryModeData)
            newData.push({ id: data.id, text: data.name })
            this.model.deliveryModeData = Object.assign([], newData)
            this.model.deliveryValue = +data.id
            setTimeout(() => {
              if (this.deliverySelect2) {
                const element = this.renderer.selectRootElement(this.deliverySelect2.selector.nativeElement, true)
                element.focus({ preventScroll: false })
              }
            }, 2000)
          }
        }
      }
    ))
  }

  getAllCategoriesOnImport() {
    this.destroy$.push(this.gs.manipulateResponse(this._catagoryservices.GetCatagoryDetail('')).subscribe(data => {
      console.log('categories : ', data)
      this.getCatagoryDetail(data)
    }, (error) => {
      this.toastrService.showError(error, '')
    }))
  }

  getEditData() {
    console.log('edit id : ', this.Id)
    this.destroy$.push(this._po.getPODetail(this.Id).subscribe(
      data => {
        console.log('edit data : ', data)
        this.allAddressData = data.AddressDetails
        this._po.createAddress(data.AddressDetails)
        this.createForm(data)
      },
      (error) => {
        this.toastrService.showError(error, '')
      }
    ))
  }
  OrganisationName: any = ''
  dataForEdit: any
  taxRatesForEdit = []
  getListOfChargeData() {
    if (this.tempChargeData.length > 0) {
      this.chargesData = []
      let newData = []
      this.tempChargeData.forEach(ele => {
        newData.push({ id: ele.id, text: ele.text, disabled: false })
        this.chargesData = newData
      })
    }
  }

  createForm(data) {
    this.dataForEdit = data
    this.other = {}
    this.Items = []
    this.ItemAttributeTrans = []
    this.ItemTaxTrans = []
    this.AdditionalCharges = []
    this.taxRatesForEdit = data.TaxRates
    this.createOther(data.PurchaseOrderDetails[0])
    this.createAttributes(data.ItemAttributesTrans)
    this.createItemTaxTrans(data.ItemTaxTransDetails)
    this.createItems(data.ItemTransactions)
    this.createAdditionalCharges(data.AdditionalChargeDetails)
    this.loading = false
    setTimeout(() => {
      if (this.vendorSelect2) {
        this.vendorSelect2.selector.nativeElement.focus({ preventScroll: false })
      }
      this.commonService.fixTableHF('cat-table')
    }, 1000)

    this.getBillSummary()
    this.creatingForm = false
  }


  createItemTaxTrans(taxRates) {
    taxRates.forEach((element, index) => {
      this.ItemTaxTrans[index] = {
        TaxTypeTax: element.TaxTypeTax,
        AmountTax: +element.AmountTax,
        ItemTransTaxId: element.ItemTransTaxId,
        ParentTaxId: element.ParentTaxId,
        ParentTypeTaxId: element.ParentTypeTaxId,
        ItemTransTypeTax: element.ItemTransTypeTax,
        TaxRateId: element.TaxRateId,
        TaxRate: element.TaxRate,
        ValueType: element.ValueType,
        TaxSlabName: element.TaxSlabName,
        TaxRateNameTax: element.TaxRateName,
        id: element.Id,
        Sno: index + 1
      }
    })

    //  console.log('this.ItemTaxTrans : ', this.ItemTaxTrans)
  }

  createAdditionalCharges(charges) {
    if (charges.length > 0) {
      charges.forEach(element => {
        let taxRates = this.taxRatesForEdit.filter(taxRate => taxRate.LedgerId === FormConstants.ChargeForm && taxRate.SlabId === element.TaxSlabChargeId)
        let itemTaxTrans = []
        itemTaxTrans = this.ItemTaxTrans.filter((taxRate) => {
          if (taxRate.ItemTransTaxId === element.Id) {
            return taxRate
          }
        })
        if (+element.TaxTypeCharge === 0) {
          this.taxTypeChargeName = 'Exclusive'
        } else {
          this.taxTypeChargeName = 'Inclusive'
        }
        console.log('itemTaxTrans : ', itemTaxTrans)
        this.LedgerChargeId = element.LedgerChargeId
        this.LedgerName = element.LedgerName
        this.AmountCharge = element.AmountCharge
        this.TaxSlabChargeId = this.vendorGSTType === 1 ? element.TaxSlabChargeId : 0
        this.TaxChargeName = element.TaxChargeName
        this.TaxAmountCharge = element.TaxAmountCharge
        this.TotalAmountCharge = element.TotalAmountCharge
        this.EditabledChargeRow = true,
        this.TaxTypeCharge = element.TaxTypeCharge
        this.taxTypeChargeName = this.taxTypeChargeName
        this.taxChargeSlabType = element.TaxSlabType
        this.taxChargeRates = this.vendorGSTType === 1 ? taxRates : []
        this.TaxableAmountCharge = (+element.TaxTypeCharge === 0) ? this.AmountCharge : +this.TotalAmountCharge - this.TaxAmountCharge
        this.addCharge()
        if (this.AdditionalCharges[this.AdditionalCharges.length - 1]) {
          this.AdditionalCharges[this.AdditionalCharges.length - 1].Id = element.Id
          this.AdditionalCharges[this.AdditionalCharges.length - 1].itemTaxTrans = itemTaxTrans
        } else {
          this.toastrService.showError('Not getting enough data for edit', '')
        }
      })
    }
    //  console.log('this.AdditionalCharges : ', this.AdditionalCharges)
  }

  itemAttributesOthers: any = []
  createAttributes(attributes) {
    attributes.forEach((element, index) => {
      this.itemAttributesOthers[index] = {
        ItemId: element.ItemId,
        ItemTransId: element.ItemTransId,
        AttributeId: element.AttributeId,
        ParentTypeId: FormConstants.PURCHASEORDER,
        name: element.AttributeName,
        Id: element.Id,
        Sno: index + 1
      }
    })
    // console.log('this.itemAttributesOthers : ', this.itemAttributesOthers)
  }

  createItems(ItemTransactions) {
    ItemTransactions.forEach(element => {
      let taxRates = this.taxRatesForEdit.filter(taxRate => taxRate.LedgerId === FormConstants.PURCHASEORDER && taxRate.SlabId === element.TaxSlabId)
      let total = +(isNaN(+element.PurchaseRate) ? 0 : +element.PurchaseRate)
        * (isNaN(+element.Quantity) || +element.Quantity === 0 ? 1 : +element.Quantity)
        * (isNaN(+element.Length) || +element.Length === 0 ? 1 : +element.Length)
        * (isNaN(+element.Width) || +element.Width === 0 ? 1 : +element.Width)
        * (isNaN(+element.Height) || +element.Height === 0 ? 1 : +element.Height)
      this.AmountItem = total
      let itemTaxTrans = []
      itemTaxTrans = this.ItemTaxTrans.filter((taxRate) => {
        if (taxRate.ItemTransTaxId === element.Id) {
          return taxRate
        }
      })
      // console.log('itemTaxTrans : ', itemTaxTrans)
      let itemAttributeTrans = []
      if (this.itemAttributesOthers.length > 0) {
        itemAttributeTrans = this.itemAttributesOthers.filter((attr) => {
          if (attr.ItemTransId === element.Id) {
            return attr
          }
        })
      }
      if (+element.TaxType === 0) {
        this.taxTypeName = 'Exclusive'
      } else {
        this.taxTypeName = 'Inclusive'
      }
      //console.log('itemAttributeTrans : ', itemAttributeTrans)
      this.TransType = element.TransType
      this.TransId = element.TransId
      this.categoryId = element.CategoryId
      this.ItemId = element.ItemId
      this.UnitId = element.UnitId
      this.Length = +element.Length
      this.Height = +element.Height
      this.Width = +element.Width
      this.Quantity = +element.Quantity
      this.DisabledRow = true
      this.SaleRate = element.SaleRate
      this.MrpRate = element.MrpRate
      this.PurchaseRate = +element.PurchaseRate
      this.TotalRate = +element.Total
      this.TaxSlabId = element.TaxSlabId
      this.TaxType = element.TaxType
      this.TaxAmount = element.TaxAmount
      this.ExpiryDate = (element.ExpiryDate) ? this.gs.utcToClientDateFormat(element.ExpiryDate, this.clientDateFormat) : ''
      this.MfdDate = (element.MfdDate) ? this.gs.utcToClientDateFormat(element.MfdDate, this.clientDateFormat) : ''
      this.BatchNo = element.BatchNo
      this.Remark = element.Remark
      this.itemName = element.ItemName
      this.categoryName = element.CategoryName
      this.unitName = element.UnitName
      this.taxSlabName = element.TaxSlabName
      this.taxTypeName = this.taxTypeName
      this.Amount = +element.Amount
      this.itemAttributeTrans = itemAttributeTrans
      this.taxSlabType = element.TaxSlabType
      this.taxRates = this.vendorGSTType === 1 ? taxRates : []
      this.editItemId = element.Id
      this.Amount = (+element.TaxType === 0) ? this.calcTotal() : +this.TotalRate - this.TaxAmount
      this.addItems()
      if (this.Items[this.Items.length - 1]) {
        this.Items[this.Items.length - 1].Id = element.Id
        this.Items[this.Items.length - 1].itemTaxTrans = itemTaxTrans
      } else {
        this.toastrService.showError('Not getting enough data for edit', '')
      }
    })
    console.log('items : ', this.Items)
  }

  calcTotal() {
    const totalAmount = ((isNaN(+this.PurchaseRate) ? 0 : +this.PurchaseRate)
      * (isNaN(+this.Quantity) || +this.Quantity === 0 ? 1 : +this.Quantity)
      * (isNaN(+this.Length) || +this.Length === 0 ? 1 : +this.Length)
      * (isNaN(+this.Width) || +this.Width === 0 ? 1 : +this.Width)
      * (isNaN(+this.Height) || +this.Height === 0 ? 1 : +this.Height)
    )
    return totalAmount
  }

  other: any = {}
  createOther(others) {
    this.LedgerId = +others.LedgerId
    this.model.PoNo = others.PoNo
    this.model.Remark = others.Remark
    this.ParentId = +others.ParentId
    this.model.DeliveryMode = +others.DeliveryMode
    this.SubTotalAmount = 0
    this.TotalTaxAmount = 0
    this.TotalQty = +others.TotalQty
    this.vendorGSTType = others.GstTypeId
    this.Advanceamount = 0
    this.NetAmount = 0
    this.AddressId = +others.AddressId
    this.isOtherState = !!others.IsOtherStatemain
    this.other = others
    this.formReadySub.next(true)
  }

  getAllCategories(categoryName, categoryId, isAddNew) {
    this.destroy$.push(this.commonService.getAllCategories().subscribe(
      data => {
        // console.log('all categories : ', data)
        let levelNo = 0
        if (data.Code === UIConstant.THOUSAND && data.Data && data.Data.length > 0) {
          this.getCatagoryDetail(data.Data)
          data.Data.forEach(category => {
            if (+category.Id === +categoryId) {
              levelNo = +category.LevelNo
              return
            }
          })
          this.categoryName = categoryName
          this.categoryId = categoryId
          this.catSelect2.forEach((item: Select2Component, index: number, array: Select2Component[]) => {
            if ((index + 1) === levelNo) {
              item.setElementValue(this.categoryId)
            }
          })
          // this.updateCategories(categoryId)
          // console.log('categoryname : ', this.categoryName)
          let evt = { value: categoryId, data: [{ text: categoryName }] }
          this.onSelectCategory(evt, levelNo)
        }
      }
    ))
  }

  noOfDecimalPoint: number = 0
  isBillNoManuall: boolean = false
  taxCalInclusiveType: number = 2
  getSetUpModules(settings) {
    settings.forEach(element => {
      if (element.id === SetUpIds.catLevel) {
        this.catLevel = +element.val
      }
      if (element.id === SetUpIds.dateFormat) {
        this.clientDateFormat = element.val[0].Val
      }
      if (element.id === SetUpIds.noOfDecimalPoint) {
        this.noOfDecimalPoint = +element.val
      }
      if (element.id === SetUpIds.unitType) {
        this.unitSettingType = +element.val
      }
      if (element.id === SetUpIds.purchaseBillNoManually) {
        this.isBillNoManuall = !!(+element.val)
      }
      if (element.id === SetUpIds.taxCalInclusive) {
        this.taxCalInclusiveType = +element.val
      }
    })
    this.createModels(this.catLevel)
  }

  @ViewChild('vendor_select2') vendorSelect2: Select2Component
  onVendorSelect(event) {
    console.log('vendor select : ', event)
    this.LedgerId = +event.value
    if (event.value && event.data.length > 0) {
      if (event.value === '-1' && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
        this.vendorSelect2.selector.nativeElement.value = ''
        this.commonService.openVend('', true)
      } else if (+event.value === 0) {
        this.allAddressData = []
        this.AddressData = Object.assign([], this.allAddressData)
      } else {
        if (event.value > 0 && event.data[0] && event.data[0].text) {
          this.getAllAddresses(this.LedgerId)
        }
      }
      this.checkForValidation()
    }
  }

  vendorGSTType: any
  getAllAddresses(vendorId) {
    this.destroy$.push(this._po.getAllAddresses(vendorId).subscribe(data => {
      console.log(data)
      if (data.AddressDetails && data.AddressDetails) {
        this.allAddressData = data.AddressDetails
        this._po.createAddress(data.AddressDetails)
      }
      if (data.LedgerDetails && data.LedgerDetails.length > 0) {
        this.vendorGSTType = data.LedgerDetails[0].TaxTypeId
        this.checkForGST()
      }
    }))
  }

  getNewBillNo() {
    if (!this.editMode) {
      if (this.model.PoDate) {
        let newBillDate = this.gs.clientToSqlDateFormat(this.model.PoDate, this.clientDateFormat)
        let type = (this.isBillNoManuall) ? 2 : 1
        this.destroy$.push(this._po.getNewBillNo(newBillDate, type, 'PurchaseOrder').subscribe(
          data => {
            if (data.length > 0) {
              if (!this.isBillNoManuall) {
                this.model.PoNo = data[0].BillNo
              } else {
                this.previousBillNo = data[0].BillNo
              }
            } else {
              this.previousBillNo = ''
              this.model.PoNo = ''
            }
          },
          (error) => {
            this.toastrService.showError(error, '')
          }
        ))
      }
    }
  }

  openModal() {
    this.initialiseExtras()
    $('#po_modal').modal(UIConstant.MODEL_SHOW)
    this.industryId = +this.settings.industryId
    this.taxTypeData = [
      { id: '0', text: 'Exclusive' },
      { id: '1', text: 'Inclusive' }
    ]
    this.initItem()
    this.initCharge()
    if (!this.editMode) {
      this.loading = false
      setTimeout(() => {
        if (this.vendorSelect2) {
          this.vendorSelect2.selector.nativeElement.focus({ preventScroll: false })
        }
        this.commonService.fixTableHF('cat-table')
      }, 1000)
    } else {
      if (this.editMode) {
        this.getEditData()
      }
    }
  }

  closeModal() {
    if ($('#po_modal').length > 0) {
      this.resetForm()
      this.getSPUtilityData()
      this.submitSave = false
      $('#po_modal').modal(UIConstant.MODEL_HIDE)
    }
  }

  importCategory() {
    this.commonService.openCatImport()
  }

  getCatLevel() {
    let _self = this
    this.destroy$.push(this.commonService.getSettingById(SetUpIds.catLevel).subscribe(
      (data) => {
        if (data.Code === UIConstant.THOUSAND) {
          const setUpSettings = data.Data.SetupClients
          _self.catLevel = +setUpSettings[0].Val
        }
      }
    ))
  }

  unitSettingType: number = 1

  createModels(levels) {
    // console.log('levels : ', levels)
    this.categories = []
    let obj = {
      placeholder: 'Select Category',
      value: 'category',
      data: [{ id: '0', text: 'Select Category' }],
      level: 1
    }
    this.categories.push({ ...obj })
    if (levels > 1) {
      for (let i = 0; i < levels - 1; i++) {
        obj['value'] = 'sub' + this.categories[this.categories.length - 1].value
        obj['level'] = this.categories[this.categories.length - 1].level + 1
        obj['data'] = [{ id: '0', text: 'Select Category' }]
        this.categories.push({ ...obj })
      }
    }
    // console.log('categories : ', this.categories)
  }

  allCategories: any = []
  getCatagoryDetail(data) {
    // console.log('category data : ', data)
    for (let i = 0; i < this.catLevel; i++) {
      if (this.categories[i]) {
        this.categories[i].data = [{ id: '0', text: 'Select Category' }]
      }
    }
    this.allCategories = [...data]
    let _self = this
    data.forEach(category => {
      // console.log('category.LevelNo : ', category.LevelNo)
      if (_self.categories[category.LevelNo - 1]) {
        _self.categories[category.LevelNo - 1].data.push({
          text: category.Name,
          id: category.Id
        })
      }
    })
    for (let i = 0; i < this.catLevel; i++) {
      if (this.categories[i]) {
        this.categories[i].data = Object.assign([], this.categories[i].data)
      }
    }
    // console.log('dynamic categories : ', this.categories)
    this.loading = false
  }

  catStr: string = ''
  onSelectCategory(evt, levelNo) {
    console.log('evt on change of category : ', evt, 'level : ', levelNo)
    if (this.catLevel > 1) {
      if (+evt.value > 0) {
        if (levelNo === this.catLevel) {
          if (this.categoryId !== +evt.value) {
            this.categoryId = +evt.value
            this.categoryName = evt.data[0].text
            this.checkForItems(+evt.value)
            this.validateItem()
          }
        } else {
          if (levelNo < this.catLevel) {
            let categoryId = +evt.value
            this.categoryName = evt.data[0].text
            let newData = []
            this.categories[levelNo].data = [{ id: '0', text: 'Select Category' }]
            this.allCategories.forEach(category => {
              if (category.LevelNo !== levelNo && category.LevelNo > levelNo) {
                if (category.ParentId === categoryId) {
                  newData.push({
                    text: category.Name,
                    id: category.Id
                  })
                }
              } else {
                this.categories[category.LevelNo - 1].data.push({
                  text: category.Name,
                  id: category.Id
                })
              }
            })
            this.categories[levelNo].data = Object.assign([], newData)
            this.loading = false
          }
        }
      }
      if (+evt.value === 0) {
        this.getCatagoryDetail(this.allCategories)
        this.checkForItems(+evt.value)
        this.categoryId = 0
      }
    } else {
      if (levelNo === this.catLevel) {
        if (this.categoryId !== +evt.value) {
          this.categoryId = +evt.value
          this.categoryName = evt.data[0].text
          this.checkForItems(+evt.value)
          this.validateItem()
          this.updateCategories(+evt.value)
        }
      }
    }
  }

  checkForItems(categoryId) {
    let newItemsList = []
    // this.ItemId = 0
    // this.itemName = ''
    if (categoryId > 0) {
      this.allItems.forEach(item => {
        if (item.CategoryId === categoryId) {
          newItemsList.push(item)
        }
      })
      if (this.editItemId === -1) {
        this._po.getList(newItemsList, 'Name', 'Item')
      } else {
        let newData = [{ id: '0', text: 'Select Item' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
        newItemsList.forEach(item => {
          newData.push({
            id: item.Id,
            text: item.Name
          })
        })
        this.itemData = Object.assign([], newData)
      }
    } else if (categoryId === 0) {
      this._po.getList(this.allItems, 'Name', 'Item')
    }
  }

  @ViewChild('item_select2') itemselect2: Select2Component
  onItemSelect(evt) {
    if (+evt.value === 0) {
      this.ItemId = +evt.value
      this.calculate()
    } else if (+evt.value === -1) {
      if (this.categoryId > 0) {
        this.commonService.openItemMaster('', this.categoryId)
        this.itemselect2.selector.nativeElement.value = ''
      } else {
        this.toastrService.showInfo('Please select a category', '')
      }
    } else {
      if (evt.value > 0) {
        this.ItemId = +evt.value
        this.itemName = evt.data[0].text
        this.getItemDetail(this.ItemId)
        this.updateAttributes()
      }
    }
    this.validateItem()
  }
  getItemDetail(ItemId) {
    this.destroy$.push(this._po.getItemDetail(ItemId).subscribe(data => {
      if (data && data.ItemDetails.length > 0) {
        if (data.ItemDetails.length > 0) {
          this.categoryName = data.ItemDetails[0].CategoryName
          this.ItemId = data.ItemDetails[0].Id
          this.itemName = data.ItemDetails[0].Name
          this.updateCategories(data.ItemDetails[0].CategoryId)
          this.categoryId = data.ItemDetails[0].CategoryId
          this.TaxSlabId = data.ItemDetails[0].TaxId
          this.UnitId = data.ItemDetails[0].UnitId
          this.unitSelect2.setElementValue(data.ItemDetails[0].UnitId)
          this.unitName = data.ItemDetails[0].UnitName
          this.taxSlabSelect2.setElementValue(data.ItemDetails[0].TaxId)
          this.taxSlabName = data.ItemDetails[0].TaxSlab
          this.SaleRate = data.ItemDetails[0].SaleRate
          this.PurchaseRate = data.ItemDetails[0].PurchaseRate
          this.MrpRate = data.ItemDetails[0].Mrprate
          this.itemselect2.setElementValue(data.ItemDetails[0].Id)
          if (+this.TaxSlabId > 0) {
            this.getTaxDetail(this.TaxSlabId)
          } else {
            this.validateItem()
            this.calculate()
          }
        }
      }
    },
    (error) => {
      this.toastrService.showError(error, '')
    }))
  }

  onAttributeSelect(evt, index, attributeId) {
    if (+evt.value >= 0 && evt.data.length > 0) {
      let Sno = 0
      if (this.Items.length === 0) {
        Sno = 1
      } else {
        Sno = this.Items[this.Items.length - 1].Sno + 1
      }
      if (this.itemAttributeTrans[index]) {
        this.itemAttributeTrans[index]['ItemId'] = this.ItemId
        this.itemAttributeTrans[index]['AttributeId'] = +evt.value
        this.itemAttributeTrans[index]['ParentTypeId'] = FormConstants.PURCHASEORDER
        this.itemAttributeTrans[index]['name'] = evt.value === '0' ? '' : evt.data[0].text
      } else {
        this.itemAttributeTrans[index] = {
          ItemId: this.ItemId,
          ItemTransId: Sno,
          AttributeId: +evt.value,
          ParentTypeId: FormConstants.PURCHASEORDER,
          name: evt.value === '0' ? '' : evt.data[0].text,
          id: 0,
          Sno: Sno
        }
      }
    } else if (+evt.value === -1) {
      let data = {
        addNewId: attributeId,
        attrNameId: attributeId,
        attrValue: attributeId,
        disabledAddButton: true
      }
      let item = this.attrSelect2.find((attr: Select2Component, i: number, array: Select2Component[]) => {
        return i === index
      })
      item.selector.nativeElement.value = ''
      this.commonService.openAttribute(data, true)
    }
    this.validateItem()
  }

  updateAttributes() {
    for (let i = 0; i < this.itemAttributeTrans.length; i++) {
      this.itemAttributeTrans[i].ItemId = this.ItemId
    }
  }

  getParentCatStr(id) {
    let name = ''
    this.allCategories.forEach(category => {
      if (id === category.Id) {
        name = category.Name
      }
    })
    return name
  }

  getPattern(): string {
    let childmostId = this.categoryId
    let pattern = [this.categoryId]
    this.catSelect2.forEach(() => {
      let parent = this.getParentCat(childmostId)
      if (parent !== 0) {
        pattern.push(parent)
        childmostId = parent
      }
    })
    pattern = pattern.reverse()

    let str = ''
    this.catSelect2.forEach((cat: Select2Component, index: number) => {
      if (index === (this.catLevel - 1)) {
        str += this.getParentCatStr(pattern[index])
      } else {
        str += this.getParentCatStr(pattern[index]) + ' => '
      }
    })

    return str
  }

  getParentMostCat(id, level) {
    let parentMostCategory = 0
    while (level !== 0) {
      this.allCategories.forEach(category => {
        if (id === category.Id) {
          parentMostCategory = category.Id
          id = category.ParentId
          level--
        }
      })
    }
    this.parentMostCategory = parentMostCategory
  }

  getParentCat(id) {
    let parentId = 0
    this.allCategories.forEach(category => {
      if (id === category.Id) {
        parentId = category.ParentId
      }
    })
    return parentId
  }
  @ViewChildren('cat_select2') catSelect2: QueryList<Select2Component>
  updateCategories(childmostId) {
    if (this.categoryId !== childmostId || this.editItemId !== -1) {
      let pattern = [childmostId]
      this.catSelect2.forEach(() => {
        let parent = this.getParentCat(childmostId)
        if (parent !== 0) {
          pattern.push(parent)
          childmostId = parent
        }
      })
      pattern = pattern.reverse()
      setTimeout(() => {
        this.catSelect2.forEach((item: Select2Component, index: number) => {
          item.setElementValue(pattern[index])
        })
      }, 100)
    }
    else {
      let pattern = [childmostId]
      this.catSelect2.forEach(() => {
        let parent = this.getParentCat(childmostId)
        if (parent !== 0) {
          pattern.push(parent)
          childmostId = parent
        }
      })
      pattern = pattern.reverse()
      setTimeout(() => {
        this.catSelect2.forEach((item: Select2Component, index: number) => {
          item.setElementValue(pattern[index])
        })
      }, 100)
    }
  }

  updateCatArray(id, levelNo) {
    console.log('evt on updateCatArray of category : ', id, 'level : ', levelNo)
    if (levelNo < this.catLevel) {
      let categoryId = +id
      let newData = []
      this.categories[levelNo].data = [{ id: '0', text: 'Select Category' }]
      this.allCategories.forEach(category => {
        if (category.LevelNo === levelNo + 1 && category.ParentId === categoryId) {
          newData.push({
            text: category.Name,
            id: category.Id
          })
        }
      })
      console.log('level no : ', levelNo, 'new data : ', newData)
      this.categories[levelNo].data = newData
      // this.categories = Object.assign([], this.categories)
    }
  }

  appliedTaxRatesItem: any = []
  appliedTaxRatesCharge: any = []
  calculate() {
    let total = +(isNaN(+this.PurchaseRate) ? 0 : +this.PurchaseRate)
      * (isNaN(+this.Quantity) || +this.Quantity === 0 ? 1 : +this.Quantity)
      * (isNaN(+this.Length) || +this.Length === 0 ? 1 : +this.Length)
      * (isNaN(+this.Width) || +this.Width === 0 ? 1 : +this.Width)
      * (isNaN(+this.Height) || +this.Height === 0 ? 1 : +this.Height)
    this.TotalRate = +total.toFixed(this.noOfDecimalPoint)
    this.AmountItem = +total.toFixed(this.noOfDecimalPoint)
    if (this.TotalRate > 0) {
      if (this.editItemIndex > -1) {
        this.Items[this.editItemIndex].PurchaseRate = this.PurchaseRate
        this.Items[this.editItemIndex].Quantity = this.Quantity
        this.Items[this.editItemIndex].Length = this.Length
        this.Items[this.editItemIndex].Width = this.Width
        this.Items[this.editItemIndex].Height = this.Height
        this.Items[this.editItemIndex].AmountItem = this.AmountItem
      }
      if (this.TaxType === 0) {
        let returnTax = this._po.taxCalculation(this.taxRates, this.taxSlabType, total , this.isOtherState, FormConstants.PURCHASEORDER, this.taxSlabName)
        this.TaxAmount = +(returnTax.taxAmount).toFixed(4)
        this.appliedTaxRatesItem = returnTax.appliedTaxRates
        if (this.editItemIndex > -1) {
          this.Items[this.editItemIndex].TaxAmount = this.TaxAmount
          this.Items[this.editItemIndex].itemTaxTrans = returnTax.appliedTaxRates
        }
      } else {
        if (this.taxCalInclusiveType === 1) {
          let AmountItem = +(this._po.calcTaxableAmountType1(this.taxRates, this.taxSlabType, total, this.isOtherState)).toFixed(4)
          this.AmountItem = AmountItem
          if (this.editItemIndex > -1) {
            this.Items[this.editItemIndex].AmountItem = this.AmountItem
          }
          let returnTax = this._po.taxCalCulationForInclusive(this.taxRates,
            this.taxSlabType,
            this.AmountItem,
            this.isOtherState, FormConstants.PURCHASEORDER, this.taxSlabName)
          this.TaxAmount = +(returnTax.taxAmount).toFixed(4)
          this.appliedTaxRatesItem = returnTax.appliedTaxRates
          if (this.editItemIndex > -1) {
            this.Items[this.editItemIndex].TaxAmount = this.TaxAmount
            this.Items[this.editItemIndex].itemTaxTrans = returnTax.appliedTaxRates
          }
        } else {
          let AmountItem = +(this._po.calcTaxableAmountType2(this.taxRates, this.taxSlabType, total, this.isOtherState)).toFixed(4)
          this.AmountItem = AmountItem
          if (this.editItemIndex > -1) {
            this.Items[this.editItemIndex].AmountItem = AmountItem
          }
          let returnTax = this._po.taxCalCulationForInclusiveType2(this.taxRates, this.taxSlabType, this.AmountItem, this.isOtherState, FormConstants.PURCHASEORDER, this.taxSlabName)
          this.TaxAmount = +(returnTax.taxAmount).toFixed(4)
          this.appliedTaxRatesItem = returnTax.appliedTaxRates
          if (this.editItemIndex > -1) {
            this.Items[this.editItemIndex].TaxAmount = this.TaxAmount
            this.Items[this.editItemIndex].itemTaxTrans = returnTax.appliedTaxRates
          }
        }
      }
    } else {
      this.TaxAmount = 0
      if (this.editItemIndex > -1) {
        this.Items[this.editItemIndex].DiscountAmt = 0
        this.Items[this.editItemIndex].TaxAmount = 0
      }
    }
    this.TaxableAmountCharge = +this.AmountCharge
    if (this.taxChargeRates.length > 0 && +this.AmountCharge > 0) {
      if (this.TaxTypeCharge === 0) {
        let returnTax = this._po.taxCalculation(this.taxChargeRates,
          this.taxChargeSlabType,
          +this.AmountCharge,
          this.isOtherState, FormConstants.ChargeForm, this.TaxChargeName)
        this.TaxAmountCharge = +(returnTax.taxAmount).toFixed(4)
        this.appliedTaxRatesCharge = returnTax.appliedTaxRates
        if (this.editChargeIndex > -1) {
          this.AdditionalCharges[this.editChargeIndex].TaxAmountCharge = this.TaxAmountCharge
          this.AdditionalCharges[this.editChargeIndex].TaxableAmountCharge = this.TaxableAmountCharge
          this.AdditionalCharges[this.editChargeIndex].itemTaxTrans = returnTax.appliedTaxRates
        }
      } else {
        if (this.TaxTypeCharge === 1) {
          let AmountCharge = this._po.calcTaxableAmountType1(this.taxChargeRates,
            this.taxChargeSlabType, +this.AmountCharge, this.isOtherState)
          console.log('amount charge : ', AmountCharge)
          this.TaxableAmountCharge = +AmountCharge.toFixed(this.noOfDecimalPoint)
          let returnTax = this._po.taxCalCulationForInclusive(this.taxChargeRates,
            this.taxChargeSlabType,
            +AmountCharge,
            this.isOtherState, FormConstants.ChargeForm, this.TaxChargeName)
          this.TaxAmountCharge = +(returnTax.taxAmount).toFixed(4)
          this.appliedTaxRatesCharge = returnTax.appliedTaxRates
          if (this.editChargeIndex > -1) {
            this.AdditionalCharges[this.editChargeIndex].TaxAmountCharge = this.TaxAmountCharge
            this.AdditionalCharges[this.editChargeIndex].itemTaxTrans = returnTax.appliedTaxRates
            this.AdditionalCharges[this.editChargeIndex].TaxableAmountCharge = this.TaxableAmountCharge
          }
        }
      }
    } else if (this.editChargeId === -1) {
      this.TaxAmountCharge = 0
      this.TotalAmountCharge = 0
      this.TaxableAmountCharge = 0
      this.appliedTaxRatesCharge = []
    }
    if (+this.AmountCharge > 0) {
      this.TotalAmountCharge = +(+this.AmountCharge + + ((this.TaxTypeCharge === 0) ? (isNaN(+this.TaxAmountCharge) ? 0 : +this.TaxAmountCharge) : 0)).toFixed(this.noOfDecimalPoint)
      if (this.editChargeIndex > -1) {
        this.AdditionalCharges[this.editChargeIndex].TotalAmountCharge = this.TotalAmountCharge
      }
    } else {
      if (this.editChargeIndex > -1) {
        this.TaxAmountCharge = 0
        this.TotalAmountCharge = 0
        this.TaxableAmountCharge = 0
        this.AdditionalCharges[this.editChargeIndex].TaxAmountCharge = 0
        this.AdditionalCharges[this.editChargeIndex].itemTaxTrans = []
        this.AdditionalCharges[this.editChargeIndex].taxChargeRates = []
        this.AdditionalCharges[this.editChargeIndex].TotalAmountCharge = 0
        this.AdditionalCharges[this.editChargeIndex].AmountCharge = 0
        this.AdditionalCharges[this.editChargeIndex].TaxableAmountCharge = 0
      }
    }
    this.TotalAmountCharge = +this.TotalAmountCharge.toFixed(4)
    if (this.editChargeIndex > -1) {
      this.AdditionalCharges[this.editChargeIndex].TotalAmountCharge = 0
    }
    this.Amount = +(this.calculateTotalOfRow()).toFixed(this.noOfDecimalPoint)
    if (this.editItemIndex > -1) {
      this.Items[this.editItemIndex].Amount = this.Amount
    }
    if (+this.ItemId > 0 || +this.LedgerChargeId > 0) {
      this.calculateAllTotal()
    }
    this.getBillSummary()
  }

  calculateTotalOfRow() {
    let totalAmount = +this.TotalRate  + (isNaN(+this.TaxAmount) ? 0 : +this.TaxAmount)
    return isNaN(totalAmount) ? 0 : totalAmount
  }
  resetCalculate(editItemIndex) {
    this.Items[editItemIndex].TaxAmount = 0
    this.Items[editItemIndex].AmountItem = 0
    this.Items[editItemIndex].PurchaseRate = 0
    this.Items[editItemIndex].AmountItemBillDiscount = 0
    this.Items[editItemIndex].itemTaxTrans = []
    this.Items[editItemIndex].DiscountAmt = 0
    this.Items[editItemIndex].taxRates = []
    this.Items[editItemIndex].TotalRate = 0
    this.Items[editItemIndex].Quantity = 1
    this.Items[editItemIndex].Length = 1
    this.Items[editItemIndex].Width = 1
    this.Items[editItemIndex].Height = 1
    this.TaxAmount = 0
    this.AmountItem = 0
  }
  @ViewChild('unit_select2') unitSelect2: Select2Component
  onUnitSelect(evt) {
    this.UnitId = +evt.value
    if (evt.value && evt.data.length > 0) {
      if (+evt.value === -1) {
        this.unitSelect2.selector.nativeElement.value = ''
        if (+this.unitSettingType === 1) {
          this.commonService.openUnit('')
        }
        if (+this.unitSettingType === 2) {
          this.commonService.openCompositeUnit('')
        }
      } else {
        if (evt.value > 0) {
          this.unitName = evt.data[0].text
        }
      }
      this.validateItem()
    }
  }

  @ViewChild('organisation_select2') organisationSelect2: Select2Component
  newDate: string = ''
  @ViewChild('address_select2') addressSelect2: Select2Component
  onAddressSelect(evt) {
    console.log('onAddressSelect : ', evt)
    if (+evt.value === -1) {
      this.addressSelect2.selector.nativeElement.value = ''
      if (this.LedgerId) {
        this.commonService.openAddress(this.LedgerId)
      } else {
        this.toastrService.showError('Please select Vendor', '')
      }
    } else if (+evt.value === 0) {
      this.AddressId = 0
      this.isOtherState = false
      this.updateItemTax()
    } else {
      this.AddressId = +evt.value
      this.checkForGST()
    }
    this.checkForValidation()
  }

  needToCheckItem: boolean = false
  needToCheckCharge: boolean = false
  checkForGST() {
    let isOtherState = true
    this.allAddressData.forEach(element => {
      if (element.Id === this.AddressId && element.StateId === this.clientStateId) {
        isOtherState = false
      }
    })
    this.isOtherState = isOtherState
    this.updateItemTax()
  }

  updateChargeTax() {
    if (this.AdditionalCharges.length > 0) {
      const observables = [];
      for (const charge of this.AdditionalCharges) {
        if (charge.TaxSlabChargeId !== 0) {
          observables.push(this._po.getSlabData(charge.TaxSlabChargeId));
        }
      }
      forkJoin(...observables).subscribe(
        data => {
          data.forEach((element, index) => {
            let appliedTaxRatesCharge = []
            let taxChargeSlabType = (element.TaxSlabs[0]) ? element.TaxSlabs[0].Type : 0
            if (this.vendorGSTType !== 1) {
              element.TaxRates = []
            }
            if (+this.AdditionalCharges[index].AmountCharge > 0) {

              if (this.AdditionalCharges[index].TaxTypeCharge === 1) {
                let returnTax = this._po.taxCalCulationForInclusive(element.TaxRates,
                  taxChargeSlabType,
                  +this.AdditionalCharges[index].AmountCharge,
                  this.isOtherState, FormConstants.ChargeForm, element.TaxSlabs[0].Slab)
                this.AdditionalCharges[index]['TaxAmountCharge'] = +returnTax.taxAmount
                appliedTaxRatesCharge = returnTax.appliedTaxRates
              } else if (this.AdditionalCharges[index].TaxTypeCharge === 0) {
                let returnTax = this._po.taxCalculation(element.TaxRates,
                  taxChargeSlabType,
                  +this.AdditionalCharges[index].AmountCharge,
                  this.isOtherState, FormConstants.ChargeForm, element.TaxSlabs[0].Slab)
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

          this.calculateAllTotal()
        },
        (error) => {
          this.toastrService.showError(error, '')
        },
        () => {
          setTimeout(() => {
            this.getBillSummary()
          }, 100)
        }
      )
    } else {
      this.getBillSummary()
    }
  }

  updateItemTax() {
    if (this.Items.length > 0) {
      const observables = [];
      for (const item of this.Items) {
        if (item.TaxSlabId !== 0) {
          observables.push(this._po.getSlabData(item.TaxSlabId));
        }
      }
      this.destroy$.push(forkJoin(...observables).subscribe(
        data => {
          console.log(data)
          data.forEach((element, index) => {
            let appliedTaxRatesItem = []
            let taxSlabType = (element.TaxSlabs[0]) ? element.TaxSlabs[0].Type : 0
            if (element.TaxRates.length > 0 && +this.Items[index].AmountItem > 0) {
              if (this.vendorGSTType !== 1) {
                element.TaxRates = []
              }
              if (this.Items[index].TaxType === 1) {
                let returnTax = this._po.taxCalCulationForInclusive(element.TaxRates,
                  taxSlabType,
                  +this.Items[index].AmountItem,
                  this.isOtherState, FormConstants.PURCHASEORDER, element.TaxSlabs[0].Slab)
                this.Items[index]['TaxAmount'] = returnTax.taxAmount
                appliedTaxRatesItem = returnTax.appliedTaxRates
              } else if (this.Items[index].TaxType === 0) {
                let returnTax = this._po.taxCalculation(element.TaxRates,
                  taxSlabType,
                  +this.Items[index].AmountItem,
                  this.isOtherState, FormConstants.PURCHASEORDER, element.TaxSlabs[0].Slab)
                this.Items[index]['TaxAmount'] = returnTax.taxAmount
                appliedTaxRatesItem = returnTax.appliedTaxRates
              }

              if (appliedTaxRatesItem.length > 0) {
                appliedTaxRatesItem.forEach((taxRate) => {
                  if (this.Items[index].Id !== 0) {
                    taxRate['ItemTransTaxId'] = this.Items[index].Id
                  } else {
                    taxRate['ItemTransTaxId'] = this.Items[index].Sno
                  }
                })
              }
              this.Items[index].itemTaxTrans = appliedTaxRatesItem
            }
            this.Items[index]['Amount'] = +this.Items[index].AmountItem + +this.Items[index]['TaxAmount']
          });

          this.calculateAllTotal()
        },
        (error) => {
          console.log(error)
        },
        () => {
          if (this.AdditionalCharges.length === 0) {
            setTimeout(() => {
              this.calculate()
              this.getBillSummary()
            }, 100)
          } else {
            this.updateChargeTax()
          }
        }
      ))
    }
    else if (this.Items.length === 0) {
      this.calculate()
    }
    else {
      this.updateChargeTax()
    }
  }

  ConvertToCurrencyId: number
  onConvertToCurrencySelect(evt) {
    // console.log(evt)
    if (evt.value > 0 && evt.data[0] && evt.data[0].text) {
      this.ConvertToCurrencyId = +evt.value
    }
  }

  enterPressItem(e: KeyboardEvent) {
    this.addItems()
  }

  addItems() {
    this.checkForFocus()
    this.validateItem()
    if (+this.ItemId > 0 && +this.UnitId > 0 && this.Quantity > 0 && this.PurchaseRate > 0) {
      this.addItem()
      this.clickItem = true
      if (!this.editItemFlag) {
        this.calculateAllTotal()
        this.getBillSummary()
      }
      this.initItem()
    }
  }

  addItem() {
    this.addItemBasedOnIndustry()
    this.ItemAttributeTrans = this.ItemAttributeTrans.concat(this.itemAttributeTrans)
    if (this.editItemId > 0) {
      this.showHideAddItemRow = true
    }
    this.Items.forEach((element, i) => {
      if (element.Id === 0) {
        this.showHideAddItemRow = true
      }
    })
  }
  addItemBasedOnIndustry() {
    let Sno = 0
    if (this.Items.length === 0) {
      Sno = 1
    } else if (this.Items.length > 0) {
      Sno = +this.Items[this.Items.length - 1].Sno + 1
      this.Items.forEach((element, i) => {
        if (this.editItemId > 0) {
          if (element.Id === this.editItemId) {
            this.Items.splice(i, 1)
            this.ItemAttributeTrans = []
            this.Items.forEach(item => {
              this.ItemAttributeTrans = this.ItemAttributeTrans.concat([], item.itemAttributeTrans)
            })
          }
        }
        if (element.Id === 0) {
          if (element.Sno === this.editItemSno) {
            this.Items.splice(i, 1)
            this.ItemAttributeTrans = []
            this.Items.forEach(item => {
              this.ItemAttributeTrans = this.ItemAttributeTrans.concat([], item.itemAttributeTrans)
            })
          }
        }
      })
    }
    this.Items.push({
      Id: 0,
      Sno: Sno,
      TransType: this.TransType,
      TransId: this.TransId,
      CategoryId: +this.categoryId,
      ItemId: +this.ItemId,
      UnitId: +this.UnitId,
      Length: +this.Length,
      Height: +this.Height,
      Width: +this.Width,
      Quantity: +this.Quantity,
      SaleRate: +this.SaleRate,
      MrpRate: +this.MrpRate,
      PurchaseRate: +this.PurchaseRate,
      TotalRate: +this.TotalRate,
      TaxSlabId: this.TaxSlabId,
      TaxType: +this.TaxType,
      TaxAmount: +this.TaxAmount,
      ExpiryDate: this.ExpiryDate,
      MfdDate: this.MfdDate,
      BatchNo: this.BatchNo,
      Remark: this.Remark,
      itemName: this.itemName,
      categoryName: this.getPattern(),
      unitName: this.unitName,
      taxSlabName: this.taxSlabName,
      taxTypeName: this.taxTypeName,
      Amount: this.Amount,
      itemAttributeTrans: this.itemAttributeTrans,
      AmountItem: this.AmountItem,
      taxSlabType: this.taxSlabType,
      taxRates: this.taxRates,
      itemTaxTrans: this.appliedTaxRatesItem,
      isDisabled: this.DisabledRow,
      ChallanId: 0,
      IsNotDiscountable: true,
      AmountItemBillDiscount: 0,
      DiscountType: 0,
      Discount: 0,
      DiscountAmt: 0
    })
    this.addItemDisbaled = false
    setTimeout(() => {
      this.commonService.fixTableHFL('item-table')
    }, 1)

    if (this.editItemId !== -1) {
      this.Items[this.Items.length - 1].Id = this.editItemId
    }
    console.log(this.Items)
  }
  DisabledRow: boolean = true
  EditabledChargeRow: boolean = true
  EditabledPay: boolean = true
  showHideAddItemRow: any = true
  showHideItemCharge: any = true
  showHidePayment: any = true
  editTransSno: number = 0
  SrNo: any = 0
  editItemFlag: boolean
  editItemIndex: number = -1
  editChargeIndex: number = -1
  @ViewChildren('attr_select2') attrSelect2: QueryList<Select2Component>
  editItem(i, editId, type, sno) {
    if (type === 'charge' && this.editChargeId === -1) {
      this.editChargeId = editId
      this.editChargeSno = sno
      i = i - 1
      this.showHideItemCharge = false
      this.editChargeIndex = i
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

    if (type === 'items' && this.editItemId === -1 && this.ItemId === 0) {
      this.editItemId = editId
      this.editItemSno = sno
      i = i - 1
      this.editItemFlag = true
      this.SrNo = this.Items[i].SrNo
      this.showHideAddItemRow = false
      this.Items[i].isDisabled = false
      this.DisabledRow = true
      this.TransType = 0
      this.TransId = 0
      this.editItemIndex = i
      this.categoryName = this.Items[i].categoryName
      this.unitName = this.Items[i].unitName
      this.taxSlabName = this.Items[i].taxSlabName
      this.taxTypeName = this.Items[i].taxTypeName
      this.categoryId = this.Items[i].CategoryId
      this.UnitId = this.Items[i].UnitId
      this.Length = this.Items[i].Length
      this.Height = this.Items[i].Height
      this.Width = this.Items[i].Width
      this.Quantity = this.Items[i].Quantity
      this.SaleRate = this.Items[i].SaleRate
      this.MrpRate = this.Items[i].MrpRate
      this.PurchaseRate = this.Items[i].PurchaseRate
      this.TaxSlabId = this.Items[i].TaxSlabId
      this.TaxType = this.Items[i].TaxType
      this.TaxAmount = +this.Items[i].TaxAmount.toFixed(4)
      this.ExpiryDate = this.Items[i].ExpiryDate
      this.MfdDate = this.Items[i].MfdDate
      this.BatchNo = this.Items[i].BatchNo
      this.Remark = this.Items[i].Remark
      this.TotalRate = this.Items[i].TotalRate
      this.Amount = +this.Items[i].Amount.toFixed(4)
      this.AmountItem = this.Items[i].AmountItem
      this.taxSlabType = this.Items[i].taxSlabType
      this.itemAttributeTrans = this.Items[i].itemAttributeTrans
      this.appliedTaxRatesItem = this.Items[i].itemTaxTrans
      this.taxRates = this.Items[i].taxRates
      let ItemId = this.Items[i].ItemId
      this.updateCategories(this.categoryId)
      this.checkForItems(this.categoryId)
      this.itemName = this.Items[i].itemName
      this.ItemId = this.Items[i].ItemId
      let _self = this
      let TaxSlabId = this.Items[i].TaxSlabId
      let TaxType = this.Items[i].TaxType

      setTimeout(() => {
        _self.itemselect2.setElementValue(ItemId)
        _self.ItemId = ItemId
        _self.taxSlabSelect2.setElementValue(TaxSlabId)
        _self.TaxSlabId = TaxSlabId
        _self.taxTypeSelect2.setElementValue(TaxType)
        this.unitSelect2.setElementValue(this.UnitId)
        _self.TaxType = TaxType
      }, 1)
      setTimeout(() => {
        if (this.attrSelect2.length > 0) {
          this.attrSelect2.forEach((item: Select2Component, index: number, array: Select2Component[]) => {
            item.setElementValue(this.itemAttributeTrans[index].AttributeId)
          })
        }
      }, 500)
    }

  }

  deleteItem(i, forArr, flag) {
    if (forArr === 'items') {
      this.Items.splice(i, 1)
      this.ItemAttributeTrans = []
      this.Items.forEach(item => {
        this.ItemAttributeTrans = this.ItemAttributeTrans.concat([], item.itemAttributeTrans)
      })
      if (this.Items.length > 0) {
        this.addItemDisbaled = false
      }
      else {
        this.addItemDisbaled = true
      }
    }
    if (forArr === 'charge') {
      if (flag) {
        this.alreadySelectCharge(this.AdditionalCharges[i].LedgerChargeId, this.AdditionalCharges[i].LedgerName, false)
      }
      this.AdditionalCharges.splice(i, 1)
    }
    this.calculate()
  }

  close() {
    this.showHideAddItemRow = true
    this.showHideItemCharge = true
    this.showHidePayment = true
    this._po.closePO()
  }

  initItem() {
    this.editItemFlag = false
    this.editItemIndex = -1
    this.TransType = 0
    this.TransId = 0
    this.ItemId = 0
    this.itemName = ''
    this.UnitId = 0
    this.unitName = ''
    this.categoryName = ''
    this.Length = 1
    this.Height = 1
    this.Width = 1
    this.Quantity = 1
    this.SaleRate = 0
    this.TotalRate = 0
    this.MrpRate = 0
    this.PurchaseRate = 0
    this.TaxSlabId = 0
    this.taxSlabName = ''
    this.TaxType = 0
    this.TaxAmount = 0
    this.ExpiryDate = this.gs.getDefaultDate(this.clientDateFormat)
    this.MfdDate = this.gs.getDefaultDate(this.clientDateFormat)
    this.BatchNo = ''
    this.Remark = ''
    this.categoryId = 0
    this.Amount = 0
    this.AmountItem = 0
    this.editItemId = -1
    this.clickItem = false
    console.log('categories : ', this.categories)
    if (this.allCategories && this.allCategories.length > 0) {
      this.getCatagoryDetail(this.allCategories)
    }
    if (this.allItems && this.allItems.length > 0) {
      this._po.getList(this.allItems, 'Name', 'Item')
    }
    if (this.taxTypeSelect2) {
      this.taxTypeSelect2.setElementValue(this.TaxType)
    }
    if (this.unitSelect2) {
      this.unitSelect2.setElementValue(this.UnitId)
    }
    if (this.itemselect2) {
      this.itemselect2.setElementValue(this.ItemId)
    }
    if (this.taxSlabSelect2) {
      this.taxSlabSelect2.setElementValue(this.TaxSlabId)
    }
    this.taxTypeName = 'Exclusive'
    this.itemAttributeTrans = []
    this.appliedTaxRatesItem = []
    this.taxRates = []
    this.taxSlabType = 0
    if (this.catSelect2 && this.catSelect2.length > 0) {
      this.catSelect2.forEach((item: Select2Component) => {
        item.setElementValue(0)
        item.selector.nativeElement.value = ''
      })
    }
    this.initAttribute()
    setTimeout(() => {
      this.commonService.fixTableHFL('item-table')
    }, 1)
  }

  initAttribute() {
    this.ItemId = 0
    this.ItemTransId = 0
    this.AttributeId = 0
    if (this.attrSelect2 && this.attrSelect2.length > 0) {
      this.attrSelect2.forEach((item: Select2Component, index: number, array: Select2Component[]) => {
        if ($('.attr') && $('.attr')[index]) {
          $('#' + $('.attr')[index].id).removeClass('errorSelecto')
        }
        item.setElementValue(0)
      })
    }
    let Sno = 0
    if (this.Items.length === 0) {
      Sno = 1
    } else {
      Sno = this.Items[this.Items.length - 1].Sno + 1
    }
    let index_sno = 0
    if (this.ItemAttributeTrans.length === 0) {
      index_sno = 1
    } else {
      index_sno = this.ItemAttributeTrans[this.ItemAttributeTrans.length - 1]['Sno'] + 1
    }
    this.attributesData.forEach((element, index) => {
      this.itemAttributeTrans[index] = {
        ItemId: 0,
        ItemTransId: Sno,
        AttributeId: 0,
        ParentTypeId: FormConstants.PURCHASEORDER,
        name: '',
        id: 0,
        Sno: index_sno
      }
      index_sno++
    });
    console.log(this.itemAttributeTrans)
  }

  @ViewChild('taxSlabCharge_select2') taxSlabChargeSelect2: Select2Component
  @ViewChild('charge_select2') chargeSelect2: Select2Component
  initCharge() {
    this.editChargeIndex = -1
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

  initComp() {
    this.initItem()
    this.initCharge()
    this.getSetUpModules((JSON.parse(this.settings.moduleSettings).settings))
  }

  initialiseExtras() {
    this.model.openRate = false
    this.model.openItems = false
    this.BillAmount = 0
    this.AddressId = 0
    this.LedgerId = 0
    this.SubTotalAmount = 0
    this.TotalTaxAmount = 0
    this.TotalQty = 0
    this.Advanceamount = 0
    this.NetAmount = 0
    this.ItemAttributeTrans = []
    this.Items = []
    this.AdditionalCharges = []
    this.ItemTaxTrans = []
    this.clickTrans = false
    this.clickItem = false
    this.clickCharge = false
    this.submitSave = false
    this.NetBillAmount = 0
    this.TaxableValue = 0
    this.billSummary = []
    this.invalidObj = {}
    this.AdditionalChargesToShow = []
    this.billSummary = []
    this.AddressData = []
    this.showHideAddItemRow = true
    this.showHideItemCharge = true
    this.showHidePayment = true
    this.editItemFlag = false
    this.editItemIndex = -1
    this.editChargeIndex = -1
    this.resetForm()
    this.getNewBillNo()
    setTimeout(() => {
      if (this.vendorSelect2) {
        this.vendorSelect2.selector.nativeElement.focus({ preventScroll: false })
      }
      this.commonService.fixTableHF('cat-table')
    }, 1000)
  }

  private purchaseOrderParams() {
    let PODate = this.gs.clientToSqlDateFormat(this.model.PoDate, this.clientDateFormat)
    let ExDeliveryFromDate = this.gs.clientToSqlDateFormat(this.model.ExDeliveryFromDate, this.clientDateFormat)
    let ExDeliveryToDate = this.gs.clientToSqlDateFormat(this.model.ExDeliveryToDate, this.clientDateFormat)
    let Items = JSON.parse(JSON.stringify(this.Items))
    Items.forEach(item => {
      item.ExpiryDate = (item.ExpiryDate) ? this.gs.clientToSqlDateFormat(item.ExpiryDate, this.clientDateFormat) : ''
      item.MfdDate = (item.MfdDate) ? this.gs.clientToSqlDateFormat(item.MfdDate, this.clientDateFormat) : ''
    })
    this.ItemAttributeTrans.forEach((attr, index) => {
      attr.Sno = index + 1
    })
    const purchaseOrder = {
      obj: {
        Id: this.Id ? this.Id : UIConstant.ZERO,
        PoNo: this.model.PoNo,
        ExDeliveryFromDate: ExDeliveryFromDate,
        LedgerId: this.LedgerId,
        ParentId: this.ParentId,
        ParentTypeId: FormConstants.PURCHASEORDER,
        PoDate: PODate,
        PoTypeId: 1,
        ExDeliveryToDate: ExDeliveryToDate,
        Remark: this.model.Remark,
        DeliveryMode: this.model.DeliveryMode,
        Items: Items,
        AddressId: this.AddressId,
        ItemAttributeTransLists: this.ItemAttributeTrans,
        AdditionalCharges: this.AdditionalCharges
      }
    }
    console.log('obj : ', JSON.stringify(purchaseOrder.obj))
    return purchaseOrder.obj
  }

  checkForValidation() {
    // if (this.LedgerId || this.model.PoDate
    //   || this.AddressId || this.Quantity
    //   || this.ItemId || this.UnitId || this.TaxSlabId
    //   || this.PurchaseRate
    //   || this.BatchNo || this.ExpiryDate || this.MfdDate
    //   || this.Length || this.Width || this.Height
    // ) {
      
    // }
    let isValid = 1
    if (+this.LedgerId > 0) {
      this.invalidObj['LedgerId'] = false
    } else {
      this.invalidObj['LedgerId'] = true
      isValid = 0
    }
    if (+this.AddressId > 0) {
      this.invalidObj['AddressId'] = false
    } else {
      this.invalidObj['AddressId'] = true
      isValid = 0
    }
    if (this.model.PoDate) {
      this.invalidObj['PoDate'] = false
    } else {
      this.invalidObj['PoDate'] = true
      isValid = 0
    }
    if (this.model.PoNo) {
      this.invalidObj['PONumber'] = false
    } else {
      this.invalidObj['PONumber'] = true
      isValid = 0
    }
    if (this.Items.length === 0 && this.submitSave) {
      isValid = 0
      if (+this.ItemId > 0) {
        this.invalidObj['ItemId'] = false
      } else {
        isValid = 0
        this.invalidObj['ItemId'] = true
      }
      if (+this.UnitId > 0) {
        this.invalidObj['UnitId'] = false
      } else {
        isValid = 0
        this.invalidObj['UnitId'] = true
      }
      if (+this.TaxSlabId > 0) {
        this.invalidObj['TaxSlabId'] = false
      } else {
        isValid = 0
        this.invalidObj['TaxSlabId'] = true
      }
      if (+this.PurchaseRate > 0) {
        this.invalidObj['PurchaseRate'] = false
      } else {
        isValid = 0
        this.invalidObj['PurchaseRate'] = true
      }
      if (+this.Quantity > 0) {
        this.invalidObj['Quantity'] = false
      } else {
        isValid = 0
        this.invalidObj['Quantity'] = true
      }
      if (this.industryId === 5) {
        if (this.BatchNo) {
          this.invalidObj['BatchNo'] = false
        } else {
          isValid = 0
          this.invalidObj['BatchNo'] = true
        }
        if (this.MfdDate) {
          this.invalidObj['MfdDate'] = false
        } else {
          isValid = 0
          this.invalidObj['MfdDate'] = true
        }
        if (this.ExpiryDate) {
          this.invalidObj['ExpiryDate'] = false
        } else {
          isValid = 0
          this.invalidObj['ExpiryDate'] = true
        }
      }
      if (this.industryId === 3) {
        if (+this.Length > 0) {
          this.invalidObj['Length'] = false
        } else {
          isValid = 0
          this.invalidObj['Length'] = true
        }
        if (+this.Height > 0) {
          this.invalidObj['Height'] = false
        } else {
          isValid = 0
          this.invalidObj['Height'] = true
        }
        if (+this.Width > 0) {
          this.invalidObj['Width'] = false
        } else {
          isValid = 0
          this.invalidObj['Width'] = true
        }
      }
    }
    // this.checkForFocus()
    return !!isValid
  }

  validateItem() {
    if (+this.ItemId > 0) {
      let isValid = 1
      if (+this.ItemId > 0) {
        this.invalidObj['ItemId'] = false
      } else {
        isValid = 0
        this.invalidObj['ItemId'] = true
      }
      if (+this.UnitId > 0) {
        this.invalidObj['UnitId'] = false
      } else {
        isValid = 0
        this.invalidObj['UnitId'] = true
      }
      if (+this.TaxSlabId > 0) {
        this.invalidObj['TaxSlabId'] = false
      } else {
        isValid = 0
        this.invalidObj['TaxSlabId'] = true
      }
      if (+this.PurchaseRate > 0) {
        this.invalidObj['PurchaseRate'] = false
      } else {
        isValid = 0
        this.invalidObj['PurchaseRate'] = true
      }
      if (+this.Quantity > 0) {
        this.invalidObj['Quantity'] = false
      } else {
        isValid = 0
        this.invalidObj['Quantity'] = true
      }
      if (this.industryId === 5) {
        if (this.BatchNo) {
          this.invalidObj['BatchNo'] = false
        } else {
          isValid = 0
          this.invalidObj['BatchNo'] = true
        }
        if (this.MfdDate) {
          this.invalidObj['MfdDate'] = false
        } else {
          isValid = 0
          this.invalidObj['MfdDate'] = true
        }
        if (this.ExpiryDate) {
          this.invalidObj['ExpiryDate'] = false
        } else {
          isValid = 0
          this.invalidObj['ExpiryDate'] = true
        }
      }
      if (this.industryId === 3) {
        if (+this.Length > 0) {
          this.invalidObj['Length'] = false
        } else {
          isValid = 0
          this.invalidObj['Length'] = true
        }
        if (+this.Height > 0) {
          this.invalidObj['Height'] = false
        } else {
          isValid = 0
          this.invalidObj['Height'] = true
        }
        if (+this.Width > 0) {
          this.invalidObj['Width'] = false
        } else {
          isValid = 0
          this.invalidObj['Width'] = true
        }
      }
      this.validItem = !!isValid
    } else {
      this.validItem = true
      this.invalidObj['Height'] = false
      this.invalidObj['Width'] = false
      this.invalidObj['Length'] = false
      this.invalidObj['ExpiryDate'] = false
      this.invalidObj['MfdDate'] = false
      this.invalidObj['BatchNo'] = false
      this.invalidObj['Quantity'] = false
      this.invalidObj['PurchaseRate'] = false
      this.invalidObj['TaxSlabId'] = false
      this.invalidObj['UnitId'] = false
      this.invalidObj['ItemId'] = false
    }
  }

  DisabledSaveBtn: boolean = false
  manipulateData() {
    let _self = this
    this.submitSave = true
    this.checkForFocus()
    this.addItems()
    this.addCharge()
    this.getBillSummary()
    this.calculateAllTotal()
    this.validateItem()
    if (this.checkForValidation() && this.validItem) {
      let dataToSend = this.purchaseOrderParams()
      if (dataToSend.Items.length > 0) {
        this.DisabledSaveBtn = true
        this.destroy$.push(this._po.postPO(dataToSend).subscribe(
          data => {
            console.log('data : ', data)
            if (data.Code === UIConstant.THOUSAND && data.Data) {
              _self.toastrService.showSuccess('Saved Successfully', '')
              this.DisabledSaveBtn = false
              if (!this.keepOpen) {
                _self._po.onPOAdd()
                _self._po.closePO()
              } else {
                _self.initComp()
                _self.initialiseExtras()
                this.editMode = false
              }
            } else if (data.Code === UIConstant.THOUSANDONE) {
              this.DisabledSaveBtn = false
              _self.toastrService.showError(data.Message, 'Please change Bill No.')
            } else if (data.Code === UIConstant.REQUIRED_5020) {
              this.DisabledSaveBtn = false
              _self.toastrService.showError(data.Message, '')
            } else if (data.Code === UIConstant.SERVERERROR) {
              this.DisabledSaveBtn = false
              _self.toastrService.showError(data.Description, '')
            } else {
              this.DisabledSaveBtn = false
              _self.toastrService.showError(data.Message, '')
            }
          }
        ))
      } else {
        this.toastrService.showError('Add Atleast 1 Item', '')
      }
    } else {
      this.checkForFocus()
    }
  }

  @ViewChild('loc_ref') locRef: ElementRef
  moveToCharge() {
    this.chargeSelect2.selector.nativeElement.focus({ preventScroll: false })
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
    if (+this.LedgerChargeId > 0 && +this.AmountCharge > 0) {
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
      this.commonService.openledgerCretion('', FormConstants.PURCHASEORDER)

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
    this.destroy$.push(this._po.getSlabData(TaxSlabId).subscribe(
      data => {
        console.log('tax slab data : ', data)
        if (this.vendorGSTType === 1) {
          this.taxChargeSlabType = (data.TaxSlabs[0]) ? data.TaxSlabs[0].Type : 0
          this.taxChargeRates = data.TaxRates
        }
        else {
          this.taxChargeSlabType = 0
          this.taxChargeRates = []
        }
        this.calculate()
        this.createTaxes(FormConstants.ChargeForm)
        this.getBillSummary()
      }
    ))
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
    } else if (parentType === FormConstants.PURCHASEORDER) {
      if (this.editItemId !== -1) {
        Sno = this.editItemSno
      } else {
        if (this.Items.length === 0) {
          Sno = 1
        } else {
          Sno = this.Items[this.Items.length - 1].Sno + 1
        }
      }
      if (this.appliedTaxRatesItem.length > 0) {
        this.appliedTaxRatesItem.forEach((taxRate) => {
          taxRate['ItemTransTaxId'] = Sno
          taxRate['Sno'] = Sno
        })
      }
      let item = this.Items.find((item) => item.Sno === Sno)
      if (item) {
        item['itemTaxTrans'] = this.appliedTaxRatesItem
      }
      console.log('tax rates applied : ', this.appliedTaxRatesItem)
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

  @ViewChild('taxSlab_select2') taxSlabSelect2: Select2Component
  onTaxSlabSelect(evt) {
    if (+evt.value === 0) {
      this.TaxSlabId = 0
      this.taxSlabName = ''
      this.TaxSlabName = ''
      this.getTaxDetail(this.TaxSlabId)
    }
    if (+evt.value === -1) {
      this.commonService.openTax('')
      this.taxSlabSelect2.selector.nativeElement.value = ''
    } else {
      if (evt.value > 0 && evt.data[0] && evt.data[0].text) {
        this.TaxSlabId = +evt.value
        this.taxSlabName = evt.data[0].text
        this.TaxSlabName = evt.data[0].text
        this.getTaxDetail(this.TaxSlabId)
      }
    }
    this.validateItem()
  }

  getTaxDetail(TaxSlabId) {
    this.destroy$.push(this._po.getSlabData(TaxSlabId).subscribe(
      data => {
        if (this.vendorGSTType === 1) {
          this.taxSlabType = (data.TaxSlabs[0]) ? data.TaxSlabs[0].Type : 0
          this.taxRates = data.TaxRates
        }
        else {
          this.taxSlabType = 0
          this.taxRates = []
        }
        this.validateItem()
        this.calculate()
        this.createTaxes(FormConstants.PURCHASEORDER)
        this.getBillSummary()
      }
    ))
  }

  @ViewChild('taxType_select2') taxTypeSelect2: Select2Component
  onTaxTypeSelect(evt) {
    // console.log('on change of tax Type : ', evt)
    if (+evt.value >= 0 && evt.data[0] && evt.data[0].text) {
      this.TaxType = +evt.value
      this.taxTypeName = evt.data[0].text
      this.calculate()
    }
    this.validateItem()
  }

  NetBillAmount = 0
  TaxableValue = 0
  localTaxableValue: number = 0
  billSummary: Array<any> = []
  AdditionalChargesToShow: any = []
  getBillSummary() {
    let taxableValue = 0
    let ItemTaxTrans = []
    this.Items.forEach(element => {
      ItemTaxTrans = ItemTaxTrans.concat(element.itemTaxTrans)
      taxableValue += +element.AmountItem
    });
    if (!this.clickItem && this.editItemIndex === -1 && +this.ItemId > 0 && +this.AmountItem > 0) {
      taxableValue += +this.AmountItem
      if (this.appliedTaxRatesItem.length > 0) {
        ItemTaxTrans = ItemTaxTrans.concat(this.appliedTaxRatesItem)
      }
    }
    this.AdditionalChargesToShow = JSON.parse(JSON.stringify(this.AdditionalCharges))
    this.AdditionalCharges.forEach(element => {
      ItemTaxTrans = ItemTaxTrans.concat(element.itemTaxTrans)
    });
    if (!this.clickCharge && this.editChargeIndex === -1 && +this.AmountCharge > 0 && +this.LedgerChargeId > 0) {
      if (this.appliedTaxRatesCharge.length > 0) {
        ItemTaxTrans = ItemTaxTrans.concat(this.appliedTaxRatesCharge)
      }
      if (!this.creatingForm) {
        this.AdditionalChargesToShow.push({
          'LedgerName': this.LedgerName,
          'TaxableAmountCharge': +this.TaxableAmountCharge
        })
      }
    }
    this.TaxableValue = taxableValue
    this.localTaxableValue = taxableValue
    this.billSummary = []
    if (!this.creatingForm) {
      this.ItemTaxTrans = JSON.parse(JSON.stringify(ItemTaxTrans))
    }
    let groupOnId = _.groupBy(ItemTaxTrans, (tax) => {
      return tax.TaxRateId
    })
    // console.log(groupOnId)
    for (const rateId in groupOnId) {
      if (groupOnId.hasOwnProperty(rateId)) {
        const element = groupOnId[rateId];
        let obj = {}
        obj['name'] = element[0]['TaxRateNameTax']
        let sum = 0
        element.forEach(tax => {
          sum += +tax.AmountTax
        })
        obj['total'] = sum
        this.billSummary.push(obj)
      }
    }
    // console.log('bill summary : ', this.billSummary)
    this.loadingSummary = false
    this.calculateBillTotal()
  }
  calculateBillTotal() {
    this.BillAmount = 0
    this.billSummary.forEach(element => {
      this.BillAmount += +element.total
    })
    this.AdditionalChargesToShow.forEach(charge => {
      this.BillAmount += +charge.TaxableAmountCharge
    })
    this.BillAmount += +this.TaxableValue
    let billAmount = this.BillAmount
    this.BillAmount = Math.round(billAmount)
  }

  calculateAllTotal() {
    let totalDiscount = 0
    let totalTax = 0
    let totalQuantity = 0
    let totalAmount = 0
    for (let i = 0; i < this.Items.length; i++) {
      totalDiscount = totalDiscount + +this.Items[i].DiscountAmt
      totalTax = totalTax + +this.Items[i].TaxAmount
      totalQuantity = totalQuantity + +this.Items[i].Quantity
      totalAmount = +totalAmount + +this.Items[i].Amount
    }
    if (this.editItemIndex > -1 && this.ItemId > 0) {
      if (+this.TaxAmount > 0) { totalTax }
      if (+this.Quantity > 0) { totalQuantity }
      if (+this.Amount > 0) { totalAmount }
    }
    if (!this.clickItem && this.editItemIndex === -1 && this.ItemId > 0) {
      if (+this.TaxAmount > 0) { totalTax += +this.TaxAmount }
      if (+this.Quantity > 0) { totalQuantity += +this.Quantity }
      if (+this.Amount > 0) { totalAmount += +this.Amount }
    }
    this.TotalTaxAmount = +totalTax.toFixed(4)
    this.TotalQty = +totalQuantity.toFixed(this.noOfDecimalPoint)
    this.SubTotalAmount = +totalAmount.toFixed(this.noOfDecimalPoint)
  }

  enterPressCharge(evt: KeyboardEvent) {
    this.addCharge()
    setTimeout(() => {
      this.chargeSelect2.selector.nativeElement.focus()
    }, 10)
  }

  getPurchaseRate() {
    if (+this.Quantity > 0 && +this.TotalRate > 0) {
      let lwh = (+this.Quantity) * (isNaN(+this.Length) || +this.Length === 0 ? 1 : +this.Length)
        * (isNaN(+this.Width) || +this.Width === 0 ? 1 : +this.Width)
        * (isNaN(+this.Height) || +this.Height === 0 ? 1 : +this.Height)
      this.PurchaseRate = +(+this.TotalRate / lwh).toFixed(this.noOfDecimalPoint)
    }
    if (this.TotalRate === 0 || '' + this.TotalRate === '') {
      this.PurchaseRate = 0
    }
    this.calculate()
  }

  opeCatImport() {
    this.commonService.openCatImport()
  }

  // ngOnDestroy() {
  //   this.onDestroy$.next()
  //   this.onDestroy$.complete()
  // }

  ngOnDestroy() {
    if (this.destroy$ && this.destroy$.length > 0) {
      this.destroy$.forEach((element) => element.unsubscribe())
    }
  }

  localTaxableValueled: any = 0

  getSPUtilityData () {
    this.loading = true
    this.destroy$.push(this._po.getSPUtilityData().subscribe((data) => {
      // console.log(data)
      if (!_.isEmpty(data)) {
        this.model.PoNo = data.TransactionNoSetups[0].BillNo
        this.model.PoDate = this.gs.getDefaultDate(this.clientDateFormat)
        this.clientStateId = data.ClientAddresses[0].StateId
        this.allItems = JSON.parse(JSON.stringify(data.Items))
        this._po.getList(data.Customers, 'Name', 'Customer')
        this._po.getList(data.TaxSlabs, 'Slab', 'Tax')
        this._po.getList(data.SubUnits, 'Name', 'Unit')
        this._po.getList(data.Vendors, 'Name', 'Vendor')
        this._po.getList(data.FreightModes, 'Name', 'Delivery Mode')
        this.getCatagoryDetail(data.ItemCategorys)
        this._po.getList(data.Items, 'Name', 'Item')
        this._po.getList(data.LedgerCharges, 'Name', 'Charge')
        this._po.getAttributes (data.Attributes, data.AttributeValues)
      }
      this.loading = false
    },
    (error) => {
      this.loading = false
      this.toastrService.showErrorLong(error, '')
    }))
  }

  @ViewChild('delivery_select2') deliverySelect2: Select2Component
  onDeliveryModeSelect (evt) {
    this.model.DeliveryMode = +evt.value
    if (this.model.DeliveryMode === -1) {
      this.deliverySelect2.selector.nativeElement.value = ''
      this.commonService.getCommonMenu(190).then((menudata) => {
        console.log(menudata)
        this.commonService.openCommonMenu({'open': true, 'data': menudata, 'isAddNew': false})
      });
    }
  }

  @ViewChildren('error') errorSelect2: QueryList<Select2Component>
  checkForFocus () {
    let stack = []
    setTimeout(() => {
      if ($(".errorSelecto:first")[0].nodeName === 'SELECT2') {
        this.errorSelect2.forEach((item: Select2Component, index: number) => {
          if (item.selector.nativeElement.parentElement.classList.contains('errorSelecto')) {
            stack.push(index)
          }
        })
        this.errorSelect2.forEach((item: Select2Component, index: number) => {
          if (stack[0] === index) {
            const element = this.renderer.selectRootElement(item.selector.nativeElement, true)
            element.focus({ preventScroll: false })
          }
        })
      } else {
        $(".errorSelecto:first").focus()
      }
    }, 10)
  }

  @ViewChild('buyer_order_select2') buyerOrderSelect2: Select2Component
  resetForm () {
    if (this.vendorSelect2) this.vendorSelect2.setElementValue(0)
    if (this.deliverySelect2) this.deliverySelect2.setElementValue(0)
    if (this.buyerOrderSelect2) this.buyerOrderSelect2.setElementValue(0)
    this.ParentId = 0
    this.model.Remark = ''
    this.model.ExDeliveryFromDate = ''
    this.model.ExDeliveryToDate = ''
  }

  setItems (evt) {
    console.log(evt)
    this.Items = this._po.setItems(evt, this.Items, this.attributesData, this.ItemAttributeTrans, this.ParentId)
    console.log(this.Items)
    this.updateItemTax()
  }
}
