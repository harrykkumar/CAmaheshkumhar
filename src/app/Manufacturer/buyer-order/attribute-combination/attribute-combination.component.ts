import { BuyerOrderService } from './../buyer-order.service';
import { Component, OnInit } from '@angular/core';
declare var $: any
import * as _ from 'lodash'
import { UIConstant } from 'src/app/shared/constants/ui-constant';

@Component({
  selector: 'app-attribute-combination',
  templateUrl: './attribute-combination.component.html',
  styleUrls: ['./attribute-combination.component.css']
})
export class AttributeCombinationComponent implements OnInit {

  constructor(
    private _buyerOrderService: BuyerOrderService
  ) { 
    this.getUtilityItemList()
  }

  ngOnInit() {
  }
  getUtilityItemList(){
    this._buyerOrderService.getUtilityItemList().subscribe((res) => {
      if(res.Code === 1000) {

      }
    })
  }
}
