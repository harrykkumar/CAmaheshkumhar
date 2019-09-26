import { Component, ViewChild, QueryList, ViewChildren, ElementRef, Output, EventEmitter, Input } from '@angular/core'
import { UIConstant } from '../../../constants/ui-constant'
import { ComboService } from './combo.service'
import { PurchaseService } from '../../../../inventory/purchase/purchase.service'
import { Select2Component, Select2OptionData } from 'ng2-select2'
import { Subscription } from 'rxjs'
import { PurchaseAttribute, ComboItem } from '../../../../model/sales-tracker.model'
import { Settings } from '../../../constants/settings.constant'
import { CommonService } from '../../../../commonServices/commanmaster/common.services'
import { ToastrCustomService } from 'src/app/commonServices/toastr.service'

declare const $: any
@Component({
  selector: 'app-combo',
  templateUrl: './combo.component.html',
  styleUrls: ['./combo.component.css']
})
export class ComboComponent {
  attr$: Subscription
  item$: Subscription
  subUnitsData$: Subscription

  subUnitsData: Array<Select2OptionData>
  itemData: Array<Select2OptionData>
  attibutesData: Array<Select2OptionData>
  subUnitsValue: number
  attributeValue: number
  itemValue: number
  attributeKeys: string[]

  ItemTransId = 0
  AttributeId = 0
  ParentTypeId = 21
  GroupId: number = 0
  name = ''
  itemName: string = ''

  ItemId: number
  UnitId: number
  Quantity: number
  SaleRate: number
  MrpRate: number
  PurchaseRate: number
  unitName: string = ''
  TransId: number = 0

  itemAttributeTrans: Array<PurchaseAttribute> = []
  ItemAttributeTrans: Array<PurchaseAttribute> = []
  Items: Array<ComboItem> = []
  industryId: number

  submitSave: boolean = false
  clickItem: boolean = false
  @ViewChild('item_select2') itemSelect2: Select2Component
  validItem: boolean
  unitSettingType: number
  editItemId: number = -1
  @Output() emitCombo = new EventEmitter<Array<ComboItem>>()
  @Input() editMode: boolean
  @Input() previousCombo: Array<ComboItem>
  constructor (private comboService: ComboService, private purchaseService: PurchaseService,
    private settings: Settings,
    private commonService: CommonService,
    private toastrService: ToastrCustomService) {
    this.industryId = +this.settings.industryId
    this.attr$ = this.comboService.attributesData$.subscribe(
      data => {
        // console.log('attribute data : ', data)
        if (data.attributeKeys && data.attributesData) {
          this.initAttribute()
          this.attributeKeys = data.attributeKeys
          this.attibutesData = data.attributesData
        }
      }
    )

    this.item$ = this.comboService.itemData$.subscribe(
      data => {
        // console.log('item data : ', data)
        if (data.data) {
          data.data.splice(1, 1)
          this.itemData = Object.assign([], data.data)
        }
      }
    )
    this.subUnitsData$ = this.comboService.subUnitsData$.subscribe(
      data => {
        // console.log('unit data : ', data)
        if (data.data) {
          data.data.splice(1, 1)
          this.subUnitsData = data.data
          // console.log('subUnitsData : ', this.subUnitsData)
        }
      }
    )
  }

  openModal () {
    this.getSPUtilityData()
  }

  closeModal () {
    if ($('#item-combo').length > 0) {
      $('#item-combo').modal(UIConstant.MODEL_HIDE)
    }
  }

  getSPUtilityData () {
    let _self = this
    this.comboService.getSPUtilityData().subscribe(
      data => {
        console.log('combo : ', data)
        if (data.Code === UIConstant.THOUSAND && data.Data) {
          if (data.Data.AttributeValueResponses.length > 0) {
            _self.purchaseService.generateAttributes(data.Data)
            _self.comboService.generateAttributes(data.Data)
          }
          _self.purchaseService.createItems(data.Data.Items)
          _self.comboService.createItems(data.Data.Items)
          _self.purchaseService.createSubUnits(data.Data.SubUnits)
          _self.comboService.createSubUnits(data.Data.SubUnits)
        }
      },
      (error) => {
        console.log(error)
      },
      () => {
        $('#item-combo').modal(UIConstant.MODEL_SHOW)
        this.Items = [...this.previousCombo]
        setTimeout(() => {
          this.itemSelect2.selector.nativeElement.focus({ preventScroll: false })
        }, 1000)
      }
    )
  }

