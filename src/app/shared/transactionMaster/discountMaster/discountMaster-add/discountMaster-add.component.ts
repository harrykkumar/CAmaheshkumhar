import { Component, ViewChild, Renderer2 } from '@angular/core'
import { Select2OptionData, Select2Component } from 'ng2-select2'
import { Subscription } from 'rxjs/Subscription'
import { ItemModel, AddCust } from '../../../../model/sales-tracker.model'
import { ToastrCustomService } from '../../../../commonServices/toastr.service'
import { ItemmasterServices } from '../../../../commonServices/TransactionMaster/item-master.services'
import { UIConstant } from '../../../constants/ui-constant'
import { Settings } from '../../../../shared/constants/settings.constant'
import * as _ from 'lodash'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
import { GlobalService } from '../../../../commonServices/global.service'
import { SetUpIds } from 'src/app/shared/constants/setupIds.constant'
declare const $: any
@Component({
  selector: 'app-discountMaster-add',
  templateUrl: './discountMaster-add.component.html'
})
export class DiscountMasterAddComponent {
  unitId: number
  taxId: number
  id: any
  categoryId: number
  editMode: boolean
  itemDetail: ItemModel[]
  subscribe: Subscription
  public subCategoryType: Array<Select2OptionData>
  public selectUnitType: Array<Select2OptionData>
  public selectTax: Array<Select2OptionData>
  taxTypePlaceHolder: Select2Options
  subCategoryPlaceHolder: Select2Options
  unitTypePlaceHolder: Select2Options
  categoryPlaceHolder: Select2Options
  currencyValues: Array<{ id: number, symbol: string }> = [{ id: 0, symbol: '%' }]

  submitClick: boolean
  modalSub: Subscription
  formTypeName: any = 'Select Type'

  unitSettingType: number = 0
  constructor(public settings: Settings,
    public gs: GlobalService,
    public _toastrcustomservice: ToastrCustomService,
    private _itemmasterServices: ItemmasterServices,
    private commonService: CommonService,
  ) {
    this.modalSub = this.commonService.openDiscountMasterStatus().subscribe(
      (data: AddCust) => {
        if (data.open) {
          console.log(data ,'open-Dis form')
          this.isChekBoxTypeForm = false
          if (data.editId === '') {
            this.editMode = false
            this.isChekBoxTypeForm = data.type
            if (this.isChekBoxTypeForm) {
              this.getApplyedDiscount(data.discountParam, data.editData)
            }
          } else {
            this.id = data.editId
            this.editMode = true

          }
          this.openModal()
        } else {
          this.closeModal()
        }
      }
    )
  }

  ngOnDestroy() {
    this.modalSub.unsubscribe()
    if (this.subscribe) {
      this.subscribe.unsubscribe()
    }
  }
  checkedListForEdit: any = []
  NocheckedList: any = []
  comparer(otherArray) {
    return function (current) {
      return otherArray.filter(function (other) {
        return other.DiscountId == current.Id && other.DiscountId == current.Id
      }).length == 0;
    }
  }
  DiscountList: any = []
  getApplyedDiscount(DiscountParam, editData) {
    debugger
    this.commonService.getListApplyedDiscount(DiscountParam).subscribe(resp => {
      if (resp.Code === UIConstant.THOUSAND && resp.Data.length > 0) {
        this.DiscountList = []
        this.addedDiscountList = resp.Data
        this.checkedListForEdit = []
        this.NocheckedList = []
        resp.Data.forEach((main, index) => {
          editData.forEach(ele => {
            if (ele.DiscountId === main.Id) {
              this.checkedListForEdit.push(ele)

              resp.Data[index]['disabledRateBox'] = true
            }
          });
        })
        this.checkedList = [...this.checkedListForEdit]
        var alradyCheckedList = resp.Data.filter(this.comparer(this.checkedListForEdit));
        this.DiscountList = alradyCheckedList.concat(this.checkedListForEdit);
        resp.Data.forEach((main, index) => {
          editData.forEach(ele => {
            if (ele.DiscountId === main.DiscountId) {
              this.DiscountList[index]['disabledRateBox'] = true
            }
          });
        })
        
    console.log(this.DiscountList ,'edit-data-dis')
      }
      else {
        this._toastrcustomservice.showInfo('There is no any Multi Discount', '')
      }
    })

  }
  disabledRateBox: boolean
  checkedList: any = []
  addedMultipleDiscount(option, event) {
    debugger
    if (event.target.checked) {
      this.checkedList.push({
        Id: 0,
        DiscountId: option.DiscountId,
        Value: option.Value,
        ValueType: option.ValueType,
        Name: option.Name,
        Amount: 0,
        isChecked: true
      });

      this.DiscountList.forEach((ele, index) => {
        if (ele.DiscountId === option.DiscountId) {
          this.DiscountList[index]['disabledRateBox'] = true
        }
      });

    } else {
      for (var i = 0; i < this.checkedList.length; i++) {
        
       if ((this.checkedList[i].DiscountId == option.DiscountId)) {
          this.DiscountList.forEach((ele, index) => {
            if (ele.DiscountId === option.DiscountId) {
              this.DiscountList[index].disabledRateBox = false
              this.checkedList.splice(i, 1);
              //this.checkedListForEdit.splice(index,1)
            }
          });
         
       }
    }
    }

    console.log(this.checkedList)
  }
  isChekBoxTypeForm: any = false
  openModal() {
    this.checkedList = []
    this.initilazationForm()
    this.disabledValue = true
    this.getDiscountType()
    this.getSetUpModules((JSON.parse(this.settings.moduleSettings).settings))
    if (this.editMode && !this.isChekBoxTypeForm) {
      this.editDiscount(this.id)
    }
    $('#billdiscount_master').modal(UIConstant.MODEL_SHOW)
  }

