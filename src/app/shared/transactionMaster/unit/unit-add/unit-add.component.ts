import { Component, ViewChild, Renderer2, ElementRef } from '@angular/core'
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms'
import { UnitModel, AddCust, ResponseUnit } from '../../../../model/sales-tracker.model'
import { Subscription } from 'rxjs/Subscription'
import { ToastrCustomService } from '../../../../commonServices/toastr.service'
import { UnitMasterServices } from '../../../../commonServices/TransactionMaster/unit-mater.services'
import { UIConstant } from '../../../constants/ui-constant'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'

declare const $: any
@Component({
  selector: 'app-unit-add',
  templateUrl: './unit-add.component.html',
  styleUrls: ['./unit-add.component.css']
})
export class UnitAddComponent {
  id: any
  unitForm: FormGroup
  UnitName: FormControl
  unitDetails: UnitModel[]
  submitClick: boolean
  modalSub: Subscription
  editMode: boolean = false
  keepOpen: boolean = false
  editID:any
  constructor (public toastrCustomService: ToastrCustomService,
    private _unitmasterServices: UnitMasterServices,
    private _formBuilder: FormBuilder,
    private commonService: CommonService,
    private renderer: Renderer2
    ) {
    this.modalSub = this.commonService.getUnitStatus().subscribe(
      (data: AddCust) => {
        if (data.open) {
          if (data.editId !== '') {
            this.editMode = true
            this.id = data.editId
            this.editID =data.editId
          } else {
            this.editID =0

            this.editMode = false
          }
          this.openModal()
        } else {
          this.closeModal()
        }
      }
    )
  }

  ngOnDestroy () {
    this.modalSub.unsubscribe()
  }
  get f () {
    return this.unitForm.controls
  }
  formValue: ResponseUnit = {}
  getEditUnit (id) {
    this._unitmasterServices.getUnit(id).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND && data.Data.length > 0) {
        this.unitForm.controls.UnitName.setValue(data.Data[0].Name)
        //this.unitForm.controls.IsBaseUnit.setValue(data.Data[0].IsBaseUnit)
        this.unitForm.controls.UnitName.markAsDirty()
      }
    })
  }

  @ViewChild('first') first: ElementRef
  openModal () {
    if (this.editMode) {
      this.getEditUnit(this.id)
    } else {
      this.submitClick = false
      this.id = UIConstant.ZERO
    }
    this.unitFormDetail()
    $('#unit_master').modal(UIConstant.MODEL_SHOW)
    setTimeout(() => {
      if (this.first) {
        const element = this.renderer.selectRootElement(this.first.nativeElement, true)
        element.focus({ preventScroll: false })
      }
    }, 500)
  }

  closeModal () {
    if ($('#unit_master').length > 0) {
      this.id = UIConstant.ZERO
      this.editMode = false
      if (this.unitForm) {
        this.unitForm.reset()
      }
      $('#unit_master').modal(UIConstant.MODEL_HIDE)
    }
  }

  private unitFormDetail () {
    this.UnitName = new FormControl('', Validators.compose([Validators.required, Validators.minLength(2)]))
    this.unitForm = this._formBuilder.group({
      UnitName: this.UnitName
    })
  }

  private unitParmas (): UnitModel {
    const unitElement = {
      unitObj: {
        IsBaseUnit: this.unitForm.value.IsBaseUnit,
        UnitName: this.unitForm.value.UnitName.trim(),
        Id: this.id ? this.id : 0
      } as UnitModel
    }
    console.log('obj : ', JSON.stringify(unitElement.unitObj))
    return unitElement.unitObj
  }

  onButtonSaveUnit () {
    this.submitClick = true
    if (this.unitForm.valid) {
      this._unitmasterServices.addUnit(this.unitParmas()).subscribe(data => {
        if (data.Code === UIConstant.THOUSAND && data.Data) {
          if (this.keepOpen) {
            this.initialiseExtras()
            this.commonService.newUnitAdded()
            this.toastrCustomService.showSuccess('',UIConstant.SAVED_SUCCESSFULLY)
          } else {
            this.commonService.newUnitAdded()
            let saveName = this.editID===0 ?UIConstant.SAVED_SUCCESSFULLY : UIConstant.UPDATE_SUCCESSFULLY
            this.toastrCustomService.showSuccess('',saveName)
            const datatoSend = { id: data.Data, name: this.unitForm.value.UnitName }
            this.commonService.closeUnit(datatoSend)
          }
        } else {
          this.toastrCustomService.showError('', data.Message)
        }
      })
    }
  }

  initialiseExtras () {
    this.unitForm.controls.UnitName.setValue('')
    setTimeout(() => {
      if (this.first) {
        const element = this.renderer.selectRootElement(this.first.nativeElement, true)
        element.focus({ preventScroll: false })
      }
    }, 10)
  }

  closeButton () {
    this.unitForm.reset()
  }

}
