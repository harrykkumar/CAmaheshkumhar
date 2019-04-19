import { Component, OnInit } from '@angular/core'
import { UIConstant } from '../../shared/constants/ui-constant'
import { Subscription } from 'rxjs'
import { Ledger } from '../../model/sales-tracker.model'
import { VendorServices } from '../../commonServices/TransactionMaster/vendoer-master.services'
import { ToastrCustomService } from '../../commonServices/toastr.service'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  coustomerDetails: Ledger[]
  deleteSub: Subscription
  subscribe: Subscription
  constructor (private _coustomerServices: VendorServices,
    private commonService: CommonService,
    private toastrService: ToastrCustomService) {
    this.deleteSub = this.commonService.getDeleteStatus().subscribe(
      (obj) => {
        if (obj.id && obj.type && obj.type === 'customer') {
          this.deleteItem(obj.id)
        }
      }
    )
  }

  deleteItem (id) {
    if (id) {
      this._coustomerServices.delteVendor(id).subscribe(Data => {
        console.log('Delete customer : ', Data)
        if (Data.Code === UIConstant.DELETESUCCESS) {
          this.toastrService.showSuccess('Sucess', 'Deleted Successfully')
          this.commonService.closeDelete('')
          this.getCustomerDetail()
          this.getAllCustomerData()
          // if (data.Code === 1000 && data.Data === '-1') {
          // this.toastrService.showInfo('Info', 'Please check mapping Data')
          // }
        } else if (Data.Code === UIConstant.NORECORDFOUND) {
          this.toastrService.showError('FAILED', 'RECORD ALREADY DELETED PLEASE REFRESH THE PAGE')
        } else if (Data.Code === UIConstant.CANNOTDELETERECORD) {
          this.toastrService.showInfo('INFO', Data.Message)
        }
      })
    }
  }

  ngOnInit () {
    this.coustomerDetails = []
    this.getCustomerDetail()
    this.getAllCustomerData()
  }
  getAllCustomerData () {
    this._coustomerServices.getCustomerData.subscribe(Data =>
      this.coustomerDetails = Data
      )
  }
  ngOnDestroy () {
    this.subscribe.unsubscribe()
  }

  addnewCoustomer () {
    this.commonService.openCust('')
  }
  editCoustomer (editid) {
    this.commonService.openCust(editid)
  }

  openSearch: boolean = false
  toggleSearch () {
    this.openSearch = !this.openSearch
  }

  getCustomerDetail () {
    this.coustomerDetails = []
    this.subscribe = this._coustomerServices.getVendor(5).subscribe(Data => {
      console.log('customers : ', Data)
      if (Data.Code === UIConstant.THOUSAND) {
        this.coustomerDetails = Data.Data
      }
    })
  }

  delteCustomerPopup (id) {
    this.commonService.openDelete(id, 'customer')
  }
}
