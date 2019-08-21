
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core'
import { Subscription, fromEvent } from 'rxjs'
import { UIConstant } from '../../../shared/constants/ui-constant'
declare const $: any
import { filter, debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { CommonService } from '../../../commonServices/commanmaster/common.services'
import { ToastrCustomService } from '../../../commonServices/toastr.service'
import { VendorServices } from '../../../commonServices/TransactionMaster/vendoer-master.services'
import { PagingComponent } from '../../../shared/pagination/pagination.component'
import { FormGroup, FormBuilder } from '@angular/forms'
import { Settings } from '../../../shared/constants/settings.constant'
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { SetUpIds } from 'src/app/shared/constants/setupIds.constant'

// import {SaleCommonService }  from '../../../../../../sales-direct-return/saleCommon.service'
@Component({
  selector: 'app-sales-list',
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.css']
})
export class SalesListComponent implements OnInit {
  DIRECT_SALE_TYPE: any = 'DirectSale'
  saleDirectDetails: any
  itemsPerPage: number = 20
  totalDiscount: number = 0
  totaltax: number = 0
  totalBillAmount: number = 0
  refreshingpage: Subscription
  newBillSub: Subscription
  deleteSub: Subscription
  queryStr$: Subscription
  total: number = 0
  searchForm: FormGroup
  isSearching: boolean = false
  queryStr: string = ''
  lastItemIndex: number = 0
  p: number = 1
  decimalDigit: any
  paymentFlag: boolean
  // generate bar code
  InventoryTransactionSales: any
  barcode: any
  ItemAttributesTransactions: any
  reciverContData: any
  reciverAddress: any
  itemAttributeDatails: any
  itemAttbute: any = []
  website: any
  ContactCustInfo: any
  ContactOrgInfo: any
  ItemTaxTrans: any
  totalDiscountAmt: any = 0
  totaltaxAmount: any = 0
  subTotalAmount: any = 0
  billAmount: any
  paymentModeData: any = []
  TermsConditions: any
  ClientInfos: any
  billName = {
    billspply: 'Bill Of Supply',
    taxname: 'Tax-Invoice'
  }
  getAddtionalCharge: any
  dicimalDigitFormat: any
  clientDateFormat: any
  PrintFormateType:number =1
  constructor(private _loaderService :NgxSpinnerService ,private _settings: Settings, private _formBuilder: FormBuilder, private _coustomerServices: VendorServices, public _commonService: CommonService, public _toastrCustomService: ToastrCustomService) {
    this.formSearch()
    this.clientDateFormat = this._settings.dateFormat
    this.dicimalDigitFormat = this._settings.noOfDecimal
    this.decimalDigit = this._settings.noOfDecimal
    this.getSaleDetail()
    this.getSetUpModules((JSON.parse(this._settings.moduleSettings).settings))
    this.newBillSub = this._commonService.newSaleStatus().subscribe(
      (obj: any) => {
        this.getSaleDetail()

      }
    )
    this.deleteSub = this._commonService.getDeleteStatus().subscribe(
      (obj) => {
        if (obj.id && obj.type && obj.type === 'sale') {
          this.deleteItem(obj.id)
        }
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
  getSetUpModules(settings) {
    debugger
    settings.forEach(element => {
      if (element.id === SetUpIds.printFormate) {
         if(element.val){
          this.PrintFormateType = element.val
         }
      }
      
    })
   
  }
  openSaleDirect(id) {
    this._commonService.openSaleDirect(id, true)
  }
  @ViewChild('searchData') searchData: ElementRef
  industryId: any
  ngOnInit() {
  //  this._loaderService.show()
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
      }, (err) => {
        setTimeout(() => {
          this.isSearching = false
        }, 100)
        console.log('error', err)
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
  private formSearch() {
    this.searchForm = this._formBuilder.group({
      'searckKey': [UIConstant.BLANK]
    })
  }
  toggleSearch() {
    this.toShowSearch = !this.toShowSearch
  }
  searchGetCall(term: string) {
    if (!term) {
      term = ''
    }
    this.pagingComp.setPage(1)
    return this._commonService.getListSaleDirect('?Strsearch=' + term + '&Page=' + this.p + '&Size=' + this.itemsPerPage + this.queryStr)
  }
  getSaleDetail() {
    //this._loaderService.show()

    if (!this.searchForm.value.searckKey) {
      this.searchForm.value.searckKey = ''
    }
    this._commonService.getListSaleDirect('?Strsearch=' + this.searchForm.value.searckKey + '&Page=' + this.p + '&Size=' + this.itemsPerPage + this.queryStr).subscribe(data => {
      console.log('sales data: ', data)
      if (data.Code === UIConstant.THOUSAND && data.Data.SaleDetails.length > 0) {
        //this._loaderService.hide()
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
  openPrint(id, HtmlId, isViewPrint) {
    this.onPrintForDirectSale(id, HtmlId, isViewPrint)
  }
  BillName: any
  customerAddress: any = []
  orgImageData: any
  ItemTransactionactions: any = []
  orgImage: any
  orgAddress: any
  inWordBillAmount: string = ''
  paidFlag: any
  onPrintForDirectSale(id, htmlId, isViewForm) {
    let _self = this
    _self._commonService.printDirectSale(id).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND) {
        if (data.Data && data.Data.SaleTransactionses.length > 0) {
          _self.InventoryTransactionSales = []
          this.billAmount = 0
          _self.InventoryTransactionSales = data.Data.SaleTransactionses
          this.paidFlag = data.Data.SaleTransactionses[0].OutStanding === 0 ? 'PAID' : 'UNPAID'
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
          console.log(data.Data.AdditionalChargeDetails ,'ddddddd---')
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
          this.BillName = 'Tax-Invoice'
          _self.ItemTaxTrans = []
          _self.ItemTaxTrans = data.Data.ItemTaxTransDetails
        } else {
          this.BillName = 'Bill Of Supply'

          _self.ItemTaxTrans = []
        }
        //
        if (data.Data.PaymentDetails.length > 0) {
          _self.paymentModeData = []
          _self.paymentModeData = data.Data.PaymentDetails
          this.paymentFlag = true
        } else {
          _self.paymentModeData = []
          this.paymentFlag = false

        }
        if (data.Data.ImageContents.length > 0) {
          _self.orgImageData = ''
          _self.orgImageData = data.Data.ImageContents[0].FilePath
          console.log(_self.orgImageData, 'image')
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

        if (data.Data.CustomerTypes.length > 0) {
          this.CustomerTypes = []
          this.CustomerTypes = data.Data.CustomerTypes
          this.CustomerTypesLength = data.Data.CustomerTypes.length

        } else {
          this.CustomerTypes = []
        }
        if (data.Data.HsnItemTaxTransDetails.length > 0 && data.Data.HsnItemTransactions.length > 0 && data.Data.SaleTransactionses.length > 0) {

          this.ValueOfTaxName(data.Data.HsnItemTaxTransDetails, data.Data.HsnItemTransactions, data.Data.TaxTitles, data.Data.SaleTransactionses[0].Currency)
          this.hsntaxItem = data.Data.HsnItemTaxTransDetails
        } else {
          this.hsntaxItem = []
        }
        
       setTimeout(function () {
            _self.printTypeFormateValue1(htmlId, isViewForm)
       
       }, 10)
        $('#' + htmlId).modal(UIConstant.MODEL_SHOW)
      }
    }
    )

  }
  Emails: any = []
  CustomerTypesLength: any
  CustomerTypes: any = []
  hsnItemData: any = []
  EmailsOrg: any = []
  hsntaxItem: any = []
  get values(): string[] {
    if (this.barcode) {
      return this.barcode.split('\n')
    }
  }
  printTypeFormateValue1(cmpName, isViewForm) {
    debugger
    let title = document.title
    let divElements = document.getElementById(cmpName).innerHTML
    let printWindow = window.open()
    let AppliyedCSSType1 = `
@media print {.hidden-print {display: none !important;}}.clearfix:after{content:"";display:table;clear:both}a{color:#0087c3;text-decoration:none}body{position:relative;width:21cm;height:29.7cm;margin:0 auto;color:#000;background:#fff;font-family:Calibri;font-size:12px}.row{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-direction:row}.col{-ms-flex-preferred-size:0;-ms-flex-positive:1;padding-left:10px;max-width:100%}.row1{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-direction:row;flex-wrap:wrap;margin-right:1px;margin-left:0}.col1{-ms-flex-preferred-size:0;flex-basis:0;-ms-flex-positive:1;flex-grow:1;max-width:100%}header{padding:10px 0}.header1{padding:1px 0;border-top:1px solid #333;border-bottom:1px solid #333}#logo{float:left;margin-top:8px}#logo img{height:70px}#company{float:right;text-align:right}#client{padding-left:6px;float:left}#client .to{color:#333}h2.name{font-size:1.6em;font-weight:600;margin:0;text-transform:uppercase}#invoice{float:right;text-align:right}#invoice h1{color:#0087c3;font-size:2.2em;line-height:1em;font-weight:400;margin:0 0 10px 0}#invoice .date{font-size:1.1em;color:#000}table{width:100%;border-collapse:collapse;border-spacing:0;margin-bottom:5px}table td,table th{padding:1px;vertical-align:top;text-align:center;font-size:12px;word-break:break-word}table th{white-space:nowrap;font-weight:700}table td{text-align:left}table td h3{color:#000;font-size:1.2em;font-weight:600;margin:0 0 .2em 0}table .no{color:#000}table .desc{text-align:left}table .total{color:#000;text-align:right}table td.qty,table td.total,table td.unit{font-size:1.2em}table tfoot td{background:#fff;border-bottom:none;font-weight:600;text-align:right;white-space:nowrap;margin-top:100px}table tfoot tr:first-child td{border-top:none}table tfoot tr:last-child td{border-top:1px solid #333}.table1 tbody tr td,.table1 thead tr th{border:1px solid #333;word-break:break-all}#thanks{font-size:2em;margin-bottom:50px}#notices{padding-left:6px;border-left:6px solid #0087c3}#notices .notice{font-size:1.2em}footer{color:#000;width:100%;height:30px;position:absolute;bottom:60px;border-top:1px solid #aaa;padding:8px 0;text-align:center}.name-footer{text-align:left;margin:0;font-size:12px;padding-left:10px}.tbl_footer tr td{text-align:right}.tbl_footer tr td.total{text-align:right;font-weight:700;width:120px}.total_word{padding:4px;border-top:1px solid #333}.terms_section { color: #000;width: 100%; position: absolute;bottom: 115px; border-top: 1px solid #aaa;padding:0;}.tbl_fix_height { min-height: 270px;border-bottom:1px solid #333;}

    `
    let AppliedCSSForType2 =`
    body{font-size:.8rem;color:#000!important;overflow-x:hidden;font-family:Calibri,sans-serif!important;position:relative;width:29.7cm;margin:0 auto}.m-auto{margin:auto}div{display:block}.row{display:flex;flex-wrap:wrap;padding-right:5px;padding-left:5px}.col-md-12{flex:0 0 100%;max-width:100%}.col-md-3{flex:0 0 25%;max-width:25%}.col-md-3{flex:0 0 25%;max-width:25%}.col-md-2{flex:0 0 12.666667%;max-width:12.666667%}.col-md-4{flex:0 0 33.333333%;max-width:33.333333%}.col-md-6{flex:0 0 50%;max-width:50%}.col,.col-1,.col-10,.col-11,.col-12,.col-2,.col-3,.col-4,.col-5,.col-6,.col-7,.col-8,.col-9,.col-auto,.col-lg,.col-lg-1,.col-lg-10,.col-lg-11,.col-lg-12,.col-lg-2,.col-lg-3,.col-lg-4,.col-lg-5,.col-lg-6,.col-lg-7,.col-lg-8,.col-lg-9,.col-lg-auto,.col-md,.col-md-1,.col-md-10,.col-md-11,.col-md-12,.col-md-2,.col-md-3,.col-md-4,.col-md-5,.col-md-6,.col-md-7,.col-md-8,.col-md-9,.col-md-auto,.col-sm,.col-sm-1,.col-sm-10,.col-sm-11,.col-sm-12,.col-sm-2,.col-sm-3,.col-sm-4,.col-sm-5,.col-sm-6,.col-sm-7,.col-sm-8,.col-sm-9,.col-sm-auto,.col-xl,.col-xl-1,.col-xl-10,.col-xl-11,.col-xl-12,.col-xl-2,.col-xl-3,.col-xl-4,.col-xl-5,.col-xl-6,.col-xl-7,.col-xl-8,.col-xl-9,.col-xl-auto{position:relative;width:100%;min-height:1px}.justify-content-center{justify-content:center!important}.bdr_left{border-left:1px solid #000}.bdr_right{border-right:1px solid #000}.bdr_top{border-top:1px solid #000}.bdr_bottom{border-bottom:1px solid #000}.text-center{text-align:center!important}.text-right{text-align:right!important}.text-left{text-align:left!important}.p-2{padding:.5rem!important}.p-1{padding:.25rem!important}.font-weight-bold{font-weight:700!important}.name_size{font-size:22px}.amount_bs{text-align:right;padding:0 3px}.main-balance .tfoot,.main-balance .thead{font-weight:600;padding:5px 0;font-size:1rem;border-top:1px solid #000;border-bottom:1px solid #000}.col-3{flex:0 0 25%;max-width:25%}.col{flex-basis:0;flex-grow:1;max-width:100%}.p-0{padding:0!important}.ittelic{font-style:italic}*,::after,::before{box-sizing:border-box}.bdr_right_fix{min-height:25px;border-right:1px solid #000}.bdr_left_fix{min-height:25px;border-left:1px solid #000}.d-block{display:block}table{width:100%;border-collapse:collapse;border-spacing:0;margin-bottom:5px}thead{display:table-header-group;vertical-align:middle;border-color:inherit}table td,table th{padding:3px;text-align:left;word-break:break-word}table th{white-space:nowrap;font-weight:600;border-top:1px dashed #000;border-bottom:1px dashed #000;text-align:center}.left_side_print{margin-right:15px}.right_side-print{margin-left:15px}table td{text-align:left}.table_summery{min-height:350px}.table_summery2{min-height:110px}footer{color:#000;width:100%;height:30px;position:absolute;bottom:0;padding:8px 0;text-align:center}@page{size:landscape}
    `
    let cssApplied = this.PrintFormateType === 1 ? AppliyedCSSType1 : AppliedCSSForType2
    printWindow.document.open()
    printWindow.document.write('<html><head><title>' + title + '</title><style>'+cssApplied + '</style></head><body>')
    printWindow.document.write(divElements)
    printWindow.document.write('</body></html>')
    printWindow.document.close()
    printWindow.focus()
    $('#' + cmpName).modal(UIConstant.MODEL_HIDE)
    setTimeout(function () {
      if (!isViewForm) {
        document.getElementsByTagName('body')[0].classList.add('hidden-print');
        printWindow.print()
        printWindow.close()
      }

    }, 100)

  }

  HedShow: any = []
  mainData: any = []
  ValueOfTaxName(hsnData, hsnTransaction, TaxTitles, currency) {
    let rate = 0
    this.mainData = []
    this.HedShow = []
    let valueshow = []
    hsnTransaction.forEach(element => {
      this.HedShow = hsnData.filter(d => d.HsnNo === element.HsnNo)
      if (this.HedShow.length > 0) {
        valueshow = []
        rate = this.HedShow.filter(item1 => item1.TaxRate)
          .map(item1 => parseFloat(item1.TaxRate))
          .reduce((sum, current) => sum + current, 0)
        for (let i = 0; i < this.HedShow.length; i++) {
          valueshow.push(this.HedShow[i].Amount + '-' + '(' + this.HedShow[i].TaxRate + ')' + '%')
        }

      }

      this.mainData.push({
        HsnNo: element.HsnNo,
        TaxableAmount: element.TaxableAmount,
        TotalAmount: element.TotalAmount,
        totalTaxRate: rate + '%',
        TaxType: valueshow,
      })
    });
    console.log(this.mainData, 'Main-HSN')
  }

  private unSubscribe$ = new Subject<void>()
  showDeletePopup(id) {
    this._commonService.openDelete(id, 'sale', 'sale')
  }


  deleteItem(id) {
    if (id) {
      this._commonService.cancelSale(id).pipe(
        takeUntil(this.unSubscribe$)
      ).subscribe((Data: any) => {
        if (Data.Code === UIConstant.DELETESUCCESS) {
          this._toastrCustomService.showSuccess('', UIConstant.DELETED_SUCCESSFULLY)
          this._commonService.closeDelete('')
          this.getSaleDetail()
        }
        if (Data.Code === UIConstant.CANNOTDELETERECORD) {
          this._toastrCustomService.showInfo('', Data.Description)
          this._commonService.closeDelete('')
        }
      })
    }
  }

  openReturn (id, formid) {
    this._commonService.openSaleDirectReturn(id,'return')
  }
 
}
