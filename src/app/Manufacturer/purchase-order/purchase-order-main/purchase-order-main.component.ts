import { Component, ViewChild } from "@angular/core";
import { PurchaseOrderService } from '../purchase-order.service';
import { ToastrCustomService } from '../../../commonServices/toastr.service';
import { Settings } from '../../../shared/constants/settings.constant';
import { CommonService } from '../../../commonServices/commanmaster/common.services';
import { Subscription } from "rxjs";
import { GlobalService } from '../../../commonServices/global.service';
import { ExcelService } from '../../../commonServices/excel.service';
import { ManufacturingService } from '../../manufacturing.service';
import { POApprovalComponent } from '../po-approval/po-approval.component';
import { PoPurchaseComponent } from '../PO-Purchase/po-purchase.component';
declare const window: any;
@Component({
  selector: 'purchase-order-main',
  templateUrl: './purchase-order-main.component.html'
})
export class PurchaseOrderMainComponent {
  p: number = 1
  itemsPerPage: number = 20
  total: number = 0
  lastItemIndex: number = 0
  poData: any = []
  clientDateFormat = ''
  queryStr: string = ''
  summary: any = []
  destroy$: Subscription[] = []
  @ViewChild('poApprovalModal') poApprovalModal: POApprovalComponent
  constructor (private _po: PurchaseOrderService, private _ts: ToastrCustomService,
    private settings: Settings, private _cs: CommonService, private _gs: GlobalService,
    private excelService: ExcelService) {
    console.log(window.navigator.onLine)
    this.clientDateFormat = this.settings.dateFormat
    this.getPOList()
    this.destroy$.push(this._po.poAdded$.subscribe(() => {
      this.getPOList()
    }))
    this.destroy$.push(this._po.queryStr$.subscribe(
      (str) => {
        console.log(str)
        this.queryStr = str
        this.p = 1
        this.getPOList()
      }
    ))
    this.destroy$.push(this._cs.getDeleteStatus().subscribe(
      (obj) => {
        if (obj.id && obj.type && obj.type === 'purchaseorder') {
          this.deleteItem(obj.id)
        }
      }
    ))
  }

  getPOList () {
    this.destroy$.push(this._po.listPO('?Page=' + this.p + '&Size=' + this.itemsPerPage + this.queryStr).subscribe((data) => {
      console.log(data)
      this.poData = data.PurchaseOrders
      this.total = this.poData[0].TotalRows
      this.summary = data.PurchaseOrderSummarys[0]
    },
    (error) => {
      this._ts.showError(error, '')
    }))
  }

  orgDetails: any = {}
  summary1: any = {}
  ExcelHeaders: any = []
  getDataInExcel () {
    this.destroy$.push(this._po.listPO('').subscribe(data => {
      this.orgDetails ={
        ImageContents:data.ImageContents,
        AddressDetails:data.AddressDetails,
        OrganizationDetails:data.OrganizationDetails
      }
      this.summary1 = ["Total", "", "", "", "", "", data.PurchaseOrderSummarys[0].TotalAmount]
        this.ExcelHeaders = [
          'Sno.','Ledger Name','PO No.','PoDate','Expected Delivery Date','Remark','Amount'
        ]
        let datatoexport = []
        data.PurchaseOrders.forEach((element, index) => {
          element.PoDate = this._gs.utcToClientDateFormat(element.PoDate, this.clientDateFormat)
          element.ExDeliveryFromDate = this._gs.utcToClientDateFormat(element.ExDeliveryFromDate, this.clientDateFormat)
          element.ExDeliveryToDate = this._gs.utcToClientDateFormat(element.ExDeliveryToDate, this.clientDateFormat)
          datatoexport.push([
            index + 1,
            element['LedgerName'],
            element['PoNo'],
            element['PoDate'],
            element['ExDeliveryFromDate'] + ' - ' + element['ExDeliveryToDate'],
            element['Remark'],
            element['TotalAmount']
          ])
        })
        console.log(datatoexport)
        if(datatoexport.length > 0) {
          this.excelService.generateExcel(this.orgDetails.OrganizationDetails[0].OrgName,
          this.orgDetails.AddressDetails[0].CityName + ' ' + 
          this.orgDetails.AddressDetails[0].StateName + ' ' + 
          this.orgDetails.AddressDetails[0].CountryName, this.ExcelHeaders,
          datatoexport, 'Purchase Order Report',
          this._gs.utcToClientDateFormat(this.settings.finFromDate, this.clientDateFormat),
          this._gs.getDefaultDate(this.clientDateFormat) ,this.summary1)
        }
      },
      (error) => {
        this._ts.showError(error, '')
      }))
    }


  openPO (id?) {
    if (id) {
      this._po.openPO(id)
    } else {
      this._po.openPO('')
    }
  }

  toShowSearch = false
  toggleSearch() {
    this.toShowSearch = !this.toShowSearch
  }

  delete(id) {
    this._cs.openDelete(id, 'purchaseorder', 'Purchase Order')
  }

  deleteItem (id) {
    if (id) {
      this.destroy$.push(this._po.deletePO(id).subscribe((data) => {
        this._ts.showSuccess('', 'Deleted Successfully')
        this._cs.closeDelete('')
        this.getPOList()
      },
      (error) => {
        this._ts.showErrorLong('', error)
        this._cs.closeDelete('')
      }))
    }
  }

  approveQty(id) {
    // this._po.openPOApproval(id)
    this.poApprovalModal.getPOItems(id)
  }

  disableBtn: boolean = true
  poId: string | number
  activatePurchaseBtn () {
    let active = 0
    let selected = this.poData
      .filter((element) => element.checked)
      .map((element) => {
        return { ledgerId: element.LedgerId, boId: element.ParentId }
      })
    console.log(selected)
    if (selected.length > 1) {
      for (let i = 0; i < selected.length; i++) {
        if (i <= (selected.length - 2) && typeof selected[i+1]['ledgerId'] !== 'undefined' && 
          typeof selected[i+1]['boId'] !== 'undefined' && 
          selected[i]['ledgerId'] !== selected[i+1]['ledgerId'] && 
          selected[i]['boId'] !== selected[i+1]['boId']) {
          active = 1
          break;
        }
      }
      if (selected.length > 0 && active === 1) {
        this._ts.showError('Please select Packet belonging to same Buyer Order and Vendor', '')
      }
      if (!active) {
        const poId = (this.poData
        .filter((element) => element.checked).map((element) => {
          return element.Id
        })).join(',')
        this.poId = poId
        console.log(poId)
      }
    } else {
      active = 0
      const poId = this.poData.filter((element) => element.checked)
      this.poId = poId[0].Id
      console.log(poId[0].Id)
    }
    this.disableBtn = !!active
  }

  @ViewChild('poPurchaseModal') poPurchaseModal: PoPurchaseComponent
  generatePurchase() {
    this.poPurchaseModal.openModal(this.poId)
  }

  ngOnDestroy() {
    if (this.destroy$ && this.destroy$.length > 0) {
      this.destroy$.forEach((element) => element.unsubscribe())
    }
  }
}