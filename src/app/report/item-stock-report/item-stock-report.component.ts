import { Component, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { FormGroup } from '@angular/forms'
import { SaleTravel, AddCust } from '../../model/sales-tracker.model'
import { UIConstant } from '../../shared/constants/ui-constant'
declare const $: any
import { CommonService } from '../../commonServices/commanmaster/common.services'
import { ToastrCustomService } from '../../commonServices/toastr.service'

@Component({
  selector: 'app-item-stock-report',
  templateUrl: './item-stock-report.component.html',
  styleUrls: ['./item-stock-report.component.css']
})
export class ItemStockReportComponent implements OnInit {
  DIRECT_SALE_TYPE: any = 'DirectSale'
  saleDirectDetails: any
  totalDiscount: number
  totaltax: number
  totalBillAmount: number
  newBillSub: Subscription

  constructor(public _commonService: CommonService, public _toastrCustomService: ToastrCustomService) {
    //  this.getSaleChallanDetail()
    // this.newBillSub = this._commonService.newSaleStatus().subscribe(
    //   (obj: any) => {
    //     this.getSaleChallanDetail()
    //   }
    // )

  }

  ngOnInit() {
    $(document).ready(function () {

      $('.table_challan').tableHeadFixer({
        head: true ,
        foot: true
      })
    })
    this.getSaleChallanDetail()
  }

  toShowSearch = false

  toggleSearch() {
    this.toShowSearch = !this.toShowSearch
  }
  Attributelabel: any
  ItemDetails: any
  attributePerLableValue: any
  attributevalue: any
  allAttributeData: any
  localArray: any
  labelLength: any
  mainData: any
  AttributeValues: any
  getSaleChallanDetail () {
    this._commonService.getReportItemStock().subscribe(data => {
      if (data.Code === UIConstant.THOUSAND) {
        // debugger
        this.mainData = []
        if (data.Data.ItemDetails.length > 0) {

          this.ItemDetails = data.Data.ItemDetails
        }
        if (data.Data.Attributes.length > 0) {
          this.Attributelabel = data.Data.Attributes
          this.labelLength = JSON.stringify(this.Attributelabel.length)
        }
        if (data.Data.AttributeValues.length > 0) {
          this.AttributeValues = data.Data.AttributeValues
        }
        data.Data.ItemDetails.forEach(mainItm => {
          let itemAttributeDetailTrans = data.Data.ItemAttributesDetailsTrans.filter(s => s.GroupId === mainItm.GroupId)
          //   let label = itemAttributeDetailTrans.filter(d=>d.AttributeId ===)
          if (itemAttributeDetailTrans.length === 0) {
            itemAttributeDetailTrans = []
            for (let i = 0; i < this.labelLength; i++) {
              itemAttributeDetailTrans.push({ AttributeValueName: '' })
            }
          }
          let itemOpeningStock = data.Data.ItemstockdetailsOpening.filter(s => (s.ItemId === mainItm.Id && s.GroupId === mainItm.GroupId))
          if (itemOpeningStock.length === 0) {
            itemOpeningStock = []
            itemOpeningStock.push({ CurrentStock: 0 })
          }

          let ItemstockdetailsPurchase = data.Data.ItemstockdetailsPurchase.filter(s => (s.ItemId === mainItm.Id && s.GroupId === mainItm.GroupId))
          if (ItemstockdetailsPurchase.length === 0) {
            ItemstockdetailsPurchase = []
            ItemstockdetailsPurchase.push({ CurrentStock: 0 })
          }
          let ItemstockdetailsPurchaseReturn = data.Data.ItemstockdetailsPurchaseReturn.filter(s => (s.ItemId === mainItm.Id && s.GroupId === mainItm.GroupId))
          if (ItemstockdetailsPurchaseReturn.length === 0) {
            ItemstockdetailsPurchaseReturn = []
            ItemstockdetailsPurchaseReturn.push({ CurrentStock: 0 })
          }
          let ItemstockdetailsSale = data.Data.ItemstockdetailsSale.filter(s => (s.ItemId === mainItm.Id && s.GroupId === mainItm.GroupId))
          if (ItemstockdetailsSale.length === 0) {
            ItemstockdetailsSale = []
            ItemstockdetailsSale.push({ CurrentStock: 0 })
          }
          let ItemstockdetailsSaleReturn = data.Data.ItemstockdetailsSaleReturn.filter(s => (s.ItemId === mainItm.Id && s.GroupId === mainItm.GroupId))
          if (ItemstockdetailsSaleReturn.length === 0) {
            ItemstockdetailsSaleReturn = []
            ItemstockdetailsSaleReturn.push({ CurrentStock: 0 })
          }
          let ItemBarCodeTransactions = data.Data.ItemBarCodeTransactions.filter(s => (s.ItemId === mainItm.Id && s.GroupId === mainItm.GroupId))
          if (ItemBarCodeTransactions.length === 0) {
            ItemBarCodeTransactions = []
            ItemBarCodeTransactions.push({ BarCode: '' })

          }

          this.mainData.push({
            id: mainItm.Id,
            CategoryName: mainItm.CategoryName,
            itemName: mainItm.Name,
            HsnNo: mainItm.HsnNo,
            ItemCode: mainItm.ItemCode,
            attributeLabelValue: itemAttributeDetailTrans,
            openingStock: itemOpeningStock,
            purchase: ItemstockdetailsPurchase,
            purchaseReturn: ItemstockdetailsPurchaseReturn,
            sale: ItemstockdetailsSale,
            barcode: ItemBarCodeTransactions,
            saleReturn: ItemstockdetailsSaleReturn

          })

        })
        console.log(this.mainData, 'main value')

      }

    })

  }
}








