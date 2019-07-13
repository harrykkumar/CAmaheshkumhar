import { Component, OnInit } from '@angular/core'
import { Subscription, Subject } from 'rxjs'
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
  private unSubscribe$ = new Subject<void>()
  DIRECT_SALE_TYPE: any = 'DirectSale'
  saleDirectDetails: any
  totalDiscount: number
  totaltax: number
  totalBillAmount: number
  newBillSub: Subscription
  masterData: any;
  lastItemIndex: number = 0
  pageSize: number = 20
  pageNo: number = 1
  totalItemSize: number = 0
  filterParameters: any = {};
  getFilterParameters: any = {}; 
  constructor(public _commonService: CommonService, public _toastrCustomService: ToastrCustomService) {

  }

  ngOnInit () {
    this._commonService.fixTableHF('cat-table')
    this.filterParameters = {
      pageNo : 1,
      pageSize: 20
    }
    this.getItemStockReportList();
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
  mainData: any =[]
  AttributeValues: any
  ClosingStock :any
  getSaleChallanDetail (data) {
    this._commonService.getReportItemStock(data).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND) {
        this.mainData = []
        if (data.Data.ItemDetails.length > 0) {
          this.ItemDetails = data.Data.ItemDetails
          this.totalItemSize = data.Data.ItemDetails[0].TotalRows;
        } else {
          this.totalItemSize = 0
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
          let ClosingStock = data.Data.ItemsClosingStock.filter(s => (s.ItemId === mainItm.Id && s.GroupId === mainItm.GroupId))
          if (ClosingStock.length === 0) {
            ClosingStock = []
            ClosingStock.push({ CurrentStock: 0 })
          }
          let ItemsDeadStock = data.Data.ItemsDeadStock.filter(s => (s.ItemId === mainItm.Id && s.GroupId === mainItm.GroupId))
          if (ItemsDeadStock.length === 0) {
            ItemsDeadStock = []
            ItemsDeadStock.push({ CurrentStock: 0 })
          }
          let ItemsWestageStock = data.Data.ItemsWestageStock.filter(s => (s.ItemId === mainItm.Id && s.GroupId === mainItm.GroupId))
          if (ItemsWestageStock.length === 0) {
            ItemsWestageStock = []
            ItemsWestageStock.push({ CurrentStock: 0 })
          }
          // ItemsDeadStock: []
          // ItemsWestageStock: []

          let ItemBarCodeTransactions = data.Data.ItemBarCodeTransactions.filter(s => (s.ItemId === mainItm.Id && s.GroupId === mainItm.GroupId))
          if (ItemBarCodeTransactions.length === 0) {
            ItemBarCodeTransactions = []
            ItemBarCodeTransactions.push({ Barcode: '' })
            ItemBarCodeTransactions.push({ AttributeDetail: '' })

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
            barcode: ItemBarCodeTransactions[0].Barcode,
            attributeData: ItemBarCodeTransactions[0].AttributeDetail,
            saleReturn: ItemstockdetailsSaleReturn,
            ClosingStock:ClosingStock,
            ItemsWestageStock:ItemsWestageStock,
            ItemsDeadStock:ItemsDeadStock,

          })
        })
      }
    })
  }

  onPageNoChange = (event) => {
    this.pageNo = event
    this.filterParameters['pageNo'] = this.pageNo
    if (this.toShowSearch) {
      this.getFilterParameters = {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      };
    } else {
      this.getItemStockReportList()
    }
  }

  onPageSizeChange = (event) => {
    this.pageSize = event
    this.filterParameters['pageSize'] = this.pageSize
    if (this.toShowSearch) {
      this.getFilterParameters = {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      };
    } else {
      this.getItemStockReportList()
    }
  }

  onLastValueChange = (event) => {
    this.lastItemIndex = event
  }

  search = (data) => {
    this.filterParameters = {...data};
    this.getItemStockReportList();
  }

  getItemStockReportList = () => {
    const data = {
      CategoryId : this.filterParameters.selectedCategory ?  this.filterParameters.selectedCategory : "",
      ItemId: this.filterParameters.selectedItem ? this.filterParameters.selectedItem : "",
      AttributeSearch: this.filterParameters.selectedAttribute ? this.filterParameters.selectedAttribute : "",
      UnitId: this.filterParameters.selectdUnit ? this.filterParameters.selectdUnit : "",
      FromDate: this.filterParameters.formattedFromDatevalue ? this.filterParameters.formattedFromDatevalue : "",
      ToDate: this.filterParameters.formattedToDateValue ? this.filterParameters.formattedToDateValue : "",
      Page: this.filterParameters.pageNo ? this.filterParameters.pageNo : 1,
      Size: this.filterParameters.pageSize ? this.filterParameters.pageSize : 20
    }
    this.getSaleChallanDetail(data);
}
}








