import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StyleRoutingModule } from './style-routing.module';
import { StyleListComponent } from '../../Manufacturer/style/style-list/style-list.component';
import { AddStyleComponent } from '../../Manufacturer/style/add-style/add-style.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [StyleListComponent, AddStyleComponent],
  imports: [
    CommonModule,
    StyleRoutingModule,
    SharedModule
  ]
})
export class StyleModule { }
