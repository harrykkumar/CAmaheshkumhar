import { PagingComponent } from './../../shared/pagination/pagination.component';
import { GlobalService } from 'src/app/commonServices/global.service';
import { Settings } from './../../shared/constants/settings.constant';
import { UIConstant } from 'src/app/shared/constants/ui-constant';
import { ToastrCustomService } from './../../commonServices/toastr.service';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash'
import { Subject } from 'rxjs';
import { Subscription, from } from 'rxjs'
import { Select2OptionData, Select2Component } from 'ng2-select2'

declare var $: any
declare var flatpickr: any
import { AddCust, ResponseSale, TravelPayments } from '../../model/sales-tracker.model'


@Component({
  selector: 'app-ledger-summary',
  templateUrl: './ledger-summary.component.html',
  styleUrls: ['./ledger-summary.component.css']
})
export class LedgerSummaryComponent implements OnInit, AfterViewInit {
  ledgerSummary: any = {}
  ledgerItemList: Array<any> = [];
  clientDateFormat: any
  model: any = {};
  lastItemIndex: number = 0
  pageSize: number = 20
  pageNo: number = 1
  totalItemSize: number = 0
  
  @ViewChild('ledger_paging') ledgerPagingModel: PagingComponent
 

  private unSubscribe$ = new Subject<void>()
  newDateSub: Subscription
  ledgerItemId:any =0
  constructor(
    public _globalService: GlobalService,
    public _settings: Settings,
    public _commonService: CommonService,
    private _toastService: ToastrCustomService,
  ) {

    this.clientDateFormat = this._settings.dateFormat
    this.noOfDecimal =this._settings.noOfDecimal
    this.getLedgerItemList();
    this.newDateSub = this._commonService.ledgerSummaryStatus().subscribe(
      (obj: any) => {
        if(obj.id>0){ 
          this.model={
           selectedLedgerItem:{id:obj.id}
          }
          this.selectedLedgerId =obj.id
         let event ={
           id :obj.id,
           text:obj.name
         }
          this.onLedgerItemChange(event)
          this.ledgerItemId = obj.id,
          this.getLedgerSummaryData();
     
        }
     
      }
    )
  }
  noOfDecimal:any
  isViewPrint:boolean =false
  ngOnInit() {
    this.readyprintOn = false
    this.viewFlag=true
    this.isViewPrint= false
    //this.getLedgerSummaryData();
    this._commonService.fixTableHF('cat-table')
    this._commonService.fixTableHF('fix-footer')
  }

  ngAfterViewInit(){
    this.toDate()
    this.fromDate()
  }
  fromDate = () => {
    $('#ledger-from-date').flatpickr({
      dateFormat: this.clientDateFormat,
      onOpen: () => {
        this.model.fromDatevalue = ''
      }
    })
  }
  searchButton (){
    this.viewFlag=true
    this.isViewPrint= false
    this.getLedgerSummaryData()
  }
  toDate = () => {
    $('#ledger-to-date').flatpickr({
      dateFormat: this.clientDateFormat,
      onOpen: () => {
        this.model.toDateValue = ''
      }
    })
  }

  viewDataMode (id) {
    if(this.readyprintOn &&  this.model.toDateValue !==''  ){
      $('#'+id).modal(UIConstant.MODEL_SHOW)
    }
    else{
      this._toastService.showError('','Please Select Ledger & Date')
    }
 
  }
  formTypeNmae:string='Select Ledger'
  selectedLedgerId:number=0
  LedgerName:any =''
  readyprintOn:boolean = false
  onLedgerItemChange = (event) => {
    if(this.ledgerItemId !==null){
      this.isViewPrint= false
      if(event.id>0){
       this.selectedLedgerId = +this.ledgerItemId
        this.readyprintOn =true
        this.LedgerName=event.text
      }
    }
    else{
      this.readyprintOn =false
    }
 

  }

  getLedgerItemList = () => {
    this.isViewPrint= false
    this._commonService.getLedgerItemList().pipe(
      takeUntil(this.unSubscribe$),
      map((data: any) => {
        return _.map(data.Data, (element) => {
          return {
            id: element.Id,
            text: element.Name
          }
        })
      })
    )
      .subscribe((response: any) => {
        this.ledgerItemList = [{ id: UIConstant.ZERO, text: 'Select Ledger' }, ...response];
      })
  }
  getValueFalg: boolean = true

  getLedgerSummaryData = () => {
    let fromDate, toDate
    if (this.model.fromDatevalue) {
      fromDate = this._globalService.clientToSqlDateFormat(this.model.fromDatevalue, this.clientDateFormat)
    }
    if (this.model.toDateValue) {
      toDate = this._globalService.clientToSqlDateFormat(this.model.toDateValue, this.clientDateFormat)
    }
    const data = {
      LedgerId:  this.selectedLedgerId,
      FromDate: fromDate ? fromDate : '',
      ToDate: toDate ? toDate : '',
      Page: this.pageNo,
      Size: this.pageSize
    }
    this._commonService.getLedgerSummaryData(data).pipe(
      takeUntil(this.unSubscribe$)
    ).subscribe((response: any) => {
      if (response.Code === UIConstant.THOUSAND && response.Data && response.Data.LedgerStatements.length > 0) {
        this.ledgerSummary = response.Data;
       this.getValueFalg = false
       if(this.isViewPrint ){
          this.printLoad(this.htmlLoadid,this.isViewPrint)
      }
        this.totalItemSize = response.Data.LedgerStatements[0].TotalRows;
      } else if (response.Code === UIConstant.THOUSAND && response.Data && response.Data.LedgerStatements.length === 0) {
        this.getValueFalg = true
        this.ledgerSummary = {
          LedgerStatements: [],
          LedgerStatementsSummary: [],
          AddressDetails:[],
          ContactInfoDetails:[],
          EmailDetails:[],
          OrganizationDetails:[],
          ImageContents:[]
        }
        this.totalItemSize = 0;
      } else {
        this._toastService.showError("Error in Data Fetching", '');
      }
      console.log(this.ledgerSummary  ,'fff')
    }, (error) => {
      console.log(error);
    });
  }

  onPageNoChange = (event) => {
    this.isViewPrint= false
    this.viewFlag=true
    this.pageNo = event
    this.getLedgerSummaryData()
  }

  onPageSizeChange = (event) => {
    this.isViewPrint= false
    this.viewFlag=true
    this.pageSize = event
    this.getLedgerSummaryData()
  }

  onLastValueChange = (event) => {
    this.isViewPrint= false
    this.viewFlag=true
    this.lastItemIndex = event
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next()
    this.unSubscribe$.complete()
  }
  htmlLoadid:any
  viewFlag:any
  openPrint (HtmlId ,isViewPrint) {
    this.viewFlag=false
    this.isViewPrint =isViewPrint
    this.htmlLoadid= HtmlId
   this.getLedgerSummaryData()
  }
  closeBtn (){
    this.viewFlag=true
  }
  @ViewChild('setWise') setTypeWise: Select2Component
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
