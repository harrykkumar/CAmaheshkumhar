import { ToastrCustomService } from 'src/app/commonServices/toastr.service';
import { ApiConstant } from './../../constants/api';
import { BaseServices } from './../../../commonServices/base-services';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import * as _ from 'lodash'
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-godown',
  templateUrl: './add-godown.component.html',
  styleUrls: ['./add-godown.component.css']
})
export class AddGodownComponent implements OnInit {
  @Output() closeModal = new EventEmitter();
  @ViewChild('addGodownForm') addGodownFormControl: NgForm;
  id: number;
  parentId: number;
  godownName: string;
  parentList: Array<any> = [];
  constructor(
    private commonService: CommonService,
    private baseService: BaseServices,
    private toaster: ToastrCustomService
  ) { }

  ngOnInit() {
    this.getParentList()
  }

  getParentList() {
    this.baseService.getRequest(ApiConstant.GODOWN_MASTER).subscribe((res) => {
      if (res.Code === 1000 && !_.isEmpty(res.Data)) {
        this.parentList = [...res.Data];
      } else {
        this.parentList = []
      }
    })
  }

  openModal(item) {
    this.commonService.openModal('godown_master');
    if (!_.isEmpty(item)) {
      this.assignFormData(item);
    }
  }

  closePopUp(type?) {
    this.commonService.closeModal('godown_master')
    this.closeModal.emit(type);
  }

  assignFormData(item) {
    this.id = item.Id
    this.godownName = item.Name
    this.parentId = item.ParentId ? item.ParentId : null
  }

  submit(type?) {
    const data = {
      Id: this.id ? this.id : 0,
      Name: this.godownName,
      ParentId: this.parentId ? this.parentId : 0
    }
    this.baseService.postRequest(ApiConstant.GODOWN_MASTER, data).subscribe((res) => {
      if (res.Code === 1000) {
        this.toaster.showSuccess('Saved Successfully', '')
        if (type === 'reset') {
          this.id = 0
          this.addGodownFormControl.resetForm();
        } else {
          this.closePopUp(true);
        }
      } else {
        this.toaster.showError(res.Message, '')
      }
    })
  }
}
