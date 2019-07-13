import { Component, OnInit } from '@angular/core'
import { Subscription, Subject } from 'rxjs'
import { FormGroup } from '@angular/forms'
import { SaleTravel, AddCust } from '../../model/sales-tracker.model'
import { UIConstant } from '../../shared/constants/ui-constant'
declare const $: any
import { CommonService } from '../../commonServices/commanmaster/common.services'
import { ToastrCustomService } from '../../commonServices/toastr.service'

@Component({
  selector: 'app-inventory-stock-report',
  templateUrl: './item-inventory-report.component.html',
  styleUrls: ['./item-inventory-report.component.css']
})
export class ItemInventoryReportComponent implements OnInit {
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
    this._commonService.getReportItemInventory(data).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND) {
        this.mainData = []
        if (data.Data.length > 0) {
          this.mainData = data.Data
          this.totalItemSize = data.Data[0].TotalRows;
        
        }
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
      // AttributeSearch: this.filterParameters.selectedAttribute ? this.filterParameters.selectedAttribute : "",
      // UnitId: this.filterParameters.selectdUnit ? this.filterParameters.selectdUnit : "",
      FromDate: this.filterParameters.formattedFromDatevalue ? this.filterParameters.formattedFromDatevalue : "",
      ToDate: this.filterParameters.formattedToDateValue ? this.filterParameters.formattedToDateValue : "",
      Page: this.filterParameters.pageNo ? this.filterParameters.pageNo : 1,
      Size: this.filterParameters.pageSize ? this.filterParameters.pageSize : 20,
      Type:'ItemGroupWise'
    }
    this.getSaleChallanDetail(data);
}
}








