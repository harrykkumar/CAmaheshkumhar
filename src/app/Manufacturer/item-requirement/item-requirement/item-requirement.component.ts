import { Settings } from './../../../shared/constants/settings.constant';
import { UIConstant } from './../../../shared/constants/ui-constant';
import { ToastrCustomService } from './../../../commonServices/toastr.service';
import { Component, OnInit, EventEmitter, Output, ViewChild, Renderer2, ViewChildren, QueryList, OnDestroy } from '@angular/core';
declare var $: any
import * as _ from 'lodash'
import { ItemRequirementService } from '../item-requirement.service';
import { GlobalService } from 'src/app/commonServices/global.service';
import { SetUpIds } from '../../../shared/constants/setupIds.constant';
import { Subscription } from 'rxjs';
import { Select2Component } from 'ng2-select2';
import { CommonService } from '../../../commonServices/commanmaster/common.services';
import { AddCust } from '../../../model/sales-tracker.model';
import { ManufacturingService } from '../../manufacturing.service';
@Component({
  selector: 'app-item-requirement',
  templateUrl: './item-requirement.component.html'
})
export class ItemRequirementComponent implements OnInit, OnDestroy {
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
  
  destroy$: Subscription[] = []
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
  withoutAttr = false
  loading = false
  PARENT_TYPE_ID = 32
  constructor(
    private _irs: ItemRequirementService,
    private _ts: ToastrCustomService,
    private _gs: GlobalService,
    private setting: Settings,
    private _cs: CommonService,
    private renderer: Renderer2,
    private _ms: ManufacturingService
  ) {
    this.destroy$.push(this._ms.openStyle$.subscribe((data: any) => {
      if (data.name && data.id) {
        let newData = Object.assign([], this.masterData.styleData)
        newData.push({ id: +data.id, text: data.name })
        this.masterData.styleData = newData
        this.model.styleValue = data.id
        setTimeout(() => {
          if (this.styleSelect2) {
            const element = this.renderer.selectRootElement(this.styleSelect2.selector.nativeElement, true)
            element.focus({ preventScroll: false })
          }
        }, 2000)
      }
    }))
    this.destroy$.push(this._irs.select2List$.subscribe((data: any) => {
      // console.log(data)
      if (data.data && data.title) {
        if (data.title === 'Style') {
          let arr = JSON.parse(JSON.stringify(data.data))
          arr.splice(0, 1)
          arr.unshift({
            id: -1,
            text: UIConstant.ADD_NEW_OPTION
          })
          arr.unshift({
            id: 0,
            text: 'Select Style'
          })
          this.masterData['styleData'] = arr
        }
        if (data.title === 'Unit') {
          let arr = JSON.parse(JSON.stringify(data.data))
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
          this.masterData['categoryData'] = JSON.parse(JSON.stringify(data.data))
        } else if (data.title === 'Instruction') {
          let arr = JSON.parse(JSON.stringify(data.data))
          arr.splice(0, 1)
          arr.unshift({
            id: -1,
            text: UIConstant.ADD_NEW_OPTION
          })
          arr.unshift({
            id: 0,
            text: 'Select Instruction'
          })
          this.masterData['instructionData'] = arr
        } else if (data.title === 'Item') {
          let arr = JSON.parse(JSON.stringify(data.data))
          arr.splice(0, 1)
          arr.unshift({
            id: -1,
            text: UIConstant.ADD_NEW_OPTION
          })
          arr.unshift({
            id: 0,
            text: 'Select Item'
          })
          this.masterData['itemData'] = arr
          this.masterData['parentItemData'] = arr
        } else if (data.title === 'Item Process') {
          let arr = JSON.parse(JSON.stringify(data.data))
          this.masterData['itemProcessData'] = arr
        }
      }
    }))

    this.destroy$.push(this._irs.attr$.subscribe((data: any) => {
      // console.log(data)
      if (data.default && data.combos) {
        this.masterData['defaultAttr'] = data.default
        this.masterData['comboFor'] = data.combos
      }
      if (this.editMode) {
        this.setEditData(this.editData)
      } else {
        this.initAttrs()
        this.loading = false
      }
    }))
    this.destroy$.push(this._cs.getCompositeUnitStatus().subscribe((data: AddCust) => {
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
    }))

    this.destroy$.push(this._cs.getUnitStatus().subscribe((data: AddCust) => {
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
    ))

    this.destroy$.push(this._cs.getItemMasterStatus().subscribe((data: AddCust) => {
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
    ))

    this.destroy$.push(this._cs.getCategoryStatus().subscribe((data) => {
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
    }))

    this.destroy$.push(this._cs.openCommonMenu$.subscribe(
      (data: AddCust) => {
        // console.log(data)
        if (data.id && data.name && data.code) {
          if (data.code === 188) {
            let newData = Object.assign([], this.masterData.itemProcessData)
            newData.push({ id: data.id, text: data.name })
            this.masterData.itemProcessData = Object.assign([], newData)
            this.masterData.itemProcessValue = +data.id
            setTimeout(() => {
              if (this.itemParentSelect2) {
                const element = this.renderer.selectRootElement(this.itemParentSelect2.selector.nativeElement, true)
                element.focus({ preventScroll: false })
              }
            }, 2000)
          }
        }
      }
    ))

    this.destroy$.push(this._cs.openCommonMenu$.subscribe(
      (data: AddCust) => {
        if (data.id && data.name && data.code) {
          if (data.code === 169) {
            let newData = Object.assign([], this.masterData.instructionData)
            newData.push({ id: data.id, text: data.name })
            this.masterData.instructionData = Object.assign([], newData)
            this.masterData.instructionValue = +data.id
            setTimeout(() => {
              if (this.instructionSelect2) {
                const element = this.renderer.selectRootElement(this.instructionSelect2.selector.nativeElement, true)
                element.focus({ preventScroll: false })
              }
            }, 2000)
          }
        }
      }
    ))

    this.model.type = 'item'
    this.getSetUpModules((JSON.parse(this.setting.moduleSettings).settings))
  }

  allTotal: number = 0
  resetForm() {
    this.allTotal = 0
    this.loading = false
    this.isAddNew = false
    this.addNewFor = ''
    this.model.OnDate = ''
    if (this.attrSelect) this.attrSelect.setElementValue(0)
    if (this.itemParentSelect2) this.itemParentSelect2.setElementValue(0)
    if (this.styleSelect2) this.styleSelect2.setElementValue(0)
    this.model.parentItemValue = 0
    this.model.styleValue = 0
    this.model.attributeGroupValue = 0
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

  ngOnInit() {
  }

  itemReqAttrs = []
  editData: any = {}
  openModal(data?) {
    this.loading = true
    this.showHideItem = true
    this.resetForm()
    this.getItemRequirements()
    if (!_.isEmpty(data)) {
      // console.log('edit data : ', data)
      this.editMode = true
      this.editData = data
    }
  }

  setEditData (data) {
    if (data.itemAttributesTrans.length > 0) {
      this.withoutAttr = false
    } else {
      this.withoutAttr = true
    }
    if (data.ItemRequirementDetails.length > 0) {
      this.getItems(data.itemAttributesTrans, data.ItemRequirementDetails)
    }
    if (data.ItemRequirement.length > 0) {
      this.model.OnDate = this._gs.utcToClientDateFormat(data.ItemRequirement[0].OnDate, this.clientDateFormat)
      this.model.attributeGroupValue = data.ItemRequirement[0].AttributeStr
      this.model.AttributeGroupId = data.ItemRequirement[0].AttributeStr
      setTimeout(() => {
        this.model.parentItemValue = data.ItemRequirement[0].ItemId
        this.model.styleValue = data.ItemRequirement[0].StyleId
      }, 1000)
    }
  }

  getItems(AttributeList, items) {
    // items = _.filter(items, (item) => item.Status === 1)
    AttributeList = _.filter(AttributeList, (attr) => attr.IsMeasurment === 1)
    console.log(items, AttributeList)
    let index = 1
    this.ItemRequirements = []
    _.forEach(items, (element) => {
      const ItemAttributeTransList = _.filter(AttributeList, (attr) => attr.ItemTransId === element.Id)
      this.initAttrs()
      this.ItemAttributeTransList.forEach((attr) => {
        const itemAttr = _.find(ItemAttributeTransList, { 'AttributeId': attr.AttributeId})
        if (!_.isEmpty(itemAttr)) {
          attr.Id =  itemAttr.Id
          attr.Qty = itemAttr.Qty
          attr.GroupId = itemAttr.GroupId
          attr.ItemTransId = itemAttr.ItemTransId
        }
        attr.ItemId = element.ItemId
      })
      this.ItemRequirements.push({
        Id : element.Id,
        Sno : index,
        Qty : element.Qty,
        ParentId :0,
        ParentTypeId: this.PARENT_TYPE_ID ,
        ProdAvg : 0,
        ItemProcessId: element.ItemProcessId,
        itemProcessName: element.ItemProcessName,
        itemName: element.ItemName,
        UnitId : element.UnitId,
        unitName: element.UnitName,
        Rate: element.Rate,
        Shrinkage : element.Shrinkage,
        Fold : element.Fold,
        Addition : element.Addition,
        Total: this.calculate1(element.Qty, element.Rate),
        InstructionId : element.InstructionId,
        instructionName : element.InstructionName,
        CategoryId: element.CategoryId,
        categoryName: element.CategoryName,
        OldItemIdRef: 0,
        isEditable: this.EditabledItemRow,
        ItemAttributeTransLists: this.ItemAttributeTransList,
        ItemId: element.ItemId
      })
      index++
    })
    this.calculateAllTotal()
    console.log('items : ', this.ItemRequirements)
    setTimeout(() => {
      this._cs.fixTableHFL('charge-table')
    }, 1)
    this.initItem()
    this.loading = false
  }

  defaultMeasuring: any
  requirementAttrs: any
  toShowAttrs: boolean
  clientDateFormat: string = ''
  unitSettingType = 1
  noOfDecimal: number = 2
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
      if (element.id === SetUpIds.noOfDecimalPoint) {
        this.noOfDecimal = +element.val
      }
    })
    console.log('noOfDecimal : ', this.noOfDecimal)
  }

