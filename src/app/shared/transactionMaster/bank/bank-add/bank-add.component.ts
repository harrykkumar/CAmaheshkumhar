import { Component, Output, EventEmitter ,ViewChild } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Subscription } from 'rxjs'
import { BankPopUpServices } from '../../../../commonServices/bank-popup-services'
import { SaniiroCommonService } from '../../../../commonServices/SaniiroCommonService'
import { CommonSetGraterServices } from '../../../../commonServices/setgatter.services'
import { UIConstant } from '../../../constants/ui-constant'
import { Banks ,AddCust } from '../../../../model/sales-tracker.model'
import { ToastrCustomService } from '../../../../commonServices/toastr.service'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
import { Select2OptionData, Select2Component } from 'ng2-select2'
declare const $: any
@Component({
  selector: 'app-bank-add',
  templateUrl: './bank-add.component.html',
  styleUrls: ['./bank-add.component.css']
})
export class BankAddComponent {
  @Output() onFilter = new EventEmitter()
  bankForm: FormGroup
  subscribe: Subscription
  modalSub: Subscription
  Id: any
  submitClick: boolean
  editData: any
  public selectCrDr: Array<Select2OptionData>

  constructor (private _formBuilder: FormBuilder,
      private _bankServices: BankPopUpServices,
      private _sanriioSerivces: SaniiroCommonService,
      private _commonGaterSeterServices: CommonSetGraterServices,
      private commonService: CommonService,
      private toastrService: ToastrCustomService) {
    this.formBank()
    this.modalSub = this.commonService.getLedgerStatus().subscribe(
      (data: AddCust) => {
        if (data.open) {
          debugger
          if (data.editId === '') {
            this.editData = false
            this.Id = 0
          } else {
            this.editData = true
            this.Id = data.editId
          }
          this.submitClick = false
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
  CRDRType: any
  openModal () {
    this.select2CrDrValue(0)
// tslint:disable-next-line: no-multi-spaces
    $('#bankPopup').modal(UIConstant.MODEL_SHOW)
    if (this.editData) {
      this.edibankDetails(this.Id)
    } else {
      this.bankForm.reset()
      this.Ledgerid = 0
    }
  }
  edibankDetails (id) {
    if (id) {
      this.subscribe = this.commonService.getEditbankDetails(id).subscribe(data => {
        if (data.Code === 1000) {
          this.bankForm.controls.banName.setValue(data.Data[0].Name)
          this.bankForm.controls.accountNo.setValue(data.Data[0].AcNo)
          this.bankForm.controls.ifscCode.setValue(data.Data[0].IfscCode)
          this.bankForm.controls.branch.setValue(data.Data[0].Branch)
          this.bankForm.controls.micr.setValue(data.Data[0].MicrNo)
          this.bankForm.controls.openingbalance.setValue(data.Data[0].OpeningBalance)
          this.crDrSelect2.setElementValue(data.Data[0].Crdr)
          this.Ledgerid = data.Data[0].Ledgerid
        //  this.(data.Data[0].Crdr)
        }
      })
    }
  }
  @ViewChild('crdr_selecto2') crDrSelect2: Select2Component
  crDrId: any
  selectCRDRId (event) {
    this.CrDrRateType = event.value
  }
  closeModal () {
    $('#bankPopup').modal(UIConstant.MODEL_HIDE)
  }
  get f () { return this.bankForm.controls }
  private formBank () {
    this.bankForm = this._formBuilder.group({
      'banName': [UIConstant.BLANK, Validators.required],
      'accountNo': [UIConstant.BLANK, Validators.required],
      'ifscCode': [UIConstant.BLANK, Validators.required],
      'branch': [UIConstant.BLANK, Validators.required],
      'micr': [UIConstant.BLANK],
      'openingbalance' : [UIConstant.ZERO],
      'CrDrRateType' : [UIConstant.BLANK]
    })
  }

  valueCRDR: any
  select2CrDrValue (value) {
    this.selectCrDr = []
    this.selectCrDr = [{ id: '1', text: 'CR' }, { id: '0', text: 'DR' }]
    this.valueCRDR = value
  }
  addbank (type) {
    let _self = this
    this.submitClick = true
    if (this.bankForm.valid && this.bankForm.value.ifscCode !== null && this.bankForm.value.branch !== null && this.bankForm.value.banName !== null && this.bankForm.value.accountNo !== null && this.bankForm.value.ifscCode !== '' && this.bankForm.value.branch !== '' && this.bankForm.value.banName !== '' && this.bankForm.value.accountNo !== '') {
      this.subscribe = this._bankServices.saveBank(this.bankParams()).subscribe(data => {
        console.log(data)
        if (data.Code === UIConstant.THOUSAND) {
          let toSend = { name: _self.bankForm.value.banName, id: data.Data }
          _self.toastrService.showSuccess('Success', 'Bank Added')
          if (type === 'save') {
            _self.commonService.closeLedger(false,toSend)
          } else {
            _self.commonService.closeLedger(true,toSend)
            this.bankForm.reset()
          }
        }
        if (data.Code === 1001) {
          _self.toastrService.showInfo(UIConstant.INFO, data.Message)
        }
      })
    }
  }
  CrDrRateType: any
  Ledgerid: any
  private bankParams (): Banks {
    debugger
    const bankElement = {
      bankObj: {
// tslint:disable-next-line: no-multi-spaces
        Id: this.Id  !== 0 ? this.Id : 0 ,
        LedgerId: this.Ledgerid !== 0 ? this.Ledgerid : 0,
        Name: this.bankForm.value.banName,
        AcNo: this.bankForm.value.accountNo,
        Branch: this.bankForm.value.branch,
        MicrNo: this.bankForm.value.micr === null ? 0  :  this.bankForm.value.micr,
        IfscCode: this.bankForm.value.ifscCode,
        OpeningBalance  : this.bankForm.value.openingbalance === null ? 0  :  this.bankForm.value.openingbalance,
        Crdr : this.CrDrRateType ,
        ParentTypeId: 3
      } as Banks
    }
    return bankElement.bankObj
  }

}
