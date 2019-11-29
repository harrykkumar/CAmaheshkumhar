import { Settings } from './../../shared/constants/settings.constant';
import { ApiConstant } from './../../shared/constants/api';
import { CommonService } from './../../commonServices/commanmaster/common.services';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ToastrCustomService } from 'src/app/commonServices/toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalService } from 'src/app/commonServices/global.service';
import { CrmService } from '../crm.service';
import { CompanyProfileService } from 'src/app/start/company-profile/company-profile.service';
import { BaseServices } from 'src/app/commonServices/base-services';
import { UIConstant } from 'src/app/shared/constants/ui-constant';

@Component({
  selector: 'app-lead-report',
  templateUrl: './lead-report.component.html',
  styleUrls: ['./lead-report.component.css']
})
export class LeadReportComponent implements OnInit {
  @Output() closeModal = new EventEmitter();
  editLeadId: number;
  leadDetails: any;
  followUpDetails: any;
  formType: any;
  constructor(
    public commonService: CommonService,
    private toastrService: ToastrCustomService,
    private spinner: NgxSpinnerService,
    public _settings: Settings,
    private gs: GlobalService,
    public crmService: CrmService,
    private _orgService: CompanyProfileService,
    private baseService: BaseServices
  ) { }

  async ngOnInit() {
    await this.crmService.getLeadUtility();
  }
  openModal(item?, type?) {
    this.commonService.openModal('leads_report');
    if(type){
      this.formType = type;
    }
    if (!this.commonService.isEmpty(item)) {
      this.editLeadId = Number(item.Id)
      this.getLeadDetails(item);
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
    if (this.formType) {
      query['EnquiryID'] = item.EnquiryID ? item.EnquiryID : 0
      url = ApiConstant.LEAD_FOLLOW_UP
    }
    this.commonService.getRequest(url, query).subscribe((res) => {
      if (res.Code === 1000 && !this.commonService.isEmpty(res.Data)) {
        // if (this.formType) {
        //   this.followUpDetails = JSON.parse(JSON.stringify(res.Data))
        // } else {
          this.leadDetails = JSON.parse(JSON.stringify(res.Data))
        // }
      }
    })
  }
}