  closeModal() {
    $('#item_requirement_form').modal(UIConstant.MODEL_HIDE)
    this.resetForm()
  }

  getItemRequirements() {
    this.destroy$.push(this._irs.getItemRequirement().subscribe((res) => {
      // console.log(res)
      this.masterData.allItems = res.Items
      this.itemReqAttrs = res.Attributes
      this.model.OnDate = this._gs.getDefaultDate(this.clientDateFormat)
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
      if (res.ItemProcesses && res.ItemProcesses.length > 0) {
        this._irs.getSelect2Arr(res.ItemProcesses, 'CommonDesc', 'Item Process', 'UId')
      }
      if (res.Styles && res.Styles.length > 0) {
        this._irs.getSelect2Arr(res.Styles, 'Name', 'Style')
      }
    },
    (error) => {
      this.loading = false
      this._ts.showErrorLong(error, '')
    },
    () => {
      if (this.toShowAttrs) {
        let defaultAttrIndex = _.findIndex(this.itemReqAttrs, {Id: this.defaultMeasuring})
        if (defaultAttrIndex > -1) {
          this.model['defaultAttrName'] = this.itemReqAttrs[defaultAttrIndex]['Val']
          this.itemReqAttrs.splice(defaultAttrIndex, 1)
          if (defaultAttrIndex > -1 && this.itemReqAttrs.length > 0) {
            this.open()
          } else {
            this._ts.showErrorLong('Please complete the master settings', '')
          }
        } else {
          this._ts.showErrorLong('Please complete the master settings', '')
        }
      } else {
        this.open()
      }
    }))
  }

