import { Component, ViewChild } from '@angular/core'
import { Select2OptionData, Select2Component } from 'ng2-select2'
import { Subscription } from 'rxjs/Subscription'
import { ItemModel, AddCust } from '../../../../model/sales-tracker.model'
import { ToastrCustomService } from '../../../../commonServices/toastr.service'
import { ItemmasterServices } from '../../../../commonServices/TransactionMaster/item-master.services'
import { CommonSetGraterServices } from '../../../../commonServices/setgatter.services'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { UIConstant } from '../../../constants/ui-constant'
import { CategoryServices } from '../../../../commonServices/TransactionMaster/category.services'
import { UnitMasterServices } from 'src/app/commonServices/TransactionMaster/unit-mater.services'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'

declare const $: any
@Component({
  selector: 'app-routing-add',
  templateUrl: './routing-add.component.html'
})
export class RoutingAddComponent {
  unitId: number
  taxId: number
  id: any
  categoryId: number
  editMode: boolean
  itemDetail: ItemModel[]
  subscribe: Subscription
  public subCategoryType: Array<Select2OptionData>
  public selectUnitType: Array<Select2OptionData>
  public selectTax: Array<Select2OptionData>
  taxTypePlaceHolder: Select2Options
  subCategoryPlaceHolder: Select2Options
  unitTypePlaceHolder: Select2Options
  categoryPlaceHolder: Select2Options
  isTradeDiscountApply: number
  isVolumeDiscountApply: number
  isNotDiscountable: number
  submitClick: boolean
  modalSub: Subscription
  modalSub1: Subscription
  modalSub2: Subscription
  modalSub3: Subscription
  unitSettingType: number = 0
  constructor (public _toastrcustomservice: ToastrCustomService, private _itemmasterServices: ItemmasterServices,
    private _commonGaterSeterServices: CommonSetGraterServices,
    private _formBuilder: FormBuilder,
    private commonService: CommonService,
    private _catagoryservices: CategoryServices,
    private unitMasterService: UnitMasterServices
    ) {
    this.routingFormMethod()
    this.modalSub = this.commonService.getRoutingStatus().subscribe(
      (data: AddCust) => {
        if (data.open) {
          if (data.editId === '') {
            this.editMode = false
          } else {
            this.id = data.editId
            this.editMode = true
          }
          this.openModal()
        } else {
          this.closeModal()
        }
      }
    )
    this.modalSub1 = this.commonService.getCategoryStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.categoryType)
          newData.push({ id: data.id, text: data.name })
          this.categoryType = newData
          this.categoryId = +data.id
          this.cateGoryValue = data.id
        }
      }
    )

    this.modalSub2 = this.commonService.getUnitStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.selectUnitType)
          newData.push({ id: data.id, text: data.name })
          this.selectUnitType = newData
          this.unitId = +data.id
          this.unitTypeValue = +data.id
          this.unitSelect2.setElementValue(this.unitTypeValue)
        }
      }
    )

    this.modalSub3 = this.commonService.getTaxStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.selectTax)
          newData.push({ id: data.id, text: data.name })
          this.selectTax = newData
          this.taxId = +data.id
          this.taxValue = +data.id
          this.taxSelect2.setElementValue(this.taxValue)
        }
      }
    )
  }
  get f () { return this.routingForm.controls }

  ngOnDestroy () {
    this.modalSub.unsubscribe()
    this.modalSub1.unsubscribe()
    this.modalSub2.unsubscribe()
    this.modalSub3.unsubscribe()
    this.subscribe.unsubscribe()
  }

  openModal () {
    if (this.editMode) {
      this.getEditRoutingForm(this.id)
    } else {
      this.submitClick = false
      this.getTaxtDetail(0)
      this.getSetting()
      this.taxError = false
      this.catagoryError = false
      this.id = UIConstant.ZERO
      this.itemDetail = []
      this.getItemMasterDetail()
      this.getUnitTypeDetail(0)
      this.getCategoryDetails()
      this.categoryPlaceHolder = { placeholder: 'Select Category' }
      this.subCategoryPlaceHolder = { placeholder: 'Select Subcategory' }
    }
    $('#item_form_inventory').modal(UIConstant.MODEL_SHOW)
  }
  closeModal () {
    if ($('#item_form_inventory').length > 0) {
      this.id = 0
      this.taxId = 0
      this.categoryId = 0
      this.unitId = 0
      this.taxError = false
      this.catagoryError = false
      this.id = UIConstant.ZERO
      this.isNotDiscountable = UIConstant.ZERO
      this.isTradeDiscountApply = UIConstant.ZERO
      this.isVolumeDiscountApply = UIConstant.ZERO
      this.itemDetail = []
      this.categoryType = []
      this.subCategoryType = []
      this.selectTax = []
      this.selectUnitType = []
      this.cateGoryValue = 0
      this.subCat = 0
      this.routingForm.reset()
      $('#item_form_inventory').modal(UIConstant.MODEL_HIDE)
    }
  }
  getEditRoutingForm (id) {
    this.getCategoryDetails()
    this.subscribe = this._itemmasterServices.editRoute(id).subscribe(Data => {
      console.log('edit route form : ', Data)
      if (Data.Code === UIConstant.THOUSAND && Data.Data.length > 0) {
       let _this= this;
        this.id = Data.Data[0].Id
        console.log(Data.Data,"category-editdata")
       _this.getTaxtDetail(0)
       this.getUnitTypeDetail(0)
          _this.unitSelect2.setElementValue(Data.Data[0].UnitId);
          _this.catSelect2.setElementValue(Data.Data[0].CategoryId);
          _this.taxSelect2.setElementValue(Data.Data[0].TaxId);

   //   this.catSelect2.selector.nativeElement.value = ''

     // this.unitSelect2.selector.nativeElement.value = ''

        this.routingForm.controls.routine.setValue(Data.Data[0].Name)
        this.routingForm.controls.saleRate.setValue(Data.Data[0].OurPrice)
      }
    })
  }

  unitTypeValue: number
  getUnitTypeDetail (value) {
    this.unitTypePlaceHolder = { placeholder: 'Select Unit' }
    let newData = [{ id: UIConstant.BLANK, text: 'select unit' }, { id: '-1', text: '+Add New' }]
    this.unitMasterService.getSubUnits().subscribe(data => {
      console.log('units : ', data)
      if (data.Code === UIConstant.THOUSAND && data.Data.length > 0) {
        data.Data.forEach(element => {
          newData.push({
            id: element.Id,
            text: element.Name
          })
        })
        this.selectUnitType = newData
      }
    })
  }
  unitError: boolean
  @ViewChild('unit_select2') unitSelect2: Select2Component
  selectedUnitTpye (event) {
    this.unitId = +event.value
    this.unitError = false
    if (this.unitId === -1) {
      this.unitSelect2.selector.nativeElement.value = ''
      this.commonService.openUnit('')
      if (this.unitSettingType === 1) {
        this.commonService.openUnit('')
      }
      if (this.unitSettingType === 2) {
        this.commonService.openCompositeUnit('')
      }
    } else {
      this.unitTypeValue = this.unitId
    }

  }
  autoCategory: any
  getCategoryDetails () {
    this.categoryPlaceHolder = { placeholder: 'Select Category' }
    let newData = [{ id: UIConstant.BLANK, text: 'Select  Category' }, { id: '-1', text: '+Add New' }]
    this._itemmasterServices.getAllSubCategories(1).subscribe(
      data => {
        console.log('on cat addd : ', data)
        if (data.Code === UIConstant.THOUSAND && data.Data.length > 0) {
          data.Data.forEach(element => {
            newData.push({
              id: element.Id,
              text: element.Name
            })
          })
          this.categoryType = newData
        }
      }
    )
  }
  categoryType: any
  cateGoryValue: number
  catagoryError: boolean
  @ViewChild('cat_select2') catSelect2: Select2Component
  onSelectCategory (event) {
    console.log('selected category : ', event)
    this.categoryId = +event.value
    this.catagoryError = false
    if (this.categoryId === -1) {
      this.catSelect2.selector.nativeElement.value = ''
      this._commonGaterSeterServices.categoryhideButton(false)
      this.commonService.openCategory('', '1')
    }
  }
  select2Validation () {
    if (this.categoryId > UIConstant.ZERO) {
      this.catagoryError = false
    } else {
      this.catagoryError = true
    }
    if (this.unitId > UIConstant.ZERO) {
      this.unitError = false
    } else {
      this.unitError = true
    }
    if (this.taxId > UIConstant.ZERO) {
      this.taxError = false
    } else {
      this.taxError = true
    }
  }
  selectSubCategory: number
  subCat: number
  @ViewChild('subCat_select2') subCatSelect2: Select2Component
  taxValue: number
  getTaxtDetail (value) {
    this.taxTypePlaceHolder = { placeholder: 'select Tax' }
    this.selectTax = []
    this._itemmasterServices.getTaxDetail().subscribe(Data => {
      this.selectTax = [{ id: UIConstant.BLANK, text: 'Select Tax' }, { id: '-1', text: '+Add Tax' }]
      if (Data.Code === UIConstant.THOUSAND && Data.Data.TaxSlabs.length > UIConstant.ZERO) {
        Data.Data.TaxSlabs.forEach(element => {
          this.selectTax.push({
            id: element.Id,
            text: element.Slab
          })
        })
      }
    })

  }
  taxError: any
  taxtPoup: boolean
  @ViewChild('tax_select2') taxSelect2: Select2Component
  selectedTax (event) {
    this.taxId = +event.value
    this.taxError = false
    if (this.taxId === -1) {
      this.taxSelect2.selector.nativeElement.value = ''
      this.commonService.openTax('')
    }
  }

  routingForm: FormGroup
  private routingFormMethod () {
    this.routingForm = this._formBuilder.group({
      'routine': [UIConstant.BLANK, Validators.required],
      'saleRate': [UIConstant.BLANK, Validators.required]
    })
  }

  getItemMasterDetail () {
    this.subscribe = this._itemmasterServices.getItemMasterDetail().subscribe(Data => {
      if (Data.Code === UIConstant.THOUSAND && Data.Data.length > UIConstant.ZERO) {
        this.itemDetail = Data.Data
      }
    })
  }

  resetForm () {
    this.getSetting()
    this.getTaxtDetail(0)
    this.getCategoryDetails()
    this.routingForm.reset()
  }
  saveRouting () {
    this.submitClick = true
    this.select2Validation()
    console.log('obj : ', JSON.stringify(this.routingParams()))
    this._itemmasterServices.addNewItem(this.routingParams()).subscribe(Data => {
      if (Data.Code === UIConstant.THOUSAND) {
        this.commonService.newRouteAdded()
        const dataToSend = { id: Data.Data, name: this.routingForm.value.routine }
        this.commonService.closeRouting(dataToSend)
        this._toastrcustomservice.showSuccess('Success','Saved Successfully')
      } else {
        this._toastrcustomservice.showError('Oops', Data.Message)
      }
    })
  }

  private routingParams (): ItemModel {
    const categoryElement = {
      categoryObj: {
        Id: this.id,
        PurchaseRate: 0,
        BarCode: null,
        Name: this.routingForm.value.routine,
        HsnNo: '1234',
        MrpRate: 0,
        SaleRate: this.routingForm.value.saleRate,
        OurPrice: this.routingForm.value.saleRate,
        Nrv: 0,
        MinStock: 0,
        MaxStock: 0,
        ItemCode: '1234',
        ReOrderQty: 0,
        openingStockValue: 0,
        CategoryId: this.categoryId,
        ItemType: 1,
        UnitId: this.unitId,
        TaxId: this.taxId,
        PackingType: 1,
        IsNotDiscountable: 0,
        IsTradeDiscountApply: 0,
        IsVolumeDiscountApply: 0,
        BrandIds: ''
      } as ItemModel
    }
    return categoryElement.categoryObj
  }

  getSetting () {
    let _self = this
    this._catagoryservices.getCategoryLevel().subscribe(
      (data) => {
        if (data.Code === UIConstant.THOUSAND && data.Data.SetupSettings.length > 0) {
          const setUpSettings = data.Data.SetupSettings
          console.log('setUpSettings : ', setUpSettings)
          setUpSettings.forEach(setting => {
            if (+setting.SetupId === 56) {
              _self.unitSettingType = +setting.Type
            }
          })
        }
      }
    )
  }
}
