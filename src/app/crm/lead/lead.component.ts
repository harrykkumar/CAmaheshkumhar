import { CrmService } from './../crm.service';
import { GlobalService } from './../../commonServices/global.service';
import { Settings } from 'src/app/shared/constants/settings.constant';
import { LeadReportComponent } from './../lead-report/lead-report.component';
import { UIConstant } from './../../shared/constants/ui-constant';
import { AddLeadComponent } from './../add-lead/add-lead.component';
import { ApiConstant } from 'src/app/shared/constants/api';
import { CommonService } from '../../commonServices/commanmaster/common.services';
import { BaseServices } from '../../commonServices/base-services';
import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, ElementRef } from '@angular/core';
import * as _ from 'lodash';
import { ToastrCustomService } from 'src/app/commonServices/toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.css']
})
export class LeadComponent implements OnInit {
  @ViewChild('addLeadContainerRef', { read: ViewContainerRef }) addLeadContainerRef: ViewContainerRef;
  @ViewChild('leadReportContainerRef', { read: ViewContainerRef }) leadReportContainerRef: ViewContainerRef;
  addLeadRef: any;
  leadReportRef: any;
  leadData: Array<any> = []
  formUtility: any = {};
  searchText: any;
  fromDateValue
  toDateValue
  leadStatusId
  constructor(
    private commonService: CommonService,
    private resolver: ComponentFactoryResolver,
    private toastrService: ToastrCustomService,
    private spinner: NgxSpinnerService,
    private _formBuilder: FormBuilder,
    private _settings: Settings,
    private gs: GlobalService,
    public crmService: CrmService
  ) {
  }

  async ngOnInit() {
    await this.crmService.getLeadUtility();
    this.getLeadList();
  }

  getLeadList(type?) {
    this.spinner.show()
    const query = {
      SearchText: this.commonService.isEmpty(this.searchText) ? '' : this.searchText,
      Status: this.leadStatusId ? this.leadStatusId : 0,
      FromDate: this.gs.clientToSqlDateFormat(this.fromDateValue, this._settings.dateFormat),
      EndDate: this.gs.clientToSqlDateFormat(this.toDateValue, this._settings.dateFormat)
    }
    this.commonService.getRequest(ApiConstant.CRM_LEAD_GET, query).subscribe((res) => {
      if (res.Code === 1000 && !_.isEmpty(res.Data)) {
        this.leadData = [...res.Data];
      } else {
        this.leadData = []
      }
      this.spinner.hide()
    })
  }

  addLead(item?, type?) {
    this.commonService.loadModalDynamically(this, 'addLeadContainerRef', 'addLeadRef', AddLeadComponent,
      (res) => {
        if (res) {
          // if (!this.commonService.isEmpty(res)) {
            this.getLeadList();
          // }
        }
      }, item, type);
  }

  openLeadReport(item) {
    this.commonService.loadModalDynamically(this, 'leadReportContainerRef', 'leadReportRef', LeadReportComponent,
      (res) => { }, item);
  }

}
