import { Component } from '@angular/core'
import { Subscription } from 'rxjs'
import { FormGroup } from '@angular/forms'
import { SaleTravel } from '../../model/sales-tracker.model'
import { SalesCourierParcelServices } from '../sale-courier-parcel.services'
import { UIConstant } from '../../shared/constants/ui-constant'
import { CommonService } from '../../commonServices/commanmaster/common.services'
import * as XLSX from 'xlsx'
declare const $: any

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
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
  // bar code variable
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
  constructor(public _commonServices: CommonService, private _saleTravelServices: SalesCourierParcelServices) {
    this.getSaleTraveDetail()
    this.newBillSub = this._commonServices.newSaleStatus().subscribe(
      (obj: any) => {
        this.getSaleTraveDetail()
      }
    )
  }

  onOpenInvoice(id) {
    this._commonServices.openInvoice(id)
  }

  toShowSearch = false

  toggleSearch() {
    this.toShowSearch = !this.toShowSearch
  }
  /* get sale travel Detail */
  totalDiscount: number
  totaltax: number
  totalBillAmount: number
  getSaleTraveDetail() {
    this._commonServices.getSaleTravelDetail().subscribe(data => {
      // console.log('sales data: ', data)
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

  deleteItem(i, forArr) {
    if (forArr === 'trans') {
      this.transactions.splice(i, 1)
    }
  }

  // generate bar code
  SaleTransactionDetails: any
  barcode: any
  reciverContData: any
  reciverAddress: any
  salesCourierDatails: any
  onPrintButtonCourierParcel(id, htmlId) {
    this.orgImage = 'http://app.saniiro.com/uploads/2/2/2/Images/Organization/ologorg.png'

    let _self = this
    _self._saleTravelServices.printSCourierParcelSale(id).subscribe(data => {
      console.log(data, 'courier_prcellll')
      _self.SaleTransactionDetails = []
      if (data.Code === UIConstant.THOUSAND) {
        if (data.Data && data.Data.SaleTransactionDetails.length > 0) {
          _self.SaleTransactionDetails = []

          _self.SaleTransactionDetails = data.Data.SaleTransactionDetails
          _self.barcode = data.Data.SaleTransactionDetails[0].BarcodeBill

          //  console.log(_self.SaleTransactionDetails, 'fffffffffffffff')
        } else {
          _self.SaleTransactionDetails = []
        }

        //   _self.ledgerinfos = []
        if (data.Data && data.Data.Ledgerinfos.length > 0) {
          _self.ledgerinfos = []
          _self.ledgerinfos = data.Data.Ledgerinfos
        } else {
          _self.ledgerinfos = []
        }
        if (data.Data.ItemTransactiondetails.length > 0) {
          _self.salesCourierDatails = []
          _self.salesCourierDatails = data.Data.ItemTransactiondetails
        } else {
          _self.salesCourierDatails = []

        }

        if (data.Data.Addresses.length > 0) {
          _self.customerAddress = []
          _self.orgAddress = []
          _self.reciverAddress = []
          for (let i = 0; i < data.Data.Addresses.length; i++) {
            if (data.Data.Addresses[i].ClientType === 'Customer') {
              _self.customerAddress.push({
                AddressValue: data.Data.Addresses[i].AddressValue,
                AddressType: data.Data.Addresses[i].AddressType,
                CountryName: data.Data.Addresses[i].CountryName,
                Statename: data.Data.Addresses[i].Statename,
                CityName: data.Data.Addresses[i].CityName,
                AreaName: data.Data.Addresses[i].AreaName,
                PostCode: data.Data.Addresses[i].PostCode
              })
            } else if (data.Data.Addresses[i].ClientType === 'Org') {
              _self.orgAddress.push({
                AddressValue: data.Data.Addresses[i].AddressValue,
                AddressType: data.Data.Addresses[i].AddressType,
                CountryName: data.Data.Addresses[i].CountryName,
                Statename: data.Data.Addresses[i].Statename,
                CityName: data.Data.Addresses[i].CityName,
                AreaName: data.Data.Addresses[i].AreaName,
                PostCode: data.Data.Addresses[i].PostCode
              })
            } else if (data.Data.Addresses[i].ClientType === 'Receiver') {
              _self.reciverAddress.push({
                AddressValue: data.Data.Addresses[i].AddressValue,
                AddressType: data.Data.Addresses[i].AddressType,
                CountryName: data.Data.Addresses[i].CountryName,
                Statename: data.Data.Addresses[i].Statename,
                CityName: data.Data.Addresses[i].CityName,
                AreaName: data.Data.Addresses[i].AreaName,
                PostCode: data.Data.Addresses[i].PostCode
              })
            }
            // console.log( _self.customerAddress ,  _self.orgAddress , _self.reciverAddress ,"sasasasasasasasa---")
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
          _self.reciverContData = []

          for (let i = 0; i < data.Data.LedgerTypeInfos.length; i++) {

            if (data.Data.LedgerTypeInfos[i].ClientType === 'Customer' && data.Data.LedgerTypeInfos[i].EntityType === 'ContactNo') {
              _self.customerMobileData.push({
                cust_mobile: data.Data.LedgerTypeInfos[i].Name
              })
            } else if (data.Data.LedgerTypeInfos[i].ClientType === 'Customer' && data.Data.LedgerTypeInfos[i].EntityType === 'Email') {
              _self.customerEmailData.push({
                cust_email: data.Data.LedgerTypeInfos[i].Name
              })
            } else if (data.Data.LedgerTypeInfos[i].ClientType === 'Receiver' && data.Data.LedgerTypeInfos[i].EntityType === 'ContactNo') {
              _self.reciverContData.push({
                rec_mob: data.Data.LedgerTypeInfos[i].Name
              })
            } else if (data.Data.LedgerTypeInfos[i].ClientType === 'Org' && data.Data.LedgerTypeInfos[i].EntityType === 'ContactNo') {
              _self.orgMobileData.push({
                org_mobile: data.Data.LedgerTypeInfos[i].Name
              })
            } else if (data.Data.LedgerTypeInfos[i].ClientType === 'Org' && data.Data.LedgerTypeInfos[i].EntityType === 'Email') {
              _self.orgEmailData.push({
                org_email: data.Data.LedgerTypeInfos[i].Name
              })
            } else if (data.Data.LedgerTypeInfos[i].ClientType === 'Org' && data.Data.LedgerTypeInfos[i].EntityType === 'Image') {
              _self.orgImageData.push({
                image: data.Data.LedgerTypeInfos[i].Name
              })
            } else if (data.Data.LedgerTypeInfos[i].ClientType === 'Org' && data.Data.LedgerTypeInfos[i].EntityType === 'WEB') {
              _self.orgWebData.push({
                org_web: data.Data.LedgerTypeInfos[i].name
              })
            }
          }
        } else {
          _self.customerMobileData = []
          _self.customerEmailData = []
          _self.orgMobileData = []
          _self.orgEmailData = []
          _self.orgImageData = []
          _self.orgWebData = []
          _self.reciverContData = []

        }

        setTimeout(function () {
          _self.printCourierParcel(htmlId)
        }, 0)
        $('#printCourierParcel_id').modal(UIConstant.MODEL_SHOW)
      }
    }
    )

  }

  get values(): string[] {
    if (this.barcode) {
      return this.barcode.split('\n')
    }
  }
  printCourierParcel(cmpName) {
    let title = document.title
    let divElements = document.getElementById(cmpName).innerHTML
    let printWindow = window.open('', '_blank', '')
    printWindow.document.open()
    printWindow.document.write('<html><head><title>' + title + '</title><style>body{font-family:calibri;font-size:12px}#page-wrap{width:900px;margin:0 auto;background:#fff}#header{width:100%;text-align:center;color:#000;text-decoration:uppercase;letter-spacing:10px;padding:2px 0;font-size:16px;font-weight:600;border-bottom:1px solid #000}#header12{width:100%;text-align:center;color:#000;padding:2px 0;font-size:16px;font-weight:600;border-top:1px solid #000;border-bottom:1px solid #000}.invoice{border-bottom:1px solid #000;border-left:1px solid #000;border-right:1px solid #000;margin-top:10px;width:100%}.invoiveN{width:60%;float:left}.invoiveN span{padding:5px}.logo{width:40%;float:right}.invoice_table tr td{border:medium none}.invoice_table tr td{border:medium none}.state td{border:1px solid #000;padding:1px 10px}.billT th{border-top:1px solid #000;border-bottom:1px solid #000}.payment th{border:1px solid #000}.payment td{border:1px solid #000}.payment{font-family:calibri;text-align:right}.record th{border-right:1px solid #000;background:#e9e9ea;text-align:left;border-bottom:1px solid #000}.record td{border-right:1px solid #000}.bank{border:1px solid #000}tfoot td{border-top:1px solid #000!important;border-right:1px solid #000!important}table.record{font-size:14px}</style></head><body>')
    printWindow.document.write(divElements)
    printWindow.document.write('</body></html>')
    printWindow.document.close()
    printWindow.focus()
    $('#printCourierParcel_id').modal(UIConstant.MODEL_HIDE)

    setTimeout(function () {
      printWindow.print()
      printWindow.close()
    }, 10)

  }
  expoertdata: any
  mainData: any
  Quantity: any
  expoertFileData() {
    debugger

    this.subcribe = this._commonServices.excelForCouirerParcelData().subscribe(data => {
      if (data.Code === UIConstant.THOUSAND) {
        this.mainData = []
        this.expoertdata = data.Data
        data.Data.InventoryTransactionSales.forEach(mainItem => {
          let item = this.expoertdata.ItemTransactiondetails.filter(s => s.SaleId === mainItem.Id)
          let address = this.expoertdata.Addresses.filter(s => (s.SaleId === mainItem.Id) && (s.ClientType === 'Receiver'))
          if (address.length === 0) {
            address.push({
              AddressValue: '',
              AreaName: '',
              CityName: '',
              StateName: '',
              CountryName: '',
              PostCode: ''
            })
          }
          let Customeraddress = this.expoertdata.Addresses.filter(s => (s.SaleId === mainItem.Id) && (s.ClientType === 'Customer'))
          if (Customeraddress.length === 0) {
            Customeraddress.push({
              AddressValue: '',
              AreaName: '',
              CityName: '',
              StateName: '',
              CountryName: '',
              PostCode: ''
            })
          }

          let reciverContact = this.expoertdata.LedgerTypeInfos.filter(s => (s.SaleId === mainItem.Id) && (s.ClientType === 'Receiver') && (s.EntityType === 'ContactNo'))

          let customerContact = this.expoertdata.LedgerTypeInfos.filter(s => (s.SaleId === mainItem.Id) && (s.ClientType === 'Customer') && (s.EntityType === 'ContactNo'))

          this.mainData.push({
            HAWB_No: mainItem.BillNo,
            NO_of_PCS:
              item.filter(item1 => item1.Quantity)
                .map(item1 => parseFloat(item1.Quantity))
                .reduce((sum, current) => sum + current)
            ,
            Consignee_Address_Tele_Number:
              mainItem.CustomerName + ', ' +
              (Customeraddress[0] && Customeraddress[0].AddressValue ? Customeraddress[0].AddressValue + ', ' : '') +
              (Customeraddress[0] && Customeraddress[0].AreaName ? Customeraddress[0].AreaName + ', ' : '') +
              (Customeraddress[0] && Customeraddress[0].CityName ? Customeraddress[0].CityName + ', ' : '') +
              (Customeraddress[0] && Customeraddress[0].StateName ? Customeraddress[0].StateName + ',' : '') +
              (Customeraddress[0] && Customeraddress[0].CountryName ? Customeraddress[0].CountryName + ',' : '') +
              (Customeraddress[0] && Customeraddress[0].PostCode ? Customeraddress[0].PostCode + ', ' : '') +
              'ContactNo - ' +
              Array.prototype.map.call(reciverContact, function (item) { return item.Name }).join(','),
            Description_Goods:
              Array.prototype.map.call(item, function (item) { return item.Description }).join(',')
            ,
            Weight: mainItem.TotalWeight,
            Invoice_Value:
              item.filter(item1 => item1.TotalAmount)
                .map(item1 => parseFloat(item1.TotalAmount))
                .reduce((sum, current) => sum + current),
            Receiver: mainItem.ReceiverName + ' ,' +

              (address[0] && address[0].AddressValue ? address[0].AddressValue + ', ' : '') +
              (address[0] && address[0].AreaName ? address[0].AreaName + ', ' : '') +
              (address[0] && address[0].CityName ? address[0].CityName + ', ' : '') +
              (address[0] && address[0].StateName ? address[0].StateName + ',' : '') +
              (address[0] && address[0].CountryName ? address[0].CountryName + ',' : '') +
              (address[0] && address[0].PostCode ? address[0].PostCode + ', ' : '')  

              + 'ContactNo -' +
              Array.prototype.map.call(customerContact, function (item) { return item.Name }).join(',')
            ,
            Pincode: (Customeraddress[0].PostCode !== null ? Customeraddress[0].PostCode : ''),
            L_H_W: mainItem.ParcelLength + 'x' + mainItem.ParcelHeight + 'x' + mainItem.ParcelWidth

          })

          // console.log(this.mainData, "sss")

        })
      }

    })
  }

  exportAsXLSX(): void {
    this.expoertFileData()
    if (this.mainData && this.mainData.length > 0) {
      this._commonServices.exportAsExcelFile(this.mainData, 'Sale Report')
    }
  }

  //   exportExcel(data) {
  //     this.expoertFileData()
  //   //  console.log(data, "dd")
  //    let newData: any = []
  // //newData = this.mainData;
  //     data.forEach(element => {
  //       newData.push({
  //         S_NO: element.CustomerName,
  //         HAWBNo: element.BillNo,
  //         NO_OF_PCS: element.TotalQty,
  //         Consignee_Address_Tele_Number: element.CustomerName,
  //         Description_of_Goods: element.SupplierName,
  //         Weight: element.BillAmount

  //       })
  //     })
  //     const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(newData)
  //     const workbook: XLSX.WorkBook = { Sheets: { 'newData': worksheet }, SheetNames: ['newData'] };
  //     XLSX.writeFile(workbook, 'saleData.xls', { bookType: 'xls', type: 'buffer' });
  //   }
}
