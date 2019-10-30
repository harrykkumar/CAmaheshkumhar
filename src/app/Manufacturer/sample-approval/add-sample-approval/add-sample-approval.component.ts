import { Select2Component, Select2OptionData } from 'ng2-select2';
import { ItemmasterServices } from 'src/app/commonServices/TransactionMaster/item-master.services';
import { SampleApprovalService } from './../sample-approval.service';
import { ToastrCustomService } from 'src/app/commonServices/toastr.service';
import { Settings } from 'src/app/shared/constants/settings.constant';
import { GlobalService } from 'src/app/commonServices/global.service';
import { UIConstant } from 'src/app/shared/constants/ui-constant';
import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import * as _ from 'lodash';
import { AddCust } from '../../../model/sales-tracker.model';
import { CommonService } from '../../../commonServices/commanmaster/common.services';
import { ManufacturingService } from '../../manufacturing.service';
declare const $: any

@Component({
  selector: 'app-add-sample-approval',
  templateUrl: './add-sample-approval.component.html'
})
export class AddSampleApprovalComponent implements OnInit {
  model: any = {
    SampleTypeId : '1'
  };
  @ViewChild('sampleApprovalFormModal') sampleApprovalFormModal
  sampleShipmentByList: Array<Select2OptionData> = []
  styleNumberListData: Array<Select2OptionData> = []
  stageListData: Array<Select2OptionData> = []
  imageList: any = { images: [], queue: [], safeUrls: [], baseImages: [], id: [] }
  ImageFiles: any = []
  clientDateFormat: string = '';
  Id = 0
  loading = false
  constructor(
    public _gs: GlobalService,
    public _settings: Settings,
    private _ts: ToastrCustomService,
    private _ss: SampleApprovalService,
    private itemMaster: ItemmasterServices,
    private _cs: CommonService,
    private _ms: ManufacturingService,
    private renderer: Renderer2
  ) {
    this.clientDateFormat = this._settings.dateFormat
    this._ss.openSample$.subscribe((data: AddCust) => {
      if (data.open) {
        this.openModal()
        if (+data.editId > 0) {
          this.loading = true
          this.getEditData(+data.editId)
        }
      } else {
        this.closeModal()
      }
    })
    this._ss.select2List$.subscribe((data: any) => {
      console.log(data)
      if (data.data && data.title) {
        if (data.title === 'Style') {
          this.styleNumberListData = JSON.parse(JSON.stringify(data.data))
        }
        if (data.title === 'ShipmentBy') {
          this.sampleShipmentByList = JSON.parse(JSON.stringify(data.data))
        }
        if (data.title === 'Stage') {
          this.stageListData = JSON.parse(JSON.stringify(data.data))
        }
      }
    })

    this._cs.openCommonMenu$.subscribe(
      (data: AddCust) => {
        if (data.id && data.name && data.code) {
          if (data.code === 141) {
            let newData = Object.assign([], this.sampleShipmentByList)
            newData.push({ id: data.id, text: data.name })
            this.sampleShipmentByList = Object.assign([], newData)
            this.model.sampleShipmentByValue = +data.id
            setTimeout(() => {
              if (this.shipMentBySelect) {
                const element = this.renderer.selectRootElement(this.shipMentBySelect.selector.nativeElement, true)
                element.focus({ preventScroll: false })
              }
            }, 2000)
          }
          if (data.code === 187) {
            let newData = Object.assign([], this.stageListData)
            newData.push({ id: data.id, text: data.name })
            this.stageListData = Object.assign([], newData)
            this.model.stageValue = +data.id
            setTimeout(() => {
              if (this.stageSelect2) {
                const element = this.renderer.selectRootElement(this.stageSelect2.selector.nativeElement, true)
                element.focus({ preventScroll: false })
              }
            }, 2000)
          }
        }
      }
    )

    this._ms.openStyle$.subscribe((data: any) => {
      if (data.name && data.id) {
        let newData = Object.assign([], this.styleNumberListData)
        newData.push({ id: +data.id, text: data.name })
        this.styleNumberListData = newData
        this.model.styleNoValue = data.id
        setTimeout(() => {
          if (this.styleNoSelect) {
            const element = this.renderer.selectRootElement(this.styleNoSelect.selector.nativeElement, true)
            element.focus({ preventScroll: false })
          }
        }, 2000)
      }
    })
  }

  getEditData (id) {
    this._ss.getSampleEditData(id).subscribe(
      (data) => {
        console.log(data)
        this.loading = false
        this.assignFormData(data)
      },
      (error) => {
        this._ts.showErrorLong(error, '')
        this.loading = false
      }
    )
  }

  ngOnInit() {
    this.getUploadedImages()
  }

  openModal() {
    $('#sample_approval_form').modal(UIConstant.MODEL_SHOW)
  }

  closeModal(){
    $('#sample_approval_form').modal(UIConstant.MODEL_HIDE)
  }