  onItemSelect (evt) {
    if (evt.value && evt.data.length > 0) {
      this.ItemId = +evt.value
      if (this.ItemId === 0) {
        this.validateItem()
      } else if (this.ItemId > 0) {
        this.itemName = evt.data[0].text
        this.getItemDetail(this.ItemId,'','')
        this.updateAttributes()
      }
    }
  }

  getItemDetail (id,Billdate,barcode) {
    console.log('id: ', id)
    this.purchaseService.getItemDetail(id,Billdate,barcode).subscribe(data => {
      console.log('item detail : ', data)
      if (data.Code === UIConstant.THOUSAND && data.Data.length > 0) {
        this.UnitId = data.Data[0].UnitId
        this.unitSelect2.setElementValue(data.Data[0].UnitId)
        this.unitName = data.Data[0].UnitName
        this.SaleRate = data.Data[0].SaleRate
        this.PurchaseRate = data.Data[0].PurchaseRate
        this.MrpRate = data.Data[0].Mrprate
        this.validateItem()
      } else {
        this.toastrService.showError(data.Description, '')
        this.validateItem()
      }
    })
  }

  onAttributeSelect (evt, index) {
    console.log('evt on change of attribute : ', evt)
    if (+evt.value > 0 && evt.data.length > 0) {
      let Sno = 0
      if (this.Items.length === 0) {
        Sno = 1
      } else {
        Sno = this.Items[this.Items.length - 1].Sno + 1
      }
      if (this.itemAttributeTrans[index]) {
        this.itemAttributeTrans[index]['ItemId'] = this.ItemId
        this.itemAttributeTrans[index]['AttributeId'] = +evt.value
        this.itemAttributeTrans[index]['ParentTypeId'] = 21
        this.itemAttributeTrans[index]['GroupId'] = 0
        this.itemAttributeTrans[index]['name'] = evt.data[0].text
      } else {
        this.itemAttributeTrans[index] = {
          ItemId: this.ItemId,
          ItemTransId: Sno,
          AttributeId:  +evt.value,
          ParentTypeId: 21,
          GroupId: 0,
          name: evt.data[0].text,
          id: 0,
          Sno: Sno
        }
      }
    }

    this.attrSelect2.forEach((attr: Select2Component, index: number, array: Select2Component[]) => {
      if (this.itemAttributeTrans[index] && this.itemAttributeTrans[index].AttributeId > 0) {
        $('#' + $('.attr')[index].id).removeClass('errorSelecto')
      } else {
        $('#' + $('.attr')[index].id).addClass('errorSelecto')
      }
    })
    console.log('this.itemAttributeTrans : ', this.itemAttributeTrans)
    this.validateItem()
  }

  updateAttributes () {
    for (let i = 0; i < this.itemAttributeTrans.length; i++) {
      this.itemAttributeTrans[i].ItemId = this.ItemId
    }
  }

