import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DuesOverduesOutstandingComponent } from './dues-overdues-outstanding.component';

const routes: Routes = [
  {
    path: '',
    component: DuesOverduesOutstandingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DuesOverduesOutstandingRoutingModule { }
