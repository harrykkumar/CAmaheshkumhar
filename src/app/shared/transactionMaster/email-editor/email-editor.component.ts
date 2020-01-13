import { ApiConstant } from './../../constants/api';
import { BaseServices } from './../../../commonServices/base-services';
import { CommonService } from './../../../commonServices/commanmaster/common.services';
import { Component, ViewChild, OnInit, Renderer2, EventEmitter, Output } from '@angular/core';
import { EmailEditorComponent } from 'angular-email-editor';
import { EmailEditorService } from '../../../transactionMaster/email-editor/email-editor.service';
import { Subscription } from 'rxjs';
import { UIConstant } from '../../constants/ui-constant';
import { ToastrCustomService } from '../../../commonServices/toastr.service';
import * as _ from 'lodash';
declare const $: any
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-email-editor',
  templateUrl: './email-editor.component.html'
})
export class EmailEditorCustomComponent implements OnInit{
  @Output() closeModal = new EventEmitter();
  editMode: boolean;
  editId: number = 0;
  templateTypeData: any = []
  categoryData: Array<any> = []
  designModal: any = {}
  @ViewChild(EmailEditorComponent)
  private emailEditor: EmailEditorComponent;
  constructor(
    private _es: EmailEditorService,
    private _ts: ToastrCustomService,
    private renderer: Renderer2,
    private commonService: CommonService,
    private bs: BaseServices) {
    this.designModal.RawData = {}
    this.getTemplateType()
  }

  ngOnInit() {
  }

  getTemplateType() {
    this._es.getContentCategories().subscribe(
      (res) => {
        if (!this.commonService.isEmpty(res)) {
          this.templateTypeData = [...res]
        } else {
          this.templateTypeData = []
        }
      }
    )
  }

  openModal(item?) {
    this.commonService.openModal('save_file');
    if(!this.commonService.isEmpty(item)){
      this.assignFormData(item);
    }
  }

  closePopUp(data) {
    this.commonService.closeModal(data);
    this.closeModal.emit();
  }

  onEmailTypeSave(){
    this.commonService.closeModal('save_file');
    this.commonService.openModal('email_editor');
  }

  exportHtml() {
    this.emailEditor.exportHtml((data: any) => {
      this.designModal.RawData = JSON.stringify(data.design)
      this.designModal.HtmlRawData = data.html
      this.postDesign()
    });
  }

  preparePayload(){
    return {
      "Name": this.designModal.Name,
      "Type": this.designModal.ContentCategoryId ? this.designModal.ContentCategoryId : 0,
      "RawData": this.designModal.RawData ? this.designModal.RawData : '',
      "HtmlRawData": this.designModal.HtmlRawData ? this.designModal.HtmlRawData : '',
      "ContentCategoryId": this.designModal.categoryId ? this.designModal.categoryId : 0,
      // "categoryValue": this.designModal.ContentCategoryId ? this.designModal.ContentCategoryId : 0,
      "Id": this.designModal.Id ? this.designModal.Id : 0
    }
  }

  assignFormData(Data){
    this.designModal.RawData = JSON.parse(Data.RawData)
    this.designModal.Name = Data.Name;
    this.designModal.Id = Data.Id;
    this.designModal.categoryValue = Data.ContentCategoryId;
    this.designModal.ContentCategoryId = Data.ContentCategoryId;
  }

  postDesign() {
    this.bs.postRequest(ApiConstant.EMAIL_EDITOR, this.preparePayload()).subscribe((res) => {
      if (res.Code === 1000) {
        this._ts.showSuccess('Saved Successfully', '')
        const blob = new Blob([`${this.designModal.HtmlRawData}`], {type: "text/html;charset=utf-8"});
        saveAs(blob, `${this.designModal.Name}.html`);
        this.closePopUp('email_editor')
      } else {
        this._ts.showErrorLong(res.Message, '')
      }
    })
  }

  editorLoaded(e) {
    if (!this.commonService.isEmpty(this.designModal.RawData)) {
      this.emailEditor.loadDesign(this.designModal.RawData)
    }
  }
}
