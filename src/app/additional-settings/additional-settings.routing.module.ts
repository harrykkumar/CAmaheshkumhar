import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AddtionalSettingComponent } from './additional-master-setting/additional-master-setting.component';
import { AdditionalSettingMainComponent } from './additional-settings-main/additional-settings-main.component';

const childRoutes: Routes = [
  {
    path: '',
    component: AdditionalSettingMainComponent,
    data: { title: 'Addtional Settings' },
    children: [
      {
        path: 'setup',
        component: AddtionalSettingComponent
      }
    ]
  }
]
@NgModule({
  imports: [
    RouterModule.forChild(childRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdditionalSettingsRoutingModule {

}