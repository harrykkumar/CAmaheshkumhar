import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Select2OptionData, Select2Component } from 'ng2-select2';
import { UIConstant } from 'src/app/shared/constants/ui-constant';
import { VendorServices } from '../../../commonServices/TransactionMaster/vendoer-master.services';
import { Settings } from '../../../shared/constants/settings.constant';
import { serviceBillingService } from '../serviceBilling.service';
import { GlobalService } from '../../../commonServices/global.service';
import { DependencyCheck } from '../../../shared/validators/dependencyCheck';
import { DatepickerComponent } from '../../../shared/datepicker/datepicker.component';
declare const $: any
@Component({
  selector: 'app-serviceBilling-search',
  templateUrl: './serviceBilling-search.component.html',
  styleUrls: ['./serviceBilling-search.component.css']
})
export class serviceBillingSearchComponent {
  countryPlaceholder: Select2Options
  stateListPlaceHolder: Select2Options
  cityListPlaceHolder: Select2Options

  countryListSelect2: Array<Select2OptionData> = []
  stateListSelect2: Array<Select2OptionData> = []
  cityListSelect2: Array<Select2OptionData> = []
  suplierNameSelect2: Array<Select2OptionData> = []

  CountryId: number = 0
  StateId: number = 0
  CityId: number = 0

  countryValue: number = 0
  stateValue: number = 0
  cityValue: number = 0
  dateValue: number = 0
  ledgerValue: number = 0

  DateType: number = 0
  LedgerId: number = 0
  dataValues: Array<Select2OptionData> = []
  @ViewChild('date_select2') dateSelect2: Select2Component
  isValid: boolean = true
  @ViewChild('fromdate') fromdate: DatepickerComponent
  ngOnChanges (changes: SimpleChanges): void {
    if (changes.toShow && changes.toShow.currentValue) {
      setTimeout(() => {
        this.fromdate.toggleView()
      }, 10)
    }
  }
  @Input() toShow: boolean = false
  searchForm: FormGroup

  constructor (private formBuilder: FormBuilder, private _ledgerServices: VendorServices,
    private settings: Settings, private purchaseService: serviceBillingService, private gs: GlobalService) {}
  @ViewChild('ledger_select2') ledgerSelect2: Select2Component
  ngOnInit () {
    this.dataValues = [
      {id: '0', text: 'Bill Date'},
      {id: '1', text: 'Party Bill Date'}
    ]
    this.createForm()
    this.getSuplier()
    this.getCountryList()
  }

  createForm () {
    this.searchForm = this.formBuilder.group({
      'FromDate': [''],
      'ToDate': [''],
      'FromAmount': [''],
      'ToAmount': ['']
    },
    {
      validator: [DependencyCheck('FromDate', 'ToDate', 'date'), DependencyCheck('FromAmount', 'ToAmount', 'amount')]
    })
  }
  get f() { return this.searchForm.controls; }
  supplierPlaceHolder: Select2Options
  supplierValue: any
  getSuplier () {
    this.supplierPlaceHolder = { placeholder: 'Select Supplier' }
    let newData = [{ id: '0', text: 'Select Supplier' }]
    this._ledgerServices.getVendor(4, '').subscribe(data => {
      // console.log('supplier data : ', data)
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        if (data.Data.length > 0) {
          data.Data.forEach(element => {
            newData.push({
              id: element.Id,
              text: element.Name
            })
          })
        }
        this.suplierNameSelect2 = Object.assign([], newData)
      }
    })
  }

  getCountryList () {
    this.countryPlaceholder = { placeholder: 'Select Country' }
    let newData = [{ id: '0', text: 'Select Country' }]
    this._ledgerServices.getCommonValues('101').subscribe(data => {
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
      }
    }
  }

  getStateList (id) {
    this.stateListPlaceHolder = { placeholder: 'Select State' }
    let newData = [{ id: '0', text: 'select State' }]
    this._ledgerServices.gatStateList(id).subscribe(data => {
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
      }
    }
  }
  getCitylist (id) {
    this.cityListPlaceHolder = { placeholder: 'Select City' }
    let newData = [{ id: '0', text: 'select City' }]
    this._ledgerServices.getCityList(id).subscribe(data => {
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

  @ViewChild('countrySelect2') countrySelect2: Select2Component
  @ViewChild('stateSelect2') stateSelect2: Select2Component
  @ViewChild('citySelect2') citySelect2: Select2Component
  selectCity (evt) {
    if (evt.value && evt.data.length > 0) {
      if (+evt.value > 0) {
        this.CityId = +evt.value
      }
    }
  }

  search () {
    if (this.searchForm.valid) {
      let fromDate = ''
      let toDate = ''
      if (!this.CountryId) {
        this.CountryId = 0
      }
      if (!this.StateId) {
        this.StateId = 0
      }
      if (!this.CityId) {
        this.CityId = 0
      }
      if (!this.searchForm.value.FromDate) {
        fromDate = ''
      } else {
        fromDate = JSON.parse(JSON.stringify(this.gs.clientToSqlDateFormat(this.searchForm.value.FromDate, this.settings.dateFormat)))
      }
      if (!this.searchForm.value.ToDate) {
        toDate = ''
      } else {
        toDate = JSON.parse(JSON.stringify(this.gs.clientToSqlDateFormat(this.searchForm.value.ToDate, this.settings.dateFormat)))
      }
      if (!this.searchForm.value.ToDate) {
        this.searchForm.value.ToDate = ''
      }
      if (!this.searchForm.value.FromAmount) {
        this.searchForm.value.FromAmount = 0
      }
      if (!this.searchForm.value.ToAmount) {
        this.searchForm.value.ToAmount = 0
      }
      const queryStr = '&DateType=' + this.DateType +
       '&FromDate=' + fromDate + 
       '&ToDate=' + toDate + 
       '&FromAmount=' + +this.searchForm.value.FromAmount + 
       '&ToAmount=' + +this.searchForm.value.ToAmount + 
       '&LedgerId=' + this.LedgerId + 
       '&CountryId=' + this.CountryId + '&StateId=' + this.StateId + '&CityId=' + this.CityId
      this.purchaseService.setSearchQueryParamsStr(queryStr)
    }
  }

  resetSearch () {
    this.CountryId = 0
    this.StateId = 0
    this.CityId = 0
  
    this.countryValue = 0
    this.stateValue = 0
    this.cityValue = 0
    this.dateValue = 0
    this.ledgerValue = 0
  
    this.DateType = 0
    this.LedgerId = 0
    this.searchForm.reset()
    this.searchForm.controls.FromDate.setValue('')
    this.searchForm.controls.ToDate.setValue('')
    if (this.ledgerSelect2) {
      this.ledgerSelect2.setElementValue(0)
    }
    if (this.dateSelect2) {
      this.dateSelect2.setElementValue(0)
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
    const queryStr = '&DateType=' + this.DateType +
    '&FromDate=' + '' + 
    '&ToDate=' + '' + 
    '&FromAmount=' + 0 + 
    '&ToAmount=' + 0 + 
    '&LedgerId=' + this.LedgerId + 
    '&CountryId=' + this.CountryId + '&StateId=' + this.StateId + '&CityId=' + this.CityId
   this.purchaseService.setSearchQueryParamsStr(queryStr)
  }

  setToDate (evt) {
    this.searchForm.controls.ToDate.setValue(evt)
  }

  setFromDate (evt) {
    this.searchForm.controls.FromDate.setValue(evt)
  }
}
