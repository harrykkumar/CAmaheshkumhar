import { CommonMenuComponent } from './common-menu.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonMenuRoutingModule } from './common-menu-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [CommonMenuComponent],
  imports: [
    CommonModule,
    CommonMenuRoutingModule,
    SharedModule
  ]
})
export class CommonMenuModule { }
