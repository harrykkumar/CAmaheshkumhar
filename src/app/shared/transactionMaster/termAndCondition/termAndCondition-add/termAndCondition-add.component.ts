import { Component, ViewChild, Renderer2 } from '@angular/core'
import { Select2OptionData, Select2Component } from 'ng2-select2'
import { Subscription } from 'rxjs/Subscription'
import { ItemModel, AddCust } from '../../../../model/sales-tracker.model'
import { ToastrCustomService } from '../../../../commonServices/toastr.service'
import { ItemmasterServices } from '../../../../commonServices/TransactionMaster/item-master.services'
import { CommonSetGraterServices } from '../../../../commonServices/setgatter.services'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { UIConstant } from '../../../constants/ui-constant'
import { CategoryServices } from '../../../../commonServices/TransactionMaster/category.services'
import { UnitMasterServices } from 'src/app/commonServices/TransactionMaster/unit-mater.services'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'

declare const $: any
@Component({
  selector: 'app-termAndCondition-add',
  templateUrl: './termAndCondition-add.component.html'
})
export class TermAndConditionAddComponent {
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

  submitClick: boolean
  modalSub: Subscription

  unitSettingType: number = 0
  constructor(public _toastrcustomservice: ToastrCustomService, private _itemmasterServices: ItemmasterServices,
    private _commonGaterSeterServices: CommonSetGraterServices,
    private _formBuilder: FormBuilder,
    private commonService: CommonService,
    private _catagoryservices: CategoryServices,
    private unitMasterService: UnitMasterServices,
    private renderer: Renderer2
  ) {
    this.modalSub = this.commonService.getTermAndConditionStatus().subscribe(
      (data: AddCust) => {
        if (data.open) {
          if (data.editId === '') {
            this.editMode = true
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

  openModal() {
    this.editFlag =true
    this.resetForm()
    this.getFormnameType()
    // if (this.editMode) {
    // this.editForm(this.id)
    // } 
    $('#term_and_condition').modal(UIConstant.MODEL_SHOW)

  }
  closeModal() {
    this.id = 0
    $('#term_and_condition').modal(UIConstant.MODEL_HIDE)

  }
  editForm(id) {
    this.subscribe = this._itemmasterServices.editRoute(id).subscribe(data => {
      console.log('edit route form : ', data)
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
  getFormnameType() {
    this.commonService.gettermsAndCondtionType('TermsCondition').subscribe(Data => {
      if (Data.Code === UIConstant.THOUSAND) {
        this.ListTypeName = Data.Data
      }
      else {
        this._toastrcustomservice.showError('', Data.Message)
      }
    })
  }
  selectedid: any = 0
  Termid: number = 0
  TermConditions: any = []
  terms: any = ''
  addtermsMore() {
    debugger
    if (this.terms !== '') {
      this.TermConditions.push({
        id: this.Termid,
        Terms: this.terms
      })
      this.terms = ''
    }
    this.editFlag = true
  }
  resetForm() {
    this.selectedid = null
    this.TermConditions = []
    this.terms = ''
  }


  saveTerm() {
    this.submitClick = true
    this.addtermsMore()
    console.log('obj : ', JSON.stringify(this.paramForInput()))
    if (this.selectedid > 0) {
      if (this.TermConditions.length > 0) {
        this.commonService.postTermsAndCondition(this.paramForInput()).subscribe(Data => {
          if (Data.Code === UIConstant.THOUSAND) {
            this.commonService.newRouteAdded()
            this._toastrcustomservice.showSuccess('', 'Saved Successfully')
            this.closeModal()
            this.resetForm()
          } else {
            this._toastrcustomservice.showError('', Data.Message)
          }
        })
      }
      else {
        this._toastrcustomservice.showError('', 'Please write Terms & condition')
      }
    }
    else {
      this._toastrcustomservice.showError('', 'Please Select Type')

    }

  }
  selectedTypeId: any = 0
  onChangeType(evt) {
    if (this.selectedid !== null) {
      this.selectedTypeId = this.selectedid
      if (this.editMode) {
        this.TermConditions =[]
        this.commonService.changeTypeTermsAndCondition(this.selectedTypeId).subscribe(data => {
          if (data.Code === UIConstant.THOUSAND && data.Data.length>0 ) {
            data.Data.forEach(element => {
              if(element.Terms !==null){
                this.TermConditions.push({
                  id: element.Id,
                  Terms: element.Terms
                })
              }
   
            });
  
            console.log(this.TermConditions ,'jjj0000--')

          }
        })
      }
    }
  }
  paramForInput() {
    let input = {
      obj: {
        ParentTypeId: this.selectedTypeId,
        TermConditions: this.TermConditions
      }
    }
    return input.obj
  }

  formTypeNmae: any = 'Form Type'

  closeRoute() {
    this.resetForm()
  }
  deleteItem(i) {
    if (this.TermConditions.length > 0) {
      this.TermConditions.splice(i, 1)
    }

  }
  editFlag :boolean= true
  editRowItem(i) {
    debugger
    if(this.editFlag){
      if (this.TermConditions.length > 0) {
        this.editFlag = false
          this.id=this.TermConditions[i].id,
          this.terms= this.TermConditions[i].Terms
        this.deleteItem(i)
     
      }
    }
    
  }
}
