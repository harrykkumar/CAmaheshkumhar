import { Component, Output, EventEmitter, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Subscription } from 'rxjs/Subscription'
import { Select2OptionData, Select2Component } from 'ng2-select2'
import { TaxModal, AddCust } from '../../../model/sales-tracker.model'
import { ToastrCustomService } from '../../../commonServices/toastr.service'
import { TaxMasterService } from '../../../commonServices/TransactionMaster/tax-master.services'
import { CommonSetGraterServices } from '../../../commonServices/setgatter.services'
import { UIConstant } from '../../constants/ui-constant'
import { ErrorConstant } from '../../constants/error-constants'
import { TaxModule } from '../../../transactionMaster/tax/tax.module'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
import { SetUpIds } from '../../constants/setupIds.constant';
import { GlobalService } from '../../../commonServices/global.service'
import { Subject, forkJoin, throwError } from 'rxjs';
import { takeUntil, catchError, filter, map } from 'rxjs/operators';

declare var $: any
@Component({
  selector: 'app-tax-process-add',
  templateUrl: './tax-process-add.component.html',
  styleUrls: ['./tax-process-add.component.css']
})
export class TaxProcessAddComponent {
  @Output() onFilter = new EventEmitter()

  id: any
  type: any
  taxrates: any[]
  taxForm: FormGroup
  submitClick: boolean
  subscribe: Subscription
  editMode: boolean
  modalSub: Subscription
  keepOpen: boolean = false
  onDestroy$ = new Subject()

