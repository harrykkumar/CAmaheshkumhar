import { Component, Input, ViewChild, SimpleChanges, ElementRef } from '@angular/core';
import { Select2OptionData, Select2Component } from 'ng2-select2';
import { FormGroup, FormBuilder } from '@angular/forms';
import { VendorServices } from 'src/app/commonServices/TransactionMaster/vendoer-master.services';
import { GlobalService } from 'src/app/commonServices/global.service';
import { DependencyCheck } from 'src/app/shared/validators/dependencyCheck';
import { UIConstant } from 'src/app/shared/constants/ui-constant';
import { Settings } from '../../../shared/constants/settings.constant';
import { filter, map } from 'rxjs/operators';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs';
import { SalesCourierParcelServices } from '../../sale-courier-parcel.services';
import { CommonService } from '../../../commonServices/commanmaster/common.services';
import { AddCust } from '../../../model/sales-tracker.model';
import { Subscription } from 'rxjs/Subscription';
import { DatepickerComponent } from '../../../shared/datepicker/datepicker.component';
declare const $: any
declare const flatpickr: any
@Component({
  selector: 'app-sales-search',
  templateUrl: './sales-search.component.html',
  styleUrls: ['./sales-search.component.css']
})
export class SalesSearchComponent {
  @Input() toShow: boolean = false
  countryPlaceholder: Select2Options
  stateListPlaceHolder: Select2Options
  cityListPlaceHolder: Select2Options

  countryListSelect2: Array<Select2OptionData> = []
  stateListSelect2: Array<Select2OptionData> = []
  cityListSelect2: Array<Select2OptionData> = []
  senderListSelect2: Array<Select2OptionData> = []
  recieverListSelect2: Array<Select2OptionData> = []
  parcelByListSelect2: Array<Select2OptionData> = []
  destinationListSelect2: Array<Select2OptionData> = []
  billStatusListSelect2: Array<Select2OptionData> = []

  CountryId: number = 0
  StateId: number = 0
  CityId: number = 0

  countryValue: number = 0
  stateValue: number = 0
  cityValue: number = 0
  parcelByValue: number = 0
  destValue: number = 0
  recieverValue: number = 0
  senderValue: number = 0
  billStatusValue: number = 0

