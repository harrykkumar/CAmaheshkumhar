
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core'
import { Subscription ,fromEvent} from 'rxjs'
import { UIConstant } from '../../../shared/constants/ui-constant'
declare const $: any
import { map, filter, debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { CommonService } from '../../../commonServices/commanmaster/common.services'
import { ToastrCustomService } from '../../../commonServices/toastr.service'
import { VendorServices } from '../../../commonServices/TransactionMaster/vendoer-master.services'
import { PagingComponent } from '../../../shared/pagination/pagination.component'
import { FormGroup, FormBuilder } from '@angular/forms'
import { Settings } from '../../../shared/constants/settings.constant'

@Component({
  selector: 'app-sales-list',
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.css']
})
export class SalesListComponent implements   OnInit   {
  DIRECT_SALE_TYPE: any = 'DirectSale'
  saleDirectDetails: any
  itemsPerPage: number = 20
  totalDiscount: number=0
  totaltax: number=0
  totalBillAmount: number=0
  refreshingpage: Subscription
  newBillSub: Subscription
  queryStr$: Subscription
  total: number = 0
  searchForm: FormGroup
  isSearching: boolean = false
  queryStr: string = ''
  lastItemIndex: number = 0
  p: number = 1
  decimalDigit:any
  
  // generate bar code
  InventoryTransactionSales: any
  barcode: any
  ItemAttributesTransactions: any
  reciverContData: any
  reciverAddress: any
  itemAttributeDatails: any
  itemAttbute: any =[]
  website: any
  ContactCustInfo: any
  ContactOrgInfo: any
  ItemTaxTrans: any
  totalDiscountAmt: any =0
  totaltaxAmount: any=0
  subTotalAmount: any=0
  billAmount: any
  paymentModeData: any =[]
  TermsConditions: any
  ClientInfos: any
  billName ={
   billspply: 'Bill Of Supply',
   taxname:'Tax-Invoice'
  }
  getAddtionalCharge: any
  dicimalDigitFormat:any
  clientDateFormat:any
  constructor ( private _settings: Settings,private _formBuilder : FormBuilder,private _coustomerServices: VendorServices,public _commonService: CommonService ,public _toastrCustomService: ToastrCustomService) {
    this.formSearch()
    this.clientDateFormat = this._settings.dateFormat
    this.dicimalDigitFormat = this._settings.noOfDecimal
    this.decimalDigit =this._settings.noOfDecimal
    this.getSaleDetail()
    
    this.newBillSub = this._commonService.newSaleStatus().subscribe(
      (obj: any) => {
        this.getSaleDetail()

      }
    )
    this.queryStr$ = this._commonService.querySaleStr$.subscribe(
      (str) => {
        console.log(str)
        this.queryStr = str
        this.p = 1
        this.getSaleDetail()
      }
    )
    this.refreshingpage = this._commonService.newRefreshItemStatus().subscribe(
      (obj) => {  
          this.getSaleDetail()
      }
    )

  }

  openSaleDirect (id) {
    this._commonService.openSaleDirect(id,true)
  }
  @ViewChild('searchData') searchData: ElementRef
  industryId:any
  ngOnInit () {
         let data = JSON.stringify(this._settings.industryId)
      this.industryId = JSON.parse(data)
    this._commonService.fixTableHF('cat-table')
    fromEvent(this.searchData.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value
      }),
      filter(res => res.length > 1 || res.length === 0),
      debounceTime(1000),
      distinctUntilChanged()
      ).subscribe((text: string) => {
        this.isSearching = true
        this.searchGetCall(text).subscribe((data) => {
          console.log('search data : ', data)
          setTimeout(() => {
            this.isSearching = false
          }, 100)
          this.saleDirectDetails = data.Data
          this.total = this.saleDirectDetails[0] ? this.saleDirectDetails[0].TotalRows : 0
        },(err) => {
          setTimeout(() => {
            this.isSearching = false
          }, 100)
          console.log('error',err)
        },
        () => {
          setTimeout(() => {
            this.isSearching = false
          }, 100)
        })
      })
  }
  toShowSearch = false
  @ViewChild('paging_comp') pagingComp: PagingComponent
  private formSearch () {
    this.searchForm = this._formBuilder.group({
      'searckKey': [UIConstant.BLANK]
    })
  }
  toggleSearch () {
    this.toShowSearch = !this.toShowSearch
  }
  searchGetCall (term: string) {
    if (!term) {
      term = ''
    }
    this.pagingComp.setPage(1)
    return this._commonService.getListSaleDirect( '?Strsearch=' + term + '&Page=' + this.p + '&Size=' + this.itemsPerPage + this.queryStr)
  }
  getSaleDetail () {
    
    if (!this.searchForm.value.searckKey) {
      this.searchForm.value.searckKey = ''
    }
    this._commonService.getListSaleDirect('?Strsearch=' + this.searchForm.value.searckKey + '&Page=' + this.p + '&Size=' + this.itemsPerPage + this.queryStr).subscribe(data => {
      console.log('sales data: ', data)
      if (data.Code === UIConstant.THOUSAND && data.Data.SaleDetails.length >0) {
        this.totalDiscount = 0
        this.totaltax = 0
        this.totalBillAmount = 0
        this.saleDirectDetails = data.Data.SaleDetails
        this.total = this.saleDirectDetails[0] ? this.saleDirectDetails[0].TotalRows : 0

        data.Data.SaleDetails.forEach(element => {
          this.totalDiscount = +(this.totalDiscount + +element.Discount).toFixed(this.decimalDigit)
          this.totaltax = +(this.totaltax + +element.TaxAmount).toFixed(this.decimalDigit)
          this.totalBillAmount = +(this.totalBillAmount + +element.BillAmount).toFixed(this.decimalDigit)
        })

      }
    })
  }
  openPrint (id,HtmlId ,isViewPrint) {
    this.onPrintForDirectSale(id,HtmlId,isViewPrint)
  }
  BillName:any
  customerAddress:any =[]
  orgImageData:any
  ItemTransactionactions:any =[]
  orgImage :any
  orgAddress:any
  inWordBillAmount:string=''
  onPrintForDirectSale (id, htmlId,isViewForm) {
  //  this.orgImage = 'http://app.saniiro.com/uploads/2/2/2/Images/Organization/ologorg.png'
    let _self = this
    _self._commonService.printDirectSale(id).subscribe(data => {
      //    console.log(JSON.stringify(data)  , 'salechallan')
      if (data.Code === UIConstant.THOUSAND) {

        if (data.Data && data.Data.SaleTransactionses.length > 0) {
          _self.InventoryTransactionSales = []
          this.billAmount = 0
          _self.InventoryTransactionSales = data.Data.SaleTransactionses
          _self.barcode = data.Data.SaleTransactionses[0].BarcodeBill
          this.billAmount = (data.Data.SaleTransactionses[0].BillAmount).toFixed(this.dicimalDigitFormat)
          this.inWordBillAmount = this._commonService.NumInWords(this.billAmount)
        } else {
          _self.InventoryTransactionSales = []
        }
        
        _self.ItemTransactionactions = []
        if (data.Data && data.Data.ItemTransactions.length > 0) {
          _self.ItemTransactionactions = []
          _self.ItemTransactionactions = data.Data.ItemTransactions
        } else {
          _self.ItemTransactionactions = []
        }
        if (data.Data && data.Data.AdditionalChargeDetails.length > 0) {
          _self.getAddtionalCharge = []
          _self.getAddtionalCharge = data.Data.AdditionalChargeDetails
        } else {
          _self.getAddtionalCharge = []
        }
        
        if (data.Data.AttributeValues.length > 0) {
          _self.itemAttributeDatails = []
          _self.itemAttributeDatails = data.Data.AttributeValues
        } else {
          _self.itemAttributeDatails = []
        }
        if (data.Data.ItemTaxTransDetails.length > 0) {
          this.BillName='Tax-Invoice'
          _self.ItemTaxTrans = []
          _self.ItemTaxTrans = data.Data.ItemTaxTransDetails
        } else {
          this.BillName='Bill Of Supply'
          
          _self.ItemTaxTrans = []
        }
        //
        if (data.Data.ItemTaxTransDetails.length > 0) {
          _self.paymentModeData = []
          _self.paymentModeData = data.Data.PaymentDetails
        } else {
          _self.paymentModeData = []
        }
        if (data.Data.ImageContents.length > 0) {
          _self.orgImageData =''
          _self.orgImageData =  data.Data.ImageContents[0].FilePath
          console.log( _self.orgImageData,'image')
        } else {
          _self.orgImageData = ''
        }
        if (data.Data && data.Data.ItemTransactions.length > 0) {
          _self.ItemTransactionactions = []
          _self.itemAttbute = []
          this.totalDiscountAmt = 0
          this.totaltaxAmount = 0
          this.subTotalAmount = 0
          let totalDiscountAmt = data.Data.ItemTransactions.filter(item1 => item1.DiscountAmt)
            .map(item1 => parseFloat(item1.DiscountAmt))
            .reduce((sum, current) => sum + current, 0)
             this.totalDiscountAmt = (totalDiscountAmt).toFixed(this.dicimalDigitFormat)
          let totaltaxAmount = data.Data.ItemTransactions.filter(item1 => item1.TaxAmount)
            .map(item1 => parseFloat(item1.TaxAmount))
            .reduce((sum, current) => sum + current, 0)
            this.totaltaxAmount = (totaltaxAmount).toFixed(this.dicimalDigitFormat)
          let subTotalAmount = data.Data.ItemTransactions.filter(item1 => item1.SubTotalAmount)
            .map(item1 => parseFloat(item1.SubTotalAmount))
            .reduce((sum, current) => sum + current, 0)
            this.subTotalAmount = (subTotalAmount).toFixed(this.dicimalDigitFormat)
          _self.ItemTransactionactions = data.Data.ItemTransactions
          for (let i = 0; i < data.Data.ItemTransactions.length; i++) {
            for (let j = 0; j < data.Data.ItemAttributesTrans.length; j++) {
              if (data.Data.ItemTransactions[i].Id === data.Data.ItemAttributesTrans[j].ItemTransId) {
                this.itemAttbute.push({
                  attr: data.Data.ItemAttributesTrans[j].AttributeName,
                  ItemId: data.Data.ItemAttributesTrans[j].ItemId,
                  rowId: data.Data.ItemAttributesTrans[j].ItemTransId,
                  Id: data.Data.ItemAttributesTrans[j].Id
                })
              }
            }
          }
        } else {
          _self.ItemTransactionactions = []
        }
        if (data.Data.AddressDetails.length > 0) {
          _self.customerAddress = []
          _self.customerAddress = data.Data.AddressDetails
        } else {
          _self.customerAddress = []
        }
        if (data.Data.AddressDetailsOrg.length > 0) {
          _self.orgAddress = []
          _self.orgAddress = data.Data.AddressDetailsOrg
        } else {
          _self.orgAddress = []
        }
        if (data.Data.Websites.length > 0) {
          this.website = []
          this.website = data.Data.Websites
        } else {
          this.website = []
        }
        if (data.Data.ContactInfos.length > 0) {
          this.ContactCustInfo = []
          this.ContactCustInfo = data.Data.ContactInfos
        } else {
          this.ContactCustInfo = []
        }
        if (data.Data.TermsConditions.length > 0) {
          this.TermsConditions = []
          this.TermsConditions = data.Data.TermsConditions
        } else {
          this.TermsConditions = []
        }
        if (data.Data.ClientInfos.length > 0) {
          this.ClientInfos = []
          this.ClientInfos = data.Data.ClientInfos
        } else {
          this.ClientInfos = []
        }
        if (data.Data.ContactInfosOrg.length > 0) {
          this.ContactOrgInfo = []
          this.ContactOrgInfo = data.Data.ContactInfosOrg
        } else {
          this.ContactOrgInfo = []
        }
        if (data.Data.EmailsOrg.length > 0) {
          this.EmailsOrg = []
          this.EmailsOrg = data.Data.EmailsOrg
        } else {
          this.EmailsOrg = []
        }
        if (data.Data.Emails.length > 0) {
          this.Emails = []
          this.Emails = data.Data.Emails
        } else {
          this.Emails = []
        }
        // if (data.Data.SupplyAddress.length > 0) {
        //   this.SupplyAddress = []
        //   this.SupplyAddress = data.Data.SupplyAddress
        // } else {
        //   this.SupplyAddress = []
        // }
        if (data.Data.CustomerTypes.length > 0) {
          this.CustomerTypes = []
          this.CustomerTypes = data.Data.CustomerTypes
          this.CustomerTypesLength = data.Data.CustomerTypes.length

        } else {
          this.CustomerTypes = []
        }
        if (data.Data.HsnItemTaxTransDetails.length > 0) {

        this.ValueOfTaxName(data.Data.HsnItemTaxTransDetails, data.Data.HsnItemTransactions,data.Data.TaxTitles, data.Data.SaleTransactionses[0].Currency)
          this.hsntaxItem = data.Data.HsnItemTaxTransDetails
        } else {
          this.hsntaxItem = []
        }     
        setTimeout(function () {
          _self.InitializedPrintForDirectSale(htmlId,isViewForm)
        }, 10)
        $('#' + htmlId).modal(UIConstant.MODEL_SHOW)
      }
    }
    )

  }
  Emails:any=[]
  CustomerTypesLength:any
  CustomerTypes:any=[]
  hsnItemData:any=[]
  EmailsOrg:any=[]
  hsntaxItem:any=[]
  get values (): string[] {
    if (this.barcode) {
      return this.barcode.split('\n')
    }
  }
  InitializedPrintForDirectSale (cmpName,isViewForm) {
    let title = document.title
    let divElements = document.getElementById(cmpName).innerHTML
    let printWindow = window.open()
    printWindow.document.open()
    printWindow.document.write('<html><head><title>' + title + '</title><style>@media print {.hidden-print {display: none !important;}}.clearfix:after{content:"";display:table;clear:both}a{color:#0087c3;text-decoration:none}body{position:relative;width:21cm;height:29.7cm;margin:0 auto;color:#000;background:#fff;font-family:Calibri;font-size:12px}.row{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-direction:row}.col{-ms-flex-preferred-size:0;-ms-flex-positive:1;padding-left:10px;max-width:100%}.row1{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-direction:row;flex-wrap:wrap;margin-right:1px;margin-left:0}.col1{-ms-flex-preferred-size:0;flex-basis:0;-ms-flex-positive:1;flex-grow:1;max-width:100%}header{padding:10px 0}.header1{padding:1px 0;border-top:1px solid #333;border-bottom:1px solid #333}#logo{float:left;margin-top:8px}#logo img{height:70px}#company{float:right;text-align:right}#client{padding-left:6px;float:left}#client .to{color:#333}h2.name{font-size:1.4em;font-weight:600;margin:0}#invoice{float:right;text-align:right}#invoice h1{color:#0087c3;font-size:2.4em;line-height:1em;font-weight:400;margin:0 0 10px 0}#invoice .date{font-size:1.1em;color:#000}table{width:100%;border-collapse:collapse;border-spacing:0;margin-bottom:5px}table td,table th{padding:1px;vertical-align:bottom;text-align:center;font-size:12px;word-break:break-all}table th{white-space:nowrap;font-weight:700}table td{text-align:left}table td h3{color:#000;font-size:1em;font-weight:600;margin:0 0 .2em 0}table .no{color:#000}table .desc{text-align:left}table .total{color:#000;text-align:right}table td.qty,table td.total,table td.unit{font-size:1em}table tfoot td{background:#fff;border-bottom:none;font-weight:600;text-align:right;white-space:nowrap;margin-top:100px}table tfoot tr:first-child td{border-top:none}table tfoot tr:last-child td{border-top:1px solid #333}.table1 tbody tr td,.table1 thead tr th{border:1px solid #333;word-break:break-all}#thanks{font-size:2em;margin-bottom:50px}#notices{padding-left:6px;border-left:6px solid #0087c3}#notices .notice{font-size:1.2em}footer{color:#000;width:100%;height:30px;position:absolute;bottom:60px;border-top:1px solid #aaa;padding:8px 0;text-align:center}.name-footer{text-align:left;margin:0;font-size:12px;padding-left:10px}.tbl_footer tr td{text-align:right}.tbl_footer tr td.total{text-align:right;font-weight:700;width:120px}.total_word{padding:4px;border-top:1px solid #333}.terms_section { color: #000;width: 100%; position: absolute;bottom: 115px; border-top: 1px solid #aaa;padding:0;}.tbl_fix_height { min-height: 320px;border-bottom:1px solid #333;}</style></head><body>')
    printWindow.document.write(divElements)
    printWindow.document.write('</body></html>')
    printWindow.document.close()
    printWindow.focus()
    $('#' + cmpName).modal(UIConstant.MODEL_HIDE)
    setTimeout(function () {
      if(!isViewForm){
        document.getElementsByTagName('body')[0] .classList.add('hidden-print');
      printWindow.print()
      printWindow.close()
      }
   
    }, 100)

  }
  HedShow:any=[]
  mainData:any=[]
  ValueOfTaxName (hsnData, hsnTransaction,TaxTitles, currency) {
    //TaxTitleId
    let rate=0
    this.mainData =[]
    this.HedShow=[]
    let valueshow=[]
         hsnTransaction.forEach(element => {
          this.HedShow = hsnData.filter( d=>d.HsnNo ===element.HsnNo)
          if(this.HedShow.length>0){
              valueshow=[]
             rate = this.HedShow.filter(item1 => item1.TaxRate)
                .map(item1 => parseFloat(item1.TaxRate))
                .reduce((sum, current) => sum + current, 0)
                for(let i =0; i<this.HedShow.length; i++){
                  valueshow.push(this.HedShow[i].Amount+ '-' + '('+this.HedShow[i].TaxRate +')'+'%')
                }
          
          }
         
          this.mainData.push({
            HsnNo:element.HsnNo,
            TaxableAmount:element.TaxableAmount,
            TotalAmount:element.TotalAmount,
           totalTaxRate:rate +'%',
           TaxType:valueshow,
          })
        });
        console.log(this.mainData ,'Main-HSN')

}
}
