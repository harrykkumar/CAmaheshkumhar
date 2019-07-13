import { Settings } from './../../../shared/constants/settings.constant';
import { UIConstant } from './../../../shared/constants/ui-constant';
import { ToastrCustomService } from './../../../commonServices/toastr.service';
import { Component, OnInit, AfterViewInit, EventEmitter, Output, ViewChild } from '@angular/core';
declare var $: any
import * as _ from 'lodash'
import { ItemRequirementService } from '../item-requirement.service';
import { promise } from 'protractor';
import { GlobalService } from 'src/app/commonServices/global.service';
@Component({
  selector: 'app-item-requirement',
  templateUrl: './item-requirement.component.html',
  styleUrls: ['./item-requirement.component.css']
})
export class ItemRequirementComponent implements OnInit {
  @Output() triggerCloseModal = new EventEmitter();
  @ViewChild('itemRequirementForm') itemRequirementFormModal  
  model: any = {}
  values: any = []
  item: Array<any> = [];
  items: Array<any> = [];
  categoryList: Array<any> = [];
  instructionList: Array<any> = [];
  units: Array<any> = [];
  storedItems: Array<any> = [];
  AttributeValue_1: Array<any> = [];
  AttributeValue_2: Array<any> = [];
  attributeWithValues: Array<any> = [];
  storedAttributeValues: Array<any> = [];
  editMode: boolean;
  constructor(
    private _itemRequirementService: ItemRequirementService,
    private _toaster: ToastrCustomService,
    private gb: GlobalService,
    private setting: Settings
  ) {
    this.model.type = 'item'
    this.getItemRequirements()
  }

  resetForm() {
    // this.model.type = 'item'
    this.model.parentItemValue = 0
    this.model.OnDate = ''
    this.values = []
    this.editMode = false
    this.mapDummyModal()
    this.itemRequirementFormModal.resetForm()
  }

  async ngOnInit() {
    this.instructionList = await this._itemRequirementService.getInstructionListData()
  }

  openModal(data?) {
    if (!_.isEmpty(data) && data.ParentId) {
      this.editMode = true
      this.getItemRequirementsById(data)
    }
    $('#item_requirement_form').modal({ backdrop: 'static', keyboard: false })
    $('#item_requirement_form').modal(UIConstant.MODEL_SHOW)
  }

  getItemRequirementsById(item){
    const requestData = {
      ParentId: item.ParentId,
      ParentTypeId: item.ParentTypeId
    }
    this._itemRequirementService.getItemDetailsById(requestData).subscribe((res) => {
      if(res.Code === 1000) {
       const itemIdArray =  _.uniq(_.map(res.Data.itemAttributesTrans, 'ItemId'))
        if (!_.isEmpty(itemIdArray) && itemIdArray.length > 0) {
          this.values = []
          this.model.type = res.Data.ItemRequirements[0].ParentTypeId === 15 ?  'item' : 'style'
          this.model.parentItemValue = res.Data.ItemRequirements[0].ParentId
          this.model.OnDate = this.gb.utcToClientDateFormat(res.Data.ItemRequirements[0].OnDate, this.setting.dateFormat) 
          _.forEach(itemIdArray, (id) => {
            const columnArray = _.filter(res.Data.itemAttributesTrans, { ItemId: id })
            this.mapDummyModal(columnArray)
          })
        }
      }
    })
  }

  closeModal() {
    $('#item_requirement_form').modal(UIConstant.MODEL_HIDE)
    this.resetForm()
  }

