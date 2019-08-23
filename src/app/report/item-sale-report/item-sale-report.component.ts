import { Component, OnInit,ViewChild } from '@angular/core'
import { Subscription } from 'rxjs'
import { UIConstant } from '../../shared/constants/ui-constant'
declare const $: any
import { CommonService } from '../../commonServices/commanmaster/common.services'
import { ToastrCustomService } from '../../commonServices/toastr.service'
import { PagingComponent } from './../../shared/pagination/pagination.component';
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
  noOfDecimal:any
  lastItemIndex: number = 0
  pageSize: number = 20
  pageNo: number = 1
  totalItemSize: number = 0
page:any=1
  constructor(public _settings: Settings ,public _commonService: CommonService, public _toastrCustomService: ToastrCustomService) {
   this.clientDateFormat = this._settings.dateFormat
    this.noOfDecimal = this._settings.noOfDecimal
    this.newBillSub = this._commonService.getSearchForStatus().subscribe(
      (obj: any) => {
        this.getItemSaleDetails(UIConstant.SALE_TYPE ,obj.ledgerId,obj.categoryId,obj.itemId,obj.fromDate,obj.toDate,obj.batchNo ,1,10)
         this.dateShow = obj.date
      }
    )

  }
  onLastValueChange = (event) => {
    this.lastItemIndex = event
  }
  viewFlag:any
  isViewPrint:boolean =false
  onPageNoChange = (event) => {
    this.isViewPrint= false
    this.viewFlag=true
    this.pageNo = event
    this.getItemSaleDetails(UIConstant.SALE_TYPE ,0,'','','','','' ,this.page, this.pageNo)

  }

  onPageSizeChange = (event) => {
    this.isViewPrint= false
    this.viewFlag=true
    this.pageSize = event
    this.getItemSaleDetails(UIConstant.SALE_TYPE ,0,'','','','','' ,this.page, this.pageSize )
    
  }
  @ViewChild('ledger_paging') ledgerPagingModel: PagingComponent
  ngOnInit () {
    this._commonService.fixTableHF('cat-table')
    this.getItemSaleDetails(UIConstant.SALE_TYPE ,0,'','','','','' ,this.page,10)
  }

  toShowSearch = false
  openSearchToggle ( ) {}
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
  mainData: any=[]
  AttributeValues: any
  totalDiscountAmt: any =0
  TotalQty:any=0
  totalTaxAmount: any=0
  SubTotalAmount: any=0
  getItemSaleDetails (type ,LedgerId,CategoryId,ItemId,FromDate,ToDate,BatchNo ,Pagenumber,Size) {
    this._commonService.itemSalePurchaseReportDetails(type ,LedgerId,CategoryId,ItemId,FromDate,ToDate,BatchNo ,Pagenumber,Size).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND) {
        // 
        console.log(data ,'getdata')
        this.mainData = []
      
        if (data.Data.Attributes.length > 0) {
          this.Attributelabel = data.Data.Attributes
          this.labelLength = JSON.stringify(this.Attributelabel.length)
        }
        if (data.Data.SummarizeDetails.length > 0) {
          console.log(data.Data.SummarizeDetails,"sdss")
          this.TotalQty =data.Data.SummarizeDetails[0].Quantity
          this.totalDiscountAmt = data.Data.SummarizeDetails[0].Discount
          this.totalTaxAmount = data.Data.SummarizeDetails[0].TaxAmount
          this.SubTotalAmount = data.Data.SummarizeDetails[0].SubTotalAmount

        }
        if (data.Data.ItemTransactionSalePurchases.length > 0) {
          let AttributeDetails
        data.Data.ItemTransactionSalePurchases.forEach(mainItm => {
        
          
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
            Qty:mainItm.Quantity,
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

    })

  }
}








