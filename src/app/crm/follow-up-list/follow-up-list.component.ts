import { AssignToComponent } from './../../shared/components/assign-to/assign-to.component';
import { FollowUpCountInfoComponent } from './../follow-up-count-info/follow-up-count-info.component';
import { LeadInfoComponent } from './../lead-info/lead-info.component';
import { Settings } from './../../shared/constants/settings.constant';
import { ApiConstant } from 'src/app/shared/constants/api';
import { Component, OnInit, ComponentFactoryResolver, ViewChild, ElementRef, ViewContainerRef, AfterViewInit } from '@angular/core';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { ToastrCustomService } from 'src/app/commonServices/toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, NgForm } from '@angular/forms';
import { UIConstant } from 'src/app/shared/constants/ui-constant';
import { AddLeadComponent } from '../add-lead/add-lead.component';
import { GlobalService } from 'src/app/commonServices/global.service';
import { CrmService } from '../crm.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-follow-up-list',
  templateUrl: './follow-up-list.component.html',
  styleUrls: ['./follow-up-list.component.css']
})
export class FollowUpListComponent implements OnInit, AfterViewInit {
  @ViewChild('followUpSearchFormControl') followUpSearchFormControl: NgForm;
  @ViewChild('addLeadContainerRef', { read: ViewContainerRef }) addLeadContainerRef: ViewContainerRef;
  @ViewChild('leadInfoContainerRef', { read: ViewContainerRef }) leadInfoContainerRef: ViewContainerRef;
  @ViewChild('followUpCountInfoContainerRef', { read: ViewContainerRef }) followUpCountInfoContainerRef: ViewContainerRef;
  @ViewChild('assignToContainerRef', { read: ViewContainerRef }) assignToContainerRef: ViewContainerRef;
  assignToRef: any;
  addLeadRef: any;
  leadInfoRef: any;
  followUpInfoRef: any;
  followUpList: Array<any> = []
  dataToFilterStorage: Array<any> = []
  fromDateValue
  toDateValue
  leadStatusId
  searchText: any;
  isAsc: Array<boolean> = [true,true,true,true,true,true];
  businessTypeId: any;
  sourceId: any;
  followUpActionId: any;
  followUpDurationId: any;
  isAllFollowUpSelected: boolean = false;
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

 async ngOnInit() {
    await this.crmService.getLeadUtility();
    this.getFollowUpList();
  }

  ngAfterViewInit() {
    this.commonService.fixTableHF('cat-table')
  }

  getFollowUpList() {
    const query = {
      SearchText: this.commonService.isEmpty(this.searchText) ? '' : this.searchText,
      Status: this.leadStatusId ? this.leadStatusId : 0,
      FromDate: this.gs.clientToSqlDateFormat(this.fromDateValue, this._settings.dateFormat),
      EndDate: this.gs.clientToSqlDateFormat(this.toDateValue, this._settings.dateFormat),
      BusinessTypeID: this.businessTypeId ? this.businessTypeId : 0,
      SourceID: this.sourceId ? this.sourceId : 0,
      FollowUpActionID: this.followUpActionId ? this.followUpActionId : 0,
      TimeDurationFiltersID: this.followUpDurationId ? this.followUpDurationId : 0,
      IsLast : 1
    }
    this.commonService.getRequest(ApiConstant.LEAD_FOLLOW_UP_LIST, query).subscribe((res) => {
      if (res.Code === 1000 && !this.commonService.isEmpty(res.Data)) {
        this.dataToFilterStorage = [...res.Data]
        this.followUpList = [...res.Data];
      } else {
        this.followUpList = [];
      }
    })
  }

  resetSearchForm(){
    this.followUpSearchFormControl.resetForm()
    this.fromDateValue = ""
    this.toDateValue = ""
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
    this.commonService.loadModalDynamically(this, 'leadInfoContainerRef', 'leadInfoRef', LeadInfoComponent,
      (res) => { }, item, UIConstant.FORMTYPE_FOLLOWUP);
  }

  showFollowUpDetails(item){
    this.commonService.loadModalDynamically(this, 'followUpCountInfoContainerRef', 'followUpInfoRef', FollowUpCountInfoComponent,
    (res) => { }, item);
  }

  sortByKey(isAsc, key){
    this.followUpList = this.commonService.sortByColumn(isAsc, key, this.dataToFilterStorage);
  }

  assignTo(item) {
    this.commonService.loadModalDynamically(this, 'assignToContainerRef', 'assignToRef', AssignToComponent,
      (res) => {
        if (Array.isArray(item) && res) {
          this.getFollowUpList();
        }
      }, item);
  }

  checkAllFollowUp() {
    this.followUpList.forEach((item) => {
      item.selected = this.isAllFollowUpSelected
    })
  }

  transferFollowUp(){
    const selectedFollowUp = _.filter(this.followUpList, {selected : true})
    if(this.commonService.isEmpty(selectedFollowUp)){
      this.toastrService.showError('Please Select Atleast 1 Follow Up', '')
    } else {
      const selectedIdArray = selectedFollowUp.map((item) => {
        return item.EnquiryID
      })
      this.assignTo(selectedIdArray)
    }
  }
}
