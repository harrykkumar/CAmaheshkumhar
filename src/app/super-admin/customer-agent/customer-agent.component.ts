import { AddCustomerAgentComponent } from './../add-customer-agent/add-customer-agent.component';
import { ToastrCustomService } from 'src/app/commonServices/toastr.service';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, ElementRef } from '@angular/core';
import { ApiConstant } from 'src/app/shared/constants/api';
import * as _ from 'lodash'
import { BaseServices } from 'src/app/commonServices/base-services';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from 'src/app/commonServices/login/login.services';
import { FormBuilder } from '@angular/forms';
import { UIConstant } from 'src/app/shared/constants/ui-constant';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-customer-agent',
  templateUrl: './customer-agent.component.html',
  styleUrls: ['./customer-agent.component.css']
})
export class CustomerAgentComponent implements OnInit {
  @ViewChild('addCustomerAgentContainerRef', { read: ViewContainerRef }) addCustomerAgentContainerRef: ViewContainerRef;
  customerAgentList: Array<any> = []
  addCustomerAgentRef: any;
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
    this.menuData = this._loginService.getMenuDetails(105, 1);
    this.formSearch()
    this.deleteSub = this.commonService.getDeleteStatus().subscribe(
      (obj) => {
        if (obj.id && obj.type && obj.type === 'customerAgent') {
          this.deleteItem(obj.id)
        }
      }
    )
  }

  @ViewChild('searchData') searchData: ElementRef
  private formSearch () {
    this.searchForm = this._formBuilder.group({
      'searckKey': [UIConstant.BLANK]
    })
  }

  ngOnInit() {
    this.getCustomerAgentList()
  }

  deleteItem (id) {
    if (id) {
      this.baseService.deleteRequest(`${ApiConstant.CUSTOMER_AGENT}?Id=${id}`).subscribe(Data => {
        if (Data.Code === UIConstant.DELETESUCCESS) {
          this.toastrService.showSuccess('Success', 'Deleted Successfully')
          this.commonService.closeDelete('')
          this.getCustomerAgentList()
        }
        if (Data.Code === UIConstant.CANNOTDELETERECORD) {
          this.toastrService.showInfo('', Data.Description)
          this.commonService.closeDelete('')
          this.getCustomerAgentList()
        }
        if (Data.Code === UIConstant.SERVERERROR) {
          this.toastrService.showError('', Data.Description)
        }
      })
    }
  }

  openDeleteConfirmationPopup(itemId) {
    this.commonService.openDelete(itemId, 'customerAgent', 'Customer Agent')
  }

  getCustomerAgentList(){
    if (!this.searchForm.value.searckKey) {
      this.searchForm.value.searckKey = ''
      this.spinner.show();
    }
    this.baseService.getRequest(`${ApiConstant.CUSTOMER_AGENT}?Name=${this.searchForm.value.searckKey}`).subscribe((res) => {
      if ((res.Code === 1000) && !_.isEmpty(res.Data)) {
        this.customerAgentList = [...res.Data];
        this.total = res.Data[0].TotalRows
      } else {
        this.customerAgentList = []
      }
      this.spinner.hide();
    })
  }

  addCustomerAgent(item?) {
    this.addCustomerAgentContainerRef.clear();
    const factory = this.resolver.resolveComponentFactory(AddCustomerAgentComponent);
    this.addCustomerAgentRef = this.addCustomerAgentContainerRef.createComponent(factory);
    this.addCustomerAgentRef.instance.openModal(item);
    this.addCustomerAgentRef.instance.closeModal.subscribe(
      (data) => {
        this.addCustomerAgentRef.destroy();
        if (data) {
          const id = localStorage.getItem(UIConstant.WORK_DOMAIN_ID)
          if (id && (Number(id) === Number(item.Id))) {
            this.commonService.getLogoAndDomain();
          }
          this.getCustomerAgentList();
        }
      });
  }

}
