import { SampleApprovalService } from './../sample-approval.service';
import { AddSampleApprovalComponent } from './../add-sample-approval/add-sample-approval.component';
import { ToastrCustomService } from './../../../commonServices/toastr.service';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Settings } from './../../../shared/constants/settings.constant';
import { GlobalService } from 'src/app/commonServices/global.service';
import { PagingComponent } from './../../../shared/pagination/pagination.component';
import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as _ from 'lodash'
declare var $: any
declare var flatpickr: any

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
  lastItemIndex: number = 0
  pageSize: number = 20
  pageNo: number = 1
  totalItemSize: number = 0
  sampleApprovalListDate: Array<any> = []
  @ViewChild('sample_approval_paging') SampleApprovalPagingModal: PagingComponent
  private unSubscribe$ = new Subject<void>()
  clientDateFormat: any;

  constructor(
    public _globalService: GlobalService,
    public _settings: Settings,
    public _commonService: CommonService,
    private _toastService: ToastrCustomService,
    private sampleApprovalService: SampleApprovalService,
    private resolver: ComponentFactoryResolver,
  ) {
    this.clientDateFormat = this._settings.dateFormat
  }

  ngOnInit() {
    this.getSampleApprovalListData()
  }

  addSampleApproval(item?) {
    this.addSampleApprovalContainerRef.clear();
    const factory = this.resolver.resolveComponentFactory(AddSampleApprovalComponent);
    this.addSampleApprovalRef = this.addSampleApprovalContainerRef.createComponent(factory);
    this.addSampleApprovalRef.instance.openModal(item);
    this.addSampleApprovalRef.instance.triggerCloseModal.subscribe(
      (data) => {
        this.addSampleApprovalRef.destroy();
        this.getSampleApprovalListData()
      });
  }

  onLedgerItemChange = (event) => {
    this.model.selectedLedgerItem = event.data[0]
  }

  getSampleApprovalListData = () => {
    const data = {
      Page: this.pageNo,
      Size: this.pageSize
    }
    this.sampleApprovalService.getSampleApprovalList(data).pipe(
      takeUntil(this.unSubscribe$)
    ).subscribe((response: any) => {
      if (response.Code === 1000 && !_.isEmpty(response.Data) && response.Data.length > 0) {
        _.map(response.Data, (item) => {
          item.ExpectedReplyDate = this._globalService.utcToClientDateFormat(item.ExpectedReplyDate, 'd.M.Y')
          item.SampleDate = this._globalService.utcToClientDateFormat(item.SampleDate, 'd.M.Y')
          item.ApprovedOn = this._globalService.clientToSqlDateFormat(this.clientDateFormat, item.SampleDate)
        })
        this.sampleApprovalListDate = [...response.Data]
        this.totalItemSize = response.Data[0].TotalRows
      } else {
        this._toastService.showError("Error in Data Fetching", 'error');
        this.totalItemSize = 0;
      }
    }, (error) => {
      console.log(error);
    });
  }

  onPageNoChange = (event) => {
    this.pageNo = event
    // this.getSampleApprovalListData()
  }

  onPageSizeChange = (event) => {
    this.pageSize = event
    // this.getSampleApprovalListData()
  }

  onLastValueChange = (event) => {
    this.lastItemIndex = event
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next()
    this.unSubscribe$.complete()
  }

  onApprove(item){
    if (!item.ApprovedOn) {
      return
    }
    const data = {
      Type: 'Approval',
      Id: item.Id,
      ApprovedOn: this._globalService.utcToClientDateFormat(item.ApprovedOn, 'm/d/Y'),
      Status: item.Status
    }
    this.sampleApprovalService.postSampleApprovalFormData(data).subscribe((res) => {
      if(res.Code === 1000) {
        this._toastService.showSuccess('success', 'Approved')
        item.disableApprove = true
      } else {
        this._toastService.showError('Error', res.Message)
      }
    }) 
  }
}
