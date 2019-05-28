import { Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core'
import { FormGroup, FormBuilder } from '@angular/forms'
import { Select2Component, Select2OptionData } from 'ng2-select2'
import { UnitMasterServices } from '../../../commonServices/TransactionMaster/unit-mater.services'
import { UIConstant } from '../../../shared/constants/ui-constant'
import { ItemmasterServices } from '../../../commonServices/TransactionMaster/item-master.services'

@Component({
  selector: 'app-item-search',
  templateUrl: './item-search.component.html',
  styleUrls: ['./item-search.component.css']
})
export class ItemSearchComponent implements OnInit, OnChanges {
  ngOnChanges (changes: SimpleChanges): void {
    // console.log(changes)
    if (changes.toShow && changes.toShow.currentValue) {
      setTimeout(() => {
        const element = this.catSelect2.selector.nativeElement
        element.focus({ preventScroll: false })
      }, 10)
    }
  }
  @Input() toShow: boolean = false
  searchForm: FormGroup
  unitTypePlaceHolder: Select2Options
  packingTypePlaceHolder: Select2Options
  itemTpyePlaceHolder: Select2Options
  categoryPlaceHolder: Select2Options
  taxTypePlaceHolder: Select2Options
  selectUnitType: Array<Select2OptionData>
  selectPackingType: Array<Select2OptionData>
  selectItemTpye: Array<Select2OptionData>
  categoryType: Array<Select2OptionData>
  selectTax: Array<Select2OptionData>
  PackingTypeId: number
  UnitId: number
  ItemTypeId: number
  CategoryIdStr: string
  TaxSlabId: number

  taxValue = 0
  unitTypeValue = 0
  packingTypeValue = 0
  itemDetailValue = 0
  cateGoryValue = ''
  constructor (private formBuilder: FormBuilder,
    private unitMasterService: UnitMasterServices,
    private _itemmasterServices: ItemmasterServices) {
    this.getUnitTypeDetail()
    this.getpackingTypeDetail()
    this.getItemDetail()
    this.getCategoryDetails()
    this.getTaxtDetail()
  }
  @ViewChild('itemtype_select2') itemTypeSelect2: Select2Component
  @ViewChild('packingtype_select2') packingTypeSelect2: Select2Component
  @ViewChild('unit_select2') unitSelect2: Select2Component
  @ViewChild('cat_select2') catSelect2: Select2Component
  @ViewChild('tax_select2') taxSelect2: Select2Component
  ngOnInit () {
    this.searchForm = this.formBuilder.group({
      'StrCodes': ['']
    })
  }

  getUnitTypeDetail () {
    this.unitTypePlaceHolder = { placeholder: 'Select Unit' }
    let newData = [{ id: '0', text: 'select unit' }]
    this.unitMasterService.getSubUnits().subscribe(data => {
      if (data.Code === UIConstant.THOUSAND) {
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
    })
  }

  selectedUnitTpye (event) {
    if (event.value && event.data.length > 0) {
      this.UnitId = +event.value
    }
  }
  getpackingTypeDetail () {
    this.packingTypePlaceHolder = { placeholder: 'Select PackingType' }
    this.selectPackingType = [{ id: '0',text: 'Select PackingType' }, { id: '1',text: 'Packed' },{ id: '2',text: 'Loose' },{ id: '3',text: 'Combo' }]
  }

  selectedPackingType (event) {
    if (event.value && event.data.length > 0) {
      this.PackingTypeId = +event.value
    }
  }
  getItemDetail () {
    this.itemTpyePlaceHolder = { placeholder: 'select item' }
    this.selectItemTpye = [{ id: '0', text: 'select item' }, { id: '1', text: 'Stockable' },{ id: '2', text: 'Stockable Not Sale' }]
  }
  selectedItemType (event) {
    if (event.value && event.data.length > 0) {
      this.ItemTypeId = +event.value
    }
  }

  getCategoryDetails () {
    this.categoryPlaceHolder = {
      multiple: true,
      placeholder: 'Select Categories'
    }
    let newData = [{ id: '0', text: 'Select Category' }]
    this._itemmasterServices.getAllSubCategories(3).subscribe(data => {
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
    })
  }

  selectedCategory (data: {value: string[]}) {
    this.CategoryIdStr = data.value.join(',')
  }

  getTaxtDetail () {
    this.taxTypePlaceHolder = { placeholder: 'select Tax' }
    let newData = [{ id: '0', text: 'Select Tax' }]
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
    })
  }

  selectedTax (event) {
    if (event.value && event.data.length > 0) {
      this.TaxSlabId = +event.value
    }
  }

  search () {
    if (!this.CategoryIdStr) {
      this.CategoryIdStr = ''
    }
    if (!this.PackingTypeId) {
      this.PackingTypeId = 0
    }
    if (!this.ItemTypeId) {
      this.ItemTypeId = 0
    }
    if (!this.TaxSlabId) {
      this.TaxSlabId = 0
    }
    if (!this.UnitId) {
      this.UnitId = 0
    }
    if (!this.searchForm.value.StrCodes) {
      this.searchForm.value.StrCodes = ''
    }
    const queryStr = '&CategoryIdStr=' + this.CategoryIdStr +
     '&PackingTypeId=' + this.PackingTypeId + '&ItemTypeId=' +
      this.ItemTypeId + '&TaxSlabId=' + this.TaxSlabId + '&UnitId=' + this.UnitId
      + '&StrCodes=' + this.searchForm.value.StrCodes
    this._itemmasterServices.setSearchQueryParamsStr(queryStr)
  }

  resetSearch () {
    this.PackingTypeId = 0
    this.UnitId = 0
    this.ItemTypeId = 0
    this.CategoryIdStr = ''
    this.TaxSlabId = 0

    this.taxValue = 0
    this.unitTypeValue = 0
    this.packingTypeValue = 0
    this.itemDetailValue = 0
    this.cateGoryValue = ''
    this.searchForm.reset()
    // if (this.catSelect2) {
    //   this.catSelect2.setElementValue(0)
    // }
    if (this.taxSelect2) {
      this.taxSelect2.setElementValue(0)
    }
    if (this.unitSelect2) {
      this.unitSelect2.setElementValue(0)
    }
    if (this.itemTypeSelect2) {
      this.itemTypeSelect2.setElementValue(0)
    }
    if (this.packingTypeSelect2) {
      this.packingTypeSelect2.setElementValue(0)
    }
    if (!this.searchForm.value.StrCodes) {
      this.searchForm.value.StrCodes = ''
    }
    const queryStr = '&CategoryIdStr=' + this.CategoryIdStr +
     '&PackingTypeId=' + this.PackingTypeId + '&ItemTypeId=' +
      this.ItemTypeId + '&TaxSlabId=' + this.TaxSlabId + '&UnitId=' + this.UnitId
      + '&StrCodes=' + this.searchForm.value.StrCodes
    this._itemmasterServices.setSearchQueryParamsStr(queryStr)
  }

}
