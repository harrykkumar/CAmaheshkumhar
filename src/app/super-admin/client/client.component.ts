import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ClientService } from './client.service';
import { ToastrCustomService } from '../../commonServices/toastr.service';
import { PagingComponent } from '../../shared/pagination/pagination.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UIConstant } from '../../shared/constants/ui-constant';
import { CommonService } from '../../commonServices/commanmaster/common.services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  clientList = []
  searchForm: FormGroup
  p: number = 1
  itemsPerPage: number = 20
  total: number = 0
  lastItemIndex: number = 0
  toShowSearch: boolean = false
  @ViewChild('searchData') searchData: ElementRef
  isSearching: boolean = false
  onDestroy$: Subscription
  queryStr: string = ''
  @ViewChild('paging_comp') pagingComp: PagingComponent
  constructor(private clientService: ClientService, private toastrService: ToastrCustomService,
    private _formBuilder: FormBuilder, private commonService: CommonService) {
    this.getList()
    this.getModulesList()
    this.getIndustryList()
    this.onAdd()
    this.formSearch()
    this.getSearch()
  }

  getSearch () {
    this.onDestroy$ = this.clientService.queryStr$.subscribe(
      (str) => {
        console.log(str)
        this.queryStr = str
        this.p = 1
        this.getList()
      }
    )
  }

  private formSearch () {
    this.searchForm = this._formBuilder.group({
      'searckKey': [UIConstant.BLANK]
    })
  }

  onAdd () {
    this.clientService.onClientAdd$.subscribe(
      () => {
        this.getList()
      }
    )
  }

  getList () {
    let _self = this
    this.isSearching = true
    this.clientService.getClientList(`?Page=${this.p}&Size=${this.itemsPerPage}` + this.queryStr)
      .subscribe(data => {
        // console.log('client list : ', data)
        if (data) {
          _self.clientList = data
          this.total = _self.clientList[0] ? _self.clientList[0].TotalRows : 0
          setTimeout(() => {
            this.isSearching = false
          }, 100)
        } else {
          this.isSearching = false
        }
      }, (error) => {
        this.isSearching = false
        this.toastrService.showError(error, '')
      })
  }

  openClientModal () {
    this.clientService.onOpenClientModal()
  }
  ngOnInit() {
    this.commonService.fixTableHF('client-table')
  }

  getModulesList () {
    let _self = this
    this.clientService.getModulesList().subscribe(
      (data) => {
        console.log(data)
        this.clientService.returnSelect2List(data, 'Modules')
      },
      (error) => {
        _self.toastrService.showError(error, '')
      }
    )
  }

  getIndustryList () {
    let _self = this
    this.clientService.getIndustryList().subscribe(
      (data) => {
        console.log(data)
        this.clientService.returnSelect2List(data, 'Industries')
      },
      (error) => {
        _self.toastrService.showError(error, '')
      }
    )
  }

  ngOnDestroy() {
  }
}
