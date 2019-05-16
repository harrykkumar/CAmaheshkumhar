import { Component, Input, ViewChild, SimpleChanges } from '@angular/core'
import { FormGroup, FormBuilder } from '@angular/forms'
import { Select2OptionData, Select2Component } from 'ng2-select2'
import { UnitMasterServices } from 'src/app/commonServices/TransactionMaster/unit-mater.services'
import { ItemmasterServices } from 'src/app/commonServices/TransactionMaster/item-master.services'
import { UIConstant } from 'src/app/shared/constants/ui-constant'

@Component({
  selector: 'app-route-search',
  templateUrl: './route-search.component.html'
})
export class RouteSearchComponent {
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
  categoryPlaceHolder: Select2Options
  taxTypePlaceHolder: Select2Options
  selectUnitType: Array<Select2OptionData>
  selectItemTpye: Array<Select2OptionData>
  categoryType: Array<Select2OptionData>
  selectTax: Array<Select2OptionData>
  UnitId: number
  CategoryIdStr: string
  TaxSlabId: number

  taxValue = 0
  unitTypeValue = 0
  cateGoryValue = ''
  constructor (private formBuilder: FormBuilder,
    private unitMasterService: UnitMasterServices,
    private _itemmasterServices: ItemmasterServices) {
    this.getUnitTypeDetail()
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
    '&TaxSlabId=' + this.TaxSlabId + '&UnitId=' + this.UnitId
    this._itemmasterServices.setSearchQueryParamsStr(queryStr)
  }

  resetSearch () {
    this.UnitId = 0
    this.CategoryIdStr = ''
    this.TaxSlabId = 0

    this.taxValue = 0
    this.unitTypeValue = 0
    this.cateGoryValue = ''
    this.searchForm.reset()
    if (this.catSelect2) {
      this.catSelect2.setElementValue(0)
    }
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
    const queryStr = '&CategoryIdStr=' + this.CategoryIdStr +
    '&TaxSlabId=' + this.TaxSlabId + '&UnitId=' + this.UnitId
    this._itemmasterServices.setSearchQueryParamsStr(queryStr)
  }
}
