import { Component, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { Ledger } from '../../model/sales-tracker.model'
import { VendorServices } from '../../commonServices/TransactionMaster/vendoer-master.services'
import { UIConstant } from '../../shared/constants/ui-constant'
import { ToastrCustomService } from '../../commonServices/toastr.service'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css']
})
export class VendorComponent implements OnInit {
  subscribe: Subscription
  VendorDetailShow: Ledger[]
  deleteSub: Subscription
  constructor (private _vendorServices: VendorServices,
    private commonService: CommonService,
    private toastrService: ToastrCustomService) {
    this.deleteSub = this.commonService.getDeleteStatus().subscribe(
      (obj) => {
        if (obj.id && obj.type && obj.type === 'vendor') {
          this.deleteItem(obj.id)
        }
      }
    )
  }

  deleteItem (id) {
    if (id) {
      this._vendorServices.delteVendor(id).subscribe(Data => {
        if (Data.Code === UIConstant.DELETESUCCESS) {
          this.toastrService.showSuccess('Sucess', 'Deleted Successfully')
          this.commonService.closeDelete('')
          this.getAllVendorDetails()
          this.getVendorDetail()
        }
        if (Data.Code === UIConstant.CANNOTDELETERECORD) {
          this.toastrService.showInfo('Info', 'Can not deleted')
          this.commonService.closeDelete('')
        }
      })
    }
  }

  ngOnInit () {
    this.getVendorDetail()
    this.getAllVendorDetails()
  }
  getAllVendorDetails () {
    this._vendorServices.getvenderData.subscribe(Data => this.VendorDetailShow = Data)
  }
  getVendorDetail () {
    this.VendorDetailShow = []
    this.subscribe = this._vendorServices.getVendor(4).subscribe(Data => {
      if (Data.Code === UIConstant.THOUSAND) {
        this.VendorDetailShow = Data.Data
        console.log(Data.Data)
      }
    })
  }

  addNewVendor () {
    this.commonService.openVend('')
  }
  editVendor (id) {
    this.commonService.openVend(id)

  }
  openSearch: boolean = false
  toggleSearch () {
    this.openSearch = !this.openSearch
  }

  showDeletePopup (id) {
    this.commonService.openDelete(id, 'vendor')
  }
}
