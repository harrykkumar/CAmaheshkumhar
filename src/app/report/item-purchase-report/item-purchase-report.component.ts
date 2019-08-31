import { Component, OnInit,ViewChild } from '@angular/core'
import { Subscription } from 'rxjs'
import { UIConstant } from '../../shared/constants/ui-constant'
import { CommonService } from '../../commonServices/commanmaster/common.services'
import { ToastrCustomService } from '../../commonServices/toastr.service'
import { Settings } from '../../shared/constants/settings.constant'
import {trigger,query, style, transition,animate ,group} from "@angular/animations";
import { PagingComponent } from './../../shared/pagination/pagination.component';
import { GlobalService } from 'src/app/commonServices/global.service';
import { ExcelService } from '../../commonServices/excel.service';

@Component({
  selector: 'app-item-purchase-report',
  templateUrl: './item-purchase-report.component.html',
  styleUrls: ['./item-purchase-report.component.css'],
  animations: [
    trigger('simpleStateTransition', [
      transition('initial => extended', group([
        query('.fadeout', animate('300ms', style({'opacity': '0'})))
      ])),
    ])
  ]
})
export class ItemPurchaseReportComponent implements OnInit {
  DIRECT_SALE_TYPE: any = 'DirectSale'
  saleDirectDetails: any
  totalDiscount: number
  totaltax: number
  totalBillAmount: number
  orgDetails:any ={}
  newBillSub: Subscription
  dateShow: any
  lastItemIndex: number = 0
  pageSize: number = 20
  pageNo: number = 1
  page:any=1
  totalItemSize: number = 0
  clientDateFormat: any
  noOfDecimal:any
  setTodate:any
  setFromadate:any
  constructor(public excelService: ExcelService,public gs: GlobalService,public _settings: Settings ,public _commonService: CommonService, public _toastrCustomService: ToastrCustomService) {
    this.clientDateFormat = this._settings.dateFormat
    this.noOfDecimal = this._settings.noOfDecimal
  
    this.newBillSub = this._commonService.getSearchForPurchaseStatus().subscribe(
      (obj: any) => {
        this.getItemSaleDetails(UIConstant.PURCHASE_TYPE ,obj.ledgerId,obj.categoryId,obj.itemId,obj.fromDate,obj.toDate,obj.batchNo ,1,10)
        this.setFromadate = this.gs.utcToClientDateFormat(obj.fromDate, this.clientDateFormat)
        this.setTodate = this.gs.utcToClientDateFormat( obj.toDate, this.clientDateFormat)
      }
    )
    this.setFromadate= this.gs.utcToClientDateFormat(this._settings.finFromDate, this.clientDateFormat)
    this.setTodate= this.gs.utcToClientDateFormat(this._settings.finToDate, this.clientDateFormat)


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
   let  fromDate = this.gs.clientToSqlDateFormat(this.setFromadate, this.clientDateFormat)
   let toDate = this.gs.clientToSqlDateFormat(this.setTodate, this.clientDateFormat)
    this.getItemSaleDetails(UIConstant.PURCHASE_TYPE ,0,'','',fromDate,toDate,'' ,this.page, this.pageNo)

  }
  

  onPageSizeChange = (event) => {
    this.isViewPrint= false
    this.viewFlag=true
    this.pageSize = event
    let  fromDate = this.gs.clientToSqlDateFormat(this.setFromadate, this.clientDateFormat)
    let toDate = this.gs.clientToSqlDateFormat(this.setTodate, this.clientDateFormat)
     this.getItemSaleDetails(UIConstant.PURCHASE_TYPE ,0,'','',fromDate,toDate,'' ,this.page, this.pageNo)
 
    
  }
  ngOnInit () {
    this._commonService.fixTableHF('cat-table')
    let  fromDate = this.gs.clientToSqlDateFormat(this.setFromadate, this.clientDateFormat)
    let toDate = this.gs.clientToSqlDateFormat(this.setTodate, this.clientDateFormat)
     this.getItemSaleDetails(UIConstant.PURCHASE_TYPE ,0,'','',fromDate,toDate,'' ,this.page, this.pageNo)
 
  }
  @ViewChild('ledger_paging') ledgerPagingModel: PagingComponent

