import { AddLeadComponent } from './../crm/add-lead/add-lead.component';
import { CommonService } from 'src/app/commonServices/commanmaster/common.services';
import { Component, OnInit, ViewContainerRef, ViewChild, ComponentFactoryResolver } from '@angular/core';

@Component({
  selector: 'app-field-setting',
  templateUrl: './field-setting.component.html',
  styleUrls: ['./field-setting.component.css']
})
export class FieldSettingComponent implements OnInit {
  @ViewChild('addLeadContainerRef', { read: ViewContainerRef }) addLeadContainerRef: ViewContainerRef;
  addLeadRef: any;
  constructor(
    private commonService: CommonService,
    private resolver: ComponentFactoryResolver,
  ) { }

  ngOnInit() {
  }

  addLead() {
    this.commonService.loadModalDynamically(this, 'addLeadContainerRef', 'addLeadRef', AddLeadComponent,
      (res) => {
      });
  }

}
