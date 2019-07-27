import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CashbookDayBalanceRoutingModule} from './cashbook-dayBalance.routing.module'
import { CashbookDayBalanceComponent } from './cashbook-dayBalance.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [CashbookDayBalanceComponent],
  imports: [
    CashbookDayBalanceRoutingModule,
    CommonModule,
    SharedModule
  ]
})
export class CashBookDayBalanceModule { }
