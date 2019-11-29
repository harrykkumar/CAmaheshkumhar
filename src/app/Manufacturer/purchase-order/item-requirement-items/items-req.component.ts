import { Component, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { PurchaseOrderService } from '../purchase-order.service';
import { UIConstant } from '../../../shared/constants/ui-constant';
import { Settings } from '../../../shared/constants/settings.constant';
import { Subscription } from 'rxjs';
import { ToastrCustomService } from '../../../commonServices/toastr.service';
declare const $: any
@Component({
  selector: 'requirement-items',
  templateUrl: './items-req.component.html'
})
export class ItemsReqComponent {
  @Input() open: boolean
  @Input() buyerId: number
  @Output() itemDataEmitter = new EventEmitter<Array<any>>()
  model: any = {}
  destroy$: Subscription[] = []
  clientDateFormat = ''
  constructor (private _po: PurchaseOrderService, private settings: Settings, private _ts: ToastrCustomService) {
    this.model.industryId = this.settings.industryId
    this.clientDateFormat = this.settings.dateFormat
  }
  ngOnChanges (changes: SimpleChanges): void {
    if (changes.open && changes.open.currentValue) {
      this.openModal()
      this.updateItems()
    }
    if (changes.buyerId && changes.buyerId.currentValue !== changes.buyerId.previousValue && changes.buyerId.currentValue > 0) {
      this.getItems()
    }
  }

  getItems () {
    this.destroy$.push(this._po.getBODetail(this.buyerId).subscribe((data) => {
      // console.log(data)
      this.model.requirementItems = data.ItemRequirements
      this.model.requirementItems.forEach((item, index) => {
        item.checked = false
        item.Sno = index + 1
        item.maxLimit = item.RemainingQty
      })
    },
    (error) => {
      this._ts.showErrorLong(error, '')
    }))
  }

  openModal() {
    $('#item_in_requirement').modal(UIConstant.MODEL_SHOW)
  }

  toggleSelect (val: boolean) {
    this.model.requirementItems.forEach((element) => {
      element['checked'] = val
    })
  }

  onSave() {
    const items = JSON.parse(JSON.stringify(this.model.requirementItems.filter((item => item.checked && item.ApprovedQty > 0))))
    // console.log(items)
    this.itemDataEmitter.emit(items)
    this.close()
  }

  validate() {
    this.checkForFocus()
    let valid = 1
    this.model.requirementItems.forEach(element => {
      if (element.checked && (+element.ApprovedQty <= 0 || !element.ApprovedQty) && element.RemainingQty > 0) valid = 0
    });
    return !!valid
  }

  checkForFocus () {
    setTimeout(() => {
      $(".errorSelecto:first").focus()
    }, 10)
  }

  close () {
    $('#item_in_requirement').modal(UIConstant.MODEL_HIDE)
  }

  updateRemQty (item) {
    console.log('item.maxLimit ', item.maxLimit)
    if (item.ApprovedQty > 0) {
      item.RemainingQty = item.maxLimit - item.ApprovedQty
    } else if (!item.ApprovedQty) {
      item.RemainingQty = item.maxLimit
    }
  }

  updateItems () {
    this.model.selectAll = false
    this.model.requirementItems.forEach((element) => {
      element.ApprovedQty = 0
      element.checked = false
      element.maxLimit = JSON.parse(JSON.stringify(element.RemainingQty))
    })
  }

  ngOnDestroy() {
    if (this.destroy$ && this.destroy$.length > 0) {
      this.destroy$.forEach((element) => element.unsubscribe())
    }
  }
}