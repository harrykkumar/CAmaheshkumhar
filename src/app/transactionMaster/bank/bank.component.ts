import { Component, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { Ledger } from '../../model/sales-tracker.model'
import { VendorServices } from '../../commonServices/TransactionMaster/vendoer-master.services'
import { UIConstant } from '../../shared/constants/ui-constant'
import { ToastrCustomService } from '../../commonServices/toastr.service'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
declare const $: any

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent implements OnInit {
  subscribe: Subscription
  bankDetailShow: any
  deleteSub: Subscription
  bankgetListSub: Subscription
  constructor (private _vendorServices: VendorServices,
    private commonService: CommonService,
    private toastrService: ToastrCustomService) {
    this.deleteSub = this.commonService.getDeleteStatus().subscribe(
      (obj) => {
        if (obj.id && obj.type && obj.type === 'bank') {
          this.deleteItem(obj.id)
        }
      }
    )
    this.bankgetListSub = this.commonService.getLedgerStatus().subscribe(
      (obj) => {
        this.getbankDetail()
      }
    )
  }

  deleteItem (id) {
    if (id) {
      this.commonService.deleteBankDetails(id).subscribe(Data => {
        if (Data.Code === UIConstant.DELETESUCCESS) {
          this.toastrService.showSuccess(UIConstant.SUCCESS, UIConstant.DELETED_SUCCESSFULLY)
          this.commonService.closeDelete('')
          this.getbankDetail()
        }
        if (Data.Code === UIConstant.CANNOTDELETERECORD) {
          this.toastrService.showInfo(UIConstant.INFO, UIConstant.CANNOT_DELETE_DATA)
          this.commonService.closeDelete('')
        }
        if (Data.Code === UIConstant.SERVERERROR) {
          this.toastrService.showError(UIConstant.ERROR, Data.Message)
          this.commonService.closeDelete('')
        }
      })
    }
  }

  ngOnInit () {
    this.commonService.fixTableHF('cat-table')
    this.getbankDetail()
  }
 
  getbankDetail () {
    this.bankDetailShow = []
    this.subscribe = this.commonService.getBankList().subscribe(Data => {
      if (Data.Code === UIConstant.THOUSAND) {
        this.bankDetailShow = Data.Data
        console.log(Data.Data)
      }
    })
  }

  addNewBank () {
    this.commonService.openLedger('')
  }
  editVendor (id) {
    this.commonService.openLedger(id)

  }
  openSearch: boolean = false
  toggleSearch () {
    this.openSearch = !this.openSearch
  }

  showDeletePopup (id) {
    this.commonService.openDelete(id, 'bank')
  }
}
