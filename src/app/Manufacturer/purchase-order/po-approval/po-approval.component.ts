import { Component } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Settings } from '../../../shared/constants/settings.constant';
import { UIConstant } from '../../../shared/constants/ui-constant';
import { ToastrCustomService } from '../../../commonServices/toastr.service';
import { PurchaseOrderService } from '../purchase-order.service';
declare const $: any
@Component({
  selector: 'po-approval',
  templateUrl: './po-approval.component.html'
})
export class POApprovalComponent {
  model: any = {}
  PoId: number = 0
  destroy$: Subscription[] = []
  constructor (private settings: Settings, private _ts: ToastrCustomService,
    private _po: PurchaseOrderService) {
    this.model.industryId = this.settings.industryId
  }

  toggleSelect (val: boolean) {
    this.model.items.forEach((element) => {
      element['checked'] = val
    })
  }

  getPOItems (id) {
    this.PoId = +id
    this.destroy$.push(this._po.getPOItems(id).subscribe(
      (data) => {
        data.ItemTransactions.forEach((element) => {
          element['checked'] = false
          element['Rate'] = null
          element['Qty'] = null
        })
        this.model['items'] = data.ItemTransactions
        console.log(data.ItemTransactions)
        if (this.model['items'].length > 0) {
          this.openModal()
        } else {
          this._ts.showError('There is no item to approve', '')
        }
      },
      (error) => {
        this._ts.showErrorLong(error, '')
      }
    ))
  }

  openModal() {
    $('#po_approval').modal(UIConstant.MODEL_SHOW)
  }

  onSave() {
    this.destroy$.push(this._po.postPOApproval(this.preparePayload()).subscribe(
      (data) => {
        console.log(data)
        this._ts.showSuccess('Saved Successfully', '')
        this.close()
      },
      (error) => {
        this._ts.showError(error, '')
      }
    ))
  }

  preparePayload () {
    let ItemQtyApprovals = []
    this.model.items.forEach(element => {
      if (element.checked) {
        ItemQtyApprovals.push({
          Id: element.Id,
          ItemId: element.ItemId,
          GroupId: element.GroupId,
          Qty: (+element.Qty <= 0 || !element.Qty) ? element.Quantity : element.Qty,
          Rate: (+element.Rate <= 0 || !element.Rate) ? element.PurchaseRate : element.Rate
        })
      }
    });
    if (ItemQtyApprovals.length > 0) {
      const obj = {
        Id: this.PoId,
        ItemQtyApprovals: ItemQtyApprovals
      }
      return obj
    } else {
      this._ts.showError('Select atleast 1 to approve', '')
    }
  }

  validate() {
    this.checkForFocus()
    let valid = 1
    this.model.items.forEach(element => {
      if (element.checked && ((+element.Qty <= 0 || !element.Qty) || (+element.Rate <= 0 || !element.Rate))) valid = 0
    });
    return !!valid
  }

  checkForFocus () {
    setTimeout(() => {
      $(".errorSelecto:first").focus()
    }, 10)
  }

  close () {
    this.model = {}
    $('#po_approval').modal(UIConstant.MODEL_HIDE)
  }

  closeModal () {
    this._po.closePOApproval()
  }

  ngOnDestroy() {
    if (this.destroy$ && this.destroy$.length > 0) {
      this.destroy$.forEach((element) => element.unsubscribe())
    }
  }
}