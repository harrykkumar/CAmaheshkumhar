import { CommonService } from '../../../commonServices/commanmaster/common.services';
import { ToastrCustomService } from '../../../commonServices/toastr.service';
import { URLConstant } from './../../constants/urlconstant';
import { ComboService } from './../item-master/item-combo/combo.service';
import { Component, OnInit} from '@angular/core';
declare const $: any
import * as _ from 'lodash'
import { Router } from '@angular/router';
import { UIConstant } from '../../constants/ui-constant';
import { Subject } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
@Component({
  selector: 'app-opening-stk',
  templateUrl: './opening-stk.component.html',
  styleUrls: ['./opening-stk.component.css']
})
export class OpeningStkComponent implements OnInit {
  allChecked: boolean = false;
  isProgress: boolean;
  isLoading: boolean;
  isAttribute = false
  itemWithAttributeList:Array<any> = []
  dummyItemWithAttributeList:Array<any> = []
  masterItemData: any = {}
  public options: Select2Options
  selectedAttributeCombination: any = []
  attributeCombinationList: Array<any> = []
  masterData: any;
  attribute: Array<any> = [];
  editAttributeData: any[];
  attributeStoredList: any[];
  dummyItemDetails: any[];
  constructor(
    private comboService: ComboService,
    private router: Router,
    private commonService: CommonService,
    private toastrService: ToastrCustomService,
  ) { }

  ngOnInit() {
   this.initData();
  }

  initData = async () => {
    this.isProgress = true;
    this.options = {
      multiple: true,
      placeholder: 'Select Attribute Combination'
    }
    await this.getOpeningStkList()
    this.getSPUtilityData();
  }

  onAttributeCombinationChange = (event) => {
        this.isLoading = true;
        const dataList = _.map(event.data, 'data')
        if (dataList.length > 0) {
          this.mapItemAttributeList(dataList);
        } else {
          this.itemWithAttributeList = [...this.dummyItemDetails]
        }
  }


  mapItemAttributeList = async (Data) => {
    this.itemWithAttributeList = []
    const data = await this.generateItemAttributeCombination(Data);
    if (data) {
      this.itemWithAttributeList = JSON.parse(JSON.stringify(this.dummyItemWithAttributeList));
      // this.isLoading = false;
    }
  }
  
  generateItemAttributeCombination = (Data) => {
    return new Promise((resolve, reject) => {
      const itemData = _.map([...this.masterItemData.Data.ItemDetails], (element) => {
        return {
          'ItemName': element.ItemName,
          'ItemId': element.ItemId,
          'UnitName': element.UnitName
        }
      });
      const uniqueItemData = _.uniqBy(itemData, 'ItemId');
      this.dummyItemWithAttributeList = [];
      _.forEach([...uniqueItemData], (itemElement) => {
        _.forEach([...Data], (combinationElement) => {
          const data = {
            "Id": 0,
            "ItemId": itemElement.ItemId,
            "GroupId": 0,
            "Qty": 0,
            "QtyValue": 0,
            "Barcode": 0,
            "IsBaseGroup":0,
            "ItemName": itemElement.ItemName,
            "UnitName": itemElement.UnitName,
            "ClientBarCode": 0,
            "RateSale": 0,
            "RatePurchase": 0,
            "RateMrp": 0,
            "RateOur": 0,
            "RateNrv": 0,
            "AttributeIdStr": combinationElement.AttributeIdStr,
            "AttributeNamestr": [...combinationElement.AttributeNamestr]
          }
          this.dummyItemWithAttributeList.push(data);
        })
      })
      _.map(this.dummyItemWithAttributeList, (generateElement, index) => {
        _.forEach(this.masterItemData.Data.ItemDetails, (editElement) => {
          if ((generateElement.ItemId === editElement.ItemId) && (editElement.AttributeIdStr === generateElement.AttributeIdStr)) {
            this.dummyItemWithAttributeList[index] = { ...editElement };
            if (_.isString(this.dummyItemWithAttributeList[index].AttributeNamestr)) {
              this.dummyItemWithAttributeList[index].AttributeNamestr = this.dummyItemWithAttributeList[index].AttributeNamestr.split(',')
            }
          }
        });
      })
      resolve(this.itemWithAttributeList)
    })
  }


