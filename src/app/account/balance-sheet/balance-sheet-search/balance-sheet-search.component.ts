import { Component, Input, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { FormGroup } from '@angular/forms'
import { UIConstant } from '../../../shared/constants/ui-constant'
declare var $: any
declare var flatpickr: any
import { CommonService } from '../../../commonServices/commanmaster/common.services'
import { ToastrCustomService } from '../../../commonServices/toastr.service'
import { GlobalService } from '../../../commonServices/global.service'
import { Settings } from '../../../shared/constants/settings.constant'
import { SetUpIds } from 'src/app/shared/constants/setupIds.constant'

@Component({
  selector: 'app-balance-sheet-search',
  templateUrl: './balance-sheet-search.component.html',
  styleUrls: ['./balance-sheet-search.component.css']
})
export class BalanceSheetSearchComponent implements OnInit {
  @Input() toShow: boolean = false
  clientDateFormat: any
  subscribe: Subscription
  constructor(public _globalService: GlobalService,
    public _settings: Settings, public _commonService: CommonService, public _toastrCustomService: ToastrCustomService) {
      this.getModuleSettingValue = JSON.parse(this._settings.moduleSettings)
    this.getModuleSettingData()
    this.toDate()
    this.fromDate()

  }

  fromDateValue: string
  toDateValue: string
  fromDate() {
    this.fromDateValue = this._globalService.getDefaultDate(this.clientDateFormat)

  }
  toDate() {
    this.toDateValue = this._globalService.getDefaultDate(this.clientDateFormat)
  }

  ngOnInit() {

    this._commonService.searchByDateForBalancesheet(this.toDateValue, this.fromDateValue)
    
    this._commonService.fixTableHF('table_challan')

  }
  toDateChngae: any
  fromDateChange: any
  getModuleSettingValue: any
  getModuleSettingData() {
    if (this.getModuleSettingValue.settings.length > 0) {
      this.getModuleSettingValue.settings.forEach(ele => {
        if (ele.id === SetUpIds.dateFormat) {
          this.clientDateFormat = ele.val[0].Val
        }
      })
    }
  }
  searchItemButton() {

    if (this.toDateValue !== '') {
      this.toDateChngae = this._globalService.clientToSqlDateFormat(this.toDateValue, this.clientDateFormat)
    }
    else {
      this.toDateChngae = ''
    }
    if (this.fromDateValue !== '') {
      this.fromDateChange = this._globalService.clientToSqlDateFormat(this.fromDateValue, this.clientDateFormat)
    }
    else {
      this.fromDateChange = ''
    }
    this._commonService.searchByDateForBalancesheet(this.toDateChngae, this.fromDateChange)
  }



}
