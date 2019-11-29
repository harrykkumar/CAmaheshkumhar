import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { PackagingService } from '../packaging.service';
import { ToastrCustomService } from '../../../commonServices/toastr.service';
import { Settings } from '../../../shared/constants/settings.constant';
import { Subscription } from 'rxjs/Subscription';
import { CommonService } from '../../../commonServices/commanmaster/common.services';
import { UIConstant } from '../../../shared/constants/ui-constant';
import * as _ from 'lodash';
import { ManufacturingService } from '../../manufacturing.service';
declare const $: any;
@Component({
  selector: 'packaging-main',
  templateUrl: './packaging-main.component.html'
})
export class PackagingMainComponent {
  packetLists: Array<any> = []
  clientDateFormat = ''
  disableBtn = true
  orderPacketId: string = ''
  bOrderId: number = 0
  destroy$: Subscription[] = []
  queryStr: string = ''
  p: number = 1
  itemsPerPage: number = 20
  total: number = 0
  lastItemIndex: number = 0
  isSearching: boolean = true
  @ViewChild('packagingaddcontainer', { read: ViewContainerRef }) entry: ViewContainerRef;
  constructor (private _ps: PackagingService, private _ts: ToastrCustomService, private _ms: ManufacturingService,
    private settings: Settings, private _cs: CommonService, private resolver: ComponentFactoryResolver) {
    this.clientDateFormat = this.settings.dateFormat;
    this.destroy$.push(this._ps.challanAdded$.subscribe(() => {
      this.getPacketsList()
    }))
    this.destroy$.push(this._ps.queryStr$.subscribe(
      (str) => {
        console.log(str)
        this.queryStr = str
        this.p = 1
        this.getPacketsList()
      }
    ))
    this.destroy$.push(this._cs.getDeleteStatus().subscribe(
      (obj) => {
        if (obj.id && obj.type && obj.type === 'packeting') {
          this.deleteItem(obj.id)
        }
      }
    ))

    this.destroy$.push(this._ps.editUpdate$.subscribe(() => {
      this.getPacketsList()
    }))
  }

  editOP(id) {
    this._ps.openEditOP(id)
  }

  ngOnInit () {
    this.getPacketsList()
  }

  ngAfterViewInit () {
    this._cs.fixTableHF('packaging-table')
  }

  getPacketsList () {
    this.isSearching = true
    this.destroy$.push(this._ps.getPacketsList('?Page=' + this.p + '&Size=' + this.itemsPerPage + this.queryStr).subscribe(
      (data) => {
        this.isSearching = false
        this.packetLists = data
        this.total = this.packetLists[0].TotalRows
        this.packetLists.forEach((element) => {
          element['checked'] = false
        })
      },
      (error) => {
        this.isSearching = false
        console.log(error)
        this._ts.showError(error, '')
      }
    ))
  }

  activateChallanBtn () {
    let active = 0
    let selected = this.packetLists
      .filter((element) => element.checked)
      .map((element) => {
        return element.OrderPacketId
      })
    for (let i = 0; i < selected.length; i++) {
      if (typeof selected[i+1] !== 'undefined' && selected[i] !== selected[i+1]) {
        active = 1
        break;
      }
    }
    if (selected.length > 0 && active === 1) {
      this._ts.showError('Please select Packet belonging to same Buyer Order', '')
    }
    if (!active) {
      this.orderPacketId = (this.packetLists
      .filter((element) => element.checked).map((element) => {
        return element.Id
      })).join(',')
      this.bOrderId = selected[0]
    }
    this.disableBtn = !!active
  }

  generateChallan () {
    this._ps.openChallan({bOrderId: this.bOrderId, orderStr: this.orderPacketId})
  }

  toShowSearch = false
  toggleSearch() {
    this.toShowSearch = !this.toShowSearch
  }

  orgImage: string
  printData: any
  ItemTransactionactions: any;
  TermsConditions: any;
  Clientinfos: any = []
  AddressDetailsOrg: any = []
  AddressDetails: any = []
  EmailsOrg: any = []
  ContactInfosOrg: any = []
  Websites: any = []
  OrderPackets: any = []
  print(id, htmlID) {
    const _self = this
    this.destroy$.push(this._ps.printInvoice(id).subscribe((data) => {
      console.log(data)
      this.defaultAttrName = ''
      this.comboFor = ''
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
      this._ts.showErrorLong(error, '')
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
  
  delete(id) {
    this._cs.openDelete(id, 'packeting', 'Packet Order')
  }

  deleteItem (id) {
    if (id) {
      this.destroy$.push(this._ps.deletePacketOrder(id).subscribe((data) => {
        this._ts.showSuccess('', 'Deleted Successfully')
        this._cs.closeDelete('')
        this.getPacketsList()
      },
      (error) => {
        this._ts.showErrorLong('', error)
        this._cs.closeDelete('')
      }))
    }
  }

  ngOnDestroy () {
    if (this.destroy$ && this.destroy$.length > 0) {
      this.destroy$.forEach((element) => element.unsubscribe())
    }
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
}