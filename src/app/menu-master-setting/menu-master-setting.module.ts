import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MenuMasterSettingRoutingModule } from './menu-master-setting.routing.module';
import { MenuMasterSettingComponent } from './menu-master-setting.component';
import { NameSearchPipe } from '../settings/search.pipe';

@NgModule({
  declarations: [
    MenuMasterSettingComponent,
    NameSearchPipe
  ],
  imports: [
    CommonModule,
    SharedModule,
    MenuMasterSettingRoutingModule
  ]
})
export class MenuMasterSettingModule {

}