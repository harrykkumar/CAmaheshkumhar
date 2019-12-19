import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { MenuMasterSettingComponent } from './menu-master-setting.component';
const routes: Routes = [
  {
    path: '', component: MenuMasterSettingComponent
  }
]
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class MenuMasterSettingRoutingModule {

}