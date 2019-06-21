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
@Component({
  selector: 'app-balance-sheet-search',
  templateUrl: './balance-sheet-search.component.html',
  styleUrls: ['./balance-sheet-search.component.css']
})
export class BalanceSheetSearchComponent implements OnInit {
  @Input() toShow: boolean = false
  clientDateFormat: any
  subscribe: Subscription
  constructor (public _globalService: GlobalService,
    public _settings: Settings,public _commonService: CommonService, public _toastrCustomService: ToastrCustomService) {
    this.clientDateFormat = this._settings.dateFormat
    this.toDate()
  }
 
  fromDatevalue: string
  toDateValue: string =''
  toDate () {
    let _self = this
    jQuery(function ($) {
      flatpickr('#to-date', {
        dateFormat: _self.clientDateFormat,
        defaultDate: [_self._globalService.getDefaultDate(_self.clientDateFormat)]
      })
    })
    this.toDateValue = _self._globalService.getDefaultDate(_self.clientDateFormat)
    //console.log(this.toDateValue ,'date--->>')

  }
  ngOnInit () {
    this._commonService.searchByDateForBalancesheet( this.toDateValue)

    $(document).ready(function () {
      $('.table_challan').tableHeadFixer({
        head: true,
        foot: true
      })
    })
  }
  DueDateChngae: any
  onChange(event ){
    let date 
    if(event.target.value){
       date = event.target.value
    }
    else{
      date = this.toDateValue
    }
     this.DueDateChngae = this._globalService.clientToSqlDateFormat(date, this.clientDateFormat)
    this._commonService.searchByDateForBalancesheet( this.DueDateChngae)
 }



 


}
