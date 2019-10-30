import { SampleApprovalService } from './../sample-approval.service';
import { ToastrCustomService } from './../../../commonServices/toastr.service';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Settings } from './../../../shared/constants/settings.constant';
import { GlobalService } from 'src/app/commonServices/global.service';
import { PagingComponent } from './../../../shared/pagination/pagination.component';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'lodash'

@Component({
  selector: 'app-sample-approval-list',
  templateUrl: './sample-approval-list.component.html',
  styleUrls: ['./sample-approval-list.component.css']
})
export class SampleApprovalListComponent implements OnInit {
  @ViewChild('addSampleApprovalContainerRef', { read: ViewContainerRef}) addSampleApprovalContainerRef: ViewContainerRef;
  addSampleApprovalRef: any;
  model: any = {};
  listModel:any = {};
  queryStr: string = ''
  p: number = 1
  itemsPerPage: number = 20
  total: number = 0
  lastItemIndex: number = 0
  sampleApprovalListDate: Array<any> = []
  @ViewChild('sample_approval_paging') SampleApprovalPagingModal: PagingComponent
  private unSubscribe$ = new Subject<void>()
  clientDateFormat: any;

  constructor(
    public _globalService: GlobalService,
    public _settings: Settings,
    public _cs: CommonService,
    private _ts: ToastrCustomService,
    private _ss: SampleApprovalService
  ) {
    this.clientDateFormat = this._settings.dateFormat
    this._ss.sampleAdded$.subscribe(() => {
      this.getSampleApprovalListData()
    })
    this._ss.queryStr$.subscribe(
      (str) => {
        console.log(str)
        this.queryStr = str
        this.p = 1
        this.getSampleApprovalListData()
      }
    )
  }

  ngOnInit() {
    this.getSampleApprovalListData()
    this.getStyleData()
    this.getshipmentByList()
    this.getStageData()
  }

  getSampleApprovalListData = () => {
    this._ss.getSampleApprovalList('?Page=' + this.p + '&Size=' + this.itemsPerPage + this.queryStr)
    .subscribe((data: any) => {
      _.map(data, (item) => {
        item.ApprovedOn = this._globalService.utcToClientDateFormat(item.SampleDate, this.clientDateFormat)
      })
      this.sampleApprovalListDate = [...data]
      this.total = data[0].TotalRows
    }, (error) => {
      console.log(error);
      this._ts.showError(error, '');
    });
  }

  onApprove(item){
    if (!item.ApprovedOn) {
      return
    }
    const data = {
      Type: 'Approval',
      Id: item.Id,
      ApprovedOn: this._globalService.clientToSqlDateFormat(item.ApprovedOn, this.clientDateFormat),
      Status: item.Status
    }
    this._globalService.manipulateResponse(this._ss.postSampleApprovalFormData(data)).subscribe((res) => {
      this._ts.showSuccess('', 'Successfully done')
      item.disableApprove = true
    }, (error) => {
      this._ts.showErrorLong(error, '')
    })
  }

  getStyleData () {
    this._ss.getStyleList().subscribe((data) => {
      console.log(data)
      this._ss.getList(data, 'Name', 'Style')
    },
    (error) => {
      this._ts.showError(error, '')
    })
  }

  getshipmentByList() {
    this._ss.getShipmentByList().subscribe((data) => {
      console.log(data)
      this._ss.getList(data, 'CommonDesc', 'ShipmentBy')
    },
    (error) => {
      this._ts.showError(error, '')
    })
  }

  getStageData() {
    this._ss.getStageList().subscribe((data) => {
      console.log(data)
      this._ss.getList(data, 'CommonDesc', 'Stage')
    },
    (error) => {
      this._ts.showError(error, '')
    })
  }

  toShowSearch = false
  toggleSearch() {
    this.toShowSearch = !this.toShowSearch
  }

  ngAfterViewInit () {
    this._cs.fixTableHF('sample-table')
  }

  addSampleApproval(id?) {
    this._ss.openSample(id)
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next()
    this.unSubscribe$.complete()
  }

}
