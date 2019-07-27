import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DayBookRoutingModule} from './daybook.routing.module'
import { DayBookComponent } from './daybook.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { from } from 'rxjs';

@NgModule({
  declarations: [DayBookComponent],
  imports: [
    CommonModule,
    DayBookRoutingModule,
    SharedModule
  ]
})
export class DayBookModule { }
