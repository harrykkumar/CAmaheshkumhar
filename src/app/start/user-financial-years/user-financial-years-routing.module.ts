import { UserFinancialYearsComponent } from './user-financial-years.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FinancialYearGuard } from './financial-year.guard';

const routes: Routes = [
  {
    path: '',
    component: UserFinancialYearsComponent,
    canActivate: [FinancialYearGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserFinancialYearsRoutingModule { }
