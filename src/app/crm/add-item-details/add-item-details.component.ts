import { CrmService } from './../crm.service';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-add-item-details',
  templateUrl: './add-item-details.component.html',
  styleUrls: ['./add-item-details.component.css']
})
export class AddItemDetailsComponent implements OnInit {
  selectedItemId: number;
  quantity: number;
  itemValue: number;
  productList: Array<any> = []
  @Output() closeModal = new EventEmitter();

  constructor(
    private _commonService: CommonService,
    private crmService: CrmService
  ) {
    this.quantity = 1
  }

  ngOnInit() {
  }


  openModal(item?) {
    this._commonService.openModal('add_item_detail');
    this.productList = [...this.crmService.leadUtilityData.LeadProducts];
    if (!_.isEmpty(item)) {
      this.selectedItemId = item.id
      this.quantity = item.quantity
      this.itemValue = item.itemValue
    }
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
      itemName: productIndex !== -1 ? this.productList[productIndex].Name : ''
    }
    this.closePopUp(data);
  }
}
