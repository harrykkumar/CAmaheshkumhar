import { Component, ViewChild, Renderer2, ElementRef } from '@angular/core'
import { Validators, FormGroup, FormBuilder } from '@angular/forms'
import { UIConstant } from '../../../constants/ui-constant'
import { SaveCategoryModel,AddLedgerGroup, ResponseCategory, CatagoryDetailModel, AddCust } from '../../../../model/sales-tracker.model'
import { Subscription } from 'rxjs/Subscription'
import { Select2OptionData, Select2Component } from 'ng2-select2'
import { CategoryServices } from '../../../../commonServices/TransactionMaster/category.services'
import { ToastrCustomService } from '../../../../commonServices/toastr.service'
import { ItemmasterServices } from 'src/app/commonServices/TransactionMaster/item-master.services'
import { CommonService } from '../../../../commonServices/commanmaster/common.services'
declare var $: any

@Component({ 
  selector: 'app-ledger-group',
  templateUrl: './ledger-group.component.html',
  styleUrls: ['./ledger-group.component.css']
})
export class LedgerGroupAddComponent {
  parentId: number
  private Id: any
  deletedId: number
  searchForm: FormGroup
  LedgerGroupForm: FormGroup
  subscribe: Subscription
  submitClick: boolean
  categoryDetail: CatagoryDetailModel[]
  ledgergroupPlaceHolder: Select2Options
  modalSub: Subscription
  LedgerGroupValue: any
  editMode: boolean = false
  ItemAdd: boolean = false
  toEmitName: string = ''
  catLevel: number = 1
  LgroupDetails: any = []
  loading: boolean = true
  editID: any
  catOrSubCatSub: Subscription
  public ledgerGroupData: Array<Select2OptionData>

  constructor (private _catagoryservices: CategoryServices,
    private _formBuilder: FormBuilder,
    private _commonservice: CommonService,
    private toastrService: ToastrCustomService,
    private itemService: ItemmasterServices,
    private renderer: Renderer2) {
    this.formLedgerGroup()
    this.modalSub = this._commonservice.getledgerGroupStatus().subscribe(
      (data: AddCust) => {
        if (data.open) {
          if (+data.type === 1) {
            this.ItemAdd = true
          } else {
            this.ItemAdd = false
            if (data.editId === '') {
              this.Id=0
              this.editID =0
              this.editMode = false
            } else {
              this.editMode = true
              this.Id = data.editId
              this.editID =data.editId

            }
          }
          this.getLedgerGroupList()
          this.openModal()
        } else {
          this.closeModal()
        }
     }
    )

    this.catOrSubCatSub = this._commonservice.getNewCatOrSubCatStatus().subscribe(
      (data: AddCust) => {
        if (data.id && data.name) {
          let newData = Object.assign([], this.ledgerGroupData)
          newData.push({ id: data.id, text: data.name })
          this.ledgerGroupData = newData
          this.LedgerGroupValue = data.id
        }
      }
    )
  }

  getLedgerGroupList () {
    this.ledgergroupPlaceHolder = { placeholder: 'Select Group' }
    let newData = [{ id: '0', text: 'Select Group' ,headId :0}]
    this._commonservice.getLedgerGroupParentData('').subscribe(data => {
      if (data.Code === UIConstant.THOUSAND && data.Data.length > 0) {
        this.LgroupDetails = data.Data
        console.log(this.LgroupDetails ,'head-group')
        data.Data.forEach(element => {
          newData.push({
            id: element.Id,
            text: element.GlName,
            headId:element.HeadId
          })
        })
        this.ledgerGroupData = newData
      }
    },
    (error) => {
      console.log(error)
    },
    () => {
      this.loading = false
    })
  }

  ngOnDestroy () {
    this.modalSub.unsubscribe()
    this.catOrSubCatSub.unsubscribe()
  }
  ngOnInit () {
    this.submitClick = false
  }

  get f () {
    return this.LedgerGroupForm.controls
  }

  select2PopuValue = false
  openModal () {
    this.headId =0
    this.isledger = false
    this.isSelectParentGrp = true
    this.submitClick = false
    if (this.underGroupSelect2) {
      this.underGroupSelect2.setElementValue('')
    }
    if (this.editMode) {
      this.getEditDetailData(this.Id)
    } else {
      this.parentId = UIConstant.ZERO
      this.Id = UIConstant.ZERO
      $('#general_group_ledger').modal(UIConstant.MODEL_SHOW)
      setTimeout(() => {
        if (this.GLname) {
          const element = this.renderer.selectRootElement(this.GLname.nativeElement, true)
          element.focus({ preventScroll: false })
        }
      }, 1000)
    }
  }

  closeModal () {
    if ($('#general_group_ledger').length > 0) {
      this.Id = UIConstant.ZERO
      $('#general_group_ledger').modal(UIConstant.MODEL_HIDE)
    }
  }

