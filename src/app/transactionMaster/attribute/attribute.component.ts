import { AttributeService } from './attribute.service'
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { UIConstant } from 'src/app/shared/constants/ui-constant'
import { Subject, fromEvent } from 'rxjs'
import { takeUntil, map, filter, debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { ToastrCustomService } from 'src/app/commonServices/toastr.service'
import _ from 'lodash'
import { CommonService } from '../../commonServices/commanmaster/common.services'
import { FormGroup, FormBuilder } from '@angular/forms'
import { PagingComponent } from '../../shared/pagination/pagination.component'

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
  searchForm: FormGroup
  p: number = 1
  itemsPerPage: number = 20
  total: number = 0
  lastItemIndex: number = 0
  isSearching: boolean = false
  @ViewChild('paging_comp') pagingComp: PagingComponent
  constructor (
    private attributeService: AttributeService,
    private toastrService: ToastrCustomService,
    public commonService: CommonService,
    private _formBuilder: FormBuilder) {
    this.initDeleteStatus()
    this.initCloseAttributeStatus()
    this.formSearch()
  }

  ngOnInit () {
    this.initAttributeList()
    this.commonService.fixTableHF('cat-table')
    fromEvent(this.searchData.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value
      }),
      filter(res => res.length > 1 || res.length === 0),
      debounceTime(1000),
      distinctUntilChanged()
      ).subscribe((text: string) => {
        this.isSearching = true
        this.searchGetCall(text).subscribe((data) => {
          console.log('search data : ', data)
          setTimeout(() => {
            this.isSearching = false
          }, 100)
          this.attributeList = data.Data
          this.total = this.attributeList[0] ? this.attributeList[0].TotalRows : 0
        },(err) => {
          setTimeout(() => {
            this.isSearching = false
          }, 100)
          console.log('error',err)
        },
        () => {
          setTimeout(() => {
            this.isSearching = false
          }, 100)
        })
      })
  }

  @ViewChild('searchData') searchData: ElementRef
  private formSearch () {
    this.searchForm = this._formBuilder.group({
      'searckKey': [UIConstant.BLANK]
    })
  }

  searchGetCall (term: string) {
    if (!term) {
      term = ''
    }
    this.pagingComp.setPage(1)
    return this.attributeService.getAttributeList('?Name=' + term + '&Page=' + this.p + '&Size=' + this.itemsPerPage).
        pipe(takeUntil(this.unSubscribe$))
  }

  /* Function to intialising attribute list to show in table */
  initAttributeList = () => {
    if (!this.searchForm.value.searckKey) {
      this.searchForm.value.searckKey = ''
    }
    this.attributeService.getAttributeList('?Name=' + this.searchForm.value.searckKey + '&Page=' + this.p + '&Size=' + this.itemsPerPage).
    pipe(takeUntil(this.unSubscribe$)).
    subscribe((Data: any) => {
      if (Data.Code === UIConstant.THOUSAND && Data.Data) {
        this.attributeList = [...Data.Data]
        this.total = this.attributeList[0] ? this.attributeList[0].TotalRows : 0
      }
    }, error => console.log(error))
  }

  /* Function to listen add attribute save */
  initCloseAttributeStatus = () => {
    this.commonService.closeAttributeStatus().
    pipe(takeUntil(this.unSubscribe$)).
    subscribe((response) => {
      if (response.status === 'saved') {
        this.initAttributeList()
      }
    }, error => console.log(error))
  }

  /* Function to emit and open add-attribute-modal  */
  addAttribute = () => {
    this.commonService.openAttribute({}, true)
  }

  // Funtion to emit and open delete confirm dialog box
  deleteAttribute = (id) => {
    this.commonService.openDelete(id, 'attribute')
  }

  //  Function to emit and open add-attribute-modal in edit mode
  editAttribute (editAttrId, attrValue, attrId) {
    const data = { 'editId': editAttrId, 'attrValue': attrValue, 'attrNameId': attrId }
    this.commonService.openAttribute(data, true)
  }

  // Function to initialising delete attribute event
  initDeleteStatus = () => {
    this.commonService.getDeleteStatus().
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
        this.commonService.closeDelete('')
        this.initAttributeList()
      }
      if (Data.Code === UIConstant.CANNOTDELETERECORD) {
        this.toastrService.showInfo('Info', 'Can not deleted !')
        this.commonService.closeDelete('')
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