  ParcelBy: number = 0
  Destination: number = 0
  ReceiverId: number = 0
  LedgerId: number = 0
  BillStatus: number = 0
  newCustAddSub: Subscription
  newVendAddSub: Subscription
  @ViewChild('fromdate') fromdate: DatepickerComponent
  ngOnChanges (changes: SimpleChanges): void {
    if (changes.toShow && changes.toShow.currentValue) {
      setTimeout(() => {
        this.fromdate.toggleView()
      }, 10)
    }
  }
  searchForm: FormGroup
  @ViewChild('parcelby_select2') parcelbySelect2: Select2Component
  @ViewChild('dest_select2') destSelect2: Select2Component
  @ViewChild('sender_select2') senderSelect2: Select2Component
  @ViewChild('reciever_select2') recieverSelect2: Select2Component
  @ViewChild('billstatus_select2') billstatusSelect2: Select2Component
  constructor (private formBuilder: FormBuilder, private _ledgerServices: VendorServices,
    private settings: Settings, private gs: GlobalService,
    private saleService: SalesCourierParcelServices, private commonService: CommonService) {}
  ngOnInit () {
    this.newCustAddSub = this.commonService.getCustStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.senderListSelect2)
          newData.push({ id: data.id, text: data.name })
          this.senderListSelect2 = newData
        }
      }
    )
    this.newVendAddSub = this.commonService.getVendStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.recieverListSelect2)
          newData.push({ id: data.id, text: data.name })
          this.recieverListSelect2 = newData
        }
      }
    )
    this.billStatusListSelect2 = [
      { id: '0', text: 'Select Bill Status' },
      { id: '-1', text: 'Cancel' },
      { id: '1', text: 'Running' },
      { id: '2', text: 'Return' }
    ]
    this.createForm()
    this.getSenderList()
    this.getRecieverList()
    this.getParcelByList()
    this.getDestinationsList()
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
  getSenderList () {
    let newData = [{ id: '0', text: 'Select Sender' }]
    this._ledgerServices.getVendor(5, '').pipe(
      filter(data => {
        if (data.Code === UIConstant.THOUSAND) {
          return data.Data
        } else {
          throw new Error (data.Description)
        }
      }),
      catchError(error => {
        return throwError(error)
      }),
      map(data => data.Data),
      map(data => {
        if (data.length > 0) {
          data.forEach(element => {
            newData.push({
              id: element.Id,
              text: element.Name
            })
          })
        }
        return newData
      })
    ).subscribe(data => {
      // console.log('sender data : ', data)
      this.saleService.setSendersList([...data])
      this.senderListSelect2 = Object.assign([], data)
      }
    )
  }

  getRecieverList () {
    let newData = [{ id: '0', text: 'Select Reciever' }]
    this._ledgerServices.getVendor(4, '').pipe(
      filter(data => {
        if (data.Code === UIConstant.THOUSAND) {
          return data.Data
        } else {
          throw new Error (data.Description)
        }
      }),
      catchError(error => {
        return throwError(error)
      }),
      map(data => data.Data),
      map(data => {
        if (data.length > 0) {
          data.forEach(element => {
            newData.push({
              id: element.Id,
              text: element.Name
            })
          })
        }
        return newData
      })
    ).subscribe(data => {
      // console.log('Reciever data : ', data)
      this.saleService.setRecieversList([...data])
      this.recieverListSelect2 = Object.assign([], data)
      }
    )
  }

  getDestinationsList () {
    this.countryPlaceholder = { placeholder: 'Select Country' }
    let newData1 = [{ id: '0', text: 'Select Country' }]
    let newData = [{ id: '0', text: 'Select Destination' }]
    this.commonService.getCountryList().pipe(
      filter(data => {
        if (data.Code === UIConstant.THOUSAND) {
          return data.Data
        } else {
          throw new Error (data.Description)
        }
      }),
      catchError(error => {
        return throwError(error)
      }),
      map(data => data.Data),
      map(data => {
        if (data.length > 0) {
          data.forEach(element => {
            newData.push({
              id: element.Id,
              text: element.CommonDesc
            })
            newData1.push({
              id: element.Id,
              text: element.CommonDesc
            })
          })
        }
        return newData
      })
    ).subscribe(data => {
      // console.log('Destination data : ', data)
      this.saleService.setDestinationsList(data)
      this.destinationListSelect2 = Object.assign([], data)
      this.countryListSelect2 = Object.assign([], newData1)
      }
    )
  }

  getParcelByList () {
    let newData = [{ id: '0', text: 'Select Parcel By' }]
    this.saleService.getParcelByList().pipe(
      filter(data => {
        if (data.Code === UIConstant.THOUSAND) {
          return data.Data
        } else {
          throw new Error (data.Description)
        }
      }),
      catchError(error => {
        return throwError(error)
      }),
      map(data => data.Data),
      map(data => {
        if (data.length > 0) {
          data.forEach(element => {
            newData.push({
              id: element.Id,
              text: element.CommonDesc
            })
          })
        }
        return newData
      })
    ).subscribe(data => {
      console.log('Parcel By data : ', data)
      this.saleService.setParcelByList(data)
      this.parcelByListSelect2 = Object.assign([], data)
      }
    )
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
      if (!this.ParcelBy) {
        this.ParcelBy = 0
      }
      if (!this.Destination) {
        this.Destination = 0
      }
      if (!this.ReceiverId) {
        this.ReceiverId = 0
      }
      if (!this.LedgerId) {
        this.LedgerId = 0
      }
      if (!this.BillStatus) {
        this.BillStatus = 0
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
      const queryStr =
      '&ParcelBy=' + +this.ParcelBy +
      '&Destination=' + +this.Destination +
      '&ReceiverId=' + +this.ReceiverId +
      '&BillStatus=' + +this.BillStatus +
       '&FromDate=' + fromDate + 
       '&ToDate=' + toDate + 
       '&FromAmount=' + +this.searchForm.value.FromAmount + 
       '&ToAmount=' + +this.searchForm.value.ToAmount + 
       '&LedgerId=' + this.LedgerId + 
       '&CountryId=' + this.CountryId + '&StateId=' + this.StateId + '&CityId=' + this.CityId
      this.saleService.setSearchQueryParamsStr(queryStr)
    }
  }

  resetSearch () {
    this.CountryId = 0
    this.StateId = 0
    this.CityId = 0
    this.ParcelBy = 0
    this.Destination = 0
    this.ReceiverId = 0
    this.LedgerId = 0
    this.BillStatus = 0

    this.countryValue = 0
    this.stateValue = 0
    this.cityValue = 0
    this.parcelByValue = 0
    this.destValue = 0
    this.recieverValue = 0
    this.senderValue = 0
    this.billStatusValue = 0
  
   
    this.LedgerId = 0
    this.searchForm.reset()
    if (this.parcelbySelect2) {
      this.parcelbySelect2.setElementValue(0)
    }
    if (this.destSelect2) {
      this.destSelect2.setElementValue(0)
    }
    if (this.senderSelect2) {
      this.senderSelect2.setElementValue(0)
    }
    if (this.recieverSelect2) {
      this.recieverSelect2.setElementValue(0)
    }
    if (this.billstatusSelect2) {
      this.billstatusSelect2.setElementValue(0)
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

    const queryStr = 
    '&ParcelBy=' + this.ParcelBy +
    '&Destination=' + this.Destination +
    '&ReceiverId=' + this.ReceiverId +
    '&BillStatus=' + this.BillStatus +
    '&FromDate=' + '' + 
    '&ToDate=' + '' + 
    '&FromAmount=' + 0 + 
    '&ToAmount=' + 0 + 
    '&LedgerId=' + this.LedgerId + 
    '&CountryId=' + this.CountryId + '&StateId=' + this.StateId + '&CityId=' + this.CityId
    this.saleService.setSearchQueryParamsStr(queryStr)
  }

  setToDate (evt) {
    this.searchForm.controls.ToDate.setValue(evt)
  }

  setFromDate (evt) {
    this.searchForm.controls.FromDate.setValue(evt)
  }
}
