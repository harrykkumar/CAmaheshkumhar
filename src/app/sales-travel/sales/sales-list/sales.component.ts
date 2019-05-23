import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs'
import { SaleTravelServices } from '../sale-travel.services'
import { Settings } from 'src/app/shared/constants/settings.constant'
import { SetUpIds } from 'src/app/shared/constants/setupIds.constant'
import { SaleTravel } from '../../../model/sales-tracker.model'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
import { UIConstant } from '../../../shared/constants/ui-constant'
import { FormGroup, FormBuilder } from '@angular/forms'
import { map, filter, debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { ToastrCustomService } from '../../../commonServices/toastr.service';
import { ItemmasterServices } from '../../../commonServices/TransactionMaster/item-master.services';
import { VendorServices } from '../../../commonServices/TransactionMaster/vendoer-master.services';
import { Select2Component, Select2OptionData } from 'ng2-select2';
declare const $: any
@Component({
  selector: 'app-travel-invoice',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit, OnDestroy {
  saleTravelDetails: SaleTravel[]
  newBillSub: Subscription
  printData: any
  salesData: any
  ledgerinfos: any
  netAmount: number
  salesItemDatails: any = []
  salesSummuryItemDatails: any
  totalRefundPanelty: any
  totalReIssueCharge: any
  totalmiscellanouseChange: any
  customerAddress: any[]
  orgAddress: any[]
  CONST_CUSTOMER_TYPE: any = 'Customer'
  customerMobileData: any[]
  customerEmailData: any[]
  orgMobileData: any[]
  orgEmailData: any[]
  orgImageData: any[]
  orgWebData: any[]
  CONST_CONTCT_TYPE: any = 'ContactNo'
  CONST_EMAIL_TYPE: any = 'Email'
  CONST_ORG_TYPE: any = 'Org'
  CONST_IMAGE_TYPE: any = 'Image'
  orgImage: string
  CONST_WEB_TYPE: any = 'WEB'
  totalTaxAmount: any
  clientDateFormat: string

  searchForm: FormGroup
  p: number = 1
  itemsPerPage: number = 20
  total: number = 0
  lastItemIndex: number = 0
  isSearching: boolean = false
  queryStr$: Subscription
  queryStr: string = ''
  constructor (private _saleTravelServices: SaleTravelServices,
    private settings: Settings,
    private commonService: CommonService,
    private _formBuilder: FormBuilder,
    private toastrService: ToastrCustomService,
    private itemService: ItemmasterServices,
    private _ledgerServices: VendorServices) {
    this.formSearch()
    this.getSaleTraveDetail()
    this.newBillSub = this.commonService.newSaleStatus().subscribe(
      (obj: any) => {
        this.getSaleTraveDetail()
      }
    )
    this.queryStr$ = this._saleTravelServices.queryStr$.subscribe(
      (str) => {
        console.log(str)
        this.queryStr = str
        this.p = 1
        this.getSaleTraveDetail()
      }
    )
    this.clientDateFormat = this.settings.dateFormat
    // console.log('client date format : ', this.clientDateFormat)
    if (this.clientDateFormat === '') {
      this.commonService.getSettingById(SetUpIds.dateFormat).subscribe(
        (data) => {
          if (data.Code === UIConstant.THOUSAND && data.Data.SetupDynamicValues) {
            this.clientDateFormat = data.Data.SetupDynamicValues.Val
            this.settings.dateFormat = this.clientDateFormat
          }
        }
      )
    }
  }

  @ViewChild('searchData') searchData: ElementRef
  private formSearch () {
    this.searchForm = this._formBuilder.group({
      'searckKey': [UIConstant.BLANK]
    })
  }

  ngOnInit () {
    this.getRouteList()
    this.getSuppliersList()
    this.commonService.fixTableHF('cat-table')
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
          this.saleTravelDetails = data.Data.TravelDetails
          this.total = this.saleTravelDetails[0] ? this.saleTravelDetails[0].TotalRows : 0
          if (data.Data.TravelSummary.length > 0) {
            this.totalDiscount = +(+data.Data.TravelSummary[0].Discount).toFixed(2)
            this.totaltax = +(+data.Data.TravelSummary[0].TaxAmount).toFixed(2)
            this.totalBillAmount = +(+data.Data.TravelSummary[0].BillAmount).toFixed(2)
          }
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

  getRouteList () {
    this.itemService.getItemMasterDetail('').subscribe(data => {
      // console.log('routing data : ', data)
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        this._saleTravelServices.createRouteList(data.Data)
      } else {
        throw new Error (data.Description)
      }
    },
    (error) => {
      console.log(error)
      this.toastrService.showError(error, '')
    })
  }

  getSuppliersList () {
    this._ledgerServices.getVendor(4, '').subscribe(data => {
      // console.log('supplier data : ', data)
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        this._saleTravelServices.createSupplierList(data.Data)
      } else {
        throw new Error (data.Description)
      }
    },
    (error) => {
      console.log(error)
      this.toastrService.showError(error, '')
    })
  }
  searchGetCall (term: string) {
    if (!term) {
      term = ''
    }
    this.p = 1
    return this.commonService.getSaleDetail('?StrSearch=' + term + '&Page=' + this.p + '&Size=' + this.itemsPerPage + this.queryStr)
  }

  onOpenSale () {
    this.commonService.openImport()
  }

  onOpenInvoice (id) {
    this.commonService.openInvoice(id)
  }

  onOpenSaleReturn (id) {
    this.commonService.openSaleReturn(id)
  }

  toShowSearch = false

  toggleSearch () {
    this.toShowSearch = !this.toShowSearch
  }
  /* get sale travel Detail */
  totalDiscount: number
  totaltax: number
  totalBillAmount: number
  getSaleTraveDetail () {
    this.commonService.getSaleDetail('?StrSearch=' + this.searchForm.value.searckKey + '&Page=' + this.p + '&Size=' + this.itemsPerPage + this.queryStr).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        console.log('sales data: ', data)
        this.saleTravelDetails = data.Data.TravelDetails
        this.total = this.saleTravelDetails[0] ? this.saleTravelDetails[0].TotalRows : 0
        if (data.Data.TravelSummary.length > 0) {
          this.totalDiscount = +(+data.Data.TravelSummary[0].Discount).toFixed(2)
          this.totaltax = +(+data.Data.TravelSummary[0].TaxAmount).toFixed(2)
          this.totalBillAmount = +(+data.Data.TravelSummary[0].BillAmount).toFixed(2)
          this.isSearching = false
        }
      } else {
        throw new Error(data.Description)
      }
    },
    (error) => {
      this.toastrService.showError(error, '')
      this.isSearching = false
    })
  }

  onPrintButton (id, htmlID) {
    this.orgImage = 'http://app.saniiro.com/uploads/2/2/2/Images/Organization/ologorg.png'
    this.word = ''
    let _self = this
    _self._saleTravelServices.printScreenForSale(id).subscribe(data => {
      console.log('sales data : ', data)
      _self.salesData = []
      if (data.Code === UIConstant.THOUSAND) {
        _self.printData = data
        if (data.Data && data.Data.Sales.length > 0) {
          _self.salesData = []
          _self.salesData = data.Data.Sales
          _self.netAmount = (data.Data.Sales[0].BillAmount - data.Data.Sales[0].OtherCharge)
          _self.NumInWords(data.Data.Sales[0].BillAmount)
        } else {
          _self.salesData = []
        }

        if (data.Data && data.Data.Ledgerinfos.length > 0) {
          _self.ledgerinfos = []
          _self.ledgerinfos = data.Data.Ledgerinfos
        } else {
          _self.ledgerinfos = []
        }
        if (data.Data.Saletravels.length > 0) {
          _self.salesItemDatails = []
          _self.salesSummuryItemDatails = []
          this.totalRefundPanelty = 0
          this.totalReIssueCharge = 0
          this.totalmiscellanouseChange = 0
          for (let i = 0; i < data.Data.Saletravels.length; i++) {

            if (JSON.parse(data.Data.Saletravels[i].Type) === UIConstant.ONE) {
              _self.salesItemDatails.push({
                itemName: data.Data.Saletravels[i].ItemName,
                travelDate: data.Data.Saletravels[i].TravelDate,
                returnDate: data.Data.Saletravels[i].ReturnDate,
                flightCode: data.Data.Saletravels[i].FlightCode,
                remark: data.Data.Saletravels[i].Remark,
                saleRate: data.Data.Saletravels[i].SaleRate,
                langiTax: data.Data.Saletravels[i].LangiTax,
                discountAmt: data.Data.Saletravels[i].DiscountAmt,
                svcFee: data.Data.Saletravels[i].SvcFee,
                commissionAmount: data.Data.Saletravels[i].CommissionAmount,
                totalAmount: data.Data.Saletravels[i].TotalAmount

              })
              //  console.log(this.salesItemDatails ,'ffff')

            } else {
              _self.salesSummuryItemDatails.push({
                itemName: data.Data.Saletravels[i].ItemName,
                travelDate: data.Data.Saletravels[i].TravelDate,
                returnDate: data.Data.Saletravels[i].ReturnDate,
                flightCode: data.Data.Saletravels[i].FlightCode,
                saleRate: data.Data.Saletravels[i].SaleRate,
                langiTax: data.Data.Saletravels[i].LangiTax,
                discountAmt: data.Data.Saletravels[i].DiscountAmt,
                svcFee: data.Data.Saletravels[i].SvcFee,
                commissionAmount: data.Data.Saletravels[i].CommissionAmount,
                totalAmount: data.Data.Saletravels[i].TotalAmount
              })
              _self.totalTaxAmount = data.Data.Sales[0].TaxAmount + _self.salesSummuryItemDatails[0].langiTax
            }

            if (data.Data.Saletravels[i].Type === '1') {
              _self.totalRefundPanelty += data.Data.Saletravels[i].RefundPanelty
              _self.totalReIssueCharge += data.Data.Saletravels[i].ReIssueCharge
              _self.totalmiscellanouseChange += data.Data.Saletravels[i].Miscellaneouse
            }
          }

          // this.totalRefundPanelty = 0
          // this.totalReIssueCharge = 0
          // this.totalmiscellanouseChange = 0
          // for (let i = 0; i < data.Data.Saletravels.length; i++) {
          //   if (data.Data.Saletravels[i].Type === 1) {

          //     _self.totalRefundPanelty += data.Data.Saletravels[i].RefundPanelty
          //     _self.totalReIssueCharge += data.Data.Saletravels[i].ReIssueCharge
          //     console.log('data.Data.Saletravels[i].Miscellanouse : ', data.Data.Saletravels[i].Miscellanouse)
          //     _self.totalmiscellanouseChange += data.Data.Saletravels[i].Miscellanouse
          //   }
          // }
        }

        // }
        if (data.Data.Addresses.length > 0) {
          _self.customerAddress = []
          _self.orgAddress = []
          for (let i = 0; i < data.Data.Addresses.length; i++) {
            if (data.Data.Addresses[i].ClientType === 'Customer') {
              _self.customerAddress.push({
                addressValue: data.Data.Addresses[i].AddressValue,
                addressType: data.Data.Addresses[i].AddressType,
                countryName: data.Data.Addresses[i].CountryName,
                statename: data.Data.Addresses[i].Statename,
                cityName: data.Data.Addresses[i].CityName,
                areaName: data.Data.Addresses[i].AreaName
              })
            } else {
              _self.orgAddress.push({
                addressValue: data.Data.Addresses[i].AddressValue,
                addressType: data.Data.Addresses[i].AddressType,
                countryName: data.Data.Addresses[i].CountryName,
                statename: data.Data.Addresses[i].Statename,
                cityName: data.Data.Addresses[i].CityName,
                areaName: data.Data.Addresses[i].AreaName
              })
            }
          }
        }
        if (data.Data.LedgerTypeInfos.length > 0) {
          _self.customerMobileData = []
          _self.customerEmailData = []
          _self.orgMobileData = []
          _self.orgEmailData = []
          _self.orgImageData = []
          _self.orgWebData = []

          for (let i = 0; i < data.Data.LedgerTypeInfos.length; i++) {

            if (data.Data.LedgerTypeInfos[i].ClientType === this.CONST_CUSTOMER_TYPE && data.Data.LedgerTypeInfos[i].EntityType === this.CONST_CONTCT_TYPE) {
              _self.customerMobileData.push({
                cust_mobile: data.Data.LedgerTypeInfos[i].Name
              })
            } else if (data.Data.LedgerTypeInfos[i].ClientType === this.CONST_CUSTOMER_TYPE && data.Data.LedgerTypeInfos[i].EntityType === this.CONST_EMAIL_TYPE) {
              _self.customerEmailData.push({
                cust_email: data.Data.LedgerTypeInfos[i].Name
              })
            } else if (data.Data.LedgerTypeInfos[i].ClientType === this.CONST_ORG_TYPE && data.Data.LedgerTypeInfos[i].EntityType === this.CONST_CONTCT_TYPE) {
              _self.orgMobileData.push({
                org_mobile: data.Data.LedgerTypeInfos[i].Name
              })
            } else if (data.Data.LedgerTypeInfos[i].ClientType === this.CONST_ORG_TYPE && data.Data.LedgerTypeInfos[i].EntityType === this.CONST_EMAIL_TYPE) {
              _self.orgEmailData.push({
                org_email: data.Data.LedgerTypeInfos[i].Name
              })
            } else if (data.Data.LedgerTypeInfos[i].ClientType === this.CONST_ORG_TYPE && data.Data.LedgerTypeInfos[i].EntityType === this.CONST_IMAGE_TYPE) {
              _self.orgImageData.push({
                image: data.Data.LedgerTypeInfos[i].Name
              })
            } else if (data.Data.LedgerTypeInfos[i].ClientType === this.CONST_ORG_TYPE && data.Data.LedgerTypeInfos[i].EntityType === this.CONST_WEB_TYPE) {
              _self.orgWebData.push({
                org_web: data.Data.LedgerTypeInfos[i].Name
              })
            }
          }
          _self.orgImage = 'http://app.saniiro.com/uploads/2/2/2/Images/Organization/ologorg.png'
        }

        setTimeout(function () {
          // _self.printComponent(htmlID);
          _self.printComponent(htmlID)
        }, 0)
      }
    }
    )
    $('#sales_print_id').modal(UIConstant.MODEL_SHOW)
  }

  printComponent (cmpName) {
    let title = document.title
    let divElements = document.getElementById(cmpName).innerHTML
    let printWindow = window.open('', '_blank', '')
    printWindow.document.open()

    printWindow.document.write('<html><head><title>' + title + '</title><style>body{font-family:calibri;font-size:18px}#page-wrap{width:900px;margin:0 auto;background:#f1f1f1;padding:3px}#header{width:100%;text-align:center;color:#000;text-decoration:uppercase;letter-spacing:10px;padding:2px 0;font-size:18px;font-weight:600;border-bottom:1px solid #000}#header12{width:100%;text-align:center;color:#000;padding:2px 0;font-size:18px;font-weight:600;border-top:1px solid #000;border-bottom:1px solid #000}.invoice{border-bottom:1px solid #000;border-left:1px solid #000;border-right:1px solid #000;margin-top:10px;width:100%}.invoiveN{width:60%;float:left}.invoiveN span{padding:5px}.logo{width:40%;float:right}.invoice_table tr td{border:medium none}.invoice_table tr td{border:medium none}.state td{border:1px solid #000;padding:1px 10px}.billT th{border-top:1px solid #000;border-bottom:1px solid #000}.payment th{border:1px solid #000}.payment td{border:1px solid #000}.payment{font-size:16px;font-family:calibri;text-align:right}.record th{border-right:1px solid #000;background:#e9e9ea;text-align:left;border-bottom:1px solid #000}.record td{border-right:1px solid #000}.bank{border:1px solid #000}.amountB{border-bottom:1px solid #000;border-right:1px solid #000}tfoot td{border-top:1px solid #000!important;border-right:1px solid #000!important}table.record{font-size:18px}</style></head><body>')
    printWindow.document.write(divElements)
    printWindow.document.write('</body></html>')
    printWindow.document.close()
    printWindow.focus()
    $('#sales_print_id').modal(UIConstant.MODEL_HIDE)
    setTimeout(function () {
      printWindow.print()
      printWindow.close()
    }, 100)

  }
  word: string = ''
  NumInWords (value) {
    let fraction = Math.round(this.frac(value) * 100)
    let fText = ''

    if (fraction > 0) {
      fText = 'AND ' + this.convertNumber(fraction) + ' PAISE'
    }

    return this.convertNumber(value) + ' RUPEE ' + fText + ' ONLY'
  }

  frac (f) {
    return f % 1
  }

  convertNumber (num1) {
    if ((num1 < 0) || (num1 > 999999999)) {
      return 'Number not count !!-Sysytem issue'
    }
    let Gn = Math.floor(num1 / 10000000)  /* Crore */
    num1 -= Gn * 10000000
    let kn = Math.floor(num1 / 100000)     /* lakhs */
    num1 -= kn * 100000
    let Hn = Math.floor(num1 / 1000)      /* thousand */
    num1 -= Hn * 1000
    let Dn = Math.floor(num1 / 100)       /* Tens (deca) */
    num1 = num1 % 100               /* Ones */
    let tn = Math.floor(num1 / 10)
    let one = Math.floor(num1 % 10)
    this.word = ''

    if (Gn > 0) {
      this.word += (this.convertNumber(Gn) + ' CRORE')
    }
    if (kn > 0) {
      this.word += (((this.word === '') ? '' : ' ') +
        this.convertNumber(kn) + ' LAKH')
    }
    if (Hn > 0) {
      this.word += (((this.word === '') ? '' : ' ') +
        this.convertNumber(Hn) + ' THOUSAND')
    }

    if (Dn) {
      this.word += (((this.word === '') ? '' : ' ') +
        this.convertNumber(Dn) + ' HUNDRED')
    }

    let ones = Array('', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN')
    let tens = Array('', '', 'TWENTY', 'THIRTY', 'FOURTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY')

    if (tn > 0 || one > 0) {
      if (!(this.word === '')) {
        this.word += ' AND '
      }
      if (tn < 2) {
        this.word += ones[tn * 10 + one]
      } else {

        this.word += tens[tn]
        if (one > 0) {
          this.word += ('-' + ones[one])
        }
      }
    }

    if (this.word === '') {
      this.word = 'zero'
    }
    return this.word
  }

  ngOnDestroy () {
    this.queryStr$.unsubscribe()
    this.newBillSub.unsubscribe()
  }
}
