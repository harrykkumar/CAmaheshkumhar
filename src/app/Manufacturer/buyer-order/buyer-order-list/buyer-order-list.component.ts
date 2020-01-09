import { BuyerOrderService } from './../buyer-order.service';
import { AddBuyerOrderComponent } from './../add-buyer-order/add-buyer-order.component';
import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, ViewContainerRef, ComponentFactoryResolver, ElementRef } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import * as _ from 'lodash'
import { CommonService } from '../../../commonServices/commanmaster/common.services';
import { ToastrCustomService } from '../../../commonServices/toastr.service';
import { Settings } from '../../../shared/constants/settings.constant';
import { PackagingAddComponent } from '../../packaging/packaging-add/packaging-add.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UIConstant } from '../../../shared/constants/ui-constant';
import { map } from 'rxjs/internal/operators/map';
import { filter } from 'rxjs/internal/operators';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { PagingComponent } from '../../../shared/pagination/pagination.component';
import { ManufacturingService } from '../../manufacturing.service';
import { GlobalService } from '../../../commonServices/global.service';
import { ExcelService } from '../../../commonServices/excel.service';
declare const $: any
@Component({
  selector: 'app-buyer-order-list',
  templateUrl: './buyer-order-list.component.html',
  styleUrls: ['./buyer-order-list.component.css']
})
export class BuyerOrderListComponent implements OnInit, OnDestroy, AfterViewInit {
  model: any = {}
  lastItemIndex: number = 0
  p: number = 1
  itemsPerPage: number = 20
  total: number = 0
  buyerOrderList: Array<any> = []
  buyerOrderSummary: any = {}
  clientDateFormat = ''
  componentRef: any

  queryStr: string
  searchForm: FormGroup
  isSearching: boolean = false
  destroy$: Subscription[] = []
  noOfDecimal = 2
  @ViewChild('addBuyerOrderFormRef') addBuyerOrderFormModal: AddBuyerOrderComponent;
  @ViewChild('packagingaddcontainer', { read: ViewContainerRef }) entry: ViewContainerRef;
  constructor(
    private resolver: ComponentFactoryResolver,
    private buyerOrderService: BuyerOrderService,
    private commonService: CommonService,
    private toastrService: ToastrCustomService,
    private settings: Settings,
    private _formBuilder: FormBuilder,
    private _ms: ManufacturingService,
    private _gs: GlobalService,
    private excelService: ExcelService
  ) {
    this.noOfDecimal = +this.settings.noOfDecimal
    this.clientDateFormat = this.settings.dateFormat
    this.destroy$.push(this.buyerOrderService.queryStr$.subscribe(
      (str) => {
        console.log(str)
        this.queryStr = str
        this.p = 1
        this.getBuyerOrderList()
      }
    ))
    this.destroy$.push(this.commonService.getDeleteStatus().subscribe(
      (obj) => {
        if (obj.id && obj.type && obj.type === 'buyerOrder') {
          this.deleteItem(obj.id)
        }
      }
    ))
    this.formSearch()
  }


  @ViewChild('searchData') searchData: ElementRef
  private formSearch() {
    this.searchForm = this._formBuilder.group({
      'searckKey': [UIConstant.BLANK]
    })
  }

  createComponent(data) {
    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(PackagingAddComponent);
    this.componentRef = this.entry.createComponent(factory);
    this.componentRef.instance.orderId = data
    this.componentRef.instance.getOrderData();
    this.componentRef.instance.openModal();
  }

  destroyComponent() {
    this.componentRef.destroy();
  }