  editDiscount(id) {
    debugger
    this.commonService.getDiscountList('id=' + id).subscribe(resp => {
      if (resp.Code === UIConstant.THOUSAND && resp.Data.length > 0) {
        if (resp.Data[0].ToDate === null) {
          this.toDate = ''
        }
        if (resp.Data[0].FromDate === null) {
          this.fromDate = ''
        }
        this.DiscountNameValue = resp.Data[0].Name
        this.DiscountAmt = resp.Data[0].Value
        this.discountNameId = resp.Data[0].DiscountTypeId
        this.disabledValue = false
        this.DiscountName = resp.Data[0].DiscountTypeName
        this.DiscountType = resp.Data[0].ValueType === 0 ? 0 : 1
        this.selectedid = resp.Data[0].DiscountTypeId
        this.FromDays = resp.Data[0].DayInterval
        this.ToDays = resp.Data[0].DayIntervalTo
        this.fromAmount = resp.Data[0].FromAmount
        this.ToAmount = resp.Data[0].ToAmount
        this.OnInstantBill = resp.Data[0].OnInstantBill
        this.FromQty = resp.Data[0].QtyFrom
        this.ToQty = resp.Data[0].QtyTo
        this.toDate = resp.Data[0].ToDate
        this.fromDate = resp.Data[0].FromDate


      }
    })
  }

