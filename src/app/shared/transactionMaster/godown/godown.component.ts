import { ToastrCustomService } from 'src/app/commonServices/toastr.service';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { AddGodownComponent } from './../add-godown/add-godown.component';
import { LoginService } from './../../../commonServices/login/login.services';
import { ApiConstant } from 'src/app/shared/constants/api';
import { BaseServices } from './../../../commonServices/base-services';
import { Component, OnInit, ChangeDetectionStrategy, ComponentFactoryResolver, ViewChild, ViewContainerRef, ElementRef } from '@angular/core';
import * as _ from 'lodash'
import { NgxSpinnerService } from 'ngx-spinner';
import { UIConstant } from '../../constants/ui-constant';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
@Component({
  selector: 'app-godown',
  templateUrl: './godown.component.html',
  styleUrls: ['./godown.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class GodownComponent implements OnInit {
  @ViewChild('addGodownContainerRef', { read: ViewContainerRef }) addGodownContainerRef: ViewContainerRef;
  godownList: Array<any> = []
  addGodownRef: any;
  p: number = 1
  itemsPerPage: number = 20
  total: number = 0
  lastItemIndex: number = 0
  menuData: any;
  searchForm: any;
  deleteSub: Subscription

  constructor(
    private baseService: BaseServices,
    private spinner: NgxSpinnerService,
    private _loginService : LoginService,
    private resolver: ComponentFactoryResolver,
    private _formBuilder: FormBuilder,
    private commonService: CommonService,
    private toastrService: ToastrCustomService
  ) {
    this.menuData = this._loginService.getMenuDetails(104, 1);
    this.formSearch()
    this.deleteSub = this.commonService.getDeleteStatus().subscribe(
      (obj) => {
        if (obj.id && obj.type && obj.type === 'godown') {
          this.deleteItem(obj.id)
        }
      }
    )
  }

  deleteItem (id) {
    if (id) {
      this.baseService.deleteRequest(`${ApiConstant.GODOWN_MASTER}?Id=${id}`).subscribe(Data => {
        if (Data.Code === UIConstant.DELETESUCCESS) {
          this.toastrService.showSuccess('Success', 'Deleted Successfully')
          this.commonService.closeDelete('')
          this.getGodownList()
        }
        if (Data.Code === UIConstant.CANNOTDELETERECORD) {
          this.toastrService.showInfo('', Data.Description)
          this.commonService.closeDelete('')
          this.getGodownList()
        }
        if (Data.Code === UIConstant.SERVERERROR) {
          this.toastrService.showError('', Data.Description)
        }
      })
    }
  }

  openDeleteConfirmationPopup(itemId) {
    this.commonService.openDelete(itemId, 'godown', 'Godown')
  }

  @ViewChild('searchData') searchData: ElementRef
  private formSearch () {
    this.searchForm = this._formBuilder.group({
      'searckKey': [UIConstant.BLANK]
    })
  }

  ngOnInit() {
    this.commonService.fixTableHF('cat-table')
    this.getGodownList()
  }

  getGodownList(){
    if (!this.searchForm.value.searckKey) {
      this.searchForm.value.searckKey = ''
      this.spinner.show();
    }
    this.baseService.getRequest(`${ApiConstant.GODOWN_MASTER}?Name=${this.searchForm.value.searckKey}`).subscribe((res) => {
      if ((res.Code === 1000) && !_.isEmpty(res.Data)) {
        this.godownList = [...res.Data];
        this.total = res.Data[0].TotalRows
      } else {
        this.godownList = []
      }
      this.spinner.hide();
    })
  }

  addGoDown(item?) {
    this.addGodownContainerRef.clear();
    const factory = this.resolver.resolveComponentFactory(AddGodownComponent);
    this.addGodownRef = this.addGodownContainerRef.createComponent(factory);
    this.addGodownRef.instance.openModal(item);
    this.addGodownRef.instance.closeModal.subscribe(
      (data) => {
        this.addGodownRef.destroy();
        if (data) {
          this.getGodownList();
        }
      });
  }

}
