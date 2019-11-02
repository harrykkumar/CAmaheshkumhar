import { LoginService } from 'src/app/commonServices/login/login.services';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { Subscription } from 'rxjs/Subscription'
import { FormGroup, FormBuilder } from '@angular/forms'
import { TaxModal } from '../../model/sales-tracker.model'
import { ToastrCustomService } from '../../commonServices/toastr.service'
import { TaxMasterService } from '../../commonServices/TransactionMaster/tax-master.services'
import { UIConstant } from '../../shared/constants/ui-constant'
import { CommonService } from 'src/app/commonServices/commanmaster/common.services'
import { filter, map, debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { fromEvent } from 'rxjs'
import { PagingComponent } from '../../shared/pagination/pagination.component'

declare const $: any
@Component({
  selector: 'app-tax-process-listing',
  templateUrl: './tax-process-listing.component.html',
  styleUrls: ['./tax-process-listing.component.css']
})
export class TaxProcessComponent implements OnInit {
  deleteSub: Subscription
  modalSub: Subscription
  taxrates: TaxModal[]
  searchForm: FormGroup
  p: number = 1
  itemsPerPage: number = 20
  total: number = 0
  lastItemIndex: number = 0
  isSearching: boolean = false
  fillingTaxRate: Array<any> = []
  taxDetail: Array<any> = []
  @ViewChild('paging_comp') pagingComp: PagingComponent
  menuData: any
  constructor (public toastrCustomService: ToastrCustomService ,private _taxMasterServices: TaxMasterService,
    private commonService: CommonService, private _formBuilder: FormBuilder,
    private _loginService: LoginService
    ) {
    this.menuData = this._loginService.getMenuDetails(5, 1);
    this.modalSub = this.commonService.getTaxAddStatus().subscribe(
      (obj) => {
        this.getTaxDetail()
      }
    )
    this.deleteSub = this.commonService.getDeleteStatus().subscribe(
      (obj) => {
        if (obj.id && obj.type && obj.type === 'tax') {
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
      this._taxMasterServices.deleteTax(id).subscribe(Data => {
        if (Data.Code === UIConstant.DELETESUCCESS) {
          this.getTaxDetail()
          this.toastrCustomService.showSuccess('Success','deleted successfully')
          this.commonService.closeDelete('')
        }
        if (Data.Code === UIConstant.CANNOTDELETERECORD) {
          this.toastrCustomService.showInfo('', Data.Description)
          this.commonService.closeDelete('')
        }
      })
    }
  }

  ngOnInit () {
    this.taxrates = []
    this.taxDetail = []
    this.getTaxDetail()
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
          // console.log('search tax : ', data)
          setTimeout(() => {
            this.isSearching = false
          }, 100)
          this.taxDetail = data.Data.TaxSlabs
          this.total = this.taxDetail[0] ? this.taxDetail[0].TotalRows : 0
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
    return this._taxMasterServices.getTaxDetail('?Name=' + term + '&Page=' + this.p + '&Size=' + this.itemsPerPage)
  }

  getTaxDetail () {
    if (!this.searchForm.value.searckKey) {
      this.searchForm.value.searckKey = ''
    }
    this._taxMasterServices.getTaxDetail('?Name=' + this.searchForm.value.searckKey + '&Page=' + this.p + '&Size=' + this.itemsPerPage).subscribe(Data => {
      console.log('tax data : ', Data)
      this.taxDetail = []
      if (Data.Code === UIConstant.THOUSAND) {
        if (Data.Data && Data.Data.TaxSlabs) {
          this.taxDetail = Data.Data.TaxSlabs
          this.total = this.taxDetail[0] ? this.taxDetail[0].TotalRows : 0
        }
      }
    })
  }

  addtax () {
    this.commonService.openTaxProcess('')
  }
  editTax (id) {
    this.commonService.openTaxProcess(id)
  }
  deletePopup (id, name) {
    this.commonService.openDelete(id, name, 'Tax')
  }

}
