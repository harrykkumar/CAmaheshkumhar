import { Settings } from './../../shared/constants/settings.constant';
import { GlobalService } from './../../commonServices/global.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { ApiConstant } from 'src/app/shared/constants/api';
import * as _ from 'lodash';
@Component({
  selector: 'app-order-request-details',
  templateUrl: './order-request-details.component.html',
  styleUrls: ['./order-request-details.component.css']
})
export class OrderRequestDetailsComponent implements OnInit {
  orderId: number;
  orderParentTypeId: number;
  orderRequestDetails: Array<any> = [];
  orderRequestUpperDetails: Array<any> = [];
  orgDetails: any = {};
  totalAmount: any=0
  leadOrFollowUpDetails: any = {}
  constructor(
    private commonService: CommonService,
    private route: ActivatedRoute,
    public _settings: Settings,
    private gs: GlobalService,
  ) {
    this.route.paramMap.subscribe((parameters) => {
      this.orderId = Number(parameters.get('id'));
      this.orderParentTypeId = Number(parameters.get('parentTypeId'));
        this.getOrderRequestList()
    })
   }

  ngOnInit() {
  }

  getOrderRequestList(){
    const query = {
      Id : this.orderId ? this.orderId : 0,
      ParentTypeId: this.orderParentTypeId ? this.orderParentTypeId : 0
    }
    this.commonService.getRequest(ApiConstant.CRM_ORDER_REQUEST_DETAILS_REPORT, query).subscribe((res) => {
      if(res.Code === 1000 && !this.commonService.isEmpty(res.Data) && !this.commonService.isEmpty(res.Data.CRMOrderTrans)) {
        this.orderRequestDetails = [...res.Data.CRMOrderTrans]
        res.Data.CRMOrderTrans.forEach((item) => {
          this.totalAmount = this.totalAmount + item.SubTotalAmount
        })
        this.orderRequestUpperDetails = [...res.Data.CRMOrderInfos]
        this.orderRequestUpperDetails.forEach((item) => {
          item.BillDate = new Date(item.BillDate);
        })
        this.getFollowUpDetails(this.orderRequestUpperDetails[0].ParentId,
           this.orderRequestUpperDetails[0].ParentTypeId, this.orderRequestUpperDetails[0].EnquiryId)
        this.orgDetails['OrgName'] = res.Data.OrganizationWithSatDetails[0].ClientName
        this.orgDetails['OrgGstIn'] = res.Data.OrganizationWithSatDetails[0].GstinNo
        this.orgDetails['Email'] = res.Data.EmailsOrg[0].EmailAddress
        this.orgDetails['Mobile'] = res.Data.ContactInfoOrg[0].ContactNo
        this.orgDetails['ProfileImg'] = res.Data.ImageFiles[0].FilePath
      }
    })
  }

  getFollowUpDetails(parentId, parentTypeId, enquiryId?){
    let url = parentTypeId === 47 ? ApiConstant.CRM_LEAD : ApiConstant.LEAD_FOLLOW_UP
    const query = {
      ID: parentId,
    }
    if (parentTypeId === 49 && !this.commonService.isEmpty(enquiryId)) {
      query['EnquiryID'] = enquiryId
    }
    this.commonService.getRequest(url, query).subscribe((res) => {
      if (res.Code === 1000 && !this.commonService.isEmpty(res.Data)) {
        if (parentTypeId === 49) {
          this.assignFollowUpData(res);
        } else {
          this.assignLeadData(res);
        }
      }
    })
  }

  assignFollowUpData(res) {
    const data = { ...res.Data.FollowUpList[0] };
    this.leadOrFollowUpDetails['followUpDate'] = data.NextFollowUpDate
    this.leadOrFollowUpDetails['followUpTime'] = data.NextFollowUpTime
    if (!this.commonService.isEmpty(res.Data.FollowUpContactPerson)) {
      const currentContactPerson = _.find(res.Data.FollowUpContactPerson, { IsDefault: 1 })
      if (!_.isEmpty(currentContactPerson)) {
        this.leadOrFollowUpDetails['ContactPerson'] = currentContactPerson.Name
        this.leadOrFollowUpDetails['ContactPersonNo'] = currentContactPerson.ContactNo
      }
    }
    if (!_.isEmpty(res.Data.FollowUpCustomer)) {
      this.leadOrFollowUpDetails['CompanyName'] = res.Data.FollowUpCustomer[0].OrgName
    }
    if (!_.isEmpty(res.Data.FollowUpContactInfo)) {
      const data = { ...res.Data.FollowUpContactInfo[0] }
      this.leadOrFollowUpDetails['companyMobile'] = data.ContactNo
    }
    if (!_.isEmpty(res.Data.FollowUpEmail)) {
      const data = { ...res.Data.FollowUpEmail[0] }
      this.leadOrFollowUpDetails['companyEmail'] = data.EmailAddress
    }
  }

