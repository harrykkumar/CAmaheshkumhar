import { Component, Output, EventEmitter } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Subscription } from 'rxjs'
import { BankPopUpServices } from '../../../../commonServices/bank-popup-services'
import { SaniiroCommonService } from '../../../../commonServices/SaniiroCommonService'
import { CommonSetGraterServices } from '../../../../commonServices/setgatter.services'
import { UIConstant } from '../../../constants/ui-constant'
import { Banks } from '../../../../model/sales-tracker.model'
import { ToastrCustomService } from '../../../../commonServices/toastr.service'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
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
  constructor (private _formBuilder: FormBuilder,
      private _bankServices: BankPopUpServices,
      private _sanriioSerivces: SaniiroCommonService,
      private _commonGaterSeterServices: CommonSetGraterServices,
      private saleService: CommonService,
      private toastrService: ToastrCustomService) {
    this.formBank()
    this.modalSub = this.saleService.getLedgerStatus().subscribe(
      (status: any) => {
        if (status.open) {
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

  openModal () {
    $('#bankPopup').modal(UIConstant.MODEL_SHOW)
  }

  closeModal () {
    $('#bankPopup').modal(UIConstant.MODEL_HIDE)
  }

  private formBank () {
    this.bankForm = this._formBuilder.group({
      'banName': [UIConstant.BLANK, Validators.required],
      'accountNo': [UIConstant.BLANK, Validators.required],
      'ifscCode': [UIConstant.BLANK, Validators.required],
      'branch': [UIConstant.BLANK, Validators.required],
      'micr': [UIConstant.BLANK]
    })
  }

  addbank () {
    let _self = this
    if (this.bankForm.valid) {
      this.subscribe = this._bankServices.saveBank(this.bankParams()).subscribe(data => {
        console.log(data)
        if (data.Code === UIConstant.THOUSAND) {
          this._commonGaterSeterServices.setClientName(0)
          this._commonGaterSeterServices.setVendorName(0)
          this._commonGaterSeterServices.setTax(0)
          this._commonGaterSeterServices.setRoutingName(0)
          this._commonGaterSeterServices.setbankName(data.Data.data)
          this._sanriioSerivces.filter()
          let toSend = { name: _self.bankForm.value.banName, id: data.Data }
          _self.toastrService.showSuccess('Success', 'Bank Added')
          _self.saleService.closeLedger(toSend)
        }
      })
    }
  }

  private bankParams (): Banks {
    const bankElement = {
      bankObj: {
        Id: 0,
        Name: this.bankForm.value.banName,
        AcNo: this.bankForm.value.accountNo,
        Branch: this.bankForm.value.branch,
        MicrNo: this.bankForm.value.micr,
        IfscCode: this.bankForm.value.ifscCode,
        ParentTypeId: 3
      } as Banks
    }
    return bankElement.bankObj
  }
}
