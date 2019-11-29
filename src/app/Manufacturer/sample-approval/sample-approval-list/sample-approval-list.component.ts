import { SampleApprovalService } from './../sample-approval.service';
import { ToastrCustomService } from './../../../commonServices/toastr.service';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Settings } from './../../../shared/constants/settings.constant';
import { GlobalService } from 'src/app/commonServices/global.service';
import { PagingComponent } from './../../../shared/pagination/pagination.component';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import * as _ from 'lodash'

@Component({
  selector: 'app-sample-approval-list',
  templateUrl: './sample-approval-list.component.html'
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
  destroy$: Subscription[] = []
  sampleApprovalListDate: Array<any> = []
  @ViewChild('sample_approval_paging') SampleApprovalPagingModal: PagingComponent
  clientDateFormat: any;

  constructor(
    public _globalService: GlobalService,
    public _settings: Settings,
    public _cs: CommonService,
    private _ts: ToastrCustomService,
    private _ss: SampleApprovalService
  ) {
    this.clientDateFormat = this._settings.dateFormat
    this.destroy$.push(this._ss.sampleAdded$.subscribe(() => {
      this.getSampleApprovalListData()
    }))
    this.destroy$.push(this._ss.queryStr$.subscribe(
      (str) => {
        console.log(str)
        this.queryStr = str
        this.p = 1
        this.getSampleApprovalListData()
      }
    ))

    this.destroy$.push(this._cs.getDeleteStatus().subscribe(
      (obj) => {
        if (obj.id && obj.type && obj.type === 'sampling') {
          this.deleteItem(obj.id)
        }
      }
    ))
  }

  ngOnInit() {
    this.getSampleApprovalListData()
    this.getStyleData()
    this.getshipmentByList()
    this.getStageData()
  }

  getSampleApprovalListData = () => {
    this.destroy$.push(this._ss.getSampleApprovalList('?Page=' + this.p + '&Size=' + this.itemsPerPage + this.queryStr)
    .subscribe((data: any) => {
      _.map(data, (item) => {
        if (item.ApprovedOn) {
          item.ApprovedOn = this._globalService.utcToClientDateFormat(item.ApprovedOn, this.clientDateFormat)
          item.disableApprove = true
        } else {
          item.click = false
          item.disableApprove = false
        }
      })
      this.sampleApprovalListDate = [...data]
      this.total = data[0].TotalRows
    }, (error) => {
      console.log(error);
      this._ts.showError(error, '');
    }));
  }

  onApprove(item) {
    setTimeout(() => $(".errorSelecto:first").focus(), 100)
    if (!item.ApprovedOn) {
      item.click = true
      // setTimeout(() => , 1000)
      return
    }
    const data = {
      Type: 'Approval',
      Id: item.Id,
      ApprovedOn: this._globalService.clientToSqlDateFormat(item.ApprovedOn, this.clientDateFormat),
      Status: item.Status,
      Reamrk: item.Remark
    }
    this.destroy$.push(this._globalService.manipulateResponse(this._ss.postSampleApprovalFormData(data)).subscribe((res) => {
      this._ts.showSuccess('', 'Successfully done')
      item.disableApprove = true
      item.click = false
    }, (error) => {
      this._ts.showErrorLong(error, '')
      item.click = false
    }))
  }

  getStyleData () {
    this.destroy$.push(this._ss.getStyleList().subscribe((data) => {
      console.log(data)
      this._ss.getList(data, 'Name', 'Style')
    },
    (error) => {
      this._ts.showError(error, '')
    }))
  }

  getshipmentByList() {
    this.destroy$.push(this._ss.getShipmentByList().subscribe((data) => {
      console.log(data)
      this._ss.getList(data, 'CommonDesc', 'ShipmentBy')
    },
    (error) => {
      this._ts.showError(error, '')
    }))
  }

  getStageData() {
    this.destroy$.push(this._ss.getStageList().subscribe((data) => {
      console.log(data)
      this._ss.getList(data, 'CommonDesc', 'Stage')
    },
    (error) => {
      this._ts.showError(error, '')
    }))
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
    if (this.destroy$ && this.destroy$.length > 0) {
      this.destroy$.forEach((element) => element.unsubscribe())
    }
  }

  delete(id) {
    this._cs.openDelete(id, 'sampling', 'Sample')
  }

  deleteItem (id) {
    if (id) {
      this.destroy$.push(this._ss.deleteSample(id).subscribe((data) => {
        this._ts.showSuccess('', 'Deleted Successfully')
        this._cs.closeDelete('')
        this.getSampleApprovalListData()
      },
      (error) => {
        this._ts.showErrorLong('', error)
        this._cs.closeDelete('')
      }))
    }
  }

}