  preparePayload = () => {
    return new Promise((resolve, reject) => {
      const data = {
        Id: this.model.Id ? this.model.Id : 0,
        ExpectedReplyDate: this.model.ExpectedReplyDate ? this._gs.clientToSqlDateFormat(this.model.ExpectedReplyDate, this.clientDateFormat) : '',
        Reference: this.model.Reference ? this.model.Reference : '',
        Remark: this.model.Remark ? this.model.Remark : '',
        SampleDate: this.model.SampleDate ? this._gs.clientToSqlDateFormat(this.model.SampleDate, this.clientDateFormat) : 0,
        SampleTypeId: this.model.SampleTypeId,
        ShipmentById: this.model.ShipmentById ? this.model.ShipmentById : 0,
        ShipmentNo: this.model.ShipmentNo ? this.model.ShipmentNo : 0,
        Status: this.model.Status ? this.model.Status : true,
        ImageFiles: this.ImageFiles,
        StageId: this.model.StageId
      }
      if (this.model.SampleTypeId === '1') {
        data['StyleId'] = this.model.StyleId ? this.model.StyleId : 0
      } else {
        data['SampleNo'] = this.model.SampleNo ? this.model.SampleNo : 0
      }
      resolve(data)
    })
  }

  assignFormData(data) {
    if (data && data.ImageContents && data.ImageContents.length > 0) {
      this.imageList = { images: [], queue: [], safeUrls: [], baseImages: [], id: [] }
      data.ImageContents.forEach(element => {
        this.imageList['queue'].push(element.Name)
        this.imageList['images'].push(element.FilePath)
        this.imageList['baseImages'].push(0)
        this.imageList['id'].push(element.Id)
        this.imageList['safeUrls'].push(element.FilePath)
      })
      this.createImageFiles();
    }
    if (data.SampleApprovals.length > 0) {
      this.model = {
        Id: data.SampleApprovals[0].Id,
        ExpectedReplyDate: data.SampleApprovals[0].ExpectedReplyDate ? this._gs.utcToClientDateFormat(data.SampleApprovals[0].ExpectedReplyDate, this.clientDateFormat) : '',
        Reference: data.SampleApprovals[0].Reference ? data.SampleApprovals[0].Reference : '',
        Remark: data.SampleApprovals[0].Remark ? data.SampleApprovals[0].Remark : '',
        SampleDate: data.SampleApprovals[0].SampleDate ? this._gs.utcToClientDateFormat(data.SampleApprovals[0].SampleDate, this.clientDateFormat) : '',
        SampleNo: data.SampleApprovals[0].SampleNo ? data.SampleApprovals[0].SampleNo : 0,
        SampleTypeId: data.SampleApprovals[0].SampleTypeId.toString(),
        sampleShipmentByValue: data.SampleApprovals[0].ShipmentById ? data.SampleApprovals[0].ShipmentById : 0,
        ShipmentNo: data.SampleApprovals[0].ShipmentNo ? data.SampleApprovals[0].ShipmentNo : 0,
        Status: data.SampleApprovals[0].Status ? data.SampleApprovals[0].Status : '',
        styleNoValue: data.SampleApprovals[0].StyleId ? data.SampleApprovals[0].StyleId : 0,
        stageValue: data.SampleApprovals[0].StageId ? data.SampleApprovals[0].StageId : 0
      }
    } else {
      this._ts.showErrorLong('Not getting enough data', '')
    }
  }

  createImageFiles () {
    let ImageFiles = []
    for (let i = 0; i < this.imageList['images'].length; i++) {
      let obj = { 
        Name: this.imageList['queue'][i],
        BaseString: this.imageList['safeUrls'][i],
        IsBaseImage: this.imageList['baseImages'][i],
        Id: this.imageList['id'][i] ? this.imageList['id'][i] : 0 
      }
      ImageFiles.push(obj)
    }
    this.ImageFiles = ImageFiles
    console.log(ImageFiles)
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
    this._gs.manipulateResponse(this._ss.postSampleApprovalFormData(requestData)).subscribe((res) => {
      this._ts.showSuccess('', 'Successfully Saved')
      this._ss.onSampleAdd()
      this._ss.closeSample()
    }, (error) => {
      this._ts.showErrorLong(error, '')
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

  @ViewChild('shipMentBySelect') shipMentBySelect: Select2Component
  @ViewChild('styleNoSelect') styleNoSelect: Select2Component
  @ViewChild('stageSelect2') stageSelect2: Select2Component
  onStageSelect (event) {
    this.model['StageId'] = +event.value
    if (this.model['StageId'] === -1) {
      this.stageSelect2.selector.nativeElement.value = ''
      this._cs.getCommonMenu(187).then((menudata) => {
        console.log(menudata)
        this._cs.openCommonMenu({'open': true, 'data': menudata, 'isAddNew': false})
      });
    }
  }

  onShipmentSelect(event){
    this.model['ShipmentById'] = +event.value
    if (this.model['ShipmentById'] === -1) {
      this.shipMentBySelect.selector.nativeElement.value = ''
      this._cs.getCommonMenu(141).then((menudata) => {
        console.log(menudata)
        this._cs.openCommonMenu({'open': true, 'data': menudata, 'isAddNew': false})
      });
    }
  }

  onStyleSelect(event){
    this.model['StyleId'] = +event.value
    if (this.model['StyleId'] === -1) {
      this.styleNoSelect.selector.nativeElement.value = ''
      this._ms.openStyle('', false)
    }
  }
}
