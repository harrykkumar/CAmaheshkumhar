import { Component, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { FormGroup } from '@angular/forms'
import { SaleTravel, AddCust } from '../../model/sales-tracker.model'
import { UIConstant } from '../../shared/constants/ui-constant'
declare const $: any
import { CommonService } from '../../commonServices/commanmaster/common.services'
import { ToastrCustomService } from '../../commonServices/toastr.service'
import { Settings } from '../../shared/constants/settings.constant'

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
  dateShow: any
  clientDateFormat: any
  constructor(public _settings: Settings ,public _commonService: CommonService, public _toastrCustomService: ToastrCustomService) {
    this.clientDateFormat = this._settings.dateFormat

    this.newBillSub = this._commonService.getSearchForStatus().subscribe(
      (obj: any) => {
        console.log(obj ,'daa---------')
        this.getItemSaleDetails(UIConstant.SALE_TYPE ,obj.ledgerId,obj.categoryId,obj.itemId,obj.fromDate,obj.toDate,obj.batchNo ,1,10)
         this.dateShow = obj.date
      }
    )

  }

  ngOnInit () {
    this._commonService.fixTableHF('cat-table')
    this.getItemSaleDetails(UIConstant.SALE_TYPE ,0,'','','','','' ,1,10)
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
  totalDiscountAmt: any
  totalTaxAmount: any
  SubTotalAmount: any
  getItemSaleDetails (type ,LedgerId,CategoryId,ItemId,FromDate,ToDate,BatchNo ,Pagenumber,Size) {
    this._commonService.itemSalePurchaseReportDetails(type ,LedgerId,CategoryId,ItemId,FromDate,ToDate,BatchNo ,Pagenumber,Size).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND) {
        // debugger
        console.log(data ,'getdata')
        this.mainData = []
      
        if (data.Data.Attributes.length > 0) {
          this.Attributelabel = data.Data.Attributes
          this.labelLength = JSON.stringify(this.Attributelabel.length)
        }
        if (data.Data.SummarizeDetails.length > 0) {
          console.log(data.Data.SummarizeDetails,"sdss")
          this.totalDiscountAmt = data.Data.SummarizeDetails[0].Discount
          this.totalTaxAmount = data.Data.SummarizeDetails[0].TaxAmount
          this.SubTotalAmount = data.Data.SummarizeDetails[0].SubTotalAmount

        }
        if (data.Data.ItemTransactionSalePurchases.length > 0) {
          let AttributeDetails
        data.Data.ItemTransactionSalePurchases.forEach(mainItm => {
        
          debugger
          let itemAttributeDetailTrans = data.Data.ItemAttributesDetailsTrans.filter(
            getValue => getValue.GroupId === mainItm.Groupid)
       
          if (itemAttributeDetailTrans.length === 0) {
            itemAttributeDetailTrans = []
            for (let i = 0; i < this.labelLength; i++) {
              itemAttributeDetailTrans.push({ AttributeValueName: '' })
              AttributeDetails = itemAttributeDetailTrans
            }
          }
          else{
            AttributeDetails = itemAttributeDetailTrans
          }
     
          this.mainData.push({
            id: mainItm.Id,
            CategoryId:mainItm.CategoryId,
            CategoryName: mainItm.CategoryName,
            itemid:mainItm.itemid,
            itemName: mainItm.Name,
            HsnNo: mainItm.HsnNo,
            ItemCode: mainItm.ItemCode,
            BarCode:mainItm.BarCode,
            SaleRate:mainItm.SaleRate,
            BatchNo:mainItm.BatchNo,
            LedgerName:mainItm.LedgerName,
            BillNo:mainItm.BillNo,
            BillDate:mainItm.BillDate,
            TaxAmount:mainItm.TaxAmount,
            BillAmount:mainItm.BillAmount,
            Discount:mainItm.Discount,
            SubTotalAmount:mainItm.SubTotalAmount,
            attributeLabelValue: AttributeDetails

          })

        })
      }
        console.log(this.mainData, 'main value')

      }
      // if(data.Code === UIConstant.SERVERERROR) {
      //   this._toastrCustomService.showError('',data.Description)
      // }

    })

  }
}








