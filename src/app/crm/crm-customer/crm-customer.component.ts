import { ApiConstant } from 'src/app/shared/constants/api';
import { AddCrmCustomerComponent } from './../add-crm-customer/add-crm-customer.component';
import { CommonService } from './../../commonServices/commanmaster/common.services';
import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-crm-customer',
  templateUrl: './crm-customer.component.html',
  styleUrls: ['./crm-customer.component.css']
})
export class CrmCustomerComponent implements OnInit {
@ViewChild('addCrmCustomerContainerRef', { read: ViewContainerRef }) addCrmCustomerContainerRef: ViewContainerRef;
addCustomerRef: any;
customerList: Array<any> = []
  constructor(
    private commonService: CommonService,
    private resolver: ComponentFactoryResolver,
  ) {
  }

  ngOnInit() {
    this.getCustomerList()
  }

  getCustomerList(){
    const query = {}
    this.commonService.getRequest(ApiConstant.CRM_LEAD_CUSTOMER).subscribe((res) => {
      if(res.Code === 1000 && !this.commonService.isEmpty(res.Data) && !this.commonService.isEmpty(res.Data.GetLeadCustomerList)){
        this.customerList = [...res.Data.GetLeadCustomerList];
      }
    })
  }

  addCustomer(item?) {
    this.commonService.loadModalDynamically(this, 'addCrmCustomerContainerRef', 'addCustomerRef', AddCrmCustomerComponent,
      (res) => {
        if (res) {
          this.getCustomerList();
        }
      }, item);
  }


  mapDataToExport = () => {
    return _.map(this.customerList, (item) => {
      return {
        'Customer Name': item.CustomerName,
        'Mobile No': item.ContactNo,
        'Email': item.EmailAddress,
        'Address': `${item.Address} ${item.City} ${item.State} ${item.Country}`,
      };
    });
  }

  exportData = () => {
    const worksheet = XLSX.utils.json_to_sheet(this.mapDataToExport());
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'crm_customer');
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    const EXCEL_EXTENSION = '.xlsx';
    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}
