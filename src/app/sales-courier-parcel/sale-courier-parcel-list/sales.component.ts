import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription, throwError, fromEvent } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UIConstant } from '../../shared/constants/ui-constant'
import { Settings } from '../../shared/constants/settings.constant'
import { SalesCourierParcelServices } from '../sale-courier-parcel.services'
import { CommonService } from '../../commonServices/commanmaster/common.services'
import { PagingComponent } from '../../shared/pagination/pagination.component';
import { filter, catchError, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ToastrCustomService } from '../../commonServices/toastr.service';
import { ExcelService } from '../../commonServices/excel.service';
declare const $: any
@Component({
  selector: 'app-travel-invoice',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {
  arrayBuffer: any
  file: any
  sheetname: any
  masterData: any
  subcribe: Subscription
  saleList = []
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
  clientDateFormat: string = ''
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

  p: number = 1
  itemsPerPage: number = 20
  total: number = 0
  lastItemIndex: number = 0
  isSearching: boolean = true
  @ViewChild('paging_comp') pagingComp: PagingComponent
  @ViewChild('searchData') searchData: ElementRef
  onTextEnteredSub: Subscription
  queryStr: string = ''
  queryStr$: Subscription

  searchForm: FormGroup
  constructor (private saleServices: SalesCourierParcelServices,
    private settings: Settings,
    private commomService: CommonService,
    private toastrService: ToastrCustomService,
    private _formBuilder: FormBuilder,
    private excelService: ExcelService
    ) {
    this.newBillSub = this.commomService.newSaleStatus().subscribe(
      (obj: any) => {
        this.getSaleList()
      }
    )
    this.queryStr$ = this.saleServices.queryStr$.subscribe(
      (str) => {
        console.log(str)
        this.queryStr = str
        this.p = 1
        this.getSaleList()
      }
    )
    this.clientDateFormat = this.settings.dateFormat
    // console.log('client date format : ', this.clientDateFormat)
  }

  ngOnInit () {
    this.createForm()
    this.getSaleList()
    this.commomService.fixTableHF('cat-table')
    fromEvent(this.searchData.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value
      }),
      filter(res => res.length > 1 || res.length === 0),
      debounceTime(1000),
      distinctUntilChanged()
      ).subscribe((text: string) => {
        this.searchGetCall(text).pipe(
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
        ).subscribe((data) => {
          this.totalBillAmount = 0
          this.saleList = data
          this.total = this.saleList && this.saleList.length > 0 ? this.saleList[0].TotalRows : 0
          if (data.length > 0) {
            data.forEach(element => {
              this.totalBillAmount = +(this.totalBillAmount + element.BillAmount).toFixed(2)
            })
          }
          this.isSearching = false
        },(err) => {
          this.isSearching = false
          this.toastrService.showError(err, '')
        },
        () => {
          setTimeout(() => {
            this.isSearching = false
          }, 100)
        })
      })
  }
  searchGetCall (term: string) {
    if (!term) {
      term = ''
    }
    this.pagingComp.setPage(1)
    return this.saleServices.getSaleList('?StrSearch=' + term + '&Page=' + this.p + '&Size=' + this.itemsPerPage + this.queryStr)
  }
  createForm () {
    this.searchForm = this._formBuilder.group({
      'searchKey': ['']
    })
  }

  onOpenInvoice (id) {
    this.commomService.openInvoice(id)
  }

  toShowSearch = false

  toggleSearch () {
    this.toShowSearch = !this.toShowSearch
  }
  totalDiscount: number
  totaltax: number
  totalBillAmount: number
  getSaleList () {
    if (!this.searchForm.value.searchKey || this.searchForm.value.searchKey.length === 0) {
      this.searchForm.value.searchKey = ''
    }
    this.isSearching = true
    this.saleServices.getSaleList('?StrSearch=' + this.searchForm.value.searchKey + '&Page=' + this.p + '&Size=' + this.itemsPerPage + this.queryStr).pipe(
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
    ).
    subscribe(data => {
      console.log('sales courier data: ', data)
      this.totalBillAmount = 0
      this.saleList = data.CourierDetails
      this.total = this.saleList && this.saleList.length > 0 ? this.saleList[0].TotalRows : 0
      this.totalBillAmount = +(data.CourierSummary[0].BillAmount).toFixed(2)
      this.isSearching = false
    },
    (error) => {
      this.isSearching = false
      this.toastrService.showError('', error)
    })
  }

  deleteItem (i, forArr) {
    if (forArr === 'trans') {
      this.transactions.splice(i,1)
    }
  }

// generate bar code
  SaleTransactionDetails: any
  barcode: any
  reciverContData: any
  reciverAddress: any
  salesCourierDatails: any
  onPrintButtonCourierParcel (id ,htmlId) {
    this.orgImage = 'http://app.saniiro.com/uploads/2/2/2/Images/Organization/ologorg.png'

    let _self = this
    _self.saleServices.printSCourierParcelSale(id).subscribe(data => {
      // console.log(data , 'courier_prcellll')
      _self.SaleTransactionDetails = []
      if (data.Code === UIConstant.THOUSAND) {
        if (data.Data && data.Data.SaleTransactionDetails.length > 0) {
          _self.SaleTransactionDetails = []

          _self.SaleTransactionDetails = data.Data.SaleTransactionDetails
          _self.barcode = data.Data.SaleTransactionDetails[0].BarcodeBill

          // console.log(_self.SaleTransactionDetails ,'fffffffffffffff')
        } else {
          _self.SaleTransactionDetails = []
        }

        _self.ledgerinfos = []
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
                AreaName: data.Data.Addresses[i].AreaName
              })
            } else if (data.Data.Addresses[i].ClientType === 'Org') {
              _self.orgAddress.push({
                AddressValue: data.Data.Addresses[i].AddressValue,
                AddressType: data.Data.Addresses[i].AddressType,
                CountryName: data.Data.Addresses[i].CountryName,
                Statename: data.Data.Addresses[i].Statename,
                CityName: data.Data.Addresses[i].CityName,
                AreaName: data.Data.Addresses[i].AreaName
              })
            } else if (data.Data.Addresses[i].ClientType === 'Reveiver') {
              _self.reciverAddress.push({
                AddressValue: data.Data.Addresses[i].AddressValue,
                AddressType: data.Data.Addresses[i].AddressType,
                CountryName: data.Data.Addresses[i].CountryName,
                Statename: data.Data.Addresses[i].Statename,
                CityName: data.Data.Addresses[i].CityName,
                AreaName: data.Data.Addresses[i].AreaName
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
            } else if (data.Data.LedgerTypeInfos[i].ClientType === 'Reveiver' && data.Data.LedgerTypeInfos[i].EntityType === 'ContactNo') {
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
        },0)
        $('#printCourierParcel_id').modal(UIConstant.MODEL_SHOW)
      }
    }
       )

  }

  get values (): string[] {
    if (this.barcode) {
      return this.barcode.split('\n')
    }
  }
  printCourierParcel (cmpName) {
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
    this.commomService.excelForCouirerParcelData().subscribe(data => {
      console.log('excel data : ', data)
      if (data.Code === UIConstant.THOUSAND) {
        this.mainData = []
        this.expoertdata = data.Data
        data.Data.InventoryTransactionSales.forEach(mainItem => {
          let item = this.expoertdata.ItemTransactiondetails.filter(s => s.SaleId === mainItem.Id)
          console.log('item : ', item)
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
          console.log(this.mainData)
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
              item
                .map(item1 => item1.TotalAmount)
                .reduce((sum, current) => sum + +current),
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


        })
      } else {
        throw new Error(data.Description)
      }
    },
    (error) => {
      this.toastrService.showError(error, '')
    },
    () => {
      console.log(this.mainData)
      if (this.mainData && this.mainData.length > 0) {
        this.excelService.exportAsExcelFile(this.mainData, 'Sale Report')
      }
    })
  }
}
