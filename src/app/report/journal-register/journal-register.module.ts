import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {JournalRegisterRoutingModule} from './journal-register.routing.module'
import { JournalRegisterComponent } from './journal-register.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [JournalRegisterComponent],
  imports: [
    JournalRegisterRoutingModule,
    CommonModule,
    SharedModule
  ]
})
export class JournalRegisterModule { }
