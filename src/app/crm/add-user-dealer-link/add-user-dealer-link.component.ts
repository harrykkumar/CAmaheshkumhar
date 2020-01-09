import { Router } from '@angular/router';
import { ToastrCustomService } from 'src/app/commonServices/toastr.service';
import { ApiConstant } from 'src/app/shared/constants/api';
import { BaseServices } from 'src/app/commonServices/base-services';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import * as _ from 'lodash';
@Component({
  selector: 'app-add-user-dealer-link',
  templateUrl: './add-user-dealer-link.component.html',
  styleUrls: ['./add-user-dealer-link.component.css']
})
export class AddUserDealerLinkComponent implements OnInit, AfterViewInit {
@Output() closeModal = new EventEmitter();
userData: Array<any> = []
userId: number
dealerTypeData: Array<any> = []
dealerTypeId: number
dealerData: Array<any> = []
dealerIds: Array<any> = []
  constructor(
    private commonService: CommonService,
    private baseService: BaseServices,
    private toaster: ToastrCustomService,
    private router: Router
  ) {
    this.getFormUtility()
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    if (_.includes(this.router.url, 'user-dealer')) {
      this.openModal()
    }
  }

  openModal(item?) {
    this.commonService.openModal('dealerLink');
    setTimeout(() => {
      $('#userElementId').focus()
    }, 300);
  }

  closePopUp(){
    this.commonService.closeModal('dealerLink')
    if (_.includes(this.router.url, 'user-dealer')) {
      this.commonService.navigateToPreviousUrl()
    } else {
      this.closeModal.emit();
    }
  }


  getFormUtility() {
    this.getDealerTypeList()
    this.getUserList()
    this.getDealerList()
  }

  getDealerTypeList(){
    this.commonService.getRequest(`${ApiConstant.COUNTRY_LIST_URL}204`).subscribe((res) => {
      if (res.Code === 1000 && !this.commonService.isEmpty(res.Data)) {
        this.dealerTypeData = [...res.Data]
      }
    })
  }

  getUserList(){
    this.commonService.getRequest(ApiConstant.USER_LIST).subscribe((res) => {
      if (res.Code === 1000 && !this.commonService.isEmpty(res.Data)) {
        this.userData = [...res.Data]
      }
    })
  }

  getDealerList(){
    this.commonService.getRequest(ApiConstant.DEALER_REGISTRATION).subscribe((res) => {
      if (res.Code === 1000 && !this.commonService.isEmpty(res.Data)) {
        this.dealerData = [...res.Data]
      }
    })
  }

  focusOnMandatoryField() {
    let focusFieldArray = [
      {
        elementId: 'userElementId',
        elementModal: 'userId',
        type: 'ng-select'
      },
      {
        elementId: 'dealerTypeElementId',
        elementModal: 'dealerTypeId',
        type: 'ng-select'
      }
    ]

    if (this.dealerTypeId && this.dealerTypeId !== 1) {
      focusFieldArray.push({
        elementId: 'dealerElementId',
        elementModal: 'dealerIds',
        type: 'ng-select'
      })
    }
    return this.focusLoop(focusFieldArray)
  }

  focusLoop(focusFieldArray){
    for (let i = 0; i < focusFieldArray.length; i++) {
      if (this.commonService.isEmpty(this[focusFieldArray[i].elementModal])) {
        if (focusFieldArray[i].type === 'input') {
          $(`#${focusFieldArray[i].elementId}`).focus()
        } else if (focusFieldArray[i].type === 'ng-select') {
          $(`#${focusFieldArray[i].elementId} input`).focus()
        }
        break;
      }
    }
    return true;
  }

  submit() {
    const data = {
      "Id": this.userId,
      "DealerType": this.dealerTypeId,
      "Dealers": (this.dealerTypeId && this.dealerTypeId !== 1) ? this.dealerIds.toString() : []
    }
    this.baseService.postRequest(ApiConstant.DEALER_USER_LINK, data).subscribe((res) => {
      if (res.Code === 1000) {
        this.toaster.showSuccess('Saved Success', '')
        this.closePopUp()
      } else {
        this.toaster.showError(res.Message, '')
      }
    })
  }

}
