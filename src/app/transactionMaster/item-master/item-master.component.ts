import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { UIConstant } from '../../shared/constants/ui-constant'
import { ItemModel } from 'src/app/model/sales-tracker.model'
import { ItemmasterServices } from '../../commonServices/TransactionMaster/item-master.services'
import { ToastrCustomService } from '../../commonServices/toastr.service'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
declare var $: any

@Component({
  selector: 'app-item-master',
  templateUrl: './item-master.component.html',
  styleUrls: ['./item-master.component.css']
})
export class ItemMasterComponent implements OnInit, OnDestroy {
  itemDetail: ItemModel[]
  deleteSub: Subscription
  addItemSub: Subscription
  constructor (private _itemmasterServices: ItemmasterServices,
    private commonService: CommonService,
    private toastrService: ToastrCustomService) {
    this.deleteSub = this.commonService.getDeleteStatus().subscribe(
      (obj) => {
        if (obj.id && obj.type && obj.type === 'itemMaster') {
          this.deleteItem(obj.id)
        }
      }
    )
    this.addItemSub = this.commonService.addItemMasterSub().subscribe(
      (obj) => {
        this.getItemMasterDetail()
      }
    )
  }

  ngOnInit () {
    this.itemDetail = []
    this.getItemMasterDetail()
  }

  deleteItem (id) {
    this.commonService.openDelete(id, 'itemMaster')
    if (id) {
      this._itemmasterServices.deleteItem(id).subscribe(data => {
        if (data.Code === UIConstant.DELETESUCCESS) {
          this.toastrService.showSuccess('Sucess', 'Deleted Successfully')
          this.commonService.closeDelete('')
          this.getItemMasterDetail()
        }
        if (data.Code === UIConstant.CANNOTDELETERECORD) {
          this.toastrService.showInfo('Info', 'Can not deleted !')
          this.commonService.closeDelete('')
        }
      })
    }
  }
  getItemMasterDetail () {
    this._itemmasterServices.getItemMasterDetail().subscribe(data => {
      console.log('item master : ', data)
      if (data.Code === UIConstant.THOUSAND) {
        this.itemDetail = data.Data
      }
    })
  }

  addItemMaster () {
    this.commonService.openItemMaster('')
  }

  openSearch = false
  toggleSearch () {
    this.openSearch = !this.openSearch
  }

  onOpenItemMaster () {
    this.commonService.openItemImport()
  }

  ngOnDestroy () {
    this.deleteSub.unsubscribe()
    this.addItemSub.unsubscribe()
  }

  editItem (id) {
    console.log('edit id : ', id)
    this.commonService.openItemMaster(id)
  }

  deleteItemMaster (id) {
    console.log('id : ', id)
    this.commonService.openDelete(id, 'itemMaster')
  }

}
