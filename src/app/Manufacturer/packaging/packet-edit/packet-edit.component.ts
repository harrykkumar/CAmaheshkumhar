import { Component, Input, ViewChild } from '@angular/core';
import { UIConstant } from '../../../shared/constants/ui-constant';
import * as _ from 'lodash';
import { PackagingService } from '../packaging.service';
import { ToastrCustomService } from '../../../commonServices/toastr.service';
import { GlobalService } from '../../../commonServices/global.service';
import { Settings } from '../../../shared/constants/settings.constant';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { AddCust } from '../../../model/sales-tracker.model';
declare const $: any
@Component({
  selector: 'packaging-edit',
  templateUrl: './packet-edit.component.html'
})
export class PackagingEditComponent {
  orderData: any
  previousPacketItems: any = []
  tempPacketItems: any = []
  masterData: any = {}
  editItemMode = false
  clientDateFormat = ''
  @Input() orderId: number
  loading: boolean = true
  disableBtnSubmit: boolean = false
  destroy$: Subscription[] = []
  orderPacketId: number = 0
  @ViewChild('packingModelForm') packingModelForm: NgForm;
  constructor (private _ps: PackagingService,
    private _ts: ToastrCustomService,
    private _gs: GlobalService, private settings: Settings) {
    this.clientDateFormat = this.settings.dateFormat;
    this.destroy$.push(this._ps.openEditOP$.subscribe((data: AddCust) => {
      if (data.open) {
        this.openModal();
        if (+data.editId > 0) {
          this.loading = true
          this.getEditData(+data.editId)
        }
      } else {
        this.closeModal()
      }
    }))
    // this.getSetUpModules((JSON.parse(this.settings.moduleSettings).settings))
    this.destroy$.push(this._ps.combos$.subscribe((data: any) => {
      if (data.data && data.data.length > 0) {
        this.masterData['itemData'] = data.data
        console.log('item data : ', this.masterData['itemData'])
      }
    }))
  }

  getEditData(id) {
    this.destroy$.push(this._ps.editOP(id).subscribe((data) => {
      console.log('edit data : ', data)
      this.loading = false
      this.setData(data)
    },
    (error) => {
      this.loading = false
      this._ts.showErrorLong(error, '')
    }))
  }

  openModal() {
    $('#packaging-edit').modal(UIConstant.MODEL_SHOW)
  }

  bOrderId: number = 0
  setData (data) {
    console.log(data)
    this.defaultAttrName = ''
    this.comboFor = ''
    if (!_.isEmpty(data)) {
      this.masterData['isAttr'] = (data.ItemAttributesTrans.length > 0) ? true : false
      if (data.OrderPackets.length > 0) {
        this.masterData['Code'] = data.OrderPackets[0].Code
        this.masterData['Date'] = this._gs.utcToClientDateFormat(data.OrderPackets[0].PackingDate, this.clientDateFormat)
        this.masterData['CurrentDate'] = this._gs.utcToClientDateFormat(data.OrderPackets[0].PackingDate, this.clientDateFormat)
        this.masterData['OrderDate'] = this._gs.utcToClientDateFormat(data.OrderPackets[0].OrderDate, this.clientDateFormat)
        this.masterData['BuyerName'] = data.OrderPackets[0].BuyerName
        this.masterData['BuyerCode'] = data.OrderPackets[0].BuyerCode
        this.masterData['Length'] = data.OrderPackets[0].Length
        this.masterData['Width'] = data.OrderPackets[0].Width
        this.masterData['Height'] = data.OrderPackets[0].Height
        this.masterData['NetWeight'] = data.OrderPackets[0].NetWeight
      }
      if (data.BuyerOrderPacketDetails.length > 0 && data.ItemAttributesTrans && data.OrderPackets.length > 0 && data.OrderPacketDetails.length > 0) {
        this.bOrderId = data.OrderPackets[0].Id
        this.orderPacketId = data.OrderPackets[0].BorderId
        this._ps.getItemCombos1(data.ItemAttributesTrans, data.BuyerOrderPacketDetails, data.OrderPackets[0].Id, data.OrderPacketDetails)
      }
      if (data.ItemAttributesTrans.length > 0) {
        this.getComboFor(data.ItemAttributesTrans)
      }
    }
    console.log(this.masterData)
  }

  validateItems () {
    this.checkForFocus()
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

  refreshSnos () {
    _.forEach(this.masterData['itemData'], (element, index) => {
      element.Sno = index + 1
    })
  }

  preparePayload () {
    let itemToPack = []
    let index = 1
    _.forEach(this.masterData['itemData'], (element) => {
      if (element.checked) {
        element.UnPackedQty = +element.UnPackedQty - +element.Quantity
        element.Sno = index
        element['Date'] = this._gs.clientToSqlDateFormat(this.masterData['Date'], this.clientDateFormat)
        itemToPack.push(JSON.parse(JSON.stringify(element)))
        index++
      }
    })
    let obj = {
      Length: (+this.masterData.Length > 0) ? +this.masterData.Length : 0,
      Height: (+this.masterData.Height > 0) ? +this.masterData.Height : 0,
      Width: (+this.masterData.Width > 0) ? +this.masterData.Height : 0,
      NetWeight: (+this.masterData.NetWeight > 0) ? +this.masterData.NetWeight : 0,
      BorderId: this.orderPacketId,
      OrderDate: this._gs.clientToSqlDateFormat(this.masterData['OrderDate'], this.clientDateFormat),
      OrderPacketDetails: itemToPack
    }
    console.log(JSON.stringify(obj))
    return obj
  }

  postData () {
    const data = this.preparePayload()
    if (data.OrderPacketDetails.length > 0) {
      this.disableBtnSubmit = true
      this.destroy$.push(this._ps.postData(data).subscribe(
        (data) => {
          console.log('post : ', data)
          this.disableBtnSubmit = false
          this._ts.showSuccess('Successfully added package', '')
          this._ps.onEditUpdate()
          this.closeModal()
        },
        (error) => {
          this.disableBtnSubmit = false
          console.log(error)
          this._ts.showError(error, '')
        }
      ))
    } else {
      this._ts.showErrorLong('Atleast Select 1 Item to Save', '')
    }
  }

  toggleSelect (val: boolean) {
    this.masterData.itemData.forEach((element) => {
      element['checked'] = val
    })
  }

  closeModal(packagingForm?) {
    this.resetForm()
    $('#packaging-edit').modal(UIConstant.MODEL_HIDE)
  }

  close() {
    this._ps.closeEditOP()
  }

  resetForm () {
    this.orderData = []
    this.previousPacketItems = []
    this.masterData = {}
    this.editItemMode = false
    this.loading = true
  }

  ngOnDestroy () {
    if (this.destroy$ && this.destroy$.length > 0) {
      this.destroy$.forEach((element) => element.unsubscribe())
    }
  }

  checkForFocus () {
    setTimeout(() => {
      $(".errorSelecto:first").focus()
    }, 10)
  }

  defaultAttrName: string = ''
  comboFor: string = ''
  getComboFor(transList) {
    const defaultAttr = transList.filter((element) => element.IsMeasurment === 1)
    // console.log(defaultAttr)
    this.defaultAttrName = defaultAttr[0].AttributeName
    const filtered = transList.filter((element) => element.IsMeasurment === 0)
    const object = _.groupBy(filtered, element => element.AttributeName)
    for (const key in object) {
      this.comboFor = (this.comboFor) ? this.comboFor + ' - ' + key : key
    }
    // console.log(this.comboFor, this.defaultAttrName)
  }
}