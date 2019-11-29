import { Component, ViewChild, SimpleChanges, Input } from '@angular/core';
import { DatepickerComponent } from '../../../shared/datepicker/datepicker.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Settings } from '../../../shared/constants/settings.constant';
import { ItemRequirementService } from '../item-requirement.service';
import { GlobalService } from '../../../commonServices/global.service';
import { ToastrCustomService } from '../../../commonServices/toastr.service';
import { DependencyCheck } from '../../../shared/validators/dependencyCheck';
import { Select2Component } from 'ng2-select2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'item-requirement-search',
  templateUrl: './item-requirement-search.component.html'
})
export class ItemRequirementSearchComponent {
  masterData: any = {}
  destroy$: Subscription[] = []
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

  constructor (private formBuilder: FormBuilder, private settings: Settings,private _irs: ItemRequirementService,
     private gs: GlobalService, private _ts: ToastrCustomService) {
    this.getItems()
  }
  ngOnInit () {
    this.createForm()
  }

  createForm () {
    this.searchForm = this.formBuilder.group({
      'FromDate': [''],
      'ToDate': [''],
      'ItemId': [''],
      'StyleId': ['']
    },
    {
      validator: [DependencyCheck('FromDate', 'ToDate', 'date')]
    })
  }
  get f() { return this.searchForm.controls; }

  getItems() {
    let newData = [{ id: '0', text: 'Select Item' }]
   this.destroy$.push (this._irs.getItemList().subscribe(data => {
      if (data.length > 0) {
        data.forEach(element => {
          newData.push({
            id: element.Id,
            text: element.Name
          })
        })
      }
      console.log('newData : ', newData)
      this.masterData.itemData = Object.assign([], newData)
    },
    (error) => {
      this._ts.showError(error, '')
    }))
  }

  getStyleList(itemId) {
    let newData = [{ id: '0', text: 'Select Style' }]
    this.destroy$.push(this._irs.getStyleList(itemId).subscribe(data => {
      console.log('ledger data : ', data)
      if (data.length > 0) {
        data.forEach(element => {
          newData.push({
            id: element.Id,
            text: element.Name
          })
        })
      }
      this.masterData.styleData = Object.assign([], newData)
    },
    (error) => {
      this._ts.showError(error, '')
    }))
  }

  search () {
    if (this.searchForm.valid) {
      let fromDate = ''
      let toDate = ''
      if (!this.searchForm.value.FromDate) {
        fromDate = ''
      } else {
        fromDate = JSON.parse(JSON.stringify(this.gs.clientToSqlDateFormat(this.searchForm.value.FromDate, this.settings.dateFormat)))
      }
      if (!this.searchForm.value.ToDate) {
        toDate = ''
      } else {
        toDate = JSON.parse(JSON.stringify(this.gs.clientToSqlDateFormat(this.searchForm.value.ToDate,
        this.settings.dateFormat)))
      }
      if (!this.searchForm.value.ToDate) {
        this.searchForm.value.ToDate = ''
      }
      const queryStr = 
        '&FromDate=' + fromDate + 
        '&ToDate=' + toDate + 
        '&ItemId=' + this.searchForm.value.ItemId +
        '&StyleId=' + this.searchForm.value.StyleId
      this._irs.setSearchQueryParamsStr(queryStr)
    }
  }

  @ViewChild('item_select2') itemSelect2: Select2Component
  @ViewChild('style_select2') styleSelect2: Select2Component
  resetSearch () {
    this.searchForm.reset()
    this.searchForm.controls.FromDate.setValue('')
    this.searchForm.controls.ToDate.setValue('')
    if (this.itemSelect2) {
      this.itemSelect2.setElementValue(0)
    }
    if (this.styleSelect2) {
      this.styleSelect2.setElementValue(0)
    }
    const queryStr =
    '&FromDate=' + '' + 
    '&ToDate=' + '' + 
    '&ItemId=' + '' +
    '&StyleId=' + ''
   this._irs.setSearchQueryParamsStr(queryStr)
  }

  setToDate (evt) {
    this.searchForm.controls.ToDate.setValue(evt)
    if (this.searchForm.value.FromDate && this.searchForm.value.ToDate) {
      if (!this.gs.compareDate(this.searchForm.value.ToDate, this.searchForm.value.FromDate)) {
        this.searchForm.controls.ToDate.setValue('')
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

  setItemId (evt) {
    this.searchForm.controls.ItemId.setValue(evt.value)
    this.getStyleList(this.searchForm.value.ItemId)
  }

  setStyleId (evt) {
    this.searchForm.controls.StyleId.setValue(evt.value)
  }

  ngOnDestroy() {
    if (this.destroy$ && this.destroy$.length > 0){
      this.destroy$.forEach(subscription => subscription.unsubscribe())
    }
  }
}