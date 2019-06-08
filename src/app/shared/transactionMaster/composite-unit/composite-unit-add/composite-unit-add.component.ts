import { Component, ViewChild, OnDestroy, Renderer2 } from '@angular/core'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'
import { Subscription } from 'rxjs/Subscription'
import { Select2OptionData, Select2Component } from 'ng2-select2'
import { CompositeUnit, UnitModel, AddCust } from '../../../../model/sales-tracker.model'
import { CompositeUnitService } from '../../../../commonServices/TransactionMaster/composite-unit.services'
import { UnitMasterServices } from '../../../../commonServices/TransactionMaster/unit-mater.services'
import { ToastrCustomService } from '../../../../commonServices/toastr.service'
import { UIConstant } from '../../../constants/ui-constant'
import { ErrorConstant } from '../../../constants/error-constants'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'

declare const $: any
@Component({
  selector: 'app-composite-unit-add',
  templateUrl: './composite-unit-add.component.html',
  styleUrls: ['./composite-unit-add.component.css']
})
export class CompositeUnitAddComponent implements OnDestroy {

  modalSub: Subscription
  unitModalSub: Subscription
  id: any
  submitClick: boolean
  errorMassage: string
  primaryUnitId: number
  select2Primary: any
  select2Secondary: any
  primaryUnitQty: number = 1
  secondaryUnitId: any
  compositeForm: FormGroup
  primearyIdError: boolean
  subUnitDetail: UnitModel[]
  secondaryUnitIdError: boolean
  packedInPlaceHolder: Select2Options
  mainUnitPlaceHolder: Select2Options
  public selectPackedIn: Array<Select2OptionData>
  public selectMainUnit: Array<Select2OptionData>
  editMode: boolean = false
  UnitQty: FormControl
  UnitName: FormControl
  constructor (private _compositeUnitserivices: CompositeUnitService,
    private _formBuilder: FormBuilder,
    private _unitMasterServices: UnitMasterServices,
    private commonService: CommonService,
    private toastrService: ToastrCustomService,
    private renderer: Renderer2) {
    this.createCompositeForm()
    this.modalSub = this.commonService.getCompositeUnitStatus().subscribe(
      (data: AddCust) => {
        if (data.open) {
          if (data.editId !== '') {
            this.editMode = true
            this.id = data.editId
          } else {
            this.editMode = false
          }
          this.openModal()
        } else {
          this.closeModal()
        }
      }
    )
    this.unitModalSub = this.commonService.getUnitStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          console.log('primary unit : ', this.primaryUnitId)
          console.log('secondary unit : ', this.secondaryUnitId)
          if (+this.primaryUnitId === -1) {
            let newData1 = Object.assign([], this.selectMainUnit)
            newData1.push({ id: +data.id, text: data.name })
            this.selectMainUnit = newData1
            this.primaryUnitId = +data.id
            this.select2Primary = +data.id
            setTimeout(() => {
              if (this.mainUnitSelect2) {
                const element = this.renderer.selectRootElement(this.mainUnitSelect2.selector.nativeElement, true)
                element.focus({ preventScroll: false })
              }
            }, 2000)
          } else if (+this.secondaryUnitId === -1) {
            let newData = Object.assign([], this.selectPackedIn)
            newData.push({ id: +data.id, text: data.name })
            this.selectPackedIn = newData
            this.secondaryUnitId = +data.id
            this.select2Secondary = +data.id
            setTimeout(() => {
              if (this.packedInSelect2) {
                const element = this.renderer.selectRootElement(this.packedInSelect2.selector.nativeElement, true)
                element.focus({ preventScroll: false })
              }
            }, 2000)
          }
        }
      }
    )
  }
  get f () {
    return this.compositeForm.controls
  }

  ngOnDestroy () {
    this.unitModalSub.unsubscribe()
  }

  createCompositeForm () {
    this.UnitQty = new FormControl(0, [Validators.required])
    this.UnitName = new FormControl('', Validators.required)
    this.compositeForm = this._formBuilder.group({
      UnitQty: this.UnitQty,
      UnitName: this.UnitName
    })
  }

  openModal () {
    this.submitClick = false
    if (this.packedInSelect2) {
      this.packedInSelect2.setElementValue('')
    }
    if (this.mainUnitSelect2) {
      this.mainUnitSelect2.setElementValue('')
    }
    this.getPackedIn()
    if (this.editMode) {
      this.getCompositeEditData(this.id)
    } else {
      this.id = UIConstant.ZERO
      $('#composite_unit').modal(UIConstant.MODEL_SHOW)
      setTimeout(() => {
        if (this.packedInSelect2) {
          const element = this.renderer.selectRootElement(this.packedInSelect2.selector.nativeElement, true)
          element.focus({ preventScroll: false })
        }
      }, 1000)
    }
  }

  closeModal () {
    if ($('#composite_unit').length > 0) {
      this.id = UIConstant.ZERO
      this.editMode = false
      this.compositeForm.reset()
      $('#composite_unit').modal(UIConstant.MODEL_HIDE)
    }
  }

  getCompositeEditData (id) {
    this._compositeUnitserivices.getSubUnit(id).subscribe(data => {
      console.log('composite edit data : ', data)
      if (data.Code === UIConstant.THOUSAND && data.Data.length > 0) {
        this.compositeForm.controls.UnitQty.setValue(data.Data[0].SecondaryUnitQty)
        this.compositeForm.controls.UnitName.setValue(data.Data[0].Name)
        setTimeout(() => {
          this.primaryUnitId = data.Data[0].PrimaryUnitId
          this.secondaryUnitId = data.Data[0].SecondaryUnitId
          this.mainUnitSelect2.setElementValue(data.Data[0].PrimaryUnitId)
          this.packedInSelect2.setElementValue(data.Data[0].SecondaryUnitId)
        }, 1000)
        $('#composite_unit').modal(UIConstant.MODEL_SHOW)
      }
    })
  }
  onSaveComposite () {
    this.submitClick = true
    this.select2Validation()
    if (this.compositeForm.valid && this.secondaryUnitId > 0 && this.primaryUnitId > 0) {
      if ((+this.secondaryUnitId !== +this.primaryUnitId)) {
        this._compositeUnitserivices.addSubUnitId(this.subUnitParams()).subscribe(data => {
          if (data.Code === UIConstant.THOUSAND && data.Data) {
            const datatoSend = { id: data.Data, name: this.compositeForm.value.UnitName }
            this.commonService.newCompositeUnitAdd()
            this.toastrService.showSuccess('', 'Saved successfully')
            this.commonService.closeCompositeUnit(datatoSend)
          }
          if(data.Code === UIConstant.THOUSANDONE){
            this.toastrService.showInfo('', data.Description)

          }
          if(data.Code === UIConstant.SERVERERROR){
            this.toastrService.showInfo('', data.Description)

          }
        })
      } else {
        this.toastrService.showError('Packing Unit and Main Unit can\'t be same', '')
      }
    }
  }
  private subUnitParams (): CompositeUnit {
    const subUnitElement = {
      subUnitObj: {
        Id: this.id ? this.id : 0,
        Name: this.compositeForm.value.UnitName,
        MainUnitId: this.primaryUnitId,
        SubUnitId: this.secondaryUnitId,
        PrimaryUnitQty: 1,
        SubUnitQty: this.compositeForm.value.UnitQty
      } as CompositeUnit
    }
    return subUnitElement.subUnitObj
  }

  select2Validation () {
    if (+this.primaryUnitId > UIConstant.ZERO) {
      this.primearyIdError = false
    } else {
      this.primearyIdError = true
      this.errorMassage = ErrorConstant.REQUIRED
    }
    if (+this.secondaryUnitId > UIConstant.ZERO) {
      this.secondaryUnitIdError = false
    } else {
      this.secondaryUnitIdError = true
      this.errorMassage = ErrorConstant.REQUIRED
    }
  }

  getPackedIn () {
    this.packedInPlaceHolder = { placeholder: 'Select Packing-Unit' }
    let newData = [{ id: '0', text: 'Select Packing-Unit' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
    this.mainUnitPlaceHolder = { placeholder: 'Select MainUnit' }
    let newData1 = [{ id: '0', text: 'Select MainUnit' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
    this._unitMasterServices.getUnitType(1).subscribe((data) => {
      console.log('unit types : ', data)
      if (data.Code === UIConstant.THOUSAND) {
        data.Data.forEach(element => {
          newData.push({
            id: element.Id,
            text: element.Name
          })
          newData1.push({
            id: element.Id,
            text: element.Name
          })
        })
        this.selectPackedIn = newData
        this.selectMainUnit = newData1
      }
    })
  }

  @ViewChild('mainUnit_select2') mainUnitSelect2: Select2Component
  selectedMainUnit (event) {
    if (event.value && event.data.length > 0) {
      if (event.value === '-1' && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
        this.primaryUnitId = +event.value
        this.mainUnitSelect2.selector.nativeElement.value = ''
        this.commonService.openUnit('')
      } else {
        if (event.data[0] && event.data[0].text) {
          this.primaryUnitId = +event.value
        }
      }
      this.select2Validation()
    }
  }

  @ViewChild('packedIn_select2') packedInSelect2: Select2Component
  selectdPackedIn (event) {
    if (event.value && event.data.length > 0) {
      if (event.value === '-1' && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
        this.secondaryUnitId = +event.value
        this.packedInSelect2.selector.nativeElement.value = ''
        this.commonService.openUnit('')
      } else {
        if (event.data[0] && event.data[0].text) {
          this.secondaryUnitId = +event.value
        }
      }
      this.select2Validation()
    }
  }

  crossButton () {
    this.commonService.closeCompositeUnit('')
  }
}
