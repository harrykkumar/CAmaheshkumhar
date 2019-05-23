import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { Subscription, fromEvent } from 'rxjs'
import { UIConstant } from '../../shared/constants/ui-constant'
import { ToastrCustomService } from '../../commonServices/toastr.service'
import { CommonService } from '../../commonServices/commanmaster/common.services'
import { PagingComponent } from '../../shared/pagination/pagination.component'
import { FormBuilder, FormGroup } from '@angular/forms'
import { map, filter, debounceTime, distinctUntilChanged } from 'rxjs/operators'

@Component({ 
  selector: 'app-ledger-group',
  templateUrl: './ledger-group.component.html',
  styleUrls: ['./ledger-group.component.css']
})
export class LedgerGroupComponent implements OnInit {
  subscribe: Subscription
  ledgergroup: any
  deleteSub: Subscription
  lgroupListSub: Subscription
  searchForm: FormGroup
  p: number = 1
  itemsPerPage: number = 20
  total: number = 0
  lastItemIndex: number = 0
  isSearching: boolean = false
  @ViewChild('paging_comp') pagingComp: PagingComponent
  constructor (
    private commonService: CommonService,
    private toastrService: ToastrCustomService,
    private _formBuilder: FormBuilder) {
    this.formSearch()
    this.deleteSub = this.commonService.getDeleteStatus().subscribe(
      (obj) => {
        if (obj.id && obj.type && obj.type === 'ledgerGroup') {
          this.deleteItem(obj.id)
        }
      }
    )
    this.lgroupListSub = this.commonService.getledgerGroupStatus().subscribe(
      (obj) => {
        this.getLedgerGroupDetail()
      }
    )
  }

  @ViewChild('searchData') searchData: ElementRef
  private formSearch () {
    this.searchForm = this._formBuilder.group({
      'searckKey': [UIConstant.BLANK]
    })
  }

  deleteItem (id) {
    if (id) {
      this.commonService.deleteLedgerGroup('?id='+id).subscribe(Data => {
        if (Data.Code === UIConstant.DELETESUCCESS) {
          this.toastrService.showSuccess(UIConstant.SUCCESS, UIConstant.DELETED_SUCCESSFULLY)
          this.commonService.closeDelete('')
          this.getLedgerGroupDetail()
        }
        if (Data.Code === UIConstant.CANNOTDELETERECORD) {
          this.toastrService.showInfo('', Data.Description)
          this.commonService.closeDelete('')
        }
        if (Data.Code === UIConstant.SERVERERROR) {
          this.toastrService.showError(UIConstant.ERROR, Data.Message)
          this.commonService.closeDelete('')
        }
      })
    }
  }

  ngOnInit () {
    this.commonService.fixTableHF('cat-table')
    this.getLedgerGroupDetail()
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
          this.ledgergroup = data.Data
          this.total = this.ledgergroup[0] ? this.ledgergroup[0].TotalRows : 0
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

  searchGetCall (term: string) {
    if (!term) {
      term = ''
    }
    this.pagingComp.setPage(1)
    return this.commonService.getLedgerGroupAPI('?StrSearch=' + term + '&Page=' + this.p + '&Size=' + this.itemsPerPage)
  }

  getLedgerGroupDetail () {    
    this.isSearching = true
    if (!this.searchForm.value.searckKey) {
      this.searchForm.value.searckKey = ''
    }
    this.commonService.getLedgerGroupAPI('?StrSearch=' + this.searchForm.value.searckKey + '&Page=' + this.p + '&Size=' + this.itemsPerPage).subscribe(Data => {
      if (Data.Code === UIConstant.THOUSAND) {
         this.ledgergroup = Data.Data
         this.total = this.ledgergroup[0] ? this.ledgergroup[0].TotalRows : 0
        console.log(Data.Data)
      }
    })
  
}

  addLedgerGroup () {
    this.commonService.openledgerGroup('','')
  }
  editLedgerGroup (id) {
    this.commonService.openledgerGroup(id,'')

  }
  openSearch: boolean = false
  toggleSearch () {
    this.openSearch = !this.openSearch
  }

  showDeletePopup (id) {
    this.commonService.openDelete(id, 'ledgerGroup', 'ledgerGroup')
  }
}
