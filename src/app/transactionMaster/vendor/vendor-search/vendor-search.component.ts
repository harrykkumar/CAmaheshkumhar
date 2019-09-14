import { Component, Input, ViewChild, SimpleChanges, OnChanges } from '@angular/core'
import { Select2OptionData, Select2Component } from 'ng2-select2'
import { VendorServices } from '../../../commonServices/TransactionMaster/vendoer-master.services'
import { UIConstant } from '../../../shared/constants/ui-constant'
import { FormGroup, FormBuilder } from '@angular/forms'
@Component({
  selector: 'app-vendor-search',
  templateUrl: './vendor-search.component.html',
  styleUrls: ['./vendor-search.component.css']
})
export class VendorSearchComponent implements OnChanges {
  ngOnChanges (changes: SimpleChanges): void {
    // console.log(changes)
    if (changes.toShow && changes.toShow.currentValue) {
      setTimeout(() => {
        const element = this.custRTypeSelect2.selector.nativeElement
        element.focus({ preventScroll: false })
      }, 10)
    }
  }
  @Input() toShow: boolean = false
  custRegTypePlaceholder: Select2Options
  countryPlaceholder: Select2Options
  stateListPlaceHolder: Select2Options
  cityListPlaceHolder: Select2Options
  areaListPlaceHolder: Select2Options

  custRegTypeSelect2: Array<Select2OptionData> = []
  countryListSelect2: Array<Select2OptionData> = []
  stateListSelect2: Array<Select2OptionData> = []
  cityListSelect2: Array<Select2OptionData> = []
  areaListSelect2: Array<Select2OptionData> = []

  CountryId: number = 0
  StateId: number = 0
  CityId: number = 0
  RegistrationTypeId: number = 0

  customerRegValue: number = 0
  countryValue: number = 0
  stateValue: number = 0
  cityValue: number = 0
  areaValue: number = 0
  searchForm: FormGroup
  constructor (private ledgerService: VendorServices, private formBuilder: FormBuilder) {
    this.select2VendorValue()
    this.getCountryList()
    this.createForm()
  }

  createForm () {
    this.searchForm = this.formBuilder.group({
      'StrLedger': ['']
    })
  }

  select2VendorValue () {
    this.custRegTypePlaceholder = { placeholder: 'Select Customer Registration' }
    this.custRegTypeSelect2 = [{ id: '0', text: 'select Customer' }, { id: '1', text: 'Regular' }
      , { id: '2', text: 'Composition' }, { id: '3', text: 'Exempted' }
      , { id: '4', text: 'UnRegistered' }, { id: '5', text: '	E-Commerce Operator ' }]
  }

  selectCustRegType (evt) {
    if (evt.value && evt.data.length > 0) {
      this.RegistrationTypeId = +evt.value
    }
  }

