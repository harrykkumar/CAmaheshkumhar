import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BankBookRoutingModule} from './bankbook.routing.module'
import { BankbookComponent } from './bankbook.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [BankbookComponent],
  imports: [
    BankBookRoutingModule,
    CommonModule,
    SharedModule
  ]
})
export class BankBookModule { }
