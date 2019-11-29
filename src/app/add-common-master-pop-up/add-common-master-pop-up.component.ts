import { NgxSpinnerService } from 'ngx-spinner';
import { BaseServices } from 'src/app/commonServices/base-services';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Component, OnInit, ComponentFactoryResolver, EventEmitter, Output, ViewChild } from '@angular/core';
import { ToastrCustomService } from '../commonServices/toastr.service';
import * as _ from 'lodash';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-add-common-master-pop-up',
  templateUrl: './add-common-master-pop-up.component.html',
  styleUrls: ['./add-common-master-pop-up.component.css']
})
export class AddCommonMasterPopUpComponent implements OnInit {
  @ViewChild('addCommonMasterForm') addCommonMasterFormControl: NgForm;
  @Output() closeModal = new EventEmitter();
  id: number;
  masterName: string;
  commonCode: number;
  pageTitle: string;
  apiUrl: string;
  constructor(
    private commonService: CommonService,
    private toastrService: ToastrCustomService,
    private baseService: BaseServices,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
  }

  openModal(data, item?) {
    this.commonService.openModal('add_common_master');
    if (!_.isEmpty(data)) {
      this.pageTitle = data.pageTitle
      this.apiUrl = data.apiUrl
      if (data.commonCode) {
        this.commonCode = Number(data.commonCode)
      }
    }
    if (!_.isEmpty(item)) {
      this.id = Number(item.id)
      this.masterName = item.commondesc
    }
  }

  closePopUp(type?) {
    this.commonService.closeModal('add_common_master')
    this.closeModal.emit(type);
  }


  submit(type?) {
    const requestData = {
      Id: this.id ? this.id : 0,
      Name: this.masterName,
      ShortName: this.masterName,
    };
    if (this.commonCode) {
      requestData['commonCode'] = this.commonCode
    }
    const url = this.apiUrl;
    this.spinner.show();
    this.baseService.postRequest(url, requestData).subscribe((res: any) => {
      if (res.Code === 1000) {
        this.toastrService.showSuccess('', `${this.pageTitle} Added Successfully`);
        if (type === 'reset') {
          this.id = 0
          this.addCommonMasterFormControl.resetForm();
        } else {
          this.closePopUp(res.Data);
        }
      } else {
        this.toastrService.showError('', res.message);
      }
      this.spinner.hide();
    });
  }
}
