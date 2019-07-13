import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { ToastrCustomService } from 'src/app/commonServices/toastr.service';
import { StyleService } from './../style.service';
import { UIConstant } from 'src/app/shared/constants/ui-constant';
import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import * as _ from 'lodash'
declare var $: any
declare var flatpickr: any
@Component({
  selector: 'app-add-style',
  templateUrl: './add-style.component.html',
  styleUrls: ['./add-style.component.css']
})
export class AddStyleComponent implements OnInit {
  model: any = {}
  @ViewChild('styleForm') styleFormModel
  @Output() triggerCloseModal = new EventEmitter();
  constructor(
    public _commonService: CommonService,
    private _toastService: ToastrCustomService,
    private _styleService: StyleService
  ) { }

  ngOnInit() {
  }
  openModal(data?) {
    if(!_.isEmpty(data) && data.Id){
      this.assignFormData(data);
    }
    $('#add_style_form').modal(UIConstant.MODEL_SHOW)
  }

  closeModal(){
    $('#add_style_form').modal(UIConstant.MODEL_HIDE)   
    this.resetForm() 
  }

  assignFormData(Data) {
    this.model = {
      Id: Data.Id ? Data.Id : 0,
      styleName: Data.Name,
      styleNumber: Data.Code,
      Remark: Data.Remark
    }
  }

  
  preparePayload = () => {
    return new Promise((resolve, reject) => {
      const data = {
        Id: this.model.Id ? this.model.Id : 0,
        Name: this.model.styleName,
        ShortName: this.model.styleName,
        Code: this.model.styleNumber,
        LedgerId: 0,
        ItemId: 0,
        Remark: this.model.Remark
      }
      resolve(data)
    })
  }

  async saveOrUpdateStyle(){
    const requestData = await this.preparePayload()
    this._styleService.postStyleFormData(requestData).subscribe((res) => {
      if(res.Code === 1000) {
        this._toastService.showSuccess('Success', 'Style Added Successfully')
        this.closeModal();
        this.triggerCloseModal.emit();
      } else {
        this._toastService.showError('Error', res.Message)
      }
    }) 
  }

  resetForm() {
    this.styleFormModel.resetForm();
  }

}
