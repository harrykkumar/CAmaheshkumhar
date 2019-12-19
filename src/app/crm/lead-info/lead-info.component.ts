import { NgForm } from '@angular/forms';
import { Settings } from './../../shared/constants/settings.constant';
import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { ToastrCustomService } from 'src/app/commonServices/toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalService } from 'src/app/commonServices/global.service';
import { CrmService } from '../crm.service';
import { CompanyProfileService } from 'src/app/start/company-profile/company-profile.service';
import { BaseServices } from 'src/app/commonServices/base-services';
import { ApiConstant } from 'src/app/shared/constants/api';

@Component({
  selector: 'app-lead-info',
  templateUrl: './lead-info.component.html',
  styleUrls: ['./lead-info.component.css']
})
export class LeadInfoComponent implements OnInit {
  @Output() closeModal = new EventEmitter();
  @ViewChild('addNotesForm') addNotesFormControl: NgForm
  editLeadId: number;
  followUpDetails: any;
  formType: any;
  leadCustomer: any;
  leadContactInfo: any;
  leadEmail: any;
  leadAddress: any;
  leadList: any;
  cpContactInfo: any;
  cpEmail: any;
  cpAddress: any;
  contactPerson: any;
  noteDescription: string;
  notesList: Array<any> = []
  editNoteId: any;
  currentContactPersonIndex: number;
  constructor(
    public commonService: CommonService,
    private toastrService: ToastrCustomService,
    private spinner: NgxSpinnerService,
    public _settings: Settings,
    private gs: GlobalService,
    public crmService: CrmService,
    private _orgService: CompanyProfileService,
    private baseService: BaseServices
  ) {
    this.crmService.getLeadUtility();
  }

  ngOnInit() {
  }

  openModal(item, type?) {
    this.formType = type;
    if (!this.commonService.isEmpty(item)) {
      this.editLeadId = this.formType ? Number(item.EnquiryID) : Number(item.Id)
      this.getLeadDetails(item);
      this.getLeadNotes()
    }
  }

  closePopUp(data?) {
    this.commonService.closeModal('leads_report');
    this.closeModal.emit(data);
  }

  getLeadDetails(item?) {
    let url =  ApiConstant.CRM_LEAD
    const query = {
      ID: this.editLeadId,
    }
    this.commonService.getRequest(url, query).subscribe((res) => {
      if (res.Code === 1000 && !this.commonService.isEmpty(res.Data)) {
        this.leadCustomer = { ...res.Data.LeadCustomer[0] }
        this.leadContactInfo = { ...res.Data.LeadContactInfo[0] }
        this.cpContactInfo = { ...res.Data.CPContactInfo[0] }
        this.leadEmail = { ...res.Data.LeadEmail[0] }
        this.cpEmail = { ...res.Data.CPEmail[0] }
        this.leadAddress = { ...res.Data.LeadAddress[0] }
        this.cpAddress = { ...res.Data.CPAddress[0] }
        this.leadList = { ...res.Data.LeadList[0] }
        this.contactPerson = [...res.Data.LeadContactPerson]
        this.currentContactPersonIndex = 0
      }
      this.commonService.openModal('leads_report');
    })
  }

  submitNotes(type?) {
    const data = {
      "ListLeadNote": [
        {
          "Id": this.editNoteId ? this.editNoteId : 0,
          "ParentId": this.editLeadId,
          "Description": this.noteDescription,
          "IsActive": type ? 0 : 1
        }
      ]
    }
    this.baseService.postRequest(ApiConstant.LEAD_NOTE, data).subscribe((res) => {
      if (res.Code === 1000) {
        this.toastrService.showSuccess('Item Updated Successfully', '')
        this.addNotesFormControl.resetForm();
        this.getLeadNotes()
      } else {
        this.toastrService.showError(res.Message, '')
      }
    })
  }

  getLeadNotes() {
    const query = {
      EnquiryID : this.editLeadId
    }
    this.commonService.getRequest(ApiConstant.LEAD_NOTE, query).subscribe((res) => {
      if(res.Code === 1000 && !this.commonService.isEmpty(res.Data) && !this.commonService.isEmpty(res.Data.GetLeadNoteList)){
        this.notesList = [...res.Data.GetLeadNoteList];
      } else {
        this.notesList = []
      }
    })
  }

  editNotes(item, type?) {
    this.editNoteId = item.Id
    this.noteDescription = item.Description
    if (type) {
      this.submitNotes(type);
    }
  }

  // deleteNotes(item){
  //   this.editNoteId = item.Id
  //   this.noteDescription = item.Description
  // }
}
