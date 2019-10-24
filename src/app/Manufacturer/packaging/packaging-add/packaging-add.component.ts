import { Component, Input } from '@angular/core';
import { UIConstant } from '../../../shared/constants/ui-constant';
import * as _ from 'lodash';
import { PackagingService } from '../packaging.service';
import { ToastrCustomService } from '../../../commonServices/toastr.service';
import { GlobalService } from '../../../commonServices/global.service';
import { CommonService } from '../../../commonServices/commanmaster/common.services';
import { Settings } from '../../../shared/constants/settings.constant';
import { Subscription } from 'rxjs';
declare const $: any
@Component({
  selector: 'packaging-add',
  templateUrl: './packaging-add.component.html'
})
export class PackagingAddComponent {
  orderData: any
  previousPacketItems: any = []
  tempPacketItems: any = []
  masterData: any = {}
  editItemMode = false
  clientDateFormat = ''
  @Input() orderId: number
  loading: boolean = true
  disableBtnSubmit: boolean = false
  destroy$: Subscription
  constructor (private _ps: PackagingService,
    private _ts: ToastrCustomService,
    private _gs: GlobalService, private settings: Settings,
    private _cs: CommonService) {
      this.clientDateFormat = this.settings.dateFormat;
      this.destroy$ = this._ps.combos$.subscribe((data: any) => {
      if (data.data && data.data.length > 0) {
        this.masterData['itemData'] = data.data
        console.log('item data : ', this.masterData['itemData'])
      }
    })

    this.destroy$ = this._ps.previousPackets$.subscribe((data) => {
      if (data) {
        this.previousPacketItems = data
        this._cs.fixTableHF('previous-packets')
      }
    })
  }

  getOrderData () {
    this._ps.getItemList(this.orderId).subscribe(
      (data) => {
        if (!_.isEmpty(data)) {
          this.orderData = data
          this.loading = false
          console.log('packing order : ', this.orderData)
          this.setData(this.orderData)
        }
      },
      (error) => {
        console.log(error)
        this.loading = false
        this._ts.showErrorLong(error, '')
      }
    )
  }

  openModal() {
    $('#packaging').modal(UIConstant.MODEL_SHOW)
  }

  setData (data) {
    this.masterData['CurrentDate'] = this._gs.getDefaultDate(this.clientDateFormat)
    this.masterData['Date'] = this._gs.getDefaultDate(this.clientDateFormat)
    if (!_.isEmpty(data)) {
      this.masterData['isAttr'] = (data.ItemAttributesTransSnos.length > 0) ? true : false
      if (data.BuyerOrderDetails.length > 0) {
        this.masterData['OrderDate'] = data.BuyerOrderDetails[0].OrderDate
        this.masterData['BuyerName'] = data.BuyerOrderDetails[0].BuyerName
        this.masterData['StyleName'] = data.BuyerOrderDetails[0].StyleName
        this.masterData['BuyerCode'] = data.BuyerOrderDetails[0].BuyerCode
      }
      if (data.BuyerOrderTransInfos.length > 0) {
        this.masterData['Code'] = data.BuyerOrderTransInfos[0].Code
      }
      if (data.OrderPacketDetails.length > 0) {
        this._ps.createPreviousPackets(data.OrderPacketDetails)
      }
      if (data.BuyerOrderPacketDetails.length > 0 && data.ItemAttributesTransSnos && data.BuyerOrderDetails.length > 0) {
        this._ps.getItemCombos(data.ItemAttributesTransSnos, data.BuyerOrderPacketDetails, data.BuyerOrderDetails[0].Id)
      }
    }
  }

  validateItems () {
    const parseFor = (this.editItemMode) ? this.masterData['itemToEdit'] : this.masterData['itemData']
    let isValid = 1
    if (!this.masterData['Date']) {
      isValid = 0
    } else {
      let selected = []
      _.forEach(parseFor, (element) => {
        if (element.checked) selected.push(element)
        if (element.checked && +element.Quantity === 0) {
          isValid = 0
        }
      })
      if (isValid && selected.length === 0) {
        isValid = 0
      }
    }
    return !!isValid
  }

