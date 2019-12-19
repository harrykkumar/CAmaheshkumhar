import { Component, ViewChild, Renderer2, ElementRef } from '@angular/core'
import { Subscription, fromEvent } from 'rxjs'
import { Select2OptionData, Select2Component } from 'ng2-select2'
import { ItemmasterServices } from '../../../../commonServices/TransactionMaster/item-master.services'
import { UIConstant } from '../../../constants/ui-constant'
import { ItemModel, Image, AddCust, ItemMasterAdd, ComboItem } from '../../../../model/sales-tracker.model'
import { ToastrCustomService } from '../../../../commonServices/toastr.service'
import { UnitMasterServices } from 'src/app/commonServices/TransactionMaster/unit-mater.services'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
import { map, filter, debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { ComboComponent } from '../item-combo/combo.component'
declare const $: any
import * as _ from 'lodash'
import { Settings } from '../../../constants/settings.constant';
import { SetUpIds } from 'src/app/shared/constants/setupIds.constant';

@Component({
  selector: 'app-item-add',
  templateUrl: './item-add.component.html',
  styleUrls: ['./item-add.component.css']
})
export class ItemAddComponent {
  modalOpen: Subscription
  submitClick: boolean
  itemDetail: ItemModel[]
  isStkValue = false;
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
  unitTypeValue: any = 0
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

  categoryName: string
  unitName: string
  taxName: string

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
  BarCode: any = ''
  PurchaseRate: number
  OpeningStock: number
  OpeningStockValue: number
  BrandIds: string
  IsNotDiscountable: boolean = false
  IsVolumeDiscountApply: boolean = false
  IsTradeDiscountApply: boolean = false
  ImageFiles: any = []
  isBarCode: boolean = false
  noOfDecimal: number = 1
  isItemCode: boolean = false
  barCodeExistSub: Subscription
  nameExistSub: Subscription
  pendingCheck1 = false
  existsCodes: any = {}
  pendingCheck: boolean = false
  unitSettingType: number = 0
  compositeUnitAddSub: Subscription
  editMode: boolean = false
  selectedBrands: any = []
  itemDetails: any = []
  modeOfForm: string = 'new'
  toDisableCat: boolean = false
  ItemAttributewithRate: Array<any> = []
  Items = []
  ItemAttributeTrans = []
  @ViewChild('combo_comp') comboComp: ComboComponent

  combo: Array<ComboItem> = []
  itemAttributeOpeningStockOpen: any = {};
  constructor(private _itemmasterServices: ItemmasterServices,
    private commonService: CommonService,
    private toastrService: ToastrCustomService,
    private unitMasterService: UnitMasterServices,
    private renderer: Renderer2,
    private settings: Settings
  ) {
    this.addedImages = { images: [], queue: [], safeUrls: [], baseImages: [] }
    this.modalOpen = this.commonService.getItemMasterStatus().subscribe(
      (status: any) => {
        if (status.open) {
          this.modeOfForm = 'new'
          this.toDisableCat = false
          console.log('id : ', status.editId)
          if (status.editId !== '') {
            this.editMode = true
            this.Id = +status.editId
            this.getEditData()
          } else {
            if (status.categoryId !== 0) {
              this.CategoryId = +status.categoryId
              this.cateGoryValue = status.categoryId
              this.toDisableCat = true
            }
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
          setTimeout(() => {
            if (this.catSelect2) {
              const element = this.renderer.selectRootElement(this.catSelect2.selector.nativeElement, true)
              element.focus({ preventScroll: false })
            }
          }, 600)
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
          setTimeout(() => {
            if (this.taxSelect2) {
              const element = this.renderer.selectRootElement(this.taxSelect2.selector.nativeElement, true)
              element.focus({ preventScroll: false })
            }
          }, 600)
        }
      }
    )
    this.newUnitAddSub = this.commonService.getUnitStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.selectUnitType)
          newData.push({ id: data.id, text: data.name })
          // this.selectUnitType = newData
          this.UnitIdForEDit = data.id
          if (this.unitSettingType === 1) {
            this.getUnitTypeDetail(0)
          }
          setTimeout(() => {
            if (this.unitSelect2) {
              const element = this.renderer.selectRootElement(this.unitSelect2.selector.nativeElement, true)
              element.focus({ preventScroll: false })
            }
          }, 600)
        }
      }
    )

    this.compositeUnitAddSub = this.commonService.getCompositeUnitStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.selectUnitType)
          newData.push({ id: data.id, text: data.name })
          this.selectUnitType = newData
          this.unitTypeValue = data.id
          setTimeout(() => {
            if (this.unitSelect2) {
              const element = this.renderer.selectRootElement(this.unitSelect2.selector.nativeElement, true)
              element.focus({ preventScroll: false })
            }
          }, 500)
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

  removeImage(i) {
    this.addedImages.images.splice(i, 1)
    this.addedImages.queue.splice(i, 1)
    this.addedImages.safeUrls.splice(i, 1)
    this.addedImages.baseImages.splice(i, 1)
    this.addedImages.id.splice(i, 1)
    this.createImageFiles()
  }

  createImageFiles() {
    let ImageFiles = []
    for (let i = 0; i < this.addedImages.images.length; i++) {
      let obj = { Name: this.addedImages.queue[i], BaseString: this.addedImages.safeUrls[i], IsBaseImage: this.addedImages.baseImages[i], Id: this.addedImages.id[i] ? this.addedImages.id[i] : 0 }
      ImageFiles.push(obj)
    }
    this.ImageFiles = ImageFiles
    console.log('image files : ', this.ImageFiles)
  }

  getEditData() {
    this._itemmasterServices.getEditData(+this.Id).subscribe(
      (data) => {
        if (data.Code === UIConstant.THOUSAND && data.Data) {
          console.log('edit data : ', data)
          this.createFormData(data.Data)
        }
      }
    )
  }

  ItemAttributesTrans: any = []
  createAttributes(attributes) {
    attributes.forEach((element, index) => {
      this.ItemAttributesTrans[index] = {
        ItemId: element.ItemId,
        ItemTransId: element.ItemTransId,
        AttributeId: element.AttributeId,
        ParentTypeId: 21,
        name: element.AttributeName,
        Id: element.Id
      }
    })
  }

  createItems(ComboDetails) {
    this.combo = []
    ComboDetails.forEach((element, index) => {
      let itemAttributeTrans = []
      itemAttributeTrans = this.ItemAttributesTrans.filter((attr) => {
        if (attr.ItemTransId === element.Id) {
          return attr
        }
      })
      let obj = {
        'Id': element.Id,
        'TransId': element.TransId,
        'Sno': index + 1,
        'ItemId': element.ItemId,
        'UnitId': element.UnitId,
        'Quantity': element.Quantity,
        'SaleRate': element.SaleRate,
        'MrpRate': element.MrpRate,
        'PurchaseRate': element.PurchaseRate,
        'itemName': element.ItemName,
        'unitName': element.UnitName,
        'itemAttributeTrans': itemAttributeTrans
      }
      this.combo.push(obj)
    })
    console.log('combo : ', this.combo)
  }
  mobileSeriesNUmberOther:any =[]
  createMobileIMEiNumber (seriesNumber) {
    seriesNumber.forEach((element, index) => {
      this.ItemPropertyTrans[index] = {
        Id: element.Id,
        ItemId: element.ItemId,
        FieldValue1 :element.FieldValue1===null? '' :element.FieldValue1,
        FieldValue2 :element.FieldValue2===null? '' :element.FieldValue2,
        FieldValue3 :element.FieldValue3===null? '' :element.FieldValue3,
        FieldValue4 :element.FieldValue4===null? '' :element.FieldValue4,
        ItemTransId: element.ItemTransId,
        ItemPropertyId: element.ItemPropertyId,
        Sno: index + 1,
        UnderTransId: element.Id
      }
    })
  }
  createFormData(data) {
    this.openModal()
    if(data && data.ItemPropertyTrans && data.ItemPropertyTrans.length>0){
    this.createMobileIMEiNumber(data.ItemPropertyTrans)
    }
    this.createAttributes(data.ItemAttributesTrans)
    this.createItems(data.ComboDetails)
    this.createItemStockAttribute(data.ItemBarCodeDetails);
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
      this.addedImages.safeUrls.push(element.FilePath)
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
    this.MrpRate = (isNaN(+this.itemDetails.Mrprate)) ? 0 : +this.itemDetails.Mrprate
    this.SaleRate = (isNaN(+this.itemDetails.SaleRate)) ? 0 : +this.itemDetails.SaleRate
    this.OurPrice = (isNaN(+this.itemDetails.OurPrice)) ? 0 : +this.itemDetails.OurPrice
    // this.Nrv = (isNaN(+this.itemDetails.Nrv)) ? 0 : +this.itemDetails.Nrv
    this.MinStock = (isNaN(+this.itemDetails.MinStock)) ? 0 : +this.itemDetails.MinStock
    this.MaxStock = (isNaN(+this.itemDetails.MaxStock)) ? 0 : +this.itemDetails.MaxStock
    this.ReOrderQty = (isNaN(+this.itemDetails.ReOrderQty)) ? 0 : +this.itemDetails.ReOrderQty
    this.BarCode = this.itemDetails.BarCode
    this.PurchaseRate = (isNaN(+this.itemDetails.PurchaseRate)) ? 0 : +this.itemDetails.PurchaseRate
    this.OpeningStock = (isNaN(+this.itemDetails.OpeningStock)) ? 0 : +this.itemDetails.OpeningStock
    this.OpeningStockValue = (isNaN(+this.itemDetails.OpeningStockValue)) ? 0 : +this.itemDetails.OpeningStockValue
    this.IsNotDiscountable = this.itemDetails.IsNotDiscountable
    this.IsVolumeDiscountApply = this.itemDetails.IsVolumeDiscountApply
    this.IsTradeDiscountApply = this.itemDetails.IsTradeDiscountApply
    this.loading = false
    if (this.editMode) {
      setTimeout(() => {
        this.itemTypeSelect2.setElementValue(this.itemDetails.ItemType)
        this.packingTypeSelect2.setElementValue(this.itemDetails.PackingType)
        this.catSelect2.setElementValue(this.itemDetails.CategoryId)
        this.unitSelect2.setElementValue(this.itemDetails.UnitId)
        this.taxSelect2.setElementValue(this.itemDetails.TaxId)
        if (this.itemDetails.BrandIds) {
          this.selectedBrands = this.itemDetails.BrandIds.split(',')
        }
      }, 1000)
    }
  }
  industryId:any
  @ViewChild('itemname') itemname: ElementRef
  @ViewChild('barcode') barcode: ElementRef
  openModal() {
    this.industryId = +this.settings.industryId
    this.initComp()
    $('#item_form').removeClass('fadeInUp')
    $('#item_form').addClass('fadeInDown')
    $('#item_form').modal(UIConstant.MODEL_SHOW)
    if (this.toDisableCat) {
      setTimeout(() => {
        if (this.itemname) {
          const element = this.renderer.selectRootElement(this.itemname.nativeElement, true)
          element.focus({ preventScroll: false })
        }
      }, 600)
    } else {
      setTimeout(() => {
        if (this.catSelect2) {
          const element = this.renderer.selectRootElement(this.catSelect2.selector.nativeElement, true)
          element.focus({ preventScroll: false })
        }
        if (this.itemname && this.itemname.nativeElement.value.trim()) {
          fromEvent(this.itemname.nativeElement, 'keyup').pipe(
            map((event: any) => {
              return event.target.value.trim()
            }),
            filter(res => res.length > 0),
            debounceTime(1000),
            distinctUntilChanged()
          ).subscribe((text: string) => {
            this.pendingCheck1 = true
            this.nameExistSub = this._itemmasterServices.searchItemName(text).subscribe((data) => {
              if (data.Code === UIConstant.THOUSAND) {
                console.log('search data : ', data)
                setTimeout(() => {
                  this.pendingCheck1 = false
                  this.existsCodes.name = data.Data.Status
                  if (this.existsCodes.name) {
                    $('.fas fa-check').addClass('hideMe')
                  } else {
                    $('.fas fa-times').addClass('hideMe')
                  }
                }, 1000)
              } else {
                this.toastrService.showError('', data.Description)
              }
            }, (err) => {
              setTimeout(() => {
                this.pendingCheck1 = false
              }, 100)
              console.log('error', err)
            },
              () => {
                // setTimeout(() => {
                //   this.pendingCheck1 = false
                // }, 1000)
              })
          })
        }
        if (this.barcode && this.barcode.nativeElement.value.trim()) {
          fromEvent(this.barcode.nativeElement, 'keyup').pipe(
            map((event: any) => {
              return event.target.value.trim()
            }),
            filter(res => res.length > 0),
            debounceTime(1000),
            distinctUntilChanged()
          ).subscribe((text: string) => {
            this.pendingCheck = true
            console.log('search text : ', text)
            this.barCodeExistSub = this._itemmasterServices.searchEntries(text).subscribe((data) => {
              if (data.Code === UIConstant.THOUSAND) {
                console.log('search data : ', data)
                setTimeout(() => {
                  this.pendingCheck = false
                  this.existsCodes.barcode = data.Data[0].Status
                  if (this.existsCodes.barcode) {
                    $('.fas fa-check').addClass('hideMe')
                    // this.toastrService.showError('Oops', 'Bar Code is already taken')
                  } else {
                    $('.fas fa-times').addClass('hideMe')
                  }
                }, 1000)
              } else {
                this.toastrService.showError('', data.Description)
              }
            }, (err) => {
              setTimeout(() => {
                this.pendingCheck = false
              }, 100)
              console.log('error', err)
            },
              () => {
                // setTimeout(() => {
                //   this.pendingCheck = false
                // }, 1000)
              })
          })
        }
      }, 1000)
    }
  }

  getBarStatus() {
    if (this.HsnNo.trim()) {
      this.pendingCheck = true
      console.log('search text : ', this.HsnNo)
      this._itemmasterServices.searchEntries(this.HsnNo.trim()).subscribe((data) => {
        if (data.Code === UIConstant.THOUSAND) {
          console.log('search data : ', data)
          setTimeout(() => {
            this.pendingCheck = false
            this.existsCodes.barcode = data.Data[0].Status
            if (this.existsCodes.barcode) {
              $('.fas fa-check').addClass('hideMe')
              // this.toastrService.showError('Oops', 'Bar Code is already taken')
            } else {
              $('.fas fa-times').addClass('hideMe')
            }
          }, 1000)
        } else {
          this.toastrService.showError('', data.Description)
          this.pendingCheck = false
        }
      })
    }
  }

  getItemNameStatus() {
    if (this.Name.trim()) {
      this.pendingCheck1 = true
      this._itemmasterServices.searchItemName(this.Name.trim()).subscribe((data) => {
        if (data.Code === UIConstant.THOUSAND) {
          console.log('search data : ', data)
          setTimeout(() => {
            this.pendingCheck1 = false
            this.existsCodes.name = data.Data.Status
            if (this.existsCodes.name) {
              $('.fas fa-check').addClass('hideMe')
            } else {
              $('.fas fa-times').addClass('hideMe')
            }
          }, 1000)
        } else {
          this.toastrService.showError('', data.Description)
        }
      })
    }
  }

  @ViewChild('brand_select2') brandSelect2: Select2Component
  initComp() {
    if (this.modeOfForm === 'new') {
      this.loading = true
    }
    this.preQty =0
    this.ItemPropertyTrans = []
    this.invalidObj = {}
    this.submitClick = false
    this.isBarCode = false
    this.isItemCode = false
    if (!this.toDisableCat) {
      this.cateGoryValue = ''
    }
    this.taxValue = ''
    this.packingTypeValue = 1
    this.itemDetailValue = 1
    this.pendingCheck1 = false
    this.existsCodes = {}
    this.pendingCheck = false
    this.unitSettingType = 0
    this.combo = []
    this.ImageFiles = []
    this.createForm()
    if (this.catSelect2) {
      this.catSelect2.setElementValue(this.CategoryId)
    }
    if (this.taxSelect2) {
      this.taxSelect2.setElementValue('')
    }
    if (this.unitSelect2) {
      this.unitSelect2.setElementValue('')
    }
    if (this.brandSelect2) {
      this.brandSelect2.setElementValue('')
    }
    if (this.packingTypeSelect2) {
      this.packingTypeSelect2.setElementValue('1')
    }
    if (this.modeOfForm === 'new') {
      this.unitTypeValue = 0
      this.getSetting(JSON.parse(this.settings.moduleSettings).settings)
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

  initialiseExtras() {
    if (this.modeOfForm === 'new') {
      this.loading = true
    }
    this.invalidObj = {}
    this.submitClick = false
    this.pendingCheck1 = false
    this.existsCodes = {}
    this.pendingCheck = false
    this.combo = []
    this.getBarCodeSetting()
    this.Name = ''
    this.HsnNo = ''
    this.MrpRate = 0
    this.SaleRate = 0
    this.OurPrice = 0
    this.MinStock = 0
    this.MaxStock = 0
    this.ReOrderQty = 0
    this.BarCode = ''
    this.PurchaseRate = 0
    this.OpeningStock = 0
    this.OpeningStockValue = 0
    this.IsNotDiscountable = false
    this.IsVolumeDiscountApply = false
    this.IsTradeDiscountApply = false
    this.ImageFiles = []
    this.addedImages = { images: [], queue: [], safeUrls: [], baseImages: [] }
  }

  closeModal() {
    if ($('#item_form').length > 0) {
      this.modeOfForm = new
        $('#item_form').modal(UIConstant.MODEL_HIDE)
    }
  }

  ngOnDestroy() {
    // this.modalOpen.unsubscribe()
    // this.newCategoryAddSub.unsubscribe()
    // this.newTaxAddSub.unsubscribe()
    // this.newUnitAddSub.unsubscribe()
    // this.barCodeExistSub.unsubscribe()
    // this.nameExistSub.unsubscribe()
  }

  createForm() {
    this.Id = 0
    if (!this.toDisableCat) {
      this.CategoryId = 0
    }
    this.Name = ''
    this.HsnNo = ''
    // this.ItemCode = this.BarCode
    this.UnitId = 0
    this.TaxId = 0
    this.ItemType = 1
    this.PackingType = 1
    this.MrpRate = 0
    this.SaleRate = 0
    this.OurPrice = 0
    // this.Nrv = 0
    this.MinStock = 0
    this.MaxStock = 0
    this.ReOrderQty = 0
    // this.BarCode = ''
    this.PurchaseRate = 0
    this.OpeningStock = 0
    this.OpeningStockValue = 0
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

  private itemAddParams(): ItemMasterAdd {
    // Nrv: +this.Nrv,
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
        MinStock: +this.MinStock,
        MaxStock: +this.MaxStock,
        ReOrderQty: +this.ReOrderQty,
        BarCode: this.BarCode,
        PurchaseRate: +this.PurchaseRate,
        OpeningStock: +this.OpeningStock,
        OpeningStockValue: +this.OpeningStockValue,
        BrandIds: this.BrandIds,
        IsNotDiscountable: this.IsNotDiscountable,
        IsVolumeDiscountApply: this.IsVolumeDiscountApply,
        IsTradeDiscountApply: this.IsTradeDiscountApply,
        ImageFiles: this.ImageFiles,
        ItemTransactions: this.Items,
        ItemAttributeTrans: this.ItemAttributeTrans,
        ItemAttributewithRate: this.prepareItemAttributeStkPayloadToSave(this.ItemAttributewithRate),
        ItemPropertyTrans: this.ItemPropertyTrans,

      } as ItemMasterAdd
    }
    return itemAddElement.obj
  }

  getCategoryDetails() {
    this.categoryPlaceHolder = { placeholder: 'Select Category' }
    let newData = [{ id: '0', text: 'Select Category' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
    this._itemmasterServices.getAllSubCategories(1).subscribe(data => {
      // console.log('categories : ', data)
      if (data.Code === UIConstant.THOUSAND) {
        if (data.Data.length > 0) {
          data.Data.forEach(element => {
            newData.push({
              id: element.Id,
              text: element.Name
            })
          })
        }
        this.categoryType = newData
      }
    },
      (error) => {
        console.log(error)
        this.loading = false
      },
      () => {
        this.loading = false
      })
  }

  @ViewChild('cat_select2') catSelect2: Select2Component
  @ViewChild('itemtype_select2') itemTypeSelect2: Select2Component
  @ViewChild('packingtype_select2') packingTypeSelect2: Select2Component
  selectedCategory(event) {
    if (event.value && event.data.length > 0) {
      // console.log('event on change of item : ', event)
      if (+event.value === -1) {
        this.catSelect2.selector.nativeElement.value = ''
        this.commonService.openCategory('', '1')
      } else {
        if (event.value > 0 && event.data[0] && event.data[0].text) {
          this.CategoryId = +event.value
          this.categoryName = event.data[0].text
        }
      }
      this.checkForValidation()
    }
  }

  getTaxtDetail(value) {
    this.taxTypePlaceHolder = { placeholder: 'Select Tax' }
    let newData = [{ id: '0', text: 'Select Tax' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
    this._itemmasterServices.getTaxDetail().subscribe(data => {
      if (data.Code === UIConstant.THOUSAND) {
        if (data.Data.TaxSlabs.length > 0) {
          data.Data.TaxSlabs.forEach(element => {
            newData.push({
              id: element.Id,
              text: element.Slab
            })
          })
        }
        this.selectTax = newData
      }
    },
      (error) => {
        console.log(error)
      })
  }

  @ViewChild('tax_select2') taxSelect2: Select2Component
  selectedTax(event) {
    console.log('on select of tax : ', event)
    if (event.value && event.data.length > 0) {
      if (+event.value === -1 && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
        this.taxSelect2.selector.nativeElement.value = ''
        this.commonService.openTax('')
      } else if (+event.value > 0) {
        this.TaxId = +event.value
        this.taxName = event.data[0].text
      }
      this.checkForValidation()
    }
  }
  GetAllPostData: any = []
  getUnitTypeDetail(value) {

    this.unitTypePlaceHolder = { placeholder: 'Select Unit' }
    let newData = [{ id: '0', text: 'Select Unit' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
    this.unitMasterService.getSubUnits().subscribe(data => {
      if (data.Code === UIConstant.THOUSAND) {
        this.GetAllPostData = data.Data;
        if (data.Data.length > 0) {
          data.Data.forEach(element => {
            newData.push({
              id: element.Id,
              text: element.Name
            })
          })
        }
        this.selectUnitType = newData
      }
      if (this.unitSettingType === 1) {
        this.postDataForUnit(this.GetAllPostData)
      }
    })
  }
  UnitIdForEDit: any = 0
  postDataForUnit(data) {
    if (data.length > 0) {
      data.forEach(element => {
        if ((element.PrimaryUnitId === element.SecondaryUnitId) && (element.SecondaryUnitId === JSON.parse(this.UnitIdForEDit)) && (element.PrimaryUnitId === JSON.parse(this.UnitIdForEDit))) {
          this.UnitId = element.Id
          this.unitTypeValue = element.Id

        }
      });
    }

  }
  @ViewChild('unit_select2') unitSelect2: Select2Component
  selectedUnitTpye(event) {
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
      } else if (+event.value > 0) {
        this.UnitId = +event.value
        this.unitName = event.data[0].text
      }
      this.checkForValidation()
    }
  }

  getBrandDetail(brand) {
    this.selectBrand = []
    this._itemmasterServices.getBrandDetail().subscribe(data => {
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        let newData = []
        if (data.Data.length > 0) {
          newData = [{ id: '0', text: 'Select Brand' }]
          data.Data.forEach(element => {
            newData.push({
              id: element.Id,
              text: element.Name
            })
          })
        }
        this.selectBrand = newData
      }
    },
      (error) => {
        console.log(error)
      })
  }

  getpackingTypeDetail(value) {
    this.packingTypePlaceHolder = { placeholder: 'Select packingType' }
    this.selectPackingType = [{ id: '1', text: 'Packed' }, { id: '2', text: 'Loose' }, { id: '3', text: 'Combo' }]
  }

  selectedPackingType(event) {
    this.PackingType = +event.value
    if (this.PackingType === 3) {
      this.packingTypeSelect2.selector.nativeElement.value = ''
      this.comboComp.openModal()
    }
  }
  getItemDetail(value) {
    this.itemTpyePlaceHolder = { placeholder: 'Select item' }
    this.selectItemTpye = [{ id: '1', text: 'Stockable' }, { id: '2', text: 'Stockable Not Sale' }]
  }
  selectedItemType(itemTypeCode) {
    this.ItemType = +itemTypeCode.value
  }
  yesConfirmationClose() {
    $('#close_confirm4').modal(UIConstant.MODEL_HIDE)
    this.commonService.closeItemMaster('')
    this.initComp()
  }
  closeConfirmation() {
    $('#close_confirm4').modal(UIConstant.MODEL_SHOW)
  }
  closeItemMaster() {
    this.closeConfirmation()

  }
  addNewItemMaster(value) {
    this.submitClick = true
    if (value === 'reset') {
      this.initComp()
      this.submitClick = false
      this.loading = false
    }
    this.dynamicFocus()
    if (this.checkForValidation() && !this.existsCodes.barcode && !this.existsCodes.name &&
      !this.pendingCheck && !this.pendingCheck1) {
      if (value === 'reset') {
        this.initComp()
        this.submitClick = false
      } else {
        console.log('obj : ', JSON.stringify(this.itemAddParams()))
        this._itemmasterServices.addNewItem(this.itemAddParams()).subscribe(data => {
          console.log('data : ', data)
          if (data.Code === UIConstant.THOUSAND) {
            if (value === 'save') {
              const dataToSend = { id: data.Data, name: this.Name, categoryId: this.CategoryId }
              const dataToSend1 = { id: this.UnitId, name: this.unitName }
              const dataToSend2 = { id: this.TaxId, name: this.taxName }
              const dataToSend3 = { id: this.CategoryId, name: this.categoryName }
              this.toastrService.showSuccess('Success', 'Saved Successfully')
              this.commonService.onAddItemMaster()
              this.commonService.closeItemMaster(dataToSend)
              this.commonService.closeUnit(dataToSend1)
              this.commonService.closeTax(dataToSend2)
              this.commonService.closeCategory(dataToSend3)
              this.initComp()
            } else {
              setTimeout(() => {
                if (this.itemname) {
                  const element = this.renderer.selectRootElement(this.itemname.nativeElement, true)
                  element.focus({ preventScroll: false })
                }
              }, 600)
              this.commonService.onAddItemMaster()
              this.Id = UIConstant.ZERO
              this.submitClick = false
              this.loading = false
              //this.initComp()
              this.toastrService.showSuccess('Success', 'Saved Successfully')
              this.initialiseExtras()
            }
          } else {
            this.toastrService.showError('', data.Message)
          }
        })
      }
    }
  }

  openImageModal() {
    this._itemmasterServices.openImageModal(this.addedImages)
  }
  @ViewChild('hsnNoRef') hsnNoRef: ElementRef
  @ViewChild('barCodeRef') barCodeRef: ElementRef
  @ViewChild('itemCodeRef') itemCodeRef: ElementRef


  dynamicFocus() {

    if (!isNaN(+this.CategoryId) && +this.CategoryId > 0) {
      this.invalidObj['CategoryId'] = false
    } else {
      this.invalidObj['CategoryId'] = true
      this.catSelect2.selector.nativeElement.focus({ preventScroll: false })

    }
    if (this.Name && this.Name.trim()) {
      this.invalidObj['Name'] = false
    } else if (!this.invalidObj.CategoryId) {
      this.invalidObj['Name'] = true
      this.itemname.nativeElement.focus()

    }
    if (this.HsnNo && this.HsnNo.trim()) {
      this.invalidObj['HsnNo'] = false
    } else if (!this.invalidObj.CategoryId && !this.invalidObj.Name) {
      this.invalidObj['HsnNo'] = true
      this.hsnNoRef.nativeElement.focus()
    }
    if (this.BarCode && this.BarCode.trim()) {
      this.invalidObj['BarCode'] = false
    } else if (!this.invalidObj.CategoryId && !this.invalidObj.Name && !this.invalidObj.HsnNo) {
      this.invalidObj['BarCode'] = true
      this.barCodeRef.nativeElement.focus()

    }
    if (this.ItemCode && this.ItemCode.trim()) {
      this.invalidObj['ItemCode'] = false
    } else if (!this.invalidObj.CategoryId && !this.invalidObj.Name && !this.invalidObj.HsnNo && !this.invalidObj.BarCode) {
      this.invalidObj['ItemCode'] = true
      this.itemCodeRef.nativeElement.focus()


    }
    if (!isNaN(+this.UnitId) && +this.UnitId > 0) {
      this.invalidObj['UnitId'] = false
    } else if (!this.invalidObj.ItemCode && !this.invalidObj.CategoryId && !this.invalidObj.Name && !this.invalidObj.HsnNo && !this.invalidObj.BarCode) {

      this.invalidObj['UnitId'] = true
      this.unitSelect2.selector.nativeElement.focus({ preventScroll: false })


    }
    if (!isNaN(+this.TaxId) && +this.TaxId > 0) {
      this.invalidObj['TaxId'] = false
    } else if (!this.invalidObj.UnitId && !this.invalidObj.ItemCode && !this.invalidObj.CategoryId && !this.invalidObj.Name && !this.invalidObj.HsnNo && !this.invalidObj.BarCode) {

      this.invalidObj['TaxId'] = true
      this.taxSelect2.selector.nativeElement.focus({ preventScroll: false })


    }





  }
  checkForValidation(): boolean {
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
    if (this.Name && this.Name.trim()) {
      this.invalidObj['Name'] = false
    } else {
      this.invalidObj['Name'] = true
      isValid = 0
    }
    if (this.ItemCode && this.ItemCode.trim()) {
      this.invalidObj['ItemCode'] = false
    } else {
      this.invalidObj['ItemCode'] = true
      isValid = 0
    }
    if (this.HsnNo && this.HsnNo.trim()) {
      this.invalidObj['HsnNo'] = false
    } else {
      this.invalidObj['HsnNo'] = true
      isValid = 0
    }
    if (this.BarCode && this.BarCode.trim()) {
      this.invalidObj['BarCode'] = false
    } else {
      this.invalidObj['BarCode'] = true
      isValid = 0
    }
    return !!isValid
  }

  toShowOpeningStock: boolean = false
  getSetting(settings) {
    // console.log('settings : ', settings)
    settings.forEach(element => {
      if (element.id === SetUpIds.unitType) {
        this.unitSettingType = +element.val
        console.log('this.unitSettingType : ', this.unitSettingType)
      }
      if (element.id === SetUpIds.autoGneratedItemCode) {
        this.isItemCode = !!(+element.val)
        console.log('this.isItemCode : ', this.isItemCode)
      }
      if (element.id === SetUpIds.autoGeneratedBarcode) {
        this.isBarCode = !!(+element.val)
        if (!this.editMode) {
          this.getBarCodeSetting()
        }
      }
      if (element.id === SetUpIds.noOfDecimalPoint) {
        this.noOfDecimal = +element.val
        console.log('this.noOfDecimal : ', this.noOfDecimal)
      }
      if (element.id === SetUpIds.attributesForPurchase) {
        this.toShowOpeningStock = (element.val && element.val.length > 0) ? true : false
      }
    })
  }

  public exampleData: Array<Select2OptionData>
  public options: Select2Options
  public value: string[]

  ngOnInit() {
    this.options = {
      multiple: true
    }
  }

  onBrandSelect(data: { value: string[] }) {
    this.BrandIds = data.value.join(',')
  }

  @ViewChild('imagebutton') imagebutton: ElementRef
  onPressEnter(type) {
    if (type === 1) {
      this.IsNotDiscountable = !this.IsNotDiscountable
    } else if (type === 2) {
      this.IsTradeDiscountApply = !this.IsTradeDiscountApply
    } else if (type === 3) {
      this.IsVolumeDiscountApply = !this.IsVolumeDiscountApply
    }
  }

  comboAdded(combo) {
    console.log('combo : ', combo)
    this.combo = combo
    this.Items = []
    this.ItemAttributeTrans = []
    this.combo.forEach(element => {
      this.Items.push(element)
      this.ItemAttributeTrans = this.ItemAttributeTrans.concat(element.itemAttributeTrans)
    })
    console.log('combo Items : ', this.Items)
    console.log('combo ItemAttributeTrans : ', this.ItemAttributeTrans)
  }

  getBarCodeSetting() {
    if (this.isBarCode) {
      this._itemmasterServices.getBarCode('ForBarCode').subscribe(
        (data: any) => {
          console.log('bar code : ', data)
          if (data.Code === UIConstant.THOUSAND && data.Data.length > 0 && data.Data[0].BarCode) {
            this.BarCode = data.Data[0].BarCode

            this.ItemCode = this.BarCode
          }
        }
      )
    }
  }

  onPurchaseRateChange = () => {
    if (+this.OpeningStock > 0 && +this.PurchaseRate > 0) {
      this.OpeningStockValue = +(+this.OpeningStock * +this.PurchaseRate).toFixed(this.noOfDecimal)
    } else {
      this.OpeningStockValue = 0
    }
    // if(+this.OpeningStockValue > 0 && +this.PurchaseRate > 0) {
    //   this.OpeningStock = +(+this.OpeningStockValue / +this.PurchaseRate).toFixed(this.noOfDecimal)
    // } else {
    //   this.OpeningStock = 0
    // }
  }

  onOpeningStockChange = () => {
    if (+this.PurchaseRate > 0 && +this.OpeningStock > 0) {
      this.OpeningStockValue = +(+this.OpeningStock * +this.PurchaseRate).toFixed(this.noOfDecimal)
    } else {
      this.OpeningStockValue = 0
    }
    if (+this.OpeningStockValue > 0 && +this.OpeningStock > 0) {
      this.PurchaseRate = +(+this.OpeningStockValue / +this.OpeningStock).toFixed(this.noOfDecimal)
    } else {
      this.PurchaseRate = 0
    }
  }

  onOpeningStockValueChange = () => {
    if (+this.OpeningStock > 0 && +this.OpeningStockValue > 0) {
      this.PurchaseRate = +(+this.OpeningStockValue / +this.OpeningStock).toFixed(this.noOfDecimal)
    } else {
      this.PurchaseRate = 0
    }
    // if(+this.PurchaseRate > 0 && +this.OpeningStockValue > 0) {
    //   this.OpeningStock = +(+this.OpeningStockValue / +this.PurchaseRate).toFixed(this.noOfDecimal)
    // } else {
    //   this.OpeningStock = 0
    // }
  }

  openItemStockAttributeModel = () => {
    this.loading = true
    this.itemAttributeOpeningStockOpen = {
      data: this.ItemAttributewithRate,
      value: true,
      editMode: this.editMode
    };
  }
  itemAttributeOpeningStockOpenClosed(data) {
    this.loading = false;
    this.itemAttributeOpeningStockOpen = {
      value: false,
      editMode: data.editMode
    };
    if (data.type === 'save') {
      this.ItemAttributewithRate = [...data.data];
      const filteredData = _.filter(data.data, (element) => {
        if (element.Checked) {
          return true;
        }
      })
      if (filteredData.length > 0) {
        this.OpeningStock = 0
        this.OpeningStockValue = 0
        _.forEach(filteredData, (element) => {
          if (element.Qty && element.Checked) {
            this.OpeningStock = +(+this.OpeningStock + +element.Qty).toFixed(this.noOfDecimal)
          }
          if (element.QtyValue && element.Checked) {
            this.OpeningStockValue = +(+this.OpeningStockValue + +element.QtyValue).toFixed(this.noOfDecimal)
          }
          this.isStkValue = true;
        })
      }
    }
  }

  createItemStockAttribute = (Data) => {
    this.ItemAttributewithRate = _.map(Data, (element) => {
      return {
        "ID": element.Id,
        "ParentTypeId": element.ParentTypeId,
        "AttributeId": element.AttributeId,
        "Barcode": element.Barcode,
        "ClientBarCode": element.ClientBarCode,
        "GroupId": element.GroupId,
        "IsBaseGroup": 1,
        "ItemId": element.ItemId,
        "ItemTransId": element.ItemTransId,
        "Qty": element.Qty,
        "QtyValue": element.QtyValue,
        "RateMrp": element.RateMrp,
        "RateNrv": element.RateNrv,
        "RateOur": element.RateOur,
        "RatePurchase": element.RatePurchase,
        "RateSale": element.RateSale,
        "AttributeStr": element.AttributeIdStr,
        "AttributeNamestr": element.AttributeNamestr
      }
    })
  }

  prepareItemAttributeStkPayloadToSave = (dataToPost) => {
    const Data = _.filter(dataToPost, (element) => {
      if (element.Checked === true) {
        return true
      }
    });
    const data = _.map(Data, (element) => {
      return {
        "ID": element.ID ? element.ID : 0,
        "ParentTypeId": element.ParentTypeId ? element.ParentTypeId : 0,
        "AttributeId": element.AttributeId ? element.AttributeId : 0,
        "Barcode": element.Barcode ? element.Barcode : 0,
        "ClientBarCode": element.ClientBarCode ? element.ClientBarCode : 0,
        "GroupId": element.GroupId,
        "IsBaseGroup": element.IsBaseGroup ? element.IsBaseGroup : 0,
        "ItemId": element.ItemId ? element.ItemId : 0,
        "ItemTransId": element.ItemTransId ? element.ItemTransId : 0,
        "Qty": element.Qty ? element.Qty : 0,
        "QtyValue": element.QtyValue ? element.QtyValue : 0,
        "RateMrp": element.RateMrp ? element.RateMrp : 0,
        "RateNrv": element.RateNrv ? element.RateNrv : 0,
        "RateOur": element.RateOur ? element.RateOur : 0,
        "RatePurchase": element.RatePurchase ? element.RatePurchase : 0,
        "RateSale": element.RateSale ? element.RateSale : 0,
        "AttributeStr": element.AttributeStr ? element.AttributeStr : 0,
      }
    })
    return data
  }
  createMobilepopup (evt){
    if ( this.CategoryId > 0 &&  this.OpeningStock >0 && this.UnitId>0 && this.industryId === 12) {
      this.createMobileList(null)
      $('#item_for_EmiNumber').modal(UIConstant.MODEL_SHOW)
      this.propertRefValue.nativeElement.focus()
     
    }
  }
  closeIMEI() {
    $('#item_for_EmiNumber').modal(UIConstant.MODEL_HIDE)
    this.OpeningStockValueRef.nativeElement.focus()

  }
  getIMEIName (evt){

  }
@ViewChild('OpeningStockValueRef') OpeningStockValueRef :ElementRef
@ViewChild('propertRef') propertRefValue :ElementRef
  preQty: any = 0
  imei_ID: any = 0
  ItemPropertyTrans:any
  createMobileList(propertyValue) {
    console.log(propertyValue)
    let Sno = 0
      // if (this.Items.length === 0) {
      //   Sno = 1
      // } else {
      //   Sno = this.Items[this.Items.length - 1].Sno + 1
      // }
    if (+this.OpeningStock > 0) {
      if (+this.OpeningStock !== this.ItemPropertyTrans.length) {
        let qty = this.OpeningStock - this.preQty
        if (this.preQty > this.OpeningStock) {
          this.ItemPropertyTrans = []
          for (let i = 0; i < this.OpeningStock; i++) {
            this.ItemPropertyTrans.push({
              Id: 0,
              //ItemTransId:Sno,
              ItemPropertyId : 0,
              UnderTransId :0
            });
          }
        }
        else {
          for (let i = 0; i < qty; i++) {
            this.ItemPropertyTrans.push({
              Id: this.imei_ID,
              multiplePropertyList:[],
            //  ItemTransId:Sno,
              ItemPropertyId : 0,
              UnderTransId : 0
            });
          }
        }
        this.preQty = this.OpeningStock
      }
    }
  }


}
