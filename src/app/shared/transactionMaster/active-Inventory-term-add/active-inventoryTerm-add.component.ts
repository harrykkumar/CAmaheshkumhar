import { Component, OnInit, OnDestroy, ViewChild, Renderer2, ElementRef } from '@angular/core'
import { Subject, Subscription } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators'
import * as _ from 'lodash'
import 'rxjs/add/operator/map';
import { Select2OptionData, Select2Component } from 'ng2-select2'
import { ToastrCustomService } from 'src/app/commonServices/toastr.service'
import { ActiveInventoryService } from 'src/app/transactionMaster/active-inventory/activeInventory.service'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
import { UIConstant } from 'src/app/shared/constants/ui-constant'
import { Settings } from '../../../shared/constants/settings.constant';
import { GlobalService } from 'src/app/commonServices/global.service';

declare var $: any
@Component({
  selector: 'app-active-inventoryTerm-add',
  templateUrl: './active-inventoryTerm-add.component.html',
  styleUrls: ['./active-inventoryTerm-add.component.css']
})
export class ActiveInventoryTermAddComponent implements OnInit, OnDestroy {
  private unSubscribe$ = new Subject<void>()
  @ViewChild('formModel1') formModel
  attribute: any = {}
  attrEditId: number = null
  
  attributeList: Array<any> = []
  selectedInventory: number = null
  ApplyTypeId: number = null
  addFalg: boolean = false
  isParent: boolean = false
  deleteParent$: Subscription
  TypeList: any = []
  constructor(
    private activeService: ActiveInventoryService,
    private toastrService: ToastrCustomService,
    public _CommonService: CommonService,
    private renderer: Renderer2,
    public _settings: Settings,
    public _globalService: GlobalService,
  ) {
    this.disabledAddNewFlag = false
    this._CommonService.getActiveInventoryStatus().pipe((
      takeUntil(this.unSubscribe$)
    )).subscribe((response: any) => {
      if (response.open === true) {

        this.resetFormData()
        this.selectedInventory = null
        this.initACtiveInventoryNameList(0)
        this.isParent = response.data.isParent
        console.log(response.data)
        if (response.data.editId > 0) {
          this.setEditData(response)
        } else {
          this.optionalForChild = true
        }
        if (response.data.addNewId > 0) {
          this.disabledAddNewFlag = false
          this.initACtiveInventoryNameList(response.data.attrNameId)
          this.addNewAttributeDynamic(response)
        } else {
          $('#active_inventory_master').modal(UIConstant.MODEL_SHOW)
          setTimeout(() => {
            if (this.attrname) {
              const element = this.renderer.selectRootElement(this.attrname.nativeElement, true)
              element.focus({ preventScroll: false })
            }
          }, 1000)
        }
        $('#active_inventory_master').modal(UIConstant.MODEL_SHOW)

        setTimeout(() => {
          if (this.attrname) {
            const element = this.renderer.selectRootElement(this.attrname.nativeElement, true)
            element.focus({ preventScroll: false })
          }
        }, 1000)
      }
      else {
        this.closeModal()
      }
    })
  }

  onloading() {
    this.activeService.getActiveInvTypeList().subscribe(resp => {
      if (resp.Code = UIConstant.THOUSAND) {
        this.TypeList = []
        resp.Data.forEach(element => {
          this.TypeList.push({
            id: element.UId,
            text: element.CommonDesc
          })
        });
      }
    })
  }
  labelname: any = 'Select Type'
  changeType = (event) => {
    if (this.ApplyTypeId !== null) {
      this.ApplyTypeId = event.id

    }
  }
  clientDateFormat: any = ''
  // tslint:disable-next-line:space-before-function-paren
  ngOnInit() {
    this.attribute.fromDatevalue = ''
    this.attribute.toDateValue = ''
    this.clientDateFormat = this._settings.dateFormat

    this.deleteParent$ = this.activeService.deleteParent$.subscribe(
      (status) => {
        if (status) {
          this.initACtiveInventoryNameList(0)
        }
      }
    )
  }

