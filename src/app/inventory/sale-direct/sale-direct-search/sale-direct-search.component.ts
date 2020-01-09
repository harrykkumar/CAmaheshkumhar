import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Select2OptionData, Select2Component } from 'ng2-select2';
import { UIConstant } from 'src/app/shared/constants/ui-constant';
import { VendorServices } from '../../../commonServices/TransactionMaster/vendoer-master.services';
import { Settings } from '../../../shared/constants/settings.constant';
import { SaleDirectService } from '../saleDirectService.service';
import { GlobalService } from '../../../commonServices/global.service';
import { DependencyCheck } from '../../../shared/validators/dependencyCheck';
import { DatepickerComponent } from '../../../shared/datepicker/datepicker.component';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
import { Subscription, fromEvent, throwError } from 'rxjs';

declare const $: any
@Component({
  selector: 'app-sale-direct-search',
  templateUrl: './sale-direct-search.component.html',
  styleUrls: ['./sale-direct-search.component.css']
})
export class SaleDirectSearchComponent {
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
  redirectData:Subscription
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
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.toShow && changes.toShow.currentValue) {
      setTimeout(() => {
        this.fromdate.toggleView()
      }, 10)
    }
  }
  @Input() toShow: boolean = false
  searchForm: FormGroup
  dataStatus: any = []
  queryStr:any=''
  constructor(public _commonService:CommonService,private formBuilder: FormBuilder, private _ledgerServices: VendorServices,
    private settings: Settings, private _saleDirectService: SaleDirectService, private gs: GlobalService) { 

      // this.redirectData = this._commonService.reDirectPrintSaleStatus().subscribe(
      //   (action: any) => {
      //     alert(8888)
      //   //   this.searchForm.controls.FromDate.setValue(action.fromDate)
      //   //  this.searchForm.controls.ToDate.setValue(action.toDate)
      //   //   this.search()
          
      //   }
      // )
      // this.redirectData = this._commonService.reDirectViewListOfSaleStatus().subscribe(
      //   (action: any) => {
      //     alert(5)
      //     this.searchForm.value.FromDate = action.fromDate
      //     this.searchForm.value.ToDate= action.toDate
      //     //this.queryStr =  "&FromDate="+ action.fromDate+"&ToDate="+action.toDate
      //     this.search()
      //   }
      // )

    }
  @ViewChild('ledger_select2') ledgerSelect2: Select2Component
  ngOnInit() {
    this.dataValues = [
      { id: '0', text: 'Bill Date' },
    ]
    this.dataStatus = [
      { id: '0', text: 'Running' },
      { id: '1', text: 'Cancelled' },
    ]
    this.createForm()
    this.getSuplier()
    this.getCountryList()
  }
  ngOnDestroy() {
    //this.redirectData.unsubscribe()

  }
  createForm() {
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
  StausType: number = 0
  getSuplier() {
    this.supplierPlaceHolder = { placeholder: 'Select Customer' }
    let newData = [{ id: '0', text: 'Select Customer' }]
    this._ledgerServices.getVendor(5, '').subscribe(data => {
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

  getCountryList() {
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

  selectCountry(evt) {
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

  getStateList(id) {
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

  selectState(evt) {
    if (evt.value && evt.data.length > 0) {
      if (+evt.value > 0) {
        this.StateId = +evt.value
        this.getCitylist(+evt.value)
      } else {
        this.cityListSelect2 = []
      }
    }
  }
  getCitylist(id) {
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
  selectCity(evt) {
    if (evt.value && evt.data.length > 0) {
      if (+evt.value > 0) {
        this.CityId = +evt.value
      }
    }
  }
  getValue (evt){
  }

  search() {
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
      const queryStr =  '&Status=' + this.StausType + '&DateType=' + this.DateType +
        '&FromDate=' + fromDate +
        '&ToDate=' + toDate +
        '&FromAmount=' + +this.searchForm.value.FromAmount +
        '&ToAmount=' + +this.searchForm.value.ToAmount +
        '&LedgerId=' + this.LedgerId +
        '&CountryId=' + this.CountryId + '&StateId=' + this.StateId + '&CityId=' + this.CityId
      this._saleDirectService.setSearchQueryParamsStr(queryStr)
    }
  }
  StausValue :any
  resetSearch() {
    this.CountryId = 0
    this.StateId = 0
    this.CityId = 0
    this.countryValue = 0
    this.stateValue = 0
    this.cityValue = 0
    this.dateValue = 0
    this.ledgerValue = 0
    this.StausValue=0
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
    const queryStr = '&Status=' + this.StausType + '&DateType=' + this.DateType +
      '&FromDate=' + '' +
      '&ToDate=' + '' +
      '&FromAmount=' + 0 +
      '&ToAmount=' + 0 +
      '&LedgerId=' + this.LedgerId +
      '&CountryId=' + this.CountryId + '&StateId=' + this.StateId + '&CityId=' + this.CityId
    this._saleDirectService.setSearchQueryParamsStr(queryStr)
  }

  setToDate (evt) {
    this.searchForm.controls.ToDate.setValue(evt)
    if (this.searchForm.value.FromDate && this.searchForm.value.ToDate) {
      if (!this.gs.compareDate(this.searchForm.value.ToDate, this.searchForm.value.FromDate)) {
        this.searchForm.controls.ToDate.setValue('')
        // console.log(this.searchForm.value.ToDate)
        //this.searchForm.value.FromDate
      }
    }
  }

  setFromDate (evt) {
    this.searchForm.controls.FromDate.setValue(evt)
    if (this.searchForm.value.FromDate && this.searchForm.value.ToDate) {
      if (!this.gs.compareDate(this.searchForm.value.ToDate, this.searchForm.value.FromDate)) {
        this.searchForm.controls.ToDate.setValue(evt)
      }
    } else {
      this.searchForm.controls.ToDate.setValue(evt)
    }
  }

  checkForValidAmount() {
    if (+this.searchForm.value.FromAmount > 0 && +this.searchForm.value.ToAmount > 0) {
      if (+this.searchForm.value.FromAmount > +this.searchForm.value.ToAmount) {
        this.searchForm.controls.ToAmount.setValue(+this.searchForm.value.FromAmount)
      }
    } else {
      if (+this.searchForm.value.FromAmount > 0) {
        this.searchForm.controls.ToAmount.setValue(+this.searchForm.value.FromAmount)
      } else if (+this.searchForm.value.ToAmount > 0) {
        // this.searchForm.controls.FromAmount.setValue(+this.searchForm.value.ToAmount)
      } else {
        this.searchForm.controls.ToAmount.setValue(0)
        this.searchForm.controls.FromAmount.setValue(0)
      }
    }
  }
}
