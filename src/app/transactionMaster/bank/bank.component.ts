import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { Subscription, fromEvent } from 'rxjs'
import { UIConstant } from '../../shared/constants/ui-constant'
import { ToastrCustomService } from '../../commonServices/toastr.service'
import { CommonService } from '../../commonServices/commanmaster/common.services'
import { PagingComponent } from '../../shared/pagination/pagination.component'
import { FormBuilder, FormGroup } from '@angular/forms'
import { map, filter, debounceTime, distinctUntilChanged } from 'rxjs/operators'

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent implements OnInit {
  subscribe: Subscription
  bankDetailShow: any
  deleteSub: Subscription
  bankgetListSub: Subscription
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
        if (obj.id && obj.type && obj.type === 'bank') {
          this.deleteItem(obj.id)
        }
      }
    )
    this.bankgetListSub = this.commonService.getLedgerStatus().subscribe(
      (obj) => {
        this.getbankDetail()
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
      this.commonService.deleteBankDetails(id).subscribe(Data => {
        if (Data.Code === UIConstant.DELETESUCCESS) {
          this.toastrService.showSuccess('', UIConstant.DELETED_SUCCESSFULLY)
          this.commonService.closeDelete('')
          this.getbankDetail()
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
    this.getbankDetail()
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
          this.bankDetailShow = data.Data
          this.total = this.bankDetailShow[0] ? this.bankDetailShow[0].TotalRows : 0
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
    return this.commonService.getBankList('?Name=' + term + '&Page=' + this.p + '&Size=' + this.itemsPerPage)
  }

  getbankDetail () {
    this.isSearching = true
    if (!this.searchForm.value.searckKey) {
      this.searchForm.value.searckKey = ''
    }
    this.commonService.getBankList('?Name=' + this.searchForm.value.searckKey + '&Page=' + this.p + '&Size=' + this.itemsPerPage).subscribe(Data => {
      if (Data.Code === UIConstant.THOUSAND) {
        this.bankDetailShow = Data.Data
        console.log(Data.Data)
      }
    })
  }

  addNewBank () {
    this.commonService.openLedger('')
  }
  editVendor (id) {
    this.commonService.openLedger(id)

  }
  openSearch: boolean = false
  toggleSearch () {
    this.openSearch = !this.openSearch
  }

  showDeletePopup (id) {
    this.commonService.openDelete(id, 'bank', 'Bank')
  }
}
