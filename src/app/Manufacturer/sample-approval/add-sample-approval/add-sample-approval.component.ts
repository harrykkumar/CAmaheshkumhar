import { StyleService } from './../../style/style.service';
import { Select2Component } from 'ng2-select2';
import { ItemmasterServices } from 'src/app/commonServices/TransactionMaster/item-master.services';
import { SampleApprovalService } from './../sample-approval.service';
import { ToastrCustomService } from 'src/app/commonServices/toastr.service';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Settings } from 'src/app/shared/constants/settings.constant';
import { GlobalService } from 'src/app/commonServices/global.service';
import { UIConstant } from 'src/app/shared/constants/ui-constant';
import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import * as _ from 'lodash'
declare var $: any
declare var flatpickr: any

@Component({
  selector: 'app-add-sample-approval',
  templateUrl: './add-sample-approval.component.html',
  styleUrls: ['./add-sample-approval.component.css']
})
export class AddSampleApprovalComponent implements OnInit {
model: any = {
  SampleTypeId : '1'
};
@ViewChild('sampleApprovalFormModal') sampleApprovalFormModal
@ViewChild('shipMentBySelect') shipMentBySelect: Select2Component
@ViewChild('styleNoSelect') styleNoSelect: Select2Component
sampleShipmentByList: Array<any> = []
styleNumberListData: Array<any> = []
imageList: any = { images: [], queue: [], safeUrls: [], baseImages: [], id: [] }
ImageFiles: any = []
@Output() triggerCloseModal = new EventEmitter();

  constructor(
    public _globalService: GlobalService,
    public _settings: Settings,
    public _commonService: CommonService,
    private _toastService: ToastrCustomService,
    private sampleApprovalService: SampleApprovalService,
    private itemMaster: ItemmasterServices,
    private _styleService: StyleService
  ) {
    this.clientDateFormat = this._settings.dateFormat
  }
  date = () => {
    $('#ref-date').flatpickr({
      dateFormat: 'm/d/Y',
      onOpen: () => {
        this.model.date = ''
      }
    })
  }

  expectedDate = () => {
    $('#expected-date').flatpickr({
      dateFormat: 'm/d/Y',
      onOpen: () => {
        this.model.expectedReplyDate = ''
      }
    })
  }
  clientDateFormat: any;

  ngOnInit() {
    this.date();
    this.expectedDate();
    this.getFormUtilityData()
    this.getUploadedImages()
  }

  openModal(data?) {
    if(!_.isEmpty(data) && data.Id){
      this.assignFormData(data);
    }
    $('#sample_approval_form').modal(UIConstant.MODEL_SHOW)
  }

  closeModal(){
    $('#sample_approval_form').modal(UIConstant.MODEL_HIDE)    
  }

  onSampleShipMentByChange(event){
    if(event.data.length > 0){
      this.model['ShipmentById'] = event.value;
    }
  }

  onStyleNumberChange(event){
    if(event.data.length > 0){
      this.model['StyleId'] = event.value;
    }
  }

  async getFormUtilityData(){
    this.sampleShipmentByList = await this.sampleApprovalService.getShipmentByListData()
    this.styleNumberListData = await this._styleService.getStyleNumberListData()
  }

  preparePayload = () => {
    return new Promise((resolve, reject) => {
      const data = {
        Id: this.model.Id ? this.model.Id : 0,
        ExpectedReplyDate: this.model.ExpectedReplyDate ? this.model.ExpectedReplyDate : '',
        Reference: this.model.Reference ? this.model.Reference : '',
        Remark: this.model.Remark ? this.model.Remark : '',
        SampleDate: this.model.SampleDate ? this.model.SampleDate : 0,
        SampleTypeId: this.model.SampleTypeId,
        ShipmentById: this.model.ShipmentById ? this.model.ShipmentById : 0,
        ShipmentNo: this.model.ShipmentNo ? this.model.ShipmentNo : 0,
        Status: this.model.Status ? this.model.Status : true,
        ImageFiles: this.ImageFiles
      }
      if (this.model.SampleTypeId === '1') {
        data['StyleId'] = this.model.StyleId ? this.model.StyleId : 0
      } else {
        data['SampleNo'] = this.model.SampleNo ? this.model.SampleNo : 0
      }
      resolve(data)
    })
  }

  createImageFiles () {
    let ImageFiles = []
    for (let i = 0; i < this.imageList['images'].length; i++) {
      let obj = { Name: this.imageList['queue'][i], BaseString: this.imageList['safeUrls'][i], IsBaseImage: this.imageList['baseImages'][i], Id: this.imageList['id'][i] ? this.imageList['id'][i] : 0 }
      ImageFiles.push(obj)
    }
    this.ImageFiles = ImageFiles
  }

  assignFormData(Data) {
    if (Data && Data.ImageFiles && Data.ImageFiles.length > 0) {
      Data.ImageFiles.forEach(element => {
        this.imageList['queue'].push(element.Name)
        this.imageList['images'].push(element.FilePath)
        this.imageList['baseImages'].push(0)
        this.imageList['id'].push(element.Id)
      })
      this.createImageFiles();
    }
    this.model = {
      Id: Data.Id ? Data.Id : 0,
      ExpectedReplyDate: Data.ExpectedReplyDate ? Data.ExpectedReplyDate : '',
      Reference: Data.Reference ? Data.Reference : '',
      Remark: Data.Remark ? Data.Remark : '',
      SampleDate: Data.SampleDate ? Data.SampleDate : '',
      SampleNo: Data.SampleNo ? Data.SampleNo : 0,
      SampleTypeId: Data.SampleTypeId ? Data.SampleTypeId.toString() : '1',
      sampleShipmentByValue: Data.ShipmentById ? Data.ShipmentById : 0,
      ShipmentNo: Data.ShipmentNo ? Data.ShipmentNo : 0,
      Status: Data.Status ? Data.Status : '',
      styleNoValue: Data.StyleId ? Data.StyleId : 0
    }
  }

  openImageModal () {
    this.itemMaster.openImageModal(this.imageList)
  }
  getUploadedImages = () => {
    this.itemMaster.imageAdd$.subscribe((response)=> {
      this.imageList = response;
      this.createImageFiles()
    })
  }
  removeImage = (index) => {
    _.forIn(this.imageList, (value) => {
      value.splice(index, 1)
    })
    this.createImageFiles()
  }

 async saveOrUpdateSampleApproval(){
    const requestData = await this.preparePayload()
    this.sampleApprovalService.postSampleApprovalFormData(requestData).subscribe((res) => {
      if(res.Code === 1000) {
        this._toastService.showSuccess('success', 'Approval Saved Successfully')
        this.closeModal();
        this.triggerCloseModal.emit();
      } else {
        this._toastService.showError('Error', res.Message)
      }
    }) 
  }

  resetForm() {
    if (!_.isEmpty(this.styleNoSelect) && this.styleNoSelect.value && Number(this.styleNoSelect.value) > 0) {
      this.styleNoSelect.setElementValue(0);
    }
    if (!_.isEmpty(this.shipMentBySelect) && this.shipMentBySelect.value && Number(this.shipMentBySelect.value) > 0) {
      this.shipMentBySelect.setElementValue(0);
    }
    this.sampleApprovalFormModal.resetForm();
  }
}
