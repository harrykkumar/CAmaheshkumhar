import { Component, ViewChild, ElementRef } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Subscription, fromEvent, throwError } from 'rxjs';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
import { PurchaseService } from '../purchase.service'
import { Settings } from '../../../shared/constants/settings.constant'
import { FormConstants } from 'src/app/shared/constants/forms.constant'
import { UIConstant } from 'src/app/shared/constants/ui-constant'
import { FormGroup, FormBuilder } from '@angular/forms';
import { map, filter, debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators';
import { ToastrCustomService } from '../../../commonServices/toastr.service';
import { PurchaseAddComponent } from '../purchase-add/purchase-add.component';

declare const $: any
declare const _: any
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
  orgImage: string
  clientDateFormat: string
  printData1: any = []
  industryId: number
  loading = true
  constructor (private route: ActivatedRoute,
     private commonService: CommonService,
      private purchaseService: PurchaseService,
      private settings: Settings,
      private toastrService: ToastrCustomService,
      private _formBuilder: FormBuilder) {
        this.loading = true
        this.getSPUtilityData()
    this.data$ = this.commonService.getActionClickedStatus().subscribe(
      (action: any) => {
        if (action.type === FormConstants.Edit && action.formname === FormConstants.Purchase) {
          this.commonService.openPurchase(+action.id)
        } else if (action.type === FormConstants.Print && action.formname === FormConstants.Purchase) {
          this.onPrintButton(action.id, action.printId)
        }
      }
    )
    this.formSearch()
    this.industryId = +this.settings.industryId
    this.clientDateFormat = this.settings.dateFormat
  }

  ngAfterContentInit() {
    this.purchaseAdd.initComp()
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
        this.purchaseService.onTextEntered(text)
      })
  }
  @ViewChild('purchase_add') purchaseAdd: PurchaseAddComponent
  getSPUtilityData () {
    this.loading = true
    let _self = this
    this.commonService.getSPUtilityData(UIConstant.PURCHASE_TYPE)
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
          _self.purchaseService.generateAttributes(data)
        }
        if (data.ItemCategorys.length > 0) {
          _self.purchaseAdd.getCatagoryDetail(data.ItemCategorys)
        }
        _self.purchaseAdd.allItems = [ ...data.Items ]
        // console.log('allItems : ', this.allItems)
        _self.purchaseService.createItems(data.Items)
        _self.purchaseService.createVendors(data.Vendors)
        _self.purchaseService.createTaxProcess(data.TaxProcesses)
        _self.purchaseService.createPaymentModes(data.PaymentModes)
        _self.purchaseService.createOrganisations(data.Organizations)
        _self.purchaseService.createGodowns(data.Godowns)
        _self.purchaseService.createReferralTypes(data.ReferalTypes)
        _self.purchaseService.createSubUnits(data.SubUnits)
        _self.purchaseService.createTaxSlabs(data.TaxSlabs)
        _self.purchaseService.createReferral(data.Referals)
        _self.purchaseService.createCurrencies(data.Currencies)
        _self.purchaseService.createFreightBy(data.FreightModes)
        _self.purchaseService.createCharges(data.LedgerCharges)
        _self.purchaseAdd.clientStateId = data.ClientAddresses[0].StateId
        _self.purchaseAdd.TransactionNoSetups = data.TransactionNoSetups
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
    this.purchaseAdd.initialiseExtras()
    this.commonService.openPurchase('')
  }

  attributeKeys: any = []
  onPrintButton (id, htmlID) {
    // this.orgImage = 'http://app.saniiro.com/uploads/2/2/2/Images/Organization/ologorg.png'
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
        _self.getDistinctTaxName(data.Data.HsnItemTaxTransDetails, data.Data.HsnItemTransactions, data.Data.PurchaseTransactions[0].Currency)
        _self.attributeKeys = data.Data.ItemTransactions[0].itemAttributes
        _self.NumInWords(data.Data.PurchaseTransactions[0].BillAmount)
        let newItemTransaction = this.splitArray(data.Data.ItemTransactions, 18)
        newItemTransaction.forEach((element, index) => {
          data.Data.ItemTransactions = JSON.parse(JSON.stringify(element))
          _self.printData1[index] = JSON.parse(JSON.stringify(data.Data))
        })
        console.log('print : ', _self.printData1)
        _self.orgImage = (data.Data.ImageContents && data.Data.ImageContents.length > 0) ? data.Data.ImageContents[0].FilePath : ''
        setTimeout(function () {
          // $('#' + htmlID).modal(UIConstant.MODEL_SHOW)
          _self.printComponent(htmlID)
        }, 1000)
      }
    })
  }
