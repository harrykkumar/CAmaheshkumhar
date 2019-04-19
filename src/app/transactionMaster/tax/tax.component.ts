import { Component, OnInit } from '@angular/core'
import { Subscription } from 'rxjs/Subscription'
import { FormGroup } from '@angular/forms'
import { TaxModal } from '../../model/sales-tracker.model'
import { Select2OptionData } from 'ng2-select2'
import { ToastrCustomService } from '../../commonServices/toastr.service'
import { TaxMasterService } from '../../commonServices/TransactionMaster/tax-master.services'
import { UIConstant } from '../../shared/constants/ui-constant'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';

declare const $: any
@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.css']
})
export class TaxComponent implements OnInit {

  modalSub: Subscription
  deleteSub: Subscription
  id: number
  type: number
  deafaultValue: any
  taxrates: any[]
  addPulsSign: any
  plusValue: number
  taxForm: FormGroup
  errorMassage: string
  submitClick: boolean
  select2Error: boolean
  taxDetail: TaxModal[]
  subscribe: Subscription
  selectTaxTypePlaceHolde: Select2Options
  public selectTaxTpye: Array<Select2OptionData>
  fillingTaxRate: any[]
  // taxboxDivVisibale: boolean
  // subCatagoryPopup: boolean
  constructor (public toastrCustomService: ToastrCustomService ,private _taxMasterServices: TaxMasterService,
    private commonService: CommonService) {
    this.modalSub = this.commonService.getTaxAddStatus().subscribe(
      (obj) => {
        this.getTaxDetail()
      }
    )
    this.deleteSub = this.commonService.getDeleteStatus().subscribe(
      (obj) => {
        if (obj.id && obj.type && obj.type === 'tax') {
          this.deleteItem(obj.id)
        }
      }
    )
  }

  deleteItem (id) {
    if (id) {
      this._taxMasterServices.deleteTax(id).subscribe(Data => {
        if (Data.Code === UIConstant.DELETESUCCESS) {
          this.getTaxDetail()
          this.toastrCustomService.showSuccess('Success','deleted successfully')
          this.commonService.closeDelete('')
        }
        if (Data.Code === UIConstant.CANNOTDELETERECORD) {
          this.toastrCustomService.showInfo('Info','Can not deleted !')
          this.commonService.closeDelete('')
        }
      })
    }
  }

  ngOnInit () {
    this.taxrates = []
    this.taxDetail = []
    this.getTaxDetail()
    this.addPulsSign = []
  }

  getTaxDetail () {
    this.subscribe = this._taxMasterServices.getTaxDetail().subscribe(Data => {
      console.log('tax data : ', Data)
      this.taxDetail = []
      this.fillingTaxRate = []
      if (Data.Code === UIConstant.THOUSAND) {
        if (Data.Data && Data.Data.TaxSlabs) {
          this.taxDetail = Data.Data.TaxSlabs
          this.fillingTaxRate = Data.Data.TaxRates
        }
      }
    })
  }

  addtax () {
    this.commonService.openTax('')
  }
  editTax (id) {
    this.commonService.openTax(id)
  }
  selectedTaxType (event) {
    this.type = event.value
    this.select2Error = false
  }

  deletePopup (id, name) {
    this.commonService.openDelete(id, name)
  }

}
