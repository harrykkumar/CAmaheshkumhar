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
      return;
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
    $('#item-attribute-opening-stock').modal('hide')
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
            if(_.isString(editElement.AttributeNamestr)){
              this.attribute[index].AttributeNamestr = this.attribute[index].AttributeNamestr.split(',');
            }
          }
        });
      })
      this.editAttributeData = [...Data];
      resolve()
    })
  }

  postFormData = (dataToPost, type) => {
    const data = {
      editMode: this.openModel.editMode,
      data: dataToPost,
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


  searchFilter = () => {
    let input, filter, table, tr, tdArray, i, j, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("item-attribute-table");
    tr = table.getElementsByTagName("tr");
    loop1: for (i = 1; i < tr.length; i++) {
      tdArray = tr[i].getElementsByTagName("td");
      loop2: for (j = 2; j < (2 + this.masterData.Attributes.length); j++) {
       const innerTd = tdArray[j];
        if (innerTd) {
          txtValue = innerTd.textContent || innerTd.innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1 ) {
            tr[i].style.display = "table-row";
            break loop2;
          } else {
            tr[i].style.display = "none";
          }
        }     
      }
    }
  }
}
