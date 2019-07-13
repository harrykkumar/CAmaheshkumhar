import { Component, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { FormGroup } from '@angular/forms'
import { SaleTravel, AddCust } from '../../model/sales-tracker.model'
import { UIConstant } from '../../shared/constants/ui-constant'
 declare const $: any
import { CommonService } from '../../commonServices/commanmaster/common.services'
import { ToastrCustomService } from '../../commonServices/toastr.service'
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Settings } from '../../shared/constants/settings.constant'

@Component({
  selector: 'app-item-sale-category-report',
  templateUrl: './item-sale-category-report.component.html',
  styleUrls: ['./item-sale-category-report.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ItemSaleCategoryReportComponent implements OnInit {

  DIRECT_SALE_TYPE: any = 'DirectSale'
  saleDirectDetails: any
  totalDiscount: number
  totaltax: number
  totalBillAmount: number
  newBillSub: Subscription
  noOfDecimal:any
  ///expandedElement: PeriodicElement | null;

  constructor ( public _settings :Settings ,public _commonService: CommonService, public _toastrCustomService: ToastrCustomService) {
    this.noOfDecimal = this._settings.noOfDecimal
    //  this.getSaleChallanDetail()
    // this.newBillSub = this._commonService.newSaleStatus().subscribe(
    //   (obj: any) => {
    //     this.getSaleChallanDetail()
    //   }
    // )

  }
  expandedElement: any
  attribute_html_id : any
  item_html_id: any
  ngOnInit () {
    this._commonService.fixTableHF('cat-table')
    this.getSaleChallanDetail()
   
    this.attribute_html_id = document.getElementById('attribute_id');
    this.item_html_id = document.getElementById('item_id');
    
   // this.expandedElement = this.mainData[2];
  }

  toShowSearch = false

  toggleSearch () {
    this.toShowSearch = !this.toShowSearch
  }
  Attributelabel: any
  CategoryItems: any
  attributePerLableValue: any
  attributevalue: any
  allAttributeData: any
  localArray: any
  labelLength: any
  mainData: any
  AttributeValues: any
  getSaleChallanDetail () {
    this._commonService.getReportItemByCategorySale(UIConstant.SALE_TYPE).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND) {
        this.mainData = data.Data
      }
      console.log(this.mainData, 'main value')

    })
  }
  columnsToDisplay =['#','Category / item','Quantity','Discount Amt','Tax Amount','Bill Amount']
  dataSource =   this.mainData ;
  categoryFlag: boolean


toggleCategory(event,itemId,AttributeId ,index) {
  $(document).ready(function(){
    // Add minus icon for collapse element which is open by default
    $(".collapse.show").each(function(){
      $(this).prev(".new-clas").find(".fa").addClass("fa-minus").removeClass("fa-plus");
    });
    
    // Toggle plus minus icon on show hide of collapse element
    $(".collapse").on('show.bs.collapse', function(){
      $(this).prev(".new-clas").find(".fa").removeClass("fa-plus").addClass("fa-minus");
    }).on('hide.bs.collapse', function(){
      $(this).prev(".new-clas").find(".fa").removeClass("fa-minus").addClass("fa-plus");
    });
});    

}
toggleItemdd(event,itemId,AttributeId ,index) {
  $(document).ready(function(){
    // Add minus icon for collapse element which is open by default
    $(".collapse.show").each(function(){
      $(this).prev(".profile-pic1").find(".fa").addClass("fa-minus").removeClass("fa-plus");
    });
    
    // Toggle plus minus icon on show hide of collapse element
    $(".collapse").on('show.bs.collapse', function(){
      $(this).prev(".card-header").find(".fa").removeClass("fa-plus").addClass("fa-minus");
    }).on('hide.bs.collapse', function(){
      $(this).prev(".card-header").find(".fa").removeClass("fa-minus").addClass("fa-plus");
    });
});    

}
catflag: boolean = false

// toggleCategory (flag ,id,index) {
  
// this.catflag =!this.catflag
// this.attribute_html_id.addClass('item_id' +index);
// this.attribute_html_id.addClass('attribute_id' +index);
// return this.catflag

// }
}