  open() {
    this._irs.onFormReady()
    $('#item_requirement_form').modal({ backdrop: 'static', keyboard: false })
    $('#item_requirement_form').modal(UIConstant.MODEL_SHOW)
  }

  postItemRequireData() {
    this.submitSave = true
    this.checkForFocus()
    this.addItem()
    if (this.checkForValidation() && this.validItem) {
      const requestData = this.preparePayload()
      if (requestData.ItemRequirements.length > 0) {
        this.destroy$.push(this._irs.postItemRequirementDat(requestData).subscribe((res) => {
          this._ts.showSuccess('Successfully done', '');
          this.closeModal();
          this.triggerCloseModal.emit();
        },
        (error) => {
          this.submitSave = false
          this._ts.showErrorLong(error, '')
        }))
      } else {
        this._ts.showError('Add Atleast 1 row', '')
      }
    }
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
        // this._irs.getSelect2Arr(newItemsList, 'Name', 'Item')
        const list = _.map(newItemsList, (item) => {
          return {
            id: item.Id,
            text: item['Name']
          }
        })
        this.masterData.itemData = [{ id: 0, text: 'Select Item' }, ...list]
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
    // console.log('this.masterData.itemData : ', this.masterData.itemData)
  }

  @ViewChild('attr_select') attrSelect: Select2Component
  initItem () {
    this.itemReq = {}
    this.itemReq.Total = 0
    this.masterData.categoryValue = 0
    this.masterData.itemValue = 0
    this.masterData.unitValue = 0
    this.masterData.instructionValue = 0
    this.masterData.itemProcessValue = 0
    this.editItemId = -1
    this.clickItem = false
    this.editItemSno = 0
    if (this.categorySelect2) this.categorySelect2.setElementValue(0)
    if (this.itemSelect2) this.itemSelect2.setElementValue(0)
    if (this.unitSelect2) this.unitSelect2.setElementValue(0)
    if (this.instructionSelect2) this.instructionSelect2.setElementValue(0)
    if (this.itemProcessSelect2) this.itemProcessSelect2.setElementValue(0)
    if (this.masterData.defaultAttr && this.masterData.defaultAttr.length > 0)  this.initAttrs()
    this.checkForItems(0)
  }

