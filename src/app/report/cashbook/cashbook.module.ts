import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CashBookRoutingModule} from './cashbook.routing.module'
import { CashbookComponent } from './cashbook.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [CashbookComponent],
  imports: [
    CashBookRoutingModule,
    CommonModule,
    SharedModule
  ]
})
export class CashBookModule { }
