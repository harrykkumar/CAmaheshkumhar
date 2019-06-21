import { ToastrCustomService } from './../../../commonServices/toastr.service';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, OnChanges, Input, SimpleChanges, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
declare var $: any
import * as _ from 'lodash'


@Component({
  selector: 'app-add-common-menu',
  templateUrl: './add-common-menu.component.html',
  styleUrls: ['./add-common-menu.component.css']
})
export class AddCommonMenuComponent implements OnInit, OnChanges {
  @Input('addMenu') addMenu;
  @Output() closeCommonMenuForm = new EventEmitter();
  @ViewChild('commonMenuForm') formModal;
  @ViewChild('commonMenuName') commonMenuNameModal: ElementRef;
  formData: any = {};
  commonMenu : any = {};
  formUpdated: boolean;
  constructor(
    private commonService: CommonService,
    private toastr: ToastrCustomService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges){
    if(this.addMenu && this.addMenu.open === true) {
      if (!_.isEmpty(this.addMenu.data)) {
        this.formUpdated = false;
        $('#commonMenuName').focus();
        this.formData = { ...this.addMenu.data };
        this.commonMenu.CommonCode = this.formData.CodeId
        this.commonMenu.Id = 0
        if (this.addMenu.Id) {
          this.getEditFormData();
        }
        $('#common_menu_master').modal('show')
      }
    } else {
      $('#common_menu_master').modal('hide')
      this.resetForm();
    }
  }

  closeForm(data){
    this.closeCommonMenuForm.emit(data);
  }

  getEditFormData(){
    this.commonService.getCommonMenuDataList(this.commonMenu.CommonCode, this.addMenu.Id).subscribe((res) => {
      if(res.Code === 1000) {
        const data  = _.map(res.Data, (element) => {
          return {
            Id: element.Id,
            Name: element.CommonDesc,
            ShortName: element.ShortName,
            CommonCode: element.CommonCode
          }
        })
        this.commonMenu = {...data[0]};
      }
    })
  }

  submitFormData(data?){
    this.commonService.postCommonMenuFormData(this.commonMenu).subscribe((response)=> {
      if(response.Code === 1000) {
        this.toastr.showSuccess('Data Saved Successfully', 'success');
        this.formUpdated = true
        if(data === 'AddNew'){
          this.formModal.reset();
          this.commonMenu.Id = 0 
        } else {
          this.closeForm(this.formUpdated);
        }
      } else {
        this.toastr.showError(response.Description, 'error');
      }
    })
  }

  resetForm(){
    this.formModal.reset();
  }
}