Heading:any =[]
  headerKeys: any = []
  hsnToSHow: any = []
  HedShow:any =[]
  getDistinctTaxName (hsnData, hsnTransaction, currency) {
    //TaxTitleId
let rate=0
this.hsnToSHow =[]
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
     
      this.hsnToSHow.push({
       HsnNo:element.HsnNo,
       TaxableAmount:element.TaxableAmount,
       TotalAmount:element.TotalAmount,
       totalTaxRate:rate +'%',
       TaxType:valueshow,
      })
    });
    console.log(this.hsnToSHow ,'Main-HSN')
    // let groupOnName = _.groupBy(hsnData, (data) => {
    //   return data.Name + '(' + data.TaxRate + '%)'
    // })
    // let GroupHeading = _.groupBy(hsnData, (data) => {
    //   return data.Name 
    // })
    // this.Heading =[]
    // this.headerKeys = []
    // this.hsnToSHow = []
    // console.log(groupOnName)
    // for (const name in groupOnName) {
    //   this.headerKeys.push(name)
    // }
    // for (const name in GroupHeading) {
    //   this.Heading.push(name)
    // }
    // hsnTransaction.forEach(hsnTrans => {
    //   let hsnDetails = hsnData.filter(hsnDetail => hsnDetail.HsnNo === hsnTrans.HsnNo)
    //   let totalTaxRate = 0
    //   let obj = {}
    //   hsnDetails.forEach(hsn => {
    //     let index = this.headerKeys.indexOf(hsn.Name + '(' + hsn.TaxRate + '%)')
    //     if (index >= 0) {
    //       obj[hsn.Name + '(' + hsn.TaxRate + '%)'] = hsn.Amount
    //       totalTaxRate += hsn.TaxRate
    //     } else {
    //       obj[hsn.Name + '(' + hsn.TaxRate + '%)'] = '-'
    //     }
    //   })
    //   hsnTrans['totalTaxRate'] = totalTaxRate + ' ' + (hsnDetails[0].ValueType === 0 ? '%' : currency)
    //   hsnTrans['AppliedTaxes'] = obj
    // })
    // this.hsnToSHow = JSON.parse(JSON.stringify(hsnTransaction))
    // console.log('hsn to show : ', this.hsnToSHow)
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
    .border-right {
      border-right: 1px solid #333;
    }
    .border-left {
      border-left: 1px solid #333;
    }
    .border-bottom {
      border-bottom: 1px solid #333;
    }
    .border-top {
      border-top: 1px solid #333;
    }
    .border-all {
      border: 1px solid #333;
    }
    @media print {.hidden-print {display: none !important;}}
   
    #main-con{width: 100%}td.cat-con{max-width: 10%;}
    .invoiveN table td, .billT table td {
      font-size: 13px !important;
    }
    body{font-family: Calibri;font-size:13px;word-break: break-all;width:21cm;height:29.7cm;position: relative;}
    #page-wrap{width:100%;margin:0 auto;background:#f1f1f1;}
    #header{width:100%;text-align:center;color:#000;text-decoration:uppercase;
    letter-spacing:10px;padding:2px 0;font-size:13px;}
    #header12{width:100%;text-align:center;color:#000;
    padding:2px 0;font-size:13px;font-weight:600;
    }
    .invoice{
    margin-top:10px;width:100%}
    .invoiveN{width:100%;float:left}
    .invoiveN span{padding:5px}
    .logo{width:40%;float:right}
    .invoice_table tr td{}
    .invoice_table tr td{}
    .state td{padding:1px 10px}
    .billT th{border-top:1px solid #000;}
    .payment th{}
    .payment td{}
    .payment{font-size:13px;font-family:calibri;text-align:right}
    .record th{background:#e9e9ea;text-align:left;}
    .record td{}.bank{}
    .amountB{}
    tfoot td{}
    table.record{font-size:13px}</style></head><body>`)
    printWindow.document.write(divElements)
    printWindow.document.write('</body></html>')
    printWindow.document.close()
    printWindow.focus()
    $('#' + cmpName).modal(UIConstant.MODEL_HIDE)
    setTimeout(function () {
     /*   printWindow.print()
       printWindow.close() */
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
