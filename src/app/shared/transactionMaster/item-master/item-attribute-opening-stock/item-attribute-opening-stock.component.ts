import { filter } from 'rxjs/operators';
import { ItemmasterServices } from 'src/app/commonServices/TransactionMaster/item-master.services';
import { UIConstant } from 'src/app/shared/constants/ui-constant';
import { ComboService } from './../item-combo/combo.service';
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
declare const $: any
import * as _ from 'lodash'


@Component({
  selector: 'app-item-attribute-opening-stock',
  templateUrl: './item-attribute-opening-stock.component.html',
  styleUrls: ['./item-attribute-opening-stock.component.css']
})
export class ItemAttributeOpeningStockComponent implements OnInit {
  masterData: any;
  attribute: Array<any> = [];
  @Input('toggleValue') openModel;
  @Output() closeModel = new EventEmitter<any>()
  editAttributeData: any[];
  constructor(
    private comboService: ComboService,
    private _itemmasterServices: ItemmasterServices,
  ) { }

  ngOnInit() {


  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.openModel && this.openModel.value === true) {
      this.getSPUtilityData();
    } else {
      $('#item-attribute-opening-stock').modal('hide')
    }
  }

  getSPUtilityData = () => {
    this.comboService.getSPUtilityData().subscribe(
      async (data) => {
        if (data.Code === UIConstant.THOUSAND && data.Data) {
          this.masterData = data.Data;
          this.attribute = [];
          await this.generateCombination();
          await this.makeAttributeValueCombination();
          if (this.openModel.editMode === true) {
            await this.initFormData(this.openModel.data);
          }
          this.triggerModelOpen();
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }

  generateCombination = () => {
    return new Promise((resolve, reject) => {
      _.forEach(this.masterData.Attributes, (attribute) => {
        const data = _.filter(this.masterData.AttributeValues, (attributeValue) => {
          if (attributeValue.AttributeId === attribute.Id) {
            return true;
          }
        })
        this.attribute.push(data);
      });
      resolve();
    })
  }

  makeAttributeValueCombination = () => {
    return new Promise((resolve, reject) => {
      const iterationtime = this.attribute.length - 1;
      for (let lastIndex = iterationtime; lastIndex > 0; lastIndex--) {
        let dummyArray = [];
        _.forEach(this.attribute[lastIndex - 1], (firstAttributeValue) => {
          _.forEach(this.attribute[lastIndex], (secondAttributeValue) => {
            const data = {
              Id: `${firstAttributeValue.Id},${secondAttributeValue.Id}`,
              Name: `${firstAttributeValue.Name},${secondAttributeValue.Name}`,
            }
            dummyArray.push(data);
          })
        })
        this.attribute[lastIndex - 1] = JSON.parse(JSON.stringify(dummyArray));
        this.attribute.pop();
      }
      this.attribute = JSON.parse(JSON.stringify(this.attribute[0]));
      this.generateGroupId();
      resolve();
    });
  }

  triggerModelOpen() {
    $('#item-attribute-opening-stock').modal('show')
    $('#item-attribute-opening-stock').modal({
      keyboard: false
    })
  }

  triggerCloseModel = (data?) => {
    this.closeModel.emit(data);
  }

  generateGroupId = () => {
    _.map(this.attribute, (element, i) => {
      element.GroupId = i + 1
      element.AttributeStr = element.Id
      element.AttributeNamestr = element.Name.split(',')
      element.Checked = false
    })
  }

  checkAllItem = (event) => {
    _.map(this.attribute, (element) => {
      element.Checked = event.target.checked
    })
  }

  initFormData = (Data) => {
    return new Promise((resolve, reject) => {
      _.map(this.attribute, (generateElement, index) => {
        _.forEach(Data, (editElement) => {
          if (editElement.AttributeStr === generateElement.AttributeStr) {
            this.attribute[index] = { ...editElement, Checked: false };
            this.attribute[index].AttributeNamestr = this.attribute[index].AttributeNamestr.split(',');
          }
        });
      })
      this.editAttributeData = [...Data];
      resolve()
    })
  }

  preparePayloadToSave = (dataToMap) => {
    const Data = _.filter(dataToMap, (element) => {
      if (element.Checked === true) {
        return true
      }
    });
    const data = _.map(Data, (element) => {
      return {
        "ID": element.ID ? element.ID : 0,
        "ParentTypeId": element.ParentTypeId ? element.ParentTypeId : 0,
        "AttributeId": element.AttributeId ? element.AttributeId : 0,
        "Barcode": element.Barcode ? element.Barcode : 0,
        "ClientBarCode": element.ClientBarCode ? element.ClientBarCode : 0,
        "GroupId": element.GroupId,
        "IsBaseGroup": element.IsBaseGroup ? element.IsBaseGroup : 0,
        "ItemId": element.ItemId ? element.ItemId : 0,
        "ItemTransId": element.ItemTransId ? element.ItemTransId : 0,
        "Qty": element.Qty ? element.Qty : 0,
        "QtyValue": element.QtyValue ? element.QtyValue : 0,
        "RateMrp": element.RateMrp ? element.RateMrp : 0,
        "RateNrv": element.RateNrv ? element.RateNrv : 0,
        "RateOur": element.RateOur ? element.RateOur : 0,
        "RatePurchase": element.RatePurchase ? element.RatePurchase : 0,
        "RateSale": element.RateSale ? element.RateSale : 0,
        "AttributeStr": element.AttributeStr ? element.AttributeStr : 0,
      }
    })
    return data
  }

  postFormData = (Data, type) => {
    const data = {
      editMode: this.openModel.editMode,
      data: this.preparePayloadToSave(Data),
      type: type
    }
    this.triggerCloseModel(data);
  }

  onPurchaseRateChange = (index) => {
    if (this.attribute[index].RatePurchase && this.attribute[index].Qty) {
      this.attribute[index].QtyValue = this.attribute[index].Qty * this.attribute[index].RatePurchase;
    } else if (this.attribute[index].QtyValue && this.attribute[index].RatePurchase) {
      this.attribute[index].Qty = this.attribute[index].QtyValue / this.attribute[index].RatePurchase
    }
  }

  onOpeningStockChange = (index) => {
    if (this.attribute[index].RatePurchase && this.attribute[index].Qty) {
      this.attribute[index].QtyValue = this.attribute[index].Qty * this.attribute[index].RatePurchase;
    } else if (this.attribute[index].QtyValue && this.attribute[index].Qty) {
      this.attribute[index].RatePurchase = this.attribute[index].QtyValue / this.attribute[index].Qty
    }
  }

  onOpeningStockValueChange = (index) => {
    if (this.attribute[index].Qty && this.attribute[index].QtyValue) {
      this.attribute[index].RatePurchase = this.attribute[index].QtyValue / this.attribute[index].Qty
    } else if (this.attribute[index].RatePurchase && this.attribute[index].QtyValue) {
      this.attribute[index].Qty = this.attribute[index].QtyValue / this.attribute[index].RatePurchase
    }
  }

  validateForm = () => {
    let valid = true;
    _.map(this.attribute, (element) => {
      if (element.Checked === true) {
        if (!element.Qty) {
          element.isInvalid = true
          valid = false
        }
        if (!element.QtyValue) {
          element.isInvalid = true
          valid = false
        }
        if (!element.RatePurchase) {
          element.isInvalid = true
          valid = false
        }
      }
    })
    return valid;
  }
}
