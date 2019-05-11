import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
import { PurchaseService } from '../purchase.service'
import { Settings } from '../../../shared/constants/settings.constant'
import { FormConstants } from 'src/app/shared/constants/forms.constant'
import { UIConstant } from 'src/app/shared/constants/ui-constant'

declare const $: any
@Component({
  selector: 'app-purchase-main',
  templateUrl: './purchase-main.component.html'
})
export class PurchaseMainComponent {
  title: string
  sub: Subscription
  keepOpen: boolean = true
  toShowSearch: boolean = false
  data$: Subscription

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
  netAmount: number
  _saleTravelServices: any
  salesData: any[]
  printData1: any = []
  ledgerinfos: any[]
  industryId: number
  constructor (private route: ActivatedRoute,
     private commonService: CommonService,
      private purchaseService: PurchaseService,
      private settings: Settings) {
    this.data$ = this.commonService.getActionClickedStatus().subscribe(
      (action: any) => {
        if (action.type === FormConstants.Edit && action.formname === FormConstants.Purchase) {
          this.commonService.openPurchase(+action.id)
        } else if (action.type === FormConstants.Print && action.formname === FormConstants.Purchase) {
          this.onPrintButton(action.id, action.printId)
        }
      }
    )

    this.industryId = +this.settings.industryId
    this.clientDateFormat = this.settings.dateFormat
  }
  ngOnInit () {
    this.sub = this.route.data.subscribe(data => {
      this.title = data.title
    })
  }

  ngOnDestroy () {
    this.sub.unsubscribe()
    this.data$.unsubscribe()
  }

  toggleSearch () {
    this.toShowSearch = !this.toShowSearch
  }

  openPurchase () {
    this.commonService.openPurchase('')
  }

  attributeKeys: any = []
  onPrintButton (id, htmlID) {
    this.orgImage = 'http://app.saniiro.com/uploads/2/2/2/Images/Organization/ologorg.png'
    this.word = ''
    let _self = this
    _self.printData1 = []
    _self.purchaseService.getPrintData(id).subscribe(data => {
      console.log('print data : ', data)
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        data.Data.AddressDetailsOrg = this.purchaseService.getAddressForPrint(data.Data.AddressDetailsOrg[0])
        data.Data.AddressDetails = this.purchaseService.getAddressForPrint(data.Data.AddressDetails[0])
        data.Data.ItemTransactions.map(element => {
          element['itemAttributes'] = data.Data.ItemAttributesTrans.filter(attr => attr.ItemTransId === element.Id)
        })
        _self.attributeKeys = data.Data.ItemTransactions[0].itemAttributes
        _self.NumInWords(data.Data.PurchaseTransactions[0].BillAmount)
        let newItemTransaction = this.splitArray(data.Data.ItemTransactions, 18)
        newItemTransaction.forEach((element, index) => {
          data.Data.ItemTransactions = JSON.parse(JSON.stringify(element))
          _self.printData1[index] = JSON.parse(JSON.stringify(data.Data))
        })
        console.log('print : ', _self.printData1)
        _self.orgImage = 'http://app.saniiro.com/uploads/2/2/2/Images/Organization/ologorg.png'
        setTimeout(function () {
          $('#' + htmlID).modal(UIConstant.MODEL_SHOW)
          _self.printComponent(htmlID)
        }, 1000)
      }
    })
  }

  splitArray (arr, len) {
    let newArr = []
    let start = 0
    let end = len
    let i = 0
    let arr1 = JSON.parse(JSON.stringify(arr))
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
        // newArr[i] = arr1.splice(start, len)
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

  printComponent (cmpName) {
    let title = document.title
    let divElements = document.getElementById(cmpName).innerHTML
    let printWindow = window.open('', '_blank', '')
    printWindow.document.open()

    printWindow.document.write('<html><head><title>' + title + `
    </title><style>
    #page-wrap {
      page-break-after: always;
    }
    #main-con{width: 100%}td.cat-con{max-width: 10%;}
    body{font-family:calibri;font-size:18px;word-break: break-all;width:21cm;height:29.7cm;}
    #page-wrap{width:900px;margin:0 auto;background:#f1f1f1;padding:3px}
    #header{width:100%;text-align:center;color:#000;text-decoration:uppercase;
    letter-spacing:10px;padding:2px 0;font-size:18px;font-weight:600;
    border-bottom:1px solid #000}
    #header12{width:100%;text-align:center;color:#000;
    padding:2px 0;font-size:18px;font-weight:600;
    border-top:1px solid #000;border-bottom:1px solid #000}
    .invoice{border-bottom:1px solid #000;
    border-left:1px solid #000;border-right:1px solid #000;
    margin-top:10px;width:100%}
    .invoiveN{width:100%;float:left}
    .invoiveN span{padding:5px}
    .logo{width:40%;float:right}
    .invoice_table tr td{border:medium none}
    .invoice_table tr td{border:medium none}
    .state td{border:1px solid #000;padding:1px 10px}
    .billT th{border-top:1px solid #000;border-bottom:1px solid #000}
    .payment th{border:1px solid #000}
    .payment td{border:1px solid #000}
    .payment{font-size:16px;font-family:calibri;text-align:right}
    .record th{border-right:1px solid #000;background:#e9e9ea;text-align:left;border-bottom:1px solid #000}
    .record td{border-right:1px solid #000}.bank{border:1px solid #000}
    .amountB{border-bottom:1px solid #000;border-right:1px solid #000}
    tfoot td{border-top:1px solid #000!important;border-right:1px solid #000!important}
    table.record{font-size:18px}</style></head><body>`)
    printWindow.document.write(divElements)
    printWindow.document.write('</body></html>')
    printWindow.document.close()
    printWindow.focus()
    $('#' + cmpName).modal(UIConstant.MODEL_HIDE)
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
}
