import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core'
import { UIConstant } from '../../constants/ui-constant'
import { Subject } from 'rxjs'
import { takeUntil, map } from 'rxjs/operators'
import _ from 'lodash'
import { ToastrCustomService } from 'src/app/commonServices/toastr.service'
declare var $: any
import { CommonService } from '../../../commonServices/commanmaster/common.services'
import { AttributeService } from 'src/app/transactionMaster/attribute/attribute.service'

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

  constructor (
    private attributeService: AttributeService,
    private toastrService: ToastrCustomService,
    public _CommonService: CommonService) {
  }

  ngOnInit () {
    this.initAttributeNameList()
    this.initAddAttributeData()
  }

  /* initialising attribute data to open add attribute modal */
  initAddAttributeData = () => {
    this._CommonService.getAttributeStatus().pipe((
      takeUntil(this.unSubscribe$)
    )).subscribe((response: any) => {
      if (response.open === true) {
        console.log(response ,'add attr')
        this.resetFormData()
        if (response.data.editId) {
          this.setEditData(response)
        }
        else{
        $('#attribute_master').modal(UIConstant.MODEL_SHOW)
          
        }
        $('#attribute_master').modal(UIConstant.MODEL_SHOW)
      }
    }, error => console.log(error))
  }

  /* setting form data in case of edit mode */
  setEditData = (response) => {
    this.attrEditId = response.data.editId
    this.selectedAttribute = response.data.attrNameId
    this.attribute.value = response.data.attrValue
  }

  /* Resetting form data by default */
  resetFormData = () => {
    this.attribute = {}
    this.selectedAttribute = null
    this.attrEditId = null
    this.formModel.submitted = false
    console.log(this.formModel)
  }

  /* Initialising function to get the attribute name dropdown list */
  initAttributeNameList = () => {
    this.attributeService.getAttributeName().pipe(
      takeUntil(this.unSubscribe$),
      map((response) => {
        return _.map(response.Data, (value) => {
          return {
            id: value.Id,
            text: value.Name
          }
        })
      })
    ).subscribe((response: any) => {
      this.attributeList = [...response]
    }, error => console.log(error))
  }

  /* Function to add the new attribute name */
  AddAttributeName = () => {
    const payload = {
      Id: this.attrEditId ? this.attrEditId : 0,
      Name: this.attribute.name
    }
    this.attributeService.postAttribute(payload).pipe((
      takeUntil(this.unSubscribe$)
    )).subscribe((response) => {
      if (response.Code === 1001) {
        const data = _.find(this.attributeList, (item) => {
          return item.text === this.attribute.name
        })
        this.selectedAttribute = data ? data.id : null
      } else if (response.Code === 1000) {
        this.attributeList = [...this.attributeList, { id: response.Data, text: this.attribute.name }]
        this.selectedAttribute = response.Data
      }
    },error => console.log(error))
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
      if (response.Code === 1000) {
        this.toastrService.showSuccess('Success', 'Saved Successfully')
        $('#attribute_master').modal(UIConstant.MODEL_HIDE)
        this._CommonService.closeAttribute({ status: 'saved' })
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
  }
}
