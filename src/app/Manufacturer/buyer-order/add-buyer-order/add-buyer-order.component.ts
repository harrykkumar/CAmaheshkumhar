import { ToastrCustomService } from './../../../commonServices/toastr.service';
import { ItemmasterServices } from './../../../commonServices/TransactionMaster/item-master.services';
import { AttributeCombinationComponent } from './../attribute-combination/attribute-combination.component';
import { GlobalService } from './../../../commonServices/global.service';
import { Settings } from './../../../shared/constants/settings.constant';
import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
declare var $: any
import * as _ from 'lodash'
import { UIConstant } from 'src/app/shared/constants/ui-constant';
import { BuyerOrderService } from '../buyer-order.service';

@Component({
  selector: 'app-add-buyer-order',
  templateUrl: './add-buyer-order.component.html',
  styleUrls: ['./add-buyer-order.component.css']
})
export class AddBuyerOrderComponent implements OnInit {
  imageList: any = { images: [], queue: [], safeUrls: [], baseImages: [], id: [] }
  ImageFiles: any = []
  @Output() triggerCloseModal = new EventEmitter();
  @ViewChild('attribute_combine_form') attributeFormModal: AttributeCombinationComponent
  @ViewChild('itemForm') itemFormModal
  @ViewChild('buyerOrderForm') buyerOrderFormModal
  listItem: any = {}
  model: any = {}
  orderList:Array<any> = []
  constructor(
    private _buyerOrderService: BuyerOrderService,
    private setting: Settings,
    private _gs: GlobalService,
    private itemMaster: ItemmasterServices,
    private _toaster: ToastrCustomService,
  ) { }

  ngOnInit() {
    this.getUtilityItemList()
    this.getUploadedImages()
  }
  openModal(data?){
    $('#buyer_order_form').modal({ backdrop: 'static', keyboard: false })
    $('#buyer_order_form').modal(UIConstant.MODEL_SHOW)
  }

  getUtilityItemList(){
    this._buyerOrderService.getUtilityItemList().subscribe((res) => {
      this.attributeFormModal.getUtilityItemList(res)
      this.listItem['buyerNameList'] = this._buyerOrderService.getList(res.Data['Customers'], 'Name', 'Select Buyer Name')
      this.listItem['styleNumberList'] = this._buyerOrderService.getList(res.Data['Styles'], 'Name', 'Select Style Number')
      this.listItem['seasonList'] = this._buyerOrderService.getList(res.Data['Season'], 'Name', 'Select Season')
      this.listItem['genderList'] = this._buyerOrderService.getGenderList()
      this.listItem['orderTypeList'] = this._buyerOrderService.getList(res.Data['OrderType'], 'Name', 'Select OrderType')
      this.listItem['payMentModeList'] = this._buyerOrderService.getList(res.Data['PaymentModes'], 'PayModeName', 'Select Payment Mode')
      this.listItem['shipModeList'] = this._buyerOrderService.getList(res.Data['ShipmentTypes'], 'CommonDesc', 'Select Shipping Mode')
      this.listItem['currencyList'] = this._buyerOrderService.getList(res.Data['Currencies'], 'Name', 'Select Currency')
      this.listItem['itemList'] = this._buyerOrderService.getList(res.Data['Items'], 'Name', 'Select Items')
      this.listItem['packagingTypeList'] = this._buyerOrderService.getList(res.Data['PackingType'], 'CommonDesc', 'Select Packing Type')
      // this.listItem['itemSetTypeList']
      // this.listItem['shipMentTermList']
      // this.listItem['paymentTermList']
      // this.listItem['typeList']
      // this.listItem['convertRateList']
    })
  }

  generateProductionQty(){
    if(this.model.addPercentage && this.model.orderQuantity){
      this.model.productionQty = this.model.orderQuantity + (this.model.orderQuantity*this.model.addPercentage)/100
    }
  }