  assignLeadData(res) {
    const data = { ...res.Data.LeadList[0] };
    // this.leadOrFollowUpDetails['followUpDate'] = data.NextFollowUpDate
    if (!_.isEmpty(res.Data.LeadContactPerson)) {
      const currentContactPerson = _.find(res.Data.LeadContactPerson, { IsDefault: 1 })
      if (!_.isEmpty(currentContactPerson)) {
        this.leadOrFollowUpDetails['ContactPerson'] = currentContactPerson.Name
        this.leadOrFollowUpDetails['ContactPersonNo'] = currentContactPerson.ContactNo
      }
    }
    if (!_.isEmpty(res.Data.LeadContactInfo)) {
      const data = { ...res.Data.LeadContactInfo[0] }
      this.leadOrFollowUpDetails['companyMobile'] = data.ContactNo

    }
    if (!_.isEmpty(res.Data.LeadEmail)) {
      const data = { ...res.Data.LeadEmail[0] }
      this.leadOrFollowUpDetails['companyEmail'] = data.EmailAddress
    }
    if (!_.isEmpty(res.Data.LeadCustomer)) {
      const data = { ...res.Data.LeadCustomer[0] }
      this.leadOrFollowUpDetails['CompanyName'] = data.OrgName
    }
  }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('orderRequestContainerId').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Order Request Details</title>
         <style>body{font-size:.75rem;color:#000!important;overflow-x:hidden;
          font-family:Calibri,sans-serif!important;position:relative;width:21cm;height:29.7cm;margin:0 auto}
          div{display:block}.row{display:flex;flex-wrap:wrap;padding-right:5px;padding-left:5px}
          .col-md-12{flex:0 0 100%;max-width:100%}.col-md-3{flex:0 0 25%;max-width:25%}
          .col-md-3{flex:0 0 25%;max-width:25%}.col-md-4{flex:0 0 33.333333%;max-width:33.333333%}
          .col-md-6{flex:0 0 50%;max-width:50%}.col,.col-1,.col-10,.col-11,.col-12,.col-2,.col-3,.col-4,.col-5,.col-6,.col-7,.col-8,.col-9,.col-auto,.col-lg,.col-lg-1,.col-lg-10,.col-lg-11,.col-lg-12,.col-lg-2,.col-lg-3,.col-lg-4,.col-lg-5,.col-lg-6,.col-lg-7,.col-lg-8,.col-lg-9,.col-lg-auto,.col-md,.col-md-1,.col-md-10,.col-md-11,.col-md-12,.col-md-2,.col-md-3,.col-md-4,.col-md-5,.col-md-6,.col-md-7,.col-md-8,.col-md-9,.col-md-auto,.col-sm,.col-sm-1,.col-sm-10,.col-sm-11,.col-sm-12,.col-sm-2,.col-sm-3,.col-sm-4,.col-sm-5,.col-sm-6,.col-sm-7,.col-sm-8,.col-sm-9,.col-sm-auto,.col-xl,.col-xl-1,.col-xl-10,.col-xl-11,.col-xl-12,.col-xl-2,.col-xl-3,.col-xl-4,.col-xl-5,.col-xl-6,.col-xl-7,.col-xl-8,.col-xl-9,.col-xl-auto{position:relative;width:100%;min-height:1px}.justify-content-center{justify-content:center!important}.bdr_left{border-left:1px solid #000}.bdr_right{border-right:1px solid #000}.bdr_top{border-top:1px solid #000}.bdr_bottom{border-bottom:1px solid #000}.text-center{text-align:center!important}.text-right{text-align:right!important}.text-left{text-align:left!important}.p-2{padding:.5rem!important}.p-1{padding:.25rem!important}.font-weight-bold{font-weight:700!important}.name_size{font-size:22px}.amount_bs{text-align:right;padding:0 3px}.main-balance .tfoot,.main-balance .thead{font-weight:600;padding:5px 3px;font-size:.8rem;border-top:1px solid #000;border-bottom:1px solid #000}.col-3{flex:0 0 25%;max-width:25%}.col{flex-basis:0;flex-grow:1;max-width:100%}.p-0{padding:0!important}.ittelic{font-style:italic}*,::after,::before{box-sizing:border-box}.bdr_right_fix{min-height:25px;border-right:1px solid #000}.bdr_left_fix{min-height:25px;border-left:1px solid #000}.d-block{display:block}table{width:100%;border-collapse:collapse;border-spacing:0;margin-bottom:20px}thead{display:table-header-group;vertical-align:middle;border-color:inherit}table td,table th{padding:3px;text-align:left;border-bottom:1px solid #fff;word-break:break-word}table th{white-space:nowrap;font-weight:600;font-size:.8rem;border:1px solid #000;background-color:#000!important;color:#fff!important;text-align:center}tr:nth-child(even){background-color:#d9e1f2}table td{text-align:left;border:1px solid #000;font-size:.75rem;}@media print{table th{background-color:#000!important;-webkit-print-color-adjust:exact}tr:nth-child(even){background-color:#d9e1f2;-webkit-print-color-adjust:exact}}
          @media print{table th{color:#fff!important}}
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }


}
