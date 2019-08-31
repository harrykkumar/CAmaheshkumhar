import { Component, OnInit } from '@angular/core'
import { Subscription, Subject } from 'rxjs'
import { FormGroup } from '@angular/forms'
import { SaleTravel, AddCust } from '../../model/sales-tracker.model'
import { UIConstant } from '../../shared/constants/ui-constant'
declare const $: any
import { CommonService } from '../../commonServices/commanmaster/common.services'
import { ToastrCustomService } from '../../commonServices/toastr.service'
import { ExcelService } from '../../commonServices/excel.service';
import { Settings } from './../../shared/constants/settings.constant';
import { GlobalService } from 'src/app/commonServices/global.service';

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
  constructor( public gs :GlobalService,public _settings :Settings,public excelService: ExcelService, public _commonService: CommonService, public _toastrCustomService: ToastrCustomService) {

  }

  ngOnInit() {
    this.fromDate =this.gs.utcToClientDateFormat(this._settings.finFromDate, this._settings.dateFormat)
    this.toDate =this.gs.utcToClientDateFormat(this._settings.finToDate, this._settings.dateFormat)   
    this._commonService.fixTableHF('cat-table')
    this.filterParameters = {
      pageNo: 1,
      pageSize: 20
    }
    this.getItemStockReportList();
       
        
  }
  fromDate:any =''
  toDate:any =''
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
  mainData: any = []
  orgDetails: any = {}
  AttributeValues: any
  ClosingStock: any
  mainDataExcel: any = []
  getSaleChallanDetail(data) {
    this._commonService.getReportItemStock(data).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND) {
        this.mainData = []
        this.orgDetails = {}
        this.orgDetails = data.Data
        this.mainDataExcel = []
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
        data.Data.ItemDetails.forEach((mainItm,i ) => {
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
            ItemBarCodeTransactions.push({ Barcode: mainItm.BarCode })
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
            ClosingStock: ClosingStock,
            ItemsWestageStock: ItemsWestageStock,
            ItemsDeadStock: ItemsDeadStock,

          })
          this.ExcelHeaders = ["SNo","Category","Item","BarCode","HSN","ItemCode","Attribute Details","Opening","Purchase","Sale","Purchase Return","Sale Return","Dead Stock ","Westage Stock","Closing Stock"]
          this.mainDataExcel.push([
              i+1,
            mainItm.CategoryName,
            mainItm.Name,
            ItemBarCodeTransactions[0].Barcode,
            mainItm.HsnNo,
            mainItm.ItemCode,
            ItemBarCodeTransactions[0].AttributeDetail,
            itemOpeningStock[0].CurrentStock,
            ItemstockdetailsPurchase[0].CurrentStock,
            ItemstockdetailsSale[0].CurrentStock,
            ItemstockdetailsPurchaseReturn[0].CurrentStock,
            ItemstockdetailsSaleReturn[0].CurrentStock,
            ItemsDeadStock[0].CurrentStock,
            ItemsWestageStock[0].CurrentStock,
            ClosingStock[0].CurrentStock,


          ])
          
        })
      }
      //console.log( this.mainData ,'data')
    })
  }
  ExcelHeaders: any = []
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
    this.filterParameters = { ...data };
    this.getItemStockReportList();
  }

  getItemStockReportList = () => {
      this.fromDate =  this.filterParameters.formattedFromDatevalue ?  this.filterParameters.formattedFromDatevalue : this.fromDate
      this.toDate =  this.filterParameters.formattedToDateValue ? this.filterParameters.formattedToDateValue : this.toDate

    const data = {
      CategoryId: this.filterParameters.selectedCategory ? this.filterParameters.selectedCategory : "",
      ItemId: this.filterParameters.selectedItem ? this.filterParameters.selectedItem : "",
      AttributeSearch: this.filterParameters.selectedAttribute ? this.filterParameters.selectedAttribute : "",
      UnitId: this.filterParameters.selectdUnit ? this.filterParameters.selectdUnit : "",
      FromDate: this.fromDate  ? this.fromDate  : '' ,
      ToDate: this.toDate ? this.toDate : '',
      Page: this.filterParameters.pageNo ? this.filterParameters.pageNo : 1,
      Size: this.filterParameters.pageSize ? this.filterParameters.pageSize : 20
    }
    this.getSaleChallanDetail(data);
  }
  export() {
    this.getItemStockReportList();
    if (this.mainDataExcel.length > 0) {
      //  this.excelService.exportAsExcelFile( this.mainDataExcel, 'Item Stock Report')
      this.excelService.generateExcel(this.orgDetails.OrganizationDetails[0].OrgName, this.orgDetails.AddressDetails[0].CityName + ' ' + this.orgDetails.AddressDetails[0].StateName + ' ' + this.orgDetails.AddressDetails[0].CountryName, this.ExcelHeaders, this.mainDataExcel, 'Item Stock Report', this.fromDate,this.toDate,[])

    }
  }



  HtmlPrintId: any
  openPrint(htmlId) {
    this.HtmlPrintId = htmlId
    this.printLoad(htmlId, true)

  }
  printLoad(cmpName, isViewForm) {
    let title = document.title
    let divElements = document.getElementById(cmpName).innerHTML
    let printWindow = window.open()
    printWindow.document.open()
    printWindow.document.write('<html><head><title>' + title + '</title><style>body{font-size:.75rem;color:#000!important;overflow-x:hidden;font-family:Calibri,sans-serif!important;position:relative;height:29.7cm;margin:0 auto}div{display:block}.row{display:flex;flex-wrap:wrap;padding-right:5px;padding-left:5px}.col-md-12{flex:0 0 100%;max-width:100%}.col-md-3{flex:0 0 25%;max-width:25%}.col-md-3{flex:0 0 25%;max-width:25%}.col-md-4{flex:0 0 33.333333%;max-width:33.333333%}.col-md-6{flex:0 0 50%;max-width:50%}.col,.col-1,.col-10,.col-11,.col-12,.col-2,.col-3,.col-4,.col-5,.col-6,.col-7,.col-8,.col-9,.col-auto,.col-lg,.col-lg-1,.col-lg-10,.col-lg-11,.col-lg-12,.col-lg-2,.col-lg-3,.col-lg-4,.col-lg-5,.col-lg-6,.col-lg-7,.col-lg-8,.col-lg-9,.col-lg-auto,.col-md,.col-md-1,.col-md-10,.col-md-11,.col-md-12,.col-md-2,.col-md-3,.col-md-4,.col-md-5,.col-md-6,.col-md-7,.col-md-8,.col-md-9,.col-md-auto,.col-sm,.col-sm-1,.col-sm-10,.col-sm-11,.col-sm-12,.col-sm-2,.col-sm-3,.col-sm-4,.col-sm-5,.col-sm-6,.col-sm-7,.col-sm-8,.col-sm-9,.col-sm-auto,.col-xl,.col-xl-1,.col-xl-10,.col-xl-11,.col-xl-12,.col-xl-2,.col-xl-3,.col-xl-4,.col-xl-5,.col-xl-6,.col-xl-7,.col-xl-8,.col-xl-9,.col-xl-auto{position:relative;width:100%;min-height:1px}.justify-content-center{justify-content:center!important}.bdr_left{border-left:1px solid #000}.bdr_right{border-right:1px solid #000}.bdr_top{border-top:1px solid #000}.bdr_bottom{border-bottom:1px solid #000}.text-center{text-align:center!important}.text-right{text-align:right!important}.text-left{text-align:left!important}.p-2{padding:.5rem!important}.p-1{padding:.25rem!important}.font-weight-bold{font-weight:700!important}.name_size{font-size:22px}.amount_bs{text-align:right;padding:0 3px}.main-balance .tfoot,.main-balance .thead{font-weight:600;padding:5px 3px;font-size:.8rem;border-top:1px solid #000;border-bottom:1px solid #000}.col-3{flex:0 0 25%;max-width:25%}.col{flex-basis:0;flex-grow:1;max-width:100%}.p-0{padding:0!important}.ittelic{font-style:italic}*,::after,::before{box-sizing:border-box}.bdr_right_fix{min-height:25px;border-right:1px solid #000}.bdr_left_fix{min-height:25px;border-left:1px solid #000}.d-block{display:block}table{width:100%;border-collapse:collapse;border-spacing:0;margin-bottom:20px}thead{display:table-header-group;vertical-align:middle;border-color:inherit}table td,table th{padding:3px;text-align:left;border-bottom:1px solid #fff;word-break:break-word}table th{white-space:nowrap;font-weight:600;font-size:.8rem;border:1px solid #000;background-color:#000!important;color:#fff!important;text-align:center}tr:nth-child(even){background-color:#d9e1f2}table td{text-align:left;border:1px solid #000;font-size:.75rem;}@media print{table th{background-color:#000!important;-webkit-print-color-adjust:exact}tr:nth-child(even){background-color:#d9e1f2;-webkit-print-color-adjust:exact}}@media print{table th{color:#fff!important}}</style></head><body>')
    printWindow.document.write(divElements)
    printWindow.document.write('</body></html>')
    printWindow.document.close()
    printWindow.focus()
    setTimeout(function () {
      document.getElementsByTagName('body')[0].classList.add('hidden-print');
      printWindow.print()
      printWindow.close()
    }, 100)

  }
}








