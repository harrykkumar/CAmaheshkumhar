import { LeadReportComponent } from './../lead-report/lead-report.component';
import { Settings } from './../../shared/constants/settings.constant';
import { ApiConstant } from 'src/app/shared/constants/api';
import { Component, OnInit, ComponentFactoryResolver, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { ToastrCustomService } from 'src/app/commonServices/toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder } from '@angular/forms';
import { UIConstant } from 'src/app/shared/constants/ui-constant';
import { AddLeadComponent } from '../add-lead/add-lead.component';
import { GlobalService } from 'src/app/commonServices/global.service';
import { CrmService } from '../crm.service';

@Component({
  selector: 'app-follow-up-list',
  templateUrl: './follow-up-list.component.html',
  styleUrls: ['./follow-up-list.component.css']
})
export class FollowUpListComponent implements OnInit {
  @ViewChild('addLeadContainerRef', { read: ViewContainerRef }) addLeadContainerRef: ViewContainerRef;
  @ViewChild('leadReportContainerRef', { read: ViewContainerRef }) leadReportContainerRef: ViewContainerRef;
  addLeadRef: any;
  leadReportRef: any;
  followUpList: Array<any> = []
  fromDateValue
  toDateValue
  leadStatusId
  searchText: any;
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
    this.getFollowUpList();
  }

  getFollowUpList() {
    this.spinner.show();
    const query = {
      SearchText: this.commonService.isEmpty(this.searchText) ? '' : this.searchText,
      Status: this.leadStatusId ? this.leadStatusId : 0,
      FromDate: this.gs.clientToSqlDateFormat(this.fromDateValue, this._settings.dateFormat),
      EndDate: this.gs.clientToSqlDateFormat(this.toDateValue, this._settings.dateFormat)
    }
    this.commonService.getRequest(ApiConstant.LEAD_FOLLOW_UP_LIST).subscribe((res) => {
      if (res.Code === 1000 && !this.commonService.isEmpty(res.Data)) {
        this.followUpList = [...res.Data];
      } else {
        this.followUpList = [];
      }
      this.spinner.hide();
    })
  }

  addLead(item, type?) {
    this.commonService.loadModalDynamically(this, 'addLeadContainerRef', 'addLeadRef', AddLeadComponent,
      (res) => {
        if (res) {
          if (!this.commonService.isEmpty(res)) {
            this.getFollowUpList();
          }
        }
      }, item, type);
  }

  openLeadReport(item) {
    this.commonService.loadModalDynamically(this, 'leadReportContainerRef', 'leadReportRef', LeadReportComponent,
      (res) => { }, item, UIConstant.FORMTYPE_FOLLOWUP);
  }
}
