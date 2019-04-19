import { Component } from '@angular/core'
import { Subscription } from 'rxjs'
import { FormGroup } from '@angular/forms'
import { SaleTravel } from '../../model/sales-tracker.model'
import { UIConstant } from '../../shared/constants/ui-constant'
import { Settings } from '../../shared/constants/settings.constant'
import { SetUpIds } from '../../shared/constants/setupIds.constant'
import { SalesCourierLocalServices } from '../sales-courier-local.services'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
declare const $: any
@Component({
  selector: 'app-travel-invoice',
  templateUrl: './sales-courier-local-list.component.html',
  styleUrls: ['./sales-courier-local-list.component.css']
})
export class SalesComponent {
  arrayBuffer: any
  file: any
  sheetname: any
  masterData: any
  subcribe: Subscription
  saleTravelDetails: SaleTravel[]
  saletravelForm: FormGroup
  bankForm: FormGroup
  newBillSub: Subscription
  transactions: any = []
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
  customerMobileData: any[]
  customerEmailData: any[]
  orgMobileData: any[]
  orgEmailData: any[]
  orgImageData: any[]
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
  clientDateFormat: string = ''
  constructor (private _saleServices: SalesCourierLocalServices,
    private settings: Settings,
    private commonService: CommonService) {
    this.getSaleTraveDetail()
    this.newBillSub = this.commonService.newSaleStatus().subscribe(
      (obj: any) => {
        this.getSaleTraveDetail()
      }
    )
    this.clientDateFormat = this.settings.dateFormat
    console.log('client date format : ', this.clientDateFormat)
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

  onOpenInvoice (id) {
    this.commonService.openInvoice(id)
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
    this.commonService.getSaleDetail().subscribe(data => {
      console.log('sales data: ', data)
      if (data.Code === UIConstant.THOUSAND && data.Data) {
        this.totalBillAmount = 0
        this.saleTravelDetails = data.Data
        if (data.Data.length > 0) {
          data.Data.forEach(element => {
            this.totalBillAmount = +(this.totalBillAmount + element.BillAmount).toFixed(2)
          })
        }
      }
    })
  }

  deleteItem (i, forArr) {
    if (forArr === 'trans') {
      this.transactions.splice(i,1)
    }
  }

// generate bar code

  get values (): string[] {
    return this.value.split('\n')
 // return  this.inventoryTransactionSalesData[0].barcode.split('\n')
  }

  salesCourierDatails: any
  courierSummuryItemDatails: any
  amount: any
  reciverAddress: any
  inventoryTransactionSalesData: any
  onPrintButtonCourier (id ,htmlId) {

    this.orgImage = 'http://app.saniiro.com/uploads/2/2/2/Images/Organization/ologorg.png'

    let _self = this
    _self._saleServices.printSCourierSale(id).subscribe(data => {
      console.log(data , 'courier')
      _self.inventoryTransactionSalesData = []
      if (data.Code === UIConstant.THOUSAND) {
        if (data.Data && data.Data.InventoryTransactionSales.length > 0) {
          _self.inventoryTransactionSalesData = []
          _self.inventoryTransactionSalesData = data.Data.InventoryTransactionSales
          _self.amount = data.Data.InventoryTransactionSales[0].BillAmount
        } else {
          _self.inventoryTransactionSalesData = []
        }
        _self.ledgerinfos = []
        if (data.Data && data.Data.Ledgerinfos.length > 0) {
          _self.ledgerinfos = data.Data.Ledgerinfos
        } else {
          _self.ledgerinfos = []
        }
        if (data.Data.ItemTransactions.length > 0) {
          _self.salesCourierDatails = []
          _self.courierSummuryItemDatails = []
          for (let i = 0; i < data.Data.ItemTransactions.length; i++) {
            if (JSON.parse(data.Data.ItemTransactions[i].TransType) === UIConstant.ONE) {
              _self.salesCourierDatails.push({
                itemName: data.Data.ItemTransactions[i].Remark,
                qty: data.Data.ItemTransactions[i].Quantity,
                weight: data.Data.ItemTransactions[i].Length,
                saleRate: data.Data.ItemTransactions[i].SaleRate,
                discountAmt: data.Data.ItemTransactions[i].DiscountAmt,
                totalAmount: data.Data.ItemTransactions[i].TotalAmount

              })
                 //  console.log(this.salesItemDatails ,'ffff')

            } else {
              _self.courierSummuryItemDatails.push({
                itemName: data.Data.ItemTransactions[i].Remark,
                qty: data.Data.ItemTransactions[i].Quantity,
                weight: data.Data.ItemTransactions[i].Length,

                saleRate: data.Data.ItemTransactions[i].SaleRate,
                discountAmt: data.Data.ItemTransactions[i].DiscountAmt,
                totalAmount: data.Data.ItemTransactions[i].TotalAmount

              })

            }
          }
        } else {
          _self.salesCourierDatails = []
          _self.courierSummuryItemDatails = []
        }

              // _self.totalTaxAmount = data.Data.sales[0].taxAmount + _self.salesSummuryItemDatails[0].langiTax ;

        if (data.Data.Addresses.length > 0) {
          _self.customerAddress = []
          _self.reciverAddress = []
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
            } else if (data.Data.Addresses[i].ClientType === 'Org') {
              // _self.orgAddress = []
              _self.orgAddress.push({
                addressValue: data.Data.Addresses[i].AddressValue,
                addressType: data.Data.Addresses[i].AddressType,
                countryName: data.Data.Addresses[i].CountryName,
                statename: data.Data.Addresses[i].Statename,
                cityName: data.Data.Addresses[i].CityName,
                areaName: data.Data.Addresses[i].AreaName
              })
            } else if (data.Data.Addresses[i].clientType === 'Reveiver') {
              // _self.reciverAddress = []
              _self.reciverAddress.push({
                addressValue: data.Data.Addresses[i].AddressValue,
                addressType: data.Data.Addresses[i].AddressType,
                countryName: data.Data.Addresses[i].CountryName,
                statename: data.Data.Addresses[i].Statename,
                cityName: data.Data.Addresses[i].CityName,
                areaName: data.Data.Addresses[i].AreaName
              })
            }
          }
        } else {
          _self.customerAddress = []
          _self.orgAddress = []
          _self.reciverAddress = []
        }
        if (data.Data.LedgerTypeInfos.length > 0) {
          _self.customerMobileData = []
          _self.customerEmailData = []
          _self.orgMobileData = []
          _self.orgEmailData = []
          _self.orgImageData = []
          _self.orgWebData = []

          for (let i = 0; i < data.Data.LedgerTypeInfos.length; i++) {

            if (data.Data.LedgerTypeInfos[i].ClientType === 'Customer' && data.Data.LedgerTypeInfos[i].EntityType === 'Customer') {
              _self.customerMobileData.push({
                cust_mobile: data.Data.LedgerTypeInfos[i].name
              })
            } else if (data.Data.LedgerTypeInfos[i].ClientType === 'Customer' && data.Data.LedgerTypeInfos[i].EntityType === 'Email') {
              _self.customerEmailData.push({
                cust_email: data.Data.LedgerTypeInfos[i].name
              })
            } else if (data.Data.LedgerTypeInfos[i].ClientType === 'Org' && data.Data.LedgerTypeInfos[i].EntityType === 'Customer') {
              _self.orgMobileData.push({
                org_mobile: data.Data.LedgerTypeInfos[i].name
              })
            } else if (data.Data.LedgerTypeInfos[i].ClientType === 'Org' && data.Data.LedgerTypeInfos[i].EntityType === 'Email') {
              _self.orgEmailData.push({
                org_email: data.Data.LedgerTypeInfos[i].name
              })
            } else if (data.Data.LedgerTypeInfos[i].ClientType === 'Org' && data.Data.LedgerTypeInfos[i].EntityType === 'Image') {
              _self.orgImageData.push({
                image: data.Data.LedgerTypeInfos[i].name
              })
            } else if (data.Data.LedgerTypeInfos[i].ClientType === 'Org' && data.Data.LedgerTypeInfos[i].EntityType === 'WEB') {
              _self.orgWebData.push({
                org_web: data.Data.LedgerTypeInfos[i].name
              })
            }
          }
          _self.orgImage = 'http://app.saniiro.com/uploads/2/2/2/Images/Organization/ologorg.png'
        } else {
          _self.customerMobileData = []
          _self.customerEmailData = []
          _self.orgMobileData = []
          _self.orgEmailData = []
          _self.orgImageData = []
          _self.orgWebData = []
        }

        setTimeout(function () {
          _self.printCourier(htmlId)
        },0)
        $('#printCourier_id').modal(UIConstant.MODEL_SHOW)

      }
    }
          )

  }

  printCourier (cmpName) {
    let title = document.title
    let divElements = document.getElementById(cmpName).innerHTML
    let printWindow = window.open('', '_blank', '')
    printWindow.document.open()
    printWindow.document.write('<html><head><title>' + title + '</title><style>body{font-family:calibri;font-size:12px}#page-wrap{width:900px;margin:0 auto;background:#fff}#header{width:100%;text-align:center;color:#000;text-decoration:uppercase;letter-spacing:10px;padding:2px 0;font-size:16px;font-weight:600;border-bottom:1px solid #000}#header12{width:100%;text-align:center;color:#000;padding:2px 0;font-size:16px;font-weight:600;border-top:1px solid #000;border-bottom:1px solid #000}.invoice{border-bottom:1px solid #000;border-left:1px solid #000;border-right:1px solid #000;margin-top:10px;width:100%}.invoiveN{width:60%;float:left}.invoiveN span{padding:5px}.logo{width:40%;float:right}.invoice_table tr td{border:medium none}.invoice_table tr td{border:medium none}.state td{border:1px solid #000;padding:1px 10px}.billT th{border-top:1px solid #000;border-bottom:1px solid #000}.payment th{border:1px solid #000}.payment td{border:1px solid #000}.payment{font-size:12px;font-family:calibri;text-align:right}.record th{border-right:1px solid #000;background:#e9e9ea;text-align:left;border-bottom:1px solid #000}.record td{border-right:1px solid #000}.bank{border:1px solid #000}.amountB{border-bottom:1px solid #000;border-right:1px solid #000}tfoot td{border-top:1px solid #000!important;border-right:1px solid #000!important}table.record{font-size:12px}</style></head><body>')
    printWindow.document.write(divElements)
    printWindow.document.write('</body></html>')
    printWindow.document.close()
    printWindow.focus()
    $('#printCourier_id').modal(UIConstant.MODEL_HIDE)

    setTimeout(function () {
      printWindow.print()
      printWindow.close()
    }, 10)

  }

}
