import { Settings } from './../../../shared/constants/settings.constant';
import { UIConstant } from './../../../shared/constants/ui-constant';
import { ToastrCustomService } from './../../../commonServices/toastr.service';
import { Component, OnInit, EventEmitter, Output, ViewChild, Renderer2 } from '@angular/core';
declare var $: any
import * as _ from 'lodash'
import { ItemRequirementService } from '../item-requirement.service';
import { GlobalService } from 'src/app/commonServices/global.service';
import { SetUpIds } from '../../../shared/constants/setupIds.constant';
import { Subscription } from 'rxjs';
import { Select2Component } from 'ng2-select2';
import { CommonService } from '../../../commonServices/commanmaster/common.services';
import { AddCust } from '../../../model/sales-tracker.model';
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
  
  destroy$: Subscription
  masterData: any = {}
  rowData: any = []

  editItemId: number = -1
  editItemSno: number = 0
  validItem: boolean = true
  clickItem = false
  showHideItem = false
  ItemRequirements: any = []
  ItemAttributeTransLists: any = []
  itemReq: any = {}
  invalidObj: any = {}
  submitSave = false
  addNewFor = ''
  isAddNew = false
  constructor(
    private _irs: ItemRequirementService,
    private _ts: ToastrCustomService,
    private _gs: GlobalService,
    private setting: Settings,
    private _cs: CommonService,
    private renderer: Renderer2
  ) {
    this.destroy$ = this._irs.select2List$.subscribe((data: any) => {
      // console.log(data)
      if (data.data && data.title) {
        if (data.title === 'Unit') {
          let arr = data.data
          arr.splice(0, 1)
          arr.unshift({
            id: -1,
            text: UIConstant.ADD_NEW_OPTION
          })
          arr.unshift({
            id: 0,
            text: 'Select Unit'
          })
          this.masterData['unitData'] = arr
        } else if (data.title === 'Category') {
          this.masterData['categoryData'] = data.data
        } else if (data.title === 'Instruction') {
          this.masterData['instructionData'] = data.data
        } else if (data.title === 'Item') {
          let arr = data.data
          arr.splice(0, 1)
          arr.unshift({
            id: -1,
            text: UIConstant.ADD_NEW_OPTION
          })
          arr.unshift({
            id: 0,
            text: 'Select item'
          })
          this.masterData['itemData'] = arr
          this.masterData['parentItemData'] = arr
        }
      }
    })

    this.destroy$ = this._irs.attr$.subscribe((data: any) => {
      // console.log(data)
      if (data.default && data.combos) {
        this.masterData['defaultAttr'] = data.default
        this.masterData['comboFor'] = data.combos
      }
    })
    this._cs.getCompositeUnitStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.masterData.unitData)
          newData.push({ id: +data.id, text: data.name })
          this.masterData.unitData = newData
          if ((this.isAddNew && this.addNewFor === 'child') || !this.isAddNew) {
            this.masterData.unitValue = data.id
            this.itemReq.unitName = data.name
            if (!this.isAddNew) {
              setTimeout(() => {
                if (this.unitSelect2) {
                  const element = this.renderer.selectRootElement(this.unitSelect2.selector.nativeElement, true)
                  element.focus({ preventScroll: false })
                }
              }, 2000)
            }
          }
        }
      }
    )

    this._cs.getUnitStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.masterData.unitData)
          newData.push({ id: +data.id, text: data.name })
          this.masterData.unitData = newData
          if ((this.isAddNew && this.addNewFor === 'child') || !this.isAddNew) {
            this.masterData.unitValue = data.id
            this.itemReq.unitName = data.name
            if (!this.isAddNew) {
              setTimeout(() => {
                if (this.unitSelect2) {
                  const element = this.renderer.selectRootElement(this.unitSelect2.selector.nativeElement, true)
                  element.focus({ preventScroll: false })
                }
              }, 2000)
            }
          }
        }
      }
    )

    this._cs.getItemMasterStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name && data.categoryId) {
          let newData = Object.assign([], this.masterData.itemData)
          newData.push({ id: data.id, text: data.name })
          this.masterData.itemData = Object.assign([], newData)
          this.masterData.parentItemData = Object.assign([], newData)
          this.masterData.allItems.push({
            Id: +data.id,
            Name: data.name,
            CategoryId: +data.categoryId
          })
          if (this.addNewFor === 'child') {
            this.itemReq.childItemValue = +data.id
          }
          console.log('from iem : ', this.itemReq.childItemValue)
          setTimeout(() => {
            if (this.addNewFor === 'parent') {
              this.model.parentItemValue = +data.id
              if (this.itemParentSelect2) {
                const element = this.renderer.selectRootElement(this.itemParentSelect2.selector.nativeElement, true)
                element.focus({ preventScroll: false })
              }
            }
            this.isAddNew = false
          }, 2000)
        }
      }
    )

    this.destroy$ = this._cs.getCategoryStatus().subscribe((data) => {
      console.log(data)
      if (data.id && data.name) {
        let newData = Object.assign([], this.masterData.categoryData)
        newData.push({ id: +data.id, text: data.name })
        this.masterData.categoryData = newData
        console.log(this.isAddNew)
        if (this.isAddNew && this.addNewFor === 'child') {
          this.masterData.categoryValue = +data.id
          this.itemReq.CategoryId = +data.id
          this.itemReq.categoryName = data.name
        }
      }
    })
    this.model.type = 'item'
    this.getSetUpModules((JSON.parse(this.setting.moduleSettings).settings))
    this.getItemRequirements()
  }

  resetForm() {
    this.isAddNew = false
    this.addNewFor = ''
    this.model.parentItemValue = 0
    this.model.OnDate = ''
    this.initItem()
    this.values = []
    this.editMode = false
    this.ItemRequirements = []
    this.ItemAttributeTransLists = []
    this.itemReq = {}
    this.invalidObj = {}
    this.submitSave = false
    this.itemRequirementFormModal.resetForm()
  }

  async ngOnInit() {
    this.instructionList = await this._irs.getInstructionListData()
  }

  openModal(data?) {
    this.showHideItem = true
    if (!_.isEmpty(data) && data.ParentId) {
      this.editMode = true
      this.getItemRequirementsById(data)
    }
    this.initItem()
    $('#item_requirement_form').modal({ backdrop: 'static', keyboard: false })
    $('#item_requirement_form').modal(UIConstant.MODEL_SHOW)
  }

  defaultMeasuring: any
  requirementAttrs: any
  toShowAttrs: boolean
  clientDateFormat: string = ''
  unitSettingType = 1
  getSetUpModules(settings) {
    settings.forEach(element => {
      if (element.id === SetUpIds.defaultMesurementUnit) {
        this.defaultMeasuring = +element.val
        this.toShowAttrs = (+element.val > 0) ? true : false
      }
      if (element.id === SetUpIds.AttributeForRequirement) {
        this.requirementAttrs = element.val
      }
      if (element.id === SetUpIds.dateFormat) {
        this.clientDateFormat = element.val[0].Val
      }
      if (element.id === SetUpIds.unitType) {
        this.unitSettingType = +element.val
      }
    })
    console.log('defaultMeasuring : ', this.defaultMeasuring)
    console.log('requirementAttributes : ', this.requirementAttrs)
  }

  getItemRequirementsById(item){
    const requestData = {
      ParentId: item.ParentId,
      ParentTypeId: item.ParentTypeId
    }
    this._irs.getItemDetailsById(requestData).subscribe((res) => {
      if(res.Code === UIConstant.THOUSAND) {
       const itemIdArray =  _.uniq(_.map(res.Data.itemAttributesTrans, 'ItemId'))
        if (!_.isEmpty(itemIdArray) && itemIdArray.length > 0) {
          this.values = []
          this.model.type = res.Data.ItemRequirements[0].ParentTypeId === 15 ?  'item' : 'style'
          this.model.parentItemValue = res.Data.ItemRequirements[0].ParentId
          this.model.OnDate = this._gs.utcToClientDateFormat(res.Data.ItemRequirements[0].OnDate, this.setting.dateFormat) 
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
    this._irs.getItemRequirement().subscribe((res) => {
      console.log(res)
      this.masterData.allItems = res.Items
      this._irs.checkForAttrsCombos(this._irs.generateAttrs(res.AttributeValues), this.defaultMeasuring)
      if (res.Items && res.Items.length > 0) {
        this._irs.getSelect2Arr(res.Items, 'Name', 'Item')
      }
      if (res.ItemCategoryParent && res.ItemCategoryParent.length > 0) {
        this._irs.getSelect2Arr(res.ItemCategoryParent, 'Name', 'Category')
      }
      if (res.Instructions && res.Instructions.length > 0) {
        this._irs.getSelect2Arr(res.Instructions, 'CommonDesc', 'Instruction')
      }
      if (res.SubUnits && res.SubUnits.length > 0) {
        this._irs.getSelect2Arr(res.SubUnits, 'Name', 'Unit')
      }
    },
    (error) => {
      this._ts.showErrorLong(error, '')
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
        if (matchedColumnAttributeIndex!== -1 && 
          columnItemArray[matchedColumnAttributeIndex].AttributeGroupId === this.AttributeValue_1[0].AttributeId) {
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
    if (objArray.length > 0) {
      const filteredItems = _.filter(this.storedItems, { CategoryId: Number(objArray[0].categoryValue) })
      const filteredUnits = await this._irs.getUnitByItemId(Number(objArray[0].itemValue))
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
  }

  preparePayLoad() {
    return {
      OnDate: this._gs.utcToClientDateFormat(this.model.OnDate, 'm/d/Y'),
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
    this.submitSave = true
    this.addItem()
    const requestData = this.preparePayload()
    if (this.checkForValidation() && this.validateItem)
    this._irs.postItemRequirementDat(requestData).subscribe((res) => {
      this._ts.showSuccess('Successfully done', '');
      this.closeModal();
      this.triggerCloseModal.emit();
    },
    (error) => {
      this._ts.showErrorLong(error, '')
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

  checkForItems(categoryId) {
    let newItemsList = []
    if (categoryId > 0) {
      this.masterData.allItems.forEach(item => {
        if (item.CategoryId === categoryId) {
          newItemsList.push(item)
        }
      })
      if (this.editItemId !== -1) {
        this._irs.getSelect2Arr(newItemsList, 'Name', 'Item')
      } else {
        let newData = [{ id: '0', text: 'Select Items' }, { id: '-1', text: UIConstant.ADD_NEW_OPTION }]
        newItemsList.forEach(item => {
          newData.push({
            id: item.Id,
            text: item.Name
          })
        })
        this.masterData.itemData = Object.assign([], newData)
      }
    } else if (categoryId === 0) {
      this._irs.getSelect2Arr(this.masterData.allItems, 'Name', 'Item')
    }
    if (this.isAddNew && this.addNewFor === 'child' && this.itemReq.childItemValue) {
      setTimeout(() => {
        this.masterData.itemValue = this.itemReq.childItemValue
        if (this.itemSelect2) {
          const element = this.renderer.selectRootElement(this.itemSelect2.selector.nativeElement, true)
          element.focus({ preventScroll: false })
        }
      }, 10)
    }
  }

  initItem () {
    this.itemReq = {}
    this.masterData.categoryValue = 0
    this.masterData.itemValue = 0
    this.masterData.unitValue = 0
    this.masterData.instructionValue = 0
    this.editItemId = -1
    this.clickItem = false
    this.editItemSno = 0
    if (this.categorySelect2) this.categorySelect2.setElementValue(0)
    if (this.itemSelect2) this.itemSelect2.setElementValue(0)
    if (this.unitSelect2) this.unitSelect2.setElementValue(0)
    if (this.instructionSelect2) this.instructionSelect2.setElementValue(0)
    if (this.masterData.defaultAttr && this.masterData.defaultAttr.length > 0) this.initAttrs()
  }

  ItemAttributeTransList: any = []
  initAttrs () {
    // let sno = (this.ItemAttributeTransLists.length > 0) ? this.ItemAttributeTransLists[this.ItemAttributeTransLists.length -1].Sno + 1 : 1
    const itemTransId = (this.ItemRequirements.length > 0) ? this.ItemRequirements[this.ItemRequirements.length -1].Sno + 1 : 1
    this.ItemAttributeTransList = []
    this.masterData.defaultAttr.forEach((attr, index) => {
      this.ItemAttributeTransList.push({
        Sno: index + 1,
        Id:  0,
        ItemId: 0,
        AttributeId:  attr.Id,
        Qty: 0,
        GroupId: 0,
        ItemTransId: itemTransId
      })
    })
  }

  @ViewChild('item_select2') itemSelect2: Select2Component
  onItemSelect (evt) {
    if (+evt.value === -1 && evt.data[0].selected) {
      this.addNewFor = 'child'
      this.isAddNew = true
      this._cs.openItemMaster('', (this.itemReq.CategoryId) ? this.itemReq.CategoryId : 0)
      this.itemSelect2.selector.nativeElement.value = ''
    } else {
      this.itemReq.ItemId = +evt.value
      this.ItemAttributeTransList.forEach(element => {
        element.ItemId = +evt.value
      })
      if (evt.value > 0) {
        this.itemReq.itemName = evt.data[0].text
      }
    }
    this.validateItem()
  }

  @ViewChild('item_parent_select2') itemParentSelect2: Select2Component
  onParentItemSelect (evt) {
    if (+evt.value === -1 && evt.data[0].selected) {
      this.addNewFor = 'parent'
      this.isAddNew = true
      this._cs.openItemMaster('', 0)
      this.itemParentSelect2.selector.nativeElement.value = ''
    } else {
      this.model.selectedParentItemId = +evt.value
    }
    this.checkForValidation()
  }

  @ViewChild('unit_select2') unitSelect2: Select2Component
  onUnitSelect (evt) {
    if (evt.value) {
      if (+evt.value === -1) {
        this.unitSelect2.selector.nativeElement.value = ''
        if (+this.unitSettingType === 1) {
          this._cs.openUnit('')
        }
        if (+this.unitSettingType === 2) {
          this._cs.openCompositeUnit('')
        }
      } else {
        this.itemReq.UnitId = +evt.value
        if (evt.value > 0 && evt.data[0] && evt.data[0].text) {
          this.itemReq.unitName = evt.data[0].text
        }
      }
      this.validateItem()
    }
  }

  @ViewChild('instruction_select2') instructionSelect2: Select2Component
  onInstructionSelect (evt) {
    this.itemReq.InstructionId = +evt.value
    if (evt.value > 0) {
      this.itemReq.instructionName = evt.data[0].text
    }
  }

  addItem () {
    if (+this.itemReq.ItemId > 0 && +this.itemReq.UnitId > 0 && this.validItem) {
      this.addCustomCharge()
      if (this.editItemId > 0) {
        this.showHideItem = true
      }
      this.ItemRequirements.forEach((element) => {
        if (element.Id === 0) {
          this.showHideItem = true
        }
      })
      this.clickItem = true
      this.initItem()
    }
  }

  addCustomCharge() {
    if (this.editItemId === -1) {
      const sno = (this.ItemRequirements.length > 0) ? this.ItemRequirements[this.ItemRequirements.length -1].Sno + 1 : 1
      this.ItemRequirements.push({
        Id : 0,
        Sno : sno,
        Qty : 0,
        ParentId :0,
        ParentTypeId :15 ,
        ProdAvg : 0,
        ItemId : this.itemReq.ItemId,
        itemName: this.itemReq.itemName,
        UnitId : this.itemReq.UnitId,
        unitName: this.itemReq.unitName,
        Shrinkage : 0,
        Fold : 0,
        InstructionId : this.itemReq.InstructionId,
        instructionName : this.itemReq.instructionName,
        CategoryId: this.itemReq.CategoryId,
        categoryName: this.itemReq.categoryName,
        OldItemIdRef : 0,
        isEditable: this.EditabledItemRow,
        ItemAttributeTransLists: this.ItemAttributeTransList
      })
      setTimeout(() => {
        this._cs.fixTableHFL('charge-table')
      }, 1)
    } else {
      const index = this.ItemRequirements.findIndex((item) => item.Sno === this.editItemSno)
      this.ItemRequirements[index] = {
        Id : 0,
        Sno : this.editItemSno,
        Qty : 0,
        ParentId :0,
        ParentTypeId :15 ,
        ProdAvg : 0,
        ItemId : this.itemReq.ItemId,
        itemName: this.itemReq.itemName,
        UnitId : this.itemReq.UnitId,
        unitName: this.itemReq.unitName,
        Shrinkage : 0,
        Fold : 0,
        InstructionId : this.itemReq.InstructionId,
        instructionName : this.itemReq.instructionName,
        CategoryId: this.itemReq.CategoryId,
        categoryName: this.itemReq.categoryName,
        OldItemIdRef : 0,
        isEditable: this.EditabledItemRow,
        ItemAttributeTransLists: this.ItemAttributeTransList
      }
      if (this.editItemId !== -1) {
        this.ItemRequirements[this.ItemRequirements.length - 1].Id = this.editItemId
      }
    }
  }

  onEnterPressItem(evt: KeyboardEvent) {
    this.addItem()
    setTimeout(() => {
      this.categorySelect2.selector.nativeElement.focus()
    }, 10)
  }

  @ViewChild('category_select2') categorySelect2: Select2Component
  onCategorySelect (evt) {
    this.itemReq.CategoryId = +evt.value
    if (evt.value > 0) {
      this.itemReq.categoryName = evt.data[0].text
    }
  }

  checkForValidation() {
    if (this.model.OnDate || this.model.selectedParentItemId) {
      let isValid = 1
      if (this.model.OnDate) {
        this.invalidObj['OnDate'] = false
      } else {
        this.invalidObj['OnDate'] = true
        isValid = 0
      }
      if (this.model.selectedParentItemId) {
        this.invalidObj['selectedParentItemId'] = false
      } else {
        this.invalidObj['selectedParentItemId'] = true
        isValid = 0
      }
      return !!isValid
    }
  }

  validateItem() {
    if (+this.itemReq.ItemId > 0 || +this.itemReq.UnitId > 0) {
      let isValid = 1
      if (+this.itemReq.ItemId > 0) { this.invalidObj['ItemId'] = false } else { isValid = 0; this.invalidObj['ItemId'] = true; }
      if (+this.itemReq.UnitId > 0) { this.invalidObj['UnitId'] = false; } else { isValid = 0; this.invalidObj['UnitId'] = true; }
      let qtyValid = 0
      this.ItemAttributeTransList.forEach(element => {
        if (+element.Qty > 0) {
          qtyValid = 1
        }
      })
      if (!qtyValid) {
        this.invalidObj['Qty'] = true
        isValid = 0
      } else {
        this.invalidObj['Qty'] = false
      }
      this.validItem = !!isValid
    } else {
      this.validItem = true; this.invalidObj['ItemId'] = false; this.invalidObj['UnitId'] = false; this.invalidObj['Qty'] = false;
    }
    this.clickItem = false
  }

  EditabledItemRow = true
  editItem(i, editId, sno) {
    if (this.editItemId === -1) {
      this.editItemId = editId
      this.editItemSno = sno
      i = i - 1
      this.showHideItem = false
      this.ItemRequirements[i].isEditable = false
      this.EditabledItemRow = true
      this.masterData.categoryValue = this.ItemRequirements[i].CategoryId
      this.masterData.unitValue = this.ItemRequirements[i].UnitId
      this.masterData.instructionValue = this.ItemRequirements[i].InstructionId
      this.masterData.itemValue = this.ItemRequirements[i].ItemId
      this.itemReq.categoryName = this.ItemRequirements[i].categoryName
      this.itemReq.unitName = this.ItemRequirements[i].unitName
      this.itemReq.instructionName = this.ItemRequirements[i].instructionName
      this.itemReq.itemName = this.ItemRequirements[i].itemName
      this.itemReq.CategoryId = this.ItemRequirements[i].CategoryId
      this.itemReq.UnitId = this.ItemRequirements[i].UnitId
      this.itemReq.InstructionId = this.ItemRequirements[i].InstructionId
      this.checkForItems(this.itemReq.CategoryId)
      this.itemReq.ItemId = this.ItemRequirements[i].ItemId
      this.ItemAttributeTransList = this.ItemRequirements[i].ItemAttributeTransLists
    }
  }

  deleteItem(i) {
    this.ItemRequirements.splice(i, 1)
  }

  preparePayload () {
    let ItemAttributeTransList = []
    if (this.masterData.defaultAttr.length > 0) {
      this.ItemRequirements.forEach((element) => {
        ItemAttributeTransList = ItemAttributeTransList.concat(element.ItemAttributeTransLists)
      })
    }
    const payload = {
      "ItemId" : this.model.selectedParentItemId,
      "AttributeStr" : this.model.AttributeGroupId,
      "OnDate" : this._gs.clientToSqlDateFormat(this.model.OnDate, this.clientDateFormat),
      "ItemRequirements" : this.ItemRequirements,
      "ItemAttributeTransLists": ItemAttributeTransList
    }
    console.log(JSON.stringify(payload))
    return payload
  }

  ngOnDestroy () {
    // this.destroy$.unsubscribe()
  }
}