  getSPUtilityData = () => {
    this.comboService.getSPUtilityData().subscribe(
      async (data) => {
        if (data.Code === UIConstant.THOUSAND && data.Data) {
          this.masterData = data.Data;
          this.itemWithAttributeList = [...this.masterItemData.Data.ItemDetails]
          if (this.masterData && this.masterData.Attributes && this.masterData.Attributes.length > 0) {
            this.isAttribute = true;
            _.map(this.itemWithAttributeList, (item) => {
              if (item.AttributeNamestr) {
                item.AttributeNamestr = item.AttributeNamestr.split(',');
              } else {
                item.AttributeNamestr = []
                _.forEach(this.masterData.Attributes, (element) => {
                  item.AttributeNamestr.push("");
                })
              }
            })
            this.dummyItemDetails = [...this.itemWithAttributeList];
          }
          this.attribute = [];
          await this.generateCombination();
          await this.makeAttributeValueCombination();

          this.isProgress = false
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }

  mapAttributeCombinationList = (data) => {
    const localData = _.map([...data], (element) => {
      element.AttributeNamestr = element.Name;
      element.AttributeIdStr = element.Id;
      return {
        id : element.AttributeIdStr.replace(/,/g, '--'),
        text : element.AttributeNamestr.replace(/,/g, '--'),
        data : element
      }
    })
    this.attributeCombinationList = [{ id: 0, text: 'Select Attribute Combination' }, ...localData]
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
      this.mapAttributeCombinationList(this.attribute);
      this.generateGroupId();
      resolve();
    });
  }

  triggerModelOpen() {
    $('#opening-stk').modal('show')
    $('#opening-stk').modal({
      keyboard: false
    })
  }

  generateGroupId = () => {
    _.map(this.attribute, (element, i) => {
      element.GroupId = i + 1
      element.AttributeIdStr = element.Id
      element.AttributeNamestr = element.Name.split(',')
      element.Checked = false
    })
  }

  checkAllItem = (event) => {
    _.map(this.itemWithAttributeList, (element) => {
      element.Checked = event.target.checked
    })
  }

  preparePayloadToSave = (dataToMap) => {
    return new Promise((resolve, reject) => {
      const Data = _.filter(dataToMap, (element) => {
        if (element.Checked === true) {
          return true
        }
      });
      const data = _.map(Data, (element) => {
        return {
          "ID": element.Id ? element.Id : 0,
          "ParentTypeId": element.ParentTypeId ? element.ParentTypeId : 0,
          "AttributeId": element.AttributeId ? element.AttributeId : 0,
          "Barcode": element.Barcode ? element.Barcode : 0,
          "ClientBarCode": element.ClientBarCode ? element.ClientBarCode : 0,
          "GroupId": element.GroupId,
          "IsBaseGroup": element.IsBaseGroup ? element.IsBaseGroup : 0,
          "ItemId": element.ItemId ? element.ItemId : 0,
          "ItemName": element.ItemName ? element.ItemName : 0,
          "ItemTransId": element.ItemTransId ? element.ItemTransId : 0,
          "Qty": element.Qty ? element.Qty : 0,
          "QtyValue": element.QtyValue ? element.QtyValue : 0,
          "RateMrp": element.RateMrp ? element.RateMrp : 0,
          "RateNrv": element.RateNrv ? element.RateNrv : 0,
          "RateOur": element.RateOur ? element.RateOur : 0,
          "RatePurchase": element.RatePurchase ? element.RatePurchase : 0,
          "RateSale": element.RateSale ? element.RateSale : 0,
          "AttributeStr": element.AttributeIdStr ? element.AttributeIdStr : 0,
        }
      })
      resolve(data);
    })
  }

  cancelForm = () => {
    $('#opening-stk').modal('hide')
    this.itemWithAttributeList = [...this.dummyItemDetails]
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

  getOpeningStkList = () => {
    return new Promise((resolve, reject) => {
      this.commonService.getOpeningStkList().subscribe((response: any) => {
        this.masterItemData = { ...response };
        resolve(this.masterItemData)
      });
    })
  }

  postFormData = async (Data) => {
    const postData = await this.preparePayloadToSave(Data);
    const requestData = {ItemAttributewithrates : postData};
    this.commonService.postOpeningStkList(requestData).subscribe((data) => {
     if (data.Code === UIConstant.THOUSAND) {
       this.toastrService.showSuccess('Success','Saved Successfully')
        this.initData();
     } else {
       this.toastrService.showError('Error in Posting Data', 'error');
       $('#opening-stk').modal('hide')
     }
     this.cancelForm()
    })
   }

   toggleSearch(){
     
   }
}
