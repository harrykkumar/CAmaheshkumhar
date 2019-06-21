import { AddCommonMenuComponent } from './add-common-menu/add-common-menu.component';
import { CommonMenuComponent } from './common-menu.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonMenuRoutingModule } from './common-menu-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [CommonMenuComponent, AddCommonMenuComponent],
  imports: [
    CommonModule,
    CommonMenuRoutingModule,
    SharedModule
  ]
})
export class CommonMenuModule { }
