import { ItemmasterServices } from 'src/app/commonServices/TransactionMaster/item-master.services';
import { UIConstant } from 'src/app/shared/constants/ui-constant';
import { ComboService } from './../item-combo/combo.service';
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import * as _ from 'lodash'
import { ToastrCustomService } from '../../../../commonServices/toastr.service';
import { map } from 'rxjs/internal/operators';
declare const $: any
@Component({
  selector: 'app-item-attribute-opening-stock',
  templateUrl: './item-attribute-opening-stock.component.html',
  styleUrls: ['./item-attribute-opening-stock.component.css']
})
export class ItemAttributeOpeningStockComponent implements OnInit {
  masterData: any;
  attribute: Array<any> = [];
  allChecked: boolean = false;
  @Input('toggleValue') openModel;
  @Output() closeModel = new EventEmitter<any>()
  editAttributeData: any[];
  isLoading: boolean = true
  constructor(
    private comboService: ComboService,
    private _itemmasterServices: ItemmasterServices,
    private toastrService: ToastrCustomService
  ) { }

  ngOnInit() {
  }

  getBarCodes (length: number) {
    let _self = this
    this._itemmasterServices.getBarCodes(length).pipe(
      map((data: any) => {
        console.log('barcodes : ', data)
        if (data.length > 0) {
          let index = 0
          this.attribute.forEach((element) => {
            if (this.idsChecked.indexOf(element.AttributeStr) === -1) {
              element['Barcode'] = data[index].BarCode
              element['ClientBarCode'] = data[index].BarCode
              index++
            }
          })
          return this.attribute
        }
      })
    ).subscribe(
      (data) => {
        this.attribute = data
        this.isLoading = false
      },
      (error) => {
        _self.toastrService.showError(error, '')
        this.isLoading = false
      }
    )
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.openModel)
    if (!_.isEmpty(this.openModel)) {
      this.triggerModelOpen();
      this.idsChecked = []
      if (this.openModel.editMode) {
        this.getIds(this.openModel.data)
        this.getSPUtilityData();
      } else {
        if (!_.isEmpty(this.openModel.data)) {
          console.log('this.openModel.data : ', this.openModel.data)
          this.initFormData(this.openModel.data);
        } else {
          this.getSPUtilityData();
        }
      }
    } else {
      return;
    }
  }

  idsChecked = []
  getIds (data) {
    if (!_.isEmpty(data)) {
      let ids = data.map((elem) => elem.AttributeStr)
      this.idsChecked = ids
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
          if (!_.isEmpty(this.idsChecked)) {
            this.checkForLength()
          } else {
            this.getBarCodes(this.attribute.length)
          }
          if (this.openModel.editMode === true && !_.isEmpty(this.openModel.data)) {
            await this.initFormData(this.openModel.data);
          }
        }
      },
      (error) => {
        this.isLoading = false
        console.log(error)
      }
    )
  }

  checkForLength () {
    let ids = this.attribute.map((attr) => attr.Id)
    let diff = _.differenceWith(ids, this.idsChecked)
    console.log(diff)
    this.getBarCodes(diff.length)
  }

  generateCombination = () => {
    return new Promise((resolve) => {
      _.forEach(this.masterData.Attributes, (attribute) => {
        const data = _.filter(this.masterData.AttributeValues, (attributeValue) => {
          if (attributeValue.AttributeId === attribute.Id) {
            return true;
          }
        })
        this.attribute.push(data);
      });
      console.log('this.attribute : ', this.attribute)
      resolve();
    })
  }

  makeAttributeValueCombination = () => {
    return new Promise((resolve) => {
      const iterationtime = this.attribute.length - 1;
      for (let lastIndex = iterationtime; lastIndex > 0; lastIndex--) {
        let dummyArray = [];
        _.forEach(this.attribute[lastIndex - 1], (firstAttributeValue) => {
          _.forEach(this.attribute[lastIndex], (secondAttributeValue) => {
            const data = {
              Id: `${firstAttributeValue.Id},${secondAttributeValue.Id}`,
              Name: `${firstAttributeValue.Name},${secondAttributeValue.Name}`
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

  updateEditValues () {
    if (!_.isEmpty(this.openModel.data)) {
      let ids = this.openModel.data.map((elem) => elem.AttributeStr)
      if (!_.isEmpty(this.openModel.data)) {
        this.attribute.forEach((element) => {
          const index = ids.indexOf(element.AttributeStr)
          if (index > -1) {
            element = this.openModel.data[index]
          }
        })
      }
      console.log('updated attribute data : ', this.attribute)
    }
  }

  triggerModelOpen() {
    $('#item-attribute-opening-stock').modal('show')
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
      this.isLoading = false
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
    if (+this.attribute[index].RatePurchase > 0 && +this.attribute[index].Qty > 0) {
      this.attribute[index].QtyValue = (this.attribute[index].Qty * this.attribute[index].RatePurchase).toFixed(2);
    } else if (+this.attribute[index].QtyValue > 0 && +this.attribute[index].RatePurchase > 0) {
      this.attribute[index].Qty = (this.attribute[index].QtyValue / this.attribute[index].RatePurchase).toFixed(2);
    }
  }

  onOpeningStockChange = (index) => {
    if (+this.attribute[index].RatePurchase > 0 && +this.attribute[index].Qty > 0) {
      this.attribute[index].QtyValue = (this.attribute[index].Qty * this.attribute[index].RatePurchase).toFixed(2);
    } else if (+this.attribute[index].QtyValue > 0 && +this.attribute[index].Qty > 0) {
      this.attribute[index].RatePurchase = (this.attribute[index].QtyValue / this.attribute[index].Qty).toFixed(2);
    }
  }

  onOpeningStockValueChange = (index) => {
    if (+this.attribute[index].Qty > 0 && +this.attribute[index].QtyValue > 0) {
      this.attribute[index].RatePurchase = (this.attribute[index].QtyValue / this.attribute[index].Qty).toFixed(2)
    } else if (+this.attribute[index].RatePurchase > 0 && +this.attribute[index].QtyValue > 0) {
      this.attribute[index].Qty = (this.attribute[index].QtyValue / this.attribute[index].RatePurchase).toFixed(2)
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
    for (i = 1; i < tr.length; i++) {
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