  @ViewChild('under_group_select2') underGroupSelect2: Select2Component
  @ViewChild('GLname') GLname: ElementRef
  formValue: ResponseCategory = {}
  getEditDetailData (id) {
    let _self = this
    this._commonservice.getLedgerGroupAPI('?Id='+id).subscribe(data => {
      if (data.Code === UIConstant.THOUSAND && data.Data.length > 0) {
        this.LedgerGroupForm.controls.LedgerGroupName.setValue(data.Data[0].GlName)
        this.LedgerGroupForm.controls.ShortName.setValue(data.Data[0].ShortName)
        this.isledger = data.Data[0].IsLedger
        setTimeout(() => {
          _self.underGroupSelect2.setElementValue(data.Data[0].UnderId)
          this.parentId = data.Data[0].UnderId
          
          if (this.GLname) {
            const element = this.renderer.selectRootElement(this.GLname.nativeElement, true)
            element.focus({ preventScroll: false })
          }
        }, 1000)
        $('#general_group_ledger').modal(UIConstant.MODEL_SHOW)
      }
    })
  }

  private formLedgerGroup () {
    this.LedgerGroupForm = this._formBuilder.group({
      'LedgerGroupName': ['', Validators.compose([Validators.required])],
      'ShortName': [''],
      'isLedger' :['']
    })
  }
  checkValidation () {
    if (this.parentId > 0) {
      return  this.isSelectParentGrp = false
    } else {
      return this.isSelectParentGrp = true

    }
  }
  isledger: boolean
  isSelectParentGrp: boolean
  checkIsLedger (e) {
    this.isledger = e.target.checked === true ? true : false
  }
  headId: any
  onChnageGroup (event) {
    if (event.value && event.data.length > 0) {
        this.parentId = +event.value
        this.headId =event.data[0].headId
        this.checkValidation() 
    }
  }

  saveUpdateLedgerGroup (value) {
    this.submitClick = true
    let _self = this
    this.checkValidation()
    if (this.LedgerGroupForm.valid && this.parentId > 0) {
      this._commonservice.postLedgerGroupAPI(this.ledgerGroupParam()).subscribe(data => {
        if (data.Code === UIConstant.THOUSAND ) {
          if(value ==='save'){
            let toSend = { name: this.LedgerGroupForm.value.LedgerGroupName, id: data.Data ,headId: this.headId }
            this._commonservice.AddedItem()
            this._commonservice.closeledgerGroup({...toSend})
            this.getLedgerGroupList()
            let saveName= this.editID ===0 ? UIConstant.SAVED_SUCCESSFULLY : UIConstant.UPDATE_SUCCESSFULLY
            _self.toastrService.showSuccess('', saveName)
            this.LedgerGroupForm.controls.LedgerGroupName.setValue('')
            this.LedgerGroupForm.controls.ShortName.setValue('')
            this.isledger = false
            setTimeout(() => {
              if (this.GLname) {
                const element = this.renderer.selectRootElement(this.GLname.nativeElement, true)
                element.focus({ preventScroll: false })
              }
            }, 1000)
          }
          else{
            this._commonservice.AddedItem()
            this.getLedgerGroupList()
            _self.toastrService.showSuccess('', UIConstant.SAVED_SUCCESSFULLY)
            this.LedgerGroupForm.controls.LedgerGroupName.setValue('')
            this.LedgerGroupForm.controls.ShortName.setValue('')
            this.isledger = false
            setTimeout(() => {
              if (this.GLname) {
                const element = this.renderer.selectRootElement(this.GLname.nativeElement, true)
                element.focus({ preventScroll: false })
              }
            }, 1000)
            this.clearCategoryvalidation()
          }

        } else if (data.Code === UIConstant.THOUSANDONE) {
          this.toastrService.showError(data.Message, '')
        } else {
          _self.toastrService.showError('', data.Message)
        }
      })
    }
  }
ledgerGroupParam (): AddLedgerGroup {
  debugger;
 const Obj = {
   ledgerGroup: {
     Id: this.Id ? this.Id : 0,
     GlName: this.LedgerGroupForm.value.LedgerGroupName,
     UnderId:this.parentId > 0 ? this.parentId : 0,
     IsLedger:  this.isledger,
     ShortName: this.LedgerGroupForm.value.ShortName,
   } as AddLedgerGroup
 }
 
 console.log('CategoryParams : ', JSON.stringify(Obj.ledgerGroup))
 return Obj.ledgerGroup
}
  clearCategoryvalidation () {
    this.LedgerGroupForm.reset()
    this.toEmitName = ''
    this.submitClick = false
    this.ledgerGroupData = []
    this.isledger = false
  }
  
  // getCatLevel () {
  //   let _self = this
  //   this._catagoryservices.getCategoryLevel().subscribe(
  //     (data) => {
  //       if (data.Code === UIConstant.THOUSAND && data.Data.SetupSettings.length > 0) {
  //         const setUpSettings = data.Data.SetupSettings
  //         setUpSettings.forEach(setting => {
  //           if (+setting.SetupId === 1) {
  //             _self.catLevel = +setting.Val
  //             console.log('setting catl level : ', _self.catLevel)
  //             return
  //           }
  //         })
  //       }
  //     }
  //   )
  // }
}
