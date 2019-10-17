import { Component, Input } from '@angular/core';
import { UIConstant } from '../../../shared/constants/ui-constant';
import * as _ from 'lodash';
import { PackagingService } from '../packaging.service';
import { ToastrCustomService } from '../../../commonServices/toastr.service';
import { GlobalService } from '../../../commonServices/global.service';
import { CommonService } from '../../../commonServices/commanmaster/common.services';
import { Settings } from '../../../shared/constants/settings.constant';
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
  constructor (private _ps: PackagingService,
    private _ts: ToastrCustomService,
    private _gs: GlobalService, private settings: Settings,
    private _cs: CommonService) {
      this.clientDateFormat = this.settings.dateFormat;
    this._ps.combos$.subscribe((data: any) => {
      if (data.data && data.data.length > 0) {
        this.masterData['itemData'] = data.data
        console.log('item data : ', this.masterData['itemData'])
      }
    })
  }

  getOrderData () {
    this._ps.getItemList(this.orderId).subscribe(
      (data) => {
        if (!_.isEmpty(data)) {
          this.orderData = data
          console.log('packing order : ', this.orderData)
          this.setData(this.orderData)
        }
      },
      (error) => {
        console.log(error)
        this._ts.showErrorLong(error, '')
      }
    )
  }

  openModal() {
    $('#packaging').modal(UIConstant.MODEL_SHOW)
  }

  setData (data) {
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
        this.previousPacketItems = data.OrderPacketDetails
        this._cs.fixTableHF('previous-packets')
      }
      if (data.BuyerOrderPacketDetails.length > 0 && data.ItemAttributesTransSnos && data.BuyerOrderDetails.length > 0) {
        this._ps.getItemCombos(data.ItemAttributesTransSnos, data.BuyerOrderPacketDetails, data.BuyerOrderDetails[0].Id)
      }
    }
  }

  validateItems () {
    if (!this.editItemMode) {
      let isValid = 1
      _.forEach(this.masterData['itemData'], (element) => {
        if (element.checked && +element.Quantity === 0) {
          isValid = 0
        }
      })
      return !!isValid
    } else {
      return (this.masterData['itemToEdit']['Quantity'] > 0) ? true : false
    }
  }

  tempAdd () {
    if (this.validateItems()) {
      if (!this.editItemMode) {
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
        _.forEach(this.masterData['itemData'], (element) => {
          if (element.checked) {
            element.Code = this.masterData['Code'],
            element.ItemTransId = sno
            element.UnPackedQty = +element.UnPackedQty - +element.Quantity
            element.checked = false
            element.Sno = index
            element['Date'] = this._gs.clientToSqlDateFormat(this._gs.getDefaultDate(this.clientDateFormat), this.clientDateFormat)
            this.masterData['itemToPack'].push(JSON.parse(JSON.stringify(element)))
            element.Quantity = 0
            index++
          }
        })
        this._cs.fixTableHF('new-packets')
        console.log('itemtopack: ', this.masterData['itemToPack'])
        this.getPCode()
      } else {
        //  && element.Code === this.masterData['itemToEdit']['Code']
        _.forEach(this.masterData['itemData'], (element) => {
          if (element.BOTransId === this.masterData['itemToEdit']['BOTransId']) {
            element.UnPackedQty = +this.masterData['itemToEdit'].UnPackedQty - +this.masterData['itemToEdit'].Quantity
            console.log(element.UnPackedQty)
          }
        })
        this.editItemMode = false
        this.masterData['itemToEdit'] = null
      }
      this.updateUnpackedQty()
    }
  } 

  updateUnpackedQty () {
    _.forEach(this.masterData['itemToPack'], (element) => {
      _.forEach(this.masterData['itemData'], (item) => {
        if (element.BOTransId === item.BOTransId) {
          element.UnPackedQty = item.UnPackedQty
        }
      })
    })
  }

  deleteItem (item) {
    for (let i = 0; i < this.masterData['itemData'].length; i++) {
      const element = this.masterData['itemData'][i];
      if (element.BOTransId === item['BOTransId']) {
        element.UnPackedQty = +element.UnPackedQty + +item.Quantity
        break;
      }
    }
    for (let i = 0; i < this.masterData['itemToPack'].length; i++) {
      const element = this.masterData['itemToPack'][i];
      if (element.BOTransId === item['BOTransId'] && element.Code === item['Code']) {
        // element.UnPackedQty =+ element.UnPackedQty + +element.Quantity
        this.masterData['itemToPack'].splice(i, 1)
        break;
      }
    }
    this.updateUnpackedQty()
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

  editItem (item) {
    this.editItemMode = true
    this.masterData['itemToEdit'] = item
    this.masterData['itemToEdit']['UnPackedQty'] = +this.masterData['itemToEdit']['UnPackedQty'] + +this.masterData['itemToEdit']['Quantity']
    console.log(this.masterData['itemToEdit'])
  }

  preparePayload () {
    let obj = {
      OrderPacketDetails: this.masterData['itemToPack']
    }
    console.log(JSON.stringify(obj))
    return obj
  }

  postData () {
    this._ps.postData(this.preparePayload()).subscribe(
      (data) => {
        console.log('post : ', data)
        this._ts.showSuccess('Successfully added package', '')
        this.closeModal()
      },
      (error) => {
        console.log(error)
        this._ts.showError(error, '')
      }
    )
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
  }
}