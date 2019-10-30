import { Component, Input, ViewChild, SimpleChanges } from "@angular/core";
import { Select2OptionData, Select2Component } from "ng2-select2";
import { FormGroup, FormBuilder } from "@angular/forms";
import { GlobalService } from "src/app/commonServices/global.service";
import { DependencyCheck } from "src/app/shared/validators/dependencyCheck";
import { Settings } from '../../../shared/constants/settings.constant';
import { DatepickerComponent } from '../../../shared/datepicker/datepicker.component';
import { SampleApprovalService } from '../sample-approval.service';
import { ToastrCustomService } from '../../../commonServices/toastr.service';
import { PackagingService } from '../../packaging/packaging.service';
@Component({
  selector: 'sample-search',
  templateUrl: './sample-search.component.html'
})
export class SampleSearchComponent {
  styleNumberListData: Array<any> = []
  stageListData: Array<any> = []
  Type: number = 0
  statusList: Array<Select2OptionData> = []
  isValid: boolean = true
  @ViewChild('first') first: DatepickerComponent
  @ViewChild('style_select2') styleSelect2: Select2Component
  @ViewChild('stage_select2') stageSelect2: Select2Component
  @ViewChild('status_select2') statusSelect2: Select2Component
  ngOnChanges (changes: SimpleChanges): void {
    if (changes.toShow && changes.toShow.currentValue) {
      setTimeout(() => {
        this.first.toggleView()
      }, 10)
    }
  }
  @Input() toShow: boolean = false
  searchForm: FormGroup

  constructor (private formBuilder: FormBuilder, private _ss: SampleApprovalService, private _ps: PackagingService,
    private settings: Settings, private gs: GlobalService, private _ts: ToastrCustomService) {
      this._ss.select2List$.subscribe((data: any) => {
        if (data.data && data.title) {
          if (data.title === 'Style') {
            let arr = JSON.parse(JSON.stringify(data.data))
            arr.splice(1, 1)
            this.styleNumberListData = arr
          }
          if (data.title === 'Stage') {
            let arr = JSON.parse(JSON.stringify(data.data))
            arr.splice(1, 1)
            this.stageListData = arr
          }
        }
      })
    }
  
  ngOnInit () {
    this.createForm()
    this.getStatusList()
  }

  createForm () {
    this.searchForm = this.formBuilder.group({
      'FromDate': [''],
      'ToDate': [''],
      'StrSearch': [''],
      'DateType': [1],
      'StageId': [''],
      'Status': [''],
      'StyleId': ['']
    },
    {
      validator: [DependencyCheck('FromDate', 'ToDate', 'date')]
    })
  }

  getStatusList () {
    let newData = [{ id: '0', text: 'Select Status' }]
    this._ps.getStatusList().subscribe(data => {
      if (data.length > 0) {
        data.forEach(element => {
          newData.push({
            id: element.UId,
            text: element.CommonDesc
          })
        })
      }
      console.log('newData : ', newData)
      this.statusList = Object.assign([], newData)
    },
    (error) => {
      this._ts.showError(error, '')
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
        '&StrSearch=' + this.searchForm.value.StrSearch +
        '&DateType=' + this.searchForm.value.DateType +
        '&FromDate=' + fromDate + 
        '&ToDate=' + toDate + 
        '&StageId=' + this.searchForm.value.StageId +
        '&Status=' + this.searchForm.value.Status +
        '&StyleId=' + this.searchForm.value.StyleId
      this._ss.setSearchQueryParamsStr(queryStr)
    }
  }

  resetSearch () {
    this.searchForm.reset()
    this.searchForm.controls.FromDate.setValue('')
    this.searchForm.controls.ToDate.setValue('')
    if (this.stageSelect2) {
      this.stageSelect2.setElementValue(0)
    }
    if (this.styleSelect2) {
      this.styleSelect2.setElementValue(0)
    }
    if (this.statusSelect2) {
      this.statusSelect2.setElementValue(0)
    }
    this.setValue(1)
    const queryStr =
    '&StrSearch=' + '' +
    '&DateType=' + 1 +
    '&FromDate=' + '' +
    '&ToDate=' + '' +
    '&StageId=' + 0 +
    '&Status=' + 0 +
    '&StyleId=' + 0
   this._ss.setSearchQueryParamsStr(queryStr)
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

  setStyle (evt) {
    this.searchForm.controls.StyleId.setValue(evt.value)
  }

  setStage (evt) {
    this.searchForm.controls.StageId.setValue(evt.value)
  }

  setStatus (evt) {
    this.searchForm.controls.Status.setValue(evt.value)
  }

  setValue (value) {
    this.searchForm.controls.DateType.setValue(value)
  }
}