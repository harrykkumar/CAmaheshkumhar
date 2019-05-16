import { Component, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { FormGroup } from '@angular/forms'
import { SaleTravel, AddCust } from '../../model/sales-tracker.model'
import { UIConstant } from '../../shared/constants/ui-constant'
declare const $: any
import { CommonService } from '../../commonServices/commanmaster/common.services'
import { ToastrCustomService } from '../../commonServices/toastr.service'

@Component({
  selector: 'app-item-sale-report',
  templateUrl: './item-sale-report.component.html',
  styleUrls: ['./item-sale-report.component.css']
})
export class ItemSaleReportComponent implements OnInit {
  DIRECT_SALE_TYPE: any = 'DirectSale'
  saleDirectDetails: any
  totalDiscount: number
  totaltax: number
  totalBillAmount: number
  newBillSub: Subscription

  constructor (public _commonService: CommonService, public _toastrCustomService: ToastrCustomService) {
    //  this.getSaleChallanDetail()
    // this.newBillSub = this._commonService.newSaleStatus().subscribe(
    //   (obj: any) => {
    //     this.getSaleChallanDetail()
    //   }
    // )

  }

  ngOnInit () {
    this._commonService.fixTableHF('cat-table')
    this.getSaleChallanDetail()
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
// tslint:disable-next-line: deprecation
    this._commonService.getReportItemByCategorySale(UIConstant.SALE_TYPE).subscribe(data => {
    // let data = this._commonService.getReportItemByCategorySale(UIConstant.SALE_TYPE)
      if (data.Code === UIConstant.THOUSAND) {
        this.mainData = data.Data
      }
      console.log(this.mainData, 'main value')

    })
  }

  onRowClick(e) {
    console.log(e,'jj')
    var expanded = e.component.isRowExpanded(e.rowIndex);
    if (expanded) {
        e.component.collapseRow(e.rowIndex);
    }
    else {
        e.component.expandRow(e.rowIndex);
    }
}

}
