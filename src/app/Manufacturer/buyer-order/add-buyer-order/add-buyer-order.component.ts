import { ToastrCustomService } from './../../../commonServices/toastr.service';
import { ItemmasterServices } from './../../../commonServices/TransactionMaster/item-master.services';
import { AttributeCombinationComponent } from './../attribute-combination/attribute-combination.component';
import { GlobalService } from './../../../commonServices/global.service';
import { Settings } from './../../../shared/constants/settings.constant';
import { Component, OnInit, ViewChild, Output, EventEmitter, Renderer2 } from '@angular/core';
import * as _ from 'lodash'
import { UIConstant } from 'src/app/shared/constants/ui-constant';
import { BuyerOrderService } from '../buyer-order.service';
import { SetUpIds } from '../../../shared/constants/setupIds.constant';
import { Select2Component } from 'ng2-select2';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Subscription } from 'rxjs';
import { AddCust } from '../../../model/sales-tracker.model';
import { ManufacturingService } from '../../manufacturing.service';
declare const $: any
@Component({
  selector: 'app-add-buyer-order',
  templateUrl: './add-buyer-order.component.html',
  styleUrls: ['./add-buyer-order.component.css']
})
export class AddBuyerOrderComponent implements OnInit {
  imageList: any = { images: [], queue: [], safeUrls: [], baseImages: [], id: [] }
  ImageFiles: any = []
  clientDateFormat: string = ''
  @Output() triggerCloseModal = new EventEmitter();
  @ViewChild('attribute_combine_form') attributeFormModal: AttributeCombinationComponent
  @ViewChild('itemForm') itemFormModal
  @ViewChild('buyerOrderForm') buyerOrderFormModal
  listItem: any = {}
  model: any = {}
  orderList:Array<any> = []
  editMode: boolean
  previousOrders: Array<any> = []
  destroy$: Subscription
  disableBtnSubmit = false
  constructor(
    private _buyerOrderService: BuyerOrderService,
    private setting: Settings,
    private _gs: GlobalService,
    private itemMaster: ItemmasterServices,
    private _toaster: ToastrCustomService,
    private commonService: CommonService,
    private renderer: Renderer2,
    private _ms: ManufacturingService
  ) {
    
    let _self = this
    this.destroy$ = this._buyerOrderService.addressData$.subscribe(
      data => {
        if (data.data) {
          _self.listItem.addressList = Object.assign([], data.data)
          let id = 0
          if (_self.listItem.addressList.length > 2) {
            id = +_self.listItem.addressList[2].id
          }
          _self.model.addressValue = id
          // _self.addressSelect2.setElementValue(id)
        }
      }
    )

    this.destroy$ = this.commonService.getAddressStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.listItem['addressList'])
          newData.push({ id: data.id, text: data.name })
          this.listItem['addressList'] = newData
          this.model['addressValue'] = data.id
        }
      }
    )

    this._buyerOrderService.select2List$.subscribe((data: any) => {
      // console.log(data)
      if (data.data && data.title) {
        if (data.title === 'Buyer') {
          this.listItem['buyerNameList'] = data.data
        } else if (data.title === 'Style') {
          this.listItem['styleNumberList'] = data.data
        } else if (data.title === 'Season') {
          this.listItem['seasonList'] = data.data
        } else if (data.title === 'OrderType') {
          this.listItem['orderTypeList'] = data.data
        } else if (data.title === 'Shipping Mode') {
          this.listItem['shipModeList'] = data.data
        } else if (data.title === 'Item') {
          this.listItem['itemList'] = data.data
        } else if (data.title === 'Packing Type') {
          let arr = data.data
          arr.splice(1, 1)
          this.listItem['packagingTypeList'] = arr
        } else if (data.title === 'Currency') {
          let arr = data.data
          arr.splice(1, 1)
          this.listItem['currencyList'] = arr
        }
      }
    })

    this.commonService.getCustStatus().subscribe((data: AddCust) => {
      if (data.name && data.id) {
        let newData = Object.assign([], this.listItem['buyerNameList'])
        newData.push({ id: +data.id, text: data.name })
        this.listItem['buyerNameList'] = newData
        this.model.buyerNameValue = data.id
        setTimeout(() => {
          if (this.first) {
            const element = this.renderer.selectRootElement(this.first.selector.nativeElement, true)
            element.focus({ preventScroll: false })
          }
        }, 2000)
      }
    })

    this._ms.openStyle$.subscribe((data: any) => {
      if (data.name && data.id) {
        let newData = Object.assign([], this.listItem['styleNumberList'])
        newData.push({ id: +data.id, text: data.name })
        this.listItem['styleNumberList'] = newData
        this.model.styleNumberValue = data.id
        setTimeout(() => {
          if (this.styleSelect2) {
            const element = this.renderer.selectRootElement(this.styleSelect2.selector.nativeElement, true)
            element.focus({ preventScroll: false })
          }
        }, 2000)
      }
    })

    this.commonService.getItemMasterStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.listItem.itemList)
          newData.push({ id: data.id, text: data.name })
          this.listItem.itemList = Object.assign([], newData)
          this.model.itemValue = +data.id
          setTimeout(() => {
            if (this.itemSelect2) {
              const element = this.renderer.selectRootElement(this.itemSelect2.selector.nativeElement, true)
              element.focus({ preventScroll: false })
            }
          }, 2000)
        }
      }
    )

    this.commonService.openCommonMenu$.subscribe(
      (data: AddCust) => {
        if (data.id && data.name && data.code) {
          if (data.code === 170) {
            let newData = Object.assign([], this.listItem.shipModeList)
            newData.push({ id: data.id, text: data.name })
            this.listItem.shipModeList = Object.assign([], newData)
            this.model.shipModeValue = +data.id
            setTimeout(() => {
              if (this.shipmodeSelect2) {
                const element = this.renderer.selectRootElement(this.shipmodeSelect2.selector.nativeElement, true)
                element.focus({ preventScroll: false })
              }
            }, 2000)
          }
          if (data.code === 184) {
            let newData = Object.assign([], this.listItem.orderTypeList)
            newData.push({ id: data.id, text: data.name })
            this.listItem.orderTypeList = Object.assign([], newData)
            this.model.orderTypeValue = +data.id
            setTimeout(() => {
              if (this.orderTypeSelect2) {
                const element = this.renderer.selectRootElement(this.orderTypeSelect2.selector.nativeElement, true)
                element.focus({ preventScroll: false })
              }
            }, 2000)
          }
          if (data.code === 185) {
            let newData = Object.assign([], this.listItem.seasonList)
            newData.push({ id: data.id, text: data.name })
            this.listItem.seasonList = Object.assign([], newData)
            this.model.seasonValue = +data.id
            setTimeout(() => {
              if (this.seasonSelect2) {
                const element = this.renderer.selectRootElement(this.seasonSelect2.selector.nativeElement, true)
                element.focus({ preventScroll: false })
              }
            }, 2000)
          }
        }
      }
    )
  }

  ngOnInit() {
    this.getUtilityItemList()
    this.getUploadedImages()
  }
  openModal(data?){
    if (data && data.edit && data.data) {
      this.model['editData'] = data.data || []
      this.editMode = true
    } else {
      this.editMode = false
    }
    this.getSetUpModules((JSON.parse(this.setting.moduleSettings).settings))
    if (this.toOpenAttr && this.buyerOrderAttr.length > 0) {
      let defaultAttrIndex = _.findIndex(this.buyerOrderAttr, {Id: this.defaultMeasuring})
      if (defaultAttrIndex > -1) {
        this.model['defaultAttrName'] = this.buyerOrderAttr[defaultAttrIndex]['Val']
        this.buyerOrderAttr.splice(defaultAttrIndex, 1)
        if (defaultAttrIndex > -1 && this.buyerOrderAttr.length > 0) {
          this.open()
        } else {
          this._toaster.showErrorLong('Please complete the master settings', '')
        }
      } else {
        this._toaster.showErrorLong('Please complete the master settings', '')
      }
    } else {
      this.open()
    }
  }

  @ViewChild('first') first: Select2Component
  open () {
    $('#buyer_order_form').modal({ backdrop: 'static', keyboard: false })
    $('#buyer_order_form').modal(UIConstant.MODEL_SHOW)
    setTimeout(() => {
      this.first.selector.nativeElement.focus({ preventScroll: false })
      this.setDefaultParameters()
    }, 1)
  }

  setDefaultParameters () {
    this.model['packageTypeValue'] = 275
    if (!this.editMode) {
      this.model['orderDate'] = this._gs.getDefaultDate(this.clientDateFormat)
      this.getNewBillNo()
    } else {
      setTimeout(() => {
        this.setEditData()
      }, 1000)
    }
  }

  setEditData () {
    this.imageList = { images: [], queue: [], safeUrls: [], baseImages: [], id: [] }
    if (this.model.editData.ImageFiles && this.model.editData.ImageFiles.length > 0) {
      _.forEach(this.model.editData.ImageFiles, (element) => {
        this.imageList.queue.push(element.Name)
        this.imageList.images.push(element.FilePath)
        this.imageList.baseImages.push(0)
        this.imageList.id.push(element.Id)
        this.imageList.safeUrls.push(element.FilePath)
      })
      this.createImageFiles()
    }
    if (this.toOpenAttr) {
      if (this.model.editData.ItemAttributesTransSno && this.model.editData.ItemAttributesTransSno.length > 0) {
        this.generateAttributeTrans(this.model.editData.ItemAttributesTransSno)
      }
      if (this.model.editData.BuyerOrderTrans && this.model.editData.BuyerOrderTrans.length > 0) {
        this.orderList = []
        this.createOrderList(this.model.editData.BuyerOrderTrans, this.model.editData.ItemAttributesTransSno)
      }
    } else {
      this.createOrderList(this.model.editData.BuyerOrderTrans)
    }
    if (this.model.editData.BuyerOrders && this.model.editData.BuyerOrders.length > 0) {
      const buyerOrders = this.model.editData.BuyerOrders[0]
      this.model.editId = buyerOrders.Id
      this.model.buyerNameValue = buyerOrders.LedgerId
      this.model.orderTypeValue = buyerOrders.OrderType
      this.model.seasonValue = buyerOrders.SeasonId
      this.model.genderValue = buyerOrders.Gender
      this.model.styleNumberValue = buyerOrders.StyleId
      this.model.shipModeValue = buyerOrders.ShipmentMode
      this.model.currencyValue = buyerOrders.CurrencyId
      this.model.totalOrderedQty = buyerOrders.TotalOrderQty
      this.model.totalProductionQty = buyerOrders.TotalProductionQty
      this.model.totalAmount = buyerOrders.NetAmount
      this.model.orderPoNumber = buyerOrders.OrderNo
      this.model.orderDate = this._gs.utcToClientDateFormat(buyerOrders.OrderDate, this.clientDateFormat)
      this.model.shipDate = (buyerOrders.ShipmentDate) ? this._gs.utcToClientDateFormat(buyerOrders.ShipmentDate, this.clientDateFormat) : ''
      this.model.exFactDate = (buyerOrders.ExpectedFactoryDate) ? this._gs.utcToClientDateFormat(buyerOrders.ExpectedFactoryDate, this.clientDateFormat) : ''
    }
  }

  createOrderList (buyerOrderTrans, transList?) {
    this.previousOrders = []
    if (transList) {
      _.forEach(buyerOrderTrans, (element, index) => {
        let obj = {}
        _.forEach(transList, (trans) => {
          if (element.Id === trans.ItemTransId) {
            if (trans.IsMeasurment) {
              obj['sizeName'] = trans.AttributeValueName
              obj['sizeId'] = trans.AttributeId
              obj['itemId'] = trans.ItemId
              obj['orderQuantity'] = element.OrderQty
              obj['productionQty'] = element.ProductionQty
              obj['rate'] = element.Rate
              obj['amount'] = element.SubTotalAmount
              obj['addPercentage'] = element.Additional
              obj['unit'] = element.UnitId
              obj['unitName'] = element.UnitName
              obj['remark'] = element.Remark
              obj['Id'] = element.Id
              obj['Sno'] = index + 1
              obj['itemName'] = element.ItemName
            } else {
              obj['attributeValueId'] = (obj['attributeValueId']) ? obj['attributeValueId'] + '-' + trans.AttributeValueId : trans.AttributeValueId
              obj['attributeValueName'] = (obj['attributeValueName']) ? obj['attributeValueName'] + '-' + trans.AttributeValueName : trans.AttributeValueName
            }
          }
        })
        this.previousOrders.push({...obj})
      })
    } else {
      _.forEach(buyerOrderTrans, (element, index) => {
        let obj = {}
        obj['itemId'] = element.ItemId
        obj['orderQuantity'] = element.OrderQty
        obj['productionQty'] = element.ProductionQty
        obj['rate'] = element.Rate
        obj['amount'] = element.SubTotalAmount
        obj['addPercentage'] = element.Additional
        obj['unit'] = element.UnitId
        obj['unitName'] = element.UnitName
        obj['remark'] = element.Remark
        obj['Id'] = element.Id
        obj['Sno'] = index + 1
        obj['itemName'] = element.ItemName
        this.previousOrders.push({...obj})
      })
    }
    console.log(this.previousOrders)
  }

  generateAttributeTrans (ItemAttributesTransSno) {
    this.model['transDetail'] = []
    _.forEach(ItemAttributesTransSno, (item) => {
      const obj = {
        "ItemId": item.ItemId,
        "AttributeId": item.AttributeId,
        "GroupId": item.GroupId,
        "Qty": item.Qty,
        "Sno": item.Sno,
        "Id": item.Id,
        "ItemTransId": item.ItemTransId
      }
      this.model['transDetail'].push(obj)
    })
  }

  defaultMeasuring: any
  buyerOrderAttr: any
  toOpenAttr: boolean
  isBillManual: boolean
  getSetUpModules(settings) {
    settings.forEach(element => {
      if (element.id === SetUpIds.defaultMesurementUnit) {
        this.defaultMeasuring = +element.val
        this.toOpenAttr = (+element.val > 0) ? true : false
      }
      if (element.id === SetUpIds.buyerOrderAttributes) {
        this.buyerOrderAttr = element.val
      }
      if (element.id === SetUpIds.dateFormat) {
        this.clientDateFormat = element.val[0].Val
      }
      if (element.id === SetUpIds.manualEntryBuyerOrder) {
        this.isBillManual = element.val
      }
    })
    console.log('defaultMeasuring : ', this.defaultMeasuring)
    console.log('buyerOrderAttributes : ', this.buyerOrderAttr)
  }

  addItem(valid) {
    if (valid && this.validateItemAddForm()) {
      if (this.toOpenAttr) {
        this.openAttributeCombinationModal()
      } else {
        this.addToList()
      }
    }
  }

  addToList () {
    const obj = {
      itemId: this.model.itemId,
      itemName: this.model.itemName,
      orderQuantity: +this.itemFormModal.value.orderQuantity,
      addPercentage: +this.model.addPercentage,
      productionQty: +this.itemFormModal.value.productionQty,
      unit: this.model.unit,
      unitName : this.model.unitName,
      rate: this.model.rate,
      amount: (+this.itemFormModal.value.orderQuantity * +this.model.rate).toFixed(2),
      remark : this.model.remark
    }
    this.model['totalOrderedQty'] = (this.model['totalOrderedQty'] || 0) + +obj['orderQuantity']
    this.model['totalProductionQty'] = (this.model['totalProductionQty'] || 0) + +obj['productionQty']
    this.model['totalAmount'] = (this.model['totalAmount'] || 0) + +obj['amount']
    this.orderList.push({ ...obj })
    this.resetItemAddForm()
    this.setDefaultParameters()
    this.commonService.fixTableHF('order-list-table')
  }

  getUtilityItemList(){
    this._gs.manipulateResponse(this._buyerOrderService.getUtilityItemList()).subscribe((res) => {
      this.attributeFormModal.combineAttributeList = []
      this.attributeFormModal.getUtilityItemList(res)
      this._buyerOrderService.getList(res['Customers'], 'Name', 'Buyer')
      this._buyerOrderService.getList(res['Styles'], 'Name', 'Style')
      this._buyerOrderService.getList(res['Season'], 'Name', 'Season')
      this.listItem['genderList'] = this._buyerOrderService.getGenderList()
      this._buyerOrderService.getList(res['OrderType'], 'Name', 'OrderType')
      this._buyerOrderService.getList(res['PaymentModes'], 'PayModeName', 'Payment Mode')
      this._buyerOrderService.getList(res['ShipmentTypes'], 'CommonDesc', 'Shipping Mode')
      this._buyerOrderService.getList(res['Currencies'], 'Name', 'Currency')
      this._buyerOrderService.getList(res['Items'], 'Name', 'Item')
      this._buyerOrderService.getList(res['PackingType'], 'CommonDesc', 'Packing Type')
    },
    (error) => {
      console.log(error)
      this._toaster.showError(error, '')
    })
  }

  generateProductionQty() {
    if (this.model.addPercentage && this.model.orderQuantity) {
      this.model.productionQty = (+this.model.orderQuantity + (+this.model.orderQuantity*+this.model.addPercentage)/100).toFixed(2)
    }
  }

  onCombinationModalClose(Data) {
    console.log('combineAttributeList : ', Data)
    if (!this.editMode) {
      _.forEach(['totalOrderedQty', 'totalProductionQty', 'totalAmount'], (element) => {
        if (!this.model[element]) {
          this.model[element] = 0
        }
      })
      this.model.totalAmount = 0
    }
    _.forEach(Data, (element) => {
      _.forEach(element['values'], (item) => {
        if (item.Qty > 0) {
          const obj = {
            itemId: this.model.itemId,
            sizeId: item.sizeAttributeId,
            sizeName: item.sizeAttributeName,
            attributeValueId: item.attributeCombinationId,
            attributeValueName: item.attributeCombinationName,
            orderQuantity: this.getOrderQuantiy(+item.Qty, +this.model.addPercentage),
            addPercentage: this.model.addPercentage,
            productionQty: +item.Qty,
            unit: this.model.unit,
            unitName : this.model.unitName,
            rate: this.model.rate,
            amount: +(item.Qty*this.model.rate).toFixed(2),
            remark : this.model.remark,
            itemName: this.model.itemName
          }
          this.model['totalOrderedQty'] = (this.model['totalOrderedQty'] || 0) + +obj['orderQuantity']
          this.model['totalProductionQty'] = (this.model['totalProductionQty'] || 0) + +obj['productionQty']
          this.model['totalAmount'] = (this.model['totalAmount'] || 0) + +obj['amount']
          this.orderList.push({ ...obj })
        }
      })
    })
    this.resetItemAddForm()
    this.commonService.fixTableHF('order-list-table')
  }

  getOrderQuantiy (qty, addPer) {
    return Math.round((qty * 100) / (100 + addPer))
  }

  deleteItem (index, item, type) {
    this.model['totalOrderedQty'] = this.model['totalOrderedQty'] - item['orderQuantity']
    this.model['totalProductionQty'] = this.model['totalProductionQty'] - item['productionQty']
    this.model['totalAmount'] = this.model['totalAmount']- item['amount']
    if (type == 'new') {
      this.orderList.splice(index, 1)
    } else if (type === 'old') {
      let toDel = []
      _.forEach(this.model['transDetail'], (element, index) => {
        if (element.ItemTransId === item.Id) {
          toDel.push(element)
        }
      })
      console.log(toDel)
      this.model['transDetail'] = _.differenceWith(this.model['transDetail'], toDel, _.isEqual)
      console.log(this.model['transDetail'])
      this.previousOrders.splice(index, 1)
    }
    this.commonService.fixTableHF('order-list-table')
  }

  resetItemAddForm() {
    this.model.itemValue = 0
    this.model.packageTypeValue = 0
    this.model.unit = ''
    this.model.unitName = ''
    this.model.rate = null
    this.itemFormModal.resetForm()
  }

  resetBuyerOrderForm() {
    _.forEach(
      ['buyerNameValue', 'orderTypeValue', 'seasonValue', 'genderValue', 'styleNumberValue', 
      'shipModeValue', 'currencyValue'],
      (element) => {
        this.model[element] = 0
    })
    this.imageList = []
    this.ImageFiles = []
    this.orderList = []
    this.previousOrders = []
    this.model.totalOrderedQty = 0
    this.model.totalProductionQty = 0
    this.model.totalAmount = 0
    this.model.orderDate = this._gs.getDefaultDate(this.clientDateFormat)
    this.model.shipDate = ''
    this.model.exFactDate = ''
    this.disableBtnSubmit = false
    this.resetItemAddForm()
    this.attributeFormModal.resetForm()
    this.buyerOrderFormModal.resetForm()
    this.getUtilityItemList()
    $('#buyer_order_form').modal(UIConstant.MODEL_HIDE)
  }

  validateBuyerOrderForm() {
    let valid = true
    const iterateList = ['buyerNameId', 'orderDate', 'styleNumberId', 'orderPoNumber', 'currencyId']
    for (var i = 0; i < iterateList.length; i++) {
      if (!this.model[iterateList[i]]) {
        valid = false
        break
      }
    }
    if (this.orderList.length === 0 && valid) {
      valid = false
      this._toaster.showErrorLong('', 'Please add atleast 1 item to place order')
    }
    return valid
  }

  prepareItemAttributeTransDetails() {
    const itemTransDetails = []
    let sno = (this.editMode) ? this.previousOrders[this.previousOrders.length - 1].Sno + 1: 1
    _.forEach(this.orderList, (item) => {
      const obj = {
        "ItemId": item.itemId,
        "AttributeId": +item.sizeId,
        "GroupId": 0,
        "Qty": item.orderQuantity,
        "Sno": sno,
        "ItemTransId": sno,
        "Id": 0
      }
      itemTransDetails.push(obj)
      if(_.isString(item.attributeValueId) && _.includes(item.attributeValueId, '-')) {
        const attributeIdArray = item.attributeValueId.split('-')
        _.forEach(attributeIdArray, (attributeId) => {
          const obj = {
            "ItemId": item.itemId,
            "AttributeId": +attributeId,
            "GroupId": 0,
            "Qty": item.orderQuantity,
            "Sno": sno,
            "ItemTransId": sno,
            "Id": 0
          }
          itemTransDetails.push(obj)
        })
      } else {
        const obj = {
          "ItemId": item.itemId,
          "AttributeId": item.attributeValueId,
          "GroupId": 0,
          "Qty": item.orderQuantity,
          "Sno": sno,
          "ItemTransId": sno,
          "Id": 0
        }
        itemTransDetails.push(obj)
      }
      sno +=1
    })
    // console.log('itemTransDetails : ', itemTransDetails)
    let _itemTransDetails = []
    if (this.editMode) {
      _itemTransDetails = itemTransDetails.concat(this.model.transDetail)
    } else {
      _itemTransDetails = itemTransDetails
    }
    // console.log(_itemTransDetails)
    return _itemTransDetails
  }

  prepareBuyerOrderTransDetails(){
    let newArr = this.orderList.concat(this.previousOrders)
    return _.map(newArr, (item) => {
      return {
        "OrderId": 0,
        "GroupId": 0,
        "ItemId": item.itemId,
        "UnitId": item.unit,
        "Rate": item.rate,
        "Length": 1,
        "Height": 1,
        "Width": 1,
        "OrderQty": item.orderQuantity,
        "ProductionQty": item.productionQty,
        "Additional": item.addPercentage,
        "SubTotalAmount": item.amount,
        "DiscountType": "0",
        "Discount": "0",
        "DiscountAmt": "0",
        "Remark": item.remark,
        "ClientBarCode": "",
        "Id": item.Id ? item.Id : 0
      }
    })
  }

  preparePayload(){
    return {
      "LedgerId": this.model.buyerNameId,
      "StyleNo": "",
      "AddressId": this.model.AddressId,
      "StyleId": this.model.styleNumberId,
      "OrderNo": this.model.orderPoNumber,
      "OrderDate": this._gs.clientToSqlDateFormat(this.model.orderDate, this.clientDateFormat),
      "ShipmentDate": this._gs.clientToSqlDateFormat(this.model.shipDate, this.clientDateFormat),
      "ShipmentDateEx1": "",
      "ShipmentDateEx2": "",
      "ExpectedFactoryDate": this._gs.clientToSqlDateFormat(this.model.exFactDate, this.clientDateFormat),
      "ShipmentMode": this.model.shipModeId,
      "SeasonId": this.model.seasonId,
      "OrderType": this.model.orderTypeId,
      "TotalOrderQty": (+this.model.totalOrderedQty).toFixed(2),
      "TotalProductionQty": (+this.model.totalProductionQty).toFixed(2),
      "TotalDiscount": "0",
      "NetAmount": (+this.model.totalAmount).toFixed(2),
      "CurrencyId": this.model.currencyId,
      "ConvertedCurrencyId": this.model.currencyId,
      "ConvertedRate": "0",
      "Gender": this.model.genderId,
      "RangeId": "1",
      "Brands": "1",
      "Remark": '',
      "BuyerOrderTrans": this.prepareBuyerOrderTransDetails(),
      "ItemAttributesTransDetails": (this.toOpenAttr) ? this.prepareItemAttributeTransDetails() : [],
      "BuyerOrderInCharge": [],
      "Orderpackings": [],
      "ImageFiles": this.ImageFiles
    }
  }

  submitForm() {
    this.disableBtnSubmit = true
    const requestData = this.preparePayload()
    requestData['Id'] = (this.editMode) ? this.model.editId : 0
    console.log('obj : ', JSON.stringify(requestData))
    this._buyerOrderService.postBuyerOrderData(requestData).subscribe((res) => {
      this._toaster.showSuccess('Success', 'Buyer Order Saved Successfully')
        this.resetBuyerOrderForm()
        this.triggerCloseModal.emit()
    },
    (error) => {
      this.disableBtnSubmit = false
      this._toaster.showError(error, '')
    })
  }

  assignFormData(Data) {
    if (!_.isEmpty(Data) && Data.ImageFiles.length > 0) {
      Data.ImageFiles.forEach(element => {
        this.imageList['queue'].push(element.Name)
        this.imageList['images'].push(element.FilePath)
        this.imageList['baseImages'].push(0)
        this.imageList['id'].push(element.Id)
      })
      this.createImageFiles();
    }
  }

  validateItemAddForm() {
    if (!this.model.packingTypeId) {
      return false
    } else if (!this.model.itemId) {
      return false
    } else {
      return true
    }
  }

  openAttributeCombinationModal(){
    this.attributeFormModal.openModal(this.model)
  }
  
  @ViewChild('address_select2') addressSelect2: Select2Component
  @ViewChild('style_select2') styleSelect2: Select2Component
  @ViewChild('item_select2') itemSelect2: Select2Component
  @ViewChild('shipmode_select2') shipmodeSelect2: Select2Component
  @ViewChild('season_select2') seasonSelect2: Select2Component
  @ViewChild('order_type_select2') orderTypeSelect2: Select2Component
  onDropDownChange(event, key){
    this.model[key] = Number(event.value)
    if(key === 'itemId' && this.model[key]){
      console.log(event)
      if (this.model[key] > 0) {
        this.model.itemName = event.data[0].text
        this._buyerOrderService.getUnitAndRateByItemId(this.model[key]).subscribe((res)=> {
          this.model.unit = res.Data['ItemDetails'][0].UnitId
          this.model.unitName = res.Data['ItemDetails'][0].UnitName
          this.model.rate = res.Data['ItemDetails'][0].SaleRate
        })
      } else if (this.model[key] === 0) {
        this.model.unit = 0
        this.model.unitName = ''
        this.model.rate = 0
      } else if (this.model[key] === -1) {
        this.itemSelect2.selector.nativeElement.value = ''
        this.commonService.openItemMaster('', 0)
      }
    }
    if(key === 'buyerNameId'){
      if (this.model[key] > 0) {
        this._buyerOrderService.getAllAddresses(Number(event.value)).subscribe(data => {
          console.log('addresses : ', data)
          if (data.AddressDetails) {
            this._buyerOrderService.createAddress(data['AddressDetails'])
          }
        })
      } else if (this.model[key] === 0) {
        this.listItem['addressList'] = []
        this.model['AddressId'] = null
      } else if (this.model[key] === -1) {
        this.first.selector.nativeElement.value = ''
        this.commonService.openCust('', false)
      }
    }
    if (key === 'styleNumberId') {
      if (this.model[key] === -1) {
        this.styleSelect2.selector.nativeElement.value = ''
        this._ms.openStyle('', false)
      }
    } 
    
    if (key === 'AddressId' && this.model[key] === -1) {
      this.addressSelect2.selector.nativeElement.value = ''
      this.commonService.openAddress(this.model['buyerNameId'])
    }
    if (key === 'orderTypeId' && this.model[key] === -1) {
      this.orderTypeSelect2.selector.nativeElement.value = ''
      this.commonService.getCommonMenu(184).then((menudata) => {
        console.log(menudata)
        this.commonService.openCommonMenu({'open': true, 'data': menudata, 'isAddNew': false})
      });
    }
    if (key === 'seasonId' && this.model[key] === -1) {
      this.seasonSelect2.selector.nativeElement.value = ''
      this.commonService.getCommonMenu(185).then((menudata) => {
        console.log(menudata)
        this.commonService.openCommonMenu({'open': true, 'data': menudata, 'isAddNew': false})
      });
    }
    if (key === 'shipModeId' && this.model[key] === -1) {
      this.shipmodeSelect2.selector.nativeElement.value = ''
      this.commonService.getCommonMenu(170).then((menudata) => {
        console.log(menudata)
        this.commonService.openCommonMenu({'open': true, 'data': menudata, 'isAddNew': false})
      });
    }
  }

  openImageModal () {
    this.itemMaster.openImageModal(this.imageList)
  }

  getUploadedImages = () => {
    this.itemMaster.imageAdd$.subscribe((response)=> {
      this.imageList = response;
      this.createImageFiles()
    })
  }
  
  removeImage = (index) => {
    _.forIn(this.imageList, (value) => {
        value.splice(index, 1)
    })
    this.createImageFiles()
  }

  createImageFiles () {
    let ImageFiles = []
    for (let i = 0; i < this.imageList['images'].length; i++) {
      let obj = { Name: this.imageList['queue'][i], BaseString: this.imageList['safeUrls'][i], IsBaseImage: this.imageList['baseImages'][i], Id: this.imageList['id'][i] ? this.imageList['id'][i] : 0 }
      ImageFiles.push(obj)
    }
    this.ImageFiles = ImageFiles
  }

  setToDate (evt) {
    this.model['shipDate'] = evt
    if (this.model['orderDate'] && this.model['shipDate']) {
      if (!this._gs.compareDate(this.model['shipDate'], this.model['orderDate'])) {
        this.model['shipDate'] = ''
      }
    }
  }

  setFromDate (evt) {
    this.model['orderDate'] = evt
    this.getNewBillNo()
    if (this.model['orderDate'] && this.model['shipDate']) {
      if (!this._gs.compareDate(this.model['shipDate'], this.model['orderDate'])) {
        this.model['shipDate'] = ''
      }
    }
  }

  getNewBillNo() {
    if (this.model['orderDate']) {
      let newBillDate = this._gs.clientToSqlDateFormat(this.model['orderDate'], this.clientDateFormat)
      let type = (this.isBillManual) ? 2 : 1
      this._gs.manipulateResponse(this._buyerOrderService.getNewBillNo(newBillDate, type, 'buyerOrder')).subscribe(
        data => {
          console.log('new bill no : ', data)
          if (data.length > 0) {
            if (!this.isBillManual) {
              this.model['orderPoNumber'] = data[0].BillNo
              this.model['previousBillNo'] = ''
            } else {
              this.model['orderPoNumber'] = ''
              this.model['previousBillNo'] = data[0].BillNo
            }
          } else {
            this.model['previousBillNo'] = ''
            this.model['orderPoNumber'] = ''
          }
        },
        (error) => {
          this._toaster.showErrorLong(error, '')
        }
      )
    }
  }

  ngOnDestroy () {
    this.destroy$.unsubscribe()
  }
}
