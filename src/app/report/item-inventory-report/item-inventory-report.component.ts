import { Component, OnInit } from '@angular/core'
import { Subscription, Subject } from 'rxjs'
import { FormGroup } from '@angular/forms'
import { SaleTravel, AddCust } from '../../model/sales-tracker.model'
import { UIConstant } from '../../shared/constants/ui-constant'
declare const $: any
import { CommonService } from '../../commonServices/commanmaster/common.services'
import { ToastrCustomService } from '../../commonServices/toastr.service'
import { map, takeUntil } from 'rxjs/operators';
import { Settings } from '../../shared/constants/settings.constant'
// import { NgxExtendedPdfViewerService } from '../../projects/ngx-extended-pdf-viewer/src/lib/ngx-extended-pdf-viewer.service';
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
  noOfDecimal:any=0
  public title = 'ngx-extended-pdf-viewer';
  public pdf = 'assets/example.pdf';
  public hidden = false;
  public zoom: number | string | undefined = 'page-width';
  public visible = { 0: true };
  public mobileFriendlyZoomPercent = false;
  public showSidebar = false;
  public height: string | undefined = '80vh';
  public filenameForDownload: string | undefined = undefined;
  public language = 'es-ES';
  public nameddest = 'chapter_5';
  public _searchtext = '';
  public spread = 'off';

  public page: number | undefined = undefined;

  public handTool: boolean | undefined = undefined;

  // public base64 = pdfBase64; // this.base64ToArrayBuffer(pdfBase64);
  constructor(public _settings:Settings , public _commonService: CommonService, public _toastrCustomService: ToastrCustomService) {
    this.noOfDecimal = this._settings.noOfDecimal
  }

  ngOnInit () {
    this.viewFlag=true
    this.isViewPrint= false
    this._commonService.fixTableHF('cat-table')
    this.filterParameters = {
      pageNo : 1,
      pageSize: 20
    }
    this.getItemStockReportList();
  }

  toShowSearch = false

  toggleSearch() {
    this.viewFlag=true
    this.isViewPrint= false
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
  SummaryData:any =[]
  ClosingStock :any
  OrgDetails:any={}
  getInventoryDetail (Value) {
    this._commonService.getReportItemInventory(Value).pipe(
      takeUntil(this.unSubscribe$)
    ).subscribe((data: any) => {
      if (data.Code === UIConstant.THOUSAND) {
       this.mainData = []
        if (data.Code=== UIConstant.THOUSAND &&  data.Data.InventoryItems.length > 0) {
             this.OrgDetails = data.Data
             this.mainData = data.Data.InventoryItems
             this.SummaryData = data.Data.InventoryItemsSummary
             this.totalItemSize = data.Data.InventoryItems[0].TotalRows;
             if(this.isViewPrint ){
              this.printLoad(this.htmlLoadid,this.isViewPrint)
            }
        }
        else if(data.Code=== UIConstant.THOUSAND &&  data.Data.InventoryItems.length ===0){
          this.OrgDetails = {
            InventoryItems: [],
            InventoryItemsSummary: [],
            AddressDetails:[],
            ContactInfoDetails:[],
            EmailDetails:[],
            OrganizationDetails:[],
            ImageContents:[]
          }
        }
        
      }
    })
  }

  onPageNoChange = (event) => {
    this.viewFlag=true
    this.isViewPrint= false
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
    this.viewFlag=true
    this.isViewPrint= false
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
    this.viewFlag=true
    this.isViewPrint= false
    this.filterParameters = {...data};
    this.getItemStockReportList();
  }

  getItemStockReportList = () => {
    const data = {
      CategoryId : this.filterParameters.selectedCategory ?  this.filterParameters.selectedCategory : "",
      ItemId: this.filterParameters.selectedItem ? this.filterParameters.selectedItem : "",
      FromDate: this.filterParameters.formattedFromDatevalue ? this.filterParameters.formattedFromDatevalue : "",
      ToDate: this.filterParameters.formattedToDateValue ? this.filterParameters.formattedToDateValue : "",
      Page: this.filterParameters.pageNo ? this.filterParameters.pageNo : 1,
      Size: this.filterParameters.pageSize ? this.filterParameters.pageSize : 20,
      Type:'ItemGroupWise'
    }
    this.getInventoryDetail(data);
}


isViewPrint:boolean = false
  htmlLoadid:any =0
  viewPrint:any
  viewFlag:any
  openPrint (HtmlId ,isViewPrint) {
    this.viewFlag = false
    this.isViewPrint =isViewPrint
    this.htmlLoadid= HtmlId
   this.getItemStockReportList()
  }
  searchBtn(){
    this.viewFlag=true
    this.isViewPrint= false
    this.getItemStockReportList()
  }
  closeBtn (){
    this.viewFlag=true
  }
  printLoad (cmpName,isViewForm) {
    let title = document.title
    let divElements = document.getElementById(cmpName).innerHTML
    let printWindow = window.open()
    printWindow.document.open()
    printWindow.document.write('<html><head><title>' + title + '</title><style>body{font-size:.75rem;color:#000!important;overflow-x:hidden;font-family:Calibri,sans-serif!important;position:relative;width:21cm;height:29.7cm;margin:0 auto}div{display:block}.row{display:flex;flex-wrap:wrap;padding-right:5px;padding-left:5px}.col-md-12{flex:0 0 100%;max-width:100%}.col-md-3{flex:0 0 25%;max-width:25%}.col-md-3{flex:0 0 25%;max-width:25%}.col-md-4{flex:0 0 33.333333%;max-width:33.333333%}.col-md-6{flex:0 0 50%;max-width:50%}.col,.col-1,.col-10,.col-11,.col-12,.col-2,.col-3,.col-4,.col-5,.col-6,.col-7,.col-8,.col-9,.col-auto,.col-lg,.col-lg-1,.col-lg-10,.col-lg-11,.col-lg-12,.col-lg-2,.col-lg-3,.col-lg-4,.col-lg-5,.col-lg-6,.col-lg-7,.col-lg-8,.col-lg-9,.col-lg-auto,.col-md,.col-md-1,.col-md-10,.col-md-11,.col-md-12,.col-md-2,.col-md-3,.col-md-4,.col-md-5,.col-md-6,.col-md-7,.col-md-8,.col-md-9,.col-md-auto,.col-sm,.col-sm-1,.col-sm-10,.col-sm-11,.col-sm-12,.col-sm-2,.col-sm-3,.col-sm-4,.col-sm-5,.col-sm-6,.col-sm-7,.col-sm-8,.col-sm-9,.col-sm-auto,.col-xl,.col-xl-1,.col-xl-10,.col-xl-11,.col-xl-12,.col-xl-2,.col-xl-3,.col-xl-4,.col-xl-5,.col-xl-6,.col-xl-7,.col-xl-8,.col-xl-9,.col-xl-auto{position:relative;width:100%;min-height:1px}.justify-content-center{justify-content:center!important}.bdr_left{border-left:1px solid #000}.bdr_right{border-right:1px solid #000}.bdr_top{border-top:1px solid #000}.bdr_bottom{border-bottom:1px solid #000}.text-center{text-align:center!important}.text-right{text-align:right!important}.text-left{text-align:left!important}.p-2{padding:.5rem!important}.p-1{padding:.25rem!important}.font-weight-bold{font-weight:700!important}.name_size{font-size:22px}.amount_bs{text-align:right;padding:0 3px}.main-balance .tfoot,.main-balance .thead{font-weight:600;padding:5px 3px;font-size:.8rem;border-top:1px solid #000;border-bottom:1px solid #000}.col-3{flex:0 0 25%;max-width:25%}.col{flex-basis:0;flex-grow:1;max-width:100%}.p-0{padding:0!important}.ittelic{font-style:italic}*,::after,::before{box-sizing:border-box}.bdr_right_fix{min-height:25px;border-right:1px solid #000}.bdr_left_fix{min-height:25px;border-left:1px solid #000}.d-block{display:block}table{width:100%;border-collapse:collapse;border-spacing:0;margin-bottom:20px}thead{display:table-header-group;vertical-align:middle;border-color:inherit}table td,table th{padding:3px;text-align:left;border-bottom:1px solid #fff;word-break:break-word}table th{white-space:nowrap;font-weight:600;font-size:.8rem;border:1px solid #000;background-color:#000!important;color:#fff!important;text-align:center}tr:nth-child(even){background-color:#d9e1f2}table td{text-align:left;border:1px solid #000;font-size:.75rem;}@media print{table th{background-color:#000!important;-webkit-print-color-adjust:exact}tr:nth-child(even){background-color:#d9e1f2;-webkit-print-color-adjust:exact}}@media print{table th{color:#fff!important}}</style></head><body>')
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
}








