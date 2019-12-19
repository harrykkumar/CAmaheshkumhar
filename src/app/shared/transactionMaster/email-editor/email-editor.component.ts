import { Component, ViewChild, OnInit, Renderer2 } from '@angular/core';
import { EmailEditorComponent } from 'angular-email-editor';
import { EmailEditorService } from '../../../transactionMaster/email-editor/email-editor.service';
import { Subscription } from 'rxjs';
import { UIConstant } from '../../constants/ui-constant';
import { ToastrCustomService } from '../../../commonServices/toastr.service';
import * as _ from 'lodash';
declare const $: any
@Component({
  selector: 'app-email-editor',
  templateUrl: './email-editor.component.html'
})
export class EmailEditorCustomComponent implements OnInit{
  editMode: boolean;
  editId: number = 0;
  categoryTypes: any = []
  options = {
  };
  designModal: any = {}
  destroy$: Subscription[] = []
  @ViewChild(EmailEditorComponent)
  private emailEditor: EmailEditorComponent;
  constructor(private _es: EmailEditorService, private _ts: ToastrCustomService, private renderer: Renderer2) {
    this.destroy$.push(this._es.open$.subscribe((data) => {
      if (data.open) {
        this.designModal = {
          Name: '',
          Type: 5,
          RawData: '',
          HtmlRawData: '',
          ContentCategoryId: 0,
          categoryValue: 0,
          Id: 0
        }
        if (+data.editId > 0 && data.data) {
          this.editMode = true
          this.editId = +data.editId
          let str = data.data.RawData
          let temp = str.replace(/\"/g, "");
          let temp1 = temp.replace(/\'/g, "\"");
          console.log(temp1)
          this.editorLoaded(temp1);
          this.designModal.Name = data.data.Name;
          this.designModal.Id = data.data.Id;
          this.designModal.categoryValue = data.data.ContentCategoryId;
          this.designModal.ContentCategoryId = data.data.ContentCategoryId;
        }
        this.openModal()
      } else {
        this.closeModal()
      }
    }))
  }

  ngOnInit() {
    this.getCategories()
  }

  getCategories() {
    this.destroy$.push(this._es.getContentCategories().subscribe(
      (data) => {
        console.log(data)
        let newData = [{id: '0', text: 'Select Category'}];
        data.forEach((element) => {
          newData.push({
            id: element.Id,
            text: element.Name
          })
        })
        this.categoryTypes = newData
      }
    ))
  }

  getTemplate (id) {
    this._es.getTemplate(id).subscribe((data) => {
      console.log(data)
    })
  }

  close() {
    this._es.closeEditor()
  }

  openModal() {
    $('#email_editor').modal(UIConstant.MODEL_SHOW)
  }

  closeModal () {
    $('#email_editor').modal(UIConstant.MODEL_HIDE)
  }

  exportHtml() {
    this.emailEditor.exportHtml((data: any) => {
      console.log('exportHtml', data);
      this.designModal.RawData = JSON.stringify(data.design.body)
      this.designModal.HtmlRawData = JSON.stringify(data.html)
      $('#save_file').modal(UIConstant.MODEL_SHOW)
    });
  }

  postDesign() {
    this.destroy$.push(this._es.postTemplate(this.designModal).subscribe((data) => {
      console.log(data)
      this._ts.showSuccess('Saved Successfully', '')
      this.closeFile()
      this.close()
      this._es.onAddDesign()
    },
    (error) => {
      this._ts.showErrorLong(error, '')
    }))
  }

  closeFile() {
    $('#save_file').modal(UIConstant.MODEL_HIDE)
  }

  editorLoaded(data) {
    if (!_.isEmpty(data)) {
      this.emailEditor.loadDesign(data);
    }
  }
  saveDesign() {
    this.emailEditor.saveDesign((data) => {
      console.log(JSON.stringify(data));
    });
  }

  validate() {
    let valid = 1
    if (!this.designModal.Name) valid = 0
    if (+this.designModal.ContentCategoryId <= 0) valid = 0 
    return !!valid
  }

  ngOnDestroy() {
    if (this.destroy$ && this.destroy$.length > 0) {
      this.destroy$.forEach((element) => {
        element.unsubscribe()
      })
    }
  }
}
