import { CropImageComponent } from './../../shared/image-cropper/image-cropper.component';
import { Component, OnInit, Output, EventEmitter, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { BaseServices } from 'src/app/commonServices/base-services';
import { ToastrCustomService } from 'src/app/commonServices/toastr.service';
import { ApiConstant } from 'src/app/shared/constants/api';
import * as _ from 'lodash'

@Component({
  selector: 'app-add-customer-agent',
  templateUrl: './add-customer-agent.component.html',
  styleUrls: ['./add-customer-agent.component.css']
})
export class AddCustomerAgentComponent implements OnInit {
  @ViewChild('imageCropperContainerRef', { read: ViewContainerRef }) imageCropperContainerRef: ViewContainerRef;
  @Output() closeModal = new EventEmitter();
  @ViewChild('addCustomerForm') addCusomerFormControl: NgForm;
  id: number;
  parentId: number = null;
  customerAgentName: string;
  parentList: Array<any> = [];
  crsCustomerId: number;
  noOfClient: number;
  website: string;
  workDomain: string;
  imageFiles: { Name: any; BaseString: any; IsBaseImage: number; Id: number; };
  imageCropperRef: any;
  constructor(
    private commonService: CommonService,
    private baseService: BaseServices,
    private toaster: ToastrCustomService,
    private resolver: ComponentFactoryResolver,
  ) { }

  ngOnInit() {
    this.getParentList()
  }

  getParentList() {
    this.baseService.getRequest(ApiConstant.CUSTOMER_AGENT).subscribe((res) => {
      if (res.Code === 1000 && !_.isEmpty(res.Data)) {
        this.parentList = [...res.Data];
      } else {
        this.parentList = []
      }
    })
  }

  openModal(item?) {
    this.commonService.openModal('add_customer_agent');
    if (!_.isEmpty(item)) {
      this.assignFormData(item);
    }
  }

  closePopUp(type?) {
    this.commonService.closeModal('add_customer_agent')
    this.closeModal.emit(type);
  }

  assignFormData(item) {
    this.getCustomerAgentImageDetails(item.Id)
    this.id = item.Id
    this.customerAgentName = item.Name
    this.parentId = item.ParentId ? item.ParentId : null
    this.noOfClient = item.NoOfClient ? item.NoOfClient : 0
    this.website  = item.WebSite ? item.WebSite : ''
    this.workDomain = item.WorkDomain ? item.WorkDomain : ''
  }

  getCustomerAgentImageDetails(id) {
    this.baseService.getRequest(`${ApiConstant.CUSTOMER_AGENT_DETAIL}?Id=${id}`).subscribe((res) => {
      if (res.Code === 1000 && !_.isEmpty(res.Data) && !_.isEmpty(res.Data.ImageContentBases)) {
        this.imageFiles = {
          Name: res.Data.ImageContentBases[0].Name,
          BaseString: '',
          IsBaseImage: 0,
          Id: res.Data.ImageContentBases[0].Id,
        };
      }
    })
  }

  onFileChange(event) {
    if(!_.isEmpty(event)) {
      this.imageCropperContainerRef.clear();
      const factory = this.resolver.resolveComponentFactory(CropImageComponent);
      this.imageCropperRef = this.imageCropperContainerRef.createComponent(factory);
      this.imageCropperRef.instance.fileChangeEvent(event);
      this.imageCropperRef.instance.closeModal.subscribe(
        (data) => {
          this.imageCropperRef.destroy();
          if (data) {
            const file = event.target.files[0];
              this.imageFiles = {
                Name: file.name,
                BaseString: data,
                IsBaseImage: 1,
                Id: (!_.isEmpty(this.imageFiles) && this.imageFiles.Id) ? this.imageFiles.Id : 0,
            };
          }
        });
    }

  }

  submit(type?) {
    const data = {
      Id: this.id ? this.id : 0,
      Name: this.customerAgentName,
      ParentId: this.parentId ? this.parentId : 0,
      CrsCustomerId: this.crsCustomerId ? this.crsCustomerId : 0,
      NoOfClient: this.noOfClient ? this.noOfClient : 0,
      WebSite: this.website ? this.website : '',
      WorkDomain: this.workDomain ? this.workDomain : '',
      ImageFiles : [{...this.imageFiles}]
    }
    this.baseService.postRequest(ApiConstant.CUSTOMER_AGENT, data).subscribe((res) => {
      if (res.Code === 1000 && res.Data) {
        this.toaster.showSuccess('Saved Successfully', '')
        if (type === 'reset') {
          this.id = 0
          this.addCusomerFormControl.resetForm();
        } else {
          this.closePopUp(Number(res.Data));
        }
      } else {
        this.toaster.showError(res.Message, '')
      }
    })
  }
}
