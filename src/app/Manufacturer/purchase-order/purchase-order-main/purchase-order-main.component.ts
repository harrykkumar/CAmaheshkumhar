import { Component } from "@angular/core";
import { PurchaseOrderService } from '../purchase-order.service';
import { ToastrCustomService } from '../../../commonServices/toastr.service';
import { Settings } from '../../../shared/constants/settings.constant';
import { CommonService } from '../../../commonServices/commanmaster/common.services';
import { Subscription } from "rxjs";
declare const window: any;
@Component({
  selector: 'purchase-order-main',
  templateUrl: './purchase-order-main.component.html'
})
export class PurchaseOrderMainComponent {
  p: number = 1
  itemsPerPage: number = 20
  total: number = 0
  lastItemIndex: number = 0
  poData: any = []
  clientDateFormat = ''
  queryStr: string = ''
  summary: any = []
  destroy$: Subscription[] = []
  constructor (private _po: PurchaseOrderService, private _ts: ToastrCustomService,
    private settings: Settings, private _cs: CommonService) {
    console.log(window.navigator.onLine)
    this.clientDateFormat = this.settings.dateFormat
    this.getPOList()
    this.destroy$.push(this._po.poAdded$.subscribe(() => {
      this.getPOList()
    }))
    this.destroy$.push(this._po.queryStr$.subscribe(
      (str) => {
        console.log(str)
        this.queryStr = str
        this.p = 1
        this.getPOList()
      }
    ))
    this.destroy$.push(this._cs.getDeleteStatus().subscribe(
      (obj) => {
        if (obj.id && obj.type && obj.type === 'purchaseorder') {
          this.deleteItem(obj.id)
        }
      }
    ))
  }

  getPOList () {
    this.destroy$.push(this._po.listPO('?Page=' + this.p + '&Size=' + this.itemsPerPage + this.queryStr).subscribe((data) => {
      console.log(data)
      this.poData = data.PurchaseOrders
      this.total = this.poData[0].TotalRows
      this.summary = data.PurchaseOrderSummarys[0]
    },
    (error) => {
      this._ts.showError(error, '')
    }))
  }

  openPO (id?) {
    if (id) {
      this._po.openPO(id)
    } else {
      this._po.openPO('')
    }
  }

  toShowSearch = false
  toggleSearch() {
    this.toShowSearch = !this.toShowSearch
  }

  delete(id) {
    this._cs.openDelete(id, 'purchaseorder', 'Purchase Order')
  }

  deleteItem (id) {
    if (id) {
      this.destroy$.push(this._po.deletePO(id).subscribe((data) => {
        this._ts.showSuccess('', 'Deleted Successfully')
        this._cs.closeDelete('')
        this.getPOList()
      },
      (error) => {
        this._ts.showErrorLong('', error)
        this._cs.closeDelete('')
      }))
    }
  }

  ngOnDestroy() {
    if (this.destroy$ && this.destroy$.length > 0) {
      this.destroy$.forEach((element) => element.unsubscribe())
    }
  }
}