  toShowSearch = false
  simpleState = 'initial'
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
  totalDiscountAmt: any =0
  TotalQty:any=0
  totalTaxAmount: any =0
  SubTotalAmount: any =0
  mainDataExcel:any=[]
  ExcelSummary:any= []
  getItemSaleDetails (type ,LedgerId,CategoryId,ItemId,FromDate,ToDate,BatchNo ,Pagenumber,Size) {
    debugger
    this._commonService.itemSalePurchaseReportDetails(type ,LedgerId,CategoryId,ItemId,FromDate,ToDate,BatchNo ,Pagenumber,Size).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND) {
        this.orgDetails ={}
        console.log(data ,'getdata')
        this.mainData = []
        this.mainDataExcel =[]
      this.orgDetails ={
             ImageContents:data.Data.ImageContents,
      AddressDetails:data.Data.AddressDetails,
      OrganizationDetails:data.Data.OrganizationDetails
      }
 
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
   
        this.ExcelSummary = ["Total", " ", " ", " ", "",
        " ", " ", " ", " ", " ", " ", " ",
        this.TotalQty.toFixed(this.noOfDecimal),
        this.totalDiscountAmt.toFixed(this.noOfDecimal),
         this.totalTaxAmount.toFixed(this.noOfDecimal),
           this.SubTotalAmount.toFixed(this.noOfDecimal), ""]
  
           
        if (data.Data.ItemTransactionSalePurchases.length > 0) {
          let AttributeDetails
        data.Data.ItemTransactionSalePurchases.forEach((mainItm,ind) => {
        
          
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
          this.ExcelHeaders = ["SNo", "Ledger Name", "Bill No", "Bill Date", "Category",
          "Item Name", "Bar Code", "HSN", "ItemCode", "Attribute Details", "Rate", "BatchNo",
          "Qty", "Discount", "Tax Amount ", "Sub Total Amount ", "Bill Amount "]
        let  date =this.gs.utcToClientDateFormat(mainItm.BillDate, this.clientDateFormat)

        this.mainDataExcel.push([
          ind + 1,
          mainItm.LedgerName,
          mainItm.BillNo,
          date,
          mainItm.CategoryName,
          mainItm.Name,
          mainItm.BarCode,
          mainItm.HsnNo,
          mainItm.ItemCode,
          AttributeDetails,
          mainItm.SaleRate.toFixed(this.noOfDecimal),
          mainItm.BatchNo,
          mainItm.Quantity.toFixed(2),
          mainItm.Discount.toFixed(this.noOfDecimal),
          mainItm.TaxAmount.toFixed(this.noOfDecimal),
          mainItm.SubTotalAmount.toFixed(this.noOfDecimal),
          mainItm.BillAmount.toFixed(this.noOfDecimal),
        ])
        })
      }
      }
    })

  }
  ExcelHeaders:any 
  HtmlPrintId:any
  openPrint(htmlId) {
    this.HtmlPrintId= htmlId
    this.printLoad(htmlId,true)
    
  }
  printLoad (cmpName,isViewForm) {
    let title = document.title
    let divElements = document.getElementById(cmpName).innerHTML
    let printWindow = window.open()
    printWindow.document.open()
    printWindow.document.write('<html><head><title>' + title + '</title><style>body{font-size:.75rem;color:#000!important;overflow-x:hidden;font-family:Calibri,sans-serif!important;position:relative;height:29.7cm;margin:0 auto}div{display:block}.row{display:flex;flex-wrap:wrap;padding-right:5px;padding-left:5px}.col-md-12{flex:0 0 100%;max-width:100%}.col-md-3{flex:0 0 25%;max-width:25%}.col-md-3{flex:0 0 25%;max-width:25%}.col-md-4{flex:0 0 33.333333%;max-width:33.333333%}.col-md-6{flex:0 0 50%;max-width:50%}.col,.col-1,.col-10,.col-11,.col-12,.col-2,.col-3,.col-4,.col-5,.col-6,.col-7,.col-8,.col-9,.col-auto,.col-lg,.col-lg-1,.col-lg-10,.col-lg-11,.col-lg-12,.col-lg-2,.col-lg-3,.col-lg-4,.col-lg-5,.col-lg-6,.col-lg-7,.col-lg-8,.col-lg-9,.col-lg-auto,.col-md,.col-md-1,.col-md-10,.col-md-11,.col-md-12,.col-md-2,.col-md-3,.col-md-4,.col-md-5,.col-md-6,.col-md-7,.col-md-8,.col-md-9,.col-md-auto,.col-sm,.col-sm-1,.col-sm-10,.col-sm-11,.col-sm-12,.col-sm-2,.col-sm-3,.col-sm-4,.col-sm-5,.col-sm-6,.col-sm-7,.col-sm-8,.col-sm-9,.col-sm-auto,.col-xl,.col-xl-1,.col-xl-10,.col-xl-11,.col-xl-12,.col-xl-2,.col-xl-3,.col-xl-4,.col-xl-5,.col-xl-6,.col-xl-7,.col-xl-8,.col-xl-9,.col-xl-auto{position:relative;width:100%;min-height:1px}.justify-content-center{justify-content:center!important}.bdr_left{border-left:1px solid #000}.bdr_right{border-right:1px solid #000}.bdr_top{border-top:1px solid #000}.bdr_bottom{border-bottom:1px solid #000}.text-center{text-align:center!important}.text-right{text-align:right!important}.text-left{text-align:left!important}.p-2{padding:.5rem!important}.p-1{padding:.25rem!important}.font-weight-bold{font-weight:700!important}.name_size{font-size:22px}.amount_bs{text-align:right;padding:0 3px}.main-balance .tfoot,.main-balance .thead{font-weight:600;padding:5px 3px;font-size:.8rem;border-top:1px solid #000;border-bottom:1px solid #000}.col-3{flex:0 0 25%;max-width:25%}.col{flex-basis:0;flex-grow:1;max-width:100%}.p-0{padding:0!important}.ittelic{font-style:italic}*,::after,::before{box-sizing:border-box}.bdr_right_fix{min-height:25px;border-right:1px solid #000}.bdr_left_fix{min-height:25px;border-left:1px solid #000}.d-block{display:block}table{width:100%;border-collapse:collapse;border-spacing:0;margin-bottom:20px}thead{display:table-header-group;vertical-align:middle;border-color:inherit}table td,table th{padding:3px;text-align:left;border-bottom:1px solid #fff;word-break:break-word}table th{white-space:nowrap;font-weight:600;font-size:.8rem;border:1px solid #000;background-color:#000!important;color:#fff!important;text-align:center}tr:nth-child(even){background-color:#d9e1f2}table td{text-align:left;border:1px solid #000;font-size:.75rem;}@media print{table th{background-color:#000!important;-webkit-print-color-adjust:exact}tr:nth-child(even){background-color:#d9e1f2;-webkit-print-color-adjust:exact}}@media print{table th{color:#fff!important}}</style></head><body>')
    printWindow.document.write(divElements)
    printWindow.document.write('</body></html>')
    printWindow.document.close()
    printWindow.focus()
    // $('#' + cmpName).modal(UIConstant.MODEL_HIDE)
    this.viewFlag=true
    setTimeout(function () {
 //   if(this.isViewForm){
        document.getElementsByTagName('body')[0] .classList.add('hidden-print');
      printWindow.print()
     printWindow.close() 
    //}
    }, 100)
   
  }
  export (){
    if(this.mainDataExcel.length>0){
      this.excelService.generateExcel(this.orgDetails.OrganizationDetails[0].OrgName, this.orgDetails.AddressDetails[0].CityName + ' ' + this.orgDetails.AddressDetails[0].StateName + ' ' + this.orgDetails.AddressDetails[0].CountryName, this.ExcelHeaders, this.mainDataExcel, 'Purchase Item Report', this.setFromadate, this.setTodate ,this.ExcelSummary)
     
    }
  }
}








