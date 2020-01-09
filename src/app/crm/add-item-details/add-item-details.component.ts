import { CrmService } from './../crm.service';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-item-details',
  templateUrl: './add-item-details.component.html',
  styleUrls: ['./add-item-details.component.css']
})
export class AddItemDetailsComponent implements OnInit {
  @ViewChild('addItemDetailsForm') addItemDetailsForm: NgForm
  selectedItemId: number;
  quantity: number;
  itemValue: number;
  productList: Array<any> = []
  @Output() closeModal = new EventEmitter();
  isAmcSubscription: boolean = false;
  selectedEnquiryStatusId: number;
  subscriptionDuration: number;
  subscriptionAmount: number;
  addedItemsList: Array<any> = []
  editMode: boolean = false;
  isSubscriptionAllow: boolean = false;
  addNew: boolean = false;
  constructor(
    private _commonService: CommonService,
    public crmService: CrmService
  ) {
    this.quantity = 1
    this.addedItemsList = []
    const setUpSettingArray = JSON.parse(localStorage.getItem('moduleSettings'))
    if (!_.isEmpty(setUpSettingArray && setUpSettingArray.settings)) {
      const data4 = _.find(setUpSettingArray.settings, { id: 104 });
      if (!_.isEmpty(data4)) {
        this.isSubscriptionAllow = data4.val
      }
    }
  }

  ngOnInit() {
  }


  openModal(item, statusId) {
    this._commonService.openModal('add_item_detail');
    this.selectedEnquiryStatusId = statusId;
    this.productList = [...this.crmService.leadUtilityData.LeadProducts];
    if (!_.isEmpty(item)) {
      this.editMode = true
      this.selectedItemId = item.id
      this.quantity = item.quantity
      this.itemValue = item.itemValue
      this.isAmcSubscription = item.isAmc
      this.subscriptionDuration = item.amcDurationId
      this.subscriptionAmount = item.amcAmount
    }
    setTimeout(() => {
      $(`#itemId input`).focus()
    }, 500);
  }

  closePopUp(data?) {
    this._commonService.closeModal('add_item_detail')
    this.closeModal.emit(data);
  }

  submit() {
    const productIndex = _.findIndex(this.productList, { Id: this.selectedItemId })
    const data = {
      id: this.selectedItemId,
      quantity: this.quantity,
      itemValue: this.itemValue,
      itemName: productIndex !== -1 ? this.productList[productIndex].Name : '',
      isAmc: this.isAmcSubscription ? 1 : 0,
      amcAmount: this.subscriptionAmount ? this.subscriptionAmount : 0,
      amcDurationId: this.subscriptionDuration ? this.subscriptionDuration : 0
    }
    this.addedItemsList.push({ ...data })
    if (this.addNew) {
      this.addItemDetailsForm.resetForm()
      this.isAmcSubscription = false;
    } else {
      this.closePopUp(this.addedItemsList);
    }
  }

  setValue(value){
    this.addNew = value;
  }
}