  getItemRequirements() {
    this._itemRequirementService.getItemRequirement().subscribe((res) => {
      this.categoryList = [{ id: 0, text: 'Select Category' }, ...res.ItemCategorys]
      this.storedItems = [{ id: 0, text: 'Select Items' }, ...res.Items]
      if (res.Attributes && res.Attributes.length === 1) {
        this.AttributeValue_1 = [..._.filter([...res.AttributeValues], { AttributeId: res.Attributes[0]['Id'] })]
      } else if (res.Attributes && res.Attributes.length === 2) {
        _.forEach(res.Attributes, (item) => {
          if (item.IsRequired) {
            this.AttributeValue_1 = [..._.filter([...res.AttributeValues], { AttributeId: item['Id'] })]
          } else {
            const attributeValues = [..._.filter([...res.AttributeValues], { AttributeId: item['Id'] })]
            this.AttributeValue_2 = [...attributeValues]
            const demoArray = _.map([...this.AttributeValue_2], (dummyItem) => {
              return {
                id: dummyItem.Id,
                text: dummyItem.Name
              }
            })
            this.storedAttributeValues = [{ id: 0, text: 'Select Attribute Value' }, ...demoArray]
          }
        })
      }
      this.mapDummyModal()
    })
  }

  addRow(index) {
    this.mapDummyModal()
  }

 async mapDummyModal(columnItemArray?) {
    const objArray = []
    _.forEach(this.AttributeValue_1, (columnItem, i) => {
      if (!_.isEmpty(columnItemArray)) {
       const obj = {
          categoryValue: columnItemArray[0].CategoryId,
          instructionValue: columnItemArray[0].InstructionId,
          itemValue: columnItemArray[0].ItemId,
          unitValue: columnItemArray[0].UnitId,
          Sno: 0,
          Id: 0,
          quantity: null,
          columnAttributeId: columnItem.Id,
          rowAttributeId: 0,
          ItemTransId: 0
        }
        const matchedColumnAttributeIndex = _.findIndex(columnItemArray, { AttributeId: columnItem.Id })
        if (matchedColumnAttributeIndex!== -1 && columnItemArray[matchedColumnAttributeIndex].AttributeGroupId === this.AttributeValue_1[0].AttributeId) {
          obj['Sno'] = columnItemArray[matchedColumnAttributeIndex].Sno
          obj['Id'] = columnItemArray[matchedColumnAttributeIndex].Id
          obj['quantity'] = columnItemArray[matchedColumnAttributeIndex].Qty
          obj['columnAttributeId'] = columnItemArray[matchedColumnAttributeIndex].AttributeId
          obj['ItemTransId'] = columnItemArray[matchedColumnAttributeIndex].ItemTransId
        }
        const matchedRowAttributeIndex = _.findIndex(columnItemArray, { AttributeGroupId: this.AttributeValue_2[0].AttributeId })
        if (matchedRowAttributeIndex!== -1) {
          obj['rowAttributeId'] = columnItemArray[matchedRowAttributeIndex].AttributeId
        }
        objArray.push({ ...obj })
      } else if (_.isEmpty(columnItemArray)) {
      const  obj = {
          categoryValue: 0,
          instructionValue: 0,
          itemValue: 0,
          unitValue: 0,
          Sno: 0,
          Id: 0,
          quantity: null,
          columnAttributeId: columnItem.Id,
          rowAttributeId: 0,
          ItemTransId: 0
        }
        objArray.push({ ...obj })
      }
    })
    const filteredItems = _.filter(this.storedItems, { CategoryId: Number(objArray[0].categoryValue) })
    const filteredUnits = await this._itemRequirementService.getUnitByItemId(Number(objArray[0].itemValue))
    const obj1 = {
      items: _.isEmpty(columnItemArray) ? [{ id: 0, text: 'Select Item' }] : [{ id: 0, text: 'Select Item' }, ...filteredItems],
      units: _.isEmpty(columnItemArray) ? [{ id: 0, text: 'Select Unit' }] : [...filteredUnits],
      selectCategoryValue: objArray[0].categoryValue,
      selectInstructionValue: objArray[0].instructionValue,
      selectAttributeValue: objArray[0].rowAttributeId,
      selectItemValue: objArray[0].itemValue,
      selectUnitValue: objArray[0].unitValue,
      quantityArray: [...objArray]
    }
    this.values.push(JSON.parse(JSON.stringify(obj1)))
  }

  onParentItemChange(event) {
    this.model.selectedParentItemId = Number(event.value)
  }

  onCategoryChange(event, index) {
    const data = _.filter(this.storedItems, { CategoryId: Number(event.value) })
    this.values[index]['items'] = [{ id: 0, text: 'Select Item' }, ...data]
  }