  ngOnInit() {
    const _self = this
    this.getBuyerOrderList()
    this.commonService.fixTableHF('cat-table')
    this.destroy$.push(fromEvent(this.searchData.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value
      }),
      filter(res => res.length > 1 || res.length === 0),
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe((text: string) => {
      _self.isSearching = true
      _self.destroy$.push(_self.searchGetCall(text).subscribe((data) => {
        console.log('search data : ', data)
        setTimeout(() => {
          _self.isSearching = false
        }, 100)
        _self.buyerOrderList = data.BuyerOrderInfos
        _self.total = _self.buyerOrderList[0] ? _self.buyerOrderList[0].TotalRows : 0;
        _self.buyerOrderSummary = data.BuyerOrderSummaryData[0]
      }, (err) => {
        setTimeout(() => {
          _self.isSearching = false
        }, 100)
        console.log('error', err)
      },
      () => {
        setTimeout(() => {
          this.isSearching = false
        }, 100)
      }))
    }))
  }

  @ViewChild('paging_comp') pagingComp: PagingComponent
  searchGetCall(term: string) {
    if (!term) {
      term = ''
    }
    this.pagingComp.setPage(1)
    const queryStr = this.queryStr ? this.queryStr : ''
    return this.buyerOrderService.getBuyerListOnSearch('?Strsearch=' + term + '&Page=' + this.p + '&Size=' + this.itemsPerPage + queryStr)
  }

  ngAfterViewInit() {
    this.commonService.fixTableHF('buyerorder-table')
  }

  getBuyerOrderList() {
    this.isSearching = true
    if (!this.searchForm.value.searckKey) {
      this.searchForm.value.searckKey = ''
    }
    const queryStr = this.queryStr ? this.queryStr : ''
    this.destroy$.push(this.buyerOrderService.getBuyerListOnSearch('?Strsearch=' + this.searchForm.value.searckKey + '&Page=' + this.p + '&Size=' + this.itemsPerPage + queryStr).subscribe(data => {
      // console.log('item master : ', data)
      this.buyerOrderList = data.BuyerOrderInfos
      this.total = this.buyerOrderList[0] ? this.buyerOrderList[0].TotalRows : 0
      this.buyerOrderSummary = data.BuyerOrderSummaryData[0]
      setTimeout(() => {
        this.isSearching = false
      }, 100)
    },
    (error) => {
      this.toastrService.showError(error, '')
      this.isSearching = false
    }))
  }

  addBuyerOrder(data?) {
    this.addBuyerOrderFormModal.openModal(data)
  }

  onModalClosed(event) {
    this.getBuyerOrderList()
  }

  addItemRequirement(item) {
    this.destroy$.push(this.buyerOrderService.getBuyerOrderData(item.Id).subscribe(
      (data) => {
        console.log('edit : ', data)
        this.addBuyerOrder({ edit: true, data: data })
      },
      (error) => {
        console.log(error)
        this.toastrService.showError(error, '')
      }
    ))
  }

  packOrder(item) {
    this._ms.openOP(item.Id, '')
  }

  toShowSearch = false
  toggleSearch() {
    this.toShowSearch = !this.toShowSearch
  }

  delete(id) {
    this.commonService.openDelete(id, 'buyerOrder', 'Buyer Order')
  }

  deleteItem(id) {
    if (id) {
      this.destroy$.push(this.buyerOrderService.deleteBO(id).subscribe((data) => {
        this.toastrService.showSuccess('', 'Deleted Successfully')
        this.commonService.closeDelete('')
        this.getBuyerOrderList()
      },
      (error) => {
        this.toastrService.showErrorLong('', error)
        this.commonService.closeDelete('')
      }))
    }
  }

  ngOnDestroy() {
    if (this.destroy$ && this.destroy$.length > 0) {
      this.destroy$.forEach((element) => element.unsubscribe())
    }
  }

  printData: any = {}
  TermsConditions: any = []
  orgImage: string = ''
  ItemTransactionactions: any = []
  Clientinfos: any = []
  AddressDetailsOrg: any = []
  AddressDetails: any = []
  EmailsOrg: any = []
  ContactInfosOrg: any = []
  Websites: any = []
  BuyerOrderDetails: any = []
  print(id, htmlID) {
    const _self = this
    this.destroy$.push(this.buyerOrderService.printInvoice(id).subscribe((data) => {
      console.log(data)
      _self.ItemTransactionactions = this.createOrderList(data.BuyerOrderTransInfos, data.ItemAttributesTrans)
      _self.orgImage = (data.ImageContents && data.ImageContents.length > 0) ? data.ImageContents[0].FilePath : ''
      _self.TermsConditions = data.TermsConditions
      _self.Clientinfos = data.Clientinfos
      _self.AddressDetailsOrg = data.AddressDetailsOrg
      _self.AddressDetails = data.AddressDetails
      _self.EmailsOrg = data.EmailsOrg
      _self.ContactInfosOrg = data.ContactInfosOrg
      _self.Websites = data.Websites
      _self.BuyerOrderDetails = data.BuyerOrderDetails
      _self.printData = data
      console.log(_self.printData)
      setTimeout(function () {
        _self.printInvoice(htmlID,false)
      }, 1000)
    },
    (error) => {
      this.toastrService.showErrorLong(error, '')
    }))
  }

  printInvoice(cmpName, isViewForm) {
    let title = document.title
    let divElements = document.getElementById(cmpName).innerHTML
    let printWindow = window.open()
    printWindow.document.open()
    printWindow.document.write(`<html><head><title>${title}</title><style>
    .clearfix:after {
      content: "";
      display: table;
      clear: both;
    }
    a {
      color: #0087C3;
      text-decoration: none;
    }
    body {
      position: relative;
      width: 21cm;
      height: 29.7cm;
      margin: 0 auto;
      color: #000;
      background: #FFF;
      font-family: Calibri;
      font-size: 13px;
    }
  .row {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-direction: row;
  }
  .col {
    -ms-flex-preferred-size: 0;
    -ms-flex-positive: 1;
    padding-left: 10px;
    max-width: 100%;
  }
  .row1 {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-direction: row;
    flex-wrap: wrap;
    margin-right: 1px;
    margin-left: 0px;
  }
  .col1 {
    -ms-flex-preferred-size: 0;
    flex-basis: 0;
    -ms-flex-positive: 1;
    flex-grow: 1;
    max-width: 100%;
  }
  header {
    padding: 10px 0;
  }
  .header1 {
    padding: 1px 0;
    border-top: 1px solid #333;
    border-bottom: 1px solid #333;
  }
  #logo {
    float: left;
    margin-top: 8px;
  }
  #logo img {
    height: 70px;
  }
  #company {
    float: right;
    text-align: right;
  }
  #client {
    padding-left: 6px;
    float: left;
  }
  #client .to {
    color: #333;
  }
  h2.name {
    font-size: 1.4em;
    font-weight: 600;
    margin: 0;
  }
  #invoice {
    float: right;
    text-align: right;
  }
  #invoice h1 {
    color: #0087C3;
    font-size: 2.4em;
    line-height: 1em;
    font-weight: normal;
    margin: 0 0 10px 0;
  }
  #invoice .date {
    font-size: 1.1em;
    color: #000;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    margin-bottom: 5px;
  }
  table th, table th, table td {
    padding: 1px;
    vertical-align: middle;
    text-align: center;
    font-size: 13px;
    word-break: break-all;
  }
  table th {
    white-space: nowrap;
    font-weight: bold;
  }
  table td {
    text-align: left;
  }
  table td h3 {
    color: #000;
    font-size: 1em;
    font-weight: 600;
    margin: 0 0 0.2em 0;
  }
  table .no {
    color: #000;
  }
  table .total {
    color: #000;
    text-align: right;
  }
  table td.unit, table td.qty, table td.total {
    font-size: 1em;
    text-align: center
  }
  table tfoot td {
    background: #FFF;
    border-bottom: none;
    font-weight: 600;
    text-align: right;
    white-space: nowrap;
    margin-top: 100px;
  }
  table tfoot tr:first-child td {
    border-top: none;
  }
  table tfoot tr:last-child td {
    border-top: 1px solid #333;
  }
  .table1 tbody tr td, .table1 thead tr th {
    border: 1px solid #333;
    word-break: break-word;
  }
  #thanks {
    font-size: 2em;
    margin-bottom: 50px;
  }
  #notices {
    padding-left: 6px;
    border-left: 6px solid #0087C3;
  }
  #notices .notice {
    font-size: 1.2em;
  }
  footer {
    color: #000;
    width: 100%;
    height: 30px;
    position: absolute;
    bottom: 60px;
    border-top: 1px solid #AAA;
    padding: 8px 0;
    text-align: center;
  }
  .name-footer {
    text-align: left;
    margin: 0;
    font-size: 12px;
    padding-left: 10px;
  }
  .tbl_footer tr td {
    text-align: right;
  }
  .tbl_footer tr td.total {
    text-align: right;
    font-weight: 700;
  }
  .total_word {
    padding: 5px;
    border-top: 1px solid #333;
  }
  .bank_detail {
    border-right: 1px solid #333;
  }
  .trm_cond {
    color: #000;
    width: 100%;
    /* height: 30px; */
    position: absolute;
    bottom: 120px;
    border-top: 1px solid #AAA;
    padding: 8px 0;
      /* text-align: center; */
  }</style></head><body>`)
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

 
  createOrderList (buyerOrderTrans, transList?) {
    const _self = this
    let previousOrders = []
    if (transList) {
      _.forEach(buyerOrderTrans, (element) => {
        let obj = {}
        _.forEach(transList, (trans) => {
          if (element.Id === trans.ItemTransId) {
            if (trans.IsMeasurment) {
              obj['sizeName'] = trans.AttributeValueName
              obj['Rate'] = element.Rate
              obj['Amount'] = element.SubTotalAmount
              obj['ProductDescription'] = element.ProductDescription
              obj['ProductCode'] = element.ProductCode
              obj['unitName'] = element.UnitName
              obj['Remark'] = element.Remark
              obj['itemName'] = element.ItemName
              obj['StyleNo'] = element.Stylename
              obj['Quantity'] = element.OrderQty
            } else {
              // obj['attributeValueId'] = (obj['attributeValueId']) ? obj['attributeValueId'] + '-' + trans.AttributeValueId : trans.AttributeValueId
              obj['attributeValueName'] = (obj['attributeValueName']) ? obj['attributeValueName'] + '-' + trans.AttributeValueName : trans.AttributeValueName
            }
          }
        })
        previousOrders.push({...obj})
      })
    } else {
      _.forEach(buyerOrderTrans, (element) => {
        let obj = {}
        obj['Rate'] = element.Rate
        obj['Amount'] = element.SubTotalAmount
        obj['ProductDescription'] = element.ProductDescription
        obj['ProductCode'] = element.ProductCode
        obj['unitName'] = element.UnitName
        obj['Remark'] = element.Remark
        obj['itemName'] = element.ItemName
        obj['StyleNo'] = element.Stylename
        obj['Quantity'] = element.OrderQty
        previousOrders.push({...obj})
      })
    }
    console.log(previousOrders)
    return previousOrders
  }

  OrderPackets: any = []
  printFor: string = ''
  printPO(id, htmlID) {
    const _self = this
    this.destroy$.push(this.buyerOrderService.printPOInvoice(id).subscribe((data) => {
      console.log(data)
      _self.ItemTransactionactions = this.getItemCombos(data.ItemAttributesTrans, data.OrderPacketDetails)
      this.getComboFor(data.ItemAttributesTrans)
      _self.orgImage = (data.ImageContents && data.ImageContents.length > 0) ? data.ImageContents[0].FilePath : ''
      _self.TermsConditions = data.TermsConditions
      _self.Clientinfos = data.Clientinfos
      _self.AddressDetailsOrg = data.AddressDetailsOrg
      _self.AddressDetails = data.AddressDetails
      _self.EmailsOrg = data.EmailsOrg
      _self.ContactInfosOrg = data.ContactInfosOrg
      _self.Websites = data.Websites
      _self.OrderPackets = data.OrderPackets
      _self.printData = data
      setTimeout(function () {
        _self.printInvoice(htmlID,false)
      }, 1000)
    },
    (error) => {
      this.toastrService.showErrorLong(error, '')
    }))
  }

  
  printPOInvoice(cmpName, isViewForm) {
    let title = document.title
    let divElements = document.getElementById(cmpName).innerHTML
    let printWindow = window.open()
    printWindow.document.open()
    printWindow.document.write(`<html><head><title>${title}</title><style>
    .clearfix:after {
      content: "";
      display: table;
      clear: both;
  }

  a {
      color: #0087C3;
      text-decoration: none;
  }

  body {
      position: relative;
      width: 21cm;
      height: 29.7cm;
      margin: 0 auto;
      color: #000;
      background: #FFF;
      font-family: Calibri;
      font-size: 13px;
  }

  .row {
      display: -ms-flexbox;
      display: flex;
      -ms-flex-wrap: wrap;
      flex-direction: row;
  }

  .col {
      -ms-flex-preferred-size: 0;
      -ms-flex-positive: 1;
      padding-left: 10px;
      max-width: 100%;
  }

  .row1 {
      display: -ms-flexbox;
      display: flex;
      -ms-flex-wrap: wrap;
      flex-direction: row;
      flex-wrap: wrap;
      margin-right: 1px;
      margin-left: 0px;
  }

  .col1 {
      -ms-flex-preferred-size: 0;
      flex-basis: 0;
      -ms-flex-positive: 1;
      flex-grow: 1;
      max-width: 100%;
  }

  header {
      padding: 10px 0;
  }

  .header1 {
      padding: 1px 0;
      border-top: 1px solid #333;
      border-bottom: 1px solid #333;
  }

  #logo {
      float: left;
      margin-top: 8px;
  }

  #logo img {
      height: 70px;
  }

  #company {
      float: right;
      text-align: right;
  }

  #details {}

  #client {
      padding-left: 6px;
      float: left;
  }

  #client .to {
      color: #333;
  }

  h2.name {
      font-size: 1.4em;
      font-weight: 600;
      margin: 0;
  }

  #invoice {
      float: right;
      text-align: right;
  }

  #invoice h1 {
      color: #0087C3;
      font-size: 2.4em;
      line-height: 1em;
      font-weight: normal;
      margin: 0 0 10px 0;
  }

  #invoice .date {
      font-size: 1.1em;
      color: #000;
  }

  table {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
      margin-bottom: 5px;
  }

  table th,
  table th,
  table td {
      padding: 1px;
      vertical-align: middle;
      text-align: center;
      font-size: 13px;
      word-break: break-all;
  }

  table th {
      white-space: nowrap;
      font-weight: bold;
  }

  table td {
      text-align: left;
  }

  table td h3 {
      color: #000;
      font-size: 1em;
      font-weight: 600;
      margin: 0 0 0.2em 0;
  }

  table .no {
      color: #000;
  }

  table .desc {}

  table .total {
      color: #000;
      text-align: right;
  }

  table td.unit,
  table td.qty,
  table td.total {
      font-size: 1em;
      text-align: center
  }

  table tfoot td {
      background: #FFF;
      border-bottom: none;
      font-weight: 600;
      text-align: right;
      white-space: nowrap;
      margin-top: 100px;
  }

  table tfoot tr:first-child td {
      border-top: none;
  }

  table tfoot tr:last-child td {
      border-top: 1px solid #333;
  }

  .table1 tbody tr td,
  .table1 thead tr th {
      border: 1px solid #333;
      word-break: break-all;
  }

  #thanks {
      font-size: 2em;
      margin-bottom: 50px;
  }

  #notices {
      padding-left: 6px;
      border-left: 6px solid #0087C3;
  }

  #notices .notice {
      font-size: 1.2em;
  }

  footer {
      color: #000;
      width: 100%;
      height: 30px;
      position: absolute;
      bottom: 60px;
      border-top: 1px solid #AAA;
      padding: 8px 0;
      text-align: center;
  }

  .name-footer {
      text-align: left;
      margin: 0;
      font-size: 12px;
      padding-left: 10px;
  }

  .tbl_footer tr td {
      text-align: right;
  }

  .tbl_footer tr td.total {
      text-align: right;
      font-weight: 700;
  }

  .total_word {
      padding: 5px;
      border-top: 1px solid #333;
  }

  .bank_detail {
      border-right: 1px solid #333;
  }

  .trm_cond {
      color: #000;
      width: 100%;
      /* height: 30px; */
      position: absolute;
      bottom: 120px;
      border-top: 1px solid #AAA;
      padding: 8px 0;
      /* text-align: center; */
  }
    </style></head><body>`)
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

  getComboFor(transList) {
    const filtered = transList.filter((element) => element.IsMeasurment === 0)
    const object = _.groupBy(filtered, element => element.AttributeName)
    for (const key in object) {
      this.comboFor = (this.comboFor) ? this.comboFor + '-' + key : key
    }
  }

  defaultAttrName: string = ''
  comboFor: string = ''
  withoutAttr: boolean
  getItemCombos(combos, items) {
    let itemSArr = []
    const _self = this
    if (combos.length > 0) {
      _self.withoutAttr = false
      _.forEach(items, (element) => {
        let obj = {}
        _.forEach(combos, (trans) => {
          if (element.Id === trans.ItemTransId) {
            if (trans.IsMeasurment) {
              _self.defaultAttrName = trans.AttributeName
              obj['defaultAttrName'] = trans.AttributeValueName
              obj['itemName'] = element.ItemName
              obj['itemCode'] = element.ItemCode
              obj['Quantity'] = element.Quantity
              obj['date'] = element.PackingDate
              obj['Code'] = element.Code
              obj['ProductCode'] = element.ProductCode
              obj['ProductDescription'] = element.ProductDescription
            } else {
              // obj['attributeValueId'] = (obj['attributeValueId']) ? obj['attributeValueId'] + '-' + trans.AttributeValueId : trans.AttributeValueId
              obj['attributeValueName'] = (obj['attributeValueName']) ? obj['attributeValueName'] + '-' + trans.AttributeValueName : trans.AttributeValueName
            }
          }
        })
        itemSArr.push({...obj})
      })
      console.log({data: itemSArr})
      return itemSArr
    } else {
      _self.withoutAttr = true
      _.forEach(items, (element) => {
        let obj = {}
        obj['itemName'] = element.ItemName
        obj['itemCode'] = element.ItemCode
        obj['Quantity'] = element.Quantity
        obj['date'] = element.PackingDate
        obj['Code'] = element.Code
        obj['ProductCode'] = element.ProductCode
        obj['ProductDescription'] = element.ProductDescription
        itemSArr.push({...obj})
      })
      console.log({data: itemSArr})
      return itemSArr
    }
  }

  orgDetails: any = {}
  summary: any = {}
  ExcelHeaders: any = []
  getDataInExcel () {
    this.destroy$.push(this.buyerOrderService.getBuyerListOnSearch('').subscribe(data => {
      this.orgDetails ={
        ImageContents:data.ImageContents,
        AddressDetails:data.AddressDetails,
        OrganizationDetails:data.OrganizationDetails
      }
      this.summary = ["Total", "", "", "", "",
        data.BuyerOrderSummaryData[0].TotalOrderQty.toFixed(this.noOfDecimal),
        data.BuyerOrderSummaryData[0].TotalProductionQty.toFixed(this.noOfDecimal),
        data.BuyerOrderSummaryData[0].NetAmount.toFixed(this.noOfDecimal)]
        this.ExcelHeaders = ['Sno','BuyerCode','Buyer','OrderNo','OrderDate','OrderQty','ProductionQty','Amount']
        let datatoexport = []
        data.BuyerOrderInfos.forEach((element, index) => {
          element.OrderDate = this._gs.utcToClientDateFormat(element.OrderDate, this.clientDateFormat)
          datatoexport.push([
            index + 1,
            element['BuyerCode'],
            element['BuyerName'],
            element['OrderNo'],
            element['OrderDate'],
            element['TotalOrderQty'],
            element['TotalProductionQty'],
            element['NetAmount']
          ])
        })
        if(datatoexport.length > 0) {
          this.excelService.generateExcel(this.orgDetails.OrganizationDetails[0].OrgName,
          this.orgDetails.AddressDetails[0].CityName + ' ' + 
          this.orgDetails.AddressDetails[0].StateName + ' ' + 
          this.orgDetails.AddressDetails[0].CountryName, this.ExcelHeaders,
          datatoexport, 'Buyer Order Report',
          this._gs.utcToClientDateFormat(this.settings.finFromDate, this.clientDateFormat),
          this._gs.getDefaultDate(this.clientDateFormat) ,this.summary)
        }
      },
      (error) => {
        this.toastrService.showError(error, '')
      }))
    }
  // downloadSample (data) {
  //   let datatoexport = []
  //   data.forEach((element, index) => {
  //     datatoexport.push({
  //       Sno: index + 1,
  //       BuyerCode: element['BuyerCode'],
  //       Buyer: element['BuyerName'],
  //       OrderNo: element['OrderNo'],
  //       OrderDate: element['OrderDate'],
  //       OrderQty: element['TotalOrderQty'],
  //       ProductionQty: element['TotalProductionQty'],
  //       Amount: element['NetAmount']
  //     })
  //   })
  //   console.log('datatoexport : ', datatoexport)
  //   this.excelService.generateExcel(datatoexport, 'buyer_order_list')
  // }
}