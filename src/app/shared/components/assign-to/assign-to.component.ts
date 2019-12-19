import { UserFormService } from './../../../user/user-form/user-form.service';
import { CommonService } from './../../../commonServices/commanmaster/common.services';
import { ToastrCustomService } from './../../../commonServices/toastr.service';
import { ApiConstant } from 'src/app/shared/constants/api';
import { BaseServices } from './../../../commonServices/base-services';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-assign-to',
  templateUrl: './assign-to.component.html',
  styleUrls: ['./assign-to.component.css']
})
export class AssignToComponent implements OnInit {
  assignUserId: Array<number>
  parentTypeId: number
  parentId: number
  transferLeads: Array<any> = []
  assignRemark: string
  userData: Array<any> = []
  @Output() closeModal = new EventEmitter();
  constructor(
    private baseService: BaseServices,
    private toaster: ToastrCustomService,
    private commonService: CommonService,
    private userFormService: UserFormService
  ) { }

  ngOnInit() {
    this.userFormService.getUserListData().subscribe((res) => {
      if (res.Code === 1000 && !this.commonService.isEmpty(res.Data) && !this.commonService.isEmpty(res.Data.LoginUserDetails)) {
        this.userData = [...res.Data.LoginUserDetails]
      }
    })
  }

  openModal(item, type) {
    this.commonService.openModal('assign_to');
    this.parentTypeId = type ? 47 : 49
    if(Array.isArray(item)){
      this.transferLeads = [...item]
      this.parentId = null
    } else {
      this.parentId = item.Id
    }
  }

  closePopUp(data?) {
    this.commonService.closeModal('assign_to')
    this.closeModal.emit(data);
  }

  assignTo() {
    if(this.transferLeads.length > 0) {
      this.transferLead();
      return
    }
    const data = {
      "LeadAssignList": this.assignUserId.map((item) => {
        return {
          "ParentTypeId": this.parentTypeId,
          "ParentId": this.parentId,
          "AssignTo": item
        }
      })
    }
    this.baseService.postRequest(ApiConstant.LEAD_ASSIGN, data).subscribe((res) => {
      if (res.Code === 1000) {
        this.toaster.showSuccess('Assigned Success', '')
        this.closePopUp();
      } else {
        this.toaster.showError(res.Message, '')
      }
    })
  }

  transferLead(){
    const data = {
      "LeadTransferList": this.transferLeads.map((item) => {
        return {
          "ParentId": item,
          "TransferTo": this.assignUserId,
          "ParentTypeId": this.parentTypeId,
          "Remark": this.assignRemark
      }
      })
  }

  this.baseService.postRequest(ApiConstant.LEAD_TRANSFER, data).subscribe((res) => {
    if (res.Code === 1000) {
      this.toaster.showSuccess('Transfer Succcess', '')
      this.closePopUp(true);
    } else {
      this.toaster.showError(res.Message, '')
    }
  })
  }
}
