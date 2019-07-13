import { Component } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { Subscription } from 'rxjs'
import { SaleTravel } from 'src/app/model/sales-tracker.model'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
import { UIConstant } from 'src/app/shared/constants/ui-constant'
import { Settings } from '../../../shared/constants/settings.constant'
declare const $: any
declare const _: any

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css']
})
export class PrintComponent {
  subscribe: Subscription
  modalSub: Subscription
  arrayBuffer: any
  file: any
  saleDirectDetails: any
  sheetname: any
  masterData: any
  subcribe: Subscription
  saleTravelDetails: SaleTravel[]
  saletravelForm: FormGroup
  bankForm: FormGroup
  newBillSub: Subscription
  printOpenData: Subscription
  transactions: any = []
  printData: any
  salesData: any
  ItemTransactionactions: any
  netAmount: number
  salesItemDatails: any = []
  salesSummuryItemDatails: any
  totalRefundPanelty: any
  totalReIssueCharge: any
  totalmiscellanouseChange: any
  customerAddress: any[]
  orgAddress: any[]
  customerMobileData: any[]
  customerEmailData: any[]
  orgMobileData: any[]
  orgEmailData: any[]
  orgImageData: any
  orgWebData: any[]
  orgImage: string

  totalTaxAmount: any
  elementType = 'svg'
  value = '0123456789012'
  format = 'CODE128'
  lineColor = '#000000'
  width = 2
  height = 100
  displayValue = true
  fontOptions = ''
  font = 'monospace'
  textAlign = 'center'
  textPosition = 'bottom'
  textMargin = 2
  fontSize = 20
  background = '#ffffff'
  margin = 10
  marginTop = 10
  marginBottom = 10
  marginLeft = 10
  marginRight = 10

  codeList: string[] = [
    '', 'CODE128',
    'CODE128A', 'CODE128B', 'CODE128C',
    'UPC', 'EAN8', 'EAN5', 'EAN2',
    'CODE39',
    'ITF14',
    'MSI', 'MSI10', 'MSI11', 'MSI1010', 'MSI1110',
    'pharmacode',
    'codabar'
  ]

  industryId: any
  printId: any
  type: any
  clientDateFormat: any
  dicimalDigitFormat: any
  constructor (private _CommonService: CommonService, public _settings: Settings) {

    this.clientDateFormat = this._settings.dateFormat
    this.dicimalDigitFormat = this._settings.noOfDecimal
    this.modalSub = this._CommonService.getprintStatus().subscribe(
      (status: any) => {
        // if (status.open) {
        //   debugger
        //   this.printId = status.id
        //   this.type = status.type
        //   this.openModal(this.type,status.isViewPrint)
        // } else {
        //   this.closeModal()
        // }
      }
    )
  }

  ngOnDestroy () {
    this.modalSub.unsubscribe()
  }

  openModal (type,isViewPrint) {
   // if (type === 'DirectSale') {
     // let data = JSON.stringify(this._settings.industryId)
      //this.industryId = JSON.parse(data)
     // this.onPrintForDirectSale(this.printId, 'sale_Direct_print_id',isViewPrint)
    //}
  }
  closeModal () {
    $('#sale_Direct_print_id').modal(UIConstant.MODEL_HIDE)
  }

  // generate bar code
  InventoryTransactionSales: any
  barcode: any
  ItemAttributesTransactions: any
  reciverContData: any
  reciverAddress: any
  itemAttributeDatails: any
  itemAttbute: any
  website: any
  ContactCustInfo: any
  ContactOrgInfo: any
  ItemTaxTrans: any
  totalDiscountAmt: any
  totaltaxAmount: any
  subTotalAmount: any
  billAmount: any
  paymentModeData: any =[]
  TermsConditions: any
  ClientInfos: any
  billName ={
   billspply: 'Bill Of Supply',
   taxname:'Tax-Invoice'
  }
  getAddtionalCharge: any
  onPrintForDirectSale (id, htmlId,isViewForm) {
    this.orgImage = 'http://app.saniiro.com/uploads/2/2/2/Images/Organization/ologorg.png'
    let _self = this
    _self._CommonService.printDirectSale(id).subscribe(data => {
      //    console.log(JSON.stringify(data)  , 'salechallan')
      if (data.Code === UIConstant.THOUSAND) {

        if (data.Data && data.Data.SaleTransactionses.length > 0) {
          _self.InventoryTransactionSales = []
          this.billAmount = 0
          _self.InventoryTransactionSales = data.Data.SaleTransactionses
          _self.barcode = data.Data.SaleTransactionses[0].BarcodeBill
          this.billAmount = (data.Data.SaleTransactionses[0].BillAmount).toFixed(this.dicimalDigitFormat)
          this._CommonService.NumInWords(this.billAmount)
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
          _self.ItemTaxTrans = []
          _self.ItemTaxTrans = data.Data.ItemTaxTransDetails
        } else {
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
      //  this.CustomerTypes = []
          this.hsntaxItem = data.Data.HsnItemTaxTransDetails

        } else {
          this.hsntaxItem = []
        }
        if (data.Data.HsnItemTransactions.length > 0) {
          this.hsnItemData= []
         let  hsnitem =[]
          // data.Data.HsnItemTransactions.forEach( ele =>{
          //    hsnitem  = data.Data.HsnItemTaxTransDetails.filter(s=> s.HsnNo === ele.HsnNo)
          //   if(hsnitem.length > 0) {
          //     let totalrate = hsnitem.filter(item1 => item1.TaxRate)
          //     .map(item1 => parseFloat(item1.TaxRate))
          //     .reduce((sum, current) => sum + current, 0)
          //     this.hsnItemData.push({
          //       id:ele,
          //      HsnNo:ele.HsnNo,
          //      TaxableAmount:ele.TaxableAmount,
          //      TotalAmount:ele.TotalAmount,
          //      tax: hsnitem,
          //      rate:totalrate
               
          //     })
          //   }
          // })
         // console.log(this.hsnItemData,'HSN')
          

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


  headerKeys: any = []
  hsnToSHow: any = []
  Heading:any=[]
  HeadingSale:any =[]
  headerValue: any
  HedShow:any
  mainData:any=[]
  per:any ='%'
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
  SupplyAddress: any
  hsnItemData: any
  hsntaxItem: any
  CustomerTypesLength: any
  CustomerTypes: any
  EmailsOrg: any
  Emails: any

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


}
