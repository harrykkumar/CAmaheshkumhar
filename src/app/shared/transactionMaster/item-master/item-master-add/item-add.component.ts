import { Component, ViewChild } from '@angular/core'
import { Subscription, Subject } from 'rxjs'
import { Select2OptionData, Select2Component } from 'ng2-select2'
import { ItemmasterServices } from '../../../../commonServices/TransactionMaster/item-master.services'
import { UIConstant } from '../../../constants/ui-constant'
import { ItemModel, Image, AddCust, ItemMasterAdd } from '../../../../model/sales-tracker.model'
import { ToastrCustomService } from '../../../../commonServices/toastr.service'
import { CategoryServices } from '../../../../commonServices/TransactionMaster/category.services'
import { UnitMasterServices } from 'src/app/commonServices/TransactionMaster/unit-mater.services'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
declare const $: any
@Component({
  selector: 'app-item-add',
  templateUrl: './item-add.component.html',
  styleUrls: ['./item-add.component.css']
})
export class ItemAddComponent {
  modalOpen: Subscription
  submitClick: boolean
  itemDetail: ItemModel[]

  itemTpyePlaceHolder: Select2Options
  unitTypePlaceHolder: Select2Options
  categoryPlaceHolder: Select2Options
  taxTypePlaceHolder: Select2Options
  subCategoryPlaceHolder: Select2Options
  packingTypePlaceHolder: Select2Options

  public selectBrand: any[]
  public selectItemTpye: Array<Select2OptionData>
  public selectPackingType: Array<Select2OptionData>
  public categoryType: Array<Select2OptionData>
  public selectUnitType: Array<Select2OptionData>
  public selectTax: Array<Select2OptionData>

  taxValue: any
  cateGoryValue: any
  unitTypeValue: any
  packingTypeValue: any
  itemDetailValue: any
  loading: boolean = true
  imageAddSub: Subscription
  addedImages: Image
  dropdownSettings = {}
  invalidObj: any = {}
  newCategoryAddSub: Subscription
  newTaxAddSub: Subscription
  newUnitAddSub: Subscription

