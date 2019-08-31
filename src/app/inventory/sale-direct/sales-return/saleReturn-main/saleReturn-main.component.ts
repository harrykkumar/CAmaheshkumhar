import { Component, ViewChild, ElementRef } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Subscription, fromEvent, throwError } from 'rxjs';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
import { SaleDirectReturnService } from '../saleReturn.service'
import { Settings } from '../../../../shared/constants/settings.constant'
import { FormConstants } from 'src/app/shared/constants/forms.constant'
import { UIConstant } from 'src/app/shared/constants/ui-constant'
import { FormGroup, FormBuilder } from '@angular/forms';
import { map, filter, debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators';
import { ToastrCustomService } from '../../../../commonServices/toastr.service';
import { SaleDirectReturnComponent } from '../../saleReturn-add/saleReturn-add.component';
import { ExcelService } from '../../../../commonServices/excel.service';
import { GlobalService } from 'src/app/commonServices/global.service';
declare const $: any
declare const _: any
@Component({
  selector: 'app-saleReturn-main',
  templateUrl: './saleReturn-main.component.html'
})
export class SaleReturnDirectMainComponent {
  title: string
  sub: Subscription
  keepOpen: boolean = true
  toShowSearch: boolean = false
  data$: Subscription
  orgImage: string
  clientDateFormat: string
  printData1: any = []
  industryId: number
  queryStr$:Subscription
  loading = true
  queryStr:string =''
  decimalNoPoint: any = 0
  constructor(
    public gs: GlobalService,
    public excelService: ExcelService,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private _saleDirectReturnService: SaleDirectReturnService,
    private settings: Settings,
    private toastrService: ToastrCustomService,
    private _formBuilder: FormBuilder) {
    this.loading = true
    this.getSPUtilitySaleReturnData()
    this.data$ = this.commonService.getActionSaleReturnClickedStatus().subscribe(
      (action: any) => {
        if (action.type === FormConstants.Print && action.formname === FormConstants.SaleForm) {
          this.onPrintButton(action.id, action.printId, action.isViewForm)
        }
      }
    )

    this.queryStr$ = this._saleDirectReturnService.queryStr$.subscribe(
      (str) => {
        this.queryStr = str
        //console.log( this.queryStr ,'jjjj')
        this.toDate = 
        this.fromDate = 
       this.expoertExceldata()
      }
    )
  
    this.formSearch()
    this.industryId = +this.settings.industryId
    this.clientDateFormat = this.settings.dateFormat
    this.decimalNoPoint = this.settings.noOfDecimal
  }
  toDate :any =''
  fromDate:any =''
  ngAfterContentInit() {
    //this.purchaseAdd.initComp()
  }

  @ViewChild('searchData') searchData: ElementRef
  searchForm: FormGroup
  private formSearch() {
    this.searchForm = this._formBuilder.group({
      'searchKey': [UIConstant.BLANK]
    })
  }
  ngOnInit() {
    this.getOrgDetailsData()
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
      this._saleDirectReturnService.onTextEntered(text)
    })
    this.expoertExceldata()
  }
  @ViewChild('saleReturn_add') purchaseAdd: SaleDirectReturnComponent
  getSPUtilitySaleReturnData() {
    this.loading = true
    let _self = this
    this.commonService.getSPUtilityData('SaleReturn')
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
          console.log('sputility data : ', data)
          if (data.AttributeValueResponses.length > 0) {
            _self._saleDirectReturnService.generateAttributes(data)
          }
          if (data.ItemCategorys.length > 0) {
            //    _self.purchaseAdd.getCatagoryDetail(data.ItemCategorys)
          }
          //  _self.purchaseAdd.allItems = [ ...data.Items ]
          // console.log('allItems : ', this.allItems)
          _self._saleDirectReturnService.createItems(data.Items)
          _self._saleDirectReturnService.createVendors(data.Vendors)
          _self._saleDirectReturnService.createTaxProcess(data.TaxProcesses)
          _self._saleDirectReturnService.createPaymentModes(data.PaymentModes)
          _self._saleDirectReturnService.createOrganisations(data.Organizations)
          _self._saleDirectReturnService.createGodowns(data.Godowns)
          _self._saleDirectReturnService.createReferralTypes(data.ReferalTypes)
          _self._saleDirectReturnService.createSubUnits(data.SubUnits)
          _self._saleDirectReturnService.createTaxSlabs(data.TaxSlabs)
          _self._saleDirectReturnService.createReferral(data.Referals)
          _self._saleDirectReturnService.createCurrencies(data.Currencies)
          _self._saleDirectReturnService.createFreightBy(data.FreightModes)
          _self._saleDirectReturnService.createCharges(data.LedgerCharges)
          //  _self.purchaseAdd.clientStateId = data.ClientAddresses[0].StateId
          // _self.purchaseAdd.TransactionNoSetups = data.TransactionNoSetups
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

  ngOnDestroy() {
    this.sub.unsubscribe()
    this.data$.unsubscribe()
  }

  toggleSearch() {
    this.toShowSearch = !this.toShowSearch
  }

  openPurchase() {
  }

  attributeKeys: any = []
 
  BillName: any
  customerAddress: any = []
  orgImageData: any
  ItemTransactionactions: any = []
  billAmount: any = 0

  orgAddress: any
  inWordBillAmount: string = ''
  paidFlag: any
  InventoryTransactionSales: any = []
  itemAttributeDatails: any
  ItemTaxTrans: any
  paymentModeData: any
  paymentFlag: boolean
  itemAttbute: any = []
  totalDiscountAmt: any = 0
  totaltaxAmount: any = 0
  subTotalAmount: any = 0
  ContactCustInfo: any = []
  TermsConditions: any = []
  ContactOrgInfo: any
  ClientInfos: any
  onPrintButton(id, htmlId, isViewForm, ) {
    let _self = this
    _self.commonService.printSaleReturn(id).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND) {
        if (data.Data && data.Data.SaleTransactionses.length > 0) {
          _self.InventoryTransactionSales = []
          this.billAmount = 0
          _self.InventoryTransactionSales = data.Data.SaleTransactionses
          this.paidFlag = data.Data.SaleTransactionses[0].OutStanding === 0 ? 'PAID' : 'UNPAID'
          //_self.barcode = data.Data.SaleTransactionses[0].BarcodeBill
          this.billAmount = (data.Data.SaleTransactionses[0].BillAmount).toFixed(this.decimalNoPoint)
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
        // if (data.Data && data.Data.AdditionalChargeDetails.length > 0) {
        //   _self.getAddtionalCharge = []
        //   _self.getAddtionalCharge = data.Data.AdditionalChargeDetails
        // } else {
        //   _self.getAddtionalCharge = []
        // }

        if (data.Data.AttributeValues.length > 0) {
          _self.itemAttributeDatails = []
          _self.itemAttributeDatails = data.Data.AttributeValues
        } else {
          _self.itemAttributeDatails = []
        }
        if (data.Data.ItemTaxTransDetails.length > 0) {
          this.BillName = 'Bill-Return'
          _self.ItemTaxTrans = []
          _self.ItemTaxTrans = data.Data.ItemTaxTransDetails
        } else {
          this.BillName = 'Bill-Return'

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
          this.totalDiscountAmt = (totalDiscountAmt).toFixed(this.decimalNoPoint)
          let totaltaxAmount = data.Data.ItemTransactions.filter(item1 => item1.TaxAmount)
            .map(item1 => parseFloat(item1.TaxAmount))
            .reduce((sum, current) => sum + current, 0)
          this.totaltaxAmount = (totaltaxAmount).toFixed(this.decimalNoPoint)
          let subTotalAmount = data.Data.ItemTransactions.filter(item1 => item1.SubTotalAmount)
            .map(item1 => parseFloat(item1.SubTotalAmount))
            .reduce((sum, current) => sum + current, 0)
          this.subTotalAmount = (subTotalAmount).toFixed(this.decimalNoPoint)
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
        if (data.Data.AddressDetails.length > 0) {
          _self.orgAddress = []
          _self.orgAddress = data.Data.AddressDetails
        } else {
          _self.orgAddress = []
        }
        // if (data.Data.Websites.length > 0) {
        //   this.website = []
        //   this.website = data.Data.Websites
        // } else {
        //   this.website = []
        // }
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
          _self.InitializedPrintForDirectSale(htmlId, isViewForm)
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
  barcode: any
  InitializedPrintForDirectSale(cmpName, isViewForm) {
    let title = document.title
    let divElements = document.getElementById(cmpName).innerHTML
    let printWindow = window.open()
    printWindow.document.open()
    printWindow.document.write('<html><head><title>' + title + '</title><style>@media print {.hidden-print {display: none !important;}}.clearfix:after{content:"";display:table;clear:both}a{color:#0087c3;text-decoration:none}body{position:relative;width:21cm;height:29.7cm;margin:0 auto;color:#000;background:#fff;font-family:Calibri;font-size:12px}.row{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-direction:row}.col{-ms-flex-preferred-size:0;-ms-flex-positive:1;padding-left:10px;max-width:100%}.row1{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-direction:row;flex-wrap:wrap;margin-right:1px;margin-left:0}.col1{-ms-flex-preferred-size:0;flex-basis:0;-ms-flex-positive:1;flex-grow:1;max-width:100%}header{padding:10px 0}.header1{padding:1px 0;border-top:1px solid #333;border-bottom:1px solid #333}#logo{float:left;margin-top:8px}#logo img{height:70px}#company{float:right;text-align:right}#client{padding-left:6px;float:left}#client .to{color:#333}h2.name{font-size:1.6em;font-weight:600;margin:0;text-transform:uppercase}#invoice{float:right;text-align:right}#invoice h1{color:#0087c3;font-size:2.2em;line-height:1em;font-weight:400;margin:0 0 10px 0}#invoice .date{font-size:1.1em;color:#000}table{width:100%;border-collapse:collapse;border-spacing:0;margin-bottom:5px}table td,table th{padding:1px;vertical-align:bottom;text-align:center;font-size:12px;word-break:break-all}table th{white-space:nowrap;font-weight:700}table td{text-align:left}table td h3{color:#000;font-size:1.2em;font-weight:600;margin:0 0 .2em 0}table .no{color:#000}table .desc{text-align:left}table .total{color:#000;text-align:right}table td.qty,table td.total,table td.unit{font-size:1.2em}table tfoot td{background:#fff;border-bottom:none;font-weight:600;text-align:right;white-space:nowrap;margin-top:100px}table tfoot tr:first-child td{border-top:none}table tfoot tr:last-child td{border-top:1px solid #333}.table1 tbody tr td,.table1 thead tr th{border:1px solid #333;word-break:break-all}#thanks{font-size:2em;margin-bottom:50px}#notices{padding-left:6px;border-left:6px solid #0087c3}#notices .notice{font-size:1.2em}footer{color:#000;width:100%;height:30px;position:absolute;bottom:60px;border-top:1px solid #aaa;padding:8px 0;text-align:center}.name-footer{text-align:left;margin:0;font-size:12px;padding-left:10px}.tbl_footer tr td{text-align:right}.tbl_footer tr td.total{text-align:right;font-weight:700;width:120px}.total_word{padding:4px;border-top:1px solid #333}.terms_section { color: #000;width: 100%; position: absolute;bottom: 115px; border-top: 1px solid #aaa;padding:0;}.tbl_fix_height { min-height: 270px;border-bottom:1px solid #333;}</style></head><body>')
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
    //TaxTitleId
    let rate = 0
    this.mainData = []
    this.HedShow = []
    let valueshow = []
    hsnTransaction.forEach(element => {
      this.HedShow = hsnData.filter(d => d.HsnNo === element.HsnNo && d.TaxSlabId === element.TaxSlabId)
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
  Heading: any = []
  headerKeys: any = []
  hsnToSHow: any = []
  // HedShow:any =[]


  splitArray(arr, len) {
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
  mainDataExcel: any = []
  getOrgDetailsData() {
    this.getOrgDetails = {}
    this.commonService.getOrgDetailsForPrintExcelPDF().subscribe(data => {
      if (data.Code === UIConstant.THOUSAND) {
        this.getOrgDetails = data.Data
      }
    })
  }
  exportExcel() {
    if (this.mainDataExcel.length > 0) {
      this.excelService.generateExcel(this.getOrgDetails.OrganizationDetails[0].OrgName, this.getOrgDetails.AddressDetails[0].CityName + ' ' + this.getOrgDetails.AddressDetails[0].StateName + ' ' + this.getOrgDetails.AddressDetails[0].CountryName, this.ExcelHeaders, this.mainDataExcel, 'Sale Return', "", "", this.ExcelSummary)
    }
    
  }
  getOrgDetails: any = {}
  ExcelHeaders: any
  ExcelSummary: any
  expoertExceldata() {
    this._saleDirectReturnService.getSaleReturnList('?StrSearch=' + ''+ this.queryStr).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND) {
        this.mainDataExcel = []
        this.ExcelSummary = []
        this.ExcelSummary = ["Total", "",
          "",
          "",
          data.Data.SaleSummary[0].TotalQty.toFixed(2),
          data.Data.SaleSummary[0].Discount.toFixed(this.decimalNoPoint),
          data.Data.SaleSummary[0].TaxAmount.toFixed(this.decimalNoPoint),
          data.Data.SaleSummary[0].BillAmount.toFixed(this.decimalNoPoint)
        ]
        this.ExcelHeaders = ["SNo", "Party Details", "Invoice No.", "Invoice Date", "Quantity", "Discount", "Tax Amount", "Bill Amount"]
        data.Data.SaleDetails.forEach((element, ind) => {
          let date = this.gs.utcToClientDateFormat(element.BillDate, this.clientDateFormat)

          this.mainDataExcel.push([
            ind + 1,
            element.LedgerName,
            element.BillNo,
            date,
            element.TotalQty.toFixed(2),
            element.Discount.toFixed(this.decimalNoPoint),
            element.TaxAmount.toFixed(this.decimalNoPoint),
            element.BillAmount.toFixed(this.decimalNoPoint)
          ])
        });
      }
    })


  }
}