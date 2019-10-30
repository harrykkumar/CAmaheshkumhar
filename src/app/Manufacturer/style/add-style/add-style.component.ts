import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { ToastrCustomService } from 'src/app/commonServices/toastr.service';
import { StyleService } from './../style.service';
import { UIConstant } from 'src/app/shared/constants/ui-constant';
import { Component, ViewChild, ElementRef } from '@angular/core';
import * as _ from 'lodash'
import { ManufacturingService } from '../../manufacturing.service';
import { AddCust } from '../../../model/sales-tracker.model';
declare const $: any
@Component({
  selector: 'app-add-style',
  templateUrl: './add-style.component.html',
  styleUrls: ['./add-style.component.css']
})
export class AddStyleComponent {
  model: any = {}
  @ViewChild('styleForm') styleFormModel;
  @ViewChild('first') first: ElementRef;
  constructor(
    public _commonService: CommonService,
    private _toastService: ToastrCustomService,
    private _styleService: StyleService,
    private _ms: ManufacturingService
  ) { 
    this._ms.openStyle$.subscribe((data: AddCust) => {
      if (data.open) {
        if (!_.isEmpty(data.editData)) {
          this.assignFormData(data.editData)
        }
        this.openModal()
      } else {
        this.closeModal()
      }
    })
  }

  openModal() {
    $('#add_style_form').modal(UIConstant.MODEL_SHOW)
    setTimeout(() => {
      $('styleName').focus()
    }, 100)
  }

  closeForm () {
    this._ms.closeStyle()
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
    return new Promise((resolve) => {
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
      if (res) {
        const dataToSend = {id: res, name: this.model.styleName}
        this._ms.onStyleAdd()
        this._toastService.showSuccess('', 'Style Added Successfully')
        this._ms.closeStyle(dataToSend);
        this.resetForm()
      }
    }, (error) => {
      this._toastService.showError(error, '')
    }) 
  }

  resetForm() {
    this.model = {}
    if (this.styleFormModel) this.styleFormModel.resetForm();
  }

}
