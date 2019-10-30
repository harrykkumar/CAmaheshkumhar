import { ToastrCustomService } from './../../../commonServices/toastr.service';
import { ViewChild, EventEmitter, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
declare var $: any
import * as _ from 'lodash'
import { UIConstant } from 'src/app/shared/constants/ui-constant';
import { CommonService } from '../../../commonServices/commanmaster/common.services';

@Component({
  selector: 'app-attribute-combination',
  templateUrl: './attribute-combination.component.html',
  styleUrls: ['./attribute-combination.component.css']
})
export class AttributeCombinationComponent implements OnInit {
  @Output() triggerCloseModal = new EventEmitter();
  @ViewChild('attributeCombineForm') attributeCombineFormModal
  attributeWithValuesList: Array<any> = []
  sizeAttributeValueList: Array<any> = []
  combineAttributeList: Array<any> = []
  arrayToIterate: Array<any> = []
  buyerFormData:any = {}
  options = {
    multiple: true
  }
  constructor(
    private _toaster: ToastrCustomService, private _cs: CommonService
  ) {
  }

  ngOnInit() {
  }

  onAttributeValueChange(event, index){
    this.attributeWithValuesList[index]['attributeId'] = [...event.value]
    this.arrayToIterate[index] = [...event.data]
    this.mapCombineArrayList()
  }

  mapCombineArrayList() {
    this.combineAttributeList = []
    _.forEach(this.arrayToIterate, (element, index) => {
      if (!_.isEmpty(element) && element.length > 0) {
        this.combineAttributeList = [...this.combineAttributeList, [...element]]
      }
    })
    this.mapAttributeCombination()
  }

  getUtilityItemList(res) {
    // console.log('res.Data.Attributes : ', res)
    const sizeAttributeIndex = _.findIndex(res.Attributes, {IsRequired : true})
    if(sizeAttributeIndex >= 0) {
      this.sizeAttributeValueList = _.filter(res.AttributeValues, 
        { AttributeId: res.Attributes[sizeAttributeIndex].Id })
      res.Attributes.splice(sizeAttributeIndex, 1)
    }
    this.attributeWithValuesList = _.map(res.Attributes, (element) => {
      const valueList = _.map(_.filter(res.AttributeValues, { AttributeId: element.Id }), (attributeValue) => {
        return {
          id: attributeValue.Id,
          text: attributeValue.Name
        }
      })
      return {
        Name: element.Name,
        IsRequired: element.IsRequired,
        attributeValue: [],
        attributeValueList: [...valueList]
      }
    })
    // console.log('attributeWithValuesList : ', this.attributeWithValuesList)
    if (this.attributeWithValuesList.length === 1) {
      this.combineAttributeList = [...this.attributeWithValuesList[0].attributeValueList]
      this.mapValuesModal()
    }
  }

  mapAttributeCombination() {
    const iterationtime = this.combineAttributeList.length - 1;
    if (!iterationtime) {
      this.combineAttributeList = _.map(this.combineAttributeList[0], (attributeValue) => {
        return {
          id: attributeValue.id,
          text: attributeValue.text
        }
      });
    } else {
      for (let lastIndex = iterationtime; lastIndex > 0; lastIndex--) {
        let dummyArray = [];
          _.forEach(this.combineAttributeList[lastIndex - 1], (firstAttributeValue) => {
            _.forEach(this.combineAttributeList[lastIndex], (secondAttributeValue) => {
              const data = {
                id: `${firstAttributeValue.id}-${secondAttributeValue.id}`,
                text: `${firstAttributeValue.text}-${secondAttributeValue.text}`,
              }
              dummyArray.push(data);
            })
          })
          this.combineAttributeList[lastIndex - 1] = JSON.parse(JSON.stringify(dummyArray));
          this.combineAttributeList.pop();
      }
      if (!_.isEmpty(this.combineAttributeList[0]))
        this.combineAttributeList = JSON.parse(JSON.stringify(this.combineAttributeList[0]));
    }
    this.mapValuesModal()
  }

  mapValuesModal() {
    _.forEach(this.combineAttributeList, (element, i) => {
      this.combineAttributeList[i]['values'] = _.map(this.sizeAttributeValueList, (sizeAttribute) => {
        return {
          attributeCombinationId: element.id,
          attributeCombinationName: element.text,
          sizeAttributeId: sizeAttribute.Id,
          sizeAttributeName: sizeAttribute.Name,
          Qty: null
        }
      })
    })
    this._cs.fixTableHF('cat-table')
  }

  postData(){
    let _combineAttributeList = JSON.parse(JSON.stringify(this.combineAttributeList))
    this.triggerCloseModal.emit(_combineAttributeList)
    this.resetForm()
    $('#attribute_combine_form').modal(UIConstant.MODEL_HIDE)
  }
  
  validateForm(){
    let i = 0
    _.forEach(this.combineAttributeList, (element) => {
      _.forEach(element['values'], (item) => {
        i = i + +item.Qty
      })
    })
    this.buyerFormData['productionQty'] = Math.round(this.buyerFormData['productionQty'])
    if(i < this.buyerFormData['productionQty']){
      this._toaster.showError('', 'Qty is less than Production Qty ' + this.buyerFormData['productionQty'])
      return false
    } else if (i === +this.buyerFormData['productionQty']) {
      return true
    } else {
      this._toaster.showError('', 'Qty is more than Production Qty ' + this.buyerFormData['productionQty'])
      return false
    }
  }

  resetForm() {
    _.forEach(this.attributeWithValuesList, (element) => {
      element['attributeValue'] = []
    })
    // this.combineAttributeList = []
    // this.arrayToIterate = []
    this.attributeCombineFormModal.resetForm()
  }

  openModal(Data?) {
    $('#attribute_combine_form').modal({ backdrop: 'static', keyboard: false })
    $('#attribute_combine_form').modal(UIConstant.MODEL_SHOW)
    this.buyerFormData = {...Data}
  }
}
