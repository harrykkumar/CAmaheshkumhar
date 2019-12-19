import { AssignToComponent } from './../../shared/components/assign-to/assign-to.component';
import { LeadInfoComponent } from './../lead-info/lead-info.component';
import { CrmService } from './../crm.service';
import { GlobalService } from './../../commonServices/global.service';
import { Settings } from 'src/app/shared/constants/settings.constant';
import { AddLeadComponent } from './../add-lead/add-lead.component';
import { ApiConstant } from 'src/app/shared/constants/api';
import { CommonService } from '../../commonServices/commanmaster/common.services';
import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, AfterViewInit } from '@angular/core';
import * as _ from 'lodash';
import { ToastrCustomService } from 'src/app/commonServices/toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, NgForm } from '@angular/forms';

@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.css']
})
export class LeadComponent implements OnInit, AfterViewInit {
  @ViewChild('leadSearchFormControl') leadSearchFormControl: NgForm;
  @ViewChild('addLeadContainerRef', { read: ViewContainerRef }) addLeadContainerRef: ViewContainerRef;
  @ViewChild('leadInfoContainerRef', { read: ViewContainerRef }) leadInfoContainerRef: ViewContainerRef;
  @ViewChild('assignToContainerRef', { read: ViewContainerRef }) assignToContainerRef: ViewContainerRef;
  assignToRef: any;
  addLeadRef: any;
  leadInfoRef: any;
  leadData: Array<any> = []
  dataToFilterStorage: Array<any> = []
  formUtility: any = {};
  searchText: any;
  fromDateValue
  toDateValue
  leadStatusId
  businessTypeId: any;
  sourceId: any;
  isAsc: Array<boolean> = [true,true,true,true,true,true,];
  followUpDurationId: any;
  isAllLeadSelected: boolean = false;
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

  ngAfterViewInit() {
    this.commonService.fixTableHF('cat-table')
  }

  getLeadList(type?) {
    const query = {
      SearchText: this.commonService.isEmpty(this.searchText) ? '' : this.searchText,
      Status: this.leadStatusId ? this.leadStatusId : 0,
      FromDate: this.gs.clientToSqlDateFormat(this.fromDateValue, this._settings.dateFormat),
      EndDate: this.gs.clientToSqlDateFormat(this.toDateValue, this._settings.dateFormat),
      BusinessTypeID: this.businessTypeId ? this.businessTypeId : 0,
      SourceID: this.sourceId ? this.sourceId : 0
    }
    this.commonService.getRequest(ApiConstant.CRM_LEAD_GET, query).subscribe((res) => {
      if (res.Code === 1000 && !_.isEmpty(res.Data)) {
        this.dataToFilterStorage = [...res.Data]
        this.leadData = [...res.Data];
      } else {
        this.leadData = []
      }
    })
  }

  resetSearchForm(){
    this.leadSearchFormControl.resetForm()
    this.fromDateValue = ""
    this.toDateValue = ""
  }

  addLead(item?, type?) {
    this.commonService.loadModalDynamically(this, 'addLeadContainerRef', 'addLeadRef', AddLeadComponent,
      (res) => {
        this.getLeadList();
      }, item, type);
  }

  openLeadReport(item) {
    this.commonService.loadModalDynamically(this, 'leadInfoContainerRef', 'leadInfoRef', LeadInfoComponent,
      (res) => { }, item);
  }

  sortByKey(isAsc, key){
    this.leadData = this.commonService.sortByColumn(isAsc, key, this.dataToFilterStorage);
  }

  assignTo(item){
    this.commonService.loadModalDynamically(this, 'assignToContainerRef', 'assignToRef', AssignToComponent,
    (res) => {
      if(Array.isArray(item) && res){
        this.getLeadList();
      }
    }, item, 'lead');
  }

  checkAllLead() {
    this.leadData.forEach((item) => {
      item.selected = this.isAllLeadSelected
    })
  }

  transferLead(){
    const selectedLead = _.filter(this.leadData, {selected : true})
    if(this.commonService.isEmpty(selectedLead)){
      this.toastrService.showError('Please Select Atleast 1 Lead', '')
    } else {
      const selectedIdArray = selectedLead.map((item) => {
        return item.Id
      })
      this.assignTo(selectedIdArray)
    }
  }
}
