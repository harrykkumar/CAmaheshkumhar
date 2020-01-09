import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { UIConstant } from '../../../shared/constants/ui-constant';
import * as _ from 'lodash';
import { PackagingService } from '../packaging.service';
import { ToastrCustomService } from '../../../commonServices/toastr.service';
import { GlobalService } from '../../../commonServices/global.service';
import { CommonService } from '../../../commonServices/commanmaster/common.services';
import { Settings } from '../../../shared/constants/settings.constant';
import { Subscription, fromEvent } from 'rxjs';
import { NgForm } from '@angular/forms';
import { SetUpIds } from '../../../shared/constants/setupIds.constant';
import { map } from 'rxjs/internal/operators/map';
import { filter } from 'rxjs/internal/operators';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AddCust } from '../../../model/sales-tracker.model';
import { ManufacturingService } from '../../manufacturing.service';
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
  destroy$: Subscription[] = []
  isAddNew: boolean
  @ViewChild('packingModelForm') packingModelForm: NgForm;
  constructor (private _ps: PackagingService,
    private _ts: ToastrCustomService,
    private _gs: GlobalService, private settings: Settings,
    private _ms: ManufacturingService,
    private _cs: CommonService) {
      this.clientDateFormat = this.settings.dateFormat;
      this.destroy$.push(this._ms.openOP$.subscribe((data: AddCust) => {
        if (data.open) {
          this.resetForm()
          if (+data.id > 0) {
            this.isAddNew = false
            this.orderId = data.id
            this.getOrderData();
          } else {
            this.loading = false
            this.orderId = 0
            this.isAddNew = true
            this.getBoData();
          }
          this.openModal();
          if (+data.editId > 0) {
            this.loading = true
            this.getEditData(+data.editId)
          }
        } else {
          this.closeModal()
        }
      }))
      this.getSetUpModules((JSON.parse(this.settings.moduleSettings).settings))
      this.destroy$.push(this._ps.combos$.subscribe((data: any) => {
      if (data.data && data.data.length > 0) {
        this.masterData['itemData'] = data.data
        console.log('item data : ', this.masterData['itemData'])
      }
    }))

    this._ps.select2List$.subscribe((data: any) => {
      // console.log(data)
      if (data.data && data.title) {
        if (data.title === 'Buyer Order') {
          this.masterData['buyerNameList'] = JSON.parse(JSON.stringify(data.data))
        }
      }
    })

    this.destroy$.push(this._ps.previousPackets$.subscribe((data) => {
      if (data) {
        this.previousPacketItems = data
        this._cs.fixTableHF('previous-packets')
      }
    }))
  }

  getEditData(id) {
    this.destroy$.push(this._ps.editOP(id).subscribe((data) => {
      console.log('edit data : ', data)
      this.loading = false
    },
    (error) => {
      this.loading = false
      this._ts.showErrorLong(error, '')
    }))
  }

  isBillManual: boolean
  getSetUpModules(settings) {
    settings.forEach(element => {
      if (element.id === SetUpIds.PackagingCodeManual) {
        // console.log(element.val)
        this.isBillManual = element.val
      }
    })
  }

  getOrderData () {
    this.destroy$.push(this._ps.getItemList(this.orderId).subscribe(
      (data) => {
        if (!_.isEmpty(data)) {
          this.orderData = data
          console.log('packing order : ', this.orderData)
          this.loading = false
          this.setData(this.orderData)
        }
      },
      (error) => {
        console.log(error)
        this.loading = false
        this._ts.showErrorLong(error, '')
      }
    ))
  }

  @ViewChild('pcode') pcode: ElementRef
  pendingCheck1 = false
  openModal() {
    $('#packaging').modal(UIConstant.MODEL_SHOW)
    // setTimeout(() => {
    //   if (this.pcode && this.pcode.nativeElement.value.trim()) {
    //     fromEvent(this.pcode.nativeElement, 'keyup').pipe(
    //       map((event: any) => {
    //         return event.target.value.trim()
    //       }),
    //       filter(res => res.length > 0),
    //       debounceTime(1000),
    //       distinctUntilChanged()
    //     ).subscribe((text: string) => {
    //       this.pendingCheck1 = true
    //       this.destroy$ = this._ps.searchCode(text).subscribe((data) => {
    //         console.log('search data : ', data)
    //           setTimeout(() => {
    //             this.pendingCheck1 = false
    //             this.masterData.existsCodes.pcode = data.Status
    //             if (this.masterData.existsCodes.pcode) {
    //               $('.fas fa-check').addClass('hideMe')
    //             } else {
    //               $('.fas fa-times').addClass('hideMe')
    //             }
    //           }, 1000)
    //       }, (err) => {
    //         this._ts.showErrorLong('', err)
    //         setTimeout(() => {
    //           this.pendingCheck1 = false
    //         }, 100)
    //         console.log('error', err)
    //       })
    //     })
    //   }
    // }, 1000)
  }

  setData (data) {
    this.defaultAttrName = ''
    this.comboFor = ''
    console.log(data)
    this.masterData['CurrentDate'] = this._gs.getDefaultDate(this.clientDateFormat)
    this.masterData['Date'] = this._gs.getDefaultDate(this.clientDateFormat)
    if (!_.isEmpty(data)) {
      this.masterData['isAttr'] = (data.ItemAttributesTransSnos.length > 0) ? true : false
      if (data.BuyerOrderDetails.length > 0) {
        this.masterData['OrderDate'] = this._gs.utcToClientDateFormat(data.BuyerOrderDetails[0].OrderDate, this.clientDateFormat)
        this.masterData['BuyerName'] = data.BuyerOrderDetails[0].BuyerName
        this.masterData['StyleName'] = data.BuyerOrderDetails[0].StyleName
        this.masterData['BuyerCode'] = data.BuyerOrderDetails[0].BuyerCode
      }
      if (data.BuyerOrderTransInfos.length > 0) {
        if (!this.isBillManual) {
          this.masterData['Code'] = data.BuyerOrderTransInfos[0].Code
        }
      }
      if (data.OrderPacketDetails.length > 0) {
        this._ps.createPreviousPackets(data.OrderPacketDetails)
      }
      if (data.BuyerOrderPacketDetails.length > 0 && data.ItemAttributesTransSnos && data.BuyerOrderDetails.length > 0) {
        this._ps.getItemCombos(data.ItemAttributesTransSnos, data.BuyerOrderPacketDetails, data.BuyerOrderDetails[0].Id)
      }
      if (data.ItemAttributesTransSnos.length > 0) {
        this.getComboFor(data.ItemAttributesTransSnos)
      }
    }
    console.log(this.masterData.Date)
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
        if (!this.isBillManual) {
          this.getPCode()
        } else {
          this.masterData.Code = ''
        }
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
      // console.log('items : ', items)
      this.editItemMode = true
      this.masterData['Code'] = items.code
      items.packets.forEach((item) => {
        item['UnPackedQty'] = +item['UnPackedQty'] + +item['Quantity']
        item.checked = true
      })
      // this.masterData.itemData.forEach((data) => {
        
      // })
      this.masterData['itemToEdit'] = items.packets
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
    this.destroy$.push(this._ps.getPCode().subscribe(
      (data) => {
        console.log(data)
        if (data) {
          this.masterData['Code'] = data
        }
      },
      (error) => {
        this._ts.showError(error, '')
      }
    ))
  }

  preparePayload () {
    let obj = {
      Length: (+this.masterData.Length > 0) ? +this.masterData.Length : 0,
      Height: (+this.masterData.Height > 0) ? +this.masterData.Height : 0,
      Width: (+this.masterData.Width > 0) ? +this.masterData.Height : 0,
      NetWeight: (+this.masterData.NetWeight > 0) ? +this.masterData.NetWeight : 0,
      BorderId: this.orderId,
      OrderDate: this._gs.clientToSqlDateFormat(this.masterData.OrderDate, this.clientDateFormat),
      OrderPacketDetails: this.masterData['itemToPack']
    }
    console.log(JSON.stringify(obj))
    return obj
  }

  postData () {
    if (this.masterData['packets'] && this.masterData['packets'].length > 0) {
      this.disableBtnSubmit = true
      this.destroy$.push(this._ps.postData(this.preparePayload()).subscribe(
        (data) => {
          console.log('post : ', data)
          this.disableBtnSubmit = false
          this._ts.showSuccess('Successfully added package', '')
          this.close()
        },
        (error) => {
          this.disableBtnSubmit = false
          console.log(error)
          this._ts.showError(error, '')
        }
      ))
    } else {
      this._ts.showErrorLong('Add Atleast 1 Packet to Save', '')
    }
  }

  toggleSelect (val: boolean) {
    this.masterData.itemData.forEach((element) => {
      element['checked'] = val
    })
  }

  closeModal(packagingForm?) {
    // if (!packagingForm.submitted && packagingForm.dirty) {
    //   if(confirm(
    //     'It looks like you have been editing something. '
    //     + 'If you leave before saving, your changes will be lost.')){
    //     this.resetForm()
    //     $('#packaging').modal(UIConstant.MODEL_HIDE)
    //     return true
    //   } else {
    //     return false
    //   }
    // } else {
    //   this.resetForm()
    //   $('#packaging').modal(UIConstant.MODEL_HIDE)
    // }
    this.resetForm()
    $('#packaging').modal(UIConstant.MODEL_HIDE)
  }

  close() {
    this._ms.closeOP()
  }

  resetForm () {
    this.orderData = []
    this.previousPacketItems = []
    this.masterData = {}
    this.editItemMode = false
    this.loading = true
    // this.packingModelForm.reset()
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

  getPacketCodeStatus() {
    if (this.masterData.pCode.trim()) {
      this.pendingCheck1 = true
      this.destroy$.push(this._ps.searchCode(this.masterData.pCode.trim()).subscribe((data) => {
        console.log('search data : ', data)
          setTimeout(() => {
            this.pendingCheck1 = false
            this.masterData.existsCodes.pcode = data.Status
            if (this.masterData.existsCodes.pcode) {
              $('.fas fa-check').addClass('hideMe')
            } else {
              $('.fas fa-times').addClass('hideMe')
            }
          }, 1000)
      },
      (error) => {
        this._ts.showErrorLong('', error)
      }))
    }
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

  getBoData () {
    this._ps.getBOTransList().subscribe(
      (data) => {
        console.log(data)
        this._ps.getList(data, 'BuyerName', 'Buyer Order')
      }
    )
  }
}