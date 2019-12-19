import { ApiConstant } from 'src/app/shared/constants/api';
import { Settings } from 'src/app/shared/constants/settings.constant';
import { Component, OnInit, ComponentFactoryResolver, EventEmitter, Output } from '@angular/core';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { ToastrCustomService } from 'src/app/commonServices/toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder } from '@angular/forms';
import { GlobalService } from 'src/app/commonServices/global.service';
import { CrmService } from '../crm.service';

@Component({
  selector: 'app-follow-up-count-info',
  templateUrl: './follow-up-count-info.component.html',
  styleUrls: ['./follow-up-count-info.component.css']
})
export class FollowUpCountInfoComponent implements OnInit {
  @Output() closeModal = new EventEmitter();
  followUpDetailList: Array<any> = []
  constructor(
    private commonService: CommonService,
    private resolver: ComponentFactoryResolver,
    private toastrService: ToastrCustomService,
    private spinner: NgxSpinnerService,
    private _formBuilder: FormBuilder,
    private _settings: Settings,
    private gs: GlobalService,
    public crmService: CrmService
  ) { }

  ngOnInit() {
  }

  openModal(item) {
    if (!this.commonService.isEmpty(item)) {
      // this.followUpId =  Number(item.Id);
      this.getFollowUpDetails(item);
    }
    this.commonService.openModal('follow_counts');
  }

  closePopUp(data?) {
    this.commonService.closeModal('follow_counts');
    this.closeModal.emit(data);
  }

  getFollowUpDetails(item) {
    const query = {
      // SearchText: this.commonService.isEmpty(this.searchText) ? '' : this.searchText,
      // Status: this.leadStatusId ? this.leadStatusId : 0,
      // FromDate: this.gs.clientToSqlDateFormat(this.fromDateValue, this._settings.dateFormat),
      // EndDate: this.gs.clientToSqlDateFormat(this.toDateValue, this._settings.dateFormat),
      IsLast : 0,
      Id : item.EnquiryID
    }
    this.commonService.getRequest(ApiConstant.LEAD_FOLLOW_UP_LIST, query).subscribe((res) => {
      if (res.Code === 1000 && !this.commonService.isEmpty(res.Data)) {
        this.followUpDetailList = [...res.Data];
      } else {
        this.followUpDetailList = [];
      }
    })
  }

}
