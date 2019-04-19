import { AttributeService } from './attribute.service'
import { Component, OnInit } from '@angular/core'
import { UIConstant } from 'src/app/shared/constants/ui-constant'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { ToastrCustomService } from 'src/app/commonServices/toastr.service'
import _ from 'lodash'
import { CommonService } from '../../commonServices/commanmaster/common.services'

@Component({
  selector: 'app-attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.css']
})
export class AttributeComponent implements OnInit {
  private unSubscribe$ = new Subject<void>()
  searchString: string = ''
  attributeListHolder: Array<any> = []
  attributeList: Array<any> = []
  constructor (
    private attributeService: AttributeService,
    private toastrService: ToastrCustomService,
    public _CommonService: CommonService) {
    this.initDeleteStatus()
    this.initCloseAttributeStatus()
  }

  ngOnInit () {
    this.initAttributeList()
  }

  /* Function to intialising attribute list to show in table */
  initAttributeList = () => {
    this.attributeService.getAttributeList().
    pipe(takeUntil(this.unSubscribe$)).
    subscribe((Data: any) => {
      if (Data.Code === UIConstant.THOUSAND && Data.Data) {
        this.attributeList = [...Data.Data]
      }
    }, error => console.log(error))
  }

  /* Function to listen add attribute save */
  initCloseAttributeStatus = () => {
    this._CommonService.closeAttributeStatus().
    pipe(takeUntil(this.unSubscribe$)).
    subscribe((response) => {
      if (response.status === 'saved') {
        this.initAttributeList()
      }
    }, error => console.log(error))
  }

  /* Function to emit and open add-attribute-modal  */
  addAttribute = () => {
    this._CommonService.openAttribute({}, true)
  }

  // Funtion to emit and open delete confirm dialog box
  deleteAttribute = (id) => {
    this._CommonService.openDelete(id, 'attribute')
  }

  //  Function to emit and open add-attribute-modal in edit mode
  editAttribute (editAttrId, attrValue, attrId) {
    const data = { 'editId': editAttrId, 'attrValue': attrValue, 'attrNameId': attrId }
    this._CommonService.openAttribute(data, true)
  }

  // Function to initialising delete attribute event
  initDeleteStatus = () => {
    this._CommonService.getDeleteStatus().
    pipe(takeUntil(this.unSubscribe$)).
    subscribe(
      (obj) => {
        if (obj.id && obj.type && obj.type === 'attribute') {
          this.confirmDeleteAttribute(obj.id)
        }
      }, error => console.log(error)
    )
  }

  /* Function to listen the confirm delete action */
  confirmDeleteAttribute = (id) => {
    this.attributeService.deleteAttribute(id).
    pipe(takeUntil(this.unSubscribe$)).
    subscribe((Data) => {
      if (Data.Code === UIConstant.DELETESUCCESS) {
        this.toastrService.showSuccess('Sucess', 'Deleted Successfully')
        this._CommonService.closeDelete('')
        this.initAttributeList()
      }
      if (Data.Code === UIConstant.CANNOTDELETERECORD) {
        this.toastrService.showInfo('Info', 'Can not deleted !')
        this._CommonService.closeDelete('')
      }
    }, error => console.log(error))
  }

  /* Function to filter the list on bases of search string */
  searchAttribute = () => {
    this.attributeService.getAttributeListBySearhFilter(this.searchString).
    pipe(takeUntil(this.unSubscribe$)).
    subscribe((Data) => {
      if (Data.Code === UIConstant.THOUSAND && Data.Data) {
        this.attributeList = [...Data.Data]
      }
    }, error => console.log(error))
  }

  /* Function call on component destroy */
  ngOnDestroy (): void {
    this.unSubscribe$.next()
    this.unSubscribe$.complete()
  }
}