  clientDateFormat: any
  DiscountFor100Perct: any
  noOfDecimalPoint: any
  getSetUpModules(settings) {
    settings.forEach(element => {
      if (element.id === SetUpIds.dateFormat) {
        this.clientDateFormat = element.val[0].Val
      }
      if (element.id === SetUpIds.noOfDecimalPoint) {
        this.noOfDecimalPoint = +element.val
      }
      if (element.id === SetUpIds.DiscountFor100) {
        this.DiscountFor100Perct = +element.val
      }
      if (element.id === SetUpIds.currency) {
        if (element.val.length > 0) {
          let defaultCurrency = element.val[0].Val
          // this.currencyValues = [{ id: 0, symbol: '%' }]
          // element.val.forEach(element => {
          //   this.currencyValues.push({
          //     id: element.Id,
          //     symbol: element.Val
          //   })
          // });
          this.currencyValues = [
            { id: 0, symbol: '%' },
            { id: 1, symbol: defaultCurrency }
          ]
        }
      }
    })

  }
  MultiPleDiscountType() {

  }
  ApplyedDiscount() {
    this.commonService.closeDiscountMaster(this.checkedList)
  }
  closeModal() {
    this.id = 0
    $('#billdiscount_master').modal(UIConstant.MODEL_HIDE)

  }
  editForm(id) {
    this.subscribe = this._itemmasterServices.editRoute(id).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND && data.Data.length > 0) {
        this.id = data.Data[0].Id

      }
    })
  }

  unitError: boolean
  @ViewChild('unit_select2') unitSelect2: Select2Component

  selectedTax(event) {
    this.taxId = +event.value

  }
  ListTypeName: any = []
  formType: any = ''
  getDiscountType() {
    let DiscountTypeList = [{ Id: 1, Name: 'Normal Discount' },
    { Id: 2, Name: 'Cash Discount' },
    { Id: 3, Name: 'Volume Discount' },
    { Id: 4, Name: 'Trade Discount' }]
    this.ListTypeName = DiscountTypeList


  }
  selectedid: any = 0

  changeDiscountType(e) {
    this.DiscountType = e === '0' ? 0 : 1
  }
  addedDiscountList: any = []
  DiscountNameValue: any
  DiscountAmt: number = 0
  DiscountType: any
  DiscountValidation(e) {

    if (this.DiscountType === 0) {
      if (e === '0') {
        this.DiscountAmt = 0
      }
      else {
        if (Number(e.target.value) > Number(99.99990) &&
          e.keyCode != 46 // delete
          &&
          e.keyCode != 8 // backspace
        ) {
          e.preventDefault();
          this.DiscountAmt = 0
        } else {
          this.DiscountAmt = Number(e.target.value);
        }
      }
    }

  }
  validCheckedDiscount(discountItem, e) {
    if (discountItem.ValueType === 0) {
      if (Number(e.target.value) > Number(99.999) &&
        e.keyCode != 46
        &&
        e.keyCode != 8
      ) {
        e.preventDefault();
        discountItem.Value = 0
      } else {
        discountItem.Value = Number(e.target.value);
      }
    }
  }
  checkOnInstantBill(e) {
    this.OnInstantBill = e.target.checked === true ? true : false
  }

  invalidObj: any = {}
  checkForValidation() {
    if (this.discountNameId || 1 ||
      this.DiscountAmt ||
      this.DiscountNameValue ||
      this.ToAmount || this.FromDays || this.toDate || this.fromDate
      || this.fromAmount || this.ToDays || this.ToQty || this.FromQty
    ) {
      let isValid = 1
      if (this.discountNameId > 0) {
        this.invalidObj['discountNameId'] = false
      } else {
        this.invalidObj['discountNameId'] = true
        isValid = 0
      }
      if (this.DiscountNameValue !== '') {
        this.invalidObj['DiscountNameValue'] = false
      } else {
        this.invalidObj['DiscountNameValue'] = true
        isValid = 0
      }
      if (this.DiscountAmt > 0) {
        this.invalidObj['DiscountAmt'] = false
      } else {
        this.invalidObj['DiscountAmt'] = true
        isValid = 0
      }
      if (this.discountNameId === 2) {

        if (+this.FromDays > 0) {
          this.invalidObj['FromDays'] = false
        } else {
          this.invalidObj['FromDays'] = true
          isValid = 0
        }
        if (+this.ToDays > 0) {
          this.invalidObj['ToDays'] = false
        } else {
          this.invalidObj['ToDays'] = true
          isValid = 0
        }
      }
      if (this.discountNameId === 3) {

        if (+this.fromAmount > 0) {
          this.invalidObj['fromAmount'] = false
        } else {
          this.invalidObj['fromAmount'] = true
          isValid = 0
        }
        if (+this.ToAmount > 0) {
          this.invalidObj['ToAmount'] = false
        } else {
          this.invalidObj['ToAmount'] = true
          isValid = 0
        }
      }
      if (this.discountNameId === 4) {

        if (+this.FromQty > 0) {
          this.invalidObj['FromQty'] = false
        } else {
          this.invalidObj['FromQty'] = true
          isValid = 0
        }
        if (+this.ToQty > 0) {
          this.invalidObj['ToQty'] = false
        } else {
          this.invalidObj['ToQty'] = true
          isValid = 0
        }
      }
      return !!isValid
    }
  }
  SaveDiscount() {

    this.submitClick = true
    if (this.checkForValidation()) {
      if (this.discountNameId > 0) {
        this.commonService.postMultipleDiscount(this.paramForDiscountInput()).subscribe(Data => {
          if (Data.Code === UIConstant.THOUSAND) {
            this.commonService.newRouteAdded()
            this.closeModal()
            this._toastrcustomservice.showSuccess('', UIConstant.SAVED_SUCCESSFULLY)

            this.initilazationForm()
          } else {
            this._toastrcustomservice.showError('', Data.Message)
          }
        })

      }
      else {
        this._toastrcustomservice.showError('', 'Please Select Type')

      }
    }

  }

  DiscountName: any
  discountNameId: any = 1
  selectedTypeId: any = 1
  disabledValue: boolean = true
  onChangeType(evt) {
    if (this.selectedid !== null) {
      this.selectedTypeId = this.selectedid
      this.DiscountName = evt.Name
      this.discountNameId = evt.Id
      this.invalidObj['discountNameId'] = false
    }
  }


  fromDate: string = null
  toDate: string = null
  OnInstantBill: boolean = false
  ToDays: number = 0
  FromDays: number = 0
  fromAmount: number = 0
  ToAmount: number = 0
  FromQty: number = 0
  ToQty: number = 0
  initilazationForm() {
    this.discountNameId = 1
    this.selectedid = 1
    this.DiscountType = 0
    this.fromDate = null
    this.toDate = null
    this.OnInstantBill = false
    this.ToDays = 0
    this.FromDays = 0
    this.fromAmount = 0
    this.DiscountName = 'Normal Discount'
    this.ToAmount = 0
    this.DiscountNameValue = ''
    this.DiscountAmt = 0
    this.FromQty = 0
    this.ToQty = 0
  }
  paramForDiscountInput() {
    debugger
    let todate = ''
    let fromdate = ''
    if (this.toDate !== null) {
      todate = this.gs.clientToSqlDateFormat(this.toDate, this.clientDateFormat)
    }

    if (this.fromDate !== null) {
      fromdate = this.gs.clientToSqlDateFormat(this.fromDate, this.clientDateFormat)
    }
    let input = {
      obj: {
        Id: this.id === 0 ? 0 : this.id,
        DiscountTypeId: this.selectedid,
        ApplyTypeId: 0,
        Name: this.DiscountNameValue,
        FromDate: fromdate,
        ToDate: todate,
        Value: this.DiscountAmt,
        ValueType: this.DiscountType,
        OnInstantBill: this.OnInstantBill,
        DayIntervalTo: this.ToDays,
        DayInterval: this.FromDays,
        FromAmount: this.fromAmount,
        ToAmount: this.ToAmount,
        QtyFrom: this.FromQty,
        QtyTo: this.ToQty,
        Type: 'Discount'
      }
    }
    return input.obj
  }


  closeRoute() {
    this.initilazationForm()
  }



}
