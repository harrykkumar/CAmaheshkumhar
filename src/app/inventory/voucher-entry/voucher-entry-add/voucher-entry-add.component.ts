import { Component, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { CommonService } from "src/app/commonServices/commanmaster/common.services";
import { takeUntil } from 'rxjs/internal/operators';
import { AddCust } from '../../../model/sales-tracker.model';
import { UIConstant } from '../../../shared/constants/ui-constant';
import { Select2OptionData, Select2Component } from 'ng2-select2';
import { PurchaseService } from '../../purchase/purchase.service';
import { Settings } from '../../../shared/constants/settings.constant';
import { GlobalService } from '../../../commonServices/global.service';
import { ToastrCustomService } from '../../../commonServices/toastr.service';
declare const $: any
@Component({
  selector: 'voucher-entry-add',
  templateUrl: './voucher-entry-add.component.html'
})
export class VoucherEntryAddComponent {
  onDestroy$ = new Subject()
  editMode: boolean;
  Id: number;
  creatingForm: boolean;
  clientDateFormat

  organisationsData: Array<Select2OptionData>
  OrgId: number
  organisationValue: number
  isBillNoManuall: boolean = false

  VoucherDate: string

  constructor (private commonService: CommonService, private purchaseService: PurchaseService,
     private settings: Settings, private gs: GlobalService, private toastrService: ToastrCustomService) {
    this.clientDateFormat = this.settings.dateFormat

    this.purchaseService.organisationsData$.pipe(takeUntil(this.onDestroy$)).subscribe(
      data => {
        if (data.data) {
          this.organisationsData = data.data
          if (this.organisationsData.length >= 1) {
            this.OrgId = +this.organisationsData[0].id
            this.organisationValue = +this.organisationsData[0].id
            if (this.isBillNoManuall) {
              this.VoucherDate = this.gs.getDefaultDate(this.clientDateFormat)
              this.getNewBillNo()
            }
          }
        }
      }
    )

    this.commonService.getVoucherStatus().pipe(takeUntil(this.onDestroy$)).subscribe(
      (status: AddCust) => {
        if (status.open) {
          if (status.editId !== '') {
            this.editMode = true
            this.Id = +status.editId
          } else {
            this.Id = UIConstant.ZERO
            this.editMode = false
            this.creatingForm = false
          }
          this.openModal()
        } else {
          this.closeModal()
        }
      }
    )
  }

  openModal() {
    setTimeout(() => {
      $('#voucher_modal').modal(UIConstant.MODEL_SHOW)
    }, 100)
  }
  closeModal() {
    if ($('#voucher_modal').length > 0) {
      $('#voucher_modal').modal(UIConstant.MODEL_HIDE)
    }
  }
  
  closeForm () {
    this.commonService.closePurchase()
  }

  @ViewChild('organisation_select2') organisationSelect2: Select2Component
  onChangeOrganisationId (evt) {
    // console.log('on org select : ', evt)
    if (evt.value && evt.data.length > 0) {
      if (evt.value > 0 && evt.data[0] && evt.data[0].text) {
        this.OrgId = +evt.value
        this.getNewBillNo()
      }
    }
  }

  previousVoucherNo: string
  VoucherNo: string
  getNewBillNo () {
    if (+this.OrgId > 0 && this.VoucherDate) {
      let newVoucherDate = this.gs.clientToSqlDateFormat(this.VoucherDate, this.clientDateFormat)
      let type = (this.isBillNoManuall) ? 2 : 1
      this.purchaseService.getNewBillNoPurchase(+this.OrgId, newVoucherDate, type).subscribe(
        data => {
          console.log('new bill no : ', data)
          if (data.Code === UIConstant.THOUSAND && data.Data) {
            if (data.Data.length > 0) {
              if (!this.isBillNoManuall) {
                this.VoucherNo = data.Data[0].VoucherNo
              } else {
                this.previousVoucherNo = data.Data[0].VoucherNo
              }
            } else {
              this.previousVoucherNo = ''
              this.VoucherNo = ''
            }
          } else {
            this.toastrService.showError(data.Message, '')
          }
        }
      )
    }
  }
}