import { ToastrCustomService } from './../../../commonServices/toastr.service';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { GlobalService } from '../../../commonServices/global.service';
declare const $: any
@Component({
  selector: 'app-add-common-menu',
  templateUrl: './add-common-menu.component.html',
  styleUrls: ['./add-common-menu.component.css']
})
export class AddCommonMenuComponent implements OnInit {
  @Input('addMenu') addMenu;
  @Output() closeCommonMenuForm = new EventEmitter();
  @ViewChild('commonMenuForm') formModal;
  formData: any = {};
  commonMenu : any = {};
  formUpdated: boolean;
  isAddNew = true;
  constructor(
    private _gs: GlobalService,
    private commonService: CommonService,
    private toastr: ToastrCustomService) {
    this.commonService.openCommonMenu$.subscribe((data: any) => {
      console.log(JSON.stringify(data));
      if(data && data.open === true) {
        if (!_.isEmpty(data.data)) {
          this.formUpdated = false;
          this.formData = { ...data.data };
          this.commonMenu.CommonCode = this.formData.CodeId
          this.commonMenu.ShortName = ''
          this.commonMenu.Id = 0
          if (data.Id) {
            // this.addMenu.Id = data.Id
            this.getEditFormData(data.Id);
          }
          $('#common_menu_master').modal('show')
        }
        this.isAddNew = data.isAddNew
        setTimeout(() => {
          $('#commonMenuName').focus();
        }, 300);
      } else {
       this.closeModal()
      }
    })
  }
  ngOnInit() {
  }

  getEditFormData(id){
    this._gs.manipulateResponse(this.commonService.getCommonMenuDataList(this.commonMenu.CommonCode, id)).subscribe((res) => {
      const data  = _.map(res, (element) => {
        return {
          Id: element.Id,
          Name: element.CommonDesc,
          ShortName: element.ShortName,
          CommonCode: element.CommonCode
        }
      })
      this.commonMenu = {...data[0]};
    },
    (error) => {
      this.toastr.showError(error, '')
    })
  }

  submitFormData(data?){
    this._gs.manipulateResponse(this.commonService.postCommonMenuFormData(this.commonMenu)).subscribe((response)=> {
      if (response) {
        this.toastr.showSuccess('Sucessfully Saved Data', '');
        this.formUpdated = true
        if(data === 'AddNew'){
          this.resetForm()
          this.commonMenu.Id = 0
        } else {
          this.commonService.closeCommonMenu({ 'open': false, 'name': this.commonMenu.Name,
           'id': response, 'code': this.commonMenu.CommonCode})
          this.commonService.onCommonMenuAdd()
        }
      }
    }, (error) => {
      this.toastr.showError(error, '');
    })
  }

  closeModal () {
    $('#common_menu_master').modal('hide')
    this.resetForm();
  }

  close () {
    this.commonService.closeCommonMenu()
  }

  resetForm(){
    this.isAddNew = true
    if (this.formModal) this.formModal.reset();
  }
}