  async onItemChange(event, index) {
    _.forEach(this.values[index]['quantityArray'], (element, j) => {
      element['itemValue'] = Number(event.value)
    })
    this.values[index]['units'] = await this._itemRequirementService.getUnitByItemId(Number(event.value))
  }

  onInstructionChange(event, index) {
    _.forEach(this.values[index]['quantityArray'], (element, j) => {
      element['instructionValue'] = Number(event.value)
    })
  }

  onAttributeChange(event, index) {
    _.forEach(this.values[index]['quantityArray'], (element, j) => {
      element['rowAttributeId'] = Number(event.value)
    })
  }

  onUnitChange(event, index) {
    _.forEach(this.values[index]['quantityArray'], (element, j) => {
      element['unitValue'] = Number(event.value)
    })
  }

  preparePayLoad() {
    return {
      OnDate: this.gb.utcToClientDateFormat(this.model.OnDate, 'm/d/Y'),
      ParentId: this.model.selectedParentItemId ? this.model.selectedParentItemId : 0,
      ParentTypeId: this.model.type === 'item' ? 15 : 23,
      ItemTrans: this.mapdummyItemTrans(),
      ItemAttributeTransLists: this.mapDummyItemAttributesTransDetails()
    }
  }

  mapdummyItemTrans() {
    const itemTrans = []
    let sno = 1
    _.forEach(this.values, (rowItem, i) => {
      _.forEach(rowItem['quantityArray'], (columnItem, j) => {
        if (columnItem.quantity) {
          const obj = {
            Sno: this.editMode ?  columnItem.Sno : sno,
            Id: this.editMode ?  columnItem.Id : 0,
            ItemId: columnItem.itemValue,
            UnitId: columnItem.unitValue,
            InstructionId: columnItem.instructionValue,
            Qty: columnItem.quantity,
            ParentId: this.model.selectedParentItemId ? this.model.selectedParentItemId : 0,
            ParentTypeId: this.model.type === 'item' ? 15 : 23
          }
          itemTrans.push(obj)
          sno = sno + 1
        }
      })
    })
    return itemTrans
  }

  mapDummyItemAttributesTransDetails() {
    const itemAttributesTransDetails = []
    let sno = 1
    _.forEach(this.values, (rowItem, i) => {
      _.forEach(rowItem['quantityArray'], (columnItem, j) => {
        if (columnItem.quantity) {
          const obj = {
            Sno: this.editMode ?  columnItem.Sno : sno,
            Id: this.editMode ?  columnItem.Id : 0,
            AttributeId: columnItem.columnAttributeId,
            ItemTransId: this.editMode ? columnItem.ItemTransId : sno, // same as sno.
            Qty: columnItem.quantity,
            ItemId: columnItem.itemValue
          }
          itemAttributesTransDetails.push(obj)
          if (!_.isEmpty(this.storedAttributeValues) && this.storedAttributeValues.length > 1) {
            const obj1 = {
              Sno: this.editMode ?  columnItem.Sno : sno,
              Id: this.editMode ?  columnItem.Id : 0,
              AttributeId: columnItem.rowAttributeId,
              ItemTransId: this.editMode ?  columnItem.ItemTransId : sno,
              Qty: columnItem.quantity,
              ItemId: columnItem.itemValue
            }
            itemAttributesTransDetails.push(obj1)
          }
          sno = sno + 1
        }
      })
    })
    return itemAttributesTransDetails
  }

  postItemRequireData() {
    const requestData = this.preparePayLoad()
    this._itemRequirementService.postItemRequirementDat(requestData).subscribe((res) => {
      if (res.Code === 1000) {
        this._toaster.showSuccess('Success', res.Description);
        this.closeModal();
        this.triggerCloseModal.emit();
      } else {
        this._toaster.showError('Error', res.Message)
      }
    })
  }

  validateForm() {
    let valid = true
    if (!this.model.selectedParentItemId) {
      valid = false
    } else if (!this.model.OnDate) {
      valid = false
    }
    return valid;
  }
}