  Id: number
  CategoryId: number
  Name: string
  HsnNo: string
  ItemCode: string
  UnitId: number
  TaxId: number
  ItemType: number
  PackingType: number
  MrpRate: number
  SaleRate: number
  OurPrice: number
  Nrv: number
  MinStock: number
  MaxStock: number
  ReOrderQty: number
  BarCode: any
  PurchaseRate: number
  OpeningStock: number
  BrandIds: string
  IsNotDiscountable: boolean = false
  IsVolumeDiscountApply: boolean = false
  IsTradeDiscountApply: boolean = false
  ImageFiles: any = []
  isBarCode: boolean = false
  barCodeSub = new Subject<string>()
  barCodeExistSub: Subscription
  barCode$ = this.barCodeSub.asObservable()
  nameSub = new Subject<string>()
  nameExistSub: Subscription
  name$ = this.nameSub.asObservable()
  pendingCheck1 = false
  existsCodes: any = {}
  pendingCheck: boolean = false
  unitSettingType: number = 0
  compositeUnitAddSub: Subscription
  editMode: boolean = false
  selectedBrands: any = []
  itemDetails: any = []
  modeOfForm: string = 'new'
  constructor (private _itemmasterServices: ItemmasterServices,
    private commonService: CommonService,
    private toastrService: ToastrCustomService,
    private _catagoryservices: CategoryServices,
    private unitMasterService: UnitMasterServices) {
    this.addedImages = { images: [], queue: [], safeUrls: [], baseImages: [] }
    this.modalOpen = this.commonService.getItemMasterStatus().subscribe(
      (status: any) => {
        if (status.open) {
          this.modeOfForm = 'new'
          console.log('id : ', status.editId)
          if (status.editId !== '') {
            this.editMode = true
            this.Id = +status.editId
            this.getEditData()
          } else {
            this.Id = UIConstant.ZERO
            this.editMode = false
            this.openModal()
          }
        } else {
          this.closeModal()
        }
      }
    )

    this.newCategoryAddSub = this.commonService.getCategoryStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.categoryType)
          newData.push({ id: data.id, text: data.name })
          this.categoryType = newData
          this.CategoryId = +data.id
          this.cateGoryValue = data.id
        }
      }
    )
    this.newTaxAddSub = this.commonService.getTaxStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.selectTax)
          newData.push({ id: data.id, text: data.name })
          this.selectTax = newData
          this.TaxId = +data.id
          this.taxValue = data.id
        }
      }
    )
    this.newUnitAddSub = this.commonService.getUnitStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          // console.log('unit added : ', data)
          let newData = Object.assign([], this.selectUnitType)
          newData.push({ id: data.id, text: data.name })
          this.selectUnitType = newData
          this.unitTypeValue = data.id
        }
      }
    )

    this.compositeUnitAddSub = this.commonService.getCompositeUnitStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          // console.log('routing added : ', data)
          let newData = Object.assign([], this.selectUnitType)
          newData.push({ id: data.id, text: data.name })
          this.selectUnitType = newData
          this.unitTypeValue = data.id
        }
      }
    )

    this.imageAddSub = this._itemmasterServices.imageAdd$.subscribe(
      (obj: Image) => {
        console.log('obj : ', obj)
        this.addedImages = obj
        this.createImageFiles()
      }
    )
  }

  removeImage (i) {
    this.addedImages.images.splice(i, 1)
    this.addedImages.queue.splice(i, 1)
    this.addedImages.safeUrls.splice(i, 1)
    this.addedImages.baseImages.splice(i, 1)
    this.addedImages.id.splice(i, 1)
    this.createImageFiles()
  }

  createImageFiles () {
    let ImageFiles = []
    for (let i = 0; i < this.addedImages.images.length; i++) {
      let obj = { Name: this.addedImages.queue[i], BaseString: this.addedImages.safeUrls[i], IsBaseImage: this.addedImages.baseImages[i], Id: this.addedImages.id[i] ? this.addedImages.id[i] : 0 }
      ImageFiles.push(obj)
    }
    this.ImageFiles = ImageFiles
    console.log('image files : ', this.ImageFiles)
  }

  getEditData () {
    this._itemmasterServices.getEditData(+this.Id).subscribe(
      (data) => {
        if (data.Code === UIConstant.THOUSAND && data.Data) {
          console.log('edit data : ', data)
          if (data.Code === UIConstant.THOUSAND && data.Data) {
            this.createFormData(data.Data)
          }
        }
      }
    )
  }

  createFormData (data) {
    this.openModal()
    this.ImageFiles = []
    this.addedImages = { images: [], queue: [], safeUrls: [], baseImages: [], id: [] }
    this.itemDetails = data.ItemDetails[0]
    let images = data.ImageContentBases
    console.log('images : ', images)
    images.forEach(element => {
      this.addedImages.queue.push(element.Name)
      this.addedImages.images.push(element.FilePath)
      this.addedImages.baseImages.push(0)
      this.addedImages.id.push(element.Id)
    })
    this.createImageFiles()
    console.log('images : ', this.addedImages)
    this.Id = +this.itemDetails.Id
    this.CategoryId = this.itemDetails.CategoryId
    this.Name = this.itemDetails.Name
    this.HsnNo = this.itemDetails.HsnNo
    this.ItemCode = this.itemDetails.ItemCode
    this.UnitId = +this.itemDetails.UnitId
    this.TaxId = +this.itemDetails.TaxId
    this.ItemType = +this.itemDetails.ItemType
    this.PackingType = +this.itemDetails.PackingType
    this.MrpRate = (isNaN(+this.itemDetails.MrpRate)) ? 0 : +this.itemDetails.MrpRate
    this.SaleRate = (isNaN(+this.itemDetails.SaleRate)) ? 0 : +this.itemDetails.SaleRate
    this.OurPrice = (isNaN(+this.itemDetails.OurPrice)) ? 0 : +this.itemDetails.OurPrice
    this.Nrv = (isNaN(+this.itemDetails.Nrv)) ? 0 : +this.itemDetails.Nrv
    this.MinStock = (isNaN(+this.itemDetails.MinStock)) ? 0 : +this.itemDetails.MinStock
    this.MaxStock = (isNaN(+this.itemDetails.MaxStock)) ? 0 : +this.itemDetails.MaxStock
    this.ReOrderQty = (isNaN(+this.itemDetails.ReOrderQty)) ? 0 : +this.itemDetails.ReOrderQty
    this.BarCode = this.itemDetails.BarCode
    this.PurchaseRate = (isNaN(+this.itemDetails.PurchaseRate)) ? 0 : +this.itemDetails.PurchaseRate
    this.OpeningStock = (isNaN(+this.itemDetails.OpeningStock)) ? 0 : +this.itemDetails.OpeningStock
    this.IsNotDiscountable = this.itemDetails.IsNotDiscountable
    this.IsVolumeDiscountApply = this.itemDetails.IsVolumeDiscountApply
    this.IsTradeDiscountApply = this.itemDetails.IsTradeDiscountApply
  }

  openModal () {
    this.initComp()
    $('#item_form').removeClass('fadeInUp')
    $('#item_form').addClass('fadeInDown')
    $('#item_form').modal(UIConstant.MODEL_SHOW)
  }

  @ViewChild('brand_select2') brandSelect2: Select2Component
  initComp () {
    if (this.modeOfForm === 'new') {
      this.loading = true
    }
    this.invalidObj = {}
    this.submitClick = false
    this.isBarCode = false
    this.taxValue = ''
    this.cateGoryValue = ''
    this.unitTypeValue = ''
    this.packingTypeValue = 1
    this.itemDetailValue = 1
    this.pendingCheck1 = false
    this.existsCodes = {}
    this.pendingCheck = false
    this.unitSettingType = 0
    this.createForm()
    if (this.catSelect2) {
      this.catSelect2.setElementValue('')
    }
    if (this.taxSelect2) {
      this.taxSelect2.setElementValue('')
    }
    if (this.unitSelect2) {
      this.unitSelect2.setElementValue('')
    }
    if (this.unitSelect2) {
      this.unitSelect2.setElementValue('')
    }
    if (this.brandSelect2) {
      this.brandSelect2.setElementValue('')
    }
    if (this.modeOfForm === 'new') {
      this.getSetting()
      this.getUnitTypeDetail(0)
      this.getItemDetail(0)
      this.getTaxtDetail(0)
      this.getBrandDetail(0)
      this.getpackingTypeDetail(0)
      this.getCategoryDetails()
    }
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    }
  }

  closeModal () {
    if ($('#item_form').length > 0) {
      this.modeOfForm = new
      $('#item_form').modal(UIConstant.MODEL_HIDE)
    }
  }

  ngOnDestroy () {
    this.modalOpen.unsubscribe()
    this.newCategoryAddSub.unsubscribe()
    this.newTaxAddSub.unsubscribe()
    this.newUnitAddSub.unsubscribe()
    this.barCodeExistSub.unsubscribe()
  }

  createForm () {
    this.Id = 0
    this.CategoryId = 0
    this.Name = ''
    this.HsnNo = ''
    this.ItemCode = ''
    this.UnitId = 0
    this.TaxId = 0
    this.ItemType = 1
    this.PackingType = 1
    this.MrpRate = 0
    this.SaleRate = 0
    this.OurPrice = 0
    this.Nrv = 0
    this.MinStock = 0
    this.MaxStock = 0
    this.ReOrderQty = 0
    this.BarCode = ''
    this.PurchaseRate = 0
    this.OpeningStock = 0
    this.BrandIds = ''
    this.IsNotDiscountable = false
    this.IsVolumeDiscountApply = false
    this.IsTradeDiscountApply = false
    this.ImageFiles = []
    this.selectedBrands = []
    this.itemDetailValue = '1'
    this.packingTypeValue = '1'
    this.addedImages = { images: [], queue: [], safeUrls: [], baseImages: [] }
  }

  private itemAddParams (): ItemMasterAdd {
    const itemAddElement = {
      obj: {
        Id: this.Id !== UIConstant.ZERO ? this.Id : UIConstant.ZERO,
        CategoryId: +this.CategoryId,
        Name: this.Name,
        HsnNo: this.HsnNo,
        ItemCode: this.ItemCode,
        UnitId: +this.UnitId,
        TaxId: +this.TaxId,
        ItemType: +this.ItemType,
        PackingType: +this.PackingType,
        MrpRate: +this.MrpRate,
        SaleRate: +this.SaleRate,
        OurPrice: +this.OurPrice,
        Nrv: +this.Nrv,
        MinStock: +this.MinStock,
        MaxStock: +this.MaxStock,
        ReOrderQty: +this.ReOrderQty,
        BarCode: this.BarCode,
        PurchaseRate: +this.PurchaseRate,
        OpeningStock: +this.OpeningStock,
        BrandIds: this.BrandIds,
        IsNotDiscountable: this.IsNotDiscountable,
        IsVolumeDiscountApply: this.IsVolumeDiscountApply,
        IsTradeDiscountApply: this.IsTradeDiscountApply,
        ImageFiles: this.ImageFiles
      } as ItemMasterAdd
    }
    return itemAddElement.obj
  }

  getCategoryDetails () {
    this.categoryPlaceHolder = { placeholder: 'Select Category' }
    let newData = [{ id: UIConstant.BLANK, text: 'Select Category' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
    this._itemmasterServices.getAllSubCategories(1).subscribe(data => {
      // console.log('categories : ', data)
      if (data.Code === UIConstant.THOUSAND && data.Data.length > 0) {
        data.Data.forEach(element => {
          newData.push({
            id: element.Id,
            text: element.Name
          })
        })
        this.categoryType = newData
      }
    },
    (error) => {
      console.log(error)
    },
    () => {
      this.loading = false
      if (this.editMode) {
        setTimeout(() => {
          this.itemTypeSelect2.setElementValue(this.itemDetails.ItemType)
          this.packingTypeSelect2.setElementValue(this.itemDetails.PackingType)
          this.catSelect2.setElementValue(this.itemDetails.CategoryId)
          this.unitSelect2.setElementValue(this.itemDetails.UnitId)
          this.taxSelect2.setElementValue(this.itemDetails.TaxId)
          this.selectedBrands = this.itemDetails.BrandIds.split(',')
        }, 1000)
      }
    })
  }

  @ViewChild('cat_select2') catSelect2: Select2Component
  @ViewChild('itemtype_select2') itemTypeSelect2: Select2Component
  @ViewChild('packingtype_select2') packingTypeSelect2: Select2Component
  selectedCategory (event) {
    // console.log('on select of category : ', event)
    if (event.value && event.data.length > 0) {
      if (+event.value === -1 && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
        this.catSelect2.selector.nativeElement.value = ''
        this.commonService.openCategory('', '1')
      } else {
        this.CategoryId = +event.value
      }
      this.checkForValidation()
    }
  }

  getTaxtDetail (value) {
    this.taxTypePlaceHolder = { placeholder: 'select Tax' }
    let newData = [{ id: UIConstant.BLANK, text: 'Select Tax' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
    this._itemmasterServices.getTaxDetail().subscribe(data => {
      if (data.Code === UIConstant.THOUSAND && data.Data.TaxSlabs.length > 0) {
        data.Data.TaxSlabs.forEach(element => {
          newData.push({
            id: element.Id,
            text: element.Slab
          })
        })
        this.selectTax = newData
      }
    },
    (error) => {
      console.log(error)
    })
  }

  @ViewChild('tax_select2') taxSelect2: Select2Component
  selectedTax (event) {
    // console.log('on select of tax : ', event)
    if (event.value && event.data.length > 0) {
      if (+event.value === -1 && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
        this.taxSelect2.selector.nativeElement.value = ''
        this.commonService.openTax('')
      } else {
        this.TaxId = +event.value
        // this.itemForm.controls.TaxId.setValue(+event.value)
      }
      this.checkForValidation()
    }
  }

  getUnitTypeDetail (value) {
    this.unitTypePlaceHolder = { placeholder: 'Select Unit' }
    let newData = [{ id: UIConstant.BLANK, text: 'select unit' }, { id: '-1', text: '+Add New' }]
    this.unitMasterService.getSubUnits().subscribe(data => {
      // console.log('units : ', data)
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

  @ViewChild('unit_select2') unitSelect2: Select2Component
  selectedUnitTpye (event) {
    // console.log('on select of unit : ', event)
    if (event.value && event.data.length > 0) {
      if (+event.value === -1 && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
        this.unitSelect2.selector.nativeElement.value = ''
        console.log(this.unitSettingType)
        if (this.unitSettingType === 1) {
          this.commonService.openUnit('')
        }
        if (this.unitSettingType === 2) {
          this.commonService.openCompositeUnit('')
        }
      } else {
        this.UnitId = +event.value
      }
      this.checkForValidation()
    }
  }

  getBrandDetail (brand) {
    this.selectBrand = []
    this._itemmasterServices.getBrandDetail().subscribe(data => {
      // console.log('brand types : ', data)
      if (data && data.Data) {
        this.selectBrand = [{ id: UIConstant.BLANK, text: 'SelectBrand' }]
        if (data.Data.length > UIConstant.ZERO && data.Code === UIConstant.THOUSAND) {
          let newData = []
          data.Data.forEach(element => {
            newData.push({
              id: element.Id,
              text: element.Name
            })
          })
          this.selectBrand = newData
        }
      }
    },
    (error) => {
      console.log(error)
    })
  }

  getpackingTypeDetail (value) {
    this.packingTypePlaceHolder = { placeholder: 'Select packingType' }
    this.selectPackingType = [{ id: '1',text: 'Packed' },{ id: '2',text: 'Loose' },{ id: '3',text: 'Combo' }]
  }

  selectedPackingType (event) {
    this.PackingType = +event.value
  }
  getItemDetail (value) {
    this.itemTpyePlaceHolder = { placeholder: 'select item' }
    this.selectItemTpye = [{ id: '1', text: 'Stockable' },{ id: '2', text: 'Stockable Not Sale' }]
  }
  selectedItemType (itemTypeCode) {
    this.ItemType = +itemTypeCode.value
  }

  closeItemMaster () {
    this.commonService.closeItemMaster('')
  }
  addNewItemMaster (value) {
    this.submitClick = true
    if (value === 'reset') {
      this.initComp()
      this.submitClick = false
      this.loading = false
    }
    if (this.checkForValidation() && !this.existsCodes.barcode && !this.existsCodes.name && !this.pendingCheck && !this.pendingCheck1) {
      if (value === 'reset') {
        this.initComp()
        this.submitClick = false
      } else {
        console.log('obj : ', JSON.stringify(this.itemAddParams()))
        this._itemmasterServices.addNewItem(this.itemAddParams()).subscribe(data => {
          console.log('data : ', data)
          if (data.Code === UIConstant.THOUSAND) {
            if (value === 'save') {
              const dataToSend = { id: data.Data, name: this.Name }
              this.toastrService.showSuccess('Success','Saved Successfully')
              this.commonService.onAddItemMaster()
              this.commonService.closeItemMaster(dataToSend)
            } else {
              this.Id = UIConstant.ZERO
              this.submitClick = false
              this.loading = false
              this.toastrService.showSuccess('Success','Saved Successfully')
            }
            this.initComp()
          } else {
            this.toastrService.showError('Oops', data.Message)
          }
        })
      }
    }
  }

  // @ViewChild('brand_multi') brandMultiSelect: MultiSelectComponent
  // onItemSelect (item: any) {
  //   let brands = []
  //   if (this.BrandIds !== '') {
  //     brands = this.BrandIds.split(',')
  //   }
  //   if (brands.indexOf(item.id) < 0) {
  //     brands.push(item.id)
  //   }
  //   brands.push(item.id)
  //   this.BrandIds = brands.join(',')
  //   // console.log('BrandIds : ', this.BrandIds)
  // }
  // onSelectAll (items: any) {
  //   let brands = []
  //   this.BrandIds = ''
  //   for (let i = 0; i < items.length - 1; i++) {
  //     brands.push(items[i].id)
  //   }
  //   this.BrandIds = brands.join(',')
  //   // console.log('BrandIds : ', this.BrandIds)
  // }

  // onItemDeSelect (item) {
  //   let brands = []
  //   brands = this.BrandIds.split(',')
  //   if (brands.indexOf(item.id) > -1) {
  //     brands.splice(item.id, 1)
  //   }
  //   this.BrandIds = brands.join(',')
  //   // console.log('BrandIds : ', this.BrandIds)
  // }

  // onDeSelectAll (items: any) {
  //   // this.selectedBrands = []
  //   this.BrandIds = items.join(',')
  //   // console.log('BrandIds : ', this.BrandIds)
  // }

  openImageModal () {
    this._itemmasterServices.openImageModal(this.addedImages)
  }
  checkForValidation (): boolean {
    let isValid = 1
    if (!isNaN(+this.CategoryId) && +this.CategoryId > 0) {
      this.invalidObj['CategoryId'] = false
    } else {
      this.invalidObj['CategoryId'] = true
      isValid = 0
    }
    if (!isNaN(+this.UnitId) && +this.UnitId > 0) {
      this.invalidObj['UnitId'] = false
    } else {
      this.invalidObj['UnitId'] = true
      isValid = 0
    }
    if (!isNaN(+this.TaxId) && +this.TaxId > 0) {
      this.invalidObj['TaxId'] = false
    } else {
      this.invalidObj['TaxId'] = true
      isValid = 0
    }
    if (this.Name) {
      this.invalidObj['Name'] = false
    } else {
      this.invalidObj['Name'] = true
      isValid = 0
    }
    if (this.ItemCode) {
      this.invalidObj['ItemCode'] = false
    } else {
      this.invalidObj['ItemCode'] = true
      isValid = 0
    }
    if (this.HsnNo) {
      this.invalidObj['HsnNo'] = false
    } else {
      this.invalidObj['HsnNo'] = true
      isValid = 0
    }
    if (this.BarCode) {
      this.invalidObj['BarCode'] = false
    } else {
      this.invalidObj['BarCode'] = true
      isValid = 0
    }
    return !!isValid
  }

  getSetting () {
    let _self = this
    this._catagoryservices.getCategoryLevel().subscribe(
      (data) => {
        if (data.Code === UIConstant.THOUSAND && data.Data.SetupSettings.length > 0) {
          const setUpSettings = data.Data.SetupSettings
          // console.log('setUpSettings : ', setUpSettings)
          setUpSettings.forEach(setting => {
            if (+setting.SetupId === 32) {
              _self.isBarCode = true
              // console.log('isBarCode : ', _self.isBarCode)
            }
            if (+setting.SetupId === 56) {
              _self.unitSettingType = +setting.Val
            }
          })
        }
      },
      (error) => {
        console.log(error)
      },
      () => {
        if (_self.isBarCode) {
          _self._itemmasterServices.getBarCode('ForBarCode').subscribe(
            (data: any) => {
              // console.log('bar code : ', data)
              if (data.Code === UIConstant.THOUSAND && data.Data.length > 0 && data.Data[0].BarCode) {
                this.BarCode = data.Data[0].BarCode
              }
            }
          )
        }
      }
    )
  }

  searchForBarCode (barcode: string) {
    this.barCodeSub.next(barcode)
    this.pendingCheck = true
    this.existsCodes.barcode = false
    $('.fas fa-check').removeClass('hideMe')
    $('.fas fa-times').removeClass('hideMe')
    this._itemmasterServices.search(this.barCode$).subscribe(
      (data) => {
        if (data.Code === UIConstant.THOUSAND && data.Data.length > 0) {
          this.pendingCheck = false
          // console.log('on call of exist bar code api : ', data)
          setTimeout(() => {
            this.existsCodes.barcode = data.Data[0].Status
            if (this.existsCodes.barcode) {
              $('.fas fa-check').addClass('hideMe')
              // this.toastrService.showError('Oops', 'Bar Code is already taken')
            } else {
              $('.fas fa-times').addClass('hideMe')
            }
          }, 1)
        }
      }
    )
  }

  searchForItemName (name: string) {
    this.nameSub.next(name)
    this.pendingCheck1 = true
    this._itemmasterServices.searchName(this.name$).subscribe(
      (data) => {
        if (data.Code === UIConstant.THOUSAND) {
          this.pendingCheck1 = false
          // console.log('on call of exist name api : ', data)
          setTimeout(() => {
            this.existsCodes.name = data.Data.Status
            if (this.existsCodes.name) {
              // this.toastrService.showError('Oops', 'Name is already taken')
              $('.fas fa-check').addClass('hideMe')
            } else {
              $('.fas fa-times').addClass('hideMe')
            }
          }, 1)
        }
      }
    )
  }

  public exampleData: Array<Select2OptionData>
  public options: Select2Options
  public value: string[]
  // public current: string

  ngOnInit () {
    this.options = {
      multiple: true
    }

    // this.current = this.value.join(' | ')
  }

  onBrandSelect (data: {value: string[]}) {
    this.BrandIds = data.value.join(',')
  }
}
