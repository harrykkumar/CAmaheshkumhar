import { Component, ViewChild, ElementRef } from '@angular/core'
import { Subscription, fromEvent, throwError } from 'rxjs';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
import { Settings } from '../../../shared/constants/settings.constant'
import { UIConstant } from 'src/app/shared/constants/ui-constant'
import { SetUpIds } from 'src/app/shared/constants/setupIds.constant'
import { ExcelService } from '../../../commonServices/excel.service';
import { GlobalService } from 'src/app/commonServices/global.service';
import { PurchaseService } from 'src/app/inventory/purchase/purchase.service'
declare const $: any
declare const _: any

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css']
})
export class PrintComponent {
  title: string
  sub: Subscription
  keepOpen: boolean = true
  toShowSearch: boolean = false
  orgImage: string
  clientDateFormat: string
  printData1: any = []
  industryId: number
  printId: any
  loading = true
  queryStr$: Subscription
  menuData: any;
  modalSub: Subscription
  type: any
  constructor(public gs: GlobalService,
    public excelService: ExcelService,
    private commonService: CommonService,
    private settings: Settings,
    private purchaseService: PurchaseService,

  ) {

    this.modalSub = this.commonService.getprintStatus().subscribe(
      (status: any) => {
        let Html_id = this.onLoadPrint()
        if (status.open) {
          this.getSetUpModules((JSON.parse(this.settings.moduleSettings).settings))
          this.printId = status.id
          this.type = status.type
          this.openModal(status.id, status.type, status.isViewPrint, Html_id)
        } else {
          this.closePrint(Html_id)

        }
      }
    )
    this.industryId = +this.settings.industryId
    this.clientDateFormat = this.settings.dateFormat
    this.dicimalDigitFormat = this.settings.noOfDecimal
  }
  openModal(id, type, isViewPrint, html_id) {
    if (type === 'DirectSale') {
      this.onPrintForDirectSale(id, html_id, isViewPrint)
    }
    if (type === 'purchase') {
      this.onPrintButton(id, 'purchase_print_id', isViewPrint)
    }
  }
  closePrint(Html_id) {
    $('#' + Html_id).modal(UIConstant.MODEL_HIDE)
  }

  onLoadPrint() {
    if (this.PrintFormateType === 1) {
      return 'saleDirect_PrintType1'
    }
    if (this.PrintFormateType === 2) {
      return 'saleDirect_PrintType2'
    }
    if (this.PrintFormateType === 3) {
      return 'saleDirect_PrintType3'
    }
    if (this.PrintFormateType === 4 || this.PrintFormateType === 5) {
      return 'saleDirect_PrintType4'
    }

  }



  ngOnDestroy() {
    //     this.queryStr$.unsubscribe()
    this.modalSub.unsubscribe()
  }


