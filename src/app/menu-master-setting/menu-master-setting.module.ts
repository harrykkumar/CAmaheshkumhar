import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MenuMasterSettingRoutingModule } from './menu-master-setting.routing.module';
import { MenuMasterSettingComponent } from './menu-master-setting.component';

@NgModule({
  declarations: [
    MenuMasterSettingComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MenuMasterSettingRoutingModule
  ]
})
export class MenuMasterSettingModule {

}