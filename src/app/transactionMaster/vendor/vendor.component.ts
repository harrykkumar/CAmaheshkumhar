import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { Subscription, fromEvent } from 'rxjs'
import { Ledger } from '../../model/sales-tracker.model'
import { VendorServices } from '../../commonServices/TransactionMaster/vendoer-master.services'
import { UIConstant } from '../../shared/constants/ui-constant'
import { ToastrCustomService } from '../../commonServices/toastr.service'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
import { FormGroup, FormBuilder } from '@angular/forms'
import { map, filter, debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { PagingComponent } from '../../shared/pagination/pagination.component'
declare const $: any

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css']
})
export class VendorComponent implements OnInit {
  subscribe: Subscription
  VendorDetailShow: Ledger[]
  deleteSub: Subscription
  searchForm: FormGroup
  p: number = 1
  itemsPerPage: number = 20
  total: number = 0
  lastItemIndex: number = 0
  isSearching: boolean = false
  @ViewChild('paging_comp') pagingComp: PagingComponent
  constructor (private _vendorServices: VendorServices,
    private commonService: CommonService,
    private toastrService: ToastrCustomService,
    private _formBuilder: FormBuilder) {
    this.deleteSub = this.commonService.getDeleteStatus().subscribe(
      (obj) => {
        if (obj.id && obj.type && obj.type === 'vendor') {
          this.deleteItem(obj.id)
        }
      }
    )
    this.formSearch()
  }

  @ViewChild('searchData') searchData: ElementRef
  private formSearch () {
    this.searchForm = this._formBuilder.group({
      'searckKey': [UIConstant.BLANK]
    })
  }

  deleteItem (id) {
    if (id) {
      this._vendorServices.delteVendor(id).subscribe(Data => {
        if (Data.Code === UIConstant.DELETESUCCESS) {
          this.toastrService.showSuccess('Sucess', 'Deleted Successfully')
          this.commonService.closeDelete('')
          this.getVendorDetail()
        }
        if (Data.Code === UIConstant.CANNOTDELETERECORD) {
          this.toastrService.showInfo('Info', 'Can not deleted')
          this.commonService.closeDelete('')
        }
      })
    }
  }

  searchGetCall (term: string) {
    if (!term) {
      term = ''
    }
    this.pagingComp.setPage(1)
    return this._vendorServices.getVendor(4, '&Strsearch=' + term + '&Page=' + this.p + '&Size=' + this.itemsPerPage)
  }

  ngOnInit () {
    this.commonService.fixTableHF('cat-table')
    this.getVendorDetail()
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
          this.VendorDetailShow = data.Data
          this.total = this.VendorDetailShow[0] ? this.VendorDetailShow[0].TotalRows : 0
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
  getVendorDetail () {
    if (!this.searchForm.value.searckKey) {
      this.searchForm.value.searckKey = ''
    }
    this.subscribe = this._vendorServices.getVendor(4, '&Strsearch=' + this.searchForm.value.searckKey + '&Page=' + this.p + '&Size=' + this.itemsPerPage).subscribe(Data => {
      if (Data.Code === UIConstant.THOUSAND) {
        this.VendorDetailShow = Data.Data
        this.total = this.VendorDetailShow[0] ? this.VendorDetailShow[0].TotalRows : 0
        console.log(Data.Data)
      }
    })
  }

  addNewVendor () {
    this.commonService.openVend('', false)
  }
  editVendor (id) {
    this.commonService.openVend(id, false)

  }
  openSearch: boolean = false
  toggleSearch () {
    this.openSearch = !this.openSearch
  }

  showDeletePopup (id) {
    this.commonService.openDelete(id, 'vendor')
  }
}
