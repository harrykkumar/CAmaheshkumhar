import { Component, ViewChild, ElementRef } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Subscription, fromEvent, throwError } from 'rxjs';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
import { serviceBillingService } from '../serviceBilling.service'
import { Settings } from '../../../shared/constants/settings.constant'
import { FormConstants } from 'src/app/shared/constants/forms.constant'
import { UIConstant } from 'src/app/shared/constants/ui-constant'
import { FormGroup, FormBuilder } from '@angular/forms';
import { map, filter, debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators';
import { ToastrCustomService } from '../../../commonServices/toastr.service';
import { serviceBillingAddComponent } from '../serviceBilling-add/serviceBilling-add.component';
import { SetUpIds } from 'src/app/shared/constants/setupIds.constant'
declare const $: any
declare const _: any

@Component({
  selector: 'app-serviceBilling-main',
  templateUrl: './serviceBilling-main.component.html'
})
export class serviceBillingMainComponent {
  title: string
  sub: Subscription
  keepOpen: boolean = true
  toShowSearch: boolean = false
  data$: Subscription
  orgImage: string
  clientDateFormat: string
  printData1: any = []
  industryId: number
  loading = true
  imageForSignature:any
  SignatorySetup:any=0
  constructor (private route: ActivatedRoute,
     private commonService: CommonService,
      private saleServicebilling: serviceBillingService,
      private settings: Settings,
      private toastrService: ToastrCustomService,
      private _formBuilder: FormBuilder) {
        this.loading = true
        this.getSetUpModules((JSON.parse(this.settings.moduleSettings).settings))
        this.getSpUtilitySaleServiceData()
    this.data$ = this.commonService.getActionClickedStatus().subscribe(
      (action: any) => {
        if (action.type === FormConstants.Edit && action.formname === FormConstants.Purchase) {
          this.commonService.openPurchase(+action.id)
        }
        if (action.type === FormConstants.ViewPrint && action.formname === FormConstants.Purchase) {
          this.onPrintButton(action.id, action.printId,action.isViewPrint)
   
         }
        
         if (action.type === FormConstants.Print && action.formname === FormConstants.Purchase) {
         this.onPrintButton(action.id, action.printId,action.isViewPrint)
  
        }
      }
    )
    this.formSearch()
    this.industryId = +this.settings.industryId
    this.clientDateFormat = this.settings.dateFormat
    this.dicimalDigitFormat = this.settings.noOfDecimal
    this.imageForSignature=''
  }

  ngAfterContentInit() {
    this.saleServiceAdd.initComp()
  }

  @ViewChild('searchData') searchData: ElementRef
  searchForm: FormGroup
  private formSearch () {
    this.searchForm = this._formBuilder.group({
      'searchKey': [UIConstant.BLANK]
    })
  }
  ngOnInit () {
    this.sub = this.route.data.subscribe(data => {
      this.title = data.title
    })

    this.commonService.fixTableHF('cat-table')
    fromEvent(this.searchData.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value
      }),
      filter(res => res.length > 1 || res.length === 0),
      debounceTime(1000),
      distinctUntilChanged()
      ).subscribe((text: string) => {
        this.saleServicebilling.onTextEntered(text)
      })
  }
  @ViewChild('sale_Service') saleServiceAdd: serviceBillingAddComponent
  getSpUtilitySaleServiceData () {
    this.loading = true
    let _self = this
    this.commonService.getSPUtilityData(UIConstant.SALE_SERVICE_TYPE)
    .pipe(
      filter(data => {
        if (data.Code === UIConstant.THOUSAND) {
          return true
        } else {
          throw new Error(data.Description)
        }
      }),
      catchError(error => {
        return throwError(error)
      }),
      map(data => data.Data)
    ).subscribe(
      data => {
        if (data.AttributeValueResponses.length > 0) {
        }

        _self.saleServiceAdd.allItems = [ ...data.Items ]
        _self.saleServicebilling.createItems(data.Items)
        _self.saleServicebilling.createVendors(data.Customers)
        _self.saleServicebilling.createTaxProcess(data.TaxProcesses)
        _self.saleServicebilling.createPaymentModes(data.PaymentModes)
        _self.saleServicebilling.createOrganisations(data.Organizations)
        this.saleServicebilling.getGSTTypeOfOrgnazation(data.Organizations)
        _self.saleServicebilling.createGodowns(data.Godowns)
        _self.saleServicebilling.createReferralTypes(data.ReferalTypes)
        _self.saleServicebilling.createSubUnits(data.SubUnits)
        _self.saleServicebilling.createTaxSlabs(data.TaxSlabs)
        _self.saleServicebilling.createReferral(data.Referals)
        _self.saleServicebilling.createCurrencies(data.Currencies)
        _self.saleServicebilling.createFreightBy(data.FreightModes)
        _self.saleServicebilling.createCharges(data.LedgerCharges)
        _self.saleServiceAdd.clientStateId = data.ClientAddresses[0].StateId
        _self.saleServiceAdd.TransactionNoSetups = data.TransactionNoSetups
      },
      (error) => {
        console.log(error)
        this.loading = false
        this.toastrService.showError(error, '')
      },
      () => {
        setTimeout(() => {
          this.loading = false
        }, 1)
      }
    )
  }

  ngOnDestroy () {
    this.sub.unsubscribe()
    this.data$.unsubscribe()
  }

  toggleSearch () {
    this.toShowSearch = !this.toShowSearch
  }

  openPurchase () {
    this.saleServiceAdd.initialiseExtras()
    this.commonService.openPurchase('')
  }

  attributeKeys: any = []
  

