import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OpeningStkRoutingModule } from './opening-stk-routing.module';
import { OpeningStkComponent } from './opening-stk.component';
import { SharedModule } from '../../shared.module';
import { OpeningStockSearchPipe } from './opening-stk.pipe';

@NgModule({
  declarations: [
    OpeningStkComponent,
    OpeningStockSearchPipe
  ],
  imports: [
    CommonModule,
    SharedModule,
    OpeningStkRoutingModule,
    SharedModule
  ]
})
export class OpeningStkModule { }
