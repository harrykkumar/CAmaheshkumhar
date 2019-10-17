import { NgModule } from '@angular/core'
import { SettingsMainComponent } from './settings-main/settings-main.component'
import { CommonModule } from '@angular/common'
import { SharedModule } from '../shared/shared.module'
import { SettingsRoutingModule } from './settings.routing.module'
import { MasterSettingComponent } from './master-setting/master-setting.component'
import { NameSearchPipe } from './search.pipe';
@NgModule({
  declarations: [
    SettingsMainComponent,
    MasterSettingComponent,
    NameSearchPipe
  ],
  imports: [
    CommonModule,
    SharedModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule {

}