  onCombinationModalClose(Data) {
    _.forEach(['totalOrderedQty', 'totalProductionQty', 'totalAmount'], (element) => {
      if (!this.model[element]) {
        this.model[element] = 0
      }
    })
    this.model.totalAmount = 0
    _.forEach(Data, (element) => {
      _.forEach(element['values'], (item) => {
        const obj = {
          itemId: this.model.itemId,
          sizeId: item.sizeAttributeId,
          sizeName: item.sizeAttributeName,
          attributeValueId: item.attributeCombinationId,
          attributeValueName: item.attributeCombinationName,
          orderQuantity: item.Qty,
          addPercentage: this.model.addPercentage,
          productionQty: (item.Qty + (item.Qty*this.model.addPercentage)/100),
          unit: this.model.unit,
          unitName : this.model.unitName,
          rate: this.model.rate,
          amount: (item.Qty*this.model.rate),
          remark : this.model.remark
          // cancelQty: ''
        }
        this.model.totalOrderedQty +=  obj['orderQuantity']
        this.model.totalProductionQty +=  obj['productionQty']
        this.model.totalAmount += obj['amount']
        this.orderList.push({ ...obj })
      })
    })
    this.resetItemAddForm()
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
      ['buyerNameValue', 'orderTypeValue', 'seasonValue', 'genderValue', 'styleNumberValue', 'shipModeValue',
        'payMentModeValue', 'currencyValue'],
      (element) => {
        this.model[element] = 0
      })
      this.imageList = []
      this.model.totalOrderedQty = 0
    this.model.totalProductionQty = 0
    this.model.totalAmount = 0
    this.buyerOrderFormModal.resetForm()
    $('#buyer_order_form').modal(UIConstant.MODEL_HIDE)
  }

  validateBuyerOrderForm() {
    let valid = true
    const iterateList = ['buyerNameId', 'orderTypeId', 'seasonId', 'genderId', 'styleNumberId', 'shipModeId',
      'paymentModeId', 'currencyId']
    for (var i = 0; i < iterateList.length; i++) {
      if (!this.model[iterateList[i]]) {
        valid = false
        break
      }
    }
    return valid
  }

  prepareItemAttributeTransDetails(){
    const itemTransDetails = []
    let sno = 1
    _.forEach(this.orderList, (item) => {
      const obj = {
        "ItemId": item.itemId,
        "AttributeId": item.sizeId,
        "GroupId": 0,
        "Qty": item.orderQuantity,
        "Sno": sno
      }
      itemTransDetails.push(obj)
      if(_.isString(item.attributeValueId) && _.includes(item.attributeValueId, '-')){
        const attributeIdArray = item.attributeValueId.split('-')
        _.forEach(attributeIdArray, (attributeId) => {
          const obj = {
            "ItemId": item.itemId,
            "AttributeId": item.attributeId,
            "GroupId": 0,
            "Qty": item.orderQuantity,
            "Sno": sno
          }
          itemTransDetails.push(obj)
        })
      } else {
        const obj = {
          "ItemId": item.itemId,
          "AttributeId": item.attributeValueId,
          "GroupId": 0,
          "Qty": item.orderQuantity,
          "Sno": sno
        }
        itemTransDetails.push(obj)
      }
      sno +=1
    })
    return itemTransDetails
  }

  prepareBuyerOrderTransDetails(){
   return _.map(this.orderList, (item) => {
     return  {
          "OrderId": 0,
          "GroupId": 0,
          "ItemId": item.itemId,
          "UnitId": item.unit,
          "Rate": item.rate,
          "Lengths": "1",
          "Height": "1",
          "Width": "1",
          "OrderQty": item.orderQuantity,
          "ProductionQty": (item.orderQuantity + ((item.orderQuantity*item.addPercentage)/100)),
          "Additional": item.addPercentage,
          "SubTotalAmount": "1200",
          "DiscountType": "1",
          "Discount": "4",
          "DiscountAmt": "12521",
          "Remark": item.remark,
          "ClientBarCode": "O120120"
        }
    })
  }

  preparePayload(){
    return {
      "LedgerId": this.model.buyerNameId,
      "StyleNo": "",
      "StyleId": this.model.styleNumberId,
      "OrderNo": this.model.orderPoNumber,
      "OrderDate": this._gs.utcToClientDateFormat(this.model.orderDate, 'm/d/Y'),
      "ShipmentDate": this._gs.utcToClientDateFormat(this.model.shipDate, 'm/d/Y'),
      "ShipmentDateEx1": "",
      "ShipmentDateEx2": "",
      "ExpectedFactoryDate": this._gs.utcToClientDateFormat(this.model.exFactDate, 'm/d/Y'),
      "ShipmentMode": this.model.shipModeId,
      "SeasonId": this.model.seasonId,
      "OrderType": this.model.orderTypeId,
      "TotalOrderQty": this.model.totalOrderedQty,
      "TotalProductionQty": this.model.totalProductionQty,
      "TotalDiscount": "5",
      "NetAmount": this.model.totalAmount,
      "CurrencyId": this.model.currencyId,
      "ConvertedCurrencyId": "1",
      "ConvertedRate": "100",
      "Gender": this.model.genderId,
      "RangeId": "1",
      "Brands": "1",
      "Remark": '',
      "BuyerOrderTrans": this.prepareBuyerOrderTransDetails(),
      "ItemAttributesTransDetails": this.prepareItemAttributeTransDetails(),
      "BuyerOrderInCharge": [],
      "Orderpackings": []
    }
  }

  submitForm() {
    const requestData = this.preparePayload()
    this._buyerOrderService.postBuyerOrderData(requestData).subscribe((res) => {
      if (res.Code === 1000) {
        this._toaster.showSuccess('Success', 'Buyer Order Saved Successfully')
        this.resetBuyerOrderForm()
        this.triggerCloseModal.emit()
      } else {
        this._toaster.showError('Error', res.Message)
      }
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
  
  onDropDownChange(event, key){
    this.model[key] = Number(event.value)
    if(key === 'itemId' && this.model[key]){
      this._buyerOrderService.getUnitAndRateByItemId(this.model[key]).subscribe((res)=> {
        this.model.unit = res.Data['ItemDetails'][0].UnitId
        this.model.unitName = res.Data['ItemDetails'][0].UnitName
        this.model.rate = res.Data['ItemDetails'][0].PurchaseRate
      })
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
}