  invalidObj: any = {}
  validateItem () {
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
      this.attrSelect2.forEach((attr: Select2Component, index: number, array: Select2Component[]) => {
        if (this.itemAttributeTrans[index] && this.itemAttributeTrans[index].AttributeId > 0) {
          $('#' + $('.attr')[index].id).removeClass('errorSelecto')
        } else {
          isValid = 0
          $('#' + $('.attr')[index].id).addClass('errorSelecto')
        }
      })
      this.validItem = !!isValid
    } else {
      this.validItem = true
    }
  }
  @ViewChild('unit_select2') unitSelect2: Select2Component
  onUnitSelect (evt) {
    // console.log('on evt select : ', evt)
    if (evt.value && evt.data.length > 0) {
      if (evt.value > 0 && evt.data[0] && evt.data[0].text) {
        this.UnitId = +evt.value
        this.unitName = evt.data[0].text
      }
      this.validateItem()
    }
  }

  enterPressItem (e: KeyboardEvent) {
    this.addItems()
    setTimeout(() => {
      this.itemSelect2.selector.nativeElement.focus()
    }, 10)
  }

  @ViewChild('savebutton') savebutton: ElementRef

  addItems () {
    if (+this.ItemId > 0 && this.validateAttribute() && +this.UnitId > 0 && this.Quantity > 0) {
      this.addItem()
      this.clickItem = true
      console.log('items : ', this.Items)
      this.initItem()
    } else {
      // this.clickItem = false
      // this.toastrService.showError('Please fill the required fields', '')
    }
  }

  addItem () {
    let index = 0
    if (this.Items.length === 0) {
      index = 1
    } else {
      index = +this.Items[this.Items.length - 1].Sno + 1
    }
    this.addItemBasedOnIndustry(index)
    this.ItemAttributeTrans = this.ItemAttributeTrans.concat(this.itemAttributeTrans)
    console.log('ItemAttributeTrans : ', this.ItemAttributeTrans)
    console.log('Items : ', this.Items)
  }

  addItemBasedOnIndustry (index) {
    this.Items.push({
      Id: 0,
      Sno: index,
      ItemId: +this.ItemId,
      TransId: +this.TransId,
      UnitId: +this.UnitId,
      Quantity: +this.Quantity,
      SaleRate: +this.SaleRate,
      MrpRate: +this.MrpRate,
      PurchaseRate: +this.PurchaseRate,
      itemName: this.itemName,
      unitName: this.unitName,
      itemAttributeTrans: this.itemAttributeTrans
    })

    setTimeout(() => {
      this.commonService.fixTableHFL('item-table')
    }, 1)

    if (this.editItemId !== -1) {
      this.Items[this.Items.length - 1].Id = this.editItemId
    }
  }

  editItem (i, editId, type) {
    console.log('editId : ', editId)
    if (type === 'items' && this.editItemId === -1) {
      this.editItemId = editId
      i = i - 1
      this.itemName = this.Items[i].itemName
      this.unitName = this.Items[i].unitName
      this.ItemId = this.Items[i].ItemId
      this.UnitId = this.Items[i].UnitId
      this.Quantity = this.Items[i].Quantity
      this.SaleRate = this.Items[i].SaleRate
      this.MrpRate = this.Items[i].MrpRate
      this.PurchaseRate = this.Items[i].PurchaseRate
      this.itemAttributeTrans = this.Items[i].itemAttributeTrans
      this.unitSelect2.setElementValue(this.UnitId)
      this.itemSelect2.setElementValue(this.ItemId)

      if (this.attrSelect2.length > 0) {
        this.attrSelect2.forEach((item: Select2Component, index: number, array: Select2Component[]) => {
          item.setElementValue(this.itemAttributeTrans[index].AttributeId)
        })
      }
      this.deleteItem(i, type)
    } else if (type === 'items' && this.editItemId !== -1) {
      this.toastrService.showInfo('', `There is already one item to edit,
      please update it this first in order to edit others`)
    }
  }

  deleteItem (i, forArr) {
    if (forArr === 'items') {
      this.Items.splice(i, 1)
      this.ItemAttributeTrans = []
      this.Items.forEach(item => {
        this.ItemAttributeTrans = this.ItemAttributeTrans.concat([], item.itemAttributeTrans)
      })
    }
  }

  initItem () {
    this.ItemId = 0
    this.TransId = 0
    this.itemName = ''
    this.UnitId = 0
    this.unitName = ''
    this.Quantity = 1
    this.SaleRate = 0
    this.MrpRate = 0
    this.PurchaseRate = 0
    this.editItemId = -1
    this.clickItem = false
    if (this.itemSelect2) {
      this.itemSelect2.setElementValue(this.ItemId)
    }
    if (this.unitSelect2) {
      this.unitSelect2.setElementValue(this.UnitId)
    }
    this.itemAttributeTrans = []
    this.initAttribute()
  }

  @ViewChildren('attr_select2') attrSelect2: QueryList<Select2Component>
  initAttribute () {
    this.ItemId = 0
    this.ItemTransId = 0
    this.AttributeId = 0
    this.ParentTypeId = 21
    this.GroupId = 0
    this.name = ''
    // console.log('attrSelect2 : ', this.attrSelect2)
    if (this.attrSelect2.length > 0) {
      this.attrSelect2.forEach((item: Select2Component, index: number, array: Select2Component[]) => {
        // console.log('attr : ', item)
        if ($('.attr') && $('.attr')[index]) {
          $('#' + $('.attr')[index].id).removeClass('errorSelecto')
        }
        item.setElementValue(0)
      })
    }
  }

  validateAttribute () {
    let isValid = true
    this.attrSelect2.forEach((attr: Select2Component, index: number, array: Select2Component[]) => {
      if (this.itemAttributeTrans[index] && this.itemAttributeTrans[index].AttributeId > 0) {
        //
      } else {
        isValid = false
      }
    })
    return isValid
  }

  saveCombo () {
    this.addItems()
    if (this.Items.length > 1) {
      this.emitCombo.emit(this.Items)
      this.closeModal()
    } else {
      this.toastrService.showError('Select atleast 2 Item in a combo', '')
    }
  }
}
