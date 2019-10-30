import { LoginService } from './../../../commonServices/login/login.services';

import { Component, OnInit, ElementRef, ViewChild } from '@angular/core'
import { Subscription, fromEvent } from 'rxjs'
import { map, filter, debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { SaleTravel } from '../../../model/sales-tracker.model'
import { UIConstant } from '../../../shared/constants/ui-constant'
declare const $: any
import { VendorServices } from '../../../commonServices/TransactionMaster/vendoer-master.services'
import { CommonService } from '../../../commonServices/commanmaster/common.services'
import { ToastrCustomService } from '../../../commonServices/toastr.service'
import { PagingComponent } from '../../../shared/pagination/pagination.component'
import { FormGroup, FormBuilder } from '@angular/forms'
import { Settings } from '../../../shared/constants/settings.constant'
import * as _ from 'lodash'

@Component({
  selector: 'app-sales-challan',
  templateUrl: './sales-challan.component.html',
  styleUrls: ['./sales-challan.component.css']
})
export class SalesChallanComponent implements OnInit {
  arrayBuffer: any
  file: any
  sheetname: any
  itemsPerPage: number = 20
  masterData: any
  subcribe: Subscription
  saleTravelDetails: SaleTravel[]
  ledgerItemList: Array<any> = [];
  saletravelForm: FormGroup
  bankForm: FormGroup
  newBillSub: Subscription
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
  orgImageData: any = []
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
  refreshingpage: Subscription
  queryStr$: Subscription
  total: number = 0
  searchForm: FormGroup
  isSearching: boolean = false
  queryStr: string = ''
  lastItemIndex: number = 0
  p: number = 1
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
  formTypeNmae:any='Select Customer'
  clientDateFormat: any
  dicimalDigitFormat: any = 0
  dataStatus:any =[]
  industryId: any
  StausValue:any=0
  menuData: any;
  constructor(public _settings: Settings, private _formBuilder: FormBuilder, private _coustomerServices: VendorServices,
     public _commonService: CommonService,
     public _toastrCustomService: ToastrCustomService,
     private _loginService: LoginService) {
    this.menuData = this._loginService.getMenuDetails(10, 9);
    this.formSearch()
    this.StausValue=0

    this.getLedgerItemList()
    this.dataStatus = [
      { id: '0', text: 'Running' },
      { id: '1', text: 'Canceled' },
    ]
    this.itemIdCollection = []
    this.generateBillFlagEnable = true
    this.clientDateFormat = this._settings.dateFormat
    this.dicimalDigitFormat = this._settings.noOfDecimal
    this.industryId = this._settings.industryId
    this.getSaleChallanDetail()
    this.newBillSub = this._commonService.newSaleStatus().subscribe(
      (obj: any) => {
        this.getSaleChallanDetail()
        $(document).ready(function () {
          $('.table_challan').tableHeadFixer({
            head: true,
            foot: true,
          });
        });
      }
    )
    this.queryStr$ = this._coustomerServices.queryStr$.subscribe(
      (str) => {
        console.log(str)
        this.queryStr = str
        this.p = 1
        this.getSaleChallanDetail()
      }
    )
    this.refreshingpage = this._commonService.newRefreshItemStatus().subscribe(
      (obj) => {
        this.getSaleChallanDetail()
      }
    )
  }
  @ViewChild('paging_comp') pagingComp: PagingComponent
  private formSearch() {
    this.searchForm = this._formBuilder.group({
      'searckKey': [UIConstant.BLANK]
    })
  }
  onOpenInvoice(id) {
    this._commonService.openInvoice(id)
    //this.itemIdCollection = []
  }
  allChallanNos: any
  onOpenChallanBilling() {
    this._commonService.openChallanBill(this.allChallanIds, this.allChallanNos)
    //this.itemIdCollection = []
  }

  toShowSearch = false

  toggleSearch() {
    this.toShowSearch = !this.toShowSearch
  }
  /* get sale travel Detail */
  totalDiscount: number
  totaltax: number
  totalBillAmount: number
  @ViewChild('searchData') searchData: ElementRef
   isViewPrint :any
   ledgerItemId:any=null
   selectedLedgerId: number = 0
   selectedStatusId:number=0
   statusId:number =null
   LedgerName: any = ''
   fromDatevalue:any=''
   toDateValue:any=''
   statusChange (event){
    if (event.id > 0) {
      this.selectedStatusId = +event.id
    }
   }
   onLedgerItemChange = (event) => {
   // if (this.ledgerItemId !== null) {

      if (event.id > 0) {
        this.selectedLedgerId = +event.id
        this.LedgerName = event.text
      }
    //}
  }
  StausType:any=0
  formTypeNmae2:any ='Status'
  searchResetButton() {
    this.toDateValue = ''
    this.fromDatevalue = ''
    this.selectedLedgerId = 0
    this.selectedStatusId=0
    this.ledgerItemId = null
    this.statusId=null
    this.getSaleChallanDetail()
  }
  searchButton() {
        this.getSaleChallanDetail()
  }

  getLedgerItemList = () => {
    this.isViewPrint = false
    this._commonService.getCustomer(5).pipe(
      map((data: any) => {
        return _.map(data.Data, (element) => {
          return {
            id: element.Id,
            text: element.Name
          }
        })
      })
    )
      .subscribe((response: any) => {
        this.ledgerItemList = [{ id: UIConstant.ZERO, text: 'Select Ledger' }, ...response];
      })
  }
  getSaleChallanDetail() {
    if (!this.searchForm.value.searckKey) {
      this.searchForm.value.searckKey = ''
    }
  let ToDate =  this.toDateValue
  let FromDate =  this.fromDatevalue


    this._commonService.getAllDataOfSaleChallan('?Strsearch=' + this.searchForm.value.searckKey+'&Status='+this.StausType+'&ToDate='+ToDate+'&FromDate='+FromDate +'&LedgerId='+this.selectedLedgerId+ '&Page=' + this.p + '&Size=' + this.itemsPerPage + this.queryStr).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND) {
        console.log('sales data: ', data)
        this.totalBillAmount = 0
        if (data.Data.length > 0) {
          this.notRecordFound = false
        }
        else {
          this.notRecordFound = true

        }
        this.saleTravelDetails = data.Data
        this.total = this.saleTravelDetails[0] ? this.saleTravelDetails[0].TotalRows : 0

        for (let i = 0; i < data.Data.length; i++) {
          if (data.Data[i].SaleId === 0) {
            this.generateBillFlagEnable = true
            this.allChallanIds = []
            this.allChallanNos = []
          }
        }
      }
    })
  }
  notRecordFound: any = true
  ngOnInit() {
    this.itemIdCollection=[]
    this._commonService.fixTableHF('table_challan')
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
        this.saleTravelDetails = data.Data
        this.total = this.saleTravelDetails[0] ? this.saleTravelDetails[0].TotalRows : 0
      }, (err) => {
        setTimeout(() => {
          this.isSearching = false
        }, 100)
        console.log('error', err)
      },
        () => {
          setTimeout(() => {
            this.isSearching = false
          }, 100)
        })
    })
  }
  searchGetCall(term: string) {
    if (!term) {
      term = ''
    }
    this.pagingComp.setPage(1)
    return this._commonService.getAllDataOfSaleChallan('?Strsearch=' + term + '&Page=' + this.p + '&Size=' + this.itemsPerPage + this.queryStr)
  }
  deleteItem(i, forArr) {
    if (forArr === 'trans') {
      this.transactions.splice(i, 1)
    }
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
  onPrintButtonSaleChallan(id, htmlId) {
    // this.orgImage = 'http://app.saniiro.com/uploads/2/2/2/Images/Organization/ologorg.png'
    //alert(id)
    let _self = this
    _self._commonService.printAndEditSaleChallan(id).subscribe(data => {
      console.log(JSON.stringify(data), 'salechallan')
      _self.InventoryTransactionSales = []
      if (data.Code === UIConstant.THOUSAND) {

        if (data.Data && data.Data.InventoryTransactionSales.length > 0) {
          _self.InventoryTransactionSales = []

          _self.InventoryTransactionSales = data.Data.InventoryTransactionSales
          _self.barcode = data.Data.InventoryTransactionSales[0].BarcodeBill

          console.log(_self.InventoryTransactionSales, 'fffffffffffffff')
        } else {
          _self.InventoryTransactionSales = []
        }

        _self.ItemTransactionactions = []
        if (data.Data && data.Data.ItemTransactionactions.length > 0) {
          _self.ItemTransactionactions = []
          _self.ItemTransactionactions = data.Data.ItemTransactionactions
        } else {
          _self.ItemTransactionactions = []
        }
        if (data.Data.AttributeValues.length > 0) {
          _self.itemAttributeDatails = []

          _self.itemAttributeDatails = data.Data.AttributeValues
        } else {
          _self.itemAttributeDatails = []

        }
        if (data.Data.ImageContent.length > 0) {
          this.orgImageData = []
          _self.orgImageData = data.Data.ImageContent[0].FilePath
        } else {
          this.orgImageData = []
        }
        if (data.Data.ItemTransactionactions.length > 0) {
          _self.ItemTransactionactions = []
          _self.itemAttbute = []
          //  _self.ItemTransactionactions = data.Data.ItemTransactionactions
          data.Data.ItemTransactionactions.forEach((element, index) => {
            let attributeValue = data.Data.ItemAttributesTransactions.filter(d => (d.ItemTransId === element.Id))
            if (attributeValue.length > 0) {
              data.Data.ItemTransactionactions[index]['Attribute'] = attributeValue
            }
          });
          _self.ItemTransactionactions = data.Data.ItemTransactionactions
          // for(let i=0; i < data.Data.ItemTransactionactions.length; i++) {
          //    for(let j=0; j < data.Data.ItemAttributesTransactions.length; j++) {
          //   if(data.Data.ItemTransactionactions[i].Id === data.Data.ItemAttributesTransactions[j].ItemTransId){
          //      this.itemAttbute.push({
          //        attr:data.Data.ItemAttributesTransactions[j].AttributeName,
          //        ItemId:data.Data.ItemAttributesTransactions[j].ItemId,
          //        rowId :data.Data.ItemAttributesTransactions[j].ItemTransId,
          //        Id:data.Data.ItemAttributesTransactions[j].Id
          //      })
          //      console.log(this.itemAttbute ,"colorr")
          //   }
          //    }

          // }
        } else {
          _self.ItemTransactionactions = []

        }

        if (data.Data.AddressDetails.length > 0) {
          _self.customerAddress = []
          _self.customerAddress = data.Data.AddressDetails

        } else {
          _self.customerAddress = []

        }
        if (data.Data.TermsConditions.length > 0) {
          this.TermsConditions = []
          this.TermsConditions = data.Data.TermsConditions
        } else {
          this.TermsConditions = []
        }
        if (data.Data.Ledgerinfos.length > 0) {
          this.ClientInfos = []
          this.ClientInfos = data.Data.Ledgerinfos
        } else {
          this.ClientInfos = []
        }
        if (data.Data.AddressOrgDetails.length > 0) {
          _self.orgAddress = []
          _self.orgAddress = data.Data.AddressOrgDetails

        } else {
          _self.orgAddress = []

        }
        if (data.Data.Websites.length > 0) {
          this.website = []
          this.website = data.Data.Websites
        }
        else {
          this.website = []
        }
        if (data.Data.ContactInfo.length > 0) {
          this.ContactCustInfo = []
          this.ContactCustInfo = data.Data.ContactInfo
        } else {
          this.ContactCustInfo = []
        }
        if (data.Data.ContactOrgInfo.length > 0) {
          this.ContactOrgInfo = []
          this.ContactOrgInfo = data.Data.ContactOrgInfo
        } else {
          this.ContactOrgInfo = []
        }
        setTimeout(function () {
          _self.printCourierParcel(htmlId)
        }, 10)
        $('#printCourierParcel_id').modal(UIConstant.MODEL_SHOW)
      }
    }
    )

  }
  TermsConditions: any = []
  // orgImageData:any=[]
  ClientInfos: any = []
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
    printWindow.document.write('<html><head><title>' + title + '</title><style>h2.name{font-size:1.6em;font-weight:600;margin:0;text-transform:uppercase}.name_size{font-size:22px}body{font-family:calibri;font-size:12px}#page-wrap{width:900px;margin:0 auto;background:#fff}#header{width:100%;text-align:center;color:#000;text-decoration:uppercase;letter-spacing:10px;padding:2px 0;font-size:16px;font-weight:600;border-bottom:1px solid #000}#header12{width:100%;text-align:center;color:#000;padding:2px 0;font-size:16px;font-weight:600;border-top:1px solid #000;border-bottom:1px solid #000}.invoice{border-bottom:1px solid #000;border-left:1px solid #000;border-right:1px solid #000;margin-top:10px;width:100%}.invoiveN{width:60%;float:left}.invoiveN span{padding:5px}.logo{width:40%;float:right}.invoice_table tr td{border:medium none}.invoice_table tr td{border:medium none}.state td{border:1px solid #000;padding:1px 10px}.billT th{border-top:1px solid #000;border-bottom:1px solid #000}.payment th{border:1px solid #000}.payment td{border:1px solid #000}.payment{font-family:calibri;text-align:right}.record th{border-right:1px solid #000;background:#e9e9ea;text-align:left;border-bottom:1px solid #000}.record td{border-right:1px solid #000}.bank{border:1px solid #000}tfoot td{border-top:1px solid #000!important;border-right:1px solid #000!important}table.record{font-size:14px}</style></head><body>')
    printWindow.document.write(divElements)
    printWindow.document.write('</body></html>')
    printWindow.document.close()
    printWindow.focus()
    $('#printCourierParcel_id').modal(UIConstant.MODEL_HIDE)
    setTimeout(function () {
      printWindow.print()
      printWindow.close()
    }, 60)

  }

  data: any = [{
    ddd: 'e101',
    ename: 'ravi',
    esal: 1000
  },
  {
    ddd: 'e102',
    ename: 'ram',
    esal: 2000
  },
  {
    ddd: 'e103',
    ename: 'rajesh',
    esal: 3000
  }];
  importExcelFile(data) {

    //this._saleTravelServices.exportAsExcelFile(this.saleTravelDetails, 'sample');
  }
  itemIdCollection: any
  generateBillFlagEnable: boolean
  allChallanIds: any;
  checkedList: any = []
  sameLedger: any[]

  getBillingId(data, e, index) {
    let postDataId = []
    let postDataChallnNo = []
    if (e.target.checked) {
      if (this.itemIdCollection.length === 0) {
        this.generateBillFlagEnable = false

        this.itemIdCollection.push({
          itemId: data.Id,
          orgId: data.OrgId,
          ledgerId: data.LedgerId,
          ChallanNo: data.ChallanNo
        })
      } else {
        this.itemIdCollection.forEach(ele => {
          if (data.OrgId === ele.orgId && data.LedgerId === ele.ledgerId) {
            this.generateBillFlagEnable = false
            this.itemIdCollection.push({
              itemId: data.Id,
              orgId: data.OrgId,
              ledgerId: data.LedgerId,
              ChallanNo: data.ChallanNo

            })

          } else {
            this.generateBillFlagEnable = true
            this._toastrCustomService.showError('Error', 'Diffrent Orgnazation & Ledger ')

          }

        })
      }
    } else {
      for (let i = 0; i < this.itemIdCollection.length; i++) {
        if (this.itemIdCollection[i].itemId === data.Id) {
          this.itemIdCollection.splice(i, 1)
          this.generateBillFlagEnable = true
        }
      }
    }

    this.itemIdCollection.forEach(id => {
      postDataId.push(id.itemId)
      postDataChallnNo.push(id.ChallanNo)

      this.allChallanIds = postDataId.toString()
      this.allChallanNos = postDataChallnNo.toString()

    })

    console.log(this.allChallanIds, this.allChallanNos, 'id')

  }
}