  @ViewChild('inventory') attrname: ElementRef
  @ViewChild('inventoryValue') AttributeValue: ElementRef


  /* initialising attribute data to open add attribute modal */

  closePopup() {
    this.closeModal()
    this.resetFormData()
    this._CommonService.closeActiveInventoryPopup()

  }
  /* setting form data in case of edit mode */
  setEditData = (response) => {
    this.attrEditId = response.data.editId
    if (response.data.isParent) {
      this.optionalForChild = true
      this.editOfCategory(response)
    } else {
      this.optionalForChild = false
      this.editOfTerms(response.data.editId)
    }

  }
  optionalForChild: boolean = true
  editOfCategory(editdata) {
    this.activeService.editActiveCategoryName(editdata.data.editId).subscribe(resp => {
      if (resp.Code === UIConstant.THOUSAND && resp.Data.length > 0) {
        this.ApplyTypeId = resp.Data[0].ApplyTypeId
        this.attribute.inventoryName = resp.Data[0].Name
        this.attribute.shortName = resp.Data[0].ShortName
      }
    })
  }
  editOfTerms(editId) {
    this.activeService.editTermsForInventory(editId).subscribe(resp => {
      if (resp.Code === UIConstant.THOUSAND && resp.Data.length > 0) {
        this.attrEditId = editId
        this.attribute.toLimit = resp.Data[0].ToLimit
        this.attribute.fromLimit = resp.Data[0].FromLimit
        this.selectedInventory = resp.Data[0].ActiveInventoryCategoryId
        this.attribute.fromDatevalue = (resp.Data[0].FromDate) ? this._globalService.utcToClientDateFormat(resp.Data[0].FromDate, this.clientDateFormat) : ''
        this.attribute.toDateValue = (resp.Data[0].ToDate) ? this._globalService.utcToClientDateFormat(resp.Data[0].ToDate, this.clientDateFormat) : ''


      }

    })
  }
  disabledAddNewFlag: boolean
  AttributeNameNewAdd: any


  @ViewChild('selectAttributeSelect2') selectAttributeSelect2: Select2Component
  addNewAttributeDynamic = (response) => {
    this.attrEditId = 0
    this.disabledAddNewFlag = response.data.disabledAddButton
    this.attribute.value = ''

  }


  resetFormData = () => {
    this.attribute = {}
    this.ApplyTypeId = null
    this.attrEditId = null
    this.formModel.submitted = false
    this.attribute.fromDatevalue = ''
    this.attribute.toDateValue = ''
  }



  initACtiveInventoryNameList = (newAddId) => {
    this.onloading()
    this.activeService.getActiveCategoryName().pipe(
      takeUntil(this.unSubscribe$),
      map((response) => {
        return _.map(response.Data, (value) => {
          if (value.Id === newAddId) {
            this.attribute.inventoryName = value.Name
          }
          return {
            id: value.Id,
            text: value.Name,
            ApplyTypeId: value.ApplyTypeId
          }

        })
      })
    ).subscribe((response: any) => {
      let dataV = [...response]
      dataV.unshift({ id: 0, text: 'Select Inventory' })
      this.attributeList = dataV
    }, error => console.log(error))
  }

  /* Function to add the new attribute name */
  AddActiveCategoryName = () => {
    this.addFalg = true
    this.selectedInventory = null
    const payload = {
      Id: this.attrEditId ? this.attrEditId : 0,
      Name: this.attribute.inventoryName,
      ApplyTypeId: this.ApplyTypeId,
      ShortName: this.attribute.shortName
    }
    this.activeService.postActiveCategory(payload).pipe((
      takeUntil(this.unSubscribe$)
    )).subscribe((response) => {
      if (response.Code === UIConstant.THOUSANDONE && response.Data) {
        this.toastrService.showError('', response.Description)
      } else if (response.Code === UIConstant.THOUSAND && response.Data) {
        const data = _.find(this.attributeList, (item) => {
          return item.text === this.attribute.inventoryName
        })
        this.selectedInventory = data ? data.id : null
        this.attributeList = [...this.attributeList, { id: response.Data, text: this.attribute.inventoryName, ApplyTypeId: this.ApplyTypeId }]
        this.selectedInventory = response.Data
        this.resetCategory()
        if (this.isParent) {
          const data = { status: 'saved' }
          this._CommonService.closeActiveInventoryForDynamicAdd({ ...data })
          this._CommonService.closeActiveInventoryPopup()
         
        } else {
          this.activeService.onParentAttrAdd()
        }
        this._CommonService.AddedItem()
      }
    }, error => console.log(error))
  }
resetCategory(){
  this.attribute.inventoryName =''
  this.attribute.shortName =''
  this.ApplyTypeId =null
  
}
  closeModal() {
    if ($('#active_inventory_master')) {
      $('#active_inventory_master').modal(UIConstant.MODEL_HIDE)
    }
    this.selectedInventory = null
  }

