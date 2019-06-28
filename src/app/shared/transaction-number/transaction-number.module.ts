import { TransactionNumberComponent } from './transaction-number.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionNumberRoutingModule } from './transaction-number-routing.module';
import { SharedModule } from '../shared.module';

@NgModule({
  declarations: [TransactionNumberComponent],
  imports: [
    CommonModule,
    TransactionNumberRoutingModule,
    SharedModule
  ]
})
export class TransactionNumberModule { }