  constructor(public _globalService: GlobalService,
    public toastrCustomService: ToastrCustomService,
    private _taxMasterServices: TaxMasterService,
    private commonService: CommonService,
    private renderer: Renderer2
  ) {
    this.commonService.getTaxStatus().pipe(takeUntil(this.onDestroy$)).subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.taxSlabsData)
          newData.push({ id: data.id, text: data.name })
          this.taxSlabsData = newData
          if (this.TaxSlabId === -1) {
            this.TaxSlabId = +data.id
            this.taxSlabValue = data.id
            setTimeout(() => {
              if (this.taxSlabSelect2) {
                const element = this.renderer.selectRootElement(this.taxSlabSelect2.selector.nativeElement, true)
                element.focus({ preventScroll: false })
              }
            }, 2000)
          }
        }
      }
    )
    this.modalSub = this.commonService.getTaxProcessStatus().subscribe(
      (data: AddCust) => {
        if (data.open) {
          if (data.editId === '') {
            this.editMode = false
            this.id = 0
            this.editMainID = 0
          } else {
            this.editMode = true
            this.id = data.editId
            this.editMainID = data.editId
          }
          this.openModal()
        } else {
          this.closeModal()
        }
      }
    )
  }
  editMainID: any
  ngOnDestroy() {
    this.modalSub.unsubscribe()
    if (this.subscribe) {
      this.subscribe.unsubscribe()
    }
  }
  ApplyTypeID: any
  ApplyTypeName: any
  onSelectApply(evt) {
    if(this.applyTypeValue!==null){
      if (evt && evt.id) {
        this.ApplyTypeID = evt.id
        this.ApplyTypeName = evt.text
      }
    }
   

  }
  TaxParentId: any
  onTaxParentSelect(evt) {
    if (this.TaxParentIdValue !== null) {
      if (evt && evt.id) {
        this.TaxParentId = evt.id
      }
    }


  }

  taxprocessParentID: any = []
  getApplyTypeList: any = []
  getApplyType() {
    this._taxMasterServices.applyTypeForTaxProcess(149).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND && data.Data.length > 0) {
        this.getApplyTypeList = []
        data.Data.forEach(element => {
          this.getApplyTypeList.push({
            id: element.UId,
            text: element.CommonDesc
          })
        });
      }
    })
  }
  subUnitsValue: any
  description: any
  taxSlabValue: any
  taxSlabName: any
  TaxSlabId: any = 0
  onTaxSlabSelect(evt) {
    if (+evt.value === 0 && evt.data && evt.data[0] && evt.data[0].selected) {
      this.TaxSlabId = 0
      this.taxSlabName = ''
    }
    if (+evt.value === -1 && evt.data && evt.data[0] && evt.data[0].selected) {
      this.commonService.openTax('')
      this.taxSlabSelect2.selector.nativeElement.value = ''

    }
    else {
      if (evt.value > 0 && evt.data[0] && evt.data[0].text && evt.data && evt.data[0] && evt.data[0].selected) {
        this.TaxSlabId = +evt.value
        this.taxSlabName = evt.data[0].text
      }
    }
  }
  getTax() {
    this.commonService.getAllTax().subscribe(resp => {
      this.taxSlabsData = [{ id: 0, text: 'Select Tax' }, { id: -1, text: '+Add New' }]
      if (resp.Code === UIConstant.THOUSAND) {
        if (resp.Data && resp.Data.TaxSlabs && resp.Data.TaxSlabs.length > 0) {
          resp.Data.TaxSlabs.forEach(element => {
            this.taxSlabsData.push({
              id: element.Id,
              text: element.Slab
            })
          });
        }
      }
    })
  }
  onloading() {
    this.iniItem()
    this.taxTypeList = []
    this.description = ''
    this.taxProcessName = ''
    this.getTax()
    this.getApplyType()
    this.taxprocessParentID = [{ id: 0, text: '0' }]
    this.showHideAddItemRow = true

  }
  DisabledRow: boolean = true
  iniItem() {
    this.TaxParentId = 0
    this.TaxSlabId = 0
    this.taxSlabName = ''
    this.ApplyTypeID = 0
    this.applyTypeValue = null
    this.ApplyTypeName = ''
    if(this.taxSlabSelect2){
      this.taxSlabSelect2.setElementValue(0)

    }
    this.DisabledRow = true
  }
  Sno:any
  editItem(i, id, type, sno, ) {
    // this.showHideAddItemRow = false
    // this.taxTypeList[i].isDisabled = false
    // this.DisabledRow = true
    // this.id = this.taxTypeList[i].Id
    // this.Sno = this.taxTypeList[i].Sno
    // this.taxprocessParentID = this.taxTypeList[i].TaxProcessId
    // this.taxSlabName = this.taxTypeList[i].TaxSalbName
    // this.ApplyTypeID = this.taxTypeList[i].ApplyType
    // this.ApplyTypeName = this.taxTypeList[i].ApplyTypeName
  }
  TaxParentIdValue: any
  applyTypeValue: any
  @ViewChild('taxSlab_select2') taxSlabSelect2: Select2Component
  addItems() {
    if (this.TaxSlabId > 0 && this.ApplyTypeID > 0) {
      let Sno = 0
      if (this.taxTypeList.length === 0) {
        Sno = 1
      }
      else {
        Sno = this.taxTypeList[this.taxTypeList.length - 1].Sno + 1
      } 
      this.taxTypeList.push({
        Id: this.id === 0 ? 0 : this.id,
        Sno: Sno,
        TaxProcessId: this.TaxParentId,
        TaxId: this.TaxSlabId,
        TaxSalbName: this.taxSlabName,
        ApplyType: this.ApplyTypeID,
        ApplyTypeName: this.ApplyTypeName,
        isDisabled: this.DisabledRow,
      })
      let newData = Object.assign([], this.taxprocessParentID)
      newData.push({ id: Sno, text: JSON.stringify(Sno) })
      this.taxprocessParentID = newData
      this.iniItem()
    }

    console.log(this.taxprocessParentID)
  }
  getAllTax
  taxSlabsData: any = []
  openModal() {
    this.onloading()
    this.clearValidation()
    if (this.editMode) {
      this.getTaxEditData(this.id)
    }
    this.submitClick = false
    $('#tax_process_tax').modal(UIConstant.MODEL_SHOW)

  }
  taxTypeList: any = []
  @ViewChild('taxtype_select2') taxtypeSelect2: Select2Component
  closeModal() {
    this.clearValidation()
    $('#tax_process_tax').modal(UIConstant.MODEL_HIDE)
  }
  clearValidation() {
    this.taxProcessName = ''
    this.description = ''
    this.taxTypeList = []
    this.submitClick = false
    this.iniItem()
  }


  taxErrMsg: any
  taxErrorFlag: any
  taxErrormass: any
  taxType: any
  getTaxEditData(id) {
    this.DisabledRow = true
    this._taxMasterServices.editTaxProcess(id).subscribe(data=>{

    })

  }
  taxProcessName: any
  TypeUid: any

  @ViewChild('first') first: ElementRef
  addTax() {
    this.submitClick = true
    if (this.taxTypeList.length > 0 && this.taxProcessName !== '') {
      this._taxMasterServices.addTaxProcess(this.taxParams()).subscribe(Data => {
        if (Data.Code === UIConstant.THOUSAND) {
          if (this.keepOpen) {
            let savename = this.editMainID === 0 ? UIConstant.SAVED_SUCCESSFULLY : UIConstant.UPDATE_SUCCESSFULLY
            this.toastrCustomService.showSuccess('', savename)
            this.commonService.newTaxAdded()
            this.clearValidation()
            this.id = 0
          } else {
            const dataToSend = { id: Data.Data, name: this.taxProcessName }
            this.commonService.newTaxAdded()
            this.commonService.closeTaxProcess(dataToSend)
            let savename = this.editMainID === 0 ? UIConstant.SAVED_SUCCESSFULLY : UIConstant.UPDATE_SUCCESSFULLY

            this.toastrCustomService.showSuccess('', savename)
          }
        }
        if (Data.Code === UIConstant.THOUSANDONE) {
          this.toastrCustomService.showInfo('', Data.Description)
        }
        if (Data.Code === UIConstant.SERVERERROR) {
          this.toastrCustomService.showInfo('', Data.Description)
        }
        if (Data.Code === UIConstant.REQUIRED_5020) {
          this.toastrCustomService.showError('', Data.Data)

        }
      })



    }
  }

  private taxParams() {
    const taxElement = {
      taxObj: {
        Id: this.id === 0 ? 0 : this.editMainID,
        Name: this.taxProcessName,
        Description: this.description,
        TaxFormats: this.taxTypeList
      }
    }
    console.log(JSON.stringify(taxElement.taxObj), 'tax-Request')
    return taxElement.taxObj
  }
  showHideAddItemRow: any = true



  deleteItem(i, type, sno) {
    if (this.taxTypeList.length > 0) {
      this.taxTypeList.splice(i, 1)
      this.taxprocessParentID.splice(i,1)

    }
  }
  ParentTypeId: 5
  CodeId: any
  editFlg: boolean = true
  //isDisabled: this.DisabledRow,
  


  checkBoxYes: boolean


  @ViewChild('checkBtn_focs') CheckButton

}
