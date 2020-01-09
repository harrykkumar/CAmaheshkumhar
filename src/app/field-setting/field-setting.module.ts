import { AddLeadComponent } from './../crm/add-lead/add-lead.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldSettingRoutingModule } from './field-setting-routing.module';
import { FieldSettingComponent } from './field-setting.component';

@NgModule({
  declarations: [FieldSettingComponent],
  imports: [
    CommonModule,
    FieldSettingRoutingModule,
    SharedModule
  ],
  entryComponents: [
    AddLeadComponent
  ]
})
export class FieldSettingModule { }
