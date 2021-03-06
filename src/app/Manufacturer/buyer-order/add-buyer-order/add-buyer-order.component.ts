import { ToastrCustomService } from './../../../commonServices/toastr.service';
import { ItemmasterServices } from './../../../commonServices/TransactionMaster/item-master.services';
import { AttributeCombinationComponent } from './../attribute-combination/attribute-combination.component';
import { GlobalService } from './../../../commonServices/global.service';
import { Settings } from './../../../shared/constants/settings.constant';
import { Component, OnInit, ViewChild, Output, EventEmitter, Renderer2, QueryList, ViewChildren } from '@angular/core';
import * as _ from 'lodash'
import { UIConstant } from 'src/app/shared/constants/ui-constant';
import { BuyerOrderService } from '../buyer-order.service';
import { SetUpIds } from '../../../shared/constants/setupIds.constant';
import { Select2Component } from 'ng2-select2';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Subscription } from 'rxjs';
import { AddCust } from '../../../model/sales-tracker.model';
import { ManufacturingService } from '../../manufacturing.service';
import { Subject } from 'rxjs/internal/Subject';
// import { BuyerOrderAttributeAddComponent } from '../buyer-order-attribute-add/buyer-order-attribute-add.component';
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
  // @ViewChild('buyer_order_add_form') buyerOrderAddForm: BuyerOrderAttributeAddComponent
  @ViewChild('itemForm') itemFormModal
  @ViewChild('buyerOrderForm') buyerOrderFormModal
  listItem: any = {}
  model: any = {}
  orderList:Array<any> = []
  editMode: boolean
  previousOrders: Array<any> = []
  destroy$: Subscription[] = []
  disableBtnSubmit = false
  formReadySub = new Subject<any>()
  formReady$ = this.formReadySub.asObservable()
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
    this.destroy$.push(this.formReady$.subscribe(() => {
      setTimeout(() => {
        if (this.editMode) {
          // this.model.addressValue = this.model.editData.BuyerOrders[0].AddressId
          _self.addressSelect2.setElementValue(this.model.editData.BuyerOrders[0].AddressId)
        }
      }, 3000)
    }))
    this.destroy$.push(this._buyerOrderService.addressData$.subscribe(
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
    ))

    this.destroy$.push(this.commonService.getAddressStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.listItem['addressList'])
          newData.push({ id: data.id, text: data.name })
          this.listItem['addressList'] = newData
          this.model['addressValue'] = data.id
        }
      }
    ))

    this._buyerOrderService.select2List$.subscribe((data: any) => {
      // console.log(data)
      if (data.data && data.title) {
        if (data.title === 'Buyer') {
          this.listItem['buyerNameList'] = JSON.parse(JSON.stringify(data.data))
        } else if (data.title === 'Style') {
          this.listItem['styleNumberList'] = JSON.parse(JSON.stringify(data.data))
        } else if (data.title === 'Season') {
          this.listItem['seasonList'] = JSON.parse(JSON.stringify(data.data))
        } else if (data.title === 'OrderType') {
          this.listItem['orderTypeList'] = JSON.parse(JSON.stringify(data.data))
        } else if (data.title === 'Shipping Mode') {
          this.listItem['shipModeList'] = JSON.parse(JSON.stringify(data.data))
        } else if (data.title === 'Item') {
          this.listItem['itemList'] = JSON.parse(JSON.stringify(data.data))
        } else if (data.title === 'Packing Type') {
          let arr = JSON.parse(JSON.stringify(data.data))
          arr.splice(1, 1)
          this.listItem['packagingTypeList'] = arr
          this.model['packageTypeValue'] = 1
        } else if (data.title === 'Currency') {
          let arr = JSON.parse(JSON.stringify(data.data))
          arr.splice(1, 1)
          this.listItem['currencyList'] = arr
        } else if (data.title === 'Set Type') {
          this.listItem['setTypeData'] = JSON.parse(JSON.stringify(data.data))
        } else if (data.title === 'Department') {
          this.listItem['departmentList'] = JSON.parse(JSON.stringify(data.data))
        }
      }
    })

   this.destroy$.push(this.commonService.getCustStatus().subscribe((data: AddCust) => {
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
    }))

    this.destroy$.push(this._ms.openStyle$.subscribe((data: any) => {
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
    }))

    this.destroy$.push(this.commonService.getItemMasterStatus().subscribe(
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
    ))

    this.destroy$.push(this.commonService.openCommonMenu$.subscribe(
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
          if (data.code === 186) {
            let newData = Object.assign([], this.listItem.setTypeData)
            newData.push({ id: data.id, text: data.name })
            this.listItem.setTypeData = Object.assign([], newData)
            this.model.setValue = +data.id
            setTimeout(() => {
              if (this.setTypeSelect2) {
                const element = this.renderer.selectRootElement(this.setTypeSelect2.selector.nativeElement, true)
                element.focus({ preventScroll: false })
              }
            }, 2000)
          }
          if (data.code === 114) {
            let newData = Object.assign([], this.listItem.departmentList)
            newData.push({ id: data.id, text: data.name })
            this.listItem.departmentList = Object.assign([], newData)
            this.model.departmentValue = +data.id
            setTimeout(() => {
              if (this.departmentSelect2) {
                const element = this.renderer.selectRootElement(this.departmentSelect2.selector.nativeElement, true)
                element.focus({ preventScroll: false })
              }
            }, 2000)
          }
        }
      }
    ))
  }

  @ViewChild('department_select2') departmentSelect2: Select2Component
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
    if (this.toOpenAttr) {
      let defaultAttrIndex = _.findIndex(this.buyerOrderAttr, {Id: this.defaultMeasuring})
      if (defaultAttrIndex > -1) {
        this.model['defaultAttrName'] = this.buyerOrderAttr[defaultAttrIndex]['Val']
        this.buyerOrderAttr.splice(defaultAttrIndex, 1)
        if (defaultAttrIndex > -1 && this.buyerOrderAttr.length > 0) {
          this.model['buyerOrderAttrs'] = (_.map(this.buyerOrderAttr, (element) => element.Id)).join(',')
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
    this.model['packageTypeValue'] = 1
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
      if (this.model.editData.AddressDetails && this.model.editData.AddressDetails.length > 0) {
        this._buyerOrderService.createAddress(this.model.editData.AddressDetails)
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
      this.formReadySub.next()
    }
  }

  createOrderList (buyerOrderTrans, transList?) {
    this.orderList = []
    _.forEach(['totalOrderedQty', 'totalProductionQty', 'totalAmount'], (element) => {
      if (!this.model[element]) {
        this.model[element] = 0
      }
    })
    this.model.totalAmount = 0
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
              obj['orderQuantity1'] = 0
              obj['productionQty1'] = 0
              obj['rate'] = element.Rate
              obj['amount'] = element.SubTotalAmount
              obj['addPercentage'] = element.Additional
              obj['unit'] = element.UnitId
              obj['unitName'] = element.UnitName
              obj['remark'] = (element.Remark || '')
              obj['Id'] = element.Id
              obj['Sno'] = index + 1
              obj['itemName'] = element.ItemName
              obj['GroupTransId'] = element.GroupTransId
              obj['PackingTypeId'] = element.PackingTypeId
              obj['baseAttrId'] = element.MeasurementAttributetId
              obj['setupAttrIds'] = element.SetupAttributeStrId
              obj['StyleId'] = element.StyleId
              obj['SetId'] = element.SetId
              obj['ProductCode'] = element.ProductCode
              obj['ProductDescription'] = element.ProductDescription
              obj['editable'] = false
            } else {
              obj['attributeValueId'] = (obj['attributeValueId']) ? obj['attributeValueId'] + '-' + trans.AttributeValueId : trans.AttributeValueId
              obj['attributeValueName'] = (obj['attributeValueName']) ? obj['attributeValueName'] + '-' + trans.AttributeValueName : trans.AttributeValueName
            }
            this.model['totalOrderedQty'] = (this.model['totalOrderedQty'] || 0) + +obj['orderQuantity']
            this.model['totalProductionQty'] = (this.model['totalProductionQty'] || 0) + +obj['productionQty']
            this.model['totalAmount'] = (this.model['totalAmount'] || 0) + +obj['amount']
          }
        })
        console.log(obj)
        this.orderList.push({...obj})
      })
      console.log(this.orderList)
      const groupOnId = _.groupBy(this.orderList, (item) => {
        return item.GroupTransId
      })
      for (const key in groupOnId) {
        if (groupOnId.hasOwnProperty(key)) {
          this.itemsInOrder.push({'transformed': [], 'original': [], 'total': {}})
          const element = groupOnId[key];
          this.itemsInOrder[this.itemsInOrder.length - 1]['transformed'].push(...element)
          this.itemsInOrder[this.itemsInOrder.length - 1]['total']['orderQty'] = this.getTotal(this.itemsInOrder.length - 1, 'orderQuantity')
          this.itemsInOrder[this.itemsInOrder.length - 1]['total']['productionQty'] = this.getTotal(this.itemsInOrder.length - 1, 'productionQty')
          this.update()
          this.calculateItemTotal()
        }
      }
      console.log(this.itemsInOrder)
    } else {
      _.forEach(buyerOrderTrans, (element, index) => {
        let obj = {}
        obj['itemId'] = element.ItemId
        obj['orderQuantity'] = element.OrderQty
        obj['productionQty'] = element.ProductionQty
        obj['orderQuantity1'] = 0
        obj['productionQty1'] = 0
        obj['rate'] = element.Rate
        obj['amount'] = element.SubTotalAmount
        obj['addPercentage'] = element.Additional
        obj['unit'] = element.UnitId
        obj['unitName'] = element.UnitName
        obj['remark'] = (element.Remark || '')
        obj['Id'] = element.Id
        obj['Sno'] = index + 1
        obj['itemName'] = element.ItemName
        obj['StyleId'] = element.StyleId
        obj['SetId'] = element.SetId
        this.model['totalOrderedQty'] = (this.model['totalOrderedQty'] || 0) + +obj['orderQuantity']
        this.model['totalProductionQty'] = (this.model['totalProductionQty'] || 0) + +obj['productionQty']
        this.model['totalAmount'] = (this.model['totalAmount'] || 0) + +obj['amount']
        this.orderList.push({...obj})
      })
    }
  }

  update () {
    _.forEach(this.itemsInOrder[this.itemsInOrder.length - 1]['transformed'], (element) => {
      element.orderQuantity1 = this.itemsInOrder[this.itemsInOrder.length - 1]['total']['orderQty']
      element.productionQty1 = this.itemsInOrder[this.itemsInOrder.length - 1]['total']['productionQty']
    })
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
    this.checkForFocus()
    if (valid && this.validateItemAddForm()) {
      if (this.editInfoIndex > -1) {
        this.updateItemsInfo()
      } else {
        if (this.toOpenAttr) {
          this.openAttributeCombinationModal()
        } else {
          this.addToList()
        }
      }
    }
  }

  editItemAttribute(index) {
    // this.attributeFormModal.openModal(this.model, this.itemsInOrder[index].original)
  }

  addToList () {
    const obj = {
      itemId: this.model.itemId,
      itemName: this.model.itemName,
      orderQuantity: +this.itemFormModal.value.orderQuantity,
      addPercentage: (+this.model.addPercentage > 0) ? +this.model.addPercentage : 0,
      productionQty: +this.itemFormModal.value.productionQty,
      unit: this.model.unit,
      unitName : this.model.unitName,
      rate: this.model.rate,
      amount: (+this.itemFormModal.value.orderQuantity * +this.model.rate).toFixed(2),
      remark : (this.model.remark || ''),
      SetId: (this.model.SetId || 0),
      StyleId: this.model.StyleId,
      editable: false,
      GroupTransId: this.orderList.length + 1,
      PackingTypeId: this.model.PackingTypeId,
    }
    this.model['totalOrderedQty'] = (this.model['totalOrderedQty'] || 0) + +obj['orderQuantity']
    this.model['totalProductionQty'] = (this.model['totalProductionQty'] || 0) + +obj['productionQty']
    this.model['totalAmount'] = (this.model['totalAmount'] || 0) + +obj['amount']
    this.orderList.push({ ...obj })
    this.resetItemAddForm()
    // this.setDefaultParameters()
    this.commonService.fixTableHFL('order-list-table')
  }

  attrValues: any = {}
  sputilityData: any = {}
  getUtilityItemList(){
    this.destroy$.push(this._gs.manipulateResponse(this._buyerOrderService.getUtilityItemList()).subscribe((res) => {
      this.attributeFormModal.combineAttributeList = []
      this.attributeFormModal.getUtilityItemList(res)
      this.sputilityData = res
      this.attrValues = JSON.parse(JSON.stringify({Attributes: res.Attributes, AttributeValues: res.AttributeValues}))
      // this.buyerOrderAddForm.generateCombination(res)
      this._buyerOrderService.getList(res['Customers'], 'Name', 'Buyer')
      this._buyerOrderService.getList(res['Styles'], 'Name', 'Style')
      this._buyerOrderService.getList(res['Season'], 'Name', 'Season')
      this.listItem['genderList'] = this._buyerOrderService.getGenderList()
      this._buyerOrderService.getList(res['OrderType'], 'Name', 'OrderType')
      this._buyerOrderService.getList(res['PaymentModes'], 'PayModeName', 'Payment Mode')
      this._buyerOrderService.getList(res['ShipmentTypes'], 'CommonDesc', 'Shipping Mode')
      this._buyerOrderService.getList(res['Currencies'], 'Name', 'Currency')
      this._buyerOrderService.getList(res['Items'], 'Name', 'Item')
      this._buyerOrderService.getList(res['PackingType'], 'CommonDesc', 'Packing Type', 'UId')
      this._buyerOrderService.getList(res['Departments'], 'CommonDesc', 'Department')
    },
    (error) => {
      console.log(error)
      this._toaster.showError(error, '')
    }))
  }

  generateProductionQty() {
    if (this.model.addPercentage && this.model.orderQuantity) {
      this.model.productionQty = +(+this.model.orderQuantity + (+this.model.orderQuantity*+this.model.addPercentage)/100).toFixed(2)
    } else if (this.model.orderQuantity && !this.model.addPercentage) {
      this.model.productionQty = this.model.orderQuantity
    }
  }

  itemsInOrder: any = []
  onCombinationModalClose(Data) {
    let model1: any = {}
    if (this.editIndex > -1) {
      model1 = this.itemsInOrder[this.editIndex].transformed[0]
      console.log(model1)
    } else {
      model1 = this.model
      this.itemsInOrder.push({'original': Data.data, 'transformed': [], 'total': {}})
      console.log('combineAttributeList : ', this.itemsInOrder)
    }
    // _.forEach(['totalOrderedQty', 'totalProductionQty', 'totalAmount'], (element) => {
    //   if (!this.model[element]) {
    //     this.model[element] = 0
    //   }
    // })
    // this.model.totalAmount = 0
    _.forEach(Data.data, (element) => {
      _.forEach(element['values'], (item) => {
        if (item.Qty > 0) {
          const obj = {
            itemId: model1.itemId,
            sizeId: item.sizeAttributeId,
            sizeName: item.sizeAttributeName,
            attributeValueId: item.attributeCombinationId,
            attributeValueName: item.attributeCombinationName,
            orderQuantity: this.getOrderQuantity(+item.Qty, +model1.addPercentage),
            orderQuantity1: +model1.orderQuantity,
            productionQty1: +Data.productionQty,
            addPercentage: (+model1.addPercentage > 0) ? +model1.addPercentage : 0,
            productionQty: +item.Qty,
            unit: model1.unit,
            unitName : model1.unitName,
            rate: model1.rate,
            amount: +(item.Qty * model1.rate).toFixed(2),
            remark : model1.remark,
            itemName: model1.itemName,
            SetId: model1.SetId,
            StyleId: model1.StyleId,
            ProductCode: item.ProductCode,
            ProductDescription: item.ProductDescription,
            editable: false,
            GroupTransId: (model1.GroupTransId) ? model1.GroupTransId : 0,
            PackingTypeId: model1.PackingTypeId,
            baseAttrId: (model1.baseAttrId || ''),
            setupAttrIds: (model1.setupAttrIds || '')
          }
          this.model['totalOrderedQty'] = (this.model['totalOrderedQty'] || 0) + +obj['orderQuantity']
          this.model['totalProductionQty'] = (this.model['totalProductionQty'] || 0) + +obj['productionQty']
          this.model['totalAmount'] = (this.model['totalAmount'] || 0) + +obj['amount']
          this.orderList.push({ ...obj })
          if (this.editIndex > -1) {
            this.itemsInOrder[this.editIndex]['transformed'].push({ ...obj })
          } else {
            this.itemsInOrder[this.itemsInOrder.length - 1]['transformed'].push({ ...obj })
          }
          console.log('items in order : ', this.itemsInOrder)
        }
      })
    })
    this.calculateItemTotal()
    this.resetItemAddForm()
    this.commonService.fixTableHF('order-list-table')
    setTimeout(() => {
      const element = this.renderer.selectRootElement(this.itemSelect2.selector.nativeElement, true)
      element.focus({ preventScroll: false })
    }, 1000)
  }

  getOrderQuantity (qty, addPer) {
    if (addPer) {
      return Math.round((qty * 100) / (100 + addPer))
    } else {
      return Math.round((qty * 100) / (100))
    }
  }

  calculateItemTotal (index?) {
    if (+index >= 0) {
      this.itemsInOrder[index]['total']['productionQty'] = this.getTotal(index, 'productionQty')
      this.itemsInOrder[index]['total']['orderQty'] = this.getTotal(index, 'orderQuantity')
      this.itemsInOrder[index]['total']['amount'] = this.getTotal(index, 'amount')
      if (this.itemsInOrder[index]['transformed'][0].orderQuantity1 !== this.itemsInOrder[index]['total']['orderQty']) {
        this._toaster.showError('Order Qty does not match', '')
      }
    } else {
      if (this.editIndex > -1) {
        this.itemsInOrder[this.editIndex]['total']['productionQty'] = this.getTotal(this.editIndex, 'productionQty')
        this.itemsInOrder[this.editIndex]['total']['orderQty'] = this.getTotal(this.editIndex, 'orderQuantity')
        this.itemsInOrder[this.editIndex]['total']['amount'] = this.getTotal(this.editIndex, 'amount')
        if (this.itemsInOrder[this.editIndex]['transformed'][0].orderQuantity1 !== this.itemsInOrder[this.editIndex]['total']['orderQty']) {
          this._toaster.showError('Order Qty does not match', '')
        }
      } else {
        this.itemsInOrder[this.itemsInOrder.length - 1]['total']['productionQty'] = this.getTotal(this.itemsInOrder.length - 1, 'productionQty')
        this.itemsInOrder[this.itemsInOrder.length - 1]['total']['orderQty'] = this.getTotal(this.itemsInOrder.length - 1, 'orderQuantity')
        this.itemsInOrder[this.itemsInOrder.length - 1]['total']['amount'] = this.getTotal(this.itemsInOrder.length - 1, 'amount')
        if (this.itemsInOrder[this.itemsInOrder.length - 1]['transformed'][0].orderQuantity1 !== this.itemsInOrder[this.itemsInOrder.length - 1]['total']['orderQty']) {
          this._toaster.showError('Order Qty does not match', '')
        }
      }
    }
  }

  calculateAllTotal() {
    _.forEach(['totalOrderedQty', 'totalProductionQty', 'totalAmount'], (element) => {
      this.model[element] = 0
    })
    if (this.toOpenAttr) {
      _.forEach(this.itemsInOrder, (element) => {
        this.model['totalOrderedQty'] += +element.total.orderQty
        this.model['totalProductionQty'] += +element.total.productionQty
        this.model['totalAmount'] += +element.total.amount
      })
    } else {
      _.forEach(this.orderList, (element) => {
        this.model['totalOrderedQty'] += +element.orderQuantity
        this.model['totalProductionQty'] += +element.productionQty
        this.model['totalAmount'] += +element.amount
      })
    }
  }

  deleteItem (index, item, topIndex) {
    if(confirm('Do you want to Delete ?')){
      this.model['totalOrderedQty'] = this.model['totalOrderedQty'] - item['orderQuantity']
      this.model['totalProductionQty'] = this.model['totalProductionQty'] - item['productionQty']
      this.model['totalAmount'] = this.model['totalAmount']- item['amount']
      if (this.itemsInOrder[topIndex]['transformed'].length > 1) {
        this.itemsInOrder[topIndex]['transformed'].splice(index, 1)
        this.calculateItemTotal(topIndex)
      } else {
        this.itemsInOrder.splice(topIndex, 1)
      }
      this.calculateAllTotal()
      return true
    } else {
      return false
    }
  }

  @ViewChild('packing_select2') packingSelect2: Select2Component
  resetItemAddForm() {
    this.editIndex = -1
    this.editInfoIndex = -1
    this.editRow = false
    this.model.itemValue = 0
    this.model.packageTypeValue = 1
    this.model.styleNumberValue = 0
    this.model.unit = 0
    this.model.unitName = ''
    this.model.itemName = ''
    this.model.orderQuantity = 0
    this.model.rate = 0
    this.model.addPercentage = 0
    this.model.remark = ''
    this.model.setValue = 0
    this.model.productionQty = 0
    this.itemSelect2.setElementValue(0)
    this.styleSelect2.setElementValue(0)
    this.packingSelect2.setElementValue(1)
    this.itemFormModal.resetForm()
  }

  resetBuyerOrderForm() {
    _.forEach(
      ['buyerNameValue', 'orderTypeValue', 'seasonValue', 'genderValue', 'styleNumberValue',
      'shipModeValue', 'currencyValue', 'departmentValue'],
      (element) => {
        this.model[element] = 0
    })
    this.imageList = []
    this.ImageFiles = []
    this.orderList = []
    this.itemsInOrder = []
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
    const iterateList = ['buyerNameId', 'orderDate', 'orderPoNumber', 'currencyId', 'AddressId']
    for (var i = 0; i < iterateList.length; i++) {
      if (!this.model[iterateList[i]]) {
        valid = false
        break
      }
    }
    if (this.toOpenAttr) {
      if (this.itemsInOrder.length === 0 && valid) {
        valid = false
        this._toaster.showErrorLong('', 'Please add atleast 1 item to place order')
      } else {
        _.forEach(this.itemsInOrder, (element) => {
          if (element['transformed'][0].orderQuantity1 !== element['total']['orderQty']) {
            valid = false
          }
        })
      }
    } else {
      if (this.orderList.length === 0 && valid) {
        valid = false
        this._toaster.showErrorLong('', 'Please add atleast 1 item to place order')
      }
    }
    this.checkForFocus()
    return valid
  }

  prepareItemAttributeTransDetails() {
    const itemTransDetails = []
    // (this.editMode) ? this.previousOrders[this.previousOrders.length - 1].Sno + 1:
    let sno = 1
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

  prepareBuyerOrderTransDetails() {
    if (this.toOpenAttr) {
      this.orderList = []
      let arr = []
      _.forEach(this.itemsInOrder, (element) => {
        _.forEach(element.transformed, (item) => {
          this.orderList.push(item)
          arr.push({
            "OrderId": 0,
            "GroupId": 0,
            "ItemId": item.itemId,
            "UnitId": item.unit,
            "Rate": item.rate,
            "StyleId": item.StyleId,
            "SetId": (item.SetId || 0),
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
            "Id": item.Id ? item.Id : 0,
            "ProductCode": item.ProductCode,
            "ProductDescription": item.ProductDescription,
            "GroupTransId": item.GroupTransId,
            "PackingTypeId": item.PackingTypeId
          })
        })
      })
      return arr
    } else {
      return _.map(this.orderList, (item) => {
        return {
          "OrderId": 0,
          "GroupId": 0,
          "ItemId": item.itemId,
          "UnitId": item.unit,
          "Rate": item.rate,
          "StyleId": item.StyleId,
          "SetId": (item.SetId || 0),
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
          "Id": item.Id ? item.Id : 0,
          "ProductCode": item.ProductCode,
          "ProductDescription": item.ProductDescription,
          "GroupTransId": item.GroupTransId,
          "PackingTypeId": item.PackingTypeId
        }
      })
    }
  }

  preparePayload(){
    return {
      "LedgerId": this.model.buyerNameId,
      "StyleNo": "",
      "AddressId": this.model.AddressId,
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
      "ImageFiles": this.ImageFiles,
      "DepartmentId": this.model.DepartmentId
    }
  }

  submitForm() {
    if (this.validateBuyerOrderForm()) {
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
    let valid = true
    const iterateList = ['rate', 'orderQuantity', 'productionQty']
    for (var i = 0; i < iterateList.length; i++) {
      if (+this.model[iterateList[i]] <= 0) {
        valid = false
        break
      }
    }
    const iterateList1 = ['PackingTypeId', 'StyleId', 'itemId']
    for (var i = 0; i < iterateList1.length; i++) {
      if (!this.model[iterateList1[i]]) {
        valid = false
        break
      }
    }
    return valid
    // if (!this.model.PackingTypeId) {
    //   return false
    // } else if (!this.model.itemId) {
    //   return false
    // } else {
    //   return true
    // }
  }

  openAttributeCombinationModal(){
    this.model['GroupTransId'] = (this.itemsInOrder.length > 0) ? this.itemsInOrder[this.itemsInOrder.length - 1]['transformed'][0].GroupTransId + 1 : 1
    this.attributeFormModal.openModal(this.model)
    // this.buyerOrderAddForm.openModal()
  }

  @ViewChild('address_select2') addressSelect2: Select2Component
  @ViewChild('style_select2') styleSelect2: Select2Component
  @ViewChild('item_select2') itemSelect2: Select2Component
  @ViewChild('shipmode_select2') shipmodeSelect2: Select2Component
  @ViewChild('season_select2') seasonSelect2: Select2Component
  @ViewChild('order_type_select2') orderTypeSelect2: Select2Component
  @ViewChild('setType_select2') setTypeSelect2: Select2Component
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
    if (key === 'PackingTypeId' && this.model[key] === 4) {
      this._buyerOrderService.getSetTypeData().subscribe((data) => {
        console.log(data)
        this._buyerOrderService.getList(data, 'CommonDesc', 'Set Type')
      },
      (error) => {
        this._toaster.showErrorLong(error, '')
      })
    }
    if (key === 'SetId' && this.model[key] === -1) {
      this.shipmodeSelect2.selector.nativeElement.value = ''
      this.commonService.getCommonMenu(186).then((menudata) => {
        console.log(menudata)
        this.commonService.openCommonMenu({'open': true, 'data': menudata, 'isAddNew': false})
      });
    }
    if (key === 'DepartmentId' && this.model[key] === -1) {
      this.departmentSelect2.selector.nativeElement.value = ''
      this.commonService.getCommonMenu(114).then((menudata) => {
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
    if(this.destroy$ && this.destroy$.length > 0) {
      this.destroy$.forEach((element) => element.unsubscribe())
    }
  }

  @ViewChildren('error') errorSelect2: QueryList<Select2Component>
  checkForFocus () {
    let stack = []
    setTimeout(() => {
      if ($(".errorSelecto:first")[0].nodeName === 'SELECT2') {
        this.errorSelect2.forEach((item: Select2Component, index: number) => {
          if (item.selector.nativeElement.parentElement.classList.contains('errorSelecto')) {
            stack.push(index)
          }
        })
        this.errorSelect2.forEach((item: Select2Component, index: number) => {
          if (stack[0] === index) {
            const element = this.renderer.selectRootElement(item.selector.nativeElement, true)
            element.focus({ preventScroll: false })
          }
        })
      } else {
        $(".errorSelecto:first").focus()
      }
    }, 10)
  }

  editIndex: number = -1
  addMore(index) {
    let copy = JSON.parse(JSON.stringify(this.itemsInOrder[index]['transformed']))
    const item1 = _.find(copy, (element) => {
      if (element.baseAttrId && element.setupAttrIds) {
        return element
      }
    })
    this.editIndex = +index
    if (!_.isEmpty(item1) || item1) {
      const item = JSON.parse(JSON.stringify(item1))
      item.baseAttrId = +item.baseAttrId
      const arr = item.setupAttrIds.split(',')
      const ind = arr.findIndex((element) => element === '' + item.baseAttrId)
      if (ind > -1) {
        arr.splice(ind, 1)
        this.attributeFormModal.openModal(
          {productionQty: (+this.itemsInOrder[index]['transformed'][0].productionQty1 - +this.itemsInOrder[index].total.productionQty)}, {attrsFor: this.sputilityData,
          baseAttr: item.baseAttrId,
          attrValues: arr
        })
      }
    } else {
      this.attributeFormModal.openModal(
        {productionQty: (+this.itemsInOrder[index]['transformed'][0].productionQty1 - +this.itemsInOrder[index].total.productionQty)}
        , {attrsFor: this.sputilityData, baseAttr: '', attrValues: ''})
    }
  }

  deleteItem1 (index) {
    if(confirm('Do you want to Delete ?')){
      if (index === this.editInfoIndex) {
        this.resetItemAddForm()
      }
      this.itemsInOrder.splice(index, 1)
      this.calculateAllTotal()
      return true
    } else {
      return false
    }
  }
  editInfoIndex: number = -1
  editRow: boolean = false
  editInfo(item, index) {
    if (!this.itemFormModal.dirty || this.itemFormModal.pristine) {
      if (this.toOpenAttr) {
        this.editInfoIndex = index
        this.model.itemValue = item.transformed[0].itemId
        this.model.packageTypeValue = item.transformed[0].PackingTypeId
        this.model.styleNumberValue = item.transformed[0].StyleId
        this.model.unit = item.transformed[0].unit
        this.model.unitName = ''
        this.model.itemName = ''
        this.model.orderQuantity = +item.transformed[0].orderQuantity1
        this.model.addPercentage = (item.transformed[0].addPercentage > 0) ? +item.transformed[0].addPercentage : 0
        this.generateProductionQty()
        this.model.remark = item.transformed[0].remark
        this.model.productionQty1 = item.transformed[0].productionQty1
        // item.transformed[0].productionQty
        setTimeout(() => {
          this.model.setValue = item.transformed[0].SetId
          this.model.rate = item.transformed[0].rate
          console.log(this.model)
          const element = this.renderer.selectRootElement(this.itemSelect2.selector.nativeElement, true)
          element.focus({ preventScroll: false })
        }, 2000)
      } else {
        this.editInfoIndex = index
        this.model.itemValue = item.itemId
        this.model.packageTypeValue = item.PackingTypeId
        this.model.styleNumberValue = item.StyleId
        this.model.unit = item.unit
        this.model.unitName = ''
        this.model.itemName = ''
        this.model.orderQuantity = +item.orderQuantity
        this.model.addPercentage = (item.addPercentage > 0) ? +item.addPercentage : 0
        this.generateProductionQty()
        this.model.remark = item.remark
        this.model.productionQty = item.productionQty
        setTimeout(() => {
          this.model.setValue = item.SetId
          this.model.rate = item.rate
          console.log(this.model)
          const element = this.renderer.selectRootElement(this.itemSelect2.selector.nativeElement, true)
          element.focus({ preventScroll: false })
        }, 2000)
      }
    }
  }

  getTotal(index, key) {
    return _.reduce(this.itemsInOrder[index]['transformed'], (result, value) => {
      result += +value[key]
      return result;
    }, 0)
  }

  updateItemsInfo() {
    if (this.editInfoIndex > -1) {
      if (this.toOpenAttr) {
        _.forEach(this.itemsInOrder[this.editInfoIndex]['transformed'], (element) => {
          element.itemId = this.model.itemId
          element.orderQuantity = this.getOrderQuantity(+element.productionQty, +this.model.addPercentage)
          element.orderQuantity1 = +this.model.orderQuantity
          element.addPercentage = (+this.model.addPercentage > 0) ? +this.model.addPercentage : 0
          element.productionQty = +element.productionQty
          element.productionQty1 = +this.model.productionQty
          element.unit = this.model.unit
          element.unitName = this.model.unitName
          element.rate = this.model.rate
          element.amount = +(+element.productionQty * +this.model.rate).toFixed(2)
          element.remark  = this.model.remark
          element.itemName = this.model.itemName
          element.SetId = this.model.SetId
          element.StyleId = this.model.StyleId
          element.PackingTypeId = this.model.PackingTypeId
        })
        this.calculateItemTotal()
      } else {
        this.orderList[this.editInfoIndex].itemId = this.model.itemId
        this.orderList[this.editInfoIndex].orderQuantity = +this.model.orderQuantity
        this.orderList[this.editInfoIndex].orderQuantity1 = +this.model.orderQuantity
        this.orderList[this.editInfoIndex].addPercentage = (+this.model.addPercentage > 0) ? +this.model.addPercentage : 0
        this.orderList[this.editInfoIndex].productionQty = +this.model.productionQty
        this.orderList[this.editInfoIndex].productionQty1 = +this.model.productionQty
        this.orderList[this.editInfoIndex].unit = this.model.unit
        this.orderList[this.editInfoIndex].unitName = this.model.unitName
        this.orderList[this.editInfoIndex].rate = this.model.rate
        this.orderList[this.editInfoIndex].amount = +(this.model.productionQty * +this.model.rate).toFixed(2)
        this.orderList[this.editInfoIndex].remark  = this.model.remark
        this.orderList[this.editInfoIndex].itemName = this.model.itemName
        this.orderList[this.editInfoIndex].SetId = this.model.SetId
        this.orderList[this.editInfoIndex].StyleId = this.model.StyleId
        this.orderList[this.editInfoIndex].PackingTypeId = this.model.PackingTypeId
        this.calculateAllTotal()
      }
      this.resetItemAddForm()
    }
  }

  editRowClick(item) {
    if (!this.editRow) {
      item.editable = true;
      this.editRow = true;
    } else {
      item.editable = false;
    }
  }

  deleteItem2 (index, item) {
    if(confirm('Do you want to Delete ?')){
      this.model['totalOrderedQty'] = this.model['totalOrderedQty'] - item['orderQuantity']
      this.model['totalProductionQty'] = this.model['totalProductionQty'] - item['productionQty']
      this.model['totalAmount'] = this.model['totalAmount']- item['amount']
      if (this.editInfoIndex === index) {
        this.resetItemAddForm()
      }
      this.orderList.splice(index, 1)
      this.commonService.fixTableHF('order-list-table')
      return true
    } else {
      return false
    }
  }
}
