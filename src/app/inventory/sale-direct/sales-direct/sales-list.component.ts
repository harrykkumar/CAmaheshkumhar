import { Component ,OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { FormGroup } from '@angular/forms'
import { SaleTravel ,AddCust } from '../../../model/sales-tracker.model'
// import { SaleTravelServices } from '../../sales/sale-travel.services'
import { UIConstant } from '../../../shared/constants/ui-constant'
declare const $: any
import { CommonService } from '../../../commonServices/commanmaster/common.services'
import { ToastrCustomService } from '../../../commonServices/toastr.service'

@Component({
  selector: 'app-sales-list',
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.css']
})
export class SalesListComponent implements   OnInit   {
  DIRECT_SALE_TYPE: any = 'DirectSale'
  saleDirectDetails: any
  totalDiscount: number
  totaltax: number
  totalBillAmount: number
  newBillSub: Subscription

  constructor (public _commonService: CommonService ,public _toastrCustomService: ToastrCustomService) {
    this.getSaleChallanDetail()
    this.newBillSub = this._commonService.newSaleStatus().subscribe(
      (obj: any) => {
        this.getSaleChallanDetail()

      }
    )

  }

  openSaleDirect (id) {
    this._commonService.openSaleDirect(id)
  }
  // tslint:disable-next-line:no-empty
  ngOnInit () {
    this._commonService.fixTableHF('cat-table')
  }
  toShowSearch = false

  toggleSearch () {
    this.toShowSearch = !this.toShowSearch
  }

  getSaleChallanDetail () {
    this._commonService.getListSaleDirect().subscribe(data => {
      console.log('sales data: ', data)
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        this.totalDiscount = 0
        this.totaltax = 0
        this.totalBillAmount = 0
        this.saleDirectDetails = data.Data
        data.Data.forEach(element => {
          this.totalDiscount = +(this.totalDiscount + +element.Discount).toFixed(2)
          this.totaltax = +(this.totaltax + +element.TaxAmount).toFixed(2)
          this.totalBillAmount = +(this.totalBillAmount + +element.BillAmount).toFixed(2)
        })

      }
    })
  }
  openPrint (id) {
    this._commonService.openPrint(id,this.DIRECT_SALE_TYPE)
  }

}
