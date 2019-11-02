import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinanceRoutingModule } from './finance-routing.module';
import { FinanceComponent } from './finance.component';

@NgModule({
  declarations: [FinanceComponent],
  imports: [
    CommonModule,
    FinanceRoutingModule,
    SharedModule
  ]
})
export class FinanceModule { }
