import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { SettingsMainComponent } from './settings-main/settings-main.component'
import { MasterSettingComponent } from './master-setting/master-setting.component'

const childRoutes: Routes = [
  {
    path: '',
    component: SettingsMainComponent,
    data: { title: 'Masters Settings' },
    children: [
      {
        path: 'setup',
        component: MasterSettingComponent
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
export class SettingsRoutingModule {

}