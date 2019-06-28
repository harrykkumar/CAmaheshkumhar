import { Component, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { SaleTravel } from '../../../model/sales-tracker.model'
import { SaleTravelReturnServices } from '../sale-travel-return.services'
import { Settings } from '../../../shared/constants/settings.constant'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
import { SetUpIds } from '../../../shared/constants/setupIds.constant'
import { UIConstant } from '../../../shared/constants/ui-constant'
declare const $: any
@Component({
  selector: 'app-sale-travel-return',
  templateUrl: './sales-return-list.component.html',
  styleUrls: ['./sales-return-list.component.css']
})
export class SalesReturnListComponent implements OnInit, OnDestroy {
  saleReturnDetails: SaleTravel[]
  newSaleReturnSub: Subscription
  toShowSearch = false
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
  printData: any
  salesData: any
  ledgerinfos: any
  netAmount: number
  salesItemDatails: any = []
  clientDateFormat: string = ''
  constructor (private _saleTravelServices: SaleTravelReturnServices,
    private settings: Settings,
    private commonService: CommonService) {
    this.getSaleReturnDetail()
    this.newSaleReturnSub = this.commonService.newSaleStatus().subscribe(
      (obj: any) => {
        this.getSaleReturnDetail()
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

  totalDiscount: number
  totaltax: number
  totalBillAmount: number
  getSaleReturnDetail () {
    this._saleTravelServices.getSaleReturnList().subscribe(data => {
      console.log('rerurn : ', data)
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        console.log('sales return data: ', data)
        this.saleReturnDetails = data.Data
        this.totalDiscount = 0
        this.totaltax = 0
        this.totalBillAmount = 0
        if (data.Data.length > 0) {
          data.Data.forEach(element => {
            this.totalDiscount = +(this.totalDiscount + +element.Discount).toFixed(2)
            this.totaltax = +(this.totaltax + +element.TaxAmount).toFixed(2)
            this.totalBillAmount = +(this.totalBillAmount + +element.BillAmount).toFixed(2)
          })
        }
      }
    })
  }

  ngOnInit () {
    this.commonService.fixTableHF('cat-table')
  }

  onPrintButton (id, htmlID) {
    console.log('id : ', id)
    // this.orgImage = 'http://app.saniiro.com/uploads/2/2/2/Images/Organization/ologorg.png'
    this.word = ''
    let _self = this
    _self._saleTravelServices.getSaleTravelReturnPrint(id).subscribe(data => {
      console.log('sales return print data : ', data)
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

            if (JSON.parse(data.Data.Saletravels[i].Type) === UIConstant.TWO || JSON.parse(data.Data.Saletravels[i].Type) === UIConstant.ONE) {
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
                totalAmount: data.Data.Saletravels[i].TotalAmount,
                type: data.Data.Saletravels[i].Type
              })
              console.log(this.salesItemDatails ,'ffff')
            }
            if (data.Data.Saletravels[i].Type === '9') {
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
              _self.totalRefundPanelty += data.Data.Saletravels[i].RefundPanelty
              _self.totalReIssueCharge += data.Data.Saletravels[i].ReIssueCharge
              _self.totalmiscellanouseChange += data.Data.Saletravels[i].Miscellaneouse
            }
          }
        }
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
        }
        _self.orgImage = (data.Data.ImageContents && data.Data.ImageContents.length > 0) ? data.Data.ImageContents[0].FilePath : ''
        setTimeout(function () {
          _self.printComponent(htmlID)
        }, 0)
      }
    })
    // $('#sales_print_id').modal(UIConstant.MODEL_SHOW)
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

  toggleSearch () {
    this.toShowSearch = !this.toShowSearch
  }

  ngOnDestroy () {
    this.newSaleReturnSub.unsubscribe()
  }
}