  ItemAttributeTransList: any = []
  initAttrs () {
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
    // console.log(this.ItemAttributeTransList)
  }

  @ViewChild('item_select2') itemSelect2: Select2Component
  onItemSelect (evt) {
    if (+evt.value === -1 && evt.data[0].selected) {
      this.addNewFor = 'child'
      this.isAddNew = true
      this._cs.openItemMaster('', (this.itemReq.CategoryId) ? this.itemReq.CategoryId : 0)
      this.itemSelect2.selector.nativeElement.value = ''
      this.masterData.unitValue = 0
      this.itemReq.Rate = 0
    } else {
      this.itemReq.ItemId = +evt.value
      this.getItemDetail()
      this.ItemAttributeTransList.forEach(element => {
        element.ItemId = +evt.value
      })
      if (evt.value > 0) {
        this.itemReq.itemName = evt.data[0].text
      }
    }
    this.validateItem()
  }

  getItemDetail () {
    this.destroy$.push(this._irs.getItemDetail(this.itemReq.ItemId).subscribe((res)=> {
      this.itemReq.Rate = res['ItemDetails'][0].PurchaseRate
      this.masterData.unitValue = res['ItemDetails'][0].UnitId
      console.log(this.itemReq.Rate)
    },
    (error) => {
      this._ts.showErrorLong(error, '')
    }))
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
    if (+evt.value > 0) {
      this.itemReq.InstructionId = +evt.value
      this.itemReq.instructionName = evt.data[0].text
    } else if (+evt.value === -1) {
      this.instructionSelect2.selector.nativeElement.value = ''
      this._cs.getCommonMenu(169).then((menudata) => {
        console.log(menudata)
        this._cs.openCommonMenu({'open': true, 'data': menudata, 'isAddNew': false})
      });
    }
  }

