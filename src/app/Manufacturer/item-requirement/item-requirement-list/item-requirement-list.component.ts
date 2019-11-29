import { Settings } from './../../../shared/constants/settings.constant';
import { ItemRequirementComponent } from './../item-requirement/item-requirement.component';
import { ToastrCustomService } from './../../../commonServices/toastr.service';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ItemRequirementService } from '../item-requirement.service';
import * as _ from 'lodash'
import { GlobalService } from 'src/app/commonServices/global.service';
import { UIConstant } from '../../../shared/constants/ui-constant';
import { SetUpIds } from '../../../shared/constants/setupIds.constant';
declare const $: any
@Component({
  selector: 'app-item-requirement-list',
  templateUrl: './item-requirement-list.component.html',
  styleUrls: ['./item-requirement-list.component.css']
})
export class ItemRequirementListComponent implements OnInit, OnDestroy {
  @ViewChild('addItemRequirementRef') addItemRequirementRef: ItemRequirementComponent
  model: any ={}
  p: number = 1
  itemsPerPage: number = 20
  total: number = 0
  lastItemIndex: number = 0
  itemRequirementListData: Array<any> = []
  clientDateFormat: string = ''
  disableBtnSubmit = false
  private destroy$: Subscription[] = []
  queryStr: string = ''
  noOfDecimal = 2
  constructor( private _irs: ItemRequirementService,
    public _commonService: CommonService,
    private _toastService: ToastrCustomService,
    private gs: GlobalService,
    private _settings: Settings
    ) {
      let settings = JSON.parse(this._settings.moduleSettings).settings
      let setting = settings.filter((setting) => setting.id === SetUpIds.noOfDecimalPoint)
      if (setting.length === 1) {
        this.noOfDecimal = setting[0].val
      }
      this.clientDateFormat = this._settings.dateFormat
      this.destroy$.push(this._irs.formReady$.subscribe(() => {
        this.disableBtnSubmit = false
      }))
      this.destroy$.push(this._irs.queryStr$.subscribe(
        (str) => {
          // console.log(str)
          this.queryStr = str
          this.p = 1
          this.getItemRequirementListData()
        }
      ))
      this.destroy$.push(this._commonService.getDeleteStatus().subscribe(
        (obj) => {
          if (obj.id && obj.type && obj.type === 'material') {
            this.deleteItem(obj.id)
          }
        }
      ))
    }
  ngOnInit() {
    this.getItemRequirementListData()
  }

  getItemRequirementListData = () => {
    this.destroy$.push(this._irs.getItemRequirementData(`?Page=${this.p}&Size=${this.itemsPerPage}${this.queryStr}`).subscribe((data) => {
      // console.log('list : ', data)
      this.itemRequirementListData = data
      this.total = this.itemRequirementListData[0].TotalRows
    },
    (error) => {
      this._toastService.showError(error, '')
    },
    () => {
      this._commonService.fixTableHF('req-table')
    }))
  }

  ngOnDestroy() {
    if (this.destroy$ && this.destroy$.length > 0){
      this.destroy$.forEach(subscription => subscription.unsubscribe())
    }
  }

  addItemRequirement(item?){
    this.disableBtnSubmit = true
    this.addItemRequirementRef.openModal(item);
  }
  
  onModalClosed(event){
    this.getItemRequirementListData()
  }

  toShowSearch = false
  toggleSearch() {
    this.toShowSearch = !this.toShowSearch
  }

  delete(id) {
    this._commonService.openDelete(id, 'material', 'Material Requirement / Item-Costing')
  }

  deleteItem (id) {
    if (id) {
      let item: any = {}
      item.ParentTypeId = 32
      item.ReqNo = id
      this.destroy$.push(this.gs.manipulateResponse(this._irs.deleteItemRequirement(item)).subscribe((res) => {
        this._toastService.showSuccess('', 'Deleted Successfully')
        this.getItemRequirementListData()
      },
      (error) => {
        this._toastService.showError('', error)
      }))
    }
  }

  editItemReq (id) {
    this.destroy$.push(this._irs.editItemReq(id).subscribe((data) => {
      // console.log(data)
      this.addItemRequirement(data)
    },
    (error) => {
      this._toastService.showErrorLong(error, '')
    }))
  }

  printData: any = {}
  TermsConditions: any = []
  orgImage: string = ''
  ItemTransactionactions: any = []
  Clientinfos: any = []
  AddressDetails: any = []
  EmailsOrg: any = []
  ContactInfosOrg: any = []
  Websites: any = []
  ItemRequirement: any = []
  print(id, htmlID) {
    const _self = this
    this.destroy$.push(this._irs.printInvoice(id).subscribe((data) => {
      // console.log(data)
      _self.ItemTransactionactions = this.getItems(data.itemAttributesTrans, data.ItemRequirementDetails)
      _self.orgImage = (data.ImageContents && data.ImageContents.length > 0) ? data.ImageContents[0].FilePath : ''
      _self.TermsConditions = data.TermsConditions
      _self.Clientinfos = data.Clientinfos
      _self.AddressDetails = data.AddressDetails
      _self.EmailsOrg = data.EmailDetails
      _self.ContactInfosOrg = data.ContactInfoDetails
      _self.Websites = data.Websites
      _self.ItemRequirement = data.ItemRequirement
      _self.printData = data
      // console.log(_self.printData)
      setTimeout(function () {
        _self.printInvoice(htmlID,false)
      }, 1000)
    },
    (error) => {
      this._toastService.showErrorLong(error, '')
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
      flex-wrap: wrap;
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

  defaultAttrName: string = ''
  withoutAttr: boolean
  totalCost: number = 0
  getItems(AttributeList, items) {
    let itemSArr = []
    const _self = this
    if (AttributeList.length > 0) {
      AttributeList = AttributeList.filter((element => element.IsMeasurment === 1))
      this.withoutAttr = false
      _.forEach(AttributeList, (trans) => {
        let obj = {}
        _.forEach(items, (element) => {
          if (element.Id === trans.ItemTransId) {
            _self.defaultAttrName = trans.AttributeName
            obj['defaultAttrName'] = trans.AttributeValueName
            obj['itemName'] = element.ItemName
            obj['itemProcessName'] = element.ItemProcessName
            obj['Quantity'] = element.Qty
            obj['unitName'] = element.UnitName
            obj['rate'] = element.Rate
            obj['Fold'] = element.Fold
            obj['Shrinkage'] = element.Shrinkage
            obj['Addition'] = element.Addition
            obj['instructionName'] = element.InstructionName
            obj['Amount'] = (+element.Rate * +element.Qty)
            _self.totalCost += obj['Amount']
          }
        })
        itemSArr.push({...obj})
      })
      // console.log(itemSArr)
      return itemSArr
    } else {
      this.withoutAttr = true
      _.forEach(items, (element) => {
        let obj = {}
        obj['itemName'] = element.ItemName
        obj['itemProcessName'] = element.ItemProcessName
        obj['Quantity'] = element.Qty
        obj['unitName'] = element.UnitName
        obj['rate'] = element.Rate
        obj['Fold'] = element.Fold
        obj['Shrinkage'] = element.Shrinkage
        obj['Addition'] = element.Addition
        obj['instructionName'] = element.InstructionName
        obj['Amount'] = element.Amount
        _self.totalCost += obj['Amount']
        itemSArr.push({...obj})
      })
      // console.log(itemSArr)
      return itemSArr
    }
  }
}
