import { ItemmasterServices } from 'src/app/commonServices/TransactionMaster/item-master.services';
import { ComboService } from './../item-combo/combo.service';
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import * as _ from 'lodash'
import { ToastrCustomService } from '../../../../commonServices/toastr.service';
import { GlobalService } from '../../../../commonServices/global.service';
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
  main: any
  mainAttributes: any
  mainAttrValues: any
  mainAttributeData: any
  mainOnFilter: any
  constructor(
    private comboService: ComboService,
    private _itemmasterServices: ItemmasterServices,
    private toastrService: ToastrCustomService,
    private gs: GlobalService
  ) {
  }

  ngOnInit() {
  }

  updateBarCode (i) {
    let attrComb = this.attribute[i]
    attrComb['Barcode'] = attrComb['ClientBarCode']
  }

  getBarCodes (length: number) {
    let _self = this
    this._itemmasterServices.getBarCodes(length).subscribe(
      (data) => {
        if (data) {
          let index = 0
          this.attribute.forEach((element) => {
            // console.log('this.idsChecked : ', this.idsChecked)
            if (this.idsChecked.indexOf(element.AttributeStr) === -1) {
              element['Barcode'] = data[index].BarCode
              element['ClientBarCode'] = data[index].BarCode
              index++
            }
          })
        }
        this.isLoading = false
      },
      (error) => {
        _self.toastrService.showError(error, '')
        this.isLoading = false
      }
    )
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.openModel)
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
    this.gs.manipulateResponse(this.comboService.getSPUtilityData()).subscribe(
      async (data) => {
        if (data) {
          console.log(data)
          this.masterData = data;
          this.mainAttributes = JSON.parse(JSON.stringify(this.masterData.Attributes))
          this.mainAttrValues = JSON.parse(JSON.stringify(this.masterData.AttributeValues))
          this.attribute = [];
          this.generateAttributes(data.Attributes)
          await this.generateCombination();
          await this.makeAttributeValueCombination();
          console.log('this.attribute : ', this.attribute)
          this.main = JSON.parse(JSON.stringify(this.attribute))
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
        this.toastrService.showError(error, '')
        console.log(error)
      }
    )
  }

  generateAttributes (attributes) {
    let newData = [{id: '0', text: 'Select Attribute'}]
    attributes.forEach((element) => {
      let obj = {id: element.Id, text: element.Name}
      newData.push(obj)
    })
    this.masterData['attrKeySelect2Data'] = newData
  }

  checkForLength () {
    let ids = this.attribute.map((attr) => attr.Id)
    let diff = _.differenceWith(ids, this.idsChecked)
    console.log(diff)
    this.getBarCodes(diff.length)
  }

  onAttrKeySelect (data: {value: string[], data: any}) {
    console.log('attr key select', data)
    if (data.value.length > 0) {
      this.attribute = []
      this.masterData.Attributes = []
      _.forEach((this.mainAttributes), (element) => {
        if (data.value.indexOf('' + element.Id) > -1) {
          this.masterData.Attributes.push(element)
          const data = _.filter(this.mainAttrValues, (attributeValue) => {
            if (attributeValue.AttributeId === element.Id) {
              return true;
            }
          })
          console.log(data)
          this.attribute.push(data);
        }
      })
      this.makeAttriComb()
    } else {
      // this.attribute = JSON.parse(JSON.stringify(this.main))
      // this.masterData.attributeData = JSON.parse(JSON.stringify(this.mainAttributeData))
      this.mainOnFilter = []
      this.getSPUtilityData()
    }
  }

  onAttrSelect (data: {value: string[], data: any}) {
    console.log('attr select', data)
    if (data.value.length > 0) {
      console.log(this.mainOnFilter)
      this.attribute = this.mainOnFilter.filter((element) => {
        if (data.value.indexOf('' + element.Id) > -1) {
          return element
        }
      })
      this.getBarCodes(this.attribute.length)
    } else {
      if (this.mainOnFilter && this.mainOnFilter.length > 0) {
        this.attribute = JSON.parse(JSON.stringify(this.mainOnFilter))
        this.getBarCodes(this.attribute.length)
      }
    }
  }

  makeAttriComb () {
    let newData = [{id: '0', text: 'Select Combination'}]
    const iterationtime = this.attribute.length - 1;
    if (iterationtime > 0) {
      for (let lastIndex = iterationtime; lastIndex > 0; lastIndex--) {
        let dummyArray = [];
        _.forEach(this.attribute[lastIndex - 1], (firstAttributeValue) => {
          _.forEach(this.attribute[lastIndex], (secondAttributeValue) => {
            const data = {
              Id: `${firstAttributeValue.Id},${secondAttributeValue.Id}`,
              Name: `${firstAttributeValue.Name},${secondAttributeValue.Name}`
            }
            let obj = {id: data.Id, text: data.Name}
            newData.push(obj);
            dummyArray.push(data);
          })
        })
        this.attribute[lastIndex - 1] = JSON.parse(JSON.stringify(dummyArray));
        this.attribute.pop();
      }
      this.attribute = JSON.parse(JSON.stringify(this.attribute[0]));
      this.masterData['attributeData'] = newData
      this.generateGroupId()
    } else {
      this.attribute = JSON.parse(JSON.stringify(this.attribute[0]));
      let newData = [{id: '0', text: 'Select Combination'}]
      this.attribute.forEach((element, index) => {
        console.log(element)
        let obj = {id: element.Id, text: element.Name}
        newData.push(obj)
        element.GroupId = index + 1
        element.AttributeStr = element.Id
        element.AttributeNamestr = element.Name.split(',')
        element.Checked = false
      })
      this.masterData['attributeData'] = newData
    }

    this.mainOnFilter = JSON.parse(JSON.stringify(this.attribute))
  }

  generateCombination = (val?) => {
    this.attribute = []
    return new Promise((resolve) => {
    _.forEach(this.masterData.Attributes, (attribute) => {
        const data = _.filter(this.masterData.AttributeValues, (attributeValue) => {
          if (attributeValue.AttributeId === attribute.Id) {
            return true;
          }
        })
        this.attribute.push(data);
      })
      console.log('this.attribute : ', this.attribute)
      resolve();
    })
  }

  makeAttributeValueCombination = () => {
    let newData = [{id: '0', text: 'Select Combination'}]
    return new Promise((resolve) => {
      console.log('this.attribute.length : ', this.attribute.length)
      const iterationtime = this.attribute.length - 1;
      if (iterationtime > 0) {
        for (let lastIndex = iterationtime; lastIndex > 0; lastIndex--) {
          let dummyArray = [];
          _.forEach(this.attribute[lastIndex - 1], (firstAttributeValue) => {
            _.forEach(this.attribute[lastIndex], (secondAttributeValue) => {
              const data = {
                Id: `${firstAttributeValue.Id},${secondAttributeValue.Id}`,
                Name: `${firstAttributeValue.Name},${secondAttributeValue.Name}`
              }
              let obj = {id: data.Id, text: data.Name}
              newData.push(obj)
              dummyArray.push(data);
            })
          })
          this.attribute[lastIndex - 1] = JSON.parse(JSON.stringify(dummyArray));
          this.attribute.pop();
        }
        this.attribute = JSON.parse(JSON.stringify(this.attribute[0]));
        this.masterData['attributeData'] = newData
        this.mainAttributeData = JSON.parse(JSON.stringify(newData))
      } else {
        this.attribute = JSON.parse(JSON.stringify(this.attribute[0]));
        this.attribute.forEach((element) => {
          let obj = {id: element.Id, text: element.Name}
          newData.push(obj)
        })
        this.masterData['attributeData'] = newData
      }
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
    this.main = []
    this.mainAttributes = []
    this.mainAttrValues = []
    this.mainAttributeData = []
    this.mainOnFilter = []
    $('#item-attribute-opening-stock').modal('show')
  }

  triggerCloseModel = (data?) => {
    this.closeModel.emit(data);
    $('#item-attribute-opening-stock').modal('hide')
  }

  generateGroupId = () => {
    console.log('this.attribute : ', this.attribute)
    _.map(this.attribute, (element, i) => {
      element.GroupId = i + 1
      element.AttributeStr = element.Id
      element.AttributeNamestr = element.Name.split(',')
      element.idStr = element.Id.split(',')
      element.Checked = false
    })
    console.log('attribute : ', this.attribute)
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
