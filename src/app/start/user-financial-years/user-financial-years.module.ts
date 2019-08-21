import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserFinancialYearsRoutingModule } from './user-financial-years-routing.module';
import { UserFinancialYearsComponent } from './user-financial-years.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [UserFinancialYearsComponent],
  imports: [
    CommonModule,
    UserFinancialYearsRoutingModule,
    SharedModule
  ]
})
export class UserFinancialYearsModule { }
