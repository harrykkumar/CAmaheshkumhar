import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { CrmService } from './../../../../../crm/crm.service';
import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-item-add-subscription',
  templateUrl: './item-add-subscription.component.html',
  styleUrls: ['./item-add-subscription.component.css']
})
export class ItemAddSubscriptionComponent implements OnInit {
  @ViewChild('itemAddSubscription') itemAddSubscriptionForm: NgForm
  @Output() closeModal = new EventEmitter();
  subscriptionAmount: number
  subscriptionDuration: number
  editId: number
  editItemIndex: number = null
  addedItemsList: Array<any> =[]
  itemName: any;
  constructor(
    public crmService: CrmService,
    private commonService: CommonService
  ) {
    this.crmService.getLeadUtility();
  }

  ngOnInit() {
  }

  openModal(data, itemName) {
    this.commonService.openModal('item_add_subscription');
    this.addedItemsList = [...data]
    this.itemName = itemName
  }

  closePopUp() {
    this.commonService.closeModal('item_add_subscription')
    this.closeModal.emit(this.addedItemsList);
  }

  submit(){
    const periodIndex = _.findIndex(this.crmService.leadUtilityData.AMCDuration, { id : this.subscriptionDuration})
    const data = {
      id: this.editItemIndex !== null ? this.addedItemsList[this.editItemIndex].id : 0,
      period : this.subscriptionDuration,
      periodLabel: periodIndex !== -1 ? this.crmService.leadUtilityData.AMCDuration[periodIndex].commondesc : '',
    	price : this.subscriptionAmount
    }
    if (this.editItemIndex !== null) {
      this.addedItemsList[this.editItemIndex] = { ...data }
      this.editItemIndex = null
    } else {
      this.addedItemsList.push({ ...data })
    }
    this.itemAddSubscriptionForm.resetForm()
  }

  edit(item, index) {
    this.subscriptionDuration = item.period
    this.subscriptionAmount = item.price
    this.editItemIndex = Number(index);
  }

  delete(index) {
    this.addedItemsList.splice(index, 1)
  }

}