Heading:any =[]
  headerKeys: any = []
  hsnToSHow: any = []
  HedShow:any =[]
  

  onPrintButton(id, HtmlId, isViewPrint) {
    this.printmanupulation(id, HtmlId, isViewPrint)
  }
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
  dicimalDigitFormat: any=0
  BillName: any
  customerAddress: any = []
  orgImageData: any
  ItemTransactionactions: any = []
  orgAddress: any
  inWordBillAmount: string = ''
  paidFlag:any
  GstTypeId:any=0
  paymentFlag:any
  printmanupulation(id, htmlId, isViewForm) {
    //  this.orgImage = 'http://app.saniiro.com/uploads/2/2/2/Images/Organization/ologorg.png'
    let _self = this
    _self.commonService.printDirectSale(id).subscribe(data => {
      //    console.log(JSON.stringify(data)  , 'salechallan')
      if (data.Code === UIConstant.THOUSAND) {

        if (data.Data && data.Data.SaleTransactionses.length > 0) {
          this.GstTypeId = data.Data.SaleTransactionses[0].GstTypeId
          _self.InventoryTransactionSales = []
          this.billAmount = 0
          _self.InventoryTransactionSales = data.Data.SaleTransactionses
          this.paidFlag  = data.Data.SaleTransactionses[0].OutStanding === 0 ? 'PAID' : 'UNPAID'
          _self.barcode = data.Data.SaleTransactionses[0].BarcodeBill
          this.billAmount = (data.Data.SaleTransactionses[0].BillAmount).toFixed(this.dicimalDigitFormat)
          this.inWordBillAmount = this.commonService.NumInWords(this.billAmount)
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
          this.paymentFlag= true
        } else {
          _self.paymentModeData = []
          this.paymentFlag= false

        }
        if (data.Data.ImageContents.length > 0) {
          _self.orgImageData = ''
          _self.imageForSignature=''
          // _self.orgImageData = data.Data.ImageContents[0].FilePath
          // console.log(_self.orgImageData, 'image')
         
          if(data.Data &&  data.Data.ImageContents && data.Data.ImageContents[0] &&  data.Data.ImageContents[0].ClientType &&  data.Data.ImageContents[0].ClientType==='Org'){
            _self.orgImageData = data.Data.ImageContents[0].FilePath
          }
          if(data.Data &&  data.Data.ImageContents &&  data.Data.ImageContents[1] && data.Data.ImageContents[1].ClientType &&  data.Data.ImageContents[1].ClientType==='Signature'){
           
            _self.imageForSignature = data.Data.ImageContents[1].FilePath
          }
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
        if (data.Data.HsnItemTaxTransDetails.length > 0 && data.Data.HsnItemTransactions.length >0 && data.Data.SaleTransactionses.length>0) {

          this.ValueOfTaxName(data.Data.HsnItemTaxTransDetails, data.Data.HsnItemTransactions, data.Data.TaxTitles, data.Data.SaleTransactionses[0].Currency)
          this.hsntaxItem = data.Data.HsnItemTaxTransDetails
        } else {
          this.hsntaxItem = []
        }
        setTimeout(function () {
          _self.InitializedPrintFor(htmlId, isViewForm)
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
  InitializedPrintFor(cmpName, isViewForm) {
    let title = document.title
    let divElements = document.getElementById(cmpName).innerHTML
    let printWindow = window.open()
    printWindow.document.open()
    printWindow.document.write('<html><head><title>' + title + '</title><style>@media print {.hidden-print {display: none !important;}}.clearfix:after{content:"";display:table;clear:both}a{color:#0087c3;text-decoration:none}body{position:relative;width:21cm;height:29.7cm;margin:0 auto;color:#000;background:#fff;font-family:Calibri;font-size:12px}.row{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-direction:row}.col{-ms-flex-preferred-size:0;-ms-flex-positive:1;padding-left:10px;max-width:100%}.row1{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-direction:row;flex-wrap:wrap;margin-right:1px;margin-left:0}.col1{-ms-flex-preferred-size:0;flex-basis:0;-ms-flex-positive:1;flex-grow:1;max-width:100%}header{padding:10px 0}.header1{padding:1px 0;border-top:1px solid #333;border-bottom:1px solid #333}#logo{float:left;margin-top:8px}#logo img{height:70px}#company{float:right;text-align:right}#client{padding-left:6px;float:left}#client .to{color:#333}h2.name{font-size:1.6em;font-weight:600;margin:0;text-transform:uppercase}#invoice{float:right;text-align:right}#invoice h1{color:#0087c3;font-size:2.2em;line-height:1em;font-weight:400;margin:0 0 10px 0}#invoice .date{font-size:1.1em;color:#000}table{width:100%;border-collapse:collapse;border-spacing:0;margin-bottom:5px}table td,table th{padding:1px;vertical-align:top;text-align:center;font-size:12px;word-break:break-word}table th{white-space:nowrap;font-weight:700}table td{text-align:left}table td h3{color:#000;font-size:1.2em;font-weight:600;margin:0 0 .2em 0}table .no{color:#000}table .desc{text-align:left}table .total{color:#000;text-align:right}table td.qty,table td.total,table td.unit{font-size:1.2em}table tfoot td{background:#fff;border-bottom:none;font-weight:600;text-align:right;white-space:nowrap;margin-top:100px}table tfoot tr:first-child td{border-top:none}table tfoot tr:last-child td{border-top:1px solid #333}.table1 tbody tr td,.table1 thead tr th{border:1px solid #333;word-break:break-all}#thanks{font-size:2em;margin-bottom:50px}#notices{padding-left:6px;border-left:6px solid #0087c3}#notices .notice{font-size:1.2em}footer{color:#000;width:100%;height:30px;position:absolute;bottom:60px;border-top:1px solid #aaa;padding:8px 0;text-align:center}.name-footer{text-align:left;margin:0;font-size:12px;padding-left:10px}.tbl_footer tr td{text-align:right}.tbl_footer tr td.total{text-align:right;font-weight:700;width:120px}.total_word{padding:4px;border-top:1px solid #333}.terms_section { color: #000;width: 100%; position: absolute;bottom: 115px; border-top: 1px solid #aaa;padding:0;}.tbl_fix_height { min-height: 270px;border-bottom:1px solid #333;}</style></head><body>')
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
  PaymentDetailsFlag:any=1
  getSetUpModules(settings) {
    settings.forEach(element => {
      // if (element.id === SetUpIds.PaidUnpaidOnBIllShow) {
      //   this.setUpPaidUnPaid = +element.val
      // }
      // if (element.id === SetUpIds.BillDiscountOnPrint) {
      //   this.BillDiscountOnPrint = +element.val
      // }
      if (element.id === SetUpIds.PaymentDatilsOnPrint_Sale_ServiceSale) {
        this.PaymentDetailsFlag = +element.val
      }
      if (element.id === SetUpIds.SignatorySetup) {
        this.SignatorySetup = +element.val
      }
      
    })

  }
  mainData: any = []
  ValueOfTaxName(hsnData, hsnTransaction, TaxTitles, currency) {
    //TaxTitleId
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
  splitArray (arr, len) {
    let newArr = []
    let start = 0
    let end = len
    let i = 0
    let arr1 = JSON.parse(JSON.stringify(arr))
    console.log('new arr : ', arr1)
    if (arr.length <= 10) {
      newArr[0] = { page: 0, data: arr1.splice(start, len) }
    } else if (arr.length > 10 && arr.length <= 19) {
      newArr[0] = { page: 0, data: arr1.splice(start, arr.length - 1) }
      arr1 = JSON.parse(JSON.stringify(arr))
      newArr[1] = { page: arr.length - 1, data: arr1.splice(arr.length - 1, arr.length) }
    } else {
      len = 18
      while (end <= arr.length + 1 && start < arr.length) {
        console.log(end - start)
        newArr[i] = { page: end - start, data: arr1.splice(start, len) }
        start += len
        if (end + len < arr.length) {
          end += len
        } else {
          end = arr.length
        }
        arr1 = JSON.parse(JSON.stringify(arr))
        i++
      }
    }
    console.log('newArr : ', newArr)
    return newArr
  }
  word: string = ''
  
}