  DiscountTrans: any = []
  attributeKeys: any = []
  GstTypeId: any = 0
  attributelength: any = 0
  totalBillDiscountAmt: number = 0
  BillDateTime: any = ''
  onPrintForDirectSale(id, htmlId, isViewForm) {
    console.log(id, htmlId, isViewForm)
    let _self = this
    _self.commonService.printDirectSale(id).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND) {
        if (data.Data && data.Data.SaleTransactionses.length > 0) {
          _self.InventoryTransactionSales = []
          this.GstTypeId = data.Data.SaleTransactionses[0].GstTypeId
          this.billAmount = 0
          this.totalBillDiscountAmt = data.Data.SaleTransactionses.BillDiscount
          _self.InventoryTransactionSales = data.Data.SaleTransactionses
          _self.BillDateTime = data.Data.SaleTransactionses.BillDate


          this.paidFlag = data.Data.SaleTransactionses[0].OutStanding === 0 ? 'PAID' : 'UNPAID'
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
        } else {
          _self.orgImageData = ''
        }
        if (data.Data && data.Data.ItemTransactions.length > 0) {
          _self.ItemTransactionactions = []
          _self.itemAttbute = []
          this.totalDiscountAmt = 0
          this.totaltaxAmount = 0
          this.subTotalAmount = 0
          this.attributelength = 0
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
          //  _self.ItemTransactionactions = data.Data.ItemTransactions

          this.attributelength = data.Data.ItemAttributesTrans.length
          data.Data.ItemTransactions.forEach((element, index) => {
            let attributeValue = data.Data.ItemAttributesTrans.filter(d => (d.ItemTransId === element.Id))
            if (attributeValue.length > 0) {
              data.Data.ItemTransactions[index]['Attribute'] = attributeValue
            }
          });
          _self.ItemTransactionactions = data.Data.ItemTransactions

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
          this.splitAddressDetails(data.Data.AddressDetailsOrg[0].AddressValue)
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
        if (data.Data.DiscountTrans.length > 0) {
          this.DiscountTrans = []
          this.DiscountTrans = data.Data.DiscountTrans
        } else {
          this.DiscountTrans = []
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
        }, 100)
        $('#' + htmlId).modal(UIConstant.MODEL_SHOW)
        this.commonService.closePrint(null)
      }
    }
    )

  }
  total: number = 0
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
  PrintFormateType: number = 1
  BillName: any
  customerAddress: any = []
  orgImageData: any
  ItemTransactionactions: any = []
  orgAddress: any
  inWordBillAmount: string = ''
  paidFlag: any
  Emails: any = []
  CustomerTypesLength: any
  CustomerTypes: any = []
  hsnItemData: any = []
  EmailsOrg: any = []
  hsntaxItem: any = []
  PrintWithSave: any = 0
  PaymentDetailsFlag: any = 1
  categoryShowOnPrint: any = 1
  getSetUpModules(settings) {
    settings.forEach(element => {
      debugger
      if (element.id === SetUpIds.printFormate) {
        if (element.val) {
          this.PrintFormateType = element.val
        }
      }
      if (element.id === SetUpIds.PrintWithSave) {
        this.PrintWithSave = +element.val
        //get val 1 then print on save button
      }
      if (element.id === SetUpIds.PaidUnpaidOnBIllShow) {
        this.setUpPaidUnPaid = +element.val
        //get val 1 then print on save button
      }
      if (element.id === SetUpIds.BillDiscountOnPrint) {
        this.BillDiscountOnPrint = +element.val
        //  alert( this.BillDiscountOnPrint)
        //get val 1 then print on save button
      }
      if (element.id === SetUpIds.PaymentDatilsOnPrint_Sale_ServiceSale) {
        this.PaymentDetailsFlag = +element.val
      }
      if (element.id === SetUpIds.categoryShowOnPrint) {
        this.categoryShowOnPrint = +element.val
      }

    })

  }
  setUpPaidUnPaid: any = 0
  BillDiscountOnPrint: any = 0
  //   get values(): string[] {
  //     if (this.barcode) {
  //       return this.barcode.split('\n')
  //     }
  //   }

  applyedCSSForSale() {

    let AppliyedCSSTypeA4_1 = `
@media print {.hidden-print {display: none !important;}}.clearfix:after{content:"";display:table;clear:both}a{color:#0087c3;text-decoration:none}body{position:relative;width:21cm;height:29.7cm;margin:0 auto;color:#000;background:#fff;font-family:Calibri;font-size:12px}.row{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-direction:row}.col{-ms-flex-preferred-size:0;-ms-flex-positive:1;padding-left:10px;max-width:100%}.row1{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-direction:row;flex-wrap:wrap;margin-right:1px;margin-left:0}.col1{-ms-flex-preferred-size:0;flex-basis:0;-ms-flex-positive:1;flex-grow:1;max-width:100%}header{padding:10px 0}.header1{padding:1px 0;border-top:1px solid #333;border-bottom:1px solid #333}#logo{float:left;margin-top:8px}#logo img{height:70px}#company{float:right;text-align:right}#client{padding-left:6px;float:left}#client .to{color:#333}h2.name{font-size:1.6em;font-weight:600;margin:0;text-transform:uppercase}#invoice{float:right;text-align:right}#invoice h1{color:#0087c3;font-size:2.2em;line-height:1em;font-weight:400;margin:0 0 10px 0}#invoice .date{font-size:1.1em;color:#000}table{width:100%;border-collapse:collapse;border-spacing:0;margin-bottom:5px}table td,table th{padding:1px;vertical-align:top;text-align:center;font-size:12px;word-break:break-word}table th{white-space:nowrap;font-weight:700}table td{text-align:left}table td h3{color:#000;font-size:1.2em;font-weight:600;margin:0 0 .2em 0}table .no{color:#000}table .desc{text-align:left}table .total{color:#000;text-align:right}table td.qty,table td.total,table td.unit{font-size:1.2em}table tfoot td{background:#fff;border-bottom:none;font-weight:600;text-align:right;white-space:nowrap;margin-top:100px}table tfoot tr:first-child td{border-top:none}table tfoot tr:last-child td{border-top:1px solid #333}.table1 tbody tr td,.table1 thead tr th{border:1px solid #333;word-break:break-all}#thanks{font-size:2em;margin-bottom:50px}#notices{padding-left:6px;border-left:6px solid #0087c3}#notices .notice{font-size:1.2em}footer{color:#000;width:100%;height:30px;position:absolute;bottom:60px;border-top:1px solid #aaa;padding:8px 0;text-align:center}.name-footer{text-align:left;margin:0;font-size:12px;padding-left:10px}.tbl_footer tr td{text-align:right}.tbl_footer tr td.total{text-align:right;font-weight:700;width:120px}.total_word{padding:4px;border-top:1px solid #333}.terms_section { color: #000;width: 100%; position: absolute;bottom: 115px; border-top: 1px solid #aaa;padding:0;}.tbl_fix_height { min-height: 270px;border-bottom:1px solid #333;}

    `
    let AppliedCSSForTypeA4_Double_Half2 = `
body{font-size:.7rem;color:#000!important;overflow-x:hidden;font-family:Calibri,sans-serif!important;position:relative;width:29.7cm;margin:0 auto}.m-auto{margin:auto}div{display:block}.row{display:flex;flex-wrap:wrap;padding-right:5px;padding-left:5px}.col-md-12{flex:0 0 100%;max-width:100%}.col-md-3{flex:0 0 25%;max-width:25%}.col-md-3{flex:0 0 25%;max-width:25%}.col-md-2{flex:0 0 12.666667%;max-width:12.666667%}.col-md-4{flex:0 0 33.333333%;max-width:33.333333%}.col-md-6{flex:0 0 50%;max-width:50%}.col,.col-1,.col-10,.col-11,.col-12,.col-2,.col-3,.col-4,.col-5,.col-6,.col-7,.col-8,.col-9,.col-auto,.col-lg,.col-lg-1,.col-lg-10,.col-lg-11,.col-lg-12,.col-lg-2,.col-lg-3,.col-lg-4,.col-lg-5,.col-lg-6,.col-lg-7,.col-lg-8,.col-lg-9,.col-lg-auto,.col-md,.col-md-1,.col-md-10,.col-md-11,.col-md-12,.col-md-2,.col-md-3,.col-md-4,.col-md-5,.col-md-6,.col-md-7,.col-md-8,.col-md-9,.col-md-auto,.col-sm,.col-sm-1,.col-sm-10,.col-sm-11,.col-sm-12,.col-sm-2,.col-sm-3,.col-sm-4,.col-sm-5,.col-sm-6,.col-sm-7,.col-sm-8,.col-sm-9,.col-sm-auto,.col-xl,.col-xl-1,.col-xl-10,.col-xl-11,.col-xl-12,.col-xl-2,.col-xl-3,.col-xl-4,.col-xl-5,.col-xl-6,.col-xl-7,.col-xl-8,.col-xl-9,.col-xl-auto{position:relative;width:100%;min-height:1px}.justify-content-center{justify-content:center!important}.bdr_left{border-left:1px solid #000}.bdr_right{border-right:1px solid #000}.bdr_top{border-top:1px solid #000}.bdr_bottom{border-bottom:1px solid #000}.text-center{text-align:center!important}.text-right{text-align:right!important}.text-left{text-align:left!important}.p-2{padding:.5rem!important}.p-1{padding:.25rem!important}.font-weight-bold{font-weight:700!important}.name_size{font-size:22px}.amount_bs{text-align:right;padding:0 3px}.main-balance .tfoot,.main-balance .thead{font-weight:600;padding:5px 0;font-size:1rem;border-top:1px solid #000;border-bottom:1px solid #000}.col-3{flex:0 0 25%;max-width:25%}.col{flex-basis:0%;flex-grow:1;max-width:100%}.p-0{padding:0!important}.ittelic{font-style:italic}*,::after,::before{box-sizing:border-box}.bdr_right_fix{min-height:25px;border-right:1px solid #000}.bdr_left_fix{min-height:25px;border-left:1px solid #000}.d-block{display:block}table{width:100%;border-collapse:collapse;border-spacing:0;margin-bottom:5px}thead{display:table-header-group;vertical-align:middle;border-color:inherit}table td,table th{padding:3px;text-align:left;word-break:break-word}table th{white-space:nowrap;font-weight:600;border-top:1px dashed #000;border-bottom:1px dashed #000;text-align:center;font-size:.75rem!important}.left_side_print{margin-right:15px}.right_side-print{margin-left:15px}table td{text-align:left;font-size:.70rem!important}.table_summery{min-height:350px}.table_summery2{min-height:110px}footer{color:#000;width:100%;height:30px;position:absolute;bottom:0;padding:8px 0;text-align:center}@page{size:landscape}
    `
    let AppliedCSSForTypeA4_3inch_Roll3 = `
    body {
      font-size: .85rem;
      color: #000 !important;
      overflow-x: hidden;
      font-family: 'Calibri',sans-serif !important;
      position: relative;
      width: 7cm;
      /* margin: 0 auto; */
  }

  .m-auto {
      margin: auto;
  }

  div {
      display: block;
  }

  .row {
      display: flex;
      flex-wrap: wrap;
      padding-right: 5px;
      padding-left: 5px;
  }

  .col-md-12 {
      flex: 0 0 100%;
      max-width: 100%;
  }

  .col-md-3 {
      flex: 0 0 25%;
      max-width: 25%;
  }

  .col-md-3 {
      flex: 0 0 25%;
      max-width: 25%;
  }

  .col-md-4 {
      flex: 0 0 33.333333%;
      max-width: 33.333333%;
  }

  .col-md-6 {
      flex: 0 0 50%;
      max-width: 50%;
  }

  .col, .col-1, .col-10, .col-11, .col-12, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9, .col-auto, .col-lg, .col-lg-1, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-auto, .col-md, .col-md-1, .col-md-10, .col-md-11, .col-md-12, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-auto, .col-sm, .col-sm-1, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-auto, .col-xl, .col-xl-1, .col-xl-10, .col-xl-11, .col-xl-12, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, .col-xl-9, .col-xl-auto {
      position: relative;
      width: 100%;
      min-height: 1px;
  }

  .justify-content-center {
      justify-content: center !important;
  }



  .bdr_left {
      border-left: 1px solid #000;
  }

  .bdr_right {
      border-right: 1px solid #000;
  }

  .bdr_top {
      border-top: 1px solid #000;
  }

  .bdr_bottom {
      border-bottom: 1px solid #000;
  }

  .text-center {
      text-align: center !important;
  }

  .text-right {
      text-align: right !important;
  }

  .text-left {
      text-align: left !important;
  }

  .p-2 {
      padding: .5rem !important;
  }

  .p-1 {
      padding: .25rem !important;
  }

  .font-weight-bold {
      font-weight: 700 !important;
  }

  .name_size {
      font-size: 22px;
  }

  .amount_bs {
      text-align: right;
      padding: 0px 3px;
  }

  .main-balance .tfoot, .main-balance .thead {
      font-weight: 600;
      padding: 5px 0;
      font-size: 1rem;
      border-top: 1px solid #000;
      border-bottom: 1px solid #000;
  }

  .col-3 {
      flex: 0 0 25%;
      max-width: 25%;
  }

  .col {
      flex-basis: 0;
      flex-grow: 1;
      max-width: 100%;
  }

  .p-0 {
      padding: 0 !important;
  }

  .ittelic {
      font-style: italic;
  }

  *, ::after, ::before {
      box-sizing: border-box;
  }

  .bdr_right_fix {
      min-height: 25px;
      border-right: 1px solid #000;
  }

  .bdr_left_fix {
      min-height: 25px;
      border-left: 1px solid #000;
  }

  .d-block {
      display: block
  }

  table {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
      margin-bottom: 5px;
  }

  thead {
      display: table-header-group;
      vertical-align: middle;
      border-color: inherit;
  }




  table th,
  table td {
      padding: 3px;
      text-align: left;
      word-break: break-word;
  }

  table th {
      white-space: nowrap;
      font-weight: 600;
      border-top: 1px dashed #000;
      border-bottom: 1px dashed #000;
      text-align: center;
  }



  table td {
      text-align: left;
  }
        `
    let AppliedCSSForTypeA4_Singal_Half4 = `
   body{font-size:.7rem;color:#000!important;overflow-x:hidden;font-family:Calibri,sans-serif!important;position:relative;width:29.7cm;margin:0 auto}.m-auto{margin:auto}div{display:block}.row{display:flex;flex-wrap:wrap;padding-right:5px;padding-left:5px}.col-md-12{flex:0 0 100%;max-width:100%}.col-md-3{flex:0 0 25%;max-width:25%}.col-md-3{flex:0 0 25%;max-width:25%}.col-md-2{flex:0 0 12.666667%;max-width:12.666667%}.col-md-4{flex:0 0 33.333333%;max-width:33.333333%}.col-md-6{flex:0 0 50%;max-width:50%}.col,.col-1,.col-10,.col-11,.col-12,.col-2,.col-3,.col-4,.col-5,.col-6,.col-7,.col-8,.col-9,.col-auto,.col-lg,.col-lg-1,.col-lg-10,.col-lg-11,.col-lg-12,.col-lg-2,.col-lg-3,.col-lg-4,.col-lg-5,.col-lg-6,.col-lg-7,.col-lg-8,.col-lg-9,.col-lg-auto,.col-md,.col-md-1,.col-md-10,.col-md-11,.col-md-12,.col-md-2,.col-md-3,.col-md-4,.col-md-5,.col-md-6,.col-md-7,.col-md-8,.col-md-9,.col-md-auto,.col-sm,.col-sm-1,.col-sm-10,.col-sm-11,.col-sm-12,.col-sm-2,.col-sm-3,.col-sm-4,.col-sm-5,.col-sm-6,.col-sm-7,.col-sm-8,.col-sm-9,.col-sm-auto,.col-xl,.col-xl-1,.col-xl-10,.col-xl-11,.col-xl-12,.col-xl-2,.col-xl-3,.col-xl-4,.col-xl-5,.col-xl-6,.col-xl-7,.col-xl-8,.col-xl-9,.col-xl-auto{position:relative;width:100%;min-height:1px}.justify-content-center{justify-content:center!important}.bdr_left{border-left:1px solid #000}.bdr_right{border-right:1px solid #000}.bdr_top{border-top:1px solid #000}.bdr_bottom{border-bottom:1px solid #000}.text-center{text-align:center!important}.text-right{text-align:right!important}.text-left{text-align:left!important}.p-2{padding:.5rem!important}.p-1{padding:.25rem!important}.font-weight-bold{font-weight:700!important}.name_size{font-size:22px}.amount_bs{text-align:right;padding:0 3px}.main-balance .tfoot,.main-balance .thead{font-weight:600;padding:5px 0;font-size:1rem;border-top:1px solid #000;border-bottom:1px solid #000}.col-3{flex:0 0 25%;max-width:25%}.col{flex-basis:0%;flex-grow:1;max-width:100%}.p-0{padding:0!important}.ittelic{font-style:italic}*,::after,::before{box-sizing:border-box}.bdr_right_fix{min-height:25px;border-right:1px solid #000}.bdr_left_fix{min-height:25px;border-left:1px solid #000}.d-block{display:block}table{width:100%;border-collapse:collapse;border-spacing:0;margin-bottom:5px}thead{display:table-header-group;vertical-align:middle;border-color:inherit}table td,table th{padding:3px;text-align:left;word-break:break-word}table th{white-space:nowrap;font-weight:600;border-top:1px dashed #000;border-bottom:1px dashed #000;text-align:center;font-size:.75rem!important}.left_side_print{margin-right:15px}.right_side-print{margin-left:15px}table td{text-align:left;font-size:.70rem!important}.table_summery{min-height:350px}.table_summery2{min-height:110px}footer{color:#000;width:100%;height:30px;position:absolute;bottom:0;padding:8px 0;text-align:center}@page{size:landscape}
    `
    if (this.PrintFormateType === 1) {
      return AppliyedCSSTypeA4_1
    }
    if (this.PrintFormateType === 2) {
      return AppliedCSSForTypeA4_Double_Half2
    }
    if (this.PrintFormateType === 3) {
      return AppliedCSSForTypeA4_3inch_Roll3
    }
    if (this.PrintFormateType === 4 || this.PrintFormateType === 5) {
      return AppliedCSSForTypeA4_Singal_Half4
    }
  }
  printTypeFormateValue1(cmpName, isViewForm) {
    let title = document.title
    let divElements = document.getElementById(cmpName).innerHTML
    let printWindow = window.open()
    // var printWindow =  window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0')
    printWindow.document.open()
    printWindow.document.write('<html><head><title>' + title + '</title><style>' + this.applyedCSSForSale() + '</style></head><body>')
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
      console.log(this.mainData, 'item-gst')
    });

  }


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
    return newArr
  }


  word: string = ''

  //   mainDataExcel: any = []


  //   getOrgDetails: any = {}
  //   ExcelHeaders: any
  //   ExcelSummary: any

  splitAddressDetails(addressvalue) {
    if (addressvalue) {
      let address = []
      var words = addressvalue.split(' ');
      if (words.length > 0) {
        for (let i = 0; i < 10; i++) {
          address.push(words[i])
        }
      }
    }

  }
  onPrintButton(id, htmlID, isViewPrint) {

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
        _self.getDistinctTaxNameForPurchase(data.Data.HsnItemTaxTransDetails, data.Data.HsnItemTransactions, data.Data.PurchaseTransactions[0].Currency)
        _self.attributeKeys = data.Data.ItemTransactions[0].itemAttributes
        this.word = this.commonService.convertNumber(data.Data.PurchaseTransactions[0].BillAmount)
        this.GstTypeId = data.Data.PurchaseTransactions[0].GstTypeId
        let newItemTransaction = this.splitArray(data.Data.ItemTransactions, 18)
        newItemTransaction.forEach((element, index) => {
          data.Data.ItemTransactions = JSON.parse(JSON.stringify(element))
          _self.printData1[index] = JSON.parse(JSON.stringify(data.Data))
        })

        _self.orgImage = (data.Data.ImageContents && data.Data.ImageContents.length > 0) ? data.Data.ImageContents[0].FilePath : ''
        setTimeout(function () {
          _self.printComponent(htmlID, isViewPrint)
        }, 1000)
        this.commonService.closePrint(null)
      }
    })
  }
  Heading: any = []
  headerKeys: any = []
  hsnToSHow: any = []

  getDistinctTaxNameForPurchase(hsnData, hsnTransaction, currency) {
    let rate = 0
    this.hsnToSHow = []
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
      this.hsnToSHow.push({
        HsnNo: element.HsnNo,
        TaxableAmount: element.TaxableAmount,
        TotalAmount: element.TotalAmount,
        totalTaxRate: rate + '%',
        TaxType: valueshow,
      })
    });
    console.log(this.hsnToSHow, 'Main-HSN')
  }
  printComponent(cmpName, isViewPrint) {
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
    body{font-family: Calibri;font-size:13px;word-break: break-word;width:21cm;height:29.7cm;position: relative;}
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
      if (!isViewPrint) {
        printWindow.print()
        printWindow.close()
      }

    }, 100)
  }
}

