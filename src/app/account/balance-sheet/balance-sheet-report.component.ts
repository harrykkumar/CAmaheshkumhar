import { Component, OnInit } from '@angular/core'
import { Subscription, from } from 'rxjs'
import { FormGroup } from '@angular/forms'
import { SaleTravel, AddCust } from '../../model/sales-tracker.model'
import { UIConstant } from '../../shared/constants/ui-constant'
declare const $: any
import { CommonService } from '../../commonServices/commanmaster/common.services'
import { ToastrCustomService } from '../../commonServices/toastr.service'
import { Settings } from '../../shared/constants/settings.constant'
import { LoginService } from './../../commonServices/login/login.services';
import {SetUpIds} from 'src/app/shared/constants/setupIds.constant'
import { Router } from '@angular/router'

@Component({
  selector: 'app-balance-sheet-report',
  templateUrl: './balance-sheet-report.component.html',
  styleUrls: ['./balance-sheet-report.component.css']
})
export class BalanceSheetReportComponent implements OnInit {
  DIRECT_SALE_TYPE: any = 'DirectSale'
  saleDirectDetails: any
  totalDiscount: number
  totaltax: number
  totalBillAmount: number
  newDateSub: Subscription
  newDatefromDate: Subscription
  toDateShow : any
  fromDateShow : any
  clientDateFormat: any
  constructor( public _router: Router,public _loginService: LoginService ,public _settings: Settings,public _commonService: CommonService, public _toastrCustomService: ToastrCustomService) {
  
    this.newDateSub = this._commonService.getsearchByDateForBalancesheetStatus().subscribe(
      (obj: any) => {
        this.getModuleSettingValue = JSON.parse(this._settings.moduleSettings)
        this.getModuleSettingData()
        this.toDateShow = obj.toDate
        this.fromDateShow = obj.fromDate
        this.getbalancesheetdata(obj.toDate ,obj.fromDate)
      }
    )

  }
  ngOnDestroy() { 
    this.detailRecivedSubscription.unsubscribe();
    this.newDateSub.unsubscribe()
}
  decimalDigit:any
  loggedinUserData: any
  ngOnInit () {
    this.onload()
  }
  onload(){
    this.headervalue2 =0
    this.headervalue1 =0
    this.headervalue1First=0
    this.headervalue2First=0
    
    const organization = JSON.parse(localStorage.getItem('SELECTED_ORGANIZATION'))
    this.loggedinUserData = organization
    this.getModuleSettingValue = JSON.parse(this._settings.moduleSettings)
    this._commonService.fixTableHF('cat-table')
  }
  getModuleSettingValue:any
  getModuleSettingData () {
        if ( this.getModuleSettingValue.settings.length > 0) {
          this.getModuleSettingValue.settings.forEach(ele => {
             if (ele.id=== SetUpIds.noOfDecimalPoint) {
              this.decimalDigit = JSON.parse(ele.val)
             }
             if (ele.id=== SetUpIds.dateFormat) {
              this.clientDateFormat =  ele.val[0].Val
              //console.log(this.clientDateFormat)
             }
   })
  }
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
  headervalue1 : any
  headervalue2: any
  BalanceSheetSummary: any
  headervalue1First:any =0
  orgDetails:any={}
  headervalue2First:any=0
  headI1dData:any =[]
  headI2dData:any=[]
  detailRecivedSubscription: Subscription;
  getbalancesheetdata (todate,fromdate) {
   this.mainData =[]
   this.detailRecivedSubscription = this._commonService.getBalanceSheetList(todate,fromdate).subscribe(data => {
      
      this.headervalue2 =0
      this.headervalue1 =0
      this.orgDetails ={}
      if(data.Code === UIConstant.THOUSAND ){
        if(data.Data && data.Data.BalanceSheets && data.Data.BalanceSheets.length >0){
         this.headI1dData = data.Data.BalanceSheets.filter(s=>s.HeadId ===1) 
         this.headI2dData = data.Data.BalanceSheets.filter(s=>s.HeadId ===2)
        }
        if(data.Data && data.Data.BalanceSheetSummary.length>0){
          data.Data.BalanceSheetSummary.forEach(element => {
            if(element.HeadId ===1){
             this.headervalue1 =element.Amount1
             this.headervalue1First =element.Amount
            }
            else if(element.HeadId ===2){
              this.headervalue2 =element.Amount1
              this.headervalue2First =element.Amount
             }
          });
        }
            if( data.Data.ImageContents.length >0 || data.Data.OrganizationDetails.length >0 ||  data.Data.EmailDetails.length >0 ||  data.Data.AddressDetails.length >0 || data.Data.ContactInfoDetails.length >0){
            this.orgDetails =data.Data
            }
        }
      })
  }
  
  viewFlag:boolean
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
    printWindow.document.write('<html><head><title>' + title + '</title><style>body{font-size:.75rem;color:#000!important;overflow-x:hidden;font-family:Calibri,sans-serif!important;position:relative;width:21cm;height:29.7cm;margin:0 auto}div{display:block}.row{display:flex;flex-wrap:wrap;padding-right:5px;padding-left:5px}.col-md-12{flex:0 0 100%;max-width:100%}.col-md-3{flex:0 0 25%;max-width:25%}.col,.col-1,.col-10,.col-11,.col-12,.col-2,.col-3,.col-4,.col-5,.col-6,.col-7,.col-8,.col-9,.col-auto,.col-lg,.col-lg-1,.col-lg-10,.col-lg-11,.col-lg-12,.col-lg-2,.col-lg-3,.col-lg-4,.col-lg-5,.col-lg-6,.col-lg-7,.col-lg-8,.col-lg-9,.col-lg-auto,.col-md,.col-md-1,.col-md-10,.col-md-11,.col-md-12,.col-md-2,.col-md-3,.col-md-4,.col-md-5,.col-md-6,.col-md-7,.col-md-8,.col-md-9,.col-md-auto,.col-sm,.col-sm-1,.col-sm-10,.col-sm-11,.col-sm-12,.col-sm-2,.col-sm-3,.col-sm-4,.col-sm-5,.col-sm-6,.col-sm-7,.col-sm-8,.col-sm-9,.col-sm-auto,.col-xl,.col-xl-1,.col-xl-10,.col-xl-11,.col-xl-12,.col-xl-2,.col-xl-3,.col-xl-4,.col-xl-5,.col-xl-6,.col-xl-7,.col-xl-8,.col-xl-9,.col-xl-auto{position:relative;width:100%;min-height:1px}.justify-content-center{justify-content:center!important}.balancesheet{border:1px solid #000;background:#fff}.bdr_left{border-left:1px solid #000}.bdr_right{border-right:1px solid #000}.bdr_top{border-top:1px solid #000}.bdr_bottom{border-bottom:1px solid #000}.text-center{text-align:center!important}.p-2{padding:.5rem!important}.p-1{padding:.25rem!important}.font-weight-bold{font-weight:700!important}.name_size{font-size:22px}.amount_bs{text-align:right;padding:0 3px}.main-balance .tfoot,.main-balance .thead{font-weight:600;padding:5px 3px;font-size:.80rem;border-top:1px solid #000;border-bottom:1px solid #000}.col-3{flex:0 0 25%;max-width:25%}.col{flex-basis:0;flex-grow:1;max-width:100%}.col-md-6{flex:0 0 50%;max-width:50%}.p-0{padding:0!important}.ittelic{font-style:italic}*,::after,::before{box-sizing:border-box}.bdr_right_fix{min-height:30px;border-right:1px solid #000}.tfoot,.thead{background-color:#000!important;color:#fff}@media print{.thead{background-color:#000!important;-webkit-print-color-adjust:exact}.tfoot{background-color:#000!important;-webkit-print-color-adjust:exact}}@media print{.thead{color:#fff!important}.tfoot{color:#fff!important}}.font-italic{font-style: italic;}.normal{font-weight: 550;font-style: normal}.bold{font-weight: bold}</style></head><body>')
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

  openLedgerSummary (item){
    console.log(item)
      if( item.LevelNo ===3 && item.GlId !==22){
        this._commonService.ledgerSummary(item.GlId,item.GlName)
       this._router.navigate(['/account/ledger-summary'])
      }
      if(item.GlId === -999){
       this._router.navigate(['/account/Profit-Loss'])
      }
      if(( item.LevelNo ===3 && item.GlId ===22 ) || (item.GlId ===22 )){
        this._commonService.AddedItem()
       this._router.navigate(['/ims/report/item-inventory'])
      }
  }




}








