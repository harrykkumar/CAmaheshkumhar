import { AttributeCombinationComponent } from './../attribute-combination/attribute-combination.component';
import { GlobalService } from './../../../commonServices/global.service';
import { Settings } from './../../../shared/constants/settings.constant';
import { Component, OnInit, ViewChild } from '@angular/core';
declare var $: any
import * as _ from 'lodash'
import { UIConstant } from 'src/app/shared/constants/ui-constant';
import { BuyerOrderService } from '../buyer-order.service';

@Component({
  selector: 'app-add-buyer-order',
  templateUrl: './add-buyer-order.component.html',
  styleUrls: ['./add-buyer-order.component.css']
})
export class AddBuyerOrderComponent implements OnInit {
  @ViewChild('attribute_combine_form') attributeFormModal: AttributeCombinationComponent
  listItem: any = {}
  model: any = {}
  constructor(
    private _buyerOrderService: BuyerOrderService,
    private setting: Settings,
    private _gs: GlobalService
  ) { }

  ngOnInit() {
  }
  openModal(data?){
    $('#buyer_order_form').modal(UIConstant.MODEL_SHOW)
  }

  onBuyerNameChange(event){
  }
  onOrderTypeChange(event){
  }
  onSeasonChange(event){
  }
  onGenderChange(event){
  }
  onStyleNumberChange(event){
  }
  onShipModeChange(event){
  }
  onShipMentTermChange(event){
  }
  onPaymentModeChange(event){
  }
  onItemChange(event){
  }
  onPaymentTermChange(event){
  }
  onCurrencyChange(event){
  }
  onTypeChange(event){
  }
  onConvertRateChange(event){
  }
  onPackageTypeChange(event){
  }
  itemSetTypeChange(event){
  }
}