  addItem () {
    this.checkForFocus()
    if (+this.itemReq.ItemId > 0 && +this.itemReq.UnitId > 0 && this.validItem) {
      this.addCustomItem()
      this.calculateAllTotal()
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
      setTimeout(() => {
        this.categorySelect2.selector.nativeElement.focus()
      }, 10)
    }
  }

  addCustomItem() {
    // console.log(this.PARENT_TYPE_ID)
    if (this.editItemId === -1) {
      const sno = (this.ItemRequirements.length > 0) ? this.ItemRequirements[this.ItemRequirements.length -1].Sno + 1 : 1
      this.ItemRequirements.push({
        Id : 0,
        Sno : sno,
        Qty : (this.itemReq.Qty) ? this.itemReq.Qty : 0,
        ParentId :0,
        ParentTypeId: this.PARENT_TYPE_ID ,
        ProdAvg : 0,
        ItemId : this.itemReq.ItemId,
        ItemProcessId: this.itemReq.ItemProcessId,
        itemProcessName: this.itemReq.itemProcessName,
        itemName: this.itemReq.itemName,
        UnitId : this.itemReq.UnitId,
        unitName: this.itemReq.unitName,
        Rate: this.itemReq.Rate,
        Shrinkage : (this.itemReq.Shrinkage) ? this.itemReq.Shrinkage : 0,
        Fold : (this.itemReq.Fold) ? this.itemReq.Fold : 0,
        Addition : (this.itemReq.Addition) ? this.itemReq.Addition : 0,
        Total: this.itemReq.Total,
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
        Id : this.editItemId,
        Sno : this.editItemSno,
        Qty : this.itemReq.Qty,
        ParentId :0,
        ParentTypeId: this.PARENT_TYPE_ID,
        ProdAvg : 0,
        ItemId : this.itemReq.ItemId,
        ItemProcessId: this.itemReq.ItemProcessId,
        itemProcessName: this.itemReq.itemProcessName,
        itemName: this.itemReq.itemName,
        UnitId : this.itemReq.UnitId,
        unitName: this.itemReq.unitName,
        Rate: this.itemReq.Rate,
        Shrinkage : (this.itemReq.Shrinkage) ? this.itemReq.Shrinkage : 0,
        Fold : (this.itemReq.Fold) ? this.itemReq.Fold : 0,
        Addition : (this.itemReq.Addition) ? this.itemReq.Addition : 0,
        Total: this.itemReq.Total,
        InstructionId : this.itemReq.InstructionId,
        instructionName : this.itemReq.instructionName,
        CategoryId: this.itemReq.CategoryId,
        categoryName: this.itemReq.categoryName,
        OldItemIdRef : 0,
        isEditable: this.EditabledItemRow,
        ItemAttributeTransLists: this.ItemAttributeTransList
      }
      // if (this.editItemId !== -1) {
      //   this.ItemRequirements[this.ItemRequirements.length - 1].Id = this.editItemId
      // }
    }
    console.log(this.ItemRequirements)
  }

  onEnterPressItem(evt: KeyboardEvent) {
    this.addItem()
    // setTimeout(() => {
    //   this.categorySelect2.selector.nativeElement.focus()
    // }, 10)
  }

  @ViewChild('category_select2') categorySelect2: Select2Component
  onCategorySelect (evt) {
    this.itemReq.CategoryId = +evt.value
    if (evt.value > 0) {
      this.itemReq.categoryName = evt.data[0].text
    }
  }

  checkForValidation() {
    // if (this.model.OnDate || this.model.selectedParentItemId) {
      
    // }
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
    this.checkForFocus()
    return !!isValid
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

  validateItem() {
    if (+this.itemReq.ItemId > 0) {
      let isValid = 1
      if (+this.itemReq.ItemId > 0) { this.invalidObj['ItemId'] = false } else { isValid = 0; this.invalidObj['ItemId'] = true; }
      if (+this.itemReq.UnitId > 0) { this.invalidObj['UnitId'] = false; } else { isValid = 0; this.invalidObj['UnitId'] = true; }
      if (+this.itemReq.Rate > 0) { this.invalidObj['Rate'] = false; } else { isValid = 0; this.invalidObj['Rate'] = true; }
      let qtyValid = 0
      if (!this.withoutAttr && this.toShowAttrs) {
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
      } else if (this.withoutAttr || !this.toShowAttrs) {
        if (+this.itemReq.Qty > 0) {
          this.invalidObj['Qty'] = false
        } else {
          this.invalidObj['Qty'] = true
          isValid = 0
        }
      }
      this.validItem = !!isValid
    } else {
      this.validItem = true; this.invalidObj['ItemId'] = false; this.invalidObj['UnitId'] = false; this.invalidObj['Qty'] = false;
    }
    this.clickItem = false
  }

  EditabledItemRow = true
  editItem(i, editId, sno) {
    console.log(editId, sno)
    if (this.editItemId === -1) {
      this.editItemId = editId
      this.editItemSno = sno
      i = i - 1
      this.showHideItem = false
      this.ItemRequirements[i].isEditable = false
      this.EditabledItemRow = true
      this.masterData.categoryValue = this.ItemRequirements[i].CategoryId
      this.checkForItems(this.itemReq.CategoryId)
      this.masterData.unitValue = this.ItemRequirements[i].UnitId
      this.masterData.instructionValue = this.ItemRequirements[i].InstructionId
      this.masterData.itemProcessValue = this.ItemRequirements[i].ItemProcessId
      this.itemReq.categoryName = this.ItemRequirements[i].categoryName
      this.itemReq.unitName = this.ItemRequirements[i].unitName
      this.itemReq.instructionName = this.ItemRequirements[i].instructionName
      this.itemReq.itemName = this.ItemRequirements[i].itemName
      this.itemReq.CategoryId = this.ItemRequirements[i].CategoryId
      this.itemReq.UnitId = this.ItemRequirements[i].UnitId
      this.itemReq.InstructionId = this.ItemRequirements[i].InstructionId
      this.itemReq.ItemProcessId = this.ItemRequirements[i].ItemProcessId
      this.itemReq.itemProcessName = this.ItemRequirements[i].itemProcessName
      this.itemReq.Qty = this.ItemRequirements[i].Qty
      this.itemReq.Addition = this.ItemRequirements[i].Addition
      this.itemReq.Shrinkage = this.ItemRequirements[i].Shrinkage
      this.itemReq.Fold = this.ItemRequirements[i].Fold
      this.itemReq.Total = this.ItemRequirements[i].Total
      this.ItemAttributeTransList = this.ItemRequirements[i].ItemAttributeTransLists
      this.itemReq.ItemId = this.ItemRequirements[i].ItemId
      this.itemReq.StyleId = this.ItemRequirements[i].StyleId
      this.itemReq.styleName = this.ItemRequirements[i].styleName
      setTimeout(() => {
      // this.masterData.itemValue = this.ItemRequirements[i].ItemId
      this.itemSelect2.setElementValue(this.ItemRequirements[i].ItemId)
      // console.log('set item value : ')
      }, 300)
      setTimeout(() => {
        this.unitSelect2.setElementValue(this.ItemRequirements[i].UnitId)
        this.itemReq.Rate = this.ItemRequirements[i].Rate
      }, 400)
    }
  }

  deleteItem(i) {
    this.ItemRequirements.splice(i, 1)
  }

  preparePayload () {
    let ItemAttributeTransList = []
    let ItemAttributeTransListtosend = []
    if (!this.withoutAttr) {
      if (this.masterData.defaultAttr.length > 0) {
        this.ItemRequirements.forEach((element) => {
          ItemAttributeTransList = ItemAttributeTransList.concat(element.ItemAttributeTransLists)
        })
        ItemAttributeTransListtosend = ItemAttributeTransList.filter(element => {
          return element.Qty > 0
        })
        ItemAttributeTransListtosend.forEach((element, index) => {
          element.Sno = index + 1
        })
      }
    }
    const payload = {
      "WithoutAttr": (this.withoutAttr) ? true : false,
      "ItemId" : this.model.selectedParentItemId,
      "StyleId": this.model.StyleId,
      "AttributeStr" : this.model.AttributeGroupId,
      "OnDate" : this._gs.clientToSqlDateFormat(this.model.OnDate, this.clientDateFormat),
      "ItemRequirements" : this.ItemRequirements,
      "ItemAttributeTransLists": ItemAttributeTransListtosend,
      "Id": (this.editMode) ? this.editData.ItemRequirement[0].ReqNo: 0
    }
    console.log(JSON.stringify(payload))
    return payload
  }

  ngOnDestroy () {
    if (this.destroy$ && this.destroy$.length > 0) {
      this.destroy$.forEach((element) => element.unsubscribe())
    }
  }

  @ViewChild('item_process_select2') itemProcessSelect2: Select2Component
  onItemProcessSelect (evt) {
    // console.log(evt)
    // if (+evt.value === -1 && evt.data[0].selected) {
    //   this.itemProcessSelect2.selector.nativeElement.value = ''
    //   this._cs.getCommonMenu(188).then((menudata) => {
    //     console.log(menudata)
    //     this._cs.openCommonMenu({'open': true, 'data': menudata, 'isAddNew': false})
    //   });
    // } else {
    //   this.itemReq.ItemProcessId = +evt.value
    //   if (evt.value > 0) {
    //     this.itemReq.itemProcessName = evt.data[0].text
    //   }
    // }
    // this.validateItem()
    this.itemReq.ItemProcessId = +evt.value
    if (evt.value > 0) {
      this.itemReq.itemProcessName = evt.data[0].text
    }
  }

  onPressEnter() {
    this.withoutAttr = !this.withoutAttr
  }

  calculate () {
    if (this.withoutAttr) {
      this.itemReq.Total = +(+this.itemReq.Qty * +this.itemReq.Rate) > 0 ? +(+this.itemReq.Qty * +this.itemReq.Rate).toFixed(this.noOfDecimal) : 0
    } else {
      if (this.masterData.defaultAttr.length > 0) {
        let sum = 0
        this.ItemAttributeTransList.forEach(element => {
          sum += +element.Qty
        })
        this.itemReq.Total = +(+sum * +this.itemReq.Rate) > 0 ? (+sum * +this.itemReq.Rate).toFixed(this.noOfDecimal) : 0
      } else {
        this.itemReq.Total = +(+this.itemReq.Qty * +this.itemReq.Rate) > 0 ? (+this.itemReq.Qty * +this.itemReq.Rate).toFixed(this.noOfDecimal) : 0
      }
    }
  }

  calculate1 (Qty, Rate) {
    if (this.withoutAttr) {
      return (+Qty * +Rate).toFixed(this.noOfDecimal)
    } else {
      if (this.masterData.defaultAttr.length > 0) {
        let sum = 0
        this.ItemAttributeTransList.forEach(element => {
          sum += +element.Qty
        })
        return (+sum * +Rate).toFixed(this.noOfDecimal)
      } else {
        return (+Qty * +Rate).toFixed(this.noOfDecimal)
      }
    }
  }

  calculateAllTotal() {
    let sum = 0

    this.ItemRequirements.forEach(element => {
      sum += +element.Total
    })
    this.allTotal = +(+sum) > 0 ? +(+sum).toFixed(this.noOfDecimal) : 0
  }

  @ViewChild('style_select2') styleSelect2: Select2Component
  onStyleSelect(evt) {
    if (+evt.value === -1 && evt.data[0].selected) {
      this.styleSelect2.selector.nativeElement.value = ''
      this._ms.openStyle('', false)
    } else {
      this.model.StyleId = +evt.value
    }
  }
}
