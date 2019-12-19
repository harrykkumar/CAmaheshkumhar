import { ToastrCustomService } from './../../../commonServices/toastr.service';
import { BaseServices } from './../../../commonServices/base-services';
import { CommonService } from './../../../commonServices/commanmaster/common.services';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiConstant } from '../../constants/api';

@Component({
  selector: 'app-change-user-name',
  templateUrl: './change-user-name.component.html',
  styleUrls: ['./change-user-name.component.css']
})
export class ChangeUserNameComponent implements OnInit {
  @Output() closeModal = new EventEmitter();
  userName: string;
  type: any;
  title: any;
  label: any;
  changeLabelId: any;
  constructor(
    private commonService: CommonService,
    private baseService: BaseServices,
    private toaster: ToastrCustomService,
  ) { }

  ngOnInit() {
  }

  openModal(data) {
    this.commonService.openModal('userNameModal');
    if (data) {
      this.title = data.title;
      this.label = data.label;
      this.userName = data.value;
      this.changeLabelId = data.changeLabelId
    }
  }

  closePopUp(data?) {
    this.commonService.closeModal('userNameModal')
    this.closeModal.emit(data);
  }

  submit(){
    if (this.commonService.isEmpty(this.changeLabelId)) {
      this.submitNameChange();
    } else {
      this.submitLabelChange()
    }
  }

  submitNameChange() {
    const data = {
      Name: this.userName
    }
    this.baseService.postRequest(ApiConstant.USER_NAME_CHANGE, data).subscribe((res) => {
      if (res.Code === 1000 && !this.commonService.isEmpty(res.Data)) {
        this.closePopUp(res.Data)
        this.toaster.showSuccess('Name Saved Successfully', '')
      } else {
        this.toaster.showError(res.Message, '')
      }
    })
  }

  submitLabelChange(){
    const data = {
      ListDynamicFormLabel: [
        {
          "Id": this.changeLabelId,
          "DisplayName": this.userName
        }
      ]
    }
    this.baseService.postRequest(ApiConstant.DYNAMIC_LABEL, data).subscribe((res) => {
      if (res.Code === 1000 && !this.commonService.isEmpty(res.Data)) {
        this.closePopUp(res.Data)
        this.toaster.showSuccess('Name Saved Successfully', '')
      } else {
        this.toaster.showError(res.Message, '')
      }
    })
  }
}