  tempAdd () {
    if (this.validateItems()) {
      const parseFor = (this.editItemMode) ? this.masterData['itemToEdit'] : this.masterData['itemData']
      let sno = 0
      let index = 0
      this.masterData['itemToPack'] = this.masterData['itemToPack'] || []
      if (this.masterData['itemToPack'].length === 0) {
        sno = 1
        index = 1
      } else {
        sno = this.masterData['itemToPack'][this.masterData['itemToPack'].length - 1].ItemTransId + 1
        index = this.masterData['itemToPack'][this.masterData['itemToPack'].length - 1].Sno + 1
      }
      _.forEach(parseFor, (element) => {
        if (element.checked) {
          element.Code = (!this.editItemMode) ? this.masterData['Code'] : element.Code,
          element.UnPackedQty = +element.UnPackedQty - +element.Quantity
          element.ItemTransId = sno
          element.checked = false
          element.Sno = index
          element['Date'] = (!this.editItemMode) ? this._gs.clientToSqlDateFormat(this.masterData['Date'], this.clientDateFormat) : element.Date
          this.masterData['itemToPack'].push(JSON.parse(JSON.stringify(element)))
          if (!this.editItemMode) element.Quantity = 0
          index++
        } else if (!element.checked && this.editItemMode) {
          let toUpdate = this.masterData['itemData'].filter(item => element.BOTransId === item.BOTransId)
          toUpdate[0].UnPackedQty = +element.UnPackedQty
        }
      })
      this.masterData['packets'] = this._ps.createPackets(this.masterData['itemToPack'])
      this._cs.fixTableHF('new-packets')
      console.log('itemtopack: ', this.masterData['itemToPack'])
      this.refreshSnos()
      this.updateUnpackedQty()
      if (this.editItemMode) {
        this.editItemMode = false
        this.masterData['itemToEdit'] = null
      } else {
        this.getPCode()
      }
    }
  }

  refreshSnos () {
    _.forEach(this.masterData['itemData'], (element, index) => {
      element.Sno = index + 1
    })
  }

  updateUnpackedQty () {
    _.forEach(this.masterData['itemToPack'], (element) => {
      _.forEach(this.masterData['itemData'], (item) => {
        if (element.BOTransId === item.BOTransId) {
          item.UnPackedQty = element.UnPackedQty
        }
      })
    })
  }

  editItem (items, index) {
    if (!this.editItemMode) {
      this.editItemMode = true
      items.forEach((item) => {
        item['UnPackedQty'] = +item['UnPackedQty'] + +item['Quantity']
        item.checked = true
      })
      this.masterData['itemToEdit'] = items
      console.log(this.masterData['itemToEdit'])
      this.masterData['packets'].splice(index, 1)
      this.updateItems()
    }
  }

  deleteItem (items, index) {
    items.forEach((element) => {
      const item = this.masterData['itemData'].find((item) => element.BOTransId === item.BOTransId)
      item.UnPackedQty = +item.UnPackedQty + +element.Quantity
    })
    _.forEach(this.masterData['itemToPack'], (element) => {
      _.forEach(this.masterData['itemData'], (item) => {
        if (element.BOTransId === item.BOTransId) {
          element.UnPackedQty = item.UnPackedQty
        }
      })
    })
    this.masterData['packets'].splice(index, 1)
    this.updateUnpackedQty()
    this.updateItems()
  }

  updateItems() {
    this.masterData['itemToPack'] = []
    this.masterData['packets'].forEach(packet => {
      this.masterData['itemToPack'] = this.masterData['itemToPack'].concat(packet.packets)
    })
    console.log(this.masterData['itemToPack'])
  }

  getPCode () {
    this._ps.getPCode().subscribe(
      (data) => {
        console.log(data)
        if (data) {
          this.masterData['Code'] = data
        }
      },
      (error) => {
        this._ts.showError(error, '')
      }
    )
  }

  preparePayload () {
    let obj = {
      OrderPacketDetails: this.masterData['itemToPack']
    }
    console.log(JSON.stringify(obj))
    return obj
  }

  postData () {
    if (this.masterData['packets'] && this.masterData['packets'].length > 0) {
      this.disableBtnSubmit = true
      this._ps.postData(this.preparePayload()).subscribe(
        (data) => {
          console.log('post : ', data)
          this.disableBtnSubmit = false
          this._ts.showSuccess('Successfully added package', '')
          this.closeModal()
        },
        (error) => {
          this.disableBtnSubmit = false
          console.log(error)
          this._ts.showError(error, '')
        }
      )
    }
  }

  closeModal() {
    this.resetForm()
    $('#packaging').modal(UIConstant.MODEL_HIDE)
  }

  resetForm () {
    this.orderData = []
    this.previousPacketItems = []
    this.masterData = {}
    this.editItemMode = false
    this.loading = true
  }

  ngOnDestroy(): void {
    this.destroy$.unsubscribe()
  }
}