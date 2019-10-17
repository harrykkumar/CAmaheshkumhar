import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SharedModule } from '../shared/shared.module'
import { AdditionalSettingsRoutingModule } from './additional-settings.routing.module';
import { AddtionalSettingComponent } from './additional-master-setting/additional-master-setting.component';
import { AdditionalSettingMainComponent } from './additional-settings-main/additional-settings-main.component';
import { NameSearchPipe } from './search.pipe';
@NgModule({
  declarations: [
    AdditionalSettingMainComponent,
    AddtionalSettingComponent,
    NameSearchPipe
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdditionalSettingsRoutingModule
  ]
})
export class AdditionalSettingsModule {

}
