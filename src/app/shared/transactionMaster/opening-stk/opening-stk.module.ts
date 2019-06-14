import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OpeningStkRoutingModule } from './opening-stk-routing.module';
import { OpeningStkComponent } from './opening-stk.component';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [
    OpeningStkComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    OpeningStkRoutingModule
  ]
})
export class OpeningStkModule { }
