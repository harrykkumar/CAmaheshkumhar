import { Component, ViewChild, SimpleChanges, Input } from '@angular/core';
import { DatepickerComponent } from '../../shared/datepicker/datepicker.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Settings } from '../../shared/constants/settings.constant';
import { ManualStockService } from '../manual-stock.service';
import { DependencyCheck } from '../../shared/validators/dependencyCheck';
import { GlobalService } from '../../commonServices/global.service';
@Component({
  selector: 'manual-stock-search',
  templateUrl: './manual-stock-search.component.html'
})
export class ManualStockSearchComponent {
  @ViewChild('first') first: DatepickerComponent
  ngOnChanges (changes: SimpleChanges): void {
    if (changes.toShow && changes.toShow.currentValue) {
      setTimeout(() => {
        this.first.toggleView()
      }, 10)
    }
  }
  @Input() toShow: boolean = false
  searchForm: FormGroup

  constructor (private formBuilder: FormBuilder, private _ms: ManualStockService,
    private settings: Settings, private _gs: GlobalService) {}
  ngOnInit () {
    this.createForm()
  }

  createForm () {
    this.searchForm = this.formBuilder.group({
      'FromDate': [''],
      'ToDate': ['']
    },
    {
      validator: [DependencyCheck('FromDate', 'ToDate', 'date')]
    })
  }
  get f() { return this.searchForm.controls; }

  search () {
    if (this.searchForm.valid) {
      let fromDate = ''
      let toDate = ''
      if (!this.searchForm.value.FromDate) {
        fromDate = ''
      } else {
        fromDate = JSON.parse(JSON.stringify(this._gs.clientToSqlDateFormat(this.searchForm.value.FromDate, this.settings.dateFormat)))
      }
      if (!this.searchForm.value.ToDate) {
        toDate = ''
      } else {
        toDate = JSON.parse(JSON.stringify(this._gs.clientToSqlDateFormat(this.searchForm.value.ToDate,
        this.settings.dateFormat)))
      }
      if (!this.searchForm.value.ToDate) {
        this.searchForm.value.ToDate = ''
      }
      const queryStr = 
        'FromDate=' + fromDate + 
        '&ToDate=' + toDate
      this._ms.setSearchQueryParamsStr(queryStr)
    }
  }

  resetSearch () {
    this.searchForm.reset()
    this.searchForm.controls.FromDate.setValue('')
    this.searchForm.controls.ToDate.setValue('')
    const queryStr =
    'FromDate=' + '' + 
    '&ToDate=' + ''
   this._ms.setSearchQueryParamsStr(queryStr)
  }

  setToDate (evt) {
    this.searchForm.controls.ToDate.setValue(evt)
    if (this.searchForm.value.FromDate && this.searchForm.value.ToDate) {
      if (!this._gs.compareDate(this.searchForm.value.ToDate, this.searchForm.value.FromDate)) {
        this.searchForm.controls.ToDate.setValue('')
      }
    }
  }

  setFromDate (evt) {
    this.searchForm.controls.FromDate.setValue(evt)
    if (this.searchForm.value.FromDate && this.searchForm.value.ToDate) {
      if (!this._gs.compareDate(this.searchForm.value.ToDate, this.searchForm.value.FromDate)) {
        this.searchForm.controls.ToDate.setValue(evt)
      }
    } else {
      this.searchForm.controls.ToDate.setValue(evt)
    }
  }
}