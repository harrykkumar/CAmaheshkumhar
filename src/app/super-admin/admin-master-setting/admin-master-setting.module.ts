import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminMasterSettingComponent } from './admin-master-setting.component';

const routes: Routes = [
  {
    path: '',
    component: AdminMasterSettingComponent,
  }
];

@NgModule({
  declarations: [
    AdminMasterSettingComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class AdminMasterSettingModule { }
