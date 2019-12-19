import { Component, ViewChild, OnDestroy, Renderer2, ElementRef } from '@angular/core';
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
  primaryUnitId: any
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
  keepOpen: boolean = false
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
          if (+this.primaryUnitId === -1) {
            let newData1 = Object.assign([], this.selectMainUnit)
            newData1.push({ id: +data.id, text: data.name })
          //  this.selectMainUnit = newData1
           this.selectPackedIn = newData1
            this.primaryUnitId = +data.id
          //  this.select2Primary = +data.id
            this.secondaryUnitId = +data.id
            this.select2Secondary = +data.id
            setTimeout(() => {
              if (this.mainUnitSelect2) {
                const element = this.renderer.selectRootElement(this.mainUnitSelect2.selector.nativeElement, true)
                element.focus({ preventScroll: false })
              }
            }, 2000)
          } else if (+this.secondaryUnitId === -1) {
            let newData = Object.assign([], this.selectPackedIn)
            newData.push({ id: +data.id, text: data.name })
           // this.selectPackedIn = newData
            this.secondaryUnitId = +data.id
           // this.select2Secondary = +data.id

            this.selectMainUnit = newData
            this.primaryUnitId = +data.id
            this.select2Primary = +data.id
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

  getResultValue (){
    if(this.primaryUnitId !=='0' && this.secondaryUnitId!=='0'){
      this.result = this.compositeForm.value.UnitQty+ ' ' + this.primaryName+' ' +'='+this.PrimaryUnitQty+ ' ' + this.secondaryUnitName
      this.compositeForm.controls.result.setValue(this.result) 
    }
    else{
      this.compositeForm.controls.result.setValue('') 

    }


  
  }
  result:any
  createCompositeForm () {
    this.UnitQty = new FormControl(1, [Validators.required])
    this.UnitName = new FormControl('', Validators.required)
    this.compositeForm = this._formBuilder.group({
      UnitQty: this.UnitQty,
      UnitName: this.UnitName,
      PrimaryUnitQty:this.PrimaryUnitQty,
      result:this.result
    })
  }
  PrimaryUnitQty:any =1
  onloading(){
    this.compositeForm.controls.PrimaryUnitQty.setValue(1)

  }
  openModal () {
    this.submitClick = false
    this.onloading()
    this.checkForValidation()
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
        if (this.mainUnitSelect2) {
          const element = this.renderer.selectRootElement(this.mainUnitSelect2.selector.nativeElement, true)
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
        this.compositeForm.controls.PrimaryUnitQty.setValue(data.Data[0].PrimaryUnitQty)
        setTimeout(() => {
          this.primaryUnitId = data.Data[0].PrimaryUnitId
          this.secondaryUnitId = data.Data[0].SecondaryUnitId
          this.mainUnitSelect2.setElementValue(data.Data[0].SecondaryUnitId)
          this.packedInSelect2.setElementValue(data.Data[0].PrimaryUnitId)
        }, 1000)
      this.getResultValue()
        $('#composite_unit').modal(UIConstant.MODEL_SHOW)
      }
    })
  }
  onSaveComposite () {
    this.submitClick = true
    this.dynamicFocus()
    if (this.checkForValidation() && this.compositeForm.valid && this.secondaryUnitId > 0 && this.primaryUnitId > 0) {
      if ((+this.secondaryUnitId !== +this.primaryUnitId)) {
        this._compositeUnitserivices.addSubUnitId(this.subUnitParams()).subscribe(data => {
          if (data.Code === UIConstant.THOUSAND && data.Data) {
            if (this.keepOpen) {
              this.initialiseExtras()
              this.toastrService.showSuccess('', 'Saved successfully')
              this.commonService.newCompositeUnitAdd()

            } else {
              const datatoSend = { id: data.Data, name: this.compositeForm.value.UnitName }
              this.commonService.newCompositeUnitAdd()
              this.toastrService.showSuccess('', 'Saved successfully')
              this.commonService.closeCompositeUnit(datatoSend)
              this.id =0
            }
          } else if(data.Code === UIConstant.THOUSANDONE){
            this.toastrService.showInfo('', data.Description)
          } else if(data.Code === UIConstant.SERVERERROR){
            this.toastrService.showInfo('', data.Description)
          } else {
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
        Name: this.compositeForm.value.UnitName.trim(),
        MainUnitId: this.primaryUnitId,
        SubUnitId: this.secondaryUnitId,
        PrimaryUnitQty: 1,
        SubUnitQty: this.compositeForm.value.UnitQty
      } as CompositeUnit
    }
    return subUnitElement.subUnitObj
  }

  validObj: any = {}
  @ViewChild('UnitQtyRef') UnitQtyRef :ElementRef
  dynamicFocus() {
    if (+this.secondaryUnitId > 0) {
      this.validObj['secondaryUnitId'] = false
    } else {
      this.validObj['secondaryUnitId'] = true
    this.mainUnitSelect2.selector.nativeElement.focus({ preventScroll: false })    
    }
    if (this.compositeForm.value.UnitName!=='') {
      this.validObj['UnitName'] = false
    } else if(  !this.validObj.secondaryUnitId) {
      this.validObj['UnitName'] = true
    this.unitnameRef.nativeElement.focus() 
    }
    if (this.compositeForm.value.PrimaryUnitQty!=='') {
      this.validObj['PrimaryUnitQty'] = false
    } else if(  !this.validObj.secondaryUnitId  && !this.validObj.UnitName ) {
      this.validObj['PrimaryUnitQty'] = true
    this.unitnameRef.nativeElement.focus() 
    }
    
    if (+this.primaryUnitId > 0) {
      this.validObj['primaryUnitId'] = false
    } else if(!this.validObj.secondaryUnitId  && !this.validObj.UnitName && !this.validObj.PrimaryUnitQty ) {
      this.validObj['primaryUnitId'] = true
    this.packedInSelect2.selector.nativeElement.focus({ preventScroll: false })    
    }
    if (this.compositeForm.value.UnitQty!=='') {
      this.validObj['UnitQty'] = false
    } else if(!this.validObj.secondaryUnitId  && !this.validObj.UnitName  && !this.validObj.PrimaryUnitQty   && !this.validObj.primaryUnitId)  {
      this.validObj['UnitQty'] = true
    this.UnitQtyRef.nativeElement.focus()    
    }

    
}
checkForValidation () {
  
  let isValid = 1
   {
    if (+this.primaryUnitId > 0) {
      this.validObj['primaryUnitId'] = false
    } else {
      this.validObj['primaryUnitId'] = true
      isValid = 0
    }
    if (+this.PrimaryUnitQty > 0) {
      this.validObj['PrimaryUnitQty'] = false
    } else {
      this.validObj['PrimaryUnitQty'] = true
      isValid = 0
    }
    if (+this.secondaryUnitId > 0) {
      this.validObj['secondaryUnitId'] = false
    } else {
      this.validObj['secondaryUnitId'] = true
      isValid = 0
    }
    if (+this.secondaryUnitId > 0) {
      this.validObj['secondaryUnitId'] = false
    } else {
      this.validObj['secondaryUnitId'] = true
      isValid = 0
    }
    if (this.compositeForm.value.UnitQty!=='') {
      this.validObj['UnitQty'] = false
    } else {
      this.validObj['UnitQty'] = true
      isValid = 0
    }
    if (this.compositeForm.value.UnitName!=='') {
      this.validObj['UnitName'] = false
    } else {
      this.validObj['UnitName'] = true
      isValid = 0
    }
    return !!isValid
  }
}

  
@ViewChild('unitnameRef') unitnameRef: ElementRef
  
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
  secondaryUnitName:any=''
  @ViewChild('mainUnit_select2') mainUnitSelect2: Select2Component
  selectedMainUnit (event) {
    if(event.value==='0'){
      this.secondaryUnitId  = '0'
      this.secondaryUnitName =''
    }
    if (event.value && event.data.length > 0) {
      if (event.value === '-1' && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
        this.secondaryUnitId  = +event.value
        this.secondaryUnitName =''

        this.mainUnitSelect2.selector.nativeElement.value = ''
        this.commonService.openUnit('')
      } else {
        if (event.value> 0 && event.data[0] && event.data[0].text) {
        this.secondaryUnitId  = +event.value
        this.secondaryUnitName =event.data[0].text

        }
      }
      this.getResultValue()
      this.checkForValidation()
    }
  }
  primaryName:any=''
  @ViewChild('packedIn_select2') packedInSelect2: Select2Component
  selectdPackedIn (event) {

    if(event.value==='0'){
      this.primaryUnitId  = '0'
      this.primaryName =''
    }
    if (event.value && event.data.length > 0) {
      if (event.value === '-1' && event.data[0] && event.data[0].text === UIConstant.ADD_NEW_OPTION) {
        this.primaryUnitId = +event.value
        this.primaryName =''
        this.packedInSelect2.selector.nativeElement.value = ''
        this.commonService.openUnit('')
      } else {
        if ( event.value >0 && event.data[0] && event.data[0].text) {
          this.primaryName =event.data[0].text
        this.primaryUnitId = +event.value

        }
      }
      this.getResultValue()
      this.checkForValidation()
    }
  }

  @ViewChild('first') first: ElementRef
  initialiseExtras () {
    this.id =0
    this.compositeForm.controls.UnitQty.setValue(1)
    this.compositeForm.controls.UnitName.setValue('')
    this.compositeForm.controls.result.setValue('')
    this.mainUnitSelect2.setElementValue(0)
    this.packedInSelect2.setElementValue(0)
    setTimeout(() => {
      this.mainUnitSelect2.selector.nativeElement.focus({ preventScroll: false })         
    }, 100)
  }

  crossButton () {
    this.commonService.closeCompositeUnit('')
  }
}
