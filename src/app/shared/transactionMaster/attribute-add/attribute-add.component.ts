import { Component, OnInit, OnDestroy, ViewChild, Renderer2, ElementRef } from '@angular/core'
import { Subject, Subscription } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators'
import _ from 'lodash'
import { ToastrCustomService } from 'src/app/commonServices/toastr.service'
import { AttributeService } from 'src/app/transactionMaster/attribute/attribute.service'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
import { UIConstant } from 'src/app/shared/constants/ui-constant'
declare var $: any
@Component({
  selector: 'app-attribute-add',
  templateUrl: './attribute-add.component.html',
  styleUrls: ['./attribute-add.component.css']
})
export class AttributeAddComponent implements OnInit, OnDestroy {
  private unSubscribe$ = new Subject<void>()
  @ViewChild('formModel') formModel
  attribute: any = {}
  attrEditId: number = null
  attributeList: Array<any> = []
  selectedAttribute: number = null
  isParent: boolean = false
  deleteParent$: Subscription
  constructor (
    private attributeService: AttributeService,
    private toastrService: ToastrCustomService,
    public _CommonService: CommonService,
    private renderer: Renderer2
    ) {
  }

  // tslint:disable-next-line:space-before-function-paren
  ngOnInit() {

    this.initAttributeNameList(0)
    this.initAddAttributeData()

    this.deleteParent$ = this.attributeService.deleteParent$.subscribe(
      (status) => {
        if (status) {
          this.initAttributeNameList(0)
        }
      }
    )
  }

  @ViewChild('attrname') attrname: ElementRef

  /* initialising attribute data to open add attribute modal */
  initAddAttributeData = () => {
    this._CommonService.getAttributeStatus().pipe((
      takeUntil(this.unSubscribe$)
    )).subscribe((response: any) => {
      console.log('attribute edit : ', response)
      if (response.open === true) {
        console.log(response, 'add attr')
        this.resetFormData()
        this.isParent = response.data.isParent
        if (response.data.editId || response.data.attrNameId) {
          this.setEditData(response)
        }
        if (response.data.addNewId) {
          this.disabledAddNewFlag = false
          this.initAttributeNameList(response.data.attrNameId)
          this.addNewAttributeDynamic(response)
        } else {
          $('#attribute_master').modal(UIConstant.MODEL_SHOW)
          setTimeout(() => {
            if (this.attrname) {
              const element = this.renderer.selectRootElement(this.attrname.nativeElement, true)
              element.focus({ preventScroll: false })
            }
          }, 1000)
        }
        $('#attribute_master').modal(UIConstant.MODEL_SHOW)
        setTimeout(() => {
          if (this.attrname) {
            const element = this.renderer.selectRootElement(this.attrname.nativeElement, true)
            element.focus({ preventScroll: false })
          }
        }, 1000)
      } else {
        this.closeModal()
      }
    }, error => console.log(error))
  }

  /* setting form data in case of edit mode */
  setEditData = (response) => {
    this.attrEditId = response.data.editId
    this.selectedAttribute = response.data.attrNameId
    if (response.data.isParent) {
      this.attribute.name = response.data.attrValue
    } else {
      this.attribute.value = response.data.attrValue
    }
  }
  disabledAddNewFlag: boolean
  AttributeNameNewAdd: any
  addNewAttributeDynamic = (response) => {
    this.attrEditId = 0
    this.selectedAttribute = response.data.attrValue
    this.attribute.name = this.AttributeNameNewAdd
    this.disabledAddNewFlag = response.data.disabledAddButton

  }

  /* Resetting form data by default */
  resetFormData = () => {
    this.attribute = {}
    this.selectedAttribute = null
    this.attrEditId = null
    this.formModel.submitted = false
    //  console.log(this.formModel)
  }

  /* Initialising function to get the attribute name dropdown list */
  initAttributeNameList = (newAddId) => {
    this.attributeService.getAttributeName().pipe(
      takeUntil(this.unSubscribe$),
      map((response) => {
        return _.map(response.Data, (value) => {
          if (value.Id === newAddId) {
            this.attribute.name = value.Name
          }
          return {
            id: value.Id,
            text: value.Name
          }

        })
      })
    ).subscribe((response: any) => {
      console.log('attribute list : ', response)
      this.attributeList = [...response]
    }, error => console.log(error))
  }

  /* Function to add the new attribute name */
  AddAttributeName = () => {
    const payload = {
      Id: this.selectedAttribute ? this.selectedAttribute : 0,
      Name: this.attribute.name
    }
    this.attributeService.postAttribute(payload).pipe((
      takeUntil(this.unSubscribe$)
    )).subscribe((response) => {
      if (response.Code === UIConstant.THOUSANDONE && response.Data) {
        this.toastrService.showError('', response.Description)
      } else if (response.Code === UIConstant.THOUSAND && response.Data) {
        const data = _.find(this.attributeList, (item) => {
          return item.text === this.attribute.name
        })
        this.selectedAttribute = data ? data.id : null
        this.attributeList = [...this.attributeList, { id: response.Data, text: this.attribute.name }]
        this.selectedAttribute = response.Data
        if (this.isParent) {
          const data = { status: 'saved' }
          this._CommonService.closeAttributeForDynamicAdd({ ...data })
        } else {
          this.attributeService.onParentAttrAdd()
        }
      }
    }, error => console.log(error))
  }

  closeModal () {
    if ($('#attribute_master')) {
      $('#attribute_master').modal(UIConstant.MODEL_HIDE)
    }
  }

  /* Function to save and update the attribute name with value */
  saveAndUpdateAttribute = () => {
    const payload = {
      Id: this.attrEditId ? this.attrEditId : 0,
      Name: this.attribute.value,
      AttributeId: this.selectedAttribute
    }
    this.attributeService.postAttributeValue(payload).pipe((
      takeUntil(this.unSubscribe$)
    ))
      .subscribe((response) => {
        if (response.Code === UIConstant.THOUSAND) {
          this.toastrService.showSuccess('Success', 'Saved Successfully')
          $('#attribute_master').modal(UIConstant.MODEL_HIDE)
          // this._CommonService.closeAttribute({ status: 'saved' })
          const data = { status: 'saved', id: response.Data, name: this.attribute.value, AttributeId: this.selectedAttribute }
          this._CommonService.closeAttributeForDynamicAdd({ ...data })
        }
        if (response.Code === UIConstant.THOUSANDONE) {
          this.toastrService.showError('', response.Message)
        }
        if (response.Code === UIConstant.SERVERERROR) {
          this.toastrService.showError('', response.Message)
        }
      }, error => console.log(error))
  }

  /* Function call on dropdown value changes */
  onAttrValueChange = (event) => {
    this.selectedAttribute = event.value
  }

  /* Function call on component destroy */
  ngOnDestroy (): void {
    this.unSubscribe$.next()
    this.unSubscribe$.complete()
    this.deleteParent$.unsubscribe()
  }
}