  getCountryList () {
    this.countryPlaceholder = { placeholder: 'Select Country' }
    let newData = [{ id: '0', text: 'Select Country' }]
    this.ledgerService.getCommonValues('101').subscribe(data => {
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        if (data.Data.length > 0) {
          data.Data.forEach(element => {
            newData.push({
              id: element.Id,
              text: element.CommonDesc
            })
          })
        }
        this.countryListSelect2 = Object.assign([], newData)
      }
    })
  }

  selectCountry (evt) {
    if (evt.value && evt.data.length > 0) {
      if (+evt.value > 0) {
        this.CountryId = +evt.value
        this.getStateList(+evt.value)
      } else {
        this.stateListSelect2 = []
        this.cityListSelect2 = []
        this.areaListSelect2 = []
      }
    }
  }

  getStateList (id) {
    this.stateListPlaceHolder = { placeholder: 'Select State' }
    let newData = [{ id: '0', text: 'select State' }]
    this.ledgerService.gatStateList(id).subscribe(data => {
      console.log('state list : ', data)
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        if (data.Data.length > 0) {
          data.Data.forEach(element => {
            newData.push({
              id: element.Id,
              text: element.CommonDesc1
            })
          })
        }
      }
      this.stateListSelect2 = Object.assign([], newData)
    })
  }

  selectState (evt) {
    if (evt.value && evt.data.length > 0) {
      if (+evt.value > 0) {
        this.StateId = +evt.value
        this.getCitylist(+evt.value)
      } else {
        this.cityListSelect2 = []
        this.areaListSelect2 = []
      }
    }
  }
  getCitylist (id) {
    this.cityListPlaceHolder = { placeholder: 'Select City' }
    let newData = [{ id: '0', text: 'select City' }]
    this.ledgerService.getCityList(id).subscribe(data => {
      console.log('city list : ', data)
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        if (data.Data.length > 0) {
          data.Data.forEach(element => {
            newData.push({
              id: element.Id,
              text: element.CommonDesc2
            })
          })
        }
        this.cityListSelect2 = Object.assign([], newData)
      }
    })
  }

  selectCity (evt) {
    if (evt.value && evt.data.length > 0) {
      if (+evt.value > 0) {
        this.CityId = +evt.value
        this.getAreaList(+evt.value)
      } else {
        this.areaListSelect2 = []
      }
    }
  }

  getAreaList (id) {
    this.areaListPlaceHolder = { placeholder: 'Select Area' }
    let newData = [{ id: '0', text: 'Select Area' }]
    this.ledgerService.getAreaList(id).subscribe(data => {
      console.log('area list : ', data)
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        if (data.Data.length > 0) {
          data.Data.forEach(element => {
            newData.push({
              id: element.Id,
              text: element.CommonDesc3
            })
          })
        }
        this.areaListSelect2 = Object.assign([], newData)
      }
    })
  }

  selectedArea (evt) {
    if (evt.value && evt.data.length > 0) {
      if (+evt.value > 0) {
        this.getAreaList(+evt.value)
      } else {
        // this.areaListSelect2 = []
      }
    }
  }

  search () {
    if (!this.RegistrationTypeId) {
      this.RegistrationTypeId = 0
    }
    if (!this.CountryId) {
      this.CountryId = 0
    }
    if (!this.StateId) {
      this.StateId = 0
    }
    if (!this.CityId) {
      this.CityId = 0
    }
    if (!this.searchForm.value.StrLedger) {
      this.searchForm.value.StrLedger = ''
    }
    const queryStr = '&RegistrationTypeId=' + this.RegistrationTypeId +
     '&CountryId=' +
      this.CountryId + '&StateId=' + this.StateId + '&CityId=' + this.CityId
      + '&StrLedger=' + this.searchForm.value.StrLedger
    this.ledgerService.setSearchQueryParamsStr(queryStr)
  }

  @ViewChild('custRTypeSelect2') custRTypeSelect2: Select2Component
  @ViewChild('custTSelect2') custTSelect2: Select2Component
  @ViewChild('countrySelect2') countrySelect2: Select2Component
  @ViewChild('stateSelect2') stateSelect2: Select2Component
  @ViewChild('citySelect2') citySelect2: Select2Component
  @ViewChild('areaSelect2') areaSelect2: Select2Component
  resetSearch () {
    this.CountryId = 0
    this.StateId = 0
    this.CityId = 0
    this.RegistrationTypeId = 0

    this.customerRegValue = 0
    this.countryValue = 0
    this.stateValue = 0
    this.cityValue = 0
    this.areaValue = 0
    this.searchForm.reset()
    if (this.custRTypeSelect2) {
      this.custRTypeSelect2.setElementValue(0)
    }
    if (this.custTSelect2) {
      this.custTSelect2.setElementValue(0)
    }
    if (this.countrySelect2) {
      this.countrySelect2.setElementValue(0)
    }
    if (this.stateSelect2) {
      this.stateSelect2.setElementValue(0)
    }
    if (this.citySelect2) {
      this.citySelect2.setElementValue(0)
    }
    if (this.areaSelect2) {
      this.areaSelect2.setElementValue(0)
    }
    const queryStr = '&RegistrationTypeId=' + this.RegistrationTypeId +
    '&CountryId=' +
     this.CountryId + '&StateId=' + this.StateId + '&CityId=' + this.CityId
     + '&StrLedger=' + this.searchForm.value.StrLedger
    this.ledgerService.setSearchQueryParamsStr(queryStr)
  }
}