  /* Function to save and update the attribute name with value */
  saveAndUpdate = (value) => {
    let fromDate, toDate
    if (this.attribute.fromDatevalue) {
      fromDate = this._globalService.clientToSqlDateFormat(this.attribute.fromDatevalue, this.clientDateFormat)
    }
    if (this.attribute.toDateValue) {
      toDate = this._globalService.clientToSqlDateFormat(this.attribute.toDateValue, this.clientDateFormat)
    }
    const payload = {
      Id: this.attrEditId ? this.attrEditId : 0,
      ActiveInventoryCategoryId: this.selectedInventory,
      FromDate: fromDate,
      ToDate: toDate,
      ToLimit: this.attribute.toLimit,
      FromLimit: this.attribute.fromLimit,
      UnitId: 0,
      ParentTypeId: 15//fixed  
    }
    this.activeService.postActiveInventoryValue(payload).pipe((
      takeUntil(this.unSubscribe$)
    ))
      .subscribe((response) => {
        if (response.Code === UIConstant.THOUSAND) {
          if (value === 'save') {
            let saveName = this.attrEditId === null ? UIConstant.SAVED_SUCCESSFULLY : UIConstant.UPDATE_SUCCESSFULLY
            this.toastrService.showSuccess('', saveName)
            $('#active_inventory_master').modal(UIConstant.MODEL_HIDE)
            // this._CommonService.closeAttribute({ status: 'saved' })
            this._CommonService.AddedItem()
            const data = { status: 'saved', id: response.Data, name: this.attribute.value, AttributeId: this.selectedInventory }
            this._CommonService.closeActiveInventoryForDynamicAdd({ ...data })
            this.resetFormData()
            this.selectedInventory = null

            setTimeout(() => {
              if (this.attrname) {
                const element = this.renderer.selectRootElement(this.attrname.nativeElement, true)
                element.focus({ preventScroll: false })
              }
            }, 100)

          }
          else {
            this.toastrService.showSuccess('', UIConstant.SAVED_SUCCESSFULLY)
            this._CommonService.AddedItem()
            this.resetFormData()
            setTimeout(() => {
              if (this.AttributeValue) {
                const element = this.renderer.selectRootElement(this.AttributeValue.nativeElement, true)
                element.focus({ preventScroll: false })
              }
            }, 100)
            const data = { status: 'saved', id: response.Data, name: this.attribute.value, AttributeId: this.selectedInventory }
            //this._CommonService.closeAttributeForDynamicAdd({ ...data })
          }

        }
        if (response.Code === UIConstant.THOUSANDONE) {
          this.toastrService.showError('', response.Message)
        }
        if (response.Code === UIConstant.SERVERERROR) {
          this.toastrService.showError('', response.Message)
        }
      }, error => console.log(error))
    // }

  }

  /* Function call on dropdown value changes */
  onActiveValueChange = (event) => {
    if (this.selectedInventory !== null) {
      this.selectedInventory = event.id
      this.ApplyTypeId = event.ApplyTypeId
    }

  }

  /* Function call on component destroy */
  ngOnDestroy(): void {
    this.unSubscribe$.next()
    this.unSubscribe$.complete()
    this.deleteParent$.unsubscribe()
  }
}
